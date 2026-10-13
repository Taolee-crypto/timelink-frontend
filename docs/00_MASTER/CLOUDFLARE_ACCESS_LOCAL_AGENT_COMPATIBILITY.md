# Cloudflare Access와 Local Agent / 스트리밍 호환성 검토

- 기준일: 2026-10-14
- 작업 브랜치: `docs/master-architecture-audit-20261014`
- 목적: 사용자가 `agent.timelink.digital`에 Cloudflare Access를 이미 적용했다는 정보를 반영해, 기존 Local Agent 및 SharePlace 스트리밍 경로와의 경계를 구분한다.
- 확인 방식: GitHub 소스 정적 분석. Cloudflare Zero Trust 정책, tunnel ingress, Worker secrets, PC 프로세스는 직접 조회하지 않았다.

## 0. 제품 정책 — 사용자 확정 원칙

TimeLink에서 공유·유통되는 것은 보호된 TL 자산(TL3/TL4/TLD/TLJ)뿐이다. 일반 MP3/MP4/PDF/이미지 파일은 Creator에서 TL 자산을 만들기 위한 비공개 입력 재료이며 공개 스트리밍 대상이 아니다. 무료 콘텐츠와 무료 재생은 없다. TL 자산은 TL 시간 기반 이용 권한·사용량 정산을 거치고 창작자 보상은 승인된 TL 보상토큰 정산 규칙에 따른다.

따라서 Agent 원본 MP3 URL을 Worker API로 프록시하는 것은 최종 배포 가능한 설계가 아니다. Local Agent와 외부 저장소는 비공개 원본 재료의 수집 및 보호된 TL 컨테이너 저장을 지원해야 한다. 공개 플레이어는 TL 컨테이너와 해당 자산군 전용 권한·뷰어 경로만 사용해야 한다. 기존 원본 파일 URL 및 MP3 공유 레코드는 감사·이관 대상이며 공개 경로로 유지하지 않는다.

## 1. 결론

Cloudflare Access 설정은 공개 도메인 `agent.timelink.digital`을 보호하는 중요한 방어선이다. 다만 Creator의 현재 업로드 경로는 공개 도메인이 아니라 PC 내부 주소 `http://127.0.0.1:8787`를 직접 호출한다. 이 로컬 요청은 Cloudflare Tunnel과 Access를 통과하지 않는다.

반대로 업로드 응답에 기록되는 공개 `stream_url`은 `https://agent.timelink.digital/local/:token` 형식이며, 백엔드 `GET /api/stream/:shareId`는 이 URL을 Worker에서 서버-서버 fetch 한다. 이 요청에는 현재 Cloudflare Access Service Token 헤더가 추가되지 않는다.

따라서 Access가 해당 호스트의 모든 경로를 로그인/인증 대상으로 보호하고 있다면, 백엔드의 서버-서버 fetch도 Access 차단/로그인 응답을 받을 수 있다. 이 경우 Worker가 로그인 HTML을 음원 스트림으로 전달하거나 외부 스트림 오류가 발생할 수 있다. 실제 영향은 현재 Access application의 경로별 정책과 예외 규칙을 확인해야 확정할 수 있다.

## 2. 실제 호출 흐름

### 업로드: 브라우저 → PC 로컬 Agent

Creator `public/creator.html`은 아래를 직접 호출한다.

- `GET http://127.0.0.1:8787/health`
- `POST http://127.0.0.1:8787/upload?kind=mp3&name=...`

Local Agent는 업로드 후 `public_url`과 `stream_url`을 다음 형식으로 반환한다.

- `https://agent.timelink.digital/local/<random-token>`

이 업로드 단계에서 Cloudflare Access는 인증 경로에 포함되지 않는다. 로컬 Agent 자체 인증/Origin 검사와 사용자 PC에서만 접근 가능한 네트워크 경계가 별도로 필요하다.

### 재생: 브라우저 → TimeLink Worker → Local Agent 터널

백엔드 `src/index.ts`의 `GET /api/stream/:shareId`는 DB의 Share `stream_url`을 조회하고, 외부 HTTP(S) URL이면 `fetch(_su0)`로 가져온다. 현재 소스에서 해당 fetch는 Range 헤더만 전달하며 Cloudflare Access Service Token 헤더는 전달하지 않는다.

따라서 `agent.timelink.digital`에 Access가 적용된 경우, Worker → Agent 터널의 서버-서버 호출이 Access 정책을 통과하는 방식이 필요하다.

### 현재 플레이어의 공개 URL 처리

추가로 프런트엔드 재생 진입점을 확인한 결과, 공개 Agent URL을 공통 API 프록시로 통일하지 않고 있다.

- `public/shareplace.html`의 `getStreamUrl()`은 `127.0.0.1` 또는 `localhost` 주소만 API `/api/stream/:shareId`로 바꾼다. `https://agent.timelink.digital/local/:token`은 그대로 브라우저에 반환한다.
- `public/track.html`은 `_share.stream_url` 또는 `file_url`을 직접 사용한다.
- `public/incar.html`은 TL 잔액이 있는 경우에만 API `/api/stream/:shareId?tk=...`를 사용하고, 그 외에는 `proxyUrl()`이 Agent 도메인 URL을 그대로 반환한다.

따라서 Access가 Agent 호스트 전체를 보호한다면 일반 이용자의 SharePlace, Track, InCar 무료/직접 스트리밍 경로가 Access 로그인 화면 또는 차단 응답에 걸릴 수 있다. 앞서 설명한 Worker 서버-서버 fetch 경로만 점검해서는 충분하지 않다.

**필수 설계 변경:** Agent 도메인의 파일 URL을 사용하는 모든 브라우저 플레이어를 TimeLink API의 Share 스트림 프록시로 통일한다. API Worker만 Access Service Token으로 Agent 원본을 가져오게 한다. 기존 TL 과금·세그먼트 라이선스·InCar tick 로직은 이 URL 라우팅 변경과 분리해 보존한다. TL3는 반드시 기존 TL3 라이선스/confirm 경로를 유지하며 일반 `/api/stream`으로 우회시키지 않는다.

### 추가로 확인한 재생 화면

- `public/track.html`: MP3 무료 재생 시 `_share.stream_url`을 그대로 `Audio.src`에 지정한다. TL3는 별도 TL3 resolver를 사용한다.
- `public/radio.html`: `playTrack()`이 R2 주소 변환만 수행하며 Agent 도메인은 그대로 재생 URL로 사용한다.
- `public/incar.html`: 파일별 TL 잔액이 있을 때는 API 스트림을 사용하지만, 직접 재생 분기에서는 Agent URL이 그대로 남는다.
- `public/cafe-radio.html`: TL3는 TL3 resolver를 사용하지만 MP3 방송은 `track.stream_url`을 직접 사용한다.
- `public/dj-center.html`: TL3는 TL3 resolver를 사용하지만 비-TL3 방송은 `track.stream_url`을 직접 사용한다.
- `public/player-host.html`과 `public/dj-console.js`는 TL3 전용 resolver 경로가 중심이므로, TL3 라이선스 API와 구분해 유지한다.

따라서 URL 라우팅 수정 범위는 SharePlace 한 화면이 아니라 **일반 MP3를 직접 재생하는 모든 활성 플레이어**다. 각 화면에서 Agent 도메인 URL만 API `/api/stream/:shareId`로 바꾸고, R2 및 외부 URL은 기존 동작을 유지해야 한다. TL3 파일은 세그먼트 라이선스/confirm 경로를 우회하지 않도록 별도 유지한다.

## 3. Access 설정에 따라 달라지는 결과

| Access 정책 | 예상 결과 | 평가 |
|---|---|---|
| 전체 호스트에 사용자 로그인 요구 | Worker의 서버-서버 fetch가 로그인 HTML/302 또는 403을 받을 수 있음 | 스트리밍 호환성 위험 |
| `/local/*`만 Bypass, 나머지 경로는 인증 | Worker fetch는 동작할 수 있으나 개별 파일 난수 토큰이 직접 접근 권한이 됨 | 간단하지만 토큰 유출 관리 필요 |
| 전체 호스트 보호 + Service Auth 정책 허용 | Worker가 Access Service Token 헤더를 보내면 보호된 경로 접근 가능 | 권장 |
| 사용자 로그인 정책과 Service Auth 정책 병행 | 사람의 브라우저와 Worker 서버-서버 요청을 각각 허용 가능 | 가장 유연한 방식 |

실제 Cloudflare Access application이 경로별로 분리되어 있는지, `/local/*`에 별도 Bypass가 있는지, Service Auth 정책이 존재하는지는 아직 확인하지 않았다.

## 4. 권장 구조

### 4.1 Access는 유지한다

사용자가 이미 설정한 Access를 끄거나 제거하지 않는다. Local Agent의 공개 도메인 보호는 유지한다.

### 4.2 Worker에 Service Token을 연결한다

Cloudflare Access에서 전용 Service Token을 만들고, 해당 토큰만 허용하는 Service Auth 정책을 구성한다.

Backend Worker에 다음 secret을 등록한다.

- `CF_ACCESS_CLIENT_ID`
- `CF_ACCESS_CLIENT_SECRET`

그 후 Worker의 외부 스트림 fetch에서 두 헤더를 추가한다.

- `CF-Access-Client-Id`
- `CF-Access-Client-Secret`

토큰 값은 소스 코드, GitHub, 프런트엔드 JavaScript, D1에 저장하지 않는다. Worker secret으로만 관리한다. Service Token은 사용자 로그인과 별개로 폐기/회전할 수 있게 운영한다.

### 4.3 Agent 경로별 최소 권한

- `/local/:token`: Worker 스트리밍 경로만 필요한 범위에서 허용한다.
- `/upload`: 공개 터널에서 불필요하다면 Access 인증을 유지하고, Creator의 로컬 업로드는 loopback만 사용한다.
- `/files`: UI 호출자가 현재 저장소에서 확인되지 않았다. 외부 접근을 허용할 이유가 없다면 차단한다.
- `/stream?name=`: 레거시 폴더 파일 직접 노출 경로다. 실제 호출자를 확인한 뒤 폐쇄 또는 별도 인증한다.
- `/analysis/:token`: 현재 공개 API 사용자가 확인되지 않았다. 분석 결과를 실제로 사용하는 UI와 호출 경로를 확인한 후 제한한다.
- `/health`: 상태 확인에 필요한 최소 정보만 반환하고 파일 수/내부 경로 등은 공개 응답에서 제외하는 방향을 권장한다.

### 4.4 Local Agent 자체 방어

Cloudflare Access는 공개 터널 앞단의 방어이며, `127.0.0.1:8787`로 직접 들어오는 브라우저 요청의 인증을 대신하지 않는다.

향후 Local Agent와 Creator 사이에 페어링 기반 단기 토큰을 도입한다. 단, 기존 Creator는 현재 Authorization 없이 `/upload`를 호출하므로, 새 인증을 먼저 Agent에 적용하면 현재 업로드가 깨진다. Agent와 Creator를 같은 배포 묶음으로 변경하고, 구버전 호환/복구 경로를 마련한 뒤 적용해야 한다.

CORS Origin allowlist는 보조 방어로 사용한다. Origin 검사는 인증을 대체하지 않으며, 비브라우저 클라이언트의 요청을 막는 보안 경계로 간주해서는 안 된다.

## 5. 기존 코드에서 확인한 구체적 사실

### Local Agent

- 서버는 `127.0.0.1:8787`에 바인딩한다.
- `/health`, `/upload`, `/local/:token`, `/stream?name=`, `/files`, `/analysis/:token`을 처리한다.
- 전역 CORS는 `Access-Control-Allow-Origin: *` 및 `Access-Control-Allow-Private-Network: true`를 설정한다.
- `/files`는 메모리에 로드된 파일의 token/name/size/public_url을 반환한다.
- `/stream?name=`은 사용자 TimeLink 폴더의 파일을 basename으로 읽는다.
- `/upload`는 최대 500 MiB 파일을 수신하며 별도 사용자 인증 검사는 확인되지 않았다.
- `publicBaseUrl`은 기본값이 고정 도메인으로 미리 설정되므로, 현재 `public_available`은 터널 외부 연결 검증 성공을 뜻하지 않는다.

### Frontend

- Creator 업로드는 `127.0.0.1:8787`을 직접 호출한다.
- SharePlace는 레거시 localhost 주소를 발견하면 `api.timelink.digital/api/stream/:shareId`로 전환한다.
- `/files`를 호출하는 운영 UI 경로는 현재 저장소 검색에서 확인되지 않았다.
- `/analysis/:token`을 호출하는 운영 UI 경로도 현재 저장소 검색에서 확인되지 않았다.

### Backend

- `/api/stream/:shareId`는 외부 HTTP(S) stream URL을 Worker에서 가져온다.
- 해당 외부 fetch에 Access Service Token 헤더는 현재 확인되지 않았다.
- Backend `Env` 타입에도 Access Service Token secret 필드는 아직 정의되어 있지 않다.

## 6. PC가 켜졌을 때 확인할 최소 항목

PC가 켜져야 하는 단계에서 아래 항목만 한 번에 확인하면 된다. 지금은 수행할 필요가 없다.

1. Cloudflare Zero Trust → Access → Applications에서 `agent.timelink.digital` 앱의 hostname/path 확인.
2. Policies에서 전체 로그인 정책, Bypass 경로, Service Auth 정책 확인.
3. Cloudflare Tunnel `timelink-agent`의 ingress가 `agent.timelink.digital`을 `http://127.0.0.1:8787`로 전달하는지 확인.
4. Worker가 Access Service Token을 사용하도록 secret을 등록할 수 있는지 확인.
5. 외부에서 `/local/<token>` 스트림을 요청했을 때 206 Range 응답이 오는지 확인. 실제 파일 URL은 비공개로 유지하고, 테스트용 파일만 사용한다.

## 7. 다음 구현 순서

1. Cloudflare Access 정책 경로를 확인한다. 사용자가 PC에 접근할 수 있을 때만 수행한다.
2. 테스트용 Worker secret과 테스트 파일로 서버-서버 Access 통과를 확인한다.
3. Backend Worker에 Access Service Token 헤더 전달을 추가한다. 기존 공개 URL의 응답 형식과 Range 프록시 동작은 유지한다.
4. Local Agent의 `/files`, `/stream?name=`, `/analysis` 실제 호출자를 다시 확인하고 외부 노출 범위를 축소한다.
5. Agent/Creator 페어링 인증을 한 묶음으로 구현한다.
6. 업로드 → Share 등록 → TL3 sync/release → SharePlace playback을 MP3와 TL3 각각 격리 테스트한다.

## 8. 설계 브랜치에 반영한 코드 변경

다음 변경은 설계 브랜치에 저장하고 GitHub에서 다시 조회해 확인했다. 운영 브랜치에는 반영하지 않았다.

### Backend

- `src/types.ts`에 선택적 Worker secret `CF_ACCESS_CLIENT_ID`, `CF_ACCESS_CLIENT_SECRET` 타입을 추가했다.
- `src/index.ts`의 외부 스트림 프록시는 원본 호스트가 정확히 `agent.timelink.digital`일 때만 두 Access Service Token 헤더를 추가한다.
- Range 헤더 전달과 원본 Content-Type/Content-Range/Content-Length 전달을 유지한다.
- Access 로그인 HTML, 302, 401, 403을 정상 음원으로 전달하지 않고 502 인증 오류로 처리한다.
- Service Token 값이 프런트엔드로 노출되지 않도록 Worker에서만 읽는다.

### Frontend

아래 레거시 소스 파일 플레이어의 Agent URL을 API `/api/stream/:shareId`로 전환한 코드는 기존 동작을 분석하기 위한 임시 조사 변경이다. 원본 MP3를 공개 프록시하는 것은 TL-only 정책에 맞지 않으며 최종 배포 대상이 아니다. 이를 비공개 Creator 재료 경로 및 보호된 TL 컨테이너 재생 경로로 대체해야 한다.

- `public/shareplace.html`
- `public/track.html`
- `public/radio.html`
- `public/incar.html`
- `public/cafe-radio.html`
- `public/dj-center.html`

TL3는 기존 `/api/v1/tl3/header`, `segment`, `code`, `segment/confirm` 라이선스 경로를 그대로 유지하며 일반 파일 프록시로 우회시키지 않았다. InCar의 기존 TL 보호 스트림 및 tick 과금 경로도 유지했다.

### 수정 파일의 최신 소스 식별값

| 저장소 | 파일 | 최신 Blob SHA |
|---|---|---|
| backend | `src/index.ts` | `40a97489f65fe7469de2f5bfc3846c698a18f95e` |
| backend | `src/types.ts` | `735e406f55899b69de2ecdacdf7c602aa8128109` |
| frontend | `public/shareplace.html` | `84e6e78c4e5bae4677f213b718e012306dde111d` |
| frontend | `public/track.html` | `6371af81567d00fbf6cb56059529f91b3db0af62` |
| frontend | `public/radio.html` | `fbe83160b1ae6f7bdbf74396be9d491653e438c3` |
| frontend | `public/incar.html` | `06518f2ba5ad78b046a987249695a3203147bf8d` |
| frontend | `public/cafe-radio.html` | `ea299ab72171369f731a7d968982a380991c5443` |
| frontend | `public/dj-center.html` | `40a96fc1c10b86c66276a2e5c42201f370b94589` |

### 현재 검증 수준

- GitHub 설계 브랜치에서 변경 파일을 재조회하고 핵심 문자열이 반영된 것을 확인했다.
- Cloudflare Access Service Token은 아직 발급/Worker secret 등록하지 않았다.
- 실제 Agent 터널, Access 정책, Worker 배포, 브라우저 Range 재생 테스트는 하지 않았다.
- 따라서 이 변경은 **코드 준비 완료, 운영 적용 전** 상태다. Access가 `/local/*`를 Bypass하지 않고 전체 로그인을 요구한다면 Worker secret 등록 전까지 프록시 재생은 실패할 수 있다.

### 필수 재생 회귀 테스트

| 시나리오 | 기대 결과 |
|---|---|
| SharePlace 무료 MP3 (Agent 저장) | 브라우저는 `api.timelink.digital/api/stream/:id`만 호출하고 원본 파일 비공개 유지 및 보호된 TL 자산으로만 재생 |
| Track 무료 MP3 (Agent 저장) | API 프록시로 재생, 기존 UI/진행률 유지 |
| Radio MP3 (Agent 저장) | API 프록시로 재생, 기존 TL 차감 UI/타이머 유지 |
| InCar MP3 (Agent 저장) | API 프록시로 재생, 기존 파일별 TL 및 tick 분기 유지 |
| Cafe Radio MP3 방송 | API 프록시로 재생, 방송 elapsed_ms 동기화 유지 |
| DJ Center MP3 방송 | API 프록시로 재생, 곡 전환/자동 진행 유지 |
| TL3 SharePlace/DJ/Cafe Radio | TL3 header/segment/code/confirm만 사용, 일반 stream 프록시로 우회하지 않음 |
| API 프록시 Range 요청 | 원본이 206을 반환하면 클라이언트에도 206과 Content-Range 전달 |
| Access Service Token 누락/오류 | 로그인 HTML이 오디오 데이터로 전달되지 않고 명확한 502 반환 |
| 비-Agent 외부 URL | 기존 외부 URL 처리 유지, Access Service Token 헤더 미전송 |

### 다음 PC 필요 단계

1. Cloudflare Zero Trust에서 `agent.timelink.digital` Access application의 hostname/path와 policy 순서를 확인한다.
2. Service Auth policy가 Agent 경로에 허용되는지 확인한다.
3. Service Token을 발급한다.
4. Backend Worker에 `CF_ACCESS_CLIENT_ID`, `CF_ACCESS_CLIENT_SECRET`을 secret으로 등록한다.
5. 테스트 Share 하나로 API 프록시의 HTTP 200/206, Range, content-type, 재생을 확인한다.
6. 그 후에만 운영 배포를 검토한다.

## 9. 변경하지 않은 것

이 문서는 조사 및 설계 기록이다. Local Agent 코드, Cloudflare Access 정책, Tunnel 설정, Worker secret, 실제 사용자 파일, TL 잔액은 변경하지 않았다. 운영 기능을 유지하면서 Access와 기존 서버-서버 스트리밍의 호환성을 검증하기 위한 기준 문서로 사용한다.
