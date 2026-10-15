# TimeLink Screen Inventory — Renewal Baseline
Date: 2026-10-14
Branch: docs/master-architecture-audit-20261014
Scope: frontend public HTML inventory and source-level inspection
Important: this is a source inventory, not a claim that every route/action was runtime-tested.

## 1. Inventory summary
The `public/` directory contains 34 HTML files. The frontend is a multi-page static HTML application with shared and page-specific JavaScript. Several pages have independent shells, while some include `/sidebar.js`. The renewal must not assume a single global layout.

## 2. Screen inventory

| File / current route | Current responsibility evidenced in source | Key actions / dependencies | Renewal handling |
|---|---|---|---|
| `index.html` / `/` | Public landing, product explanation, popular content, cafe radio, B2B | Loads popular shares from `/api/shares`; links to login, SharePlace, cafe radio, B2B | Preserve as public landing; redesign separately |
| `login.html` | Sign in | `POST /api/auth/login`; TON connect hooks | Preserve auth contract and return behavior |
| `signup.html` | Registration and verification | `/api/auth/signup`, `/api/auth/verify`, `/api/auth/login`, resend | Preserve validation and verification sequence |
| `onboarding.html` | New-member onboarding steps | Step navigation and finish action | Preserve completion and destination |
| `shareplace.html` | Main content discovery | `GET /api/shares`, fallback `/api/v1/shareplace`; genre/type/sort/view filters; charge/playback/player | First major member-facing renewal candidate; preserve all filters and player |
| `track.html` | Individual content detail | Share/stats/my-TL requests; like/follow/playlist/share; charge; TL3 download/open; score | Preserve detail URL and share ID semantics |
| `creator.html` | Creator upload and release workflow | API upload, Local Agent health/upload, shares metadata, files sync, TL3 release, asset/certification | Preserve full existing sequence and local-agent integration |
| `creator-studio.html` | Alternate wizard-style upload studio | API upload, files sync, TL3 release; explicit MP3/free and TL3 steps in current source | Treat as separate legacy/alternate workflow; compare before selecting canonical creator UI |
| `dashboard.html` | Member dashboard and embedded tabs | TL/TLC/POC, content, wallet, missions, cafe; multiple API loads | Preserve existing dashboard actions; reconcile with wallet page later |
| `wallet.html` | Standalone wallet/conversion/withdrawal UI | Exchange and withdrawal controls; exact live API wiring requires further inspection | Keep distinct until balance and transaction contracts verified |
| `radio.html` | TL broadcasting station hub | Shares, cafe/in-car channels, player, TL charging and payment | Preserve as broadcast/listen hub, not merely a music list |
| `cafe-radio.html` | Cafe live radio / DJ listening | Cafe channels, DJ contracts/rates/live status, listen/contract/apply/charge | Preserve live DJ and cafe relationship flows |
| `dj-center.html` | DJ profile and operations center | Profile, cafe applications, files, broadcast set, start/stop/next, contracts, live DJ | High-priority functional screen; preserve API actions |
| `dj-console.html` | Dedicated broadcast control console | Start/next/stop; loads TL3 and DJ console scripts | Preserve as operational console; don't merge away |
| `cafe-channel.html` | Create/configure cafe channel | Address search, song selection, AI pick, channel submission; shares and cafe channel APIs | Preserve channel creation and selection behavior |
| `cafe-owner.html` | Cafe owner management | Cafe controls, broadcast view, coupons, stats, DJ save/apply | Verify which controls are live before visual replacement |
| `incar.html` | In-car listening/broadcast experience | Playback, playlist, night/voice/shuffle controls, payment, weather, TL charge and POC activity | Preserve as a distinct driving experience; prioritize mobile ergonomics |
| `incar-channel.html` | Create/configure in-car channel | Song selection, AI pick, channel submission | Preserve channel setup and current endpoint behavior |
| `chart.html` | TL Chart and genre ranking | `GET /api/chart` with type/genre/limit | Preserve chart filters and ranking data |
| `ads.html` | Member ad viewing and reward | Available ads, ad-reward endpoints, ad media filters, watch/collect flow | Preserve reward/watch sequence; visual-only renewal |
| `advertiser.html` | Advertiser registration/login and campaign dashboard | Auth, ads create/list/toggle/delete/stats, budgets and media | Separate advertiser role shell; preserve campaign flows |
| `admin.html` | Administrative operations | Admin login, user/share/revenue/settings operations, SQL console | Separate privileged interface; do not apply member navigation |
| `b2b.html` | Enterprise/investor information and inquiry | B2B contact submission | Preserve as public business page |
| `download.html` | TimeLink Player download | GitHub release/API lookup and activity request | Preserve download path and release discovery |
| `player-host.html` | Player host/runtime | Existing player infrastructure page | Treat as playback infrastructure; do not redesign before tracing callers |
| `tl3-player.html` | TL3 release/library/player | Track list/detail and segmented TL3 playback | Preserve encryption/playback client behavior |
| `tlj-viewer.html` | TLJ rights certificate viewer | Certificate verification endpoint | Preserve certificate file selection and verification |
| `payment-success.html` | Payment completion return | Payment result page | Preserve provider return URL and state handling |
| `payment-fail.html` | Payment failure return | Payment result page | Preserve provider return URL and retry path |
| `terms.html` | Terms of service | Static legal content | Content and version review, not app-shell priority |
| `privacy.html` | Privacy policy | Static legal content | Content and version review, not app-shell priority |
| `creator-policy.html` | Creator policy | Static policy content | Content and version review |
| `creation-right-policy.html` | Creation-right policy | Static policy content | Content and version review |
| `dj-guide.html` | DJ usage guide | Static guide content | Preserve help route; improve readability later |

## 3. Cross-cutting shell and navigation findings
- `sidebar.js` currently creates a sidebar with groups 방송, 내 방송, 플랫폼, 기타.
- It uses a logo link to `/radio` and includes a TL balance plus a charge button.
- It replaces an existing `aside.sidebar:not(.tl-sidebar)` or inserts into `.app`/body.
- Pages such as dashboard and advertiser have their own internal navigation patterns. A blanket sidebar injection can create duplicate or conflicting shells.
- Many pages include their own footer markup or dynamic footer logic. Footer unification should be separate from navigation and should not alter content or API calls.
- The 2026-10-05 `docs/IA.md` is a proposal/history, not proof of current route availability or role authorization.

## 4. Conflicts to resolve only after owner review
1. The current public landing page has a “음악” link and “무료로 듣기” CTA, while the product is intended to present the wider time-based digital-content platform.
2. SharePlace and `creator-studio.html` still explicitly expose free MP3 workflows. Do not delete these records or flows in a design pass. Confirm the current product policy and migration plan first.
3. `creator.html` and `creator-studio.html` are two separate creator experiences. Compare capabilities and the user's known working path before choosing a default.
4. `dashboard.html` has wallet and mining tabs while `wallet.html` is standalone. Retain both until their current role and API contracts are verified.
5. Cafe, in-car, DJ and radio features are interconnected but distinct. Keep them as distinct destinations in the renewed information architecture.
6. `admin.html` is privileged and must not inherit the member UI shell.
7. `player-host.html`, `tl3-player.html` and `tlj-viewer.html` are specialized runtime/tool screens. Do not treat them as ordinary content pages.

## 5. Renewal priority
### Phase A — member entry and discovery
1. Login / signup / onboarding
2. Member shell and responsive navigation
3. SharePlace
4. Track detail and persistent player

### Phase B — creator and economy
5. Creator Studio (compare creator.html and creator-studio.html first)
6. Dashboard
7. Wallet / POC / TLC presentation

### Phase C — broadcast and channels
8. TL Broadcasting Station
9. DJ Center and DJ Console
10. Cafe discovery/owner/channel
11. In-car experience/channel

### Phase D — business and operations
12. Advertiser and ads
13. Chart
14. B2B and download
15. Admin, legal and help pages

## 6. Safe implementation rules
- No edits to current production HTML/JS/API during inventory and prototype work.
- New shell and screens must use separate filenames/routes.
- Reuse established endpoints and request payloads.
- No changes to wallet balances, TL charging/consumption, TLC mining, POC calculations, encryption, file formats, local-agent storage, or settlement as part of visual renewal.
- Do not remove the legacy MP3 code until a separate policy/migration decision is approved.
- Test each renewed screen against the existing page using a test account and test content.
- Route cutover only after a documented pass; keep rollback to the old route available.

## 7. Source review limits
The inventory was assembled from the current repository's HTML files and source references. API presence and UI controls were identified from source. This does not certify production uptime, real account permissions, payment success, or end-to-end operation. Those require controlled browser tests with disposable test data.
