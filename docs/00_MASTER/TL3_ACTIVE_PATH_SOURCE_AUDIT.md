# TL3 Active Creation and Playback Path — Source Audit

**Date:** 2026-10-14  
**Status:** Read-only source audit on design branch snapshot. No runtime or deployed-service verification.

## 1. Source revisions inspected

| Repository | File | Blob SHA |
|---|---|---|
| Frontend | public/creator.html | 34ce35b1176e33c165abe025ff498eb670b3fe5e |
| Frontend | public/tl3.js | 8084cac364897994ae4783da4eafbcaa564e96e0 |
| Backend | src/index.ts | 7710bd86e3de68dd1be314fdb1507a08d1258ac4 |
| Backend | src/routes/playback.ts | 5eae88a9b9073612efbcf2547c6a89a214cc11a3 |
| Backend | src/routes/shareplace.ts | 2e6acdedd9fd3cdc5f33942fd44129565dfcbc8d |

These are repository source snapshots, not proof of deployed versions.

## 2. Creator registration — exact observed sequence

In public/creator.html, the inspected call sequence is:

1. GET http://127.0.0.1:8787/health
2. POST http://127.0.0.1:8787/upload?kind=mp3&name=... with the MP3 Blob
3. POST /api/shares with Authorization: Bearer token and SharePlace metadata
4. POST /api/files/sync with JSON metadata; the inspected request does not include an Authorization header
5. POST /api/v1/tl3/releases with Authorization: Bearer token and file_id/share_id
6. POST /api/v1/assets and conditionally POST /api/v1/assets/:asset_id/certify

Relevant source line ranges in the inspected blob: Local Agent check ~965–967; upload ~1003–1010; SharePlace ~1038–1045; file sync ~1054–1066; TL3 release ~1065–1080; certificate follow-up ~1102–1122.

### Ownership risk

The inspected backend src/index.ts handler for POST /api/files/sync reads the request body and initializes userId to 1. The creator page's matching request does not send Authorization. This is a critical ownership risk. The new UI must not copy this pattern or use a user-supplied email/user ID as a substitute for authenticated ownership.

A separate backend fix must derive ownership from a verified principal, preserve existing file/share references, define reconciliation for previously created rows, reject mismatched owners and be tested with two separate accounts.

### Non-atomic registration

These are separate requests and side effects. A later failure may leave a SharePlace row, file row or Local Agent object without a completed protected release. A retry must reconcile existing IDs and must not blindly repeat all stages.

### Certificate is a separate artifact

The creator page subsequently calls /api/v1/assets and /api/v1/assets/:asset_id/certify. The inspected UI branch mentions a 5,000 TL certification step. This is not proof of a generic TLJ image workflow. Keep the asset, rights certificate and generated certificate image/file as separate linked objects.

## 3. Online TL3 playback — active player calls observed

The inspected public/tl3.js calls:

1. GET /api/v1/tl3/header/:id
2. GET /api/v1/tl3/segment/:id?segment=n&session_id=...
3. GET /api/v1/tl3/code/:id?segment=n&session_id=...
4. Client validates the spine/integrity chain and decrypts the segment.
5. POST /api/v1/tl3/segment/confirm/:id with session_id and played_seconds after the segment interval.
6. Continues with the next segment.

The same request pattern appears in more than one online playback implementation inside tl3.js. Do not remove duplicate implementations or diagnostic logging until the active exported player call chain is established.

### License reservation in backend src/index.ts

The inspected GET /api/v1/tl3/code/:id handler:
- verifies the bearer token and active user;
- resolves file ID or SharePlace ID;
- checks released TL3 state and segment index;
- creates/loads a stream session and enforces sequence/prebuffer rules;
- calculates cost from segment duration_ms / 1000;
- debits users.tl_balance before returning license bytes;
- records pending segment, cost and delivery time in tl3_stream_sessions;
- returns lic_n, cost and remaining_tl.

Therefore, this is not merely a client request for a key. The license request participates in TL reservation/debit.

### Confirmation and settlement

The inspected POST /api/v1/tl3/segment/confirm/:id handler:
- verifies the user and released file;
- loads the pending segment for the session;
- bounds reported playback by segment duration and elapsed wall time;
- refunds the unused reservation;
- clears pending segment state;
- credits creator revenue at 70% of confirmed played seconds in this inspected source;
- writes a creator transaction and play event;
- returns reserved, played, refund, settled, creator revenue and remaining balance.

The 70% value and accounting semantics must not be changed in UI work. Confirm deployed behavior and owner-approved policy before relying on them.

### Open accounting/reliability questions

- Is a repeated confirm safely rejected in all retry/failure cases?
- What if refund commits but creator credit or play-event insertion fails?
- Are the multiple database writes atomic or recoverable?
- Can concurrent requests race on the same stream session?
- What happens after timeout between debit and receipt of lic_n?
- How are abandoned pending segments reconciled after browser closure?
- Are repeated license requests for the same segment safe?
- Which legacy pages still call /api/shares/:id/consume?

These require disposable-account tests. Do not test retries against real member TL balances.

## 4. Separate playback routes — do not conflate them

The backend also contains POST /api/v1/playback/tl3/consume in src/routes/playback.ts. It accepts file_id, session_id and seconds, directly debits users.tl_balance, credits the creator at 70% in the inspected handler, and writes session/play-event rows.

The inspected public/tl3.js online player snippets use /api/v1/tl3/code/:id and /api/v1/tl3/segment/confirm/:id. They do not show a call to /api/v1/playback/tl3/consume. The active caller of this separate route is not established by this audit.

The backend also contains legacy per-share routes:
- GET /api/shares/:id/my-tl
- POST /api/shares/:id/charge
- POST /api/shares/:id/consume

These are distinct from the TL3 v3 segment reservation/confirmation flow. Trace callers in shareplace.html, track.html, tl3.js and offline playback before connecting any new paid UI. Never add a second charge/consume call on top of the active segment path.

## 5. POC behavior observed

The inspected src/routes/shareplace.ts contains upload POC logging:
- free_mp3: mode upload_mp3, POC gain 1;
- non-free/TL3: mode upload_tl3, POC gain 3.

This is source-level behavior only. Preserve the owner's approved POC policy and ensure retries do not duplicate contribution events. POC must not be displayed as spendable currency.

## 6. Revised flow diagrams

### TL3 creation

Local Agent source upload  
→ SharePlace metadata (/api/shares)  
→ file metadata sync (/api/files/sync)  
→ protected TL3 release (/api/v1/tl3/releases)  
→ optional rights/certificate asset flow  
→ SharePlace / My Assets

### TL3 online playback observed in player source

Header  
→ encrypted segment  
→ license code request + TL reservation/debit  
→ client integrity validation + decrypt + playback  
→ confirm actual played duration  
→ unused reservation refund  
→ creator settlement + play event

### Separate paths not to combine without caller verification

- /api/v1/playback/tl3/consume
- /api/shares/:id/charge and /api/shares/:id/consume
- TL3 offline start/lic/settle

## 7. Required regression tests

### Creation
- Local Agent unavailable; upload interrupted.
- Upload succeeds but SharePlace registration fails.
- SharePlace succeeds but file sync fails.
- File sync succeeds but TL3 release fails.
- Release succeeds but certificate follow-up fails.
- Retry each stage without duplicate source objects, SharePlace rows, file rows, releases, POC logs or certificates.
- Verify two accounts cannot attach or register each other's files by manipulating request-body identity fields.

### Online playback
- One complete segment with known starting balance.
- Partial playback and unused reservation refund.
- Full playback and creator settlement.
- Close browser before confirm.
- Network timeout after license request.
- Duplicate confirm and repeated segment request.
- Concurrent segment requests.
- Reconcile consumer debit, creator credit, transaction and play-event rows.

### Route separation
- Identify any active caller of /api/v1/playback/tl3/consume.
- Identify pages using legacy /api/shares/:id/charge or /consume.
- Verify offline playback has its own start/lic/settle lifecycle and is not charged twice.

## 8. Conclusion and preservation boundary

The existing TL3 implementation is more substantial than a generic upload-and-play flow. It includes Local Agent source storage, SharePlace metadata, file synchronization, protected release, segment-based licensing, client integrity/decryption, reservation/refund and creator settlement.

The safe renewal sequence is to preserve these flows, verify/fix authenticated ownership and stage recovery, trace every player entry point, test reservation/confirmation accounting, and only then attach the new presentation layer.

This is a documentation-only audit. It does not authorize code changes, migrations, accounting changes, merges or deployment.
