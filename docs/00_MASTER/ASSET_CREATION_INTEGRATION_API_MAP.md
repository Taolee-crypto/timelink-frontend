# TimeLink Asset Creation Integration & API Contract Map

**Date:** 2026-10-14  
**Status:** Design/integration audit — documentation branch only  
**Branch:** `docs/master-architecture-audit-20261014`  
**Depends on:** `ASSET_CREATION_AND_RELEASE_SPEC.md`, `ROUTE_WORKFLOW_API_DEPENDENCY_MAP.md`, `FRONTEND_IMPLEMENTATION_MAP.md`, `MVP_END_TO_END_READINESS.md`  
**Evidence boundary:** Existing source-level findings summarized from the current audit. No live API call, browser end-to-end test, real TL transaction, or deployed Worker comparison was performed in this document.

## 1. Executive finding

TimeLink already has a meaningful creator-to-SharePlace-to-playback foundation, particularly for TL3. The renewed asset wizard should not replace it with a speculative new API. It should be an orchestration/presentation layer that calls verified existing services through a compatibility adapter.

However, the current registration flow is a sequence of separate operations, not one atomic transaction. The source audit identifies important ownership, duplicate/retry and accounting questions. These must be resolved before a new UI can safely claim an asset has been registered, protected or published.

The four-family UI can be designed now. Production integration must be gated by API/runtime verification, especially for TL4, TLD and TLJ.

## 2. Existing TL3 creation path — source-level sequence

The current `public/creator.html` flow is reported in the source audit as:

```text
Member signs in
   |
   v
Read cached tl_user + tl_token
   |
   v
GET /api/eco/wallet
   |
   v
Select MP3 + read ID3 metadata
   |
   v
Local Agent: POST /upload?kind=mp3
   |
   v
POST /api/shares
   |
   v
POST /api/files/sync
   |
   v
POST /api/v1/tl3/releases
   |
   v
Existing certification / asset follow-up actions
   |
   v
SharePlace / track / TL3 player
```

This is a source-level map, not a guarantee that every stage currently succeeds in the deployed environment. Exact response fields, IDs, error handling and call ordering must be rechecked in the current source and live test environment before implementation.

### 2.1 Important consequence

These are separate requests and side effects. A failure after `POST /api/shares` but before TL3 release may leave:
- a SharePlace metadata row without a completed protected release;
- a synced file row without a completed release;
- a stored Local Agent object that has not been attached to the final asset;
- a retry that risks duplicate records if the client simply repeats every request.

The renewed UI must model a staged registration job. It must not display a single generic “upload complete” state based only on the first successful request.

## 3. Endpoint dependency matrix

| Stage | Existing source-level route / mechanism | Purpose | Evidence and integration rule |
|---|---|---|---|
| Sign in | `POST /api/auth/login` | Obtain session token and user | Static login and versioned auth routes coexist. Confirm actual active page and contract. Preserve `tl_token` / `tl_user` until migration is separately approved. |
| Current account | `GET /api/v1/auth/me` | Verify authenticated principal | Use server identity for ownership. Do not trust cached browser user data as authorization. |
| Wallet summary | `GET /api/eco/wallet` | Read current TL/economy values | Source route exists; verify returned fields and avoid combining incompatible legacy balances. |
| Local source upload | Local Agent `POST /upload?kind=mp3` (current TL3 flow) | Store original source on creator-owned PC | Requires Local Agent and tunnel/session health. Verify current origin, auth/token, returned object URL/ID, file integrity and offline behavior. |
| SharePlace metadata | `POST /api/shares` | Create discoverable share record | Existing source path. Determine when to create record relative to protected release and how incomplete rows are reconciled. |
| File sync | `POST /api/files/sync` | Register/synchronize source file metadata | Critical ownership risk described below. Must not be treated as safe until authenticated ownership is fixed and verified. |
| TL3 protected release | `POST /api/v1/tl3/releases` | Create TL3 release/container workflow | Existing source path. Verify prerequisites, source URL ownership, container version, returned release ID and retry semantics. |
| SharePlace listing | `GET /api/shares` (fallback `GET /api/v1/shareplace`) | Discover/list assets | Current list combines legacy and newer records. Use explicit family metadata for new records; compatibility adapter for old rows. |
| Legacy file balance | `GET /api/shares/:id/my-tl` | Read per-share TL balance | Legacy accounting model; do not assume it is the current TL3 v3 account balance. |
| Legacy charge | `POST /api/shares/:id/charge` | Charge per-share balance | Possible interaction with legacy consume double debit. Do not connect new paid UI until tested. |
| Legacy consume | `POST /api/shares/:id/consume` | Consume per-share balance | High-priority accounting verification; determine actual active caller. |
| TL3 v3 consume | `POST /api/v1/playback/tl3/consume` | Account-balance TL3 playback debit and creator credit | Separate route exists. Verify player caller, session idempotency and ledger atomicity. |
| TLC mining | `POST /api/eco/mine-tlc` | Execute mining/claim operation | Backend implementation exists; owner confirms a mining test works. Preserve this path. Trace the working UI caller rather than replacing it. |

This matrix is not a complete API specification. Do not invent request bodies or response properties from endpoint names. The next source task is to extract exact request/response contracts from each route and caller.

## 4. Critical integration risks to address first

### P0-A. File sync ownership must be authenticated

The inspected `POST /api/files/sync` handler was reported to:
- not verify an Authorization token in that handler;
- accept `user_email` from the request body to select a user;
- initialize `userId` to 1;
- potentially create a placeholder user when an email/username is supplied.

This is a source-confirmed design risk in the current audit. The new UI must not work around it by sending a different email or user ID. The safe target is that the backend derives the owner from a verified authenticated principal, with a compatibility-safe migration and regression tests. This is a separate backend change, not a visual wizard change.

### P0-B. Two playback accounting models coexist

The audit identifies:
1. Legacy `/api/shares/:id/charge` plus `/api/shares/:id/consume`.
2. TL3 v3 `/api/v1/playback/tl3/consume`.

The legacy route may debit the wallet when charging a per-file balance and then debit the wallet again during consumption. The v3 route has a separate account-balance model and a source-level 70% creator credit. The exact active player caller and ledger semantics must be verified.

Do not:
- connect new paid controls to both models;
- change settlement percentage or balance columns as part of UI work;
- run tests against real member balances;
- assume a repeated session request is idempotent.

Required test: disposable test users, known starting balances, fixed playback duration, replayed request, simulated failure between writes, and reconciliation of consumer debit, creator credit, platform share, session and event ledger.

### P0-C. TL3 consume session idempotency and atomicity

The inspected v3 handler accepts `file_id`, `session_id` and `seconds`. The audit notes that the shown path may not use prior session consumption to prevent duplicate seconds. Verify:
- same session ID + same interval replay;
- same session ID + overlapping interval;
- network timeout after server commit;
- concurrent consume requests;
- partial failure between debit, creator credit and event/session writes.

No new player should retry an ambiguous consume request until the server has a safe idempotency contract.

### P1-A. Family identity is not reliable in legacy classification

Current helpers include MIME/extension detection but another `contentKind` helper classifies only MP3/TL3 and groups other encrypted extensions with TL3. Backend SharePlace records in the inspected paths set `content_kind` to `mp3` or `tl3`.

Target contract:
- explicit `asset_family` for new canonical assets;
- legacy adapter for old `content_kind` and extension values;
- no silent bulk reclassification;
- ambiguous legacy rows retain a “needs verification” state rather than being guessed.

### P1-B. Creator registration is multi-stage

Implement stage-aware progress and a reconciliation operation. A retry must reuse a stable registration identity and must not duplicate SharePlace records, file rows, protected releases or storage objects.

### P1-C. TLC mining UI and working path must be distinguished

The source audit found `POST /api/eco/mine-tlc` and the owner confirms mining works in a test path. It also found at least one wallet-page button whose handler appears presentation-only. Trace the exact working mining screen and caller; do not infer the mining engine is missing, and do not replace the proven test path.

## 5. Target orchestration model for the renewed wizard

The renewed UI should call a small client-side workflow adapter. The adapter should not own business rules; it translates UI intent to existing verified APIs and presents their results.

```text
New Asset Wizard
  |
  v
Registration Adapter
  |
  +--> Auth / current member verification
  |
  +--> Capability check (family + release modes + provider)
  |
  +--> Source upload provider
  |      +--> Local Agent
  |      +--> Google Drive
  |      +--> OneDrive
  |      +--> verified backend storage, if available
  |
  +--> Server-side validation + metadata registration
  |
  +--> Protected release / container service
  |
  +--> SharePlace publication
  |
  +--> My Assets status
  |
  +--> Existing TL / EARN / CONSUME / POC / TLC services
```

### 5.1 Required adapter responsibilities

- Read the authenticated token through the established auth mechanism.
- Ask the server for the current member; do not derive owner identity from editable form fields.
- Discover or receive supported family and release capabilities.
- Preserve original file name and file bytes.
- Track each server-generated job, file, share and release identifier.
- Map legacy response shapes to a stable UI view model.
- Distinguish retryable from terminal errors based on server response.
- Reconcile partially completed stages before retry.
- Never calculate authoritative wallet, earnings, POC or TLC values in the browser.
- Never expose encryption keys or privileged storage credentials to the client.

### 5.2 Proposed UI-facing job view model

This is a frontend presentation model, not a proposed database migration:

| Field | Meaning |
|---|---|
| `jobId` | Stable registration operation identity |
| `assetFamily` | Canonical `tl3/tl4/tld/tlj` for the current UI |
| `stage` | Current operation stage |
| `sourceFileName` | User-visible original filename |
| `sourceBytes` | Source file size |
| `storageProvider` | Confirmed provider identity |
| `fileId` | Existing or returned backend file identity, if any |
| `shareId` | SharePlace identity, if created |
| `releaseId` | Protected release identity, if created |
| `assetStatus` | Server-confirmed lifecycle state |
| `retryAllowed` | Server-derived retry permission |
| `errorCode` | Stable error code where provided |
| `supportReference` | Trace/support identifier |

Do not persist this view model as a new server schema without separate approval.

## 6. Family-by-family integration readiness

| Family | Existing evidence | What the renewed wizard may do now | What must be verified/built before live release |
|---|---|---|---|
| TL3 | Existing creator upload, SharePlace metadata, file sync, TL3 release and player/consume code | Design the complete flow; connect only after the active call chain and accounting are verified | Authenticated ownership, stage reconciliation, container compatibility, active player route, idempotent billing and settlement |
| TL4 | Generic video MIME/extension and `.tl4` naming paths | Collect proposed metadata and show a non-live preview concept | Full server registration, protected container, video viewer/streaming, access authorization, metering, settlement |
| TLD | PDF/score attachment and generic PDF handling; legacy `.tlf` mapping | Collect document metadata and show a non-live document preview concept | Generic TLD asset registration, document viewer, page/session policy, container naming compatibility, metering and settlement |
| TLJ | Image MIME handling and separate rights-certificate `.tlj` export/viewer; legacy `.tlg` mapping | Collect image metadata and show a non-live image preview concept | Generic image asset registration/viewer, rights relationship model, privacy/EXIF policy, container naming compatibility, access and settlement |

“May do now” means prototype/UI work only; it does not mean the production backend is ready.

## 7. Storage-provider integration checklist

### Local Agent
- Verify `/health` and current tunnel identity before upload.
- Confirm upload endpoint, authorization/token, allowed origin and returned object reference.
- Verify file size and checksum after transfer.
- Handle PC sleep, agent shutdown, tunnel URL rotation and network interruption.
- Confirm source retention and deletion/replacement behavior.
- Never hardcode `127.0.0.1` into a remote playback URL; distinguish browser-local agent calls from server-reachable source URLs.

### Google Drive / OneDrive
- Verify connection state and required scopes server-side.
- Use provider object IDs, not display names or user-editable paths, as stable references.
- Verify uploaded object accessibility to the authorized backend process.
- Handle revoked permissions, expired credentials, deleted/moved objects and quota errors.
- Keep credentials/tokens server-side; never embed refresh tokens in the browser.

### R2 or other backend storage
- Do not make Cloudflare R2 a required dependency while the owner's account/billing situation leaves it unavailable.
- If any existing backend storage path is available, verify it separately rather than assuming R2 or D1 is a file blob store.
- UI must only list providers returned as usable for that user and operation.

## 8. SharePlace publication and My Assets rules

1. A SharePlace record is not proof that a protected release is ready.
2. An uploaded source object is not proof that SharePlace publication succeeded.
3. A protected release is not necessarily public; visibility/access policy is a separate decision.
4. Publish only after server confirmation of the required family-specific stages.
5. New records should carry explicit family identity.
6. Legacy rows must remain readable through a compatibility adapter.
7. Registration retries must not create duplicate cards.
8. Existing likes, follows, playlists, shares and playback history must remain associated with their original record IDs.
9. My Assets must show actual server lifecycle and provider status; no frontend-invented “complete” state.
10. If the registration is incomplete, provide a recovery view with completed stages and the next safe action.

## 9. API contract extraction plan

Before connecting the prototype, create an endpoint contract sheet for every route used by the chosen canonical flow. For each route record:
- source file and handler function;
- HTTP method/path;
- auth middleware and required scopes;
- exact request schema and validation;
- exact success response schema;
- exact error responses;
- D1 reads/writes;
- storage side effects;
- TL/creator-ledger/POC/TLC side effects;
- idempotency behavior;
- active frontend caller(s);
- deployed Worker version tested.

The first extraction batch should include:
1. `POST /api/auth/login` and `GET /api/v1/auth/me`;
2. `GET /api/eco/wallet`;
3. Local Agent `/health` and `/upload`;
4. `POST /api/shares` and `GET /api/shares`;
5. `POST /api/files/sync`;
6. `POST /api/v1/tl3/releases`;
7. the actual TL3 player consume endpoint;
8. `POST /api/eco/mine-tlc` and the confirmed working caller.

No frontend API call should be invented from this list alone.

## 10. Test plan before enabling the renewed flow

### Test environment
- Disposable test member and creator accounts.
- Non-production content and storage objects.
- Known TL balances and ledger snapshots.
- A controlled Local Agent and test cloud-provider folder.
- Deployed Worker commit/version recorded.
- No real payment or production balance mutation.

### Test cases
- Login, refresh, expired token, logout and current-member verification.
- Each storage provider disconnected/connected/revoked/offline states.
- Upload interrupted before completion and after provider success.
- SharePlace registration succeeds but file sync fails.
- File sync succeeds but protected release fails.
- Protected release succeeds but publication fails.
- Retry each stage without duplicate rows or storage objects.
- Duplicate request with same idempotency key.
- SharePlace list and detail show the correct family.
- Existing legacy MP3 and TL3 records remain readable.
- TL3 playback charges exactly once and credits creator exactly as approved.
- TLC mining through the owner-confirmed working path remains unchanged.
- POC contribution events are neither lost nor duplicated.
- TL4/TLD/TLJ are blocked from paid/public release until their required server capabilities are verified.

## 11. Recommended work order

**Step 1 — API contract extraction (next engineering task)**
- Inspect actual frontend callers and backend route handlers.
- Capture exact schemas and side effects.
- Verify whether the deployed frontend and Worker match the inspected branches.

**Step 2 — repair blockers separately**
- Authenticated file ownership.
- Safe registration-stage reconciliation/idempotency.
- Determine active TL3 consume path and resolve accounting defects only after ledger semantics are agreed.
- Trace the working TLC mining caller and keep it intact.

**Step 3 — canonical family adapter**
- Add explicit family metadata only through an approved backward-compatible plan.
- Preserve old `content_kind`, file extensions and record IDs.
- Avoid destructive schema/data migration.

**Step 4 — live TL3 wizard integration**
- Integrate the renewed wizard with the verified existing TL3 flow on a parallel route.
- Run complete regression and accounting tests.

**Step 5 — family service completion**
- Add TL4, TLD and TLJ backend workflows one by one under approved policy.
- Keep unavailable release choices disabled, not simulated as live.

**Step 6 — controlled rollout**
- Compare old and renewed pages on the same test records.
- Keep rollback route.
- Obtain explicit owner approval before merge or deployment.

## 12. Explicit preservation boundary

This map does not authorize:
- changes to the default branch;
- production API/schema/database migrations;
- changes to TL, TLC, POC, creator revenue or mining rules;
- cryptographic/container replacement or file conversion;
- deletion of free MP3, legacy SharePlace or specialized certificate/score features;
- changes to auth token keys or login redirects;
- replacement of creator pages, player pages, sidebar or privileged workspaces;
- merge, deployment or default-route switching.

The current work remains documentation and prototype work on the design branch until the owner explicitly approves a separately scoped implementation.
