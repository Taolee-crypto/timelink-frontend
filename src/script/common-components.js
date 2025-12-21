// TimeLink 통합 네비게이션 시스템
(function() {
    console.log("TimeLink 네비게이션 시스템 로드 중...");
    
    // DOM 준비 시 실행
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        setTimeout(init, 100);
    }
    
    function init() {
        console.log("네비게이션 시스템 초기화 시작");
        
        // 1. 기존 네비게이션 제거
        removeExistingNavigation();
        
        // 2. 새 네비게이션 삽입
        injectNavigation();
        
        // 3. 현재 페이지 메뉴 활성화
        highlightCurrentPage();
        
        // 4. 사용자 정보 업데이트
        updateUserInfo();
        
        // 5. 이벤트 리스너 설정
        setupEventListeners();
        
        // 6. 콘텐츠 여백 조정
        adjustContentMargin();
        
        console.log("네비게이션 시스템 초기화 완료");
    }
    
    function removeExistingNavigation() {
        // 모든 네비게이션 요소 제거
        const navElements = [
            'header.main-header',
            '.main-header',
            '.nav-container',
            '#mobileMenu',
            '.mobile-menu'
        ];
        
        navElements.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => el.remove());
        });
        
        // 네비게이션 관련 스타일 제거
        const styleElements = document.querySelectorAll('style');
        styleElements.forEach(style => {
            if (style.textContent.includes('main-header') || 
                style.textContent.includes('nav-container') ||
                style.textContent.includes('menu-link')) {
                style.remove();
            }
        });
    }
    
    function injectNavigation() {
        const navHTML = `
        <header class="main-header">
            <div class="nav-container">
                <div class="logo">
                    <a href="index.html">
                        <i class="bi bi-play-circle-fill"></i>
                        <span class="logo-text">TimeLink</span>
                    </a>
                </div>
                
                <button class="mobile-menu-toggle" id="mobileMenuToggle">
                    <i class="bi bi-list"></i>
                </button>
                
                <div class="nav-menu-container">
                    <ul class="main-menu">
                        <li class="menu-item"><a href="index.html" class="menu-link"><i class="bi bi-house-door"></i><span>HOME</span></a></li>
                        <li class="menu-item"><a href="studio.html" class="menu-link"><i class="bi bi-display"></i><span>STUDIO</span></a></li>
                        <li class="menu-item"><a href="musicplace.html" class="menu-link"><i class="bi bi-music-note-beamed"></i><span>MUSIC</span></a></li>
                        <li class="menu-item"><a href="tltube.html" class="menu-link"><i class="bi bi-camera-reels"></i><span>TUBE</span></a></li>
                        <li class="menu-item"><a href="dashboard.html" class="menu-link"><i class="bi bi-speedometer2"></i><span>DASH</span></a></li>
                        <li class="menu-item"><a href="charge.html" class="menu-link"><i class="bi bi-lightning-charge"></i><span>CHARGE</span></a></li>
                    </ul>
                </div>
                
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
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
        
        <div class="mobile-menu" id="mobileMenu">
            <a href="index.html" class="mobile-menu-link"><i class="bi bi-house-door"></i>HOME</a>
            <a href="studio.html" class="mobile-menu-link"><i class="bi bi-display"></i>STUDIO</a>
            <a href="musicplace.html" class="mobile-menu-link"><i class="bi bi-music-note-beamed"></i>MUSIC</a>
            <a href="tltube.html" class="mobile-menu-link"><i class="bi bi-camera-reels"></i>TUBE</a>
            <a href="dashboard.html" class="mobile-menu-link"><i class="bi bi-speedometer2"></i>DASH</a>
            <a href="charge.html" class="mobile-menu-link"><i class="bi bi-lightning-charge"></i>CHARGE</a>
        </div>`;
        
        document.body.insertAdjacentHTML('afterbegin', navHTML);
    }
    
    function highlightCurrentPage() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const menuLinks = document.querySelectorAll('.menu-link, .mobile-menu-link');
        
        menuLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPage || (currentPage === '' && href === 'index.html')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
    
    function updateUserInfo() {
        try {
            const userData = localStorage.getItem('userData');
            const usernameEl = document.getElementById('navUsername');
            const balanceEl = document.getElementById('navTLBalance');
            
            if (userData) {
                const user = JSON.parse(userData);
                if (usernameEl) usernameEl.textContent = user.nickname || user.email || 'User';
                if (balanceEl) balanceEl.textContent = (user.balance || 10000).toLocaleString();
            }
        } catch (error) {
            console.log('사용자 정보 업데이트 실패:', error);
        }
    }
    
    function setupEventListeners() {
        // 모바일 메뉴 토글
        const mobileToggle = document.getElementById('mobileMenuToggle');
        const mobileMenu = document.getElementById('mobileMenu');
        
        if (mobileToggle && mobileMenu) {
            mobileToggle.addEventListener('click', () => {
                mobileMenu.style.display = mobileMenu.style.display === 'flex' ? 'none' : 'flex';
            });
            
            // 모바일 메뉴 외부 클릭 시 닫기
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.mobile-menu') && !e.target.closest('.mobile-menu-toggle')) {
                    mobileMenu.style.display = 'none';
                }
            });
        }
        
        // 사용자 메뉴
        const userMenuBtn = document.getElementById('userMenuBtn');
        if (userMenuBtn) {
            userMenuBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                alert('사용자 메뉴 기능은 추후 구현 예정');
            });
        }
    }
    
    function adjustContentMargin() {
        const header = document.querySelector('.main-header');
        if (!header) return;
        
        const headerHeight = header.offsetHeight;
        const mainContent = document.querySelector('main, .container, .content-section');
        
        if (mainContent && !mainContent.classList.contains('content-adjusted')) {
            mainContent.style.paddingTop = `${headerHeight + 20}px`;
            mainContent.classList.add('content-adjusted');
        }
    }
    
    // 글로벌 함수
    window.toggleMobileMenu = function() {
        const mobileMenu = document.getElementById('mobileMenu');
        if (mobileMenu) {
            mobileMenu.style.display = mobileMenu.style.display === 'flex' ? 'none' : 'flex';
        }
    };
    
    window.logoutUser = function() {
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('userData');
        window.location.href = 'login.html';
    };
    
    // 리사이즈 시 콘텐츠 여백 조정
    window.addEventListener('resize', adjustContentMargin);
})();
