# MVP End-to-End Readiness Check
Date: 2026-10-14
Scope: read-only source inspection of the current default branches. No production code was changed and no live transaction/playback was executed.

## Purpose
Prioritize a working TimeLink MVP. This register distinguishes source-code presence from verified runtime behavior.

## Current flow findings

| User journey | Source evidence | Current assessment |
|---|---|---|
| Login | `public/login.html` calls `POST /api/auth/login`; `src/index.ts` defines that endpoint and returns `token` plus `user`. | Frontend/backend contract appears aligned in source. Runtime login not tested. |
| Creator upload | `public/creator.html` checks Local Agent `/health`, uploads MP3 to `127.0.0.1:8787/upload`, then registers SharePlace metadata with `POST /api/shares`. | Flow exists, but requires Local Agent running on creator's PC. Runtime upload not tested. |
| TL3 release | Creator then calls `POST /api/files/sync` followed by `POST /api/v1/tl3/releases`. The sync route creates/updates `tl_files`; release route requires the file to belong to the authenticated user and a reachable source URL. | Multi-step flow exists. Failure at any intermediate step can leave an incomplete record; end-to-end test required. |
| SharePlace listing | Frontend requests `GET /api/shares`; legacy SharePlace routes are mounted at `/api/shares`, and list handler combines `tl_shares` with legacy `tl_files`. | Source path exists. Verify actual deployed route precedence and returned records. |
| TL charge and playback | Frontend uses `POST /api/shares/:id/charge` and `POST /api/shares/:id/consume`. | **High-priority accounting defect candidate:** charge transfers wallet TL into per-user file balance. Consume then debits the file balance and also debits the user's wallet again. If confirmed in runtime, one listening interval may be charged twice. The consume update also checks/debits `tl_p` only, despite charge accepting `tl_p + tl_a + tl_b`. Do not use real paid balances for testing until this is reconciled. |
| TLC mining | Backend `POST /api/eco/mine-tlc` exists in `src/economics.ts`. However, `public/wallet.html`'s `doClaim()` only changes button text/style and makes no API request. | Wallet page's visible claim button is not connected to the mining endpoint in the inspected source. User-confirmed mining test path is separate; do not classify the mining engine as absent or stop it. |
| TL wallet screen | `public/wallet.html` has display content and a local UI-only claim interaction; no wallet API calls were found in the page. | Displayed balances/history may be static. Must connect to the existing wallet endpoint and render live server values. |

## Critical implementation notes
1. The creator upload page currently forces `_mode = 'tl3'` and requires a local agent at `127.0.0.1:8787`. A user cannot complete this path if the agent is not running.
2. The upload flow creates SharePlace metadata first, then syncs a separate `tl_files` record, then creates the TL3 release. These are separate requests, not one atomic operation.
3. The creator's `/api/files/sync` request does not include an Authorization header. The backend sync handler currently uses the supplied email to locate/create a user and defaults to user ID 1 if no email match is found. This must be corrected before relying on the sync-created owner association.
4. The current frontend SharePlace player charges through the legacy `/api/shares/:id/consume` endpoint, not the separate `/api/v1/playback/tl3/consume` route. Fix the exact active path rather than changing an unused route.
5. The current source includes old free-MP3/POC branches even though the latest product direction is TL-file-only. Do not delete them as part of the first MVP repair; first make the active TL3 path reliable.

## Safe execution order
1. Establish one test account and one test TL3 track; confirm login and live wallet read.
2. Verify Local Agent health and one upload without changing existing production files.
3. Trace the returned SharePlace ID, `tl_files` ID, TL3 release ID, and stream URL as one record chain.
4. Correct the active per-track charge/consume accounting so a five-second playback interval has one clearly defined debit and one creator credit.
5. Connect the wallet page to the existing wallet and mining APIs; do not replace the user's already-working mining test path.
6. Run a complete test: login → upload → SharePlace listing → charge → play for a measured interval → verify buyer debit and creator credit → verify mining record/balance.
7. Only after this path passes, proceed to UI redesign and expanded product categories.

## Verification status
- Source-code inspection: completed for the files listed above.
- Live API checks: not performed.
- Browser upload/playback: not performed.
- Real TL/payment transaction: not performed.
- Production code changes: none.
