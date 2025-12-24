// TIMELINK 공통 헤더 관리자
class HeaderManager {
    constructor() {
        this.init();
    }

    init() {
        // 페이지 로드 시 헤더 업데이트
        document.addEventListener('DOMContentLoaded', () => {
            this.setupCommonHeader();
            this.setupMobileMenu();
            this.setupUserMenu();
            this.setupNavigation();
            this.updateAuthUI();
        });
    }

    // 공통 헤더 설정
    setupCommonHeader() {
        // 현재 페이지 확인
        const currentPath = window.location.pathname;
        const currentPage = currentPath.split('/').pop() || 'index.html';
        
        // 모든 네비게이션 링크 업데이트
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPage || 
                (currentPage === '' && href === 'index.html') ||
                (currentPage === 'index.html' && href === 'index.html')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    // 모바일 메뉴 설정
    setupMobileMenu() {
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const mainNav = document.getElementById('mainNav');
        
        if (mobileMenuBtn && mainNav) {
            mobileMenuBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                mainNav.classList.toggle('active');
                
                // 아이콘 변경
                const icon = mobileMenuBtn.querySelector('i');
                if (mainNav.classList.contains('active')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                } else {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
            
            // 모바일에서 메뉴 클릭 시 자동 닫힘
            const navLinks = mainNav.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    mainNav.classList.remove('active');
                    if (mobileMenuBtn.querySelector('i')) {
                        mobileMenuBtn.querySelector('i').classList.remove('fa-times');
                        mobileMenuBtn.querySelector('i').classList.add('fa-bars');
                    }
                });
            });
            
            // 문서 클릭 시 메뉴 닫기
            document.addEventListener('click', (e) => {
                if (!mainNav.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                    mainNav.classList.remove('active');
                    if (mobileMenuBtn.querySelector('i')) {
                        mobileMenuBtn.querySelector('i').classList.remove('fa-times');
                        mobileMenuBtn.querySelector('i').classList.add('fa-bars');
                    }
                }
            });
        }
    }

    // 사용자 메뉴 설정
    setupUserMenu() {
        const userMenuBtn = document.getElementById('userMenuBtn');
        const userDropdown = document.getElementById('userDropdown');
        const walletBtn = document.getElementById('walletBtn');
        
        // 사용자 메뉴 버튼 클릭
        if (userMenuBtn && userDropdown) {
            userMenuBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.createDropdownContent();
                userDropdown.classList.toggle('active');
            });
            
            // 외부 클릭 시 드롭다운 닫기
            document.addEventListener('click', (e) => {
                if (!userDropdown.contains(e.target) && !userMenuBtn.contains(e.target)) {
                    userDropdown.classList.remove('active');
                }
            });
        }
        
        // 지갑 버튼 클릭
        if (walletBtn) {
            walletBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleWalletClick();
            });
        }
    }

    // 네비게이션 설정
    setupNavigation() {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                // 특정 페이지 내부 링크 처리 (해시)
                if (link.hash && window.location.pathname.includes('profile.html')) {
                    e.preventDefault();
                    window.location.hash = link.hash;
                    return;
                }
                
                // 외부 링크 또는 다른 페이지로 이동
                const href = link.getAttribute('href');
                if (href && !href.startsWith('#')) {
                    // 같은 페이지 내 이동이 아닌 경우
                    if (!window.location.href.includes(href.replace('.html', ''))) {
                        window.location.href = href;
                    }
                }
            });
        });
    }

    // 인증 UI 업데이트
    updateAuthUI() {
        const userMenuBtn = document.getElementById('userMenuBtn');
        const walletBtn = document.getElementById('walletBtn');
        const headerBalance = document.getElementById('headerBalanceAmount');
        
        // 인증 상태 확인
        const isLoggedIn = window.timelinkAuth && window.timelinkAuth.isLoggedIn();
        const userData = isLoggedIn ? window.timelinkAuth.getUserData() : null;
        
        if (isLoggedIn && userData) {
            // 로그인된 상태
            if (userMenuBtn) {
                const initials = userData.name ? userData.name.charAt(0).toUpperCase() : 'U';
                userMenuBtn.innerHTML = initials;
                userMenuBtn.title = userData.name || '사용자';
            }
            
            if (headerBalance) {
                headerBalance.textContent = userData.tlBalance ? userData.tlBalance.toLocaleString() : '0';
            }
            
            if (walletBtn) {
                walletBtn.style.display = 'flex';
            }
        } else {
            // 로그인되지 않은 상태
            if (userMenuBtn) {
                userMenuBtn.innerHTML = '<i class="fas fa-user"></i>';
                userMenuBtn.title = '로그인';
            }
            
            if (headerBalance) {
                headerBalance.textContent = '0';
            }
            
            if (walletBtn) {
                walletBtn.style.display = 'flex'; // 지갑 버튼은 항상 표시
            }
        }
    }

    // 드롭다운 내용 생성
    createDropdownContent() {
        const userDropdown = document.getElementById('userDropdown');
        if (!userDropdown) return;
        
        const isLoggedIn = window.timelinkAuth && window.timelinkAuth.isLoggedIn();
        const userData = isLoggedIn ? window.timelinkAuth.getUserData() : null;
        
        if (isLoggedIn && userData) {
            const initials = userData.name ? userData.name.charAt(0).toUpperCase() : 'U';
            const balance = userData.tlBalance ? userData.tlBalance.toLocaleString() : '0';
            const name = userData.name || userData.nickname || '사용자';
            const email = userData.email || 'user@timelink.digital';
            
            userDropdown.innerHTML = `
                <div class="dropdown-header">
                    <div class="dropdown-user-info">
                        <div class="dropdown-avatar">${initials}</div>
                        <div class="dropdown-user-text">
                            <h4>${name}</h4>
                            <p>${email}</p>
                        </div>
                    </div>
                    <div class="dropdown-balance">
                        <div class="tl-icon" style="width: 20px; height: 20px; font-size: 0.7rem;">TL</div>
                        <span>${balance} TL</span>
                    </div>
                </div>
                
                <div class="dropdown-menu">
                    <a href="profile.html" class="dropdown-item">
                        <i class="fas fa-tachometer-alt"></i>
                        <span>대시보드</span>
                    </a>
                    <a href="profile.html#profile" class="dropdown-item">
                        <i class="fas fa-user-edit"></i>
                        <span>개인정보</span>
                    </a>
                    <a href="profile.html#wallet" class="dropdown-item">
                        <i class="fas fa-wallet"></i>
                        <span>TL 지갑</span>
                    </a>
                    <div class="dropdown-divider"></div>
                    <a href="studio.html" class="dropdown-item">
                        <i class="fas fa-plus"></i>
                        <span>새 콘텐츠 업로드</span>
                    </a>
                    <div class="dropdown-divider"></div>
                    <div class="dropdown-item logout" id="dropdownLogoutBtn">
                        <i class="fas fa-sign-out-alt"></i>
                        <span>로그아웃</span>
                    </div>
                </div>
                
                <div class="dropdown-footer">
                    TIMELINK v1.0
                </div>
            `;
            
            // 로그아웃 버튼 이벤트
            const logoutBtn = document.getElementById('dropdownLogoutBtn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.handleLogout();
                });
            }
        } else {
            // 로그인되지 않은 경우
            userDropdown.innerHTML = `
                <div class="dropdown-header">
                    <div class="dropdown-user-info">
                        <div class="dropdown-avatar">?</div>
                        <div class="dropdown-user-text">
                            <h4>로그인이 필요합니다</h4>
                            <p>로그인하여 모든 기능을 이용하세요</p>
                        </div>
                    </div>
                </div>
                
                <div class="dropdown-menu">
                    <a href="login.html" class="dropdown-item">
                        <i class="fas fa-sign-in-alt"></i>
                        <span>로그인</span>
                    </a>
                    <a href="register.html" class="dropdown-item">
                        <i class="fas fa-user-plus"></i>
                        <span>회원가입</span>
                    </a>
                </div>
            `;
        }
    }

    // 지갑 클릭 처리
    handleWalletClick() {
        const isLoggedIn = window.timelinkAuth && window.timelinkAuth.isLoggedIn();
        
        if (isLoggedIn) {
            const userData = window.timelinkAuth.getUserData();
            // 프로필 페이지인 경우 지갑 섹션으로 이동
            if (window.location.pathname.includes('profile.html')) {
                window.location.hash = 'wallet';
            } else {
                // 다른 페이지인 경우 프로필 페이지로 이동
                window.location.href = 'profile.html#wallet';
            }
        } else {
            alert('지갑 기능을 사용하려면 로그인이 필요합니다.');
            window.location.href = 'login.html';
        }
    }

    // 로그아웃 처리
    handleLogout() {
        if (window.timelinkAuth) {
            window.timelinkAuth.logout();
        } else {
            localStorage.removeItem('timelink_token');
            localStorage.removeItem('timelink_user');
            alert('로그아웃되었습니다.');
            window.location.href = 'index.html';
        }
    }

    // 헤더 새로고침 (인증 상태 변경 시 호출)
    refreshHeader() {
        this.updateAuthUI();
    }
}

// 전역 헤더 관리자 인스턴스 생성
window.timelinkHeader = new HeaderManager();
