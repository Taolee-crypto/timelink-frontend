\# TimeLink Frontend



> \*\*"파일을 파는 것이 아니라, 사용할 권리를 판매합니다."\*\*

> — TimeLink, 특허 출원 10-2025-0167813



\---



\## TL 파일 제조 원칙



TimeLink의 핵심 철학과 아키텍처 원칙은 백엔드 저장소에 정리되어 있습니다.



\*\*→ \[timelink-backend/TL\_PRINCIPLES.md](../timelink-backend/TL\_PRINCIPLES.md) 참조\*\*



\### 핵심 요약



| # | 원칙 | 핵심 |

|---|------|------|

| 1 | \*\*TL이 있는 만큼만 사용\*\* | 파일은 잠재 상태. TL 소진 = 무력화 |

| 2 | \*\*스파인 기능\*\* | 순방향만 매끄러움. 역방향/우회는 손상 |

| 3 | \*\*LP/확장 별도 모듈\*\* | TL 파일은 순수 원본. 확장은 별도 JS |

| 4 | \*\*창작자 PC 저장\*\* | 서버는 중계자. 창작자가 원본 소유 |

| 5 | \*\*TLNK 컨테이너\*\* | 음원/영상/문서 공통 포맷 |

| 6 | \*\*저작권자 정보 삽입\*\* | 암호학적 귀속 |



\---



\## 🗂️ 저장소 구조



```

timelink-frontend/

├── public/

│   ├── index.html             랜딩

│   ├── shareplace.html        음악 공유

│   ├── creator.html           창작자 업로드

│   ├── track.html             재생

│   ├── dashboard.html         대시보드

│   ├── dj-center.html         DJ 센터

│   ├── player-host.html       플레이어 호스트

│   ├── cafe-radio.html        카페 라디오

│   ├── admin.html             관리자

│   │

│   ├── tl3.js                 TL3 클라이언트

│   ├── tl3-config.js          API base 결정

│   ├── tl3-sw.js              Service Worker (선택)

│   ├── lp.js                  (예정) LP 음질 모듈

│   │

│   ├── sidebar.js             사이드바

│   ├── notice-popup.js        공지 팝업

│   ├── i18n.js                다국어

│   └── apple-theme.css        테마

│

├── local-agent/

│   └── server.js              로컬 에이전트 (PM2: timelink-agent)

│

└── README.md

```



\---



\## 🚀 로컬 에이전트



창작자 PC에서 TL 파일 원본을 저장/제공합니다.



\### 실행

```powershell

cd local-agent

npm start

```



\### PM2로 관리

```powershell

pm2 start local-agent/server.js --name timelink-agent

pm2 save

```



\### 상태 확인

```powershell

pm2 list

curl.exe -s "http://127.0.0.1:8787/health"

```



\### 터널

Cloudflare Tunnel로 `agent.timelink.digital`에 노출.



\---



\## 🔗 인프라



| 항목 | 값 |

|------|-----|

| \*\*프론트 (Cloudflare Pages)\*\* | `timelink-frontend.pages.dev` |

| \*\*도메인\*\* | `www.timelink.digital` |

| \*\*API\*\* | `api.timelink.digital` |

| \*\*로컬 에이전트 터널\*\* | `agent.timelink.digital` |

| \*\*백엔드 저장소\*\* | `Taolee-crypto/timelink-backend` |



\---



\## 🧪 검증



\### 프론트 접속

```powershell

curl.exe -s -o NUL -w "HTTP %{http\_code}`n" "https://www.timelink.digital/"

```



\### API 연동

```powershell

curl.exe -s -o NUL -w "HTTP %{http\_code}`n" "https://api.timelink.digital/api/shares"

```



\---



\## 📄 특허



\*\*출원번호 10-2025-0167813\*\*



\---



\*Last updated: 2026-10-08\*

