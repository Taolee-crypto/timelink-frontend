# TimeLink Global — Page Completion Contract

Status: implementation contract for the global platform
Branch: feat/global-page-completion-20261014

## Platform rule

Every page must be a complete workspace for its own user task. Navigation may connect workspaces, but must not be used as a substitute for missing page functionality. Existing page visuals may be replaced completely. Preserve working API contracts, authentication, database records, asset ownership and business rules. Add missing UI, API and persistence only where the capability does not exist.

## Global experience

- One authenticated application shell, responsive navigation, account state, notifications and TL balance.
- Shared design tokens: background #0A0A0A, surface #1A1A1A, accent purple #8B5CF6, gold #F5A623, Pretendard/Inter.
- Consistent loading, empty, error, success, permission-denied and confirmation states.
- Every action must be connected to a real API or explicitly marked unavailable; no decorative/inert controls.
- Terms: 공유, 기여, 보상, 디지털 자산, 자산화. 판매/구매 only for TL charging.

## Page capability requirements

### Home — `index.html`
Global activity overview, asset summary by TL3/TL4/TLD/TLJ, recent activity, TL balance, shortcuts to unfinished tasks, creator/broadcast/ad highlights and onboarding state.

### SharePlace — `shareplace.html`
Discover/search/filter digital assets, asset-type filters, creator and asset detail, preview/playback where permitted, contribution/share action, TL amount and rights/usage terms, availability/ownership state, reporting and pagination. No free MP3 distribution path.

### My Library — `dashboard.html`
Owned/held/shared assets, type/status filters, search/sort, asset details, rights and history, TL balance/transactions, downloads or playback according to permissions, management actions and empty states.

### Creator Profile — `creator.html`
Public creator identity, biography, verified links/rights status, published assets, follow/unfollow, share profile and creator activity.

### Creator Studio — `creator-studio.html`
Asset registration for TL3/TL4/TLD/TLJ, private source-asset management, metadata/cover/preview, rights declaration and evidence, verification state, conversion/publication workflow, creator-defined TL contribution amount, publication history, edit/archive controls and validation errors. Source assets remain private; publication is through eligible TL asset packages only.

### Track — `track.html`
One complete workspace per music track: artwork and metadata, playback, contribution/usage terms, TL amount, rights/verification/publication status, likes, comments, share, creator follow, playlists, promotion/campaign entry, analytics and creator management. Preserve track-specific identifiers and social API contracts.

### TL3 Player / TLJ Viewer
Dedicated secure viewers with asset validation, permission/balance checks, playback/rendering, progress/error states and clear asset metadata. Do not expose private source assets or bypass contribution rules.

### TL Broadcast / Radio — `radio.html`
Browse broadcast channels/programs, live/on-demand state, player, schedule, channel details, favorites/follow, listening history and permitted participation.

### Cafe Broadcast — `cafe-radio.html`
Commercial broadcast catalog, station/program playback, permitted usage details, schedule and access checks.

### Cafe Management — `cafe-owner.html`, `cafe-channel.html`
Business verification, cafe/location registration, owner and staff access, subscription/usage status, channel setup, broadcast schedule, playback/device status, usage history and account management.

### In-car — `incar.html`
Vehicle registration and verification, vehicle-bound playback/session, permitted channel selection, safe simplified controls, bonus/reward status and playback history. No charging flow.

### DJ Center / Console / Guide
DJ eligibility/profile, channel/program management, playlists/queues, broadcast controls, audience/session stats, reward-share statements, rules and setup guidance. Console is operational; Center is overview; Guide is documentation.

### Advertiser / Campaign / Ads
Advertiser verification/profile, campaign creation/editing, creative upload, targeting, budget and schedule, placement selection, preview, submission/review status, performance analytics and billing/charge records. Admin-controlled approval and ad delivery APIs remain authoritative.

### Wallet / TL Economics / POC & TLC
TL balance, charge history, contribution/reward ledger, transfers where supported, TL↔TLC conversion/burn status, POC evidence and settlement history, clear rates and transaction states. Current unit rule: 1 second = 1 TL = KRW 1. Never invent or locally fabricate balances.

### Admin
Role-gated operations for users, assets, rights verification/disputes, publication, TL economy, ads/campaign approvals, cafe/DJ operations, reports, audit logs and system settings. Destructive actions require confirmation and audit trail.

### Authentication / onboarding / settings
Consistent sign-in/sign-up/session recovery, profile and security settings, locale, notification preferences and role-specific onboarding. Auth state must be shared across all pages.

## Definition of done per page

1. Correct global shell and responsive layout.
2. All required capabilities for that page are present.
3. Each visible control is wired to a real API/action; no fake buttons or hardcoded account data.
4. Existing API contracts and legacy data remain compatible unless a deliberate migration is added.
5. Loading, empty, error, success and permission states are implemented.
6. Page navigation, auth gating and role permissions work.
7. Automated source checks and available CI pass; runtime limitations are reported honestly.

## Implementation sequence

1. Inventory every public page, script, API call, DOM hook and role gate.
2. Build a single shell that does not collide with page-specific DOM.
3. Rebuild page layouts against the global design system while retaining functional hooks.
4. Complete each page against this contract, adding missing UI/API/persistence.
5. Run static checks and CI; fix regressions before merging.
