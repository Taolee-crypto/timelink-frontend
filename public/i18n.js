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
