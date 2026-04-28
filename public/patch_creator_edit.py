import sys, re

TARGET = r'C:\Users\win11\Desktop\timelink-frontend\public\creator.html'

with open(TARGET, 'r', encoding='utf-8') as f:
    src = f.read()

# ── 1. CSS 추가 ────────────────────────────────────────────
EDIT_CSS = """
/* ── 편집 모달 ── */
#editOverlay{display:none;position:fixed;inset:0;background:rgba(4,2,12,.97);z-index:9998;overflow-y:auto}
#editOverlay.show{display:block}
.ew{max-width:700px;margin:0 auto;padding:24px 20px 80px}
.eh{display:flex;align-items:center;gap:12px;margin-bottom:24px;padding-bottom:16px;border-bottom:1px solid var(--bd);position:sticky;top:0;background:rgba(4,2,12,.97);z-index:10;padding-top:8px}
.eb{background:transparent;border:1px solid var(--bd);color:var(--t3);padding:7px 14px;border-radius:8px;cursor:pointer;font-size:12px}
.eb:hover{color:var(--t1);border-color:var(--bd2)}
.en{flex:1;min-width:0}
.et{font-size:17px;font-weight:900;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.el{font-size:10px;color:var(--t3);margin-top:2px}
.esb{padding:9px 22px;border:none;border-radius:9px;background:var(--grad);color:#fff;font-size:13px;font-weight:700;cursor:pointer;white-space:nowrap}
.esb:disabled{opacity:.4;cursor:not-allowed}
.es{background:var(--bg3);border:1px solid var(--bd);border-radius:14px;padding:20px;margin-bottom:14px}
.est{font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--t3);font-family:var(--fm);margin-bottom:14px}
.er{display:grid;grid-template-columns:1fr 1fr;gap:11px;margin-bottom:11px}
.er.f{grid-template-columns:1fr}
.eg{display:flex;flex-direction:column;gap:5px}
.elb{font-size:10px;font-weight:700;color:var(--t3);letter-spacing:.05em;font-family:var(--fm)}
.ei{background:rgba(255,255,255,.04);border:1px solid var(--bd2);border-radius:8px;padding:8px 12px;color:var(--t1);font-size:13px;font-family:var(--fn);outline:none;width:100%;transition:border .15s}
.ei:focus{border-color:var(--purple)}
.ei::placeholder{color:var(--t3)}
textarea.ei{resize:vertical;min-height:80px;line-height:1.6}
select.ei{cursor:pointer;appearance:none;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.3)' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 10px center}
.ero{background:rgba(255,255,255,.02);border:1px solid var(--bd);border-radius:8px;padding:8px 12px;color:var(--t3);font-size:11px;font-family:var(--fm);word-break:break-all}
.tag-wrap{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:8px;min-height:28px}
.tag-chip{display:inline-flex;align-items:center;gap:4px;padding:3px 9px;border-radius:16px;background:rgba(139,92,246,.15);border:1px solid rgba(139,92,246,.3);font-size:11px;color:var(--purple)}
.tag-chip button{background:none;border:none;color:var(--t3);cursor:pointer;font-size:12px;padding:0;line-height:1}
.tag-chip button:hover{color:var(--rose)}
.tag-suggest{display:flex;flex-wrap:wrap;gap:5px;margin-top:6px}
.tag-sug{padding:2px 8px;border-radius:12px;border:1px solid var(--bd);background:transparent;color:var(--t3);font-size:11px;cursor:pointer}
.tag-sug:hover{border-color:var(--purple);color:var(--purple)}
.gal-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-top:8px}
.gal-slot{aspect-ratio:1;border-radius:9px;border:2px dashed var(--bd2);background:rgba(255,255,255,.03);display:flex;align-items:center;justify-content:center;cursor:pointer;position:relative;overflow:hidden;font-size:18px;transition:border .2s}
.gal-slot:hover{border-color:var(--purple)}
.gal-slot img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.gal-rm{position:absolute;top:3px;right:3px;background:rgba(0,0,0,.75);border:none;color:#fff;border-radius:50%;width:18px;height:18px;font-size:10px;cursor:pointer;display:none;align-items:center;justify-content:center}
.gal-slot:hover .gal-rm{display:flex}
.lnk-row{display:flex;align-items:center;gap:8px;margin-bottom:8px}
.lnk-ic{width:28px;height:28px;border-radius:7px;display:flex;align-items:center;justify-content:center;font-size:13px;flex-shrink:0}
.edit-toast{position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:var(--mint);color:#000;padding:9px 20px;border-radius:24px;font-size:12px;font-weight:700;opacity:0;transition:opacity .3s;pointer-events:none;z-index:10001}
.edit-toast.show{opacity:1}
@media(max-width:600px){.er{grid-template-columns:1fr}.gal-grid{grid-template-columns:repeat(2,1fr)}}
"""

src = src.replace('</style>', EDIT_CSS + '\n</style>', 1)
print("OK: CSS added")

# ── 2. 내 파일 카드에 수정 버튼 추가 ──────────────────────
OLD_BTN = "'<div class=\"mf-actions\"><button class=\"mf-btn\" onclick=\"location.href=\\'shareplace.html\\'\">보기</button>'+\n        '<button class=\"mf-btn del\" onclick=\"delShare(\\''+[s.id](http://s.id)+'\\',"
if OLD_BTN not in src:
    # 다른 형태로 찾기
    OLD_BTN = "'<div class=\"mf-actions\"><button class=\"mf-btn\" onclick=\"location.href=\\'shareplace.html\\'\">보기</button>'"
    
old_actions = """'<div class="mf-actions"><button class="mf-btn" onclick="location.href=\'shareplace.html\'">보기</button><button class="mf-btn del" onclick="delShare(\''+s.id+'\',\''+escapeHtml(s.title)+'\')">삭제</button></div>"""
new_actions = """'<div class="mf-actions"><button class="mf-btn" onclick="openEdit(\''+s.id+'\')">✏️ 수정</button><button class="mf-btn del" onclick="delShare(\''+s.id+'\',\''+escapeHtml(s.title)+'\')">삭제</button></div>"""

if old_actions not in src:
    print("WARN: button anchor not found — check manually")
else:
    src = src.replace(old_actions, new_actions, 1)
    print("OK: edit button added to file cards")

# ── 3. 모달 HTML 삽입 ─────────────────────────────────────
EDIT_MODAL = """
<!-- ── 창작자 정보 편집 모달 ── -->
<div id="editOverlay">
<div class="ew">
  <div class="eh">
    <button class="eb" onclick="closeEdit()">← 뒤로</button>
    <div class="en">
      <div class="et" id="editTrackName">—</div>
      <div class="el">🔒 곡명은 First-to-File 보호 — 변경 불가</div>
    </div>
    <button class="esb" id="editSaveBtn" onclick="saveEdit()">💾 저장</button>
  </div>

  <!-- 기본 정보 -->
  <div class="es">
    <div class="est">🎵 기본 정보</div>
    <div class="er">
      <div class="eg"><label class="elb">아티스트명</label><input type="text" class="ei" id="eArtist" placeholder="아티스트명"></div>
      <div class="eg"><label class="elb">앨범명</label><input type="text" class="ei" id="eAlbum" placeholder="앨범명"></div>
    </div>
    <div class="er">
      <div class="eg"><label class="elb">장르</label>
        <select class="ei" id="eCategory">
          <option value="K-POP">K-POP</option><option value="Pop">팝</option>
          <option value="Hiphop">힙합</option><option value="Rock">록</option>
          <option value="EDM">EDM</option><option value="Jazz">재즈</option>
          <option value="Classical">클래식</option><option value="AI-Music">AI 음악</option><option value="Music">기타</option>
        </select>
      </div>
      <div class="eg"><label class="elb">조성 (Musical Key)</label><input type="text" class="ei" id="eMusicalKey" placeholder="예: C장조, A단조"></div>
    </div>
    <div class="er f"><div class="eg"><label class="elb">곡 소개</label><textarea class="ei" id="eDescription" rows="3" placeholder="청취자에게 전하고 싶은 소개"></textarea></div></div>
  </div>

  <!-- 이미지 -->
  <div class="es">
    <div class="est">🖼️ 이미지</div>
    <div class="er">
      <div class="eg">
        <label class="elb">커버 이미지</label>
        <div style="display:flex;align-items:center;gap:10px;margin-top:6px">
          <div onclick="document.getElementById('eCoverFile').click()" style="width:64px;height:64px;border-radius:10px;border:2px dashed var(--bd2);background:rgba(255,255,255,.03);display:flex;align-items:center;justify-content:center;cursor:pointer;overflow:hidden;flex-shrink:0">
            <img id="eCoverImg" style="width:100%;height:100%;object-fit:cover;display:none" src=""><span id="eCoverIcon" style="font-size:20px">🖼️</span>
          </div>
          <span style="font-size:11px;color:var(--t3)">클릭하여 교체<br>JPG/PNG/WEBP</span>
        </div>
        <input type="file" id="eCoverFile" style="display:none" accept="image/*" onchange="onEditCover(this)">
      </div>
      <div class="eg">
        <label class="elb">갤러리 이미지 (최대 4장)</label>
        <div class="gal-grid">
          <div class="gal-slot" id="gs0" onclick="clickGal(0)"><img id="gi0" src="" style="display:none"><button class="gal-rm" onclick="rmGal(event,0)">✕</button><span id="gc0">＋</span></div>
          <div class="gal-slot" id="gs1" onclick="clickGal(1)"><img id="gi1" src="" style="display:none"><button class="gal-rm" onclick="rmGal(event,1)">✕</button><span id="gc1">＋</span></div>
          <div class="gal-slot" id="gs2" onclick="clickGal(2)"><img id="gi2" src="" style="display:none"><button class="gal-rm" onclick="rmGal(event,2)">✕</button><span id="gc2">＋</span></div>
          <div class="gal-slot" id="gs3" onclick="clickGal(3)"><img id="gi3" src="" style="display:none"><button class="gal-rm" onclick="rmGal(event,3)">✕</button><span id="gc3">＋</span></div>
        </div>
        <input type="file" id="eGalFile" style="display:none" accept="image/*" onchange="onGalSelected(this)">
      </div>
    </div>
  </div>

  <!-- 창작 이야기 -->
  <div class="es">
    <div class="est">✍️ 창작 이야기</div>
    <div class="er f"><div class="eg"><label class="elb">창작 스토리</label>
      <textarea class="ei" id="eCreationStory" rows="4" placeholder="이 곡을 만들게 된 계기, 영감의 원천, 담고 싶었던 이야기를 자유롭게 써주세요.&#10;예: '어느 새벽 홀로 드라이브하다 문득 떠오른 멜로디로...'"></textarea>
    </div></div>
    <div class="er f"><div class="eg"><label class="elb">제작 노트 <span style="color:var(--t3);font-weight:400">(장비, 환경, 기간 등)</span></label>
      <textarea class="ei" id="eProductionNote" rows="2" placeholder="예: 홈 레코딩 / Logic Pro X / 제작 기간 3주"></textarea>
    </div></div>
  </div>

  <!-- 음악 정보 -->
  <div class="es">
    <div class="est">🎼 음악 정보</div>
    <div class="er">
      <div class="eg"><label class="elb">작곡가</label><input type="text" class="ei" id="eComposer" placeholder="작곡가"></div>
      <div class="eg"><label class="elb">작사가</label><input type="text" class="ei" id="eLyricist" placeholder="작사가"></div>
    </div>
    <div class="er f"><div class="eg"><label class="elb">가사</label>
      <textarea class="ei" id="eLyrics" rows="7" placeholder="[Verse 1]&#10;가사 입력...&#10;&#10;[Chorus]&#10;..."></textarea>
    </div></div>
    <div class="er f"><div class="eg"><label class="elb">크레딧 <span style="color:var(--t3);font-weight:400">(세션, 믹싱, 마스터링 등)</span></label>
      <textarea class="ei" id="eCredits" rows="2" placeholder="기타: 홍길동&#10;드럼: 이순신&#10;믹싱: 장보고"></textarea>
    </div></div>
  </div>

  <!-- 무드 태그 -->
  <div class="es">
    <div class="est">🏷️ 무드 & 태그</div>
    <div class="tag-wrap" id="tagChips"></div>
    <div style="display:flex;gap:8px">
      <input type="text" class="ei" id="tagInput" placeholder="#새벽감성  #드라이브  #힐링" onkeydown="if(event.key==='Enter'){event.preventDefault();addTag()}" style="flex:1">
      <button onclick="addTag()" style="padding:8px 14px;border-radius:8px;border:1px solid var(--bd2);background:transparent;color:var(--t2);font-size:12px;cursor:pointer;white-space:nowrap">+ 추가</button>
    </div>
    <div class="tag-suggest" id="tagSuggest"></div>
  </div>

  <!-- 소셜 링크 -->
  <div class="es">
    <div class="est">🔗 소셜 & 링크</div>
    <div class="lnk-row"><div class="lnk-ic" style="background:rgba(255,0,0,.12)">▶️</div><input type="url" class="ei" id="eYoutube" placeholder="YouTube 링크" style="flex:1"></div>
    <div class="lnk-row"><div class="lnk-ic" style="background:rgba(225,48,108,.12)">📸</div><input type="url" class="ei" id="eInstagram" placeholder="Instagram 링크" style="flex:1"></div>
    <div class="lnk-row"><div class="lnk-ic" style="background:rgba(255,85,0,.12)">☁️</div><input type="url" class="ei" id="eSoundcloud" placeholder="SoundCloud 링크" style="flex:1"></div>
    <div class="lnk-row"><div class="lnk-ic" style="background:rgba(30,215,96,.12)">🎵</div><input type="url" class="ei" id="eSpotify" placeholder="Spotify 링크" style="flex:1"></div>
  </div>

  <!-- 불변 정보 -->
  <div class="es">
    <div class="est">🔒 변경 불가 (First-to-File 보호)</div>
    <div class="er">
      <div class="eg"><label class="elb">곡명 (잠금)</label><div class="ero" id="eLockedTitle">—</div></div>
      <div class="eg"><label class="elb">등록일</label><div class="ero" id="eLockedDate">—</div></div>
    </div>
    <div class="eg" style="margin-top:10px"><label class="elb">원본 해시 (SHA256)</label><div class="ero" id="eLockedHash" style="font-size:10px">—</div></div>
  </div>

  <button class="esb" onclick="saveEdit()" style="width:100%;padding:14px;font-size:15px;margin-top:6px">💾 변경사항 저장</button>
</div>
</div>
<div class="edit-toast" id="editToast">✅ 저장 완료!</div>
"""

src = src.replace('</body>', EDIT_MODAL + '\n</body>', 1)
print("OK: modal HTML added")

# ── 4. JS 추가 ────────────────────────────────────────────
EDIT_JS = """
// ── 편집 모달 JS ──────────────────────────────────────────
var _eid=null,_eCoverFile=null,_eGalFiles=[null,null,null,null],_eGalUrls=['','','',''],_eTags=[],_eGalTarget=0;
var SUGG_TAGS=['#새벽감성','#드라이브','#힐링','#작업할때','#운동할때','#카페','#산책','#비오는날','#봄날','#여름밤','#인디','#어쿠스틱','#R&B','#재즈','#슬플때','#설렐때','#이별','#사랑','#위로','#잠들기전'];

function openEdit(shareId){
  _eid=shareId;_eCoverFile=null;_eGalFiles=[null,null,null,null];_eGalUrls=['','','',''];_eTags=[];
  resetGalUI();
  document.getElementById('editOverlay').classList.add('show');
  document.body.style.overflow='hidden';
  loadEditData(shareId);
  renderSuggTags();
}
function closeEdit(){
  document.getElementById('editOverlay').classList.remove('show');
  document.body.style.overflow='';_eid=null;
}
function resetGalUI(){
  for(var i=0;i<4;i++){
    document.getElementById('gi'+i).style.display='none';
    document.getElementById('gi'+i).src='';
    document.getElementById('gc'+i).style.display='';
  }
}
function setGalSlot(i,url){
  var img=document.getElementById('gi'+i);
  img.src=url;img.style.display='block';
  document.getElementById('gc'+i).style.display='none';
  _eGalUrls[i]=url;
}
function clickGal(i){_eGalTarget=i;document.getElementById('eGalFile').click();}
function onGalSelected(input){
  if(!input.files||!input.files[0])return;
  var i=_eGalTarget;
  _eGalFiles[i]=input.files[0];
  var reader=new FileReader();
  reader.onload=function(e){setGalSlot(i,e.target.result);};
  reader.readAsDataURL(input.files[0]);
  input.value='';
}
function rmGal(e,i){
  e.stopPropagation();
  _eGalFiles[i]=null;_eGalUrls[i]='';
  document.getElementById('gi'+i).style.display='none';
  document.getElementById('gi'+i).src='';
  document.getElementById('gc'+i).style.display='';
}
function onEditCover(input){
  if(!input.files||!input.files[0])return;
  _eCoverFile=input.files[0];
  var reader=new FileReader();
  reader.onload=function(e){
    document.getElementById('eCoverImg').src=e.target.result;
    document.getElementById('eCoverImg').style.display='block';
    document.getElementById('eCoverIcon').style.display='none';
  };
  reader.readAsDataURL(input.files[0]);
}
function renderTags(){
  var wrap=document.getElementById('tagChips');
  wrap.innerHTML=_eTags.map(function(t,i){
    return '<span class="tag-chip">'+escapeHtml(t)+'<button onclick="removeTag('+i+')">✕</button></span>';
  }).join('');
}
function addTag(){
  var inp=document.getElementById('tagInput');
  var val=inp.value.trim().replace(/^#*/,'');
  if(!val)return;
  var tag='#'+val;
  if(!_eTags.includes(tag)&&_eTags.length<15)_eTags.push(tag);
  renderTags();inp.value='';
}
function removeTag(i){_eTags.splice(i,1);renderTags();}
function renderSuggTags(){
  var el=document.getElementById('tagSuggest');
  el.innerHTML=SUGG_TAGS.map(function(t){
    return '<button class="tag-sug" onclick="addSugg(\''+t+'\')">'+t+'</button>';
  }).join('');
}
function addSugg(t){if(!_eTags.includes(t)&&_eTags.length<15){_eTags.push(t);renderTags();}}
async function loadEditData(shareId){
  document.getElementById('editSaveBtn').disabled=true;
  try{
    var r=await fetch(API+'/api/shares/'+shareId);
    var s=await r.json();
    document.getElementById('editTrackName').textContent=s.title||'—';
    document.getElementById('eLockedTitle').textContent=s.title||'—';
    var dt=s.created_at?new Date(s.created_at*1000>1e12?s.created_at:s.created_at*1000).toLocaleDateString('ko-KR'):'—';
    document.getElementById('eLockedDate').textContent=dt;
    document.getElementById('eLockedHash').textContent=s.origin_hash||'(없음)';
    document.getElementById('eArtist').value=s.artist||'';
    document.getElementById('eAlbum').value=s.album||'';
    document.getElementById('eDescription').value=s.description||'';
    document.getElementById('eComposer').value=s.composer||'';
    document.getElementById('eLyricist').value=s.lyricist||'';
    document.getElementById('eLyrics').value=s.lyrics||'';
    document.getElementById('eCredits').value=s.credits||'';
    document.getElementById('eMusicalKey').value=s.musical_key||'';
    document.getElementById('eCreationStory').value=s.creation_story||'';
    document.getElementById('eProductionNote').value=s.production_note||'';
    var cat=document.getElementById('eCategory');
    for(var i=0;i<cat.options.length;i++) if(cat.options[i].value===s.category){cat.selectedIndex=i;break;}
    if(s.cover_url){
      document.getElementById('eCoverImg').src=s.cover_url;
      document.getElementById('eCoverImg').style.display='block';
      document.getElementById('eCoverIcon').style.display='none';
    }
    var gallery=[];
    try{gallery=JSON.parse(s.gallery_images||'[]');}catch(e){}
    gallery.forEach(function(url,i){if(i<4&&url)setGalSlot(i,url);});
    _eGalUrls=[gallery[0]||'',gallery[1]||'',gallery[2]||'',gallery[3]||''];
    _eTags=[];
    try{_eTags=JSON.parse(s.mood_tags||'[]');}catch(e){if(s.mood_tags)_eTags=s.mood_tags.split(',').map(function(t){return t.trim();}).filter(Boolean);}
    renderTags();
    var links={};
    try{links=JSON.parse(s.social_links||'{}');}catch(e){}
    document.getElementById('eYoutube').value=links.youtube||'';
    document.getElementById('eInstagram').value=links.instagram||'';
    document.getElementById('eSoundcloud').value=links.soundcloud||'';
    document.getElementById('eSpotify').value=links.spotify||'';
    document.getElementById('editSaveBtn').disabled=false;
  }catch(e){alert('불러오기 실패: '+e.message);closeEdit();}
}
async function saveEdit(){
  if(!_eid)return;
  var btn=document.getElementById('editSaveBtn');
  btn.disabled=true;btn.textContent='저장 중...';
  try{
    // 커버 업로드
    var coverUrl=document.getElementById('eCoverImg').src||'';
    if(_eCoverFile){
      var cfd=new FormData();cfd.append('file',_eCoverFile);cfd.append('trackId','cover_'+_eid+'_'+Date.now());
      var cr=await fetch(API+'/api/upload',{method:'POST',headers:{'Authorization':'Bearer '+(_token||'')},body:cfd});
      var cd=await cr.json();if(cd.ok&&cd.url)coverUrl=cd.url;
    }
    // 갤러리 업로드
    var galUrls=_eGalUrls.slice();
    for(var i=0;i<4;i++){
      if(_eGalFiles[i]){
        var gfd=new FormData();gfd.append('file',_eGalFiles[i]);gfd.append('trackId','gal_'+_eid+'_'+i+'_'+Date.now());
        var gr=await fetch(API+'/api/upload',{method:'POST',headers:{'Authorization':'Bearer '+(_token||'')},body:gfd});
        var gd=await gr.json();if(gd.ok&&gd.url)galUrls[i]=gd.url;
      }
    }
    // PATCH 요청
    var body={
      artist:document.getElementById('eArtist').value.trim(),
      album:document.getElementById('eAlbum').value.trim(),
      category:document.getElementById('eCategory').value,
      description:document.getElementById('eDescription').value.trim(),
      composer:document.getElementById('eComposer').value.trim(),
      lyricist:document.getElementById('eLyricist').value.trim(),
      lyrics:document.getElementById('eLyrics').value.trim(),
      credits:document.getElementById('eCredits').value.trim(),
      musical_key:document.getElementById('eMusicalKey').value.trim(),
      creation_story:document.getElementById('eCreationStory').value.trim(),
      production_note:document.getElementById('eProductionNote').value.trim(),
      cover_url:coverUrl,
      gallery_images:JSON.stringify(galUrls.filter(function(u){return u;})),
      mood_tags:JSON.stringify(_eTags),
      social_links:JSON.stringify({
        youtube:document.getElementById('eYoutube').value.trim(),
        instagram:document.getElementById('eInstagram').value.trim(),
        soundcloud:document.getElementById('eSoundcloud').value.trim(),
        spotify:document.getElementById('eSpotify').value.trim(),
      }),
    };
    var res=await fetch(API+'/api/shares/'+_eid,{
      method:'PATCH',
      headers:{'Content-Type':'application/json','Authorization':'Bearer '+(_token||'')},
      body:JSON.stringify(body)
    });
    var data=await res.json();
    if(!res.ok)throw new Error(data.error||'저장 실패');
    // 토스트
    var toast=document.getElementById('editToast');
    toast.classList.add('show');
    setTimeout(function(){toast.classList.remove('show');},2200);
    btn.textContent='💾 저장';btn.disabled=false;
    _existingSongs=null;
    // 목록 새로고침
    if(_myAllFiles.length>0)loadMyFiles();
  }catch(e){
    alert('저장 실패: '+e.message);
    btn.textContent='💾 저장';btn.disabled=false;
  }
}
"""

src = src.replace('function escapeHtml(s)', EDIT_JS + '\nfunction escapeHtml(s)', 1)
print("OK: JS added")

with open(TARGET, 'w', encoding='utf-8') as f:
    f.write(src)

print("DONE: creator.html saved")
