\# TimeLink — TL3 v4 재생 파이프라인 정상화 (2026-10-16)



\## TL;DR

v4(Creator Studio)로 등록한 TL3 자산이 SharePlace에 노출되지 않고 track.html에서 재생되지 않던 문제를 해결.



\- SharePlace 목록: 2개 → 30개 복구

\- track.html 지갑 표시: 잘못된 2,675,543 → 실제 657,031.99 TL

\- track.html 재생 버튼: disabled → 활성화 및 재생 성공



\---



\## 1. 발생한 문제



| # | 증상 |

|---|---|

| 1 | v4 등록 TL3 자산이 SharePlace에 안 뜸 |

| 2 | track.html 지갑 잔액 잘못 표시 (2,675,543 vs 실제 657,031.99) |

| 3 | "TL 부족"으로 결제 모달 강제 표시 |

| 4 | SyntaxError: Unexpected identifier 'error' (JS 전체 중단) |

| 5 | "음원 재생 시간을 확인할 수 없습니다" alert |

| 6 | /api/social/stats/:id 404 → track.html 렌더 실패 |



\---



\## 2. 근본 원인



\### 2-1. SharePlace가 v4 자산 필터링

src/routes/shareplace.ts:

&#x20; WHERE LOWER(f.file\_type)='audio/tl3'

&#x20;   AND f.shared=1 AND COALESCE(f.revenue\_held,0)=0

&#x20;   AND EXISTS (SELECT 1 FROM tl3\_releases r

&#x20;               WHERE r.file\_id=f.id AND r.status='released'

&#x20;                 AND r.rights\_confirmed=1)

\- v4 등록 시 tl\_files.file\_type='audio' (기본값)

\- rights\_confirmed가 v4 등록 시 미설정 → 0



\### 2-2. 지갑 잔액 계산 오류

src/economics.ts:

&#x20; tl\_total: tlP + tlA + tlB   // 누적치

\- tl\_p, tl\_a, tl\_b는 누적

\- 실제 잔액은 users.tl\_balance



\### 2-3. </script> 누락

\- track.html 라인 1810: <script src="/notice-popup.js"> ← 닫는 태그 없음

\- 이후 인라인 JS 파싱 실패 → SyntaxError → 전체 JS 중단



\### 2-4. \_assetTL 조건

\- v4 자산은 s.file\_tl = 0 (사용자 지갑에서 초 단위 차감)

\- needCharge = (myFileTL < 1 || \_assetTL < 1) → true

\- playTrack의 if(requiredTL <= 0) → alert + return



\### 2-5. Social API 404

\- v4 자산은 tl\_files에 있어 social API 404

\- Promise.all에 포함되어 하나라도 실패하면 전체 실패



\---



\## 3. 적용한 수정



\### 3-1. D1 데이터 마이그레이션

UPDATE tl3\_releases SET rights\_confirmed=1 WHERE status='released';

UPDATE tl\_files SET file\_type='audio/tl3'

&#x20; WHERE id IN (SELECT file\_id FROM tl3\_releases WHERE status='released');



\### 3-2. 백엔드 — src/economics.ts

const actualBalance = Number(user.tl\_balance ?? (tlP + tlA + tlB)) || 0;

return c.json({

&#x20; wallet: {

&#x20;   tl\_balance: actualBalance,

&#x20;   tl\_locked: Number(user.tl\_locked || 0),

&#x20;   tl\_p: tlP, tl\_a: tlA, tl\_b: tlB,

&#x20;   tl\_total: actualBalance,

&#x20;   ...

&#x20; }

});



\### 3-3. 프론트 — public/track.html

\- 라인 1810: <script src="/notice-popup.js"></script> 닫는 태그 추가

\- 라인 1333\~1338: playTrack의 requiredTL <= 0 alert 제거

\- 라인 407\~415: Promise.all → 개별 try/catch

\- 라인 1250\~1258: loadComments에 r.ok 체크

\- needCharge / canPlay: \_assetTL 조건 제거



\---



\## 4. 검증 결과



| 항목 | Before | After |

|---|---|---|

| /api/shares 자산 수 | 2 | 30 |

| 지갑 표시 | 2,675,543 | 657,031.99 |

| playBtn | disabled | 활성화 |

| 재생 | alert | 정상 재생 |

| SyntaxError | 발생 | 없음 |



\---



\## 5. 남은 작업



\- \[ ] spine/releases API v4 프론트 rights\_confirmed:true 전송 확인

\- \[ ] v4 등록 시 tl\_files.file\_type='audio/tl3' 자동 설정

\- \[ ] /api/social/stats|comments/:id v4 자산 지원

\- \[ ] renewal/shareplace.html 신버전 페이지

\- \[ ] track.html duration=0 표시 (duration\_ms 활용)



\---



\## 6. 관련 파일



프론트:

\- public/track.html

\- public/shareplace.html

\- public/tl3-manufacture.js



백엔드:

\- src/index.ts — /api/shares, /api/shares/:id, /api/legacy-stream/:id

\- src/routes/shareplace.ts — SharePlace 목록

\- src/economics.ts — /api/eco/wallet



D1 테이블:

\- tl\_files, tl3\_releases, tl3\_segments, tl3\_tokens, users



\---



작성일: 2026-10-16

작성자: Taolee

