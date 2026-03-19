/* TimeLink i18n v2 — KO·EN·JA·ZH·TH·VI */
(function(){
var LANGS=['ko','en','ja','zh','th','vi'];
var FLAGS={ko:'🇰🇷',en:'🇺🇸',ja:'🇯🇵',zh:'🇨🇳',th:'🇹🇭',vi:'🇻🇳'};
var LABELS={ko:'한국어',en:'English',ja:'日本語',zh:'中文',th:'ภาษาไทย',vi:'Tiếng Việt'};

var T={
/* ── 네비게이션 ── */

/* ── SharePlace 추가 키 ── */
'sp.tl.charge.tab':    {ko:'⚡ TL충전',en:'⚡ Charge TL',ja:'⚡ TLチャージ',zh:'⚡ 充值TL',th:'⚡ เติม TL',vi:'⚡ Nạp TL'},
'sp.tl.charge.link':   {ko:'TL 충전하기',en:'Charge TL',ja:'TLチャージ',zh:'充值TL',th:'เติม TL',vi:'Nạp TL'},
'sp.tl.low':           {ko:'TL 부족!',en:'Low TL!',ja:'TL不足！',zh:'TL不足！',th:'TL ไม่พอ!',vi:'TL thấp!'},
'sp.notice.title':     {ko:'공지사항',en:'Notice',ja:'お知らせ',zh:'公告',th:'ประกาศ',vi:'Thông báo'},
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

/* ── DOM 자동 번역 ── */
function applyAll(){
  // data-i18n 텍스트
  document.querySelectorAll('[data-i18n]').forEach(function(el){
    var key=el.getAttribute('data-i18n');
    var val=t(key);
    if(el.tagName==='INPUT'||el.tagName==='TEXTAREA'){
      el.placeholder=val;
    } else {
      el.textContent=val;
    }
  });
  // data-i18n-placeholder
  document.querySelectorAll('[data-i18n-placeholder]').forEach(function(el){
    el.placeholder=t(el.getAttribute('data-i18n-placeholder'));
  });
  // data-i18n-title
  document.querySelectorAll('[data-i18n-title]').forEach(function(el){
    el.title=t(el.getAttribute('data-i18n-title'));
  });
  // data-i18n-html (HTML 내용 포함)
  document.querySelectorAll('[data-i18n-html]').forEach(function(el){
    el.innerHTML=t(el.getAttribute('data-i18n-html'));
  });
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
  sw.style.cssText=[
    'position:fixed;top:12px;right:16px;z-index:99999',
    'display:flex;gap:2px;align-items:center',
    'background:rgba(10,10,20,.92);backdrop-filter:blur(16px)',
    'border:1px solid rgba(255,255,255,.15);border-radius:22px',
    'padding:5px 10px;box-shadow:0 4px 20px rgba(0,0,0,.5)'
  ].join(';');
  LANGS.forEach(function(l){
    var btn=document.createElement('button');
    btn.className='tl-lang-btn'+(l===_lang?' tl-lang-active':'');
    btn.dataset.lang=l;
    btn.textContent=FLAGS[l];
    btn.title=LABELS[l];
    btn.style.cssText=[
      'background:'+(l===_lang?'rgba(255,255,255,.15)':'none'),
      'border:'+(l===_lang?'1px solid rgba(255,255,255,.3)':'1px solid transparent'),
      'cursor:pointer;font-size:17px;padding:3px 5px;border-radius:8px',
      'opacity:'+(l===_lang?'1':'0.5'),
      'transition:all .2s;line-height:1;color:#fff'
    ].join(';');
    (function(lang){ btn.onclick=function(){ TLi18n.setLang(lang); }; })(l);
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
    '.tl-lang-btn:hover{opacity:1!important;background:rgba(255,255,255,.1)!important;}'
  ].join('');
  document.head.appendChild(s);
}

/* ── 초기화 ── */
function init(){
  injectStyle();
  applyAll();
  injectSwitcher();
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
