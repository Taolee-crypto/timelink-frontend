// ============================================================
// i18n.js — TimeLink 다국어 엔진 v2.0
// 지원 언어: ko / en / ja / zh / es / pt
// ============================================================
const I18N = {
  lang: null,

  LANGS: {
    ko: { label: '한국어', flag: '🇰🇷' },
    en: { label: 'English', flag: '🇺🇸' },
    ja: { label: '日本語', flag: '🇯🇵' },
    zh: { label: '中文', flag: '🇨🇳' },
    es: { label: 'Español', flag: '🇪🇸' },
    pt: { label: 'Português', flag: '🇧🇷' },
  },

  STRINGS: {
    // ── 네비게이션 ──
    nav_login:       { ko:'로그인',       en:'Log In',        ja:'ログイン',           zh:'登录',       es:'Iniciar sesión',   pt:'Entrar' },
    nav_start:       { ko:'시작하기',     en:'Get Started',   ja:'始める',             zh:'开始',       es:'Empezar',          pt:'Começar' },
    nav_signup:      { ko:'무료 시작',    en:'Start Free',    ja:'無料で始める',        zh:'免费开始',   es:'Empezar gratis',   pt:'Começar grátis' },
    nav_logout:      { ko:'로그아웃',     en:'Log Out',       ja:'ログアウト',          zh:'退出',       es:'Cerrar sesión',    pt:'Sair' },
    nav_charge:      { ko:'TL 충전',      en:'Charge TL',     ja:'TL チャージ',         zh:'充值 TL',    es:'Recargar TL',      pt:'Recarregar TL' },
    nav_wallet:      { ko:'지갑',         en:'Wallet',        ja:'ウォレット',          zh:'钱包',       es:'Billetera',        pt:'Carteira' },
    nav_library:     { ko:'라이브러리',   en:'Library',       ja:'ライブラリ',          zh:'音乐库',     es:'Biblioteca',       pt:'Biblioteca' },
    nav_upload:      { ko:'업로드',       en:'Upload',        ja:'アップロード',        zh:'上传',       es:'Subir',            pt:'Enviar' },
    nav_dashboard:   { ko:'대시보드',     en:'Dashboard',     ja:'ダッシュボード',      zh:'仪表板',     es:'Panel',            pt:'Painel' },

    // ── 공통 버튼 ──
    btn_play:        { ko:'재생',         en:'Play',          ja:'再生',               zh:'播放',       es:'Reproducir',       pt:'Reproduzir' },
    btn_watch:       { ko:'시청하기',     en:'Watch',         ja:'視聴する',            zh:'观看',       es:'Ver',              pt:'Assistir' },
    btn_download:    { ko:'다운로드',     en:'Download',      ja:'ダウンロード',        zh:'下载',       es:'Descargar',        pt:'Baixar' },
    btn_share:       { ko:'공유',         en:'Share',         ja:'シェア',             zh:'分享',       es:'Compartir',        pt:'Compartilhar' },
    btn_buy:         { ko:'구매',         en:'Buy',           ja:'購入',               zh:'购买',       es:'Comprar',          pt:'Comprar' },
    btn_cancel:      { ko:'취소',         en:'Cancel',        ja:'キャンセル',          zh:'取消',       es:'Cancelar',         pt:'Cancelar' },
    btn_confirm:     { ko:'확인',         en:'Confirm',       ja:'確認',               zh:'确认',       es:'Confirmar',        pt:'Confirmar' },
    btn_save:        { ko:'저장',         en:'Save',          ja:'保存',               zh:'保存',       es:'Guardar',          pt:'Salvar' },
    btn_close:       { ko:'닫기',         en:'Close',         ja:'閉じる',             zh:'关闭',       es:'Cerrar',           pt:'Fechar' },
    btn_submit:      { ko:'제출',         en:'Submit',        ja:'送信',               zh:'提交',       es:'Enviar',           pt:'Enviar' },
    btn_free_start:  { ko:'무료로 시작하기', en:'Start for Free', ja:'無料で始める',    zh:'免费开始',   es:'Comenzar gratis',  pt:'Começar grátis' },
    btn_free_join:   { ko:'무료로 가입하기', en:'Join for Free',  ja:'無料で登録',      zh:'免费注册',   es:'Registrarse gratis', pt:'Cadastrar-se grátis' },
    btn_next:        { ko:'다음 →',       en:'Next →',        ja:'次へ →',             zh:'下一步 →',   es:'Siguiente →',      pt:'Próximo →' },
    btn_search:      { ko:'검색 중...',   en:'Searching...',  ja:'検索中...',           zh:'搜索中...',  es:'Buscando...',      pt:'Buscando...' },
    btn_refresh:     { ko:'새로고침',     en:'Refresh',       ja:'更新',               zh:'刷新',       es:'Actualizar',       pt:'Atualizar' },
    btn_fullscreen:  { ko:'전체화면',     en:'Fullscreen',    ja:'全画面',             zh:'全屏',       es:'Pantalla completa', pt:'Tela cheia' },
    btn_send_code:   { ko:'인증코드 발송', en:'Send Code',    ja:'コード送信',          zh:'发送验证码', es:'Enviar código',    pt:'Enviar código' },

    // ── 탭 메뉴 ──
    tab_home:        { ko:'🏠 홈',              en:'🏠 Home',            ja:'🏠 ホーム',          zh:'🏠 首页',        es:'🏠 Inicio',          pt:'🏠 Início' },
    tab_shareplace:  { ko:'🛍️ SharePlace',      en:'🛍️ SharePlace',      ja:'🛍️ SharePlace',      zh:'🛍️ 分享广场',    es:'🛍️ SharePlace',      pt:'🛍️ SharePlace' },
    tab_library:     { ko:'🔍 라이브러리',       en:'🔍 Library',         ja:'🔍 ライブラリ',       zh:'🔍 音乐库',      es:'🔍 Biblioteca',      pt:'🔍 Biblioteca' },
    tab_upload:      { ko:'📤 업로드',           en:'📤 Upload',          ja:'📤 アップロード',      zh:'📤 上传',        es:'📤 Subir',           pt:'📤 Enviar' },
    tab_radio:       { ko:'☕ 카페방송',          en:'☕ Cafe Radio',       ja:'☕ カフェ放送',        zh:'☕ 咖啡广播',     es:'☕ Radio Café',       pt:'☕ Rádio Café' },
    tab_car:         { ko:'🎧 Moving Radio',     en:'🎧 Moving Radio',    ja:'🎧 ムービングラジオ',  zh:'🎧 移动电台',    es:'🎧 Radio Móvil',     pt:'🎧 Rádio Móvel' },
    tab_ads:         { ko:'📣 광고',             en:'📣 Ads',             ja:'📣 広告',             zh:'📣 广告',        es:'📣 Anuncios',        pt:'📣 Anúncios' },
    tab_wallet:      { ko:'👛 지갑',             en:'👛 Wallet',          ja:'👛 ウォレット',        zh:'👛 钱包',        es:'👛 Billetera',       pt:'👛 Carteira' },
    tab_chart:       { ko:'📊 차트',             en:'📊 Charts',          ja:'📊 チャート',          zh:'📊 排行榜',      es:'📊 Gráficos',        pt:'📊 Gráficos' },
    tab_dashboard:   { ko:'📊 대시보드',         en:'📊 Dashboard',       ja:'📊 ダッシュボード',    zh:'📊 面板',        es:'📊 Panel',           pt:'📊 Painel' },

    // ── 푸터 ──
    footer_slogan:   { ko:'창작자를 위한 새로운 수익 플랫폼', en:'A new revenue platform for creators', ja:'クリエイターのための新しい収益プラットフォーム', zh:'面向创作者的全新收益平台', es:'Una nueva plataforma de ingresos para creadores', pt:'Uma nova plataforma de receita para criadores' },
    footer_service:  { ko:'서비스',       en:'Services',      ja:'サービス',            zh:'服务',       es:'Servicios',        pt:'Serviços' },
    footer_company:  { ko:'회사',         en:'Company',       ja:'会社',               zh:'公司',       es:'Empresa',          pt:'Empresa' },
    footer_legal:    { ko:'법무',         en:'Legal',         ja:'法務',               zh:'法律',       es:'Legal',            pt:'Legal' },
    footer_terms:    { ko:'이용약관',     en:'Terms of Service', ja:'利用規約',         zh:'服务条款',   es:'Términos de servicio', pt:'Termos de serviço' },
    footer_privacy:  { ko:'개인정보처리방침', en:'Privacy Policy', ja:'プライバシーポリシー', zh:'隐私政策', es:'Política de privacidad', pt:'Política de privacidade' },
    footer_copyright: { ko:'저작권 정책', en:'Copyright Policy', ja:'著作権ポリシー',  zh:'版权政策',   es:'Política de derechos de autor', pt:'Política de direitos autorais' },
    footer_report:   { ko:'저작권 침해 신고', en:'Report Infringement', ja:'著作権侵害報告', zh:'举报侵权', es:'Reportar infracción', pt:'Reportar infração' },
    footer_copyright_text: { ko:'모든 파일의 창작권은 창작자에게 있습니다. © 2025 TimeLink. All rights reserved.', en:'All creative rights belong to creators. © 2025 TimeLink. All rights reserved.', ja:'すべてのファイルの著作権はクリエイターに帰属します。© 2025 TimeLink. All rights reserved.', zh:'所有文件的创作权归创作者所有。© 2025 TimeLink. All rights reserved.', es:'Todos los derechos creativos pertenecen a los creadores. © 2025 TimeLink. All rights reserved.', pt:'Todos os direitos criativos pertencem aos criadores. © 2025 TimeLink. All rights reserved.' },
    footer_about:    { ko:'🏢 회사 소개',  en:'🏢 About Us',   ja:'🏢 会社紹介',         zh:'🏢 关于我们', es:'🏢 Acerca de',      pt:'🏢 Sobre nós' },
    footer_tokenomics: { ko:'⚡ 토큰 경제', en:'⚡ Tokenomics', ja:'⚡ トークン経済',     zh:'⚡ 代币经济', es:'⚡ Tokenomía',       pt:'⚡ Tokenomia' },
    footer_roadmap:  { ko:'🗺️ 로드맵',    en:'🗺️ Roadmap',    ja:'🗺️ ロードマップ',     zh:'🗺️ 路线图',   es:'🗺️ Hoja de ruta',   pt:'🗺️ Roteiro' },
    footer_faq:      { ko:'❓ FAQ',        en:'❓ FAQ',         ja:'❓ よくある質問',      zh:'❓ 常见问题', es:'❓ Preguntas frecuentes', pt:'❓ Perguntas frequentes' },
    footer_ads_inquiry: { ko:'📣 광고 문의', en:'📣 Ad Inquiry', ja:'📣 広告問い合わせ',  zh:'📣 广告咨询', es:'📣 Consulta de anuncios', pt:'📣 Consulta de anúncios' },
    footer_shareplace: { ko:'🛍️ SharePlace', en:'🛍️ SharePlace', ja:'🛍️ SharePlace',    zh:'🛍️ 分享广场', es:'🛍️ SharePlace',    pt:'🛍️ SharePlace' },
    footer_creator:  { ko:'🎵 창작자 프로그램', en:'🎵 Creator Program', ja:'🎵 クリエイタープログラム', zh:'🎵 创作者计划', es:'🎵 Programa de creadores', pt:'🎵 Programa de criadores' },
    footer_poc:      { ko:'📊 기여도 시스템', en:'📊 Contribution System', ja:'📊 コントリビューションシステム', zh:'📊 贡献度系统', es:'📊 Sistema de contribución', pt:'📊 Sistema de contribuição' },
    footer_pricing:  { ko:'💳 요금제',     en:'💳 Pricing',    ja:'💳 料金プラン',        zh:'💳 定价',     es:'💳 Precios',         pt:'💳 Preços' },
    footer_radio:    { ko:'☕ 카페방송',   en:'☕ Cafe Radio',  ja:'☕ カフェ放送',         zh:'☕ 咖啡广播', es:'☕ Radio Café',       pt:'☕ Rádio Café' },

    // ── index.html ──
    hero_tag:        { ko:'창작자를 위한', en:'Built for Creators', ja:'クリエイターのために', zh:'为创作者打造', es:'Para los creadores', pt:'Para os criadores' },
    hero_title1:     { ko:'가장 혁신적인', en:'The Most',           ja:'最も革新的な',        zh:'最创新的',    es:'El más innovador',   pt:'O mais inovador' },
    hero_title2:     { ko:'수익 모델',     en:'Revenue Model',      ja:'収益モデル',          zh:'收益模式',    es:'Modelo de ingresos', pt:'Modelo de receita' },
    hero_sub:        { ko:'음악, 영상, 강의까지. TimeLink에서 당신의 창작물로 수익을 창출하세요.', en:'Music, video, lectures and more. Monetize your creations on TimeLink.', ja:'音楽、映像、講義まで。TimeLinkであなたの創作物で収益を生み出しましょう。', zh:'音乐、视频、课程等等。在TimeLink上通过您的创作赚取收益。', es:'Música, video, clases y más. Monetiza tus creaciones en TimeLink.', pt:'Música, vídeo, aulas e mais. Monetize suas criações no TimeLink.' },
    hero_stat1:      { ko:'활성 창작자',   en:'Active Creators',    ja:'アクティブクリエイター', zh:'活跃创作者', es:'Creadores activos',   pt:'Criadores ativos' },
    hero_stat2:      { ko:'Pulse 누적',    en:'Total Pulse',        ja:'累計Pulse',           zh:'累计Pulse',   es:'Pulse acumulado',    pt:'Pulse acumulado' },
    feat_shareplace: { ko:'창작물을 사고파는 마켓플레이스', en:'Marketplace to buy & sell creations', ja:'創作物を売買するマーケットプレイス', zh:'创作物买卖市场', es:'Mercado para comprar y vender creaciones', pt:'Mercado para comprar e vender criações' },
    feat_ai:         { ko:'AI 음원 인증',  en:'AI Audio Certification', ja:'AI音源認証',        zh:'AI音源认证',  es:'Certificación de audio con IA', pt:'Certificação de áudio com IA' },
    feat_ai_sub:     { ko:'Suno, Udio 음원을 인증하고 수익화', en:'Certify and monetize Suno & Udio tracks', ja:'Suno・Udio音源を認証して収益化', zh:'认证并变现Suno和Udio音源', es:'Certifica y monetiza pistas de Suno y Udio', pt:'Certifique e monetize faixas do Suno e Udio' },
    feat_player:     { ko:'TL 플레이어',   en:'TL Player',          ja:'TLプレーヤー',         zh:'TL播放器',    es:'Reproductor TL',     pt:'Player TL' },
    feat_player_sub: { ko:'파일 TL이 실시간으로 소모되는 시스템', en:'System where File TL is consumed in real time', ja:'ファイルTLがリアルタイムで消費されるシステム', zh:'文件TL实时消耗系统', es:'Sistema donde el TL del archivo se consume en tiempo real', pt:'Sistema onde o TL do arquivo é consumido em tempo real' },
    cta_now:         { ko:'지금 바로 시작하세요', en:'Start Right Now',   ja:'今すぐ始める',        zh:'立即开始',    es:'Empieza ahora mismo', pt:'Comece agora mesmo' },
    cta_bonus:       { ko:'가입 즉시',     en:'Upon Sign-up',       ja:'登録後すぐに',         zh:'注册即得',    es:'Al registrarse',     pt:'Ao se cadastrar' },
    cta_free_tl:     { ko:'무료 지급',     en:'Free TL Given',      ja:'無料付与',            zh:'免费发放',    es:'TL gratis',          pt:'TL grátis' },

    // ── about.html ──
    about_hero_tag:  { ko:'창작자를 위한', en:'For Creators',       ja:'クリエイターのために', zh:'为创作者',    es:'Para creadores',     pt:'Para criadores' },
    about_hero_title: { ko:'새로운 경제 생태계', en:'New Economic Ecosystem', ja:'新しい経済エコシステム', zh:'全新经济生态系统', es:'Nuevo ecosistema económico', pt:'Novo ecossistema econômico' },
    about_stat1:     { ko:'활성 창작자',   en:'Active Creators',    ja:'アクティブクリエイター', zh:'活跃创作者', es:'Creadores activos',   pt:'Criadores ativos' },
    about_stat2:     { ko:'누적 Pulse',    en:'Total Pulse',        ja:'累計Pulse',           zh:'累计Pulse',   es:'Pulse total',        pt:'Pulse total' },
    about_stat3:     { ko:'창작자 만족도', en:'Creator Satisfaction', ja:'クリエイター満足度',  zh:'创作者满意度', es:'Satisfacción de creadores', pt:'Satisfação dos criadores' },
    about_stat4:     { ko:'설립 연도',     en:'Founded',            ja:'設立年',              zh:'成立年份',    es:'Fundado',            pt:'Fundado' },
    about_mission:   { ko:'우리의 미션',   en:'Our Mission',        ja:'私たちのミッション',   zh:'我们的使命',  es:'Nuestra misión',     pt:'Nossa missão' },
    about_mission_desc: { ko:'모든 창작자가 자신의 콘텐츠로 정당한 수익을 얻는 세상', en:'A world where every creator earns fair revenue from their content', ja:'すべてのクリエイターが自分のコンテンツで正当な収益を得られる世界', zh:'让每位创作者都能从自己的内容中获得公正收益的世界', es:'Un mundo donde cada creador obtiene ingresos justos de su contenido', pt:'Um mundo onde todo criador ganha receita justa com seu conteúdo' },
    about_feat1:     { ko:'실시간 수익 분배', en:'Real-time Revenue Distribution', ja:'リアルタイム収益分配', zh:'实时收益分配', es:'Distribución de ingresos en tiempo real', pt:'Distribuição de receita em tempo real' },
    about_feat1_desc: { ko:'재생 즉시 TL 토큰으로 창작자에게 수익이 지급됩니다. 지연 없는 투명한 정산.', en:'Revenue is paid to creators instantly in TL tokens upon playback. Transparent settlement with no delay.', ja:'再生後すぐにTLトークンでクリエイターに収益が支払われます。遅延のない透明な精算。', zh:'播放后立即以TL代币向创作者支付收益。无延迟的透明结算。', es:'Los ingresos se pagan a los creadores instantáneamente en tokens TL al reproducirse. Liquidación transparente sin demoras.', pt:'A receita é paga aos criadores instantaneamente em tokens TL na reprodução. Liquidação transparente sem atraso.' },
    about_feat2:     { ko:'블록체인 창작권 보호', en:'Blockchain Copyright Protection', ja:'ブロックチェーン著作権保護', zh:'区块链版权保护', es:'Protección de derechos de autor en blockchain', pt:'Proteção de direitos autorais em blockchain' },
    about_feat3:     { ko:'글로벌 마켓플레이스', en:'Global Marketplace', ja:'グローバルマーケットプレイス', zh:'全球市场', es:'Mercado global', pt:'Mercado global' },
    about_values:    { ko:'핵심 가치',     en:'Core Values',        ja:'コアバリュー',         zh:'核心价值',    es:'Valores fundamentales', pt:'Valores fundamentais' },
    about_val1:      { ko:'공정한 보상',   en:'Fair Reward',        ja:'公正な報酬',          zh:'公平奖励',    es:'Recompensa justa',   pt:'Recompensa justa' },
    about_val1_desc: { ko:'창작자 기여도(POC)에 따른 투명하고 공정한 수익 배분 시스템', en:'Transparent and fair revenue sharing system based on creator contribution (POC)', ja:'クリエイター貢献度(POC)に基づく透明で公正な収益配分システム', zh:'基于创作者贡献度(POC)的透明公正的收益分配系统', es:'Sistema de distribución de ingresos transparente y justo basado en la contribución del creador (POC)', pt:'Sistema de distribuição de receita transparente e justo baseado na contribuição do criador (POC)' },
    about_val2:      { ko:'창작권 보호',   en:'Copyright Protection', ja:'著作権保護',         zh:'版权保护',    es:'Protección de derechos de autor', pt:'Proteção de direitos autorais' },
    about_val2_desc: { ko:'블록체인으로 모든 창작물의 소유권을 불변하게 기록하고 보호', en:'Record and protect ownership of all creations immutably on blockchain', ja:'ブロックチェーンですべての創作物の所有権を不変に記録・保護', zh:'通过区块链不可变地记录和保护所有创作物的所有权', es:'Registra y protege la propiedad de todas las creaciones de forma inmutable en blockchain', pt:'Registre e proteja a propriedade de todas as criações de forma imutável na blockchain' },

    // ── ads.html ──
    ads_title:       { ko:'광고를 시청하고 TL을 획득하세요. 획득한 TL은 음악 감상에 사용해야 환전할 수 있습니다.', en:'Watch ads and earn TL. Earned TL must be used for music listening to be exchangeable.', ja:'広告を視聴してTLを獲得しましょう。獲得したTLは音楽視聴に使用することで換金できます。', zh:'观看广告赚取TL。获得的TL必须用于欣赏音乐才能兑换。', es:'Mira anuncios y gana TL. El TL ganado debe usarse para escuchar música para poder canjearse.', pt:'Assista anúncios e ganhe TL. O TL ganho deve ser usado para ouvir música para ser trocado.' },
    ads_today:       { ko:'오늘의 광고 현황', en:"Today's Ad Status", ja:'今日の広告状況',     zh:'今日广告状态', es:'Estado de anuncios de hoy', pt:'Status de anúncios de hoje' },
    ads_watched:     { ko:'오늘 시청',     en:'Watched Today',      ja:'今日視聴',            zh:'今日观看',    es:'Visto hoy',          pt:'Assistido hoje' },
    ads_earned_today: { ko:'오늘 획득',    en:'Earned Today',       ja:'今日獲得',            zh:'今日获得',    es:'Ganado hoy',         pt:'Ganho hoje' },
    ads_total:       { ko:'획득 총계',     en:'Total Earned',       ja:'獲得合計',            zh:'获得总计',    es:'Total ganado',       pt:'Total ganho' },
    ads_available:   { ko:'시청 가능한 광고', en:'Available Ads',   ja:'視聴可能な広告',       zh:'可观看的广告', es:'Anuncios disponibles', pt:'Anúncios disponíveis' },
    ads_loading:     { ko:'현재 위치 기반 광고를 불러오는 중...', en:'Loading location-based ads...', ja:'現在地に基づく広告を読み込み中...', zh:'正在加载基于位置的广告...', es:'Cargando anuncios basados en ubicación...', pt:'Carregando anúncios baseados em localização...' },

    // ── car.html ──
    car_title:       { ko:'이동 중 최적화된 음악 추천 — BPM, 상황에 맞게 자동 큐레이션', en:'Optimized music recommendations while moving — Auto-curated by BPM and situation', ja:'移動中に最適化された音楽推薦 — BPMと状況に合わせて自動キュレーション', zh:'移动中的优化音乐推荐 — 根据BPM和情境自动策划', es:'Recomendaciones musicales optimizadas en movimiento — Curado automáticamente por BPM y situación', pt:'Recomendações musicais otimizadas em movimento — Curado automaticamente por BPM e situação' },
    car_walk:        { ko:'걷기 · 산책에 최적', en:'Best for Walking', ja:'ウォーキングに最適',  zh:'最适合步行',  es:'Ideal para caminar', pt:'Ideal para caminhar' },
    car_mood:        { ko:'분위기',        en:'Mood',              ja:'ムード',              zh:'氛围',       es:'Ambiente',           pt:'Ambiente' },
    car_energy:      { ko:'에너지',        en:'Energy',            ja:'エネルギー',          zh:'能量',       es:'Energía',            pt:'Energia' },

    // ── charge.html ──
    charge_title:    { ko:'광고 시청으로 무료 충전하거나, 직접 구매하세요.', en:'Charge for free by watching ads, or purchase directly.', ja:'広告視聴で無料チャージ、または直接購入してください。', zh:'通过观看广告免费充值，或直接购买。', es:'Recarga gratis viendo anuncios o compra directamente.', pt:'Carregue grátis assistindo anúncios ou compre diretamente.' },
    charge_balance:  { ko:'현재 TL 잔액', en:'Current TL Balance', ja:'現在のTL残高',         zh:'当前TL余额', es:'Saldo TL actual',     pt:'Saldo TL atual' },
    charge_today:    { ko:'오늘 충전한 TL', en:'TL Charged Today',  ja:'今日チャージしたTL',  zh:'今日充值TL', es:'TL cargado hoy',     pt:'TL carregado hoje' },
    charge_ad_info:  { ko:'광고를 시청하는 동안', en:'While watching ads', ja:'広告を視聴中',   zh:'观看广告期间', es:'Mientras ves anuncios', pt:'Enquanto assiste anúncios' },
    charge_accrue:   { ko:'가 실시간으로 적립됩니다. 하루 최대 5,000 TL.', en:'is accrued in real time. Max 5,000 TL per day.', ja:'がリアルタイムで積立されます。1日最大5,000 TL。', zh:'实时积累。每天最多5,000 TL。', es:'se acumula en tiempo real. Máximo 5.000 TL por día.', pt:'é acumulado em tempo real. Máximo 5.000 TL por dia.' },

    // ── chart.html ──
    chart_settings:  { ko:'차트 설정',     en:'Chart Settings',    ja:'チャート設定',         zh:'图表设置',    es:'Configuración de gráficos', pt:'Configurações do gráfico' },
    chart_horizontal: { ko:'가로형',       en:'Horizontal',        ja:'横型',               zh:'横向',       es:'Horizontal',         pt:'Horizontal' },
    chart_vertical:  { ko:'세로형',        en:'Vertical',          ja:'縦型',               zh:'纵向',       es:'Vertical',           pt:'Vertical' },
    chart_grid:      { ko:'그리드형',      en:'Grid',              ja:'グリッド型',          zh:'网格',       es:'Cuadrícula',         pt:'Grade' },
    chart_realtime:  { ko:'실시간 인기',   en:'Realtime Popular',  ja:'リアルタイム人気',     zh:'实时热门',    es:'Popular en tiempo real', pt:'Popular em tempo real' },
    chart_weekly:    { ko:'주간 인기',     en:'Weekly Popular',    ja:'週間人気',            zh:'本周热门',    es:'Popular semanal',    pt:'Popular semanal' },
    chart_poc:       { ko:'창작자 기여도', en:'Creator Contribution', ja:'クリエイター貢献度', zh:'创作者贡献度', es:'Contribución del creador', pt:'Contribuição do criador' },
    chart_new:       { ko:'신규 창작자',   en:'New Creators',      ja:'新規クリエイター',     zh:'新创作者',    es:'Nuevos creadores',   pt:'Novos criadores' },
    chart_cafe:      { ko:'카페방송 차트', en:'Cafe Radio Chart',  ja:'カフェ放送チャート',   zh:'咖啡广播图表', es:'Gráfico de Radio Café', pt:'Gráfico de Rádio Café' },
    chart_custom:    { ko:'맞춤 추천 차트', en:'Custom Recommendation Chart', ja:'カスタム推薦チャート', zh:'自定义推荐图表', es:'Gráfico de recomendaciones personalizadas', pt:'Gráfico de recomendações personalizadas' },

    // ── creator.html ──
    creator_hero_tag: { ko:'창작자를 위한', en:'For Creators',      ja:'クリエイターのために', zh:'为创作者',    es:'Para creadores',     pt:'Para criadores' },
    creator_hero_title: { ko:'최고의 플랫폼', en:'The Best Platform', ja:'最高のプラットフォーム', zh:'最佳平台',  es:'La mejor plataforma', pt:'A melhor plataforma' },
    creator_start:   { ko:'창작자로 시작하기', en:'Start as Creator', ja:'クリエイターとして始める', zh:'作为创作者开始', es:'Empezar como creador', pt:'Começar como criador' },
    creator_benefits: { ko:'창작자 전용 혜택', en:'Creator-Only Benefits', ja:'クリエイター専用特典', zh:'创作者专属福利', es:'Beneficios exclusivos para creadores', pt:'Benefícios exclusivos para criadores' },
    creator_instant: { ko:'즉시 정산',     en:'Instant Settlement', ja:'即時精算',            zh:'即时结算',    es:'Liquidación instantánea', pt:'Liquidação instantânea' },
    creator_instant_desc: { ko:'재생 즉시 TL로 수익이 지급됩니다. 월 정산 대기 없이 실시간으로 확인하세요.', en:'Revenue is paid in TL immediately upon playback. Check in real time without waiting for monthly settlement.', ja:'再生後すぐにTLで収益が支払われます。月次精算を待たずにリアルタイムで確認できます。', zh:'播放后立即以TL支付收益。无需等待月结，实时查看。', es:'Los ingresos se pagan en TL inmediatamente al reproducirse. Consulta en tiempo real sin esperar la liquidación mensual.', pt:'A receita é paga em TL imediatamente na reprodução. Verifique em tempo real sem esperar a liquidação mensal.' },
    creator_calc:    { ko:'예상 월 수익을 계산해 보세요', en:'Calculate your expected monthly revenue', ja:'予想月収を計算してみましょう', zh:'计算您的预期月收入', es:'Calcule sus ingresos mensuales esperados', pt:'Calcule sua receita mensal esperada' },
    creator_monthly_play: { ko:'월 평균 재생 시간:', en:'Avg. Monthly Playback:', ja:'月平均再生時間：', zh:'月均播放时间：', es:'Reproducción mensual promedio:', pt:'Reprodução mensal média:' },
    creator_tracks:  { ko:'등록 트랙 수:',  en:'Registered Tracks:', ja:'登録トラック数：',    zh:'注册曲目数：', es:'Pistas registradas:', pt:'Faixas registradas:' },
    creator_plan_select: { ko:'수익 배분 선택:', en:'Revenue Split:', ja:'収益配分選択：',     zh:'收益分配选择：', es:'Selección de distribución:', pt:'Seleção de distribuição:' },
    creator_plan_a:  { ko:'플랜 A (7:3)',   en:'Plan A (7:3)',       ja:'プランA (7:3)',        zh:'方案A (7:3)', es:'Plan A (7:3)',        pt:'Plano A (7:3)' },
    creator_plan_b:  { ko:'플랜 B (5:5 + TLC)', en:'Plan B (5:5 + TLC)', ja:'プランB (5:5 + TLC)', zh:'方案B (5:5 + TLC)', es:'Plan B (5:5 + TLC)', pt:'Plano B (5:5 + TLC)' },

    // ── faq.html ──
    faq_title:       { ko:'자주 묻는',     en:'Frequently Asked',  ja:'よくある',            zh:'常见问题',    es:'Preguntas',          pt:'Perguntas' },
    faq_title2:      { ko:'질문',          en:'Questions',         ja:'質問',               zh:'',           es:'frecuentes',         pt:'frequentes' },
    faq_q1:          { ko:'수익 배분은 어떻게 되나요?', en:'How does revenue sharing work?', ja:'収益配分はどうなっていますか？', zh:'收益分配是如何运作的？', es:'¿Cómo funciona la distribución de ingresos?', pt:'Como funciona a distribuição de receita?' },
    faq_q2:          { ko:'파일 TL이 소진되면 어떻게 되나요?', en:'What happens when File TL runs out?', ja:'ファイルTLが枯渇したらどうなりますか？', zh:'文件TL用完后会怎样？', es:'¿Qué pasa cuando se agota el TL del archivo?', pt:'O que acontece quando o TL do arquivo acaba?' },
    faq_q3:          { ko:'카페방송은 누가 사용할 수 있나요?', en:'Who can use Cafe Radio?', ja:'カフェ放送は誰が使えますか？', zh:'谁可以使用咖啡广播？', es:'¿Quién puede usar Radio Café?', pt:'Quem pode usar a Rádio Café?' },
    faq_q4:          { ko:'저작권 걱정 없이 매장에서 음악을 틀 수 있나요?', en:'Can I play music in my store without copyright concerns?', ja:'著作権を気にせずお店で音楽を流せますか？', zh:'我可以在店里放音乐而不担心版权问题吗？', es:'¿Puedo reproducir música en mi tienda sin preocupaciones por derechos de autor?', pt:'Posso tocar música na minha loja sem preocupações com direitos autorais?' },
    faq_q5:          { ko:'비밀번호를 잊어버렸어요.', en:'I forgot my password.', ja:'パスワードを忘れました。', zh:'我忘记了密码。', es:'Olvidé mi contraseña.', pt:'Esqueci minha senha.' },
    faq_q6:          { ko:'계정을 삭제하면 TL은 어떻게 되나요?', en:'What happens to my TL if I delete my account?', ja:'アカウントを削除するとTLはどうなりますか？', zh:'删除账户后TL会怎样？', es:'¿Qué le pasa a mi TL si elimino mi cuenta?', pt:'O que acontece com meu TL se eu excluir minha conta?' },
    faq_contact:     { ko:'원하는 답변을 찾지 못하셨나요?', en:"Couldn't find the answer you're looking for?", ja:'お探しの回答が見つかりませんでしたか？', zh:'没有找到您想要的答案吗？', es:'¿No encontró la respuesta que buscaba?', pt:'Não encontrou a resposta que procurava?' },
    faq_contact_desc: { ko:'팀에게 직접 문의하시면 빠르게 답변드리겠습니다.', en:"Contact our team directly and we'll respond quickly.", ja:'チームに直接お問い合わせいただければ迅速に回答いたします。', zh:'直接联系我们的团队，我们将迅速回复。', es:'Contáctenos directamente y responderemos rápidamente.', pt:'Entre em contato diretamente com nossa equipe e responderemos rapidamente.' },
    faq_email:       { ko:'이메일로 문의하기', en:'Contact via Email', ja:'メールで問い合わせる', zh:'通过邮件联系', es:'Contactar por correo', pt:'Contatar por e-mail' },

    // ── library.html ──
    lib_all:         { ko:'전체 파일',     en:'All Files',         ja:'全ファイル',          zh:'所有文件',    es:'Todos los archivos', pt:'Todos os arquivos' },
    lib_pending:     { ko:'인증 대기',     en:'Pending',           ja:'認証待ち',            zh:'待认证',      es:'Pendiente',          pt:'Pendente' },
    lib_certified:   { ko:'인증 완료',     en:'Certified',         ja:'認証済み',            zh:'已认证',      es:'Certificado',        pt:'Certificado' },
    lib_guide:       { ko:'업로드한 파일을 인증 후 SharePlace에 등록하세요', en:'Certify your uploaded files and register them on SharePlace', ja:'アップロードしたファイルを認証してSharePlaceに登録しましょう', zh:'认证您上传的文件并在SharePlace上注册', es:'Certifica tus archivos subidos y regístralos en SharePlace', pt:'Certifique seus arquivos enviados e registre-os no SharePlace' },
    lib_empty:       { ko:'아직 파일이 없습니다', en:'No files yet',    ja:'まだファイルがありません', zh:'暂无文件',   es:'Aún no hay archivos', pt:'Ainda não há arquivos' },

    // ── login.html ──
    login_welcome:   { ko:'다시 오셨군요',  en:'Welcome back',      ja:'おかえりなさい',      zh:'欢迎回来',    es:'Bienvenido de vuelta', pt:'Bem-vindo de volta' },
    login_sub:       { ko:'계속 Pulse를 쌓아보세요', en:'Keep building your Pulse', ja:'Pulseを積み上げ続けましょう', zh:'继续积累您的Pulse', es:'Sigue acumulando tu Pulse', pt:'Continue acumulando seu Pulse' },
    login_no_account: { ko:'계정이 없으신가요?', en:"Don't have an account?", ja:'アカウントをお持ちでないですか？', zh:'没有账户？', es:'¿No tiene una cuenta?', pt:'Não tem uma conta?' },
    login_free_join: { ko:'무료 가입 →',    en:'Join Free →',       ja:'無料登録 →',          zh:'免费注册 →',  es:'Registrarse gratis →', pt:'Cadastrar-se grátis →' },

    // ── pricing.html ──
    pricing_hero_tag: { ko:'모든 창작자를 위한', en:'For all creators', ja:'すべてのクリエイターのために', zh:'适合所有创作者', es:'Para todos los creadores', pt:'Para todos os criadores' },
    pricing_hero_title: { ko:'합리적인 요금제', en:'Reasonable Pricing', ja:'合理的な料金プラン', zh:'合理的定价方案', es:'Precios razonables', pt:'Preços razoáveis' },
    pricing_hero_sub: { ko:'무료로 시작하고, 필요할 때 업그레이드하세요. 숨겨진 요금은 없습니다.', en:'Start for free, upgrade when you need to. No hidden fees.', ja:'無料で始め、必要な時にアップグレードしてください。隠れた料金はありません。', zh:'免费开始，需要时升级。没有隐藏费用。', es:'Empieza gratis, actualiza cuando lo necesites. Sin cargos ocultos.', pt:'Comece grátis, atualize quando precisar. Sem taxas ocultas.' },
    pricing_free:    { ko:'기본 창작자',    en:'Basic Creator',     ja:'ベーシッククリエイター', zh:'基础创作者',  es:'Creador básico',    pt:'Criador básico' },
    pricing_per_month: { ko:'원 / 월',      en:'KRW / month',       ja:'円 / 月',             zh:'韩元 / 月',   es:'KRW / mes',          pt:'KRW / mês' },
    pricing_free_desc: { ko:'개인 창작자를 위한 무료 플랜. 지금 당장 시작하세요.', en:'Free plan for individual creators. Start right now.', ja:'個人クリエイターのための無料プラン。今すぐ始めましょう。', zh:'面向个人创作者的免费计划。立即开始。', es:'Plan gratuito para creadores individuales. Comienza ahora mismo.', pt:'Plano gratuito para criadores individuais. Comece agora mesmo.' },
    pricing_pro:     { ko:'프로 창작자',    en:'Pro Creator',       ja:'プロクリエイター',     zh:'专业创作者',  es:'Creador profesional', pt:'Criador profissional' },
    pricing_pro_desc: { ko:'진지한 창작자를 위한 풀 기능 플랜. TLC 채굴 포함.', en:'Full-featured plan for serious creators. Includes TLC mining.', ja:'本格的なクリエイターのためのフル機能プラン。TLCマイニング含む。', zh:'面向认真创作者的全功能计划。包含TLC挖矿。', es:'Plan completo para creadores serios. Incluye minería TLC.', pt:'Plano completo para criadores sérios. Inclui mineração TLC.' },

    // ── radio.html ──
    radio_business:  { ko:'사업자',        en:'Business',          ja:'事業者',             zh:'商业',       es:'Empresas',           pt:'Empresas' },
    radio_title:     { ko:'사업자 전용 · 24시간 자동 방송', en:'Business Only · 24-hour Auto Broadcast', ja:'事業者専用 · 24時間自動放送', zh:'仅限商业 · 24小时自动播放', es:'Solo empresas · Transmisión automática 24 horas', pt:'Somente empresas · Transmissão automática 24 horas' },
    radio_my_station: { ko:'내 방송 설정',  en:'My Station Settings', ja:'マイ放送設定',       zh:'我的广播设置', es:'Configuración de mi emisora', pt:'Configurações da minha estação' },
    radio_on_air:    { ko:'현재 방송 중',   en:'Currently On Air',  ja:'現在放送中',          zh:'当前播出中',  es:'En el aire ahora',   pt:'No ar agora' },

    // ── roadmap.html ──
    roadmap_title:   { ko:'개발 로드맵',    en:'Development Roadmap', ja:'開発ロードマップ',   zh:'开发路线图',  es:'Hoja de ruta de desarrollo', pt:'Roteiro de desenvolvimento' },
    roadmap_sub:     { ko:'창작 경제의 미래를 향한 단계별 여정. 우리가 걸어온 길과 앞으로 나아갈 방향입니다.', en:"A step-by-step journey toward the future of the creative economy. Our path so far and the direction ahead.", ja:'クリエイティブエコノミーの未来に向けた段階的な旅。私たちが歩んできた道と今後の方向性です。', zh:'迈向创意经济未来的分步旅程。我们走过的路和未来的方向。', es:'Un viaje paso a paso hacia el futuro de la economía creativa. Nuestro camino hasta ahora y la dirección futura.', pt:'Uma jornada passo a passo rumo ao futuro da economia criativa. Nosso caminho até agora e a direção futura.' },
    roadmap_join:    { ko:'이 여정에 함께하세요', en:'Join This Journey', ja:'この旅に参加しましょう', zh:'加入这段旅程', es:'Únase a este viaje', pt:'Participe desta jornada' },

    // ── shareplace.html ──
    sp_sub:          { ko:'커뮤니티 음악 공유 · 재생 시 창작자에게 TL 수익 지급', en:'Community music sharing · TL revenue paid to creators on playback', ja:'コミュニティ音楽共有 · 再生時にクリエイターへTL収益支払', zh:'社区音乐共享 · 播放时向创作者支付TL收益', es:'Compartir música comunitario · TL pagado a creadores al reproducirse', pt:'Compartilhamento musical comunitário · TL pago aos criadores na reprodução' },
    sp_shared:       { ko:'공유된 트랙',   en:'Shared Tracks',     ja:'共有トラック',         zh:'共享曲目',    es:'Pistas compartidas', pt:'Faixas compartilhadas' },
    sp_pulse:        { ko:'총 Pulse',      en:'Total Pulse',       ja:'合計Pulse',           zh:'总Pulse',     es:'Pulse total',        pt:'Pulse total' },
    sp_active:       { ko:'활성 유저',     en:'Active Users',      ja:'アクティブユーザー',   zh:'活跃用户',    es:'Usuarios activos',   pt:'Usuários ativos' },
    sp_today:        { ko:'오늘 공유',     en:'Shared Today',      ja:'今日共有',            zh:'今日共享',    es:'Compartido hoy',     pt:'Compartilhado hoje' },
    sp_community:    { ko:'커뮤니티 트랙', en:'Community Tracks',  ja:'コミュニティトラック', zh:'社区曲目',    es:'Pistas comunitarias', pt:'Faixas comunitárias' },
    sp_empty:        { ko:'아직 공유된 트랙이 없습니다', en:'No shared tracks yet', ja:'まだ共有されたトラックがありません', zh:'暂无共享曲目', es:'Aún no hay pistas compartidas', pt:'Ainda não há faixas compartilhadas' },

    // ── signup.html ──
    signup_email_verify: { ko:'이메일로 인증코드를 받아 본인 확인을 완료하세요. 수익 정산 시 본인 확인에 사용됩니다.', en:'Receive a verification code by email to complete identity verification. Used for revenue settlement.', ja:'メールで認証コードを受け取り、本人確認を完了してください。収益精算時の本人確認に使用されます。', zh:'通过电子邮件接收验证码以完成身份验证。用于收益结算时的身份验证。', es:'Recibe un código de verificación por correo para completar la verificación de identidad. Se usa para la liquidación de ingresos.', pt:'Receba um código de verificação por e-mail para completar a verificação de identidade. Usado para liquidação de receita.' },
    signup_email:    { ko:'이메일 주소',   en:'Email Address',     ja:'メールアドレス',      zh:'电子邮件地址', es:'Dirección de correo', pt:'Endereço de e-mail' },
    signup_code:     { ko:'인증 코드',     en:'Verification Code', ja:'認証コード',          zh:'验证码',      es:'Código de verificación', pt:'Código de verificação' },
    signup_code_hint: { ko:'이메일로 발송된 6자리 코드를 입력하세요.', en:'Enter the 6-digit code sent to your email.', ja:'メールに送信された6桁のコードを入力してください。', zh:'输入发送到您邮箱的6位数字代码。', es:'Introduce el código de 6 dígitos enviado a tu correo.', pt:'Digite o código de 6 dígitos enviado ao seu e-mail.' },
    signup_basic:    { ko:'기본 정보 입력', en:'Enter Basic Info',  ja:'基本情報入力',        zh:'输入基本信息', es:'Ingresar información básica', pt:'Inserir informações básicas' },
    signup_basic_sub: { ko:'플랫폼에서 사용할 닉네임과 비밀번호를 설정하세요.', en:'Set a nickname and password to use on the platform.', ja:'プラットフォームで使用するニックネームとパスワードを設定してください。', zh:'设置在平台上使用的昵称和密码。', es:'Establece un apodo y contraseña para usar en la plataforma.', pt:'Defina um apelido e senha para usar na plataforma.' },
    signup_nickname: { ko:'닉네임',        en:'Nickname',          ja:'ニックネーム',         zh:'昵称',       es:'Apodo',              pt:'Apelido' },
    signup_nick_hint: { ko:'다른 창작자들에게 보이는 이름입니다.', en:'This is the name visible to other creators.', ja:'他のクリエイターに表示される名前です。', zh:'这是其他创作者看到的名字。', es:'Este es el nombre visible para otros creadores.', pt:'Este é o nome visível para outros criadores.' },
    signup_pw:       { ko:'비밀번호',      en:'Password',          ja:'パスワード',          zh:'密码',       es:'Contraseña',         pt:'Senha' },
    signup_pw_confirm: { ko:'비밀번호 확인', en:'Confirm Password', ja:'パスワード確認',       zh:'确认密码',    es:'Confirmar contraseña', pt:'Confirmar senha' },
    signup_pw_mismatch: { ko:'비밀번호가 일치하지 않습니다.', en:'Passwords do not match.', ja:'パスワードが一致しません。', zh:'密码不匹配。', es:'Las contraseñas no coinciden.', pt:'As senhas não coincidem.' },
    signup_personal: { ko:'개인 정보',     en:'Personal Info',     ja:'個人情報',            zh:'个人信息',    es:'Información personal', pt:'Informações pessoais' },
    signup_personal_sub: { ko:'수익 정산 및 저작권 관리를 위한 정보입니다. 암호화되어 안전하게 저장됩니다.', en:'This information is for revenue settlement and copyright management. Stored securely with encryption.', ja:'収益精算と著作権管理のための情報です。暗号化されて安全に保存されます。', zh:'此信息用于收益结算和版权管理。经过加密安全存储。', es:'Esta información es para la liquidación de ingresos y gestión de derechos de autor. Se almacena de forma segura con cifrado.', pt:'Esta informação é para liquidação de receita e gestão de direitos autorais. Armazenada com segurança e criptografia.' },
    signup_birth:    { ko:'생년월일',      en:'Date of Birth',     ja:'生年月日',            zh:'出生日期',    es:'Fecha de nacimiento', pt:'Data de nascimento' },
    signup_phone:    { ko:'전화번호',      en:'Phone Number',      ja:'電話番号',            zh:'电话号码',    es:'Número de teléfono', pt:'Número de telefone' },

    // ── tokenomics.html ──
    token_title:     { ko:'토큰 경제 모델', en:'Token Economy Model', ja:'トークン経済モデル', zh:'代币经济模型', es:'Modelo de economía de tokens', pt:'Modelo de economia de tokens' },
    token_consume:   { ko:'콘텐츠 소비 결제', en:'Content Consumption Payment', ja:'コンテンツ消費決済', zh:'内容消费支付', es:'Pago por consumo de contenido', pt:'Pagamento por consumo de conteúdo' },
    token_convert:   { ko:'법정화폐 / TLC 전환', en:'Fiat / TLC Conversion', ja:'法定通貨 / TLC転換', zh:'法币 / TLC转换', es:'Conversión a moneda fiat / TLC', pt:'Conversão para moeda fiduciária / TLC' },
    token_rate:      { ko:'소모율',        en:'Burn Rate',         ja:'消費率',              zh:'消耗率',      es:'Tasa de consumo',    pt:'Taxa de consumo' },
    token_rate_val:  { ko:'음악 1 TL/초, 영상 2 TL/초', en:'Music 1 TL/sec, Video 2 TL/sec', ja:'音楽1 TL/秒、映像2 TL/秒', zh:'音乐1 TL/秒，视频2 TL/秒', es:'Música 1 TL/seg, Video 2 TL/seg', pt:'Música 1 TL/seg, Vídeo 2 TL/seg' },
    token_bonus:     { ko:'신규 가입 보너스', en:'New Member Bonus',  ja:'新規登録ボーナス',    zh:'新会员奖励',  es:'Bono de nuevo miembro', pt:'Bônus de novo membro' },
    token_max:       { ko:'최대 발행량',   en:'Max Supply',        ja:'最大発行量',          zh:'最大供应量',  es:'Suministro máximo', pt:'Fornecimento máximo' },
    token_unlimited: { ko:'제한 없음 (수요 기반)', en:'Unlimited (demand-based)', ja:'制限なし（需要ベース）', zh:'无限（基于需求）', es:'Ilimitado (basado en demanda)', pt:'Ilimitado (baseado em demanda)' },
    token_listener:  { ko:'청취자',        en:'Listener',          ja:'リスナー',            zh:'听众',       es:'Oyente',             pt:'Ouvinte' },
    token_platform:  { ko:'플랫폼',        en:'Platform',          ja:'プラットフォーム',     zh:'平台',       es:'Plataforma',         pt:'Plataforma' },
    token_creator:   { ko:'창작자',        en:'Creator',           ja:'クリエイター',         zh:'创作者',     es:'Creador',            pt:'Criador' },

    // ── wallet.html ──
    wallet_purchase_tl: { ko:'구매 TL',    en:'Purchase TL',       ja:'購入TL',             zh:'购买TL',      es:'TL comprado',        pt:'TL comprado' },
    wallet_cash:     { ko:'현금 충전',      en:'Cash Recharge',     ja:'現金チャージ',         zh:'现金充值',    es:'Recarga en efectivo', pt:'Recarga em dinheiro' },
    wallet_earned_tl: { ko:'획득 TL',      en:'Earned TL',         ja:'獲得TL',             zh:'获得TL',      es:'TL ganado',          pt:'TL ganho' },
    wallet_ad_event: { ko:'광고·이벤트',   en:'Ads & Events',      ja:'広告・イベント',       zh:'广告·活动',    es:'Anuncios y eventos', pt:'Anúncios e eventos' },
    wallet_exchange: { ko:'환전 내역',      en:'Exchange History',  ja:'換金履歴',            zh:'兑换记录',    es:'Historial de cambio', pt:'Histórico de troca' },
    wallet_music_use: { ko:'음악 사용',     en:'Music Usage',       ja:'音楽使用',            zh:'音乐使用',    es:'Uso de música',      pt:'Uso de música' },
    wallet_exchange_cond: { ko:'환전 가능 조건', en:'Exchange Conditions', ja:'換金可能条件', zh:'可兑换条件',  es:'Condiciones de cambio', pt:'Condições de troca' },
    wallet_usage_rate: { ko:'획득 TL 사용률', en:'Earned TL Usage Rate', ja:'獲得TL使用率', zh:'获得TL使用率', es:'Tasa de uso de TL ganado', pt:'Taxa de uso de TL ganho' },

    // ── poc.html ──
    poc_algo:        { ko:'알고리즘',       en:'Algorithm',         ja:'アルゴリズム',         zh:'算法',       es:'Algoritmo',          pt:'Algoritmo' },
    poc_revenue:     { ko:'수익 분배',      en:'Revenue Share',     ja:'収益分配',            zh:'收益分配',    es:'Distribución de ingresos', pt:'Distribuição de receita' },
    poc_simulator:   { ko:'시뮬레이터',     en:'Simulator',         ja:'シミュレーター',       zh:'模拟器',      es:'Simulador',          pt:'Simulador' },
    poc_roadmap:     { ko:'로드맵',         en:'Roadmap',           ja:'ロードマップ',          zh:'路线图',      es:'Hoja de ruta',       pt:'Roteiro' },
    poc_tokenomics:  { ko:'토큰 경제',      en:'Tokenomics',        ja:'トークン経済',          zh:'代币经济',    es:'Tokenomía',          pt:'Tokenomia' },
    poc_hero_tag:    { ko:'시스템 공개',    en:'System Transparent', ja:'システム公開',         zh:'系统公开',    es:'Sistema transparente', pt:'Sistema transparente' },
    poc_hero_title1: { ko:'투명한',         en:'Transparent',       ja:'透明な',              zh:'透明的',      es:'Transparente',       pt:'Transparente' },
    poc_hero_title2: { ko:'기여도 분석',    en:'Contribution Analysis', ja:'貢献度分析',       zh:'贡献度分析',  es:'Análisis de contribución', pt:'Análise de contribuição' },
    poc_system:      { ko:'시스템을 공개합니다', en:'We reveal our system', ja:'システムを公開します', zh:'我们公开系统', es:'Revelamos nuestro sistema', pt:'Revelamos nosso sistema' },

    // ── 광고주 포털 (ads.html advertiser) ──
    adv_portal:        { ko:'광고주 포털',        en:'Advertiser Portal',     ja:'広告主ポータル',       zh:'广告主门户',    es:'Portal del anunciante',   pt:'Portal do anunciante' },
    adv_viewer:        { ko:'광고 시청',           en:'Watch Ads',             ja:'広告視聴',            zh:'观看广告',      es:'Ver anuncios',            pt:'Assistir anúncios' },
    adv_dashboard:     { ko:'캠페인 관리',         en:'Campaign Management',   ja:'キャンペーン管理',     zh:'广告活动管理',  es:'Gestión de campañas',     pt:'Gestão de campanhas' },
    adv_new:           { ko:'새 광고 만들기',      en:'Create New Ad',         ja:'新しい広告を作る',     zh:'创建新广告',    es:'Crear nuevo anuncio',     pt:'Criar novo anúncio' },
    adv_packages:      { ko:'광고 패키지',         en:'Ad Packages',           ja:'広告パッケージ',       zh:'广告套餐',      es:'Paquetes de anuncios',    pt:'Pacotes de anúncios' },
    adv_pkg_basic:     { ko:'베이직',             en:'Basic',                  ja:'ベーシック',           zh:'基础版',        es:'Básico',                  pt:'Básico' },
    adv_pkg_pro:       { ko:'프로',               en:'Pro',                    ja:'プロ',                zh:'专业版',        es:'Pro',                     pt:'Pro' },
    adv_pkg_premium:   { ko:'프리미엄',           en:'Premium',                ja:'プレミアム',           zh:'高级版',        es:'Premium',                 pt:'Premium' },
    adv_impressions:   { ko:'노출 수',            en:'Impressions',            ja:'インプレッション',     zh:'展示次数',      es:'Impresiones',             pt:'Impressões' },
    adv_clicks:        { ko:'클릭 수',            en:'Clicks',                 ja:'クリック数',           zh:'点击次数',      es:'Clics',                   pt:'Cliques' },
    adv_ctr:           { ko:'클릭률',             en:'CTR',                    ja:'クリック率',           zh:'点击率',        es:'CTR',                     pt:'CTR' },
    adv_budget:        { ko:'예산',               en:'Budget',                 ja:'予算',                zh:'预算',          es:'Presupuesto',              pt:'Orçamento' },
    adv_spent:         { ko:'지출',               en:'Spent',                  ja:'支出',                zh:'已花费',        es:'Gastado',                 pt:'Gasto' },
    adv_remaining:     { ko:'남은 예산',          en:'Remaining',              ja:'残り予算',             zh:'剩余预算',      es:'Restante',                pt:'Restante' },
    adv_status:        { ko:'상태',               en:'Status',                 ja:'ステータス',           zh:'状态',          es:'Estado',                  pt:'Status' },
    adv_active:        { ko:'진행 중',            en:'Active',                 ja:'進行中',              zh:'进行中',        es:'Activo',                  pt:'Ativo' },
    adv_paused:        { ko:'일시 정지',          en:'Paused',                 ja:'一時停止',             zh:'已暂停',        es:'Pausado',                 pt:'Pausado' },
    adv_ended:         { ko:'종료',               en:'Ended',                  ja:'終了',                zh:'已结束',        es:'Finalizado',              pt:'Encerrado' },
    adv_upload:        { ko:'광고 소재 업로드',   en:'Upload Creative',         ja:'クリエイティブをアップロード', zh:'上传广告素材', es:'Subir creativo',       pt:'Enviar criativo' },
    adv_target:        { ko:'타겟 설정',          en:'Targeting',              ja:'ターゲティング',       zh:'定向设置',      es:'Segmentación',            pt:'Segmentação' },
    adv_schedule:      { ko:'일정 설정',          en:'Schedule',               ja:'スケジュール設定',     zh:'时间设置',      es:'Programación',            pt:'Agendamento' },
    adv_report:        { ko:'성과 리포트',        en:'Performance Report',     ja:'パフォーマンスレポート', zh:'效果报告',   es:'Informe de rendimiento',  pt:'Relatório de desempenho' },
    adv_type_banner:   { ko:'배너 광고',          en:'Banner Ad',              ja:'バナー広告',           zh:'横幅广告',      es:'Anuncio de banner',       pt:'Anúncio banner' },
    adv_type_audio:    { ko:'오디오 광고',        en:'Audio Ad',               ja:'オーディオ広告',       zh:'音频广告',      es:'Anuncio de audio',        pt:'Anúncio de áudio' },
    adv_type_video:    { ko:'영상 광고',          en:'Video Ad',               ja:'動画広告',             zh:'视频广告',      es:'Anuncio de video',        pt:'Anúncio de vídeo' },
    adv_register:      { ko:'광고주 등록',        en:'Register as Advertiser', ja:'広告主として登録',     zh:'注册为广告主',  es:'Registrarse como anunciante', pt:'Registrar como anunciante' },
    adv_company:       { ko:'회사/브랜드명',      en:'Company / Brand Name',   ja:'会社名 / ブランド名',  zh:'公司/品牌名',   es:'Nombre de empresa/marca', pt:'Nome da empresa/marca' },
    adv_contact:       { ko:'담당자 연락처',      en:'Contact Info',           ja:'担当者連絡先',         zh:'联系方式',      es:'Información de contacto', pt:'Informações de contato' },
    adv_business_no:   { ko:'사업자 등록번호',    en:'Business Registration No.',ja:'事業者登録番号',      zh:'营业执照号',    es:'Número de registro comercial', pt:'Número de registro comercial' },

    // ── 카페방송 (radio.html business) ──
    radio_biz_title:   { ko:'카페 방송 관리',     en:'Café Broadcast Manager', ja:'カフェ放送管理',       zh:'咖啡厅广播管理', es:'Gestor de transmisión de café', pt:'Gerenciador de transmissão do café' },
    radio_biz_desc:    { ko:'SharePlace 음악으로 나만의 카페 분위기를 만드세요', en:'Create your café atmosphere with SharePlace music', ja:'SharePlaceの音楽でカフェの雰囲気を作りましょう', zh:'用SharePlace音乐打造咖啡厅氛围', es:'Crea tu ambiente de café con música de SharePlace', pt:'Crie sua atmosfera de café com música do SharePlace' },
    radio_new_station: { ko:'새 방송국 만들기',   en:'Create New Station',    ja:'新しい放送局を作成',   zh:'创建新电台',    es:'Crear nueva estación',    pt:'Criar nova estação' },
    radio_my_stations: { ko:'내 방송국',          en:'My Stations',           ja:'マイステーション',     zh:'我的电台',      es:'Mis estaciones',          pt:'Minhas estações' },
    radio_station_name:{ ko:'방송국 이름',        en:'Station Name',          ja:'放送局名',             zh:'电台名称',      es:'Nombre de estación',      pt:'Nome da estação' },
    radio_concept:     { ko:'방송 컨셉',          en:'Broadcast Concept',     ja:'放送コンセプト',       zh:'广播概念',      es:'Concepto de transmisión', pt:'Conceito de transmissão' },
    radio_playlist:    { ko:'플레이리스트',       en:'Playlist',              ja:'プレイリスト',         zh:'播放列表',      es:'Lista de reproducción',   pt:'Lista de reprodução' },
    radio_go_live:     { ko:'방송 시작',          en:'Go Live',               ja:'放送開始',             zh:'开始直播',      es:'Ir al aire',              pt:'Ir ao vivo' },
    radio_on_air:      { ko:'방송 중',            en:'ON AIR',                ja:'放送中',               zh:'直播中',        es:'EN EL AIRE',              pt:'NO AR' },
    radio_off_air:     { ko:'방송 종료',          en:'Off Air',               ja:'放送終了',             zh:'下播',          es:'Fuera del aire',          pt:'Fora do ar' },
    radio_listeners:   { ko:'청취자',             en:'Listeners',             ja:'リスナー',             zh:'听众',          es:'Oyentes',                 pt:'Ouvintes' },
    radio_add_track:   { ko:'SharePlace에서 추가', en:'Add from SharePlace',  ja:'SharePlaceから追加',   zh:'从SharePlace添加', es:'Agregar desde SharePlace', pt:'Adicionar do SharePlace' },
    radio_schedule:    { ko:'방송 일정',          en:'Broadcast Schedule',    ja:'放送スケジュール',     zh:'广播时间表',    es:'Horario de transmisión',  pt:'Horário de transmissão' },
    radio_mood_select: { ko:'분위기 선택',        en:'Select Mood',           ja:'雰囲気を選択',         zh:'选择氛围',      es:'Seleccionar ambiente',    pt:'Selecionar ambiente' },
    radio_biz_only:    { ko:'사업자 전용 서비스입니다. 사업자로 가입해주세요.', en:'This is a business-only service. Please sign up as a business.', ja:'このサービスは事業者専用です。事業者として登録してください。', zh:'此服务仅供企业使用。请以企业身份注册。', es:'Este servicio es solo para empresas.', pt:'Este serviço é apenas para empresas.' },
    radio_plan:        { ko:'구독 플랜',          en:'Subscription Plan',     ja:'サブスクリプションプラン', zh:'订阅计划',   es:'Plan de suscripción',     pt:'Plano de assinatura' },
    radio_plan_basic:  { ko:'베이직 (1개 방송국)', en:'Basic (1 Station)',    ja:'ベーシック（1放送局）', zh:'基础版（1个电台）', es:'Básico (1 estación)',  pt:'Básico (1 estação)' },
    radio_plan_pro:    { ko:'프로 (5개 방송국)',   en:'Pro (5 Stations)',      ja:'プロ（5放送局）',      zh:'专业版（5个电台）', es:'Pro (5 estaciones)',   pt:'Pro (5 estações)' },

    // ── Moving Radio (car.html personal) ──
    car_setup:         { ko:'이동 설정',          en:'Motion Setup',          ja:'移動設定',             zh:'出行设置',      es:'Configuración de movimiento', pt:'Configuração de movimento' },
    car_activity:      { ko:'활동 유형',          en:'Activity Type',         ja:'アクティビティタイプ', zh:'活动类型',      es:'Tipo de actividad',       pt:'Tipo de atividade' },
    car_drive:         { ko:'🚗 드라이브',        en:'🚗 Drive',              ja:'🚗 ドライブ',          zh:'🚗 驾车',       es:'🚗 Conducir',             pt:'🚗 Dirigir' },
    car_walk_act:      { ko:'🚶 걷기',            en:'🚶 Walk',               ja:'🚶 ウォーキング',      zh:'🚶 步行',       es:'🚶 Caminar',              pt:'🚶 Caminhar' },
    car_run:           { ko:'🏃 러닝',            en:'🏃 Running',            ja:'🏃 ランニング',        zh:'🏃 跑步',       es:'🏃 Correr',               pt:'🏃 Correr' },
    car_cycle:         { ko:'🚴 자전거',          en:'🚴 Cycling',            ja:'🚴 サイクリング',      zh:'🚴 骑行',       es:'🚴 Ciclismo',             pt:'🚴 Ciclismo' },
    car_bpm_auto:      { ko:'BPM 자동 맞춤',      en:'Auto BPM Match',        ja:'BPM自動マッチング',    zh:'自动BPM匹配',   es:'Ajuste automático de BPM', pt:'Ajuste automático de BPM' },
    car_my_route:      { ko:'내 루트 저장',       en:'Save My Route',         ja:'ルートを保存',         zh:'保存我的路线',  es:'Guardar mi ruta',         pt:'Salvar minha rota' },
    car_shareplace:    { ko:'SharePlace에서 선택', en:'Choose from SharePlace', ja:'SharePlaceから選択',  zh:'从SharePlace选择', es:'Elegir desde SharePlace', pt:'Escolher do SharePlace' },
    car_autoplay:      { ko:'자동 재생',          en:'Auto Play',             ja:'自動再生',             zh:'自动播放',      es:'Reproducción automática', pt:'Reprodução automática' },
    car_queue_title:   { ko:'재생 대기열',        en:'Play Queue',            ja:'再生キュー',           zh:'播放队列',      es:'Cola de reproducción',    pt:'Fila de reprodução' },
    car_no_signal:     { ko:'신호 없음 시 재생 유지', en:'Keep playing without signal', ja:'信号なし時再生維持', zh:'无信号时保持播放', es:'Mantener reproducción sin señal', pt:'Manter reprodução sem sinal' },
    car_crossfade:     { ko:'크로스페이드',       en:'Crossfade',             ja:'クロスフェード',       zh:'交叉淡入淡出',  es:'Fundido cruzado',         pt:'Crossfade' },
    car_saved_routes:  { ko:'저장된 루트',        en:'Saved Routes',          ja:'保存済みルート',       zh:'已保存路线',    es:'Rutas guardadas',         pt:'Rotas salvas' },
    car_add_to_queue:  { ko:'대기열에 추가',      en:'Add to Queue',          ja:'キューに追加',         zh:'添加到队列',    es:'Agregar a la cola',       pt:'Adicionar à fila' },

    // ── 관리자 수익 (admin.html) ──
    admin_revenue:     { ko:'매출 현황',          en:'Revenue Dashboard',     ja:'売上ダッシュボード',   zh:'收入仪表板',    es:'Panel de ingresos',       pt:'Painel de receita' },
    admin_total_rev:   { ko:'총 매출',            en:'Total Revenue',         ja:'総売上',              zh:'总收入',        es:'Ingresos totales',        pt:'Receita total' },
    admin_ad_rev:      { ko:'광고 수익',          en:'Ad Revenue',            ja:'広告収益',             zh:'广告收入',      es:'Ingresos publicitarios',  pt:'Receita publicitária' },
    admin_sub_rev:     { ko:'구독 수익',          en:'Subscription Revenue',  ja:'サブスク収益',         zh:'订阅收入',      es:'Ingresos por suscripción', pt:'Receita de assinatura' },
    admin_tl_rev:      { ko:'TL 충전 수익',       en:'TL Charge Revenue',     ja:'TLチャージ収益',       zh:'TL充值收入',    es:'Ingresos por recarga TL', pt:'Receita de recarga TL' },
    admin_payout:      { ko:'크리에이터 지급',    en:'Creator Payouts',       ja:'クリエイター支払い',   zh:'创作者支出',    es:'Pagos a creadores',       pt:'Pagamentos a criadores' },
    admin_profit:      { ko:'순이익',             en:'Net Profit',            ja:'純利益',              zh:'净利润',        es:'Beneficio neto',          pt:'Lucro líquido' },
    admin_mtd:         { ko:'이번 달',            en:'Month to Date',         ja:'今月累計',             zh:'本月累计',      es:'Mes hasta la fecha',      pt:'Mês até a data' },
    admin_ytd:         { ko:'올해 누계',          en:'Year to Date',          ja:'今年累計',             zh:'今年累计',      es:'Año hasta la fecha',      pt:'Ano até a data' },
    admin_advertisers: { ko:'광고주 관리',        en:'Advertiser Management', ja:'広告主管理',           zh:'广告主管理',    es:'Gestión de anunciantes',  pt:'Gestão de anunciantes' },
    admin_stations:    { ko:'방송국 관리',        en:'Station Management',    ja:'放送局管理',           zh:'电台管理',      es:'Gestión de estaciones',   pt:'Gestão de estações' },
    admin_approve:     { ko:'승인',               en:'Approve',               ja:'承認',                zh:'审批',          es:'Aprobar',                 pt:'Aprovar' },
    admin_reject:      { ko:'거절',               en:'Reject',                ja:'拒否',                zh:'拒绝',          es:'Rechazar',                pt:'Rejeitar' },
    admin_suspend:     { ko:'정지',               en:'Suspend',               ja:'停止',                zh:'暂停',          es:'Suspender',               pt:'Suspender' },
    admin_sales_log:   { ko:'거래 내역',          en:'Transaction Log',       ja:'取引履歴',             zh:'交易记录',      es:'Registro de transacciones', pt:'Registro de transações' },

    // ── 공통 페이지 제목 ──
    page_terms:      { ko:'이용약관',       en:'Terms of Service',  ja:'利用規約',            zh:'服务条款',    es:'Términos de servicio', pt:'Termos de serviço' },
    page_privacy:    { ko:'개인정보처리방침', en:'Privacy Policy',   ja:'プライバシーポリシー', zh:'隐私政策',    es:'Política de privacidad', pt:'Política de privacidade' },
    page_copyright:  { ko:'저작권 정책',    en:'Copyright Policy',  ja:'著作権ポリシー',       zh:'版权政策',    es:'Política de derechos de autor', pt:'Política de direitos autorais' },
    page_report:     { ko:'저작권 침해 신고', en:'Report Infringement', ja:'著作権侵害報告',   zh:'举报侵权',    es:'Reportar infracción', pt:'Reportar infração' },
    page_updated:    { ko:'최종 업데이트: 2025년 1월 1일', en:'Last updated: January 1, 2025', ja:'最終更新: 2025年1月1日', zh:'最后更新：2025年1月1日', es:'Última actualización: 1 de enero de 2025', pt:'Última atualização: 1 de janeiro de 2025' },
  },

  detect() {
    const saved = localStorage.getItem('tl_lang');
    if (saved && this.LANGS[saved]) return saved;
    const browser = navigator.language?.slice(0, 2) || 'en';
    const map = { ko:'ko', ja:'ja', zh:'zh', es:'es', pt:'pt' };
    return map[browser] || 'en';
  },

  t(key) {
    const s = this.STRINGS[key];
    if (!s) return key;
    return s[this.lang] || s['ko'] || key;
  },

  setLang(lang) {
    if (!this.LANGS[lang]) return;
    this.lang = lang;
    localStorage.setItem('tl_lang', lang);
    document.documentElement.lang = lang;
    this.applyAll();
    this.updateSelector();
  },

  applyAll() {
    // data-i18n 속성 번역
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const text = this.t(key);
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = text;
      } else if (el.tagName === 'META') {
        el.setAttribute('content', text);
      } else {
        el.textContent = text;
      }
    });
    // data-i18n-title 번역
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      el.title = this.t(el.getAttribute('data-i18n-title'));
    });
    // data-i18n-placeholder 번역
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      el.placeholder = this.t(el.getAttribute('data-i18n-placeholder'));
    });
    // <html lang> 업데이트
    document.documentElement.lang = this.lang;
  },

  updateSelector() {
    const btn = document.getElementById('lang-selector-btn');
    if (btn) {
      btn.textContent = this.LANGS[this.lang].flag + ' ' + this.LANGS[this.lang].label + ' ▾';
    }
  },

  renderSelector(containerId) {
    const c = document.getElementById(containerId);
    if (!c) return;
    c.innerHTML = `
      <div style="position:relative;display:inline-block;">
        <button id="lang-selector-btn" onclick="I18N.toggleLangDropdown(event)" style="
          display:flex;align-items:center;gap:6px;padding:5px 11px;
          background:rgba(139,92,246,0.08);border:1px solid rgba(139,92,246,0.2);
          border-radius:20px;color:inherit;font-size:13px;font-weight:600;cursor:pointer;
          font-family:inherit;white-space:nowrap;
        ">${this.LANGS[this.lang].flag} ${this.LANGS[this.lang].label} ▾</button>
        <div id="lang-dropdown" style="
          display:none;position:absolute;top:calc(100% + 6px);right:0;
          background:white;border:1px solid #e5e7eb;border-radius:12px;
          box-shadow:0 8px 32px rgba(0,0,0,0.12);overflow:hidden;z-index:9999;min-width:150px;
        ">
          ${Object.entries(this.LANGS).map(([code, info]) => `
            <button onclick="I18N.setLang('${code}');I18N.closeLangDropdown()" style="
              display:flex;align-items:center;gap:10px;width:100%;padding:10px 16px;
              background:${code === this.lang ? '#ede9fe' : 'white'};border:none;
              font-size:13px;font-weight:${code === this.lang ? '700' : '500'};
              color:${code === this.lang ? '#7c3aed' : '#374151'};cursor:pointer;
              font-family:inherit;text-align:left;transition:background 0.15s;
            " onmouseover="this.style.background='${code === this.lang ? '#ede9fe' : '#f9fafb'}'"
               onmouseout="this.style.background='${code === this.lang ? '#ede9fe' : 'white'}'"
            >${info.flag} ${info.label}</button>
          `).join('')}
        </div>
      </div>`;
  },

  toggleLangDropdown(e) {
    e.stopPropagation();
    const d = document.getElementById('lang-dropdown');
    if (d) d.style.display = d.style.display === 'none' ? 'block' : 'none';
  },

  closeLangDropdown() {
    const d = document.getElementById('lang-dropdown');
    if (d) d.style.display = 'none';
  },

  init() {
    this.lang = this.detect();
    document.addEventListener('click', () => this.closeLangDropdown());
    this.applyAll();
  }
};

document.addEventListener('DOMContentLoaded', () => I18N.init());
