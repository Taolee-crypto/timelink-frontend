/* TimeLink i18n v2 — KO·EN·JA·ZH·TH·VI */
(function(){
var LANGS=['ko','en','ja','zh','th','vi'];
var FLAGS={ko:'🇰🇷',en:'🇺🇸',ja:'🇯🇵',zh:'🇨🇳',th:'🇹🇭',vi:'🇻🇳'};
var LABELS={ko:'한국어',en:'English',ja:'日本語',zh:'中文',th:'ภาษาไทย',vi:'Tiếng Việt'};

var T={
/* ── 누락 키 전체 보완 (60개) ── */
/* ── ch.* 키 추가 (cafe/incar channel) ── */
'ch.back.radio':       {ko:'← 방송국으로',en:'← Back to Radio',ja:'← ラジオへ',zh:'← 返回电台',th:'← กลับวิทยุ',vi:'← Về radio'},
'ch.cafe.title':       {ko:'☕ 카페 채널 개설',en:'☕ Open Cafe Channel',ja:'☕ カフェチャンネル開設',zh:'☕ 开设咖啡频道',th:'☕ เปิดช่องคาเฟ่',vi:'☕ Mở kênh quán cà phê'},
'ch.benefits.intro':  {ko:'TimeLink 카페 방송은 매장의 분위기에 맞는 음악을 하루 종일 송출하는 카페 전용 라디오 서비스입니다. 운영자는 플레이리스트와 시간대별 음악 분위기를 설정하고, 고객은 QR코드로 신청곡과 사연에 참여할 수 있습니다. 방송은 자동으로 운영되며 카페 운영자가 직접 선곡과 방송 내용을 조정할 수도 있습니다.',en:'TimeLink Cafe Broadcast is a dedicated radio service that plays music suited to your venue throughout the day. Owners can set playlists and moods by time of day, while customers can request songs and send messages by QR code. Broadcasting runs automatically, and owners can also adjust song selection and broadcast content.',ja:'TimeLinkカフェ放送は、店舗の雰囲気に合った音楽を一日中流すカフェ専用ラジオサービスです。運営者はプレイリストや時間帯ごとの音楽ムードを設定でき、お客様はQRコードからリクエスト曲やメッセージを送れます。自動放送に加え、運営者が選曲や放送内容を調整することもできます。',zh:'TimeLink咖啡馆广播是全天播放适合店铺氛围音乐的专属电台服务。店主可设置播放列表和不同时段的音乐风格，顾客可通过二维码点歌并发送留言。系统支持自动播放，店主也可随时调整选曲和广播内容。',th:'TimeLink Cafe Broadcast คือบริการวิทยุเฉพาะร้านที่เปิดเพลงให้เข้ากับบรรยากาศตลอดวัน เจ้าของร้านตั้งเพลย์ลิสต์และแนวเพลงตามช่วงเวลาได้ ลูกค้าสามารถขอเพลงและส่งข้อความผ่าน QR Code ได้ ระบบเล่นอัตโนมัติและเจ้าของร้านยังปรับเพลงหรือเนื้อหาการออกอากาศได้เอง',vi:'TimeLink Cafe Broadcast là dịch vụ radio dành riêng cho quán, phát nhạc phù hợp với không khí cửa hàng suốt cả ngày. Chủ quán có thể thiết lập danh sách phát và phong cách nhạc theo từng khung giờ; khách có thể yêu cầu bài hát và gửi lời nhắn bằng mã QR. Hệ thống phát tự động và chủ quán cũng có thể điều chỉnh bài hát hoặc nội dung phát sóng.'},
'ch.cafe.name.label':  {ko:'카페명',en:'Cafe name',ja:'カフェ名',zh:'咖啡店名',th:'ชื่อคาเฟ่',vi:'Tên quán'},
'ch.channel.id':       {ko:'채널 ID',en:'Channel ID',ja:'チャンネルID',zh:'频道ID',th:'ID ช่อง',vi:'ID kênh'},
'ch.monthly.fee':      {ko:'월정액 채널 이용료',en:'Monthly channel fee',ja:'月額チャンネル利用料',zh:'月度频道费用',th:'ค่าช่องรายเดือน',vi:'Phí kênh hàng tháng'},
'ch.monthly.sub':      {ko:'매월 자동 갱신 • 언제든 해지 가능',en:'Auto-renew monthly • Cancel anytime',ja:'毎月自動更新 • いつでも解約可能',zh:'每月自动续费 • 随时取消',th:'ต่ออายุอัตโนมัติ • ยกเลิกได้ทุกเมื่อ',vi:'Tự động gia hạn • Hủy bất cứ lúc nào'},
'ch.incar.title':      {ko:'🚗 인카 채널 개설',en:'🚗 Open In-Car Channel',ja:'🚗 車内チャンネル開設',zh:'🚗 开设车载频道',th:'🚗 เปิดช่องในรถ',vi:'🚗 Mở kênh trong xe'},
'ch.incar.name.label': {ko:'차량명',en:'Vehicle name',ja:'車両名',zh:'车辆名称',th:'ชื่อรถ',vi:'Tên xe'},
'sp.back.dashboard':   {ko:'← 대시보드',en:'← Dashboard',ja:'← ダッシュボード',zh:'← 控制台',th:'← แดชบอร์ด',vi:'← Bảng điều khiển'},
'sp.chart.all':        {ko:'전체 차트 →',en:'All Charts →',ja:'全チャート →',zh:'全部榜单 →',th:'ชาร์ตทั้งหมด →',vi:'Tất cả →'},
'sp.close':            {ko:'✕ 닫기',en:'✕ Close',ja:'✕ 閉じる',zh:'✕ 关闭',th:'✕ ปิด',vi:'✕ Đóng'},
'sp.close.video':      {ko:'✕ 닫기 (재생 중단)',en:'✕ Close (stop)',ja:'✕ 閉じる（停止）',zh:'✕ 关闭（停止）',th:'✕ ปิด (หยุด)',vi:'✕ Đóng (dừng)'},
'sp.doc.label':        {ko:'📄 문서',en:'📄 Document',ja:'📄 文書',zh:'📄 文档',th:'📄 เอกสาร',vi:'📄 Tài liệu'},
'sp.tl.consuming':     {ko:'⚡ TL 소모 중 · ESC로 닫기',en:'⚡ TL consuming · ESC to close',ja:'⚡ TL消費中 · ESCで閉じる',zh:'⚡ TL消耗中 · ESC关闭',th:'⚡ กำลังใช้ TL · ESC ปิด',vi:'⚡ Đang dùng TL · ESC đóng'},
'sp.tl.consuming.doc': {ko:'⚡ TL 소모 중 — 열람 시간만큼 차감됩니다',en:'⚡ TL consuming — deducted per second',ja:'⚡ TL消費中 — 閲覧時間分差引',zh:'⚡ TL消耗中 — 按秒扣除',th:'⚡ กำลังใช้ TL — หักตามเวลา',vi:'⚡ Đang dùng TL — trừ theo thời gian'},
'sp.tl.remain':        {ko:'⚡ TL 잔량',en:'⚡ TL Remaining',ja:'⚡ TL残量',zh:'⚡ TL剩余',th:'⚡ TL คงเหลือ',vi:'⚡ TL còn lại'},
'cr.artist.label':     {ko:'아티스트',en:'Artist',ja:'アーティスト',zh:'艺术家',th:'ศิลปิน',vi:'Nghệ sĩ'},
'cr.back.dash':        {ko:'← 대시보드',en:'← Dashboard',ja:'← ダッシュボード',zh:'← 控制台',th:'← แดชบอร์ด',vi:'← Bảng điều khiển'},
'cr.center.title':     {ko:'창작자 센터',en:'Creator Center',ja:'クリエイターセンター',zh:'创作者中心',th:'ศูนย์ครีเอเตอร์',vi:'Trung tâm tác giả'},
'cr.file.info':        {ko:'② 파일 정보 입력',en:'② File Info',ja:'② ファイル情報',zh:'② 文件信息',th:'② ข้อมูลไฟล์',vi:'② Thông tin file'},
'cr.file.type':        {ko:'① 파일 형식 선택',en:'① File Type',ja:'① ファイル形式',zh:'① 文件类型',th:'① ประเภทไฟล์',vi:'① Loại file'},
'cr.logout':           {ko:'↩ 로그아웃',en:'↩ Logout',ja:'↩ ログアウト',zh:'↩ 退出',th:'↩ ออกจากระบบ',vi:'↩ Đăng xuất'},
'cr.menu':             {ko:'메뉴',en:'Menu',ja:'メニュー',zh:'菜单',th:'เมนู',vi:'Menu'},
'cr.my.files.sub':     {ko:'업로드한 파일 목록',en:'Uploaded files',ja:'アップロード済み',zh:'已上传文件',th:'ไฟล์ที่อัปโหลด',vi:'File đã tải lên'},
'cr.remove.file':      {ko:'✕ 제거',en:'✕ Remove',ja:'✕ 削除',zh:'✕ 移除',th:'✕ ลบ',vi:'✕ Xóa'},
'cr.title.req':        {ko:'제목 *',en:'Title *',ja:'タイトル *',zh:'标题 *',th:'ชื่อ *',vi:'Tiêu đề *'},
'cr.uploading':        {ko:'R2에 파일 업로드 중...',en:'Uploading to R2...',ja:'R2にアップロード中...',zh:'上传到R2中...',th:'กำลังอัปโหลด...',vi:'Đang tải lên R2...'},
'dash.channel.open':   {ko:'☕ 채널 개설',en:'☕ Open Channel',ja:'☕ チャンネル開設',zh:'☕ 创建频道',th:'☕ เปิดช่อง',vi:'☕ Tạo kênh'},
'dash.greeting':       {ko:'안녕하세요',en:'Hello',ja:'こんにちは',zh:'你好',th:'สวัสดี',vi:'Xin chào'},
'dash.mine':           {ko:'TLC 채굴',en:'TLC Mining',ja:'TLC採掘',zh:'TLC挖矿',th:'ขุด TLC',vi:'Khai thác TLC'},
'dash.poc.sub':        {ko:'기여 점수',en:'Contribution score',ja:'貢献スコア',zh:'贡献分数',th:'คะแนนการมีส่วนร่วม',vi:'Điểm đóng góp'},
'dash.shortcuts':      {ko:'바로가기',en:'Shortcuts',ja:'ショートカット',zh:'快捷方式',th:'ทางลัด',vi:'Lối tắt'},
'dash.tl':             {ko:'TL 잔액',en:'TL Balance',ja:'TL残高',zh:'TL余额',th:'ยอด TL',vi:'Số dư TL'},
'dash.tlc':            {ko:'TLC 보유량',en:'TLC Held',ja:'TLC保有量',zh:'TLC持有量',th:'TLC ที่มี',vi:'TLC đang giữ'},
'dash.tlc.sub':        {ko:'거래용 토큰',en:'Trading token',ja:'取引用トークン',zh:'交易代币',th:'โทเค็นซื้อขาย',vi:'Token giao dịch'},
'dash.token.sub':      {ko:'소비용 토큰',en:'Consumption token',ja:'消費用トークン',zh:'消费代币',th:'โทเค็นใช้งาน',vi:'Token tiêu dùng'},
'dash.upload.sub':     {ko:'업로드한 파일',en:'Uploaded files',ja:'アップロード済み',zh:'已上传文件',th:'ไฟล์อัปโหลด',vi:'File đã tải lên'},
'chart.genre.all':     {ko:'전체 장르',en:'All Genres',ja:'全ジャンル',zh:'全部类型',th:'ทุกแนว',vi:'Tất cả thể loại'},
'chart.loading':       {ko:'차트 로딩 중...',en:'Loading chart...',ja:'チャート読込中...',zh:'加载榜单...',th:'กำลังโหลดชาร์ต...',vi:'Đang tải...'},
'chart.logout':        {ko:'로그아웃',en:'Logout',ja:'ログアウト',zh:'退出',th:'ออกจากระบบ',vi:'Đăng xuất'},
'chart.sub':           {ko:'가장 많이 소비된 콘텐츠 실시간 순위',en:'Most consumed content live ranking',ja:'最も消費されたコンテンツ',zh:'消费最多内容实时排名',th:'อันดับเนื้อหายอดนิยม',vi:'Bảng xếp hạng nội dung'},
'chart.title':         {ko:'TL CHART',en:'TL CHART',ja:'TLチャート',zh:'TL排行榜',th:'TL ชาร์ต',vi:'BXH TL'},
'chart.tl.desc':       {ko:'리스너들이 가장 많이 TL을 충전한 파일',en:'Files with most TL charged by listeners',ja:'リスナーが最もTLをチャージしたファイル',zh:'听众充值最多TL的文件',th:'ไฟล์ที่มีการเติม TL มากที่สุด',vi:'File được nạp TL nhiều nhất'},
'radio.cafe.incar.ai': {ko:'분위기별 AI 큐레이션',en:'AI curation by mood',ja:'雰囲気別AIキュレーション',zh:'氛围AI推荐',th:'AI คิวเพลงตามบรรยากาศ',vi:'AI theo tâm trạng'},
'radio.cafe.mode':     {ko:'카페방송 기본',en:'Cafe Radio Basic',ja:'カフェ放送基本',zh:'咖啡广播基础',th:'วิทยุคาเฟ่พื้นฐาน',vi:'Radio cà phê cơ bản'},
'radio.incar.ai.desc': {ko:'주행 연동 AI 라디오',en:'Drive-sync AI Radio',ja:'走行連動AIラジオ',zh:'驾车AI广播',th:'วิทยุ AI เชื่อมการขับ',vi:'Radio AI theo xe'},
'radio.live.ch':       {ko:'라이브 채널',en:'Live Channels',ja:'ライブチャンネル',zh:'直播频道',th:'ช่องสด',vi:'Kênh trực tiếp'},
'radio.mode':          {ko:'방송 모드',en:'Broadcast Mode',ja:'放送モード',zh:'广播模式',th:'โหมดออกอากาศ',vi:'Chế độ phát sóng'},
'radio.poc':           {ko:'POC 점수',en:'POC Score',ja:'POCスコア',zh:'POC分数',th:'คะแนน POC',vi:'Điểm POC'},
'radio.poc.label':     {ko:'현재 POC 배율',en:'Current POC rate',ja:'現在のPOC倍率',zh:'当前POC倍率',th:'อัตรา POC ปัจจุบัน',vi:'Tỷ lệ POC hiện tại'},
'radio.ready':         {ko:'방송 준비 중...',en:'Preparing broadcast...',ja:'放送準備中...',zh:'准备广播...',th:'กำลังเตรียม...',vi:'Đang chuẩn bị...'},
'radio.request':       {ko:'신청하기',en:'Request',ja:'リクエスト',zh:'申请',th:'ร้องขอ',vi:'Yêu cầu'},
'radio.today.poc':     {ko:'오늘 기여',en:'Today contribution',ja:'今日の貢献',zh:'今日贡献',th:'การมีส่วนร่วมวันนี้',vi:'Đóng góp hôm nay'},
'incar.poc.drive':     {ko:'주행 중 POC 2.5배',en:'Driving POC 2.5x',ja:'走行中POC 2.5倍',zh:'行驶中POC 2.5倍',th:'ขับรถ POC 2.5x',vi:'Lái xe POC 2.5x'},
'incar.queue':         {ko:'재생 목록',en:'Queue',ja:'再生リスト',zh:'播放列表',th:'คิวเพลง',vi:'Danh sách phát'},
'incar.skip.plate':    {ko:'번호판 없이 시작 (POC 1.0x)',en:'Start without plate (POC 1.0x)',ja:'ナンバーなし開始（POC 1.0x）',zh:'无车牌开始（POC 1.0x）',th:'เริ่มโดยไม่มีทะเบียน (POC 1.0x)',vi:'Bắt đầu không biển số (POC 1.0x)'},
'incar.stopped':       {ko:'정차 중',en:'Stopped',ja:'停車中',zh:'已停车',th:'จอดอยู่',vi:'Đã dừng'},
'login.email.label':   {ko:'이메일',en:'Email',ja:'メール',zh:'邮箱',th:'อีเมล',vi:'Email'},
'login.pw.label':      {ko:'비밀번호',en:'Password',ja:'パスワード',zh:'密码',th:'รหัสผ่าน',vi:'Mật khẩu'},
'login.ton.btn':       {ko:'TON Wallet 로그인 (Phase 2)',en:'TON Wallet Login (Phase 2)',ja:'TONウォレット (Phase 2)',zh:'TON钱包登录 (Phase 2)',th:'TON Wallet (Phase 2)',vi:'TON Wallet (Phase 2)'},
'signup.email.label':  {ko:'이메일 주소',en:'Email address',ja:'メールアドレス',zh:'邮箱地址',th:'ที่อยู่อีเมล',vi:'Địa chỉ email'},
'signup.nick.label':   {ko:'닉네임',en:'Username',ja:'ニックネーム',zh:'昵称',th:'ชื่อผู้ใช้',vi:'Tên người dùng'},
'signup.or.email':     {ko:'또는 이메일로 가입',en:'Or sign up with email',ja:'またはメールで登録',zh:'或用邮箱注册',th:'หรือสมัครด้วยอีเมล',vi:'Hoặc đăng ký bằng email'},
'signup.pw.label':     {ko:'비밀번호',en:'Password',ja:'パスワード',zh:'密码',th:'รหัสผ่าน',vi:'Mật khẩu'},
'signup.pw2.label':    {ko:'비밀번호 확인',en:'Confirm password',ja:'パスワード確認',zh:'确认密码',th:'ยืนยันรหัสผ่าน',vi:'Xác nhận mật khẩu'},
'signup.send.code':    {ko:'인증 발송',en:'Send code',ja:'認証送信',zh:'发送验证码',th:'ส่งรหัส',vi:'Gửi mã'},
'signup.title2':       {ko:'계정 만들기',en:'Create account',ja:'アカウント作成',zh:'创建账号',th:'สร้างบัญชี',vi:'Tạo tài khoản'},
'signup.verify.btn':   {ko:'확인',en:'Verify',ja:'確認',zh:'验证',th:'ยืนยัน',vi:'Xác nhận'},

/* ── 네비게이션 ── */

/* ── SharePlace 추가 키 ── */
'sp.tl.charge.tab':    {ko:'⚡ TL충전',en:'⚡ Charge TL',ja:'⚡ TLチャージ',zh:'⚡ 充值TL',th:'⚡ เติม TL',vi:'⚡ Nạp TL'},
'sp.tl.charge.link':   {ko:'TL 충전하기',en:'Charge TL',ja:'TLチャージ',zh:'充值TL',th:'เติม TL',vi:'Nạp TL'},
'sp.tl.low':           {ko:'TL 부족!',en:'Low TL!',ja:'TL不足！',zh:'TL不足！',th:'TL ไม่พอ!',vi:'TL thấp!'},
'sp.notice.title':     {ko:'공지사항',en:'Notice',ja:'お知らせ',zh:'公告',th:'ประกาศ',vi:'Thông báo'},
'sp.notice.head':      {ko:'공지사항',en:'Notice',ja:'お知らせ',zh:'公告',th:'ประกาศ',vi:'Thông báo'},
'sp.notice.confirm':   {ko:'확인',en:'OK',ja:'確認',zh:'确认',th:'ตกลง',vi:'Xác nhận'},
'sp.tab.all':          {ko:'전체',en:'All',ja:'すべて',zh:'全部',th:'ทั้งหมด',vi:'Tất cả'},
'sp.tab.music':        {ko:'🎵 음악',en:'🎵 Music',ja:'🎵 音楽',zh:'🎵 音乐',th:'🎵 เพลง',vi:'🎵 Âm nhạc'},
'sp.tab.video':        {ko:'🎬 영상',en:'🎬 Video',ja:'🎬 動画',zh:'🎬 视频',th:'🎬 วิดีโอ',vi:'🎬 Video'},
'sp.tab.image':        {ko:'🖼️ 이미지',en:'🖼️ Image',ja:'🖼️ 画像',zh:'🖼️ 图片',th:'🖼️ รูปภาพ',vi:'🖼️ Hình'},
'sp.tab.doc':          {ko:'📄 문서',en:'📄 Docs',ja:'📄 文書',zh:'📄 文档',th:'📄 เอกสาร',vi:'📄 Tài liệu'},
'sp.tab.etc':          {ko:'📦 기타',en:'📦 Etc',ja:'📦 その他',zh:'📦 其他',th:'📦 อื่นๆ',vi:'📦 Khác'},

'nav.dashboard':       {ko:'대시보드',en:'Dashboard',ja:'ダッシュボード',zh:'控制台',th:'แดชบอร์ด',vi:'Bảng điều khiển'},
'nav.shareplace':      {ko:'SHAREPLACE',en:'SHAREPLACE',ja:'SHAREPLACE',zh:'SHAREPLACE',th:'SHAREPLACE',vi:'SHAREPLACE'},
'nav.chart':           {ko:'TL CHART',en:'TL CHART',ja:'TLチャート',zh:'TL排行榜',th:'TL ชาร์ต',vi:'BXH TL'},
'nav.radio':           {ko:'방송국',en:'Radio',ja:'放送局',zh:'电台',th:'วิทยุ',vi:'Đài phát'},
'nav.creator':         {ko:'크리에이터 센터',en:'Creator',ja:'クリエイター',zh:'创作者',th:'ครีเอเตอร์',vi:'Tác giả'},
'nav.wallet':          {ko:'지갑 & 채굴',en:'Wallet & Mine',ja:'ウォレット',zh:'钱包',th:'กระเป๋า',vi:'Ví'},
'nav.logout':          {ko:'로그아웃',en:'Logout',ja:'ログアウト',zh:'退出',th:'ออกจากระบบ',vi:'Đăng xuất'},
'nav.login':           {ko:'로그인',en:'Login',ja:'ログイン',zh:'登录',th:'เข้าสู่ระบบ',vi:'Đăng nhập'},
'nav.signup':          {ko:'회원가입',en:'Sign Up',ja:'新規登録',zh:'注册',th:'สมัครสมาชิก',vi:'Đăng ký'},
'nav.advertiser':      {ko:'광고주 센터',en:'Advertiser',ja:'広告主',zh:'广告主',th:'ผู้ลงโฆษณา',vi:'Nhà quảng cáo'},
'nav.appdownload':     {ko:'앱 다운로드',en:'App Download',ja:'アプリDL',zh:'下载应用',th:'ดาวน์โหลดแอป',vi:'Tải ứng dụng'},
'nav.menu':            {ko:'메뉴',en:'Menu',ja:'メニュー',zh:'菜单',th:'เมนู',vi:'Menu'},

/* ── 공통 액션 ── */
'common.cancel':       {ko:'취소',en:'Cancel',ja:'キャンセル',zh:'取消',th:'ยกเลิก',vi:'Hủy'},
'common.confirm':      {ko:'확인',en:'Confirm',ja:'確認',zh:'确认',th:'ยืนยัน',vi:'Xác nhận'},
'common.delete':       {ko:'삭제',en:'Delete',ja:'削除',zh:'删除',th:'ลบ',vi:'Xóa'},
'common.close':        {ko:'닫기',en:'Close',ja:'閉じる',zh:'关闭',th:'ปิด',vi:'Đóng'},
'common.save':         {ko:'저장',en:'Save',ja:'保存',zh:'保存',th:'บันทึก',vi:'Lưu'},
'common.edit':         {ko:'수정',en:'Edit',ja:'編集',zh:'编辑',th:'แก้ไข',vi:'Sửa'},
'common.search':       {ko:'검색',en:'Search',ja:'検索',zh:'搜索',th:'ค้นหา',vi:'Tìm kiếm'},
'common.upload':       {ko:'업로드',en:'Upload',ja:'アップロード',zh:'上传',th:'อัปโหลด',vi:'Tải lên'},
'common.download':     {ko:'다운로드',en:'Download',ja:'ダウンロード',zh:'下载',th:'ดาวน์โหลด',vi:'Tải xuống'},
'common.play':         {ko:'재생',en:'Play',ja:'再生',zh:'播放',th:'เล่น',vi:'Phát'},
'common.pause':        {ko:'일시정지',en:'Pause',ja:'一時停止',zh:'暂停',th:'หยุด',vi:'Tạm dừng'},
'common.loading':      {ko:'로딩 중...',en:'Loading...',ja:'読み込み中...',zh:'加载中...',th:'กำลังโหลด...',vi:'Đang tải...'},
'common.error':        {ko:'오류가 발생했습니다',en:'An error occurred',ja:'エラーが発生しました',zh:'发生错误',th:'เกิดข้อผิดพลาด',vi:'Đã xảy ra lỗi'},
'common.retry':        {ko:'다시 시도',en:'Retry',ja:'再試行',zh:'重试',th:'ลองใหม่',vi:'Thử lại'},
'common.free':         {ko:'무료',en:'Free',ja:'無料',zh:'免费',th:'ฟรี',vi:'Miễn phí'},
'common.paid':         {ko:'유료',en:'Paid',ja:'有料',zh:'付费',th:'จ่ายเงิน',vi:'Trả phí'},
'common.charge':       {ko:'충전',en:'Charge',ja:'チャージ',zh:'充值',th:'เติมเงิน',vi:'Nạp tiền'},
'common.all':          {ko:'전체',en:'All',ja:'すべて',zh:'全部',th:'ทั้งหมด',vi:'Tất cả'},
'common.music':        {ko:'음악',en:'Music',ja:'音楽',zh:'音乐',th:'เพลง',vi:'Âm nhạc'},
'common.video':        {ko:'영상',en:'Video',ja:'動画',zh:'视频',th:'วิดีโอ',vi:'Video'},
'common.image':        {ko:'이미지',en:'Image',ja:'画像',zh:'图片',th:'รูปภาพ',vi:'Hình ảnh'},
'common.doc':          {ko:'문서',en:'Document',ja:'文書',zh:'文档',th:'เอกสาร',vi:'Tài liệu'},
'common.audio':        {ko:'오디오',en:'Audio',ja:'オーディオ',zh:'音频',th:'เสียง',vi:'Âm thanh'},
'common.file':         {ko:'파일',en:'File',ja:'ファイル',zh:'文件',th:'ไฟล์',vi:'File'},

/* ── 로그인 ── */
'login.title':         {ko:'다시 오셨군요',en:'Welcome back',ja:'おかえりなさい',zh:'欢迎回来',th:'ยินดีต้อนรับกลับ',vi:'Chào mừng trở lại'},
'login.sub':           {ko:'계속 Pulse를 쌓아보세요',en:'Keep building your Pulse',ja:'Pulseを積み重ねよう',zh:'继续积累Pulse',th:'สร้าง Pulse ต่อไป',vi:'Tiếp tục tích lũy Pulse'},
'login.email':         {ko:'이메일',en:'Email',ja:'メール',zh:'邮箱',th:'อีเมล',vi:'Email'},
'login.password':      {ko:'비밀번호',en:'Password',ja:'パスワード',zh:'密码',th:'รหัสผ่าน',vi:'Mật khẩu'},
'login.forgot':        {ko:'비밀번호를 잊으셨나요?',en:'Forgot password?',ja:'パスワードをお忘れですか？',zh:'忘记密码？',th:'ลืมรหัสผ่าน?',vi:'Quên mật khẩu?'},
'login.btn':           {ko:'로그인',en:'Log in',ja:'ログイン',zh:'登录',th:'เข้าสู่ระบบ',vi:'Đăng nhập'},
'login.or':            {ko:'또는',en:'or',ja:'または',zh:'或者',th:'หรือ',vi:'hoặc'},
'login.no.account':    {ko:'계정이 없으신가요?',en:'No account?',ja:'アカウントがない？',zh:'没有账号？',th:'ยังไม่มีบัญชี?',vi:'Chưa có tài khoản?'},
'login.signup.link':   {ko:'무료 가입',en:'Sign up free',ja:'無料登録',zh:'免费注册',th:'สมัครฟรี',vi:'Đăng ký miễn phí'},
'login.free.signup':   {ko:'무료 가입',en:'Sign up free',ja:'無料登録',zh:'免费注册',th:'สมัครฟรี',vi:'Đăng ký miễn phí'},

/* ── 회원가입 ── */


'signup.meta.title':{ko:'회원가입 — TimeLink',en:'Sign Up — TimeLink',ja:'新規登録 — TimeLink',zh:'注册 — TimeLink',th:'สมัครสมาชิก — TimeLink',vi:'Đăng ký — TimeLink'},
'signup.meta.description':{ko:'TimeLink 계정을 만들고 42,500 TL 보너스를 받으세요.',en:'Create a TimeLink account and receive a 42,500 TL welcome bonus.',ja:'TimeLinkアカウントを作成して42,500 TLのボーナスを受け取りましょう。',zh:'创建TimeLink账户，即可获得42,500 TL奖励。',th:'สร้างบัญชี TimeLink และรับโบนัสต้อนรับ 42,500 TL',vi:'Tạo tài khoản TimeLink và nhận thưởng chào mừng 42.500 TL.'},
'signup.consent.age.html':{ko:'<strong>[필수]</strong> 만 14세 이상이며 <a href="terms.html" target="_blank" onclick="event.stopPropagation()">이용약관</a>에 동의합니다.',en:'<strong>[Required]</strong> I confirm that I am at least 14 years old and agree to the <a href="terms.html" target="_blank" onclick="event.stopPropagation()">Terms of Service</a>.',ja:'<strong>[必須]</strong> 満14歳以上であり、<a href="terms.html" target="_blank" onclick="event.stopPropagation()">利用規約</a>に同意します。',zh:'<strong>[必填]</strong> 我确认已年满14周岁，并同意<a href="terms.html" target="_blank" onclick="event.stopPropagation()">服务条款</a>。',th:'<strong>[จำเป็น]</strong> ข้าพเจ้ามีอายุอย่างน้อย 14 ปี และยอมรับ<a href="terms.html" target="_blank" onclick="event.stopPropagation()">ข้อกำหนดการใช้บริการ</a>',vi:'<strong>[Bắt buộc]</strong> Tôi xác nhận mình từ đủ 14 tuổi và đồng ý với <a href="terms.html" target="_blank" onclick="event.stopPropagation()">Điều khoản dịch vụ</a>.'},
'signup.consent.privacy.html':{ko:'<strong>[필수]</strong> <a href="privacy.html" target="_blank" onclick="event.stopPropagation()">개인정보 처리방침</a>에 동의합니다.',en:'<strong>[Required]</strong> I agree to the <a href="privacy.html" target="_blank" onclick="event.stopPropagation()">Privacy Policy</a>.',ja:'<strong>[必須]</strong> <a href="privacy.html" target="_blank" onclick="event.stopPropagation()">プライバシーポリシー</a>に同意します。',zh:'<strong>[必填]</strong> 我同意<a href="privacy.html" target="_blank" onclick="event.stopPropagation()">隐私政策</a>。',th:'<strong>[จำเป็น]</strong> ข้าพเจ้ายอมรับ<a href="privacy.html" target="_blank" onclick="event.stopPropagation()">นโยบายความเป็นส่วนตัว</a>',vi:'<strong>[Bắt buộc]</strong> Tôi đồng ý với <a href="privacy.html" target="_blank" onclick="event.stopPropagation()">Chính sách quyền riêng tư</a>.'},
'signup.bonus.label':{ko:'가입 즉시 지급되는 TL',en:'TL credited when you join',ja:'登録時に付与されるTL',zh:'注册后立即发放的TL',th:'สมัครแล้วรับ TL ทันที',vi:'TL được cộng ngay khi đăng ký'},
'signup.bonus.base':{ko:'기본 TL',en:'Base TL',ja:'基本TL',zh:'基础TL',th:'TL พื้นฐาน',vi:'TL cơ bản'},
'signup.bonus.signup':{ko:'가입 보너스',en:'Sign-up bonus',ja:'登録ボーナス',zh:'注册奖励',th:'โบนัสสมัครสมาชิก',vi:'Thưởng đăng ký'},
'signup.bonus.email':{ko:'이메일 인증',en:'Email verification',ja:'メール認証',zh:'邮箱验证',th:'ยืนยันอีเมล',vi:'Xác minh email'},
'signup.feature.asset.title':{ko:'TL3 디지털 자산',en:'TL3 Digital Assets',ja:'TL3デジタル資産',zh:'TL3数字资产',th:'สินทรัพย์ดิจิทัล TL3',vi:'Tài sản số TL3'},
'signup.feature.asset.desc':{ko:'권리 확인을 거친 자산을 TL로 공유',en:'Share rights-verified assets using TL',ja:'権利確認済みの資産をTLで共有',zh:'通过TL共享已完成权利确认的资产',th:'แชร์สินทรัพย์ที่ผ่านการตรวจสอบสิทธิ์ด้วย TL',vi:'Chia sẻ tài sản đã xác minh quyền bằng TL'},
'signup.feature.share.title':{ko:'TL3 유료 공유',en:'Paid TL3 Sharing',ja:'TL3有料共有',zh:'TL3付费共享',th:'การแชร์ TL3 แบบชำระ TL',vi:'Chia sẻ TL3 có trả phí'},
'signup.feature.share.desc':{ko:'크리에이터가 직접 가격 결정',en:'Creators set their own terms',ja:'クリエイターが価格を設定',zh:'创作者自行设定价格',th:'ครีเอเตอร์กำหนดราคาเอง',vi:'Nhà sáng tạo tự quyết định mức giá'},
'signup.feature.poc.title':{ko:'POC 기여 보상',en:'POC Contribution Rewards',ja:'POC貢献報酬',zh:'POC贡献奖励',th:'รางวัลจากการมีส่วนร่วม POC',vi:'Phần thưởng đóng góp POC'},
'signup.feature.poc.desc':{ko:'기여할수록 TLC 보상',en:'Earn TLC rewards through contribution',ja:'貢献に応じてTLC報酬',zh:'贡献越多，TLC奖励越多',th:'ยิ่งมีส่วนร่วม ยิ่งได้รับ TLC',vi:'Đóng góp càng nhiều, nhận thưởng TLC càng cao'},
'signup.form.title':{ko:'계정 만들기',en:'Create your account',ja:'アカウントを作成',zh:'创建账户',th:'สร้างบัญชีของคุณ',vi:'Tạo tài khoản'},
'signup.form.sub':{ko:'몇 초면 TimeLink를 시작할 수 있어요.',en:'It only takes a few seconds to get started with TimeLink.',ja:'数秒でTimeLinkを始められます。',zh:'只需几秒钟即可开始使用TimeLink。',th:'เริ่มใช้ TimeLink ได้ในไม่กี่วินาที',vi:'Chỉ mất vài giây để bắt đầu với TimeLink.'},
'signup.bonus.bar':{ko:'가입 보너스',en:'Sign-up bonus',ja:'登録ボーナス',zh:'注册奖励',th:'โบนัสสมัครสมาชิก',vi:'Thưởng đăng ký'},
'signup.field.email':{ko:'이메일',en:'Email',ja:'メールアドレス',zh:'电子邮箱',th:'อีเมล',vi:'Email'},
'signup.field.password':{ko:'비밀번호',en:'Password',ja:'パスワード',zh:'密码',th:'รหัสผ่าน',vi:'Mật khẩu'},
'signup.field.password.confirm':{ko:'비밀번호 확인',en:'Confirm password',ja:'パスワードの確認',zh:'确认密码',th:'ยืนยันรหัสผ่าน',vi:'Xác nhận mật khẩu'},
'signup.field.nickname':{ko:'닉네임',en:'Username',ja:'ニックネーム',zh:'用户名',th:'ชื่อผู้ใช้',vi:'Tên người dùng'},
'signup.placeholder.password':{ko:'8자 이상',en:'At least 8 characters',ja:'8文字以上',zh:'至少8个字符',th:'อย่างน้อย 8 ตัวอักษร',vi:'Ít nhất 8 ký tự'},
'signup.placeholder.password.confirm':{ko:'다시 입력',en:'Enter again',ja:'もう一度入力',zh:'再次输入',th:'กรอกอีกครั้ง',vi:'Nhập lại'},
'signup.placeholder.nickname':{ko:'2~20자',en:'2–20 characters',ja:'2～20文字',zh:'2–20个字符',th:'2–20 ตัวอักษร',vi:'2–20 ký tự'},
'signup.required':{ko:'[필수]',en:'[Required]',ja:'[必須]',zh:'[必填]',th:'[จำเป็น]',vi:'[Bắt buộc]'},
'signup.optional':{ko:'[선택]',en:'[Optional]',ja:'[任意]',zh:'[选填]',th:'[ไม่บังคับ]',vi:'[Tùy chọn]'},
'signup.consent.age':{ko:'만 14세 이상이며',en:'I confirm that I am at least 14 years old and agree to the',ja:'満14歳以上であることを確認し、',zh:'本人已年满14周岁，并同意',th:'ข้าพเจ้ามีอายุอย่างน้อย 14 ปี และยอมรับ',vi:'Tôi xác nhận mình từ đủ 14 tuổi và đồng ý với'},
'signup.terms':{ko:'이용약관',en:'Terms of Service',ja:'利用規約',zh:'服务条款',th:'ข้อกำหนดการใช้บริการ',vi:'Điều khoản dịch vụ'},
'signup.privacy':{ko:'개인정보 처리방침',en:'Privacy Policy',ja:'プライバシーポリシー',zh:'隐私政策',th:'นโยบายความเป็นส่วนตัว',vi:'Chính sách quyền riêng tư'},
'signup.consent.agree':{ko:'에 동의합니다.',en:'',ja:'に同意します。',zh:'。',th:'',vi:'.'},
'signup.consent.marketing':{ko:'마케팅 정보 수신에 동의합니다.',en:'I agree to receive marketing communications.',ja:'マーケティング情報の受信に同意します。',zh:'我同意接收营销信息。',th:'ฉันยินยอมรับข้อมูลการตลาด',vi:'Tôi đồng ý nhận thông tin tiếp thị.'},
'signup.button.start':{ko:'가입하고 시작하기',en:'Create account and continue',ja:'登録して始める',zh:'注册并开始',th:'สมัครและเริ่มต้น',vi:'Đăng ký và bắt đầu'},
'signup.have.account':{ko:'이미 계정이 있으신가요?',en:'Already have an account?',ja:'すでにアカウントをお持ちですか？',zh:'已经有账户了吗？',th:'มีบัญชีอยู่แล้วใช่ไหม?',vi:'Bạn đã có tài khoản?'},
'signup.go.login':{ko:'로그인',en:'Log in',ja:'ログイン',zh:'登录',th:'เข้าสู่ระบบ',vi:'Đăng nhập'},
'signup.verify.title':{ko:'이메일 인증',en:'Email verification',ja:'メール認証',zh:'邮箱验证',th:'ยืนยันอีเมล',vi:'Xác minh email'},
'signup.verify.sent':{ko:'로 인증 코드를 보냈습니다.',en:' — we sent a verification code to this address.',ja:'宛てに認証コードを送信しました。',zh:'已向该邮箱发送验证码。',th:' — เราส่งรหัสยืนยันไปยังอีเมลนี้แล้ว',vi:' — chúng tôi đã gửi mã xác minh đến địa chỉ này.'},
'signup.verify.instruction':{ko:'이메일에서 6자리 코드를 입력해주세요.',en:'Enter the 6-digit code from your email.',ja:'メールに届いた6桁のコードを入力してください。',zh:'请输入邮件中的6位验证码。',th:'กรอกรหัส 6 หลักจากอีเมลของคุณ',vi:'Nhập mã gồm 6 chữ số trong email của bạn.'},
'signup.verify.code.placeholder':{ko:'000000',en:'000000',ja:'000000',zh:'000000',th:'000000',vi:'000000'},
'signup.verify.complete':{ko:'인증 완료',en:'Verify email',ja:'認証する',zh:'验证邮箱',th:'ยืนยันอีเมล',vi:'Xác minh email'},
'signup.verify.resend':{ko:'코드 재발송',en:'Resend code',ja:'コードを再送信',zh:'重新发送验证码',th:'ส่งรหัสอีกครั้ง',vi:'Gửi lại mã'},
'signup.toast.code.sent':{ko:'인증 코드를 이메일로 보냈습니다.',en:'A verification code has been sent to your email.',ja:'認証コードをメールで送信しました。',zh:'验证码已发送至您的邮箱。',th:'ส่งรหัสยืนยันไปยังอีเมลแล้ว',vi:'Mã xác minh đã được gửi đến email của bạn.'},
'signup.toast.complete':{ko:'가입 완료! 시작합니다.',en:'Sign-up complete! Getting started.',ja:'登録完了！開始します。',zh:'注册成功！即将开始。',th:'สมัครสำเร็จ! กำลังเริ่มต้น',vi:'Đăng ký hoàn tất! Đang bắt đầu.'},
'signup.toast.login':{ko:'가입 완료! 로그인해주세요.',en:'Sign-up complete! Please log in.',ja:'登録完了！ログインしてください。',zh:'注册成功！请登录。',th:'สมัครสำเร็จ! กรุณาเข้าสู่ระบบ',vi:'Đăng ký hoàn tất! Vui lòng đăng nhập.'},
'signup.toast.code.resent':{ko:'인증 코드를 재발송했습니다.',en:'A new verification code has been sent.',ja:'認証コードを再送信しました。',zh:'验证码已重新发送。',th:'ส่งรหัสยืนยันอีกครั้งแล้ว',vi:'Đã gửi lại mã xác minh.'},
'signup.error.email':{ko:'올바른 이메일을 입력해주세요.',en:'Please enter a valid email address.',ja:'有効なメールアドレスを入力してください。',zh:'请输入有效的电子邮箱地址。',th:'กรุณากรอกอีเมลที่ถูกต้อง',vi:'Vui lòng nhập địa chỉ email hợp lệ.'},
'signup.error.password.length':{ko:'비밀번호는 8자 이상이어야 합니다.',en:'Password must be at least 8 characters.',ja:'パスワードは8文字以上にしてください。',zh:'密码至少需要8个字符。',th:'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร',vi:'Mật khẩu phải có ít nhất 8 ký tự.'},
'signup.error.password.match':{ko:'비밀번호가 일치하지 않습니다.',en:'Passwords do not match.',ja:'パスワードが一致しません。',zh:'两次输入的密码不一致。',th:'รหัสผ่านไม่ตรงกัน',vi:'Mật khẩu không khớp.'},
'signup.error.nickname':{ko:'닉네임은 2자 이상이어야 합니다.',en:'Username must be at least 2 characters.',ja:'ニックネームは2文字以上にしてください。',zh:'用户名至少需要2个字符。',th:'ชื่อผู้ใช้ต้องมีอย่างน้อย 2 ตัวอักษร',vi:'Tên người dùng phải có ít nhất 2 ký tự.'},
'signup.error.consent':{ko:'필수 약관에 동의해주세요.',en:'Please accept the required terms.',ja:'必須規約に同意してください。',zh:'请同意必填条款。',th:'กรุณายอมรับข้อกำหนดที่จำเป็น',vi:'Vui lòng đồng ý với các điều khoản bắt buộc.'},
'signup.error.code.six':{ko:'6자리 인증 코드를 입력해주세요.',en:'Please enter the 6-digit verification code.',ja:'6桁の認証コードを入力してください。',zh:'请输入6位验证码。',th:'กรุณากรอกรหัสยืนยัน 6 หลัก',vi:'Vui lòng nhập mã xác minh gồm 6 chữ số.'},
'signup.error.failed':{ko:'가입 실패',en:'Sign-up failed',ja:'登録に失敗しました',zh:'注册失败',th:'สมัครไม่สำเร็จ',vi:'Đăng ký thất bại'},
'signup.error.verify.failed':{ko:'인증 실패',en:'Verification failed',ja:'認証に失敗しました',zh:'验证失败',th:'ยืนยันไม่สำเร็จ',vi:'Xác minh thất bại'},
'signup.error.retry':{ko:'가입 실패. 잠시 후 다시 시도해주세요.',en:'Sign-up failed. Please try again shortly.',ja:'登録に失敗しました。しばらくしてから再試行してください。',zh:'注册失败，请稍后重试。',th:'สมัครไม่สำเร็จ กรุณาลองอีกครั้งในภายหลัง',vi:'Đăng ký thất bại. Vui lòng thử lại sau.'},
'signup.error.code.invalid':{ko:'인증 실패. 코드를 확인해주세요.',en:'Verification failed. Please check the code.',ja:'認証に失敗しました。コードを確認してください。',zh:'验证失败，请检查验证码。',th:'ยืนยันไม่สำเร็จ กรุณาตรวจสอบรหัส',vi:'Xác minh thất bại. Vui lòng kiểm tra mã.'},
'signup.error.resend':{ko:'재발송 실패.',en:'Could not resend the code.',ja:'コードを再送信できませんでした。',zh:'验证码重新发送失败。',th:'ส่งรหัสอีกครั้งไม่สำเร็จ',vi:'Không thể gửi lại mã.'},
'signup.title':        {ko:'TimeLink 시작하기',en:'Get started',ja:'TimeLink を始める',zh:'开始使用',th:'เริ่มต้น',vi:'Bắt đầu'},
'signup.sub':          {ko:'이메일로 가입하고 TL을 받으세요',en:'Sign up and get TL',ja:'登録してTLをもらおう',zh:'注册并获得TL',th:'สมัครและรับ TL',vi:'Đăng ký và nhận TL'},
'signup.email':        {ko:'이메일 주소',en:'Email address',ja:'メールアドレス',zh:'邮箱地址',th:'ที่อยู่อีเมล',vi:'Địa chỉ email'},
'signup.username':     {ko:'닉네임',en:'Username',ja:'ニックネーム',zh:'昵称',th:'ชื่อผู้ใช้',vi:'Tên người dùng'},
'signup.password':     {ko:'비밀번호',en:'Password',ja:'パスワード',zh:'密码',th:'รหัสผ่าน',vi:'Mật khẩu'},
'signup.send':         {ko:'인증 발송',en:'Send code',ja:'認証送信',zh:'发送验证码',th:'ส่งรหัส',vi:'Gửi mã'},
'signup.verify':       {ko:'확인',en:'Verify',ja:'確認',zh:'验证',th:'ยืนยัน',vi:'Xác nhận'},
'signup.next':         {ko:'다음',en:'Next',ja:'次へ',zh:'下一步',th:'ถัดไป',vi:'Tiếp theo'},
'signup.submit':       {ko:'가입 완료',en:'Complete',ja:'登録完了',zh:'完成注册',th:'สมัครเสร็จสิ้น',vi:'Hoàn tất đăng ký'},
'signup.have.account': {ko:'이미 계정이 있으신가요?',en:'Already have an account?',ja:'既にアカウントがある？',zh:'已有账号？',th:'มีบัญชีอยู่แล้ว?',vi:'Đã có tài khoản?'},
'signup.go.login':     {ko:'로그인',en:'Log in',ja:'ログイン',zh:'登录',th:'เข้าสู่ระบบ',vi:'Đăng nhập'},

/* ── SharePlace ── */
'sp.search':           {ko:'제목, 아티스트, 태그 검색...',en:'Search title, artist, tag...',ja:'検索...',zh:'搜索...',th:'ค้นหา...',vi:'Tìm kiếm...'},
'sp.filter.all':       {ko:'전체',en:'All',ja:'すべて',zh:'全部',th:'ทั้งหมด',vi:'Tất cả'},
'sp.filter.music':     {ko:'음악',en:'Music',ja:'音楽',zh:'音乐',th:'เพลง',vi:'Âm nhạc'},
'sp.filter.video':     {ko:'영상',en:'Video',ja:'動画',zh:'视频',th:'วิดีโอ',vi:'Video'},
'sp.filter.image':     {ko:'이미지',en:'Image',ja:'画像',zh:'图片',th:'รูปภาพ',vi:'Hình ảnh'},
'sp.filter.doc':       {ko:'문서',en:'Docs',ja:'文書',zh:'文档',th:'เอกสาร',vi:'Tài liệu'},
'sp.sort.new':         {ko:'최신순',en:'Latest',ja:'最新順',zh:'最新',th:'ล่าสุด',vi:'Mới nhất'},
'sp.sort.pulse':       {ko:'인기순',en:'Popular',ja:'人気順',zh:'热门',th:'ยอดนิยม',vi:'Phổ biến'},
'sp.sort.tl':          {ko:'TL충전순',en:'TL Top',ja:'TL順',zh:'TL排行',th:'TL สูงสุด',vi:'TL Top'},
'sp.grid':             {ko:'그리드',en:'Grid',ja:'グリッド',zh:'网格',th:'กริด',vi:'Lưới'},
'sp.list':             {ko:'목록',en:'List',ja:'リスト',zh:'列表',th:'รายการ',vi:'Danh sách'},
'sp.btn.preview':      {ko:'미리듣기',en:'Preview',ja:'試聴',zh:'试听',th:'ตัวอย่าง',vi:'Xem trước'},
'sp.btn.no.preview':   {ko:'미리듣기 없음',en:'No preview',ja:'試聴なし',zh:'无试听',th:'ไม่มีตัวอย่าง',vi:'Không có'},
'sp.btn.charge':       {ko:'TL 충전',en:'Charge TL',ja:'TLチャージ',zh:'充值TL',th:'เติม TL',vi:'Nạp TL'},
'sp.btn.play':         {ko:'재생',en:'Play',ja:'再生',zh:'播放',th:'เล่น',vi:'Phát'},
'sp.btn.no.file':      {ko:'파일 없음',en:'No file',ja:'ファイルなし',zh:'无文件',th:'ไม่มีไฟล์',vi:'Không có file'},
'sp.uncharged':        {ko:'미충전',en:'Uncharged',ja:'未チャージ',zh:'未充值',th:'ยังไม่เติม',vi:'Chưa nạp'},
'sp.no.files':         {ko:'공유된 파일이 없습니다',en:'No files shared yet',ja:'ファイルがありません',zh:'暂无文件',th:'ยังไม่มีไฟล์',vi:'Chưa có file'},
'sp.playing':          {ko:'재생 중',en:'Now playing',ja:'再生中',zh:'正在播放',th:'กำลังเล่น',vi:'Đang phát'},
'sp.charge.title':     {ko:'TL 충전',en:'Charge TL',ja:'TLチャージ',zh:'充值TL',th:'เติม TL',vi:'Nạp TL'},
'sp.tl.balance':       {ko:'TL 잔액',en:'TL Balance',ja:'TL残高',zh:'TL余额',th:'ยอด TL',vi:'Số dư TL'},
'sp.my.tl':            {ko:'내 TL',en:'My TL',ja:'マイTL',zh:'我的TL',th:'TL ของฉัน',vi:'TL của tôi'},
'sp.charge.input':     {ko:'충전할 TL 수량',en:'TL amount to charge',ja:'チャージするTL',zh:'充值TL数量',th:'จำนวน TL ที่เติม',vi:'Số TL cần nạp'},
'sp.charge.btn':       {ko:'충전하기',en:'Charge',ja:'チャージする',zh:'充值',th:'เติมเงิน',vi:'Nạp tiền'},

/* ── 크리에이터 ── */
'cr.title':            {ko:'크리에이터 센터',en:'Creator Center',ja:'クリエイターセンター',zh:'创作者中心',th:'ศูนย์ครีเอเตอร์',vi:'Trung tâm tác giả'},
'cr.tab.upload':       {ko:'업로드',en:'Upload',ja:'アップロード',zh:'上传',th:'อัปโหลด',vi:'Tải lên'},
'cr.tab.myfiles':      {ko:'내 파일',en:'My Files',ja:'マイファイル',zh:'我的文件',th:'ไฟล์ของฉัน',vi:'File của tôi'},
'cr.type.audio':       {ko:'오디오',en:'Audio',ja:'オーディオ',zh:'音频',th:'เสียง',vi:'Âm thanh'},
'cr.type.video':       {ko:'영상',en:'Video',ja:'動画',zh:'视频',th:'วิดีโอ',vi:'Video'},
'cr.type.image':       {ko:'이미지',en:'Image',ja:'画像',zh:'图片',th:'รูปภาพ',vi:'Hình ảnh'},
'cr.type.doc':         {ko:'문서',en:'Document',ja:'文書',zh:'文档',th:'เอกสาร',vi:'Tài liệu'},
'cr.drop.audio':       {ko:'오디오 파일을 여기에 드롭',en:'Drop audio file here',ja:'オーディオをドロップ',zh:'拖放音频文件',th:'วางไฟล์เสียงที่นี่',vi:'Thả file âm thanh'},
'cr.drop.video':       {ko:'영상 파일을 여기에 드롭',en:'Drop video file here',ja:'動画をドロップ',zh:'拖放视频文件',th:'วางไฟล์วิดีโอที่นี่',vi:'Thả file video'},
'cr.drop.image':       {ko:'이미지 파일을 여기에 드롭',en:'Drop image file here',ja:'画像をドロップ',zh:'拖放图片文件',th:'วางไฟล์รูปภาพ',vi:'Thả file hình ảnh'},
'cr.drop.doc':         {ko:'문서 파일을 여기에 드롭',en:'Drop document here',ja:'文書をドロップ',zh:'拖放文档文件',th:'วางไฟล์เอกสาร',vi:'Thả file tài liệu'},
'cr.drop.select':      {ko:'파일 선택',en:'Select file',ja:'ファイルを選択',zh:'选择文件',th:'เลือกไฟล์',vi:'Chọn file'},
'cr.title.label':      {ko:'제목',en:'Title',ja:'タイトル',zh:'标题',th:'ชื่อ',vi:'Tiêu đề'},
'cr.artist':           {ko:'아티스트',en:'Artist',ja:'アーティスト',zh:'艺术家',th:'ศิลปิน',vi:'Nghệ sĩ'},
'cr.album':            {ko:'앨범',en:'Album',ja:'アルバム',zh:'专辑',th:'อัลบั้ม',vi:'Album'},
'cr.genre':            {ko:'장르',en:'Genre',ja:'ジャンル',zh:'流派',th:'แนวเพลง',vi:'Thể loại'},
'cr.desc':             {ko:'설명',en:'Description',ja:'説明',zh:'描述',th:'คำอธิบาย',vi:'Mô tả'},
'cr.tl.info':          {ko:'③ TL 정보',en:'③ TL Info',ja:'③ TL情報',zh:'③ TL信息',th:'③ ข้อมูล TL',vi:'③ Thông tin TL'},
'cr.plan.section':     {ko:'④ 수익 배분 플랜',en:'④ Revenue Plan',ja:'④ 収益プラン',zh:'④ 收益方案',th:'④ แผนรายได้',vi:'④ Kế hoạch thu nhập'},
'cr.plan.a.split':     {ko:'크리에이터 70% · 플랫폼 30%',en:'Creator 70% · Platform 30%',ja:'クリエイター70%・プラットフォーム30%',zh:'创作者70%·平台30%',th:'ครีเอเตอร์ 70%·แพลตฟอร์ม 30%',vi:'Tác giả 70%·Nền tảng 30%'},
'cr.plan.b.split':     {ko:'크리에이터 50% + TLC 채굴',en:'Creator 50% + TLC mining',ja:'クリエイター50%+TLC採掘',zh:'创作者50%+TLC挖矿',th:'ครีเอเตอร์ 50%+TLC mining',vi:'Tác giả 50%+khai thác TLC'},
'cr.upload.btn':       {ko:'📤 업로드 및 공유 등록',en:'📤 Upload & Share',ja:'📤 アップロード',zh:'📤 上传并分享',th:'📤 อัปโหลดและแชร์',vi:'📤 Tải lên & Chia sẻ'},
'cr.no.files':         {ko:'업로드한 파일이 없습니다',en:'No uploaded files',ja:'アップロードなし',zh:'没有上传的文件',th:'ไม่มีไฟล์อัปโหลด',vi:'Chưa có file'},
'cr.delete':           {ko:'삭제',en:'Delete',ja:'削除',zh:'删除',th:'ลบ',vi:'Xóa'},
'cr.share.view':       {ko:'SharePlace에서 보기',en:'View in SharePlace',ja:'SharePlaceで見る',zh:'在SharePlace查看',th:'ดูใน SharePlace',vi:'Xem trong SharePlace'},

/* ── 차트 ── */
'chart.tab.music':     {ko:'음악',en:'Music',ja:'音楽',zh:'音乐',th:'เพลง',vi:'Âm nhạc'},
'chart.tab.video':     {ko:'영상',en:'Video',ja:'動画',zh:'视频',th:'วิดีโอ',vi:'Video'},
'chart.tab.doc':       {ko:'문서·강의',en:'Docs',ja:'文書',zh:'文档',th:'เอกสาร',vi:'Tài liệu'},
'chart.tab.image':     {ko:'이미지·아트',en:'Art',ja:'アート',zh:'图片',th:'ภาพ',vi:'Nghệ thuật'},
'chart.tab.top':       {ko:'⚡ TL TOP',en:'⚡ TL Top',ja:'⚡ TLトップ',zh:'⚡ TL排行',th:'⚡ TL สูงสุด',vi:'⚡ TL Top'},
'chart.rank':          {ko:'위',en:'#',ja:'位',zh:'名',th:'อันดับ',vi:'#'},
'chart.pulse':         {ko:'Pulse',en:'Pulse',ja:'パルス',zh:'Pulse',th:'Pulse',vi:'Pulse'},
'chart.plays':         {ko:'재생',en:'Plays',ja:'再生',zh:'播放',th:'การเล่น',vi:'Lượt phát'},
'chart.no.data':       {ko:'데이터 없음',en:'No data',ja:'データなし',zh:'暂无数据',th:'ไม่มีข้อมูล',vi:'Không có dữ liệu'},

/* ── 라디오 ── */
'radio.cafe':          {ko:'카페방송',en:'Cafe Radio',ja:'カフェ放送',zh:'咖啡广播',th:'วิทยุคาเฟ่',vi:'Radio quán cà phê'},
'radio.incar':         {ko:'인카방송',en:'In-Car Radio',ja:'車内放送',zh:'车载广播',th:'วิทยุในรถ',vi:'Radio trong xe'},
'radio.playing':       {ko:'재생 중',en:'Now playing',ja:'再生中',zh:'正在播放',th:'กำลังเล่น',vi:'Đang phát'},
'radio.listener':      {ko:'청취자',en:'Listeners',ja:'リスナー',zh:'听众',th:'ผู้ฟัง',vi:'Người nghe'},
'radio.no.channel':    {ko:'채널 없음',en:'No channel',ja:'チャンネルなし',zh:'无频道',th:'ไม่มีช่อง',vi:'Không có kênh'},
'radio.create.channel':{ko:'채널 개설',en:'Create channel',ja:'チャンネル開設',zh:'创建频道',th:'สร้างช่อง',vi:'Tạo kênh'},
'radio.cafe.desc':     {ko:'카페 BGM 방송',en:'Cafe BGM Radio',ja:'カフェBGM',zh:'咖啡BGM',th:'BGM คาเฟ่',vi:'BGM quán cà phê'},
'radio.incar.desc':    {ko:'드라이브 음악 방송',en:'Drive Music Radio',ja:'ドライブ音楽',zh:'驾车音乐',th:'เพลงขับรถ',vi:'Nhạc lái xe'},

/* ── 카페 ── */
'cafe.live':           {ko:'라이브',en:'Live',ja:'ライブ',zh:'直播',th:'สด',vi:'Trực tiếp'},
'cafe.playlist':       {ko:'플레이리스트',en:'Playlist',ja:'プレイリスト',zh:'播放列表',th:'เพลย์ลิสต์',vi:'Danh sách phát'},
'cafe.channel.name':   {ko:'채널명',en:'Channel name',ja:'チャンネル名',zh:'频道名称',th:'ชื่อช่อง',vi:'Tên kênh'},
'cafe.on.air':         {ko:'ON AIR',en:'ON AIR',ja:'ON AIR',zh:'正在直播',th:'ออกอากาศ',vi:'Đang phát sóng'},
'cafe.off.air':        {ko:'방송 종료',en:'Off Air',ja:'放送終了',zh:'已结束',th:'หยุดออกอากาศ',vi:'Kết thúc phát sóng'},
'cafe.listeners':      {ko:'청취자',en:'Listeners',ja:'リスナー',zh:'听众',th:'ผู้ฟัง',vi:'Người nghe'},

/* ── 인카 ── */
'incar.start':         {ko:'방송 시작',en:'Start Broadcast',ja:'放送開始',zh:'开始直播',th:'เริ่มออกอากาศ',vi:'Bắt đầu phát sóng'},
'incar.stop':          {ko:'방송 종료',en:'Stop Broadcast',ja:'放送終了',zh:'结束直播',th:'หยุดออกอากาศ',vi:'Kết thúc'},
'incar.driving':       {ko:'주행 중',en:'Driving',ja:'走行中',zh:'行驶中',th:'กำลังขับ',vi:'Đang lái xe'},
'incar.plate':         {ko:'차량번호',en:'Plate No.',ja:'ナンバープレート',zh:'车牌号',th:'ทะเบียนรถ',vi:'Biển số xe'},
'incar.region':        {ko:'주행 지역',en:'Drive region',ja:'走行エリア',zh:'行驶区域',th:'พื้นที่ขับรถ',vi:'Khu vực lái'},

/* ── 대시보드 ── */
'dash.wallet':         {ko:'지갑',en:'Wallet',ja:'ウォレット',zh:'钱包',th:'กระเป๋า',vi:'Ví'},
'dash.mining':         {ko:'TLC 채굴',en:'TLC Mining',ja:'TLC採掘',zh:'TLC挖矿',th:'ขุด TLC',vi:'Khai thác TLC'},
'dash.content':        {ko:'내 콘텐츠',en:'My Content',ja:'マイコンテンツ',zh:'我的内容',th:'เนื้อหาของฉัน',vi:'Nội dung của tôi'},
'dash.mission':        {ko:'미션',en:'Missions',ja:'ミッション',zh:'任务',th:'ภารกิจ',vi:'Nhiệm vụ'},
'dash.cafe.link':      {ko:'카페 채널',en:'Cafe Channel',ja:'カフェチャンネル',zh:'咖啡频道',th:'ช่องคาเฟ่',vi:'Kênh quán cà phê'},
'dash.tl.total':       {ko:'TL 총 잔액',en:'Total TL Balance',ja:'TL合計残高',zh:'TL总余额',th:'ยอด TL รวม',vi:'Tổng số dư TL'},
'dash.tl.purchase':    {ko:'구매 TL',en:'Purchase TL',ja:'購入TL',zh:'购买TL',th:'TL ซื้อ',vi:'TL mua'},
'dash.tl.ad':          {ko:'광고 TL',en:'Ad TL',ja:'広告TL',zh:'广告TL',th:'TL โฆษณา',vi:'TL quảng cáo'},
'dash.tl.bonus':       {ko:'보너스 TL',en:'Bonus TL',ja:'ボーナスTL',zh:'奖励TL',th:'TL โบนัส',vi:'TL thưởng'},
'dash.poc':            {ko:'POC 기여지수',en:'POC Index',ja:'POC指数',zh:'POC指数',th:'ดัชนี POC',vi:'Chỉ số POC'},
'dash.tlc.held':       {ko:'보유 TLC',en:'TLC Held',ja:'保有TLC',zh:'持有TLC',th:'TLC ที่มี',vi:'TLC đang giữ'},
'dash.exchange':       {ko:'현금 교환 신청',en:'Cash Exchange',ja:'現金交換',zh:'现金兑换',th:'แลกเงินสด',vi:'Đổi tiền mặt'},
'dash.mining.today':   {ko:'오늘 채굴량',en:'Today mined',ja:'今日の採掘量',zh:'今日挖矿',th:'ขุดวันนี้',vi:'Khai thác hôm nay'},
'dash.mission.daily':  {ko:'일일 미션',en:'Daily missions',ja:'デイリーミッション',zh:'每日任务',th:'ภารกิจรายวัน',vi:'Nhiệm vụ hàng ngày'},
'dash.mission.done':   {ko:'완료',en:'Done',ja:'完了',zh:'完成',th:'เสร็จแล้ว',vi:'Hoàn thành'},

/* ── 광고 ── */
'ad.reward':           {ko:'리워드 광고',en:'Reward Ad',ja:'リワード広告',zh:'激励广告',th:'โฆษณาแบบรีวอร์ด',vi:'Quảng cáo thưởng'},
'ad.banner':           {ko:'배너 광고',en:'Banner Ad',ja:'バナー広告',zh:'横幅广告',th:'โฆษณาแบนเนอร์',vi:'Quảng cáo banner'},
'ad.watch':            {ko:'광고 시청',en:'Watch Ad',ja:'広告視聴',zh:'观看广告',th:'ดูโฆษณา',vi:'Xem quảng cáo'},
'ad.skip':             {ko:'건너뛰기',en:'Skip',ja:'スキップ',zh:'跳过',th:'ข้าม',vi:'Bỏ qua'},
'ad.earn':             {ko:'적립 완료',en:'Earned',ja:'獲得完了',zh:'已获得',th:'ได้รับแล้ว',vi:'Đã nhận'},

/* ── 오류 메시지 ── */
'msg.login.required':  {ko:'로그인이 필요합니다',en:'Login required',ja:'ログインが必要です',zh:'需要登录',th:'กรุณาเข้าสู่ระบบ',vi:'Vui lòng đăng nhập'},
'msg.tl.low':          {ko:'TL이 부족합니다. 현재: ',en:'Insufficient TL. Balance: ',ja:'TL不足。残高: ',zh:'TL不足。余额: ',th:'TL ไม่พอ ยอด: ',vi:'TL không đủ. Số dư: '},
'msg.no.file':         {ko:'파일이 없습니다',en:'File not found',ja:'ファイルなし',zh:'文件不存在',th:'ไม่พบไฟล์',vi:'Không tìm thấy file'},
'msg.play.fail':       {ko:'재생 실패: ',en:'Playback failed: ',ja:'再生失敗: ',zh:'播放失败: ',zh:'播放失败: ',th:'เล่นล้มเหลว: ',vi:'Phát thất bại: '},
'msg.upload.success':  {ko:'업로드 완료!',en:'Upload complete!',ja:'アップロード完了！',zh:'上传完成！',th:'อัปโหลดสำเร็จ!',vi:'Tải lên thành công!'},
'msg.upload.fail':     {ko:'업로드 실패',en:'Upload failed',ja:'アップロード失敗',zh:'上传失败',th:'อัปโหลดล้มเหลว',vi:'Tải lên thất bại'},
'msg.delete.confirm':  {ko:'을 삭제하시겠습니까?',en:'Delete this file?',ja:'削除しますか？',zh:'确认删除？',th:'ต้องการลบ?',vi:'Xóa file này?'},
'msg.invalid.num':     {ko:'올바른 숫자를 입력하세요',en:'Enter a valid number',ja:'正しい数値を入力してください',zh:'请输入有效数字',th:'กรุณากรอกตัวเลขที่ถูกต้อง',vi:'Nhập số hợp lệ'},
'msg.autoplay.block':  {ko:'재생 버튼을 클릭하세요',en:'Click play button',ja:'再生ボタンをクリック',zh:'请点击播放按钮',th:'คลิกปุ่มเล่น',vi:'Nhấn nút phát'},
'msg.file.load.fail':  {ko:'파일 로드 실패',en:'File load failed',ja:'ファイル読み込み失敗',zh:'文件加载失败',th:'โหลดไฟล์ล้มเหลว',vi:'Tải file thất bại'},
'msg.tl.empty':        {ko:'TL이 소진됐습니다. 충전이 필요합니다.',en:'TL depleted. Please charge.',ja:'TLが切れました。チャージしてください。',zh:'TL已耗尽，请充值。',th:'TL หมดแล้ว กรุณาเติม',vi:'TL đã hết. Vui lòng nạp.'},
'toast.tl.empty.total':{ko:'TL이 소진됐습니다. 충전이 필요합니다.',en:'TL depleted. Please charge.',ja:'TL切れ。チャージを。',zh:'TL耗尽。',th:'TL หมด',vi:'Hết TL.'},
'toast.cr.upload.success':{ko:'업로드 완료!',en:'Uploaded!',ja:'完了！',zh:'已上传！',th:'อัปโหลดแล้ว!',vi:'Đã tải lên!'},
'toast.cr.upload.fail':{ko:'업로드 실패',en:'Upload failed',ja:'失敗',zh:'失败',th:'ล้มเหลว',vi:'Thất bại'},
'toast.cr.delete.confirm':{ko:'을 삭제하시겠습니까?',en:'Delete?',ja:'削除？',zh:'删除？',th:'ลบ?',vi:'Xóa?'},
'global.search.placeholder':{ko:'파일명, 아티스트, 태그 검색...',en:'Search assets, artists, or tags...',ja:'ファイル名・アーティスト・タグを検索...',zh:'搜索文件名、艺人或标签...',th:'ค้นหาชื่อไฟล์ ศิลปิน หรือแท็ก...',vi:'Tìm tên tệp, nghệ sĩ hoặc thẻ...'},
'global.upload':{ko:'📤 내 파일 업로드',en:'📤 Upload asset',ja:'📤 デジタル資産を共有',zh:'📤 分享数字资产',th:'📤 แชร์สินทรัพย์ดิจิทัล',vi:'📤 Chia sẻ tài sản số'},
'global.logout':{ko:'↩ 로그아웃',en:'↩ Log out',ja:'↩ ログアウト',zh:'↩ 退出登录',th:'↩ ออกจากระบบ',vi:'↩ Đăng xuất'},
'global.footer.description':{ko:'디지털 자산 권리·공유 플랫폼 · 1 TL = 1원',en:'Digital asset rights and sharing platform · 1 TL = KRW 1',ja:'デジタル資産の権利・共有プラットフォーム · 1 TL = 1ウォン',zh:'数字资产权利与共享平台 · 1 TL = 1韩元',th:'แพลตฟอร์มสิทธิและการแบ่งปันสินทรัพย์ดิจิทัล · 1 TL = 1 วอน',vi:'Nền tảng quyền và chia sẻ tài sản số · 1 TL = 1 won'},
'global.footer.services':{ko:'서비스',en:'Services',ja:'サービス',zh:'服务',th:'บริการ',vi:'Dịch vụ'},
'global.footer.creator':{ko:'크리에이터',en:'Creators',ja:'クリエイター',zh:'创作者',th:'ครีเอเตอร์',vi:'Nhà sáng tạo'},
'global.footer.legal':{ko:'법적 정보',en:'Legal',ja:'法的情報',zh:'法律信息',th:'ข้อมูลทางกฎหมาย',vi:'Thông tin pháp lý'},
'global.footer.radio':{ko:'TL방송국',en:'TimeLink Radio',ja:'TimeLinkラジオ',zh:'TimeLink 电台',th:'TimeLink Radio',vi:'TimeLink Radio'},
'global.footer.ads':{ko:'광고 센터',en:'Advertising',ja:'広告センター',zh:'广告中心',th:'ศูนย์โฆษณา',vi:'Trung tâm quảng cáo'},
'global.footer.creator.center':{ko:'크리에이터 센터',en:'Creator Studio',ja:'クリエイタースタジオ',zh:'创作者中心',th:'สตูดิโอครีเอเตอร์',vi:'Trung tâm nhà sáng tạo'},
'global.footer.creator.policy':{ko:'크리에이터 정책',en:'Creator Policy',ja:'クリエイターポリシー',zh:'创作者政策',th:'นโยบายครีเอเตอร์',vi:'Chính sách nhà sáng tạo'},
'global.footer.dj.guide':{ko:'DJ 가이드',en:'DJ Guide',ja:'DJガイド',zh:'DJ 指南',th:'คู่มือ DJ',vi:'Hướng dẫn DJ'},
'global.footer.advertiser':{ko:'광고주 센터',en:'Advertiser Center',ja:'広告主センター',zh:'广告主中心',th:'ศูนย์ผู้ลงโฆษณา',vi:'Trung tâm nhà quảng cáo'},
'global.footer.terms':{ko:'이용약관',en:'Terms of Service',ja:'利用規約',zh:'服务条款',th:'ข้อกำหนดการใช้บริการ',vi:'Điều khoản dịch vụ'},
'global.footer.privacy':{ko:'개인정보처리방침',en:'Privacy Policy',ja:'プライバシーポリシー',zh:'隐私政策',th:'นโยบายความเป็นส่วนตัว',vi:'Chính sách quyền riêng tư'},
'global.footer.company':{ko:'씨엠피 주식회사 · 대표이사 이문웅 · 사업자등록번호 491-86-02547',en:'CMP Inc. · CEO Moonwoong Lee · Business Registration No. 491-86-02547',ja:'CMP株式会社 · 代表取締役 イ・ムンウン · 事業者登録番号 491-86-02547',zh:'CMP株式会社 · 首席执行官 李文雄 · 企业注册号 491-86-02547',th:'บริษัท CMP · กรรมการผู้จัดการ มุนอุง อี · เลขทะเบียนธุรกิจ 491-86-02547',vi:'Công ty CMP · Tổng giám đốc Moonwoong Lee · Mã đăng ký kinh doanh 491-86-02547'},
'global.footer.address':{ko:'서울특별시 영등포구 국제금융로8길 27-8, 4층',en:'4F, 27-8 Gukjegeumyung-ro 8-gil, Yeongdeungpo-gu, Seoul, Korea',ja:'大韓民国ソウル特別市永登浦区国際金融路8キル27-8、4階',zh:'韩国首尔特别市永登浦区国际金融路8街27-8号4层',th:'ชั้น 4, 27-8 ถนนกุกเจกึมยุงโร 8-กิล เขตยองดึงโพ กรุงโซล ประเทศเกาหลี',vi:'Tầng 4, 27-8 Gukjegeumyung-ro 8-gil, Yeongdeungpo-gu, Seoul, Hàn Quốc'},
'global.footer.copyright':{ko:'ⓒ 2026 씨엠피 주식회사. All rights reserved.',en:'ⓒ 2026 CMP Inc. All rights reserved.',ja:'ⓒ 2026 CMP株式会社。無断転載を禁じます。',zh:'ⓒ 2026 CMP株式会社。保留所有权利。',th:'ⓒ 2026 บริษัท CMP สงวนลิขสิทธิ์',vi:'ⓒ 2026 Công ty CMP. Bảo lưu mọi quyền.'},
};

/* ── 언어 감지 ── */
function detectLang(){
  var saved=localStorage.getItem('tl_lang');
  if(saved&&LANGS.includes(saved)) return saved;
  var br=(navigator.language||navigator.userLanguage||'ko').toLowerCase();
  if(br.startsWith('ja')) return 'ja';
  if(br.startsWith('zh')) return 'zh';
  if(br.startsWith('th')) return 'th';
  if(br.startsWith('vi')) return 'vi';
  if(br.startsWith('ko')) return 'ko';
  return 'en';
}

/* Six-language login and Creator Center translations */
Object.assign(T,{
  "login.welcome":{ko:"다시 오셨군요",en:"Welcome back",ja:"おかえりなさい",zh:"欢迎回来",th:"ยินดีต้อนรับกลับมา",vi:"Chào mừng bạn quay lại"},
  "login.pulse":{ko:"계속 Pulse를 쌓아보세요",en:"Keep building your Pulse",ja:"Pulseを積み重ねましょう",zh:"继续积累您的 Pulse",th:"สะสม Pulse ของคุณต่อไป",vi:"Tiếp tục tích lũy Pulse của bạn"},
  "login.email":{ko:"이메일",en:"Email",ja:"メールアドレス",zh:"电子邮箱",th:"อีเมล",vi:"Email"},
  "login.email.placeholder":{ko:"이메일 주소 입력",en:"Enter your email address",ja:"メールアドレスを入力",zh:"请输入电子邮箱",th:"กรอกอีเมลของคุณ",vi:"Nhập địa chỉ email"},
  "login.password":{ko:"비밀번호",en:"Password",ja:"パスワード",zh:"密码",th:"รหัสผ่าน",vi:"Mật khẩu"},
  "login.password.placeholder":{ko:"비밀번호 입력",en:"Enter your password",ja:"パスワードを入力",zh:"请输入密码",th:"กรอกรหัสผ่าน",vi:"Nhập mật khẩu"},
  "login.forgot":{ko:"비밀번호를 잊으셨나요?",en:"Forgot your password?",ja:"パスワードをお忘れですか？",zh:"忘记密码了吗？",th:"ลืมรหัสผ่านใช่ไหม?",vi:"Bạn quên mật khẩu?"},
  "login.submit":{ko:"로그인",en:"Log in",ja:"ログイン",zh:"登录",th:"เข้าสู่ระบบ",vi:"Đăng nhập"},
  "login.or":{ko:"또는",en:"OR",ja:"または",zh:"或",th:"หรือ",vi:"HOẶC"},
  "login.ton.connect":{ko:"TON Wallet 연결",en:"Connect TON Wallet",ja:"TONウォレットを接続",zh:"连接 TON 钱包",th:"เชื่อมต่อ TON Wallet",vi:"Kết nối TON Wallet"},
  "login.signup.question":{ko:"계정이 없으신가요?",en:"Don't have an account?",ja:"アカウントをお持ちでないですか？",zh:"还没有账户？",th:"ยังไม่มีบัญชีใช่ไหม?",vi:"Bạn chưa có tài khoản?"},
  "login.signup":{ko:"무료 가입",en:"Sign up for free",ja:"無料で登録",zh:"免费注册",th:"สมัครฟรี",vi:"Đăng ký miễn phí"},
  "login.error.required":{ko:"이메일과 비밀번호를 입력해주세요.",en:"Enter your email address and password.",ja:"メールアドレスとパスワードを入力してください。",zh:"请输入电子邮箱和密码。",th:"กรุณากรอกอีเมลและรหัสผ่าน",vi:"Vui lòng nhập email và mật khẩu."},
  "login.success":{ko:"로그인 성공!",en:"Login successful!",ja:"ログインしました！",zh:"登录成功！",th:"เข้าสู่ระบบสำเร็จ!",vi:"Đăng nhập thành công!"},
  "login.error.credentials":{ko:"이메일 또는 비밀번호가 올바르지 않습니다",en:"The email address or password is incorrect.",ja:"メールアドレスまたはパスワードが正しくありません。",zh:"电子邮箱或密码不正确。",th:"อีเมลหรือรหัสผ่านไม่ถูกต้อง",vi:"Email hoặc mật khẩu không chính xác."},
  "login.error.network":{ko:"로그인 실패. 잠시 후 다시 시도해주세요.",en:"Login failed. Please try again shortly.",ja:"ログインに失敗しました。しばらくしてからもう一度お試しください。",zh:"登录失败，请稍后重试。",th:"เข้าสู่ระบบไม่สำเร็จ โปรดลองอีกครั้งในภายหลัง",vi:"Đăng nhập thất bại. Vui lòng thử lại sau."},
  "login.ton.connected":{ko:"TON 지갑 연결 완료!",en:"TON wallet connected!",ja:"TONウォレットを接続しました！",zh:"TON 钱包已连接！",th:"เชื่อมต่อ TON Wallet แล้ว!",vi:"Đã kết nối TON Wallet!"},
  "login.ton.prompt":{ko:"TonKeeper 앱에서 지갑 주소를 복사해서 붙여넣으세요\\n(UQ 또는 EQ로 시작하는 48자리)",en:"Copy your wallet address from TonKeeper and paste it here.\\n(48 characters, beginning with UQ or EQ)",ja:"TonKeeperアプリからウォレットアドレスをコピーして貼り付けてください。\\n（UQまたはEQで始まる48文字）",zh:"请从 TonKeeper 应用复制钱包地址并粘贴到此处。\\n（共48位，以 UQ 或 EQ 开头）",th:"คัดลอกที่อยู่กระเป๋าจากแอป TonKeeper แล้ววางที่นี่\\n(48 ตัวอักษร ขึ้นต้นด้วย UQ หรือ EQ)",vi:"Sao chép địa chỉ ví từ TonKeeper và dán vào đây.\\n(Gồm 48 ký tự, bắt đầu bằng UQ hoặc EQ)"},
  "login.ton.invalid":{ko:"유효하지 않은 TON 주소입니다.",en:"Invalid TON address.",ja:"TONアドレスが無効です。",zh:"TON 地址无效。",th:"ที่อยู่ TON ไม่ถูกต้อง",vi:"Địa chỉ TON không hợp lệ."},
  "creator.hero.title":{ko:"창작물을 디지털 자산으로<br>등록하고 공유한다.",en:"Register and share your creations as digital assets.",ja:"作品をデジタル資産として登録・共有する",zh:"将创作内容登记并分享为数字资产",th:"ลงทะเบียนและแชร์ผลงานเป็นสินทรัพย์ดิจิทัล",vi:"Đăng ký và chia sẻ tác phẩm dưới dạng tài sản số"},
  "creator.hero.desc":{ko:"원본은 비공개로 보관하고, 창작자가 권리를 확인하면 TL3로 즉시 자산화하고 공유한다.<br>공유 조건과 보상 기준은 크리에이터가 정한다.",en:"Originals remain private. Once rights are confirmed, the work is converted into TL3 and shared.<br>Creators set the sharing terms and reward criteria.",ja:"オリジナルは非公開で保管されます。権利確認後、TL3に変換して共有します。<br>共有条件と報酬基準はクリエイターが設定します。",zh:"原始文件将保密保存。确认权利后，内容将转换为 TL3 并分享。<br>分享条件和奖励标准由创作者设定。",th:"ต้นฉบับจะถูกเก็บเป็นส่วนตัว เมื่อยืนยันสิทธิ์แล้วจะแปลงเป็น TL3 เพื่อแชร์<br>ผู้สร้างกำหนดเงื่อนไขการแชร์และเกณฑ์รางวัลเอง",vi:"Bản gốc được lưu riêng tư. Sau khi xác nhận quyền, tác phẩm được chuyển thành TL3 để chia sẻ.<br>Người sáng tạo tự đặt điều kiện chia sẻ và tiêu chí thưởng."},
  "creator.type.audio":{ko:"음원",en:"Audio",ja:"音源",zh:"音频",th:"เสียง",vi:"Âm thanh"},
  "creator.type.video":{ko:"영상",en:"Video",ja:"動画",zh:"视频",th:"วิดีโอ",vi:"Video"},
  "creator.type.image":{ko:"이미지",en:"Image",ja:"画像",zh:"图片",th:"รูปภาพ",vi:"Hình ảnh"},
  "creator.type.document":{ko:"문서",en:"Document",ja:"文書",zh:"文档",th:"เอกสาร",vi:"Tài liệu"},
  "creator.step.audio":{ko:"음원 등록",en:"Register audio",ja:"音源登録",zh:"登记音频",th:"ลงทะเบียนเสียง",vi:"Đăng ký âm thanh"},
  "creator.step.video":{ko:"영상 등록",en:"Register video",ja:"動画登録",zh:"登记视频",th:"ลงทะเบียนวิดีโอ",vi:"Đăng ký video"},
  "creator.step.image":{ko:"이미지 등록",en:"Register image",ja:"画像登録",zh:"登记图片",th:"ลงทะเบียนรูปภาพ",vi:"Đăng ký hình ảnh"},
  "creator.step.document":{ko:"문서 등록",en:"Register document",ja:"文書登録",zh:"登记文档",th:"ลงทะเบียนเอกสาร",vi:"Đăng ký tài liệu"},
  "creator.step.original":{ko:"원본 등록",en:"Register original",ja:"オリジナル登録",zh:"登记原始文件",th:"ลงทะเบียนต้นฉบับ",vi:"Đăng ký bản gốc"},
  "creator.step.lp":{ko:"LP 음질 (선택)",en:"LP enhancement (optional)",ja:"LP音質（任意）",zh:"LP 音质增强（可选）",th:"ปรับคุณภาพเสียง LP (ไม่บังคับ)",vi:"Nâng cao âm thanh LP (tùy chọn)"},
  "creator.step.rights":{ko:"권리 확인 및 공유",en:"Rights confirmation and sharing",ja:"権利確認と共有",zh:"权利确认与分享",th:"ยืนยันสิทธิ์และแชร์",vi:"Xác nhận quyền và chia sẻ"},
  "creator.audio.heading":{ko:"음원 등록",en:"Register audio",ja:"音源登録",zh:"登记音频",th:"ลงทะเบียนเสียง",vi:"Đăng ký âm thanh"},
  "creator.audio.desc":{ko:"MP3 원본과 기본 정보를 등록한다. 원본은 비공개로 보관되며 권리 확인을 거쳐 TL3로만 공유할 수 있다.",en:"Register the original MP3 and its details. The original remains private and can only be shared as TL3 after rights confirmation.",ja:"MP3のオリジナルと基本情報を登録します。オリジナルは非公開で保管され、権利確認後にTL3としてのみ共有できます。",zh:"登记 MP3 原始文件及基本信息。原始文件将保密保存，完成权利确认后仅可作为 TL3 分享。",th:"ลงทะเบียนไฟล์ MP3 ต้นฉบับและข้อมูลพื้นฐาน ต้นฉบับจะถูกเก็บเป็นส่วนตัวและแชร์ได้เฉพาะ TL3 หลังยืนยันสิทธิ์",vi:"Đăng ký MP3 gốc và thông tin cơ bản. Bản gốc được lưu riêng tư và chỉ có thể chia sẻ dưới dạng TL3 sau khi xác nhận quyền."},
  "creator.video.heading":{ko:"영상 등록",en:"Register video",ja:"動画登録",zh:"登记视频",th:"ลงทะเบียนวิดีโอ",vi:"Đăng ký video"},
  "creator.video.desc":{ko:"MP4 원본과 기본 정보를 등록한다. 원본은 비공개로 보관되며 권리 확인을 거쳐 TL4로만 공유할 수 있다.",en:"Register the original MP4 and its details. The original remains private and can only be shared as TL4 after rights confirmation.",ja:"MP4のオリジナルと基本情報を登録します。オリジナルは非公開で保管され、権利確認後にTL4としてのみ共有できます。",zh:"登记 MP4 原始文件及基本信息。原始文件将保密保存，完成权利确认后仅可作为 TL4 分享。",th:"ลงทะเบียน MP4 ต้นฉบับและข้อมูลพื้นฐาน ต้นฉบับจะถูกเก็บเป็นส่วนตัวและแชร์ได้เฉพาะ TL4 หลังยืนยันสิทธิ์",vi:"Đăng ký MP4 gốc và thông tin cơ bản. Bản gốc được lưu riêng tư và chỉ có thể chia sẻ dưới dạng TL4 sau khi xác nhận quyền."},
  "creator.image.heading":{ko:"이미지 등록",en:"Register image",ja:"画像登録",zh:"登记图片",th:"ลงทะเบียนรูปภาพ",vi:"Đăng ký hình ảnh"},
  "creator.image.desc":{ko:"이미지 원본과 기본 정보를 등록한다. 원본은 비공개로 보관되며 권리 확인을 거쳐 TLJ로만 공유할 수 있다.",en:"Register the original image and its details. The original remains private and can only be shared as TLJ after rights confirmation.",ja:"画像のオリジナルと基本情報を登録します。オリジナルは非公開で保管され、権利確認後にTLJとしてのみ共有できます。",zh:"登记图片原始文件及基本信息。原始文件将保密保存，完成权利确认后仅可作为 TLJ 分享。",th:"ลงทะเบียนรูปภาพต้นฉบับและข้อมูลพื้นฐาน ต้นฉบับจะถูกเก็บเป็นส่วนตัวและแชร์ได้เฉพาะ TLJ หลังยืนยันสิทธิ์",vi:"Đăng ký hình ảnh gốc và thông tin cơ bản. Bản gốc được lưu riêng tư và chỉ có thể chia sẻ dưới dạng TLJ sau khi xác nhận quyền."},
  "creator.document.heading":{ko:"문서 등록",en:"Register document",ja:"文書登録",zh:"登记文档",th:"ลงทะเบียนเอกสาร",vi:"Đăng ký tài liệu"},
  "creator.document.desc":{ko:"문서 원본과 기본 정보를 등록한다. 원본은 비공개로 보관되며 권리 확인을 거쳐 TLD로만 공유할 수 있다.",en:"Register the original document and its details. The original remains private and can only be shared as TLD after rights confirmation.",ja:"文書のオリジナルと基本情報を登録します。オリジナルは非公開で保管され、権利確認後にTLDとしてのみ共有できます。",zh:"登记文档原始文件及基本信息。原始文件将保密保存，完成权利确认后仅可作为 TLD 分享。",th:"ลงทะเบียนเอกสารต้นฉบับและข้อมูลพื้นฐาน ต้นฉบับจะถูกเก็บเป็นส่วนตัวและแชร์ได้เฉพาะ TLD หลังยืนยันสิทธิ์",vi:"Đăng ký tài liệu gốc và thông tin cơ bản. Bản gốc được lưu riêng tư và chỉ có thể chia sẻ dưới dạng TLD sau khi xác nhận quyền."},
  "creator.title":{ko:"제목",en:"Title",ja:"タイトル",zh:"标题",th:"ชื่อเรื่อง",vi:"Tiêu đề"},
  "creator.asset.title.placeholder":{ko:"자산 제목",en:"Asset title",ja:"資産タイトル",zh:"资产标题",th:"ชื่อสินทรัพย์",vi:"Tiêu đề tài sản"},
  "creator.artist":{ko:"아티스트",en:"Artist",ja:"アーティスト",zh:"艺术家",th:"ศิลปิน",vi:"Nghệ sĩ"},
  "creator.genre":{ko:"장르",en:"Genre",ja:"ジャンル",zh:"类型",th:"แนวเพลง",vi:"Thể loại"},
  "creator.genre.custom":{ko:"직접 입력 가능",en:"Enter manually",ja:"直接入力できます",zh:"可手动输入",th:"กรอกเองได้",vi:"Có thể nhập thủ công"},
  "creator.album.desc":{ko:"앨범 / 설명",en:"Album / Description",ja:"アルバム／説明",zh:"专辑 / 说明",th:"อัลบั้ม / คำอธิบาย",vi:"Album / Mô tả"},
  "creator.album.placeholder":{ko:"앨범명 또는 간단한 설명",en:"Album name or a brief description",ja:"アルバム名または簡単な説明",zh:"专辑名称或简短说明",th:"ชื่ออัลบั้มหรือคำอธิบายสั้น ๆ",vi:"Tên album hoặc mô tả ngắn"},
  "creator.drop.mp3":{ko:"MP3 파일을 여기에 놓거나 클릭",en:"Drop an MP3 file here or click to browse",ja:"MP3ファイルをここにドロップするか、クリックして選択",zh:"将 MP3 文件拖放到此处或点击选择",th:"วางไฟล์ MP3 ที่นี่หรือคลิกเพื่อเลือก",vi:"Thả tệp MP3 vào đây hoặc nhấp để chọn"},
  "creator.drop.mp4":{ko:"MP4 파일을 여기에 놓거나 클릭",en:"Drop an MP4 file here or click to browse",ja:"MP4ファイルをここにドロップするか、クリックして選択",zh:"将 MP4 文件拖放到此处或点击选择",th:"วางไฟล์ MP4 ที่นี่หรือคลิกเพื่อเลือก",vi:"Thả tệp MP4 vào đây hoặc nhấp để chọn"},
  "creator.drop.image":{ko:"이미지 파일을 여기에 놓거나 클릭",en:"Drop an image file here or click to browse",ja:"画像ファイルをここにドロップするか、クリックして選択",zh:"将图片文件拖放到此处或点击选择",th:"วางไฟล์รูปภาพที่นี่หรือคลิกเพื่อเลือก",vi:"Thả tệp hình ảnh vào đây hoặc nhấp để chọn"},
  "creator.drop.document":{ko:"문서 파일을 여기에 놓거나 클릭",en:"Drop a document here or click to browse",ja:"文書ファイルをここにドロップするか、クリックして選択",zh:"将文档拖放到此处或点击选择",th:"วางเอกสารที่นี่หรือคลิกเพื่อเลือก",vi:"Thả tài liệu vào đây hoặc nhấp để chọn"},
  "creator.private.storage":{ko:"비공개 원본 보관 · 최대 100MB",en:"Private original storage · up to 100 MB",ja:"オリジナルは非公開で保管 · 最大100MB",zh:"原始文件私密保存 · 最大 100MB",th:"เก็บต้นฉบับเป็นส่วนตัว · สูงสุด 100MB",vi:"Lưu bản gốc riêng tư · tối đa 100MB"},
  "creator.video.file":{ko:"영상 파일",en:"Video file",ja:"動画ファイル",zh:"视频文件",th:"ไฟล์วิดีโอ",vi:"Tệp video"},
  "creator.image.file":{ko:"이미지 파일",en:"Image file",ja:"画像ファイル",zh:"图片文件",th:"ไฟล์รูปภาพ",vi:"Tệp hình ảnh"},
  "creator.document.file":{ko:"문서 파일",en:"Document file",ja:"文書ファイル",zh:"文档文件",th:"ไฟล์เอกสาร",vi:"Tệp tài liệu"},
  "creator.cover.optional":{ko:"커버 이미지 (선택)",en:"Cover image (optional)",ja:"カバー画像（任意）",zh:"封面图片（可选）",th:"ภาพปก (ไม่บังคับ)",vi:"Ảnh bìa (không bắt buộc)"},
  "creator.cover.choose":{ko:"커버 이미지를 선택",en:"Choose a cover image",ja:"カバー画像を選択",zh:"选择封面图片",th:"เลือกภาพปก",vi:"Chọn ảnh bìa"},
  "creator.upload.continue":{ko:"음원 등록하고 계속 →",en:"Register audio and continue →",ja:"音源を登録して続行 →",zh:"登记音频并继续 →",th:"ลงทะเบียนเสียงและดำเนินการต่อ →",vi:"Đăng ký âm thanh và tiếp tục →"},
  "creator.lp.title":{ko:"음질 개선 (LP Enhanced)",en:"Audio Enhancement (LP Enhanced)",ja:"音質向上（LP Enhanced）",zh:"音质增强（LP Enhanced）",th:"ปรับปรุงคุณภาพเสียง (LP Enhanced)",vi:"Nâng cao chất lượng âm thanh (LP Enhanced)"},
  "creator.lp.desc":{ko:"음원의 음질을 개선합니다. LP Enhanced 옵션을 적용하여 아날로그 감성을 더할 수 있습니다. (특허 10-2025-0167813)",en:"Enhance the audio with LP Enhanced to add an analog character. (Patent 10-2025-0167813)",ja:"LP Enhancedオプションで音質を向上させ、アナログの質感を加えます。（特許 10-2025-0167813）",zh:"使用 LP Enhanced 选项改善音质，增添模拟唱片质感。（专利 10-2025-0167813）",th:"ปรับปรุงคุณภาพเสียงด้วย LP Enhanced เพื่อเพิ่มมิติแบบอนาล็อก (สิทธิบัตร 10-2025-0167813)",vi:"Cải thiện chất lượng âm thanh bằng LP Enhanced để tạo chất âm analog. (Bằng sáng chế 10-2025-0167813)"},
  "creator.lp.continue":{ko:"음질 개선하고 계속",en:"Enhance audio and continue",ja:"音質を向上して続行",zh:"增强音质并继续",th:"ปรับปรุงเสียงและดำเนินการต่อ",vi:"Nâng cao âm thanh và tiếp tục"},
  "creator.lp.cost.label":{ko:"비용 1000TL",en:"Cost: 1,000 TL",ja:"費用：1,000 TL",zh:"费用：1,000 TL",th:"ค่าใช้จ่าย 1,000 TL",vi:"Chi phí: 1.000 TL"},
  "creator.lp.preview.original":{ko:"▶ 원본 10초",en:"▶ Original · 10 sec",ja:"▶ オリジナル・10秒",zh:"▶ 原始音频 · 10 秒",th:"▶ ต้นฉบับ · 10 วินาที",vi:"▶ Bản gốc · 10 giây"},
  "creator.lp.preview.enhanced":{ko:"▶ LP Enhanced 10초",en:"▶ LP Enhanced · 10 sec",ja:"▶ LP Enhanced・10秒",zh:"▶ LP Enhanced · 10 秒",th:"▶ LP Enhanced · 10 วินาที",vi:"▶ LP Enhanced · 10 giây"},
  "creator.lp.ready":{ko:"원본 등록 후 활성화",en:"Available after original is registered",ja:"オリジナル登録後に有効になります",zh:"登记原始文件后启用",th:"ใช้งานได้หลังลงทะเบียนต้นฉบับ",vi:"Khả dụng sau khi đăng ký bản gốc"},
  "creator.lp.license":{ko:"🎚️ LP 음질 향상 적용",en:"🎚️ Apply LP audio enhancement",ja:"🎚️ LP音質向上を適用",zh:"🎚️ 应用 LP 音质增强",th:"🎚️ ใช้การปรับปรุงเสียง LP",vi:"🎚️ Áp dụng nâng cao âm thanh LP"},
  "creator.lp.notice.title":{ko:"분산화 원칙",en:"Decentralization principle",ja:"分散化の原則",zh:"去中心化原则",th:"หลักการกระจายศูนย์",vi:"Nguyên tắc phi tập trung"},
  "creator.lp.notice.desc":{ko:"LP 처리 결과는 서버에 저장되지 않습니다.<br>라이선스 메타만 기록:",en:"LP processing results are not stored on the server.<br>Only license metadata is recorded:",ja:"LP処理結果はサーバーに保存されません。<br>ライセンスのメタデータのみを記録します：",zh:"LP 处理结果不会存储在服务器上。<br>仅记录许可证元数据：",th:"ผลการประมวลผล LP จะไม่ถูกจัดเก็บบนเซิร์ฟเวอร์<br>บันทึกเฉพาะเมตาดาต้าของใบอนุญาต:",vi:"Kết quả xử lý LP không được lưu trên máy chủ.<br>Chỉ ghi lại siêu dữ liệu giấy phép:"},
  "creator.lp.balance":{ko:"현재 잔액",en:"Current balance",ja:"現在の残高",zh:"当前余额",th:"ยอดคงเหลือปัจจุบัน",vi:"Số dư hiện tại"},
  "creator.lp.deduct":{ko:"LP 적용 시 차감",en:"Deducted when LP is applied",ja:"LP適用時の差引額",zh:"应用 LP 时扣除",th:"หักเมื่อใช้ LP",vi:"Khấu trừ khi áp dụng LP"},
  "creator.lp.after":{ko:"예상 잔액",en:"Estimated balance",ja:"予想残高",zh:"预计余额",th:"ยอดคงเหลือโดยประมาณ",vi:"Số dư dự kiến"},
  "creator.back":{ko:"← 이전",en:"← Back",ja:"← 戻る",zh:"← 上一步",th:"← ย้อนกลับ",vi:"← Quay lại"},
  "creator.status.lookup.fail":{ko:"조회 실패",en:"Lookup failed",ja:"照会に失敗しました",zh:"查询失败",th:"ค้นหาไม่สำเร็จ",vi:"Tra cứu thất bại"},
  "creator.status.original.check":{ko:"원본 권리 및 메타데이터 확인 중…",en:"Checking original rights and metadata…",ja:"オリジナルの権利とメタデータを確認中…",zh:"正在检查原始文件权利和元数据…",th:"กำลังตรวจสอบสิทธิ์และเมตาดาต้าของต้นฉบับ…",vi:"Đang kiểm tra quyền và siêu dữ liệu của bản gốc…"},
  "creator.status.original.upload":{ko:"원본 등록 중…",en:"Registering original…",ja:"オリジナルを登録中…",zh:"正在登记原始文件…",th:"กำลังลงทะเบียนต้นฉบับ…",vi:"Đang đăng ký bản gốc…"},
  "creator.status.original.compare":{ko:"원본 ↔ LP A/B 비교 가능",en:"Original ↔ LP A/B comparison available",ja:"オリジナル ↔ LP A/B比較が可能です",zh:"可进行原始音频 ↔ LP A/B 对比",th:"พร้อมเปรียบเทียบต้นฉบับ ↔ LP แบบ A/B",vi:"Có thể so sánh A/B bản gốc ↔ LP"},
  "creator.status.lp.analyze":{ko:"LP 재생 파라미터 분석 중...",en:"Analyzing LP playback parameters…",ja:"LP再生パラメータを分析中…",zh:"正在分析 LP 播放参数…",th:"กำลังวิเคราะห์พารามิเตอร์การเล่น LP…",vi:"Đang phân tích thông số phát LP…"},
  "creator.status.lp.ready":{ko:"✓ LP 실시간 재생 설정 완료",en:"✓ LP real-time playback configured",ja:"✓ LPリアルタイム再生の設定が完了しました",zh:"✓ LP 实时播放设置完成",th:"✓ ตั้งค่าการเล่น LP แบบเรียลไทม์แล้ว",vi:"✓ Đã thiết lập phát LP theo thời gian thực"},
  "creator.status.lp.fail":{ko:"LP 설정 실패: ",en:"LP setup failed: ",ja:"LP設定に失敗しました：",zh:"LP 设置失败：",th:"ตั้งค่า LP ไม่สำเร็จ: ",vi:"Thiết lập LP thất bại: "},
  "creator.status.lp.continue":{ko:"TL3 등록하러 가기 →",en:"Continue to TL3 registration →",ja:"TL3登録へ進む →",zh:"前往登记 TL3 →",th:"ไปลงทะเบียน TL3 →",vi:"Tiếp tục đăng ký TL3 →"},
  "creator.status.retry":{ko:"다시 시도",en:"Try again",ja:"再試行",zh:"重试",th:"ลองอีกครั้ง",vi:"Thử lại"},
  "creator.status.decode":{ko:"디코딩 중...",en:"Decoding…",ja:"デコード中…",zh:"正在解码…",th:"กำลังถอดรหัส…",vi:"Đang giải mã…"},
  "creator.status.preview.fail":{ko:"프리뷰 실패: ",en:"Preview failed: ",ja:"プレビューに失敗しました：",zh:"预览失败：",th:"พรีวิวไม่สำเร็จ: ",vi:"Xem trước thất bại: "},
  "creator.error.required":{ko:"제목, 아티스트, MP3 파일을 모두 입력해야 합니다.",en:"Enter a title, artist, and MP3 file.",ja:"タイトル、アーティスト、MP3ファイルをすべて入力してください。",zh:"请填写标题、艺术家并选择 MP3 文件。",th:"กรุณากรอกชื่อเรื่อง ศิลปิน และเลือกไฟล์ MP3",vi:"Vui lòng nhập tiêu đề, nghệ sĩ và chọn tệp MP3."},
  "creator.error.rights":{ko:"권리 확인에 동의해야 TL3로 공유할 수 있습니다.",en:"You must confirm the rights to share as TL3.",ja:"TL3として共有するには、権利確認への同意が必要です。",zh:"必须同意权利确认，才能分享为 TL3。",th:"คุณต้องยืนยันสิทธิ์ก่อนแชร์เป็น TL3",vi:"Bạn phải xác nhận quyền trước khi chia sẻ dưới dạng TL3."},
  "creator.error.balance":{ko:"TL 잔액이 부족합니다. (필요: 1,000 TL / 보유: ",en:"Insufficient TL balance. (Required: 1,000 TL / Available: ",ja:"TL残高が不足しています。（必要：1,000 TL／保有：",zh:"TL 余额不足。（所需：1,000 TL / 当前：",th:"ยอด TL ไม่เพียงพอ (ต้องใช้: 1,000 TL / คงเหลือ: ",vi:"Số dư TL không đủ. (Cần: 1.000 TL / Hiện có: "},
  "creator.error.original.missing":{ko:"원본 음원이 없습니다.",en:"Original audio is missing.",ja:"オリジナル音源がありません。",zh:"缺少原始音频。",th:"ไม่พบไฟล์เสียงต้นฉบับ",vi:"Thiếu tệp âm thanh gốc."},
  "creator.error.lp.module":{ko:"LP DSP 모듈을 불러오지 못했습니다.",en:"Could not load the LP DSP module.",ja:"LP DSPモジュールを読み込めませんでした。",zh:"无法加载 LP DSP 模块。",th:"ไม่สามารถโหลดโมดูล LP DSP ได้",vi:"Không thể tải mô-đun LP DSP."},
  "creator.error.original.register":{ko:"원본 자산 등록 실패",en:"Original asset registration failed",ja:"オリジナル資産の登録に失敗しました",zh:"原始资产登记失败",th:"ลงทะเบียนสินทรัพย์ต้นฉบับไม่สำเร็จ",vi:"Đăng ký tài sản gốc thất bại"},
  "creator.error.original.process":{ko:"원본 자산 처리가 완료되지 않았습니다. 다시 시도해주세요.",en:"Original asset processing is incomplete. Please try again.",ja:"オリジナル資産の処理が完了していません。もう一度お試しください。",zh:"原始资产处理尚未完成，请重试。",th:"การประมวลผลสินทรัพย์ต้นฉบับยังไม่เสร็จสิ้น โปรดลองอีกครั้ง",vi:"Quá trình xử lý tài sản gốc chưa hoàn tất. Vui lòng thử lại."},
  "creator.error.engine":{ko:"공통 TL3 제조 엔진을 불러오지 못했습니다. 새로고침 후 다시 시도해 주세요.",en:"Could not load the shared TL3 manufacturing engine. Refresh and try again.",ja:"共通TL3製造エンジンを読み込めませんでした。再読み込みしてお試しください。",zh:"无法加载通用 TL3 制作引擎。请刷新页面后重试。",th:"ไม่สามารถโหลดเอนจินสร้าง TL3 ส่วนกลางได้ โปรดรีเฟรชแล้วลองอีกครั้ง",vi:"Không thể tải công cụ tạo TL3 dùng chung. Vui lòng tải lại trang và thử lại."},
});

Object.assign(T,{
  "creator.release.title":{ko:"TL3 등록 및 공유",en:"Register and share TL3",ja:"TL3の登録と共有",zh:"登记并分享 TL3",th:"ลงทะเบียนและแชร์ TL3",vi:"Đăng ký và chia sẻ TL3"},
  "creator.release.desc":{ko:"음원은 디지털 자산으로 변환되어 모든 사람과 공유됩니다. 공유 후에는 변환을 되돌릴 수 없으며, 이후 보상은 플랫폼 정산 체계를 통해 지급됩니다.",en:"Your audio is converted into a digital asset and shared. This conversion cannot be reversed; subsequent rewards are paid through the platform's settlement system.",ja:"音源はデジタル資産に変換され、すべての人と共有されます。共有後は変換を元に戻せません。その後の報酬はプラットフォームの精算システムを通じて支払われます。",zh:"音频将转换为数字资产并与所有人分享。分享后无法撤销转换，后续奖励将通过平台结算系统支付。",th:"เสียงจะถูกแปลงเป็นสินทรัพย์ดิจิทัลและแชร์กับทุกคน หลังแชร์แล้วไม่สามารถย้อนกลับการแปลงได้ รางวัลหลังจากนั้นจะจ่ายผ่านระบบชำระบัญชีของแพลตฟอร์ม",vi:"Âm thanh được chuyển thành tài sản số và chia sẻ với mọi người. Sau khi chia sẻ, không thể hoàn tác chuyển đổi; các khoản thưởng tiếp theo được chi trả qua hệ thống quyết toán của nền tảng."},
  "creator.irreversible":{ko:"TL3 불가역 변환",en:"Irreversible TL3 conversion",ja:"TL3への不可逆変換",zh:"TL3 不可逆转换",th:"การแปลง TL3 แบบย้อนกลับไม่ได้",vi:"Chuyển đổi TL3 không thể đảo ngược"},
  "creator.irreversible.desc":{ko:"이 단계에서 원본이 TL3로 제조되며, 제조된 자산은 MP3로 되돌릴 수 없습니다.",en:"At this stage, the original is processed into TL3. The resulting asset cannot be converted back to MP3.",ja:"この段階でオリジナルをTL3に変換します。変換後の資産をMP3に戻すことはできません。",zh:"在此步骤中，原始文件将制作为 TL3。生成的资产无法还原为 MP3。",th:"ในขั้นตอนนี้ ต้นฉบับจะถูกผลิตเป็น TL3 และไม่สามารถแปลงสินทรัพย์ที่ผลิตแล้วกลับเป็น MP3 ได้",vi:"Ở bước này, bản gốc được tạo thành TL3. Tài sản đã tạo không thể chuyển ngược lại thành MP3."},
  "creator.release.button":{ko:"TL3 등록하고 공유하기",en:"Register and share TL3",ja:"TL3を登録して共有",zh:"登记并分享 TL3",th:"ลงทะเบียนและแชร์ TL3",vi:"Đăng ký và chia sẻ TL3"},
  "creator.done.title":{ko:"TL3 자산 등록 완료",en:"TL3 asset registered",ja:"TL3資産の登録完了",zh:"TL3 资产登记完成",th:"ลงทะเบียนสินทรัพย์ TL3 แล้ว",vi:"Đã đăng ký tài sản TL3"},
  "creator.done.new":{ko:"새 음악 올리기",en:"Register new music",ja:"新しい音楽を登録",zh:"上传新音乐",th:"ลงทะเบียนเพลงใหม่",vi:"Đăng ký nhạc mới"},
  "creator.done.view":{ko:"SharePlace에서 확인하기",en:"View in SharePlace",ja:"SharePlaceで確認",zh:"前往 SharePlace 查看",th:"ดูใน SharePlace",vi:"Xem trong SharePlace"},
});

Object.assign(T,{
Object.assign(T,{
'signup.meta.title':{ko:'회원가입 — TimeLink',en:'Sign up — TimeLink',ja:'新規登録 — TimeLink',zh:'注册 — TimeLink',th:'สมัครสมาชิก — TimeLink',vi:'Đăng ký — TimeLink'},
'signup.meta.description':{ko:'TimeLink 계정을 만들고 42,500 TL 보너스를 받으세요.',en:'Create a TimeLink account and receive a 42,500 TL bonus.',ja:'TimeLinkアカウントを作成して42,500 TLのボーナスを受け取りましょう。',zh:'创建 TimeLink 账户，领取 42,500 TL 奖励。',th:'สร้างบัญชี TimeLink และรับโบนัส 42,500 TL',vi:'Tạo tài khoản TimeLink và nhận thưởng 42.500 TL'},
'signup.patent':{ko:'특허 출원 10-2025-0167813',en:'Patent Application 10-2025-0167813',ja:'特許出願 10-2025-0167813',zh:'专利申请 10-2025-0167813',th:'คำขอรับสิทธิบัตร 10-2025-0167813',vi:'Đơn đăng ký sáng chế 10-2025-0167813'},
'ch.meta.title':{ko:'TL방송국 — 카페 채널 개설',en:'TimeLink Radio — Open a Cafe Channel',ja:'TimeLinkラジオ — カフェチャンネル開設',zh:'TimeLink 电台 — 开设咖啡馆频道',th:'TimeLink Radio — เปิดช่องคาเฟ่',vi:'TimeLink Radio — Mở kênh quán cà phê'},
'ch.hero.title':{ko:'나만의 카페 전용 AI 라디오 채널',en:'Your own AI radio channel for your cafe',ja:'カフェ専用のAIラジオチャンネル',zh:'专属咖啡馆 AI 电台频道',th:'ช่องวิทยุ AI สำหรับคาเฟ่ของคุณ',vi:'Kênh radio AI dành riêng cho quán cà phê'},
'ch.hero.sub':{ko:'24시간 자동 AI 큐레이션, 고객 곡 신청, 사연 방송까지. 카페만을 위한 특별한 음악 채널을 개설하세요.',en:'24/7 AI music curation, customer song requests, and listener messages. Create a music channel just for your cafe.',ja:'24時間のAI自動選曲、お客様からのリクエストやメッセージ放送まで。カフェ専用の音楽チャンネルを開設しましょう。',zh:'全天候 AI 自动选曲、顾客点歌和留言广播。创建专属于您咖啡馆的音乐频道。',th:'คัดสรรเพลงด้วย AI ตลอด 24 ชั่วโมง รับคำขอเพลงและข้อความจากลูกค้า เปิดช่องเพลงพิเศษสำหรับคาเฟ่ของคุณ',vi:'Tuyển chọn nhạc bằng AI 24/7, nhận yêu cầu bài hát và lời nhắn từ khách. Tạo kênh âm nhạc riêng cho quán của bạn'},
'ch.biz.notice':{ko:'현재는 사업자등록번호의 형식만 확인합니다. 국세청 사업자 상태·상호 조회는 연동되지 않았으며, 공식 실시간 인증이 완료된 상태가 아닙니다.',en:'Only the format of the business registration number is checked. National Tax Service status and business-name lookup are not connected; official real-time verification has not been completed.',ja:'現在は事業者登録番号の形式のみ確認します。国税庁の事業者状態・商号照会は未連携で、公式なリアルタイム認証は完了していません。',zh:'目前仅检查营业执照号码格式。尚未连接韩国国税厅的企业状态及名称查询，因此不代表已完成官方实时认证。',th:'ขณะนี้ตรวจสอบเฉพาะรูปแบบเลขทะเบียนธุรกิจ ยังไม่ได้เชื่อมต่อเพื่อตรวจสอบสถานะกับกรมสรรพากรเกาหลี จึงยังไม่มีการยืนยันอย่างเป็นทางการแบบเรียลไทม์',vi:'Hiện chỉ kiểm tra định dạng mã đăng ký kinh doanh. Chưa kết nối tra cứu trạng thái với Cơ quan Thuế Hàn Quốc nên chưa có xác minh chính thức theo thời gian thực.'},
'ch.placeholder.cafe':{ko:'카페 이름 입력',en:'Enter cafe name',ja:'カフェ名を入力',zh:'输入咖啡馆名称',th:'กรอกชื่อคาเฟ่',vi:'Nhập tên quán'},
'ch.placeholder.channel':{ko:'영문 소문자, 숫자 (예: mycafe01)',en:'Lowercase letters and numbers (e.g. mycafe01)',ja:'半角小文字・数字（例：mycafe01）',zh:'小写英文字母和数字（例如 mycafe01）',th:'ตัวพิมพ์เล็กและตัวเลข (เช่น mycafe01)',vi:'Chữ thường và số (ví dụ: mycafe01)'},
'ch.placeholder.desc':{ko:'카페 분위기와 음악 스타일을 소개해주세요',en:'Describe your cafe’s atmosphere and music style',ja:'カフェの雰囲気や音楽スタイルを紹介してください',zh:'请介绍咖啡馆的氛围和音乐风格',th:'แนะนำบรรยากาศและสไตล์เพลงของคาเฟ่',vi:'Giới thiệu không khí và phong cách âm nhạc của quán'},
'ch.placeholder.address':{ko:'주소 입력 후 검색',en:'Enter an address, then search',ja:'住所を入力して検索',zh:'输入地址后搜索',th:'กรอกที่อยู่แล้วค้นหา',vi:'Nhập địa chỉ rồi tìm kiếm'},
'ch.placeholder.detail':{ko:'층, 호수 등',en:'Floor, suite, etc.',ja:'階・部屋番号など',zh:'楼层、房号等',th:'ชั้น ห้อง ฯลฯ',vi:'Tầng, số phòng...'},
'ch.placeholder.search':{ko:'곡명, 아티스트 검색...',en:'Search title or artist...',ja:'曲名・アーティストを検索...',zh:'搜索歌曲名或艺人...',th:'ค้นหาชื่อเพลงหรือศิลปิน...',vi:'Tìm tên bài hát hoặc nghệ sĩ...'},
'ch.biz.notice.title':{ko:'사업자등록번호 안내',en:'Business registration number notice',ja:'事業者登録番号について',zh:'营业执照号码说明',th:'คำแนะนำเกี่ยวกับเลขทะเบียนธุรกิจ',vi:'Thông tin về mã đăng ký kinh doanh'},
'ch.map.hint':{ko:'주소를 입력하면 지도가 표시됩니다',en:'The map appears after you enter an address',ja:'住所を入力すると地図が表示されます',zh:'输入地址后将显示地图',th:'แผนที่จะแสดงเมื่อกรอกที่อยู่',vi:'Bản đồ sẽ hiển thị sau khi nhập địa chỉ'},
'ch.image.upload':{ko:'클릭하여 이미지 업로드',en:'Click to upload images',ja:'クリックして画像をアップロード',zh:'点击上传图片',th:'คลิกเพื่ออัปโหลดรูปภาพ',vi:'Nhấp để tải ảnh lên'},
'ch.image.limit':{ko:'최대 5장 • JPG, PNG',en:'Up to 5 images • JPG, PNG',ja:'最大5枚 • JPG、PNG',zh:'最多5张 • JPG、PNG',th:'สูงสุด 5 รูป • JPG, PNG',vi:'Tối đa 5 ảnh • JPG, PNG'},
'ch.loading.songs':{ko:'곡 목록 로딩 중...',en:'Loading tracks...',ja:'曲を読み込み中...',zh:'正在加载歌曲列表...',th:'กำลังโหลดรายการเพลง...',vi:'Đang tải danh sách bài hát...'},
'ch.schedule.hint':{ko:'시간대별로 AI가 선곡할 음악 분위기를 설정합니다',en:'Set the music mood for AI selections at different times of day',ja:'時間帯ごとにAIが選曲する音楽の雰囲気を設定します',zh:'设置 AI 在不同时段选择的音乐氛围',th:'ตั้งค่าแนวเพลงที่ AI จะเลือกในแต่ละช่วงเวลา',vi:'Thiết lập phong cách nhạc AI chọn theo từng khung giờ'},
'ch.payment.month':{ko:'월정액 (30일)',en:'Monthly (30 days)',ja:'月額（30日）',zh:'月付（30天）',th:'รายเดือน (30 วัน)',vi:'Hàng tháng (30 ngày)'},
'ch.processing':{ko:'⏳ 처리 중...',en:'⏳ Processing...',ja:'⏳ 処理中...',zh:'⏳ 正在处理...',th:'⏳ กำลังดำเนินการ...',vi:'⏳ Đang xử lý...'},
'ch.toast.required':{ko:'필수 항목을 모두 입력해주세요.',en:'Please complete all required fields.',ja:'必須項目をすべて入力してください。',zh:'请填写所有必填项目。',th:'กรุณากรอกข้อมูลที่จำเป็นให้ครบ',vi:'Vui lòng điền tất cả các mục bắt buộc'},
'ch.toast.no.cafe':{ko:'카페명을 입력해주세요.',en:'Enter the cafe name.',ja:'カフェ名を入力してください。',zh:'请输入咖啡馆名称。',th:'กรุณากรอกชื่อคาเฟ่',vi:'Vui lòng nhập tên quán'},
'ch.toast.biz.format':{ko:'사업자등록번호 숫자 10자리를 입력해주세요.',en:'Enter the 10 digits of the business registration number.',ja:'事業者登録番号の数字10桁を入力してください。',zh:'请输入 10 位营业执照号码。',th:'กรอกเลขทะเบียนธุรกิจ 10 หลัก',vi:'Nhập 10 chữ số của mã đăng ký kinh doanh'},
'ch.toast.address.required':{ko:'주소 검색으로 카페 주소를 입력해주세요.',en:'Please enter the cafe address using address search.',ja:'住所検索でカフェの住所を入力してください。',zh:'请使用地址搜索填写咖啡馆地址。',th:'กรุณากรอกที่อยู่คาเฟ่ผ่านการค้นหาที่อยู่',vi:'Vui lòng nhập địa chỉ quán bằng chức năng tìm địa chỉ'},
'ch.toast.created':{ko:'🎉 카페 채널이 개설되었습니다!',en:'🎉 Your cafe channel has been created!',ja:'🎉 カフェチャンネルが開設されました！',zh:'🎉 咖啡馆频道已开通！',th:'🎉 สร้างช่องคาเฟ่แล้ว!',vi:'🎉 Kênh quán cà phê đã được tạo!'},
'ch.toast.failed':{ko:'채널 개설 실패',en:'Channel creation failed',ja:'チャンネル開設に失敗しました',zh:'频道开通失败',th:'สร้างช่องไม่สำเร็จ',vi:'Tạo kênh thất bại'},
'ch.count.suffix':{ko:'곡 선택됨',en:'selected',ja:'曲選択中',zh:'首已选',th:'เพลงที่เลือก',vi:'bài đã chọn'},
'ch.time.suffix':{ko:'시',en:'h',ja:'時',zh:'点',th:'น.',vi:'giờ'},
'ch.time.early':{ko:'이른 아침',en:'Early morning',ja:'早朝',zh:'清晨',th:'เช้าตรู่',vi:'Sáng sớm'},
'ch.time.morning':{ko:'오전',en:'Morning',ja:'午前',zh:'上午',th:'ช่วงเช้า',vi:'Buổi sáng'},
'ch.time.lunch':{ko:'점심',en:'Lunch',ja:'昼',zh:'午餐',th:'มื้อกลางวัน',vi:'Buổi trưa'},
'ch.time.afternoon':{ko:'오후',en:'Afternoon',ja:'午後',zh:'下午',th:'ช่วงบ่าย',vi:'Buổi chiều'},
'ch.time.evening':{ko:'저녁',en:'Evening',ja:'夕方',zh:'傍晚',th:'ช่วงเย็น',vi:'Buổi tối'},
'ch.time.night':{ko:'밤',en:'Night',ja:'夜',zh:'夜间',th:'กลางคืน',vi:'Ban đêm'},
'ch.time.late':{ko:'심야',en:'Late night',ja:'深夜',zh:'深夜',th:'ดึก',vi:'Đêm muộn'},
'ch.time.dawn':{ko:'새벽',en:'Dawn',ja:'明け方',zh:'凌晨',th:'รุ่งสาง',vi:'Rạng sáng'}
});


Object.assign(T,{
  "ch.biz.no":{ko:"사업자등록번호",en:"Business registration number",ja:"事業者登録番号",zh:"营业执照号码",th:"เลขทะเบียนธุรกิจ",vi:"Mã đăng ký kinh doanh"},
  "ch.intro":{ko:"소개글",en:"Introduction",ja:"紹介文",zh:"简介",th:"คำแนะนำร้าน",vi:"Giới thiệu"},
  "ch.addr":{ko:"도로명 주소",en:"Street address",ja:"道路名住所",zh:"道路地址",th:"ที่อยู่ตามถนน",vi:"Địa chỉ đường"},
  "ch.addr.detail":{ko:"상세 주소",en:"Address details",ja:"詳細住所",zh:"详细地址",th:"รายละเอียดที่อยู่",vi:"Địa chỉ chi tiết"},
  "ch.select.all":{ko:"전체 선택",en:"Select all",ja:"すべて選択",zh:"全选",th:"เลือกทั้งหมด",vi:"Chọn tất cả"},
  "ch.reset":{ko:"초기화",en:"Reset",ja:"リセット",zh:"重置",th:"รีเซ็ต",vi:"Đặt lại"},
  "ch.benefits":{ko:"카페 채널 혜택",en:"Cafe Channel Benefits",ja:"カフェチャンネルの特典",zh:"咖啡馆频道权益",th:"สิทธิประโยชน์ของช่องคาเฟ่",vi:"Quyền lợi kênh quán cà phê"},

/* ── 언어 감지 ── */
function detectLang(){
  var saved=localStorage.getItem('tl_lang');
  if(saved&&LANGS.includes(saved)) return saved;
  var br=(navigator.language||navigator.userLanguage||'ko').toLowerCase();
  if(br.startsWith('ja')) return 'ja';
  if(br.startsWith('zh')) return 'zh';
  if(br.startsWith('th')) return 'th';
  if(br.startsWith('vi')) return 'vi';
  if(br.startsWith('ko')) return 'ko';
  return 'en';
}

/* Six-language login and Creator Center translations */
Object.assign(T,{
  "login.welcome":{ko:"다시 오셨군요",en:"Welcome back",ja:"おかえりなさい",zh:"欢迎回来",th:"ยินดีต้อนรับกลับมา",vi:"Chào mừng bạn quay lại"},
  "login.pulse":{ko:"계속 Pulse를 쌓아보세요",en:"Keep building your Pulse",ja:"Pulseを積み重ねましょう",zh:"继续积累您的 Pulse",th:"สะสม Pulse ของคุณต่อไป",vi:"Tiếp tục tích lũy Pulse của bạn"},
  "login.email":{ko:"이메일",en:"Email",ja:"メールアドレス",zh:"电子邮箱",th:"อีเมล",vi:"Email"},
  "login.email.placeholder":{ko:"이메일 주소 입력",en:"Enter your email address",ja:"メールアドレスを入力",zh:"请输入电子邮箱",th:"กรอกอีเมลของคุณ",vi:"Nhập địa chỉ email"},
  "login.password":{ko:"비밀번호",en:"Password",ja:"パスワード",zh:"密码",th:"รหัสผ่าน",vi:"Mật khẩu"},
  "login.password.placeholder":{ko:"비밀번호 입력",en:"Enter your password",ja:"パスワードを入力",zh:"请输入密码",th:"กรอกรหัสผ่าน",vi:"Nhập mật khẩu"},
  "login.forgot":{ko:"비밀번호를 잊으셨나요?",en:"Forgot your password?",ja:"パスワードをお忘れですか？",zh:"忘记密码了吗？",th:"ลืมรหัสผ่านใช่ไหม?",vi:"Bạn quên mật khẩu?"},
  "login.submit":{ko:"로그인",en:"Log in",ja:"ログイン",zh:"登录",th:"เข้าสู่ระบบ",vi:"Đăng nhập"},
  "login.or":{ko:"또는",en:"OR",ja:"または",zh:"或",th:"หรือ",vi:"HOẶC"},
  "login.ton.connect":{ko:"TON Wallet 연결",en:"Connect TON Wallet",ja:"TONウォレットを接続",zh:"连接 TON 钱包",th:"เชื่อมต่อ TON Wallet",vi:"Kết nối TON Wallet"},
  "login.signup.question":{ko:"계정이 없으신가요?",en:"Don't have an account?",ja:"アカウントをお持ちでないですか？",zh:"还没有账户？",th:"ยังไม่มีบัญชีใช่ไหม?",vi:"Bạn chưa có tài khoản?"},
  "login.signup":{ko:"무료 가입",en:"Sign up for free",ja:"無料で登録",zh:"免费注册",th:"สมัครฟรี",vi:"Đăng ký miễn phí"},
  "login.error.required":{ko:"이메일과 비밀번호를 입력해주세요.",en:"Enter your email address and password.",ja:"メールアドレスとパスワードを入力してください。",zh:"请输入电子邮箱和密码。",th:"กรุณากรอกอีเมลและรหัสผ่าน",vi:"Vui lòng nhập email và mật khẩu."},
  "login.success":{ko:"로그인 성공!",en:"Login successful!",ja:"ログインしました！",zh:"登录成功！",th:"เข้าสู่ระบบสำเร็จ!",vi:"Đăng nhập thành công!"},
  "login.error.credentials":{ko:"이메일 또는 비밀번호가 올바르지 않습니다",en:"The email address or password is incorrect.",ja:"メールアドレスまたはパスワードが正しくありません。",zh:"电子邮箱或密码不正确。",th:"อีเมลหรือรหัสผ่านไม่ถูกต้อง",vi:"Email hoặc mật khẩu không chính xác."},
  "login.error.network":{ko:"로그인 실패. 잠시 후 다시 시도해주세요.",en:"Login failed. Please try again shortly.",ja:"ログインに失敗しました。しばらくしてからもう一度お試しください。",zh:"登录失败，请稍后重试。",th:"เข้าสู่ระบบไม่สำเร็จ โปรดลองอีกครั้งในภายหลัง",vi:"Đăng nhập thất bại. Vui lòng thử lại sau."},
  "login.ton.connected":{ko:"TON 지갑 연결 완료!",en:"TON wallet connected!",ja:"TONウォレットを接続しました！",zh:"TON 钱包已连接！",th:"เชื่อมต่อ TON Wallet แล้ว!",vi:"Đã kết nối TON Wallet!"},
  "login.ton.prompt":{ko:"TonKeeper 앱에서 지갑 주소를 복사해서 붙여넣으세요\\n(UQ 또는 EQ로 시작하는 48자리)",en:"Copy your wallet address from TonKeeper and paste it here.\\n(48 characters, beginning with UQ or EQ)",ja:"TonKeeperアプリからウォレットアドレスをコピーして貼り付けてください。\\n（UQまたはEQで始まる48文字）",zh:"请从 TonKeeper 应用复制钱包地址并粘贴到此处。\\n（共48位，以 UQ 或 EQ 开头）",th:"คัดลอกที่อยู่กระเป๋าจากแอป TonKeeper แล้ววางที่นี่\\n(48 ตัวอักษร ขึ้นต้นด้วย UQ หรือ EQ)",vi:"Sao chép địa chỉ ví từ TonKeeper và dán vào đây.\\n(Gồm 48 ký tự, bắt đầu bằng UQ hoặc EQ)"},
  "login.ton.invalid":{ko:"유효하지 않은 TON 주소입니다.",en:"Invalid TON address.",ja:"TONアドレスが無効です。",zh:"TON 地址无效。",th:"ที่อยู่ TON ไม่ถูกต้อง",vi:"Địa chỉ TON không hợp lệ."},
  "creator.hero.title":{ko:"창작물을 디지털 자산으로<br>등록하고 공유한다.",en:"Register and share your creations as digital assets.",ja:"作品をデジタル資産として登録・共有する",zh:"将创作内容登记并分享为数字资产",th:"ลงทะเบียนและแชร์ผลงานเป็นสินทรัพย์ดิจิทัล",vi:"Đăng ký và chia sẻ tác phẩm dưới dạng tài sản số"},
  "creator.hero.desc":{ko:"원본은 비공개로 보관하고, 창작자가 권리를 확인하면 TL3로 즉시 자산화하고 공유한다.<br>공유 조건과 보상 기준은 크리에이터가 정한다.",en:"Originals remain private. Once rights are confirmed, the work is converted into TL3 and shared.<br>Creators set the sharing terms and reward criteria.",ja:"オリジナルは非公開で保管されます。権利確認後、TL3に変換して共有します。<br>共有条件と報酬基準はクリエイターが設定します。",zh:"原始文件将保密保存。确认权利后，内容将转换为 TL3 并分享。<br>分享条件和奖励标准由创作者设定。",th:"ต้นฉบับจะถูกเก็บเป็นส่วนตัว เมื่อยืนยันสิทธิ์แล้วจะแปลงเป็น TL3 เพื่อแชร์<br>ผู้สร้างกำหนดเงื่อนไขการแชร์และเกณฑ์รางวัลเอง",vi:"Bản gốc được lưu riêng tư. Sau khi xác nhận quyền, tác phẩm được chuyển thành TL3 để chia sẻ.<br>Người sáng tạo tự đặt điều kiện chia sẻ và tiêu chí thưởng."},
  "creator.type.audio":{ko:"음원",en:"Audio",ja:"音源",zh:"音频",th:"เสียง",vi:"Âm thanh"},
  "creator.type.video":{ko:"영상",en:"Video",ja:"動画",zh:"视频",th:"วิดีโอ",vi:"Video"},
  "creator.type.image":{ko:"이미지",en:"Image",ja:"画像",zh:"图片",th:"รูปภาพ",vi:"Hình ảnh"},
  "creator.type.document":{ko:"문서",en:"Document",ja:"文書",zh:"文档",th:"เอกสาร",vi:"Tài liệu"},
  "creator.step.audio":{ko:"음원 등록",en:"Register audio",ja:"音源登録",zh:"登记音频",th:"ลงทะเบียนเสียง",vi:"Đăng ký âm thanh"},
  "creator.step.video":{ko:"영상 등록",en:"Register video",ja:"動画登録",zh:"登记视频",th:"ลงทะเบียนวิดีโอ",vi:"Đăng ký video"},
  "creator.step.image":{ko:"이미지 등록",en:"Register image",ja:"画像登録",zh:"登记图片",th:"ลงทะเบียนรูปภาพ",vi:"Đăng ký hình ảnh"},
  "creator.step.document":{ko:"문서 등록",en:"Register document",ja:"文書登録",zh:"登记文档",th:"ลงทะเบียนเอกสาร",vi:"Đăng ký tài liệu"},
  "creator.step.original":{ko:"원본 등록",en:"Register original",ja:"オリジナル登録",zh:"登记原始文件",th:"ลงทะเบียนต้นฉบับ",vi:"Đăng ký bản gốc"},
  "creator.step.lp":{ko:"LP 음질 (선택)",en:"LP enhancement (optional)",ja:"LP音質（任意）",zh:"LP 音质增强（可选）",th:"ปรับคุณภาพเสียง LP (ไม่บังคับ)",vi:"Nâng cao âm thanh LP (tùy chọn)"},
  "creator.step.rights":{ko:"권리 확인 및 공유",en:"Rights confirmation and sharing",ja:"権利確認と共有",zh:"权利确认与分享",th:"ยืนยันสิทธิ์และแชร์",vi:"Xác nhận quyền và chia sẻ"},
  "creator.audio.heading":{ko:"음원 등록",en:"Register audio",ja:"音源登録",zh:"登记音频",th:"ลงทะเบียนเสียง",vi:"Đăng ký âm thanh"},
  "creator.audio.desc":{ko:"MP3 원본과 기본 정보를 등록한다. 원본은 비공개로 보관되며 권리 확인을 거쳐 TL3로만 공유할 수 있다.",en:"Register the original MP3 and its details. The original remains private and can only be shared as TL3 after rights confirmation.",ja:"MP3のオリジナルと基本情報を登録します。オリジナルは非公開で保管され、権利確認後にTL3としてのみ共有できます。",zh:"登记 MP3 原始文件及基本信息。原始文件将保密保存，完成权利确认后仅可作为 TL3 分享。",th:"ลงทะเบียนไฟล์ MP3 ต้นฉบับและข้อมูลพื้นฐาน ต้นฉบับจะถูกเก็บเป็นส่วนตัวและแชร์ได้เฉพาะ TL3 หลังยืนยันสิทธิ์",vi:"Đăng ký MP3 gốc và thông tin cơ bản. Bản gốc được lưu riêng tư và chỉ có thể chia sẻ dưới dạng TL3 sau khi xác nhận quyền."},
  "creator.video.heading":{ko:"영상 등록",en:"Register video",ja:"動画登録",zh:"登记视频",th:"ลงทะเบียนวิดีโอ",vi:"Đăng ký video"},
  "creator.video.desc":{ko:"MP4 원본과 기본 정보를 등록한다. 원본은 비공개로 보관되며 권리 확인을 거쳐 TL4로만 공유할 수 있다.",en:"Register the original MP4 and its details. The original remains private and can only be shared as TL4 after rights confirmation.",ja:"MP4のオリジナルと基本情報を登録します。オリジナルは非公開で保管され、権利確認後にTL4としてのみ共有できます。",zh:"登记 MP4 原始文件及基本信息。原始文件将保密保存，完成权利确认后仅可作为 TL4 分享。",th:"ลงทะเบียน MP4 ต้นฉบับและข้อมูลพื้นฐาน ต้นฉบับจะถูกเก็บเป็นส่วนตัวและแชร์ได้เฉพาะ TL4 หลังยืนยันสิทธิ์",vi:"Đăng ký MP4 gốc và thông tin cơ bản. Bản gốc được lưu riêng tư và chỉ có thể chia sẻ dưới dạng TL4 sau khi xác nhận quyền."},
  "creator.image.heading":{ko:"이미지 등록",en:"Register image",ja:"画像登録",zh:"登记图片",th:"ลงทะเบียนรูปภาพ",vi:"Đăng ký hình ảnh"},
  "creator.image.desc":{ko:"이미지 원본과 기본 정보를 등록한다. 원본은 비공개로 보관되며 권리 확인을 거쳐 TLJ로만 공유할 수 있다.",en:"Register the original image and its details. The original remains private and can only be shared as TLJ after rights confirmation.",ja:"画像のオリジナルと基本情報を登録します。オリジナルは非公開で保管され、権利確認後にTLJとしてのみ共有できます。",zh:"登记图片原始文件及基本信息。原始文件将保密保存，完成权利确认后仅可作为 TLJ 分享。",th:"ลงทะเบียนรูปภาพต้นฉบับและข้อมูลพื้นฐาน ต้นฉบับจะถูกเก็บเป็นส่วนตัวและแชร์ได้เฉพาะ TLJ หลังยืนยันสิทธิ์",vi:"Đăng ký hình ảnh gốc và thông tin cơ bản. Bản gốc được lưu riêng tư và chỉ có thể chia sẻ dưới dạng TLJ sau khi xác nhận quyền."},
  "creator.document.heading":{ko:"문서 등록",en:"Register document",ja:"文書登録",zh:"登记文档",th:"ลงทะเบียนเอกสาร",vi:"Đăng ký tài liệu"},
  "creator.document.desc":{ko:"문서 원본과 기본 정보를 등록한다. 원본은 비공개로 보관되며 권리 확인을 거쳐 TLD로만 공유할 수 있다.",en:"Register the original document and its details. The original remains private and can only be shared as TLD after rights confirmation.",ja:"文書のオリジナルと基本情報を登録します。オリジナルは非公開で保管され、権利確認後にTLDとしてのみ共有できます。",zh:"登记文档原始文件及基本信息。原始文件将保密保存，完成权利确认后仅可作为 TLD 分享。",th:"ลงทะเบียนเอกสารต้นฉบับและข้อมูลพื้นฐาน ต้นฉบับจะถูกเก็บเป็นส่วนตัวและแชร์ได้เฉพาะ TLD หลังยืนยันสิทธิ์",vi:"Đăng ký tài liệu gốc và thông tin cơ bản. Bản gốc được lưu riêng tư và chỉ có thể chia sẻ dưới dạng TLD sau khi xác nhận quyền."},
  "creator.title":{ko:"제목",en:"Title",ja:"タイトル",zh:"标题",th:"ชื่อเรื่อง",vi:"Tiêu đề"},
  "creator.asset.title.placeholder":{ko:"자산 제목",en:"Asset title",ja:"資産タイトル",zh:"资产标题",th:"ชื่อสินทรัพย์",vi:"Tiêu đề tài sản"},
  "creator.artist":{ko:"아티스트",en:"Artist",ja:"アーティスト",zh:"艺术家",th:"ศิลปิน",vi:"Nghệ sĩ"},
  "creator.genre":{ko:"장르",en:"Genre",ja:"ジャンル",zh:"类型",th:"แนวเพลง",vi:"Thể loại"},
  "creator.genre.custom":{ko:"직접 입력 가능",en:"Enter manually",ja:"直接入力できます",zh:"可手动输入",th:"กรอกเองได้",vi:"Có thể nhập thủ công"},
  "creator.album.desc":{ko:"앨범 / 설명",en:"Album / Description",ja:"アルバム／説明",zh:"专辑 / 说明",th:"อัลบั้ม / คำอธิบาย",vi:"Album / Mô tả"},
  "creator.album.placeholder":{ko:"앨범명 또는 간단한 설명",en:"Album name or a brief description",ja:"アルバム名または簡単な説明",zh:"专辑名称或简短说明",th:"ชื่ออัลบั้มหรือคำอธิบายสั้น ๆ",vi:"Tên album hoặc mô tả ngắn"},
  "creator.drop.mp3":{ko:"MP3 파일을 여기에 놓거나 클릭",en:"Drop an MP3 file here or click to browse",ja:"MP3ファイルをここにドロップするか、クリックして選択",zh:"将 MP3 文件拖放到此处或点击选择",th:"วางไฟล์ MP3 ที่นี่หรือคลิกเพื่อเลือก",vi:"Thả tệp MP3 vào đây hoặc nhấp để chọn"},
  "creator.drop.mp4":{ko:"MP4 파일을 여기에 놓거나 클릭",en:"Drop an MP4 file here or click to browse",ja:"MP4ファイルをここにドロップするか、クリックして選択",zh:"将 MP4 文件拖放到此处或点击选择",th:"วางไฟล์ MP4 ที่นี่หรือคลิกเพื่อเลือก",vi:"Thả tệp MP4 vào đây hoặc nhấp để chọn"},
  "creator.drop.image":{ko:"이미지 파일을 여기에 놓거나 클릭",en:"Drop an image file here or click to browse",ja:"画像ファイルをここにドロップするか、クリックして選択",zh:"将图片文件拖放到此处或点击选择",th:"วางไฟล์รูปภาพที่นี่หรือคลิกเพื่อเลือก",vi:"Thả tệp hình ảnh vào đây hoặc nhấp để chọn"},
  "creator.drop.document":{ko:"문서 파일을 여기에 놓거나 클릭",en:"Drop a document here or click to browse",ja:"文書ファイルをここにドロップするか、クリックして選択",zh:"将文档拖放到此处或点击选择",th:"วางเอกสารที่นี่หรือคลิกเพื่อเลือก",vi:"Thả tài liệu vào đây hoặc nhấp để chọn"},
  "creator.private.storage":{ko:"비공개 원본 보관 · 최대 100MB",en:"Private original storage · up to 100 MB",ja:"オリジナルは非公開で保管 · 最大100MB",zh:"原始文件私密保存 · 最大 100MB",th:"เก็บต้นฉบับเป็นส่วนตัว · สูงสุด 100MB",vi:"Lưu bản gốc riêng tư · tối đa 100MB"},
  "creator.video.file":{ko:"영상 파일",en:"Video file",ja:"動画ファイル",zh:"视频文件",th:"ไฟล์วิดีโอ",vi:"Tệp video"},
  "creator.image.file":{ko:"이미지 파일",en:"Image file",ja:"画像ファイル",zh:"图片文件",th:"ไฟล์รูปภาพ",vi:"Tệp hình ảnh"},
  "creator.document.file":{ko:"문서 파일",en:"Document file",ja:"文書ファイル",zh:"文档文件",th:"ไฟล์เอกสาร",vi:"Tệp tài liệu"},
  "creator.cover.optional":{ko:"커버 이미지 (선택)",en:"Cover image (optional)",ja:"カバー画像（任意）",zh:"封面图片（可选）",th:"ภาพปก (ไม่บังคับ)",vi:"Ảnh bìa (không bắt buộc)"},
  "creator.cover.choose":{ko:"커버 이미지를 선택",en:"Choose a cover image",ja:"カバー画像を選択",zh:"选择封面图片",th:"เลือกภาพปก",vi:"Chọn ảnh bìa"},
  "creator.upload.continue":{ko:"음원 등록하고 계속 →",en:"Register audio and continue →",ja:"音源を登録して続行 →",zh:"登记音频并继续 →",th:"ลงทะเบียนเสียงและดำเนินการต่อ →",vi:"Đăng ký âm thanh và tiếp tục →"},
  "creator.lp.title":{ko:"음질 개선 (LP Enhanced)",en:"Audio Enhancement (LP Enhanced)",ja:"音質向上（LP Enhanced）",zh:"音质增强（LP Enhanced）",th:"ปรับปรุงคุณภาพเสียง (LP Enhanced)",vi:"Nâng cao chất lượng âm thanh (LP Enhanced)"},
  "creator.lp.desc":{ko:"음원의 음질을 개선합니다. LP Enhanced 옵션을 적용하여 아날로그 감성을 더할 수 있습니다. (특허 10-2025-0167813)",en:"Enhance the audio with LP Enhanced to add an analog character. (Patent 10-2025-0167813)",ja:"LP Enhancedオプションで音質を向上させ、アナログの質感を加えます。（特許 10-2025-0167813）",zh:"使用 LP Enhanced 选项改善音质，增添模拟唱片质感。（专利 10-2025-0167813）",th:"ปรับปรุงคุณภาพเสียงด้วย LP Enhanced เพื่อเพิ่มมิติแบบอนาล็อก (สิทธิบัตร 10-2025-0167813)",vi:"Cải thiện chất lượng âm thanh bằng LP Enhanced để tạo chất âm analog. (Bằng sáng chế 10-2025-0167813)"},
  "creator.lp.continue":{ko:"음질 개선하고 계속",en:"Enhance audio and continue",ja:"音質を向上して続行",zh:"增强音质并继续",th:"ปรับปรุงเสียงและดำเนินการต่อ",vi:"Nâng cao âm thanh và tiếp tục"},
  "creator.lp.cost.label":{ko:"비용 1000TL",en:"Cost: 1,000 TL",ja:"費用：1,000 TL",zh:"费用：1,000 TL",th:"ค่าใช้จ่าย 1,000 TL",vi:"Chi phí: 1.000 TL"},
  "creator.lp.preview.original":{ko:"▶ 원본 10초",en:"▶ Original · 10 sec",ja:"▶ オリジナル・10秒",zh:"▶ 原始音频 · 10 秒",th:"▶ ต้นฉบับ · 10 วินาที",vi:"▶ Bản gốc · 10 giây"},
  "creator.lp.preview.enhanced":{ko:"▶ LP Enhanced 10초",en:"▶ LP Enhanced · 10 sec",ja:"▶ LP Enhanced・10秒",zh:"▶ LP Enhanced · 10 秒",th:"▶ LP Enhanced · 10 วินาที",vi:"▶ LP Enhanced · 10 giây"},
  "creator.lp.ready":{ko:"원본 등록 후 활성화",en:"Available after original is registered",ja:"オリジナル登録後に有効になります",zh:"登记原始文件后启用",th:"ใช้งานได้หลังลงทะเบียนต้นฉบับ",vi:"Khả dụng sau khi đăng ký bản gốc"},
  "creator.lp.license":{ko:"🎚️ LP 음질 향상 적용",en:"🎚️ Apply LP audio enhancement",ja:"🎚️ LP音質向上を適用",zh:"🎚️ 应用 LP 音质增强",th:"🎚️ ใช้การปรับปรุงเสียง LP",vi:"🎚️ Áp dụng nâng cao âm thanh LP"},
  "creator.lp.notice.title":{ko:"분산화 원칙",en:"Decentralization principle",ja:"分散化の原則",zh:"去中心化原则",th:"หลักการกระจายศูนย์",vi:"Nguyên tắc phi tập trung"},
  "creator.lp.notice.desc":{ko:"LP 처리 결과는 서버에 저장되지 않습니다.<br>라이선스 메타만 기록:",en:"LP processing results are not stored on the server.<br>Only license metadata is recorded:",ja:"LP処理結果はサーバーに保存されません。<br>ライセンスのメタデータのみを記録します：",zh:"LP 处理结果不会存储在服务器上。<br>仅记录许可证元数据：",th:"ผลการประมวลผล LP จะไม่ถูกจัดเก็บบนเซิร์ฟเวอร์<br>บันทึกเฉพาะเมตาดาต้าของใบอนุญาต:",vi:"Kết quả xử lý LP không được lưu trên máy chủ.<br>Chỉ ghi lại siêu dữ liệu giấy phép:"},
  "creator.lp.balance":{ko:"현재 잔액",en:"Current balance",ja:"現在の残高",zh:"当前余额",th:"ยอดคงเหลือปัจจุบัน",vi:"Số dư hiện tại"},
  "creator.lp.deduct":{ko:"LP 적용 시 차감",en:"Deducted when LP is applied",ja:"LP適用時の差引額",zh:"应用 LP 时扣除",th:"หักเมื่อใช้ LP",vi:"Khấu trừ khi áp dụng LP"},
  "creator.lp.after":{ko:"예상 잔액",en:"Estimated balance",ja:"予想残高",zh:"预计余额",th:"ยอดคงเหลือโดยประมาณ",vi:"Số dư dự kiến"},
  "creator.back":{ko:"← 이전",en:"← Back",ja:"← 戻る",zh:"← 上一步",th:"← ย้อนกลับ",vi:"← Quay lại"},
  "creator.status.lookup.fail":{ko:"조회 실패",en:"Lookup failed",ja:"照会に失敗しました",zh:"查询失败",th:"ค้นหาไม่สำเร็จ",vi:"Tra cứu thất bại"},
  "creator.status.original.check":{ko:"원본 권리 및 메타데이터 확인 중…",en:"Checking original rights and metadata…",ja:"オリジナルの権利とメタデータを確認中…",zh:"正在检查原始文件权利和元数据…",th:"กำลังตรวจสอบสิทธิ์และเมตาดาต้าของต้นฉบับ…",vi:"Đang kiểm tra quyền và siêu dữ liệu của bản gốc…"},
  "creator.status.original.upload":{ko:"원본 등록 중…",en:"Registering original…",ja:"オリジナルを登録中…",zh:"正在登记原始文件…",th:"กำลังลงทะเบียนต้นฉบับ…",vi:"Đang đăng ký bản gốc…"},
  "creator.status.original.compare":{ko:"원본 ↔ LP A/B 비교 가능",en:"Original ↔ LP A/B comparison available",ja:"オリジナル ↔ LP A/B比較が可能です",zh:"可进行原始音频 ↔ LP A/B 对比",th:"พร้อมเปรียบเทียบต้นฉบับ ↔ LP แบบ A/B",vi:"Có thể so sánh A/B bản gốc ↔ LP"},
  "creator.status.lp.analyze":{ko:"LP 재생 파라미터 분석 중...",en:"Analyzing LP playback parameters…",ja:"LP再生パラメータを分析中…",zh:"正在分析 LP 播放参数…",th:"กำลังวิเคราะห์พารามิเตอร์การเล่น LP…",vi:"Đang phân tích thông số phát LP…"},
  "creator.status.lp.ready":{ko:"✓ LP 실시간 재생 설정 완료",en:"✓ LP real-time playback configured",ja:"✓ LPリアルタイム再生の設定が完了しました",zh:"✓ LP 实时播放设置完成",th:"✓ ตั้งค่าการเล่น LP แบบเรียลไทม์แล้ว",vi:"✓ Đã thiết lập phát LP theo thời gian thực"},
  "creator.status.lp.fail":{ko:"LP 설정 실패: ",en:"LP setup failed: ",ja:"LP設定に失敗しました：",zh:"LP 设置失败：",th:"ตั้งค่า LP ไม่สำเร็จ: ",vi:"Thiết lập LP thất bại: "},
  "creator.status.lp.continue":{ko:"TL3 등록하러 가기 →",en:"Continue to TL3 registration →",ja:"TL3登録へ進む →",zh:"前往登记 TL3 →",th:"ไปลงทะเบียน TL3 →",vi:"Tiếp tục đăng ký TL3 →"},
  "creator.status.retry":{ko:"다시 시도",en:"Try again",ja:"再試行",zh:"重试",th:"ลองอีกครั้ง",vi:"Thử lại"},
  "creator.status.decode":{ko:"디코딩 중...",en:"Decoding…",ja:"デコード中…",zh:"正在解码…",th:"กำลังถอดรหัส…",vi:"Đang giải mã…"},
  "creator.status.preview.fail":{ko:"프리뷰 실패: ",en:"Preview failed: ",ja:"プレビューに失敗しました：",zh:"预览失败：",th:"พรีวิวไม่สำเร็จ: ",vi:"Xem trước thất bại: "},
  "creator.error.required":{ko:"제목, 아티스트, MP3 파일을 모두 입력해야 합니다.",en:"Enter a title, artist, and MP3 file.",ja:"タイトル、アーティスト、MP3ファイルをすべて入力してください。",zh:"请填写标题、艺术家并选择 MP3 文件。",th:"กรุณากรอกชื่อเรื่อง ศิลปิน และเลือกไฟล์ MP3",vi:"Vui lòng nhập tiêu đề, nghệ sĩ và chọn tệp MP3."},
  "creator.error.rights":{ko:"권리 확인에 동의해야 TL3로 공유할 수 있습니다.",en:"You must confirm the rights to share as TL3.",ja:"TL3として共有するには、権利確認への同意が必要です。",zh:"必须同意权利确认，才能分享为 TL3。",th:"คุณต้องยืนยันสิทธิ์ก่อนแชร์เป็น TL3",vi:"Bạn phải xác nhận quyền trước khi chia sẻ dưới dạng TL3."},
  "creator.error.balance":{ko:"TL 잔액이 부족합니다. (필요: 1,000 TL / 보유: ",en:"Insufficient TL balance. (Required: 1,000 TL / Available: ",ja:"TL残高が不足しています。（必要：1,000 TL／保有：",zh:"TL 余额不足。（所需：1,000 TL / 当前：",th:"ยอด TL ไม่เพียงพอ (ต้องใช้: 1,000 TL / คงเหลือ: ",vi:"Số dư TL không đủ. (Cần: 1.000 TL / Hiện có: "},
  "creator.error.original.missing":{ko:"원본 음원이 없습니다.",en:"Original audio is missing.",ja:"オリジナル音源がありません。",zh:"缺少原始音频。",th:"ไม่พบไฟล์เสียงต้นฉบับ",vi:"Thiếu tệp âm thanh gốc."},
  "creator.error.lp.module":{ko:"LP DSP 모듈을 불러오지 못했습니다.",en:"Could not load the LP DSP module.",ja:"LP DSPモジュールを読み込めませんでした。",zh:"无法加载 LP DSP 模块。",th:"ไม่สามารถโหลดโมดูล LP DSP ได้",vi:"Không thể tải mô-đun LP DSP."},
  "creator.error.original.register":{ko:"원본 자산 등록 실패",en:"Original asset registration failed",ja:"オリジナル資産の登録に失敗しました",zh:"原始资产登记失败",th:"ลงทะเบียนสินทรัพย์ต้นฉบับไม่สำเร็จ",vi:"Đăng ký tài sản gốc thất bại"},
  "creator.error.original.process":{ko:"원본 자산 처리가 완료되지 않았습니다. 다시 시도해주세요.",en:"Original asset processing is incomplete. Please try again.",ja:"オリジナル資産の処理が完了していません。もう一度お試しください。",zh:"原始资产处理尚未完成，请重试。",th:"การประมวลผลสินทรัพย์ต้นฉบับยังไม่เสร็จสิ้น โปรดลองอีกครั้ง",vi:"Quá trình xử lý tài sản gốc chưa hoàn tất. Vui lòng thử lại."},
  "creator.error.engine":{ko:"공통 TL3 제조 엔진을 불러오지 못했습니다. 새로고침 후 다시 시도해 주세요.",en:"Could not load the shared TL3 manufacturing engine. Refresh and try again.",ja:"共通TL3製造エンジンを読み込めませんでした。再読み込みしてお試しください。",zh:"无法加载通用 TL3 制作引擎。请刷新页面后重试。",th:"ไม่สามารถโหลดเอนจินสร้าง TL3 ส่วนกลางได้ โปรดรีเฟรชแล้วลองอีกครั้ง",vi:"Không thể tải công cụ tạo TL3 dùng chung. Vui lòng tải lại trang và thử lại."},
});

Object.assign(T,{
  "creator.release.title":{ko:"TL3 등록 및 공유",en:"Register and share TL3",ja:"TL3の登録と共有",zh:"登记并分享 TL3",th:"ลงทะเบียนและแชร์ TL3",vi:"Đăng ký và chia sẻ TL3"},
  "creator.release.desc":{ko:"음원은 디지털 자산으로 변환되어 모든 사람과 공유됩니다. 공유 후에는 변환을 되돌릴 수 없으며, 이후 보상은 플랫폼 정산 체계를 통해 지급됩니다.",en:"Your audio is converted into a digital asset and shared. This conversion cannot be reversed; subsequent rewards are paid through the platform's settlement system.",ja:"音源はデジタル資産に変換され、すべての人と共有されます。共有後は変換を元に戻せません。その後の報酬はプラットフォームの精算システムを通じて支払われます。",zh:"音频将转换为数字资产并与所有人分享。分享后无法撤销转换，后续奖励将通过平台结算系统支付。",th:"เสียงจะถูกแปลงเป็นสินทรัพย์ดิจิทัลและแชร์กับทุกคน หลังแชร์แล้วไม่สามารถย้อนกลับการแปลงได้ รางวัลหลังจากนั้นจะจ่ายผ่านระบบชำระบัญชีของแพลตฟอร์ม",vi:"Âm thanh được chuyển thành tài sản số và chia sẻ với mọi người. Sau khi chia sẻ, không thể hoàn tác chuyển đổi; các khoản thưởng tiếp theo được chi trả qua hệ thống quyết toán của nền tảng."},
  "creator.irreversible":{ko:"TL3 불가역 변환",en:"Irreversible TL3 conversion",ja:"TL3への不可逆変換",zh:"TL3 不可逆转换",th:"การแปลง TL3 แบบย้อนกลับไม่ได้",vi:"Chuyển đổi TL3 không thể đảo ngược"},
  "creator.irreversible.desc":{ko:"이 단계에서 원본이 TL3로 제조되며, 제조된 자산은 MP3로 되돌릴 수 없습니다.",en:"At this stage, the original is processed into TL3. The resulting asset cannot be converted back to MP3.",ja:"この段階でオリジナルをTL3に変換します。変換後の資産をMP3に戻すことはできません。",zh:"在此步骤中，原始文件将制作为 TL3。生成的资产无法还原为 MP3。",th:"ในขั้นตอนนี้ ต้นฉบับจะถูกผลิตเป็น TL3 และไม่สามารถแปลงสินทรัพย์ที่ผลิตแล้วกลับเป็น MP3 ได้",vi:"Ở bước này, bản gốc được tạo thành TL3. Tài sản đã tạo không thể chuyển ngược lại thành MP3."},
  "creator.release.button":{ko:"TL3 등록하고 공유하기",en:"Register and share TL3",ja:"TL3を登録して共有",zh:"登记并分享 TL3",th:"ลงทะเบียนและแชร์ TL3",vi:"Đăng ký và chia sẻ TL3"},
  "creator.done.title":{ko:"TL3 자산 등록 완료",en:"TL3 asset registered",ja:"TL3資産の登録完了",zh:"TL3 资产登记完成",th:"ลงทะเบียนสินทรัพย์ TL3 แล้ว",vi:"Đã đăng ký tài sản TL3"},
  "creator.done.new":{ko:"새 음악 올리기",en:"Register new music",ja:"新しい音楽を登録",zh:"上传新音乐",th:"ลงทะเบียนเพลงใหม่",vi:"Đăng ký nhạc mới"},
  "creator.done.view":{ko:"SharePlace에서 확인하기",en:"View in SharePlace",ja:"SharePlaceで確認",zh:"前往 SharePlace 查看",th:"ดูใน SharePlace",vi:"Xem trong SharePlace"},

});

var _lang=detectLang();

/* ── 번역 함수 ── */
function t(key,fallback){
  var row=T[key];
  if(!row) return fallback||key;
  return row[_lang]||fallback||row['ko']||key;
}

/* Exact-copy fallback for legacy pages that have not yet been annotated with data-i18n. */
var AUTO_KO_EN={
'로그인':'Login','회원가입':'Sign up','다시 오셨군요':'Welcome back','계속 Pulse를 쌓아보세요':'Keep building your Pulse','이메일':'Email','비밀번호':'Password','비밀번호를 잊으셨나요?':'Forgot password?','또는':'OR','무료 가입':'Sign up free','계정 만들기':'Create account','비밀번호 확인':'Confirm password','닉네임':'Display name','가입하고 시작하기':'Create account and continue','이미 계정이 있으신가요?':'Already have an account?','인증 완료':'Verified','코드 재발송':'Resend code','확인':'Confirm','취소':'Cancel','닫기':'Close','저장':'Save','수정':'Edit','삭제':'Delete','완료':'Done','다음':'Next','이전':'Back','검색':'Search','적용':'Apply','로그아웃':'Log out',
'대시보드':'Dashboard','홈':'Home','지갑':'Wallet','TLC 채굴':'TLC Mining','내 콘텐츠':'My Assets','미션':'Missions','바로가기':'Quick Links','TL방송국':'TimeLink Radio','크리에이터 센터':'Creator Studio','카페 채널':'Cafe Channels','TL 잔액':'TL Balance','TLC 보유량':'TLC Balance','오늘 POC':'Today’s POC','기여 점수':'Contribution Score','업로드한 파일':'Uploaded Assets','파일 업로드':'Upload Asset','방송 청취':'Listen to Broadcast','카페방송':'Cafe Broadcast','TL 총 잔액':'Total TL Balance','+ TL 충전':'+ Add TL','채굴 현황':'Mining Status','오늘 POC 점수':'Today’s POC Score','누적 TLC 채굴량':'Total TLC Mined','POC 기여 지수':'POC Contribution Index','채굴 내역':'Mining History','로딩 중...':'Loading…','전체 파일':'All Assets','총 재생 수':'Total Plays','수익 TL':'Rewards (TL)','총 Pulse':'Total Pulse','새 파일 업로드':'Upload New Asset','전체 선택':'Select All','선택 삭제':'Delete Selected','방송 시작':'Start Broadcast','방송 중인 곡':'Now Playing','전체 보기 →':'View all →','최신순':'Latest','인기순':'Popular','전체 자산':'All Assets','음악':'Music','영상':'Video','문서':'Documents','TL 충전':'Add TL','결제하기':'Pay','결제 금액':'Payment Amount','지급 TL':'TL to Receive','현재 잔액':'Current Balance','거래내역':'Transactions','내역':'History','복사':'Copy','제목':'Title','아티스트':'Artist','앨범':'Album','장르':'Genre','설명':'Description','공개 범위 설정':'Set Visibility','공개 범위':'Visibility','공개 방식':'Sharing Method','권리 확인':'Rights Verification','권리보호형':'Rights Protected','발행 수수료':'Issuance Fee','정지':'Stop','재생':'Play','일시정지':'Pause','공유하기':'Share','링크 복사':'Copy Link','플레이리스트에 추가':'Add to Playlist','새 플레이리스트 만들기':'Create Playlist','악보':'Sheet Music',
'사용시간에 따라 보상이 산정됩니다':'Rewards are calculated based on usage time','시간을 충전하고, 사용한 만큼만 지불합니다.':'Add time and pay only for what you use.','10시간 TL 충전':'Add 10 hours of TL','40분 사용':'40 minutes used','사용 측정 · 차감':'Usage measured · deducted','9시간 20분 남음':'9 hours 20 minutes remaining','창작자 정산':'Creator settlement','하나의 Core Engine에 형식별 Adapter-Viewer만 추가합니다.':'One Core Engine with format-specific adapters and viewers.','음악 자산 등록 및 관리':'Register and manage music assets','TL3 공유 조건 직접 설정':'Set TL3 sharing terms','사용시간 기반 정산':'Usage-time-based rewards','카페방송 B2B':'B2B cafe broadcasting','지금 공유되는 음악':'Music shared now','창작자가 공유한 음악 자산과 트랙을 살펴보세요.':'Explore music assets and tracks shared by creators.','음악 자산을 불러오는 중...':'Loading music assets…','모든 음악 자산 보기 →':'Explore all music assets →','☕ 카페를 위한 24시간 라디오':'☕ 24/7 Radio for Cafes','카페 시작하기':'Get Started','유료화를 강요하지 않습니다':'Monetization is your choice','창작자가 공개 범위와 공유 조건, 권리 정책을 직접 결정합니다.':'Creators control visibility, sharing terms, and rights policies.','기여와 보상 연결':'Contribution and Rewards','플랫폼에 대한 기여를 경제적으로 측정합니다.':'Measure contributions to the platform economically.','콘텐츠 측면':'Content Contributions','생태계 측면':'Ecosystem Contributions','콘텐츠 제작':'Content Creation','추천·공유':'Recommend · Share','POC 측정':'POC Measurement','Index 산출':'Calculate Index','TLC 보상':'TLC Rewards','콘텐츠 데이터':'Content Data','사용 데이터':'Usage Data','수익 데이터':'Reward Data','AI 예측':'AI Forecasting','금융 연계':'Financial Integration','법률':'Legal','연구':'Research','금융':'Finance','기업':'Business','컨설팅':'Consulting','엔지니어링':'Engineering','교육':'Education','← 대시보드':'← Dashboard','처리 중...':'Processing…','잠시만 기다려주세요':'Please wait','원본 MP3 선택':'Select Original MP3','원본 MP3를 여기에 놓으세요':'Drop the original MP3 here','전체 제거':'Remove All','디지털 자산 정보 입력':'Enter Digital Asset Details','초당 차감 TL':'TL deducted per second','보상 정책':'Reward Policy','일반 음질':'Standard Quality','장르 (Spotify)':'Genre (Spotify)','선택 안 함':'None selected','작곡':'Composer','작사':'Lyricist','프로듀서':'Producer','가사':'Lyrics','TL / 월':'TL / month','창작자':'Creator','이용자와 커뮤니티':'Users and Community','오프라인 사업자':'Offline Businesses','기업과 기관':'Enterprises and Institutions','공유된 디지털 자산이 여기에 표시됩니다.':'Shared digital assets will appear here.','공유된 음악 자산이 여기에 표시됩니다.':'Shared music assets will appear here.','공유 자산을 일시적으로 불러올 수 없습니다.':'Shared assets are temporarily unavailable.','TL 잔량':'TL Remaining','초당 소모':'Per-second Usage','⚠️ TL 부족!':'⚠️ Insufficient TL!','TL 충전하기':'Add TL','이용약관':'Terms of Service','개인정보 처리방침':'Privacy Policy','개인정보처리방침':'Privacy Policy','크리에이터 정책':'Creator Policy','광고 센터':'Advertising Center','광고주 센터':'Advertiser Center','DJ 가이드':'DJ Guide','서비스':'Services','법적 정보':'Legal','내역 보기':'View History','연결':'Connect','연결 해제':'Disconnect','신청':'Apply','상세 보기':'View Details',
'Digital value,':'디지털 가치,','connected by time.':'시간으로 연결됩니다.','DIGITAL ASSET RIGHTS & DISTRIBUTION':'디지털 자산 권리 및 유통','Explore TimeLink':'타임링크 둘러보기','Explore SharePlace':'공유 공간 둘러보기','Creator-controlled rights':'창작자 중심 권리 관리','Time-based access':'시간 기반 접근','Contribution economy':'기여 경제','Multi-format assets':'다양한 형식의 자산','One connected ecosystem':'하나로 연결된 생태계','One platform.':'하나의 플랫폼.','Multiple ways to create value.':'다양한 가치 창출 방식.','Create & Register':'생성 및 등록','Share & Access':'공유 및 이용','Measure & Reward':'측정 및 보상','Digital asset standards':'디지털 자산 표준','Different formats.':'서로 다른 형식.','One rights infrastructure.':'하나의 권리 인프라.','Music & Audio':'음악 및 오디오','Digital Collections':'디지털 컬렉션','Product Portfolio':'제품 구성','How it works':'작동 방식','Creator Economy':'창작자 경제','Contribution Economy':'기여 경제','POC — Proof of Contribution':'POC — 기여 증명','AI Prediction · Financial Integration':'AI 예측 · 금융 연계','For Business · Digital Usage Rights':'기업용 · 디지털 사용 권리','Connected Participants':'참여자 연결','Built for the whole ecosystem':'생태계 전체를 위한 플랫폼','Purpose-built experiences.':'목적에 맞춘 이용 경험.','Creators':'창작자','Community':'커뮤니티','Broadcast':'방송','Businesses':'기업','Discover what creators share.':'창작자가 공유하는 자산을 발견하세요.','Your digital assets.':'나의 디지털 자산.','Your rights. Your possibilities.':'나의 권리, 나의 가능성.','Start with TimeLink':'타임링크 시작하기','Create your account':'계정 만들기','All rights reserved.':'All rights reserved.'
};
/* ── 자동 번역 확장 (2026-10-16) ── */
Object.assign(AUTO_KO_EN,{
"결제 확인':": "Payment Confirmation':",
"교환':": "Exchange':",
"국내 결제": "Domestic Payment",
"금융": "Finance",
"기부": "Donation",
"기여 지수": "Contribution Index",
"남음": "Remaining",
"내 음악  \n           ACTIVITY": "My Music\n           ACTIVITY",
"내역": "History",
"다.": ".",
"로 보내기 \n             0개": " to send\n             0 items",
"로그아웃": "Logout",
"로파이/칠": "Lo-fi/Chill",
"발생! msState": "occurred! msState",
"방송 보기": "View Broadcast",
"배율": "Multiplier",
"법률": "Legal",
"새탭으로 열기": "Open in New Tab",
"스타벅스 강남  2026.03.08 11:00  \n             +12,340 TL": "Starbucks Gangnam  2026.03.08 11:00\n             +12,340 TL",
"스타벅스 강남점": "Starbucks Gangnam",
"시작하기": "Get Started",
"시청당 300 TL": "300 TL per view",
"신용카드": "Credit Card",
"언제든 해지 가능": "Cancel anytime",
"엔지니어링": "Engineering",
"연결 1차": "Connection Primary",
"연구": "Research",
"열람 시간만큼 차감됩니다": "Charged per viewing time",
"원 · 충전 즉시 사용 가능": "KRW · Usable immediately after top-up",
"원본 보안 \n               100%": "Source Security\n               100%",
"음질": "Audio Quality",
"이미지": "Image",
"일렉트로닉": "Electronic",
"잔액이 부족합니다. SharePlace에서 TL을 충전해주세요.": "Insufficient balance. Please add TL from SharePlace.",
"지수": "Index",
"채굴 배율": "Mining Multiplier",
"채굴':": "Mining':",
"채널 ID": "Channel ID",
"채널 개설 혜택": "Channel Setup Benefits",
"초기화": "Reset",
"초당 소모  1 TL/s": "Per-second Usage  1 TL/s",
"최소 10,000 TL": "Minimum 10,000 TL",
"카카오페이": "KakaoPay",
"컨설팅": "Consulting",
"콘솔": "Console",
"쿠폰": "Coupon",
"크리에이터 센터": "Creator Center",
"토스페이": "TossPay",
"토큰 없음 n": "No token n",
"통계": "Statistics",
"투자 정보": "Investment Info",
"파일 변환 수익": "Asset Conversion Rewards",
"플랜 A": "Plan A",
"해외 카드": "Overseas Card",
"회원가입": "Sign Up",
"힙합/R": "Hip-Hop/R",
"가 자동으로 실행되며 TL 잔액 확인 후 재생합니다.": " runs automatically, checks TL balance, then plays.",
"가 지급됩니다": " is rewarded",
"가장 많이 소비된 콘텐츠 실시간 순위": "Real-time ranking of most-consumed content",
"각자의 목적에 맞게 디지털 자산을 공유하고 활용합니다.": "Share and utilize digital assets for your own purpose.",
"개 곡을 완전히 삭제하시겠습니까?": "Delete these tracks permanently?",
"개인 원본 · 비공개": "Private Source · Hidden",
"개인 자산": "Personal Assets",
"개인정보 보호법": "Personal Information Protection Act",
"경제 시스템": "Economic System",
"고객 곡 신청": "Customer Song Requests",
"곡 제목": "Track Title",
"곡 종료 → 자동 진행": "Track ends → auto next",
"공유 파일  0": "Shared Files  0",
"공지 / 이벤트": "Notice / Events",
"공지 노출 설정": "Notice Display Settings",
"관리자 액션 로그": "Admin Action Log",
"광고 등록하기": "Register Ad",
"광고 보러 가기": "Watch Ads",
"광고 유형별 단가": "Ad Type Rates",
"광고주 현황": "Advertiser Status",
"국세청 API 연동 예정": "NTS API integration planned",
"권장": "Recommended",
"기여지수": "Contribution Index",
"기존 운영 기능은 그대로 유지됩니다.": "Existing operational features are preserved.",
"날짜 정보 없음": "No date info",
"내 광고": "My Ads",
"내 방송 계약": "My Broadcast Contracts",
"내 오늘 POC": "My Today's POC",
"내 음악": "My Music",
"내 콘텐츠": "My Content",
"내 프로필": "My Profile",
"뉴에이지": "New Age",
"닉네임": "Nickname",
"다시 시도": "Retry",
"다음 곡": "Next Track",
"담당자명": "Contact Person",
"대표이사": "CEO",
"댓글": "Comments",
"드라이브 테마": "Drive Theme",
"라이브러리':": "Library':",
"라틴": "Latin",
"레게": "Reggae",
"리스트": "List",
"만료 채널  갱신 필요": "Expired Channel  Renewal needed",
"맑음 24": "Clear 24",
"매월 자동 갱신": "Auto-renews monthly",
"메탈": "Metal",
"목록": "List",
"무료 기간 종료일": "Free Period End Date",
"문서  TLD": "Documents  TLD",
"미디어 소재": "Media Material",
"발행": "Publish",
"발행 후 예상 잔액": "Estimated Balance After Publish",
"발행 후 잔액": "Balance After Publish",
"방송 대기 중": "Waiting to Broadcast",
"방송 보기':": "View Broadcast':",
"방송 세트": "Broadcast Sets",
"방송 세트':": "Broadcast Sets':",
"방송 세트가 없습니다.": "No broadcast sets.",
"방송 유형 선택": "Select Broadcast Type",
"방송 종료": "End Broadcast",
"방송할 카페 찾기':": "Find Cafes to Broadcast':",
"배율':": "Multiplier':",
"보기": "View",
"보안/접근 로그": "Security/Access Log",
"복사 완료": "Copied",
"분포": "Distribution",
"불러오는 중": "Loading",
"블루스": "Blues",
"비 18": "Rain 18",
"비밀번호": "Password",
"비밀번호 변경": "Change Password",
"비밀번호 확인": "Confirm Password",
"비용 최적화 현황": "Cost Optimization Status",
"빠른 충전": "Quick Top-up",
"빠른충전": "Quick Top-up",
"사업자": "Business",
"사업자번호": "Business Number",
"사이드바 배너": "Sidebar Banner",
"상품": "Product",
"새 음원 등록": "Register New Track",
"새 카페 채널 개설": "Create New Cafe Channel",
"새 파일 등록": "Register New File",
"선택 파일": "Select File",
"선택 파일':": "Select File':",
"선택해주세요": "Please select",
"세트 없음": "No sets",
"센터 가기": "Go to Center",
"셔플": "Shuffle",
"셔플 OFF": "Shuffle OFF",
"소비": "Consumption",
"소속": "Affiliation",
"소울": "Soul",
"소재 규격": "Material Spec",
"수령 완료!": "Claimed!",
"수령!": "Claimed!",
"수령하기": "Claim",
"수입": "Revenue",
"스트립": "Strip",
"승인 처리": "Approve",
"시간대별 재생 패턴": "Hourly Playback Pattern",
"시작하기!": "Get Started!",
"시청당 150 TL": "150 TL per view",
"실시간 현황": "Real-time Status",
"심박수 연동": "Heart Rate Sync",
"야간 모드": "Night Mode",
"야간모드": "Night Mode",
"얼터너티브": "Alternative",
"연결 준비 중": "Preparing Connection",
"열기": "Open",
"영상  TL4": "Video  TL4",
"오늘 결제": "Today's Payment",
"완료 정산  이번 달": "Settled  This Month",
"요청 75% 감소": "Requests reduced 75%",
"원본 MP3 선택": "Select Original MP3",
"월 TL": "Monthly TL",
"월 예상 비용": "Estimated Monthly Cost",
"월드뮤직": "World Music",
"월소비": "Monthly Consumption",
"유저 관리  0  \n   도구": "User Management  0\n   Tools",
"윤리 검사": "Ethics Check",
"음성 인식 중...": "Recognizing speech...",
"음성 제어": "Voice Control",
"음악 분석": "Music Analysis",
"음원  TL3": "Track  TL3",
"음원 롤링": "Track Rolling",
"이디야 홍대점": "Ediya Hongdae",
"이메일": "Email",
"이미지  TLJ": "Image  TLJ",
"이코노미 흐름": "Economy Flow",
"인기 TOP 10": "Popular TOP 10",
"인기 분위기  가장 많이 선택": "Popular Mood  Most Selected",
"인기 선곡 TOP 10": "Popular Selections TOP 10",
"인기 트랙 TOP 5": "Popular Tracks TOP 5",
"인기':": "Popular':",
"인증 실패": "Authentication Failed",
"인카방송": "In-Car Broadcast",
"인프라 현황": "Infrastructure Status",
"인프라/비용": "Infrastructure / Cost",
"일괄 정산 실행": "Run Batch Settlement",
"일렉트로니카": "Electronica",
"일반": "Standard",
"입력": "Input",
"자동변환 적용": "Auto-conversion applied",
"잔액 부족": "Insufficient Balance",
"장르 분포": "Genre Distribution",
"장르 수  등록 카테고리": "Genres  Registered Categories",
"재무 요약": "Financial Summary",
"재무 현황": "Financial Status",
"재생 완료": "Playback Complete",
"저작권 침해 신고:  dmca": "Copyright Infringement Report:  dmca",
"저장 및 전체 페이지 반영": "Save & Apply to All Pages",
"저장 및 즉시 적용": "Save & Apply Instantly",
"저장소 상태 조회 실패": "Failed to Fetch Storage Status",
"적립": "Earn",
"전체 DJ": "All DJs",
"전체 승인": "Approve All",
"정산 대기  처리 필요": "Pending Settlement  Action needed",
"정산 대기 크리에이터": "Creators Pending Settlement",
"정산 처리": "Process Settlement",
"정지됨": "Stopped",
"제조 실패": "Manufacturing Failed",
"종류 안내": "Type Guide",
"주소": "Address",
"주의사항": "Notes",
"지원 대기": "Pending Support",
"지원 현황": "Support Status",
"지출": "Expense",
"차감률": "Deduction Rate",
"창작권 증명서": "Creator Rights Certificate",
"창작권 증명서 뷰어": "Creator Rights Certificate Viewer",
"창작권 증명서 신청": "Request Creator Rights Certificate",
"채널 기본 정보": "Channel Basic Info",
"채널 소개글": "Channel Description",
"채널수": "Channels",
"총 광고 예산 TL": "Total Ad Budget TL",
"총 유저": "Total Users",
"최소 5,000 TL": "Minimum 5,000 TL",
"충전/차감": "Top-up/Deduction",
"카드": "Card",
"카카오톡": "KakaoTalk",
"카페 이미지": "Cafe Images",
"카페 찾기": "Find Cafes",
"카페 채널 개설": "Create Cafe Channel",
"카페 채널 목록": "Cafe Channel List",
"캐시에서 즉시 로드": "Loaded instantly from cache",
"코드 재발송": "Resend Code",
"크리에이터": "Creator",
"크리에이터별 수익": "Per-Creator Rewards",
"타입": "Type",
"탐색": "Explore",
"테스트 광고 생성": "Create Test Ad",
"테크노": "Techno",
"트랙이 없습니다.": "No tracks.",
"트로트": "Trot",
"파일 준비 중...": "Preparing file...",
"파일이 없습니다.": "No files.",
"팝업 미리보기": "Popup Preview",
"펑크": "Punk",
"펑크록": "Punk Rock",
"포맷  .tl v1": "Format  .tl v1",
"포크락": "Folk Rock",
"푸터 관리": "Footer Management",
"플레이어": "Player",
"하우스": "House",
"합산": "Sum",
"현재 기준": "Current Criteria",
"현황": "Status",
"확인 대기": "Pending Confirmation",
"활동 중": "Active",
"활성 계약": "Active Contracts",
"활성 광고": "Active Ads",
"후 적립": " and earn",
"힙합": "Hip-Hop"
});

var AUTO_EN_KO={};Object.keys(AUTO_KO_EN).forEach(function(k){AUTO_EN_KO[AUTO_KO_EN[k]]=k;});
var AUTO_TITLES={
'TimeLink — 대시보드':'TimeLink — Dashboard','로그인 — TimeLink':'Login — TimeLink','회원가입 — TimeLink':'Sign Up — TimeLink',
'TimeLink — 지갑 & 채굴':'TimeLink — Wallet & Mining','TimeLink - 트랙 상세':'TimeLink — Track Details',
'TL방송국 — 카페 채널 개설':'TimeLink Radio — Create Cafe Channel','TL방송국 — 인카 채널 개설':'TimeLink Radio — Create In-Car Channel',
'광고주 센터 — TimeLink':'Advertiser Center — TimeLink','TL 광고 센터 — TimeLink':'TL Ads Center — TimeLink',
'TimeLink — 카페 주인 센터':'TimeLink — Cafe Owner Center','DJ 센터 — TimeLink':'DJ Center — TimeLink',
'DJ 콘솔 — TimeLink':'DJ Console — TimeLink','DJ 가이드 — TimeLink':'DJ Guide — TimeLink',
'개인정보처리방침 — TimeLink':'Privacy Policy — TimeLink','이용약관 — TimeLink':'Terms of Service — TimeLink',
'저작권 정책 - TimeLink':'Creator Rights Policy — TimeLink','크리에이터 정책 — TimeLink':'Creator Policy — TimeLink',
'TimeLink Player 다운로드':'Download TimeLink Player','TimeLink · TL3 플레이어':'TimeLink · TL3 Player',
'TimeLink TLJ Viewer - 창작권 증명서':'TimeLink TLJ Viewer — Rights Certificate',
'TL 라이브 라디오 — TimeLink':'TimeLink Live Radio','TL 라이브 플레이어':'TimeLink Live Player',
'TimeLink — 온보딩':'TimeLink — Onboarding','결제 실패 - TimeLink':'Payment Failed — TimeLink',
'결제 완료 - TimeLink':'Payment Complete — TimeLink','B2B · 투자 정보 — TimeLink':'B2B · Business Information — TimeLink'
};

Object.assign(AUTO_KO_EN,{
'광고주':'Advertiser','광고 제목':'Ad Title','광고 로딩 중...':'Loading ads…','시청 완료 시 TL 적립':'Earn TL after watching','시청 완료 후 적립 가능':'Reward available after viewing','← 돌아가기':'← Go Back','광고 시청으로':'Watch ads to','TL을 모으세요':'Collect TL','짧은 광고를 시청하면 즉시 TL이 적립됩니다.':'Watch a short ad and receive TL instantly.','적립된 TL로 음악, 영상, 문서를 자유롭게 이용하세요.':'Use your earned TL for music, video, and documents.','시청 가능한 광고':'Available Ads','오늘 적립 TL':'TL Earned Today','누적 적립 TL':'Total TL Earned','전체':'All','사업자 가입':'Business Sign Up','사업자 등록번호로 로그인하세요':'Sign in with your business registration number','사업자 등록번호':'Business Registration Number','사업자 번호로 광고주 계정을 만드세요':'Create an advertiser account with your business number','상호명':'Business Name','가입하기':'Sign Up','← 홈으로 돌아가기':'← Back to Home','📢 광고주 센터':'📢 Advertiser Center','↩ 로그아웃':'↩ Log Out','📊 대시보드':'📊 Dashboard','📋 내 광고':'📋 My Ads','✚ 광고 등록':'✚ Create Ad','활성 광고':'Active Ads','현재 노출 중':'Currently Running','총 노출 수':'Total Impressions','전체 광고 합산':'All Campaigns','총 TL 지출':'Total TL Spent','사용자에게 지급':'Paid to Users','평균 CTR':'Average CTR','클릭률':'Click-through Rate','📈 최근 14일 노출 현황':'📈 Impressions — Last 14 Days','데이터 로딩 중...':'Loading data…','최근 광고':'Recent Ads','내 광고 목록':'My Campaigns','+ 새 광고 등록':'+ Create New Ad','광고 통계':'Ad Statistics','← 목록으로':'← Back to List','총 노출':'Total Impressions','완료율':'Completion Rate','클릭 수':'Clicks','지출 TL':'TL Spent','잔여 예산':'Remaining Budget','📅 일별 노출 (최근 14일)':'📅 Daily Impressions (Last 14 Days)','통계 로딩 중...':'Loading statistics…','🕐 시간대별 노출 (오늘)':'🕐 Impressions by Hour (Today)','오늘 데이터 없음':'No data for today','⚡ 광고 TL 충전':'⚡ Add Advertising TL','충전한 TL은 광고 예산으로 사용됩니다. 1 TL = 1원':'Added TL is used as your advertising budget. 1 TL = 1 KRW','스타터':'Starter','TL · 1,000,000원':'TL · KRW 1,000,000','🔥 인기':'🔥 Popular','프리미엄':'Premium','TL · 5,000,000원':'TL · KRW 5,000,000','TL · 10,000,000원':'TL · KRW 10,000,000','직접 입력 (최소 5,000 TL)':'Custom amount (min. 5,000 TL)','💡 충전한 TL은':'💡 Added TL is used only as','광고 예산':'advertising budget','으로만 사용됩니다.':'only.','광고 시청자에게 TL이 지급되며, 플랫폼 운영 재원이 됩니다.':'TL is awarded to viewers and helps fund platform operations.',
'문의하기':'Contact Us','음악':'Music','카페':'Cafe','디지털 자산의 권리를 지키고':'Protect Digital Asset Rights','이용 권한을 공유합니다':'Share Usage Permissions','솔루션':'Solutions','산업별 사례':'Industry Use Cases','기존 방식 vs TimeLink':'Traditional Approach vs TimeLink','PDF 다운로드 방식의 한계를 넘어섭니다.':'Move beyond the limitations of PDF downloads.','기존 방식':'Traditional Approach','PDF 제공 → 다운로드':'Provide PDF → Download','사용범위 통제 어려움':'Limited control over usage','복사·인쇄·캡처 무제한':'Unrestricted copying, printing, and screenshots','상품 = 파일':'Product = File','사용량 추적 불가':'No usage tracking','정산 근거 없음':'No basis for settlement','TimeLink 방식':'TimeLink Approach','등록 → 암호화 → 사용권 설정':'Register → Encrypt → Set Usage Rights','Viewer → 시간 측정 → 정산':'Viewer → Track Time → Settle','복사·인쇄·캡처 정책 설정':'Set copying, printing, and screenshot policies','상품 = Document + Rights + Time':'Product = Document + Rights + Time','사용자별 사용시간 추적':'Track usage time by user','산업별 사용 사례':'Industry Use Cases','디지털 사용권이 필요한 모든 산업에 적용됩니다.':'For every industry that needs digital usage rights.','의견서·계약·소송·특허 문서를 시간 기반으로 안전하게 공유':'Securely share legal opinions, contracts, litigation, and patent documents with time-based rights','연구보고서·데이터를 사용권으로 관리하고 접근을 통제':'Manage research reports and data with usage rights and access controls','투자·M&A·DD·리서치 자료의 사용시간과 열람 범위 관리':'Manage viewing scope and usage time for investment, M&A, due diligence, and research materials','내부자료·매뉴얼·기술문서의 버전·권한 통합 관리':'Centrally manage versions and permissions for internal materials, manuals, and technical documents','보고서·전략·시장조사 자료를 클라이언트별로 통제':'Control reports, strategies, and market research by client','설계자료·CAD 파일의 사용권·열람 시간 관리':'Manage usage rights and viewing time for designs and CAD files','교재·강의·자격증 자료의 수강생별 사용시간 관리':'Manage learner-specific usage time for courseware, lectures, and certification materials','정부·공공기관 문서의 보안·감사 요구사항 충족':'Meet security and audit requirements for government and public-sector documents','권리자가 사용조건을 설계합니다':'Rights Holders Define Usage Terms','파일마다 세밀한 정책을 설정할 수 있습니다.':'Set detailed policies for each asset.','열람':'View','허용/제한':'Allow / Restrict','사용시간':'Usage Time','시간 설정':'Set Time','사용기간':'Access Period','기간 선택':'Select Period','복사':'Copy','허용/차단':'Allow / Block','인쇄':'Print','다운로드':'Download','스크린캡처':'Screenshot','환경 제한':'Environment Restrictions','동시접속':'Concurrent Sessions','설정':'Settings','기기 수':'Device Limit','제한':'Limit','오프라인':'Offline','선택':'Select','워터마크':'Watermark','버전관리':'Version Control','지원':'Support',
'☕ 카페 채널 개설':'☕ Create Cafe Channel','나만의 카페 전용':'Your Own Cafe','AI 라디오 채널':'AI Radio Channel','카페만을 위한 특별한 음악 채널을 개설하세요.':'Create a dedicated music channel just for your cafe.','월정액 채널 이용료':'Monthly Channel Fee','매월 자동 갱신 • 언제든 해지 가능':'Renews monthly • Cancel anytime','☕ 카페 기본 정보':'☕ Cafe Information','* 필수':'* Required','카페명':'Cafe Name','채널 ID':'Channel ID','사업자번호':'Business Number','대표자명':'Owner Name','소개글':'Description','📍 위치 정보':'📍 Location','도로명 주소':'Street Address','🔍 주소 검색':'🔍 Search Address','상세 주소':'Address Details','주소를 입력하면 지도가 표시됩니다':'The map appears when you enter an address.','🖼️ 카페 이미지':'🖼️ Cafe Images','클릭하여 이미지 업로드':'Click to upload images','최대 5장 • JPG, PNG':'Up to 5 images • JPG, PNG','🎵 카페 전용 플레이리스트':'🎵 Cafe Playlist','0곡 선택됨':'0 tracks selected','전체 선택':'Select All','초기화':'Reset','🤖 AI 자동 선곡':'🤖 AI Auto Curation','곡 목록 로딩 중...':'Loading track list…','📅 시간대별 분위기 설정':'📅 Set Mood by Time of Day','채널 개설 혜택':'Channel Benefits','24시간 자동 방송':'24/7 Automated Broadcast','고객 곡 신청 & 사연':'Song Requests & Messages','구글 지도 연동':'Google Maps Integration','실시간 개입 방송':'Live Broadcast Controls','💳 결제 확인':'💳 Confirm Payment','채널 이용료':'Channel Fee','결제 주기':'Billing Cycle','월정액 (30일)':'Monthly (30 days)','다음 갱신일':'Next Renewal Date','총 결제금액':'Total Payment','결제 후 잔액':'Balance After Payment','채널 개설 완료!':'Channel Created!','📻 방송국으로 이동':'📻 Go to Radio Station','☕ 카페 채널 개설 (50,000 TL 결제)':'☕ Create Cafe Channel (50,000 TL)',
'☕ 카페 주인 센터':'☕ Cafe Owner Center','+ 새 카페 등록':'+ Register New Cafe','등록된 카페':'Registered Cafes','총 청취자':'Total Listeners','이번달 수익':'This Month’s Rewards','쿠폰 사용률':'Coupon Redemption Rate','▶ 방송 보기':'▶ View Broadcast','🎁 쿠폰':'🎁 Coupons','📊 통계':'📊 Statistics','💾 저장 & 적용':'💾 Save & Apply','쿠폰 관리':'Coupon Management','+ 새 쿠폰 발행':'+ Issue New Coupon','유효기간: 오늘 23:59까지':'Valid until 11:59 PM today','예약됨':'Scheduled','주간 청취자 추이':'Weekly Listener Trend','최고 인기 시간대:':'Most Popular Time:','인기 곡:':'Popular Track:',
'← 방송국으로':'← Radio Station','📁 선택 파일':'📁 Selected Assets','🎵 방송 세트':'🎵 Broadcast Sets','📩 지원 현황':'📩 Applications','🎙️ 내 방송 계약':'🎙️ My Broadcast Contracts','🎙️ 온에어':'🎙️ On Air','프로필 로딩 중...':'Loading profile…','☕ 방송할 카페 찾기':'☕ Find Cafes to Broadcast','카페 목록 로딩 중...':'Loading cafes…','📁 방송용 파일 (TL3)':'📁 Broadcast Assets (TL3)','파일 로딩 중...':'Loading assets…','세트 로딩 중...':'Loading sets…','📩 내 지원 현황':'📩 My Applications','지원 목록 로딩 중...':'Loading applications…','🎙️ 활동 중인 카페':'🎙️ Active Cafe Contracts','계약 목록 로딩 중...':'Loading contracts…',
'← 홈으로':'← Home','카페 DJ 가이드':'Cafe DJ Guide','좋은 음악으로 카페와 청취자에게 사랑받으세요.':'Bring great music to cafes and listeners.','잘할수록 더 많은 보상을 얻을 수 있습니다.':'The better you perform, the more rewards you can earn.','카페 라디오란?':'What Is Cafe Radio?','진행 흐름':'How It Works','보상 구조':'Reward Structure','방송 규칙':'Broadcast Rules','DJ 혜택':'DJ Benefits','자주 묻는 질문':'Frequently Asked Questions','DJ 등록':'Register as a DJ','카페에 지원':'Apply to a Cafe','카페 수락':'Cafe Approval','방송 시작':'Start Broadcasting','보상 발생':'Rewards Earned','⛔ MP3 방송 절대 불가':'⛔ MP3 Broadcasting Prohibited','✅ TL3만 방송 가능':'✅ TL3 Only','보상 창출':'Earn Rewards','인기 상승':'Grow Your Audience','방송 보너스':'Broadcast Bonuses','카페 매칭':'Cafe Matching',
'TimeLink Player 다운로드':'Download TimeLink Player','⚡ 시작하기':'⚡ Get Started','⬇ 공식 다운로드':'⬇ Official Download','버전':'Version','업데이트':'Update','포맷':'Format','불러오는 중...':'Loading…','.tl 암호화 포맷':'Encrypted .tl Format','실시간 TL 차감':'Real-time TL Deduction','모든 파일 형식':'All Asset Formats','더블클릭 실행':'Double-click to Open','계정 연동':'Account Integration','워터마킹':'Watermarking','⚙️ 설치 방법':'⚙️ Installation','실행':'Run','계정이 없으면':'If you don’t have an account,','회원가입':'Sign Up','후 TL을 충전하세요.':'then add TL to your account.','💻 시스템 요구사항':'💻 System Requirements','오픈소스':'Open Source',
'🚗 인카 채널 개설':'🚗 Create In-Car Channel','나만의 주행 전용':'Your Personal Driving','드라이브에 맞는 나만의 채널을 만들어보세요.':'Create a channel tailored to your drives.','기여지수로 결제 부담이 줄어듭니다':'A higher contribution index reduces usage charges.','기여지수가 높을수록 TL 차감률이 낮아집니다.':'The higher your contribution index, the lower your TL deduction rate.','현재 TL/s':'Current TL/s','🚗 채널 기본 정보':'🚗 Channel Information','채널명':'Channel Name','채널 소개글':'Channel Description','🚘 차량 정보':'🚘 Vehicle Information','차량 번호판':'License Plate','차종':'Vehicle Type','선택':'Select','세단':'Sedan','스포츠카':'Sports Car','트럭/밴':'Truck / Van','전기차':'Electric Vehicle','오토바이':'Motorcycle','주요 주행 지역':'Main Driving Area','🎨 드라이브 테마':'🎨 Driving Theme','🎵 채널 플레이리스트':'🎵 Channel Playlist','내 기여지수':'My Contribution Index','TL 차감률':'TL Deduction Rate','현재 TL 잔액':'Current TL Balance','방송 가능 시간':'Available Broadcast Time','0분':'0 minutes','💡 기여지수는 POC 채굴 활동으로 높일 수 있습니다':'💡 Increase your contribution index through POC activity','⭐ 채널 개설 혜택':'⭐ Channel Benefits','전용 채널 URL':'Dedicated Channel URL','워터마크 보호 자동 적용':'Automatic Watermark Protection','💳 결제 확인':'💳 Confirm Payment',
'어떤 역할로 시작할까요?':'How would you like to get started?','중복 선택 가능 · 나중에 언제든 변경 가능합니다':'Select multiple roles · You can change them anytime','소비자':'Consumer','관심사 설정 →':'Set Interests →','건너뛰기':'Skip','관심 있는 콘텐츠는?':'What content are you interested in?','선택한 관심사를 기반으로 파일과 방송을 추천합니다':'We recommend assets and broadcasts based on your interests','🎵 좋아하는 음악 장르를 선택하세요':'🎵 Choose your favorite music genres','(중복 선택 가능, 태그당 +100 TL)':'(Multiple selections · +100 TL per tag)','나중에 설정하겠습니다':'I’ll set this up later','대시보드에서 언제든 변경 가능합니다':'You can change this anytime in your dashboard','기부처 선택':'Choose a Charity','기부 비율':'Donation Rate','🎁 총 지급 예정 TL':'🎁 Total TL to Be Awarded','기본 가입 축하금':'Welcome Bonus','창작자 선택':'Creator Role Bonus','카페 주인 선택':'Cafe Owner Role Bonus','소비자 선택':'Consumer Role Bonus','모든 역할 선택 보너스':'All-Roles Bonus','관심사 설정':'Interest Settings','세부 태그 (9개)':'Detailed Tags (9)','기부 약정':'Donation Pledge','총 합계':'Grand Total','🎉 TimeLink 시작하기!':'🎉 Start TimeLink!',
'결제 실패':'Payment Failed','결제가 취소되거나 실패했습니다.':'The payment was cancelled or failed.','돌아가기':'Go Back','결제 완료':'Payment Complete','결제 처리 중...':'Processing payment…','SharePlace로 이동':'Go to SharePlace',
'방송 준비 중...':'Preparing broadcast…','곡당 소모':'TL per Track','남은 잔액':'Remaining Balance','연결 중...':'Connecting…','개인정보처리방침':'Privacy Policy','시행일: 2026년 3월 16일 · 최종 수정: 2026년 3월 16일 · v1.0':'Effective: March 16, 2026 · Last Updated: March 16, 2026 · v1.0','제1조 수집하는 개인정보 항목':'Article 1. Personal Information Collected','제2조 개인정보 수집 및 이용 목적':'Article 2. Purposes of Collection and Use','제3조 개인정보 보유 및 이용 기간':'Article 3. Retention Period','제4조 개인정보 제3자 제공':'Article 4. Disclosure to Third Parties','제5조 개인정보 처리 위탁':'Article 5. Processing by Service Providers','제6조 이용자의 권리':'Article 6. User Rights','구분':'Category','수집 항목':'Information Collected','목적':'Purpose','보유 기간':'Retention Period','근거':'Legal Basis','수탁업체':'Service Provider','위탁 업무':'Outsourced Service',
'이용약관':'Terms of Service','제1조 목적':'Article 1. Purpose','제2조 정의':'Article 2. Definitions','제3조 약관의 효력 및 변경':'Article 3. Effect and Amendments','제4조 서비스 이용':'Article 4. Use of the Service','제5조 TL 충전 및 사용':'Article 5. Adding and Using TL','제6조 크리에이터 수익 배분':'Article 6. Creator Reward Distribution','제7조 TLC 채굴 및 거래':'Article 7. TLC Mining and Transactions','제8조 금지 행위':'Article 8. Prohibited Conduct','제9조 서비스 중단 및 변경':'Article 9. Service Suspension and Changes','제10조 책임 제한':'Article 10. Limitation of Liability','제11조 분쟁 해결 및 관할':'Article 11. Disputes and Jurisdiction','제12조 사업자 정보':'Article 12. Company Information',
'TL 라이브 라디오 — TimeLink':'TimeLink Live Radio','지금 방송 중인 DJ를 만나보세요':'Meet the DJs broadcasting live now','미리듣기 무료 · 청취 시 TL 차감':'Free preview · TL deducted while listening','기존 SharePlace':'Legacy SharePlace','기존 Creator Center':'Legacy Creator Center','불러오는 중…':'Loading…','♥ 좋아요':'♥ Like','창작자 팔로우':'Follow Creator','댓글':'Comments','등록':'Post','발매 가격 확인 중…':'Checking release price…','💎 TL3 공유 등록':'💎 Share TL3 Asset','🎼 TL3 라이브러리':'🎼 TL3 Library','TL3 재생에는 시간 포인트가 사용됩니다.':'Time points are used to play TL3 assets.',
'💰 지갑 & 채굴':'💰 Wallet & Mining','총 자산 현황':'Total Asset Overview','💝 누적 기부 (초록우산)':'💝 Total Donations (ChildFund Korea)','⇄ TL → TLC 교환':'⇄ Exchange TL → TLC','📤 TON 출금':'📤 Withdraw TON','📥 TL 충전':'📥 Add TL','⇄ TL ↔ TLC 교환':'⇄ Exchange TL ↔ TLC','현재 환율: 1,000 TL = 1 TLC':'Current Rate: 1,000 TL = 1 TLC','TL → TLC 교환하기':'Exchange TL → TLC','TLC → TL 교환하기':'Exchange TLC → TL','📤 TON 지갑 출금':'📤 Withdraw to TON Wallet','연결된 TON 지갑':'Connected TON Wallet','출금 TLC 수량':'TLC Withdrawal Amount','출금 수수료 (2%)':'Withdrawal Fee (2%)','실 수령액':'Net Amount','📤 TON 출금 신청':'📤 Request TON Withdrawal','⛏️ TLC 채굴':'⛏️ TLC Mining','🥇 골드 등급 · 1.3× 배율':'🥇 Gold Tier · 1.3× Multiplier','골드 등급 창작자':'Gold Tier Creator','기여도 점수':'Contribution Score','채굴 배율':'Mining Multiplier','업로드 파일':'Uploaded Assets','평균 평점':'Average Rating','기부 약정':'Donation Pledge','MP3 원본 보안':'Original MP3 Security','마지막 채굴':'Last Mining','3시간 전':'3 hours ago','오늘 채굴':'Mined Today','⛏️ TLC 채굴 클레임':'⛏️ Claim TLC Mining Rewards','예상 수령:':'Estimated Reward:','📊 이번달 수익 분석':'📊 This Month’s Reward Analysis','창작자 수익 (파일 변환)':'Creator Rewards (Asset Conversion)','카페 방송 수익':'Cafe Broadcast Rewards','📋 최근 거래내역':'📋 Recent Transactions','TLC 채굴 클레임':'TLC Mining Claim','TON 출금 완료':'TON Withdrawal Complete'
});
Object.keys(AUTO_KO_EN).forEach(function(k){AUTO_EN_KO[AUTO_KO_EN[k]]=k;});

var AUTO_KO_ALL={"ko":{"안녕하세요,":"안녕하세요,","대시보드":"대시보드","지갑":"지갑","TLC 채굴":"TLC 채굴","내 콘텐츠":"내 콘텐츠","미션":"미션","바로가기":"바로가기","TL방송국":"TL방송국","크리에이터 센터":"크리에이터 센터","카페 채널":"카페 채널","나의 TimeLink를 한눈에":"나의 TimeLink를 한눈에","디지털 자산을 발견하고, 창작과 방송에 참여하며, 나의 기여와 보상을 확인하는 통합 공간입니다.":"디지털 자산을 발견하고, 창작과 방송에 참여하며, 나의 기여와 보상을 확인하는 통합 공간입니다.","공유플레이스 둘러보기 ↗":"공유플레이스 둘러보기 ↗","디지털 자산 등록":"디지털 자산 등록","TL 방송국":"TL 방송국","TL 잔액":"TL 잔액","소비용 토큰":"소비용 토큰","TLC 보유량":"TLC 보유량","거래용 토큰":"거래용 토큰","오늘 POC":"오늘 POC","기여 점수":"기여 점수","업로드한 파일":"업로드한 파일","📤 파일 업로드":"📤 파일 업로드","📻 방송 청취":"📻 방송 청취","☕ 카페방송":"☕ 카페방송","TL 총 잔액":"TL 총 잔액","구매TL만 교환 가능 (5% 수수료)":"구매TL만 교환 가능 (5% 수수료)","+ TL 충전":"+ TL 충전","↔ 교환":"↔ 교환","TLC 잔액":"TLC 잔액","POC 기여 시 자동 채굴":"POC 기여 시 자동 채굴","⚡ 채굴 현황":"⚡ 채굴 현황","오늘 POC 점수":"오늘 POC 점수","누적 TLC 채굴량":"누적 TLC 채굴량","POC 기여 지수":"POC 기여 지수","채굴 가능":"채굴 가능","월 소비":"월 소비","⛏️ POC 계산 후 TLC 채굴":"⛏️ POC 계산 후 TLC 채굴","⛏️ 채굴 내역":"⛏️ 채굴 내역","로딩 중...":"로딩 중...","전체 파일":"전체 파일","총 재생 수":"총 재생 수","수익 TL":"수익 TL","총 Pulse":"총 Pulse","📤 새 파일 업로드":"📤 새 파일 업로드","삭제 안내:":"삭제 안내:","공통 지갑의 TL 잔액은 삭제되지 않습니다.":"공통 지갑의 TL 잔액은 삭제되지 않습니다.","📁 내 파일 (TL3)":"📁 내 파일 (TL3)","☑ 전체 선택":"☑ 전체 선택","🗑️ 선택 삭제":"🗑️ 선택 삭제","TL3 파일이 없습니다.":"TL3 파일이 없습니다.","취소":"취소","변경":"변경","전체 자산":"전체 자산","♫ TL3 음악":"♫ TL3 음악","▶ TL4 영상":"▶ TL4 영상","▤ TLD 문서":"▤ TLD 문서","▦ TLJ 컬렉션":"▦ TLJ 컬렉션","💰 인기순":"💰 인기순","🆕 최신순":"🆕 최신순","🔥 Pulse순":"🔥 Pulse순","⚡ TL 잔량":"⚡ TL 잔량","초당 소모":"초당 소모","⚠️ TL 부족!":"⚠️ TL 부족!","TL 충전하기":"TL 충전하기","총 자산 현황":"총 자산 현황","⇄ TL → TLC 교환":"⇄ TL → TLC 교환","📤 TON 출금":"📤 TON 출금","📥 TL 충전":"📥 TL 충전","📋 거래내역":"📋 거래내역","현재 환율: 1,000 TL = 1 TLC":"현재 환율: 1,000 TL = 1 TLC","TL → TLC 교환하기":"TL → TLC 교환하기","시장가 적용":"시장가 적용","TLC → TL 교환하기":"TLC → TL 교환하기","연결된 TON 지갑":"연결된 TON 지갑","복사":"복사","출금 TLC 수량":"출금 TLC 수량","출금 수수료 (2%)":"출금 수수료 (2%)","실 수령액":"실 수령액","📤 TON 출금 신청":"📤 TON 출금 신청","⛏️ TLC 채굴":"⛏️ TLC 채굴","업로드 파일":"업로드 파일","평균 평점":"평균 평점","마지막 채굴":"마지막 채굴","오늘 채굴":"오늘 채굴","⛏️ TLC 채굴 클레임":"⛏️ TLC 채굴 클레임","예상 수령:":"예상 수령:","📊 이번달 수익 분석":"📊 이번달 수익 분석","창작자 수익 (파일 변환)":"창작자 수익 (파일 변환)","카페 방송 수익":"카페 방송 수익","TON 출금 완료":"TON 출금 완료"},"en":{"안녕하세요,":"Hello,","대시보드":"Dashboard","지갑":"Wallet","TLC 채굴":"TLC Mining","내 콘텐츠":"My Assets","미션":"Missions","바로가기":"Quick Links","TL방송국":"TimeLink Radio","크리에이터 센터":"Creator Center","카페 채널":"Cafe Channel","나의 TimeLink를 한눈에":"Your TimeLink at a glance","디지털 자산을 발견하고, 창작과 방송에 참여하며, 나의 기여와 보상을 확인하는 통합 공간입니다.":"Discover digital assets, participate in creation and broadcasting, and track your contributions and rewards in one place.","공유플레이스 둘러보기 ↗":"Explore SharePlace ↗","디지털 자산 등록":"Register Digital Asset","TL 방송국":"TL Radio","TL 잔액":"TL Balance","소비용 토큰":"Usage Token","TLC 보유량":"TLC Holdings","거래용 토큰":"Trading Token","오늘 POC":"Today's POC","기여 점수":"Contribution Score","업로드한 파일":"Registered Assets","📤 파일 업로드":"📤 Register Asset","📻 방송 청취":"📻 Listen to Radio","☕ 카페방송":"☕ Cafe Broadcast","TL 총 잔액":"Total TL Balance","구매TL만 교환 가능 (5% 수수료)":"Only purchased TL can be exchanged (5% fee)","+ TL 충전":"+ Add TL","↔ 교환":"↔ Exchange","TLC 잔액":"TLC Balance","POC 기여 시 자동 채굴":"Automatically mined through POC contributions","⚡ 채굴 현황":"⚡ Mining Status","오늘 POC 점수":"Today's POC Score","누적 TLC 채굴량":"Total TLC Mined","POC 기여 지수":"POC Contribution Index","채굴 가능":"Available to Mine","월 소비":"Monthly Usage","⛏️ POC 계산 후 TLC 채굴":"⛏️ Calculate POC and Mine TLC","⛏️ 채굴 내역":"⛏️ Mining History","로딩 중...":"Loading…","전체 파일":"All Assets","총 재생 수":"Total Plays","수익 TL":"Rewards (TL)","총 Pulse":"Total Pulse","📤 새 파일 업로드":"📤 Register New Asset","삭제 안내:":"Deletion notice:","공통 지갑의 TL 잔액은 삭제되지 않습니다.":"The TL balance in your main wallet will not be deleted.","📁 내 파일 (TL3)":"📁 My Assets (TL3)","☑ 전체 선택":"☑ Select All","🗑️ 선택 삭제":"🗑️ Delete Selected","TL3 파일이 없습니다.":"No TL3 assets found.","취소":"Cancel","변경":"Change","전체 자산":"All Assets","♫ TL3 음악":"♫ TL3 Music","▶ TL4 영상":"▶ TL4 Video","▤ TLD 문서":"▤ TLD Documents","▦ TLJ 컬렉션":"▦ TLJ Collections","💰 인기순":"💰 Most Popular","🆕 최신순":"🆕 Newest","🔥 Pulse순":"🔥 By Pulse","⚡ TL 잔량":"⚡ TL Remaining","초당 소모":"Per-second Usage","⚠️ TL 부족!":"⚠️ Insufficient TL!","TL 충전하기":"Add TL","총 자산 현황":"Total Asset Overview","⇄ TL → TLC 교환":"⇄ Exchange TL → TLC","📤 TON 출금":"📤 Withdraw TON","📥 TL 충전":"📥 Add TL","📋 거래내역":"📋 Transactions","현재 환율: 1,000 TL = 1 TLC":"Current rate: 1,000 TL = 1 TLC","TL → TLC 교환하기":"Exchange TL → TLC","시장가 적용":"Apply Market Rate","TLC → TL 교환하기":"Exchange TLC → TL","연결된 TON 지갑":"Connected TON Wallet","복사":"Copy","출금 TLC 수량":"TLC Withdrawal Amount","출금 수수료 (2%)":"Withdrawal Fee (2%)","실 수령액":"Net Amount","📤 TON 출금 신청":"📤 Request TON Withdrawal","⛏️ TLC 채굴":"⛏️ TLC Mining","업로드 파일":"Registered Assets","평균 평점":"Average Rating","마지막 채굴":"Last Mining","오늘 채굴":"Mined Today","⛏️ TLC 채굴 클레임":"⛏️ Claim TLC Mining Rewards","예상 수령:":"Estimated to receive:","📊 이번달 수익 분석":"📊 This Month's Rewards Analysis","창작자 수익 (파일 변환)":"Creator Rewards (Asset Conversion)","카페 방송 수익":"Cafe Broadcast Rewards","TON 출금 완료":"TON Withdrawal Complete"},"ja":{"안녕하세요,":"こんにちは、","대시보드":"ダッシュボード","지갑":"ウォレット","TLC 채굴":"TLCマイニング","내 콘텐츠":"マイアセット","미션":"ミッション","바로가기":"クイックリンク","TL방송국":"TimeLinkラジオ","크리에이터 센터":"クリエイターセンター","카페 채널":"カフェチャンネル","나의 TimeLink를 한눈에":"TimeLinkをひと目で確認","디지털 자산을 발견하고, 창작과 방송에 참여하며, 나의 기여와 보상을 확인하는 통합 공간입니다.":"デジタル資産を発見し、創作や放送に参加して、自分の貢献と報酬を確認できる統合スペースです。","공유플레이스 둘러보기 ↗":"SharePlaceを見る ↗","디지털 자산 등록":"デジタル資産を登録","TL 방송국":"TLラジオ","TL 잔액":"TL残高","소비용 토큰":"利用トークン","TLC 보유량":"TLC保有量","거래용 토큰":"取引トークン","오늘 POC":"本日のPOC","기여 점수":"貢献スコア","업로드한 파일":"登録済み資産","📤 파일 업로드":"📤 資産を登録","📻 방송 청취":"📻 ラジオを聴く","☕ 카페방송":"☕ カフェ放送","TL 총 잔액":"TL総残高","구매TL만 교환 가능 (5% 수수료)":"購入したTLのみ交換可能（手数料5%）","+ TL 충전":"+ TLをチャージ","↔ 교환":"↔ 交換","TLC 잔액":"TLC残高","POC 기여 시 자동 채굴":"POCへの貢献に応じて自動採掘","⚡ 채굴 현황":"⚡ マイニング状況","오늘 POC 점수":"本日のPOCスコア","누적 TLC 채굴량":"TLC累計採掘量","POC 기여 지수":"POC貢献指数","채굴 가능":"採掘可能","월 소비":"月間消費","⛏️ POC 계산 후 TLC 채굴":"⛏️ POCを計算してTLCを採掘","⛏️ 채굴 내역":"⛏️ 採掘履歴","로딩 중...":"読み込み中…","전체 파일":"すべての資産","총 재생 수":"総再生回数","수익 TL":"報酬（TL）","총 Pulse":"Pulse合計","📤 새 파일 업로드":"📤 新しい資産を登録","삭제 안내:":"削除に関する注意：","공통 지갑의 TL 잔액은 삭제되지 않습니다.":"共通ウォレットのTL残高は削除されません。","📁 내 파일 (TL3)":"📁 マイアセット（TL3）","☑ 전체 선택":"☑ すべて選択","🗑️ 선택 삭제":"🗑️ 選択項目を削除","TL3 파일이 없습니다.":"TL3資産がありません。","취소":"キャンセル","변경":"変更","전체 자산":"すべての資産","♫ TL3 음악":"♫ TL3音楽","▶ TL4 영상":"▶ TL4動画","▤ TLD 문서":"▤ TLD文書","▦ TLJ 컬렉션":"▦ TLJコレクション","💰 인기순":"💰 人気順","🆕 최신순":"🆕 新着順","🔥 Pulse순":"🔥 Pulse順","⚡ TL 잔량":"⚡ TL残量","초당 소모":"秒あたりの消費","⚠️ TL 부족!":"⚠️ TL不足！","TL 충전하기":"TLをチャージ","총 자산 현황":"総資産状況","⇄ TL → TLC 교환":"⇄ TL → TLC交換","📤 TON 출금":"📤 TONを出金","📥 TL 충전":"📥 TLをチャージ","📋 거래내역":"📋 取引履歴","현재 환율: 1,000 TL = 1 TLC":"現在の交換レート：1,000 TL = 1 TLC","TL → TLC 교환하기":"TL → TLCを交換","시장가 적용":"市場価格を適用","TLC → TL 교환하기":"TLC → TLを交換","연결된 TON 지갑":"接続済みTONウォレット","복사":"コピー","출금 TLC 수량":"出金するTLC数量","출금 수수료 (2%)":"出金手数料（2%）","실 수령액":"受取額","📤 TON 출금 신청":"📤 TON出金を申請","⛏️ TLC 채굴":"⛏️ TLCマイニング","업로드 파일":"登録済み資産","평균 평점":"平均評価","마지막 채굴":"最終採掘","오늘 채굴":"本日の採掘","⛏️ TLC 채굴 클레임":"⛏️ TLC採掘報酬を請求","예상 수령:":"受取予定：","📊 이번달 수익 분석":"📊 今月の報酬分析","창작자 수익 (파일 변환)":"クリエイター報酬（資産変換）","카페 방송 수익":"カフェ放送報酬","TON 출금 완료":"TON出金完了"},"zh":{"안녕하세요,":"您好，","대시보드":"控制台","지갑":"钱包","TLC 채굴":"TLC 挖矿","내 콘텐츠":"我的资产","미션":"任务","바로가기":"快捷入口","TL방송국":"TimeLink 电台","크리에이터 센터":"创作者中心","카페 채널":"咖啡馆频道","나의 TimeLink를 한눈에":"一览您的 TimeLink","디지털 자산을 발견하고, 창작과 방송에 참여하며, 나의 기여와 보상을 확인하는 통합 공간입니다.":"在此一站式发现数字资产、参与创作与广播，并查看您的贡献和奖励。","공유플레이스 둘러보기 ↗":"浏览 SharePlace ↗","디지털 자산 등록":"登记数字资产","TL 방송국":"TL 电台","TL 잔액":"TL 余额","소비용 토큰":"消费代币","TLC 보유량":"TLC 持有量","거래용 토큰":"交易代币","오늘 POC":"今日 POC","기여 점수":"贡献分数","업로드한 파일":"已登记资产","📤 파일 업로드":"📤 登记资产","📻 방송 청취":"📻 收听电台","☕ 카페방송":"☕ 咖啡馆广播","TL 총 잔액":"TL 总余额","구매TL만 교환 가능 (5% 수수료)":"仅购买的 TL 可兑换（手续费 5%）","+ TL 충전":"+ 充值 TL","↔ 교환":"↔ 兑换","TLC 잔액":"TLC 余额","POC 기여 시 자동 채굴":"通过 POC 贡献自动挖矿","⚡ 채굴 현황":"⚡ 挖矿状态","오늘 POC 점수":"今日 POC 分数","누적 TLC 채굴량":"TLC 累计挖矿量","POC 기여 지수":"POC 贡献指数","채굴 가능":"可挖矿","월 소비":"每月消耗","⛏️ POC 계산 후 TLC 채굴":"⛏️ 计算 POC 并挖取 TLC","⛏️ 채굴 내역":"⛏️ 挖矿记录","로딩 중...":"加载中…","전체 파일":"全部资产","총 재생 수":"总播放次数","수익 TL":"奖励（TL）","총 Pulse":"Pulse 总计","📤 새 파일 업로드":"📤 登记新资产","삭제 안내:":"删除提示：","공통 지갑의 TL 잔액은 삭제되지 않습니다.":"主钱包中的 TL 余额不会被删除。","📁 내 파일 (TL3)":"📁 我的资产（TL3）","☑ 전체 선택":"☑ 全选","🗑️ 선택 삭제":"🗑️ 删除所选项","TL3 파일이 없습니다.":"没有 TL3 资产。","취소":"取消","변경":"更改","전체 자산":"全部资产","♫ TL3 음악":"♫ TL3 音乐","▶ TL4 영상":"▶ TL4 视频","▤ TLD 문서":"▤ TLD 文档","▦ TLJ 컬렉션":"▦ TLJ 收藏","💰 인기순":"💰 最受欢迎","🆕 최신순":"🆕 最新","🔥 Pulse순":"🔥 按 Pulse 排序","⚡ TL 잔량":"⚡ TL 余额","초당 소모":"每秒消耗","⚠️ TL 부족!":"⚠️ TL 不足！","TL 충전하기":"充值 TL","총 자산 현황":"总资产概览","⇄ TL → TLC 교환":"⇄ TL → TLC 兑换","📤 TON 출금":"📤 提取 TON","📥 TL 충전":"📥 充值 TL","📋 거래내역":"📋 交易记录","현재 환율: 1,000 TL = 1 TLC":"当前汇率：1,000 TL = 1 TLC","TL → TLC 교환하기":"兑换 TL → TLC","시장가 적용":"按市场价执行","TLC → TL 교환하기":"兑换 TLC → TL","연결된 TON 지갑":"已连接的 TON 钱包","복사":"复制","출금 TLC 수량":"提取 TLC 数量","출금 수수료 (2%)":"提现手续费（2%）","실 수령액":"实际到账金额","📤 TON 출금 신청":"📤 申请提取 TON","⛏️ TLC 채굴":"⛏️ TLC 挖矿","업로드 파일":"已登记资产","평균 평점":"平均评分","마지막 채굴":"上次挖矿","오늘 채굴":"今日挖矿","⛏️ TLC 채굴 클레임":"⛏️ 领取 TLC 挖矿奖励","예상 수령:":"预计到账：","📊 이번달 수익 분석":"📊 本月奖励分析","창작자 수익 (파일 변환)":"创作者奖励（资产转换）","카페 방송 수익":"咖啡馆广播奖励","TON 출금 완료":"TON 提现完成"},"th":{"안녕하세요,":"สวัสดี","대시보드":"แดชบอร์ด","지갑":"กระเป๋าเงิน","TLC 채굴":"การขุด TLC","내 콘텐츠":"สินทรัพย์ของฉัน","미션":"ภารกิจ","바로가기":"ลิงก์ด่วน","TL방송국":"TimeLink Radio","크리에이터 센터":"ศูนย์ครีเอเตอร์","카페 채널":"ช่องคาเฟ่","나의 TimeLink를 한눈에":"ดู TimeLink ของคุณได้ในที่เดียว","디지털 자산을 발견하고, 창작과 방송에 참여하며, 나의 기여와 보상을 확인하는 통합 공간입니다.":"พื้นที่รวมสำหรับค้นหาสินทรัพย์ดิจิทัล มีส่วนร่วมในการสร้างสรรค์และออกอากาศ พร้อมตรวจสอบการมีส่วนร่วมและรางวัลของคุณ","공유플레이스 둘러보기 ↗":"สำรวจ SharePlace ↗","디지털 자산 등록":"ลงทะเบียนสินทรัพย์ดิจิทัล","TL 방송국":"TL Radio","TL 잔액":"ยอด TL","소비용 토큰":"โทเค็นสำหรับใช้งาน","TLC 보유량":"TLC ที่ถือครอง","거래용 토큰":"โทเค็นสำหรับซื้อขาย","오늘 POC":"POC วันนี้","기여 점수":"คะแนนการมีส่วนร่วม","업로드한 파일":"สินทรัพย์ที่ลงทะเบียน","📤 파일 업로드":"📤 ลงทะเบียนสินทรัพย์","📻 방송 청취":"📻 ฟังวิทยุ","☕ 카페방송":"☕ วิทยุคาเฟ่","TL 총 잔액":"ยอด TL ทั้งหมด","구매TL만 교환 가능 (5% 수수료)":"แลกเปลี่ยนได้เฉพาะ TL ที่ซื้อ (ค่าธรรมเนียม 5%)","+ TL 충전":"+ เติม TL","↔ 교환":"↔ แลกเปลี่ยน","TLC 잔액":"ยอด TLC","POC 기여 시 자동 채굴":"ขุดอัตโนมัติเมื่อมีส่วนร่วมใน POC","⚡ 채굴 현황":"⚡ สถานะการขุด","오늘 POC 점수":"คะแนน POC วันนี้","누적 TLC 채굴량":"TLC ที่ขุดสะสม","POC 기여 지수":"ดัชนีการมีส่วนร่วม POC","채굴 가능":"พร้อมขุด","월 소비":"การใช้งานรายเดือน","⛏️ POC 계산 후 TLC 채굴":"⛏️ คำนวณ POC และขุด TLC","⛏️ 채굴 내역":"⛏️ ประวัติการขุด","로딩 중...":"กำลังโหลด…","전체 파일":"สินทรัพย์ทั้งหมด","총 재생 수":"ยอดเล่นทั้งหมด","수익 TL":"รางวัล (TL)","총 Pulse":"Pulse ทั้งหมด","📤 새 파일 업로드":"📤 ลงทะเบียนสินทรัพย์ใหม่","삭제 안내:":"คำเตือนการลบ:","공통 지갑의 TL 잔액은 삭제되지 않습니다.":"ยอด TL ในกระเป๋าหลักจะไม่ถูกลบ","📁 내 파일 (TL3)":"📁 สินทรัพย์ของฉัน (TL3)","☑ 전체 선택":"☑ เลือกทั้งหมด","🗑️ 선택 삭제":"🗑️ ลบรายการที่เลือก","TL3 파일이 없습니다.":"ไม่พบสินทรัพย์ TL3","취소":"ยกเลิก","변경":"เปลี่ยน","전체 자산":"สินทรัพย์ทั้งหมด","♫ TL3 음악":"♫ เพลง TL3","▶ TL4 영상":"▶ วิดีโอ TL4","▤ TLD 문서":"▤ เอกสาร TLD","▦ TLJ 컬렉션":"▦ คอลเลกชัน TLJ","💰 인기순":"💰 ยอดนิยม","🆕 최신순":"🆕 ใหม่ล่าสุด","🔥 Pulse순":"🔥 ตาม Pulse","⚡ TL 잔량":"⚡ TL คงเหลือ","초당 소모":"การใช้ต่อวินาที","⚠️ TL 부족!":"⚠️ TL ไม่เพียงพอ!","TL 충전하기":"เติม TL","총 자산 현황":"ภาพรวมสินทรัพย์ทั้งหมด","⇄ TL → TLC 교환":"⇄ แลก TL → TLC","📤 TON 출금":"📤 ถอน TON","📥 TL 충전":"📥 เติม TL","📋 거래내역":"📋 ประวัติธุรกรรม","현재 환율: 1,000 TL = 1 TLC":"อัตราปัจจุบัน: 1,000 TL = 1 TLC","TL → TLC 교환하기":"แลก TL → TLC","시장가 적용":"ใช้อัตราตลาด","TLC → TL 교환하기":"แลก TLC → TL","연결된 TON 지갑":"TON Wallet ที่เชื่อมต่อ","복사":"คัดลอก","출금 TLC 수량":"จำนวน TLC ที่ถอน","출금 수수료 (2%)":"ค่าธรรมเนียมถอน (2%)","실 수령액":"จำนวนเงินสุทธิที่ได้รับ","📤 TON 출금 신청":"📤 ขอถอน TON","⛏️ TLC 채굴":"⛏️ การขุด TLC","업로드 파일":"สินทรัพย์ที่ลงทะเบียน","평균 평점":"คะแนนเฉลี่ย","마지막 채굴":"ขุดครั้งล่าสุด","오늘 채굴":"ขุดวันนี้","⛏️ TLC 채굴 클레임":"⛏️ รับรางวัลการขุด TLC","예상 수령:":"คาดว่าจะได้รับ:","📊 이번달 수익 분석":"📊 วิเคราะห์รางวัลเดือนนี้","창작자 수익 (파일 변환)":"รางวัลผู้สร้าง (การแปลงสินทรัพย์)","카페 방송 수익":"รางวัลการออกอากาศคาเฟ่","TON 출금 완료":"ถอน TON สำเร็จ"},"vi":{"안녕하세요,":"Xin chào,","대시보드":"Bảng điều khiển","지갑":"Ví","TLC 채굴":"Khai thác TLC","내 콘텐츠":"Tài sản của tôi","미션":"Nhiệm vụ","바로가기":"Liên kết nhanh","TL방송국":"Đài TimeLink","크리에이터 센터":"Trung tâm sáng tạo","카페 채널":"Kênh quán cà phê","나의 TimeLink를 한눈에":"Tổng quan TimeLink của bạn","디지털 자산을 발견하고, 창작과 방송에 참여하며, 나의 기여와 보상을 확인하는 통합 공간입니다.":"Không gian tổng hợp để khám phá tài sản số, tham gia sáng tạo và phát sóng, đồng thời theo dõi đóng góp và phần thưởng của bạn.","공유플레이스 둘러보기 ↗":"Khám phá SharePlace ↗","디지털 자산 등록":"Đăng ký tài sản số","TL 방송국":"Đài TL","TL 잔액":"Số dư TL","소비용 토큰":"Token sử dụng","TLC 보유량":"TLC đang nắm giữ","거래용 토큰":"Token giao dịch","오늘 POC":"POC hôm nay","기여 점수":"Điểm đóng góp","업로드한 파일":"Tài sản đã đăng ký","📤 파일 업로드":"📤 Đăng ký tài sản","📻 방송 청취":"📻 Nghe đài","☕ 카페방송":"☕ Phát sóng quán cà phê","TL 총 잔액":"Tổng số dư TL","구매TL만 교환 가능 (5% 수수료)":"Chỉ TL đã mua mới được quy đổi (phí 5%)","+ TL 충전":"+ Nạp TL","↔ 교환":"↔ Quy đổi","TLC 잔액":"Số dư TLC","POC 기여 시 자동 채굴":"Tự động khai thác thông qua đóng góp POC","⚡ 채굴 현황":"⚡ Trạng thái khai thác","오늘 POC 점수":"Điểm POC hôm nay","누적 TLC 채굴량":"Tổng TLC đã khai thác","POC 기여 지수":"Chỉ số đóng góp POC","채굴 가능":"Có thể khai thác","월 소비":"Mức sử dụng hàng tháng","⛏️ POC 계산 후 TLC 채굴":"⛏️ Tính POC và khai thác TLC","⛏️ 채굴 내역":"⛏️ Lịch sử khai thác","로딩 중...":"Đang tải…","전체 파일":"Tất cả tài sản","총 재생 수":"Tổng lượt phát","수익 TL":"Phần thưởng (TL)","총 Pulse":"Tổng Pulse","📤 새 파일 업로드":"📤 Đăng ký tài sản mới","삭제 안내:":"Thông báo xóa:","공통 지갑의 TL 잔액은 삭제되지 않습니다.":"Số dư TL trong ví chung sẽ không bị xóa.","📁 내 파일 (TL3)":"📁 Tài sản của tôi (TL3)","☑ 전체 선택":"☑ Chọn tất cả","🗑️ 선택 삭제":"🗑️ Xóa mục đã chọn","TL3 파일이 없습니다.":"Không có tài sản TL3.","취소":"Hủy","변경":"Thay đổi","전체 자산":"Tất cả tài sản","♫ TL3 음악":"♫ Nhạc TL3","▶ TL4 영상":"▶ Video TL4","▤ TLD 문서":"▤ Tài liệu TLD","▦ TLJ 컬렉션":"▦ Bộ sưu tập TLJ","💰 인기순":"💰 Phổ biến nhất","🆕 최신순":"🆕 Mới nhất","🔥 Pulse순":"🔥 Theo Pulse","⚡ TL 잔량":"⚡ TL còn lại","초당 소모":"Mức sử dụng mỗi giây","⚠️ TL 부족!":"⚠️ Không đủ TL!","TL 충전하기":"Nạp TL","총 자산 현황":"Tổng quan tài sản","⇄ TL → TLC 교환":"⇄ Quy đổi TL → TLC","📤 TON 출금":"📤 Rút TON","📥 TL 충전":"📥 Nạp TL","📋 거래내역":"📋 Lịch sử giao dịch","현재 환율: 1,000 TL = 1 TLC":"Tỷ giá hiện tại: 1.000 TL = 1 TLC","TL → TLC 교환하기":"Quy đổi TL → TLC","시장가 적용":"Áp dụng giá thị trường","TLC → TL 교환하기":"Quy đổi TLC → TL","연결된 TON 지갑":"Ví TON đã kết nối","복사":"Sao chép","출금 TLC 수량":"Số lượng TLC rút","출금 수수료 (2%)":"Phí rút (2%)","실 수령액":"Số tiền thực nhận","📤 TON 출금 신청":"📤 Yêu cầu rút TON","⛏️ TLC 채굴":"⛏️ Khai thác TLC","업로드 파일":"Tài sản đã đăng ký","평균 평점":"Đánh giá trung bình","마지막 채굴":"Lần khai thác gần nhất","오늘 채굴":"Đã khai thác hôm nay","⛏️ TLC 채굴 클레임":"⛏️ Nhận thưởng khai thác TLC","예상 수령:":"Dự kiến nhận:","📊 이번달 수익 분석":"📊 Phân tích phần thưởng tháng này","창작자 수익 (파일 변환)":"Phần thưởng người sáng tạo (chuyển đổi tài sản)","카페 방송 수익":"Phần thưởng phát sóng quán cà phê","TON 출금 완료":"Rút TON hoàn tất"}};

AUTO_KO_ALL.ko["결제 금액"]="결제 금액";
AUTO_KO_ALL.en["결제 금액"]="Payment Amount";
AUTO_KO_ALL.ja["결제 금액"]="支払金額";
AUTO_KO_ALL.zh["결제 금액"]="支付金额";
AUTO_KO_ALL.th["결제 금액"]="ยอดชำระ";
AUTO_KO_ALL.vi["결제 금액"]="Số tiền thanh toán";
AUTO_KO_ALL.ko["지급 TL"]="지급 TL";
AUTO_KO_ALL.en["지급 TL"]="TL to Receive";
AUTO_KO_ALL.ja["지급 TL"]="受取TL";
AUTO_KO_ALL.zh["지급 TL"]="到账 TL";
AUTO_KO_ALL.th["지급 TL"]="TL ที่ได้รับ";
AUTO_KO_ALL.vi["지급 TL"]="TL nhận được";
AUTO_KO_ALL.ko["💳 결제하기"]="💳 결제하기";
AUTO_KO_ALL.en["💳 결제하기"]="💳 Pay";
AUTO_KO_ALL.ja["💳 결제하기"]="💳 支払う";
AUTO_KO_ALL.zh["💳 결제하기"]="💳 付款";
AUTO_KO_ALL.th["💳 결제하기"]="💳 ชำระเงิน";
AUTO_KO_ALL.vi["💳 결제하기"]="💳 Thanh toán";
AUTO_KO_ALL.ko["✕ 닫기"]="✕ 닫기";
AUTO_KO_ALL.en["✕ 닫기"]="✕ Close";
AUTO_KO_ALL.ja["✕ 닫기"]="✕ 閉じる";
AUTO_KO_ALL.zh["✕ 닫기"]="✕ 关闭";
AUTO_KO_ALL.th["✕ 닫기"]="✕ ปิด";
AUTO_KO_ALL.vi["✕ 닫기"]="✕ Đóng";
AUTO_KO_ALL.ko["📄 문서"]="📄 문서";
AUTO_KO_ALL.en["📄 문서"]="📄 Document";
AUTO_KO_ALL.ja["📄 문서"]="📄 文書";
AUTO_KO_ALL.zh["📄 문서"]="📄 文档";
AUTO_KO_ALL.th["📄 문서"]="📄 เอกสาร";
AUTO_KO_ALL.vi["📄 문서"]="📄 Tài liệu";
AUTO_KO_ALL.ko["↗ 새탭으로 열기"]="↗ 새탭으로 열기";
AUTO_KO_ALL.en["↗ 새탭으로 열기"]="↗ Open in new tab";
AUTO_KO_ALL.ja["↗ 새탭으로 열기"]="↗ 新しいタブで開く";
AUTO_KO_ALL.zh["↗ 새탭으로 열기"]="↗ 在新标签页打开";
AUTO_KO_ALL.th["↗ 새탭으로 열기"]="↗ เปิดในแท็บใหม่";
AUTO_KO_ALL.vi["↗ 새탭으로 열기"]="↗ Mở trong tab mới";
AUTO_KO_ALL.ko["🎵 전체"]="🎵 전체";
AUTO_KO_ALL.en["🎵 전체"]="🎵 All";
AUTO_KO_ALL.ja["🎵 전체"]="🎵 すべて";
AUTO_KO_ALL.zh["🎵 전체"]="🎵 全部";
AUTO_KO_ALL.th["🎵 전체"]="🎵 ทั้งหมด";
AUTO_KO_ALL.vi["🎵 전체"]="🎵 Tất cả";
AUTO_KO_ALL.ko["⭐ 팝"]="⭐ 팝";
AUTO_KO_ALL.en["⭐ 팝"]="⭐ Pop";
AUTO_KO_ALL.ja["⭐ 팝"]="⭐ ポップ";
AUTO_KO_ALL.zh["⭐ 팝"]="⭐ 流行";
AUTO_KO_ALL.th["⭐ 팝"]="⭐ ป๊อป";
AUTO_KO_ALL.vi["⭐ 팝"]="⭐ Pop";
AUTO_KO_ALL.ko["💙 발라드"]="💙 발라드";
AUTO_KO_ALL.en["💙 발라드"]="💙 Ballad";
AUTO_KO_ALL.ja["💙 발라드"]="💙 バラード";
AUTO_KO_ALL.zh["💙 발라드"]="💙 抒情";
AUTO_KO_ALL.th["💙 발라드"]="💙 บัลลาด";
AUTO_KO_ALL.vi["💙 발라드"]="💙 Ballad";
AUTO_KO_ALL.ko["🎤 힙합/R&B"]="🎤 힙합/R&B";
AUTO_KO_ALL.en["🎤 힙합/R&B"]="🎤 Hip-hop/R&B";
AUTO_KO_ALL.ja["🎤 힙합/R&B"]="🎤 ヒップホップ/R&B";
AUTO_KO_ALL.zh["🎤 힙합/R&B"]="🎤 嘻哈/R&B";
AUTO_KO_ALL.th["🎤 힙합/R&B"]="🎤 ฮิปฮอป/R&B";
AUTO_KO_ALL.vi["🎤 힙합/R&B"]="🎤 Hip-hop/R&B";
AUTO_KO_ALL.ko["🌿 인디"]="🌿 인디";
AUTO_KO_ALL.en["🌿 인디"]="🌿 Indie";
AUTO_KO_ALL.ja["🌿 인디"]="🌿 インディー";
AUTO_KO_ALL.zh["🌿 인디"]="🌿 独立音乐";
AUTO_KO_ALL.th["🌿 인디"]="🌿 อินดี้";
AUTO_KO_ALL.vi["🌿 인디"]="🌿 Indie";
AUTO_KO_ALL.ko["🎷 재즈"]="🎷 재즈";
AUTO_KO_ALL.en["🎷 재즈"]="🎷 Jazz";
AUTO_KO_ALL.ja["🎷 재즈"]="🎷 ジャズ";
AUTO_KO_ALL.zh["🎷 재즈"]="🎷 爵士";
AUTO_KO_ALL.th["🎷 재즈"]="🎷 แจ๊ส";
AUTO_KO_ALL.vi["🎷 재즈"]="🎷 Jazz";
AUTO_KO_ALL.ko["🎛️ 일렉트로닉"]="🎛️ 일렉트로닉";
AUTO_KO_ALL.en["🎛️ 일렉트로닉"]="🎛️ Electronic";
AUTO_KO_ALL.ja["🎛️ 일렉트로닉"]="🎛️ エレクトロニック";
AUTO_KO_ALL.zh["🎛️ 일렉트로닉"]="🎛️ 电子";
AUTO_KO_ALL.th["🎛️ 일렉트로닉"]="🎛️ อิเล็กทรอนิกส์";
AUTO_KO_ALL.vi["🎛️ 일렉트로닉"]="🎛️ Electronic";
AUTO_KO_ALL.ko["🎸 록"]="🎸 록";
AUTO_KO_ALL.en["🎸 록"]="🎸 Rock";
AUTO_KO_ALL.ja["🎸 록"]="🎸 ロック";
AUTO_KO_ALL.zh["🎸 록"]="🎸 摇滚";
AUTO_KO_ALL.th["🎸 록"]="🎸 ร็อก";
AUTO_KO_ALL.vi["🎸 록"]="🎸 Rock";
AUTO_KO_ALL.ko["🎻 클래식"]="🎻 클래식";
AUTO_KO_ALL.en["🎻 클래식"]="🎻 Classical";
AUTO_KO_ALL.ja["🎻 클래식"]="🎻 クラシック";
AUTO_KO_ALL.zh["🎻 클래식"]="🎻 古典";
AUTO_KO_ALL.th["🎻 클래식"]="🎻 คลาสสิก";
AUTO_KO_ALL.vi["🎻 클래식"]="🎻 Cổ điển";
AUTO_KO_ALL.ko["☕ 로파이/칠"]="☕ 로파이/칠";
AUTO_KO_ALL.en["☕ 로파이/칠"]="☕ Lo-fi/Chill";
AUTO_KO_ALL.ja["☕ 로파이/칠"]="☕ ローファイ／チル";
AUTO_KO_ALL.zh["☕ 로파이/칠"]="☕ Lo-fi/轻松";
AUTO_KO_ALL.th["☕ 로파이/칠"]="☕ โลไฟ/ชิล";
AUTO_KO_ALL.vi["☕ 로파이/칠"]="☕ Lo-fi/Chill";
AUTO_KO_ALL.ko["🪕 어쿠스틱"]="🪕 어쿠스틱";
AUTO_KO_ALL.en["🪕 어쿠스틱"]="🪕 Acoustic";
AUTO_KO_ALL.ja["🪕 어쿠스틱"]="🪕 アコースティック";
AUTO_KO_ALL.zh["🪕 어쿠스틱"]="🪕 原声";
AUTO_KO_ALL.th["🪕 어쿠스틱"]="🪕 อะคูสติก";
AUTO_KO_ALL.vi["🪕 어쿠스틱"]="🪕 Acoustic";
AUTO_KO_ALL.ko["💃 댄스"]="💃 댄스";
AUTO_KO_ALL.en["💃 댄스"]="💃 Dance";
AUTO_KO_ALL.ja["💃 댄스"]="💃 ダンス";
AUTO_KO_ALL.zh["💃 댄스"]="💃 舞曲";
AUTO_KO_ALL.th["💃 댄스"]="💃 แดนซ์";
AUTO_KO_ALL.vi["💃 댄스"]="💃 Dance";
AUTO_KO_ALL.ko["📤 내 파일 업로드"]="📤 내 파일 업로드";
AUTO_KO_ALL.en["📤 내 파일 업로드"]="📤 Upload My Assets";
AUTO_KO_ALL.ja["📤 내 파일 업로드"]="📤 マイアセットをアップロード";
AUTO_KO_ALL.zh["📤 내 파일 업로드"]="📤 上传我的资产";
AUTO_KO_ALL.th["📤 내 파일 업로드"]="📤 อัปโหลดสินทรัพย์ของฉัน";
AUTO_KO_ALL.vi["📤 내 파일 업로드"]="📤 Tải tài sản của tôi lên";
AUTO_KO_ALL.ko["🎵 곡 정보 수정"]="🎵 곡 정보 수정";
AUTO_KO_ALL.en["🎵 곡 정보 수정"]="🎵 Edit Track Information";
AUTO_KO_ALL.ja["🎵 곡 정보 수정"]="🎵 トラック情報を編集";
AUTO_KO_ALL.zh["🎵 곡 정보 수정"]="🎵 编辑曲目信息";
AUTO_KO_ALL.th["🎵 곡 정보 수정"]="🎵 แก้ไขข้อมูลเพลง";
AUTO_KO_ALL.vi["🎵 곡 정보 수정"]="🎵 Chỉnh sửa thông tin bài hát";
AUTO_KO_ALL.ko["가수 / 아티스트"]="가수 / 아티스트";
AUTO_KO_ALL.en["가수 / 아티스트"]="Singer / Artist";
AUTO_KO_ALL.ja["가수 / 아티스트"]="歌手／アーティスト";
AUTO_KO_ALL.zh["가수 / 아티스트"]="歌手 / 艺术家";
AUTO_KO_ALL.th["가수 / 아티스트"]="นักร้อง / ศิลปิน";
AUTO_KO_ALL.vi["가수 / 아티스트"]="Ca sĩ / Nghệ sĩ";
AUTO_KO_ALL.ko["작곡"]="작곡";
AUTO_KO_ALL.en["작곡"]="Composer";
AUTO_KO_ALL.ja["작곡"]="作曲";
AUTO_KO_ALL.zh["작곡"]="作曲";
AUTO_KO_ALL.th["작곡"]="ผู้แต่งเพลง";
AUTO_KO_ALL.vi["작곡"]="Sáng tác";
AUTO_KO_ALL.ko["작사"]="작사";
AUTO_KO_ALL.en["작사"]="Lyricist";
AUTO_KO_ALL.ja["작사"]="作詞";
AUTO_KO_ALL.zh["작사"]="作词";
AUTO_KO_ALL.th["작사"]="ผู้แต่งเนื้อร้อง";
AUTO_KO_ALL.vi["작사"]="Viết lời";
AUTO_KO_ALL.ko["프로듀서"]="프로듀서";
AUTO_KO_ALL.en["프로듀서"]="Producer";
AUTO_KO_ALL.ja["프로듀서"]="プロデューサー";
AUTO_KO_ALL.zh["프로듀서"]="制作人";
AUTO_KO_ALL.th["프로듀서"]="โปรดิวเซอร์";
AUTO_KO_ALL.vi["프로듀서"]="Nhà sản xuất";
AUTO_KO_ALL.ko["편곡"]="편곡";
AUTO_KO_ALL.en["편곡"]="Arrangement";
AUTO_KO_ALL.ja["편곡"]="編曲";
AUTO_KO_ALL.zh["편곡"]="编曲";
AUTO_KO_ALL.th["편곡"]="เรียบเรียง";
AUTO_KO_ALL.vi["편곡"]="Phối khí";
AUTO_KO_ALL.ko["가사"]="가사";
AUTO_KO_ALL.en["가사"]="Lyrics";
AUTO_KO_ALL.ja["가사"]="歌詞";
AUTO_KO_ALL.zh["가사"]="歌词";
AUTO_KO_ALL.th["가사"]="เนื้อเพลง";
AUTO_KO_ALL.vi["가사"]="Lời bài hát";
AUTO_KO_ALL.ko["저장"]="저장";
AUTO_KO_ALL.en["저장"]="Save";
AUTO_KO_ALL.ja["저장"]="保存";
AUTO_KO_ALL.zh["저장"]="保存";
AUTO_KO_ALL.th["저장"]="บันทึก";
AUTO_KO_ALL.vi["저장"]="Lưu";
AUTO_KO_ALL.ko["💝 누적 기부 (초록우산)"]="💝 누적 기부 (초록우산)";
AUTO_KO_ALL.en["💝 누적 기부 (초록우산)"]="💝 Total Donations (Green Umbrella)";
AUTO_KO_ALL.ja["💝 누적 기부 (초록우산)"]="💝 累計寄付（緑の傘）";
AUTO_KO_ALL.zh["💝 누적 기부 (초록우산)"]="💝 累计捐赠（绿伞）";
AUTO_KO_ALL.th["💝 누적 기부 (초록우산)"]="💝 ยอดบริจาคสะสม (Green Umbrella)";
AUTO_KO_ALL.vi["💝 누적 기부 (초록우산)"]="💝 Tổng quyên góp (Green Umbrella)";
AUTO_KO_ALL.ko["⇄ TL ↔ TLC 교환"]="⇄ TL ↔ TLC 교환";
AUTO_KO_ALL.en["⇄ TL ↔ TLC 교환"]="⇄ Exchange TL ↔ TLC";
AUTO_KO_ALL.ja["⇄ TL ↔ TLC 교환"]="⇄ TL ↔ TLC交換";
AUTO_KO_ALL.zh["⇄ TL ↔ TLC 교환"]="⇄ TL ↔ TLC 兑换";
AUTO_KO_ALL.th["⇄ TL ↔ TLC 교환"]="⇄ แลกเปลี่ยน TL ↔ TLC";
AUTO_KO_ALL.vi["⇄ TL ↔ TLC 교환"]="⇄ Quy đổi TL ↔ TLC";
AUTO_KO_ALL.ko["📤 TON 지갑 출금"]="📤 TON 지갑 출금";
AUTO_KO_ALL.en["📤 TON 지갑 출금"]="📤 Withdraw to TON Wallet";
AUTO_KO_ALL.ja["📤 TON 지갑 출금"]="📤 TONウォレットへ出金";
AUTO_KO_ALL.zh["📤 TON 지갑 출금"]="📤 提现至 TON 钱包";
AUTO_KO_ALL.th["📤 TON 지갑 출금"]="📤 ถอนเข้า TON Wallet";
AUTO_KO_ALL.vi["📤 TON 지갑 출금"]="📤 Rút về ví TON";
AUTO_KO_ALL.ko["현재 청취자"]="현재 청취자";
AUTO_KO_ALL.en["현재 청취자"]="Current Listeners";
AUTO_KO_ALL.ja["현재 청취자"]="現在のリスナー";
AUTO_KO_ALL.zh["현재 청취자"]="当前听众";
AUTO_KO_ALL.th["현재 청취자"]="ผู้ฟังขณะนี้";
AUTO_KO_ALL.vi["현재 청취자"]="Người nghe hiện tại";
AUTO_KO_ALL.ko["방송 중인 곡"]="방송 중인 곡";
AUTO_KO_ALL.en["방송 중인 곡"]="Now Playing";
AUTO_KO_ALL.ja["방송 중인 곡"]="放送中の曲";
AUTO_KO_ALL.zh["방송 중인 곡"]="正在播放的歌曲";
AUTO_KO_ALL.th["방송 중인 곡"]="เพลงที่กำลังเล่น";
AUTO_KO_ALL.vi["방송 중인 곡"]="Đang phát";

/* Dashboard dynamic UI: mission labels and user-facing status messages. */
Object.assign(AUTO_KO_ALL.ko,{
"오늘 30분 청취":"Listen for 30 minutes today",
"SharePlace에서 음악을 30분 이상 청취":"Listen to music on SharePlace for at least 30 minutes",
"인카방송 주행":"Drive with In-car Broadcast",
"인카방송을 켜고 10km 이상 주행":"Drive at least 10 km with In-car Broadcast on",
"콘텐츠 업로드":"Register an asset",
"오늘 새 파일을 1개 업로드":"Register one new asset today",
"카페방송 청취":"Listen to Cafe Broadcast",
"카페 채널에서 20분 이상 청취":"Listen to a Cafe Channel for at least 20 minutes",
"주간 100 POC":"Weekly 100 POC",
"이번 주 POC 100점 이상":"Earn at least 100 POC this week",
"5곡 업로드":"Register 5 tracks",
"이번 주 5개 이상 파일 업로드":"Register at least 5 assets this week",
"100km 주행":"Drive 100 km",
"인카방송으로 100km 주행":"Drive 100 km with In-car Broadcast",
"첫 카페 채널 개설":"Open your first Cafe Channel",
"카페 채널을 처음으로 개설":"Open a Cafe Channel for the first time",
"TLC 100 달성":"Reach 100 TLC",
"TLC 100개 이상 보유":"Hold at least 100 TLC",
"개설한 카페 채널이 없습니다":"You have no Cafe Channels yet",
"채굴 내역 없음":"No mining history",
"⏳ POC 계산 중...":"⏳ Calculating POC...",
"POC 계산 실패":"POC calculation failed",
"채굴 가능한 TLC가 없습니다":"No TLC available to mine",
"⛏️ TLC 채굴 중...":"⛏️ Mining TLC...",
"채굴 실패":"Mining failed",
"⛏️ POC 계산 후 TLC 채굴":"⛏️ Calculate POC and Mine TLC",
"구매TL 최소 1,000TL부터 교환 가능합니다":"Exchange is available from 1,000 purchased TL",
"교환할 구매TL 금액을 입력하세요":"Enter the amount of purchased TL to exchange",
"유효한 금액을 입력하세요":"Enter a valid amount",
"교환 신청 완료":"Exchange request submitted",
"교환 오류: ":"Exchange error: ",
"현재 비밀번호를 입력하세요":"Enter your current password",
"새 비밀번호를 입력하세요":"Enter a new password",
"새 비밀번호는 8자 이상":"New password must be at least 8 characters",
"새 비밀번호가 일치하지 않습니다":"New passwords do not match",
"변경 중...":"Saving changes...",
"✅ 변경되었습니다":"✅ Password changed",
"비밀번호가 변경되었습니다":"Your password has been changed",
"곡 선택":"Select tracks",
"곡을 선택하세요":"Please select a track",
"먼저 곡을 선택하세요":"Select tracks first",
"선택 방송":"Selected Broadcast",
"서버 저장 실패":"Failed to save on server",
"곡을 DJ 센터로 보냈습니다":"Tracks sent to DJ Center"
});
Object.assign(AUTO_KO_ALL.en,{
"오늘 30분 청취":"本日30分間聴く",
"SharePlace에서 음악을 30분 이상 청취":"SharePlaceで30分以上音楽を聴く",
"인카방송 주행":"車載放送で走行",
"인카방송을 켜고 10km 이상 주행":"車載放送をオンにして10km以上走行",
"콘텐츠 업로드":"デジタル資産を登録",
"오늘 새 파일을 1개 업로드":"本日、新しいデジタル資産を1件登録",
"카페방송 청취":"カフェ放送を聴く",
"카페 채널에서 20분 이상 청취":"カフェチャンネルを20分以上聴く",
"주간 100 POC":"週間100 POC",
"이번 주 POC 100점 이상":"今週POCを100点以上獲得",
"5곡 업로드":"5曲を登録",
"이번 주 5개 이상 파일 업로드":"今週、5件以上のデジタル資産を登録",
"100km 주행":"100km走行",
"인카방송으로 100km 주행":"車載放送で100km走行",
"첫 카페 채널 개설":"初めてのカフェチャンネルを開設",
"카페 채널을 처음으로 개설":"初めてカフェチャンネルを開設する",
"TLC 100 달성":"TLCを100保有",
"TLC 100개 이상 보유":"TLCを100以上保有する",
"개설한 카페 채널이 없습니다":"開設済みのカフェチャンネルはありません",
"채굴 내역 없음":"マイニング履歴はありません",
"⏳ POC 계산 중...":"⏳ POCを計算中...",
"POC 계산 실패":"POCの計算に失敗しました",
"채굴 가능한 TLC가 없습니다":"採掘可能なTLCはありません",
"⛏️ TLC 채굴 중...":"⛏️ TLCを採掘中...",
"채굴 실패":"マイニングに失敗しました",
"⛏️ POC 계산 후 TLC 채굴":"⛏️ POCを計算してTLCを採掘",
"구매TL 최소 1,000TL부터 교환 가능합니다":"購入TLは1,000 TL以上から交換できます",
"교환할 구매TL 금액을 입력하세요":"交換する購入TLの数量を入力してください",
"유효한 금액을 입력하세요":"有効な金額を入力してください",
"교환 신청 완료":"交換申請が完了しました",
"교환 오류: ":"交換エラー：",
"현재 비밀번호를 입력하세요":"現在のパスワードを入力してください",
"새 비밀번호를 입력하세요":"新しいパスワードを入力してください",
"새 비밀번호는 8자 이상":"新しいパスワードは8文字以上にしてください",
"새 비밀번호가 일치하지 않습니다":"新しいパスワードが一致しません",
"변경 중...":"変更中...",
"✅ 변경되었습니다":"✅ 変更しました",
"비밀번호가 변경되었습니다":"パスワードを変更しました",
"곡 선택":"曲を選択",
"곡을 선택하세요":"曲を選択してください",
"먼저 곡을 선택하세요":"先に曲を選択してください",
"선택 방송":"選択した放送",
"서버 저장 실패":"サーバーへの保存に失敗しました",
"곡을 DJ 센터로 보냈습니다":"曲をDJセンターに送信しました"
});
Object.assign(AUTO_KO_ALL.ja,{
"오늘 30분 청취":"今天收听30分钟",
"SharePlace에서 음악을 30분 이상 청취":"在 SharePlace 收听音乐至少30分钟",
"인카방송 주행":"使用车载广播驾驶",
"인카방송을 켜고 10km 이상 주행":"开启车载广播行驶至少10公里",
"콘텐츠 업로드":"登记数字资产",
"오늘 새 파일을 1개 업로드":"今天登记一项新数字资产",
"카페방송 청취":"收听咖啡馆广播",
"카페 채널에서 20분 이상 청취":"在咖啡馆频道收听至少20分钟",
"주간 100 POC":"每周达到100 POC",
"이번 주 POC 100점 이상":"本周获得至少100 POC",
"5곡 업로드":"登记5首曲目",
"이번 주 5개 이상 파일 업로드":"本周登记至少5项数字资产",
"100km 주행":"行驶100公里",
"인카방송으로 100km 주행":"使用车载广播行驶100公里",
"첫 카페 채널 개설":"开设首个咖啡馆频道",
"카페 채널을 처음으로 개설":"首次开设咖啡馆频道",
"TLC 100 달성":"持有100 TLC",
"TLC 100개 이상 보유":"持有至少100 TLC",
"개설한 카페 채널이 없습니다":"您尚未创建咖啡馆频道",
"채굴 내역 없음":"暂无挖矿记录",
"⏳ POC 계산 중...":"⏳ 正在计算 POC...",
"POC 계산 실패":"POC计算失败",
"채굴 가능한 TLC가 없습니다":"没有可挖取的TLC",
"⛏️ TLC 채굴 중...":"⛏️ 正在挖取 TLC...",
"채굴 실패":"挖矿失败",
"⛏️ POC 계산 후 TLC 채굴":"⛏️ 计算 POC 并挖取 TLC",
"구매TL 최소 1,000TL부터 교환 가능합니다":"购买的TL至少达到1,000 TL才可兑换",
"교환할 구매TL 금액을 입력하세요":"请输入要兑换的已购TL数量",
"유효한 금액을 입력하세요":"请输入有效金额",
"교환 신청 완료":"兑换申请已提交",
"교환 오류: ":"兑换错误：",
"현재 비밀번호를 입력하세요":"请输入当前密码",
"새 비밀번호를 입력하세요":"请输入新密码",
"새 비밀번호는 8자 이상":"新密码至少需要8个字符",
"새 비밀번호가 일치하지 않습니다":"新密码不一致",
"변경 중...":"正在更改...",
"✅ 변경되었습니다":"✅ 已更改",
"비밀번호가 변경되었습니다":"密码已更改",
"곡 선택":"选择曲目",
"곡을 선택하세요":"请选择曲目",
"먼저 곡을 선택하세요":"请先选择曲目",
"선택 방송":"所选广播",
"서버 저장 실패":"服务器保存失败",
"곡을 DJ 센터로 보냈습니다":"曲目已发送至DJ中心"
});
Object.assign(AUTO_KO_ALL.zh,{
"오늘 30분 청취":"ฟัง 30 นาทีวันนี้",
"SharePlace에서 음악을 30분 이상 청취":"ฟังเพลงบน SharePlace อย่างน้อย 30 นาที",
"인카방송 주행":"ขับรถพร้อม In-car Broadcast",
"인카방송을 켜고 10km 이상 주행":"เปิด In-car Broadcast และขับอย่างน้อย 10 กม.",
"콘텐츠 업로드":"ลงทะเบียนสินทรัพย์ดิจิทัล",
"오늘 새 파일을 1개 업로드":"ลงทะเบียนสินทรัพย์ดิจิทัลใหม่ 1 รายการวันนี้",
"카페방송 청취":"ฟัง Cafe Broadcast",
"카페 채널에서 20분 이상 청취":"ฟังช่องคาเฟ่อย่างน้อย 20 นาที",
"주간 100 POC":"POC 100 ต่อสัปดาห์",
"이번 주 POC 100점 이상":"สะสม POC อย่างน้อย 100 คะแนนในสัปดาห์นี้",
"5곡 업로드":"ลงทะเบียน 5 เพลง",
"이번 주 5개 이상 파일 업로드":"ลงทะเบียนสินทรัพย์อย่างน้อย 5 รายการในสัปดาห์นี้",
"100km 주행":"ขับรถ 100 กม.",
"인카방송으로 100km 주행":"ขับรถ 100 กม. พร้อม In-car Broadcast",
"첫 카페 채널 개설":"เปิดช่องคาเฟ่ช่องแรก",
"카페 채널을 처음으로 개설":"เปิดช่องคาเฟ่เป็นครั้งแรก",
"TLC 100 달성":"ถือครอง TLC 100",
"TLC 100개 이상 보유":"ถือครอง TLC อย่างน้อย 100",
"개설한 카페 채널이 없습니다":"คุณยังไม่มีช่องคาเฟ่",
"채굴 내역 없음":"ไม่มีประวัติการขุด",
"⏳ POC 계산 중...":"⏳ กำลังคำนวณ POC...",
"POC 계산 실패":"คำนวณ POC ไม่สำเร็จ",
"채굴 가능한 TLC가 없습니다":"ไม่มี TLC ที่สามารถขุดได้",
"⛏️ TLC 채굴 중...":"⛏️ กำลังขุด TLC...",
"채굴 실패":"ขุดไม่สำเร็จ",
"⛏️ POC 계산 후 TLC 채굴":"⛏️ คำนวณ POC และขุด TLC",
"구매TL 최소 1,000TL부터 교환 가능합니다":"แลกเปลี่ยนได้ตั้งแต่ TL ที่ซื้อขั้นต่ำ 1,000 TL",
"교환할 구매TL 금액을 입력하세요":"กรอกจำนวน TL ที่ซื้อเพื่อแลกเปลี่ยน",
"유효한 금액을 입력하세요":"กรอกจำนวนเงินที่ถูกต้อง",
"교환 신청 완료":"ส่งคำขอแลกเปลี่ยนแล้ว",
"교환 오류: ":"ข้อผิดพลาดในการแลกเปลี่ยน: ",
"현재 비밀번호를 입력하세요":"กรอกรหัสผ่านปัจจุบัน",
"새 비밀번호를 입력하세요":"กรอกรหัสผ่านใหม่",
"새 비밀번호는 8자 이상":"รหัสผ่านใหม่ต้องมีอย่างน้อย 8 ตัวอักษร",
"새 비밀번호가 일치하지 않습니다":"รหัสผ่านใหม่ไม่ตรงกัน",
"변경 중...":"กำลังเปลี่ยน...",
"✅ 변경되었습니다":"✅ เปลี่ยนแล้ว",
"비밀번호가 변경되었습니다":"เปลี่ยนรหัสผ่านแล้ว",
"곡 선택":"เลือกเพลง",
"곡을 선택하세요":"โปรดเลือกเพลง",
"먼저 곡을 선택하세요":"เลือกเพลงก่อน",
"선택 방송":"รายการที่เลือก",
"서버 저장 실패":"บันทึกบนเซิร์ฟเวอร์ไม่สำเร็จ",
"곡을 DJ 센터로 보냈습니다":"ส่งเพลงไปยัง DJ Center แล้ว"
});
Object.assign(AUTO_KO_ALL.th,{
"오늘 30분 청취":"Nghe 30 phút hôm nay",
"SharePlace에서 음악을 30분 이상 청취":"Nghe nhạc trên SharePlace ít nhất 30 phút",
"인카방송 주행":"Lái xe cùng In-car Broadcast",
"인카방송을 켜고 10km 이상 주행":"Bật In-car Broadcast và lái xe ít nhất 10 km",
"콘텐츠 업로드":"Đăng ký tài sản số",
"오늘 새 파일을 1개 업로드":"Đăng ký một tài sản số mới hôm nay",
"카페방송 청취":"Nghe Cafe Broadcast",
"카페 채널에서 20분 이상 청취":"Nghe kênh Cafe ít nhất 20 phút",
"주간 100 POC":"100 POC mỗi tuần",
"이번 주 POC 100점 이상":"Đạt ít nhất 100 POC trong tuần này",
"5곡 업로드":"Đăng ký 5 bài hát",
"이번 주 5개 이상 파일 업로드":"Đăng ký ít nhất 5 tài sản trong tuần này",
"100km 주행":"Lái xe 100 km",
"인카방송으로 100km 주행":"Lái xe 100 km cùng In-car Broadcast",
"첫 카페 채널 개설":"Mở kênh Cafe đầu tiên",
"카페 채널을 처음으로 개설":"Mở kênh Cafe lần đầu tiên",
"TLC 100 달성":"Đạt 100 TLC",
"TLC 100개 이상 보유":"Nắm giữ ít nhất 100 TLC",
"개설한 카페 채널이 없습니다":"Bạn chưa có kênh Cafe nào",
"채굴 내역 없음":"Chưa có lịch sử khai thác",
"⏳ POC 계산 중...":"⏳ Đang tính POC...",
"POC 계산 실패":"Tính POC thất bại",
"채굴 가능한 TLC가 없습니다":"Không có TLC khả dụng để khai thác",
"⛏️ TLC 채굴 중...":"⛏️ Đang khai thác TLC...",
"채굴 실패":"Khai thác thất bại",
"⛏️ POC 계산 후 TLC 채굴":"⛏️ Tính POC và khai thác TLC",
"구매TL 최소 1,000TL부터 교환 가능합니다":"Chỉ có thể quy đổi từ 1.000 TL đã mua",
"교환할 구매TL 금액을 입력하세요":"Nhập số TL đã mua muốn quy đổi",
"유효한 금액을 입력하세요":"Nhập số tiền hợp lệ",
"교환 신청 완료":"Đã gửi yêu cầu quy đổi",
"교환 오류: ":"Lỗi quy đổi: ",
"현재 비밀번호를 입력하세요":"Nhập mật khẩu hiện tại",
"새 비밀번호를 입력하세요":"Nhập mật khẩu mới",
"새 비밀번호는 8자 이상":"Mật khẩu mới phải có ít nhất 8 ký tự",
"새 비밀번호가 일치하지 않습니다":"Mật khẩu mới không khớp",
"변경 중...":"Đang thay đổi...",
"✅ 변경되었습니다":"✅ Đã thay đổi",
"비밀번호가 변경되었습니다":"Mật khẩu đã được thay đổi",
"곡 선택":"Chọn bài hát",
"곡을 선택하세요":"Vui lòng chọn bài hát",
"먼저 곡을 선택하세요":"Vui lòng chọn bài hát trước",
"선택 방송":"Chương trình đã chọn",
"서버 저장 실패":"Lưu trên máy chủไม่สำเร็จ",
"곡을 DJ 센터로 보냈습니다":"Đã gửi bài hát đến DJ Center"
});
Object.assign(AUTO_KO_ALL.vi,{
"오늘 30분 청취":undefined,
"SharePlace에서 음악을 30분 이상 청취":undefined,
"인카방송 주행":undefined,
"인카방송을 켜고 10km 이상 주행":undefined,
"콘텐츠 업로드":undefined,
"오늘 새 파일을 1개 업로드":undefined,
"카페방송 청취":undefined,
"카페 채널에서 20분 이상 청취":undefined,
"주간 100 POC":undefined,
"이번 주 POC 100점 이상":undefined,
"5곡 업로드":undefined,
"이번 주 5개 이상 파일 업로드":undefined,
"100km 주행":undefined,
"인카방송으로 100km 주행":undefined,
"첫 카페 채널 개설":undefined,
"카페 채널을 처음으로 개설":undefined,
"TLC 100 달성":undefined,
"TLC 100개 이상 보유":undefined,
"개설한 카페 채널이 없습니다":undefined,
"채굴 내역 없음":undefined,
"⏳ POC 계산 중...":undefined,
"POC 계산 실패":undefined,
"채굴 가능한 TLC가 없습니다":undefined,
"⛏️ TLC 채굴 중...":undefined,
"채굴 실패":undefined,
"⛏️ POC 계산 후 TLC 채굴":undefined,
"구매TL 최소 1,000TL부터 교환 가능합니다":undefined,
"교환할 구매TL 금액을 입력하세요":undefined,
"유효한 금액을 입력하세요":undefined,
"교환 신청 완료":undefined,
"교환 오류: ":undefined,
"현재 비밀번호를 입력하세요":undefined,
"새 비밀번호를 입력하세요":undefined,
"새 비밀번호는 8자 이상":undefined,
"새 비밀번호가 일치하지 않습니다":undefined,
"변경 중...":undefined,
"✅ 변경되었습니다":undefined,
"비밀번호가 변경되었습니다":undefined,
"곡 선택":undefined,
"곡을 선택하세요":undefined,
"먼저 곡을 선택하세요":undefined,
"선택 방송":undefined,
"서버 저장 실패":undefined,
"곡을 DJ 센터로 보냈습니다":undefined
});



/* SharePlace and Creator Center dynamic UI translations. */
Object.assign(AUTO_KO_ALL.ko,{
"크리에이터들의 음악을 TL로 즐기세요. 1초 = 1TL.":"Enjoy creators’ music with TL. 1 second = 1 TL.",
"요청 시간 초과":"Request timed out",
"연결 오류":"Connection error",
"재생 정보 확인 중":"Checking playback information",
"증명서 정보를 찾을 수 없습니다":"Certificate information not found",
"파일이 없습니다.":"No assets found.",
"이 곡은 업로드 전용입니다.\n재생은 TL3 파일만 가능합니다.":"This track is for registration only.\nOnly TL3 assets can be played.",
"이 곡은 업로드 전용입니다.":"This track is for registration only.",
"파일 로드 실패 — 스트림 주소 또는 파일 형식을 확인하세요":"Failed to load asset — check the stream URL or file format.",
"곡의 TL이 부족합니다.\n지금 충전하시겠습니까?":"Insufficient TL for this track.\nWould you like to add TL now?",
"로그인이 필요합니다.":"Please log in.",
"충전할 TL을 입력하세요:":"Enter the amount of TL to add:",
"올바른 숫자를 입력하세요.":"Enter a valid number.",
"TL 잔액이 부족합니다.":"Insufficient TL balance.",
"충전 실패":"TL top-up failed",
"⏳ 다운로드 중...":"⏳ Downloading...",
"창작자 PC 저장 파일은 창작자 PC에서만 다운로드할 수 있습니다.":"Assets stored on the creator’s PC can only be downloaded from that PC.",
"다운로드 실패":"Download failed",
"자산 제목":"Asset title",
"아티스트명":"Artist name",
"직접 입력 가능":"You can enter this manually",
"앨범명 또는 간단한 설명":"Album name or short description",
"음원 제목":"Track title",
"이 브라우저는 Web Audio를 지원하지 않습니다.":"This browser does not support Web Audio.",
"원본 파일을 먼저 등록하세요.":"Register the source asset first.",
"LP 모듈(tl3-lp.js)을 불러오지 못했습니다.":"Could not load the LP module (tl3-lp.js).",
"TL3 생성 및 공유 중…":"Creating and sharing TL3…"
});
Object.assign(AUTO_KO_ALL.en,{
"크리에이터들의 음악을 TL로 즐기세요. 1초 = 1TL.":"クリエイターの音楽をTLで楽しみましょう。1秒＝1 TL。",
"요청 시간 초과":"リクエストがタイムアウトしました",
"연결 오류":"接続エラー",
"재생 정보 확인 중":"再生情報を確認中",
"증명서 정보를 찾을 수 없습니다":"証明書情報が見つかりません",
"파일이 없습니다.":"デジタル資産がありません。",
"이 곡은 업로드 전용입니다.\n재생은 TL3 파일만 가능합니다.":"この曲は登録専用です。\n再生できるのはTL3資産のみです。",
"이 곡은 업로드 전용입니다.":"この曲は登録専用です。",
"파일 로드 실패 — 스트림 주소 또는 파일 형식을 확인하세요":"資産の読み込みに失敗しました — ストリームURLまたはファイル形式を確認してください。",
"곡의 TL이 부족합니다.\n지금 충전하시겠습니까?":"この曲のTLが不足しています。\n今すぐチャージしますか？",
"로그인이 필요합니다.":"ログインが必要です。",
"충전할 TL을 입력하세요:":"チャージするTLの数量を入力してください：",
"올바른 숫자를 입력하세요.":"正しい数値を入力してください。",
"TL 잔액이 부족합니다.":"TL残高が不足しています。",
"충전 실패":"チャージに失敗しました",
"⏳ 다운로드 중...":"⏳ ダウンロード中...",
"창작자 PC 저장 파일은 창작자 PC에서만 다운로드할 수 있습니다.":"クリエイターのPCに保存された資産は、そのPCからのみダウンロードできます。",
"다운로드 실패":"ダウンロードに失敗しました",
"자산 제목":"資産タイトル",
"아티스트명":"アーティスト名",
"직접 입력 가능":"直接入力できます",
"앨범명 또는 간단한 설명":"アルバム名または簡単な説明",
"음원 제목":"楽曲タイトル",
"이 브라우저는 Web Audio를 지원하지 않습니다.":"このブラウザーはWeb Audioに対応していません。",
"원본 파일을 먼저 등록하세요.":"先に元の資産を登録してください。",
"LP 모듈(tl3-lp.js)을 불러오지 못했습니다.":"LPモジュール（tl3-lp.js）を読み込めませんでした。",
"TL3 생성 및 공유 중…":"TL3を作成して共有中…"
});
Object.assign(AUTO_KO_ALL.ja,{
"크리에이터들의 음악을 TL로 즐기세요. 1초 = 1TL.":"使用 TL 欣赏创作者的音乐。1秒 = 1 TL。",
"요청 시간 초과":"请求超时",
"연결 오류":"连接错误",
"재생 정보 확인 중":"正在检查播放信息",
"증명서 정보를 찾을 수 없습니다":"未找到证书信息",
"파일이 없습니다.":"没有数字资产。",
"이 곡은 업로드 전용입니다.\n재생은 TL3 파일만 가능합니다.":"此曲仅用于登记。\n只有 TL3 资产可以播放。",
"이 곡은 업로드 전용입니다.":"此曲仅用于登记。",
"파일 로드 실패 — 스트림 주소 또는 파일 형식을 확인하세요":"资产加载失败 — 请检查流媒体地址或文件格式。",
"곡의 TL이 부족합니다.\n지금 충전하시겠습니까?":"此曲的 TL 不足。\n现在充值吗？",
"로그인이 필요합니다.":"请先登录。",
"충전할 TL을 입력하세요:":"请输入要充值的 TL 数量：",
"올바른 숫자를 입력하세요.":"请输入有效数字。",
"TL 잔액이 부족합니다.":"TL余额不足。",
"충전 실패":"充值失败",
"⏳ 다운로드 중...":"⏳ 正在下载...",
"창작자 PC 저장 파일은 창작자 PC에서만 다운로드할 수 있습니다.":"保存在创作者电脑上的资产只能从该电脑下载。",
"다운로드 실패":"下载失败",
"자산 제목":"资产标题",
"아티스트명":"艺术家名称",
"직접 입력 가능":"可手动输入",
"앨범명 또는 간단한 설명":"专辑名称或简要说明",
"음원 제목":"音轨标题",
"이 브라우저는 Web Audio를 지원하지 않습니다.":"此浏览器不支持 Web Audio。",
"원본 파일을 먼저 등록하세요.":"请先登记源资产。",
"LP 모듈(tl3-lp.js)을 불러오지 못했습니다.":"无法加载 LP 模块（tl3-lp.js）。",
"TL3 생성 및 공유 중…":"正在创建并共享 TL3…"
});
Object.assign(AUTO_KO_ALL.zh,{
"크리에이터들의 음악을 TL로 즐기세요. 1초 = 1TL.":"เพลิดเพลินกับเพลงของครีเอเตอร์ด้วย TL 1 วินาที = 1 TL",
"요청 시간 초과":"คำขอหมดเวลา",
"연결 오류":"ข้อผิดพลาดในการเชื่อมต่อ",
"재생 정보 확인 중":"กำลังตรวจสอบข้อมูลการเล่น",
"증명서 정보를 찾을 수 없습니다":"ไม่พบข้อมูลใบรับรอง",
"파일이 없습니다.":"ไม่พบสินทรัพย์ดิจิทัล",
"이 곡은 업로드 전용입니다.\n재생은 TL3 파일만 가능합니다.":"แทร็กนี้ใช้สำหรับลงทะเบียนเท่านั้น\nเล่นได้เฉพาะสินทรัพย์ TL3",
"이 곡은 업로드 전용입니다.":"แทร็กนี้ใช้สำหรับลงทะเบียนเท่านั้น",
"파일 로드 실패 — 스트림 주소 또는 파일 형식을 확인하세요":"โหลดสินทรัพย์ไม่สำเร็จ — ตรวจสอบ URL สตรีมหรือรูปแบบไฟล์",
"곡의 TL이 부족합니다.\n지금 충전하시겠습니까?":"TL สำหรับแทร็กนี้ไม่เพียงพอ\nต้องการเติม TL ตอนนี้หรือไม่?",
"로그인이 필요합니다.":"กรุณาเข้าสู่ระบบ",
"충전할 TL을 입력하세요:":"กรอกจำนวน TL ที่ต้องการเติม:",
"올바른 숫자를 입력하세요.":"กรอกตัวเลขที่ถูกต้อง",
"TL 잔액이 부족합니다.":"ยอด TL คงเหลือไม่เพียงพอ",
"충전 실패":"เติม TL ไม่สำเร็จ",
"⏳ 다운로드 중...":"⏳ กำลังดาวน์โหลด...",
"창작자 PC 저장 파일은 창작자 PC에서만 다운로드할 수 있습니다.":"สินทรัพย์ที่บันทึกไว้ในคอมพิวเตอร์ของครีเอเตอร์สามารถดาวน์โหลดได้จากเครื่องนั้นเท่านั้น",
"다운로드 실패":"ดาวน์โหลดไม่สำเร็จ",
"자산 제목":"ชื่อสินทรัพย์",
"아티스트명":"ชื่อศิลปิน",
"직접 입력 가능":"สามารถกรอกเองได้",
"앨범명 또는 간단한 설명":"ชื่ออัลบั้มหรือคำอธิบายสั้น ๆ",
"음원 제목":"ชื่อเพลง",
"이 브라우저는 Web Audio를 지원하지 않습니다.":"เบราว์เซอร์นี้ไม่รองรับ Web Audio",
"원본 파일을 먼저 등록하세요.":"โปรดลงทะเบียนสินทรัพย์ต้นฉบับก่อน",
"LP 모듈(tl3-lp.js)을 불러오지 못했습니다.":"ไม่สามารถโหลดโมดูล LP (tl3-lp.js) ได้",
"TL3 생성 및 공유 중…":"กำลังสร้างและแชร์ TL3…"
});
Object.assign(AUTO_KO_ALL.th,{
"크리에이터들의 음악을 TL로 즐기세요. 1초 = 1TL.":"Thưởng thức âm nhạc của nhà sáng tạo bằng TL. 1 giây = 1 TL.",
"요청 시간 초과":"Yêu cầu đã hết thời gian",
"연결 오류":"Lỗi kết nối",
"재생 정보 확인 중":"Đang kiểm tra thông tin phát",
"증명서 정보를 찾을 수 없습니다":"Không tìm thấy thông tin chứng nhận",
"파일이 없습니다.":"Không tìm thấy tài sản số.",
"이 곡은 업로드 전용입니다.\n재생은 TL3 파일만 가능합니다.":"Bản nhạc này chỉ dành cho đăng ký.\nChỉ tài sản TL3 mới có thể phát.",
"이 곡은 업로드 전용입니다.":"Bản nhạc này chỉ dành cho đăng ký.",
"파일 로드 실패 — 스트림 주소 또는 파일 형식을 확인하세요":"Không tải được tài sản — hãy kiểm tra URL luồng hoặc định dạng tệp.",
"곡의 TL이 부족합니다.\n지금 충전하시겠습니까?":"Không đủ TL cho bài hát này.\nBạn có muốn nạp TL ngay không?",
"로그인이 필요합니다.":"Vui lòng đăng nhập.",
"충전할 TL을 입력하세요:":"Nhập số TL muốn nạp:",
"올바른 숫자를 입력하세요.":"Vui lòng nhập một số hợp lệ.",
"TL 잔액이 부족합니다.":"Số dư TL không đủ.",
"충전 실패":"Nạp TL thất bại",
"⏳ 다운로드 중...":"⏳ Đang tải xuống...",
"창작자 PC 저장 파일은 창작자 PC에서만 다운로드할 수 있습니다.":"Tài sản lưu trên máy tính của nhà sáng tạo chỉ có thể tải xuống từ máy tính đó.",
"다운로드 실패":"Tải xuống thất bại",
"자산 제목":"Tiêu đề tài sản",
"아티스트명":"Tên nghệ sĩ",
"직접 입력 가능":"Có thể nhập thủ công",
"앨범명 또는 간단한 설명":"Tên album hoặc mô tả ngắn",
"음원 제목":"Tên bản nhạc",
"이 브라우저는 Web Audio를 지원하지 않습니다.":"Trình duyệt này không hỗ trợ Web Audio.",
"원본 파일을 먼저 등록하세요.":"Vui lòng đăng ký tài sản gốc trước.",
"LP 모듈(tl3-lp.js)을 불러오지 못했습니다.":"Không thể tải mô-đun LP (tl3-lp.js).",
"TL3 생성 및 공유 중…":"Đang tạo và chia sẻ TL3…"
});
Object.assign(AUTO_KO_ALL.vi,{
"크리에이터들의 음악을 TL로 즐기세요. 1초 = 1TL.":undefined,
"요청 시간 초과":undefined,
"연결 오류":undefined,
"재생 정보 확인 중":undefined,
"증명서 정보를 찾을 수 없습니다":undefined,
"파일이 없습니다.":undefined,
"이 곡은 업로드 전용입니다.\n재생은 TL3 파일만 가능합니다.":undefined,
"이 곡은 업로드 전용입니다.":undefined,
"파일 로드 실패 — 스트림 주소 또는 파일 형식을 확인하세요":undefined,
"곡의 TL이 부족합니다.\n지금 충전하시겠습니까?":undefined,
"로그인이 필요합니다.":undefined,
"충전할 TL을 입력하세요:":undefined,
"올바른 숫자를 입력하세요.":undefined,
"TL 잔액이 부족합니다.":undefined,
"충전 실패":undefined,
"⏳ 다운로드 중...":undefined,
"창작자 PC 저장 파일은 창작자 PC에서만 다운로드할 수 있습니다.":undefined,
"다운로드 실패":undefined,
"자산 제목":undefined,
"아티스트명":undefined,
"직접 입력 가능":undefined,
"앨범명 또는 간단한 설명":undefined,
"음원 제목":undefined,
"이 브라우저는 Web Audio를 지원하지 않습니다.":undefined,
"원본 파일을 먼저 등록하세요.":undefined,
"LP 모듈(tl3-lp.js)을 불러오지 못했습니다.":undefined,
"TL3 생성 및 공유 중…":undefined
});

var AUTO_TEXT=new WeakMap(),AUTO_ATTR=new WeakMap();
function applyAutoText(){
 var walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,{acceptNode:function(n){var p=n.parentElement;return !p||/^(SCRIPT|STYLE|NOSCRIPT|TEXTAREA|CODE|PRE)$/i.test(p.tagName)||p.closest('[data-i18n],[data-i18n-html]')||!n.nodeValue.trim()?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT;}});
 var nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
 nodes.forEach(function(n){var v=n.nodeValue,r=AUTO_TEXT.get(n);if(r&&v!==r.last)r=null;if(!r)r={source:v,last:v};var map=AUTO_KO_ALL[_lang]||(_lang==='en'?AUTO_KO_EN:(_lang==='ko'?AUTO_EN_KO:null)),target=map?map[r.source.trim()]:null;var next=r.source;if(target){var lead=r.source.match(/^\s*/)[0],tail=r.source.match(/\s*$/)[0];next=lead+target+tail;}if(n.nodeValue!==next)n.nodeValue=next;r.last=next;AUTO_TEXT.set(n,r);});
 document.querySelectorAll('input[placeholder],textarea[placeholder],[title],[aria-label]').forEach(function(el){['placeholder','title','aria-label'].forEach(function(a){if(!el.hasAttribute(a))return;var m=AUTO_ATTR.get(el)||{},r=m[a],v=el.getAttribute(a);if(r&&v!==r.last)r=null;if(!r)r={source:v,last:v};var map=AUTO_KO_ALL[_lang]||(_lang==='en'?AUTO_KO_EN:(_lang==='ko'?AUTO_EN_KO:null)),next=map?(map[r.source]||r.source):r.source;if(v!==next)el.setAttribute(a,next);r.last=next;m[a]=r;AUTO_ATTR.set(el,m);});});
}

/* ── DOM 자동 번역 ── */
function applyAll(){
  // data-i18n 텍스트
  document.querySelectorAll('[data-i18n]').forEach(function(el){
    var key=el.getAttribute('data-i18n');
    var val=t(key);
    if(el.tagName==='INPUT'||el.tagName==='TEXTAREA'){
      if(el.placeholder!==val) el.placeholder=val;
    } else {
      if(el.textContent!==val) el.textContent=val;
    }
  });
  // data-i18n-placeholder
  document.querySelectorAll('[data-i18n-placeholder]').forEach(function(el){
    var v=t(el.getAttribute('data-i18n-placeholder')); if(el.placeholder!==v) el.placeholder=v;
  });
  // data-i18n-title
  document.querySelectorAll('[data-i18n-title]').forEach(function(el){
    var v=t(el.getAttribute('data-i18n-title')); if(el.title!==v) el.title=v;
  });
  // data-i18n-html (HTML 내용 포함)
  document.querySelectorAll('[data-i18n-html]').forEach(function(el){
    var v=t(el.getAttribute('data-i18n-html')); if(el.innerHTML!==v) el.innerHTML=v;
  });
  // Apply exact-copy translations to legacy pages without data-i18n annotations.
  applyAutoText();
  var sourceTitle=window.__TL_SOURCE_TITLE__||(window.__TL_SOURCE_TITLE__=document.title);
  var translatedTitle=(_lang==='en'?AUTO_TITLES[sourceTitle]:Object.keys(AUTO_TITLES).find(function(k){return AUTO_TITLES[k]===sourceTitle;}));
  if(_lang==='en'&&translatedTitle)document.title=AUTO_TITLES[sourceTitle];
  else if(_lang==='ko'&&translatedTitle)document.title=translatedTitle;
  // html lang 속성
  document.documentElement.lang=_lang;
  // body에 lang 클래스 추가 (CSS font 등 제어용)
  document.body.setAttribute('data-lang',_lang);
}

/* ── 언어 전환 ── */
var _settingLang = false; // 재진입 방지
function setLang(lang){
  if(!LANGS.includes(lang)) return;
  if(_settingLang) return; // 재진입 방지
  _settingLang = true;
  _lang=lang;
  localStorage.setItem('tl_lang',lang);
  window.dispatchEvent(new CustomEvent('tl-language-changed',{detail:{lang:lang}}));
  applyAll();
  updateSwitcherUI();
  // 페이지별 동적 재렌더링 (renderLangSw는 updateSwitcherUI에서 처리)
  if(typeof window.applyFilter==='function') window.applyFilter();
  if(typeof window.renderMyFiles==='function') window.renderMyFiles();
  setTimeout(function(){ _settingLang=false; }, 50);
}

function updateSwitcherUI(){
  // 상단 고정 스위처 버튼 상태만 업데이트 (재생성 없음)
  var sw=document.getElementById('tl-lang-switcher');
  if(sw) sw.querySelectorAll('.tl-lang-btn').forEach(function(b){
    var on=b.dataset.lang===_lang;
    b.classList.toggle('tl-lang-active',on);
    b.setAttribute('aria-pressed',on?'true':'false');
    b.style.opacity=on?'1':'0.5';
    b.style.background=on?'rgba(255,255,255,.15)':'none';
    b.style.borderColor=on?'rgba(255,255,255,.3)':'transparent';
  });
  // 인라인 스위처 (.lang-btn 클래스만, data-lang 전체 X - 너무 광범위)
  document.querySelectorAll('.lang-btn').forEach(function(b){
    if(!b.dataset.lang) return;
    b.classList.toggle('active',b.dataset.lang===_lang);
    b.style.opacity=b.dataset.lang===_lang?'1':'0.4';
  });
}

/* ── 언어 선택 버튼 UI 생성 ── */
function createLangSwitcher(containerId){
  var wrap=document.getElementById(containerId);
  if(!wrap) return;
  wrap.innerHTML='';
  LANGS.forEach(function(l){
    var btn=document.createElement('button');
    btn.className='lang-btn'+(l===_lang?' active':'');
    btn.dataset.lang=l;
    btn.textContent=LABELS[l];
    btn.style.opacity=l===_lang?'1':'0.4';
    btn.onclick=function(){ TLi18n.setLang(l); };
    wrap.appendChild(btn);
  });
}

/* ── 상단 고정 스위처 자동 삽입 ── */
function injectSwitcher(){
  if(document.getElementById('tl-lang-switcher')) return;
  var sw=document.createElement('div');
  sw.id='tl-lang-switcher';
  sw.setAttribute('role','group');
  sw.setAttribute('aria-label','Language');
  sw.style.cssText=[
    'position:fixed;top:14px;right:18px;z-index:100050',
    'display:flex;gap:3px;align-items:center',
    'background:rgba(10,10,20,.94);backdrop-filter:blur(16px)',
    'border:1px solid rgba(255,255,255,.18);border-radius:22px',
    'padding:4px;box-shadow:0 4px 20px rgba(0,0,0,.38)'
  ].join(';');
  var switcherLangs=LANGS;
  var shortLabels={en:'EN',ko:'KR',ja:'JP',zh:'中文',th:'TH',vi:'VI'};
  switcherLangs.forEach(function(l){
    var btn=document.createElement('button');
    btn.className='tl-lang-btn'+(l===_lang?' tl-lang-active':'');
    btn.dataset.lang=l;
    btn.textContent=shortLabels[l]||LABELS[l];
    btn.title=LABELS[l];
    btn.setAttribute('aria-pressed',l===_lang?'true':'false');
    btn.style.cssText=[
      'background:'+(l===_lang?'rgba(139,108,240,.95)':'transparent'),
      'border:1px solid '+(l===_lang?'rgba(255,255,255,.24)':'transparent'),
      'cursor:pointer;font:700 11px/1 Inter,Pretendard,sans-serif',
      'min-width:32px;padding:8px 7px;border-radius:18px',
      'opacity:'+(l===_lang?'1':'0.58'),
      'transition:all .2s;color:#fff'
    ].join(';');
    (function(lang){btn.onclick=function(){TLi18n.setLang(lang);};})(l);
    sw.appendChild(btn);
  });
  document.body.appendChild(sw);
}

function injectStyle(){
  if(document.getElementById('tl-i18n-style')) return;
  var s=document.createElement('style');
  s.id='tl-i18n-style';
  s.textContent=[
    '.tl-lang-btn{color:#fff!important;-webkit-text-fill-color:initial!important;}',
    '.tl-lang-active{opacity:1!important;background:rgba(255,255,255,.15)!important;}',
    '.tl-lang-btn:hover{opacity:1!important;background:rgba(255,255,255,.1)!important;}',
    'body:has(.g-nav) .g-nav-actions{margin-right:104px!important;}@media(max-width:650px){body:has(.g-nav) #tl-lang-switcher{top:72px;right:12px;}body:has(.g-nav) .g-nav-actions{margin-right:0!important;}}'
  ].join('');
  document.head.appendChild(s);
}

/* ── 초기화 ── */
function init(){
  injectStyle();
  applyAll();
  // 2026-10-16: topbar 있으면 자체 스위처 X (topbar-v2.js가 대신)
  if(!document.querySelector('.tl-topbar') && !document.querySelector('[data-tl-topbar]')){
    injectSwitcher();
  }
  if(!window.__TL_I18N_OBSERVER__){
    var queued=false;
    var observer=new MutationObserver(function(){
      if(queued)return;queued=true;
      Promise.resolve().then(function(){queued=false;applyAll();});
    });
    observer.observe(document.body,{subtree:true,childList:true,characterData:true});
    window.__TL_I18N_OBSERVER__=observer;
  }
}

if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded',init);
} else {
  init();
}

window.TLi18n={
  t:t,
  formatNumber:function(value,options){return new Intl.NumberFormat(_lang==='zh'?'zh-CN':_lang,{maximumFractionDigits:options&&options.maximumFractionDigits!=null?options.maximumFractionDigits:2}).format(Number(value)||0);},
  formatDate:function(value,options){var d=value instanceof Date?value:new Date(value);return isNaN(d.getTime())?'':new Intl.DateTimeFormat(_lang==='zh'?'zh-CN':_lang,{dateStyle:(options&&options.dateStyle)||'medium',timeZone:(options&&options.timeZone)||undefined}).format(d);},
    formatCurrency:function(value,currency,options){return new Intl.NumberFormat(_lang==='zh'?'zh-CN':_lang,{style:'currency',currency:currency||'KRW',maximumFractionDigits:options&&options.maximumFractionDigits!=null?options.maximumFractionDigits:0}).format(Number(value)||0);},
  audit:function(root){var base=root||document.body,found=[],seen=new Set(),skip=/^(SCRIPT|STYLE|NOSCRIPT|TEXTAREA|INPUT|CODE|PRE|SVG)$/i;var walker=document.createTreeWalker(base,NodeFilter.SHOW_TEXT,{acceptNode:function(n){var p=n.parentElement;if(!p||skip.test(p.tagName)||p.closest('[data-notranslate],[contenteditable="true"],[data-i18n],[data-i18n-html]'))return NodeFilter.FILTER_REJECT;var v=(n.nodeValue||'').trim();return /[\uAC00-\uD7A3]/.test(v)?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT;}});while(walker.nextNode()){var n=walker.currentNode,v=n.nodeValue.trim(),tag=n.parentElement.tagName+' .'+String(n.parentElement.className||'').toString().split(' ').filter(Boolean).join('.');var key=tag+'|'+v;if(!seen.has(key)){seen.add(key);found.push({tag:tag,text:v});}}base.querySelectorAll('input[placeholder],input[value],textarea[placeholder],[title],[aria-label],[alt],meta[content]').forEach(function(el){['placeholder','value','title','aria-label','alt','content'].forEach(function(a){var v=(el.getAttribute(a)||'').trim();if(/[\uAC00-\uD7A3]/.test(v)){var key=el.tagName+'['+a+']|'+v;if(!seen.has(key)){seen.add(key);found.push({tag:el.tagName+'['+a+']',text:v});}}});});var missingKeys=[];base.querySelectorAll('[data-i18n],[data-i18n-placeholder],[data-i18n-title],[data-i18n-html],[data-i18n-content]').forEach(function(el){['data-i18n','data-i18n-placeholder','data-i18n-title','data-i18n-html','data-i18n-content'].forEach(function(a){var k=el.getAttribute(a);if(!k)return;var row=T[k];if(!row||!row[_lang])missingKeys.push({attribute:a,key:k});});});var titleText=(document.title||'').trim();if(/[\\uAC00-\\uD7A3]/.test(titleText))found.push({tag:'document.title',text:titleText});return {language:_lang,count:found.length,items:found,missingKeys:missingKeys};},
  setLang:setLang,
  applyAll:applyAll,
  createLangSwitcher:createLangSwitcher,
  getLang:function(){ return _lang; },
  lang:_lang
};

Object.defineProperty(window.TLi18n,'lang',{get:function(){return _lang;}});

})();






