// common-components.js
class CommonComponents {
    constructor() {
        this.init();
    }

    init() {
        this.injectStyles();
        this.injectHeader();
        this.injectFooter();
        this.setupEventListeners();
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
                font-family: 'Inter', sans-serif;
                background: linear-gradient(135deg, #0a0a1a 0%, #1a1a2e 100%);
                color: var(--color-text);
                min-height: 100vh;
                margin: 0;
                padding-top: 70px; /* 네비게이션 높이 */
            }

            * {
                box-sizing: border-box;
            }

            a {
                text-decoration: none;
                color: inherit;
            }

            /* 네비게이션 바 */
            .navbar-main {
                background: rgba(22, 22, 50, 0.95);
                backdrop-filter: blur(20px);
                border-bottom: 1px solid var(--color-border);
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                z-index: 1000;
                padding: 0.75rem 0;
            }

            .navbar-container {
                max-width: 1200px;
                margin: 0 auto;
                padding: 0 1.5rem;
                display: flex;
                align-items: center;
                justify-content: space-between;
            }

            .navbar-brand a {
                font-size: 1.5rem;
                font-weight: 800;
                color: var(--color-text);
                background: linear-gradient(135deg, #7c4dff, #00e5ff);
                -webkit-background-clip: text;
                background-clip: text;
                color: transparent;
            }

            .navbar-menu {
                display: flex;
                gap: 2rem;
                align-items: center;
            }

            .nav-item {
                color: var(--color-text-secondary);
                font-weight: 500;
                padding: 0.5rem 0;
                position: relative;
                transition: color 0.3s ease;
                font-size: 0.95rem;
                white-space: nowrap; /* 글씨 줄바꿈 방지 */
            }

            .nav-item:hover {
                color: var(--color-text);
            }

            .nav-item.active {
                color: var(--color-primary);
            }

            .nav-item.active::after {
                content: '';
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                height: 2px;
                background: linear-gradient(90deg, #7c4dff, #00e5ff);
            }

            .navbar-actions {
                display: flex;
                align-items: center;
                gap: 1rem;
            }

            .btn-nav {
                padding: 0.5rem 1.25rem;
                border-radius: 8px;
                font-weight: 600;
                font-size: 0.95rem;
                transition: all 0.3s ease;
                white-space: nowrap; /* 글씨 줄바꿈 방지 */
            }

            .btn-nav-primary {
                background: linear-gradient(135deg, #7c4dff, #536dfe);
                color: white;
                border: none;
            }

            .btn-nav-primary:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(124, 77, 255, 0.3);
            }

            .btn-nav-outline {
                border: 2px solid var(--color-border);
                color: var(--color-text);
                background: transparent;
            }

            .btn-nav-outline:hover {
                background: rgba(255, 255, 255, 0.1);
                border-color: var(--color-primary);
            }

            .mobile-menu-toggle {
                display: none;
                background: none;
                border: none;
                color: var(--color-text);
                font-size: 1.5rem;
                cursor: pointer;
            }

            /* 푸터 */
            .footer-main {
                background: rgba(10, 10, 26, 0.95);
                border-top: 1px solid var(--color-border);
                padding: 3rem 0 1.5rem;
                margin-top: auto;
            }

            .footer-container {
                max-width: 1200px;
                margin: 0 auto;
                padding: 0 1.5rem;
            }

            .footer-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 2rem;
                margin-bottom: 2rem;
            }

            .footer-section h4 {
                color: var(--color-text);
                margin-bottom: 1rem;
                font-size: 1.1rem;
            }

            .footer-links {
                list-style: none;
                padding: 0;
                margin: 0;
            }

            .footer-links li {
                margin-bottom: 0.5rem;
            }

            .footer-links a {
                color: var(--color-text-secondary);
                transition: color 0.3s ease;
            }

            .footer-links a:hover {
                color: var(--color-primary);
            }

            .footer-bottom {
                border-top: 1px solid var(--color-border);
                padding-top: 1.5rem;
                text-align: center;
                color: var(--color-text-secondary);
                font-size: 0.9rem;
            }

            /* 반응형 */
            @media (max-width: 768px) {
                body {
                    padding-top: 60px;
                }

                .navbar-menu {
                    display: none;
                    position: absolute;
                    top: 100%;
                    left: 0;
                    right: 0;
                    background: rgba(22, 22, 50, 0.98);
                    backdrop-filter: blur(20px);
                    padding: 1rem;
                    flex-direction: column;
                    gap: 1rem;
                    border-bottom: 1px solid var(--color-border);
                }

                .navbar-menu.active {
                    display: flex;
                }

                .navbar-actions {
                    display: none;
                    position: absolute;
                    top: calc(100% + 180px);
                    left: 0;
                    right: 0;
                    background: rgba(22, 22, 50, 0.98);
                    padding: 1rem;
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
                    padding: 0.75rem;
                    width: 100%;
                    text-align: center;
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
                        <a href="index.html">TimeLink</a>
                    </div>

                    <div class="navbar-menu">
                        <a href="index.html" class="nav-item ${currentPage === 'index' ? 'active' : ''}">Home</a>
                        <a href="studio.html" class="nav-item ${currentPage === 'studio' ? 'active' : ''}">Studio</a>
                        <a href="tltube.html" class="nav-item ${currentPage === 'tltube' ? 'active' : ''}">TLTube</a>
                        <a href="musicplace.html" class="nav-item ${currentPage === 'musicplace' ? 'active' : ''}">MusicPlace</a>
                        <a href="dashboard.html" class="nav-item ${currentPage === 'dashboard' ? 'active' : ''}">Dashboard</a>
                        <a href="charge.html" class="nav-item ${currentPage === 'charge' ? 'active' : ''}">Charge</a>
                    </div>

                    <div class="navbar-actions">
                        <a href="guide.html" class="nav-item">Guide</a>
                        <a href="faq.html" class="nav-item">FAQ</a>
                        ${this.isLoggedIn() 
                            ? `<button class="btn-nav btn-nav-outline" onclick="logout()">Logout</button>
                               <a href="dashboard.html" class="btn-nav btn-nav-primary">Dashboard</a>`
                            : `<a href="login.html" class="nav-item">Login</a>
                               <a href="signup.html" class="btn-nav btn-nav-primary">Sign Up</a>`
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
        const footerHTML = `
            <footer class="footer-main">
                <div class="footer-container">
                    <div class="footer-grid">
                        <div class="footer-section">
                            <h4>TimeLink</h4>
                            <p style="color: var(--color-text-secondary);">
                                디지털 음악 P2P 플랫폼<br>
                                아티스트와 팬을 직접 연결합니다.
                            </p>
                        </div>
                        
                        <div class="footer-section">
                            <h4>서비스</h4>
                            <ul class="footer-links">
                                <li><a href="index.html">Home</a></li>
                                <li><a href="studio.html">Studio</a></li>
                                <li><a href="tltube.html">TLTube</a></li>
                                <li><a href="musicplace.html">MusicPlace</a></li>
                            </ul>
                        </div>
                        
                        <div class="footer-section">
                            <h4>지원</h4>
                            <ul class="footer-links">
                                <li><a href="guide.html">Guide</a></li>
                                <li><a href="faq.html">FAQ</a></li>
                                <li><a href="#">문의하기</a></li>
                                <li><a href="#">이용약관</a></li>
                            </ul>
                        </div>
                        
                        <div class="footer-section">
                            <h4>연락처</h4>
                            <ul class="footer-links">
                                <li>Email: support@timelink.com</li>
                                <li>Telegram: @timelink_support</li>
                                <li>Twitter: @TimeLink_KR</li>
                            </ul>
                        </div>
                    </div>
                    
                    <div class="footer-bottom">
                        <p>&copy; 2024 TimeLink. All rights reserved. | P2P Digital Music Platform</p>
                    </div>
                </div>
            </footer>
        `;

        document.body.insertAdjacentHTML('beforeend', footerHTML);
    }

    setupEventListeners() {
        // 로그인 상태 체크
        this.checkLoginStatus();
        
        // 글로벌 함수 등록
        window.toggleMobileMenu = this.toggleMobileMenu;
        window.logout = this.logout;
        window.isLoggedIn = this.isLoggedIn;
    }

    checkLoginStatus() {
        // 로그인 상태 체크 (예시)
        const token = localStorage.getItem('auth_token');
        if (token) {
            // 실제로는 토큰 유효성 검증 필요
            document.body.classList.add('logged-in');
        }
    }

    toggleMobileMenu() {
        const menu = document.querySelector('.navbar-menu');
        const actions = document.querySelector('.navbar-actions');
        
        menu.classList.toggle('active');
        actions.classList.toggle('active');
    }

    logout() {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_info');
        window.location.href = 'index.html';
    }

    isLoggedIn() {
        return !!localStorage.getItem('auth_token');
    }
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
    new CommonComponents();
});

// 모듈로 내보내기
export default CommonComponents;
