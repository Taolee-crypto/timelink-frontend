# TimeLink 라우트 및 메뉴 아키텍처 v1

- 기준일: 2026-10-14
- 상태: 목표 구조 제안. 현행 URL을 유지한 병행 개발 기준.

## 1. 라우팅 원칙

- 기존 HTML URL은 호환 경로로 유지한다.
- 신규 UI는 별도 `/renewal/` 경로에서 먼저 구현한다.
- 인증·역할 검증은 프런트엔드 메뉴 숨김만으로 처리하지 않고 서버에서 확인한다.
- 메뉴는 사용자 역할과 등록 상태에 따라 노출하되, 사용자가 여러 역할을 동시에 가질 수 있게 한다.
- Track Page URL은 공유 가능한 고정 주소를 갖는다.
- 내부 모듈명과 일반 회원에게 보이는 메뉴명을 구분한다.

## 2. 공개 영역

| 목표 경로 | 기존 경로/파일 | 역할 |
|---|---|---|
| / | /index.html | 브랜드 랜딩 및 공개 플랫폼 소개 |
| /login | /login.html | 로그인 |
| /signup | /signup.html | 회원가입 |
| /explore | /shareplace.html | 공개 허용된 TL 자산 탐색 |
| /track/:trackId | /track.html?id=... | 곡별 공개 페이지 |
| /album/:albumId | 신규 | 앨범 페이지 |
| /artist/:artistId | 신규 | 아티스트 공개 프로필 |
| /terms, /privacy | 기존 legal pages | 약관·개인정보 |

## 3. 로그인 회원 영역

| 목표 경로 | 기능 | 기존 자산 |
|---|---|---|
| /app | 로그인 회원 홈 | dashboard.html |
| /app/my | My Dashboard | dashboard.html |
| /app/files | My Files | dashboard 콘텐츠 탭, React LibraryTab 참고 |
| /app/assets | My Assets 전체 | dashboard, creator, SharePlace API |
| /app/music | My Music | creator.html, track.html |
| /app/creator | Creator 홈 | creator.html |
| /app/creator/new | 파일 등록·TL 제작 | creator.html Local Agent 흐름 |
| /app/label | TimeLink Label | 신규 |
| /app/label/releases | 발행 관리 | TL3 release API |
| /app/label/albums/:id | 앨범 관리 | 신규 |
| /app/label/tracks/:id | 트랙 관리 | track.html 확장 |
| /app/shareplace | SharePlace | shareplace.html |
| /app/broadcast | TL방송국 | radio.html |
| /app/dj | DJ 센터 | dj-center.html |
| /app/cafes | Cafe 탐색·공간 | cafe-radio.html, cafe-channel.html, cafe-owner.html |
| /app/incar | InCar | incar.html, incar-channel.html |
| /app/economics | TL Economics 요약 | dashboard.html, wallet.html |
| /app/wallet | 지갑·충전·거래 | wallet.html |
| /app/consume | 이용 내역 | 기존 재생 기록 API 확인 필요 |
| /app/earn | 기여·정산 내역 | 경제 API 확인 필요 |
| /app/mining | POC/TLC | wallet.html, economics.ts |

## 4. Track Page 구조

`/track/:trackId` 하나에서 공개 뷰와 권한별 관리 기능을 제공한다.

공개 방문자:
- 곡 기본정보, 커버, 아티스트, 앨범
- 권한이 있는 가사·소개
- TL3 재생/이용 안내
- 좋아요, 댓글, 공유, 저장(로그인 정책에 따름)
- 아티스트 팔로우

트랙 소유자/관리자:
- 곡 정보 수정
- 곡별 홍보 콘텐츠 등록·수정·예약
- 커버/가사/크레딧 관리
- 발행·권리 확인 상태
- 청취·좋아요·댓글·공유 통계
- 신고/댓글 관리 및 페이지 상태

## 5. 광고주·관리자

| 목표 경로 | 권한 | 기존 자산 |
|---|---|---|
| /business/advertiser | advertiser | advertiser.html |
| /business/campaigns | advertiser | advertiser.html |
| /business/reports | advertiser | advertiser.html |
| /admin | admin | admin.html |
| /admin/rights | moderator/admin | 신규 |
| /admin/ad-sources | admin | 신규 |
| /admin/economy-policy | admin | admin.html / economics APIs |
| /admin/system | admin | admin.html |

외부 광고 연동 설정과 비밀 자격증명은 관리자 전용이다. 광고주는 자신의 캠페인과 보고서만 접근한다.

## 6. 권한 매트릭스(기본)

| 작업 | 일반 회원 | 창작자/아티스트 | 광고주 | DJ/Cafe 운영자 | 관리자 |
|---|---:|---:|---:|---:|---:|
| 공개 자산 보기 | 허용 범위 | 허용 범위 | 허용 범위 | 허용 범위 | 전체 |
| 원본 파일 관리 | 본인 자산 | 본인/위임 자산 | 캠페인 소재 | 역할에 따른 자산 | 심사 권한 |
| TL 파일 제작 | 가능 | 가능 | 별도 자산 정책 | 가능 | 운영 권한 |
| 트랙 홍보 | 본인 관리 트랙 | 본인/위임 트랙 | 캠페인 연계 별도 | 허용 범위 | 운영 |
| 곡 정보 변경 | 불가 | 본인/위임 권한 | 불가 | 불가 | 심사·조치 |
| 캠페인 관리 | 불가 | 광고주 권한 별도 | 본인 회사 | 불가 | 전체 |
| 공급자 API 연결 | 불가 | 불가 | 불가 | 불가 | 관리자 |
| 글로벌 경제 정책 변경 | 불가 | 불가 | 불가 | 불가 | 승인된 관리자 |

서버는 각 요청마다 리소스 소유·위임·역할을 검증한다. URL 접근 가능 여부나 메뉴 노출만으로 권한을 판단하지 않는다.

## 7. 기존 URL 호환

- 기존 .html 경로를 즉시 삭제하지 않는다.
- 신규 라우트가 동일 API/데이터를 읽고 기존 액션을 대체할 수 있는지 검증한다.
- 이전 링크, 외부 검색, 공유 링크 및 북마크를 보존한다.
- 검증 후 redirect 또는 호환 wrapper를 적용한다.
- route switch는 기능 단위로 수행하고 즉시 되돌릴 수 있어야 한다.

## 8. 메뉴 제안

기본 회원 메뉴는 다음 순서로 단순화한다.
1. 홈
2. SharePlace
3. Creator
4. 내 파일
5. 내 자산/내 음악
6. TL방송국
7. DJ
8. Cafe
9. InCar
10. TL Economics
11. 마이

TimeLink Label은 음악 창작자/아티스트에게 My Music 내부 업무 메뉴로 노출한다. 광고주와 관리자는 별도 워크스페이스를 사용한다. 공통 서비스(인증, 권리, 파일 엔진, 결제)는 내부 기반이지 각각 별도 상위 메뉴가 아니다.

## 9. 병행 개발 원칙

- 신규 화면은 `/renewal/` 하위에 만든다.
- 기존 HTML과 API를 삭제하거나 이름 바꾸지 않는다.
- 신규 shell은 기존 인증 토큰과 사용자 세션을 읽기 전용으로 우선 연결하되, 인증 저장 방식 변경은 별도 설계한다.
- 신규 화면의 API 호출과 권한 검증을 테스트한 후에만 기존 경로를 대체한다.
