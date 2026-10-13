# Four-Family Functional Matrix

**Status:** Source-level audit, 2026-10-14  
**Scope:** Frontend repository default source snapshot and backend repository default source snapshot  
**Purpose:** Establish an evidence-based baseline for TL3, TL4, TLD, and TLJ without changing production code.

## 1. Governing architecture

TimeLink is one digital-asset platform with one shared time/economy core and four equal asset families:

- **TL3 — Audio**
- **TL4 — Video**
- **TLD — Documents**
- **TLJ — Images / visual assets**

The shared core is responsible for identity, creator/owner authorization, time-based usage accounting, content protection, integrity/rights records, TL balance operations, POC contribution, TLC participation/mining, and creator settlement. Each family supplies its own metadata profile, payload/container profile, preview/viewer/player, and family-specific interaction model.

A family must not be treated as a sub-feature of TL3. Broadcast, DJ, cafe radio, and in-car radio are applications that may use supported assets; they do not define the platform as a whole.

## 2. Evidence labels

| Label | Meaning |
|---|---|
| **Confirmed** | Concrete source code and route/function were located. This is not a claim of successful live runtime testing. |
| **Partial** | Some supporting code exists, but the complete end-to-end family workflow was not established. |
| **Not found in inspected source** | The searched source snapshot did not reveal the capability. This is not proof that no private, external, local-agent, or deployed implementation exists. |
| **Runtime unverified** | The code path has not been exercised end-to-end in a controlled environment. |

## 3. Family-level status

| Capability | TL3 Audio | TL4 Video | TLD Documents | TLJ Images / Visual |
|---|---|---|---|---|
| Family identity in frontend | Confirmed | Partial | Partial | Partial |
| Generic file-type detection | Audio-specific paths | Partial MIME/extension detection | Partial MIME/extension detection | Partial MIME/extension detection |
| Family-specific asset registration | Confirmed TL3 release/upload routes | Not found in inspected source | Partial PDF/score-related paths; no general document registration established | Certificate-image path exists; general image registration not established |
| Protected family container | Confirmed TL3 v3 implementation and older TL container code | Generic legacy container helper maps video to `.tl4`; dedicated TL4 profile not established | Generic legacy helper maps PDF to `.tlf`; TLD profile not established | Generic legacy helper maps image to `.tlg`; TLJ profile not established |
| Dedicated player / viewer | Confirmed TL3 web/offline player paths | Not found in inspected source | Partial score/PDF viewer/download path | Certificate-only TLJ viewer exists; general image viewer not established |
| Time-based consumption | Confirmed TL3 consume route | Not found in inspected source | Score-use charge exists in frontend path; generic document time accounting not established | Not found in inspected source |
| Creator earning / settlement | Confirmed TL3 playback settlement path | Not found in inspected source | Score-use path requires backend route verification | Certificate fees exist as a separate certificate workflow; image-asset settlement not established |
| SharePlace discovery | Present, but currently audio-centric data semantics | Type detection exists; family-safe listing/playback not established | Type detection / score entry exists; general document listing not established | Type detection exists; general image listing not established |
| My Assets / library | TL3-oriented existing flows | TL4 label appears in a demo-oriented React tab; production family workflow not established | Not found as a general family workflow | Not found as a general family workflow |
| EARN / analytics | Existing shared creator/economy surfaces, with TL3 evidence | Shared integration not established | Shared integration not established | Shared integration not established |

## 4. Common-core evidence and constraints

### 4.1 Identity, registration, and discovery

- Backend registers `/api/v1/files`, `/api/v1/playback`, `/api/v1/shareplace`, and legacy-compatible `/api/shares` routes.
- The legacy files table has a generic `file_type` field. This is useful as a foundation, but a generic field alone does not establish four complete family workflows.
- SharePlace currently reads both modern `tl_shares` and legacy `tl_files` records.
- The inspected modern SharePlace registration paths assign `content_kind` as `mp3` or `tl3`; they do not yet establish all four family kinds.
- The frontend has a `detectType` helper that can recognize image, video, and document MIME types/extensions. Separately, its `contentKind` helper classifies `.tl4`, `.tlg`, and `.tlf` as TL3. These two classifiers can disagree. Do not build further family UI on this inconsistent classification.

### 4.2 Storage

- Backend supports D1 object storage and user-owned Google Drive / OneDrive connections, plus a Local Agent provider.
- Storage registration records an object and can associate it with a SharePlace record.
- This is a promising shared storage foundation. Family-specific MIME validation, encryption/container profile, rights metadata, and retrieval behavior still need explicit contracts.
- Do not assume that generic object storage equals a finished TL4/TLD/TLJ protected-content implementation.

### 4.3 Time accounting and settlement

- The inspected playback router contains a legacy per-file balance playback path and a dedicated `/tl3/consume` path.
- The TL3 path debits the consumer's TL balance by consumed seconds and credits creator revenue.
- The inspected code does not establish equivalent TL4, TLD, or TLJ usage-accounting paths.
- The user's confirmed POC/TLC mining test must be preserved. This audit does not reclassify the mining engine as absent or nonfunctional.

## 5. Naming and format conflicts requiring a decision

There are currently multiple naming conventions in source:

| Purpose | User's platform family name | Existing source evidence |
|---|---|---|
| Audio | TL3 | `.tl3` |
| Video | TL4 | `.tl4` appears in generic legacy extension mapping and download naming |
| Document | TLD | `.tld` appears in the frontend score PDF URL; generic backend helper uses `.tlf` |
| Image / visual | TLJ | `.tlj` is used for a certificate image file; generic backend helper uses `.tlg` |

**Decision required before implementation:** confirm the canonical family extensions and distinguish an asset family container from a certificate/export artifact. The platform architecture uses TLJ for image/visual assets and TLD for documents unless the owner explicitly approves a different naming standard. Existing files and URLs must remain readable through compatibility handling; no bulk rename or conversion is authorized by this audit.

The TLJ certificate workflow is a rights-certificate artifact. It must not be mistaken for the complete TLJ image-asset family. Likewise, a score PDF download is not by itself a general TLD document asset system.

## 6. SharePlace and content-kind correction

The SharePlace frontend currently has separate helpers:

- `isType` / `detectType`: classify MIME types and file extensions as audio, video, image, or document.
- `contentKind`: classify the commercial/release mode as MP3 or TL3.

The inspected `contentKind` implementation returns only MP3 or TL3, and its extension check groups `.tl4`, `.tlg`, and `.tlf` with TL3. The backend SharePlace registration similarly stores only MP3/TL3 content-kind values in the inspected paths.

**Required architecture correction:** replace the overloaded two-value concept with two independent, explicit fields:

1. `asset_family`: `tl3 | tl4 | tld | tlj`
2. `release_mode` / `access_policy`: e.g. free, time-metered, fixed-price, subscription, or other approved policy.

Do not infer family identity from a filename extension alone. Use validated server-side metadata and container header identity. Preserve legacy rows with a migration/read-compatibility adapter rather than silently reclassifying them.

## 7. Recommended functional contract for every family

Each family must implement the same lifecycle contract, with family-specific details:

1. **Create / register:** accept a supported source file, validate MIME and size, collect family metadata, identify owner/creator, record source hash, and confirm rights.
2. **Protect / package:** generate the canonical family container with authenticated metadata, integrity verification, and protected payload.
3. **Store:** use an approved storage provider and persist a stable object reference; storage location must not become the asset identity.
4. **Publish:** create a typed asset record and optional SharePlace listing, with visibility and pricing/access policy.
5. **Consume:** authorize the user and session; measure the relevant usage unit; debit TL according to the approved policy.
6. **Settle:** record immutable usage events and calculate creator revenue through the common settlement interface.
7. **Present:** route to the correct player/viewer and preserve family-specific interactions.
8. **Manage:** expose the asset in My Assets with status, rights, usage, earnings, and version history.
9. **Contribute:** connect eligible creation, curation, sharing, and other approved activity to POC/TLC rules without allowing free MP3 uploads to spend TL or create unintended TL bonuses.

## 8. Family-specific product behavior to design

| Family | Primary metadata | Presentation | Metering unit to specify |
|---|---|---|---|
| TL3 Audio | title, creator/performers, composer/lyricist, duration, cover, audio codec | audio player, playlist, waveform/lyrics/score where available | playback seconds |
| TL4 Video | title, creator, duration, resolution, codec, poster, subtitles/captions | protected video player, seek/resume, captions | playback seconds or approved viewing unit |
| TLD Documents | title, author, document type, page count, language, version | protected document/PDF viewer, page navigation, search/annotations where permitted | page-time, session-time, or document access policy; decision required |
| TLJ Images / Visual | title, creator, dimensions, format, color profile, collection/series | protected image viewer, zoom/pan, gallery, sequence where applicable | viewing-time/session or licensed access policy; decision required |

Metering units for TLD and TLJ are product decisions, not assumptions. They must be defined before implementing charges or settlement.

## 9. Implementation sequence (no production edits authorized)

1. Confirm canonical extensions and container versions for all four families.
2. Define shared asset identity and typed metadata schema; separate `asset_family` from `release_mode`.
3. Map every existing table, endpoint, page, local-agent operation, and deployed route to that schema.
4. Add compatibility reads for existing TL3, score PDF, certificate TLJ, generic legacy TL files, and old SharePlace records.
5. Complete one end-to-end family workflow at a time, while keeping the four families equal in navigation and product architecture.
6. Validate with disposable test accounts and non-production sample files; never use real paid balances for destructive tests.
7. Only after approval, prepare a separate implementation branch and reviewable PR. Do not deploy or merge without explicit owner approval.

## 10. Audit limitations

This document is based on source inspection of repository snapshots. It does not claim that every deployed Worker, local agent, external storage provider, private branch, or production database has been inspected. It does not claim live end-to-end success or failure for any route. Runtime tests, deployed-version comparison, and data-schema inspection remain separate verification tasks.
