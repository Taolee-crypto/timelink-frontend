// ============================================================
// i18n.js — TimeLink 다국어 엔진 v1.0
// 지원 언어: ko / en / ja / zh / es / pt
// ============================================================
const I18N = {
  // 현재 언어
  lang: null,

  // 지원 언어 목록
  LANGS: {
    ko: { label: '한국어', flag: '🇰🇷' },
    en: { label: 'English', flag: '🇺🇸' },
    ja: { label: '日本語', flag: '🇯🇵' },
    zh: { label: '中文', flag: '🇨🇳' },
    es: { label: 'Español', flag: '🇪🇸' },
    pt: { label: 'Português', flag: '🇧🇷' },
  },

  // 번역 데이터
  STRINGS: {
    // ── 네비게이션 ──
    nav_home:       { ko:'홈', en:'Home', ja:'ホーム', zh:'首页', es:'Inicio', pt:'Início' },
    nav_shareplace: { ko:'SharePlace', en:'SharePlace', ja:'SharePlace', zh:'分享广场', es:'SharePlace', pt:'SharePlace' },
    nav_library:    { ko:'라이브러리', en:'Library', ja:'ライブラリ', zh:'音乐库', es:'Biblioteca', pt:'Biblioteca' },
    nav_create:     { ko:'업로드', en:'Upload', ja:'アップロード', zh:'上传', es:'Subir', pt:'Enviar' },
    nav_radio:      { ko:'카페방송', en:'Cafe Radio', ja:'カフェ放送', zh:'咖啡广播', es:'Radio Café', pt:'Rádio Café' },
    nav_car:        { ko:'Moving Radio', en:'Moving Radio', ja:'ムービングラジオ', zh:'移动电台', es:'Radio Móvil', pt:'Rádio Móvel' },
    nav_ads:        { ko:'광고', en:'Ads', ja:'広告', zh:'广告', es:'Anuncios', pt:'Anúncios' },
    nav_wallet:     { ko:'지갑', en:'Wallet', ja:'ウォレット', zh:'钱包', es:'Billetera', pt:'Carteira' },
    nav_chart:      { ko:'차트', en:'Charts', ja:'チャート', zh:'排行榜', es:'Gráficos', pt:'Gráficos' },
    nav_dashboard:  { ko:'대시보드', en:'Dashboard', ja:'ダッシュボード', zh:'仪表板', es:'Panel', pt:'Painel' },
    nav_login:      { ko:'로그인', en:'Log In', ja:'ログイン', zh:'登录', es:'Iniciar sesión', pt:'Entrar' },
    nav_signup:     { ko:'무료 시작', en:'Start Free', ja:'無料で始める', zh:'免费开始', es:'Empezar gratis', pt:'Começar grátis' },
    nav_logout:     { ko:'로그아웃', en:'Log Out', ja:'ログアウト', zh:'退出', es:'Cerrar sesión', pt:'Sair' },
    nav_charge:     { ko:'TL 충전', en:'Charge TL', ja:'TL チャージ', zh:'充值 TL', es:'Recargar TL', pt:'Recarregar TL' },

    // ── 공통 버튼 ──
    btn_play:       { ko:'재생', en:'Play', ja:'再生', zh:'播放', es:'Reproducir', pt:'Reproduzir' },
    btn_upload:     { ko:'업로드', en:'Upload', ja:'アップロード', zh:'上传', es:'Subir', pt:'Enviar' },
    btn_download:   { ko:'다운로드', en:'Download', ja:'ダウンロード', zh:'下载', es:'Descargar', pt:'Baixar' },
    btn_share:      { ko:'공유', en:'Share', ja:'シェア', zh:'分享', es:'Compartir', pt:'Compartilhar' },
    btn_buy:        { ko:'구매', en:'Buy', ja:'購入', zh:'购买', es:'Comprar', pt:'Comprar' },
    btn_cancel:     { ko:'취소', en:'Cancel', ja:'キャンセル', zh:'取消', es:'Cancelar', pt:'Cancelar' },
    btn_confirm:    { ko:'확인', en:'Confirm', ja:'確認', zh:'确认', es:'Confirmar', pt:'Confirmar' },
    btn_save:       { ko:'저장', en:'Save', ja:'保存', zh:'保存', es:'Guardar', pt:'Salvar' },
    btn_edit:       { ko:'수정', en:'Edit', ja:'編集', zh:'编辑', es:'Editar', pt:'Editar' },
    btn_delete:     { ko:'삭제', en:'Delete', ja:'削除', zh:'删除', es:'Eliminar', pt:'Excluir' },
    btn_close:      { ko:'닫기', en:'Close', ja:'閉じる', zh:'关闭', es:'Cerrar', pt:'Fechar' },

    // ── index.html ──
    hero_title:     { ko:'음악을 만들고\n수익을 받으세요', en:'Create Music\nGet Paid', ja:'音楽を作って\n収益を得よう', zh:'创作音乐\n获得收益', es:'Crea Música\nGana Dinero', pt:'Crie Música\nGanhe Dinheiro' },
    hero_sub:       { ko:'1초 재생 = 1 TL = 1원. 창작자 중심의 새로운 음악 경제', en:'1 second = 1 TL = ₩1. A new creator-first music economy', ja:'1秒再生 = 1 TL。クリエイター中心の新しい音楽経済', zh:'播放1秒 = 1 TL。以创作者为中心的新音乐经济', es:'1 segundo = 1 TL. Una nueva economía musical centrada en creadores', pt:'1 segundo = 1 TL. Uma nova economia musical centrada em criadores' },
    hero_cta1:      { ko:'무료로 시작하기', en:'Start for Free', ja:'無料で始める', zh:'免费开始', es:'Comenzar gratis', pt:'Começar grátis' },
    hero_cta2:      { ko:'음악 탐색하기', en:'Explore Music', ja:'音楽を探す', zh:'探索音乐', es:'Explorar música', pt:'Explorar música' },

    // ── TL 경제 ──
    tl_earn_rate:   { ko:'1초 시청 = 2 TL 보상', en:'1 sec watch = 2 TL reward', ja:'1秒視聴 = 2 TL報酬', zh:'观看1秒 = 2 TL奖励', es:'1 seg visto = 2 TL de recompensa', pt:'1 seg assistido = 2 TL de recompensa' },
    tl_play_rate:   { ko:'1초 재생 = 1 TL 소모', en:'1 sec play = 1 TL spent', ja:'1秒再生 = 1 TL消費', zh:'播放1秒 = 1 TL消耗', es:'1 seg = 1 TL gastado', pt:'1 seg = 1 TL gasto' },
    tl_daily_limit: { ko:'하루 최대 5,000 TL', en:'Max 5,000 TL/day', ja:'1日最大5,000 TL', zh:'每日最多5,000 TL', es:'Máx. 5.000 TL/día', pt:'Máx. 5.000 TL/dia' },
    tl_min_withdraw:{ ko:'최소 출금 10,000 TL', en:'Min. withdrawal 10,000 TL', ja:'最低出金10,000 TL', zh:'最低提现10,000 TL', es:'Retiro mín. 10.000 TL', pt:'Saque mín. 10.000 TL' },

    // ── 공지 ──
    notice_economy: { ko:'TL 경제 시스템 v1.0 적용', en:'TL Economy System v1.0 Live', ja:'TL経済システム v1.0 稼働', zh:'TL经济系统 v1.0 上线', es:'Sistema TL Economy v1.0 activo', pt:'Sistema TL Economy v1.0 ativo' },
    notice_poc:     { ko:'POC 채굴 알고리즘 가동', en:'POC Mining Algorithm Active', ja:'POCマイニング開始', zh:'POC挖矿算法启动', es:'Algoritmo POC activo', pt:'Algoritmo POC ativo' },

    // ── 광고 ──
    ad_video:       { ko:'영상 광고', en:'Video Ad', ja:'動画広告', zh:'视频广告', es:'Anuncio de video', pt:'Anúncio de vídeo' },
    ad_audio:       { ko:'오디오 광고', en:'Audio Ad', ja:'音声広告', zh:'音频广告', es:'Anuncio de audio', pt:'Anúncio de áudio' },
    ad_watch:       { ko:'시청하기', en:'Watch', ja:'視聴する', zh:'观看', es:'Ver', pt:'Assistir' },
    ad_nationwide:  { ko:'전국', en:'Nationwide', ja:'全国', zh:'全国', es:'Nacional', pt:'Nacional' },
    ad_local:       { ko:'지역', en:'Local', ja:'地域', zh:'地区', es:'Local', pt:'Local' },

    // ── 창작자 ──
    creator_revenue: { ko:'창작자 수익', en:'Creator Revenue', ja:'クリエイター収益', zh:'创作者收益', es:'Ingresos del creador', pt:'Receita do criador' },
    plan_a:          { ko:'즉시 정산형 (Plan A)', en:'Instant Payout (Plan A)', ja:'即時精算型 (Plan A)', zh:'即时结算 (Plan A)', es:'Pago inmediato (Plan A)', pt:'Pagamento imediato (Plan A)' },
    plan_b:          { ko:'TLC 채굴형 (Plan B)', en:'TLC Mining (Plan B)', ja:'TLCマイニング型 (Plan B)', zh:'TLC挖矿型 (Plan B)', es:'Minería TLC (Plan B)', pt:'Mineração TLC (Plan B)' },

    // ── 페이지 제목 ──
    page_about:      { ko:'회사 소개', en:'About Us', ja:'会社紹介', zh:'关于我们', es:'Acerca de', pt:'Sobre nós' },
    page_pricing:    { ko:'요금제', en:'Pricing', ja:'料金プラン', zh:'价格方案', es:'Precios', pt:'Preços' },
    page_faq:        { ko:'자주 묻는 질문', en:'FAQ', ja:'よくある質問', zh:'常见问题', es:'Preguntas frecuentes', pt:'Perguntas frequentes' },
    page_terms:      { ko:'이용약관', en:'Terms of Service', ja:'利用規約', zh:'服务条款', es:'Términos de servicio', pt:'Termos de serviço' },
    page_privacy:    { ko:'개인정보처리방침', en:'Privacy Policy', ja:'プライバシーポリシー', zh:'隐私政策', es:'Política de privacidad', pt:'Política de privacidade' },
    page_copyright:  { ko:'저작권 정책', en:'Copyright Policy', ja:'著作権ポリシー', zh:'版权政策', es:'Política de derechos de autor', pt:'Política de direitos autorais' },
    page_tokenomics: { ko:'토큰 경제', en:'Tokenomics', ja:'トークンエコノミー', zh:'代币经济', es:'Tokenomía', pt:'Tokenomia' },
    page_roadmap:    { ko:'로드맵', en:'Roadmap', ja:'ロードマップ', zh:'路线图', es:'Hoja de ruta', pt:'Roteiro' },
  },

  // 언어 감지
  detect() {
    const saved = localStorage.getItem('tl_lang');
    if (saved && this.LANGS[saved]) return saved;
    const browser = navigator.language?.slice(0, 2) || 'en';
    const map = { ko:'ko', ja:'ja', zh:'zh', es:'es', pt:'pt' };
    return map[browser] || 'en';
  },

  // 번역 가져오기
  t(key) {
    const s = this.STRINGS[key];
    if (!s) return key;
    return s[this.lang] || s['en'] || key;
  },

  // 언어 변경
  setLang(lang) {
    if (!this.LANGS[lang]) return;
    this.lang = lang;
    localStorage.setItem('tl_lang', lang);
    this.applyAll();
    document.documentElement.lang = lang;
  },

  // data-i18n 속성 전체 적용
  applyAll() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const text = this.t(key);
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
        el.placeholder = text;
      } else {
        el.textContent = text;
      }
    });
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      el.title = this.t(el.getAttribute('data-i18n-title'));
    });
    // 언어 선택기 업데이트
    const btn = document.getElementById('lang-selector-btn');
    if (btn) btn.textContent = this.LANGS[this.lang].flag + ' ' + this.LANGS[this.lang].label;
  },

  // 언어 선택기 드롭다운 렌더링
  renderSelector(containerId) {
    const c = document.getElementById(containerId);
    if (!c) return;
    c.innerHTML = `
      <div style="position:relative;display:inline-block;">
        <button id="lang-selector-btn" onclick="I18N.toggleDropdown()" style="
          display:flex;align-items:center;gap:6px;padding:6px 12px;
          background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2);
          border-radius:20px;color:inherit;font-size:13px;font-weight:600;cursor:pointer;
          font-family:inherit;backdrop-filter:blur(4px);
        ">${this.LANGS[this.lang].flag} ${this.LANGS[this.lang].label} ▾</button>
        <div id="lang-dropdown" style="
          display:none;position:absolute;top:calc(100% + 8px);right:0;
          background:white;border:1px solid #e5e7eb;border-radius:12px;
          box-shadow:0 8px 32px rgba(0,0,0,0.12);overflow:hidden;z-index:9999;min-width:160px;
        ">
          ${Object.entries(this.LANGS).map(([code, info]) => `
            <button onclick="I18N.setLang('${code}');I18N.closeDropdown()" style="
              display:flex;align-items:center;gap:10px;width:100%;padding:10px 16px;
              background:${code === this.lang ? '#ede9fe' : 'white'};border:none;
              font-size:13px;font-weight:${code === this.lang ? '700' : '500'};
              color:${code === this.lang ? '#7c3aed' : '#374151'};cursor:pointer;
              font-family:inherit;text-align:left;
            ">${info.flag} ${info.label}</button>
          `).join('')}
        </div>
      </div>`;
  },

  toggleDropdown() {
    const d = document.getElementById('lang-dropdown');
    if (d) d.style.display = d.style.display === 'none' ? 'block' : 'none';
  },

  closeDropdown() {
    const d = document.getElementById('lang-dropdown');
    if (d) d.style.display = 'none';
  },

  // 초기화
  init() {
    this.lang = this.detect();
    document.addEventListener('click', e => {
      if (!e.target.closest('#lang-selector-btn')) this.closeDropdown();
    });
    this.applyAll();
  }
};

// 자동 초기화
document.addEventListener('DOMContentLoaded', () => I18N.init());
