# TimeLink TL3 Server

음악 플레이가 되지 않던 문제를 해결하기 위한 **새 백엔드 서버**입니다.
MP3를 **TL3** 파일로 변환하고, 사이트에서 TL3를 디코딩해 실제로 재생되도록 합니다.

## 왜 필요했나

기존 재생 경로는 Cloudflare R2 공개 버킷(`pub-….r2.dev`)의 오디오 URL을
`<audio>`에 그대로 넣는 방식이었습니다. 그런데:

- R2 버킷이 현재 **모든 오브젝트에 403**을 반환 (`R2 through the Cloudflare Dashboard` 오류)
- 저장된 `.tl3` 파일은 `TLNK` 컨테이너라 브라우저가 **직접 디코딩할 수 없음**
- 결과적으로 사이트에서 음악이 재생되지 않음

이 서버는 R2에 의존하지 않고 **직접 TL3를 저장·스트리밍**하며,
클라이언트 라이브러리(`public/tl3.js`)가 TL3를 mp3로 디코딩해 재생합니다.

## 구성

| 파일 | 역할 |
|------|------|
| `server/server.js` | Express API — MP3→TL3 변환, TL3 스트리밍, 카탈로그 |
| `public/tl3.js` | 브라우저 TL3 디코더/플레이어 라이브러리 (`window.TL3`) |
| `public/tl3-config.js` | TL3 서버 base URL 설정 |
| `public/tl3-player.html` | 변환 + 재생 데모 UI |

## TL3 포맷 (v2)

`public/creator.html`의 브라우저 인코더와 **동일한 포맷**입니다.

```
offset  size  field
0       4     magic "TLNK" (0x54 0x4C 0x4E 0x4B)
4       1     version (0x02)
5       2     metadata length (big-endian uint16)
7       N     metadata JSON (UTF-8)
7+N     M     XOR-encrypted MP3 payload
```

XOR 키: `TIMELINK_XOR_KEY_2026_SECURE` (서버/클라이언트 공용)

## 실행

```bash
cd server
npm install
npm start                 # 기본 포트 8787 (PORT 환경변수로 변경)
```

## API

| Method | Path | 설명 |
|--------|------|------|
| GET  | `/api/health` | 헬스 체크 |
| GET  | `/api/tracks` | 카탈로그 목록 (`?genre=` 필터) |
| GET  | `/api/tracks/:id` | 단일 트랙 메타데이터 |
| POST | `/api/convert` | **MP3 → TL3 변환** (multipart, `file` + 메타) |
| POST | `/api/upload` | `/api/convert`와 동일 |
| GET  | `/api/stream/:id` | **TL3 스트리밍** (Range 지원) |
| GET  | `/api/decode/:id` | 디코딩된 원본 MP3 반환 |
| DELETE | `/api/tracks/:id` | 트랙 삭제 |

### 변환 예시

```bash
curl -X POST http://localhost:8787/api/convert \
  -F "file=@song.mp3" \
  -F "title=테스트 곡" -F "artist=이타오" -F "genre=Pop" -F "duration=209"
```

### 재생 (클라이언트)

```html
<script src="/tl3.js"></script>
<script>
  var audio = new Audio();
  TL3.attach(audio, '/api/stream/tl3_123_ab', {autoplay:true}).then(function(r){
    console.log('TL3 디코딩:', r.decoded, r.meta);
  });
</script>
```

기존 플레이어는 `TL3.resolveUrl(url)`로 URL만 mp3 Blob URL로 바꿔 끼우면 됩니다.

```js
TL3.resolveUrl(fileUrl).then(function(playable){
  audio.src = playable; audio.load(); audio.play();
});
```

## 사이트 연동

`shareplace.html`, `radio.html`, `cafe-radio.html`, `incar.html`, `track.html`
에 `tl3.js` + `tl3-config.js`가 포함되어 있고, 재생 직전에 TL3를 디코딩합니다.

프로덕션에서는 `public/tl3-config.js` 상단에서 `window.TL3_API_BASE`를 실제
TL3 서버 주소로 지정하세요 (기본값은 same-origin).

## 테스트

```bash
cd server
node test/tl3.test.js      # 코덱 라운드트립 (encode→decode 바이트 동일성)
```
