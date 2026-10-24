const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve('public'),errors=[];
function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)])}
const files=walk(root).filter(p=>/\.(html|css|js)$/.test(p)&&!p.includes(path.sep+'docs'+path.sep));
for(const file of files){const text=fs.readFileSync(file,'utf8');for(const match of text.matchAll(/(?:src|href)=["'](\/[^"'<>]+)["']/g)){
 const ref=match[1].split(/[?#]/)[0];if(ref.startsWith('/cdn-cgi/')||ref.includes('\\')||ref.includes('${')||ref.includes("'+")||ref.includes('`')||ref.includes('api/')||! /\.(?:css|js|jpg|png|webp|svg|docx|html)$/.test(ref))continue;
 if(!fs.existsSync(path.join(root,ref)))errors.push(path.relative(root,file)+' -> '+ref);
}}
// Renewal photographs must be local and attributable, not remote placeholders.
const manifest=JSON.parse(fs.readFileSync('public/images/renewal/manifest.json','utf8'));
assert.ok(manifest.length>=10);
for(const photo of manifest){assert.ok(photo.source.startsWith('https://www.pexels.com/'));for(const key of ['file','card'])assert.ok(fs.existsSync(path.join(root,'images/renewal',photo[key])))}
assert.ok(fs.statSync('public/docs/TimeLink_Frontend_Renewal_Plan_20261024.docx').size>100000);
assert.ok(fs.readFileSync('public/docs/TimeLink_Frontend_Renewal_Plan_20261024.html','utf8').includes('프론트엔드'));
if(errors.length){console.error([...new Set(errors)].join('\n'));process.exitCode=1}else console.log('PASS local resources, 10 attributed photo pairs, public/docs plan');
