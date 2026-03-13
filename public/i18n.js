/* TimeLink i18n — KO·EN·JA·ZH·TH·VI */
(function(){
var LANGS=['ko','en','ja','zh','th','vi'];
var LABELS={ko:'한국어',en:'English',ja:'日本語',zh:'中文',th:'ภาษาไทย',vi:'Tiếng Việt'};

var T={
/* ── 공통 네비게이션 ── */
'nav.dashboard':       {ko:'대시보드',en:'Dashboard',ja:'ダッシュボード',zh:'仪表板',th:'แดชบอร์ด',vi:'Bảng điều khiển'},
'nav.shareplace':      {ko:'SHAREPLACE',en:'SHAREPLACE',ja:'SHAREPLACE',zh:'SHAREPLACE',th:'SHAREPLACE',vi:'SHAREPLACE'},
'nav.chart':           {ko:'TL CHART',en:'TL CHART',ja:'TLチャート',zh:'TL排行榜',th:'TL ชาร์ต',vi:'BXH TL'},
'nav.radio':           {ko:'방송국',en:'Radio',ja:'放送局',zh:'电台',th:'วิทยุ',vi:'Đài phát'},
'nav.creator':         {ko:'크리에이터 센터',en:'Creator Center',ja:'クリエイターセンター',zh:'创作者中心',th:'ศูนย์ครีเอเตอร์',vi:'Trung tâm tác giả'},
'nav.wallet':          {ko:'지갑 & 채굴',en:'Wallet & Mine',ja:'ウォレット＆採掘',zh:'钱包与挖矿',th:'กระเป๋า & ขุด',vi:'Ví & Khai thác'},
'nav.logout':          {ko:'로그아웃',en:'Logout',ja:'ログアウト',zh:'退出',th:'ออกจากระบบ',vi:'Đăng xuất'},

/* ── 로그인 ── */
'login.title':         {ko:'다시 오셨군요',en:'Welcome back',ja:'おかえりなさい',zh:'欢迎回来',th:'ยินดีต้อนรับกลับ',vi:'Chào mừng trở lại'},
'login.sub':           {ko:'계속 Pulse를 쌓아보세요',en:'Keep building your Pulse',ja:'Pulseを積み重ねよう',zh:'继续积累你的Pulse',th:'สร้าง Pulse ต่อไป',vi:'Tiếp tục tích lũy Pulse'},
'login.email':         {ko:'이메일',en:'Email',ja:'メール',zh:'邮箱',th:'อีเมล',vi:'Email'},
'login.password':      {ko:'비밀번호',en:'Password',ja:'パスワード',zh:'密码',th:'รหัสผ่าน',vi:'Mật khẩu'},
'login.forgot':        {ko:'비밀번호를 잊으셨나요?',en:'Forgot password?',ja:'パスワードをお忘れですか？',zh:'忘记密码？',th:'ลืมรหัสผ่าน?',vi:'Quên mật khẩu?'},
'login.btn':           {ko:'로그인',en:'Log in',ja:'ログイン',zh:'登录',th:'เข้าสู่ระบบ',vi:'Đăng nhập'},
'login.or':            {ko:'또는',en:'or',ja:'または',zh:'或',th:'หรือ',vi:'hoặc'},
'login.signup':        {ko:'계정이 없으신가요?',en:'No account?',ja:'アカウントをお持ちでないですか？',zh:'还没有账号？',th:'ยังไม่มีบัญชี?',vi:'Chưa có tài khoản?'},
'login.signup.link':   {ko:'무료 가입',en:'Sign up free',ja:'無料登録',zh:'免费注册',th:'สมัครฟรี',vi:'Đăng ký miễn phí'},

/* ── 회원가입 ── */
'signup.title':        {ko:'TimeLink 시작하기',en:'Get started',ja:'TimeLink を始める',zh:'开始使用',th:'เริ่มต้นใช้งาน',vi:'Bắt đầu'},
'signup.sub':          {ko:'이메일 인증 후 최대 42,500 TL을 받으세요',en:'Get up to 42,500 TL after email verification',ja:'メール認証で最大42,500 TLを取得',zh:'邮箱验证后最多获得42,500 TL',th:'รับสูงสุด 42,500 TL หลังยืนยันอีเมล',vi:'Nhận tới 42,500 TL sau khi xác minh email'},
'signup.step.email':   {ko:'이메일 인증',en:'Email verify',ja:'メール認証',zh:'邮箱验证',th:'ยืนยันอีเมล',vi:'Xác minh email'},
'signup.step.profile': {ko:'프로필',en:'Profile',ja:'プロフィール',zh:'资料',th:'โปรไฟล์',vi:'Hồ sơ'},
'signup.step.done':    {ko:'완료',en:'Done',ja:'完了',zh:'完成',th:'เสร็จสิ้น',vi:'Hoàn tất'},
'signup.send':         {ko:'인증 발송',en:'Send code',ja:'認証送信',zh:'发送验证码',th:'ส่งรหัส',vi:'Gửi mã'},
'signup.verify':       {ko:'확인',en:'Verify',ja:'確認',zh:'验证',th:'ยืนยัน',vi:'Xác nhận'},
'signup.next':         {ko:'다음',en:'Next',ja:'次へ',zh:'下一步',th:'ถัดไป',vi:'Tiếp theo'},
'signup.submit':       {ko:'TimeLink 시작하기',en:'Start TimeLink',ja:'TimeLink を開始',zh:'开始使用',th:'เริ่มต้น TimeLink',vi:'Bắt đầu TimeLink'},
'signup.login':        {ko:'이미 계정이 있으신가요?',en:'Already have an account?',ja:'すでにアカウントをお持ちですか？',zh:'已有账号？',th:'มีบัญชีอยู่แล้ว?',vi:'Đã có tài khoản?'},

/* ── SharePlace ── */
'sp.title':            {ko:'SharePlace',en:'SharePlace',ja:'SharePlace',zh:'SharePlace',th:'SharePlace',vi:'SharePlace'},
'sp.search':           {ko:'제목, 아티스트, 태그 검색...',en:'Search title, artist, tag...',ja:'タイトル、アーティスト検索...',zh:'搜索标题、艺术家...',th:'ค้นหาชื่อ ศิลปิน...',vi:'Tìm tiêu đề, nghệ sĩ...'},
'sp.filter.all':       {ko:'전체',en:'All',ja:'すべて',zh:'全部',th:'ทั้งหมด',vi:'Tất cả'},
'sp.filter.music':     {ko:'음악',en:'Music',ja:'音楽',zh:'音乐',th:'เพลง',vi:'Âm nhạc'},
'sp.filter.video':     {ko:'영상',en:'Video',ja:'動画',zh:'视频',th:'วิดีโอ',vi:'Video'},
'sp.filter.image':     {ko:'이미지',en:'Image',ja:'画像',zh:'图片',th:'รูปภาพ',vi:'Hình ảnh'},
'sp.filter.doc':       {ko:'문서',en:'Document',ja:'ドキュメント',zh:'文档',th:'เอกสาร',vi:'Tài liệu'},
'sp.upload':           {ko:'+ 업로드',en:'+ Upload',ja:'+ アップロード',zh:'+ 上传',th:'+ อัปโหลด',vi:'+ Tải lên'},
'sp.charge':           {ko:'충전',en:'Charge',ja:'チャージ',zh:'充值',th:'เติม',vi:'Nạp'},
'sp.play':             {ko:'재생',en:'Play',ja:'再生',zh:'播放',th:'เล่น',vi:'Phát'},
'sp.tl.balance':       {ko:'TL 잔액',en:'TL Balance',ja:'TL残高',zh:'TL余额',th:'ยอด TL',vi:'Số dư TL'},
'sp.notice.title':     {ko:'공지사항',en:'Notice',ja:'お知らせ',zh:'公告',th:'ประกาศ',vi:'Thông báo'},

/* ── 크리에이터 ── */
'cr.title':            {ko:'크리에이터 센터',en:'Creator Center',ja:'クリエイターセンター',zh:'创作者中心',th:'ศูนย์ครีเอเตอร์',vi:'Trung tâm tác giả'},
'cr.tab.upload':       {ko:'업로드',en:'Upload',ja:'アップロード',zh:'上传',th:'อัปโหลด',vi:'Tải lên'},
'cr.tab.myfiles':      {ko:'내 파일',en:'My Files',ja:'マイファイル',zh:'我的文件',th:'ไฟล์ของฉัน',vi:'File của tôi'},
'cr.drop.audio':       {ko:'오디오 파일을 여기에 드롭',en:'Drop audio file here',ja:'オーディオファイルをここにドロップ',zh:'将音频文件拖放到此处',th:'วางไฟล์เสียงที่นี่',vi:'Thả file âm thanh vào đây'},
'cr.drop.select':      {ko:'파일 선택',en:'Select file',ja:'ファイルを選択',zh:'选择文件',th:'เลือกไฟล์',vi:'Chọn file'},
'cr.title.label':      {ko:'제목',en:'Title',ja:'タイトル',zh:'标题',th:'ชื่อ',vi:'Tiêu đề'},
'cr.artist':           {ko:'아티스트',en:'Artist',ja:'アーティスト',zh:'艺术家',th:'ศิลปิน',vi:'Nghệ sĩ'},
'cr.genre':            {ko:'장르',en:'Genre',ja:'ジャンル',zh:'流派',th:'แนวเพลง',vi:'Thể loại'},
'cr.upload.btn':       {ko:'업로드',en:'Upload',ja:'アップロード',zh:'上传',th:'อัปโหลด',vi:'Tải lên'},
'cr.plan.a':           {ko:'플랜 A — 즉시수익 7:3',en:'Plan A — 70% instant',ja:'プランA — 即時70%',zh:'方案A — 即时70%',th:'แผน A — 70% ทันที',vi:'Gói A — 70% ngay'},
'cr.plan.b':           {ko:'플랜 B — TLC채굴 5:5',en:'Plan B — TLC mining 50%',ja:'プランB — TLC採掘50%',zh:'方案B — TLC挖矿50%',th:'แผน B — TLC mining 50%',vi:'Gói B — khai thác TLC 50%'},
'cr.free.period':      {ko:'🎉 무료 업로드 기간',en:'🎉 Free upload period',ja:'🎉 無料アップロード期間',zh:'🎉 免费上传期间',th:'🎉 ช่วงอัปโหลดฟรี',vi:'🎉 Giai đoạn tải miễn phí'},

/* ── 차트 ── */
'chart.title':         {ko:'TL CHART',en:'TL CHART',ja:'TLチャート',zh:'TL排行榜',th:'TL ชาร์ต',vi:'BXH TL'},
'chart.tab.music':     {ko:'음악',en:'Music',ja:'音楽',zh:'音乐',th:'เพลง',vi:'Âm nhạc'},
'chart.tab.video':     {ko:'영상',en:'Video',ja:'動画',zh:'视频',th:'วิดีโอ',vi:'Video'},
'chart.tab.doc':       {ko:'문서·강의',en:'Docs',ja:'文書',zh:'文档',th:'เอกสาร',vi:'Tài liệu'},
'chart.tab.image':     {ko:'이미지·아트',en:'Art',ja:'アート',zh:'图片',th:'ภาพ',vi:'Nghệ thuật'},
'chart.tab.top':       {ko:'⚡ TL 충전 TOP',en:'⚡ TL Top',ja:'⚡ TLトップ',zh:'⚡ TL排行',th:'⚡ TL สูงสุด',vi:'⚡ TL Top'},
'chart.rank':          {ko:'위',en:'#',ja:'位',zh:'名',th:'อันดับ',vi:'#'},
'chart.pulse':         {ko:'Pulse',en:'Pulse',ja:'パルス',zh:'Pulse',th:'Pulse',vi:'Pulse'},

/* ── 라디오 ── */
'radio.cafe':          {ko:'카페방송',en:'Cafe Radio',ja:'カフェ放送',zh:'咖啡广播',th:'วิทยุคาเฟ่',vi:'Radio quán cà phê'},
'radio.incar':         {ko:'인카방송',en:'In-Car Radio',ja:'車内放送',zh:'车载广播',th:'วิทยุในรถ',vi:'Radio trong xe'},
'radio.playing':       {ko:'재생 중',en:'Now playing',ja:'再生中',zh:'正在播放',th:'กำลังเล่น',vi:'Đang phát'},
'radio.queue':         {ko:'재생 목록',en:'Queue',ja:'キュー',zh:'播放列表',th:'คิวเพลง',vi:'Danh sách'},
'radio.channel':       {ko:'채널',en:'Channel',ja:'チャンネル',zh:'频道',th:'ช่อง',vi:'Kênh'},
'radio.tl.deduct':     {ko:'TL 차감률',en:'TL deduct rate',ja:'TL控除率',zh:'TL扣除率',th:'อัตราหัก TL',vi:'Tỷ lệ trừ TL'},
'radio.poc':           {ko:'POC 점수',en:'POC score',ja:'POCスコア',zh:'POC积分',th:'คะแนน POC',vi:'Điểm POC'},
'radio.listen':        {ko:'청취 중',en:'listening',ja:'リスニング中',zh:'正在收听',th:'กำลังฟัง',vi:'đang nghe'},

/* ── 채널 개설 ── */
'ch.cafe.title':       {ko:'카페 채널 개설',en:'Open Cafe Channel',ja:'カフェチャンネル開設',zh:'开设咖啡频道',th:'เปิดช่องคาเฟ่',vi:'Mở kênh quán cà phê'},
'ch.incar.title':      {ko:'인카 채널 개설',en:'Open In-Car Channel',ja:'車載チャンネル開設',zh:'开设车载频道',th:'เปิดช่องในรถ',vi:'Mở kênh trong xe'},
'ch.name':             {ko:'채널명',en:'Channel name',ja:'チャンネル名',zh:'频道名称',th:'ชื่อช่อง',vi:'Tên kênh'},
'ch.desc':             {ko:'채널 소개',en:'Description',ja:'チャンネル紹介',zh:'频道简介',th:'คำอธิบายช่อง',vi:'Mô tả kênh'},
'ch.open.btn':         {ko:'채널 개설',en:'Open channel',ja:'チャンネル開設',zh:'开设频道',th:'เปิดช่อง',vi:'Mở kênh'},

/* ── 대시보드 ── */
'dash.tl':             {ko:'TL 잔액',en:'TL Balance',ja:'TL残高',zh:'TL余额',th:'ยอด TL',vi:'Số dư TL'},
'dash.tlc':            {ko:'TLC 잔액',en:'TLC Balance',ja:'TLC残高',zh:'TLC余额',th:'ยอด TLC',vi:'Số dư TLC'},
'dash.poc':            {ko:'기여지수',en:'POC Index',ja:'貢献指数',zh:'贡献指数',th:'ดัชนี POC',vi:'Chỉ số POC'},
'dash.spent':          {ko:'총 소비 TL',en:'Total spent',ja:'総消費TL',zh:'总消费TL',th:'TL ที่ใช้ทั้งหมด',vi:'TL đã dùng'},
'dash.earned':         {ko:'총 수익 TL',en:'Total earned',ja:'総収益TL',zh:'总收益TL',th:'TL ที่ได้รับ',vi:'TL đã kiếm'},
'dash.mine':           {ko:'TLC 채굴',en:'Mine TLC',ja:'TLC採掘',zh:'挖矿TLC',th:'ขุด TLC',vi:'Khai thác TLC'},
'dash.exchange':       {ko:'현금 교환',en:'Cash exchange',ja:'現金交換',zh:'现金兑换',th:'แลกเงิน',vi:'Đổi tiền'},

/* ── SharePlace 오버레이/동적 텍스트 ── */
'sp.close.video':      {ko:'✕ 닫기 (재생 중단)',en:'✕ Close (stop)',ja:'✕ 閉じる（停止）',zh:'✕ 关闭（停止）',th:'✕ ปิด (หยุด)',vi:'✕ Đóng (dừng)'},
'sp.close':            {ko:'✕ 닫기',en:'✕ Close',ja:'✕ 閉じる',zh:'✕ 关闭',th:'✕ ปิด',vi:'✕ Đóng'},
'sp.tl.consuming':     {ko:'⚡ TL 소모 중 · ESC로 닫기',en:'⚡ TL consuming · ESC to close',ja:'⚡ TL消費中 · ESCで閉じる',zh:'⚡ TL消耗中 · ESC关闭',th:'⚡ กำลังใช้ TL · ESC ปิด',vi:'⚡ Đang tiêu TL · ESC đóng'},
'sp.tl.consuming.doc': {ko:'⚡ TL 소모 중 — 열람 시간만큼 차감됩니다',en:'⚡ TL consuming — deducted per viewing time',ja:'⚡ TL消費中 — 閲覧時間分だけ差引',zh:'⚡ TL消耗中 — 按浏览时间扣除',th:'⚡ กำลังใช้ TL — หักตามเวลาดู',vi:'⚡ Đang tiêu TL — trừ theo thời gian xem'},
'sp.chart.all':        {ko:'전체 차트 →',en:'Full chart →',ja:'全チャート →',zh:'完整榜单 →',th:'ชาร์ตทั้งหมด →',vi:'Toàn bộ BXH →'},
'sp.tl.charge.tab':    {ko:'⚡ TL충전',en:'⚡ Charge TL',ja:'⚡ TLチャージ',zh:'⚡ 充值TL',th:'⚡ เติม TL',vi:'⚡ Nạp TL'},
'sp.tl.remain':        {ko:'⚡ TL 잔량',en:'⚡ TL left',ja:'⚡ TL残量',zh:'⚡ TL余量',th:'⚡ TL คงเหลือ',vi:'⚡ TL còn lại'},
'sp.tl.low':           {ko:'⚠️ TL 부족!',en:'⚠️ Low TL!',ja:'⚠️ TL不足！',zh:'⚠️ TL不足！',th:'⚠️ TL ไม่พอ!',vi:'⚠️ Hết TL!'},
'sp.tl.charge.link':   {ko:'TL 충전하기',en:'Charge TL',ja:'TLチャージ',zh:'充值TL',th:'เติม TL',vi:'Nạp TL'},
'sp.btn.preview':      {ko:'▶ 미리듣기',en:'▶ Preview',ja:'▶ プレビュー',zh:'▶ 试听',th:'▶ ฟังก่อน',vi:'▶ Nghe thử'},
'sp.btn.no.preview':   {ko:'미리듣기 없음',en:'No preview',ja:'プレビューなし',zh:'无试听',th:'ไม่มีตัวอย่าง',vi:'Không có thử'},
'sp.btn.charge':       {ko:'⚡ TL 충전',en:'⚡ Charge TL',ja:'⚡ TLチャージ',zh:'⚡ 充值TL',th:'⚡ เติม TL',vi:'⚡ Nạp TL'},
'sp.btn.no.file':      {ko:'파일 없음',en:'No file',ja:'ファイルなし',zh:'无文件',th:'ไม่มีไฟล์',vi:'Không có file'},
'sp.btn.play':         {ko:'재생',en:'Play',ja:'再生',zh:'播放',th:'เล่น',vi:'Phát'},
'sp.preview.free':     {ko:'TL 소모 없음 · 30초 프리뷰',en:'No TL · 30s preview',ja:'TL消費なし · 30秒プレビュー',zh:'不消耗TL · 30秒试听',th:'ไม่ใช้ TL · ตัวอย่าง 30 วิ',vi:'Không TL · xem trước 30s'},
'sp.uncharged':        {ko:'미충전',en:'Uncharged',ja:'未チャージ',zh:'未充值',th:'ยังไม่เติม',vi:'Chưa nạp'},
'sp.back.dashboard':   {ko:'← 대시보드',en:'← Dashboard',ja:'← ダッシュボード',zh:'← 仪表板',th:'← แดชบอร์ด',vi:'← Bảng điều khiển'},
'sp.doc.label':        {ko:'📄 문서',en:'📄 Document',ja:'📄 文書',zh:'📄 文档',th:'📄 เอกสาร',vi:'📄 Tài liệu'},
'sp.notice.confirm':   {ko:'확인',en:'Confirm',ja:'確認',zh:'确认',th:'ยืนยัน',vi:'Xác nhận'},
'sp.notice.head':      {ko:'공지사항',en:'Notice',ja:'お知らせ',zh:'公告',th:'ประกาศ',vi:'Thông báo'},
/* ── JS alert/prompt 메시지 ── */
'msg.login.required':  {ko:'로그인이 필요합니다',en:'Login required',ja:'ログインが必要です',zh:'需要登录',th:'กรุณาเข้าสู่ระบบ',vi:'Cần đăng nhập'},
'msg.invalid.num':     {ko:'올바른 숫자를 입력하세요',en:'Enter a valid number',ja:'正しい数字を入力してください',zh:'请输入有效数字',th:'กรุณากรอกตัวเลขที่ถูกต้อง',vi:'Nhập số hợp lệ'},
'msg.tl.low':          {ko:'TL 부족!\n현재: ',en:'Not enough TL!\nCurrent: ',ja:'TL不足！\n現在: ',zh:'TL不足！\n当前: ',th:'TL ไม่พอ!\nปัจจุบัน: ',vi:'Không đủ TL!\nHiện tại: '},
'msg.charge.prompt':   {ko:'에 충전할 TL 입력\n현재 내 TL: ',en:'Enter TL to charge\nMy TL: ',ja:'にチャージするTLを入力\n現在の残高: ',zh:'输入要充值的TL\n我的TL: ',th:'กรอก TL ที่ต้องการเติม\nTL ของฉัน: ',vi:'Nhập TL muốn nạp\nTL của tôi: '},
'msg.charge.ok':       {ko:'TL 충전!\n내 잔량: ',en:'TL charged!\nRemaining: ',ja:'TLチャージ完了！\n残量: ',zh:'TL充值成功！\n余量: ',th:'เติม TL สำเร็จ!\nคงเหลือ: ',vi:'Nạp TL thành công!\nCòn lại: '},
'msg.charge.fail':     {ko:'충전 실패',en:'Charge failed',ja:'チャージ失敗',zh:'充值失败',th:'เติมล้มเหลว',vi:'Nạp thất bại'},
'msg.no.file':         {ko:'재생 파일이 없습니다.\n크리에이터가 파일을 업로드하지 않았습니다.',en:'No playback file.\nCreator has not uploaded a file.',ja:'再生ファイルがありません。\nクリエイターがファイルをアップロードしていません。',zh:'没有播放文件。\n创作者尚未上传文件。',th:'ไม่มีไฟล์สำหรับเล่น\nครีเอเตอร์ยังไม่ได้อัปโหลด',vi:'Không có file phát.\nTác giả chưa tải file lên.'},
'msg.play.fail':       {ko:'재생 실패: ',en:'Playback failed: ',ja:'再生失敗: ',zh:'播放失败: ',th:'เล่นล้มเหลว: ',vi:'Phát thất bại: '},
'msg.video.fail':      {ko:'비디오 재생 실패: ',en:'Video playback failed: ',ja:'動画再生失敗: ',zh:'视频播放失败: ',th:'เล่นวิดีโอล้มเหลว: ',vi:'Phát video thất bại: '},
'msg.file.load.fail':  {ko:'파일 로드 실패 — 파일이 서버에 없거나 손상되었습니다.',en:'File load failed — file missing or corrupted.',ja:'ファイル読み込み失敗 — ファイルが存在しないか破損しています。',zh:'文件加载失败 — 文件不存在或已损坏。',th:'โหลดไฟล์ล้มเหลว — ไฟล์หายหรือเสียหาย',vi:'Tải file thất bại — file không tồn tại hoặc bị hỏng.'},
'msg.autoplay.block':  {ko:'▶ 버튼을 눌러 재생하세요 (브라우저 자동재생 차단)',en:'Press ▶ to play (autoplay blocked)',ja:'▶ を押して再生 (自動再生ブロック)',zh:'按 ▶ 播放（自动播放被阻止）',th:'กด ▶ เพื่อเล่น (บล็อกเล่นอัตโนมัติ)',vi:'Nhấn ▶ để phát (trình duyệt chặn tự động phát)'},
'msg.preview.fail':    {ko:'미리듣기 실패: ',en:'Preview failed: ',ja:'プレビュー失敗: ',zh:'试听失败: ',th:'ฟังก่อนล้มเหลว: ',vi:'Nghe thử thất bại: '},
/* ── 사이드바 내비 ── */
'nav.back.dashboard':  {ko:'← 대시보드',en:'← Dashboard',ja:'← ダッシュボード',zh:'← 仪表板',th:'← แดชบอร์ด',vi:'← Bảng điều khiển'},


/* ── login 추가 ── */
'login.email.label':   {ko:'이메일',en:'Email',ja:'メール',zh:'邮箱',th:'อีเมล',vi:'Email'},
'login.pw.label':      {ko:'비밀번호',en:'Password',ja:'パスワード',zh:'密码',th:'รหัสผ่าน',vi:'Mật khẩu'},
'login.or':            {ko:'또는',en:'or',ja:'または',zh:'或',th:'หรือ',vi:'hoặc'},
'login.no.account':    {ko:'계정이 없으신가요?',en:'No account?',ja:'アカウントなし？',zh:'没有账号？',th:'ไม่มีบัญชี?',vi:'Chưa có tài khoản?'},
'login.free.signup':   {ko:'무료 가입',en:'Sign up free',ja:'無料登録',zh:'免费注册',th:'สมัครฟรี',vi:'Đăng ký miễn phí'},
'login.ton.btn':       {ko:'TON Wallet 로그인 (Phase 2)',en:'TON Wallet Login (Phase 2)',ja:'TONウォレットログイン (Phase 2)',zh:'TON钱包登录 (Phase 2)',th:'เข้าสู่ระบบด้วย TON (Phase 2)',vi:'Đăng nhập TON (Phase 2)'},
/* ── signup 추가 ── */
'signup.title2':       {ko:'계정 만들기',en:'Create account',ja:'アカウント作成',zh:'创建账号',th:'สร้างบัญชี',vi:'Tạo tài khoản'},
'signup.email.label':  {ko:'이메일 주소',en:'Email address',ja:'メールアドレス',zh:'邮箱地址',th:'ที่อยู่อีเมล',vi:'Địa chỉ email'},
'signup.send.code':    {ko:'인증 발송',en:'Send code',ja:'認証送信',zh:'发送验证码',th:'ส่งรหัส',vi:'Gửi mã'},
'signup.verify.btn':   {ko:'확인',en:'Verify',ja:'確認',zh:'验证',th:'ยืนยัน',vi:'Xác nhận'},
'signup.nick.label':   {ko:'닉네임',en:'Username',ja:'ニックネーム',zh:'昵称',th:'ชื่อผู้ใช้',vi:'Tên người dùng'},
'signup.pw.label':     {ko:'비밀번호',en:'Password',ja:'パスワード',zh:'密码',th:'รหัสผ่าน',vi:'Mật khẩu'},
'signup.pw2.label':    {ko:'비밀번호 확인',en:'Confirm password',ja:'パスワード確認',zh:'确认密码',th:'ยืนยันรหัสผ่าน',vi:'Xác nhận mật khẩu'},
'signup.or.email':     {ko:'또는 이메일로 가입',en:'or sign up with email',ja:'またはメールで登録',zh:'或用邮箱注册',th:'หรือสมัครด้วยอีเมล',vi:'hoặc đăng ký bằng email'},
'signup.login.link':   {ko:'이미 계정이 있어요',en:'Already have an account',ja:'アカウントをお持ちの方',zh:'已有账号',th:'มีบัญชีอยู่แล้ว',vi:'Đã có tài khoản'},
/* ── dashboard 추가 ── */
'dash.greeting':       {ko:'안녕하세요',en:'Hello',ja:'こんにちは',zh:'你好',th:'สวัสดี',vi:'Xin chào'},
'dash.content':        {ko:'내 콘텐츠',en:'My content',ja:'マイコンテンツ',zh:'我的内容',th:'เนื้อหาของฉัน',vi:'Nội dung của tôi'},
'dash.token.sub':      {ko:'소비용 토큰',en:'Consumption token',ja:'消費トークン',zh:'消费代币',th:'โทเค็นสำหรับใช้',vi:'Token tiêu dùng'},
'dash.tlc.sub':        {ko:'거래용 토큰',en:'Trading token',ja:'取引トークン',zh:'交易代币',th:'โทเค็นซื้อขาย',vi:'Token giao dịch'},
'dash.poc.sub':        {ko:'기여 점수',en:'Contribution score',ja:'貢献スコア',zh:'贡献分数',th:'คะแนนมีส่วนร่วม',vi:'Điểm đóng góp'},
'dash.upload.sub':     {ko:'업로드한 파일',en:'Uploaded files',ja:'アップロード済み',zh:'已上传文件',th:'ไฟล์ที่อัปโหลด',vi:'File đã tải lên'},
'dash.channel.open':   {ko:'채널 개설',en:'Open channel',ja:'チャンネル開設',zh:'开设频道',th:'เปิดช่อง',vi:'Mở kênh'},
'dash.mining':         {ko:'채굴',en:'Mine',ja:'採掘',zh:'挖矿',th:'ขุด',vi:'Khai thác'},
'dash.shortcuts':      {ko:'바로가기',en:'Shortcuts',ja:'ショートカット',zh:'快捷方式',th:'ทางลัด',vi:'Lối tắt'},
'dash.radio.link':     {ko:'방송국',en:'Radio',ja:'放送局',zh:'电台',th:'วิทยุ',vi:'Đài phát'},
'dash.cafe.link':      {ko:'카페 채널 개설',en:'Open cafe channel',ja:'カフェチャンネル開設',zh:'开设咖啡频道',th:'เปิดช่องคาเฟ่',vi:'Mở kênh quán cà phê'},
/* ── chart 추가 ── */
'chart.sub':           {ko:'가장 많이 소비된 콘텐츠 실시간 순위',en:'Real-time ranking of most consumed content',ja:'最も消費されたコンテンツのリアルタイムランキング',zh:'消费最多内容的实时排名',th:'อันดับเรียลไทม์ของเนื้อหาที่บริโภคมากที่สุด',vi:'Bảng xếp hạng nội dung được tiêu thụ nhiều nhất'},
'chart.genre.all':     {ko:'전체',en:'All',ja:'すべて',zh:'全部',th:'ทั้งหมด',vi:'Tất cả'},
'chart.loading':       {ko:'차트 로딩 중...',en:'Loading chart...',ja:'チャート読み込み中...',zh:'加载排行榜...',th:'กำลังโหลดชาร์ต...',vi:'Đang tải BXH...'},
'chart.logout':        {ko:'로그아웃',en:'Logout',ja:'ログアウト',zh:'退出',th:'ออกจากระบบ',vi:'Đăng xuất'},
'chart.tl.desc':       {ko:'리스너들이 가장 많이 TL을 충전한 파일 — 진짜 가치를 인정받은 콘텐츠',en:'Files most charged with TL — content with true value',ja:'最もTLをチャージされたファイル',zh:'TL充值最多的文件 — 被认可的真实价值内容',th:'ไฟล์ที่เติม TL มากที่สุด',vi:'File được nạp TL nhiều nhất'},
/* ── radio / cafe-radio 추가 ── */
'radio.mode':          {ko:'방송 모드',en:'Broadcast mode',ja:'放送モード',zh:'播放模式',th:'โหมดออกอากาศ',vi:'Chế độ phát'},
'radio.live.ch':       {ko:'라이브 채널',en:'Live channels',ja:'ライブチャンネル',zh:'直播频道',th:'ช่องสด',vi:'Kênh trực tiếp'},
'radio.today.poc':     {ko:'오늘 기여',en:"Today's POC",ja:'今日の貢献',zh:'今日贡献',th:'POC วันนี้',vi:'POC hôm nay'},
'radio.ready':         {ko:'방송 준비 중...',en:'Preparing broadcast...',ja:'放送準備中...',zh:'准备播放...',th:'กำลังเตรียมออกอากาศ...',vi:'Đang chuẩn bị phát...'},
'radio.cafe.ch':       {ko:'☕ 카페 채널',en:'☕ Cafe Channel',ja:'☕ カフェチャンネル',zh:'☕ 咖啡频道',th:'☕ ช่องคาเฟ่',vi:'☕ Kênh quán cà phê'},
'radio.prev':          {ko:'이전',en:'Prev',ja:'前へ',zh:'上一曲',th:'ก่อนหน้า',vi:'Trước'},
'radio.next':          {ko:'다음',en:'Next',ja:'次へ',zh:'下一曲',th:'ถัดไป',vi:'Tiếp theo'},
'radio.request':       {ko:'신청하기',en:'Request',ja:'リクエスト',zh:'申请',th:'ขอเพลง',vi:'Yêu cầu'},
'radio.ai.analyzing':  {ko:'선곡 분석 중...',en:'Analyzing...',ja:'選曲分析中...',zh:'分析选曲中...',th:'กำลังวิเคราะห์...',vi:'Đang phân tích...'},
'radio.poc.label':     {ko:'현재 POC 배율',en:'Current POC rate',ja:'現在POC倍率',zh:'当前POC倍率',th:'อัตรา POC ปัจจุบัน',vi:'Tỷ lệ POC hiện tại'},
'radio.cafe.mode':     {ko:'카페방송 기본',en:'Cafe basic',ja:'カフェ基本',zh:'咖啡基础',th:'คาเฟ่พื้นฐาน',vi:'Cơ bản quán cà phê'},
'radio.incar.mode':    {ko:'인카방송',en:'In-Car',ja:'車内放送',zh:'车载广播',th:'วิทยุในรถ',vi:'Radio trong xe'},
'radio.ai.desc.default': {ko:'현재 시간대와 날씨를 분석하여 최적의 음악을 선곡하고 있습니다.',en:'Analyzing current time and weather to select optimal music.',ja:'現在の時間帯と天気を分析して最適な音楽を選曲中です。',zh:'正在分析当前时间和天气以选择最佳音乐。',th:'กำลังวิเคราะห์เวลาและสภาพอากาศเพื่อเลือกเพลงที่ดีที่สุด',vi:'Đang phân tích thời gian và thời tiết để chọn nhạc tối ưu.'},
/* ── incar 추가 ── */
'incar.stopped':       {ko:'정차 중',en:'Stopped',ja:'停車中',zh:'停车',th:'หยุด',vi:'Đã dừng'},
'incar.queue':         {ko:'재생 목록',en:'Queue',ja:'キュー',zh:'播放列表',th:'คิวเพลง',vi:'Danh sách'},
'incar.poc.drive':     {ko:'주행 중 POC 2.5배',en:'POC ×2.5 while driving',ja:'走行中POC2.5倍',zh:'行驶中POC2.5倍',th:'POC 2.5× ขณะขับ',vi:'POC ×2.5 khi lái'},
'incar.skip.plate':    {ko:'번호판 없이 시작 (POC 1.0x)',en:'Start without plate (POC 1.0x)',ja:'ナンバープレートなしで開始',zh:'无车牌开始 (POC 1.0x)',th:'เริ่มโดยไม่มีทะเบียน (POC 1.0x)',vi:'Bắt đầu không có biển số (POC 1.0x)'},
'incar.back.radio':    {ko:'← 방송국',en:'← Radio',ja:'← 放送局',zh:'← 电台',th:'← วิทยุ',vi:'← Đài phát'},
/* ── cafe/incar channel 추가 ── */
'ch.back.radio':       {ko:'← 방송국으로',en:'← Back to Radio',ja:'← 放送局へ',zh:'← 返回电台',th:'← กลับไปวิทยุ',vi:'← Về đài phát'},
'ch.cafe.hero.title':  {ko:'나만의 카페 전용<br>AI 라디오 채널',en:'Your own cafe<br>AI radio channel',ja:'カフェ専用<br>AIラジオチャンネル',zh:'专属咖啡<br>AI电台频道',th:'ช่อง AI วิทยุ<br>เฉพาะคาเฟ่ของคุณ',vi:'Kênh radio AI<br>riêng cho quán của bạn'},
'ch.incar.hero.title': {ko:'나만의 주행 전용<br>AI 라디오 채널',en:'Your own drive<br>AI radio channel',ja:'ドライブ専用<br>AIラジオチャンネル',zh:'专属驾车<br>AI电台频道',th:'ช่อง AI วิทยุ<br>เฉพาะการขับรถของคุณ',vi:'Kênh radio AI<br>riêng cho lái xe'},
'ch.monthly.fee':      {ko:'월정액 채널 이용료',en:'Monthly channel fee',ja:'月額チャンネル料金',zh:'月费频道费用',th:'ค่าช่องรายเดือน',vi:'Phí kênh hàng tháng'},
'ch.monthly.sub':      {ko:'매월 자동 갱신 • 언제든 해지 가능',en:'Auto-renews monthly • Cancel anytime',ja:'毎月自動更新 • いつでも解約可',zh:'每月自动续费 • 随时可取消',th:'ต่ออายุอัตโนมัติรายเดือน • ยกเลิกได้ตลอด',vi:'Tự động gia hạn hàng tháng • Hủy bất cứ lúc nào'},
'ch.cafe.name.label':  {ko:'카페명',en:'Cafe name',ja:'カフェ名',zh:'咖啡馆名称',th:'ชื่อคาเฟ่',vi:'Tên quán cà phê'},
'ch.channel.id':       {ko:'채널 ID',en:'Channel ID',ja:'チャンネルID',zh:'频道ID',th:'รหัสช่อง',vi:'ID kênh'},
'ch.biz.no':           {ko:'사업자번호',en:'Business number',ja:'事業者番号',zh:'营业执照号',th:'เลขธุรกิจ',vi:'Mã số doanh nghiệp'},
'ch.owner.name':       {ko:'대표자명',en:'Owner name',ja:'代表者名',zh:'负责人姓名',th:'ชื่อเจ้าของ',vi:'Tên chủ'},
'ch.intro':            {ko:'소개글',en:'Description',ja:'紹介文',zh:'简介',th:'คำแนะนำ',vi:'Mô tả'},
'ch.addr':             {ko:'도로명 주소',en:'Street address',ja:'住所',zh:'街道地址',th:'ที่อยู่',vi:'Địa chỉ'},
'ch.addr.detail':      {ko:'상세 주소',en:'Detail address',ja:'詳細住所',zh:'详细地址',th:'ที่อยู่โดยละเอียด',vi:'Địa chỉ chi tiết'},
'ch.select.all':       {ko:'전체 선택',en:'Select all',ja:'全選択',zh:'全选',th:'เลือกทั้งหมด',vi:'Chọn tất cả'},
'ch.reset':            {ko:'초기화',en:'Reset',ja:'リセット',zh:'重置',th:'รีเซ็ต',vi:'Đặt lại'},
'ch.benefits':         {ko:'채널 개설 혜택',en:'Channel benefits',ja:'チャンネル特典',zh:'频道开设优惠',th:'สิทธิประโยชน์',vi:'Quyền lợi kênh'},
'ch.open.btn2':        {ko:'☕ 카페 채널 개설 (50,000 TL 결제)',en:'☕ Open cafe channel (50,000 TL)',ja:'☕ カフェチャンネル開設 (50,000 TL)',zh:'☕ 开设咖啡频道 (50,000 TL)',th:'☕ เปิดช่องคาเฟ่ (50,000 TL)',vi:'☕ Mở kênh quán cà phê (50,000 TL)'},
'ch.incar.open.btn':   {ko:'🚗 인카 채널 개설 (30,000 TL 결제)',en:'🚗 Open in-car channel (30,000 TL)',ja:'🚗 車載チャンネル開設 (30,000 TL)',zh:'🚗 开设车载频道 (30,000 TL)',th:'🚗 เปิดช่องในรถ (30,000 TL)',vi:'🚗 Mở kênh trong xe (30,000 TL)'},
'ch.incar.ch.name':    {ko:'채널명',en:'Channel name',ja:'チャンネル名',zh:'频道名称',th:'ชื่อช่อง',vi:'Tên kênh'},
'ch.incar.ch.intro':   {ko:'채널 소개글',en:'Channel description',ja:'チャンネル紹介文',zh:'频道简介',th:'คำอธิบายช่อง',vi:'Mô tả kênh'},
'ch.plate':            {ko:'차량 번호판',en:'License plate',ja:'ナンバープレート',zh:'车牌号',th:'ทะเบียนรถ',vi:'Biển số xe'},
'ch.car.type':         {ko:'차종',en:'Car type',ja:'車種',zh:'车型',th:'ประเภทรถ',vi:'Loại xe'},
'ch.drive.region':     {ko:'주요 주행 지역',en:'Main driving area',ja:'主な走行地域',zh:'主要行驶区域',th:'พื้นที่ขับรถหลัก',vi:'Khu vực lái xe chính'},
'ch.poc.benefits':     {ko:'기여지수 & TL 혜택',en:'POC & TL benefits',ja:'貢献指数 & TL特典',zh:'贡献指数 & TL优惠',th:'POC & สิทธิประโยชน์ TL',vi:'POC & Quyền lợi TL'},
/* ── creator 추가 ── */
'cr.uploading':        {ko:'R2에 파일 업로드 중...',en:'Uploading file to R2...',ja:'R2にアップロード中...',zh:'正在上传到R2...',th:'กำลังอัปโหลดไปยัง R2...',vi:'Đang tải lên R2...'},
'cr.menu':             {ko:'메뉴',en:'Menu',ja:'メニュー',zh:'菜单',th:'เมนู',vi:'Menu'},
'cr.back.dash':        {ko:'← 대시보드',en:'← Dashboard',ja:'← ダッシュボード',zh:'← 仪表板',th:'← แดชบอร์ด',vi:'← Bảng điều khiển'},
'cr.center.title':     {ko:'창작자 센터',en:'Creator Center',ja:'クリエイターセンター',zh:'创作者中心',th:'ศูนย์ครีเอเตอร์',vi:'Trung tâm tác giả'},
'cr.logout':           {ko:'↩ 로그아웃',en:'↩ Logout',ja:'↩ ログアウト',zh:'↩ 退出',th:'↩ ออกจากระบบ',vi:'↩ Đăng xuất'},
'cr.file.type':        {ko:'① 파일 형식 선택',en:'① Select file type',ja:'① ファイル形式選択',zh:'① 选择文件类型',th:'① เลือกประเภทไฟล์',vi:'① Chọn loại file'},
'cr.type.audio':       {ko:'오디오',en:'Audio',ja:'オーディオ',zh:'音频',th:'เสียง',vi:'Âm thanh'},
'cr.type.video':       {ko:'영상',en:'Video',ja:'動画',zh:'视频',th:'วิดีโอ',vi:'Video'},
'cr.type.image':       {ko:'이미지',en:'Image',ja:'画像',zh:'图片',th:'รูปภาพ',vi:'Hình ảnh'},
'cr.type.doc':         {ko:'문서',en:'Document',ja:'文書',zh:'文档',th:'เอกสาร',vi:'Tài liệu'},
'cr.remove.file':      {ko:'✕ 제거',en:'✕ Remove',ja:'✕ 削除',zh:'✕ 删除',th:'✕ ลบ',vi:'✕ Xóa'},
'cr.spotify.meta':     {ko:'🎵 Spotify 메타데이터',en:'🎵 Spotify metadata',ja:'🎵 Spotifyメタデータ',zh:'🎵 Spotify元数据',th:'🎵 ข้อมูล Spotify',vi:'🎵 Metadata Spotify'},
'cr.optional':         {ko:'선택',en:'optional',ja:'任意',zh:'可选',th:'ไม่บังคับ',vi:'tùy chọn'},
'cr.file.info':        {ko:'② 파일 정보 입력',en:'② Enter file info',ja:'② ファイル情報入力',zh:'② 输入文件信息',th:'② กรอกข้อมูลไฟล์',vi:'② Nhập thông tin file'},
'cr.title.req':        {ko:'제목 *',en:'Title *',ja:'タイトル *',zh:'标题 *',th:'ชื่อ *',vi:'Tiêu đề *'},
'cr.artist.label':     {ko:'아티스트',en:'Artist',ja:'アーティスト',zh:'艺术家',th:'ศิลปิน',vi:'Nghệ sĩ'},
'cr.album.label':      {ko:'앨범',en:'Album',ja:'アルバム',zh:'专辑',th:'อัลบั้ม',vi:'Album'},
'cr.category':         {ko:'카테고리',en:'Category',ja:'カテゴリ',zh:'分类',th:'หมวดหมู่',vi:'Danh mục'},
'cr.desc.label':       {ko:'설명',en:'Description',ja:'説明',zh:'描述',th:'คำอธิบาย',vi:'Mô tả'},
'cr.tl.info':          {ko:'③ TL 정보',en:'③ TL Info',ja:'③ TL情報',zh:'③ TL信息',th:'③ ข้อมูล TL',vi:'③ Thông tin TL'},
'cr.weight.label':     {ko:'⚖️ 차감 가중치 — 리스너가 1초 재생 시 차감되는 TL',en:'⚖️ Deduct weight — TL deducted per second',ja:'⚖️ 控除ウェイト — 1秒再生で控除されるTL',zh:'⚖️ 扣除权重 — 每秒播放扣除的TL',th:'⚖️ น้ำหนักการหัก — TL ที่หักต่อวินาที',vi:'⚖️ Trọng số trừ — TL trừ mỗi giây phát'},
'cr.plan.section':     {ko:'④ 수익 배분 플랜',en:'④ Revenue plan',ja:'④ 収益配分プラン',zh:'④ 收益分配方案',th:'④ แผนการแบ่งรายได้',vi:'④ Kế hoạch chia doanh thu'},
'cr.plan.a.split':     {ko:'크리에이터 70% · 플랫폼 30%',en:'Creator 70% · Platform 30%',ja:'クリエイター70% · プラットフォーム30%',zh:'创作者70% · 平台30%',th:'ครีเอเตอร์ 70% · แพลตฟอร์ม 30%',vi:'Tác giả 70% · Nền tảng 30%'},
'cr.plan.b.split':     {ko:'크리에이터 50% + TLC 채굴',en:'Creator 50% + TLC mining',ja:'クリエイター50% + TLC採掘',zh:'创作者50% + TLC挖矿',th:'ครีเอเตอร์ 50% + ขุด TLC',vi:'Tác giả 50% + Khai thác TLC'},
'cr.my.files.sub':     {ko:'업로드한 파일 목록',en:'Uploaded file list',ja:'アップロード済みファイル一覧',zh:'已上传文件列表',th:'รายการไฟล์ที่อัปโหลด',vi:'Danh sách file đã tải lên'},
'cr.share.view':       {ko:'공유보기',en:'View share',ja:'共有表示',zh:'查看分享',th:'ดูการแชร์',vi:'Xem chia sẻ'},
'cr.delete':           {ko:'삭제',en:'Delete',ja:'削除',zh:'删除',th:'ลบ',vi:'Xóa'},
'cr.no.files':         {ko:'업로드한 파일이 없습니다',en:'No uploaded files',ja:'アップロードされたファイルがありません',zh:'没有已上传的文件',th:'ไม่มีไฟล์ที่อัปโหลด',vi:'Không có file đã tải lên'},
'cr.notice.confirm':   {ko:'확인',en:'Confirm',ja:'確認',zh:'确认',th:'ยืนยัน',vi:'Xác nhận'},

/* ── login JS toast ── */
'toast.login.required':    {ko:'이메일과 비밀번호를 입력해주세요',en:'Please enter email and password',ja:'メールとパスワードを入力してください',zh:'请输入邮箱和密码',th:'กรุณากรอกอีเมลและรหัสผ่าน',vi:'Vui lòng nhập email và mật khẩu'},
'toast.login.welcome':     {ko:'환영합니다!',en:'Welcome!',ja:'ようこそ！',zh:'欢迎！',th:'ยินดีต้อนรับ!',vi:'Chào mừng!'},
'toast.server.error':      {ko:'서버 연결 실패. 잠시 후 다시 시도해주세요.',en:'Server error. Please try again later.',ja:'サーバーエラー。しばらく後にお試しください。',zh:'服务器连接失败，请稍后重试。',th:'เชื่อมต่อเซิร์ฟเวอร์ล้มเหลว โปรดลองอีกครั้ง',vi:'Lỗi kết nối. Vui lòng thử lại sau.'},
/* ── signup JS toast ── */
'toast.email.invalid':     {ko:'올바른 이메일을 입력해주세요',en:'Please enter a valid email',ja:'正しいメールアドレスを入力してください',zh:'请输入有效邮箱',th:'กรุณากรอกอีเมลที่ถูกต้อง',vi:'Vui lòng nhập email hợp lệ'},
'toast.email.duplicate':   {ko:'❌ 이미 가입된 이메일입니다. 로그인을 이용해 주세요.',en:'❌ Email already registered. Please log in.',ja:'❌ 既に登録済みのメールです。ログインしてください。',zh:'❌ 该邮箱已注册，请直接登录。',th:'❌ อีเมลนี้ลงทะเบียนแล้ว กรุณาเข้าสู่ระบบ',vi:'❌ Email đã được đăng ký. Vui lòng đăng nhập.'},
'toast.code.sent':         {ko:'📨 인증 코드가 발송되었습니다!',en:'📨 Verification code sent!',ja:'📨 認証コードを送信しました！',zh:'📨 验证码已发送！',th:'📨 ส่งรหัสยืนยันแล้ว!',vi:'📨 Mã xác nhận đã được gửi!'},
'toast.code.expired':      {ko:'❌ 코드가 만료되었습니다. 재발송해주세요',en:'❌ Code expired. Please resend.',ja:'❌ コードが期限切れです。再送してください。',zh:'❌ 验证码已过期，请重新发送。',th:'❌ รหัสหมดอายุ กรุณาส่งใหม่',vi:'❌ Mã đã hết hạn. Vui lòng gửi lại.'},
'toast.email.mismatch':    {ko:'❌ 이메일이 일치하지 않습니다',en:'❌ Email does not match',ja:'❌ メールが一致しません',zh:'❌ 邮箱不匹配',th:'❌ อีเมลไม่ตรงกัน',vi:'❌ Email không khớp'},
'toast.code.verified':     {ko:'✅ 이메일 인증 완료! +5,000 TL',en:'✅ Email verified! +5,000 TL',ja:'✅ メール認証完了！+5,000 TL',zh:'✅ 邮箱验证成功！+5,000 TL',th:'✅ ยืนยันอีเมลสำเร็จ! +5,000 TL',vi:'✅ Xác nhận email thành công! +5,000 TL'},
'toast.code.wrong':        {ko:'❌ 인증 코드가 올바르지 않습니다',en:'❌ Incorrect verification code',ja:'❌ 認証コードが正しくありません',zh:'❌ 验证码不正确',th:'❌ รหัสยืนยันไม่ถูกต้อง',vi:'❌ Mã xác nhận không đúng'},
'toast.code.enter6':       {ko:'6자리 코드를 모두 입력해주세요',en:'Please enter all 6 digits',ja:'6桁のコードをすべて入力してください',zh:'请输入完整的6位验证码',th:'กรุณากรอกรหัส 6 หลักให้ครบ',vi:'Vui lòng nhập đủ 6 chữ số'},
'toast.nick.required':     {ko:'닉네임을 입력해주세요',en:'Please enter a username',ja:'ニックネームを入力してください',zh:'请输入昵称',th:'กรุณากรอกชื่อผู้ใช้',vi:'Vui lòng nhập tên người dùng'},
'toast.pw.short':          {ko:'비밀번호는 8자 이상이어야 합니다',en:'Password must be at least 8 characters',ja:'パスワードは8文字以上必要です',zh:'密码至少需要8个字符',th:'รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร',vi:'Mật khẩu phải có ít nhất 8 ký tự'},
'toast.terms.required':    {ko:'필수 약관에 동의해주세요',en:'Please agree to required terms',ja:'必須利用規約に同意してください',zh:'请同意必要条款',th:'กรุณายอมรับข้อกำหนดที่จำเป็น',vi:'Vui lòng đồng ý với điều khoản bắt buộc'},
'toast.social.preparing':  {ko:'🔧 소셜 로그인 준비 중입니다',en:'🔧 Social login coming soon',ja:'🔧 ソーシャルログイン準備中',zh:'🔧 社交登录功能准备中',th:'🔧 การเข้าสู่ระบบโซเชียลกำลังเตรียม',vi:'🔧 Đăng nhập mạng xã hội đang chuẩn bị'},
/* ── dashboard JS toast ── */
'toast.mine.success':      {ko:'⛏️ {0} TLC 채굴 완료!',en:'⛏️ {0} TLC mined!',ja:'⛏️ {0} TLC 採掘完了！',zh:'⛏️ {0} TLC 挖矿完成！',th:'⛏️ ขุด {0} TLC สำเร็จ!',vi:'⛏️ Đã khai thác {0} TLC!'},
'toast.mine.fail':         {ko:'채굴 실패',en:'Mining failed',ja:'採掘失敗',zh:'挖矿失败',th:'การขุดล้มเหลว',vi:'Khai thác thất bại'},
/* ── incar JS toast ── */
'toast.plate.required':    {ko:'번호판을 입력해주세요',en:'Please enter license plate',ja:'ナンバープレートを入力してください',zh:'请输入车牌号',th:'กรุณากรอกทะเบียนรถ',vi:'Vui lòng nhập biển số xe'},
'toast.incar.start':       {ko:'🚗 인카방송 시작! POC 2.5x 적용',en:'🚗 In-car broadcast started! POC 2.5x',ja:'🚗 車内放送開始！POC 2.5x 適用',zh:'🚗 车载广播开始！POC 2.5x 已启用',th:'🚗 เริ่มออกอากาศในรถ! POC 2.5x',vi:'🚗 Bắt đầu phát trong xe! POC 2.5x'},
'toast.tl.empty.track':    {ko:'⚡ 곡별 TL 소진 → 총 TL 차감',en:'⚡ Track TL depleted → deducting from total',ja:'⚡ 曲別TL消費 → 総TLから控除',zh:'⚡ 单曲TL耗尽 → 从总TL扣除',th:'⚡ TL เพลงหมด → หักจาก TL รวม',vi:'⚡ TL bài nhạc hết → trừ từ TL tổng'},
'toast.tl.empty.total':    {ko:'⚠️ TL 소진!',en:'⚠️ TL depleted!',ja:'⚠️ TL消費！',zh:'⚠️ TL耗尽！',th:'⚠️ TL หมดแล้ว!',vi:'⚠️ TL đã hết!'},
'toast.shuffle.on':        {ko:'셔플 ON',en:'Shuffle ON',ja:'シャッフル ON',zh:'随机播放 ON',th:'สุ่ม ON',vi:'Trộn ON'},
'toast.shuffle.off':       {ko:'셔플 OFF',en:'Shuffle OFF',ja:'シャッフル OFF',zh:'随机播放 OFF',th:'สุ่ม OFF',vi:'Trộn OFF'},
'toast.night.on':          {ko:'🌙 야간 모드 ON',en:'🌙 Night mode ON',ja:'🌙 ナイトモード ON',zh:'🌙 夜间模式 ON',th:'🌙 โหมดกลางคืน ON',vi:'🌙 Chế độ đêm ON'},
'toast.night.off':         {ko:'야간 모드 OFF',en:'Night mode OFF',ja:'ナイトモード OFF',zh:'夜间模式 OFF',th:'โหมดกลางคืน OFF',vi:'Chế độ đêm OFF'},
'toast.voice.unsupported': {ko:'음성 인식 미지원 브라우저',en:'Voice recognition not supported',ja:'音声認識未対応ブラウザ',zh:'不支持语音识别的浏览器',th:'เบราว์เซอร์ไม่รองรับการรู้จำเสียง',vi:'Trình duyệt không hỗ trợ nhận dạng giọng nói'},
'toast.voice.on':          {ko:'🎤 음성 제어 ON — "다음곡", "이전곡", "볼륨 업"',en:'🎤 Voice ON — "next", "prev", "volume up"',ja:'🎤 音声制御 ON — 「次の曲」「前の曲」「音量アップ」',zh:'🎤 语音控制 ON — "下一首" "上一首" "音量上"',th:'🎤 เปิดเสียง — "เพลงถัดไป" "เพลงก่อนหน้า" "เสียงดังขึ้น"',vi:'🎤 Giọng nói ON — "bài tiếp" "bài trước" "to hơn"'},
'toast.queue.set':         {ko:'📋 내 목록 = 현재 재생 큐',en:'📋 My list = current queue',ja:'📋 マイリスト = 現在のキュー',zh:'📋 我的列表 = 当前队列',th:'📋 รายการของฉัน = คิวปัจจุบัน',vi:'📋 Danh sách của tôi = hàng đợi hiện tại'},
/* ── cafe-radio JS toast ── */
'toast.mode.cafe':         {ko:'☕ 카페방송 모드',en:'☕ Cafe broadcast mode',ja:'☕ カフェ放送モード',zh:'☕ 咖啡放送模式',th:'☕ โหมดออกอากาศคาเฟ่',vi:'☕ Chế độ phát quán cà phê'},
'toast.mode.incar':        {ko:'🚗 인카방송 모드',en:'🚗 In-car mode',ja:'🚗 車内放送モード',zh:'🚗 车载广播模式',th:'🚗 โหมดออกอากาศในรถ',vi:'🚗 Chế độ trong xe'},
'toast.crossfade.on':      {ko:'🔀 크로스페이드 ON',en:'🔀 Crossfade ON',ja:'🔀 クロスフェード ON',zh:'🔀 淡入淡出 ON',th:'🔀 Crossfade ON',vi:'🔀 Crossfade ON'},
'toast.crossfade.off':     {ko:'🔀 크로스페이드 OFF',en:'🔀 Crossfade OFF',ja:'🔀 クロスフェード OFF',zh:'🔀 淡入淡出 OFF',th:'🔀 Crossfade OFF',vi:'🔀 Crossfade OFF'},
/* ── cafe/incar channel JS toast ── */
'toast.ch.cafe.success':   {ko:'☕ 카페 채널이 개설되었습니다!',en:'☕ Cafe channel opened!',ja:'☕ カフェチャンネルが開設されました！',zh:'☕ 咖啡频道已开设！',th:'☕ เปิดช่องคาเฟ่แล้ว!',vi:'☕ Kênh quán cà phê đã được mở!'},
'toast.ch.incar.success':  {ko:'🚗 인카 채널이 개설되었습니다!',en:'🚗 In-car channel opened!',ja:'🚗 車載チャンネルが開設されました！',zh:'🚗 车载频道已开设！',th:'🚗 เปิดช่องในรถแล้ว!',vi:'🚗 Kênh trong xe đã được mở!'},
'toast.ch.tl.short':       {ko:'TL이 부족합니다',en:'Insufficient TL',ja:'TLが不足しています',zh:'TL不足',th:'TL ไม่เพียงพอ',vi:'Không đủ TL'},
'toast.ch.id.invalid':     {ko:'채널 ID는 영문+숫자만 가능합니다',en:'Channel ID: letters and numbers only',ja:'チャンネルIDは英数字のみ使用可能です',zh:'频道ID只能使用字母和数字',th:'รหัสช่องใช้ได้เฉพาะตัวอักษรภาษาอังกฤษและตัวเลข',vi:'ID kênh chỉ dùng chữ và số'},
/* ── creator JS toast ── */
'toast.cr.upload.success': {ko:'✅ 업로드 완료!',en:'✅ Upload complete!',ja:'✅ アップロード完了！',zh:'✅ 上传完成！',th:'✅ อัปโหลดสำเร็จ!',vi:'✅ Tải lên hoàn tất!'},
'toast.cr.upload.fail':    {ko:'업로드 실패',en:'Upload failed',ja:'アップロード失敗',zh:'上传失败',th:'อัปโหลดล้มเหลว',vi:'Tải lên thất bại'},
'toast.cr.delete.confirm': {ko:'정말 삭제하시겠습니까?',en:'Are you sure you want to delete?',ja:'本当に削除しますか？',zh:'确定要删除吗？',th:'คุณแน่ใจว่าต้องการลบหรือไม่?',vi:'Bạn có chắc muốn xóa không?'},
'toast.cr.delete.success': {ko:'✅ 삭제되었습니다',en:'✅ Deleted',ja:'✅ 削除しました',zh:'✅ 已删除',th:'✅ ลบแล้ว',vi:'✅ Đã xóa'},
/* ── common ── */
'toast.login.required.action': {ko:'로그인이 필요합니다',en:'Login required',ja:'ログインが必要です',zh:'需要登录',th:'ต้องเข้าสู่ระบบ',vi:'Cần đăng nhập'},
'toast.loading':           {ko:'로딩 중...',en:'Loading...',ja:'読み込み中...',zh:'加载中...',th:'กำลังโหลด...',vi:'Đang tải...'},
'toast.no.login.info':     {ko:'로그인 정보가 없습니다',en:'No login information',ja:'ログイン情報がありません',zh:'无登录信息',th:'ไม่มีข้อมูลการเข้าสู่ระบบ',vi:'Không có thông tin đăng nhập'},

'toast.song.required':     {ko:'곡명을 입력해주세요',en:'Please enter a song name',ja:'曲名を入力してください',zh:'请输入歌曲名称',th:'กรุณากรอกชื่อเพลง',vi:'Vui lòng nhập tên bài hát'},
'toast.song.requested':    {ko:'신청곡이 접수되었습니다! 🎤',en:'Song request received! 🎤',ja:'リクエスト受付完了！🎤',zh:'申请曲目已收到！🎤',th:'รับคำขอเพลงแล้ว! 🎤',vi:'Yêu cầu bài hát đã nhận! 🎤'},
'toast.playlist.applied':  {ko:'내 플레이리스트 적용됨',en:'My playlist applied',ja:'マイプレイリスト適用済み',zh:'已应用我的播放列表',th:'ใช้เพลย์ลิสต์ของฉันแล้ว',vi:'Đã áp dụng danh sách phát'},

'toast.addr.required':     {ko:'주소를 입력해주세요',en:'Please enter an address',ja:'住所を入力してください',zh:'请输入地址',th:'กรุณากรอกที่อยู่',vi:'Vui lòng nhập địa chỉ'},
'toast.map.linked':        {ko:'지도 연동 완료',en:'Map linked',ja:'地図連携完了',zh:'地图连接完成',th:'เชื่อมต่อแผนที่แล้ว',vi:'Đã liên kết bản đồ'},
'toast.ai.selected':       {ko:'🤖 AI가 인기 곡 {0}곡을 선별했습니다',en:'🤖 AI selected {0} popular tracks',ja:'🤖 AIが人気曲{0}曲を選別しました',zh:'🤖 AI已选择{0}首热门曲目',th:'🤖 AI เลือก {0} เพลงยอดนิยม',vi:'🤖 AI đã chọn {0} bài hát nổi tiếng'},
'toast.required.fields':   {ko:'필수 항목을 모두 입력해주세요',en:'Please fill in all required fields',ja:'必須項目をすべて入力してください',zh:'请填写所有必填项',th:'กรุณากรอกข้อมูลที่จำเป็นทั้งหมด',vi:'Vui lòng điền đầy đủ các trường bắt buộc'},
'toast.ch.id.format':      {ko:'채널 ID는 영문 소문자, 숫자, _ (3~20자)',en:'Channel ID: lowercase letters, numbers, _ (3~20 chars)',ja:'チャンネルID: 小文字英数字、_（3〜20文字）',zh:'频道ID：小写字母、数字、_（3~20字符）',th:'รหัสช่อง: ตัวอักษรพิมพ์เล็ก ตัวเลข _ (3~20 ตัว)',vi:'ID kênh: chữ thường, số, _ (3~20 ký tự)'},
'toast.ch.tl.short.cafe':  {ko:'TL 잔액이 부족합니다 (필요: 50,000 TL)',en:'Insufficient TL (required: 50,000 TL)',ja:'TL残高不足（必要: 50,000 TL）',zh:'TL余额不足（需要: 50,000 TL）',th:'TL ไม่พอ (ต้องการ: 50,000 TL)',vi:'Không đủ TL (cần: 50,000 TL)'},
'toast.ch.tl.short.incar': {ko:'TL 잔액이 부족합니다 (필요: 20,000 TL)',en:'Insufficient TL (required: 20,000 TL)',ja:'TL残高不足（必要: 20,000 TL）',zh:'TL余额不足（需要: 20,000 TL）',th:'TL ไม่พอ (ต้องการ: 20,000 TL)',vi:'Không đủ TL (cần: 20,000 TL)'},
'toast.ch.name.id.required':{ko:'채널명과 채널 ID는 필수입니다',en:'Channel name and ID are required',ja:'チャンネル名とIDは必須です',zh:'频道名称和ID为必填项',th:'ชื่อช่องและรหัสช่องเป็นสิ่งจำเป็น',vi:'Tên kênh và ID là bắt buộc'},
'toast.general.error':     {ko:'오류',en:'Error',ja:'エラー',zh:'错误',th:'ข้อผิดพลาด',vi:'Lỗi'},
/* ── 공통 ── */
'common.loading':      {ko:'로딩 중...',en:'Loading...',ja:'読み込み中...',zh:'加载中...',th:'กำลังโหลด...',vi:'Đang tải...'},
'common.error':        {ko:'오류가 발생했습니다',en:'An error occurred',ja:'エラーが発生しました',zh:'发生错误',th:'เกิดข้อผิดพลาด',vi:'Đã xảy ra lỗi'},
'common.save':         {ko:'저장',en:'Save',ja:'保存',zh:'保存',th:'บันทึก',vi:'Lưu'},
'common.cancel':       {ko:'취소',en:'Cancel',ja:'キャンセル',zh:'取消',th:'ยกเลิก',vi:'Hủy'},
'common.confirm':      {ko:'확인',en:'Confirm',ja:'確認',zh:'确认',th:'ยืนยัน',vi:'Xác nhận'},
'common.delete':       {ko:'삭제',en:'Delete',ja:'削除',zh:'删除',th:'ลบ',vi:'Xóa'},
'common.close':        {ko:'닫기',en:'Close',ja:'閉じる',zh:'关闭',th:'ปิด',vi:'Đóng'},
'common.search':       {ko:'검색',en:'Search',ja:'検索',zh:'搜索',th:'ค้นหา',vi:'Tìm kiếm'},
'common.upload':       {ko:'업로드',en:'Upload',ja:'アップロード',zh:'上传',th:'อัปโหลด',vi:'Tải lên'},
'common.download':     {ko:'다운로드',en:'Download',ja:'ダウンロード',zh:'下载',th:'ดาวน์โหลด',vi:'Tải xuống'},
'common.play':         {ko:'재생',en:'Play',ja:'再生',zh:'播放',th:'เล่น',vi:'Phát'},
'common.pause':        {ko:'일시정지',en:'Pause',ja:'一時停止',zh:'暂停',th:'หยุดชั่วคราว',vi:'Tạm dừng'},
'common.tl':           {ko:'TL',en:'TL',ja:'TL',zh:'TL',th:'TL',vi:'TL'},
'common.sec':          {ko:'초',en:'sec',ja:'秒',zh:'秒',th:'วิ',vi:'giây'},
'common.min':          {ko:'분',en:'min',ja:'分',zh:'分',th:'นาที',vi:'phút'},
'common.free':         {ko:'무료',en:'Free',ja:'無料',zh:'免费',th:'ฟรี',vi:'Miễn phí'},
'common.paid':         {ko:'유료',en:'Paid',ja:'有料',zh:'付费',th:'ชำระเงิน',vi:'Trả phí'},
};

/* ── 현재 언어 감지 ── */
function detectLang(){
  var saved = localStorage.getItem('tl_lang');
  if(saved && LANGS.includes(saved)) return saved;
  var br = (navigator.language||navigator.userLanguage||'ko').toLowerCase();
  if(br.startsWith('ja')) return 'ja';
  if(br.startsWith('zh')) return 'zh';
  if(br.startsWith('th')) return 'th';
  if(br.startsWith('vi')) return 'vi';
  if(br.startsWith('ko')) return 'ko';
  return 'en';
}

var _lang = detectLang();

/* ── 번역 함수 ── */
function t(key, fallback){
  var row = T[key];
  if(!row) return fallback || key;
  return row[_lang] || row['ko'] || fallback || key;
}

/* ── DOM 자동 번역 ── */
function applyAll(){
  document.querySelectorAll('[data-i18n]').forEach(function(el){
    var key = el.getAttribute('data-i18n');
    var val = t(key);
    if(el.tagName === 'INPUT' || el.tagName === 'TEXTAREA'){
      el.placeholder = val;
    } else {
      el.textContent = val;
    }
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(function(el){
    el.placeholder = t(el.getAttribute('data-i18n-placeholder'));
  });
  document.documentElement.lang = _lang;
}

/* ── 언어 전환 ── */
function setLang(lang){
  if(!LANGS.includes(lang)) return;
  _lang = lang;
  localStorage.setItem('tl_lang', lang);
  applyAll();
  // 언어 선택 UI 갱신
  document.querySelectorAll('.lang-btn').forEach(function(b){
    b.classList.toggle('active', b.dataset.lang === lang);
  });
}

/* ── 언어 선택 버튼 UI 생성 ── */
function createLangSwitcher(containerId){
  var wrap = document.getElementById(containerId);
  if(!wrap) return;
  wrap.innerHTML = LANGS.map(function(l){
    return '<button class="lang-btn'+(l===_lang?' active':'')+'" data-lang="'+l+'" onclick="TLi18n.setLang(\''+l+'\')">'+LABELS[l]+'</button>';
  }).join('');
}

/* ── 상단바 자동 삽입 ── */
function injectSwitcher(){
  // 기존 lang-switcher 있으면 스킵
  if(document.getElementById('tl-lang-switcher')) return;
  var sw = document.createElement('div');
  sw.id = 'tl-lang-switcher';
  sw.style.cssText = [
    'position:fixed;top:12px;right:16px;z-index:99999',
    'display:flex;gap:4px;align-items:center',
    'background:rgba(13,13,26,.85);backdrop-filter:blur(12px)',
    'border:1px solid rgba(255,255,255,.1);border-radius:20px',
    'padding:4px 8px'
  ].join(';');
  sw.innerHTML = LANGS.map(function(l){
    var flag = {ko:'🇰🇷',en:'🇺🇸',ja:'🇯🇵',zh:'🇨🇳',th:'🇹🇭',vi:'🇻🇳'}[l];
    return '<button class="lang-btn'+(l===_lang?' active':'')+'" data-lang="'+l+'"'
      +' onclick="TLi18n.setLang(\''+l+'\')"'
      +' style="background:none;border:none;cursor:pointer;font-size:16px;padding:2px 3px;border-radius:6px;opacity:'+(l===_lang?'1':'0.45')+';transition:opacity .2s"'
      +' title="'+LABELS[l]+'">'+flag+'</button>';
  }).join('');
  document.body.appendChild(sw);
}

/* ── lang-btn active 스타일 ── */
function injectStyle(){
  if(document.getElementById('tl-i18n-style')) return;
  var s = document.createElement('style');
  s.id = 'tl-i18n-style';
  s.textContent = '.lang-btn.active{opacity:1!important;} .lang-btn:hover{opacity:1!important;}';
  document.head.appendChild(s);
}

/* ── 초기화 ── */
function init(){
  injectStyle();
  applyAll();
  injectSwitcher();
}

/* DOMContentLoaded 또는 즉시 */
if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

/* ── 전역 노출 ── */
window.TLi18n = { t:t, setLang:setLang, applyAll:applyAll, createLangSwitcher:createLangSwitcher, getLang:function(){ return _lang; } };

})();
