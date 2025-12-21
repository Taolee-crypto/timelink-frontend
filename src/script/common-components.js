// TimeLink 통합 공통 컴포넌트
// 버전: 2.0 (통합 네비게이션)
(function() {
    'use strict';
    
    console.log('TimeLink 공통 컴포넌트 로드 시작...');
    
    // 페이지 로드 상태 확인
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    function init() {
        console.log('공통 컴포넌트 초기화 시작...');
        
        // 1. 공통 네비게이션 삽입
        injectCommonNavigation();
        
        // 2. 사용자 정보 로드 및 표시
        loadAndDisplayUserInfo();
        
        // 3. 현재 페이지 메뉴 활성화
        activateCurrentPageMenu();
        
        // 4. 모바일 메뉴 이벤트 설정
        setupMobileMenu();
        
        // 5. 개발자 모드 확인
        checkDevelopmentMode();
        
        // 6. 페이지별 초기화 함수 실행
        if (typeof window.initPageSpecific === 'function') {
            window.initPageSpecific();
        }
        
        console.log('공통 컴포넌트 초기화 완료');
    }
    
    // 공통 네비게이션 삽입 함수
    function injectCommonNavigation() {
        // 기존 네비게이션 제거
        const existingHeader = document.querySelector('header.main-header');
        const existingMobileMenu = document.getElementById('mobileMenu');
        
        if (existingHeader) {
            existingHeader.remove();
            console.log('기존 헤더 제거됨');
        }
        
        if (existingMobileMenu) {
            existingMobileMenu.remove();
            console.log('기존 모바일 메뉴 제거됨');
        }
        
        // 네비게이션 HTML 생성
        const navigationHTML = `
        <header class="main-header">
            <div class="nav-container">
                <!-- 로고 -->
                <div class="logo">
                    <a href="index.html">
                        <i class="bi bi-play-circle-fill"></i>
                        <span class="logo-text">TimeLink</span>
                    </a>
                </div>
                
                <!-- 모바일 메뉴 토글 -->
                <button class="mobile-menu-toggle" id="mobileMenuToggle">
                    <i class="bi bi-list"></i>
                </button>
                
                <!-- 메인 메뉴 -->
                <div class="nav-menu-container">
                    <ul class="main-menu">
                        <li class="menu-item">
                            <a href="index.html" class="menu-link">
                                <i class="bi bi-house-door menu-icon"></i>
                                <span class="menu-text">HOME</span>
                            </a>
                        </li>
                        <li class="menu-item">
                            <a href="studio.html" class="menu-link">
                                <i class="bi bi-display menu-icon"></i>
                                <span class="menu-text">STUDIO</span>
                            </a>
                        </li>
                        <li class="menu-item">
                            <a href="musicplace.html" class="menu-link">
                                <i class="bi bi-music-note-beamed menu-icon"></i>
                                <span class="menu-text">MUSIC</span>
                            </a>
                        </li>
                        <li class="menu-item">
                            <a href="tltube.html" class="menu-link">
                                <i class="bi bi-camera-reels menu-icon"></i>
                                <span class="menu-text">TUBE</span>
                            </a>
                        </li>
                        <li class="menu-item">
                            <a href="dashboard.html" class="menu-link">
                                <i class="bi bi-speedometer2 menu-icon"></i>
                                <span class="menu-text">DASH</span>
                            </a>
                        </li>
                        <li class="menu-item">
                            <a href="charge.html" class="menu-link">
                                <i class="bi bi-lightning-charge menu-icon"></i>
                                <span class="menu-text">CHARGE</span>
                            </a>
                        </li>
                    </ul>
                </div>
                
                <!-- 사용자 섹션 -->
                <div class="user-section">
                    <div class="user-area">
                        <div class="tl-sum-display">
                            <span class="tl-sum-label">TL:</span>
                            <span class="tl-sum-value" id="navTLBalance">10,000</span>
                            <span class="demo-badge">DEMO</span>
                        </div>
                        <div class="user-dropdown">
                            <button class="user-menu-btn" id="userMenuBtn">
                                <i class="bi bi-person-circle"></i>
                                <span id="navUsername">Guest</span>
                                <i class="bi bi-chevron-down dropdown-arrow"></i>
                            </button>
                            <div class="user-dropdown-menu" id="userDropdownMenu">
                                <a href="dashboard.html" class="dropdown-item">
                                    <i class="bi bi-speedometer2 menu-icon"></i>대시보드
                                </a>
                                <a href="profile.html" class="dropdown-item">
                                    <i class="bi bi-person-circle menu-icon"></i>프로필
                                </a>
                                <div class="dropdown-divider"></div>
                                <button class="dropdown-item logout" id="logoutBtn">
                                    <i class="bi bi-box-arrow-right menu-icon"></i>로그아웃
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
        
        <!-- 모바일 메뉴 -->
        <div class="mobile-menu" id="mobileMenu">
            <a href="index.html" class="mobile-menu-link">
                <i class="bi bi-house-door"></i> HOME
            </a>
            <a href="studio.html" class="mobile-menu-link">
                <i class="bi bi-display"></i> STUDIO
            </a>
            <a href="musicplace.html" class="mobile-menu-link">
                <i class="bi bi-music-note-beamed"></i> MUSIC
            </a>
            <a href="tltube.html" class="mobile-menu-link">
                <i class="bi bi-camera-reels"></i> TUBE
            </a>
            <a href="dashboard.html" class="mobile-menu-link">
                <i class="bi bi-speedometer2"></i> DASH
            </a>
            <a href="charge.html" class="mobile-menu-link">
                <i class="bi bi-lightning-charge"></i> CHARGE
            </a>
            <div class="mobile-user-info">
                <div class="mobile-tl-balance">
                    <span>TL: </span>
                    <span id="mobileTLBalance">10,000</span>
                </div>
                <button class="dropdown-item logout" id="mobileLogoutBtn">
                    <i class="bi bi-box-arrow-right"></i>로그아웃
                </button>
            </div>
        </div>`;
        
        // 네비게이션 삽입
        document.body.insertAdjacentHTML('afterbegin', navigationHTML);
        console.log('공통 네비게이션 삽입 완료');
        
        // 사용자 드롭다운 이벤트 설정
        setupUserDropdown();
    }
    
    // 사용자 정보 로드 및 표시
    function loadAndDisplayUserInfo() {
        try {
            // 로컬 스토리지에서 사용자 정보 가져오기
            const userData = localStorage.getItem('userData');
            const jwtToken = localStorage.getItem('jwtToken');
            
            let username = 'Guest';
            let tlBalance = 10000;
            let isLoggedIn = false;
            
            if (jwtToken && userData) {
                const user = JSON.parse(userData);
                username = user.nickname || user.email || 'User';
                tlBalance = user.balance || 10000;
                isLoggedIn = true;
                
                console.log('사용자 정보 로드됨:', username);
            }
            
            // 네비게이션에 정보 표시
            const usernameElement = document.getElementById('navUsername');
            const tlBalanceElement = document.getElementById('navTLBalance');
            const mobileTlBalanceElement = document.getElementById('mobileTLBalance');
            
            if (usernameElement) usernameElement.textContent = username;
            if (tlBalanceElement) tlBalanceElement.textContent = tlBalance.toLocaleString();
            if (mobileTlBalanceElement) mobileTlBalanceElement.textContent = tlBalance.toLocaleString();
            
            // 로그인 상태에 따라 UI 조정
            if (!isLoggedIn) {
                const demoBadge = document.querySelector('.demo-badge');
                if (demoBadge) {
                    demoBadge.textContent = 'DEMO';
                }
            }
            
        } catch (error) {
            console.error('사용자 정보 로드 오류:', error);
        }
    }
    
    // 현재 페이지 메뉴 활성화
    function activateCurrentPageMenu() {
        const currentPath = window.location.pathname;
        let currentPage = currentPath.split('/').pop() || 'index.html';
        
        // 페이지 매핑 (URL이 다른 경우)
        const pageMap = {
            '': 'index.html',
            '/': 'index.html',
            'index': 'index.html',
            'music': 'musicplace.html',
            'market': 'musicplace.html',
            'tl-studio': 'studio.html',
            'studio': 'studio.html',
            'tube': 'tltube.html',
            'tltube': 'tltube.html',
            'dash': 'dashboard.html',
            'dashboard': 'dashboard.html',
            'charging': 'charge.html',
            'charge': 'charge.html'
        };
        
        if (pageMap[currentPage]) {
            currentPage = pageMap[currentPage];
        }
        
        // 데스크톱 메뉴 활성화
        document.querySelectorAll('.menu-link').forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPage || (currentPage === 'index.html' && href === '')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
        
        // 모바일 메뉴 활성화
        document.querySelectorAll('.mobile-menu-link').forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPage || (currentPage === 'index.html' && href === '')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
        
        console.log(`현재 페이지 활성화: ${currentPage}`);
    }
    
    // 모바일 메뉴 설정
    function setupMobileMenu() {
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        const mobileMenu = document.getElementById('mobileMenu');
        
        if (mobileMenuToggle && mobileMenu) {
            mobileMenuToggle.addEventListener('click', function(e) {
                e.stopPropagation();
                mobileMenu.style.display = mobileMenu.style.display === 'flex' ? 'none' : 'flex';
            });
            
            // 모바일 메뉴 외부 클릭 시 닫기
            document.addEventListener('click', function(e) {
                if (!e.target.closest('.mobile-menu') && !e.target.closest('.mobile-menu-toggle')) {
                    mobileMenu.style.display = 'none';
                }
            });
            
            // 모바일 메뉴 링크 클릭 시 메뉴 닫기
            document.querySelectorAll('.mobile-menu-link').forEach(link => {
                link.addEventListener('click', function() {
                    mobileMenu.style.display = 'none';
                });
            });
        }
    }
    
    // 사용자 드롭다운 설정
    function setupUserDropdown() {
        const userMenuBtn = document.getElementById('userMenuBtn');
        const userDropdownMenu = document.getElementById('userDropdownMenu');
        const logoutBtn = document.getElementById('logoutBtn');
        const mobileLogoutBtn = document.getElementById('mobileLogoutBtn');
        
        if (userMenuBtn && userDropdownMenu) {
            userMenuBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                userDropdownMenu.classList.toggle('show');
            });
            
            // 드롭다운 외부 클릭 시 닫기
            document.addEventListener('click', function(e) {
                if (!e.target.closest('.user-dropdown')) {
                    userDropdownMenu.classList.remove('show');
                }
            });
        }
        
        // 로그아웃 기능
        if (logoutBtn) {
            logoutBtn.addEventListener('click', logoutUser);
        }
        
        if (mobileLogoutBtn) {
            mobileLogoutBtn.addEventListener('click', logoutUser);
        }
    }
    
    // 로그아웃 함수
    function logoutUser() {
        if (confirm('로그아웃 하시겠습니까?')) {
            localStorage.removeItem('jwtToken');
            localStorage.removeItem('userData');
            
            // 토스트 메시지 표시
            showToast('로그아웃 되었습니다.', 'success');
            
            // 1초 후 로그인 페이지로 이동
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1000);
        }
    }
    
    // 개발자 모드 확인
    function checkDevelopmentMode() {
        const isLocalhost = window.location.hostname === 'localhost' || 
                          window.location.hostname === '127.0.0.1';
        
        if (isLocalhost) {
            console.log('개발자 모드 감지됨');
            
            // 개발자 배지 추가
            const devBadge = document.createElement('div');
            devBadge.className = 'virtual-user-badge';
            devBadge.innerHTML = `
                <span>개발자 모드</span>
                <button class="badge-close" onclick="this.parentElement.remove()">×</button>
            `;
            document.body.appendChild(devBadge);
            
            // 개발자 네비게이션 추가 (하단)
            const devNav = document.createElement('div');
            devNav.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: rgba(0,0,0,0.95);
                color: white;
                padding: 15px;
                border-radius: 15px;
                border: 2px solid #7c4dff;
                max-width: 300px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.5);
                z-index: 9999;
            `;
            devNav.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <h5 style="margin: 0; color: #7c4dff;">🔧 개발자 네비게이션</h5>
                    <button onclick="this.parentElement.parentElement.remove()" 
                            style="background: none; border: none; color: #aaa; cursor: pointer;">×</button>
                </div>
                
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 10px;">
                    <a href="login.html" style="background: linear-gradient(135deg, #7c4dff, #536dfe); 
                        color: white; padding: 8px 10px; border-radius: 6px; text-decoration: none; 
                        text-align: center; font-size: 0.9rem;">로그인</a>
                    <a href="signup.html" style="background: linear-gradient(135deg, #00e5ff, #00bcd4); 
                        color: black; padding: 8px 10px; border-radius: 6px; text-decoration: none; 
                        text-align: center; font-size: 0.9rem;">회원가입</a>
                    <a href="dashboard.html" style="background: linear-gradient(135deg, #ff4081, #e91e63); 
                        color: white; padding: 8px 10px; border-radius: 6px; text-decoration: none; 
                        text-align: center; font-size: 0.9rem;">대시보드</a>
                    <a href="studio.html" style="background: linear-gradient(135deg, #4caf50, #2e7d32); 
                        color: white; padding: 8px 10px; border-radius: 6px; text-decoration: none; 
                        text-align: center; font-size: 0.9rem;">스튜디오</a>
                    <a href="tltube.html" style="background: linear-gradient(135deg, #ff9800, #f57c00); 
                        color: white; padding: 8px 10px; border-radius: 6px; text-decoration: none; 
                        text-align: center; font-size: 0.9rem;">TLTube</a>
                    <a href="musicplace.html" style="background: linear-gradient(135deg, #9c27b0, #7b1fa2); 
                        color: white; padding: 8px 10px; border-radius: 6px; text-decoration: none; 
                        text-align: center; font-size: 0.9rem;">MusicPlace</a>
                </div>
                
                <div style="font-size: 0.8rem; color: #aaa; border-top: 1px solid #333; padding-top: 8px;">
                    <div style="display: flex; justify-content: space-between;">
                        <span>포트: 6199</span>
                        <span>API: 3003</span>
                        <span>백엔드: 8787</span>
                    </div>
                </div>
            `;
            document.body.appendChild(devNav);
        }
    }
    
    // 토스트 메시지 함수
    function showToast(message, type = 'info') {
        const toastContainer = document.getElementById('toastContainer') || createToastContainer();
        
        const toastId = 'toast-' + Date.now();
        const toast = document.createElement('div');
        toast.className = `toast align-items-center text-white bg-${type === 'error' ? 'danger' : type === 'success' ? 'success' : 'info'} border-0`;
        toast.id = toastId;
        toast.style.cssText = 'backdrop-filter: blur(10px);';
        
        const icon = type === 'success' ? 'check-circle' : 
                    type === 'error' ? 'exclamation-triangle' : 
                    type === 'warning' ? 'exclamation-circle' : 'info-circle';
        
        toast.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">
                    <i class="bi bi-${icon} me-2"></i>
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" 
                        data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        `;
        
        toastContainer.appendChild(toast);
        
        const bsToast = new bootstrap.Toast(toast, {
            autohide: true,
            delay: 3000
        });
        
        bsToast.show();
        
        toast.addEventListener('hidden.bs.toast', function () {
            toast.remove();
        });
    }
    
    function createToastContainer() {
        const container = document.createElement('div');
        container.id = 'toastContainer';
        container.className = 'toast-container position-fixed top-0 end-0 p-3';
        container.style.zIndex = '99999';
        document.body.appendChild(container);
        return container;
    }
    
    // 글로벌 함수 노출
    window.toggleMobileMenu = function() {
        const mobileMenu = document.getElementById('mobileMenu');
        if (mobileMenu) {
            mobileMenu.style.display = mobileMenu.style.display === 'flex' ? 'none' : 'flex';
        }
    };
    
    window.logoutUser = logoutUser;
    window.showToast = showToast;
    
    // 페이지별 콘텐츠 여백 자동 조정
    function adjustContentMargin() {
        const headerHeight = document.querySelector('.main-header')?.offsetHeight || 60;
        const mainContent = document.querySelector('main, .container, .content-section:first-of-type');
        
        if (mainContent && !mainContent.classList.contains('content-adjusted')) {
            mainContent.style.paddingTop = `${headerHeight + 20}px`;
            mainContent.classList.add('content-adjusted');
        }
    }
    
    // 윈도우 리사이즈 시 콘텐츠 여백 조정
    window.addEventListener('resize', adjustContentMargin);
    setTimeout(adjustContentMargin, 100);
    
    // 히어로 섹션 자동 여백 조정
    const heroSections = document.querySelectorAll('.hero-image-section');
    heroSections.forEach(section => {
        section.style.marginTop = '0';
        section.style.paddingTop = '0';
    });
    
    // 부드러운 스크롤
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
})();
