# TimeLink 원칙 (PRINCIPLES)

## 1. mp3 재생 금지 원칙

**우리 플랫폼에서는 mp3 파일을 절대 재생하지 않는다.**

- 업로드된 원본 mp3는 **다운로드만** 가능
- 플랫폼 내 재생은 **오직 `.tl3` 파일만**
- `.mp3` URL을 `<audio>`, `<video>`에 직접 넣는 것 금지
- mp3는 크리에이터가 "원본 보관용"으로만 받아감

### 이유

1. **저작권 보호**: mp3 원본 유통 방지
2. **과금 정확성**: mp3 직접 재생 = TL 차감 우회
3. **v3 정체성**: TL3(AES-GCM + 타임토큰 체인)를 통해서만 재생

### 적용 범위

- track.html
- dj-center.html
- player-host.html
- shareplace.html
- cafe-radio.html
- tl3-player.html
- 오프라인 플레이어 (playFile)

### 예외

없음. **무조건.**

---

## 2. TL3 파일 원칙

- `.tl3` = mp3 + 시간 + 저작권 + AES-256-GCM + 타임토큰 체인
- 재생은 **반드시 클라이언트에서 복호화 후**
- 서버는 ciphertext만 전달
- LP 효과는 `lp.js`가 실시간 처리 (파일 저장 X)

---

## 3. 파일 저장 원칙

- 원본 파일: 로컬 PC (R2 대용), 메타: D1
- `.tl3` 파일: D1 object (`tl3/releases/{fileId}.tl3`)
- 세그먼트 위치: D1 `tl3_segments` (offset/length)
- 토큰: D1 `tl3_tokens` (share_id, kind='mp3', segment_index, token)

---

## 4. 암호화 원칙
lic = HKDF(master, info="license:"+shareId) [서버만]
T_0 = SHA256(fid ‖ hash_mp3 ‖ salt)
k_n = SHA256(T_{n-1} ‖ lic ‖ "K"+n)
iv_n = [4B 0][8B n] (big-endian)
T_n = SHA256(T_{n-1} ‖ fid ‖ str(n) ‖ SHA256(ct_n))


- AES-256-GCM, tag 128bit
- 세그먼트 = 1초 (SEG_SECONDS=1)
- 매 초 다른 키

---

## 5. 오프라인 원칙

- 오프라인 재생은 **`.tl3` 파일 다운로드 후**
- 파일에 `lic`, `mp3_tokens`, `mp3_seg_lens`, `fid`, `salt`, `hash_mp3` 포함 (자급자족)
- 온라인은 기존 스트리밍 (`resolveUrl`)
- **mp3 파일로는 오프라인 재생 불가**

---

## 6. UI 원칙

- UI 절대 안 바꿈 (JS 로직만)
- 기존 사용자 경험 유지
- 새 기능은 **추가 버튼**으로 (기존 버튼 변경 X)

---

## 7. 개발 원칙

- 한 번에 하나씩 (백업 → 수정 → 검증)
- LF 유지 (`.gitattributes`)
- Python 스크립트로 수정 (PowerShell 이스케이프 회피)
- git push만 (wrangler pages deploy 안 씀)

---

**최종 수정: 2026-10-09**

