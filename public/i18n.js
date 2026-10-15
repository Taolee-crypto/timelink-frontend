/* TimeLink global EN/KR switch. Shared preference, dynamic DOM support. */
(function(){
'use strict';
if(window.__TL_I18N__)return;window.__TL_I18N__=true;
var ko={
'로그인':'Login','회원가입':'Sign up','다시 오셨군요':'Welcome back','계속 Pulse를 쌓아보세요':'Keep building your Pulse',
'이메일':'Email','비밀번호':'Password','비밀번호를 잊으셨나요?':'Forgot password?','또는':'OR','TON Wallet 연결':'Connect TON Wallet',
'계정이 없으신가요?':'Don’t have an account?','무료 가입':'Sign up free','계정 만들기':'Create account',
'몇 초면 TimeLink를 시작할 수 있어요.':'Start using TimeLink in seconds.','비밀번호 확인':'Confirm password','닉네임':'Display name',
'가입하고 시작하기':'Create account and continue','이미 계정이 있으신가요?':'Already have an account?','인증 완료':'Verified','코드 재발송':'Resend code',
'확인':'Confirm','취소':'Cancel','닫기':'Close','저장':'Save','수정':'Edit','삭제':'Delete','완료':'Done','다음':'Next','이전':'Back','검색':'Search','필터':'Filter','적용':'Apply','더 보기':'See more','로그아웃':'Log out',
'대시보드':'Dashboard','홈':'Home','지갑':'Wallet','TLC 채굴':'TLC Mining','내 콘텐츠':'My Assets','미션':'Missions','바로가기':'Quick Links',
'TL방송국':'TimeLink Radio','크리에이터 센터':'Creator Studio','카페 채널':'Cafe Channels','TL 잔액':'TL Balance','소비용 토큰':'Usage Token',
'TLC 보유량':'TLC Balance','거래용 토큰':'Exchange Token','오늘 POC':'Today’s POC','기여 점수':'Contribution Score','업로드한 파일':'Uploaded Assets',
'파일 업로드':'Upload Asset','방송 청취':'Listen to Broadcast','카페방송':'Cafe Broadcast','TL 총 잔액':'Total TL Balance','+ TL 충전':'+ Add TL',
'채굴 현황':'Mining Status','오늘 POC 점수':'Today’s POC Score','누적 TLC 채굴량':'Total TLC Mined','POC 기여 지수':'POC Contribution Index',
'채굴 내역':'Mining History','로딩 중...':'Loading…','전체 파일':'All Assets','총 재생 수':'Total Plays','수익 TL':'Reward (TL)','총 Pulse':'Total Pulse',
'새 파일 업로드':'Upload New Asset','전체 선택':'Select All','선택 삭제':'Delete Selected','방송 시작':'Start Broadcast','방송 중인 곡':'Now Playing',
'전체 보기 →':'View all →','최신순':'Latest','인기순':'Popular','전체 자산':'All Assets','음악':'Music','영상':'Video','문서':'Documents',
'TL 충전':'Add TL','결제하기':'Pay','결제 금액':'Payment Amount','지급 TL':'TL to Receive','현재 잔액':'Current Balance','거래내역':'Transactions',
'내역':'History','복사':'Copy','제목':'Title','아티스트':'Artist','앨범':'Album','장르':'Genre','설명':'Description','공개 범위 설정':'Set Visibility',
'공개 범위':'Visibility','공개 방식':'Sharing Method','권리 확인':'Rights Verification','권리보호형':'Rights Protected',
'창작권 증명 신청':'Apply for Creator Rights Certificate','발행':'Issue','발행 수수료':'Issuance Fee','정지':'Stop','재생':'Play','일시정지':'Pause',
'공유하기':'Share','링크 복사':'Copy Link','플레이리스트에 추가':'Add to Playlist','새 플레이리스트 만들기':'Create Playlist','악보':'Sheet Music',
'사용시간에 따라 보상이 산정됩니다':'Rewards are calculated based on usage time','시간을 충전하고, 사용한 만큼만 지불합니다.':'Add time and pay only for what you use.',
'10시간 TL 충전':'Add 10 hours of TL','40분 사용':'40 minutes used','사용 측정 · 차감':'Usage measured · deducted','9시간 20분 남음':'9 hours 20 minutes remaining',
'창작자 정산':'Creator settlement','하나의 Core Engine에 형식별 Adapter-Viewer만 추가합니다.':'One Core Engine with format-specific adapters and viewers.',
'음악 자산 등록 및 관리':'Register and manage music assets','TL3 공유 조건 직접 설정':'Set TL3 sharing terms','사용시간 기반 정산':'Usage-time-based rewards',
'카페방송 B2B':'B2B cafe broadcasting','지금 공유되는 음악':'Music shared now','창작자가 공유한 음악 자산과 트랙을 살펴보세요.':'Explore music assets and tracks shared by creators.',
'음악 자산을 불러오는 중...':'Loading music assets…','모든 음악 자산 보기 →':'Explore all music assets →',
'☕ 카페를 위한 24시간 라디오':'☕ 24/7 Radio for Cafes',
'카페 전용 채널에서 직접 곡을 고르거나 자동으로 음악이 흐릅니다. 사장님은 음악을 신경 쓸 필요가 없습니다.':'Choose tracks for your cafe channel or let music play automatically. No need to manage the music yourself.',
'카페 시작하기':'Get Started','유료화를 강요하지 않습니다':'Monetization is your choice','창작자가 공개 범위와 공유 조건, 권리 정책을 직접 결정합니다.':'Creators control visibility, sharing terms, and rights policies.',
'공개 범위 설정':'Set Visibility','작품의 공개 범위와 공유 대상을 창작자가 직접 설정합니다.':'Creators choose who can see and access their work.',
'기여와 보상 연결':'Contribution and Rewards','자산 이용과 생태계 기여가 기록되고 정해진 기준에 따라 보상으로 연결됩니다.':'Asset usage and ecosystem contributions are recorded and rewarded under defined rules.',
'사용조건·권리정책을 설정하고 디지털 자산의 이용을 관리합니다.':'Set usage terms and rights policies to manage access to digital assets.',
'플랫폼에 대한 기여를 경제적으로 측정합니다.':'Measure contributions to the platform economically.','콘텐츠 측면':'Content Contributions',
'콘텐츠 제작 · 등록':'Create · Register Content','콘텐츠 이용':'Use Content','추천 · 공유':'Recommend · Share','신규 사용자 유입':'Bring in New Users',
'생태계 측면':'Ecosystem Contributions','큐레이션 · 검증':'Curation · Verification','커뮤니티 · 창작자 지원':'Community · Creator Support',
'플랫폼 활성화':'Platform Growth','기여 측정 → Index → TLC':'Contribution Measurement → Index → TLC','콘텐츠 제작':'Content Creation',
'추천·공유':'Recommend · Share','POC 측정':'POC Measurement','Index 산출':'Calculate Index','TLC 보상':'TLC Rewards',
'사용·수익 데이터 기반 예측':'Usage and Reward Data Forecasting','콘텐츠 데이터':'Content Data','사용 데이터':'Usage Data','수익 데이터':'Reward Data',
'AI 예측':'AI Forecasting','금융 연계':'Financial Integration','디지털 자산을 공유하고':'Share Digital Assets','사용 권한을 관리합니다':'Manage Usage Rights',
'법률':'Legal','연구':'Research','금융':'Finance','기업':'Business','컨설팅':'Consulting','엔지니어링':'Engineering','교육':'Education',
'← 대시보드':'← Dashboard','처리 중...':'Processing…','잠시만 기다려주세요':'Please wait','원본 MP3 선택':'Select Original MP3',
'원본 MP3를 여기에 놓으세요':'Drop the original MP3 here','또는 클릭해서 파일 선택 · 여러 파일 선택 가능':'Or click to select files · Multiple files supported',
'전체 제거':'Remove All','디지털 자산 정보 입력':'Enter Digital Asset Details','초당 차감 TL':'TL deducted per second','보상 정책':'Reward Policy',
'일반 음질':'Standard Quality','원본 그대로 · 무료':'Original quality · Free','장르 (Spotify)':'Genre (Spotify)','선택 안 함':'None selected',
'작곡':'Composer','작사':'Lyricist','프로듀서':'Producer','가사':'Lyrics','증명서 즉시 발행':'Issue Certificate Now','권리 확인':'Rights Verification',
'TL / 월':'TL / month','창작자':'Creator','이용자와 커뮤니티':'Users and Community','오프라인 사업자':'Offline Businesses','기업과 기관':'Enterprises and Institutions',
'공유된 디지털 자산이 여기에 표시됩니다.':'Shared digital assets will appear here.','공유된 음악 자산이 여기에 표시됩니다.':'Shared music assets will appear here.',
'공유 자산을 일시적으로 불러올 수 없습니다.':'Shared assets are temporarily unavailable.','TL 잔량':'TL Remaining','초당 소모':'Per-second Usage',
'⚠️ TL 부족!':'⚠️ Insufficient TL!','TL 충전하기':'Add TL','이용약관':'Terms of Service','개인정보 처리방침':'Privacy Policy','개인정보처리방침':'Privacy Policy',
'크리에이터 정책':'Creator Policy','광고 센터':'Advertising Center','광고주 센터':'Advertiser Center','DJ 가이드':'DJ Guide','서비스':'Services','법적 정보':'Legal',
'내역 보기':'View History','연결':'Connect','연결 해제':'Disconnect','신청':'Apply','신청하기':'Apply Now','상세 보기':'View Details',
'타임링크':'TimeLink','음악 자산':'Music Assets','디지털 자산':'Digital Assets','공유':'Share','보상':'Rewards','기여':'Contribution'
};
var enToKo={
'HOME':'홈','DIGITAL ASSETS':'디지털 자산','CREATOR':'창작자','BROADCAST':'방송','ADVERTISING':'광고','TL ECONOMICS':'TL 경제','MY':'내 정보','ADMIN':'관리자',
'Overview':'개요','SharePlace':'공유 공간','My Library':'내 라이브러리','TL3 Player':'TL3 플레이어','TLJ Viewer':'TLJ 뷰어','Track':'트랙',
'Creator Profile':'창작자 프로필','Creator Studio':'창작자 스튜디오','TL Broadcast':'TL 방송국','DJ Center':'DJ 센터','Cafe Broadcast':'카페 방송',
'Cafe Management':'카페 관리','In-car':'차량 방송','Advertiser Center':'광고주 센터','Campaigns':'캠페인','TL Wallet':'TL 지갑','POC & TLC':'POC 및 TLC',
'My Dashboard':'내 대시보드','Admin Console':'관리자 콘솔','Login':'로그인','Sign up':'회원가입','Dashboard':'대시보드','Home':'홈','Wallet':'지갑',
'Music':'음악','Video':'영상','Documents':'문서','Search':'검색','Save':'저장','Cancel':'취소','Close':'닫기','Confirm':'확인','Loading…':'로딩 중…',
'Popular':'인기순','Latest':'최신순','Play':'재생','Pause':'일시정지','Stop':'정지','Share':'공유','Upload':'업로드','Delete':'삭제','Edit':'수정',
'Settings':'설정','Log out':'로그아웃','Creator':'창작자','Business':'기업','Legal':'법적 정보','Services':'서비스','Transactions':'거래내역'
};
var originalText=new WeakMap(),originalAttrs=new WeakMap(),lang='ko',busy=false;
function dict(){return lang==='en'?ko:enToKo}
function translateNode(n){
 var v=n.nodeValue,r=originalText.get(n);if(r&&v!==r.last)r=null;if(!r)r={source:v,last:v};
 var key=r.source.trim(),d=dict(),out=d[key]||r.source;
 if(d[key]){var lead=r.source.match(/^\s*/)[0],tail=r.source.match(/\s*$/)[0];out=lead+d[key]+tail;}
 n.nodeValue=out;r.last=out;originalText.set(n,r);
}
function translateAttr(el,a){
 var m=originalAttrs.get(el)||{},r=m[a],v=el.getAttribute(a);if(r&&v!==r.last)r=null;if(!r)r={source:v,last:v};
 var out=dict()[r.source]||r.source;el.setAttribute(a,out);r.last=out;m[a]=r;originalAttrs.set(el,m);
}
function scan(root){
 if(!root)return;var w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode:function(n){var p=n.parentElement;return !p||/^(SCRIPT|STYLE|NOSCRIPT|TEXTAREA|CODE|PRE)$/i.test(p.tagName)||!n.nodeValue.trim()?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT;}}),a=[];
 while(w.nextNode())a.push(w.currentNode);a.forEach(translateNode);
 if(root.querySelectorAll)root.querySelectorAll('[placeholder],[title],[aria-label]').forEach(function(e){['placeholder','title','aria-label'].forEach(function(k){if(e.hasAttribute(k))translateAttr(e,k);});});
}
function setLang(next){
 lang=next==='en'?'en':'ko';document.documentElement.lang=lang;
 try{localStorage.setItem('timelink-language',lang);}catch(e){}
 scan(document.body);document.documentElement.dataset.tlLanguage=lang;
 var en=document.getElementById('tl-lang-en'),kr=document.getElementById('tl-lang-kr');
 if(en&&kr){en.setAttribute('aria-pressed',String(lang==='en'));kr.setAttribute('aria-pressed',String(lang==='ko'));}
}
function mount(){
 if(!document.body||document.getElementById('tl-language-switch'))return;
 var css=document.createElement('style');css.id='tl-language-css';css.textContent='#tl-language-switch{position:fixed;z-index:10050;top:14px;right:18px;display:flex;gap:3px;padding:4px;border:1px solid rgba(255,255,255,.17);border-radius:999px;background:rgba(18,18,24,.95);box-shadow:0 5px 22px rgba(0,0,0,.3);backdrop-filter:blur(14px);font:700 11px/1.2 Inter,Pretendard,sans-serif}#tl-language-switch button{min-width:36px;padding:7px 9px;border:0;border-radius:999px;background:transparent;color:#aaa7b8;font:inherit;cursor:pointer}#tl-language-switch button[aria-pressed=true]{background:#8b6cf0;color:white}#tl-language-switch button:focus-visible{outline:2px solid #f5b84b;outline-offset:2px}body:has(.g-nav) .g-nav-actions{margin-right:105px}@media(max-width:650px){#tl-language-switch{top:10px;right:10px}body:has(.g-nav) #tl-language-switch{top:72px;right:12px}body:has(.g-nav) .g-nav-actions{margin-right:0}}';
 document.head.appendChild(css);var box=document.createElement('div');box.id='tl-language-switch';box.setAttribute('role','group');box.setAttribute('aria-label','Language');
 box.innerHTML='<button type="button" id="tl-lang-en" aria-pressed="false">EN</button><button type="button" id="tl-lang-kr" aria-pressed="true">KR</button>';document.body.appendChild(box);
 box.addEventListener('click',function(e){var b=e.target.closest('button');if(b)setLang(b.id==='tl-lang-en'?'en':'ko');});
 var initial='ko';try{initial=localStorage.getItem('timelink-language')==='en'?'en':'ko';}catch(e){}setLang(initial);
 var observer=new MutationObserver(function(records){if(busy)return;busy=true;Promise.resolve().then(function(){busy=false;records.forEach(function(r){if(r.type==='characterData')translateNode(r.target);(r.addedNodes||[]).forEach(function(n){if(n.nodeType===3)translateNode(n);else if(n.nodeType===1&&n.id!=='tl-language-switch')scan(n);});});});});
 observer.observe(document.body,{subtree:true,childList:true,characterData:true});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
window.TimeLinkLanguage={set:setLang,get:function(){return lang;}};
})();