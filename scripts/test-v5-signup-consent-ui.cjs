'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const html=fs.readFileSync('public/signup.html','utf8');
const signup=html.slice(html.indexOf('async function doSignup(){'),html.indexOf('// Referral code is not part of registration credentials'));
const verify=html.slice(html.indexOf('async function doVerify(){'),html.indexOf('async function resendCode(){'));
assert.ok(signup.startsWith('async function doSignup()')&&verify.startsWith('async function doVerify()'));
const vals={
 email:{value:'  member@example.test  '},pw:{value:'safe-password'},pw2:{value:'safe-password'},
 username:{value:'member-test'},agree1:{checked:false},agree2:{checked:false},agree3:{checked:false},
 submitBtn:{disabled:false,innerHTML:'',textContent:''},
 verifyBtn:{disabled:false,innerHTML:'',textContent:''},
 verifyEmail:{textContent:''},verifyCode:{value:'123456',focus(){}},
 formArea:{style:{display:''}},verifyBox:{classList:{add(){}}}
};
const document={getElementById(id){assert.ok(vals[id],'missing DOM fixture '+id);return vals[id]}};
const requests=[],messages=[],stored={};
let responds=[];
const ctx=vm.createContext({
 document,window:{},API:'https://api.timelink.digital',_signupData:null,
 signupText:key=>key,toast:(msg,type)=>messages.push({msg,type}),
 fetch:async(url,options)=>{requests.push({url,body:JSON.parse(options.body)});
  const next=responds.shift();assert.ok(next,'unexpected fetch '+url);
  return {ok:next.ok,status:next.ok?200:400,json:async()=>next.data};},
 localStorage:{setItem:(key,value)=>stored[key]=value},
 claimVerifiedSignupReferral:async()=>{},
 setTimeout(){},URLSearchParams,location:{search:'',href:''}
});
vm.runInContext(signup+'\n'+verify,ctx);
(async()=>{
 await ctx.doSignup();
 assert.equal(requests.length,0,'no required consent must never hit server');
 vals.agree1.checked=true;
 await ctx.doSignup();
 assert.equal(requests.length,0,'accepting terms alone must never hit server');
 vals.agree2.checked=true;
 responds.push({ok:true,data:{ok:true}});
 await ctx.doSignup();
 assert.equal(requests.length,1);
 assert.match(requests[0].url,/\/api\/auth\/signup$/);
 assert.equal(requests[0].body.consent_terms,true);
 assert.equal(requests[0].body.consent_privacy,true);
 assert.equal(requests[0].body.age_14_confirmed,true);
 assert.equal(requests[0].body.marketing,false,'optional checkbox remains false');
 assert.equal(ctx._signupData.email,'member@example.test');
 vals.agree2.checked=false;
 await ctx.doVerify();
 assert.equal(requests.length,1,'email completion without privacy consent must not hit verify');
 vals.agree2.checked=true;
 responds.push({ok:true,data:{ok:true}},{ok:true,data:{token:'test-auth',user:{id:8,email:'member@example.test'}}});
 await ctx.doVerify();
 assert.equal(requests.length,3);
 assert.match(requests[1].url,/\/api\/auth\/verify$/);
 assert.equal(requests[1].body.consent_terms,true);
 assert.equal(requests[1].body.consent_privacy,true);
 assert.equal(requests[1].body.age_14_confirmed,true);
 assert.equal(requests[1].body.marketing,false);
 assert.equal(stored.tl_token,'test-auth');
 assert.match(requests[2].url,/\/api\/auth\/login$/);
 console.log('PASS signup browser UI: terms/privacy/age required at signup and verification, marketing optional, verified login token flow intact');
})().catch(error=>{console.error(error);process.exitCode=1});
