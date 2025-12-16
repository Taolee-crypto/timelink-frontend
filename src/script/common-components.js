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
                        
                        <!-- TL STUDIO -->
                        <li class="menu-item">
                            <a href="studio.html" class="menu-link">
                                <span>🎵</span> TL STUDIO
                            </a>
                            <div class="submenu">
                                <a href="studio.html#converter" class="submenu-link">파일 변환기</a>
                                <a href="studio.html#player" class="submenu-link">미리보기 플레이어</a>
                                <a href="studio.html#upload" class="submenu-link">업로드 관리</a>
                            </div>
                        </li>
                        
                        <!-- MUSIC PLACE -->
                        <li class="menu-item">
                            <a href="#" class="menu-link">
                                <span>🎧</span> MUSIC PLACE
                            </a>
                            <div class="submenu">
                                <a href="p2p-marketplace.html" class="submenu-link">P2P 마켓플레이스</a>
                                <a href="#" class="submenu-link">ARTIST 섹션</a>
                                <a href="#" class="submenu-link">디지털 자산 거래</a>
                            </div>
                        </li>
                        
                        <!-- TUBE PLACE -->
                        <li class="menu-item">
                            <a href="tltube.html" class="menu-link">
                                <span>🎬</span> TUBE PLACE
                            </a>
                            <div class="submenu">
                                <a href="tltube.html" class="submenu-link">TLTube 메인</a>
                                <a href="tltube_preview.html" class="submenu-link">영상 미리보기</a>
                                <a href="#" class="submenu-link">영상 자산화</a>
                            </div>
                        </li>
                        
                        <!-- TL CHARGE -->
                        <li class="menu-item">
                            <a href="charge.html" class="menu-link">
                                <span>⚡</span> TL CHARGE
                            </a>
                            <div class="submenu">
                                <a href="charge.html#ads" class="submenu-link">광고 시청</a>
                                <a href="charge.html#purchase" class="submenu-link">TL 구매</a>
                                <a href="charge.html#wallet" class="submenu-link">지갑 관리</a>
                            </div>
                        </li>
                        
                        <!-- 커뮤니티 -->
                        <li class="menu-item">
                            <a href="#" class="menu-link">
                                <span>👥</span> 커뮤니티
                            </a>
                            <div class="submenu">
                                <a href="guide.html" class="submenu-link">이용방법</a>
                                <a href="faq.html" class="submenu-link">FAQ</a>
                                <a href="#" class="submenu-link">커뮤니티 게시판</a>
                            </div>
                        </li>
                        
                        <!-- 광고 MARKET -->
                        <li class="menu-item">
                            <a href="#" class="menu-link">
                                <span>📢</span> 광고MARKET
                            </a>
                            <div class="submenu">
                                <a href="#" class="submenu-link">광고주 섹션</a>
                                <a href="charge.html#audio-ads" class="submenu-link">오디오 광고</a>
                                <a href="charge.html#video-ads" class="submenu-link">비디오 광고</a>
                                <a href="#" class="submenu-link">광고 대시보드</a>
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

// 로그아웃 함수
function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('tlSum');
    window.location.href = 'index.html';
}

// 각 페이지의 헤더 배너 내용 커스터마이징
function setBannerContent(title, subtitle = '') {
    const bannerContent = document.querySelector('.banner-content');
    if (bannerContent) {
        bannerContent.innerHTML = `
            <h1 class="banner-title">${title}</h1>
            ${subtitle ? `<p class="banner-subtitle">${subtitle}</p>` : ''}
        `;
    }
}

// 페이지 로드 시 공통 컴포넌트 추가
document.addEventListener('DOMContentLoaded', function() {
    // 네비게이션 추가
    const navContainer = document.createElement('div');
    navContainer.innerHTML = createNavigation();
    document.body.insertBefore(navContainer, document.body.firstChild);
    
    // 현재 페이지에 맞는 배너 내용 설정
    const pageTitle = document.title;
    const pageBannerContent = getPageBannerContent(pageTitle);
    if (pageBannerContent) {
        setBannerContent(pageBannerContent.title, pageBannerContent.subtitle);
    }
});

// 각 페이지별 배너 내용
function getPageBannerContent(pageTitle) {
    const banners = {
        'TL Studio': {
            title: 'TL STUDIO',
            subtitle: '디지털 파일을 자산으로 변환하는 창작자의 공간'
        },
        'Music Place': {
            title: 'MUSIC PLACE',
            subtitle: '음원 디지털 자산 P2P 거래 플랫폼'
        },
        'TLTube': {
            title: 'TUBE PLACE',
            subtitle: '영상 콘텐츠 자산화 플랫폼'
        },
        'TL Charge': {
            title: 'TL CHARGE',
            subtitle: '시간을 충전하고 수익을 창출하세요'
        },
        'P2P Marketplace': {
            title: 'P2P MARKETPLACE',
            subtitle: '개인 간 디지털 자산 거래'
        },
        'Login': {
            title: '로그인',
            subtitle: 'TimeLink에 접속하세요'
        },
        'Sign Up': {
            title: '회원가입',
            subtitle: '미래형 시간 경제에 동참하세요'
        }
    };
    
    for (const [key, value] of Object.entries(banners)) {
        if (pageTitle.includes(key)) {
            return value;
        }
    }
    
    return {
        title: 'TimeLink',
        subtitle: '보고, 듣고, 읽고, 벌고하는 미래형 시간 경제 플랫폼'
    };
}
