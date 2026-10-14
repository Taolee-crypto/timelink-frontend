# TimeLink Local Agent 및 외부 저장소 연결 감사

- 기준일: 2026-10-14
- 브랜치: `docs/master-architecture-audit-20261014`
- 범위: Local Agent, Cloudflare Tunnel, Google Drive/OneDrive 저장소 연결, Share 스트리밍 프록시
- 검증: 저장소 소스 조회만 수행. 사용자 PC의 cloudflared 설정/실행 상태, OAuth 제공자 실계정, 실제 업로드/재생은 검증하지 않았다.

## 1. 현재 활성 Creator 경로

현재 `public/creator.html`은 실제 업로드에서 다음 경로를 사용한다.

1. 브라우저에서 `http://127.0.0.1:8787/health` 확인
2. MP3 Blob을 Local Agent `POST /upload?kind=mp3&name=...`에 직접 전송
3. 응답의 `stream_url`을 SharePlace 등록 데이터에 포함
4. `POST /api/shares`로 Share 등록
5. TL3 릴리스인 경우 인증된 `POST /api/files/sync` 후 `POST /api/v1/tl3/releases`
6. Share 재생은 API의 `/api/stream/:shareId`가 저장된 원본 URL 또는 외부 저장 객체를 프록시할 수 있다.

활성 Creator 소스에서 `/api/storage/` 호출은 확인되지 않았다. Google Drive/OneDrive 백엔드 구현은 존재하지만 현재 Creator의 업로드 경로에 연결되어 있지 않다. 따라서 현재 실제 경로는 Local Agent 중심이며, 외부 저장소 선택 UI와 업로드 연결은 별도 통합 과제다.

## 2. Local Agent 구현

파일: `local-agent/server.js`, `local-agent/package.json`, `local-agent/README.md`

- Node.js 20+ 로컬 서버, 기본 주소 `127.0.0.1:8787`.
- 파일 저장 경로: `%APPDATA%/TimeLink/shared` (환경변수에 따라 HOME 또는 cwd fallback).
- 업로드 최대 크기 500 MiB.
- 업로드된 파일은 임의 18바이트 난수 토큰(16진수 36자)을 파일명에 붙여 디스크에 저장한다.
- 시작 시 디스크에서 파일을 다시 읽어 메모리 Map을 복원하므로 프로세스 재시작 후에도 토큰 URL 재생을 의도한다.
- `/local/:token`은 Range 요청을 지원한다.
- MP3 업로드 시 백그라운드 음원 분석을 시작한다.
- Cloudflare named tunnel `timelink-agent`를 시작하며 기본 공개 호스트는 `agent.timelink.digital`.

README에는 MVP 공개 URL이 에이전트/터널 재시작 시 변경된다고 쓰여 있지만, 현재 코드 기본값은 고정 도메인 `https://agent.timelink.digital`이다. 문서와 구현을 일치시켜야 한다.

## 3. Local Agent의 보안상 중대 위험

현재 서버 코드는 `Access-Control-Allow-Origin: *`와 `Access-Control-Allow-Private-Network: true`를 설정하고, 다음 경로에 별도 인증 검사를 두지 않는다.

| 경로 | 현재 동작 | 위험 |
|---|---|---|
| `GET /health` | 온라인 상태, 공개 URL, 파일 수 반환 | 상태/운영 정보 노출 |
| `POST /upload` | 최대 500 MiB 파일 저장, MP3 분석 시작 | 무단 업로드, 디스크/CPU 소모 |
| `GET /files` | 현재 공유 파일의 모든 토큰 목록 반환 | 비밀 URL 열거 및 파일 접근 |
| `GET /stream?name=...` | 사용자 TimeLink 폴더에서 basename 파일 제공 | 명시적 공유 절차 밖의 파일 노출 가능 |
| `GET /analysis/:token` | 토큰 기반 분석 결과/메타데이터 반환 | 토큰 노출 시 분석 정보 노출 |
| `GET /local/:token` | 난수 토큰으로 공유 파일 제공 | 토큰이 bearer capability로 작동 |

서버는 loopback에 바인딩하지만, 같은 서버를 Cloudflare Tunnel이 공개 호스트로 노출한다. 따라서 loopback 바인딩만으로 public tunnel 경로의 접근 제어가 해결되지는 않는다. `/files`, `/stream`, `/upload`, `/analysis`의 외부 노출 여부를 Cloudflare Tunnel 경로와 함께 확인해야 한다.

특히 `/files`가 공개 터널을 통해 접근 가능하면 랜덤 토큰의 추측 난이도와 무관하게 토큰 목록을 얻을 수 있다. `/stream?name`은 토큰 파일 공유와 별개로 사용자 폴더의 파일을 basename으로 조회한다. 이 두 경로는 우선순위 높은 보안 검증 대상이다.

현재 CORS 별표와 PNA 허용은 브라우저 기반 cross-origin 요청의 위험을 높인다. CORS는 인증을 대체하지 않으며, CORS 허용만으로 API가 안전해지는 것은 아니다.

**아직 Local Agent 코드는 수정하지 않았다.** 활성 Creator가 인증 없는 Local Agent 업로드에 의존하므로, 서버만 임의로 인증을 추가하면 업로드가 중단된다. 또한 `/stream`, `/files`, `/analysis`의 구형 사용 여부와 Cloudflare tunnel의 Host/Access 설정을 확인하지 않고 삭제하거나 차단하면 기존 기능이 깨질 수 있다.

## 4. 터널 상태와 URL 생성 위험

- `publicBaseUrl`은 환경변수 값이 없으면 서버 시작 시부터 `https://agent.timelink.digital`로 설정된다.
- 업로드 성공 후 `startTunnel()`을 호출하지만, `publicBaseUrl` 값이 이미 truthy이므로 코드의 URL 대기 루프는 실제 터널 연결 확인을 보장하지 않는다.
- cloudflared 프로세스가 실패해도 업로드 응답에 고정 공개 URL이 포함될 수 있다.
- `/health`의 `online:true`는 Node 서버가 응답한다는 뜻이지, Cloudflare Tunnel이 외부에서 정상 접속된다는 뜻이 아니다.

따라서 UI는 Local Agent 프로세스 상태와 외부 터널 접근 가능 상태를 별도 상태로 표현해야 한다. 실제 터널 검증을 하지 않은 공개 URL을 성공 URL로 확정해서는 안 된다.

## 5. Google Drive / OneDrive backend

파일: backend `src/storage.ts`, `src/index.ts`

- Google Drive OAuth scope: `drive.file`; OneDrive scope: `Files.ReadWrite.AppFolder offline_access openid profile`.
- OAuth state는 무작위 값으로 생성되고 사용자 ID/provider에 묶여 10분 후 만료된다.
- Access/refresh token은 `STORAGE_ENCRYPTION_KEY` 기반 AES-GCM으로 암호화되어 D1에 저장된다.
- 저장소 연결은 사용자/provider별 하나이며, 토큰 만료 임박 시 refresh token으로 갱신한다.
- `POST /api/storage/upload-session`은 제공자 업로드 세션 URL을 발급한다.
- 브라우저/클라이언트가 업로드를 마친 뒤 `POST /api/storage/finalize`가 제공자 저장소에서 파일을 조회한다.
- `POST /api/storage/object/register`는 로그인 사용자 소유 연결인지 확인한 뒤 D1에 객체 메타데이터를 등록한다.
- Share ID를 전달하면 해당 사용자가 소유한 `tl_shares` 행에 storage object ID/provider 및 API stream URL을 연결한다.
- `GET /api/storage/object/:id/stream`은 Share에 연결된 객체는 공개 스트리밍을 허용하고, 연결되지 않은 객체는 소유자 인증을 요구한다.

### 추가 검증 대상

1. Google Drive finalize는 폴더 내 같은 이름의 최신 파일을 조회한다. 동시 업로드/동일 파일명에서 다른 파일을 잘못 연결할 수 있는지 확인해야 한다.
2. OneDrive finalize는 App Folder의 경로/파일명 기반 조회다. 충돌 이름 변경 정책과 finalize 조회가 일치하는지 테스트해야 한다.
3. 업로드 세션 URL은 민감한 bearer-like URL이므로 클라이언트 로그/분석/오류 수집에 노출하지 않는다.
4. 저장소 연결 해제 후 기존 객체 스트림을 어떻게 처리할지 정책 확인이 필요하다.
5. 연결된 Share 객체의 공개 스트리밍이 의도된 접근 정책인지, 유료 TL3의 라이선스 계층을 우회하지 않는지 확인해야 한다.

## 6. 권장 수정 순서

1. Cloudflare Access 또는 동등한 접근 제어가 `agent.timelink.digital`에 적용되어 있는지 확인.
2. `/files`, `/stream?name`, `/analysis`, `/upload`의 외부 공개 필요성을 각각 판정.
3. Local Agent와 Creator 사이에 페어링/인증 토큰을 도입하고, Origin allowlist를 보조 방어로 적용.
4. 공유 파일은 `/local/:token`의 개별 권한 토큰만으로 접근하게 하고 토큰 목록 API는 외부에서 차단.
5. 터널 프로세스/외부 URL health check를 실제로 수행한 뒤에만 `public_available=true` 반환.
6. Google Drive/OneDrive를 Creator의 저장소 선택 UI와 업로드/finalize/register/stream 흐름에 통합.
7. MP3/TL3 및 향후 TL4/TLD/TLJ의 공통 저장 인터페이스로 정리하되, 기존 Local Agent 저장 데이터를 마이그레이션 없이 삭제하지 않는다.

## 7. Cloudflare Access 관련 후속 확인

사용자는 `agent.timelink.digital`에 Cloudflare Access를 이미 설정했다고 확인했다. 따라서 앞서 적은 “Access 적용 여부 확인”은 완료된 것으로 보고, 남은 확인 대상은 Access의 정확한 hostname/path 범위와 policy 구성이다.

중요한 네트워크 경계는 다음과 같다.

- Creator의 `127.0.0.1:8787` 호출은 Cloudflare Access를 거치지 않는다.
- 브라우저가 `agent.timelink.digital/local/:token`에 직접 접속하는 경로는 Access 정책의 영향을 받는다.
- 현재 SharePlace, Track, Radio, InCar, Cafe Radio, DJ Center의 일반 MP3 경로 중 일부가 Agent URL을 직접 재생하고 있었다.
- 이를 TimeLink API 스트림 프록시로 통일하고, Worker만 Access Service Token을 사용하도록 하는 변경을 설계 브랜치에 반영했다.

세부 정책과 코드 변경 내역은 [Cloudflare Access / Local Agent 호환성 문서](CLOUDFLARE_ACCESS_LOCAL_AGENT_COMPATIBILITY.md)를 기준으로 한다.

## 8. 작업 경계

이 감사에서 Local Agent, OAuth, 외부 저장소 코드의 수정은 수행하지 않았다. 위 위험은 코드상 확인된 접근 구조이며, 공개 터널에서 실제로 외부 접근 가능한지 여부는 Cloudflare Tunnel 설정과 실측 테스트가 필요하다. 보안 검증 전까지 운영 tunnel 설정이나 사용자 PC의 파일/프로세스를 변경하지 않는다.
