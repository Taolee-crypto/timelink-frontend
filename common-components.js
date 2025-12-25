// ============================================
// 인증 시스템 사전 초기화
// ============================================
(function preInitializeAuth() {
    'use strict';
    
    // auth.js가 로드되기 전에 미리 UI 설정
    const authElements = document.querySelectorAll('[data-auth-status]');
    if (authElements.length === 0) return;
    
    // 모든 가능한 토큰 키 확인
    const token = localStorage.getItem('timelink_token') || localStorage.getItem('token');
    const userEmail = localStorage.getItem('timelink_userEmail');
    const nickname = localStorage.getItem('timelink_nickname');
    const balance = localStorage.getItem('timelink_tlBalance') || '10000';
    
    if (token && userEmail) {
        const displayName = nickname || userEmail.split('@')[0];
        authElements.forEach(el => {
            // 최대한 빨리 텍스트 설정
            el.textContent = \\님 (\TL)\;
            el.style.opacity = '1';
            el.style.visibility = 'visible';
        });
    }
})();




// ============================================
// 공통 인증 상태 관리
// ============================================
(function setupCommonAuth() {
    // DOMContentLoaded보다 먼저 실행
    const originalReadyState = document.readyState;
    
    // auth.js가 로드되기 전에 미리 UI 설정
    function preSetupAuthUI() {
        const authElements = document.querySelectorAll('[data-auth-status]');
        if (authElements.length === 0) return;
        
        const token = localStorage.getItem('timelink_token') || localStorage.getItem('token');
        const userStr = localStorage.getItem('timelink_user') || localStorage.getItem('user');
        
        // 로그인 상태면 즉시 업데이트
        if (token && userStr) {
            try {
                const user = JSON.parse(userStr);
                authElements.forEach(el => {
                    // 잠시 텍스트 변경 (깜빡임 방지)
                    const originalText = el.textContent;
                    el.setAttribute('data-original-text', originalText);
                    el.textContent = \\님 (\TL)\;
                    el.href = '#';
                });
            } catch(e) {
                console.warn('Pre-auth setup error:', e);
            }
        }
    }
    
    // 최대한 빨리 실행
    if (originalReadyState === 'loading') {
        document.addEventListener('readystatechange', function onReadyStateChange() {
            if (document.readyState === 'interactive') {
                preSetupAuthUI();
                document.removeEventListener('readystatechange', onReadyStateChange);
            }
        });
    } else {
        preSetupAuthUI();
    }
})();

