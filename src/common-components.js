// 공통 네비게이션 메뉴 생성
function createNavigation() {
    return `
        <header class="main-header">
            <div class="nav-container">
                <!-- 로고 -->
                <div class="logo">
                    <a href="index.html" style="color: #00b0ff; font-size: 24px; font-weight: bold; text-decoration: none;">
                        TIMELINK
                    </a>
                </div>
                
                <!-- 메인 메뉴 -->
                <nav>
                    <ul class="main-menu">
                        <!-- HOME -->
                        <li class="menu-item">
                            <a href="index.html" class="menu-link">
                                <span>🏠</span> HOME
                            </a>
                        </li>
                        
                        <!-- TL STUDIO / MUSIC PLACE -->
                        <li class="menu-item">
                            <a href="#" class="menu-link">
                                <span>🎵</span> TL STUDIO / MUSIC PLACE
                            </a>
                            <div class="submenu">
                                <!-- TL STUDIO -->
                                <div class="submenu-section">
                                    <div class="submenu-title">🎵 TL STUDIO</div>
                                    <a href="studio.html" class="submenu-link">• 스튜디오 메인</a>
                                    <a href="studio.html#converter" class="submenu-link">• 파일 변환기</a>
                                    <a href="studio.html#player" class="submenu-link">• 미리보기 플레이어</a>
                                </div>
                                <!-- MUSIC PLACE -->
                                <div class="submenu-section">
                                    <div class="submenu-title">🎧 MUSIC PLACE</div>
                                    <a href="p2p-marketplace.html" class="submenu-link">• P2P</a>
                                    <a href="#" class="submenu-link">• ARTIST</a>
                                </div>
                            </div>
                        </li>
                        
                        <!-- TUBE PLACE -->
                        <li class="menu-item">
                            <a href="tltube.html" class="menu-link">
                                <span>🎬</span> TUBE PLACE
                            </a>
                            <div class="submenu">
                                <a href="tltube.html" class="submenu-link">• TLTube 메인</a>
                                <a href="tltube_preview.html" class="submenu-link">• 영상 미리보기</a>
                                <a href="#" class="submenu-link">• 영상 자산화</a>
                            </div>
                        </li>
                        
                        <!-- TL CHARGE -->
                        <li class="menu-item">
                            <a href="charge.html" class="menu-link">
                                <span>⚡</span> TL CHARGE
                            </a>
                            <div class="submenu">
                                <div class="submenu-section">
                                    <div class="submenu-title">충전</div>
                                    <a href="charge.html#purchase" class="submenu-link">• TL 구매</a>
                                    <a href="charge.html#wallet" class="submenu-link">• 지갑 관리</a>
                                </div>
                                <div class="submenu-section">
                                    <div class="submenu-title">광고 수익</div>
                                    <a href="charge.html#audio-ads" class="submenu-link">• 오디오 광고</a>
                                    <a href="charge.html#video-ads" class="submenu-link">• 비디오 광고</a>
                                </div>
                            </div>
                        </li>
                        
                        <!-- 커뮤니티 -->
                        <li class="menu-item">
                            <a href="#" class="menu-link">
                                <span>👥</span> 커뮤니티
                            </a>
                            <div class="submenu">
                                <a href="guide.html" class="submenu-link">• 이용방법</a>
                                <a href="faq.html" class="submenu-link">• FAQ</a>
                            </div>
                        </li>
                        
                        <!-- 광고MARKET -->
                        <li class="menu-item">
                            <a href="#" class="menu-link">
                                <span>📢</span> 광고MARKET
                            </a>
                            <div class="submenu">
                                <a href="#" class="submenu-link">• 광고주</a>
                                <a href="charge.html#audio-ads" class="submenu-link">• 광고시청(오디오)</a>
                                <a href="charge.html#video-ads" class="submenu-link">• 광고시청(비디오)</a>
                            </div>
                        </li>
                    </ul>
                </nav>
                
                <!-- 로그인/회원가입/TL SUM -->
                <div class="user-section">
                    ${getUserSection()}
                </div>
            </div>
        </header>
        
        <!-- 헤더 배너 -->
        <div class="header-banner">
            <div class="banner-overlay"></div>
            <div class="banner-content">
                <h1 class="banner-title">TimeLink</h1>
                <p class="banner-subtitle">보고, 듣고, 읽고, 벌고하는 미래형 시간 경제 플랫폼</p>
                <p class="banner-subtitle">유휴 디지털 파일 자산화 플랫폼</p>
            </div>
        </div>
    `;
}

// 사용자 섹션 생성 (로그인 상태에 따라 다름)
function getUserSection() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const tlSum = localStorage.getItem('tlSum') || '0.00';
    
    if (isLoggedIn) {
        return `
            <div style="display: flex; align-items: center; gap: 20px;">
                <div class="tl-sum-display">
                    <span class="tl-sum-label">TL SUM:</span>
                    <span class="tl-sum-value">${tlSum} TL</span>
                </div>
                <a href="dashboard.html" class="menu-link" style="padding: 8px 15px;">
                    <span>👤</span> 대시보드
                </a>
                <button onclick="logout()" class="menu-link" style="padding: 8px 15px; cursor: pointer; border: none;">
                    로그아웃
                </button>
            </div>
        `;
    } else {
        return `
            <div style="display: flex; gap: 10px;">
                <a href="login.html" class="menu-link" style="padding: 8px 15px;">
                    로그인
                </a>
                <a href="signup.html" class="menu-link" style="padding: 8px 15px; background: var(--accent-color); color: var(--dark-bg);">
                    회원가입
                </a>
            </div>
        `;
    }
}
// 모바일 메뉴 토글
function toggleMobileMenu() {
    const mainMenu = document.querySelector('.main-menu');
    mainMenu.classList.toggle('active');
}

// 서브메뉴 토글 (모바일용)
function toggleSubmenu(menuItem) {
    if (window.innerWidth <= 1024) {
        menuItem.classList.toggle('active');
    }
}

// 페이지 로드 시 공통 컴포넌트 추가 (수정된 버전)
document.addEventListener('DOMContentLoaded', function() {
    // 네비게이션 추가
    const navContainer = document.createElement('div');
    navContainer.innerHTML = createNavigation();
    document.body.insertBefore(navContainer, document.body.firstChild);
    
    // 모바일 메뉴 토글 버튼 추가
    const navContainerEl = document.querySelector('.nav-container');
    const mobileToggleBtn = document.createElement('button');
    mobileToggleBtn.className = 'mobile-menu-toggle';
    mobileToggleBtn.innerHTML = '☰';
    mobileToggleBtn.onclick = toggleMobileMenu;
    navContainerEl.appendChild(mobileToggleBtn);
    
    // 모바일에서 메뉴 클릭 시 서브메뉴 토글
    document.querySelectorAll('.menu-link').forEach(link => {
        link.addEventListener('click', function(e) {
            if (window.innerWidth <= 1024) {
                e.preventDefault();
                const menuItem = this.parentElement;
                toggleSubmenu(menuItem);
            }
        });
    });
    
    // 현재 페이지에 맞는 배너 내용 설정
    const pageTitle = document.title;
    const pageBannerContent = getPageBannerContent(pageTitle);
    if (pageBannerContent) {
        setBannerContent(pageBannerContent.title, pageBannerContent.subtitle);
    }
});
