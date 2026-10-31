/* Member TILO radio: charge only owned wallet TL, or consume TIME FREE. */
(function(root){
'use strict';
function funding(pre){
 if(!pre||typeof pre!=='object')throw new Error('PERSONAL_RADIO_PREFLIGHT_REQUIRED');
 if(pre.billing_mode==='time_free')return {mode:'time_free',amount:0,canListen:pre.can_play===true};
 if(pre.billing_mode==='subscription')return {mode:'subscription',amount:0,canListen:pre.can_play===true};
 const required=Number(pre.required_tl),available=Number(pre.wallet_tl),pool=Number(pre.asset_tl);
 if([required,available,pool].some(n=>!Number.isFinite(n)||n<0))throw new Error('INVALID_RADIO_WALLET_QUOTE');
 const shortage=Math.max(0,Math.ceil(required-pool-1e-8));
 const amount=pre.can_play===true?0:Math.max(0,Math.min(shortage,Math.floor(available+1e-8)));
 return {mode:'metered',amount,canListen:pre.can_play===true||pool>=1||amount>0,rate_tl_per_second:1};
}
root.TILOListenerBilling=Object.freeze({funding});
})(typeof window!=='undefined'?window:globalThis);
