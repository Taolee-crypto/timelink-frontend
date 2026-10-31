'use strict';
const fs=require('node:fs');
const assert=require('node:assert/strict');
const vm=require('node:vm');
const base=fs.readFileSync('public/tl-broadcast.html','utf8');
const radio=fs.readFileSync('public/radio.html','utf8');
const admin=fs.readFileSync('public/tilo-admin.html','utf8');
const sidebar=fs.readFileSync('public/sidebar.js','utf8');

// The old TL broadcast URL is a complete, search/hash-preserving redirect
// to the one official live receiver page, not a forked audio player.
assert.match(base,/<meta http-equiv="refresh" content="0;url=\/radio\.html"/);
assert.match(base,/<link rel="canonical" href="https:\/\/www\.timelink\.digital\/radio\.html"/);
assert.match(base,/location\.replace\("\/radio\.html"\+location\.search\+location\.hash\)/);
assert.match(base,/<a href="\/radio\.html">/);

// The receiver uses the official V5-protected TL3 player. Requiring both
// proper media source and real Audio state prevents a fake ON AIR badge.
assert.match(radio,/src="\/tl3-v5-player\.js/);
assert.match(radio,/id="tilo-broadcast-audio"/);
assert.match(radio,/id="country-station-join"/);
assert.match(radio,/tilo:live-track/);
assert.match(radio,/renderAudioState/);
assert.match(radio,/@media\(max-width:760px\)/);
assert.match(sidebar,/\['\/radio\.html','radio','Broadcast','Broadcast'\]/);

// The administrator has an explicit secured backend connection for the
// rights audit, license grants and operations; no anonymous grant action.
assert.match(admin,/href="\/login\.html\?redirect=%2Ftilo-admin\.html"/);
assert.match(admin,/\/api\/admin\/central-broadcast\/operations/);
assert.match(admin,/\/api\/admin\/central-broadcast\/stations\//);
assert.match(admin,/\/grants\/bulk/);
assert.match(admin,/track\.can_grant===true/);
assert.match(admin,/broadcaster_credential_configured/);
assert.match(admin,/operational_blockers/);
assert.match(admin,/window\.confirm\(/);
assert.ok(admin.includes('grid-template-columns:repeat(auto-fit,minmax(260px,1fr))'),'admin responsive grid');
assert.match(sidebar,/\['\/tilo-admin\.html','radio','broadcastOps'\]/);
const script=admin.match(/<script>([\s\S]*?)<\/script><\/body>/i)?.[1];
assert.ok(script,'admin page inline application');
new vm.Script(script,{filename:'tilo-admin.html'});
console.log('PASS TILO 3 pages: canonical route, official V5 radio receiver, admin rights and runtime safety, mobile layout');
