// ============================================
// TIMELINK 통합 인증 시스템 (common-components 호환)
// ============================================

const API_BASE_URL = "https://timelink-api.timelink-api.workers.dev";

// 글로벌 인증 상태
window.__TIMELINK_AUTH = {
    initialized: false,
    user: null,
    token: null
};

// 즉시 실행 - 모든 스크립트보다 먼저
(function() {
    'use strict';
    
    console.log('[Timelink Auth] 초기화 시작');
    
    // 1. 가장 빠른 타이밍에 UI 설정
    function setImmediateAuthUI() {
        const authElements = document.querySelectorAll('[data-auth-status], .auth-status, #loginBtn, #logoutBtn');
        
        if (authElements.length > 0) {
            const token = localStorage.getItem('timelink_token') || localStorage.getItem('token');
            const userStr = localStorage.getItem('timelink_user') || localStorage.getItem('user');
            
            if (token && userStr) {
                try {
                    const user = JSON.parse(userStr);
                    authElements.forEach(el => {
                        // 즉시 텍스트 변경
                        el.textContent = \\님 (\TL)\;
                        el.href = '#';
                        el.style.opacity = '1';
                        el.style.visibility = 'visible';
                    });
                    
                    // 글로벌 상태 업데이트
                    window.__TIMELINK_AUTH.user = user;
                    window.__TIMELINK_AUTH.token = token;
                    
                } catch (e) {
                    console.error('[Timelink Auth] 사용자 데이터 오류:', e);
                }
            }
        }
    }
    
    // 실행 (최대한 빨리)
    if (document.body) {
        setImmediateAuthUI();
    } else {
        // body가 없으면 MutationObserver로 대기
        const observer = new MutationObserver(function(mutations) {
            for (let mutation of mutations) {
                if (mutation.type === 'childList' && document.body) {
                    setImmediateAuthUI();
                    observer.disconnect();
                    break;
                }
            }
        });
        observer.observe(document.documentElement, { childList: true });
    }
})();

// 나머지 API 함수들...
async function loginUser(email, password) {
    // ... 기존 loginUser 코드
}

// common-components.js와의 호환성
if (typeof window.commonAuth !== 'undefined') {
    console.log('[Timelink Auth] common-components.js와 통합됨');
    // 기존 commonAuth 함수를 새 시스템으로 대체
    window.commonAuth = {
        login: loginUser,
        logout: function() {
            localStorage.removeItem('timelink_token');
            localStorage.removeItem('timelink_user');
            window.location.reload();
        },
        getUser: function() {
            return window.__TIMELINK_AUTH.user;
        }
    };
}

console.log('[Timelink Auth] 시스템 로드 완료');
