'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const html=fs.readFileSync(path.join(__dirname,'../public/track.html'),'utf8');
const a=html.indexOf('function renderUnissuedV5Score(');
const b=html.indexOf('function closeScoreModal(){',a);
assert.ok(a>0&&b>a,'V5 score status UI');
function element(){
 return {hidden:false,style:{},textContent:'',children:[],attrs:{},classList:{add(){}},
  replaceChildren(...children){this.children=children;},
  append(...children){this.children.push(...children);},
  setAttribute(name,val){this.attrs[name]=val;}};
}
const els={
 scoreModal:element(),scoreContainer:element(),scoreTransposeControls:element(),
 transposeVal:element(),useScoreBtn:element(),downloadPdfBtn:element()
};
const calls=[];
let result={ok:true,profile:'TL3-V5',score_status:'not_generated',title:'RED AND YELLOW',has_score:false,score:null};
let success=true;
const c={document:{getElementById(id){return els[id]||null;},createElement(){return element();}},
 _scoreData:null,_scoreTranspose:0,_scoreRenderVersion:0,_osmdInstance:null,_share:{title:'RED AND YELLOW'},API:'https://api.timelink.digital',SHARE_ID:'178',
 encodeURIComponent,getTok:()=>'',alert(){throw Error('no popup expected');},
 fetch:async(url,opts)=>{calls.push({url,opts});return {ok:success,json:async()=>result};},
 renderScoreOSMD:()=>{throw Error('should not render unpublished TLD');}
};
vm.runInNewContext(html.slice(a,b),c);
(async()=>{
 await c.loadScore();
 assert.equal(calls.length,1,'no duplicate V3 requests');
 assert.equal(calls[0].url,'https://api.timelink.digital/api/v1/scores/v5/178');
 assert.equal(calls[0].opts.cache,'no-store');
 assert.equal(els.useScoreBtn.hidden,true);
 assert.equal(els.downloadPdfBtn.hidden,true);
 assert.equal(els.scoreTransposeControls.hidden,true);
 assert.equal(els.scoreContainer.children.length,1);
 const nodes=els.scoreContainer.children[0].children;
 assert.ok(nodes.some(n=>n.textContent.includes('아직 발행되지 않았습니다')));
 assert.ok(nodes.some(n=>n.textContent.includes('RED AND YELLOW')));
 assert.ok(!String(els.scoreContainer.textContent).includes('TL3 release not found'));
 // Genuine backend errors are not disguised as "no score".
 success=false;result={ok:false,code:'V5_SCORE_STATUS_UNAVAILABLE',message:'서버 확인 실패'};
 await c.loadScore();
 assert.ok(els.scoreContainer.children[0].textContent.includes('서버 확인 실패'));
 assert.equal(calls.length,2);
 console.log('PASS TRACK 178: V5 200 pending dark state, no 404, no payment/transpose; genuine errors separated');
})().catch(e=>{console.error(e);process.exitCode=1;});
