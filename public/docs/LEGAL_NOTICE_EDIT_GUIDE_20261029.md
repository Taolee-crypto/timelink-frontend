# 법인·정책 고지 정보 수정 방법 (TimeLink V5)

개발 단계에서 확정되지 않은 **법인 등록번호, 대표자, 주소, 전화번호, 통신판매 신고번호, 약관 시행일, 개인정보 보호책임자**는 **하나의 파일**에서 나중에 입력합니다.

**설정 파일:** `public/docs/legal-notice-config.json`

정책 화면(`terms.html`, `privacy.html`)은 `/legal-notice-config.js`를 통해 이 설정을 읽습니다. 설정한 값만 화면에 반영하며 `null`인 항목은 "최종 고지 정보 확인 중"으로 표시합니다. 유효하지 않은 문자열은 삽입하지 않습니다. **실제 계약에 사용되는 결제·환금 조건, 관련 법률, 적용 국가, 수탁 업체, 보유 기간은 설정 파일 입력만으로 법적 검토가 끝나지 않습니다.**

## 나중에 입력할 위치

- `korean_legal.business_registration_number`: 법인 등기·사업자등록 자료 대조 후 입력
- `korean_legal.representative_name`: 실제 법인 대표자
- `korean_legal.registered_address`: 공시할 법인 주소
- `korean_legal.ecommerce_registration_number`: 해당 신고 시 입력
- `korean_legal.public_phone`: 대외 연락처
- `privacy.controller_entity`, `privacy.protection_officer`: 법적으로 확인된 처리자·보호책임자
- `terms.effective_date`, `terms.approved_version`: 법률·운영 승인 이후 시행일 및 버전
- `privacy_notice.effective_date`, `privacy_notice.approved_version`: 개인정보처리방침 승인 후 시행일과 버전

안전 원칙: 현재 결제 데이터, 회원 동의 이력, DB 원장, 암호화 키를 변경하지 않습니다. 출시 전 별도 법률 점검 및 회원 변경 고지·동의 이행을 확인합니다. UI에 표시되는 안내는 **개발 검토 중**이라는 상태를 유지하며, 시행일을 임의 소급하지 않습니다.

**기술 검증:** `node scripts/test-legal-policy-alignment.cjs` — 구형 법인·광고/DJ 계약·배분율 잔재 및 수정 설정 스키마 검증.
