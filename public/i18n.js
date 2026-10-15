/* TimeLink i18n v2 — KO·EN·JA·ZH·TH·VI */
(function(){
var LANGS=['ko','en','ja','zh','th','vi'];
var FLAGS={ko:'🇰🇷',en:'🇺🇸',ja:'🇯🇵',zh:'🇨🇳',th:'🇹🇭',vi:'🇻🇳'};
var LABELS={ko:'한국어',en:'English',ja:'日本語',zh:'中文',th:'ภาษาไทย',vi:'Tiếng Việt'};

var T={
/* ── 누락 키 전체 보완 (60개) ── */
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

var _lang=detectLang();

/* ── 번역 함수 ── */
function t(key,fallback){
  var row=T[key];
  if(!row) return fallback||key;
  return row[_lang]||row['en']||row['ko']||fallback||key;
}

/* Exact-copy fallback for legacy pages that have not yet been annotated with data-i18n. */
var AUTO_KO_EN={
'로그인':'Login','회원가입':'Sign up','다시 오셨군요':'Welcome back','계속 Pulse를 쌓아보세요':'Keep building your Pulse','이메일':'Email','비밀번호':'Password','비밀번호를 잊으셨나요?':'Forgot password?','또는':'OR','무료 가입':'Sign up free','계정 만들기':'Create account','비밀번호 확인':'Confirm password','닉네임':'Display name','가입하고 시작하기':'Create account and continue','이미 계정이 있으신가요?':'Already have an account?','인증 완료':'Verified','코드 재발송':'Resend code','확인':'Confirm','취소':'Cancel','닫기':'Close','저장':'Save','수정':'Edit','삭제':'Delete','완료':'Done','다음':'Next','이전':'Back','검색':'Search','적용':'Apply','로그아웃':'Log out',
'대시보드':'Dashboard','홈':'Home','지갑':'Wallet','TLC 채굴':'TLC Mining','내 콘텐츠':'My Assets','미션':'Missions','바로가기':'Quick Links','TL방송국':'TimeLink Radio','크리에이터 센터':'Creator Studio','카페 채널':'Cafe Channels','TL 잔액':'TL Balance','TLC 보유량':'TLC Balance','오늘 POC':'Today’s POC','기여 점수':'Contribution Score','업로드한 파일':'Uploaded Assets','파일 업로드':'Upload Asset','방송 청취':'Listen to Broadcast','카페방송':'Cafe Broadcast','TL 총 잔액':'Total TL Balance','+ TL 충전':'+ Add TL','채굴 현황':'Mining Status','오늘 POC 점수':'Today’s POC Score','누적 TLC 채굴량':'Total TLC Mined','POC 기여 지수':'POC Contribution Index','채굴 내역':'Mining History','로딩 중...':'Loading…','전체 파일':'All Assets','총 재생 수':'Total Plays','수익 TL':'Rewards (TL)','총 Pulse':'Total Pulse','새 파일 업로드':'Upload New Asset','전체 선택':'Select All','선택 삭제':'Delete Selected','방송 시작':'Start Broadcast','방송 중인 곡':'Now Playing','전체 보기 →':'View all →','최신순':'Latest','인기순':'Popular','전체 자산':'All Assets','음악':'Music','영상':'Video','문서':'Documents','TL 충전':'Add TL','결제하기':'Pay','결제 금액':'Payment Amount','지급 TL':'TL to Receive','현재 잔액':'Current Balance','거래내역':'Transactions','내역':'History','복사':'Copy','제목':'Title','아티스트':'Artist','앨범':'Album','장르':'Genre','설명':'Description','공개 범위 설정':'Set Visibility','공개 범위':'Visibility','공개 방식':'Sharing Method','권리 확인':'Rights Verification','권리보호형':'Rights Protected','발행 수수료':'Issuance Fee','정지':'Stop','재생':'Play','일시정지':'Pause','공유하기':'Share','링크 복사':'Copy Link','플레이리스트에 추가':'Add to Playlist','새 플레이리스트 만들기':'Create Playlist','악보':'Sheet Music',
'사용시간에 따라 보상이 산정됩니다':'Rewards are calculated based on usage time','시간을 충전하고, 사용한 만큼만 지불합니다.':'Add time and pay only for what you use.','10시간 TL 충전':'Add 10 hours of TL','40분 사용':'40 minutes used','사용 측정 · 차감':'Usage measured · deducted','9시간 20분 남음':'9 hours 20 minutes remaining','창작자 정산':'Creator settlement','하나의 Core Engine에 형식별 Adapter-Viewer만 추가합니다.':'One Core Engine with format-specific adapters and viewers.','음악 자산 등록 및 관리':'Register and manage music assets','TL3 공유 조건 직접 설정':'Set TL3 sharing terms','사용시간 기반 정산':'Usage-time-based rewards','카페방송 B2B':'B2B cafe broadcasting','지금 공유되는 음악':'Music shared now','창작자가 공유한 음악 자산과 트랙을 살펴보세요.':'Explore music assets and tracks shared by creators.','음악 자산을 불러오는 중...':'Loading music assets…','모든 음악 자산 보기 →':'Explore all music assets →','☕ 카페를 위한 24시간 라디오':'☕ 24/7 Radio for Cafes','카페 시작하기':'Get Started','유료화를 강요하지 않습니다':'Monetization is your choice','창작자가 공개 범위와 공유 조건, 권리 정책을 직접 결정합니다.':'Creators control visibility, sharing terms, and rights policies.','기여와 보상 연결':'Contribution and Rewards','플랫폼에 대한 기여를 경제적으로 측정합니다.':'Measure contributions to the platform economically.','콘텐츠 측면':'Content Contributions','생태계 측면':'Ecosystem Contributions','콘텐츠 제작':'Content Creation','추천·공유':'Recommend · Share','POC 측정':'POC Measurement','Index 산출':'Calculate Index','TLC 보상':'TLC Rewards','콘텐츠 데이터':'Content Data','사용 데이터':'Usage Data','수익 데이터':'Reward Data','AI 예측':'AI Forecasting','금융 연계':'Financial Integration','법률':'Legal','연구':'Research','금융':'Finance','기업':'Business','컨설팅':'Consulting','엔지니어링':'Engineering','교육':'Education','← 대시보드':'← Dashboard','처리 중...':'Processing…','잠시만 기다려주세요':'Please wait','원본 MP3 선택':'Select Original MP3','원본 MP3를 여기에 놓으세요':'Drop the original MP3 here','전체 제거':'Remove All','디지털 자산 정보 입력':'Enter Digital Asset Details','초당 차감 TL':'TL deducted per second','보상 정책':'Reward Policy','일반 음질':'Standard Quality','장르 (Spotify)':'Genre (Spotify)','선택 안 함':'None selected','작곡':'Composer','작사':'Lyricist','프로듀서':'Producer','가사':'Lyrics','TL / 월':'TL / month','창작자':'Creator','이용자와 커뮤니티':'Users and Community','오프라인 사업자':'Offline Businesses','기업과 기관':'Enterprises and Institutions','공유된 디지털 자산이 여기에 표시됩니다.':'Shared digital assets will appear here.','공유된 음악 자산이 여기에 표시됩니다.':'Shared music assets will appear here.','공유 자산을 일시적으로 불러올 수 없습니다.':'Shared assets are temporarily unavailable.','TL 잔량':'TL Remaining','초당 소모':'Per-second Usage','⚠️ TL 부족!':'⚠️ Insufficient TL!','TL 충전하기':'Add TL','이용약관':'Terms of Service','개인정보 처리방침':'Privacy Policy','개인정보처리방침':'Privacy Policy','크리에이터 정책':'Creator Policy','광고 센터':'Advertising Center','광고주 센터':'Advertiser Center','DJ 가이드':'DJ Guide','서비스':'Services','법적 정보':'Legal','내역 보기':'View History','연결':'Connect','연결 해제':'Disconnect','신청':'Apply','상세 보기':'View Details',
'Digital value,':'디지털 가치,','connected by time.':'시간으로 연결됩니다.','DIGITAL ASSET RIGHTS & DISTRIBUTION':'디지털 자산 권리 및 유통','Explore TimeLink':'타임링크 둘러보기','Explore SharePlace':'공유 공간 둘러보기','Creator-controlled rights':'창작자 중심 권리 관리','Time-based access':'시간 기반 접근','Contribution economy':'기여 경제','Multi-format assets':'다양한 형식의 자산','One connected ecosystem':'하나로 연결된 생태계','One platform.':'하나의 플랫폼.','Multiple ways to create value.':'다양한 가치 창출 방식.','Create & Register':'생성 및 등록','Share & Access':'공유 및 이용','Measure & Reward':'측정 및 보상','Digital asset standards':'디지털 자산 표준','Different formats.':'서로 다른 형식.','One rights infrastructure.':'하나의 권리 인프라.','Music & Audio':'음악 및 오디오','Digital Collections':'디지털 컬렉션','Product Portfolio':'제품 구성','How it works':'작동 방식','Creator Economy':'창작자 경제','Contribution Economy':'기여 경제','POC — Proof of Contribution':'POC — 기여 증명','AI Prediction · Financial Integration':'AI 예측 · 금융 연계','For Business · Digital Usage Rights':'기업용 · 디지털 사용 권리','Connected Participants':'참여자 연결','Built for the whole ecosystem':'생태계 전체를 위한 플랫폼','Purpose-built experiences.':'목적에 맞춘 이용 경험.','Creators':'창작자','Community':'커뮤니티','Broadcast':'방송','Businesses':'기업','Discover what creators share.':'창작자가 공유하는 자산을 발견하세요.','Your digital assets.':'나의 디지털 자산.','Your rights. Your possibilities.':'나의 권리, 나의 가능성.','Start with TimeLink':'타임링크 시작하기','Create your account':'계정 만들기','All rights reserved.':'All rights reserved.'
};
var AUTO_EN_KO={};Object.keys(AUTO_KO_EN).forEach(function(k){AUTO_EN_KO[AUTO_KO_EN[k]]=k;});
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

var AUTO_TEXT=new WeakMap(),AUTO_ATTR=new WeakMap();
function applyAutoText(){
 var walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,{acceptNode:function(n){var p=n.parentElement;return !p||/^(SCRIPT|STYLE|NOSCRIPT|TEXTAREA|CODE|PRE)$/i.test(p.tagName)||p.closest('[data-i18n],[data-i18n-html]')||!n.nodeValue.trim()?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT;}});
 var nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
 nodes.forEach(function(n){var v=n.nodeValue,r=AUTO_TEXT.get(n);if(r&&v!==r.last)r=null;if(!r)r={source:v,last:v};var map=_lang==='en'?AUTO_KO_EN:AUTO_EN_KO,target=map[r.source.trim()];var next=r.source;if(target){var lead=r.source.match(/^\s*/)[0],tail=r.source.match(/\s*$/)[0];next=lead+target+tail;}if(n.nodeValue!==next)n.nodeValue=next;r.last=next;AUTO_TEXT.set(n,r);});
 document.querySelectorAll('input[placeholder],textarea[placeholder],[title],[aria-label]').forEach(function(el){['placeholder','title','aria-label'].forEach(function(a){if(!el.hasAttribute(a))return;var m=AUTO_ATTR.get(el)||{},r=m[a],v=el.getAttribute(a);if(r&&v!==r.last)r=null;if(!r)r={source:v,last:v};var next=(_lang==='en'?AUTO_KO_EN:AUTO_EN_KO)[r.source]||r.source;if(v!==next)el.setAttribute(a,next);r.last=next;m[a]=r;AUTO_ATTR.set(el,m);});});
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
  ['en','ko'].forEach(function(l){
    var btn=document.createElement('button');
    btn.className='tl-lang-btn'+(l===_lang?' tl-lang-active':'');
    btn.dataset.lang=l;
    btn.textContent=l==='en'?'EN':'KR';
    btn.title=LABELS[l];
    btn.setAttribute('aria-pressed',l===_lang?'true':'false');
    btn.style.cssText=[
      'background:'+(l===_lang?'rgba(139,108,240,.95)':'transparent'),
      'border:1px solid '+(l===_lang?'rgba(255,255,255,.24)':'transparent'),
      'cursor:pointer;font:700 11px/1 Inter,Pretendard,sans-serif',
      'min-width:36px;padding:8px 10px;border-radius:18px',
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
  injectSwitcher();
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
  setLang:setLang,
  applyAll:applyAll,
  createLangSwitcher:createLangSwitcher,
  getLang:function(){ return _lang; },
  lang:_lang
};

Object.defineProperty(window.TLi18n,'lang',{get:function(){return _lang;}});

})();






