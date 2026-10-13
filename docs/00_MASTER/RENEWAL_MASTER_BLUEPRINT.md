# TimeLink Renewal Master Blueprint
Date: 2026-10-14
Status: design baseline — no production code changed

## 1. Renewal mandate
Renew the existing TimeLink platform in place conceptually, but implement renewed screens alongside current screens. This is not a rebuild. Existing user journeys, URLs, API contracts, data, and owner-confirmed working functions are the baseline.

## 2. What the current repository actually contains
The current frontend is a collection of static HTML screens with shared JavaScript and direct API calls. It is not yet a single unified React application. Some pages have their own navigation and some load `/sidebar.js`; the sidebar is therefore not a guaranteed global shell.

Observed current entry points and responsibilities:
- `index.html`: public landing page, platform explanation, popular music, cafe radio, B2B/investor links.
- `login.html`, `signup.html`: account entry.
- `dashboard.html`: member overview, TL/TLC/POC display, wallet/mining/content/mission/cafe tabs.
- `shareplace.html`: content discovery, category/genre filters, type/sort/view controls, playback, per-track TL, charge modal.
- `track.html`: individual content detail, creator certification, charge/playback, likes/follows/playlists/sharing, TL3 download/open, score view.
- `creator.html`: creator upload studio, metadata, LP processing, Local Agent upload, SharePlace record, file sync, TL3 release, asset/certification requests.
- `radio.html`: TL broadcasting/listening hub, music playback, cafe and in-car channel discovery, TL charging/payment.
- `dj-center.html`: DJ profile, cafe applications, files, broadcast set, live broadcast, contracts, live DJ discovery.
- `wallet.html`: separate wallet/conversion/withdrawal-oriented screen; its live data/API contract needs reconciliation with dashboard wallet tabs.
- `advertiser.html`: advertiser login/signup, campaign creation, ad management and statistics.
- `sidebar.js`: shared navigation currently groups 방송, 내 방송, 플랫폼, 기타; includes DJ Center, channel creation, My Cafe, Creator Center, dashboard, SharePlace, TL Chart, wallet/mining, ads, advertiser, downloads.
- Other discovered or IA-referenced pages include `cafe-radio.html`, `incar.html`, `cafe-channel.html`, `cafe-owner.html`, `incar-channel.html`, `chart.html`, `ads.html`, `download.html`, `b2b.html`, policy/legal/help pages. Their availability and current working status must be inventoried before any navigation change.

## 3. Important existing inconsistencies — do not silently resolve during design
1. `docs/IA.md` (2026-10-05) proposes a menu structure different from current `sidebar.js`. Treat both as historical evidence; neither should be replaced until the owner approves a consolidated navigation.
2. The landing page links to `shareplace.html` with the label “음악” and still contains “무료로 듣기”; current product direction is TL-file based. Keep the route, redesign its wording only after content policy is confirmed.
3. SharePlace still displays “무료 MP3” as a type filter. Current direction says no free content and TL-file only. This is a product-policy mismatch, not a reason to delete records or code before migration planning.
4. The dashboard has its own embedded navigation and wallet/mining/content tabs, while `wallet.html` is a separate page. Decide which is the canonical wallet experience after comparing actual data and working actions.
5. `sidebar.js` injects a sidebar and replaces an existing `aside.sidebar`; pages with their own sidebar/footer can therefore show different navigation behavior. A visual shell must not be applied globally until page-by-page compatibility is tested.
6. Creator upload is a multi-stage workflow using the local agent and several API calls. Keep the current upload implementation available while the renewed interface is tested.
7. Radio, DJ broadcasting, cafe channels and in-car channels are connected product areas. Do not reduce TL방송국 to a simple music-list page.

## 4. Primary architecture: common platform + four equal content families
TimeLink is not a music-first platform. TL3, TL4, TLD and TLJ are peer digital-content families using one shared platform.

### 4.1 COMMON TIME CORE
All four families share:
- Time Authorization: identity, access rights, permitted usage, duration and session authorization.
- Usage Accounting: usage measurement, time balance reservation/consumption and transaction records.
- Content Protection: protected container, integrity verification and authorized delivery/viewing.
- Content Identity: identifiers, metadata, creator/rights-holder identity and version references.
- Creator Settlement: usage-based revenue allocation and settlement.
- Shared economy: TL balance, charging, transaction history, POC contribution and TLC participation/mining.

The common core provides shared rules and services. It does not force every media type to use the same payload, codec, player or interaction model.

### 4.2 Four peer content families
- TL3 — AUDIO: music, spoken audio and other audio works; audio-specific payload and player.
- TL4 — VIDEO: films, clips, programs and moving-image works; video-specific payload, playback and usage model.
- TLD — DOCUMENT: books, reports, articles and other documents; page/section/document viewer and applicable usage model.
- TLJ — IMAGE / VISUAL: image and visual works; image-specific presentation, viewing and rights metadata.

Each family has its own registration, metadata, protected payload, viewer/player, discovery filters and creator workflow, while sharing identity, authorization, accounting, protection and settlement.

Terminology note: the 2026-10-13 product proposal explicitly listed TLJ as an image asset. The repository also contains `tlj-viewer.html` for TLJ rights-certificate verification. Preserve both observed concepts and define their exact relationship in the detailed specification; do not silently reduce TLJ to the certificate viewer.

### 4.3 Common platform navigation
- Home / Overview
- Explore Digital Assets: All, TL3 Audio, TL4 Video, TLD Documents, TLJ Images
- Create / Register Assets: type-specific creation and registration
- My Assets: created, owned, authorized and saved assets, grouped by type
- SharePlace: shared discovery and distribution with all four types as first-class categories
- EARN: creator earnings and settlement across all asset families
- CONSUME: usage and listening/viewing/reading history
- MINING: POC/TLC participation and mining
- Wallet: TL balance, charging and transaction history
- Broadcast / Channels: TL Broadcasting Station, cafe and in-car radio, DJ and channel tools
- My TimeLink: profile, settings, notifications and help
- Business / Advertiser / Admin: separate role-based workspaces where applicable

### 4.4 Cross-family user journey
One account can discover, create, own, authorize, consume and earn from any supported family. A member can listen to TL3, view TL4, read TLD, view TLJ, and create or hold rights across any combination. Separate platform identities are not required for different roles.

### 4.5 Existing product areas
TL Broadcasting Station, cafe radio, in-car radio, DJ Center and channels remain connected platform applications. They may use TL3 audio and other supported media, but do not define the whole platform or replace the four-family architecture.

## 5. Screen renewal design language
Target direction: contemporary, premium digital creator platform; dark navy/charcoal foundation, restrained blue-violet accents, clear typography, generous spacing, high-contrast action states. Preserve existing TimeLink identity and logo treatment. Use one consistent system for:
- Desktop: fixed/compact left navigation, top utility bar, content canvas.
- Mobile: compact top bar and bottom or drawer navigation; never force desktop sidebar onto narrow screens.
- Content cards: type-aware presentation for TL3, TL4, TLD and TLJ, showing title, creator, type, TL rate/price, rights/status and suitable preview.
- Explore and SharePlace: all four content families are first-class categories, never secondary tabs under music.
- My Assets, EARN and CONSUME: cross-family views with type filters and a consistent asset identity.
- Creator forms: step-by-step progress, autosave where safe, explicit completion and retry states.
- Player: persistent, unobtrusive player with visible remaining TL and playback time.
- Wallet: distinguish TL, TLC, and POC visually and semantically; never present them as interchangeable.
- Tables/lists: readable empty/loading/error states, filters and pagination.
- Modals: consistent confirmation, charge, upload progress, and failure/retry treatment.

## 6. Renewal implementation architecture
- Keep existing HTML pages and their scripts as the legacy stable baseline.
- Build renewed pages under separate names/routes (for example `/renewal/` or `*-next.html`) before replacing any existing destination.
- Reuse the current backend API and data model. A renewed page should call the same established endpoint unless a separately documented defect requires a small backend patch.
- Share design tokens and reusable presentation components, but do not force a global sidebar or script loader onto pages that currently own their navigation.
- Maintain URL compatibility and redirects only after the new destination passes end-to-end tests.
- No changes to TLC mining, TL accounting, encryption, file format, storage, or upload behavior as part of a visual-only change.

## 7. Implementation order
1. Navigation and page inventory: confirm all actual files, routes, role-specific entry points and duplicated shells.
2. Design system: establish colors, typography, spacing, responsive breakpoints and reusable card/form/player patterns.
3. First renewed shell: signed-in member shell and mobile navigation, built separately.
4. Renewed Explore / SharePlace with TL3, TL4, TLD and TLJ as equal asset families.
5. Type-specific asset detail and viewer/player experiences using the shared time core.
6. Cross-family My Assets, EARN, CONSUME, Wallet and MINING presentation.
7. Creator Studio with separate registration workflows for each family; retain the existing TL3 upload path.
8. TL Broadcasting Station, DJ, cafe and in-car experiences.
9. Advertiser, B2B, admin and supporting modules.
10. End-to-end regression, staged route switch, rollback.

## 8. Acceptance criteria for every renewed screen
- Existing route and legacy page remain available during testing.
- Same test account can access the renewed screen.
- Existing records appear without migration or loss.
- Existing primary actions call the intended API and complete successfully.
- Loading, empty, error, and success states are all present.
- Desktop and mobile layouts are usable.
- No unintended changes to balances, ownership, creator settlement, mining, or stored files.
- A clear rollback path exists.

## 9. Immediate next deliverable
Produce a page-by-page screen inventory with current URL, page shell type, shared scripts, key user actions, API dependencies, and renewal priority. Then create the first visual prototype separately from the live pages. Do not modify `sidebar.js`, `index.html`, `shareplace.html`, `creator.html`, or backend business logic until that inventory and prototype are reviewed.
