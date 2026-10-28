/* TimeLink TRACK local score draft — intentionally does NOT decrypt TL3 V5,
   charge TL, upload original audio, or mint TLD. A first functional analysis
   path for user-supplied/licensed audio, with clear draft quality marking. */
(function(root,factory){
  const api=factory();
  if(typeof module==='object' && module.exports) module.exports=api;
  if(root && root.document) {root.TLTrackScoreAnalyzer=api;api.init(root);}
})(typeof globalThis!=='undefined'?globalThis:null,function(){
  'use strict';
  const ANALYSIS_RATE=8000, WINDOW=960, HOP=400, MAX_SECONDS=120, MAX_FILE_BYTES=30*1024*1024;
  function median(a){if(!a.length)return 0;const b=a.slice().sort((x,y)=>x-y);return b[Math.floor(b.length/2)];}
  function detectPitch(data,offset,sampleRate=ANALYSIS_RATE){
    const minLag=Math.max(8,Math.floor(sampleRate/900)), maxLag=Math.min(Math.floor(sampleRate/80),WINDOW-64);
    let energy=0;for(let i=0;i<WINDOW;i++)energy+=data[offset+i]*data[offset+i];
    const rms=Math.sqrt(energy/WINDOW);
    if(rms<0.013)return null;
    const sums=new Float64Array(maxLag+1);
    let running=0,chosen=0,best=1;
    for(let tau=1;tau<=maxLag;tau++){
      let d=0;
      for(let i=0;i<WINDOW-tau;i+=2){const v=data[offset+i]-data[offset+i+tau];d+=v*v;}
      running+=d;
      if(tau<minLag)continue;
      const cmnd=running?d*tau/running:1;
      if(cmnd<best){best=cmnd;chosen=tau;}
      if(cmnd<0.17){
        let nxt=d;
        const nextTau=tau+1;
        if(nextTau<=maxLag){nxt=0;for(let i=0;i<WINDOW-nextTau;i+=2){const v=data[offset+i]-data[offset+i+nextTau];nxt+=v*v;}}
        if(nextTau>maxLag||nxt>=d){best=cmnd;chosen=tau;break;}
      }
    }
    if(!chosen||best>0.24)return null;
    const frequency=sampleRate/chosen;
    const midi=Math.round(69+12*Math.log2(frequency/440));
    if(midi<40||midi>90)return null;
    return {midi,confidence:Math.max(0,Math.min(1,1-best))};
  }
  function estimateKey(notes){
    const pcs=new Float64Array(12);
    for(const n of notes)pcs[n.m%12]+=n.d*n.conf;
    const major=[6.35,2.23,3.48,2.33,4.38,4.09,2.52,5.19,2.39,3.66,2.29,2.88];
    const minor=[6.33,2.68,3.52,5.38,2.60,3.53,2.54,4.75,3.98,2.69,3.34,3.17];
    let best=-Infinity,root=0,mode='major';
    for(let tonic=0;tonic<12;tonic++)for(const [name,pattern] of [['major',major],['minor',minor]]){
      let value=0;for(let pc=0;pc<12;pc++)value+=pcs[pc]*pattern[(pc-tonic+12)%12];
      if(value>best){best=value;root=tonic;mode=name;}
    }
    const names=['C','C#','D','Eb','E','F','F#','G','Ab','A','Bb','B'];
    return {tonic:names[root],mode,conf:0};
  }
  function analyzeSamples(samples,sampleRate=ANALYSIS_RATE,opts={}){
    if(!(samples instanceof Float32Array)||!Number.isFinite(sampleRate)||sampleRate<ANALYSIS_RATE)throw Error('유효한 오디오 데이터가 아닙니다.');
    const stride=Math.max(1,Math.round(sampleRate/ANALYSIS_RATE));
    const sr=sampleRate/stride;
    const length=Math.min(Math.floor(samples.length/stride),Math.floor(MAX_SECONDS*sr));
    if(length<WINDOW*2)throw Error('분석할 오디오가 너무 짧습니다.');
    const reduced=new Float32Array(length);
    for(let i=0;i<length;i++)reduced[i]=samples[i*stride];
    const frames=[];
    for(let offset=0;offset+WINDOW<=length;offset+=HOP){
      const pitch=detectPitch(reduced,offset,sr);
      frames.push(pitch);
    }
    // Median smoothing removes a single unstable frame without inventing notes in silence.
    const mids=frames.map((p,i)=>{
      if(!p)return null;
      const around=frames.slice(Math.max(0,i-1),Math.min(frames.length,i+2)).filter(Boolean);
      return {...p,midi:median(around.map(x=>x.midi))};
    });
    const notes=[];
    let begin=-1,lastMidi=null,total=0,count=0;
    function flush(end){
      if(begin<0)return;
      const s=begin*HOP/sr,d=(end-begin)*HOP/sr;
      if(d>=0.14&&lastMidi>=40&&lastMidi<=90)notes.push({s:+s.toFixed(3),d:+d.toFixed(3),m:lastMidi,conf:+(total/count).toFixed(3)});
      begin=-1;total=0;count=0;lastMidi=null;
    }
    for(let i=0;i<=mids.length;i++){
      const p=i<mids.length?mids[i]:null;
      if(!p){flush(i);continue;}
      if(begin<0){begin=i;lastMidi=p.midi;total=p.confidence;count=1;continue;}
      if(lastMidi!==p.midi){flush(i);begin=i;lastMidi=p.midi;total=p.confidence;count=1;}
      else{total+=p.confidence;count++;}
    }
    if(!notes.length)throw Error('멜로디를 찾지 못했습니다. 보컬·멜로디가 선명한 음원으로 다시 시도해 주세요.');
    const bpm=Number(opts.bpm);
    return {
      version:1,algorithm:'timelink-browser-yin-draft-v1',time_signature:'4/4',
      bpm:Number.isFinite(bpm)&&bpm>=40&&bpm<=220?bpm:120,
      key:estimateKey(notes),melody:notes,chords:[],
      analysis:{source:'user_selected_local_audio',quality:'draft_monophonic_only',seconds:+(length/sr).toFixed(2),truncated:samples.length/stride>length,model:'YIN difference/median',rights_confirmation_required:true}
    };
  }
  async function analyzeFile(file,opts={}){
    if(!file||file.size<1024||file.size>MAX_FILE_BYTES)throw Error('30MB 이하의 WAV·MP3·M4A 음원을 선택해 주세요.');
    const Context=globalThis.AudioContext||globalThis.webkitAudioContext;
    if(!Context)throw Error('이 브라우저는 오디오 분석을 지원하지 않습니다.');
    const context=new Context();
    try{
      const buffer=await context.decodeAudioData(await file.arrayBuffer());
      if(!buffer.length||buffer.duration<0.3)throw Error('오디오 파일을 디코딩하지 못했습니다.');
      const channel=buffer.getChannelData(0);
      let mono=channel;
      if(buffer.numberOfChannels>1){
        const second=buffer.getChannelData(1),n=Math.min(channel.length,Math.floor(MAX_SECONDS*buffer.sampleRate));
        mono=new Float32Array(n);
        for(let i=0;i<n;i++)mono[i]=(channel[i]+second[i])*0.5;
      }
      return analyzeSamples(mono,buffer.sampleRate,opts);
    }finally{await context.close();}
  }
  function init(root){
    const choose=root.document.getElementById('localScoreChoose');
    const file=root.document.getElementById('localScoreAudio');
    const status=root.document.getElementById('localScoreStatus');
    const bpm=root.document.getElementById('localScoreBpm');
    const download=root.document.getElementById('downloadDraftXml');
    const rights=root.document.getElementById('localScoreRights');
    if(!choose||!file||!status||!bpm||!download||!rights)return;
    let result=null;
    choose.addEventListener('click',()=>file.click());
    file.addEventListener('change',async()=>{
      const chosen=file.files&&file.files[0];file.value='';if(!chosen)return;
      result=null;download.disabled=true;
      if(!rights.checked){status.textContent='직접 제작했거나 분석 권한을 받은 음원만 사용할 수 있습니다. 먼저 권리 확인에 동의해 주세요.';return;}
      choose.disabled=true;
      status.textContent='브라우저에서 멜로디 음정을 분석하고 있습니다. 파일은 서버로 전송되지 않습니다.';
      try{
        const output=await analyzeFile(chosen,{bpm:Number(bpm.value)});
        result=output;
        if(typeof root.trackScoreLocalReady!=='function')throw Error('TRACK 악보 편집기가 준비되지 않았습니다.');
        await root.trackScoreLocalReady(output);
        status.textContent='분석 초안: '+output.melody.length+'개 음표 · '+output.key.tonic+' '+output.key.mode+' · '+output.bpm+' BPM. '+(output.analysis.truncated?'첫 120초만 분석했습니다. ':'')+'정확한 멜로디·박자·조성은 검수해야 합니다. TLD 발행이나 TL 차감은 발생하지 않았습니다.';
        download.disabled=false;
      }catch(e){status.textContent='악보 분석 실패: '+(e?.message||String(e));}
      finally{choose.disabled=false;}
    });
    download.addEventListener('click',()=>{
      if(!result||typeof root.scoreDataToMusicXml!=='function')return;
      const xml=root.scoreDataToMusicXml(result,0,(typeof root.trackScoreShareInfo==='function'?root.trackScoreShareInfo():{title:'Music transcription draft'}));
      if(!xml)return;
      const url=URL.createObjectURL(new Blob([xml],{type:'application/vnd.recordare.musicxml+xml;charset=utf-8'}));
      const a=root.document.createElement('a');a.href=url;a.download='timelink-score-draft.musicxml';a.click();
      setTimeout(()=>URL.revokeObjectURL(url),1200);
    });
  }
  return {analyzeSamples,detectPitch,analyzeFile,init,estimateKey};
});
