# TimeLink Four-Family Asset Creation & Release Specification

**Date:** 2026-10-14  
**Status:** Design specification — documentation branch only  
**Branch:** `docs/master-architecture-audit-20261014`  
**Scope:** TL3 Audio, TL4 Video, TLD Document, TLJ Image/Visual  
**Evidence policy:** Confirmed source-level behavior is distinguished from proposed behavior and runtime-unverified behavior.

## 1. Purpose and non-negotiable principles

This specification defines one coherent asset-registration journey for all four TimeLink asset families. It is a design and implementation contract, not authorization to change production code, database schemas, payment logic, cryptographic formats or deployed services.

1. TL3, TL4, TLD and TLJ are equal asset families. None is the default family or a secondary attachment type.
2. A single member account can create, own, publish, consume and manage all four families.
3. The common workflow is shared; metadata, validation, preview and viewer behavior are family-specific.
4. **Only protected TL assets may be published or shared. There is no free-content or free-playback mode.** Ordinary source files (MP3, MP4, PDF, JPEG/PNG, etc.) are Creator inputs only and must remain private source material; the protected TL container is the distributable asset.
5. Existing protected TL3 upload, playback, usage metering and creator settlement behavior must be preserved. Legacy MP3/source-file sharing records and free-playback routes are historical compatibility data only; they are not target product behavior and must not be newly exposed or extended. Preserve records for audit and migrate/restrict them only through a tested, approved plan.
6. Existing POC contribution and TLC participation/mining behavior must be preserved. Do not recalculate, rename, reset or replace their accounting as part of asset UI work.
7. Storage-provider choice must preserve the currently supported user-owned Google Drive, OneDrive and Local Agent paths, as well as any verified existing backend storage.
8. Never rename, rewrite, bulk-convert or invalidate existing files merely to make their extensions match a proposed canonical naming scheme.
9. The UI must not claim that a file is protected, rights-verified, published, payable or mining-eligible until the server confirms the corresponding state.
10. All consequential actions must be recoverable, idempotent where possible and auditable.

## 2. Domain model: family, release policy and lifecycle are separate

### 2.1 Canonical family identifiers

| Family ID | Product label | Primary content | Typical preview |
|---|---|---|---|
| `tl3` | TL3 오디오 | Music, voice, sound and other audio | Audio player / waveform |
| `tl4` | TL4 비디오 | Video, film and moving-image works | Video player / poster |
| `tld` | TLD 문서 | PDF, e-books and document works | Page/document preview |
| `tlj` | TLJ 이미지 | Photography, illustration and visual works | Image gallery / zoom viewer |

The identifiers above are the target domain vocabulary. They must not be treated as proof that every family already has a complete production workflow.

### 2.2 Separate dimensions

The target asset record should distinguish at least:

- `asset_family`: `tl3 | tl4 | tld | tlj`
- `release_mode`: a TL-asset publication state such as published or private/unlisted. A free-content mode is not permitted.
- `access_policy`: the actual authorization and charging rule applied at use time.
- `lifecycle_status`: draft, validating, uploading, protecting, ready_for_review, published, private, failed or archived, subject to the authoritative server state.
- `storage_provider`: the selected and confirmed storage provider.
- `container_format` and `container_version`: the actual file/container identity, not inferred from a filename alone.

Do not overload a legacy `content_kind` field that currently appears to distinguish only MP3 and TL3. A compatibility adapter must preserve legacy values while the canonical model is introduced and verified.

### 2.3A Source material versus distributable TL asset

The source file selected in Creator is not itself a TimeLink asset listing. The lifecycle is:

1. Select/import source material (e.g. MP3, MP4, PDF, JPEG/PNG) into the Creator workspace.
2. Validate source rights, format and metadata; keep the source private to the creator/workflow.
3. Generate and verify the protected family-specific TL container (TL3/TL4/TLD/TLJ).
4. Store and register the protected TL object as the canonical asset.
5. Publish/share only that TL asset through SharePlace and other TimeLink applications.
6. Meter authorized use in TL units and settle the creator's approved TL reward-token compensation.

Never create a public SharePlace entry or playback URL that points directly to the original source file. A preview, if required, must itself be an authorized protected derivative and must not expose the raw source.

### 2.3 Rights artifact is not an asset family

A rights certificate, proof card, thumbnail, poster or generated cover is a related artifact. It is not automatically a TLJ image asset. Similarly, a PDF score attachment is not automatically a full TLD document asset. Keep the distinction explicit in database relationships, UI labels and download behavior.

## 3. Unified creation journey

The user-facing wizard should follow the same high-level sequence for every family:

1. **Choose family** — TL3 / TL4 / TLD / TLJ, with equal prominence.
2. **Select source file** — choose or drop the source; show accepted types based on server capability.
3. **Validate** — inspect file signature, MIME, extension, size and family-specific technical metadata.
4. **Describe the work** — title, description, creator/contributor credits, language and family metadata.
5. **Declare rights** — ownership/authorization declarations and supporting evidence where required.
6. **Choose storage and protection** — show only connected, available providers; explain whether the chosen path supports the requested protected release.
7. **Preview** — render a family-specific preview and let the creator review metadata and rights declarations.
8. **Choose release/access policy** — select only modes that the backend currently supports for this family.
9. **Review price and use terms** — show the actual rate/unit and estimated charge only when the policy is confirmed and computable.
10. **Submit and track** — create an idempotent registration job, show progress and preserve a retry/recovery path.
11. **Publish confirmation** — show the server-confirmed asset ID, SharePlace URL, lifecycle state and next actions.

The wizard may visually combine steps on desktop, but must not skip a validation or rights checkpoint. A user must be able to go back without silently discarding a selected file or completed metadata.

## 4. Shared metadata

### 4.1 Required common fields (target)

- Work title.
- Primary creator/rights holder identity, bound to the authenticated account where appropriate.
- Short description.
- Asset family.
- Original filename (retained as source metadata; not used as the asset's unique identity).
- Source MIME type and detected media/document type.
- Source byte size.
- Creation/registration timestamp assigned by the server.
- Rights declaration version and accepted timestamp.
- Storage provider and provider object reference (server-managed).
- Asset ID and lifecycle status assigned by the server.

### 4.2 Optional common fields

- Additional contributors and their roles.
- Language.
- Tags and categories.
- Release notes/version description.
- Cover art or thumbnail.
- External reference/ISRC/ISBN/DOI or other identifier, only when relevant and validated.
- Rights evidence attachment or verification reference.
- Explicit content/advisory metadata where applicable.

Do not invent required field constraints, maximum lengths or identifier validation rules until the backend contract and product policy are reviewed.

## 5. Family-specific metadata and validation

The following fields are proposed UI/domain requirements. Accepted formats, size ceilings, duration/page/resolution limits and transcoding support remain configurable decisions until confirmed from implementation and infrastructure.

### 5.1 TL3 Audio

**Metadata**
- Track/work title.
- Main artist/performer.
- Composer, lyricist, arranger, producer and featured artists where applicable.
- Album/collection, track number and release date where applicable.
- Genre, language and explicit-content flag where applicable.
- Cover image as a related visual artifact.

**Technical validation**
- Detect actual audio format from file signature and decoder inspection, not extension alone.
- Read duration, sample rate, channel count and codec where tooling supports it.
- Reject corrupt, empty or unsupported files with actionable errors.
- Preserve source file separately from any generated/processed playback derivative.
- If LP/lossless processing is used, record source and derivative lineage; never silently replace the original.

**Preview**
- Audio player with duration and basic metadata.
- Waveform is optional and must not block registration if waveform generation fails.

**Existing behavior to preserve**
- Existing TL3 protected-file creation and playback path.
- Existing per-second consume/debit and creator credit/settlement path.
- Existing TL3 player and relevant track detail actions.
- Existing free MP3 upload/listening path as a compatibility flow. Do not automatically charge TL, issue POC contribution or create bonus TL for free MP3 uploads unless current approved business rules explicitly say so.

### 5.2 TL4 Video

**Metadata**
- Video title and synopsis.
- Director/creator, cast/participants and production credits as applicable.
- Genre, language, release year/date and content advisory where applicable.
- Poster/thumbnail as a related visual artifact.
- Optional captions/subtitles and accessibility metadata.

**Technical validation**
- Inspect actual video container, codec, dimensions, frame rate, duration, audio streams and subtitle tracks where tooling supports it.
- Verify that the file can be decoded or safely previewed before accepting a protected-release job.
- Treat poster, subtitle and alternate rendition files as related resources, not separate TL4 assets unless the user explicitly registers them as such.
- Video transcoding, streaming segmentation, adaptive bitrate and DRM behavior are not assumed to exist.

**Preview**
- Video player with poster, duration and available subtitle selection.
- If the production viewer is not ready, show a clearly labelled preview-only state; do not imply protected playback is operational.

**Readiness note**
- Source inspection has found generic video MIME/extension handling and a `.tl4` download naming path. This does not establish a complete TL4 container, player, time-metering or settlement workflow. Treat those as implementation gaps to verify, not as already completed.

### 5.3 TLD Document

**Metadata**
- Document title and subtitle.
- Author/editor/translator/illustrator and publisher/imprint where applicable.
- Language, edition/version, publication date and document category.
- ISBN or other publication identifier only where applicable.
- Table-of-contents metadata where available.
- Accessibility metadata (searchable text, tagged structure, reading order) where available.

**Technical validation**
- Inspect PDF/document signature and MIME; do not trust filename extension.
- Determine page count, page dimensions, encryption/password status and text-extraction availability where tooling supports it.
- Detect malformed or potentially unsafe embedded content using server-side controls.
- Preserve original document bytes. Any generated preview, extracted text or thumbnail is a derivative with a traceable relationship.
- OCR is an optional processing capability, not a prerequisite unless explicitly adopted.

**Preview**
- Page thumbnails and a page viewer when supported.
- Page navigation and zoom.
- Do not present a score PDF attachment as proof that the generic TLD asset family is complete.

**Readiness note**
- Existing score/PDF download functionality and generic PDF storage/extension handling were found in source inspection. A generic TLD registration, protected document viewer, page/session metering and creator settlement workflow have not yet been established by the audit. The existing `.tlf` mapping conflicts with the target TLD naming and must be handled through compatibility, not bulk conversion.

### 5.4 TLJ Image / Visual

**Metadata**
- Work title and description.
- Photographer/artist/illustrator.
- Creation date and location only if supplied and intended for publication.
- Medium/technique, series/collection and visual category where relevant.
- Alt text and accessibility description.
- Optional dimensions, color profile and rights/attribution data.

**Technical validation**
- Inspect image signature, dimensions, color mode, bit depth and orientation where supported.
- Remove or explicitly manage sensitive EXIF/GPS metadata according to creator choice and privacy policy.
- Validate actual decoded image content; extension alone is insufficient.
- Preserve source image. Resized previews, thumbnails and watermarked previews are derivatives.

**Preview**
- Responsive image viewer, zoom and optional gallery for multi-image works.
- Show alt text and rights/attribution metadata.

**Readiness note**
- Existing certificate-card export and `.tlj` certificate viewer are rights-certificate features, not evidence of a generic TLJ image-asset workflow. Generic image MIME handling currently maps to legacy `.tlg` in some backend helper paths. Resolve canonical naming and compatibility before implementation.

## 6. Rights declaration and review

The rights step must be explicit, understandable and auditable. It should ask the creator to confirm, as applicable:

- They created the work or hold the rights/authorization needed for the selected use.
- Third-party samples, performances, images, fonts, footage, translations or embedded material are properly licensed.
- Contributor credits are accurate or will be corrected before publication.
- The selected release/access policy is within the rights they control.
- They understand the platform's takedown, dispute and evidence-review process.

The interface must not state “copyright verified” merely because a checkbox was selected. Use distinct states such as:
- declaration_received
- evidence_submitted
- review_pending
- verified_by_authorized_process
- disputed / restricted

Exact legal wording, evidence standards, review authority and retention periods require owner/legal approval. The UI must retain declaration version, actor, timestamp and related asset ID. Do not expose private evidence publicly by default.

## 7. Storage and protected-container handling

### 7.1 Provider selection

Show only providers that are actually connected and available to the authenticated user:
- Local Agent / user-owned PC storage.
- Google Drive.
- OneDrive.
- Any existing backend-managed storage path verified in the deployed environment.

Cloudflare R2 is currently unavailable in the known operating context because the account/billing setup has blocked its use. Do not make R2 mandatory or design the wizard so that registration fails solely because R2 is not enabled.

For each provider show:
- Connection state.
- Available/permission state where measurable.
- Whether the provider supports the selected operation.
- Last successful sync/health-check timestamp, if available.
- A clear reconnect/retry route.

Never display a provider as connected based only on a saved token or stale frontend flag.

### 7.2 Storage lifecycle

Target sequence:
1. Request a registration/upload job from the backend.
2. Receive a server-generated job ID and upload instructions.
3. Upload source bytes to the selected provider.
4. Verify object presence, byte size and checksum/hash where supported.
5. Create or finalize protected container/derivative through the authoritative service.
6. Persist provider reference, object identity and container metadata.
7. Mark the job ready only after server-side verification.

The UI should show separate progress phases: preparing, transferring, verifying, protecting, registering and ready. A completed browser upload alone is not proof that the asset is ready.

### 7.3 Container compatibility

Source inspection found naming/format divergence:
- Existing generic backend helper: audio `.tl3`, video `.tl4`, image `.tlg`, PDF `.tlf`.
- Other existing flows: rights certificate export `.tlj`; score/PDF file download `.tld`.
- Generic upload code builds a TLNK v1 header with XOR payload in the inspected path.

This is a compatibility issue requiring a format registry. Do not assume the filename suffix fully identifies the cryptographic container or family.

Target container metadata should include:
- Magic/header identity.
- Container version.
- Family ID.
- Encryption/protection scheme identifier and parameters.
- Source content hash and protected payload hash.
- Key/version reference (never expose secret keys to the browser).
- Creation time and implementation identifier.
- Backward-compatible reader profile.

The existing TLNK v1/XOR path must remain readable while any stronger or newer cryptographic design is separately specified, tested and approved. Do not claim quantum resistance or cryptographic security without a reviewed specification and independent testing. Do not replace XOR or key management in this UI project.

## 8. Release and access policy

Asset family and commercial/access policy are orthogonal.

Potential policy vocabulary for product design:
- Free/public.
- Paid/time-metered.
- Fixed-price access.
- Subscription or entitlement-based access.
- Private/unlisted.
- Limited preview / sample.

These are not declarations that all options exist in production. The wizard must query or receive server capability for the selected family and show only supported options.

For each enabled policy, backend contract must define:
- Price/rate and currency/unit.
- Billing event and measurement unit.
- Authorization check.
- Balance sufficiency behavior.
- Refund/reversal behavior for failed sessions.
- Creator settlement and platform fee treatment.
- Tax/receipt/ledger requirements.
- POC/TLC contribution relationship, if any, as a separate approved rule.

### 8.1 Metering units — decisions still required

| Family | Candidate measurement | Decision status |
|---|---|---|
| TL3 Audio | Playback seconds | Existing source-level TL3 per-second consume path identified; live end-to-end runtime still requires verification. |
| TL4 Video | Playback seconds or licensed session | Product/backend decision required; no complete equivalent path established by current audit. |
| TLD Document | Page-time, session-time, page access or fixed entitlement | Product/backend decision required. |
| TLJ Image | Viewing session, time or licensed access | Product/backend decision required. |

Do not copy TL3 per-second billing to the other families by assumption. The owner must decide the commercial meaning and backend accounting model for each family.

### 8.2 Price review screen

Show only confirmed values:
- Creator-entered price/rate.
- Exact unit (for example, TL per second) when established.
- Expected or maximum charge only when calculation is deterministic.
- Current TL balance from the authoritative wallet API.
- A clear explanation of what triggers a charge.

TL is the internal value unit (current owner policy: 1 TL = 1 KRW). TLC is a separate token/participation asset; POC is a contribution measure, not a wallet currency. UI work must not change their accounting semantics.

## 9. Registration job, idempotency and recovery

A registration request must have a stable client-generated idempotency key or server-issued job identity. Retrying a network request must not create duplicate assets, duplicate SharePlace entries, duplicate charges or duplicate creator settlements.

Target job states:
- draft
- queued
- validating
- uploading
- verifying_storage
- protecting
- registering
- ready_for_review
- published
- failed_retryable
- failed_terminal
- cancelled

Use actual backend status vocabulary where it already exists; map it through an adapter rather than renaming persisted values in place.

Error handling requirements:
- Show the failed phase and a human-readable explanation.
- Provide retry only when the backend marks the operation retryable.
- Reuse the same job/idempotency identity for a safe retry.
- Do not ask the user to upload the same file again if the provider confirms the source object is intact.
- If storage upload succeeded but database registration failed, provide a reconciliation path rather than blindly creating a second object.
- If publication fails after protection, preserve the protected asset in a recoverable pending state.
- Provide a support/reference ID for unresolved failures.
- Never show success until the server confirms the resulting asset record and status.

## 10. SharePlace and My Assets integration

On successful publication:
- Create or update one authoritative SharePlace record for the asset.
- Display family, title, creator, preview, publication state and supported access policy.
- Ensure filters use canonical family identity, not extension heuristics.
- Keep legacy source-file records identifiable for audit/migration, but exclude them from public discovery and playback in the target product.
- Avoid duplicate cards when a retry or synchronization event is replayed.
- Preserve existing likes, follows, playlists, shares, playback history and deep links where the existing asset record supports them.

My Assets should include:
- All families and a family filter.
- Draft / processing / published / private / failed views.
- Source and protected-file status where available.
- Storage provider and sync health where available.
- Rights declaration/review state.
- Earnings and usage summaries only from authoritative APIs.
- Retry/recovery actions only when supported by the server.

## 11. API and data-contract integration approach

Before implementation, map each wizard action to the existing frontend and backend routes and record:
- Method and path.
- Authentication requirement.
- Request schema and response schema.
- Database writes.
- Storage side effects.
- Wallet/ledger side effects.
- Retry/idempotency behavior.
- Deployed Worker version and runtime test evidence.

Existing route families identified in the prior source audit include `/api/v1/files`, `/api/v1/playback`, `/api/v1/shareplace`, `/api/shares`, legacy `/api/upload/tl`, `/api/download/:shareId` and TL3 consume routes. This list is not an exhaustive or deployment-verified API contract. Do not implement a new client request based only on route names.

Prefer a thin frontend adapter:
- UI uses canonical family and job vocabulary.
- Adapter translates legacy response shapes.
- Backend remains the source of truth for auth, balances, family identity, lifecycle, storage and settlement.
- Do not change auth token keys, login redirects or permission rules in a visual implementation pass.

## 12. Source-audit status snapshot

| Capability | TL3 | TL4 | TLD | TLJ |
|---|---|---|---|---|
| Generic file/type handling | Confirmed in inspected source | Partial: MIME/extension support | Partial: PDF handling | Partial: image handling |
| Family-specific metadata | Partial / existing music metadata | Not established | Not established | Certificate metadata only; generic image metadata not established |
| Protected container | Confirmed legacy TLNK path in inspected source | Partial / naming path only | Partial / naming path only | Certificate artifact path; generic family container not established |
| Viewer/player | Confirmed TL3 player path | Not established | Partial score/PDF viewer feature; generic TLD viewer not established | Certificate viewer only |
| Time consume | Confirmed source-level TL3 path | Not established | Not established | Not established |
| Creator settlement | Confirmed source-level TL3 path | Not established | Not established | Not established |
| SharePlace | Confirmed legacy music path | Generic detection partial; registration family semantics inconsistent | Generic detection partial; registration family semantics inconsistent | Generic detection partial; registration family semantics inconsistent |
| Runtime/deployed verification | Not yet completed | Not yet completed | Not yet completed | Not yet completed |

“Not established” means the inspected source set did not prove a complete capability. It is not a claim that no implementation exists anywhere. Runtime tests and deployed Worker comparison remain mandatory.

## 13. Acceptance criteria

A family-specific wizard is ready for controlled implementation only when:
- [ ] All four families have equal entry prominence.
- [ ] Each family has explicit metadata schema and server-side validation.
- [ ] Rights declaration and evidence state are auditable.
- [ ] Storage provider availability is checked, not guessed.
- [ ] Container identity/version is verified independently of filename.
- [ ] Legacy file formats remain readable through compatibility handling.
- [ ] Release policy is separated from asset family.
- [ ] Billing unit and settlement rules are approved per family.
- [ ] Protected TL3 playback and settlement pass regression tests; legacy source-file records are not publicly exposed.
- [ ] Existing POC/TLC behavior passes regression tests without accounting changes.
- [ ] Duplicate registration and duplicate SharePlace creation are prevented.
- [ ] Failed uploads and interrupted registrations can be recovered safely.
- [ ] SharePlace and My Assets use canonical family metadata.
- [ ] Authentication, wallet, storage and API contracts are unchanged unless separately approved.
- [ ] Desktop and mobile flows pass accessibility and usability review.
- [ ] Runtime tests are recorded against the deployed environment.
- [ ] Owner reviews and explicitly approves before any production rollout.

## 14. Decisions required before production implementation

1. Confirm canonical file suffixes for TL3/TL4/TLD/TLJ and the backward-compatibility reader policy.
2. Confirm which release/access modes are enabled for each family.
3. Decide metering and settlement units for TL4, TLD and TLJ.
4. Define family-specific file type and technical limits from actual processing infrastructure.
5. Approve rights declaration wording, evidence review process and dispute states.
6. Define whether source files, protected containers and derivatives are all retained, and for how long.
7. Confirm the authoritative API contract and deployed Worker version for each registration path.
8. Decide whether `creator.html` or `creator-studio.html` is the canonical entry only after comparing both end-to-end in a working runtime.

## 15. Implementation sequence

**Phase A — preserve and verify**
- Capture baseline routes, API contracts, storage behavior and sample records.
- Run current TL3, free MP3, wallet, POC/TLC and creator settlement regression tests.
- Verify Google Drive, OneDrive and Local Agent flows independently.
- Record deployed frontend and Worker commit/version.

**Phase B — canonical adapter and schema**
- Define canonical asset family and lifecycle vocabulary.
- Build read-compatible adapters for legacy `content_kind`, file suffixes and SharePlace records.
- Add no destructive migration; dual-read/dual-write only with an approved rollback plan.

**Phase C — family registration services**
- Implement/verify server-side validation and metadata for each family.
- Add idempotent registration jobs and storage reconciliation.
- Complete family-specific container/viewer/usage/settlement paths only after policy approval.

**Phase D — UI wizard**
- Implement the new wizard on separate routes/components.
- Connect only to verified APIs.
- Preserve legacy creator pages until parity tests and owner acceptance.

**Phase E — controlled rollout**
- Feature-flag or route-allowlist the new experience.
- Compare records and accounting outcomes.
- Keep rollback path available.
- Deploy only after explicit owner approval.

---
**Safety boundary:** This document and any visual wizard prototype are non-production design artifacts. They do not authorize merging PRs, changing production routes, migrating records, altering cryptography, modifying wallet/POC/TLC accounting or deploying code.
