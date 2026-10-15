# TimeLink Navigation Architecture & Design System

**Date:** 2026-10-14  
**Status:** Design specification — documentation branch only  
**Branch:** `docs/master-architecture-audit-20261014`  
**Evidence base:** Existing `sidebar.js`, `login.html`, `dashboard.html`, `index.html`, historical `docs/IA.md`, owner-approved common-platform IA.

## 1. Design objective

Create one coherent TimeLink product experience without erasing the useful distinctions and working paths already present in the service.

The renewed experience must communicate three things immediately:
1. TimeLink handles four equal digital-asset families: TL3 Audio, TL4 Video, TLD Document and TLJ Image/Visual.
2. Members can both consume and create from the same account.
3. Time, authorization, TL settlement and creator value are connected by a common platform core.

This document defines a target navigation and visual system. It does not authorize rewriting `sidebar.js`, replacing page navigation, changing routes or altering the existing CSS/theme implementation.

## 2. Navigation model

### 2.1 Main product modes

A persistent mode switch in the signed-in shell:

- **탐색·이용** — discover, access and consume digital assets.
- **창작·관리** — register, manage and earn from owned assets.

The switch is a view/navigation preference, not a role or permission change. A user does not need separate consumer and creator accounts. It must not hide shared services such as wallet, notifications, account settings or owned assets.

### 2.2 Desktop shell

- Left rail: brand, mode switch, grouped primary navigation.
- Top bar: global search, TL balance, TLC balance, notification center, profile.
- Main content: page title, breadcrumb/context, primary action, page body.
- Optional contextual panel: only when it adds verified information and does not squeeze the main workspace.
- Active audio player: persistent bottom mini-player only during an active audio session.

Suggested width ranges:
- Sidebar: 248–264 px expanded; 76–84 px collapsed.
- Top bar: 64–72 px.
- Main content max width: 1440 px; forms and long text should use a narrower readable column.
- Page gutters: 24–32 px desktop, 16–20 px tablet, 16 px mobile.

These are design targets, not current CSS facts.

### 2.3 Mobile shell

- Top row: logo, search, profile.
- Mode switch directly below the top row or in the primary drawer.
- Bottom navigation: Home, Explore, Create, My Assets, Wallet.
- Secondary functions (TL Broadcasting Station, DJ Center, My Cafe, My Car, EARN, CONSUME, MINING) remain in the navigation drawer or relevant workspaces.
- Avoid a five-icon bottom bar that changes meaning between pages.
- Preserve safe-area spacing and ensure sticky player controls do not cover viewer controls or primary actions.

## 3. Proposed menu tree

### Global / always available
- 홈
- 탐색
- 자산화 (primary action)
- 내 자산
- 지갑
- 알림
- 내 계정 / 설정

### 탐색·이용 mode
- 홈
- SharePlace
  - 전체 자산
  - TL3 오디오
  - TL4 비디오
  - TLD 문서
  - TLJ 이미지
  - 최신
  - 인기
  - 추천 (only if backed by a real recommendation service)
- CONSUME
  - 이용 중
  - 이용 기록
  - 보관함 / 즐겨찾기 (only where current capability is verified)
- TL방송국
  - 방송 둘러보기
  - 카페 방송
  - 인카 방송
  - DJ 방송 / 채널

### 창작·관리 mode
- 크리에이터 홈
- 자산화
  - 오디오 자산 (TL3)
  - 비디오 자산 (TL4)
  - 문서 자산 (TLD)
  - 이미지 자산 (TLJ)
- 내 자산
  - 전체
  - 처리 중
  - 공개
  - 비공개
  - 확인 필요 / 오류
- EARN
  - 전체 수익
  - 자산별 수익
  - 정산 내역
- 권리·인증
  - 권리 정보
  - 인증 자료
- MINING
  - POC 기여
  - TLC 채굴

### Connected services
- 마이카페
- 마이카
- DJ센터

### Separate privileged workspaces
- 카페 운영자
- DJ 사업자/대리점
- 광고주 센터
- B2B
- 관리자

Privileged navigation must be role-gated by the backend, not merely hidden in the frontend. Do not expose admin routes as ordinary menu items.

## 4. Menu naming and hierarchy rules

- Use **SharePlace** as the cross-family discovery/distribution name. Never label its main entry “음악”.
- Family labels always include both the canonical code and the human-readable family name at first display: “TL3 오디오”, “TL4 비디오”, “TLD 문서”, “TLJ 이미지”.
- Use **TL방송국** for the overall broadcast service. “카페 방송” and “인카 방송” are channels/contexts within that service, not competing platform names.
- Keep **마이카페** and **마이카** distinct: venue/business space versus personal in-car experience.
- Use **EARN**, **CONSUME** and **MINING** as separate destinations. Do not combine them into one generic “수익” page.
- Keep TL and TLC balances separate in the top bar and wallet.
- POC is a contribution metric/process, not a currency balance.
- “자산화” means registering a supported digital file as a TimeLink asset; do not imply every arbitrary upload is automatically protected or publishable.
- A menu item must not be shown as active until the destination and action are verified.

## 5. Existing navigation compatibility map

| Existing surface | Existing role | Target destination | Preservation instruction |
|---|---|---|---|
| `index.html` | Public marketing/entry page | Public brand page or sign-in entry per approved launch decision | Do not remove B2B/patent/product information without review. |
| `login.html`, `signup.html` | Authentication | Branded entry experience | Preserve API contract, redirects, token keys and wallet sign-in behavior. |
| `shareplace.html` | Discovery and playback | 탐색·이용 → SharePlace | Keep route and legacy item readability. |
| `track.html` | Asset detail/player actions | Family-aware asset detail | Preserve current TL3 actions while new viewers are validated. |
| `creator.html` | Existing creator upload studio | 창작·관리 → 자산화 | Do not replace until the working upload flow is runtime-tested. |
| `creator-studio.html` | Alternate wizard upload | Candidate renewed creator flow | Compare both paths; retain both until canonical flow is decided. |
| `dashboard.html` | Wallet, mining, content, cafe tabs | Creator Home + EARN/MINING/asset summaries | Preserve POC/TLC calculation and all data/action contracts. |
| `wallet.html` | Standalone wallet | Shared Wallet destination | Reconcile with dashboard wallet before consolidating. |
| `radio.html` | Broadcast hub | TL방송국 | Preserve cafe/in-car/DJ entry points. |
| `cafe-radio.html`, `cafe-channel.html`, `incar.html`, `incar-channel.html` | Specialized listening/channel pages | TL방송국 subroutes / My Cafe / My Car | Keep their dedicated flows and page-specific controls. |
| `dj-center.html`, `dj-console.html` | DJ management/broadcast | DJ센터 | Preserve role and broadcast actions. |
| `admin.html` | Privileged administration | Separate protected workspace | Never inject ordinary member shell over it. |

## 6. Brand and visual direction

### 6.1 Brand character

- Modern, trustworthy, creator-first, technically credible.
- Dark navy / charcoal base, subtle blue gradients and restrained cyan accents.
- Avoid a music-app-only visual language: no universal musical-note iconography, album-only layouts or audio-centric hero art.
- Visualize four equal families with four recognizable symbols and balanced card sizes.
- Use a calm interface; do not fill every surface with gradients, glowing borders or animated effects.

### 6.2 Color tokens

These are proposed starting tokens inspired by the existing blue/cyan treatment. They must be checked against the actual logo asset and full CSS before finalizing.

| Token | Proposed value | Usage |
|---|---|---|
| `--tl-bg` | `#07111F` | Main dark navy background |
| `--tl-surface` | `#0D1B2A` | Sidebar, cards, panels |
| `--tl-surface-raised` | `#13263A` | Hover/raised surfaces |
| `--tl-border` | `#24384D` | Dividers and card borders |
| `--tl-text` | `#F3F7FC` | Primary text |
| `--tl-text-muted` | `#A9B8C8` | Secondary text |
| `--tl-blue` | `#2F8FFF` | Primary actions and focus |
| `--tl-cyan` | `#55D6E8` | Supporting highlight |
| `--tl-success` | `#35C98A` | Success only |
| `--tl-warning` | `#F4B44B` | Caution / pending |
| `--tl-danger` | `#F16D75` | Errors / destructive actions |

### 6.3 Four-family visual identity

Suggested accent palette, used as a secondary cue only:

- TL3 Audio: blue.
- TL4 Video: violet.
- TLD Document: amber.
- TLJ Image/Visual: teal.

Every family must also show its code and text label. Color alone must never encode type or status. The palette should be tested for contrast and color-vision accessibility.

### 6.4 Typography

- Primary UI: modern Korean sans-serif stack with system fallback.
- Headings: 600–700 weight, compact line height.
- Body: 400–500 weight, comfortable line height around 1.5–1.65.
- Numeric balances and transaction values: tabular numerals.
- Avoid very small metadata; secondary text should remain legible on mobile.
- Use one type scale consistently rather than page-specific arbitrary font sizes.

### 6.5 Shape, spacing and components

- Main cards: 14–18 px radius.
- Inputs/buttons: 10–12 px radius; pill only for filters or compact balance chips.
- 4 px base spacing scale: 4, 8, 12, 16, 24, 32, 40, 48.
- Buttons: primary, secondary, quiet, destructive; consistent heights and disabled/loading states.
- Cards: family-aware thumbnail, title, owner/creator, status, metadata and actions.
- Tables: readable row height, sticky header only for long lists, responsive mobile conversion.
- Status chips: processing, published, private, failed, rights-check-required; status labels must be backed by actual state fields.
- Forms: clear labels, inline validation, upload progress, recoverable error and explicit confirmation.

## 7. Essential reusable screen patterns

1. **Page header:** breadcrumb, title, short explanation, one primary action.
2. **Four-family chooser:** four equally sized cards, same hierarchy, distinct icon and concise description.
3. **Asset card:** family label, preview, creator, status, price/access policy only when confirmed.
4. **Balance strip:** TL and TLC separate; POC shown as contribution score rather than money.
5. **Upload stepper:** file → validation → metadata/rights → storage/protection → preview → publication.
6. **Usage confirmation:** asset, owner, rate/unit, estimated/maximum charge if calculable, balance and explicit start action.
7. **Ledger list:** date, event, asset, amount/unit, status and reference ID.
8. **Empty state:** explain what belongs here and provide a safe next action.
9. **Error state:** human-readable cause, retry where safe, support/reference ID.
10. **Viewer shell:** family-specific viewer controls inside shared authorization/session chrome.

## 8. First screen and signed-in home composition

### 8.1 Entry screen
- Logo centered or aligned within a calm two-column layout on wide desktop.
- Login form is immediately visible; signup is a clear secondary action.
- A short brand statement explains time-based digital assets.
- On mobile, one-column layout with no decorative panel pushing the form below the fold.
- TON/social login buttons appear only if the current flow is verified.
- Do not add a “demo wallet” or fictional balance.

### 8.2 Signed-in home
Recommended order:
1. Welcome and two primary actions: “자산화하기” and “SharePlace 둘러보기”.
2. Four equal family tiles.
3. Personal asset/usage/earnings summary from verified APIs.
4. Separate TL, TLC and POC summary.
5. Recent assets and activity.
6. TL방송국 and connected services.

The home should not duplicate the entire dashboard. It is a starting point; detailed EARN, CONSUME, MINING and wallet pages own their respective data.

## 9. Responsive and accessibility requirements

- Desktop: sidebar and topbar, grid-based content.
- Tablet: collapsible sidebar, two-column cards where useful.
- Mobile: bottom navigation plus drawer, single-column content, touch targets at least 44 px.
- Keyboard access for navigation, menus, dialogs, upload actions and viewers.
- Visible focus ring; semantic headings and form labels.
- Sufficient contrast for text, badges and controls.
- Do not rely on hover to expose critical actions.
- Reduced-motion preference must be respected.
- Player and viewer controls must remain reachable with screen zoom.

## 10. Implementation guardrails

1. Build the new shell on separate files/routes first.
2. Do not universally inject or replace the shell through `sidebar.js`.
3. Do not alter authentication token keys, redirects or API response expectations in a visual pass.
4. Do not merge `dashboard.html` and `wallet.html` until every action and data field is mapped.
5. Do not move privileged routes into the member shell.
6. Keep legacy routes, deep links and stored records working.
7. Use feature flags or explicit route selection for parallel testing where feasible.
8. Every menu item must have a verified destination and a tested permission rule.
9. Rollback to the prior route must remain possible until owner acceptance.

## 11. Visual prototype scope

The first reviewable prototype should include:
1. Login / signup entry.
2. Signed-in home with mode switch.
3. Four-family asset chooser.
4. SharePlace all-family discovery page.
5. My Assets page.

Prototype data must be clearly marked as illustrative. No live wallet, earnings, mining or content API should be mutated by a visual prototype.

## 12. Acceptance checklist

- [ ] Four families have equal prominence in menu, home and asset chooser.
- [ ] Listening/consumption and creation/management are modes within one account.
- [ ] SharePlace is cross-family, not music-only.
- [ ] TL, TLC and POC are visually and semantically distinct.
- [ ] TL Broadcasting Station, My Cafe, My Car and DJ Center remain accessible.
- [ ] Admin and privileged business areas remain protected.
- [ ] Existing URLs and legacy records remain readable.
- [ ] Mobile navigation is coherent and accessible.
- [ ] No unsupported actions, invented balances or unverified rates appear.
- [ ] Existing production pages and APIs remain unchanged during prototype review.
