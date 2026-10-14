/*! bulk-delete.js — 선택 항목 일괄 삭제 (dashboard 보조) */
(function(global){
  'use strict';

  global.deleteSelected = async function(){
    // 선택 항목 확인
    var sel = global._contentSelectedIds || [];
    if(!sel || !sel.length){
      alert('선택된 곡이 없습니다.');
      return;
    }

    if(!confirm(sel.length + '개 곡을 완전히 삭제하시겠습니까?\n\n(복구 불가)')) return;

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
          console.warn('[삭제 실패]', ids[i], r.status, d);
        }
      } catch(e){
        fail++;
        failedIds.push(ids[i]);
        console.warn('[삭제 오류]', ids[i], e);
      }
    }

    var msg = ok + '개 삭제 완료' + (fail ? ' / ' + fail + '개 실패' : '');
    if(typeof global.toast === 'function'){
      global.toast(msg, ok ? 'success' : 'error');
    } else {
      alert(msg);
    }

    // 선택 초기화
    if(typeof global._contentSelectedIds !== 'undefined'){
      global._contentSelectedIds = [];
    }

    // 새로고침
    setTimeout(function(){ location.reload(); }, 800);
  };

  console.log('[bulk-delete] deleteSelected 등록됨');
})(window);
