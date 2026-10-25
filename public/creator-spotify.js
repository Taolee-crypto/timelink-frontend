(function(global){
 'use strict';
 function applyFields(track,get){
  [['title',track.title],['artist',track.artist],['album',track.album],['rightsIsrc',track.isrc||''],['rightsSourcePlatform','Spotify'],['rightsSourceReference',track.spotify_url||'']].forEach(function(pair){var node=get(pair[0]);if(node)node.value=pair[1]||'';});
  if(Array.isArray(track.genres)&&track.genres.length&&get('genre'))get('genre').value=track.genres.join(', ');
 }
 function showDetails(root,track,t){
  var details=document.createElement('details'),summary=document.createElement('summary');
  summary.textContent=t('creator.spotify.details');details.appendChild(summary);
  var dl=document.createElement('dl');dl.style.cssText='display:grid;grid-template-columns:minmax(90px,auto) 1fr;gap:7px 12px;margin:12px 0;word-break:break-word';
  var rows=[['ISRC',track.isrc],['UPC',track.upc],['EAN',track.ean],['creator.spotify.release',track.release_date],['creator.spotify.label',track.label],['creator.spotify.length',Number.isFinite(track.duration_ms)?Math.floor(track.duration_ms/60000)+':'+String(Math.floor(track.duration_ms/1000)%60).padStart(2,'0'):null],['creator.spotify.trackNo',[track.disc_number,track.track_number].filter(function(x){return x!=null}).join(' / ')],['creator.spotify.totalTracks',track.total_tracks],['creator.spotify.genres',(track.genres||[]).join(', ')],['creator.spotify.explicit',typeof track.explicit==='boolean'?t(track.explicit?'creator.spotify.yes':'creator.spotify.no'):null],['creator.spotify.copyrights',(track.copyrights||[]).map(function(c){return [c.type,c.text].filter(Boolean).join(' ')}).join(' · ')],['creator.spotify.artists',(track.artists||[]).map(function(a){return a.name}).join(', ')]];
  rows.forEach(function(pair){var dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=pair[0].indexOf('.')>=0?t(pair[0]):pair[0];dd.textContent=pair[1]!=null&&pair[1]!==''?String(pair[1]):t('creator.spotify.notProvided');dd.style.margin='0';dl.append(dt,dd);});details.appendChild(dl);
  if(/^https:\/\/open\.spotify\.com\/track\/[A-Za-z0-9]+(?:[/?#]|$)/.test(track.spotify_url||'')){var link=document.createElement('a');link.href=track.spotify_url;link.target='_blank';link.rel='noopener noreferrer';link.textContent=t('creator.spotify.open');details.appendChild(link);}
  if(track.catalogue){var all=document.createElement('details'),label=document.createElement('summary'),pre=document.createElement('pre');label.textContent=t('creator.spotify.allMetadata');pre.textContent=JSON.stringify(track.catalogue,null,2);pre.style.cssText='white-space:pre-wrap;overflow-wrap:anywhere;max-height:350px;overflow:auto;font-size:11px';all.append(label,pre);details.appendChild(all);}
  root.appendChild(details);
 }
 global.TimeLinkCreatorSpotify={applyFields:applyFields,showDetails:showDetails};
})(window);
