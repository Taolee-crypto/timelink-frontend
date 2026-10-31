/* TILO V5 regional browser TTS policy. No voice cloning or invented weather.
 * Licensed natural voices require a separate voice-provider integration.
 * This policy affects only optional DJ commentary, never audio/music rights.
 */
(function(root){
  'use strict';
  const profiles=Object.freeze({
    KR:{locale:'ko-KR',zone:'Asia/Seoul'},JP:{locale:'ja-JP',zone:'Asia/Tokyo'},
    US:{locale:'en-US',zone:'America/New_York'},CN:{locale:'zh-CN',zone:'Asia/Shanghai'},
    TH:{locale:'th-TH',zone:'Asia/Bangkok'},VN:{locale:'vi-VN',zone:'Asia/Ho_Chi_Minh'}
  });
  function localPeriod(country,now){
    const entry=profiles[country];if(!entry)throw new RangeError('Unsupported TILO country');
    if(!(now instanceof Date)||!Number.isFinite(now.getTime()))throw new RangeError('Invalid DJ time');
    const parts=new Intl.DateTimeFormat('en-US',{hour:'2-digit',hourCycle:'h23',timeZone:entry.zone}).formatToParts(now);
    const hour=Number(parts.find(p=>p.type==='hour')?.value);
    return hour>=5&&hour<11?'morning':hour>=11&&hour<18?'day':hour>=18&&hour<22?'evening':'night';
  }
  function adverseWeather(code,provider){
    if(!Number.isInteger(code)||code<0||code>999)return false;
    if(provider==='OpenWeatherMap')return code>=200&&code<700;
    if(provider==='Open-Meteo')return (code>=51&&code<=86)||(code>=95&&code<=99);
    return false;
  }
  function selectVoice(voices,locale){
    if(!Array.isArray(voices))return null;
    const prefix=locale.split('-')[0].toLowerCase();
    const locals=voices.filter(v=>v&&typeof v.lang==='string'&&v.lang.toLowerCase().split('-')[0]===prefix);
    return locals.find(v=>v.lang.toLowerCase()===locale.toLowerCase()&&v.localService===true)||
      locals.find(v=>v.lang.toLowerCase()===locale.toLowerCase())||
      locals.find(v=>v.localService===true)||locals[0]||null;
  }
  function policy(country,now,weather,voices){
    const profile=profiles[country];if(!profile)throw new RangeError('Unsupported TILO country');
    const period=localPeriod(country,now);
    const observed=typeof weather?.observed_at==='string'?Date.parse(weather.observed_at):NaN;
    const recent=Number.isFinite(observed)&&observed<=now.getTime()+60000&&now.getTime()-observed<=90*60000;
    const wet=recent&&adverseWeather(Number(weather?.weather_code),String(weather?.source||''));
    const slow=period==='night'||period==='evening'||wet;
    return Object.freeze({
      locale:profile.locale,period,rate:slow?0.88:period==='morning'?0.99:0.94,
      pitch:slow?0.91:0.98,volume:1,weather_applied:!!wet,
      // Voice selection never assumes a person's age, sex, or consent.
      voice:selectVoice(voices,profile.locale)
    });
  }
  root.TILODjVoice=Object.freeze({policy,localPeriod,selectVoice,adverseWeather});
})(typeof window!=='undefined'?window:globalThis);
