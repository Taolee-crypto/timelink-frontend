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

// 사용자 섹션 생성 (가상 로그인 통합)
function getUserSection() {
    // 모든 로그인 방식 체크
    const isLoggedInOld = localStorage.getItem('isLoggedIn') === 'true';
    const userStr = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    let user = null;
    let tlSum = '0.00';
    let isVirtual = false;
    let username = '사용자';
    
    if (userStr && token) {
        try {
            user = JSON.parse(userStr);
            tlSum = user.balance ? user.balance.toFixed(2) + ' TL' : '1,000.00 TL';
            isVirtual = user.isVirtual || false;
            username = user.username || user.displayName || '사용자';
        } catch (e) {
            console.error('사용자 데이터 파싱 오류:', e);
        }
    } else if (isLoggedInOld) {
        // 기존 방식 지원
        tlSum = localStorage.getItem('tlSum') || '1,000.00 TL';
        username = localStorage.getItem('userEmail') || '사용자';
    }
    
    const isLoggedIn = isLoggedInOld || (user && token);
    
    if (isLoggedIn) {
        return `
            <div class="user-area">
                <div class="tl-sum-display">
                    <span class="tl-sum-label">TL SUM:</span>
                    <span class="tl-sum-value">${tlSum}</span>
                    ${isVirtual ? '<span class="demo-badge">DEMO</span>' : ''}
                </div>
                <div class="user-dropdown">
                    <button class="user-menu-btn">
                        <span>👤</span> ${username}
                        <i class="dropdown-arrow">▼</i>
                    </button>
                    <div class="user-dropdown-menu">
                        <a href="dashboard.html" class="dropdown-item">
                            <i class="menu-icon">📊</i> 대시보드
                        </a>
                        <a href="studio.html" class="dropdown-item">
                            <i class="menu-icon">🎵</i> 스튜디오
                        </a>
                        <a href="musicplace.html" class="dropdown-item">
                            <i class="menu-icon">🎧</i> 마켓플레이스
                        </a>
                        <a href="tltube.html" class="dropdown-item">
                            <i class="menu-icon">🎬</i> TL Tube
                        </a>
                        <div class="dropdown-divider"></div>
                        <button onclick="logoutAll()" class="dropdown-item logout">
                            <i class="menu-icon">🚪</i> 로그아웃
                        </button>
                    </div>
                </div>
            </div>
        `;
    } else {
        return `
            <div class="auth-buttons">
                <a href="login.html" class="auth-btn login-btn">
                    로그인
                </a>
                <a href="signup.html" class="auth-btn signup-btn">
                    회원가입
                </a>
            </div>
        `;
    }
}

// 통합 로그아웃 함수
function logoutAll() {
    if (confirm('정말 로그아웃하시겠습니까?')) {
        // 모든 로그인 데이터 삭제
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('tlSum');
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('virtual_login');
        localStorage.removeItem('demoDashboardData');
        
        // 가상 사용자 배지 제거
        const badge = document.getElementById('virtualUserBadge');
        if (badge) badge.remove();
        
        // 메인 페이지로 이동
        window.location.href = 'index.html';
    }
}

// 가상 사용자 배지 표시
function showVirtualUserBadge(user) {
    if (!user || !user.isVirtual) return;
    
    // 배지가 이미 있으면 업데이트
    let badge = document.getElementById('virtualUserBadge');
    
    if (!badge) {
        badge = document.createElement('div');
        badge.id = 'virtualUserBadge';
        badge.className = 'virtual-user-badge';
        document.body.appendChild(badge);
    }
    
    const username = user.username || 'User';
    badge.innerHTML = \`
        <span>🚀 데모 모드: \${username}</span>
        <button onclick="hideVirtualBadge()" class="badge-close">×</button>
    \`;
    badge.style.display = 'flex';
}

function hideVirtualBadge() {
    const badge = document.getElementById('virtualUserBadge');
    if (badge) {
        badge.style.display = 'none';
    }
}

// 각 페이지의 헤더 배너 내용 커스터마이징
function setBannerContent(title, subtitle = '') {
    const bannerContent = document.querySelector('.banner-content');
    if (bannerContent) {
        bannerContent.innerHTML = \`
            <h1 class="banner-title">\${title}</h1>
            \${subtitle ? \`<p class="banner-subtitle">\${subtitle}</p>\` : ''}
        \`;
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
    
    // 가상 사용자 배지 표시
    const userStr = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (userStr && token) {
        try {
            const user = JSON.parse(userStr);
            if (user.isVirtual) {
                showVirtualUserBadge(user);
            }
        } catch (e) {
            console.error('가상 사용자 배지 표시 오류:', e);
        }
    }
    
    // 드롭다운 메뉴 이벤트 추가
    setTimeout(() => {
        const userMenuBtn = document.querySelector('.user-menu-btn');
        const dropdownMenu = document.querySelector('.user-dropdown-menu');
        
        if (userMenuBtn && dropdownMenu) {
            userMenuBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                dropdownMenu.classList.toggle('show');
            });
            
            // 바깥 클릭 시 닫기
            document.addEventListener('click', function() {
                dropdownMenu.classList.remove('show');
            });
        }
    }, 100);
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

// 전역 함수 노출
window.logoutAll = logoutAll;
window.showVirtualUserBadge = showVirtualUserBadge;
window.hideVirtualBadge = hideVirtualBadge;
