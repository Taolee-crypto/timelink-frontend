# TimeLink Route-to-Workflow and API Dependency Map

**Date:** 2026-10-14  
**Status:** Source-level audit; no runtime test and no production change  
**Branch:** `docs/master-architecture-audit-20261014`  
**Repositories:** `Taolee-crypto/timelink-frontend`, `Taolee-crypto/timelink-backend`

## 1. Scope and evidence rules

This map links existing pages and user actions to backend routes observed in repository source. It is not proof that the deployed Worker or live website currently behaves identically.

- **Source confirmed:** route or call exists in the inspected source snapshot.
- **Needs runtime verification:** request/response and deployed behavior have not been exercised.
- **Risk / mismatch:** source contains an inconsistency that must be tested before renewed UI relies on it.
- **Not established:** inspected paths do not prove a complete workflow.

No endpoint is authorized for deletion or replacement by this map.

## 2. Authentication and account entry

| User task | Frontend surface | Backend source route | Evidence / dependency |
|---|---|---|---|
| Sign in | `public/login.html`; React `src/components/auth/LoginForm.tsx` also exists | Legacy `POST /api/auth/login` in `src/index.ts`; versioned `/api/v1/auth` router mounted in `src/index.ts` | Two frontend architectures and two auth route generations exist. Confirm actual deployed entry and token contract. |
| Sign up | `public/signup.html` (inventory) | `POST /api/v1/auth/register` in `src/routes/auth.ts` | Verify page calls this exact route and stores the returned token/user fields. |
| Current account | pages use `localStorage.tl_token`, `localStorage.tl_user` | `GET /api/v1/auth/me` | Token key compatibility is important; do not rename storage keys in a shell redesign. |
| Wallet/profile refresh | creator and other pages | `GET /api/eco/wallet` | Response fields differ from older cached `tl_user` shape; display must use verified API response. |

**Required checks:** login redirect/return URL, expired-token handling, logout, stale cached user data, and whether React or static HTML is the active public login path.

## 3. Creator asset registration

### 3.1 Existing TL3 path

Observed frontend: `public/creator.html`.

Source-level sequence:
1. Read cached user and token; redirect to `login.html` if either is missing.
2. Fetch wallet summary from `GET /api/eco/wallet`.
3. Select MP3 files and read ID3 tags.
4. Send original file to the Local Agent `/upload?kind=mp3` path (documented in the frontend implementation map; exact current tunnel/session behavior needs runtime verification).
5. Create SharePlace metadata through `POST /api/shares`.
6. Synchronize file metadata through `POST /api/files/sync`.
7. Request protected release through `POST /api/v1/tl3/releases`.
8. Existing code then invokes certification/asset-related follow-up actions; inspect their precise contracts before carrying them into a renewed wizard.

The UI sets `_mode = 'tl3'` and enforces MP3-only selection. This is an existing TL3 workflow, not a generic four-family asset creator.

### 3.2 Important stage boundary

SharePlace registration, file synchronization and TL3 release are separate HTTP requests. There is no source evidence of one transaction spanning all three.

The renewed UI must therefore show each stage separately, preserve returned IDs, support safe retry/reconciliation, and avoid duplicate records. Do not treat a successful metadata registration as proof that the protected TL3 release completed.

### 3.3 Ownership/authentication risk

The inspected `POST /api/files/sync` handler in `src/index.ts`:
- does not read/verify an Authorization token in the handler;
- chooses a user from request-body `user_email`;
- initializes `userId` to 1;
- may create a placeholder user when an email/username is supplied.

This is a source-confirmed design risk. The owner identity must ultimately be derived from a verified authenticated principal, but changing this endpoint requires a separate backend fix, compatibility plan and regression test. Do not work around it in the new UI by sending different client-supplied identity fields.

## 4. SharePlace discovery and detail

| User task | Frontend surface | Backend route | Source observation |
|---|---|---|---|
| List shared assets | `public/shareplace.html` | `GET /api/shares`, alias of SharePlace router; fallback `GET /api/v1/shareplace` | Frontend calls `/api/shares` first. |
| Register SharePlace item | `public/creator.html` | `POST /api/shares` | Router requires JWT and creates `tl_shares` records. |
| Read per-asset TL balance | SharePlace page | `GET /api/shares/:id/my-tl` | Legacy per-file balance model; compare with the newer TL3 account-balance model. |
| Charge asset-specific TL | SharePlace page | `POST /api/shares/:id/charge` | Transfers wallet value into a per-file balance in the inspected legacy model. |
| Consume legacy asset balance | SharePlace player | `POST /api/shares/:id/consume` | Potential overlap with wallet debit must be reconciled before paid playback. |
| Open detail | `public/track.html?id=...` | Share ID lookup route(s) | Exact detail route and data source must be mapped for every supported record type. |

### 4.1 Classification mismatch

The SharePlace frontend has:
- `detectType`: MIME/extension based audio, video, image, document recognition;
- `contentKind`: only MP3 or TL3 commercial/content-kind classification.

The `contentKind` helper groups `.tl4`, `.tlg` and `.tlf` with TL3. It is therefore unsafe as the family classifier.

The backend SharePlace registration currently stores `content_kind` as `mp3` or `tl3` in the inspected route. The list handler combines legacy `tl_files` rows and modern `tl_shares` rows. Modern rows are mapped with defaults such as `audio/mp3`, `shared: 1` and `auth_status: verified`.

**Design rule:** the renewed UI must not infer `asset_family` from `content_kind`, file extension, or default MIME. It needs an explicit validated family field, while legacy records are displayed through a compatibility adapter and flagged for verification where ambiguous.

### 4.2 Existing product-policy conflict

The frontend still has MP3/free-content branches and UI copy. The backend SharePlace router accepts a `free_mp3` release mode and records POC for MP3/TL3 upload. The current owner direction is TL-file-centered and does not intend free MP3 upload as the new platform model.

This is a policy/data migration decision, not a reason to delete the old code or records during the visual renewal. Keep legacy reads available until the owner approves a migration or retirement plan.

## 5. Playback and consumption accounting

Two distinct models appear in source and must not be conflated.

### 5.1 Legacy per-file balance path

- `GET /api/shares/:id/my-tl`
- `POST /api/shares/:id/charge`
- `POST /api/shares/:id/consume`

The charge handler is documented as transferring TL from user wallet buckets to a per-file TL balance. The consume handler updates per-file and user balance fields. The MVP findings document flags a possible double debit and inconsistent `tl_p/tl_a/tl_b` handling.

**Status:** high-priority accounting verification. Do not enable new paid flows on this path until a disposable-account test proves exactly one debit and the expected creator credit.

### 5.2 TL3 v3 account-balance path

- Router: `src/routes/playback.ts`, mounted at `/api/v1/playback`.
- Middleware: `authMiddleware` is applied to all routes in this router.
- Route: `POST /api/v1/playback/tl3/consume`.
- The handler reads `file_id`, `session_id` and `seconds`, verifies a released TL3 record, debits `users.tl_balance`, credits 70% to the creator in the inspected implementation, and writes session/play-event records.

**Important verification questions:**
- Does the active player actually call this route, or does it call the legacy `/api/shares/:id/consume` route?
- Is a repeated request with the same session ID idempotent? The inspected code creates/updates a session record but the shown handler does not use the session's prior consumed count to reject duplicate seconds.
- Are debit, creator credit, transaction and play-event writes atomic or protected against partial failure?
- Does the live TL policy still match this route's balance column and 70% settlement behavior?

Do not change the 70% figure, session behavior or balance field as part of UI design. These are backend business rules requiring owner-approved technical review.

### 5.3 Other family consumption

No complete TL4, generic TLD or general TLJ metered-consumption workflow is established by the inspected source map. TLD score/PDF and TLJ certificate workflows are specialized features, not proof of full family consumption. Do not show “available” or a price until the family route, viewer, metering and settlement are verified.

## 6. Wallet, EARN, CONSUME and MINING

| User task | Frontend surface | Backend source | Current status |
|---|---|---|---|
| Wallet summary | `creator.html`, `dashboard.html`, `wallet.html` | `GET /api/eco/wallet` | Shared API exists; separate UI surfaces need field/action reconciliation. |
| General consumption | Relevant playback/usage screens | `POST /api/eco/consume` | Uses `tl_p/tl_a/tl_b` buckets and settlement/POC logic; not identical to TL3 v3 route. |
| TLC mining | `dashboard.html` / mining UI; wallet page has a button | `POST /api/eco/mine-tlc` | Backend implementation exists and owner confirms mining test works. Wallet button handler was reported in prior source audit as presentation-only; trace exact live action before changing. |
| Creator earnings | dashboard / creator | TL ledger and playback settlement paths | Need one authoritative view over existing records; do not fabricate a consolidated total from incompatible columns. |
| Payments / TL charge | wallet and SharePlace modal | `/api/payment` routes and `/api/payment/virtual/charge` in app | Verify provider, idempotency, success/fail return and ledger update before reusing. |

The UI must distinguish:
- TL: platform balance / time-use value;
- TLC: token balance and chain-related state;
- POC: contribution score/events.

They are not interchangeable.

## 7. Broadcast, cafe, car and DJ services

Frontend surfaces identified:
- `radio.html`, `cafe-radio.html`, `incar.html`
- `dj-center.html`, `dj-console.html`, `cafe-channel.html`, `cafe-owner.html`, `incar-channel.html`

Backend router groups mounted in `src/index.ts`:
- `/api/cafe`
- `/api/dj`
- `/api/dj-cafe`
- `/api/cafe-subscriptions`
- `/api/cafe-broadcast`

These are connected applications. Their exact page-to-endpoint actions, role gates, charge policies and asset dependencies require a separate route inventory. The proposed common shell must not replace their page-specific navigation until mapped.

## 8. Current sidebar versus target IA

Current `public/sidebar.js` groups:
- 방송: TL방송국
- 내 방송: DJ 센터, 채널 개설, 마이카페, 크리에이터 센터
- 플랫폼: 대시보드, SharePlace, TL Chart, 지갑 & 채굴
- 기타: 광고 시청, 광고주 센터, 앱 다운로드

It replaces an existing `aside.sidebar` or inserts itself into `.app` / `body`. This confirms why a universal shell injection is unsafe: page layouts and specialized pages may be displaced or gain duplicate navigation.

The owner-provided target “듣기 | 만들기” switch is a proposed information architecture, not current sidebar behavior. Implement it on a new shell first and link to legacy pages during parallel validation.

## 9. Priority issue register

| Priority | Issue | Evidence | Required action before renewed UI depends on it |
|---|---|---|---|
| P0 | Legacy charge/consume may debit twice | Backend MVP findings and separate charge/consume handlers | Disposable-account accounting test; backend correction only after exact ledger semantics agreed |
| P0 | File sync owner derives from request body, default user ID 1 | `src/index.ts` `POST /api/files/sync` | Design authenticated ownership contract and compatibility-safe backend patch |
| P0 | TL3 consume session duplicate-request/idempotency behavior unclear | `src/routes/playback.ts` | Test repeated session requests and partial failures |
| P1 | SharePlace family classifier collapses TL4/TLD/TLJ into TL3/MP3 semantics | `public/shareplace.html`, `src/routes/shareplace.ts` | Define explicit `asset_family` and legacy adapter |
| P1 | Two consumption/accounting models coexist | legacy share charge/consume and `/api/v1/playback/tl3/consume` | Identify active caller per player and document one path per asset/version |
| P1 | Creator upload has non-atomic stages | creator page and separate APIs | Stage-aware progress, safe retry and reconciliation |
| P1 | Wallet/dashboard/mining actions may not share one contract | separate frontend pages and economics routes | Trace actual button handlers and API response fields |
| P2 | Sidebar and page-owned navigation differ | `sidebar.js` plus individual pages | Build shell on separate route; page-by-page integration |
| P2 | Broadcast and DJ endpoint mapping incomplete | mounted routers and page inventory | Dedicated route/action audit |

## 10. Safe next implementation sequence

1. Establish a disposable test environment/account and read-only production comparison. No real balance mutation.
2. Verify authentication entry and `/api/v1/auth/me` token lifecycle.
3. Trace exact deployed creator upload call order, Local Agent responses and all three registration stages.
4. Test the two TL3/legacy consumption models independently with known balances; do not run paid production tests.
5. Trace wallet, EARN and MINING buttons to their actual endpoints, preserving the owner-confirmed TLC mining path.
6. Establish explicit family identity and compatibility behavior before adding four-family filters.
7. Map broadcast/DJ/cafe/car pages and role gates.
8. Only then implement a separate renewed shell and screens. Keep legacy routes and APIs intact during parallel testing.

## 11. Explicit non-actions

This audit did not:
- change any production page, API, schema, database, storage object or balance;
- change TL/TLC/POC rules or settlement percentages;
- change encryption/container formats;
- delete free MP3 records or legacy endpoints;
- merge, deploy or switch any branch.
