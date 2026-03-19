/* ══════════════════════════════════════════════════════════
   TimeLink 자동 번역 모듈 (auto_translate.js)
   
   동작 방식:
   1. 한국어 감지 (유니코드 범위 AC00-D7A3)
   2. /api/translate로 일괄 번역 요청
   3. D1 캐시 → 다음 요청 즉시 응답
   4. MutationObserver로 동적 DOM도 자동 번역
   5. TLi18n.t()로 커버 안된 텍스트 보완
══════════════════════════════════════════════════════════ */
(function(){
  'use strict';

  var API_BASE = 'https://api.timelink.digital';
  var SKIP_TAGS = new Set(['SCRIPT','STYLE','CODE','PRE','NOSCRIPT','IFRAME','SVG']);
  var _cache = {};          // 세션 메모리 캐시
  var _pending = {};        // 진행 중인 번역 키
  var _batchQueue = [];     // 배치 큐
  var _batchTimer = null;
  var _currentLang = 'ko';
  var _observer = null;
  var _isTranslating = false;

  // 한국어 텍스트 감지
  function hasKorean(text){
    return /[\uAC00-\uD7A3]/.test(text);
  }

  // 배치 번역 실행
  async function flushBatch(){
    if(_batchQueue.length === 0) return;
    if(_currentLang === 'ko') { _batchQueue = []; return; }

    var batch = _batchQueue.splice(0, 50); // 50개씩
    var toTranslate = batch.filter(function(item){
      return !_cache[_currentLang + ':' + item.text];
    });
    if(toTranslate.length === 0) {
      batch.forEach(function(item){ applyTranslation(item.node, item.text); });
      return;
    }

    try {
      var r = await fetch(API_BASE + '/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          texts: toTranslate.map(function(i){ return i.text; }),
          target: _currentLang
        })
      });
      var d = await r.json();
      if(d.ok && d.translations){
        d.translations.forEach(function(translated, idx){
          var key = _currentLang + ':' + toTranslate[idx].text;
          _cache[key] = translated;
        });
      }
    } catch(e){ /* 실패 시 원문 유지 */ }

    // 번역 적용
    batch.forEach(function(item){ applyTranslation(item.node, item.text); });
  }

  // 번역 적용
  function applyTranslation(node, original){
    if(!node || !node.parentNode) return;
    var key = _currentLang + ':' + original;
    var translated = _cache[key];
    if(translated && node.nodeType === 3){
      node.textContent = translated;
    }
  }

  // 텍스트 노드 번역 예약
  function scheduleTranslation(node){
    var text = node.textContent && node.textContent.trim();
    if(!text || !hasKorean(text)) return;
    var key = _currentLang + ':' + text;
    if(_cache[key]){
      node.textContent = _cache[key]; return;
    }
    _batchQueue.push({ node, text });
    if(!_batchTimer){
      _batchTimer = setTimeout(function(){
        _batchTimer = null;
        flushBatch();
      }, 100);
    }
  }

  // DOM 전체 스캔
  function scanDOM(root){
    if(_currentLang === 'ko') return;
    var walker = document.createTreeWalker(
      root || document.body,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: function(node){
          var p = node.parentElement;
          if(!p) return NodeFilter.FILTER_REJECT;
          if(SKIP_TAGS.has(p.tagName)) return NodeFilter.FILTER_REJECT;
          if(p.hasAttribute('data-i18n')) return NodeFilter.FILTER_REJECT; // 이미 처리됨
          if(p.hasAttribute('data-notranslate')) return NodeFilter.FILTER_REJECT;
          var text = node.textContent && node.textContent.trim();
          if(!text || !hasKorean(text)) return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
        }
      }
    );
    var node;
    while((node = walker.nextNode())){
      scheduleTranslation(node);
    }
  }

  // 언어 변경
  function setLang(lang){
    if(lang === _currentLang) return;
    _currentLang = lang;
    _cache = {}; // 캐시 초기화 (언어 변경)
    if(lang !== 'ko'){
      setTimeout(function(){ scanDOM(); }, 300);
    } else {
      // 한국어로 복원: 페이지 리로드가 가장 확실
      window.location.reload();
    }
  }

  // MutationObserver - 동적 DOM 변화 감지
  function startObserver(){
    if(_observer) return;
    _observer = new MutationObserver(function(mutations){
      if(_currentLang === 'ko') return;
      mutations.forEach(function(m){
        m.addedNodes.forEach(function(node){
          if(node.nodeType === 3){
            scheduleTranslation(node);
          } else if(node.nodeType === 1){
            scanDOM(node);
          }
        });
      });
    });
    _observer.observe(document.body, {
      childList: true, subtree: true, characterData: false
    });
  }

  // TLi18n.setLang 후킹 - 언어 변경 감지
  function hookTLi18n(){
    if(typeof window.TLi18n === 'undefined') {
      setTimeout(hookTLi18n, 100); return;
    }
    var origSetLang = window.TLi18n.setLang;
    window.TLi18n.setLang = function(lang){
      origSetLang.call(window.TLi18n, lang);
      setLang(lang);
    };
    // 현재 언어 감지
    _currentLang = window.TLi18n.getLang() || localStorage.getItem('tl_lang') || 'ko';
    if(_currentLang !== 'ko'){
      setTimeout(function(){ scanDOM(); }, 500);
    }
  }

  // 초기화
  function init(){
    startObserver();
    hookTLi18n();
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.TLAutoTranslate = { setLang, scanDOM };
})();
