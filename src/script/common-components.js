// common-components.js 수정
(function() {
    console.log("공통 컴포넌트 로드 시작...");
    
    // CSS 변수 정의
    const root = document.documentElement;
    root.style.setProperty('--background-color', '#0a0a1a');
    root.style.setProperty('--surface-color', '#161632');
    root.style.setProperty('--card-bg', 'rgba(22, 22, 50, 0.7)');
    root.style.setProperty('--primary-color', '#7c4dff');
    root.style.setProperty('--primary-hover', '#6a40e6');
    root.style.setProperty('--text-primary', '#ffffff');
    root.style.setProperty('--text-secondary', '#b0b0d0');
    root.style.setProperty('--glass-border', 'rgba(124, 77, 255, 0.2)');
    
    // 페이지별 배경색 통일
    document.body.style.backgroundColor = '#0a0a1a';
    document.body.style.background = 'linear-gradient(135deg, #0a0a1a 0%, #1a1a2e 100%)';
    document.body.style.color = '#ffffff';
    
    // 공통 네비게이션 HTML
    const commonNavigation = `
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
            <button class="mobile-menu-toggle" onclick="toggleMobileMenu()">☰</button>
            
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
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </header>

    <!-- 모바일 메뉴 -->
    <div class="mobile-menu" id="mobileMenu" style="display: none;">
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
        </div>
    </div>`;
    
    // 공통 CSS 스타일
    const commonStyles = `
    <style>
        /* 공통 배경색 */
        body {
            background-color: #0a0a1a !important;
            background: linear-gradient(135deg, #0a0a1a 0%, #1a1a2e 100%) !important;
            color: #ffffff;
            font-family: 'Inter', sans-serif;
            margin: 0;
            padding: 0;
        }
        
        /* 공통 네비게이션 스타일 */
        .main-header {
            background: rgba(26, 35, 126, 0.95);
            backdrop-filter: blur(10px);
            position: fixed;
            top: 0;
            width: 100%;
            z-index: 1000;
            border-bottom: 2px solid #00e5ff;
            height: 50px;
        }
        
        .nav-container {
            width: 100%;
            max-width: 1400px;
            margin: 0 auto;
            padding: 0 20px;
            height: 50px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            overflow: visible;
            box-sizing: border-box;
        }
        
        .logo {
            flex-shrink: 0;
            min-width: 80px;
            order: 1;
        }
        
        .logo a {
            color: #00b0ff;
            font-size: 16px;
            font-weight: bold;
            text-decoration: none;
            white-space: nowrap;
        }
        
        .nav-menu-container {
            flex: 1;
            order: 2;
            display: flex;
            justify-content: center;
            overflow-x: auto;
            overflow-y: hidden;
            -webkit-overflow-scrolling: touch;
            margin: 0 10px;
            min-width: 0;
        }
        
        .main-menu {
            display: flex;
            list-style: none;
            margin: 0;
            padding: 0;
            gap: 2px;
            white-space: nowrap;
            height: 50px;
            align-items: center;
        }
        
        .menu-item {
            position: relative;
            flex-shrink: 0;
        }
        
        .menu-link {
            color: white;
            text-decoration: none;
            padding: 4px 8px;
            border-radius: 12px;
            font-weight: 600;
            font-size: 10px;
            display: flex;
            align-items: center;
            gap: 4px;
            transition: all 0.3s ease;
            white-space: nowrap;
            line-height: 1;
            height: 32px;
        }
        
        .menu-link:hover {
            background: rgba(0, 176, 255, 0.2);
            transform: translateY(-2px);
        }
        
        .menu-link.active {
            background: #00e5ff;
            color: #121212;
        }
        
        .menu-icon {
            font-size: 12px;
        }
        
        .menu-text {
            font-size: 10px;
        }
        
        .user-section {
            flex-shrink: 0;
            order: 3;
        }
        
        .user-area {
            display: flex;
            align-items: center;
            gap: 5px;
        }
        
        .tl-sum-display {
            display: flex;
            align-items: center;
            gap: 4px;
            background: rgba(255, 255, 255, 0.1);
            padding: 3px 8px;
            border-radius: 15px;
            font-weight: 600;
            white-space: nowrap;
        }
        
        .tl-sum-label {
            color: #00b0ff;
            font-size: 9px;
            opacity: 0.8;
        }
        
        .tl-sum-value {
            font-size: 10px;
            color: #00ff88;
            font-weight: bold;
        }
        
        .demo-badge {
            background: #ff6b6b;
            color: white;
            font-size: 8px;
            padding: 1px 4px;
            border-radius: 8px;
            margin-left: 3px;
            font-weight: bold;
        }
        
        .user-dropdown {
            position: relative;
        }
        
        .user-menu-btn {
            background: rgba(0, 176, 255, 0.2);
            border: 1px solid rgba(0, 176, 255, 0.3);
            color: white;
            padding: 3px 8px;
            border-radius: 15px;
            display: flex;
            align-items: center;
            gap: 4px;
            cursor: pointer;
            font-weight: 600;
            font-size: 10px;
            transition: all 0.3s ease;
            white-space: nowrap;
            height: 28px;
        }
        
        .user-menu-btn:hover {
            background: rgba(0, 176, 255, 0.4);
        }
        
        .mobile-menu-toggle {
            display: none;
            background: none;
            border: none;
            color: white;
            font-size: 20px;
            cursor: pointer;
            padding: 5px;
        }
        
        .mobile-menu {
            position: fixed;
            top: 50px;
            left: 0;
            right: 0;
            background: rgba(26, 35, 126, 0.98);
            backdrop-filter: blur(15px);
            padding: 20px;
            display: none;
            flex-direction: column;
            gap: 10px;
            z-index: 1000;
            max-height: calc(100vh - 50px);
            overflow-y: auto;
            border-top: 1px solid #00e5ff;
        }
        
        .mobile-menu-link {
            color: white;
            text-decoration: none;
            padding: 12px 15px;
            border-radius: 10px;
            background: rgba(255, 255, 255, 0.05);
            display: flex;
            align-items: center;
            gap: 10px;
            transition: all 0.3s ease;
        }
        
        .mobile-menu-link:hover,
        .mobile-menu-link.active {
            background: rgba(0, 176, 255, 0.3);
            transform: translateX(5px);
        }
        
        /* 콘텐츠 여백 (네비게이션 높이만큼) */
        .content-wrapper {
            padding-top: 70px;
        }
        
        /* 반응형 네비게이션 */
        @media (max-width: 1300px) {
            .menu-text {
                display: none;
            }
            
            .menu-link {
                padding: 6px;
                min-width: 36px;
                justify-content: center;
            }
        }
        
        @media (max-width: 1024px) {
            .nav-menu-container {
                display: none;
            }
            
            .mobile-menu-toggle {
                display: block;
                order: 2;
                margin: 0 10px;
            }
            
            .user-section {
                order: 3;
            }
        }
        
        @media (max-width: 480px) {
            .tl-sum-display {
                display: none;
            }
            
            .logo a {
                font-size: 14px;
            }
        }
    </style>`;
    
    // DOMContentLoaded 시 실행
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    function init() {
        console.log("공통 컴포넌트 초기화 시작...");
        
        // 기존에 삽입된 네비게이션 제거
        const existingHeader = document.querySelector('header.main-header');
        if (existingHeader) {
            existingHeader.remove();
        }
        
        const existingMobileMenu = document.getElementById('mobileMenu');
        if (existingMobileMenu) {
            existingMobileMenu.remove();
        }
        
        // 공통 스타일 삽입
        if (!document.querySelector('#common-styles')) {
            const styleElement = document.createElement('div');
            styleElement.innerHTML = commonStyles;
            document.head.appendChild(styleElement.firstElementChild);
        }
        
        // 네비게이션을 body 시작 부분에 삽입
        document.body.insertAdjacentHTML('afterbegin', commonNavigation);
        
        // 현재 페이지에 맞게 활성 메뉴 표시
        updateActiveMenu();
        
        // 사용자 정보 로드
        loadUserInfo();
        
        // 콘텐츠 영역에 여백 추가
        const mainContent = document.querySelector('main, .container, section:first-of-type');
        if (mainContent && !mainContent.classList.contains('content-wrapper')) {
            mainContent.classList.add('content-wrapper');
        }
        
        console.log("공통 컴포넌트 초기화 완료");
    }
    
    function updateActiveMenu() {
        const currentPath = window.location.pathname;
        const currentPage = currentPath.split('/').pop() || 'index.html';
        
        // 데스크탑 메뉴
        document.querySelectorAll('.menu-link').forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === currentPage || (currentPage === '' && href === 'index.html')) {
                link.classList.add('active');
            }
        });
        
        // 모바일 메뉴
        document.querySelectorAll('.mobile-menu-link').forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === currentPage || (currentPage === '' && href === 'index.html')) {
                link.classList.add('active');
            }
        });
    }
    
    function loadUserInfo() {
        try {
            const userData = localStorage.getItem('userData');
            if (userData) {
                const user = JSON.parse(userData);
                document.getElementById('navUsername').textContent = user.nickname || user.email || 'User';
                
                // TL 잔액 표시
                const tlBalance = user.balance || 10000;
                document.getElementById('navTLBalance').textContent = tlBalance.toLocaleString();
                document.getElementById('mobileTLBalance').textContent = tlBalance.toLocaleString();
            }
        } catch (error) {
            console.log('사용자 정보 로드 실패:', error);
        }
    }
    
    // 전역 함수로 노출
    window.toggleMobileMenu = function() {
        const mobileMenu = document.getElementById('mobileMenu');
        if (mobileMenu.style.display === 'none' || mobileMenu.style.display === '') {
            mobileMenu.style.display = 'flex';
        } else {
            mobileMenu.style.display = 'none';
        }
    };
    
    window.logoutUser = function() {
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('userData');
        window.location.href = 'login.html';
    };
    
    // 사용자 메뉴 이벤트
    document.addEventListener('click', function(event) {
        if (event.target.closest('#userMenuBtn')) {
            showUserMenu();
        }
    });
    
    function showUserMenu() {
        // 간단한 드롭다운 메뉴 생성
        const dropdown = document.createElement('div');
        dropdown.className = 'user-dropdown-menu';
        dropdown.innerHTML = `
            <div style="position: absolute; top: 100%; right: 0; margin-top: 5px; min-width: 180px; 
                        background: rgba(26, 35, 126, 0.95); backdrop-filter: blur(15px); 
                        border-radius: 15px; padding: 10px; border: 1px solid #00e5ff; 
                        box-shadow: 0 10px 30px rgba(0,0,0,0.3); z-index: 1001;">
                <div style="padding: 10px 15px; border-bottom: 1px solid rgba(255,255,255,0.1);">
                    <strong style="color: white; font-size: 14px;">내 계정</strong>
                </div>
                <a href="dashboard.html" style="display: block; padding: 10px 15px; color: white; text-decoration: none; 
                    transition: all 0.3s ease; border-radius: 8px;">
                    <i class="bi bi-speedometer2 me-2"></i>대시보드
                </a>
                <a href="profile.html" style="display: block; padding: 10px 15px; color: white; text-decoration: none; 
                    transition: all 0.3s ease; border-radius: 8px;">
                    <i class="bi bi-person-circle me-2"></i>프로필
                </a>
                <div style="padding: 10px 15px; border-top: 1px solid rgba(255,255,255,0.1);">
                    <button onclick="logoutUser()" style="width: 100%; background: rgba(255,64,129,0.2); 
                        border: 1px solid rgba(255,64,129,0.3); color: #ff4081; padding: 8px; 
                        border-radius: 8px; cursor: pointer; font-weight: 600;">
                        <i class="bi bi-box-arrow-right me-2"></i>로그아웃
                    </button>
                </div>
            </div>
        `;
        
        // 기존 드롭다운 제거
        const existingDropdown = document.querySelector('.user-dropdown-menu');
        if (existingDropdown) {
            existingDropdown.remove();
            return;
        }
        
        // 새 드롭다운 추가
        document.querySelector('.user-dropdown').appendChild(dropdown);
        
        // 바깥 클릭 시 드롭다운 제거
        setTimeout(() => {
            document.addEventListener('click', function closeDropdown(e) {
                if (!e.target.closest('.user-dropdown')) {
                    dropdown.remove();
                    document.removeEventListener('click', closeDropdown);
                }
            });
        }, 0);
    }
})();
