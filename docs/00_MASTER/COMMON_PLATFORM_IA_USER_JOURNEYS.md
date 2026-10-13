# TimeLink Common Platform IA & User Journey Specification

**Date:** 2026-10-14  
**Status:** Design specification — documentation branch only; no production code changed  
**Branch:** `docs/master-architecture-audit-20261014`  
**Inputs:** Existing frontend inventory, master renewal blueprint, four-family functional matrix, and owner-provided UI brief `붙여넣은 텍스트(1).txt`

## 1. Product definition

TimeLink is a unified time-based digital-asset platform. It is not a music-only service and not merely a file marketplace.

A single account can create, own, publish, discover, consume, authorize, and earn from four equal asset families:

- **TL3 — Audio:** music, voice, spoken-word, sound works.
- **TL4 — Video:** video works, films, clips, moving-image content.
- **TLD — Documents:** PDF, e-books, scores, text and other document assets.
- **TLJ — Images / Visual:** photographs, illustrations, graphics and visual collections.

All four families use the same platform identity and shared time/economy core. Family-specific creation tools and viewers are separate where required, but none of the four is subordinate to TL3.

## 2. Non-negotiable design principles

1. One account and one identity across all asset families and roles.
2. Four equal asset families, always visible as first-class choices.
3. A common time core for authorization, metering, protection, integrity/rights, TL accounting and creator settlement.
4. TL, TLC and POC remain distinct concepts and balances. Do not merge, rename or simplify their existing business rules as a UI exercise.
5. Preserve the owner's current TL unit policy: **1 TL = 1 KRW**, subject to the platform's actual ledger and payment implementation.
6. Preserve the tested POC/TLC mining capability. UI renewal must not alter mining calculations, wallet contracts or on-chain behavior.
7. Preserve current URLs, records, API contracts, storage links, local-agent upload paths and working legacy journeys while renewed screens are tested separately.
8. Do not infer an asset family from a filename extension alone. Use validated asset metadata and container identity; keep legacy compatibility.
9. Never represent demo figures or sample activity as live user data. Empty, loading, unavailable and error states must be explicit.
10. No production code, schema, file format, pricing policy, mining rule or route change is authorized by this document.

## 3. Global application structure

### 3.1 Entry experience

The first application screen is the TimeLink branded sign-in / sign-up experience, as requested by the owner.

- TimeLink logo and brand statement: “시간을 창작하고, 가치를 연결하세요”.
- Email and password sign-in.
- Primary actions: 로그인, 회원가입.
- Google sign-in and TON wallet connection only where the corresponding existing authentication flow is verified.
- Password recovery, terms, privacy and support links.
- Clear validation, loading, failure and retry states.

After successful authentication, the user enters the signed-in TimeLink home. Public landing/investor/B2B content may remain separately accessible through its existing route; it must not displace the requested branded account-entry experience without owner approval.

### 3.2 Signed-in application shell

**Desktop**
- Top utility bar: TimeLink logo, global search, TL balance, TLC balance, notifications, profile.
- Left navigation: mode switch plus stable platform destinations.
- Main canvas: current page content.
- Optional right rail: verified recent creator rewards, activity or recommendations. Hide it when no trustworthy data is available.
- Persistent mini-player only when an active audio session exists; it must not obstruct other family viewers.

**Mobile**
- Compact top bar with logo, search and account/balance access.
- Navigation via drawer or bottom navigation; do not compress the desktop sidebar into a narrow screen.
- Primary actions and current asset viewer remain reachable without horizontal scrolling.
- Player controls appear only when relevant and must coexist with video/document/image viewers.

### 3.3 Mode switch

The owner-provided concept of **“듣기 | 만들기”** is retained as a mode switch, not as two separate accounts or two separate platforms.

- **듣기 / Explore mode:** discover and consume assets; access SharePlace, channels and listening/viewing/reading experiences.
- **만들기 / Creator mode:** create/register assets, manage owned assets, review earnings and rights, and access creator tools.

The mode switch changes navigation emphasis and home actions only. It does not hide ownership, wallet, consumption history, notifications or the other asset families.

## 4. Proposed navigation hierarchy

The final menu must be reconciled against current `sidebar.js`, page-specific navigation, and working routes before implementation. The following is the target information architecture, not an instruction to replace the current sidebar immediately.

### Global
- 홈
- 탐색 / SharePlace
- 자산 유형별 바로가기: TL3 오디오 · TL4 비디오 · TLD 문서 · TLJ 이미지
- 지갑
- 알림
- 마이 / 설정

### 듣기 모드
- 홈
- SharePlace
  - 전체 자산
  - TL3 오디오
  - TL4 비디오
  - TLD 문서
  - TLJ 이미지
  - 최신 / 인기 / 추천 / 카테고리
- CONSUME
  - 이용 중인 자산
  - 이용 기록
  - 즐겨찾기 / 보관함 (existing capabilities only)
- TL방송국
  - 방송 탐색
  - 카페 방송
  - 인카 라디오
  - DJ 라이브 / 채널

### 만들기 모드
- 크리에이터 홈 / 대시보드
- 자산화
  - TL3 오디오 만들기
  - TL4 비디오 만들기
  - TLD 문서 만들기
  - TLJ 이미지 만들기
- 내 자산
  - 전체 자산
  - 유형별 필터
  - 공개 / 비공개 / 처리 중 / 오류 상태
- EARN
  - 전체 보상
  - 자산별 보상
  - 이용 내역 / 정산 내역
- 권리 및 인증
  - 소유·창작권 정보
  - 인증서 / 관련 기록 (existing verified flows)
- MINING
  - POC 기여 내역
  - TLC 채굴 현황
  - 지갑 연결 상태

### Shared economy and spaces
- 지갑: TL 잔액·충전·거래, TLC 잔액·관련 내역, 환전 기능 where supported.
- 마이카페: 카페 공간 및 카페 방송국.
- 마이카: 개인용 인카 라디오 및 차량 채널.
- DJ 센터: DJ 대리점, 방송 관리, 편성표, 통계.
- Business / Advertiser / Admin: separate role-gated workspaces; do not expose privileged actions in ordinary member navigation.

“카페방송”은 방송 서비스의 하위 기능으로 정리하고, 플랫폼 용어는 **TL방송국**을 사용한다. 마이카페와 마이카는 상업용/개인용 사용 맥락을 구분하되 방송을 송출하거나 청취하는 기존 기능은 보존한다.

## 5. Screen specifications

### 5.1 Sign-in / sign-up
- Brand-first, uncluttered screen.
- Login and registration are distinct, obvious paths.
- Social sign-in / TON wallet options are displayed only if verified.
- No sample balances or fabricated activity.

### 5.2 Home
The home screen should explain the platform and provide immediate next actions, not become a dense dashboard.

Recommended content order:
1. Welcome and concise value proposition: “파일을 디지털 자산으로 만들고, 이용 시간의 가치를 연결하세요.”
2. Primary actions: 내 파일 자산화하기 · SharePlace 탐색하기.
3. Four equal family tiles: TL3 / TL4 / TLD / TLJ.
4. Personal summary: owned assets, recent usage, confirmed earnings, TL balance and TLC/POC status as separate values.
5. Recent activity and recommendations only when backed by real API data.
6. How it works: 자산 등록 → 권리·이용 조건 설정 → SharePlace 공개/공유 → 이용·정산.
7. Links to TL방송국, 마이카페, 마이카 and DJ센터.

Do not promise that every uploaded file automatically becomes a fully protected asset. Show the actual processing, validation and publication state.

### 5.3 Asset creation / registration
Start with a four-way family chooser. The chooser must not imply that one family is more complete or important than another.

Each family workflow:
1. Select source file or supported import source.
2. Validate format, size, duration/pages/dimensions and supported codec.
3. Collect family-specific metadata.
4. Identify creator/owner and capture rights declaration.
5. Select storage provider where supported (user storage / Local Agent / other verified provider).
6. Apply the supported protection/container process.
7. Configure publication, visibility and access/price policy only from confirmed platform capabilities.
8. Preview and confirm.
9. Show processing, success, partial success or failure with retry/recovery guidance.

Family metadata:
- TL3: title, artist/performer, composer/lyricist where applicable, duration, cover, genre, language.
- TL4: title, creator, duration, resolution, codec, poster, subtitles/captions.
- TLD: title, author, document type, page count, language, edition/version.
- TLJ: title, creator, image dimensions, format, collection/series, visual description.

The user-facing source formats in the original brief (MP3, MP4, PDF, JPEG) are initial examples, not an exhaustive promise of supported formats. Validate actual backend and local-agent support before displaying a format as available.

### 5.4 My Assets
A cross-family library with:
- Total count and family filters.
- Search, sort and pagination.
- Type-aware thumbnail/preview.
- Asset title, family, creation date, status, visibility and rights state.
- Usage and earnings where reliable data exists.
- Actions conditioned on ownership and actual capability: view, edit metadata, manage publication, inspect rights, view activity, archive/delete only with explicit confirmation and verified backend support.

Never silently convert legacy records or relabel old assets. A compatibility layer must display them faithfully until their canonical family is verified.

### 5.5 SharePlace
SharePlace is the cross-family discovery and distribution space, not a music-only page.

- Default filter: 전체.
- First-class family filters: TL3, TL4, TLD, TLJ.
- Additional filters: newest, popular, recommended, category/genre, creator, access policy where supported.
- Cards adapt by family: audio cover/player preview; video poster; document cover/page preview; image thumbnail/gallery.
- Every card shows title, creator, family, access/price information only when confirmed, and relevant rights/status indicator.
- Selecting a card opens its detail/preview experience. Do not auto-start paid consumption merely by opening a card.
- A deliberate “이용하기” action must show applicable TL cost/rate, metering basis and balance before a chargeable session begins.
- Keep existing SharePlace URLs and legacy records readable.

### 5.6 Asset detail and consumption
Each family has its own presentation runtime where needed, but all use a common authorization and accounting contract.

- TL3: audio playback, queue/playlist and existing supported track actions.
- TL4: protected video viewer with playback controls, seek/resume and captions where available.
- TLD: protected document viewer with page navigation and permitted search/zoom/annotation.
- TLJ: protected image viewer with zoom/pan and gallery/sequence behavior.

Before a chargeable session:
- identify the asset and owner;
- explain the charge basis and applicable rate;
- show available TL balance;
- obtain user intent to start;
- establish an authorized session.

During and after use:
- show elapsed/remaining usage and charge where technically supported;
- handle pause, seek, reconnect and interrupted sessions without duplicate charging;
- record usage events and settlement through the common service;
- provide a clear receipt/history entry.

Metering policy for TLD and TLJ is not decided in this IA. It must be agreed before implementation; do not assume page-time, image-time or session pricing.

### 5.7 EARN
- Total and period-based earnings.
- Breakdown by asset family and asset.
- Usage/settlement events with timestamps and status.
- Rights/certification status where verified.
- Withdrawal/conversion actions only where the existing financial flow supports them.

Do not show fabricated sample earnings, percentages or trend values.

### 5.8 CONSUME
- Cross-family usage history.
- Active sessions where supported.
- Filters by family, date and asset.
- Clear separation between free access, paid time-metered use and any other approved access policy.
- Receipts and dispute/help route for charge anomalies.

### 5.9 MINING and wallet
MINING presents contribution and TLC participation without changing their underlying rules:
- POC score and contribution events.
- TLC mined / pending / confirmed values according to actual chain state.
- TON wallet connection status and transaction references where available.
- Clear separation of POC contribution score, TLC token and TL platform balance.

Wallet presents TL and TLC as distinct assets:
- TL balance and charge/payment/transaction history.
- TLC balance and chain-related history.
- Conversion or withdrawal only if supported and permitted.
- Never fabricate exchange rates or imply TL and TLC are interchangeable at a fixed rate.

### 5.10 My Cafe, My Car, TL Broadcasting Station and DJ Center
Keep these as connected platform services rather than the definition of TimeLink.
- My Cafe: business/venue context, cafe radio, channel management.
- My Car: personal in-car listening context and vehicle/channel settings.
- TL Broadcasting Station: unified discovery/entry for broadcast experiences.
- DJ Center: DJ profile, dealership/agency, schedule, playlists, live broadcast and statistics as supported.

Existing routes and page-specific shells must be audited before navigation is consolidated.

## 6. Core cross-family user journeys

### Journey A — New member
Sign-in/sign-up → account setup → signed-in home → choose listen or create → discover or register first asset.

### Journey B — Creator registers an asset
Create mode → choose TL3/TL4/TLD/TLJ → upload/import → validate → metadata and rights → protect/store → preview → publication choice → My Assets confirmation → optional SharePlace listing.

### Journey C — Consumer discovers and uses an asset
Explore → SharePlace → select family/filter → asset detail → review rights and charge basis → confirm use → family viewer/player → metered session → usage history.

### Journey D — Creator receives value
Owned asset → consumer authorized use → usage event → common settlement → EARN history → TL wallet balance. POC/TLC eligibility is a separate contribution/mining flow and must not be conflated with TL settlement.

### Journey E — Contributor participates in POC/TLC
Eligible platform activity → POC event/score → existing mining calculation → TLC result/chain state → mining history and wallet display. Preserve the already-tested implementation.

## 7. Information model required for UI consistency

The UI must keep these concepts separate:

- `asset_id`: stable platform identity.
- `asset_family`: `tl3 | tl4 | tld | tlj`.
- `release_mode` / `access_policy`: approved access and pricing behavior.
- `owner_id` and creator/rights metadata.
- `storage_provider` and storage object reference; storage location is not asset identity.
- `container_format` and version; do not infer from extension alone.
- `publication_status`, `processing_status`, `rights_status`.
- `usage_event` and settlement reference.
- TL ledger events, POC contribution events and TLC chain events as distinct records.

This is a target UI/domain contract. It does not authorize a database migration. Existing schema and endpoints must be mapped before any implementation decision.

## 8. Visual design direction

- Premium, modern creator-economy product.
- Dark navy / charcoal foundation with restrained blue and violet accents, consistent with the TimeLink identity.
- High-contrast typography, calm spacing and clear information hierarchy.
- Four family colors/icons may help recognition, but color must never be the only family indicator.
- Strong visual distinction among TL, TLC and POC.
- Consistent cards, forms, upload progress, status chips, confirmation dialogs and error recovery.
- Responsive layouts designed separately for desktop and mobile.
- Accessibility: keyboard navigation, visible focus, readable contrast, descriptive labels and reduced-motion support.

## 9. Existing-page and route preservation

The current site is a multi-page HTML/JavaScript application, not a fully unified single-page app. Some pages own their navigation; `sidebar.js` does not safely define every page shell.

Therefore:
- Build renewed screens on separate routes or filenames first.
- Keep legacy routes and current page scripts available during parallel testing.
- Do not blanket-inject a new shell across every HTML page.
- Do not rewrite `creator.html`, `creator-studio.html`, `shareplace.html`, `dashboard.html`, `wallet.html`, `radio.html` or `sidebar.js` until their live flows and API dependencies are verified.
- Keep specialized player/viewer runtimes separate when necessary.
- Reconcile duplicate wallet/dashboard functions only after data and action contracts are compared.
- No route switch, migration, deletion, merge or deployment without owner approval.

## 10. Open decisions before implementation

1. Canonical container extensions and version identity for TL3/TL4/TLD/TLJ, including legacy `.tlf`, `.tlg`, certificate and score artifacts.
2. TLD and TLJ metering unit and pricing semantics.
3. Which access policies are actually supported in the current backend.
4. Canonical authentication options and TON wallet flow.
5. Canonical wallet experience: dashboard tabs, standalone wallet or a shared data-backed view.
6. Exact role gates for creator, DJ, cafe owner, advertiser and admin.
7. Which creator upload page is the working canonical path, while preserving both until verified.
8. Live runtime behavior of each route and API, including Local Agent and external storage providers.

## 11. Acceptance gates

A renewed screen is not ready to replace a legacy screen until:
- existing user records load correctly;
- all existing primary actions work against the intended API;
- family classification is validated and legacy records remain readable;
- upload, playback/viewing, TL debit and creator settlement pass controlled end-to-end tests where applicable;
- POC/TLC mining behavior remains unchanged and is regression-tested;
- storage providers and Local Agent paths are tested;
- loading, empty, error, retry and success states are complete;
- desktop and mobile are usable;
- route compatibility and rollback are demonstrated;
- owner reviews and explicitly approves the change.

## 12. Next work package

1. Complete route-to-workflow/API mapping for authentication, asset registration, SharePlace, My Assets, usage, settlement, wallet and mining.
2. Reconcile current `sidebar.js`, `docs/IA.md`, the owner UI brief and actual page-specific navigation into a page-by-page navigation map.
3. Define the design system and responsive shell without touching legacy pages.
4. Prepare a separate visual prototype for sign-in, signed-in home, four-family asset chooser, SharePlace and My Assets.
5. Review the prototype and specification with the owner before any implementation branch changes beyond documentation.
