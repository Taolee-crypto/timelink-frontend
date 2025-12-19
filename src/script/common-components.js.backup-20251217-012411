// ===============================
// TimeLink 공통 네비게이션 컴포넌트
// ===============================

console.log("TimeLink common-components.js 로드됨");

/**
 * 네비게이션 메뉴 생성
 */
function createNavigation() {
    console.log("createNavigation() 실행");
    
    const userSection = getUserSection();
    
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
                            <a href="musicplace.html" class="menu-link">
                                <span>🎧</span> MUSIC PLACE
                            </a>
                            <div class="submenu">
                                <a href="musicplace.html" class="submenu-link">P2P 마켓플레이스</a>
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
                                <a href="#" class="submenu-link">영상 미리보기</a>
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
                    </ul>
                </nav>
                
                <!-- 사용자 섹션 -->
                <div class="user-section">
                    ${userSection}
                </div>
            </div>
        </header>
        
        <!-- 헤더 배너 -->
        <div class="header-banner">
            <div class="banner-overlay"></div>
            <div class="banner-content">
                <h1 class="banner-title">TimeLink</h1>
                <p class="banner-subtitle">디지털 자산 P2P 플랫폼</p>
            </div>
        </div>
    `;
}

/**
 * 사용자 섹션 생성 (가상 로그인 통합)
 */
function getUserSection() {
    // 로그인 상태 확인
    const userStr = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    let user = null;
    let isLoggedIn = false;
    let username = "Guest";
    let isVirtual = false;
    let balance = "0.00";
    
    if (userStr && token) {
        try {
            user = JSON.parse(userStr);
            isLoggedIn = true;
            username = user.username || user.displayName || "User";
            isVirtual = user.isVirtual || false;
            balance = user.balance ? user.balance.toFixed(2) + " TL" : "1,000.00 TL";
        } catch (e) {
            console.error("사용자 데이터 파싱 오류:", e);
        }
    }
    
    if (isLoggedIn) {
        return `
            <div class="user-area">
                <div class="tl-sum-display">
                    <span class="tl-sum-label">TL:</span>
                    <span class="tl-sum-value">${balance}</span>
                    ${isVirtual ? '<span class="demo-badge">DEMO</span>' : ''}
                </div>
                <div class="user-dropdown">
                    <button class="user-menu-btn" onclick="toggleDropdown()">
                        <span>👤</span> ${username}
                        <span class="dropdown-arrow">▼</span>
                    </button>
                    <div class="user-dropdown-menu" id="userDropdownMenu">
                        <a href="dashboard.html" class="dropdown-item">
                            <span class="menu-icon">📊</span> 대시보드
                        </a>
                        <a href="studio.html" class="dropdown-item">
                            <span class="menu-icon">🎵</span> 스튜디오
                        </a>
                        <a href="musicplace.html" class="dropdown-item">
                            <span class="menu-icon">🎧</span> 마켓플레이스
                        </a>
                        <div class="dropdown-divider"></div>
                        <button onclick="logout()" class="dropdown-item logout">
                            <span class="menu-icon">🚪</span> 로그아웃
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

/**
 * 드롭다운 토글
 */
function toggleDropdown() {
    const menu = document.getElementById('userDropdownMenu');
    if (menu) {
        menu.classList.toggle('show');
    }
}

/**
 * 로그아웃
 */
function logout() {
    if (confirm('로그아웃하시겠습니까?')) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('virtual_login');
        window.location.href = 'index.html';
    }
}

/**
 * 페이지 초기화
 */
function initPage() {
    console.log("페이지 초기화 시작");
    
    // 네비게이션 추가
    const navHTML = createNavigation();
    const navContainer = document.createElement('div');
    navContainer.innerHTML = navHTML;
    
    // body 시작 부분에 삽입
    if (document.body.firstChild) {
        document.body.insertBefore(navContainer, document.body.firstChild);
    } else {
        document.body.appendChild(navContainer);
    }
    
    console.log("네비게이션 추가 완료");
    
    // 드롭다운 이벤트 설정
    setTimeout(() => {
        const userBtn = document.querySelector('.user-menu-btn');
        const dropdown = document.getElementById('userDropdownMenu');
        
        if (userBtn && dropdown) {
            // 버튼 클릭 시 토글
            userBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                dropdown.classList.toggle('show');
            });
            
            // 바깥 클릭 시 닫기
            document.addEventListener('click', function() {
                dropdown.classList.remove('show');
            });
            
            // 드롭다운 내부 클릭 시 이벤트 전파 중단
            dropdown.addEventListener('click', function(e) {
                e.stopPropagation();
            });
        }
    }, 100);
}

// DOM 로드 시 초기화
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPage);
} else {
    // 이미 로드된 경우
    setTimeout(initPage, 100);
}

// 전역 함수 노출
window.createNavigation = createNavigation;
window.toggleDropdown = toggleDropdown;
window.logout = logout;
window.initPage = initPage;

console.log("common-components.js 초기화 완료");
