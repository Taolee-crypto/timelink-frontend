const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const context={window:{}};vm.createContext(context);vm.runInContext(fs.readFileSync('public/creator-spotify.js','utf8'),context);
const fields=Object.fromEntries(['title','artist','album','rightsIsrc','rightsSourcePlatform','rightsSourceReference','genre','tiloComposer','tiloLyricist','tiloLyrics'].map(k=>[k,{value:k==='rightsIsrc'?'STALE':k.startsWith('tilo')?'KEEP':''}]));
const apply=context.window.TimeLinkCreatorSpotify.applyFields;
apply({title:'Track',artist:'Artist',album:'Album',isrc:'KRTEST2600001',genres:['jazz'],spotify_url:'https://open.spotify.com/track/'+'A'.repeat(22)},id=>fields[id]);
assert.equal(fields.rightsIsrc.value,'KRTEST2600001');assert.equal(fields.genre.value,'jazz');assert.equal(fields.rightsSourcePlatform.value,'Spotify');
apply({title:'Other',artist:'Other',album:'Other'},id=>fields[id]);assert.equal(fields.rightsIsrc.value,'');assert.equal(fields.tiloComposer.value,'KEEP');assert.equal(fields.tiloLyricist.value,'KEEP');assert.equal(fields.tiloLyrics.value,'KEEP');
const page=fs.readFileSync('public/creator.html','utf8');assert.match(page,/\/api\/spotify\/tracks\//);assert.match(page,/spotify:spotifyTrack\?\{id:spotifyTrack.requested_id\|\|spotifyTrack.id\}/);
console.log('PASS Creator Spotify: ISRC and genre fill, stale ISRC removal, manual credits/lyrics preserved, detailed lookup and selected identity persistence');
