// src/script/common-components.js
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔧 공통 컴포넌트 초기화 시작');
    
    // 네비게이션 바 삽입
    loadNavigationBar();
    
    // 인증 상태 체크
    checkAuthStatus();
    
    // 페이지별 초기화
    initPageSpecificComponents();
});

function loadNavigationBar() {
    const navContainer = document.getElementById('nav-container');
    if (!navContainer) return;
    
    const currentPage = window.location.pathname.split('/').pop();
    
    navContainer.innerHTML = `
        <nav class="main-navbar navbar navbar-expand-lg fixed-top">
            <div class="container-fluid">
                <!-- 로고 -->
                <a class="navbar-brand" href="index.html">
                    <div class="d-flex align-items-center gap-2">
                        <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #6C63FF, #36D1DC); border-radius: 12px; display: flex; align-items: center; justify-content: center;">
                            <i class="bi bi-currency-exchange text-white"></i>
                        </div>
                        <span class="fw-bold fs-3" style="background: linear-gradient(135deg, #6C63FF, #36D1DC); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                            Deconomic
                        </span>
                    </div>
                </a>
                
                <!-- 모바일 토글 -->
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNavbar">
                    <span class="navbar-toggler-icon"></span>
                </button>
                
                <!-- 메뉴 - PROFILE 제거됨 -->
                <div class="collapse navbar-collapse" id="mainNavbar">
                    <!-- 메인 메뉴 -->
                    <div class="navbar-nav mx-auto">
                        <a href="studio.html" class="nav-menu-item ${currentPage === 'studio.html' ? 'active' : ''}">
                            <i class="bi bi-music-note-beamed me-1"></i> STUDIO
                        </a>
                        <a href="marketplace.html" class="nav-menu-item ${currentPage === 'marketplace.html' ? 'active' : ''}">
                            <i class="bi bi-shop me-1"></i> Marketplace
                        </a>
                        <a href="tltube.html" class="nav-menu-item ${currentPage === 'tltube.html' ? 'active' : ''}">
                            <i class="bi bi-play-circle me-1"></i> TLTube
                        </a>
                        <a href="dashboard.html" class="nav-menu-item ${currentPage === 'dashboard.html' ? 'active' : ''}">
                            <i class="bi bi-speedometer2 me-1"></i> Dashboard
                        </a>
                        <a href="charge.html" class="nav-menu-item ${currentPage === 'charge.html' ? 'active' : ''}">
                            <i class="bi bi-lightning-charge me-1"></i> Charge
                        </a>
                        <!-- PROFILE 메뉴는 여기서 제거됨, 사용자 드롭다운으로 이동 -->
                    </div>
                    
                    <!-- 사용자 영역 -->
                    <div class="auth-section" id="authSection">
                        <!-- JavaScript로 채워짐 -->
                    </div>
                </div>
            </div>
        </nav>
    `;
    
    // 네비게이션 스타일 추가
    const style = document.createElement('style');
    style.textContent = `
        .main-navbar {
            background: rgba(255, 255, 255, 0.98) !important;
            backdrop-filter: blur(10px) !important;
            border-bottom: 1px solid rgba(108, 99, 255, 0.1) !important;
            box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1) !important;
            padding: 0 !important;
        }
        
        .nav-menu-item {
            color: #333 !important;
            font-weight: 500 !important;
            padding: 0.8rem 1.2rem !important;
            margin: 0 0.2rem !important;
            border-radius: 10px !important;
            transition: all 0.3s ease !important;
            text-decoration: none !important;
            display: inline-block !important;
        }
        
        .nav-menu-item:hover {
            background: rgba(108, 99, 255, 0.1) !important;
            color: #6C63FF !important;
            transform: translateY(-2px) !important;
        }
        
        .nav-menu-item.active {
            background: linear-gradient(135deg, #6C63FF, #36D1DC) !important;
            color: white !important;
        }
        
        .auth-section {
            margin-left: auto !important;
            display: flex !important;
            align-items: center !important;
            gap: 10px !important;
        }
        
        .user-avatar-small {
            width: 36px;
            height: 36px;
            background: linear-gradient(135deg, #6C63FF, #36D1DC);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 16px;
        }
        
        .tl-balance-badge {
            background: linear-gradient(135deg, rgba(108, 99, 255, 0.1), rgba(54, 209, 220, 0.1));
            color: #6C63FF;
            padding: 0.4rem 0.8rem;
            border-radius: 20px;
            font-weight: 600;
            font-size: 0.85rem;
            border: 1px solid rgba(108, 99, 255, 0.2);
        }
        
        .auth-btn {
            padding: 0.6rem 1.2rem !important;
            border-radius: 10px !important;
            font-weight: 500 !important;
            text-decoration: none !important;
            transition: all 0.3s ease !important;
            display: inline-flex !important;
            align-items: center !important;
            gap: 8px !important;
        }
        
        .btn-login {
            border: 2px solid #6C63FF !important;
            color: #6C63FF !important;
            background: transparent !important;
        }
        
        .btn-login:hover {
            background: #6C63FF !important;
            color: white !important;
        }
        
        .btn-signup {
            background: linear-gradient(135deg, #6C63FF, #36D1DC) !important;
            color: white !important;
            border: none !important;
        }
        
        .btn-signup:hover {
            transform: translateY(-2px) !important;
            box-shadow: 0 5px 15px rgba(108, 99, 255, 0.3) !important;
        }
        
        /* 사용자 프로필 드롭다운 */
        .user-profile-dropdown {
            min-width: 240px !important;
            border: 1px solid rgba(108, 99, 255, 0.1) !important;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15) !important;
            border-radius: 12px !important;
            overflow: hidden !important;
        }
        
        .user-profile-dropdown .dropdown-item {
            padding: 0.7rem 1rem !important;
            border-radius: 8px !important;
            margin: 0.2rem 0.5rem !important;
            transition: all 0.2s ease !important;
        }
        
        .user-profile-dropdown .dropdown-item:hover {
            background: rgba(108, 99, 255, 0.1) !important;
            color: #6C63FF !important;
        }
        
        .user-profile-dropdown hr {
            margin: 0.5rem 0 !important;
            opacity: 0.2 !important;
        }
    `;
    document.head.appendChild(style);
}

function updateAuthUI() {
    const authSection = document.getElementById('authSection');
    if (!authSection) return;
    
    const token = localStorage.getItem('timelink_token');
    const userEmail = localStorage.getItem('timelink_userEmail');
    const nickname = localStorage.getItem('timelink_nickname');
    
    if (token && userEmail) {
        const displayName = nickname || userEmail.split('@')[0];
        const avatarLetter = displayName.charAt(0).toUpperCase();
        
        authSection.innerHTML = `
            <div class="dropdown">
                <button class="btn p-0 border-0 d-flex align-items-center" type="button" data-bs-toggle="dropdown">
                    <div class="user-avatar-small me-2">${avatarLetter}</div>
                    <div class="text-start me-2 d-none d-md-block">
                        <div class="fw-bold" style="font-size: 0.9rem;">${displayName}</div>
                        <div class="text-muted" style="font-size: 0.75rem;">${userEmail}</div>
                    </div>
                    <i class="bi bi-chevron-down"></i>
                </button>
                <div class="dropdown-menu dropdown-menu-end user-profile-dropdown">
                    <div class="px-3 py-2">
                        <div class="fw-bold mb-1">${displayName}</div>
                        <div class="text-muted small mb-2">${userEmail}</div>
                        <div class="tl-balance-badge mb-3">
                            <i class="bi bi-wallet2 me-1"></i> TL: ${localStorage.getItem('timelink_tlBalance') || '10000'}
                        </div>
                    </div>
                    <hr class="my-1">
                    <!-- PROFILE 메뉴가 사용자 드롭다운으로 이동 -->
                    <a class="dropdown-item" href="profile.html">
                        <i class="bi bi-person-circle me-2"></i>프로필
                    </a>
                    <a class="dropdown-item" href="dashboard.html">
                        <i class="bi bi-speedometer2 me-2"></i>대시보드
                    </a>
                    <a class="dropdown-item" href="charge.html">
                        <i class="bi bi-lightning-charge me-2"></i>TL 충전
                    </a>
                    <a class="dropdown-item" href="studio.html">
                        <i class="bi bi-music-note-beamed me-2"></i>STUDIO
                    </a>
                    <hr class="my-1">
                    <button class="dropdown-item text-danger" onclick="logout()">
                        <i class="bi bi-box-arrow-right me-2"></i>로그아웃
                    </button>
                </div>
            </div>
        `;
    } else {
        authSection.innerHTML = `
            <div class="d-flex gap-2">
                <a href="login.html" class="auth-btn btn-login">
                    <i class="bi bi-box-arrow-in-right"></i>
                    <span class="d-none d-md-inline">로그인</span>
                </a>
                <a href="signup.html" class="auth-btn btn-signup">
                    <i class="bi bi-person-plus"></i>
                    <span class="d-none d-md-inline">회원가입</span>
                </a>
            </div>
        `;
    }
}

function checkAuthStatus() {
    const token = localStorage.getItem('timelink_token');
    const userEmail = localStorage.getItem('timelink_userEmail');
    
    if (!token || !userEmail) {
        // 비로그인 상태에서는 studio.html 접근 제한
        if (window.location.pathname.includes('studio.html') || 
            window.location.pathname.includes('dashboard.html') ||
            window.location.pathname.includes('charge.html')) {
            window.location.href = 'login.html';
            return;
        }
    } else {
        // 로그인 상태에서는 login.html, signup.html 접근 제한
        if (window.location.pathname.includes('login.html') || 
            window.location.pathname.includes('signup.html')) {
            window.location.href = 'index.html';
            return;
        }
    }
    
    updateAuthUI();
}

function logout() {
    localStorage.removeItem('timelink_token');
    localStorage.removeItem('timelink_userEmail');
    localStorage.removeItem('timelink_nickname');
    localStorage.removeItem('timelink_tlBalance');
    alert('로그아웃 되었습니다.');
    updateAuthUI();
    window.location.href = 'index.html';
}

// TL 잔액 표시 업데이트
function updateTLBalanceInNav() {
    const tlBalance = localStorage.getItem('timelink_tlBalance') || '10000';
    const tlElements = document.querySelectorAll('.tl-balance-badge, .tl-balance-display');
    
    tlElements.forEach(element => {
        if (element.querySelector('span')) {
            element.querySelector('span').textContent = `${parseInt(tlBalance).toLocaleString()} TL`;
        } else {
            element.textContent = `${parseInt(tlBalance).toLocaleString()} TL`;
        }
    });
}

// 페이지별 초기화에 TL 잔액 업데이트 추가
function initPageSpecificComponents() {
    const currentPage = window.location.pathname.split('/').pop();
    
    switch(currentPage) {
        case 'index.html':
            initHomePage();
            break;
        case 'studio.html':
            initStudioPage();
            break;
        case 'dashboard.html':
            initDashboardPage();
            break;
        case 'marketplace.html':
            initMarketplacePage();
            break;
        case 'charge.html':
            initChargePage();
            break;
    }
    
    // TL 잔액 업데이트
    updateTLBalanceInNav();
}

function initMarketplacePage() {
    console.log('🛒 마켓플레이스 페이지 초기화');
}

function initChargePage() {
    console.log('💰 충전 페이지 초기화');
}

function initHomePage() {
    // 홈페이지 초기화
    console.log('🏠 홈페이지 초기화');
    
    // 카운터 애니메이션
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target') || 0;
        if (target === 0) return;
        
        const increment = target / 100;
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.floor(current).toLocaleString();
                setTimeout(updateCounter, 20);
            } else {
                counter.textContent = target.toLocaleString();
            }
        };
        
        updateCounter();
    });
}

function initStudioPage() {
    // STUDIO 페이지 초기화
    console.log('🎵 STUDIO 페이지 초기화');
}

function initDashboardPage() {
    // 대시보드 페이지 초기화
    console.log('📊 대시보드 페이지 초기화');
}

// ============================================
// 인증 시스템 사전 초기화
// ============================================
(function preInitializeAuth() {
    'use strict';
    
    // auth.js가 로드되기 전에 미리 UI 설정
    const authElements = document.querySelectorAll('[data-auth-status]');
    if (authElements.length > 0) {
        // 모든 가능한 토큰 키 확인
        const token = localStorage.getItem('timelink_token') || localStorage.getItem('token');
        const userEmail = localStorage.getItem('timelink_userEmail');
        const nickname = localStorage.getItem('timelink_nickname');
        const balance = localStorage.getItem('timelink_tlBalance') || '10000';
        
        if (token && userEmail) {
            const displayName = nickname || userEmail.split('@')[0];
            const displayBalance = parseInt(balance).toLocaleString();
            
            authElements.forEach(el => {
                // 최대한 빨리 텍스트 설정
                el.textContent = `${displayName}님 (${displayBalance}TL)`;
                el.style.opacity = '1';
                el.style.visibility = 'visible';
                el.href = '#';
                
                // 로그아웃 함수 연결
                el.onclick = function(e) {
                    e.preventDefault();
                    logout();
                };
            });
        }
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
        const userEmail = localStorage.getItem('timelink_userEmail');
        const nickname = localStorage.getItem('timelink_nickname');
        const balance = localStorage.getItem('timelink_tlBalance') || '10000';
        
        // 로그인 상태면 즉시 업데이트
        if (token && userEmail) {
            try {
                const displayName = nickname || userEmail.split('@')[0];
                const displayBalance = parseInt(balance).toLocaleString();
                
                authElements.forEach(el => {
                    // 잠시 텍스트 변경 (깜빡임 방지)
                    const originalText = el.textContent;
                    el.setAttribute('data-original-text', originalText);
                    el.textContent = `${displayName}님 (${displayBalance}TL)`;
                    el.href = '#';
                    el.onclick = function(e) {
                        e.preventDefault();
                        logout();
                    };
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

// 글로벌 함수로 노출
window.logout = logout;
window.updateAuthUI = updateAuthUI;
window.updateTLBalanceInNav = updateTLBalanceInNav;

console.log('✅ 공통 컴포넌트 초기화 완료');
