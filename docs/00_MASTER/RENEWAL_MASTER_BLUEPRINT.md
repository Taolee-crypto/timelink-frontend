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

## 12. Commercial broadcasting identity, ownership and access-control design — owner decision (2026-10-14)

Owner decisions incorporated:
- Cafe commercial account owner: the verified cafe/business owner (the natural person who controls the business account).
- Cafe employee accounts: permitted. Every employee uses their own personal TimeLink account and receives access only after the owner invites and approves them.
- In-car vehicle owner: the verified legal/authorized vehicle owner controls vehicle registration and grants/revokes driver access. A vehicle registration number is an identifier, never a login credential.

This section defines the target design. It does not authorize production code changes, database migrations, live verification, billing changes or deployment.

### 12.1 Identity model: one person account, multiple business/vehicle relationships

TimeLink must keep these concepts separate:

1. **Person account** — one natural person, authenticated with their own TimeLink credentials (currently email + password). A person may be a cafe owner, cafe employee, vehicle owner, authorized driver, DJ, creator and ordinary listener without creating separate accounts for each role.
2. **Business identity** — a registered business identified by country and business registration number, with legal name and verification status. The registration number identifies the business; it is not a username or password.
3. **Cafe location/channel** — a physical commercial premises and its authorized TL broadcasting endpoint. One business may own multiple locations/channels.
4. **Cafe membership** — an explicit relationship between a person and a business/location, with role, status, inviter and effective dates.
5. **Vehicle identity** — a vehicle record owned by a verified person, identified internally by a TimeLink vehicle ID and externally by a registration plate. The plate is not an account identifier or authenticator.
6. **Vehicle driver authorization** — an owner-approved relationship between a person and a vehicle, with status and validity dates.
7. **Broadcast entitlement** — a server-calculated permission to receive a commercial broadcast, derived from authenticated person + active membership/ownership + active contract/subscription + authorized device/session. Merely knowing a business number, channel ID or plate never grants access.

### 12.2 Existing implementation facts and gaps found in source

The following are source observations, not runtime or production verification:

- `public/login.html` authenticates with email and password through `POST /api/auth/login`. `public/signup.html` registers email, username and password through the existing email verification flow. This is the right common-account starting point; do not create separate cafe or vehicle login systems.
- `src/routes/auth.ts` returns a signed access token and a limited user object on login. `GET /api/auth/me` verifies the token and returns the person record. The current login response omits the user's role; renewed role-aware screens must obtain authoritative roles from the server, not infer them from local storage.
- `src/routes/cafe.ts` stores `owner_id` on `cafe_channels`, and channel creation sets it from the authenticated token's user ID. This is a useful ownership anchor to preserve.
- The cafe setup page asks for a business registration number and representative name. Current backend validation checks the number's format/checksum; the inspected verifier returns `verified: false` and contains a TODO for an external registry integration. A checksum-valid number must not be described as proof that the business is active or that the logged-in person is its owner.
- Cafe channel creation currently accepts a client-supplied `trial` flag and `trial_days`, and the page sends a 90-day trial. This is a legacy path that conflicts with the owner-confirmed no-free-content/no-free-playback commercial direction. Preserve records and existing contractual rights, but do not carry this client-controlled trial path into the renewed commercial signup flow. Any treatment of existing trial accounts requires a separately approved migration/transition plan.
- The existing `cafe-owner.html` screen has a local-storage-only login guard and illustrative hard-coded dashboard figures. It is a visual starting point, not a secure owner portal or a verified live account dashboard.
- `public/incar-channel.html` currently sends `owner_id` and `car_plate` from the browser, makes a separate SQL-based TL deduction request, then calls `/api/incar/channel`. The browser-provided owner ID must never establish ownership. The inspected frontend does not prove that the vehicle owner or plate is verified by the server. The exact current backend implementation of `/api/incar/channel` was not located in the inspected backend paths; it must be located and audited before implementation.
- `public/admin.html` is the existing Admin Console and already has user, cafe channel, DJ, security, revenue and infrastructure panels. Keep and extend this page. Its login script contains a browser-side hard-coded credential gate before calling the normal login API; remove that pattern in the admin renewal. The backend admin route already checks the authenticated user's database role for protected admin SQL. Every admin endpoint must independently enforce the role; hiding a menu is not authorization.

### 12.3 Cafe commercial registration and login journey

**A. First-time owner onboarding**
1. The person creates or uses their normal TimeLink account and signs in with email/password (or a supported stronger authenticator). Do not ask the person to use the business registration number as their login ID.
2. From TL Broadcasting Station, the person chooses **Cafe Broadcasting → Register a business / store**.
3. The person enters business country, business registration number, legal business name, representative name, store name, store address and contact details. Collect only fields required for verification, contract and service.
4. The server normalizes and securely stores the business identifier. It performs real registry verification through an approved provider/API or a documented manual review. Until that succeeds, status is `pending_verification`; checksum/format success alone is `format_valid`, not `verified`.
5. The system verifies that the logged-in person is the business owner or an explicitly authorized representative. For an individual proprietor this may require identity-to-business matching; for a corporation it may require representative authority evidence. Record the evidence type, verifier, time and outcome, and retain only what is necessary.
6. On successful verification, create/confirm the business owner membership and register one physical cafe location. Each location receives its own channel identity and device authorization.
7. The owner reviews and accepts the commercial channel agreement and pays the active Admin-configured subscription fee. Initial observed baseline remains 50,000 TL / 30 days; this is not changed by this design.
8. The backend activates the location's broadcast entitlement only after owner verification, agreement, successful billing and channel status checks all pass.

**B. Returning owner login**
1. The owner signs in through the same `login.html` / `/api/auth/login` personal account flow.
2. The server returns the person's active memberships and role claims through an authenticated profile/permissions endpoint.
3. The owner opens **My Commercial Services → Cafe Broadcasting** and selects a business/location. No second password or business-number login is required.
4. Owner-only operations (contract, billing, store details, employee invitations, transfer/closure) require server-side owner permission and recent re-authentication for high-risk changes.

**C. Employee invitation and use**
1. The owner enters an employee's email address and selects the store(s) and allowed operational permissions.
2. The server creates a time-limited, single-use invitation bound to that business/location and the intended email. The employee accepts while signed in to their own TimeLink account; if they have no account, they complete ordinary signup first.
3. The owner can revoke access immediately. Employee removal must invalidate active cafe sessions/device authorizations for that membership.
4. An employee signs in normally, chooses the assigned store, and can operate the authorized broadcast receiver. The employee cannot change the owner, business identity, contract, subscription, payment method, revenue policy or add other employees by default.
5. Employees do not share the owner's login. A staff account is a person account with a scoped permission grant, not a sub-password under the owner.

### 12.4 Cafe roles and permission matrix

| Action | Business/location owner | Invited employee | TimeLink admin |
|---|---:|---:|---:|
| View assigned store and current broadcast | Yes | Yes | Support/audit |
| Start, stop and control authorized receiver | Yes | Yes | Support only |
| View basic operational status | Yes | Yes | Yes |
| Invite/remove employees | Yes | No by default | Exceptional support |
| Register another location | Yes, after business checks | No | Review/support |
| Accept/renew/cancel commercial agreement | Yes | No | Admin policy only |
| Manage billing and TL payment | Yes | No | Controlled support |
| Transfer business ownership / close channel | Yes, verified workflow | No | Reviewed workflow |
| Change global pricing, POC, TLC or revenue split | No | No | Explicitly authorized admin only |

Permission model:
- Roles: `cafe_owner`, `cafe_staff`; keep the global platform role `admin` separate.
- Fine-grained permission keys: `cafe.broadcast.view`, `cafe.broadcast.control`, `cafe.members.manage`, `cafe.location.manage`, `cafe.contract.manage`, `cafe.billing.manage`.
- Staff defaults are view + broadcast control only. Any future delegated manager role must be a separately approved policy, not silently inferred.
- The owner must always retain an ownership recovery/transfer path; an employee must never be able to promote themselves or another person to owner.

### 12.5 Cafe receiver/device authorization

Commercial broadcast access must be bound to a registered physical location, not merely to the owner's ability to log in.

1. The owner registers a receiver/device from the selected cafe location.
2. The service issues a short-lived pairing code. The receiver completes pairing after an owner or authorized staff member confirms the location.
3. The backend stores a device record linked to the location, its status, last-seen time and revocation state. Use a device-bound secret/key where supported; do not trust a browser-supplied `location_id` alone.
4. At playback start and during the session, the server checks: authenticated person, active location membership, active channel contract/subscription, approved device, permitted content, and valid TL authorization/accounting.
5. Owner revocation, employee removal, contract expiry or device revocation blocks new sessions and terminates/rejects subsequent heartbeats. Do not silently erase completed usage or settled records.
6. Do not rely on IP address or GPS as the sole proof of a cafe location. They may be risk signals, not the ownership credential.

### 12.6 In-car vehicle owner registration and driver access

**A. Vehicle owner onboarding**
1. The person signs in through their ordinary TimeLink account.
2. They open **TL Broadcasting Station → In-car Broadcasting → Register my vehicle**.
3. They enter the vehicle plate, vehicle category and required ownership/authorization evidence. Plate normalization is server-side.
4. The backend verifies the registrant's ownership or lawful control through an approved vehicle verification provider or documented manual review. A plate format check or possession of the plate number is not ownership proof.
5. On approval, create an internal `vehicle_id` and bind it to the verified `owner_user_id`. The plate is a protected lookup attribute, not the account ID.
6. The owner can register multiple vehicles under the same TimeLink account, subject to the platform's verification and risk limits.

**B. Authorized driver**
1. The owner may invite another TimeLink user as an authorized driver by account/email.
2. The invited driver accepts the vehicle-specific permission. The owner can revoke it at any time.
3. A driver signs in with their own personal account, selects the authorized vehicle and starts in-car listening through the phone/Bluetooth flow.
4. The driver receives only the permissions explicitly granted. They cannot transfer ownership, change vehicle verification, add other drivers or manage the owner's commercial account.
5. Rental/company/family vehicles require an authorization path appropriate to the actual lawful user; do not assume the registered owner is always the driver.

**C. POC eligibility**
- Keep the observed 1.0x standard and 2.5x verified-vehicle POC multipliers as historical policy baselines only. This design does not change them.
- The 2.5x is a POC contribution multiplier, not a TL credit, TL discount, cash payment or automatic vehicle registration reward.
- The server, not the browser, determines whether the vehicle is verified and whether a listening session qualifies for the additional multiplier.
- A qualifying session must bind authenticated driver + verified vehicle + active driver authorization + valid TL listening session + plausible activity/heartbeat evidence. Reject client-supplied `owner_id`, `poc_mult` or local-storage plate as authority.
- GPS/speed data can be spoofed. Apply reasonable plausibility checks, rate limits, replay protection and anomaly review; do not describe GPS alone as tamper-proof vehicle verification.
- Owner-approved activation incentives, if any, must be accounted for separately from usage-based POC multipliers.

### 12.7 Suggested data model (additive migration; preserve legacy records)

Use stable internal IDs and foreign keys. Names below are logical design names; reconcile against the actual D1 schema before writing migrations.

- `businesses`: `id`, `country`, normalized/encrypted registration number or keyed lookup hash, `legal_name`, `verification_status`, `verified_at`, `verification_provider`, `created_at`.
- `business_members`: `business_id`, `user_id`, `role`, `status`, `invited_by`, `accepted_at`, `created_at`. Enforce one active owner per business unless a reviewed ownership-transfer workflow explicitly permits a transition.
- `cafe_locations`: `id`, `business_id`, `name`, `address`, `status`, `created_at`.
- `cafe_location_channels` or additive columns on `cafe_channels`: map existing `channel_id` to a location while retaining existing `owner_id` and identifiers for compatibility.
- `cafe_location_members`: `location_id`, `user_id`, `role`, `permissions`, `status`, `invited_by`, `valid_from`, `valid_until`.
- `cafe_device_authorizations`: `id`, `location_id`, `device_id`, `device_key_hash`, `status`, `paired_by`, `paired_at`, `last_seen_at`, `revoked_at`.
- `vehicle_registrations`: `id`, `vehicle_id`, `owner_user_id`, protected plate fields, `verification_status`, `verification_method`, `verified_at`, `status`, timestamps.
- `vehicle_driver_authorizations`: `vehicle_id`, `driver_user_id`, `granted_by`, `status`, `valid_from`, `valid_until`, `revoked_at`.
- `commercial_invitations`: opaque token hash, intended email, target business/location/vehicle, role/permission set, expiry, accepted/revoked timestamps.
- `commercial_audit_events`: actor, action, target, before/after metadata, reason, timestamp and request/session reference. Avoid storing raw identity documents or full plate/business identifiers in general-purpose logs.

Migration principles:
- Existing `cafe_channels.owner_id` remains the legacy owner link and is backfilled into owner membership only after verifying that the referenced user is valid.
- Existing `biz_reg_num` values are not automatically marked verified. Re-run real verification or leave pending/manual-review status.
- Do not infer staff or vehicle-owner relationships from localStorage, browser payloads, channel IDs or plate values.
- Preserve old channel, contract, transaction, POC and settlement records. New relationships are additive and auditable.

### 12.8 Admin Control System extension — keep `public/admin.html`

Extend the existing Admin Console panels and navigation; do not create a parallel admin app.

Add these panels under the existing business/operations area:
1. **Business verification** — pending/verified/rejected business claims, masked registration number, verification source, representative evidence status, reviewer and timestamps.
2. **Cafe locations & channels** — business-to-location-to-channel mapping, owner, subscription status, expiry, receiver devices and operational status.
3. **Cafe members & invitations** — owners and staff, invitation state, location scope, granted permissions, expiry and immediate revocation.
4. **Vehicle registry** — masked plate, internal vehicle ID, owner, verification method/status, driver authorizations, risk flags and revocation.
5. **Commercial access audit** — owner/staff/driver login and permission changes, pairing events, denied playback attempts, session termination and administrative overrides.
6. **Entitlement diagnostics** — explain which condition granted or denied a cafe/in-car session: identity, membership, verification, contract, device, TL balance/authorization and policy version.
7. **Commercial policy** — reuse the already specified admin-controlled fee, POC multiplier and revenue-share policy panels; global policy editing remains separate from business/member administration.

Admin security requirements:
- Remove browser hard-coded email/password comparisons from `admin.html`. Authenticate through the existing account API and require the server-confirmed `users.role='admin'` (or a narrowly scoped authorized admin permission).
- Add an authenticated `/api/auth/me` or dedicated admin-session response that returns authoritative role/permission claims. Do not trust `tl_user`, `tl_adm`, `tl_adm_token` or any localStorage role flag.
- Every admin API route independently validates token, current account status and admin permission. Frontend route hiding is convenience only.
- Commercial verification review, ownership transfer, manual overrides and policy changes require distinct permissions and audit records.
- Replace free-form SQL for normal business operations with typed, narrowly scoped endpoints. Keep any emergency SQL facility separately restricted, audited and unavailable to business owners/staff.
- Admin account recovery, session expiry/revocation, recent re-authentication for sensitive operations and audit-log review are required before opening the new admin controls.

### 12.9 API boundaries and server-authoritative checks

Proposed API surface (names illustrative until reconciled with current route contracts):
- `GET /api/me/permissions` — current person, platform roles and active commercial memberships.
- `POST /api/businesses` / `POST /api/businesses/:id/verification` — claim and verify business.
- `POST /api/businesses/:id/locations` — create a cafe location.
- `POST /api/cafe/locations/:id/invitations` — owner invites staff.
- `POST /api/cafe/invitations/:token/accept` — invited employee accepts.
- `GET /api/cafe/locations/:id/members` / `DELETE /api/cafe/locations/:id/members/:userId` — owner manages membership.
- `POST /api/cafe/locations/:id/devices/pair` and `POST /api/cafe/devices/:id/revoke` — location receiver pairing/revocation.
- `POST /api/vehicles` / `POST /api/vehicles/:id/verification` — owner vehicle registration/verification.
- `POST /api/vehicles/:id/drivers/invitations` / `POST /api/vehicles/:id/drivers/:userId/revoke` — driver authorization.
- `GET /api/admin/commercial/*` and `POST /api/admin/commercial/*` — authorized admin review, diagnostics and policy controls.

For every request, the backend derives the acting user from the verified token and checks the target relationship from the database. Never accept a client-supplied `owner_id`, `role`, `verified`, `poc_mult`, fee, revenue split or entitlement as authoritative. Billing and channel creation must be one server-controlled operation with validated amount, idempotency key, balance check, ledger entry and resource activation; do not issue a separate browser-generated SQL debit.

### 12.10 Delivery sequence and acceptance criteria

1. **Inventory and threat review:** locate the live `/api/incar/channel` implementation, inspect every cafe/in-car/admin endpoint, schema, auth helper and deployment branch. No code changes.
2. **Common account/permission foundation:** role-aware `/me` response, server-side permission helpers, session invalidation/re-authentication plan. Existing email/password login remains the common entry point.
3. **Cafe business verification:** business claim, owner verification, location mapping and additive migration/backfill. Existing channel IDs and owner links remain compatible.
4. **Cafe employee access:** invitation/acceptance, location-scoped staff permissions, revocation and receiver pairing.
5. **Vehicle ownership:** vehicle registration and verification, owner binding, driver invitations and revocation.
6. **In-car entitlement and POC audit:** server-derived owner/driver/vehicle/session eligibility, authoritative POC multiplier and anti-replay/risk controls.
7. **Admin extension:** add the business, cafe-member, vehicle, audit and entitlement panels to the existing `admin.html`; harden admin authentication and replace operational SQL calls with typed endpoints.
8. **Staged rollout:** test with synthetic accounts and non-monetary fixtures; do not debit real TL, mint/award real POC/TLC or change existing subscriptions during tests. Run migration in dry-run first, compare counts and preserve rollback.
9. **Release gate:** owner review, security review, end-to-end tests, data reconciliation and explicit deployment approval.

Acceptance criteria:
- A business number or vehicle plate alone can never log a user in or authorize playback.
- One personal TimeLink account can own/manage multiple businesses/locations and vehicles without duplicate logins.
- A cafe owner can invite and revoke employees; employees use their own accounts and cannot access unassigned stores or owner-only actions.
- Only the verified vehicle owner can grant/revoke driver access; drivers use their own accounts.
- Cafe broadcast is denied if owner/business verification, membership, active contract, device authorization or TL entitlement is invalid.
- In-car access and any 2.5x POC contribution are computed by the server from verified relationships and eligible sessions, never from client-supplied IDs or localStorage.
- Admin pages and APIs enforce server-side role permissions; no hard-coded frontend credentials or client-side admin sessions remain.
- Existing records, contracts, balances, POC/TLC history and settlements are preserved; all changes are prospective, versioned and auditable.
- No production changes, real-balance tests, policy edits, PR merge or deployment occur without the owner's explicit approval.

## 13. Owner policy update — cafe location-gated broadcast and promotional in-car service (2026-10-14)

This section records the owner's latest business decisions and takes precedence over any conflicting in-car charging assumptions in earlier sections. It supplements Section 12; it does not authorize production implementation or deployment.

### 13.1 Cafe: verify registered store location at login and gate broadcast playback

Owner decision: cafe access must be checked against the registered physical store address/location when a user logs in.

Target behavior:
- The cafe business and its physical store address are registered and verified before commercial broadcasting is activated.
- When an owner or invited employee signs in and selects a cafe location, the service checks whether the login/device location is consistent with that store's registered location.
- Broadcast-control and playback entitlement is granted only when the user has an active membership for that exact store, the store's commercial channel is active, the receiver/device is authorized, and the location check passes.
- An employee assigned to Store A must not receive Store B's broadcast entitlement merely because both stores belong to the same business.
- The owner may manage account-level business information, staff invitations and contracts remotely if authenticated and authorized. However, starting or receiving the commercial cafe broadcast is location-gated to the registered premises. This distinction avoids locking an owner out of legitimate remote administration while enforcing the owner's location policy on actual commercial playback.
- Location checks should use an appropriately permissioned device location signal and a configurable geofence around the registered address. Store coordinates, geofence radius, accuracy threshold, check time and result should be recorded as minimal audit metadata. Do not expose precise location histories unnecessarily.
- GPS is not cryptographic proof and can be spoofed. Use it as a location gate/risk signal with device/session binding, freshness and accuracy checks, anomaly detection and, where practical, an approved fixed receiver/device at the premises. Do not claim GPS alone guarantees physical presence.
- If location permission is denied, location is stale/inaccurate, or the device appears outside the permitted area, deny commercial broadcast playback/control and show a clear recovery instruction (enable location, move to the registered premises, or contact the owner/admin to correct the registered address). Do not silently bypass the check.
- A registered address change requires owner authentication and an auditable verification/update workflow. The backend, not browser-supplied coordinates or a client-side distance calculation alone, makes the final entitlement decision.
- Admin controls may configure geofence radius and accuracy thresholds within approved bounds. Changes are versioned, audited and prospective.

### 13.2 In-car: promotional service with no user TL charge

Owner decision: in-car broadcasting is a promotional/acquisition service and must not charge the listener for use.

Consequences:
- Remove/disable any in-car listener TL-per-second deduction, listening fee, subscription charge or automatic balance debit from the target in-car user journey.
- Do not require TL balance or a TL recharge merely to listen to in-car broadcasts.
- Do not run a client-side SQL debit or any equivalent billing operation for in-car listening.
- Keep personal TimeLink login and vehicle-owner registration/verification as identity, safety and eligibility mechanisms, not as billing prerequisites.
- In-car promotional listening still uses protected TL assets and the common content-protection/time-authorization infrastructure. Promotional pricing means the listener charge is zero; it does not mean that ordinary unprotected source files become public or that the TL-only distribution rule is removed.
- Treat in-car as a promotional distribution channel whose campaign costs, content rights and creator/platform compensation must be explicitly funded and accounted for separately. Zero listener charge must not silently create unbounded creator liabilities or unpaid third-party rights.
- The previously observed vehicle channel setup amount of 20,000 TL and any other in-car channel/registration fees must be reviewed separately. The owner's decision explicitly removes charges for in-car use/listening; do not assume that every possible owner-side setup fee is automatically waived without confirmation. Do not charge listeners.
- The earlier 2.5x vehicle POC multiplier was a contribution multiplier, not a TL charge. This no-charge decision does not by itself cancel or alter that POC rule. Keep it unchanged as a separate policy pending any explicit owner change; if retained, calculate eligibility server-side and account for promotional campaign exposure.
- Admin must be able to view promotional listening volume, TL charges (expected zero), content/rights cost, creator compensation, POC issuance and campaign exposure. Add a hard guardrail that blocks any in-car listener debit in the promotional mode.

### 13.3 Admin and implementation updates

Extend the existing `public/admin.html` and central server-side commercial policy configuration:
- Cafe location policy: verified address, geofence coordinates/radius, location accuracy/freshness thresholds, permitted receiver devices, per-store status and location-check audit.
- Cafe exception handling: address correction, temporary location outage, device replacement and reviewed manual override. Any override is time-limited, permission-gated and audited; it must not become a permanent hidden bypass.
- In-car promotional mode: listener price fixed at zero, no listener TL debit, campaign budget/exposure limits, creator/rights funding visibility and POC accounting.
- Separate listener pricing from owner-side channel setup or other business fees. Any owner-side in-car fee change requires a separate explicit owner decision.
- Keep the existing cafe 50,000 TL / 30-day subscription baseline and DJ/cafe/platform revenue-share policy unchanged unless separately approved. Cafe location gating does not itself change these amounts or shares.

### 13.4 Updated acceptance tests

- A cafe owner/staff member with a valid account but outside the registered store geofence cannot start or receive that store's commercial broadcast.
- The same user inside the registered location, with valid store membership, active contract and approved device, can receive the broadcast.
- A staff member assigned to one store cannot access another store without a separate membership and location check.
- Remote owner administration may remain available, but remote cafe broadcast playback is denied by default.
- Location denial, stale location and poor accuracy fail closed for commercial playback and produce a useful user-facing explanation.
- In-car listener playback creates no TL debit, no subscription charge and no balance requirement.
- In-car still distributes only protected TL assets; promotional zero-price access does not expose source files or create free public MP3/MP4/PDF/JPEG distribution.
- The POC multiplier remains a separate accounting rule unless the owner explicitly changes it.
- No owner-side vehicle setup fee is changed by implication; it must be decided separately.
- Admin reports show zero in-car listener TL charges and separately expose campaign/rights/creator/POC costs.



## 14. Music score generation and protected score distribution — existing timelink-score project (2026-10-14)

The owner identified downloadable sheet music as a missing music-sector revenue model and confirmed that an existing repository, `Taolee-crypto/timelink-score`, contains the earlier implementation work. This is an existing product capability to recover and integrate, not a greenfield feature.

### 14.1 Product role within TimeLink

- Music scores are a distinct creator product and revenue stream within the TL3 music ecosystem. They are not merely an attachment or a free extra supplied with an audio track.
- The platform should support both manually supplied score material and AI-assisted score generation, subject to rights and quality review.
- The score workflow belongs in Creator Studio / music creation tools; published and purchasable score assets must be discoverable in SharePlace and the creator's asset/earnings views.
- Score products must retain their own title, composer, arranger, lyricist, publisher/rights holders, version, instrumentation, difficulty/key metadata, preview policy and creator-defined commercial terms where applicable.
- The score catalog should connect a score to its related TL3 audio work when the rights and relationship are confirmed, without making the score dependent on purchasing or listening to that audio.

### 14.2 Existing timelink-score repository — observed baseline

Repository: https://github.com/Taolee-crypto/timelink-score (default branch: `main`; observed project version: `0.1.0`).

The README and architecture documents describe a Python extension that accepts a TL3 audio asset and aims to produce MusicXML and PDF notation. The repository contains modules for:
- TL3/TLNK header parsing and sequential segment retrieval;
- PCM assembly and Demucs vocal separation;
- melody/pitch extraction and MIDI conversion;
- chord and key analysis;
- MusicXML score construction and MuseScore PDF rendering;
- rights attribution and score-data embedding/packing;
- command-line scripts, examples and a limited set of tests.

The documented pipeline is TL3 header → sequential audio segments → temporary PCM processing → optional vocal separation → pitch/MIDI and chord/key analysis → score generation → rights attribution → PDF rendering. Its documentation states that audio segments are processed in memory and discarded, with sequential segment requests and TL accounting.

The repository's README still marks most roadmap steps as incomplete. The existence of modules and tests is not proof that the complete pipeline, current backend API integration, score accuracy, PDF rendering or production download flow works. Resume with a source audit and controlled test plan; do not represent the project as production-ready until verified.

### 14.3 Protected score asset and download lifecycle

The target lifecycle must follow TimeLink's binding TL-only distribution policy:
1. A creator imports or selects authorized source audio/material inside Creator. Ordinary source files remain private creator-side inputs and are never published as public SharePlace assets.
2. The score-generation service processes an authorized input. If it consumes a TL3 asset, it must use the approved TL authorization/accounting path and disclose any TL consumption before the operation starts. If a private creator-side source-input path is supported, it must remain private and must not become a public raw-file endpoint.
3. Generated MusicXML, MIDI, PDF and intermediate analysis files are working/output materials inside the controlled creator workflow. They are not automatically public downloadable files.
4. After creator review and rights confirmation, the approved score is packaged and registered as a protected TLD document asset using the common TimeLink content identity, protection, authorization and accounting core.
5. SharePlace publishes only the protected TLD score asset. A user purchases/authorizes access under the score's explicit commercial terms and receives the authorized protected-TL delivery/viewing experience. Never expose a public raw PDF, MusicXML or MIDI URL as the product download.
6. The creator's score sales/usage and reward-token settlement appear separately and clearly in EARN, while the score appears in My Assets and the user's authorized/owned collection.

A protected score download is therefore a TLD distribution transaction, not an exception to the TL-only rule. The human-facing product may be called “악보 다운로드”, but the distributed object remains a protected TL asset. The exact post-download usage model (time-limited access, repeated viewing, offline entitlement, printing/export permission and any re-download rules) must be specified explicitly; do not silently equate possession of a file with unlimited usage rights.

### 14.4 Score-generation quality and rights safeguards

- Treat AI-generated notation as a draft requiring creator review. Pitch extraction from a mixed recording can be imperfect; accompaniment, polyphony, expressive timing, tuning, percussion and vocal ornaments can produce errors.
- Support separate outputs/editions where feasible: melody line, chord chart/lead sheet, vocal melody with lyrics, piano arrangement and full score. Do not promise full multi-instrument transcription accuracy until measured.
- Preserve source-work identity and version lineage. Revisions must create traceable score versions rather than overwrite previously sold editions without an explicit update policy.
- Carry composer, arranger, lyricist, publisher, co-creator and other rights metadata into the protected TLD header/manifest and visible score attribution as applicable. An ISRC identifies a sound recording; it must not be treated as a substitute for score/work identifiers or complete composition rights metadata.
- Require the uploader to attest to authority to create, adapt, publish and sell the score. Flag third-party recordings and disputed/unclear rights for review; possession of an audio file alone does not establish score rights.
- Keep temporary PCM and other source-derived working data within the approved processing boundary. Reconcile the repository's documented temporary-output behavior with the current creator-storage, privacy and TL-consumption rules before enabling the service.

### 14.5 Commercial model and Admin controls

- Score creators should be able to set or select the approved commercial terms for each score edition, subject to platform rules. The score detail page must clearly show the price/authorization terms before confirmation.
- Record gross score transactions, platform fee, creator/rightsholder allocation, refunds/reversals, taxes where applicable and reward-token settlement as separate ledger facts. Never infer a score payout from the audio-track payout.
- Keep score pricing, platform fee, rightsholder splits, preview permissions, printing/export permissions, refund rules and campaign discounts as versioned Admin-controlled policies.
- No exact score price, fee percentage, revenue split, preview duration or offline/printing permission is approved by this section. These values require a separate owner decision and profitability review; do not invent defaults or alter existing audio/cafe/DJ economics.
- Admin reporting must distinguish TL3 audio revenue from TLD score revenue, show generation/processing costs, rights liabilities, refunds and creator settlement, and flag transactions that cannot be reconciled.

### 14.6 Integration and recovery sequence

1. Audit the full `timelink-score` source, commit history, tests, dependency versions, model downloads, CLI behavior, TL3 segment API assumptions and all temporary-file paths.
2. Verify the current TL3 container and segment API contract against the live backend source. The repository's integration document describes a specific API and AES-GCM segment layout; treat these as project assumptions until matched to the current authoritative implementation.
3. Run tests with synthetic/non-commercial fixtures first. Do not consume real user TL, publish assets, write production records or trigger creator payouts during recovery testing.
4. Establish a reproducible local pipeline and measure score quality on a curated set of creator-authorized recordings. Record failure modes and human correction time.
5. Define the Creator Studio workflow: source selection → rights declaration → generation consent/TL estimate → processing progress → score editor/review → edition metadata/pricing → protected TLD packaging → publication.
6. Define TLD score viewing/download authorization, versioning, re-download, printing/export and settlement APIs with the common Time Core. Keep the score-generation engine modular and separate from SharePlace distribution.
7. Add SharePlace score discovery, score detail, authorized download/access history, My Assets and EARN reporting only after the TLD lifecycle and economics are approved.
8. Keep the existing repository intact while auditing and recovering it. No production code, database migration, economic setting, repository rewrite, merge or deployment is authorized by this design entry.

Acceptance criteria:
- A creator can generate or upload a score draft without exposing source audio or raw score files publicly.
- Rights and attribution are visible, complete enough for the declared work, and bound to the protected score asset.
- Only protected TLD assets are listed and distributed through TimeLink.
- The score's commercial terms and any generation TL consumption are disclosed before confirmation.
- A user without valid score entitlement cannot obtain the protected score payload through a raw public URL.
- Creator sales, platform fees, rights allocations, refunds and reward-token settlements reconcile independently from TL3 audio transactions.
- The restored pipeline passes automated tests and measured human quality review before production activation.
