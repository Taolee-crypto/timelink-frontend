# TimeLink 통합 리뉴얼 작업 기록

## 2026-10-14 — 통합 아키텍처 기준선 및 첫 화면 착수

### 설계 문서 저장
저장소: `Taolee-crypto/timelink-frontend`
문서 브랜치: `docs/master-architecture-audit-20261014`

- `docs/00_MASTER/TIMELINK_INTEGRATED_ARCHITECTURE_V1.md`
- `docs/00_MASTER/EXISTING_IMPLEMENTATION_INVENTORY.md`
- `docs/00_MASTER/DOMAIN_DATA_MODEL.md`
- `docs/00_MASTER/ROUTES_AND_NAVIGATION.md`
- `docs/00_MASTER/ADR_STORAGE_AND_DELIVERY.md`
- `docs/00_MASTER/IMPLEMENTATION_PLAN.md`

### 첫 개발 작업
개발 브랜치: `feature/renewal-shell-20261014`
기준 커밋: `245d60aff24efce33d7ad9fad8ba682f2ed84ac5`

신규 경로에 별도 Renewal Shell을 추가했다.
- `public/renewal/index.html`
- `public/renewal/renewal.css`
- `public/renewal/renewal.js`

화면 기능:
- 비로그인 상태: TimeLink 소개, 로그인/회원가입 진입
- 기존 `tl_token` 및 `tl_user` 세션이 감지되는 경우: 개인 작업 공간 shell 표시
- My Dashboard, My Files, My Music, SharePlace, Creator, TL방송국, DJ, Cafe, InCar, TL Economics 진입 메뉴
- 데스크톱 사이드바와 모바일 드로어
- 기존 운영 페이지로 연결되는 호환 링크
- 임의의 잔액·활동 수치를 만들지 않으며, 기존 운영 API나 경제 로직을 변경하지 않는다.

### 검증 상태
- GitHub에서 신규 HTML/CSS/JS 파일과 아키텍처 문서의 저장 여부를 다시 읽어 확인했다.
- 운영 URL 전환, Cloudflare 배포, 기존 파일 수정, DB migration은 수행하지 않았다.
- 브라우저 실제 렌더링 및 end-to-end 테스트는 아직 수행하지 않았다.

### 조사 중 확인된 주의사항
1. 백엔드 공개 저장소의 `wrangler.toml`에 외부 서비스 API 자격증명으로 보이는 값이 하드코딩되어 있다. 유효 여부는 확인되지 않았으므로 노출된 것으로 간주해 제공자 측 폐기·재발급 및 Worker Secret 이전이 필요하다.
2. Track UI의 좋아요/팔로우/플레이리스트 API 중 일부는 백엔드 스텁이다. 댓글만 현재 DB 저장 경로가 관찰된다.
3. React 소스는 있으나 루트 빌드 설정이 확인되지 않고, 데모 데이터와 import 경로 불일치가 관찰된다. 운영 UI 기반으로 바로 채택하지 않는다.
4. Local Agent, Google Drive/OneDrive, D1 Object Storage 및 TL3 v2/v3 저장 경로가 공존한다. 저장소 변경은 ADR과 E2E 검증 후에만 한다.
5. 무료 MP3 공개 경로는 기존 화면과 API에 남아 있으나 신규 제품 정책과 충돌한다. 데이터는 보존하고 신규 공개 흐름에서 격리한다.

### 다음 작업
1. 자격증명 교체 여부 확인 및 비밀값 제거
2. backend API/DB/권한 전체 인벤토리
3. 신규 shell 브라우저 렌더링 확인
4. 개인 대시보드의 My Files/My Music 실제 API 매핑
5. Track Page 소셜 백엔드 기능 설계
6. Creator/TimeLink Label 발행 흐름의 기존 API 계약 검증
7. 첫 신규 페이지(My Dashboard)를 별도 경로에서 실제 데이터 연결
