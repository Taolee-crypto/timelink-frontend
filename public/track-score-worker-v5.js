/* TRACK V5 owner audio -> single-melody draft. Worker keeps analysis off the playback/UI thread.
   This is NOT a full polyphonic transcription model or a published TLD. */
'use strict';
function median(vals){if(!vals.length)return 0;const v=vals.slice().sort((a,b)=>a-b);return v[v.length>>1];}
function pitchAt(a,pos,sr){
 const n=960,lagMin=Math.max(7,Math.floor(sr/900)),lagMax=Math.min(110,Math.floor(sr/80));
 let sum=0;for(let i=0;i<n;i+=2){const y=a[pos+i]||0;sum+=y*y;}
 if(Math.sqrt(sum/(n/2))<0.018)return null;
 let cumulative=0,best=2,bestLag=0;
 for(let lag=1;lag<=lagMax;lag++){
  let diff=0;
  for(let i=0;i<n-lag;i+=4){const d=a[pos+i]-a[pos+i+lag];diff+=d*d;}
  cumulative+=diff;
  if(lag<lagMin)continue;
  const normalized=cumulative?lag*diff/cumulative:1;
  if(normalized<best){best=normalized;bestLag=lag;}
  if(normalized<.16&&lag>lagMin)break;
 }
 if(best>.22||!bestLag)return null;
 const midi=Math.round(69+12*Math.log2(sr/bestLag/440));
 return midi>=40&&midi<=90?{m:midi,conf:Math.max(.05,1-best)}:null;
}
function transcribe(sampleData,sr,bpm){
 const samples=sampleData instanceof Float32Array?sampleData:new Float32Array(sampleData);
 const hop=320,frame=960,notes=[],frames=[];
 if(samples.length<frame*2)throw Error('분석할 음원이 너무 짧습니다.');
 for(let pos=0;pos+frame<=samples.length;pos+=hop)frames.push(pitchAt(samples,pos,sr));
 const seq=frames.map((p,i)=>{if(!p)return null;const around=frames.slice(Math.max(0,i-1),i+2).filter(Boolean);return {m:median(around.map(x=>x.m)),conf:p.conf};});
 let start=-1,m=null,total=0,num=0;
 function flush(i){
  if(start<0)return;
  const s=start*hop/sr,d=(i-start)*hop/sr;
  if(d>=.16&&m!==null)notes.push({s:Number(s.toFixed(3)),d:Number(d.toFixed(3)),m,conf:Number((total/num).toFixed(3))});
  start=-1;m=null;total=0;num=0;
 }
 for(let i=0;i<=seq.length;i++){
  const p=i<seq.length?seq[i]:null;
  if(!p){flush(i);continue;}
  if(start<0||m!==p.m){flush(i);start=i;m=p.m;total=p.conf;num=1;}else{total+=p.conf;num++;}
 }
 if(notes.length<3)throw Error('멜로디 음표가 충분하지 않습니다. 여러 악기가 섞인 곡은 고급 분석 엔진이 필요할 수 있습니다.');
 const profiles={
  major:[6.35,2.23,3.48,2.33,4.38,4.09,2.52,5.19,2.39,3.66,2.29,2.88],
  minor:[6.33,2.68,3.52,5.38,2.60,3.53,2.54,4.75,3.98,2.69,3.34,3.17]
 };
 const pc=new Array(12).fill(0);for(const note of notes)pc[note.m%12]+=note.d*note.conf;
 let best=-Infinity,keyIndex=0,mode='major';
 for(const type of ['major','minor'])for(let root=0;root<12;root++){
  let score=0;for(let note=0;note<12;note++)score+=pc[note]*profiles[type][(note-root+12)%12];
  if(score>best){best=score;keyIndex=root;mode=type;}
 }
 const tonics=['C','C#','D','Eb','E','F','F#','G','Ab','A','Bb','B'];
 return {version:1,bpm:Number.isFinite(bpm)&&bpm>=40&&bpm<=220?bpm:120,time_signature:'4/4',
  key:{tonic:tonics[keyIndex],mode,conf:0},melody:notes.slice(0,6000),chords:[],
  analysis:{source:'v5_owner_authorized_playback',quality:'unreviewed_single_melody_draft',seconds:Number((samples.length/sr).toFixed(2))}};
}
self.onmessage=function(ev){
 try{
  const m=ev.data||{};const r=transcribe(m.samples,m.sampleRate,m.bpm);
  self.postMessage({ok:true,score:r});
 }catch(e){self.postMessage({ok:false,error:String(e?.message||e)});}
};
