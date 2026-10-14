# TimeLink Security Hardening & Access-Control Test Plan

**Status:** Design baseline for development only. No production policy or route behavior is changed by this document.  
**Applies to:** `timelink-backend` and the Renewal frontend.  
**Rule:** Do not merge or deploy security changes until playback, uploads, and legacy compatibility tests pass.

## 1. Confirmed source-level findings

The following are source observations on backend branch `feature/renewal-private-library-api` at commit `e8e345a6999eb0c7ba437cfd1c20bd2f68f5835f`. They are not claims that an exploit was exercised against production.

| Priority | Area | Source-level finding | Required disposition |
|---|---|---|---|
| P0 | External object stream | `GET /api/storage/object/:id/stream` permits streaming when any `tl_shares` row references the object, without checking requester ownership or a playback grant. | Replace link-exists authorization with explicit owner or playback-grant authorization. |
| P0 | D1 raw object read | `GET /api/storage/:key` serves completed objects without checking identity, publication state, or a playback grant. | Introduce private-by-default object access; preserve only explicitly authorized public delivery through a controlled proxy. |
| P0 | Track stream | `GET /api/stream/:shareId` serves the full underlying stream without enforcing the time-balance result. | Bind stream delivery to server-authorized playback sessions and short-lived segment grants. |
| P0 | TL3 multipart upload | `/api/upload/init`, `/api/upload/part`, and `/api/upload/complete` use caller-controlled object keys and do not bind an upload to an authenticated owner/session. | Require authenticated, expiring upload sessions; validate ownership on every part and completion. |
| P0 | Legacy sync | `POST /api/files/sync` accepts caller-supplied user information and falls back to user ID 1. | Remove fallback; derive user ID only from verified authentication. |
| P0 | Secret management | `wrangler.toml` contains a hard-coded value that resembles a third-party API credential; an older upload path also contains a hard-coded fallback encryption secret. | Treat exposed credentials as compromised: rotate/revoke at provider, remove from tracked config, use Worker secrets, and plan history cleanup. |
| P1 | External object stream | A shared link is treated as sufficient permission to read the original provider object. | Separate public SharePlace visibility from private source-file access. |
| P1 | OAuth callback | Storage OAuth completion uses wildcard `postMessage` target origin. | Restrict target origin and validate origin/source/state at the receiving page. |
| P1 | Provider status | Local Agent is reported as configured without a live agent handshake. | Report availability separately from configured provider credentials and connected status. |
| P1 | Social schema | Social handlers call schema-creation DDL on request paths; comments are silently truncated at 1,000 characters before length checks. | Move DDL to migrations/controlled initialization; reject oversized comments explicitly. |
| P1 | Time charging | Client-supplied `seconds` and `deduct_rate` influence tick calculation. | Derive rate and billable duration on server; make tick/session events idempotent. |

## 2. Canonical access policy

TimeLink must not equate an asset's presence in SharePlace with permission to retrieve its original bytes.

| Resource / action | Owner | Public visitor | Authenticated listener |
|---|---|---|---|
| Original source file (MP3/MP4/PDF/JPEG/PNG) | Read/manage | Deny | Deny unless separately authorized as owner |
| Private TL container | Read/manage | Deny | Deny |
| Public Track Page metadata and approved cover | Manage | Read | Read |
| Public MP3 promotional playback | Manage | Allow only if explicitly published and policy permits | Allow |
| TL3/TL4/TLD/TLJ protected playback | Manage | Deny by default | Allow only with valid server-issued playback grant and sufficient TL |
| Download protected container | Manage | Deny | Explicit entitlement only |
| Likes/comments/shares | Manage own | Read public content only | Write after authentication; rate-limited |
| Personal file list and cloud connections | Full own scope | Deny | Own scope only |
| Upload session and chunks | Own session only | Deny | Own unexpired session only |

**Important distinctions**
- Spotify or another music-service listing may be evidence supplied by a creator; it is not automatic legal proof, a transfer of copyright, or an automatic ownership verdict.
- TL3 is a protected packaging and distribution format. It does not itself create a new copyright registration.
- The uploader must attest to their authority and remains responsible for the uploaded material, subject to applicable law and platform dispute handling.
- Public listening must never expose a raw original-file URL. Public access, where allowed, must pass through the policy-aware delivery layer.

## 3. Required backend design

### 3.1 One authorization service
Implement a shared policy function used by every byte-delivery route. It must resolve:
1. verified user identity (or anonymous visitor where public promotional access is explicitly allowed);
2. asset and source-object relationship;
3. publication status and asset type;
4. owner, creator, rights/dispute state, and any takedown restriction;
5. playback grant, expiry, allowed range/segment, and current entitlement;
6. rate limits and replay/idempotency state.

No route may infer authorization from the existence of a `tl_shares` link alone.

### 3.2 Playback sessions
- Create a server-side playback session for a specific asset, user/anonymous policy, and playback rate.
- The server, not the browser, chooses the TL rate and billable segment duration.
- Issue short-lived, single-purpose grants for the next segment/range.
- Deduct TL atomically before releasing the authorized segment; prevent duplicate tick replay and negative/zero-rate manipulation.
- Stop issuing grants when balance is insufficient or the asset is no longer playable.
- Keep InCar promotional listening as a distinct policy flag with listener charge set to zero; this does not grant raw-object access.
- Do not claim accurate view counts until a separate, deduplicated view-event model exists.

### 3.3 Upload sessions
- Require a verified owner before initializing an upload.
- Generate an unguessable upload-session ID on the server and persist owner, object key, expected size, allowed type, expiry, and state.
- Bind every part and completion request to that session and owner.
- Do not accept arbitrary object keys from the client as authority.
- Validate expected part count, total size, content type, file signature/container magic, and completion state.
- Enforce quotas and cleanup expired/incomplete sessions.

### 3.4 Private source storage
- Keep original source objects private by default.
- Return metadata only from personal file APIs; never return provider access tokens or raw provider download URLs.
- External Drive/OneDrive streaming must verify owner or a separate playback grant before fetching bytes.
- Preserve legacy URLs only behind an authorization-aware compatibility adapter during migration.

### 3.5 Legacy routes
- Remove the user-ID-1 fallback from `/api/files/sync`; derive the owner exclusively from verified JWT/session identity.
- Audit every legacy upload, approval, download, and storage route before changing behavior.
- Admin actions must require an explicit server-side admin role check.
- Do not disable legacy playback until its clients have been migrated and regression-tested.

## 4. Automated test matrix (release blocking)

| Test | Expected result |
|---|---|
| Anonymous request to private original object | 401/403; no bytes returned |
| User A requests User B's external object stream | 403; no provider fetch |
| User A lists My Files | Only A's records |
| User A guesses User B's upload-session ID | 403/404; no part write |
| User A completes User B's upload | 403/404; object remains incomplete |
| Anonymous multipart upload | 401 |
| User changes object key in request | Rejected; server-owned key remains unchanged |
| Unauthenticated `/api/files/sync` | 401; no row created or modified |
| Missing identity on legacy sync | No default user is selected |
| Publicly published MP3 Track Page | Metadata and approved playback only; no original raw URL |
| Unpublished or disputed Track Page | Playback denied |
| TL3 playback with zero balance | No protected bytes released |
| Client submits `deduct_rate=0` or negative value | Ignored/rejected; server rate is authoritative |
| Replayed billing tick | No duplicate debit or duplicate creator contribution |
| Like submitted twice by same user | One row and one count |
| Self-follow | 400 |
| Playlist add by non-owner | 404/403 |
| Comment shorter than minimum or longer than maximum | Explicit 400/413; no silent truncation |
| OAuth callback message from untrusted origin | Ignored by receiver |
| InCar promotional playback | Listener charge is 0 TL only for eligible content; original source remains private |

## 5. Safe implementation sequence

1. Rotate exposed credentials and move all secrets to Cloudflare Worker secrets. Do this before publishing further builds.
2. Add test fixtures and an isolated D1 staging database; never run security experiments against production D1.
3. Implement upload-session ownership and object-key binding.
4. Implement shared object authorization and private-by-default source reads.
5. Implement playback sessions and server-derived TL billing; migrate clients behind a compatibility layer.
6. Fix legacy sync, admin authorization, OAuth origin checks, and Local Agent status reporting.
7. Run TypeScript strict checks, unit tests, D1 integration tests, and browser E2E.
8. Deploy to a staging Worker and test two separate accounts, then prepare a rollback plan.
9. Only after sign-off, merge and deploy in a controlled window.

## 6. Release gates

A security PR is not ready to merge until all are true:
- strict TypeScript check is green;
- D1 tests prove owner isolation for two distinct users;
- no unauthenticated upload or private-object read path remains;
- protected playback cannot deliver bytes before authorization/billing;
- existing public MP3, TL3, Creator, SharePlace, and Local Agent flows pass regression tests;
- secrets are absent from tracked config and rotated at the provider;
- staging deployment is verified independently of source inspection.

## 7. Current verification status

- Findings above are confirmed by reading source on the named development branch.
- No exploit was executed against production.
- No D1 staging database, two-account test, browser E2E, or staging Worker test has yet been run.
- The GitHub Actions workflow file for strict TypeScript validation exists on the development branch, but no workflow run was returned for the inspected commit. TypeScript validation therefore remains unverified.
- No merge, production database migration, or production deployment has been performed.


## 8. Additional source findings from SharePlace and stream-route review

A second pass through `src/routes/shareplace.ts` and the legacy stream handlers identified additional high-priority issues:

1. **SharePlace list response returns `s.*` for modern `tl_shares` records.** This includes `stream_url` and other internal fields. The modern list query also does not apply a publication/visibility predicate. The public response must be replaced with an explicit allowlist DTO (public metadata only), with visibility and dispute checks.
2. **`GET /api/stream/:shareId` returns source bytes without a playback authorization check.** The handler resolves the SharePlace record and streams an external URL, external storage object, or D1 object. It does not require an authenticated playback session or verify a server-issued grant before returning bytes.
3. **`GET /api/stream/:shareId/info` reports `can_play` based on a simplified balance check and treats anonymous visitors as playable.** This is informational only and is not an authorization boundary; the stream handler must enforce the actual decision.
4. **`POST /api/stream/:shareId/tick` accepts client-provided `seconds` and `deduct_rate`.** The server must derive the tariff and billable segment from trusted asset metadata and session state. Client values cannot determine price.
5. **The modern SharePlace POST route records POC activity and accepts creator-supplied release metadata.** The future rights workflow must persist uploader attestation, evidence references, review state, and dispute status as separate auditable records; creator-supplied `release_check` alone must never be treated as an independently verified result.

These findings reinforce the required delivery model: SharePlace exposes approved metadata; a dedicated playback authorization layer grants only the exact protected segment or promotional stream permitted by policy. A Track Page URL is not a bearer token for the original file.


## 9. Third-pass upload and metadata exposure findings

A focused review of the legacy upload handlers in `src/index.ts` on the same development branch found additional paths that must be included in the release gate:

1. **`POST /api/upload/tl` has no verified-user check.** It accepts a multipart file, creates a TLNK v1-style container, and stores it in D1. Its key derivation falls back to the literal `timelink_default_secret_2026` when `TL_SECRET` is absent. This path must not be used for new releases. Before retiring it, trace all frontend callers and distinguish it from authenticated `/api/upload/tl3`.
2. **`POST /api/upload` is also unauthenticated.** It accepts caller-provided `trackId`, writes an object under a predictable `tracks/{id}` key, and returns a public storage URL. It must be replaced by the owner-bound upload-session flow.
3. **The multipart upload family has no demonstrated session ownership binding.** The init, part, complete and one-shot upload handlers accept client-selected identifiers/keys without a verified user and persisted owner relationship. Every operation must resolve to a server-created, expiring session.
4. **`GET /api/shares/:id` returns `SELECT *` from `tl_shares`.** This can expose internal fields such as `stream_url`, storage references and rights workflow fields. Replace it with an explicit public metadata DTO; keep private details behind owner-scoped APIs.
5. **The legacy `/api/upload/tl` path is not equivalent to the authenticated TL3 v2/v3 release workflow.** Do not infer that a TLNK magic header alone proves valid ownership, secure encryption, or an authorized release.

### Additional release-blocking tests

| Test | Expected result |
|---|---|
| Anonymous `POST /api/upload/tl` | 401; no object written |
| Anonymous `POST /api/upload` | 401; no object written |
| Authenticated user writes another user's `trackId` | Rejected; no overwrite |
| `GET /api/shares/:id` as public visitor | Only approved public metadata; no raw stream URL, storage ID, rights evidence path or private state |
| Legacy upload path called without `TL_SECRET` | Disabled/rejected; never uses a hard-coded fallback key |

**Implementation decision:** do not patch these legacy routes by adding a token check alone. First identify all callers and their expected response shapes, then route them through the same upload-session and authorization service. This avoids a partial fix that leaves arbitrary-key writes or old clients broken.
