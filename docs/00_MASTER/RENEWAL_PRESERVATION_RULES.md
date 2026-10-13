# TimeLink Renewal Preservation Rules
Date: 2026-10-14

## Project direction
TimeLink is an existing, substantially implemented platform. The renewal is an evolution of the current product, not a rebuild from scratch.

The primary objective is to improve the experience and complete the connections between existing capabilities while preserving the current information architecture, business rules, working pages, and tested flows.

## Non-negotiable principles
1. Preserve existing working behavior. Do not remove, replace, rename, or redesign a working feature without first documenting what it does and how users reach it.
2. No destructive edits to the default branch during discovery and design.
3. Do not assume that a feature is absent because it is not visible in one screen. Trace the frontend, API, backend, storage, and user journey.
4. Separate visual renewal from functional changes. Prefer a new presentation layer that calls existing APIs over rewriting business logic.
5. Keep a compatibility path for existing URLs, stored records, creator uploads, playback links, and user data.
6. Make changes in small, reviewable units. Each unit must have a before/after description and a rollback path.
7. Validate the complete user journey, not just an isolated component.
8. Never label source-code presence as runtime-verified. Track source inspection, deployed API verification, and browser end-to-end verification separately.

## Renewal method
### Phase A — Existing product baseline
- Inventory every current page, menu, button, modal, form, API request, and user role.
- Record which features the owner has already tested successfully.
- Capture screenshots and current navigation relationships where possible.
- Identify canonical pages and legacy/duplicate pages without deleting either.

### Phase B — Renewal blueprint
- Preserve the current product modules and their purpose.
- Define a consistent design system: typography, spacing, colors, responsive behavior, cards, navigation, forms, alerts, and player controls.
- Map each renewed screen to its existing data source and API.
- Mark any proposed new capability separately from existing capabilities.
- Obtain owner agreement on the screen structure before implementation.

### Phase C — Parallel screen renewal
- Build renewed screens alongside the existing screens, using separate filenames/routes or a feature flag.
- Reuse existing APIs and data contracts wherever practical.
- Do not change payment, TL accounting, TLC mining, encryption, storage, or creator ownership logic as part of a visual-only renewal.
- If an API defect blocks a screen, document it as a separate functional patch.

### Phase D — Regression and replacement
- Test existing and renewed screens against the same test account and test content.
- Verify login, creator upload, SharePlace listing, TL charging, playback, wallet balances, creator earnings, and the existing TLC test-mining path.
- Compare results before switching the default navigation.
- Keep the previous screen available for rollback until the renewed flow has passed.

## Feature status vocabulary
- Existing / owner-confirmed: the owner reports that this feature already works.
- Source present: implementation exists in the repository, but runtime behavior is not verified.
- Connected in source: frontend and backend request/response paths appear aligned.
- Runtime verified: tested against the deployed service.
- End-to-end verified: tested successfully from the user's first action to the final expected result.
- Renewal needed: existing behavior is retained, but its interface or usability should improve.
- Repair needed: a confirmed defect prevents the existing feature from working.

## Scope guard
Do not turn this renewal into a rewrite or a security-hardening project. Preserve the user's current working platform and focus on a polished, complete, usable TimeLink experience. Address only immediately destructive risks or defects that block the agreed user journey.
