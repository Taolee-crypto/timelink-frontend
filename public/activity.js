// activity.js - 사용자 활동 추적
(function() {
  const user = JSON.parse(localStorage.getItem('tl_user') || 'null');
  if (!user) return;

  const API = 'https://timelink-api.mununglee.workers.dev/api/activity';
  let pageStart = Date.now();
  let currentTrackId = null;

  // 페이지 이탈 시 체류 시간 기록
  window.addEventListener('beforeunload', () => {
    const minutes = Math.floor((Date.now() - pageStart) / 60000);
    if (minutes > 0) {
      navigator.sendBeacon(API, JSON.stringify({
        user_id: user.id,
        type: 'page_view',
        metadata: { page: location.pathname, minutes }
      }));
    }
  });

  // 음악 감상 시작
  window.startListening = (trackId) => {
    currentTrackId = trackId;
    window.listenStart = Date.now();
  };

  window.stopListening = () => {
    if (window.listenStart) {
      const minutes = Math.floor((Date.now() - window.listenStart) / 60000);
      if (minutes > 0) {
        fetch(API, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: user.id,
            type: 'listen_minute',
            metadata: { trackId: currentTrackId, minutes }
          })
        });
      }
      window.listenStart = null;
    }
  };

  // 좋아요 버튼 감지
  document.addEventListener('click', (e) => {
    const likeBtn = e.target.closest('.like-btn');
    if (likeBtn) {
      const trackId = likeBtn.closest('[data-track-id]')?.getAttribute('data-track-id');
      fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.id,
          type: 'like',
          metadata: { trackId }
        })
      });
    }
  });
})();
