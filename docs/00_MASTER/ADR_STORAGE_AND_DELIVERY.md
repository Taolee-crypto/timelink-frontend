# ADR-001: TimeLink 원본 및 TL 파일 저장·전달 구조

- 기준일: 2026-10-14
- 상태: 조사 완료 / 최종 저장소 변경은 미승인
- 결정 범위: 원본 소스 파일, 보호 TL 컨테이너, 메타데이터 및 스트리밍 전달

## 1. 배경

TimeLink는 창작자의 파일 소유권을 존중하고 파일을 기술적으로 관리·공유·유통한다. 따라서 원본과 보호 TL 컨테이너의 실제 저장 위치 및 접근 경로는 소유권, 비용, 가용성, 보안, 재생 품질에 직접 영향을 준다.

현재 코드와 문서에는 서로 다른 구현 경로가 함께 존재한다.

### 관찰된 구현 경로
1. Local Agent: 사용자 PC의 `TimeLink/shared` 폴더에 파일을 저장하고 로컬 HTTP 서버 및 Cloudflare Tunnel을 통해 접근시킨다.
2. Google Drive / OneDrive: OAuth 연결, 암호화된 토큰 보관, 업로드 세션, provider object 등록 및 Range 스트리밍 코드가 있다.
3. D1 Object Storage: D1 BLOB 청크 기반 저장 모듈이 있으며 현재 구현 상 파일당 최대 100MB 제한이 있다.
4. TL3 v3: 백엔드 release endpoint가 원본 URL에서 MP3를 가져와 AES-256-GCM TL3 v3를 만들고 D1 Object Storage에 저장하는 경로가 있다.
5. TL3 v2: 별도 upload endpoint에서 TLNK v2 파일을 검사해 D1에 저장하는 레거시 경로가 남아 있다.
6. SharePlace legacy: 원본 MP3를 D1 object에 저장하고 공개 stream URL을 등록하는 경로가 남아 있다. 이는 TL-only 공개 정책과 충돌한다.

기존 문서도 저장 위치를 단일하게 설명하지 않는다. 따라서 이 ADR은 기존 파일 이동·삭제나 API 전환을 승인하는 문서가 아니다.

## 2. 검토한 선택지

### A. TimeLink 중앙 저장소
- 장점: 전달·가용성·운영 통제가 상대적으로 단순하다.
- 단점: 저장/트래픽 비용, 파일 소유권에 대한 오해, 대용량 확장 및 R2 결제 제약.
- 현재 Cloudflare R2를 사용 가능하다고 가정할 수 없다.

### B. 사용자 소유 저장소를 기본으로 사용
- 지원 후보: Local Agent(PC/NAS), Google Drive, OneDrive.
- 장점: 원본 파일의 실제 저장을 사용자 소유 저장소에 두고 TimeLink는 권한·메타데이터·이용·정산을 관리한다.
- 단점: 사용자 PC/네트워크 오프라인, 개인 클라우드 쿼터·API 제한, OAuth 만료, provider 파일 삭제·권한 철회에 따른 재생 실패, Range 요청 지연.
- 로컬 에이전트와 Google/OneDrive를 동일한 provider contract로 정규화해야 한다.

### C. 혼합형
- D1: 사용자/권리/자산 메타데이터, 인덱스, 토큰·세션·경제 원장
- 사용자 저장소: 원본 및 TL 컨테이너 바이트
- D1 Object: 이전 데이터 및 제한된 임시/전환용 파일
- 장점: 사용자 소유권 원칙과 기존 D1 경로의 점진적 호환을 함께 유지할 수 있다.
- 단점: 다중 provider의 장애·복구·검증을 처리해야 한다.

## 3. 잠정 결정

**목표 구조는 C 혼합형을 기준으로 설계한다.** 사용자 소유 저장소를 원본과 TL 컨테이너의 장기 저장 위치로 우선 지원하고, D1은 메타데이터·권한·세션·원장 및 검색 인덱스의 중심으로 둔다. D1 Object는 기존 호환·전환 경로로 취급하며 신규 일반 원본 공개 저장소로 확대하지 않는다.

다만 이 결정은 실제 provider range streaming, TL3 segment delivery, Local Agent 가용성 및 데이터 정합성 E2E 검증을 통과하기 전에는 운영 저장 정책으로 활성화하지 않는다.

## 4. 대상 파일 흐름

### 원본
1. 업로더가 책임 선언 및 필요한 권리 자료를 제출한다.
2. 브라우저는 선택한 저장소(Local Agent / Google Drive / OneDrive)에 원본을 업로드한다.
3. TimeLink는 파일 ID, owner/uploader, provider ref, MIME, size, hash, 권리 상태를 D1에 기록한다.
4. 원본은 기본 비공개이며 공개 플레이어·SharePlace URL로 제공하지 않는다.

### TL 파일
1. Creator가 권한 있는 원본을 읽는다.
2. TLNK 형식과 타입별 보호 규격에 맞춰 TL3/TL4/TLD/TLJ를 제작한다.
3. 보호 컨테이너를 사용자 소유 저장소에 저장한다.
4. D1에는 TLAsset 메타데이터, 저장소 참조, 버전, rights snapshot, publication state를 기록한다.
5. SharePlace에는 공개 허용된 TLAsset만 노출한다.

### 이용
1. 이용자가 Track/Asset 페이지에서 이용을 요청한다.
2. 서버가 인증·권리·공개 상태·TL 잔액·세션을 검증한다.
3. 서버가 저장소 참조를 통해 보호된 TL payload/segment를 Range 방식으로 전달한다.
4. 기존 TL3 v3 토큰 체인 및 시간 회계 규칙을 유지한다.
5. 이용·차감·기여·정산 기록은 서버 원장에 기록한다.

## 5. 필수 provider interface

- connect / disconnect
- createUploadSession
- uploadPart / finalizeUpload
- registerObject
- getMetadata
- readRange
- verifyHash
- deleteOrRevoke (권한·영향 확인 후)
- healthCheck / reconnect
- quota / availability status

모든 provider adapter는 사용자 ID, connection ID, object ID, ownership scope를 확인해야 한다. 외부 저장소 토큰은 암호화하여 서버에 보관하고 프런트엔드에 반환하지 않는다.

## 6. TL3 및 보안 제약

- TL3 v3 AES-256-GCM 및 타임토큰 체인 규격은 UI 개편과 분리한다.
- 현재 backend의 TL3 release가 D1 object를 직접 사용하므로 provider 저장소로 바꾸려면 저장 인터페이스 추상화와 range-read 통합 테스트가 필요하다.
- 브라우저에 마스터 비밀키를 넣지 않는다.
- 원본 URL을 공개 플레이어 URL로 사용하지 않는다.
- TL 파일 저장 위치 변경은 파일 해시, 컨테이너 버전, segment offset, token chain 및 재생 검증 후에만 수행한다.

## 7. 수용 기준

- 사용자 소유 저장소가 오프라인일 때 명확한 오류 및 재시도/재연결이 제공된다.
- 다른 사용자의 provider object를 추측하거나 접근할 수 없다.
- 업로드 완료와 메타데이터 등록이 원자적으로 복구 가능하다.
- Range 요청과 TL3 순차 세그먼트 전달이 안정적으로 동작한다.
- D1 원장과 provider object의 존재·해시가 정기적으로 대조된다.
- provider 삭제·권한 철회 시 소유자에게 영향이 통지된다.
- 기존 D1 저장 자산은 검증된 이관 전까지 유지된다.

## 8. 금지된 변경

- 운영 파일을 한 번에 이동하거나 삭제
- 기존 stream URL을 무검증 변경
- Local Agent를 제거하거나 cloudflared 설정을 덮어쓰기
- R2 활성화/결제 또는 외부 스토리지 계약을 임의 진행
- TL3 v2/v3 파일을 변환 없이 동일 포맷으로 간주
- 암호화·TL 차감·토큰 체인을 화면 개편과 함께 변경

## 9. 후속 검증

1. Local Agent의 실제 upload/read/range/auth 동작
2. Google Drive / OneDrive OAuth, token refresh 및 Range streaming
3. backend TL3 v3 release와 D1 object 경로
4. D1 object 용량 제한과 현재 운영 데이터 사용량
5. 사용자 소유 저장소의 권한 철회 및 파일 삭제 시 복구
6. 신규 provider interface를 통한 TL3 end-to-end 재생
