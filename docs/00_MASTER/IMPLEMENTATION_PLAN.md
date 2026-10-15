# TimeLink 통합 개발 실행 계획 v1

- 기준일: 2026-10-14
- 작업 브랜치: 별도 feature branch 사용
- 원칙: 기존 운영 기능 보존, 신규 화면 병행, API/경제/보안 회귀 검증

## 1. 지금까지 저장된 설계 기준
- `TIMELINK_INTEGRATED_ARCHITECTURE_V1.md`
- `EXISTING_IMPLEMENTATION_INVENTORY.md`
- `DOMAIN_DATA_MODEL.md`
- `ROUTES_AND_NAVIGATION.md`
- `ADR_STORAGE_AND_DELIVERY.md`

## 2. P0 — 보안과 현행 기능 기준선
1. 공개 저장소에 노출된 것으로 보이는 외부 API 자격증명을 제공자 콘솔에서 폐기·재발급하고 Worker Secret으로 이전한다.
2. frontend/backend/score 각 저장소의 기본 브랜치와 배포 브랜치, 최근 커밋을 기록한다.
3. Cloudflare Pages/Workers의 실제 연결 브랜치와 현재 배포 버전을 확인한다.
4. 테스트 계정으로 로그인, SharePlace, Track, TL3 재생, Creator 업로드, Local Agent, Wallet, Radio, DJ, Cafe, InCar, Ads를 점검한다.
5. 정상/오류 상태를 화면 녹화 및 API 응답으로 기준선화한다.

완료 조건: 보안 자격증명 교체 여부, 배포 브랜치, 주요 기능별 재현 가능한 테스트 결과가 문서화된다.

## 3. P1 — 공통 UI shell prototype
- 신규 경로 `public/renewal/`에서만 작업한다.
- 로그인/가입 시작 화면 및 회원용 responsive shell을 제작한다.
- 데스크톱 내비게이션과 모바일 내비게이션을 별도 설계한다.
- My Dashboard, My Files, My Music, SharePlace의 핵심 정보 구조를 배치한다.
- 실제 API 연결 전까지 모든 샘플 수치는 명확하게 demo placeholder로 표시한다.
- 기존 HTML, sidebar.js, 로그인 토큰 및 운영 라우트는 변경하지 않는다.

완료 조건: 기존 운영 페이지에 영향 없이 별도 URL에서 데스크톱·모바일 시안을 확인할 수 있다.

## 4. P2 — 공통 도메인 및 API
- Rights & Ownership Registry 논리 모델 확정
- Asset Registry 및 SourceAsset/TLAsset 연결
- My Files 목록 API 권한 확인
- Social Core 좋아요·팔로우·댓글·플레이리스트의 영속 구현 설계 및 테스트
- notification/report/moderation API 설계
- idempotency, rate limit, audit log 적용

완료 조건: 소유자/비소유자/비로그인 시나리오 테스트와 DB 제약조건 검증.

## 5. P3 — 개인 대시보드 및 파일 관리
- My Dashboard 요약 API
- My Files: 원본/TL 파일, 유형, 상태, 저장소 연결, 버전
- My Assets: 창작/소유/관리 권한 분리
- My Music: 앨범/트랙 관리
- 파일 교체/삭제 영향 확인과 확인 단계

완료 조건: 기존 records와 잔액에 영향 없이 기존 파일들이 새 라이브러리에 올바르게 나타난다.

## 6. P4 — Track Page 및 음악 레이블
- 기존 track.html의 재생·충전·댓글·좋아요 UI 및 API 매핑
- Social Core 실제 영속 기능 구현
- 곡별 홍보 게시물과 통계
- Album/Artist/Track 카탈로그
- 외부 발매 이력 연결 및 파일 매칭
- 업로더 책임 선언과 추가 증빙
- TL3 release API의 권리·메타데이터 검증
- 기존/신규 발행 흐름을 단일 카탈로그로 연결

완료 조건: 기존 발행 음원과 신규 음원이 권리 상태·버전·발행 이력을 보존하며 Track Page에 연결된다.

## 7. P5 — Creator / 저장소
- Creator 한 가지 UX로 통합
- Local Agent 및 Google/OneDrive provider connector 재사용
- 저장 위치 ADR에 따른 provider interface
- 원본 비공개, TL-only publication
- TL3 v3 경로와 파일 해시 검증
- 재시도/중복 업로드 방지

완료 조건: 원본이 공개되지 않고 TL3만 SharePlace에 발행되며 재생·시간 차감이 검증된다.

## 8. P6 — SharePlace / Broadcast / Cafe / InCar
- 네 자산 유형 탐색
- TL방송국·DJ·Cafe·InCar 기존 업무 흐름 보존
- 기존 상업 정책 및 POC 계산의 서버 값 확인
- 소셜 활동 및 경제 원장 연결

## 9. P7 — 광고
- 직접 광고와 외부 광고 공급원 adapter 분리
- IMA SDK의 실제 연동/광고 호출/콜백 검증
- 광고주 센터의 기존 캠페인 API 보존
- 외부 광고 정산과 TimeLink 내부 기여 분리
- 클라이언트 잔액 fallback 제거 전 서버 보상 원장 검증

## 10. P8 — 경제 및 운영 관리자
- TL/TLC/POC 분리 표시
- 결제·지갑·정산 통합
- 정책 버전, effective time, audit trail
- Cafe/InCar 정책과 광고 보상 설정을 서버 권위형으로 관리
- 기존 거래와 보상 기록은 재계산/변경하지 않는다.

## 11. 개발/테스트/배포 규칙
- 각 기능은 별도 feature branch에서 구현한다.
- 한 작업 단위에서 변경 범위를 최소화한다.
- 기존 API 계약이 유지되는지 contract test를 수행한다.
- UI 테스트, API 통합 테스트, 권한 테스트, 모바일 레이아웃 테스트를 수행한다.
- TypeScript/JavaScript 빌드·lint·정적 검사 및 오류 콘솔을 확인한다.
- 경제·암호화·파일 저장·DB migration은 별도 승인 없이 변경하지 않는다.
- 신규 화면은 기존 페이지와 병행한다.
- 사용자 승인 전 운영 배포, 기본 URL 교체, DB migration을 수행하지 않는다.

## 12. 첫 개발 단위
첫 실제 개발은 기능 변경이 아닌 **Renewal Shell + My Dashboard 화면 골격**으로 한다.
- 별도 URL
- 기존 로그인 상태는 읽기 전용으로 확인
- 메뉴·반응형 레이아웃
- 내 파일/내 음악/SharePlace 진입점
- 서버 API 연결은 기존 계약 확인 후 단계별 연결
- 기존 운영 페이지에 영향이 없는지 회귀 확인
