'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const html=fs.readFileSync('public/track.html','utf8');
const a=html.indexOf('function openTrackInfoEditor(){'),b=html.indexOf('function closeTrackInfoEditor(){',a);
assert.ok(a>0&&b>a,'track editor boundaries missing');
const el={};
for(const x of ['Title','Artist','Album','Composer','Lyricist','Producer','Arranger','Category','Lyrics','GenreFamily','GenreRegion'])
 el['editTrack'+x]={value:'',disabled:false,title:''};
el.trackInfoRightsNotice={style:{display:'none'}};
el.trackInfoEditError={style:{display:'none'}};
let opened=0,errors=[];
el.trackInfoModal={classList:{add:c=>{assert.equal(c,'open');opened++;}}};
const ctx=vm.createContext({
 _currentUserId:21,_share:null,
 document:{getElementById:id=>el[id]},
 alert:message=>errors.push(message),
 console:{warn(){}}
});
vm.runInContext(html.slice(a,b),ctx);
const base={id:'sh_test',user_id:21,title:'음원',artist:'아티스트',composer:'작곡가',lyricist:'작사가',arranger:'편곡가',lyrics:'가사'};
ctx._share={...base,player_version:5};
ctx.openTrackInfoEditor();
assert.equal(opened,1);
for(const name of ['Composer','Lyricist','Arranger']){
 assert.equal(el['editTrack'+name].disabled,true,'sealed V5 must lock '+name);
 assert.equal(el['editTrack'+name].value,base[name.toLowerCase()]);
}
for(const name of ['Artist','Album','Producer','Lyrics'])
 assert.equal(el['editTrack'+name].disabled,false);
assert.equal(el.trackInfoRightsNotice.style.display,'block');
ctx._share={...base,player_version:4};
ctx.openTrackInfoEditor();
for(const name of ['Composer','Lyricist','Arranger'])assert.equal(el['editTrack'+name].disabled,false);
assert.equal(el.trackInfoRightsNotice.style.display,'none');
ctx._share={...base,user_id:22,player_version:5};ctx.openTrackInfoEditor();
assert.equal(opened,2,'unowned track must never open editing');
assert.match(errors[0],/본인의 곡 정보/);
console.log('PASS V5 TRACK editor locks royalty roles, keeps display fields editable, and enforces owner gate');
