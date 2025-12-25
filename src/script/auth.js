// ============================================
// TIMELINK 인증 시스템 - common-components.js 호환
// ============================================

const API_BASE_URL = "https://timelink-api.timelink-api.workers.dev";

// 즉시 실행 - common-components.js보다 먼저 실행되도록
(function initializeAuthSystem() {
    'use strict';
    
    console.log('[Auth System] 초기화 시작');
    
    // 1. 키 이름 호환성 처리
    function migrateLegacyKeys() {
        // 기존 auth.js 키를 common-components.js 키로 마이그레이션
        const oldToken = localStorage.getItem('token');
        const oldUser = localStorage.getItem('user');
        
        if (oldToken && oldUser) {
            try {
                const user = JSON.parse(oldUser);
                localStorage.setItem('timelink_token', oldToken);
                localStorage.setItem('timelink_userEmail', user.email || '');
                localStorage.setItem('timelink_nickname', user.name || '');
                localStorage.setItem('timelink_tlBalance', user.balance || '10000');
                
                // 기존 키 삭제
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                
                console.log('[Auth] 기존 키 마이그레이션 완료');
            } catch (e) {
                console.error('[Auth] 마이그레이션 오류:', e);
            }
        }
    }
    
    // 2. common-components.js의 updateAuthUI 함수 오버라이드
    function overrideCommonAuthFunctions() {
        if (typeof window.updateAuthUI !== 'undefined') {
            // 원본 함수 백업
            const originalUpdateAuthUI = window.updateAuthUI;
            
            // 새로운 함수로 교체
            window.updateAuthUI = function() {
                console.log('[Auth] updateAuthUI 호출됨');
                
                // 먼저 마이그레이션
                migrateLegacyKeys();
                
                // 원래 함수 실행
                originalUpdateAuthUI();
                
                // 추가적인 UI 업데이트
                updateGlobalAuthUI();
            };
            
            console.log('[Auth] common-components.js 함수 오버라이드 완료');
        }
    }
    
    // 3. 글로벌 인증 UI 업데이트
    function updateGlobalAuthUI() {
        // 모든 [data-auth-status] 요소 업데이트
        const authElements = document.querySelectorAll('[data-auth-status]');
        if (authElements.length === 0) return;
        
        const token = localStorage.getItem('timelink_token') || localStorage.getItem('token');
        const userEmail = localStorage.getItem('timelink_userEmail');
        const nickname = localStorage.getItem('timelink_nickname');
        const balance = localStorage.getItem('timelink_tlBalance') || '10000';
        
        if (token && userEmail) {
            const displayName = nickname || userEmail.split('@')[0];
            authElements.forEach(el => {
                el.innerHTML = \\님 (\TL)\;
                el.href = '#';
                el.onclick = function(e) {
                    e.preventDefault();
                    performLogout();
                };
                // 스타일 적용
                el.style.cssText += '; opacity: 1 !important; visibility: visible !important; color: #6C63FF !important;';
            });
        } else {
            authElements.forEach(el => {
                el.innerHTML = '로그인';
                el.href = 'login.html';
                el.onclick = null;
                el.style.cssText += '; opacity: 1 !important; visibility: visible !important;';
            });
        }
    }
    
    // 4. 최초 실행
    function initialSetup() {
        migrateLegacyKeys();
        overrideCommonAuthFunctions();
        
        // DOM이 준비되면 UI 업데이트
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                setTimeout(updateGlobalAuthUI, 0);
            });
        } else {
            setTimeout(updateGlobalAuthUI, 0);
        }
    }
    
    // 실행
    initialSetup();
    
    // 로그아웃 함수
    window.performLogout = function() {
        // 모든 인증 키 삭제
        localStorage.removeItem('timelink_token');
        localStorage.removeItem('timelink_userEmail');
        localStorage.removeItem('timelink_nickname');
        localStorage.removeItem('timelink_tlBalance');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        alert('로그아웃 되었습니다.');
        window.location.href = 'index.html';
    };
    
    console.log('[Auth System] 초기화 완료');
})();

// ============================================
// API 함수들 (common-components.js와 독립적)
// ============================================

async function loginUser(email, password) {
    try {
        const response = await fetch(API_BASE_URL + '/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (data.success) {
            // common-components.js 형식으로 저장
            localStorage.setItem('timelink_token', data.token);
            localStorage.setItem('timelink_userEmail', email);
            localStorage.setItem('timelink_nickname', data.user?.name || email.split('@')[0]);
            localStorage.setItem('timelink_tlBalance', data.user?.balance || '10000');
            
            // auth.js 형식으로도 저장 (호환성)
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            // UI 업데이트
            if (typeof window.updateAuthUI === 'function') {
                window.updateAuthUI();
            }
            
            // 페이지 이동
            setTimeout(() => window.location.href = 'index.html', 100);
            
            return { success: true, user: data.user };
        } else {
            return { success: false, error: data.error };
        }
    } catch (error) {
        console.error('로그인 오류:', error);
        return { success: false, error: '서버 연결 실패' };
    }
}

async function signupUser(email, password, name) {
    try {
        const response = await fetch(API_BASE_URL + '/api/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password, name })
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('회원가입 오류:', error);
        return { success: false, error: '서버 연결 실패' };
    }
}

async function verifyEmail(email, verificationCode) {
    try {
        const response = await fetch(API_BASE_URL + '/api/auth/verify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, verificationCode })
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('이메일 인증 오류:', error);
        return { success: false, error: '서버 연결 실패' };
    }
}

// 글로벌 노출
window.auth = {
    loginUser,
    signupUser,
    verifyEmail,
    logout: window.performLogout
};

// common-components.js의 logout 함수 오버라이드
if (typeof window.logout !== 'undefined') {
    window.logout = window.performLogout;
}

console.log('[Auth System] 모든 함수 로드 완료');
