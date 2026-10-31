'use strict';
const fs=require('node:fs'),assert=require('node:assert/strict'),vm=require('node:vm');
const script=fs.readFileSync('public/cafe/decor.js','utf8');
const studio=fs.readFileSync('public/cafe-studio.html','utf8');
const detail=fs.readFileSync('public/cafe-detail.html','utf8');
const entry=fs.readFileSync('public/my-cafe.html','utf8');
const world=fs.readFileSync('public/cafe-world.html','utf8');
function node(tag){
 return {tag,dataset:{},textContent:'',children:[],setAttribute(k,v){this[k]=v;},append(...x){this.children.push(...x)},replaceChildren(...x){this.children=x}};
}
const window={};const document={createElement:node};
vm.runInNewContext(script,{window,document,URL});
const app=window.TiloCafeDecor;
assert.ok(app);
const profile={theme:'forest',tagline:'우리 동네 쉼표',phone:'02-123-4567',website:'https://example.com',amenities:['wifi','pets'],menu:[{name:'라테',detail:'원두의 깊은 향',price:'5,500원'}],hours:{mon:{closed:false,open:'09:00',close:'18:00'},sun:{closed:true,open:'',close:''}}};
assert.equal(app.read(JSON.stringify(profile)).theme,'forest');
assert.deepEqual(JSON.stringify(app.read('INVALID')),'{}');
const target=node('section'),body=node('body');
app.applyTheme(body,profile);assert.equal(body.dataset.cafeTheme,'forest');
app.render(target,profile);
function flat(n){return [n,...(n.children||[]).flatMap(flat)]}
const all=flat(target).map(x=>String(x.textContent||'')).join(' ');
assert.match(all,/우리 동네 쉼표/);
assert.match(all,/대표 메뉴/);assert.match(all,/라테/);
assert.match(all,/02-123-4567/);
assert.match(all,/월/);assert.match(all,/휴무/);
assert.match(all,/와이파이/);
const evil=node('section');
app.render(evil,{menu:[{name:'<img onerror=alert(1)>',price:'',detail:''}]});
assert.ok(flat(evil).some(x=>x.textContent==='<img onerror=alert(1)>'));
assert.ok(!flat(evil).some(x=>x.tag==='img'),'User content must be text, never an element');
app.render(evil,{website:'javascript:alert(1)'});
assert.ok(!flat(evil).some(x=>x.tag==='a'));
for(const id of ['decorTagline','decorPhone','decorWebsite','decorTheme','decorMenuRows','decorAddMenu','decorEditor','cafeExtras'])assert.match(studio,new RegExp('id="'+id+'"'));
assert.equal((studio.match(/data-day="/g)||[]).length,7,'Seven independent weekday controls');
assert.equal((studio.match(/data-amenity\b/g)||[]).length,8);
assert.match(studio,/\/cafe\/decor\.js/);
assert.match(detail,/\/cafe\/decor\.js/);
assert.match(detail,/c\.profile_json/);
assert.match(entry,/카페 월드에서 보기/);
assert.match(entry,/\/cafe-studio\.html\?channel_id=/);
assert.match(entry,/\/cafe-staff-manage\.html\?channel_id=/);
assert.match(entry,/\/store-music-programming\.html\?channel_id=/);
assert.match(world,/\/api\/sales\/world\?/);
assert.match(world,/has_more/);
assert.match(world,/id="worldLoadMore"/);
assert.doesNotMatch(world,/LIMIT 300/);
for(const p of ['public/cafe-studio.html','public/cafe-detail.html','public/cafe-world.html','public/my-cafe.html']){
 const h=fs.readFileSync(p,'utf8');
 for(const m of h.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)){if(m[1].trim())new vm.Script(m[1],{filename:p})}
}
console.log('PASS independent cafe decor, safe storefront, menu-hours-contact and multi-store world navigation');
