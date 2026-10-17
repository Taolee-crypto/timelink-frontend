import io, re, json

with io.open("_ko_filtered.json", "r", encoding="utf-8") as f:
    data = json.load(f)

# ─────────────────────────────────────────────
# 기본 사전 (자주 쓰는 UI 단어/구문)
# ─────────────────────────────────────────────
DICT = {
    # 일반
    '방송국':'Radio','결제 금액':'Payment Amount','로딩 중...':'Loading…',
    '영상':'Video','지갑':'Wallet','센터':'Center','아티스트':'Artist',
    '지급':'Reward','충전':'Add TL','닫기':'Close','문서':'Documents',
    '오디오':'Audio','결제하기':'Pay','교환':'Exchange','내 파일':'My Files',
    '라이브 라디오':'Live Radio','로그인':'Login','발라드':'Ballad',
    '보너스':'Bonus','불러오는 중...':'Loading…','소모 중':'Consuming',
    '어쿠스틱':'Acoustic','인디':'Indie','재즈':'Jazz','채굴':'Mining',
    '클래식':'Classical','가이드':'Guide','개인정보처리방침':'Privacy Policy',
    '거래내역':'Transactions','광고 센터':'Ads Center','광고 제목':'Ad Title',
    '광고 참여':'View Ads','광고주 센터':'Advertiser Center','교육':'Education',
    '음악':'Music','홈':'Home','대시보드':'Dashboard','설정':'Settings',
    '저장':'Save','수정':'Edit','삭제':'Delete','완료':'Done','취소':'Cancel',
    '다음':'Next','이전':'Back','검색':'Search','적용':'Apply',
    '제목':'Title','앨범':'Album','장르':'Genre','설명':'Description',
    '가사':'Lyrics','작곡':'Composer','작사':'Lyricist','프로듀서':'Producer',
    '플레이리스트':'Playlist','공유하기':'Share','링크 복사':'Copy Link',
    '재생':'Play','정지':'Stop','일시정지':'Pause','악보':'Sheet Music',
    '카페':'Cafe','방송':'Broadcast','커뮤니티':'Community','기업':'Business',
    '창작자':'Creator','플랫폼':'Platform','기여':'Contribution',
    '보상':'Reward','사용':'Usage','시간':'Time','기간':'Period',
    '정책':'Policy','약관':'Terms','권리':'Rights','자산':'Asset',
    '파일':'File','업로드':'Upload','다운로드':'Download',
    '음원':'Track','곡명':'Track Title','가수':'Singer',
    '등록':'Register','신청':'Apply','승인':'Approve','거절':'Reject',
    '골드 등급':'Gold Tier','창작자 수익':'Creator Rewards','정산':'Settlement',
    '내 지갑':'My Wallet','잔액':'Balance','결제':'Payment',
    '충전하기':'Add TL','출금':'Withdraw','교환하기':'Exchange',
    '채굴하기':'Mine','기여도':'Contribution','점수':'Score',
    '현재':'Current','오늘':'Today','이번달':'This Month','전체':'All',
    '최근':'Recent','인기':'Popular','신규':'New','추천':'Recommended',
    '사용자':'User','회원':'Member','개인 작업 공간':'Personal Workspace',
    '골드 등급 창작자':'Gold Tier Creator',
    '현재 환율':'Current Rate','TL 충전':'Add TL','TLC':'TLC',
    '출금 신청':'Request Withdrawal','출금 수수료':'Withdrawal Fee',
    '실 수령액':'Net Amount','채굴 클레임':'Claim Mining',
    '예상 수령':'Estimated Reward','이번달 수익 분석':'This Month’s Analysis',
    '창작자 수익 (파일 변환)':'Creator Rewards (Asset Conversion)',
    '카페 방송 수익':'Cafe Broadcast Rewards','최근 거래내역':'Recent Transactions',
    'TLC 채굴 클레임':'TLC Mining Claim','TON 출금 완료':'TON Withdrawal Complete',
    '지갑 & 채굴':'Wallet & Mining','총 자산 현황':'Total Asset Overview',
    '누적 기부':'Total Donations','TON 출금':'Withdraw TON',
    'TL → TLC 교환':'Exchange TL → TLC','TON 지갑 출금':'Withdraw to TON Wallet',
    '연결된 TON 지갑':'Connected TON Wallet','출금 TLC 수량':'TLC Withdrawal Amount',
    'TLC 채굴':'TLC Mining','기부 약정':'Donation Pledge',
    'MP3 원본 보안':'Original MP3 Security','마지막 채굴':'Last Mining',
    '오늘 채굴':'Mined Today','TLC 채굴 클레임':'Claim TLC Mining Rewards',
    '방송 청취':'Listen to Broadcast','카페방송':'Cafe Broadcast',
    'TL 총 잔액':'Total TL Balance','+ TL 충전':'+ Add TL',
    '채굴 현황':'Mining Status','오늘 POC 점수':'Today’s POC Score',
    '누적 TLC 채굴량':'Total TLC Mined','POC 기여 지수':'POC Contribution Index',
    '채굴 내역':'Mining History','전체 파일':'All Assets',
    '총 재생 수':'Total Plays','수익 TL':'Rewards (TL)','총 Pulse':'Total Pulse',
    '새 파일 업로드':'Upload New Asset','전체 선택':'Select All',
    '선택 삭제':'Delete Selected','방송 시작':'Start Broadcast',
    '방송 중인 곡':'Now Playing','전체 보기 →':'View all →',
    '최신순':'Latest','인기순':'Popular','전체 자산':'All Assets',
    '음악':'Music','영상':'Video','문서':'Documents',
    '결제하기':'Pay','결제 금액':'Payment Amount','지급 TL':'TL to Receive',
    '현재 잔액':'Current Balance','복사':'Copy','설명':'Description',
    '공개 범위 설정':'Set Visibility','공개 범위':'Visibility',
    '공개 방식':'Sharing Method','권리 확인':'Rights Verification',
    '권리보호형':'Rights Protected','발행 수수료':'Issuance Fee',
    '정지':'Stop','재생':'Play','일시정지':'Pause','공유하기':'Share',
    '링크 복사':'Copy Link','플레이리스트에 추가':'Add to Playlist',
    '새 플레이리스트 만들기':'Create Playlist','악보':'Sheet Music',
    '법적 정보':'Legal','이용약관':'Terms of Service','크리에이터 정책':'Creator Policy',
    '광고 로딩 중...':'Loading ads…','라이브 라디오':'Live Radio',
    '현재 환율: 1,000 TL':'Current Rate: 1,000 TL',
    '현재 환율: 1,000 TL = 1 TLC':'Current Rate: 1,000 TL = 1 TLC',
    '카페 주인 센터':'Cafe Owner Center','카페 기본 정보':'Cafe Information',
    '인카 채널 개설':'Create In-Car Channel','주행 전용':'Driving',
    '오프라인':'Offline','선택':'Select','워터마크':'Watermark',
    '버전관리':'Version Control','지원':'Support','동시접속':'Concurrent',
    '기기 수':'Device Limit','제한':'Limit','허용/차단':'Allow / Block',
    '허용/제한':'Allow / Restrict','사용시간':'Usage Time',
    '사용기간':'Access Period','스크린캡처':'Screenshot',
    '열람':'View','시간 설정':'Set Time','기간 선택':'Select Period',
    '환경 제한':'Environment Restrictions','설정':'Settings',
    # 주소 (그대로 유지 or 번역)
    '씨엠피 주식회사 · 대표이사 이문웅 · 사업자등록번호 491-86-02547':'CMP Co., Ltd. · CEO Lee Mun-woong · Business No. 491-86-02547',
    '서울특별시 영등포구 국제금융로8길 27-8, 4층':'27-8, Gukjegeumyung-ro 8-gil, Yeongdeungpo-gu, Seoul, 4F',
    '씨엠피 주식회사. All rights reserved.':'© CMP Co., Ltd. All rights reserved.',
}

# ─────────────────────────────────────────────
# 부분 매칭 (앞뒤 여백 포함)
# ─────────────────────────────────────────────
def translate(t):
    # 1) 정확 매칭
    if t in DICT:
        return DICT[t]
    # 2) 앞뒤 공백 제거 후 매칭
    s = t.strip()
    if s in DICT:
        return DICT[s]
    # 3) 부분 매칭 (긴 것 우선)
    for k in sorted(DICT.keys(), key=len, reverse=True):
        if k in t and len(k) >= 3:
            return t.replace(k, DICT[k])
    # 4) 없으면 원본 유지
    return t

# ─────────────────────────────────────────────
# 모든 텍스트 번역
# ─────────────────────────────────────────────
result = {}
no_match = []

for t, c in data['texts']:
    tr = translate(t)
    if tr != t:
        result[t] = tr
    else:
        no_match.append((t, c))

print(f"번역됨: {len(result)}")
print(f"미번역: {len(no_match)}")

# 저장
with io.open("_auto_translate.json", "w", encoding="utf-8") as f:
    json.dump(result, f, ensure_ascii=False, indent=2)

with io.open("_no_match.json", "w", encoding="utf-8") as f:
    json.dump(no_match, f, ensure_ascii=False, indent=2)

print(f"\n미번역 상위 30개 (수동 추가 필요):")
for t, c in no_match[:30]:
    print(f"  [{c}] {t}")
