# TimeLink 재생 권한 및 과금 세션 설계 v1

작성일: 2026-10-14  
상태: 설계 기준안 — 구현·운영 적용 전 검토 필요  
대상: `timelink-backend`, `timelink-frontend`

## 1. 설계 목적

TimeLink의 파일 전달은 단순한 URL 공개가 아니다. 콘텐츠의 종류, 발행 상태, 권리 확인 상태, 이용 방식, TL 과금 정책을 서버가 확인한 뒤 허용된 콘텐츠만 전달해야 한다.

이 설계는 다음을 동시에 만족시키는 것을 목표로 한다.

1. 창작자가 보관하는 원본 파일은 기본적으로 비공개다.
2. SharePlace에 등록되었다는 사실만으로 원본 파일의 공개 접근 권한이 생기지 않는다.
3. 공개 MP3 홍보 재생과 보호된 TL3 재생은 서로 다른 정책을 가진다.
4. TL3의 이용 시간과 비용은 서버가 결정하며 클라이언트가 단가를 조작할 수 없다.
5. InCar의 청취자 과금 0 TL 정책은 콘텐츠 접근권한과 분리한다.
6. 기존 Creator, SharePlace, Track Page, TL3 발행 및 재생 기능은 회귀 테스트를 통과하며 단계적으로 전환한다.

## 2. 콘텐츠 종류별 권한 정책

| 콘텐츠/이용 방식 | 원본 파일 | 재생·열람 | 청취자 TL 차감 |
|---|---|---|---|
| 개인 원본 보관 | 소유자 및 허가된 내부 처리만 | 기본 차단 | 해당 없음 |
| 공개 무료 MP3 | 원본이 아닌 승인된 공개 파생본 | 명시적으로 공개 승인된 파생본만 | 0 TL |
| 보호 TL3 | 원본은 비공개 | 유효한 발행 상태와 재생 권한 확인 후 보호 전달 | 서버 산정 시간만큼 차감 |
| TL4 영상 | 원본 비공개 | 유효한 발행/열람 권한 및 세션 확인 | 정책에 따른 서버 산정 |
| TLD 문서 | 원본 비공개 | 유효한 열람 권한 및 세션 확인 | 정책에 따른 서버 산정 |
| TLJ 이미지 | 원본 비공개 | 유효한 열람/표시 권한 확인 | 정책에 따른 서버 산정 |
| InCar 홍보 재생 | 원본 비공개 | 홍보 재생에 허용된 파생본 또는 권한이 부여된 콘텐츠만 | 청취자 0 TL 정책. 단, 접근권한은 별도 확인 |

**핵심 구분:** 무료 또는 청취자 0 TL은 원본 파일을 공개한다는 뜻이 아니다. 이용료와 파일 접근권한은 독립된 판단이다.

## 3. 서버가 보장해야 하는 원칙

### 3.1 원본 파일과 공개 파생본 분리

- `storage_objects`는 개인 원본 보관 메타데이터로 취급한다.
- 공개 MP3는 원본과 분리된 공개용 파생 자산으로 관리한다.
- TL3/TL4/TLD/TLJ는 보호 컨테이너 또는 보호 파생 자산을 기준으로 전달한다.
- SharePlace/Track Page의 공개 API 응답에 OAuth 다운로드 URL, 원본 URL, 내부 저장소 key, 비밀키, 원본 보관 경로를 포함하지 않는다.
- 내부 `stream_url`을 클라이언트가 직접 원본에 접근할 수 있는 주소로 사용하지 않는다.

### 3.2 자산 등록과 공개 상태 분리

자산 레코드는 최소한 다음 상태를 구분해야 한다.

- `private_source`: 비공개 원본
- `processing`: 변환/검증 중
- `ready_private`: 보호 파일 준비 완료, 아직 비공개
- `published_public_preview`: 공개 승인된 미리듣기/파생본
- `published_protected`: 보호 콘텐츠 발행 완료
- `suspended`: 권리 분쟁 또는 운영 중지
- `withdrawn`: 창작자 또는 운영 정책에 따라 발행 철회

현재 `tl_files`, `tl_shares`, `storage_objects`, `tl3_releases`에 이 상태가 일관되게 존재한다고 가정하지 않는다. 새 Asset Registry를 통해 기존 ID를 점진적으로 연결한다.

## 4. 새 재생 세션 흐름

1. 클라이언트가 `POST /api/v2/playback/sessions`에 자산 ID와 이용 방식(`web`, `incar`, `preview`)을 전달한다.
2. 서버가 로그인 상태, 계정 상태, 자산 소유자, 공개/발행 상태, 권리 상태, 콘텐츠 유형, 이용 방식별 접근 정책을 확인한다.
3. 서버가 자산에 저장된 가격 정책과 이용 방식에 따라 차감액을 산정한다. 클라이언트의 `price`, `deduct_rate`, `cost` 값은 받더라도 과금 근거로 사용하지 않는다.
4. 유료 재생이면 서버가 TL Economics 원장을 통해 충분한 잔액을 원자적으로 확인하고 차감한다. 잔액 부족 시 재생 권한을 발급하지 않는다.
5. 서버가 세션 ID와 짧은 만료 시간을 가진 재생 grant를 발급한다.
6. 클라이언트는 grant를 이용해 허용된 구간 또는 세그먼트를 요청한다.
7. 서버는 매 전달 요청에서 grant의 서명, 만료, 사용자, 자산, 세션, 콘텐츠 버전, 허용 구간을 검증한다.
8. 소비 시간 및 정산 이벤트는 중복 요청에 안전한 고유 이벤트 ID로 기록한다.
9. 세션 만료·철회·분쟁 발생 시 이후 구간 전달을 중단한다.

## 5. API 초안

### 세션 생성

`POST /api/v2/playback/sessions`

요청 예시:

```json
{
  "asset_id": "sh_example",
  "mode": "web"
}
```

클라이언트가 보내지 말아야 할 과금 입력:
- 단가
- 차감률
- 총 비용
- 최종 TL 잔액

서버 응답 예시:

```json
{
  "ok": true,
  "session_id": "ps_example",
  "grant": "signed-short-lived-token",
  "expires_at": "2026-10-14T12:00:30Z",
  "mode": "web",
  "charge": {
    "listener_tl": 5,
    "currency": "TL"
  },
  "delivery": {
    "type": "protected_segments",
    "manifest_url": "/api/v2/playback/sessions/ps_example/manifest"
  }
}
```

응답 구조는 설계 예시이며 현재 구현된 API가 아니다. 공개 무료 MP3는 `listener_tl: 0` 및 `delivery.type: public_derivative`를 반환할 수 있다. InCar도 청취자 과금은 0으로 처리할 수 있으나, 허용된 콘텐츠와 grant 검증은 동일하게 적용한다.

### 세그먼트 전달

`GET /api/v2/playback/sessions/:sessionId/segments/:segmentId`

서버 검증:
- grant 서명 및 만료
- 세션 상태
- 세션 사용자와 토큰 사용자 일치
- 자산 ID 및 버전 일치
- 콘텐츠 발행/분쟁 상태
- 허용된 세그먼트 범위
- 세션별 요청 빈도 및 재전송 정책

### 세션 종료

`POST /api/v2/playback/sessions/:sessionId/close`

- 세션 종료 이벤트는 멱등성을 보장한다.
- 종료 요청만으로 사용하지 않은 시간을 창작자 수익으로 정산하지 않는다.
- 실제 소비량은 서버가 검증한 구간 이벤트를 기준으로 산정한다.

## 6. 데이터 모델 초안

### playback_sessions

| 필드 | 의미 |
|---|---|
| id | 예측하기 어려운 세션 ID |
| user_id | 로그인 사용자 |
| asset_id | 공통 Asset Registry ID |
| asset_version | 재생 시작 시점의 자산 버전 |
| mode | web / incar / preview |
| status | active / expired / revoked / closed |
| price_snapshot | 세션 생성 시 서버가 확정한 가격 |
| charged_tl | 실제 차감 TL |
| consumed_seconds | 서버 검증 소비 시간 |
| grant_hash | 원문 grant가 아닌 검증용 해시 |
| expires_at | 서버 기준 만료 시각 |
| created_at / closed_at | 생성/종료 시각 |

### playback_events

| 필드 | 의미 |
|---|---|
| idempotency_key | 중복 과금 방지 고유키 |
| session_id | 재생 세션 |
| user_id | 이용자 |
| asset_id | 자산 |
| event_type | grant / segment / consume / refund / revoke |
| seconds | 검증된 소비 시간 |
| tl_delta | TL 원장 반영값 |
| created_at | 서버 기록 시각 |

세션과 이벤트는 실제 TL Economics 원장과 연결해야 한다. 기존 잔액 컬럼을 임의로 합산하거나 새 잔액을 이중으로 만들지 않는다.

## 7. TL Economics 정산 원칙

- 과금 단가와 차감 시간은 서버가 확정한다.
- 충분한 잔액 확인과 차감은 원자적으로 처리한다.
- 이용자 차감과 창작자 기여 정산은 동일한 원장 이벤트 또는 연결된 원장 이벤트로 추적 가능해야 한다.
- 재시도·네트워크 재전송은 동일 idempotency key로 중복 차감되지 않아야 한다.
- 무료 MP3와 InCar 청취자 0 TL은 청취자 차감이 0이라는 의미이며, POC·TLC 보상이나 창작자 정산을 자동 발생시키지 않는다. 각각 별도의 기여 이벤트 및 정책이 있어야 한다.
- 기존 `tl_balance`, `tl`, `tl_p`, `tl_a`, `tl_b` 컬럼의 의미와 우선순위를 확정하기 전에는 새 세션 시스템을 운영 원장에 연결하지 않는다.

## 8. 필수 보안 테스트

| 테스트 | 기대 결과 |
|---|---|
| 비로그인 사용자가 비공개 원본 요청 | 401/403 |
| 사용자 A가 사용자 B의 storage object ID 요청 | 403 또는 404 |
| SharePlace에 연결됐지만 비공개인 원본 요청 | 거부 |
| 공개 무료 MP3 승인 파생본 요청 | 정책에 따라 허용, 원본 URL은 노출하지 않음 |
| TL3 세션 없이 스트림 직접 호출 | 거부 |
| 만료된 grant 사용 | 거부 |
| 다른 사용자 세션 ID/grant 사용 | 거부 |
| 클라이언트가 deduct_rate=0 전달 | 서버 가격 정책으로 계산 |
| 클라이언트가 음수 seconds 전달 | 400 |
| 잔액 부족 | 차감·grant 없이 402 |
| 동일 consume 이벤트 재전송 | 중복 차감 없음 |
| 분쟁/철회된 자산의 기존 세션 재사용 | 정책에 따라 즉시 중지 |
| InCar 적격 홍보 재생 | 청취자 차감 0, 접근 권한 검증은 유지 |
| Range 요청으로 허용 범위 밖 바이트 요청 | 거부 |

## 9. 단계적 마이그레이션

1. 현재 Creator/SharePlace/Track Page가 사용하는 모든 스트림 URL과 호출 시점을 목록화한다.
2. 공개 MP3 파생본과 개인 원본이 현재 저장 구조에서 실제로 분리되어 있는지 확인한다.
3. Asset Registry와 playback session 테이블을 스테이징에 먼저 만든다.
4. 기존 재생 API를 유지한 채 신규 세션 API를 병렬 구현한다.
5. 공개 MP3, TL3, InCar 각 시나리오의 자동화 테스트를 만든다.
6. 테스트 계정에서 신규 세션 경로를 선택적으로 활성화한다.
7. 재생·차감·정산·오류 로그를 대조한 뒤 전환 범위를 확대한다.
8. 기존 직접 스트림 URL은 호출자와 외부 의존성을 확인한 뒤 단계적으로 종료한다.

**운영 차단 조건:** 기존 재생 호환성, TL 원장 정합성, 원본 비공개, 사용자 A/B 격리, grant 만료 및 중복 과금 방지 테스트가 통과하지 않으면 운영 전환하지 않는다.

## 10. 현재 확인된 기존 코드 위험

- `GET /api/stream/:shareId`는 사용자 재생 grant를 확인하지 않고 외부 URL, 외부 저장소 객체 또는 D1 저장 객체를 전달하는 경로가 있다.
- `GET /api/stream/:shareId/info`의 `can_play`는 실제 스트림 전달 권한과 결합되어 있지 않다.
- `POST /api/stream/:shareId/tick`은 요청 본문의 `deduct_rate`를 사용하고 잔액 부족 차액을 완전히 거부하지 않는 흐름이 있다.
- `GET /api/storage/object/:id/stream`은 SharePlace 연결 여부만으로 접근을 허용하는 분기가 있다.
- `GET /api/storage/:key`는 키를 아는 요청자에게 원본 바이트를 전달할 수 있는 경로다.

이 경로들은 운영에서 기존 재생과 연동 중일 수 있으므로, 본 문서는 즉시 차단 지시가 아니다. 신규 재생 권한 계층을 구현하고 회귀 검증을 마친 뒤 단계적으로 교체하기 위한 기준이다.
