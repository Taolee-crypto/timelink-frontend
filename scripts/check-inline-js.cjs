// Zero-dependency regression guard: parse every inline JavaScript block in public HTML.
// Prevents a syntax typo in admin.html from disabling the entire login screen.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
let count = 0;
const errors = [];
function visit(dir) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) { visit(full); continue; }
    if (!ent.isFile() || !ent.name.endsWith('.html')) continue;
    const html = fs.readFileSync(full, 'utf8');
    const blocks = /<script\\b([^>]*)>([\\s\\S]*?)<\\/script\\s*>/gi;
    let match;
    while ((match = blocks.exec(html))) {
      const attrs = match[1];
      if (/\\bsrc\\s*=/.test(attrs)) continue;
      if (/\\btype\\s*=\\s*['\"](?:application\\/json|application\\/ld\\+json|importmap)['\"]/.test(attrs)) continue;
      const js = match[2].trim();
      if (!js) continue;
      count++;
      try { new vm.Script(js, { filename: full + ':inline-script-' + count }); }
      catch (e) { errors.push(String(e.stack || e)); }
    }
  }
}
visit(path.join(process.cwd(), 'public'));
if (errors.length) { console.error(errors.join('\\n\\n')); process.exit(1); }
console.log('PASS: ' + count + ' inline scripts parsed successfully');
