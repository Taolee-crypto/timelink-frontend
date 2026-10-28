'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const html=fs.readFileSync(require('node:path').join(__dirname,'../public/track.html'),'utf8');
function element(){
  return {hidden:false,style:{},children:[],textContent:'',classList:{add(){}},
    replaceChildren(...nodes){this.children=nodes;},append(...nodes){this.children.push(...nodes);},setAttribute(){}};
}
const els=Object.fromEntries(['scoreModal','scoreContainer','scoreDraftNotice','v5ScoreCreatorActions',
  'scoreTransposeControls','transposeVal','useScoreBtn','downloadPdfBtn'].map(id=>[id,element()]));
const jobs=[];
let response={ok:true,profile:'TL3-V5',can_generate:true,file_id:178,source_sha256:'abc',
  has_score:true,score_status:'draft',score:{melody:[{s:0,d:1,m:60}]}};
const c={document:{getElementById:id=>els[id]||null,createElement:element},
  _scoreData:null,_scoreTranspose:0,_scoreRenderVersion:0,_osmdInstance:null,
  _share:{title:'RED AND YELLOW'},API:'https://api.timelink.digital',SHARE_ID:'178',
  getTok:()=>'',encodeURIComponent,alert(){throw Error('unexpected alert');},console:{error(){},warn(){}},
  fetch:async()=>({ok:response.ok,json:async()=>response}),
  scoreDataToMusicXml:(_data,transpose)=>'<score transpose="'+transpose+'"/>',
  opensheetmusicdisplay:{OpenSheetMusicDisplay:class{
    constructor(sheet,options){this.sheet=sheet;this.options=options;this.rendered=0;jobs.push(this);}
    load(xml){this.xml=xml;return new Promise((resolve,reject)=>{this.resolve=resolve;this.reject=reject;});}
    render(){this.rendered++;}
  }}
};
vm.createContext(c);
vm.runInContext(html.slice(html.indexOf('function renderUnissuedV5Score('),html.indexOf('function closeScoreModal(){')),c);
vm.runInContext(html.slice(html.indexOf('async function renderScoreOSMD('),html.indexOf('// V3 score purchase has no valid')),c);
async function tick(){await new Promise(resolve=>setImmediate(resolve));}
(async()=>{
  const loading=c.loadScore();await tick();
  assert.equal(els.scoreDraftNotice.hidden,false);
  assert.match(els.scoreContainer.style.cssText,/background:#fefefe/);
  assert.equal(jobs[0].options.autoResize,false,'one page resize handler replaces per-instance listeners');
  jobs[0].resolve();await loading;
  assert.equal(jobs[0].rendered,1);
  assert.equal(els.scoreTransposeControls.hidden,false);
  c.transposeScore(1);c.transposeScore(1);
  const old=jobs[1],latest=jobs[2];
  assert.equal(els.scoreDraftNotice.hidden,false,'draft notice survives transpose');
  assert.equal(els.scoreContainer.children[0],latest.sheet);
  latest.resolve();await tick();old.resolve();await tick();
  assert.equal(latest.rendered,1);assert.equal(old.rendered,0,'obsolete load must not render');
  assert.equal(c._osmdInstance,latest);
  assert.match(latest.xml,/transpose="2"/);
  c.transposeScore(-1);
  const failed=jobs.at(-1);failed.reject(Error('<img src=x onerror=alert(1)>'));await tick();
  assert.equal(failed.sheet.textContent,'악보 렌더 실패: <img src=x onerror=alert(1)>');
  assert.equal(failed.sheet.children.length,0,'error text is not interpreted as markup');
  assert.equal(els.scoreDraftNotice.hidden,false);
  // A new status view invalidates any in-flight render and clears owner controls on errors.
  c.transposeScore(1);const pending=jobs.at(-1);
  response={ok:false,message:'연결 실패'};await c.loadScore();pending.resolve();await tick();
  assert.equal(pending.rendered,0);
  assert.equal(els.scoreDraftNotice.hidden,true);
  assert.equal(els.v5ScoreCreatorActions.hidden,true);
  assert.equal(c._v5ScoreOwnerAllowed,false);
  assert.equal(els.useScoreBtn.disabled,true);assert.equal(els.downloadPdfBtn.disabled,true);
  console.log('PASS score viewer: light sheet, persistent draft notice, latest transpose, safe errors and status reset');
})().catch(error=>{console.error(error);process.exitCode=1;});
