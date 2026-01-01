// src/script/common-components.js

// 공통 네비게이션 바 생성 함수
function createNavigationBar() {
    const navHTML = `
        <header class="main-header">
            <div class="header-content">
                <!-- 로고 -->
                <a href="index.html" class="logo">
                    <div class="logo-icon">
                        <i class="fas fa-music"></i>
                    </div>
                    <div class="logo-text">TIMELINK STUDIO</div>
                </a>
                
                <!-- 메인 메뉴 -->
                <nav class="main-nav">
                    <ul class="nav-menu">
                        <li class="nav-item">
                            <a href="studio.html" class="nav-link">
                                <i class="fas fa-sliders-h"></i>
                                <span class="nav-text">STUDIO</span>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="tlmusic.html" class="nav-link">
                                <i class="fas fa-music"></i>
                                <span class="nav-text">TLMUSIC</span>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="cafe-radio.html" class="nav-link">
                                <i class="fas fa-broadcast-tower"></i>
                                <span class="nav-text">CAFE RADIO</span>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="shareplace.html" class="nav-link">
                                <i class="fas fa-store"></i>
                                <span class="nav-text">SHAREPLACE</span>
                            </a>
                        </li>
                    </ul>
                </nav>
                
                <!-- 우측 메뉴 -->
                <div class="header-right">
                    <div class="tl-balance">
                        <div class="tl-icon">T</div>
                        <span id="balanceAmount">10,000 TL</span>
                    </div>
                    
                    <div class="user-menu">
                        <button class="user-btn" id="userMenuBtn">
                            <div class="user-avatar">
                                <i class="fas fa-user"></i>
                            </div>
                        </button>
                        <div class="user-dropdown" id="userDropdown">
                            <a href="my-music.html" class="dropdown-item">
                                <i class="fas fa-folder"></i> 내 음악
                            </a>
                            <a href="revenue.html" class="dropdown-item">
                                <i class="fas fa-chart-line"></i> 수익 관리
                            </a>
                            <a href="settings.html" class="dropdown-item">
                                <i class="fas fa-cog"></i> 설정
                            </a>
                            <div class="dropdown-divider"></div>
                            <a href="login.html" class="dropdown-item logout">
                                <i class="fas fa-sign-out-alt"></i> 로그아웃
                            </a>
                        </div>
                    </div>
                </div>
                
                <!-- 모바일 메뉴 버튼 -->
                <button class="mobile-menu-btn" id="mobileMenuBtn">
                    <i class="fas fa-bars"></i>
                </button>
            </div>
            
            <!-- 모바일 메뉴 -->
            <div class="mobile-menu" id="mobileMenu">
                <div class="mobile-menu-header">
                    <a href="index.html" class="mobile-logo">
                        <i class="fas fa-music"></i>
                        <span>TIMELINK</span>
                    </a>
                    <button class="mobile-close-btn" id="mobileCloseBtn">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="mobile-tl-balance">
                    <div class="tl-icon">T</div>
                    <span>10,000 TL</span>
                </div>
                
                <ul class="mobile-nav-menu">
                    <li class="mobile-nav-item">
                        <a href="studio.html" class="mobile-nav-link">
                            <i class="fas fa-sliders-h"></i>
                            <span>STUDIO</span>
                            <small>음악 제작 및 TL3 변환</small>
                        </a>
                    </li>
                    <li class="mobile-nav-item">
                        <a href="tlmusic.html" class="mobile-nav-link">
                            <i class="fas fa-music"></i>
                            <span>TLMUSIC</span>
                            <small>음악 스트리밍 서비스</small>
                        </a>
                    </li>
                    <li class="mobile-nav-item">
                        <a href="cafe-radio.html" class="mobile-nav-link">
                            <i class="fas fa-broadcast-tower"></i>
                            <span>CAFE RADIO</span>
                            <small>라이브 라디오 스트리밍</small>
                        </a>
                    </li>
                    <li class="mobile-nav-item">
                        <a href="shareplace.html" class="mobile-nav-link">
                            <i class="fas fa-store"></i>
                            <span>SHAREPLACE</span>
                            <small>음악 마켓플레이스</small>
                        </a>
                    </li>
                </ul>
                
                <div class="mobile-menu-footer">
                    <a href="my-music.html" class="mobile-footer-link">
                        <i class="fas fa-folder"></i> 내 음악
                    </a>
                    <a href="revenue.html" class="mobile-footer-link">
                        <i class="fas fa-chart-line"></i> 수익 관리
                    </a>
                    <a href="settings.html" class="mobile-footer-link">
                        <i class="fas fa-cog"></i> 설정
                    </a>
                    <a href="login.html" class="mobile-footer-link logout">
                        <i class="fas fa-sign-out-alt"></i> 로그아웃
                    </a>
                </div>
            </div>
        </header>
    `;
    
    const navContainer = document.getElementById('nav-container');
    if (navContainer) {
        navContainer.innerHTML = navHTML;
        
        // CSS 스타일 동적 추가 - 기존 스타일과 충돌하지 않도록 수정
        const style = document.createElement('style');
        style.textContent = `
            /* 네비게이션 오버라이드 스타일 */
            #nav-container .main-header {
                background: rgba(10, 15, 43, 0.95);
                backdrop-filter: blur(10px);
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                position: fixed;
                width: 100%;
                top: 0;
                z-index: 1000;
                padding: 1rem 0;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            }
            
            #nav-container .header-content {
                display: flex;
                justify-content: space-between;
                align-items: center;
                max-width: 1400px;
                margin: 0 auto;
                padding: 0 2rem;
                gap: 2rem;
            }
            
            /* 로고 스타일 - 기존 studio 스타일과 통일 */
            #nav-container .logo {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                text-decoration: none;
                flex-shrink: 0;
            }
            
            #nav-container .logo-icon {
                width: 40px;
                height: 40px;
                background: linear-gradient(135deg, #FF6B35, #FFD166);
                border-radius: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: 700;
                font-size: 1.2rem;
                color: white;
            }
            
            #nav-container .logo-text {
                font-size: 1.5rem;
                font-weight: 700;
                background: linear-gradient(135deg, #FF6B35, #FFD166);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                white-space: nowrap;
            }
            
            /* 메인 메뉴 스타일 */
            #nav-container .main-nav {
                flex: 1;
                max-width: 600px;
            }
            
            #nav-container .nav-menu {
                display: flex;
                list-style: none;
                gap: 0.5rem;
                margin: 0;
                padding: 0;
                justify-content: center;
            }
            
            #nav-container .nav-link {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                padding: 0.75rem 1.25rem;
                text-decoration: none;
                color: rgba(255, 255, 255, 0.8);
                font-weight: 500;
                border-radius: 12px;
                transition: all 0.3s ease;
                font-size: 0.9rem;
                white-space: nowrap;
            }
            
            #nav-container .nav-link:hover {
                background: rgba(255, 107, 0, 0.1);
                color: #FFA500;
                transform: translateY(-2px);
            }
            
            #nav-container .nav-link.active {
                background: rgba(255, 107, 0, 0.2);
                color: #FFA500;
                border: 1px solid rgba(255, 107, 0, 0.3);
            }
            
            #nav-container .nav-link i {
                font-size: 1rem;
            }
            
            #nav-container .nav-text {
                font-weight: 600;
            }
            
            /* 우측 메뉴 스타일 - 기존 studio 스타일과 통일 */
            #nav-container .header-right {
                display: flex;
                align-items: center;
                gap: 1.5rem;
                flex-shrink: 0;
            }
            
            #nav-container .tl-balance {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                background: rgba(255, 209, 102, 0.1);
                border: 1px solid rgba(255, 209, 102, 0.3);
                border-radius: 50px;
                padding: 0.75rem 1.5rem;
                font-weight: 700;
                color: #FFD166;
                white-space: nowrap;
            }
            
            #nav-container .tl-icon {
                width: 30px;
                height: 30px;
                background: linear-gradient(135deg, #FFD166, #FF9E00);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1rem;
                font-weight: bold;
                color: #0A0F2B;
            }
            
            /* 사용자 메뉴 */
            #nav-container .user-menu {
                position: relative;
            }
            
            #nav-container .user-btn {
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 50%;
                width: 44px;
                height: 44px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                color: white;
                transition: all 0.3s ease;
            }
            
            #nav-container .user-btn:hover {
                background: rgba(255, 107, 0, 0.1);
                border-color: rgba(255, 107, 0, 0.3);
                transform: scale(1.05);
            }
            
            #nav-container .user-avatar {
                width: 36px;
                height: 36px;
                border-radius: 50%;
                background: linear-gradient(135deg, #FF6B00, #FFA500);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.1rem;
            }
            
            #nav-container .user-dropdown {
                position: absolute;
                top: calc(100% + 10px);
                right: 0;
                background: rgba(26, 35, 66, 0.95);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 12px;
                min-width: 200px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                opacity: 0;
                visibility: hidden;
                transform: translateY(-10px);
                transition: all 0.3s ease;
                z-index: 1001;
                padding: 0.5rem 0;
            }
            
            #nav-container .user-dropdown.show {
                opacity: 1;
                visibility: visible;
                transform: translateY(0);
            }
            
            #nav-container .dropdown-item {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                padding: 0.75rem 1.25rem;
                text-decoration: none;
                color: rgba(255, 255, 255, 0.8);
                font-weight: 500;
                transition: all 0.3s ease;
                font-size: 0.9rem;
            }
            
            #nav-container .dropdown-item:hover {
                background: rgba(255, 107, 0, 0.1);
                color: #FFA500;
            }
            
            #nav-container .dropdown-divider {
                height: 1px;
                background: rgba(255, 255, 255, 0.1);
                margin: 0.5rem 0;
            }
            
            #nav-container .dropdown-item.logout {
                color: #ef4444;
            }
            
            #nav-container .dropdown-item.logout:hover {
                background: rgba(239, 68, 68, 0.1);
            }
            
            /* 모바일 메뉴 버튼 */
            #nav-container .mobile-menu-btn {
                display: none;
                background: none;
                border: none;
                color: white;
                font-size: 1.5rem;
                cursor: pointer;
                padding: 0.5rem;
                transition: all 0.3s ease;
            }
            
            #nav-container .mobile-menu-btn:hover {
                color: #FFA500;
            }
            
            /* 모바일 메뉴 */
            #nav-container .mobile-menu {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(10, 15, 43, 0.98);
                backdrop-filter: blur(20px);
                z-index: 2000;
                padding: 1.5rem;
                overflow-y: auto;
                animation: slideInRight 0.3s ease;
            }
            
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                }
                to {
                    transform: translateX(0);
                }
            }
            
            #nav-container .mobile-menu.show {
                display: block;
            }
            
            #nav-container .mobile-menu-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 2rem;
                padding-bottom: 1rem;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }
            
            #nav-container .mobile-logo {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                text-decoration: none;
                color: white;
                font-size: 1.3rem;
                font-weight: 700;
            }
            
            #nav-container .mobile-logo i {
                color: #FF6B35;
                font-size: 1.5rem;
            }
            
            #nav-container .mobile-close-btn {
                background: none;
                border: none;
                color: white;
                font-size: 1.5rem;
                cursor: pointer;
                padding: 0.5rem;
            }
            
            #nav-container .mobile-tl-balance {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                background: rgba(255, 209, 102, 0.1);
                border: 1px solid rgba(255, 209, 102, 0.3);
                border-radius: 50px;
                padding: 0.75rem 1.5rem;
                font-weight: 700;
                color: #FFD166;
                margin-bottom: 2rem;
                justify-content: center;
            }
            
            #nav-container .mobile-nav-menu {
                list-style: none;
                padding: 0;
                margin: 0 0 2rem 0;
            }
            
            #nav-container .mobile-nav-item {
                margin-bottom: 0.5rem;
            }
            
            #nav-container .mobile-nav-link {
                display: block;
                padding: 1.25rem 1.5rem;
                text-decoration: none;
                color: rgba(255, 255, 255, 0.9);
                border-radius: 12px;
                transition: all 0.3s ease;
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 255, 255, 0.1);
            }
            
            #nav-container .mobile-nav-link:hover,
            #nav-container .mobile-nav-link.active {
                background: rgba(255, 107, 0, 0.1);
                border-color: rgba(255, 107, 0, 0.3);
                transform: translateX(5px);
            }
            
            #nav-container .mobile-nav-link i {
                font-size: 1.5rem;
                margin-bottom: 0.5rem;
                color: #FFA500;
                display: block;
            }
            
            #nav-container .mobile-nav-link span {
                display: block;
                font-size: 1.2rem;
                font-weight: 600;
                margin-bottom: 0.25rem;
            }
            
            #nav-container .mobile-nav-link small {
                display: block;
                color: rgba(255, 255, 255, 0.6);
                font-size: 0.85rem;
            }
            
            #nav-container .mobile-menu-footer {
                padding-top: 1.5rem;
                border-top: 1px solid rgba(255, 255, 255, 0.1);
            }
            
            #nav-container .mobile-footer-link {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                padding: 0.75rem 0;
                text-decoration: none;
                color: rgba(255, 255, 255, 0.8);
                font-weight: 500;
                transition: all 0.3s ease;
                font-size: 0.95rem;
            }
            
            #nav-container .mobile-footer-link:hover {
                color: #FFA500;
            }
            
            #nav-container .mobile-footer-link.logout {
                color: #ef4444;
            }
            
            /* 반응형 디자인 */
            @media (max-width: 1200px) {
                #nav-container .header-content {
                    gap: 1rem;
                }
                
                #nav-container .nav-link {
                    padding: 0.75rem 1rem;
                    font-size: 0.85rem;
                }
            }
            
            @media (max-width: 1024px) {
                #nav-container .main-nav {
                    display: none;
                }
                
                #nav-container .mobile-menu-btn {
                    display: block;
                }
                
                #nav-container .header-content {
                    gap: 1rem;
                }
                
                #nav-container .logo-text {
                    font-size: 1.3rem;
                }
            }
            
            @media (max-width: 768px) {
                #nav-container .tl-balance:not(.mobile-tl-balance) {
                    display: none;
                }
                
                #nav-container .user-btn {
                    width: 40px;
                    height: 40px;
                }
                
                #nav-container .user-avatar {
                    width: 32px;
                    height: 32px;
                    font-size: 1rem;
                }
                
                #nav-container .header-content {
                    padding: 0 1rem;
                }
                
                #nav-container .logo-text {
                    font-size: 1.2rem;
                }
            }
            
            @media (max-width: 480px) {
                #nav-container .logo-text {
                    display: none;
                }
                
                #nav-container .mobile-menu {
                    padding: 1rem;
                }
            }
        `;
        document.head.appendChild(style);
        
        // 현재 페이지 활성화
        highlightCurrentPage();
        
        // 이벤트 리스너 설정
        setupNavigationEvents();
    }
}

// 현재 페이지 메뉴 하이라이트
function highlightCurrentPage() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const desktopLinks = document.querySelectorAll('#nav-container .nav-link');
    const mobileLinks = document.querySelectorAll('#nav-container .mobile-nav-link');
    
    // 데스크톱 링크
    desktopLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
        }
    });
    
    // 모바일 링크
    mobileLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
        }
    });
}

// 네비게이션 이벤트 설정
function setupNavigationEvents() {
    // 유저 드롭다운
    const userMenuBtn = document.getElementById('userMenuBtn');
    const userDropdown = document.getElementById('userDropdown');
    
    if (userMenuBtn && userDropdown) {
        userMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            userDropdown.classList.toggle('show');
        });
        
        // 외부 클릭 시 드롭다운 닫기
        document.addEventListener('click', () => {
            userDropdown.classList.remove('show');
        });
        
        // 드롭다운 내부 클릭 시 이벤트 전파 방지
        userDropdown.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }
    
    // 모바일 메뉴
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileCloseBtn = document.getElementById('mobileCloseBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.add('show');
            document.body.style.overflow = 'hidden';
        });
        
        mobileCloseBtn.addEventListener('click', () => {
            mobileMenu.classList.remove('show');
            document.body.style.overflow = '';
        });
        
        // 모바일 메뉴 링크 클릭 시 메뉴 닫기
        const mobileLinks = mobileMenu.querySelectorAll('.mobile-nav-link, .mobile-footer-link');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('show');
                document.body.style.overflow = '';
            });
        });
        
        // ESC 키로 모바일 메뉴 닫기
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobileMenu.classList.contains('show')) {
                mobileMenu.classList.remove('show');
                document.body.style.overflow = '';
            }
        });
    }
}

// TL 잔액 업데이트 함수
function updateTLBalance(balance) {
    const balanceElements = document.querySelectorAll('#balanceAmount, .mobile-tl-balance span');
    balanceElements.forEach(element => {
        element.textContent = `${balance.toLocaleString()} TL`;
    });
}

// 페이지 로드 시 네비게이션 생성
document.addEventListener('DOMContentLoaded', function() {
    createNavigationBar();
    
    // TL 잔액 로컬스토리지에서 불러오기
    const savedBalance = localStorage.getItem('tlBalance');
    if (savedBalance) {
        updateTLBalance(parseInt(savedBalance));
    }
    
    // body에 패딩 추가 (네비게이션 높이만큼)
    document.body.style.paddingTop = '80px';
});

// 창 크기 변경 시 body 패딩 조정
window.addEventListener('resize', function() {
    const header = document.querySelector('#nav-container .main-header');
    if (header) {
        document.body.style.paddingTop = header.offsetHeight + 'px';
    }
});
