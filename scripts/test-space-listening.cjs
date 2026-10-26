const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
for(const [file,space] of [['my-cafe.html','cafe'],['my-car.html','car']]){
 const html=fs.readFileSync('public/'+file,'utf8');
 assert.match(html,/<h2>방송 듣기<\/h2>/);
 assert.match(html,/id="centralListen" href="\/radio.html\?autojoin=1"/);
 assert.ok(html.includes('id="djListen" href="/cafe-radio.html?view=listen&amp;space='+space+'"'));
}
const radio=fs.readFileSync('public/radio.html','utf8');
const code=radio.split('// A space\'s central button joins')[1].split('// Store handoff')[0];
const events={};let clicks=0;
const parent={},ctx={stationPlaying:false,stationJoin:{disabled:false,click(){clicks++}},location:{origin:'https://test.local',search:'?autojoin=1'},URLSearchParams,window:{parent,addEventListener:(name,fn)=>events[name]=fn}};
vm.runInNewContext('// A space\'s central button joins'+code,ctx);assert.equal(clicks,1);
function send(origin,source){events.message({origin,source,data:{type:'tl:play-radio'}})}
send('https://evil.local',parent);send('https://test.local',{});assert.equal(clicks,1);
send('https://test.local',parent);assert.equal(clicks,2);
ctx.stationPlaying=true;send('https://test.local',parent);assert.equal(clicks,2);
ctx.stationPlaying=false;ctx.stationJoin.disabled=true;send('https://test.local',parent);assert.equal(clicks,2);
console.log('PASS spaces: central and DJ destinations, autojoin, authenticated parent messaging, repeated clicks preserve playback');
