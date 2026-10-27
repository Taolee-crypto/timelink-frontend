/* One public footer, shared by legacy and renewed screens. */
(()=>{
 'use strict';
 if(window.__TL_SITE_FOOTER__)return;window.__TL_SITE_FOOTER__=true;
 const path=location.pathname,query=new URLSearchParams(location.search);
 if(/\/(?:login|signup|player-host|admin[^/]*)\b/.test(path)||query.get('tl_player')==='1'||document.body?.hasAttribute('data-tl-app-host'))return;
 function mount(){
  if(document.body.hasAttribute('data-tl-app-host'))return;
  if(!document.getElementById('tl-footer-style')){const css=document.createElement('link');css.id='tl-footer-style';css.rel='stylesheet';css.href='/_shared/footer.css?v=20261027b';document.head.append(css);}
  const language=window.TLUI?.lang||localStorage.getItem('tl_lang')||'ko';
  const words={
   ko:['창작활동이 경제활동이 되는 곳.','둘러보기','참여와 비즈니스','TimeLink 소개','공유플레이스','작품 등록','나의 방송','스토어 비즈니스','영업 매니저','광고주 센터','TimeLink 이야기','이용과 가치','플레이어 다운로드','이용약관','개인정보처리방침','창작자 정책','이용·보상 정책','맨 위로','한국 법인'],
   en:['Where creative activity becomes economic activity.','Explore','Create & partner','About TimeLink','SharePlace','Upload your work','My broadcast','Store business','Sales managers','Advertiser center','Our story','Use & value','Download player','Terms of service','Privacy policy','Creator policy','Economy policy','Back to top','Korean subsidiary'],
   ja:['創作活動が経済活動になる場所。','見つける','創作とビジネス','TimeLinkについて','共有マーケット','作品を登録','自分の放送','店舗ビジネス','営業マネージャー','広告主センター','私たちの物語','利用と価値','プレーヤーをダウンロード','利用規約','プライバシーポリシー','クリエイターポリシー','経済ポリシー','トップへ','韓国法人'],
   zh:['让创作活动成为经济活动。','探索','创作与合作','关于TimeLink','共享市场','上传作品','我的广播','商店业务','销售经理','广告主中心','我们的故事','使用与价值','下载播放器','服务条款','隐私政策','创作者政策','经济政策','返回顶部','韩国子公司'],
   th:['พื้นที่ที่การสร้างสรรค์กลายเป็นกิจกรรมทางเศรษฐกิจ','สำรวจ','สร้างสรรค์และธุรกิจ','เกี่ยวกับ TimeLink','ตลาดผลงาน','อัปโหลดผลงาน','การออกอากาศของฉัน','ธุรกิจร้านค้า','ผู้จัดการฝ่ายขาย','ศูนย์ผู้ลงโฆษณา','เรื่องราวของเรา','การใช้งานและคุณค่า','ดาวน์โหลดเครื่องเล่น','เงื่อนไขบริการ','นโยบายความเป็นส่วนตัว','นโยบายผู้สร้าง','นโยบายเศรษฐกิจ','กลับด้านบน','บริษัทในเกาหลี'],
   vi:['Nơi hoạt động sáng tạo trở thành hoạt động kinh tế.','Khám phá','Sáng tạo và hợp tác','Về TimeLink','Chợ chia sẻ','Đăng tác phẩm','Phát thanh của tôi','Kinh doanh cửa hàng','Quản lý kinh doanh','Trung tâm quảng cáo','Câu chuyện của chúng tôi','Sử dụng và giá trị','Tải trình phát','Điều khoản dịch vụ','Chính sách riêng tư','Chính sách nhà sáng tạo','Chính sách kinh tế','Về đầu trang','Công ty tại Hàn Quốc']
  };const t=words[language]||words.ko;
  const link=(href,text)=>{const a=document.createElement('a');a.href=href;a.textContent=text;return a;};
  const element=(tag,className,text)=>{const el=document.createElement(tag);el.className=className;if(text)el.textContent=text;return el;};
  const template=element('div','site-footer-inner'),grid=element('div','site-footer-grid'),brand=element('div','site-footer-brand');
  const logo=link('/timelink.html','TimeLink');logo.className='site-footer-logo';logo.append(element('span','','by TILO'));brand.append(logo,element('p','site-footer-tagline',t[0]));grid.append(brand);
  const groups=[
   [t[1],[['/new-asset.html','New Asset'],['/shareplace.html',t[4]],['/radio.html','Broadcast'],['/world-network.html','World Network']]],
   [t[2],[['/creator.html',t[5]],['/b2b.html',t[7]],['/advertiser.html',t[9]]]],
   [t[3],[['/timelink-story.html',t[10]],['/timelink-economy.html',t[11]],['/download.html',t[12]]]]
  ];
  for(const [title,links] of groups){const nav=element('nav','site-footer-links');nav.setAttribute('aria-label',title);nav.append(element('p','site-footer-label',title));for(const [href,text] of links)nav.append(link(href,text));grid.append(nav);}
  const legal=element('nav','site-footer-legal');legal.setAttribute('aria-label',language==='ko'?'이용정책':'Policies');for(const [href,text] of [['/terms.html',t[13]],['/privacy.html',t[14]],['/creator-policy.html',t[15]],['/economy-policy.html',t[16]]])legal.append(link(href,text));
  const bottom=element('div','site-footer-bottom'),company=element('div','site-footer-company');company.append(element('p','','주식회사 틸로 · TILO'),element('p','',t[18]+' · (주)틸로코리아'),element('small','','© '+new Date().getFullYear()+' TILO. All rights reserved.'));
  const top=element('button','site-footer-top',t[17]+' ↑');top.type='button';top.onclick=()=>window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});bottom.append(company,top);template.append(grid,legal,bottom);
  const old=[...document.querySelectorAll('#tl-dynamic-footer,.gate-footer')];let footer=old.shift();if(!footer){footer=document.createElement('footer');document.body.append(footer);}for(const duplicate of old)duplicate.remove();
  footer.setAttribute('role','contentinfo');footer.id='tl-dynamic-footer';footer.className='site-footer';footer.removeAttribute('style');footer.setAttribute('aria-label',language==='ko'?'TimeLink 서비스 및 회사 안내':'TimeLink information');
  // Legacy screens can finish rendering their former footer asynchronously.
  // Keep this one source of content without observing unrelated page activity.
  const observer=new MutationObserver(render);
  function render(){observer.disconnect();footer.replaceChildren(template);observer.observe(footer,{childList:true});}
  render();
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
})();
