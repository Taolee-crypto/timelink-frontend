# TimeLink IA (Information Architecture) v1

최종 수정: 2026-10-05

## 철학
- 모든 회원 = 크리에이터 (AI 시대)
- 역할은 겹친다 (사장 + DJ + 청취자 + 운전자)
- SharePlace = 듣기/벌기 데이터가 모이는 중심
- TL3 = 시간토큰(TL) 없으면 재생 불가 = 참여자 전원 수익
- 데이터는 각자 서버가 목표 (R2는 과도기)
- index.html = 홈페이지 (랜딩 + 투자자, 별도)
- 광고 시청 = 하루 20회 제한 (오전 10 / 오후 10), TL 충전과 연결
- DJ 센터 = DJ 대리점
- 카페/인카 = 별도 공간 (탐방 + 내 것 관리)

## 사이드바 전체 구조

### 홈
- URL: /
- 파일: index.html
- 설명: 랜딩(비로그인) + 홈(로그인)

### SharePlace
- URL: /shareplace
- 파일: shareplace.html
- 서브메뉴:
  - 음악 탐색 (전체/최신/인기/추천/장르별)
  - 무료 MP3 / TL3
  - 내 활동 (좋아요 / 재생 기록)

### TL방송국 (듣기)
- URL: /radio
- 파일: radio.html
- 서브메뉴:
  - DJ 라이브 → cafe-radio.html
  - 카페 방송 → radio.html 내
  - 인카 방송 → incar.html

### 크리에이터
- URL: /creator
- 파일: creator.html
- 서브메뉴:
  - 크리에이터 센터
  - 내 음악
  - 음악 올리기 → creator-studio.html

### 카페
- URL: /cafes
- 파일: cafes.html (신규)
- 서브메뉴:
  - 카페 탐방
  - 내 카페 관리 [등록 시] → cafe-owner.html
  - 카페 개설 → cafe-channel.html
  - 카페 방송 편성

### 인카
- URL: /cars
- 파일: cars.html (신규)
- 서브메뉴:
  - 차량 탐방
  - 내 차량 관리 [등록 시] → incar-channel.html
  - 차량 등록 → incar-channel.html
  - 중고차 홍보/판매

### 광고주
- URL: /advertiser
- 파일: advertiser.html
- 서브메뉴:
  - 대시보드
  - 통계
  - 보고서
  - 캠페인 관리
  - 정산

### TL 경제
- URL: /wallet
- 파일: wallet.html
- 서브메뉴:
  - TL 충전
    - 결제 충전
    - 광고 시청 (하루 20회: 오전10/오후10) → ads.html
  - 내 TL
  - 사용 내역
  - 수익·정산
  - POC
  - TLC

### 마이
- URL: /dashboard
- 파일: dashboard.html
- 서브메뉴:
  - 프로필
  - 설정
  - DJ 센터 (DJ 대리점) [등록 시] → dj-center.html

## URL 매핑

| URL | 파일 |
|-----|------|
| / | /index.html |
| /shareplace | /shareplace.html |
| /radio | /radio.html |
| /cafe-radio | /cafe-radio.html |
| /incar | /incar.html |
| /creator | /creator.html |
| /creator-studio | /creator-studio.html |
| /cafes | /cafes.html |
| /cars | /cars.html |
| /cafe-owner | /cafe-owner.html |
| /cafe-channel | /cafe-channel.html |
| /incar-channel | /incar-channel.html |
| /advertiser | /advertiser.html |
| /wallet | /wallet.html |
| /ads | /ads.html |
| /dashboard | /dashboard.html |
| /dj-center | /dj-center.html |

## 조건부 노출
- 카페 > 내 카페 관리: 카페 등록 시
- 인카 > 내 차량 관리: 차량 등록 시
- 마이 > DJ 센터: DJ 등록 시

## 향후 작업
- cafes.html, cars.html 신규 생성
- sidebar.js 전면 재작성
- _redirects 생성
- /api/me/roles 엔드포인트 (조건부 판단용)
