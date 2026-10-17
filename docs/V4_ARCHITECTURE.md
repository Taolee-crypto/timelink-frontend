🏗️ 1. TLNK v4 컨테이너 구조

V4 파일은 확장자에 관계없이 TLNK (TimeLink Node Kontainer)라는 공통 컨테이너 규격을 사용합니다.



text

\[0..3]   "TLNK" (Magic Number: 0x54 0x4C 0x4E 0x4B)

\[4]      Version (0x04)

\[5..8]   Header Length (uint32 BE)

\[9..]    Header JSON (평문 메타데이터)

\[MP3 세그먼트 × N] (AES-256-GCM 암호화)

\[LP Opus 세그먼트] (AES-256-GCM 암호화)

원칙 5 준수: 음원(TL3), 영상(TL4), 문서(TLD) 모두 동일한 컨테이너를 쓰며, 내부 세그먼트의 포맷만 다릅니다.



LP 통합: V4부터는 LP Opus 데이터를 파일 바깥에 두지 않고, TLNK 컨테이너 안에 함께 암호화하여 무결성을 보장합니다.



🔐 2. 6대 제조 원칙의 기술적 구현

원칙 1: TL이 있는 만큼만 사용 가능 (무력화)

기술 구현: 서버의 tl3\_asset\_tl 테이블과 tl3\_stream\_sessions가 연동됩니다. 클라이언트가 세그먼트를 요청할 때마다 서버는 session의 잔액을 확인합니다. 잔액이 0이 되면 402 Payment Required를 반환하고 lic\_n(라이센스 키) 발급을 거부합니다. 키가 없으면 복호화가 불가능하므로 파일은 쓰레기 바이트가 됩니다.



원칙 2: 스파인 기능 (Spine Function)

기술 구현: V4의 핵심입니다.



Time Spine (타임토큰): T\_n = SHA256(T\_{n-1} ‖ fid ‖ str(n) ‖ SHA256(ciphertext\_n))



역산 불가: SHA-256 해시 체인으로 연결되어 있어, T\_5를 알면 T\_6을 알 수 있지만 T\_4를 알 수는 없습니다.



순서 강제: 세그먼트의 순서가 바뀌면 해시가 달라져서 다음 토큰 검증에 실패합니다.



Server Spine: 매 요청마다 서버가 lic\_n을 생성할 때 이전 토큰 체인을 검증합니다.



원칙 3: LP 및 확장 기능의 완벽한 내장 (V4의 진화)

기존 V3: LP를 lp.js로 실시간 처리 (파일 저장 X)



V4 진화: Opus 코덱을 알게 되면서, LP 오디오 데이터를 TLNK v4 컨테이너 내부에 함께 암호화하여 저장합니다.



파일에는 mp3 세그먼트와 lp\_opus 세그먼트가 모두 들어있습니다.



재생 시 Player가 둘 다 복호화하여 믹싱합니다.



원칙 4: 저장 위치 = 창작자 PC (분산화)

기술 구현: 서버(Cloudflare D1)는 원본 오디오를 저장하지 않습니다. 원본은 창작자의 PC(local-agent)에 있고, 서버는 tl3\_releases에 메타데이터(해시, 세그먼트 위치, 토큰)만 저장합니다. 재생 시 서버가 창작자 PC에서 암호화된 세그먼트를 Range 요청으로 가져와 클라이언트에 전달합니다.



원칙 5: TLNK 컨테이너 (공통 규격)

기술 구현: 위에서 설명한 V4 컨테이너 구조입니다. 파서(parseTL3V3)가 버전(0x04)을 확인하고 MP3 세그먼트와 LP Opus 세그먼트의 오프셋을 계산합니다.



원칙 6: 저작권자 정보 삽입 (Creator Attribution)

기술 구현: 헤더의 rights 객체에 창작자 ID, 지갑 주소, ISRC 코드를 포함합니다. 이 정보는 AAD(Additional Authenticated Data)로 암호화에 사용되어, 헤더를 위조하면 복호화가 실패합니다.



⚙️ 3. V4 제조 프로세스 (7단계)

text

1\. Upload: 창작자가 MP3 업로드 (원본은 창작자 PC에 저장)

2\. Analyze: MP3 프레임 파싱 및 1초 단위 세그먼트 분할

3\. Encrypt: AES-256-GCM으로 세그먼트별 암호화

4\. Spine: T\_0 \~ T\_N 타임토큰 체인 생성

5\. Master: LP Opus 데이터가 있으면 별도 세그먼트로 암호화

6\. Seal: TLNK v4 컨테이너 조립 (MP3 + LP Opus)

7\. Share: SharePlace에 등록

🎵 4. 재생 프로세스 (Player)

text

1\. 클라이언트 → 서버: /api/v1/tl3/segment/:id?n=1\&session\_id=xxx

2\. 서버:

&#x20;  - TL 잔액 검증

&#x20;  - 세션 상태 검증

&#x20;  - T\_{n-1} 확인

&#x20;  - 창작자 PC에서 세그먼트 fetch

&#x20;  - 암호화된 세그먼트 전달

3\. 클라이언트:

&#x20;  - lic\_n 요청 (TL 차감)

&#x20;  - AES-256-GCM 복호화

&#x20;  - MP3는 MediaSource에 append

&#x20;  - LP Opus는 Web Audio API로 디코딩 후 믹싱

4\. TL 차감 및 정산

🛡️ 5. 보안 및 위협 모델

공격 시도	방어 메커니즘

시간 역행	T\_n → T\_{n-1} 역산 불가 (SHA-256)

세그먼트 건너뛰기	중간 토큰이 없으면 다음 키 유도 불가

파일 재조립	세그먼트 순서가 바뀌면 해시 불일치 → 복호화 실패

파일 복사	lic(마스터 시크릿)는 서버에만 있음

저작권자 위조	AAD 검증 실패

🎯 결론: V4의 본질

V4는 단순한 파일 포맷이 아닙니다. "파일을 파는 것이 아니라 사용할 권리를 판매한다"는 특허의 철학을 기술적으로 구현한 것입니다. 파일은 영원히 잠재 상태로 존재하며, TL이 있는 동안에만 서버의 도움을 받아 실체화됩니다. 그리고 Opus 코덱의 도입으로 LP 음질 개선 효과까지 파일 안에 완벽하게 통합되었습니다.



이걸 MD파일의 공지로 올려

V4 아키텍처 설명을 docs/V4\_ARCHITECTURE.md 파일로 생성하고 Git에 커밋하겠습니다.



PowerShell에 그대로 붙여넣기:



powershell

cd C:\\Users\\win11\\Desktop\\timelink-frontend



@'

\# TimeLink V4 아키텍처 기술 명세서



\## 개요

V4는 "시간 충전형 디지털 파일" 특허(10-2025-0167813)의 핵심 개념을 파일 구조와 암호학적으로 완벽하게 구현한 버전입니다. 기존 V3의 단순한 암호화를 넘어, LP Opus 데이터를 TLNK 컨테이너 안에 통합하여 완벽한 무결성을 보장합니다.



\---



\## 1. TLNK v4 컨테이너 구조



V4 파일은 확장자에 관계없이 \*\*TLNK (TimeLink Node Kontainer)\*\* 라는 공통 컨테이너 규격을 사용합니다.



```text

\[0..3]   "TLNK" (Magic Number: 0x54 0x4C 0x4E 0x4B)

\[4]      Version (0x04)

\[5..8]   Header Length (uint32 BE)

\[9..]    Header JSON (평문 메타데이터)

\[MP3 세그먼트 × N] (AES-256-GCM 암호화)

\[LP Opus 세그먼트] (AES-256-GCM 암호화)

원칙 5 준수: 음원(TL3), 영상(TL4), 문서(TLD) 모두 동일한 컨테이너를 쓰며, 내부 세그먼트의 포맷만 다릅니다.



LP 통합: V4부터는 LP Opus 데이터를 파일 바깥에 두지 않고, TLNK 컨테이너 안에 함께 암호화하여 무결성을 보장합니다.



2\. 6대 제조 원칙의 기술적 구현

원칙 1: TL이 있는 만큼만 사용 가능 (무력화)

기술 구현: 서버의 tl3\_asset\_tl 테이블과 tl3\_stream\_sessions가 연동됩니다. 클라이언트가 세그먼트를 요청할 때마다 서버는 session의 잔액을 확인합니다. 잔액이 0이 되면 402 Payment Required를 반환하고 lic\_n(라이센스 키) 발급을 거부합니다. 키가 없으면 복호화가 불가능하므로 파일은 쓰레기 바이트가 됩니다.



원칙 2: 스파인 기능 (Spine Function)

기술 구현: V4의 핵심입니다.



Time Spine (타임토큰): T\_n = SHA256(T\_{n-1} ‖ fid ‖ str(n) ‖ SHA256(ciphertext\_n))



역산 불가: SHA-256 해시 체인으로 연결되어 있어, T\_5를 알면 T\_6을 알 수 있지만 T\_4를 알 수는 없습니다.



순서 강제: 세그먼트의 순서가 바뀌면 해시가 달라져서 다음 토큰 검증에 실패합니다.



Server Spine: 매 요청마다 서버가 lic\_n을 생성할 때 이전 토큰 체인을 검증합니다.



원칙 3: LP 및 확장 기능의 완벽한 내장 (V4의 진화)

기존 V3: LP를 lp.js로 실시간 처리 (파일 저장 X)



V4 진화: Opus 코덱을 알게 되면서, LP 오디오 데이터를 TLNK v4 컨테이너 내부에 함께 암호화하여 저장합니다.



파일에는 mp3 세그먼트와 lp\_opus 세그먼트가 모두 들어있습니다.



재생 시 Player가 둘 다 복호화하여 믹싱합니다.



원칙 4: 저장 위치 = 창작자 PC (분산화)

기술 구현: 서버(Cloudflare D1)는 원본 오디오를 저장하지 않습니다. 원본은 창작자의 PC(local-agent)에 있고, 서버는 tl3\_releases에 메타데이터(해시, 세그먼트 위치, 토큰)만 저장합니다. 재생 시 서버가 창작자 PC에서 암호화된 세그먼트를 Range 요청으로 가져와 클라이언트에 전달합니다.



원칙 5: TLNK 컨테이너 (공통 규격)

기술 구현: 위에서 설명한 V4 컨테이너 구조입니다. 파서(parseTL3V3)가 버전(0x04)을 확인하고 MP3 세그먼트와 LP Opus 세그먼트의 오프셋을 계산합니다.



원칙 6: 저작권자 정보 삽입 (Creator Attribution)

기술 구현: 헤더의 rights 객체에 창작자 ID, 지갑 주소, ISRC 코드를 포함합니다. 이 정보는 AAD(Additional Authenticated Data)로 암호화에 사용되어, 헤더를 위조하면 복호화가 실패합니다.



3\. V4 제조 프로세스 (7단계)

text

1\. Upload: 창작자가 MP3 업로드 (원본은 창작자 PC에 저장)

2\. Analyze: MP3 프레임 파싱 및 1초 단위 세그먼트 분할

3\. Encrypt: AES-256-GCM으로 세그먼트별 암호화

4\. Spine: T\_0 \~ T\_N 타임토큰 체인 생성

5\. Master: LP Opus 데이터가 있으면 별도 세그먼트로 암호화

6\. Seal: TLNK v4 컨테이너 조립 (MP3 + LP Opus)

7\. Share: SharePlace에 등록

4\. 재생 프로세스 (Player)

text

1\. 클라이언트 → 서버: /api/v1/tl3/segment/:id?n=1\&session\_id=xxx

2\. 서버:

&#x20;  - TL 잔액 검증

&#x20;  - 세션 상태 검증

&#x20;  - T\_{n-1} 확인

&#x20;  - 창작자 PC에서 세그먼트 fetch

&#x20;  - 암호화된 세그먼트 전달

3\. 클라이언트:

&#x20;  - lic\_n 요청 (TL 차감)

&#x20;  - AES-256-GCM 복호화

&#x20;  - MP3는 MediaSource에 append

&#x20;  - LP Opus는 Web Audio API로 디코딩 후 믹싱

4\. TL 차감 및 정산

5\. 보안 및 위협 모델

공격 시도	방어 메커니즘

시간 역행	T\_n → T\_{n-1} 역산 불가 (SHA-256)

세그먼트 건너뛰기	중간 토큰이 없으면 다음 키 유도 불가

파일 재조립	세그먼트 순서가 바뀌면 해시 불일치 → 복호화 실패

파일 복사	lic(마스터 시크릿)는 서버에만 있음

저작권자 위조	AAD 검증 실패

결론: V4의 본질

V4는 단순한 파일 포맷이 아닙니다. "파일을 파는 것이 아니라 사용할 권리를 판매한다"는 특허의 철학을 기술적으로 구현한 것입니다. 파일은 영원히 잠재 상태로 존재하며, TL이 있는 동안에만 서버의 도움을 받아 실체화됩니다. 그리고 Opus 코덱의 도입으로 LP 음질 개선 효과까지 파일 안에 완벽하게 통합되었습니다.

'@ | Out-File -Encoding utf8 docs\\V4\_ARCHITECTURE.md



Write-Host "OK: V4\_ARCHITECTURE.md 파일 생성 완료"



text



\---



\## 검증 및 커밋



```powershell

cd C:\\Users\\win11\\Desktop\\timelink-frontend



\# 1. 파일 확인

Get-Item docs\\V4\_ARCHITECTURE.md | Select-Object Name, Length, LastWriteTime



\# 2. 커밋

git add docs/V4\_ARCHITECTURE.md

git commit -m "docs: V4 아키텍처 기술 명세서 추가 (공지용)"

git push origin main

