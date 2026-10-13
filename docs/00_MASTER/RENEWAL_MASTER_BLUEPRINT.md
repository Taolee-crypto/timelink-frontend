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
3. SharePlace still displays “무료 MP3” as a type filter. The “무료 MP3” filter is prohibited by the owner-confirmed policy. Remove it from the target UX; retain historical records only for controlled migration.
4. The dashboard has its own embedded navigation and wallet/mining/content tabs, while `wallet.html` is a separate page. Decide which is the canonical wallet experience after comparing actual data and working actions.
5. `sidebar.js` injects a sidebar and replaces an existing `aside.sidebar`; pages with their own sidebar/footer can therefore show different navigation behavior. A visual shell must not be applied globally until page-by-page compatibility is tested.
6. Creator upload is a multi-stage workflow using the local agent and several API calls. Keep the current upload implementation available while the renewed interface is tested.
7. Radio, DJ broadcasting, cafe channels and in-car channels are connected product areas. Do not reduce TL방송국 to a simple music-list page.

## 3A. Binding content and distribution policy — owner-confirmed

This section supersedes any conflicting legacy assumptions elsewhere in this audit or design branch.

1. **Only protected TL assets are distributable/shareable on TimeLink.** The four peer families are TL3 Audio, TL4 Video, TLD Document and TLJ Image/Visual.
2. MP3, MP4, PDF, JPEG/PNG and other ordinary source files are creator-side input materials only. They may be uploaded or selected inside Creator to produce a TL asset; they are not public SharePlace items and must not be offered as free downloadable/streamable content.
3. There is no free-content or free-playback product tier. Remove “무료 듣기”, “무료 MP3”, free filters, free release modes and free playback branches from the target product UX and new asset flows.
4. TL assets are consumed under the platform's TL time/usage authorization and accounting rules. Creator compensation is represented by the approved TL reward-token/settlement mechanism. Do not invent an alternative free-content reward path.
5. Legacy MP3/share rows and routes are historical compatibility data, not the target product model. Preserve their records for audit and migration, but do not treat them as permission to publish source files. Any legacy conversion, retirement or access restriction requires a controlled migration plan; never bulk-delete or silently rewrite records.
6. A creator's source file and the resulting TL asset are distinct objects. The source is private creator material; the generated protected TL container is the distributable asset. Source URLs must never be used as public player URLs.

### Current implementation gap — Creator must publish TL output, not source input

The current source audit found that `creator.html` creates a Share record containing the original Agent MP3 URL before TL3 release, while `creator-studio.html` explicitly offers a free MP3 publication branch. The backend SharePlace listing also includes verified/shared `tl_files` rows as MP3. These are legacy implementation paths and contradict the binding TL-only product policy. The renewal must change the lifecycle to private source import → protected TL container build → TL asset registration → TL-only publication. Raw source records remain private and are not SharePlace listings. This is a required architecture correction, not a cosmetic copy change.

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


## 10. Admin-controlled commercial policy — owner direction (2026-10-14)

The cafe-radio and in-car commercial rules already exist in the product history and source code. Do not ask the owner to choose these values again and do not replace them with newly invented pricing. The renewal must make approved policy values configurable through the Admin Control System while preserving the existing rules as the initial baseline.

### 10.1 Policy groups to expose to authorized administrators

**Cafe broadcasting**
- Cafe channel subscription / activation fee (existing baseline observed: 50,000 TL per 30-day period).
- Cafe contract listening rate multiplier (existing baseline observed: 0.5 relative to the standard rate).
- DJ / cafe / TimeLink revenue allocation (existing baseline: 50% / 30% / 20%).
- Preview eligibility and preview duration, only if preview remains permitted by the owner-approved TL-only policy. Do not reintroduce free public content or free playback.
- Contract-specific overrides, with clear precedence over global defaults.

**In-car broadcasting**
- Standard POC contribution multiplier (existing baseline observed: 1.0).
- Verified-vehicle POC contribution multiplier (existing baseline observed in the UI: 2.5).
- Vehicle verification requirements and re-verification interval.
- Driving/vehicle-session eligibility conditions for the additional multiplier.
- Activity reporting and anti-abuse thresholds.
- Any owner-approved activation incentive, kept separate from the usage-based POC multiplier.

The values above are recorded as observed historical baselines, not as proof that every value is currently enforced correctly by the backend. Before enabling administration, reconcile the frontend display, API request, server-side calculation, database writes and settlement records. In particular, do not treat a client-supplied vehicle multiplier or locally stored plate number as authoritative verification.

### 10.2 Admin configuration principles

1. **Central configuration:** commercial rules must be read from server-side configuration, not hard-coded independently in each page or route.
2. **Role protection:** only explicitly authorized administrator roles may view or change commercial policy. Ordinary users, DJs and cafe operators cannot change global rates.
3. **Validation:** enforce numeric bounds, currency/unit consistency, allowed multipliers, and a revenue-allocation total of exactly 100%. Reject invalid changes rather than silently normalizing them.
4. **Preview before activation:** show the current value, proposed value, affected services, and an example calculation before the administrator confirms a change.
5. **Effective time:** every change must have an explicit effective timestamp. New sessions/transactions use the policy version effective at their start or the clearly specified settlement boundary.
6. **Immutable history:** never rewrite historical charges, POC activity, contracts or creator settlements when a setting changes. Store the policy version and applied values with each relevant transaction or settlement.
7. **Audit trail:** record who changed what, old and new values, reason, timestamp, approval context and activation status. Support rollback by creating a new policy version; do not erase history.
8. **Safe rollout:** allow draft, preview, scheduled activation and rollback. A failed configuration update must leave the previous active version intact.
9. **Consistent enforcement:** the backend is authoritative. Frontend screens may display policy values but must not determine payable amounts, POC multipliers or revenue allocation.
10. **No silent economic changes:** changes to TL charges, POC contribution, TLC participation, creator rewards or revenue splits require explicit owner-approved policy and must not be bundled into visual redesign work.

### 10.3 Suggested Admin Control System sections

- Cafe Commercial Policy
  - Channel subscription fee and billing period
  - Cafe listening multiplier
  - DJ / cafe / platform allocation
  - Contract defaults and per-contract exceptions
- In-car Policy
  - Standard and verified-vehicle POC multipliers
  - Vehicle verification and eligibility rules
  - Driving-session validation and anti-abuse controls
  - Activation incentives, if approved
- Policy Versions & Audit
  - Current active version
  - Draft changes and calculation preview
  - Scheduled effective date
  - Change history and rollback
- Reconciliation Monitor
  - Frontend-displayed values versus server policy
  - Charge and settlement allocation checks
  - Vehicle verification versus awarded POC multiplier
  - Failed, duplicated or anomalous settlement events

### 10.4 Required reconciliation findings before implementation

The current audit found that the cafe contract data stores a 50/30/20 allocation, while the charge route appears to credit DJ 50% and platform 50%, with no corresponding cafe 30% credit in that charge path. This must be resolved before the Admin UI exposes the split as an active editable setting.

The in-car page displays 2.5x for a plate-registered vehicle and 1.0x otherwise, but the active activity-report path does not establish a trusted server-side vehicle verification and multiplier enforcement flow. The server must independently verify eligibility and calculate the POC contribution. A client-provided multiplier is never authoritative.

The cafe channel setup currently contains a 90-day trial path, and the cafe radio player contains a preview path. These must be reviewed against the owner-confirmed no-free-content/no-free-playback policy before being exposed as configurable options. Admin configurability must not be used to silently reintroduce a prohibited free tier.

### 10.5 Implementation boundary

This section is an architecture requirement only. It does not authorize changes to production code, live prices, active contracts, user balances, POC/TLC balances or existing settlements. Implement first in the design branch after the source/API/data audit; keep production unchanged until the owner explicitly approves the implementation and rollout.


## 11. Profitability protection and operating-rule engine — owner direction (2026-10-14)

The primary commercial objective is to prevent TimeLink from becoming structurally unprofitable. Admin controls must therefore enforce profitability rules, not merely expose editable prices or display financial statistics. The existing frontend administrator page is `public/admin.html`; extend this page and its existing navigation/panel architecture. Do not create a second admin application or replace the existing admin file.

### 11.1 Non-negotiable operating principles

1. **No loss-making new commitment by default.** Before a new product price, cafe contract, DJ arrangement, promotional campaign or reward rule becomes active, the server must calculate its expected economics. If the calculation is incomplete, uses stale cost data, or breaches the configured minimum contribution margin, activation is blocked pending an authorized exception.
2. **Protect existing customer and creator rights.** A new policy applies prospectively at its effective time. It must not retroactively change paid access, accrued creator earnings, accepted contracts, completed listening sessions or historical settlements.
3. **Separate economic ledgers.** Cash revenue/cost, TL balances and obligations, POC contribution, TLC issuance/treasury exposure, and creator/cafe/DJ payable amounts must be reported separately. Do not label token issuance, internal TL movement or gross TL consumption as cash profit.
4. **Measure platform-retained revenue.** Every service must show gross receipts, contractual distributions, creator/DJ/cafe payouts, payment/refund costs, infrastructure and delivery costs, reward liabilities, platform-retained revenue and contribution margin as distinct values.
5. **No client-side economic authority.** The backend calculates and enforces prices, discounts, eligible POC multipliers, reward amounts, revenue shares, reservations and settlements. Admin UI inputs are proposals only.
6. **Fail closed for new economic risk.** If the profitability engine cannot verify the required data, it must not activate a new price/reward/contract that can create an unbounded liability. It must preserve existing valid user rights and already-active policy.
7. **Owner-approved exception only.** Any deliberate below-floor campaign or strategic loss leader must have an explicit owner approval, budget cap, start/end time, maximum exposure and automatic expiry. It must never become an accidental permanent policy.

### 11.2 Profitability calculation model

For each product, channel, contract and campaign, calculate at least:

- Gross recognized revenue, separated by cash and TL-denominated receipts.
- Refunds, chargebacks, payment-processing fees and applicable taxes where known.
- Contractual allocations to creators, DJs, cafe partners and other rights holders.
- Creator reward accruals and other payable liabilities.
- Variable delivery costs: storage, bandwidth, streaming, Workers/API requests, external service charges and support costs where measurable.
- Fixed/allocated operating costs, shown separately from marginal costs.
- Net platform-retained revenue and contribution margin.
- Outstanding TL/TLC obligations and redemption/withdrawal exposure, separately from cash expenses.
- Data coverage and confidence: actual, estimated, missing or stale.

Use a consistent calculation vocabulary:
- `gross_revenue`: recognized gross revenue for the selected accounting basis.
- `direct_costs`: costs directly caused by the transaction or service.
- `contractual_payouts`: amounts owed to creators, DJs, cafe partners and other contractual recipients.
- `platform_contribution`: gross revenue minus refunds, direct costs and contractual payouts, with each component visible.
- `contribution_margin`: platform contribution divided by the applicable revenue base; show “not calculable” rather than inventing a value when the denominator or required cost data is missing.
- `fixed_cost_allocation`: separately allocated overhead used for full-cost profitability, not silently mixed into transaction-level direct costs.

The system must not assume that TL, TLC and KRW are interchangeable. The accounting basis and conversion rate used for any report must be explicit, timestamped and versioned. TLC mining/issuance is a token-economy exposure metric; it is not automatically cash revenue or cash expense. Any expected redemption, reserve or treasury exposure must be displayed as its own risk measure.

### 11.3 Hard guardrails before activation

The policy engine must evaluate these conditions on the server before a policy can become active:

- Required price, cost, allocation and settlement inputs exist and are current.
- All revenue-share percentages are valid and sum to exactly 100% for the applicable distributable base.
- The distributable base is explicitly defined by the contract; fees, refunds and taxes cannot be silently deducted or double-counted.
- The proposed policy meets the configured platform contribution floor and any applicable full-cost floor.
- Creator, DJ, cafe and reward liabilities are fully represented in the forecast.
- Per-user, per-contract, per-day and total campaign exposure caps are within approved limits.
- POC/TLC reward issuance and any redemption exposure remain within configured budgets and reserve constraints.
- The effective date, expiry (where applicable), policy version and rollback path are present.
- Existing contracts and in-flight sessions can continue under their recorded policy snapshot.

If any hard guardrail fails, the backend rejects activation and returns a human-readable reason plus the failed calculation. A warning alone is insufficient for a hard-floor breach.

### 11.4 Automatic protective actions

Use graduated responses so the platform can protect margin without breaking already-paid rights:

1. **Observe:** show actual-versus-forecast variance and data-quality warnings.
2. **Warn:** notify administrators when margin approaches its floor, costs spike, payouts exceed forecast or reward issuance accelerates.
3. **Require approval:** pause activation of proposed price reductions, higher rewards, new partner exceptions or campaigns until an authorized approver reviews the simulation.
4. **Cap exposure:** enforce approved per-user, per-contract, daily and campaign-wide limits.
5. **Throttle new commitments:** where a live policy is creating a verified loss, stop or limit new sign-ups, new campaign enrolments or new contract activations, subject to contract and legal review.
6. **Preserve existing rights:** do not abruptly terminate a paid session, confiscate balances, reduce already-accrued creator earnings or rewrite an accepted contract as an automatic response.
7. **Emergency freeze:** an authorized owner can freeze new economic policy activations while leaving read-only monitoring and valid existing service rights intact.

All automated actions must produce an audit event with trigger, measured values, policy version, action, timestamp and responsible system identity.

### 11.5 Scenario simulation required before policy changes

Every draft must show a side-by-side comparison of current active policy and proposed policy, including:

- Expected revenue and platform contribution per transaction/session.
- Creator/DJ/cafe distributions and TimeLink-retained amount.
- POC/TLC issuance or exposure, separately.
- Break-even utilization or listening volume.
- Low/base/high demand scenarios.
- Cost stress scenarios (for example, increased bandwidth, storage or API usage).
- Maximum liability under the proposed caps.
- Monthly and contract-term projections.
- Sensitivity to lower usage, higher usage and higher variable cost.

Scenario multipliers are simulation inputs, not claims about actual future demand. Missing cost inputs must be visibly marked and must prevent a policy from passing a hard profitability gate.

### 11.6 Existing Admin page integration — `public/admin.html`

Retain the existing admin shell, login flow, visual identity and current panels. Add a first-class navigation group named **수익성 통제** with these panels:

1. **수익성 대시보드**
   - Cash revenue, refunds/fees, direct costs, contractual payouts, platform contribution and margin.
   - TL circulation/consumption and outstanding obligations as separate indicators.
   - POC contribution and TLC issuance/treasury exposure as separate indicators.
   - Current alerts, data freshness and products/channels below the configured floor.
2. **상품·채널 손익**
   - TL3, TL4, TLD, TLJ, cafe broadcasting, in-car broadcasting, DJ programs and advertising.
   - Per-item price, cost basis, payout basis, platform-retained amount, margin and break-even point.
3. **상업정책 설정**
   - Cafe subscription fee/period and cafe listening multiplier.
   - DJ/cafe/TimeLink revenue split and contract overrides.
   - In-car standard/verified vehicle POC multiplier and eligibility.
   - POC/TLC reward budgets and approved activation incentives.
   - These controls edit a draft policy only; they do not write directly into live calculations.
4. **정책 시뮬레이터**
   - Current-versus-proposed policy comparison, low/base/high demand and cost stress.
   - Estimated contribution, payout, token exposure and maximum liability.
   - Explicit pass/fail result against configured guardrails.
5. **승인·예약·이력**
   - Draft, submitted, approved, scheduled, active, rejected and rolled-back states.
   - Approver, reason, effective time, expiry, previous/new values and immutable version history.
6. **정산 대사**
   - Expected versus actual DJ/cafe/platform distribution.
   - Creator payable accrual versus paid amount.
   - TL debit/credit consistency and duplicate/missing settlement detection.
   - POC eligibility versus server-calculated contribution.
   - TLC issuance versus recorded mining/treasury data.
7. **비용·한도 관리**
   - Storage, bandwidth, Workers/API, payment fees and external service costs.
   - Cost budgets, alert thresholds, exposure caps and data freshness.
   - Actual, estimated and missing cost data must never be visually conflated.

Existing panels remain in place:
- `revenue` remains the financial reporting view.
- `tl-flow` remains the TL movement/economy view.
- `payout` and `auto-payout` remain settlement operations.
- `cafe-mgmt` remains cafe channel operations.
- `infra` remains infrastructure usage/cost observation.
The new profitability layer consumes/reconciles these sources; it must not duplicate or silently redefine their accounting.

### 11.7 Roles, approvals and audit controls

- Separate read-only finance/operator access, policy editor, approver and owner-level emergency authority.
- A person who drafts a material economic change should not be the sole approver of that change.
- Require reason, affected products/contracts, simulation result and effective time for every proposal.
- Require step-up confirmation for changes to prices, payout splits, reward budgets, POC multipliers, TLC issuance parameters or withdrawal settings.
- Store immutable policy versions and per-transaction policy snapshots.
- Keep an append-only audit trail for proposal, approval, rejection, activation, freeze and rollback.
- Do not expose unrestricted SQL as the mechanism for normal commercial-policy editing. Existing SQL tools must remain separately permissioned and must not bypass policy validation.

### 11.8 Source audit issues to resolve before enabling live controls

The current `public/admin.html` already has financial, TL-flow, payout, cafe-management and infrastructure panels, but these are mainly reporting/operational panels and do not yet constitute a unified profitability gate.

The current admin page also contains legacy client-side credential comparison and browser-local session restoration patterns. Before relying on it for high-impact financial policy changes, verify and strengthen server-side administrator authentication, role checks, session expiry/revocation and endpoint authorization. Never treat hidden UI controls, local storage flags or client-side role checks as security boundaries.

Existing source-level findings still require reconciliation:
- Cafe subscription baseline is 50,000 TL per 30 days; confirm actual collection and renewal behavior.
- The stored DJ/cafe/platform allocation baseline is 50/30/20, while the observed charge path appeared to credit DJ 50% and platform 50%. Do not activate editable allocation controls until the actual settlement path is corrected and reconciled.
- In-car UI displays 2.5x POC for registered vehicles, but trusted server-side vehicle verification and multiplier enforcement have not been established.
- Existing trial/preview paths conflict with the owner-confirmed TL-only distribution and no-free-playback principles; do not expose them as free-tier policy switches.

### 11.9 Implementation sequence and safety boundary

1. Map every existing Admin panel to its API, backend route, database source and accounting meaning.
2. Establish a read-only profitability report using verified data; label estimates and gaps.
3. Reconcile cafe/DJ settlement, creator liabilities, in-car POC and infrastructure costs.
4. Define the policy schema, version snapshots, guardrail evaluation and simulation API.
5. Add the new panels to the existing `public/admin.html` shell.
6. Implement server-side enforcement and audit records only after tests prove the calculations.
7. Run simulations and test fixtures without touching real balances, live contracts or production settlements.
8. Enable live policy activation only after explicit owner approval and a rollback-tested release.

This design does not authorize production deployment, changes to current commercial values, live user balance changes, creator/DJ/cafe payout changes, POC/TLC issuance changes or automatic suspension of existing services.
