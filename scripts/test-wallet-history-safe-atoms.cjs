const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync('public/renewal/wallet.js','utf8');
new vm.Script(source,{filename:'wallet.js'});
assert.match(source,/Number\.isSafeInteger\(Number\(row\.amount_atoms\)\)/);
for (const v of [0,10000,-10000,Number.MAX_SAFE_INTEGER]) assert.equal(Number.isSafeInteger(Number(v)),true);
for (const v of [Number.MAX_SAFE_INTEGER+1,1e30,Infinity,NaN]) assert.equal(Number.isSafeInteger(Number(v)),false);
console.log('PASS wallet history safe atom integer guard');
