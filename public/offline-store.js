/*! offline-store.js — TimeLink 오프라인 저장소
 *  웹: IndexedDB / 앱: Capacitor FS / 데스크톱: Electron FS
 *  통일 인터페이스: TL3OfflineStore
 */
(function(global){
  'use strict';
  var DB_NAME = 'timelink-offline';
  var DB_VER = 1;
  var _db = null;

  function open(){
    return new Promise(function(res, rej){
      if(_db) return res(_db);
      var req = indexedDB.open(DB_NAME, DB_VER);
      req.onupgradeneeded = function(e){
        var db = e.target.result;
        if(!db.objectStoreNames.contains('tracks')) db.createObjectStore('tracks', {keyPath:'fileId'});
        if(!db.objectStoreNames.contains('segments')) db.createObjectStore('segments', {keyPath:['fileId','n']});
        if(!db.objectStoreNames.contains('ledger')) db.createObjectStore('ledger', {keyPath:'fileId'});
      };
      req.onsuccess = function(){ _db = req.result; res(_db); };
      req.onerror = function(){ rej(req.error); };
    });
  }

  async function save(fileId, pkg){
    var db = await open();
    return new Promise(function(res, rej){
      var tx = db.transaction(['tracks','segments','ledger'], 'readwrite');
      var tr = tx.objectStore('tracks');
      var sr = tx.objectStore('segments');
      var lr = tx.objectStore('ledger');
      tr.put({
        fileId: String(fileId),
        header: pkg.header,
        meta: pkg.meta || {},
        savedAt: Date.now(),
        size: (pkg.segments || []).reduce(function(a,s){ return a + (s.ciphertext ? s.ciphertext.byteLength : 0); }, 0)
      });
      (pkg.segments || []).forEach(function(seg){
        sr.put({ fileId: String(fileId), n: seg.n, ciphertext: seg.ciphertext, durationMs: seg.durationMs || 5000 });
      });
      lr.put({ fileId: String(fileId), licN: pkg.licNStart || 0, consumed: 0, lastSyncAt: Date.now() });
      tx.oncomplete = function(){ res(true); };
      tx.onerror = function(){ rej(tx.error); };
    });
  }

  async function load(fileId){
    var db = await open();
    return new Promise(function(res, rej){
      var tx = db.transaction(['tracks','segments','ledger'], 'readonly');
      var out = { fileId: String(fileId), header: null, meta: null, segments: [], ledger: null };
      tx.objectStore('tracks').get(String(fileId)).onsuccess = function(e){
        if(e.target.result){ out.header = e.target.result.header; out.meta = e.target.result.meta; }
      };
      tx.objectStore('segments').getAll(IDBKeyRange.bound([String(fileId), -1], [String(fileId), 1e9]))
        .onsuccess = function(e){ out.segments = (e.target.result || []).sort(function(a,b){ return a.n - b.n; }); };
      tx.objectStore('ledger').get(String(fileId)).onsuccess = function(e){ out.ledger = e.target.result; };
      tx.oncomplete = function(){ res(out); };
      tx.onerror = function(){ rej(tx.error); };
    });
  }

  async function getSegment(fileId, n){
    var db = await open();
    return new Promise(function(res, rej){
      var tx = db.transaction('segments', 'readonly');
      tx.objectStore('segments').get([String(fileId), n]).onsuccess = function(e){ res(e.target.result || null); };
      tx.onerror = function(){ rej(tx.error); };
    });
  }

  async function list(){
    var db = await open();
    return new Promise(function(res, rej){
      var tx = db.transaction('tracks', 'readonly');
      tx.objectStore('tracks').getAll().onsuccess = function(e){ res(e.target.result || []); };
      tx.onerror = function(){ rej(tx.error); };
    });
  }

  async function remove(fileId){
    var db = await open();
    return new Promise(function(res, rej){
      var tx = db.transaction(['tracks','segments','ledger'], 'readwrite');
      tx.objectStore('tracks').delete(String(fileId));
      tx.objectStore('ledger').delete(String(fileId));
      tx.objectStore('segments').delete(IDBKeyRange.bound([String(fileId), -1], [String(fileId), 1e9]));
      tx.oncomplete = function(){ res(true); };
      tx.onerror = function(){ rej(tx.error); };
    });
  }

  async function bumpLedger(fileId){
    var db = await open();
    return new Promise(function(res, rej){
      var tx = db.transaction('ledger', 'readwrite');
      var store = tx.objectStore('ledger');
      store.get(String(fileId)).onsuccess = function(e){
        var cur = e.target.result;
        if(!cur) return rej(new Error('ledger not found'));
        cur.licN = (cur.licN || 0) + 1;
        cur.consumed = (cur.consumed || 0) + 1;
        store.put(cur);
      };
      tx.oncomplete = function(){ res(true); };
      tx.onerror = function(){ rej(tx.error); };
    });
  }

  async function getLedger(fileId){
    var db = await open();
    return new Promise(function(res, rej){
      var tx = db.transaction('ledger', 'readonly');
      tx.objectStore('ledger').get(String(fileId)).onsuccess = function(e){ res(e.target.result || null); };
      tx.onerror = function(){ rej(tx.error); };
    });
  }

  async function stats(){
    var items = await list();
    var totalSize = items.reduce(function(a,x){ return a + (x.size||0); }, 0);
    return { count: items.length, totalSize: totalSize, items: items };
  }

  global.TL3OfflineStore = {
    save: save, load: load, getSegment: getSegment, list: list,
    remove: remove, bumpLedger: bumpLedger, getLedger: getLedger,
    stats: stats, _open: open
  };
})(window);
