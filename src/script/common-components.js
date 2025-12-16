// 단순화된 네비게이션 생성
function createNavigation() {
    console.log("단순화된 네비게이션 생성");
    
    // 로그인 상태
    const userStr = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    let userHtml = '';
    
    if (userStr && token) {
        try {
            const user = JSON.parse(userStr);
            const username = user.username || '사용자';
            const balance = user.balance ? user.balance.toFixed(2) + ' TL' : '1,000 TL';
            const isVirtual = user.isVirtual ? '<span class="demo-badge">DEMO</span>' : '';
            
            userHtml = `
                <div class="user-area">
                    <div class="tl-sum-display">
                        <span class="tl-sum-label">TL:</span>
                        <span class="tl-sum-value">${balance}</span>
                        ${isVirtual}
                    </div>
                    <div class="user-dropdown">
                        <button class="user-menu-btn" onclick="toggleUserMenu()">
                            <span>👤</span> ${username}
                        </button>
                    </div>
                </div>
            `;
        } catch (e) {
            userHtml = `
                <div class="auth-buttons">
                    <a href="login.html" class="auth-btn login-btn">로그인</a>
                    <a href="signup.html" class="auth-btn signup-btn">회원가입</a>
                </div>
            `;
        }
    } else {
        userHtml = `
            <div class="auth-buttons">
                <a href="login.html" class="auth-btn login-btn">로그인</a>
                <a href="signup.html" class="auth-btn signup-btn">회원가입</a>
            </div>
        `;
    }
    
    // 네비게이션 HTML
    return `
        <div style="width: 100%;">
            <header class="main-header">
                <div class="nav-container">
                    <!-- 로고 -->
                    <div class="logo">
                        <a href="index.html">TIMELINK</a>
                    </div>
                    
                    <!-- 모바일 메뉴 토글 -->
                    <button class="mobile-menu-toggle" onclick="toggleMobileMenu()">☰</button>
                    
                    <!-- 메인 메뉴 -->
                    <div class="nav-menu-container">
                        <nav>
                            <ul class="main-menu">
                                <li class="menu-item">
                                    <a href="index.html" class="menu-link">
                                        <span>🏠</span><span class="menu-text">HOME</span>
                                    </a>
                                </li>
                                <li class="menu-item">
                                    <a href="studio.html" class="menu-link">
                                        <span>🎵</span><span class="menu-text">STUDIO</span>
                                    </a>
                                </li>
                                <li class="menu-item">
                                    <a href="musicplace.html" class="menu-link">
                                        <span>🎧</span><span class="menu-text">MUSIC</span>
                                    </a>
                                </li>
                                <li class="menu-item">
                                    <a href="tltube.html" class="menu-link">
                                        <span>🎬</span><span class="menu-text">TUBE</span>
                                    </a>
                                </li>
                                <li class="menu-item">
                                    <a href="dashboard.html" class="menu-link">
                                        <span>📊</span><span class="menu-text">DASH</span>
                                    </a>
                                </li>
                                <li class="menu-item">
                                    <a href="charge.html" class="menu-link">
                                        <span>⚡</span><span class="menu-text">CHARGE</span>
                                    </a>
                                </li>
                            </ul>
                        </nav>
                    </div>
                    
                    <!-- 사용자 섹션 -->
                    <div class="user-section">
                        ${userHtml}
                    </div>
                </div>
            </header>
            <div class="header-banner">
                <div class="banner-content">
                    <h1 class="banner-title">TimeLink</h1>
                </div>
            </div>
        </div>
    `;
}

// 드롭다운 메뉴 토글
function toggleUserMenu() {
    const menu = document.querySelector('.user-dropdown-menu');
    if (menu) {
        menu.classList.toggle('show');
    }
}

// 모바일 메뉴 토글
function toggleMobileMenu() {
    const mobileMenu = document.querySelector('.mobile-menu');
    if (mobileMenu) {
        mobileMenu.classList.toggle('active');
    }
}

// 페이지 초기화
function initNavigation() {
    console.log("네비게이션 초기화 시작");
    
    // 네비게이션 생성
    const navHTML = createNavigation();
    
    // body 시작 부분에 삽입
    const container = document.createElement('div');
    container.innerHTML = navHTML;
    
    if (document.body.firstChild) {
        document.body.insertBefore(container, document.body.firstChild);
    } else {
        document.body.appendChild(container);
    }
    
    console.log("네비게이션 추가 완료");
}

// DOM 로드 시 실행
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNavigation);
} else {
    setTimeout(initNavigation, 100);
}

// 전역 함수
window.createNavigation = createNavigation;
window.initNavigation = initNavigation;

