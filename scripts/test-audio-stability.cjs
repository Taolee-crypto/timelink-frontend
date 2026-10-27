const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const chain=fs.readFileSync('public/tl3-lp-chain.js','utf8'),worklet=fs.readFileSync('public/tl3-lp-worklet.js','utf8');
class Node {
 constructor(){this.connections=new Set();this.listeners=new Map();this.gain={value:1,cancelScheduledValues(){},setValueAtTime(v){this.value=v},setTargetAtTime(v){this.value=v}};this.port={closed:false,close(){this.closed=true},onmessage:null};}
 connect(n){this.connections.add(n)}disconnect(){this.connections.clear()}
 addEventListener(n,fn){this.listeners.set(n,fn)}removeEventListener(n){this.listeners.delete(n)}
}
class Context {
 static all=[];
 constructor(options){this.options=options;this.state='running';this.currentTime=0;this.destination={};this.nodes=[];this.suspends=0;this.audioWorklet={addModule:async()=>{}};Context.all.push(this);}
 createMediaElementSource(){const n=new Node();this.nodes.push(n);return n}createGain(){const n=new Node();this.nodes.push(n);return n}
 async resume(){this.state='running'}async suspend(){this.suspends++;this.state='suspended'}async close(){this.state='closed'}
}
class Worklet extends Node {static all=[];constructor(ctx,name,options){super();this.options=options;Worklet.all.push(this)}}
function audio(){return {paused:false,listeners:new Map(),addEventListener(n,fn){this.listeners.set(n,fn)},removeEventListener(n){this.listeners.delete(n)}}}
const window={AudioContext:Context,AudioWorkletNode:Worklet};vm.runInNewContext(chain,{window,console});
class ProcessorBase {constructor(){this.port={postMessage(){}}}}
let Processor;vm.runInNewContext(worklet,{AudioWorkletProcessor:ProcessorBase,sampleRate:48000,registerProcessor:(name,type)=>Processor=type});
function render(noise=false,signal=false,blockSize=128){const p=new Processor({processorOptions:{surfaceNoise:noise,durationMs:1000}}),output=new Float32Array(48000);for(let frame=0;frame<output.length;frame+=blockSize){const count=Math.min(blockSize,output.length-frame),input=new Float32Array(count);if(signal)for(let i=0;i<count;i++)input[i]=.2*Math.sin(2*Math.PI*440*(frame+i)/48000);const l=new Float32Array(count),r=new Float32Array(count);p.process([[input,input]],[[l,r]]);output.set(l,frame);}return output;}
(async()=>{
 await window.TL3LPChain.unlock();const a=audio(),b=audio();const first=await window.TL3LPChain.create(a,{enabled:true},1000);await first.setEnabled(true);const second=await window.TL3LPChain.create(b,{enabled:true},1000);await second.setEnabled(true);
 const ctx=Context.all[0];assert.equal(Context.all.length,1);assert.equal(ctx.options.latencyHint,'playback');
 await first.suspend();assert.equal(ctx.suspends,0);assert.equal(second.state(),'running');await first.stop();assert.equal(second.state(),'running');assert.equal(ctx.suspends,0);assert.equal(a.listeners.size,0);assert.equal(Worklet.all[0].port.closed,true);assert.equal(Worklet.all[0].connections.size,0);assert.equal(Worklet.all[0].listeners.size,0);
 const active=Worklet.all[1];assert.equal(active.options.processorOptions.surfaceNoise,false);active.listeners.get('processorerror')();assert.equal(second.enabled(),false);assert.equal(second.available(),false);assert.equal(second.mode(),'native-passthrough');
 await second.stop();await second.stop();assert.equal(ctx.suspends,0);assert.equal(active.port.closed,true);
 // A continuing media element refresh releases its old node/port, too.
 const c=audio(),third=await window.TL3LPChain.create(c,{enabled:true},1000),old=Worklet.all.at(-1);await third.updateProfile({enabled:true},2000);assert.equal(old.port.closed,true);assert.equal(old.listeners.size,0);await third.stop();
 const silence=render();assert.ok(silence.every(v=>v===0),'Default LP must not synthesize hiss or vinyl clicks');
 const vintage=render(true);assert.ok(vintage.some(v=>v!==0),'Explicit surface-noise effect remains supported by the processor');
 const tone=render(false,true),otherBlocks=render(false,true,256);assert.deepEqual(tone,otherBlocks,'Processing must preserve sample state across render blocks');assert.ok(tone.some(v=>Math.abs(v)>.01));assert.ok(tone.every(v=>Number.isFinite(v)&&Math.abs(v)<=1));
 console.log('PASS audio: playback latency, shared context isolation, stopped/profile-changed nodes released, processor-error native fallback, no synthesized noise, tone continuity across blocks');
})().catch(error=>{console.error(error);process.exitCode=1});
