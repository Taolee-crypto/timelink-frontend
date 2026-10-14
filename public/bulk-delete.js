/*! bulk-delete.js — Bulk deletion helper for Dashboard */
(function(global){
  'use strict';

  global.deleteSelected = async function(){
    // Check the selected assets
    var sel = global._contentSelectedIds || [];
    if(!sel || !sel.length){
      alert('No TL3 assets are selected.');
      return;
    }

    if(!confirm('Permanently delete ' + sel.length + ' selected TL3 asset(s)?\n\nThis action cannot be undone.')) return;

    var API_BASE = (typeof global.API !== 'undefined') ? global.API : 'https://api.timelink.digital';
    var token = localStorage.getItem('tl_token') || '';
    var ids = sel.slice();
    var ok = 0, fail = 0;
    var failedIds = [];

    for(var i = 0; i < ids.length; i++){
      try {
        var r = await fetch(API_BASE + '/api/shares/' + ids[i], {
          method: 'DELETE',
          headers: {'Authorization': 'Bearer ' + token}
        });
        if(r.ok){
          ok++;
        } else {
          fail++;
          failedIds.push(ids[i]);
          var d = await r.json().catch(function(){ return {}; });
          console.warn('[Delete failed]', ids[i], r.status, d);
        }
      } catch(e){
        fail++;
        failedIds.push(ids[i]);
        console.warn('[Delete error]', ids[i], e);
      }
    }

    var msg = ok + ' asset(s) deleted' + (fail ? ' / ' + fail + ' failed' : '');
    if(typeof global.toast === 'function'){
      global.toast(msg, ok ? 'success' : 'error');
    } else {
      alert(msg);
    }

    // Clear the selection
    if(typeof global._contentSelectedIds !== 'undefined'){
      global._contentSelectedIds = [];
    }

    // Refresh the asset list
    setTimeout(function(){ location.reload(); }, 800);
  };

  console.log('[bulk-delete] deleteSelected is ready');
})(window);
