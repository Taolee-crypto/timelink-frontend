// common-components.js
class CommonComponents {
    constructor() {
        this.domain = 'timelink.digital';
        this.init();
    }

    init() {
        this.injectStyles();
        this.injectHeader();
        this.injectFooter();
        this.setupEventListeners();
        this.setPageMetadata();
    }

    setPageMetadata() {
        // 기본 메타데이터 설정
        const metaTags = [
            { name: 'description', content: 'TimeLink - 디지털 음악 P2P 플랫폼, 아티스트와 팬을 직접 연결합니다.' },
            { name: 'keywords', content: '음악, P2P, 블록체인, 디지털 음원, 아티스트, 타임링크, TimeLink' },
            { name: 'author', content: 'TimeLink Team' },
            { property: 'og:title', content: 'TimeLink | 디지털 음악 P2P 플랫폼' },
            { property: 'og:description', content: '당신의 음악이 가치를 갖는 순간' },
            { property: 'og:url', content: `https://${this.domain}` },
            { property: 'og:type', content: 'website' },
            { name: 'twitter:card', content: 'summary_large_image' },
            { name: 'twitter:title', content: 'TimeLink | 디지털 음악 P2P 플랫폼' },
            { name: 'twitter:description', content: '당신의 음악이 가치를 갖는 순간' }
        ];

        metaTags.forEach(tag => {
            let meta = document.querySelector(`meta[${tag.name ? 'name' : 'property'}="${tag.name || tag.property}"]`);
            if (!meta) {
                meta = document.createElement('meta');
                if (tag.name) meta.name = tag.name;
                if (tag.property) meta.setAttribute('property', tag.property);
                document.head.appendChild(meta);
            }
            meta.content = tag.content;
        });
    }

    injectStyles() {
        const style = `
            /* 공통 변수 */
            :root {
                --bg-primary: #0a0a1a;
                --bg-secondary: #161632;
                --bg-card: rgba(22, 22, 50, 0.7);
                --color-primary: #7c4dff;
                --color-primary-hover: #6a40e6;
                --color-text: #ffffff;
                --color-text-secondary: #b0b0d0;
                --color-border: rgba(124, 77, 255, 0.2);
                --color-success: #10b981;
                --color-warning: #f59e0b;
                --color-danger: #ef4444;
            }

            /* 공통 스타일 */
            body {
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                background: linear-gradient(135deg, #0a0a1a 0%, #1a1a2e 100%);
                color: var(--color-text);
                min-height: 100vh;
                margin: 0;
                padding-top: 70px; /* 네비게이션 높이 */
                line-height: 1.6;
            }

            * {
                box-sizing: border-box;
            }

            a {
                text-decoration: none;
                color: inherit;
                transition: color 0.3s ease;
            }

            a:hover {
                color: var(--color-primary);
            }

            /* 네비게이션 바 */
            .navbar-main {
                background: rgba(22, 22, 50, 0.95);
                backdrop-filter: blur(20px);
                -webkit-backdrop-filter: blur(20px);
                border-bottom: 1px solid var(--color-border);
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                z-index: 1000;
                padding: 0.75rem 0;
                height: 70px;
            }

            .navbar-container {
                max-width: 1200px;
                margin: 0 auto;
                padding: 0 1.5rem;
                display: flex;
                align-items: center;
                justify-content: space-between;
                height: 100%;
            }

            .navbar-brand a {
                font-size: 1.8rem;
                font-weight: 800;
                background: linear-gradient(135deg, #7c4dff, #00e5ff);
                -webkit-background-clip: text;
                background-clip: text;
                color: transparent;
                display: flex;
                align-items: center;
                gap: 10px;
            }

            .navbar-brand a::before {
                content: "♪";
                font-size: 1.5rem;
            }

            .navbar-menu {
                display: flex;
                gap: 1.8rem;
                align-items: center;
            }

            .nav-item {
                color: var(--color-text-secondary);
                font-weight: 500;
                padding: 0.5rem 0;
                position: relative;
                transition: color 0.3s ease;
                font-size: 0.95rem;
                white-space: nowrap;
                letter-spacing: 0.3px;
            }

            .nav-item:hover {
                color: var(--color-text);
            }

            .nav-item.active {
                color: var(--color-primary);
                font-weight: 600;
            }

            .nav-item.active::after {
                content: '';
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                height: 2px;
                background: linear-gradient(90deg, #7c4dff, #00e5ff);
                border-radius: 2px;
            }

            .navbar-actions {
                display: flex;
                align-items: center;
                gap: 1rem;
            }

            .btn-nav {
                padding: 0.5rem 1.5rem;
                border-radius: 10px;
                font-weight: 600;
                font-size: 0.95rem;
                transition: all 0.3s ease;
                white-space: nowrap;
                cursor: pointer;
                border: none;
                letter-spacing: 0.3px;
            }

            .btn-nav-primary {
                background: linear-gradient(135deg, #7c4dff, #536dfe);
                color: white;
                box-shadow: 0 4px 15px rgba(124, 77, 255, 0.2);
            }

            .btn-nav-primary:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(124, 77, 255, 0.3);
                background: linear-gradient(135deg, #6a40e6, #4559d1);
            }

            .btn-nav-outline {
                border: 2px solid var(--color-border);
                color: var(--color-text);
                background: transparent;
            }

            .btn-nav-outline:hover {
                background: rgba(255, 255, 255, 0.1);
                border-color: var(--color-primary);
                transform: translateY(-2px);
            }

            .mobile-menu-toggle {
                display: none;
                background: none;
                border: none;
                color: var(--color-text);
                font-size: 1.8rem;
                cursor: pointer;
                padding: 0.5rem;
            }

            /* 푸터 */
            .footer-main {
                background: rgba(10, 10, 26, 0.95);
                border-top: 1px solid var(--color-border);
                padding: 3rem 0 1.5rem;
                margin-top: 4rem;
            }

            .footer-container {
                max-width: 1200px;
                margin: 0 auto;
                padding: 0 1.5rem;
            }

            .footer-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 2.5rem;
                margin-bottom: 2rem;
            }

            .footer-section h4 {
                color: var(--color-text);
                margin-bottom: 1.2rem;
                font-size: 1.2rem;
                font-weight: 600;
            }

            .footer-links {
                list-style: none;
                padding: 0;
                margin: 0;
            }

            .footer-links li {
                margin-bottom: 0.7rem;
            }

            .footer-links a {
                color: var(--color-text-secondary);
                transition: color 0.3s ease;
                display: inline-flex;
                align-items: center;
                gap: 8px;
            }

            .footer-links a:hover {
                color: var(--color-primary);
            }

            .footer-links a::before {
                content: "→";
                font-size: 0.9rem;
                opacity: 0.7;
            }

            .footer-bottom {
                border-top: 1px solid var(--color-border);
                padding-top: 1.5rem;
                text-align: center;
                color: var(--color-text-secondary);
                font-size: 0.9rem;
                display: flex;
                justify-content: space-between;
                align-items: center;
                flex-wrap: wrap;
                gap: 1rem;
            }

            .domain-badge {
                background: linear-gradient(135deg, #7c4dff, #00e5ff);
                color: white;
                padding: 0.3rem 1rem;
                border-radius: 20px;
                font-size: 0.85rem;
                font-weight: 600;
                letter-spacing: 0.5px;
            }

            .social-links {
                display: flex;
                gap: 1rem;
            }

            .social-links a {
                color: var(--color-text-secondary);
                font-size: 1.2rem;
                transition: color 0.3s ease;
            }

            .social-links a:hover {
                color: var(--color-primary);
            }

            /* 반응형 */
            @media (max-width: 992px) {
                .navbar-menu {
                    gap: 1.2rem;
                }
                
                .nav-item {
                    font-size: 0.9rem;
                }
                
                .btn-nav {
                    padding: 0.5rem 1rem;
                    font-size: 0.9rem;
                }
            }

            @media (max-width: 768px) {
                body {
                    padding-top: 60px;
                }
                
                .navbar-main {
                    height: 60px;
                }

                .navbar-menu {
                    display: none;
                    position: absolute;
                    top: 100%;
                    left: 0;
                    right: 0;
                    background: rgba(22, 22, 50, 0.98);
                    backdrop-filter: blur(20px);
                    padding: 1.5rem;
                    flex-direction: column;
                    gap: 1.2rem;
                    border-bottom: 1px solid var(--color-border);
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                }

                .navbar-menu.active {
                    display: flex;
                }

                .navbar-actions {
                    display: none;
                    position: absolute;
                    top: calc(100% + 220px);
                    left: 0;
                    right: 0;
                    background: rgba(22, 22, 50, 0.98);
                    padding: 1.5rem;
                    flex-direction: column;
                    gap: 1rem;
                }

                .navbar-actions.active {
                    display: flex;
                }

                .mobile-menu-toggle {
                    display: block;
                }

                .nav-item {
                    padding: 0.75rem 1rem;
                    width: 100%;
                    text-align: center;
                    border-radius: 8px;
                    background: rgba(255, 255, 255, 0.05);
                }
                
                .nav-item.active {
                    background: rgba(124, 77, 255, 0.1);
                }
                
                .footer-bottom {
                    flex-direction: column;
                    text-align: center;
                    gap: 1rem;
                }
            }
            
            @media (max-width: 480px) {
                .navbar-brand a {
                    font-size: 1.5rem;
                }
                
                .domain-badge {
                    font-size: 0.75rem;
                    padding: 0.3rem 0.8rem;
                }
            }
        `;

        const styleElement = document.createElement('style');
        styleElement.textContent = style;
        document.head.appendChild(styleElement);
    }

    injectHeader() {
        const currentPath = window.location.pathname;
        const currentPage = currentPath.split('/').pop().replace('.html', '') || 'index';
        
        const headerHTML = `
            <nav class="navbar-main">
                <div class="navbar-container">
                    <div class="navbar-brand">
                        <a href="./index.html">TimeLink</a>
                    </div>

                    <div class="navbar-menu">
                        <a href="./index.html" class="nav-item ${currentPage === 'index' ? 'active' : ''}">
                            <i class="bi bi-house-door me-1"></i>Home
                        </a>
                        <a href="./studio.html" class="nav-item ${currentPage === 'studio' ? 'active' : ''}">
                            <i class="bi bi-mic me-1"></i>Studio
                        </a>
                        <a href="./tltube.html" class="nav-item ${currentPage === 'tltube' ? 'active' : ''}">
                            <i class="bi bi-play-btn me-1"></i>TLTube
                        </a>
                        <a href="./musicplace.html" class="nav-item ${currentPage === 'musicplace' ? 'active' : ''}">
                            <i class="bi bi-music-note-list me-1"></i>MusicPlace
                        </a>
                        <a href="./dashboard.html" class="nav-item ${currentPage === 'dashboard' ? 'active' : ''}">
                            <i class="bi bi-speedometer2 me-1"></i>Dashboard
                        </a>
                        <a href="./charge.html" class="nav-item ${currentPage === 'charge' ? 'active' : ''}">
                            <i class="bi bi-lightning-charge me-1"></i>Charge
                        </a>
                    </div>

                    <div class="navbar-actions">
                        <a href="./guide.html" class="nav-item">
                            <i class="bi bi-journal-text me-1"></i>Guide
                        </a>
                        <a href="./faq.html" class="nav-item">
                            <i class="bi bi-question-circle me-1"></i>FAQ
                        </a>
                        ${this.isLoggedIn() 
                            ? `<button class="btn-nav btn-nav-outline" onclick="logout()">
                                   <i class="bi bi-box-arrow-right me-1"></i>Logout
                               </button>
                               <a href="./dashboard.html" class="btn-nav btn-nav-primary">
                                   <i class="bi bi-person-circle me-1"></i>Dashboard
                               </a>`
                            : `<a href="./login.html" class="nav-item">
                                   <i class="bi bi-box-arrow-in-right me-1"></i>Login
                               </a>
                               <a href="./signup.html" class="btn-nav btn-nav-primary">
                                   <i class="bi bi-person-plus me-1"></i>Sign Up
                               </a>`
                        }
                    </div>

                    <button class="mobile-menu-toggle" onclick="toggleMobileMenu()">
                        <i class="bi bi-list"></i>
                    </button>
                </div>
            </nav>
        `;

        document.body.insertAdjacentHTML('afterbegin', headerHTML);
    }

    injectFooter() {
        const currentYear = new Date().getFullYear();
        
        const footerHTML = `
            <footer class="footer-main">
                <div class="footer-container">
                    <div class="footer-grid">
                        <div class="footer-section">
                            <h4>TimeLink.digital</h4>
                            <p style="color: var(--color-text-secondary); line-height: 1.8;">
                                디지털 음악 P2P 플랫폼<br>
                                아티스트와 팬을 직접 연결합니다.<br>
                                당신의 음악이 가치를 갖는 순간
                            </p>
                            <div class="social-links mt-3">
                                <a href="https://twitter.com/TimeLink_digital" target="_blank">
                                    <i class="bi bi-twitter"></i>
                                </a>
                                <a href="https://github.com/Taolee-crypto/timelink-frontend" target="_blank">
                                    <i class="bi bi-github"></i>
                                </a>
                                <a href="https://t.me/timelink_digital" target="_blank">
                                    <i class="bi bi-telegram"></i>
                                </a>
                                <a href="mailto:support@timelink.digital">
                                    <i class="bi bi-envelope"></i>
                                </a>
                            </div>
                        </div>
                        
                        <div class="footer-section">
                            <h4>서비스</h4>
                            <ul class="footer-links">
                                <li><a href="./index.html">홈페이지</a></li>
                                <li><a href="./studio.html">스튜디오</a></li>
                                <li><a href="./tltube.html">TLTube</a></li>
                                <li><a href="./musicplace.html">음악마켓</a></li>
                                <li><a href="./dashboard.html">대시보드</a></li>
                            </ul>
                        </div>
                        
                        <div class="footer-section">
                            <h4>지원</h4>
                            <ul class="footer-links">
                                <li><a href="./guide.html">이용 가이드</a></li>
                                <li><a href="./faq.html">자주 묻는 질문</a></li>
                                <li><a href="mailto:support@timelink.digital">문의하기</a></li>
                                <li><a href="#">이용약관</a></li>
                                <li><a href="#">개인정보처리방침</a></li>
                            </ul>
                        </div>
                        
                        <div class="footer-section">
                            <h4>문의</h4>
                            <ul class="footer-links">
                                <li>Email: support@timelink.digital</li>
                                <li>Telegram: @timelink_digital</li>
                                <li>Twitter: @TimeLink_digital</li>
                                <li>오전 9시 - 오후 6시 (한국시간)</li>
                            </ul>
                        </div>
                    </div>
                    
                    <div class="footer-bottom">
                        <div>
                            &copy; ${currentYear} TimeLink.digital. All rights reserved.
                        </div>
                        <div class="domain-badge">
                            timelink.digital
                        </div>
                        <div class="social-links">
                            <span style="color: var(--color-text-secondary); font-size: 0.85rem;">
                                P2P Digital Music Platform
                            </span>
                        </div>
                    </div>
                </div>
            </footer>
        `;

        document.body.insertAdjacentHTML('beforeend', footerHTML);
    }

    setupEventListeners() {
        this.checkLoginStatus();
        
        // 글로벌 함수 등록
        window.toggleMobileMenu = this.toggleMobileMenu;
        window.logout = this.logout;
        window.isLoggedIn = this.isLoggedIn;
    }

    checkLoginStatus() {
        const token = localStorage.getItem('timelink_auth_token');
        const user = localStorage.getItem('timelink_user');
        
        if (token && user) {
            document.body.classList.add('logged-in');
            // 사용자 정보 업데이트 (필요시)
        }
    }

    toggleMobileMenu() {
        const menu = document.querySelector('.navbar-menu');
        const actions = document.querySelector('.navbar-actions');
        
        menu.classList.toggle('active');
        actions.classList.toggle('active');
        
        // 아이콘 변경
        const toggleBtn = document.querySelector('.mobile-menu-toggle i');
        if (menu.classList.contains('active')) {
            toggleBtn.className = 'bi bi-x';
        } else {
            toggleBtn.className = 'bi bi-list';
        }
    }

    logout() {
        localStorage.removeItem('timelink_auth_token');
        localStorage.removeItem('timelink_user');
        sessionStorage.clear();
        
        // 로그아웃 알림
        alert('로그아웃되었습니다.');
        window.location.href = './index.html';
    }

    isLoggedIn() {
        return !!localStorage.getItem('timelink_auth_token');
    }
}

// Bootstrap Icons 추가
const bootstrapIcons = document.createElement('link');
bootstrapIcons.rel = 'stylesheet';
bootstrapIcons.href = 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.3/font/bootstrap-icons.css';
document.head.appendChild(bootstrapIcons);

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
    new CommonComponents();
    
    // 모바일 메뉴 외부 클릭 시 닫기
    document.addEventListener('click', (e) => {
        const menu = document.querySelector('.navbar-menu');
        const actions = document.querySelector('.navbar-actions');
        const toggleBtn = document.querySelector('.mobile-menu-toggle');
        
        if (menu && menu.classList.contains('active') && 
            !menu.contains(e.target) && 
            !toggleBtn.contains(e.target)) {
            menu.classList.remove('active');
            actions.classList.remove('active');
            toggleBtn.querySelector('i').className = 'bi bi-list';
        }
    });
});

// 모듈로 내보내기
export default CommonComponents;
