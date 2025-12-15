// 페이지 연결 맵
const PAGE_MAP = {
    // 메인
    HOME: '/index.html',
    
    // TL Studio 시스템
    STUDIO: '/studio.html',
    STUDIO_CONVERTER: '/studio.html#converter',
    STUDIO_PLAYER: '/studio.html#player',
    STUDIO_LIBRARY: '/studio.html#library',
    
    // 마켓플레이스
    MUSIC_MARKET: '/p2p-music.html',
    VIDEO_MARKET: '/tltube.html',
    P2P_QUEUE: '/p2p-queue.html',
    
    // 인증/계정
    LOGIN: '/login.html',
    SIGNUP: '/signup-verification.html',
    DASHBOARD: '/dashboard.html',
    
    // 유틸리티
    TEST_API: '/test-api.html'
};

// 페이지 이동 함수
window.goToPage = function(pageKey) {
    if (PAGE_MAP[pageKey]) {
        window.location.href = PAGE_MAP[pageKey];
    } else {
        console.error('페이지 키를 찾을 수 없음:', pageKey);
    }
};

console.log('✅ 페이지 연결 시스템 로드 완료');
