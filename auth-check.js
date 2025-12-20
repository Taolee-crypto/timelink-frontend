// auth-check.js 파일 생성
(function() {
    'use strict';
    
    // 로그인 페이지는 체크 제외
    if (window.location.pathname.includes('login.html')) {
        return;
    }
    
    // 인증 체크
    const authToken = localStorage.getItem('auth_token');
    const userEmail = localStorage.getItem('user_email');
    
    if (!authToken || !userEmail) {
        console.warn('인증 없음 - 로그인 페이지로 리다이렉트');
        window.location.href = 'login.html?redirect=' + encodeURIComponent(window.location.pathname);
    }
    
    // 토큰 시간 체크
    const tokenTime = localStorage.getItem('token_time');
    if (tokenTime) {
        const tokenAge = Date.now() - parseInt(tokenTime);
        const maxAge = 24 * 60 * 60 * 1000; // 24시간
        
        if (tokenAge > maxAge) {
            localStorage.clear();
            window.location.href = 'login.html?error=session_expired';
        }
    }
})();
