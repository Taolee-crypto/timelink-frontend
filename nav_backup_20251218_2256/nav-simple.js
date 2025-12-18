// 간소화된 네비게이션 (5개 메뉴)
function createSimplifiedNavigation() {
    return `
        <header class="main-header">
            <div class="nav-container">
                <!-- 로고 -->
                <div class="logo">
                    <a href="index.html" style="color: #00b0ff; font-size: 18px; font-weight: bold; text-decoration: none;">
                        TIMELINK
                    </a>
                </div>
                
                <!-- 모바일 메뉴 토글 -->
                <button class="mobile-menu-toggle" onclick="toggleMobileMenu()" style="background: none; border: none; color: white; font-size: 20px; cursor: pointer; display: none;">
                    ☰
                </button>
                
                <!-- 메인 메뉴 (5개로 줄임) -->
                <div class="nav-menu-container">
                    <nav>
                        <ul class="main-menu">
                            <li class="menu-item">
                                <a href="index.html" class="menu-link">
                                    <span>🏠</span> HOME
                                </a>
                            </li>
                            
                            <li class="menu-item">
                                <a href="studio.html" class="menu-link">
                                    <span>🎵</span> STUDIO
                                </a>
                                <div class="submenu">
                                    <a href="studio.html#converter" class="submenu-link">파일 변환</a>
                                    <a href="studio.html#upload" class="submenu-link">업로드</a>
                                </div>
                            </li>
                            
                            <li class="menu-item">
                                <a href="musicplace.html" class="menu-link">
                                    <span>🎧</span> MUSIC
                                </a>
                                <div class="submenu">
                                    <a href="musicplace.html" class="submenu-link">P2P 마켓</a>
                                    <a href="#" class="submenu-link">아티스트</a>
                                </div>
                            </li>
                            
                            <li class="menu-item">
                                <a href="dashboard.html" class="menu-link">
                                    <span>📊</span> DASHBOARD
                                </a>
                            </li>
                            
                            <li class="menu-item">
                                <a href="charge.html" class="menu-link">
                                    <span>⚡</span> CHARGE
                                </a>
                                <div class="submenu">
                                    <a href="charge.html#ads" class="submenu-link">광고</a>
                                    <a href="charge.html#purchase" class="submenu-link">구매</a>
                                </div>
                            </li>
                        </ul>
                    </nav>
                </div>
                
                <!-- 사용자 섹션 -->
                <div class="user-section">
                    ${getUserSection()}
                </div>
            </div>
        </header>
        
        <div class="header-banner">
            <div class="banner-content">
                <h1 class="banner-title">TimeLink</h1>
            </div>
        </div>
    `;
}

// 기존 createNavigation을 간소화된 버전으로 교체
window.createNavigation = createSimplifiedNavigation;
