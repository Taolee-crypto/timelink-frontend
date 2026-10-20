/* TimeLink page-specific visual scene loader — presentation only */
(function(){
  'use strict';
  if(window.__TL_SCENE_LAYER__) return;
  window.__TL_SCENE_LAYER__ = true;
  var path = (location.pathname || '/').toLowerCase();
  var hint = '';
  try {
    var q = new URLSearchParams(location.search);
    hint = [q.get('type'),q.get('format'),q.get('file_type'),q.get('asset_type')].filter(Boolean).join(' ').toUpperCase();
  } catch(e) {}
  var scene = '';
  if (/TLJ/.test(hint)) scene='art';
  else if (/TL4/.test(hint)) scene='video';
  else if (/TLD/.test(hint)) scene='office';
  else if (/TL3/.test(hint)) scene='music';
  else if (/tlj|art|gallery/.test(path)) scene='art';
  else if (/tl4|video|player-host/.test(path)) scene='video';
  else if (/tld|document|download|terms|privacy|policy|renewal\\/files/.test(path)) scene='office';
  else if (/cafe-world|my-car-world/.test(path)) scene='community';
  else if (/advertiser|ads|b2b/.test(path)) scene='campaign';
  else if (/wallet|dashboard/.test(path)) scene='office';
  else if (/cafe-channel|incar-channel|cafe-radio|cafe-studio|incar-studio|incar|dj-center|dj-console|dj-guide|radio|chart|renewal\\/music|renewal\\/shareplace|shareplace|track|tl3-player|creator/.test(path)) scene='music';
  else scene='community';

  document.body.setAttribute('data-tl-scene',scene);
  var css=document.createElement('link');
  css.rel='stylesheet';css.href='/tl-scene.css?v=20261020h';
  document.head.appendChild(css);
})();
