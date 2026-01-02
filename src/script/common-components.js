/**
 * TIMELINK 공통 컴포넌트 관리
 * 네비게이션 바와 사용자 인증 상태를 관리합니다.
 */

// 네비게이션 구조 데이터
const navConfig = {
    logo: {
        text: 'TIMELINK',
        icon: 'TL',
        link: 'index.html'
    },
    menuItems: [
        { icon: 'fa-home', text: 'HOME', link: 'index.html' },
        { icon: 'fa-sliders-h', text: 'STUDIO', link: 'studio.html' },
        { icon: 'fa-store', text: 'SHAREPLACE', link: 'shareplace.html' },
        { icon: 'fa-play-circle', text: 'TLTUBE', link: 'tltube.html' },
        { icon: 'fa-music', text: 'TLMUSIC', link: 'tlmusic.html' },
        { icon: 'fa-broadcast-tower', text: 'CAFE RADIO', link: 'cafe-radio.html' },
        { icon: 'fa-ad', text: 'AD PLAZA', link: 'ad-plaza.html' },
        { icon: 'fa-user', text: 'PROFILE', link: 'profile.html' }
    ],
    authButtons: {
        login: { icon: 'fa-sign-in-alt', text: '로그인', link: 'login.html' },
        signup: { icon: 'fa-user-plus', text: '회원가입', link: 'signup.html' }
    }
};

// 인증 상태 관리 클래스
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.token = null;
        this.init();
    }

    init() {
        // localStorage에서 사용자 정보 로드
        this.loadUserFromStorage();
        console.log('AuthManager initialized');
    }

    loadUserFromStorage() {
        try {
            const userStr = localStorage.getItem('tl_user') || localStorage.getItem('timelink_user');
            this.token = localStorage.getItem('tl_token') || localStorage.getItem('timelink_token');
            
            if (userStr) {
                this.currentUser = JSON.parse(userStr);
            }
        } catch (error) {
            console.error('Error loading user from storage:', error);
            this.currentUser = null;
            this.token = null;
        }
    }

    saveUserToStorage(user, token) {
        try {
            localStorage.setItem('tl_user', JSON.stringify(user));
            localStorage.setItem('tl_token', token);
            
            // 이전 버전 호환성 유지
            localStorage.setItem('timelink_user', JSON.stringify(user));
            localStorage.setItem('timelink_token', token);
            
            this.currentUser = user;
            this.token = token;
            return true;
        } catch (error) {
            console.error('Error saving user to storage:', error);
            return false;
        }
    }

    isLoggedIn() {
        return !!this.currentUser && !!this.token;
    }

    getUser() {
        return this.currentUser;
    }

    getToken() {
        return this.token;
    }

    async login(email, password) {
        // 서버와의 실제 연동을 대체하는 모의 로그인
        return new Promise((resolve) => {
            setTimeout(() => {
                // 데모 사용자 체크
                if ((email === 'realuser@test.com' && password === 'realpass123') ||
                    (email === 'demo@timelink.digital' && password === 'demo1234')) {
                    
                    const user = {
                        id: Date.now().toString(),
                        email: email,
                        name: email.split('@')[0],
                        nickname: email.split('@')[0] + '_' + Math.floor(Math.random() * 1000),
                        balance: email.includes('demo') ? 5000 : 10000,
                        joinedAt: new Date().toISOString(),
                        verified: true,
                        type: 'creator' // 'creator' 또는 'listener'
                    };
                    
                    const token = 'tl_token_' + Date.now();
                    
                    if (this.saveUserToStorage(user, token)) {
                        // 사용자 이벤트 발생 (다른 컴포넌트에서 감지할 수 있도록)
                        window.dispatchEvent(new CustomEvent('userLoggedIn', { detail: user }));
                        
                        resolve({
                            success: true,
                            message: '로그인 성공!',
                            user: user,
                            token: token
                        });
                    } else {
                        resolve({
                            success: false,
                            error: '사용자 정보 저장에 실패했습니다.'
                        });
                    }
                } else {
                    resolve({
                        success: false,
                        error: '이메일 또는 비밀번호가 올바르지 않습니다.'
                    });
                }
            }, 800); // 서버 요청 지연 시뮬레이션
        });
    }

    async signup(userData) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const { name, email, nickname, password } = userData;
                
                // 중복 이메일 체크
                const existingUser = this.currentUser;
                if (existingUser && existingUser.email === email) {
                    resolve({
                        success: false,
                        error: '이미 등록된 이메일입니다.'
                    });
                    return;
                }
                
                // 새 사용자 생성
                const user = {
                    id: Date.now().toString(),
                    name: name,
                    email: email,
                    nickname: nickname,
                    balance: 10000, // 가입 보너스
                    joinedAt: new Date().toISOString(),
                    verified: true,
                    type: 'creator', // 기본값
                    marketingAgreed: userData.marketingAgreed || false
                };
                
                const token = 'tl_token_' + Date.now();
                
                if (this.saveUserToStorage(user, token)) {
                    // 회원가입 이벤트 발생
                    window.dispatchEvent(new CustomEvent('userSignedUp', { detail: user }));
                    
                    resolve({
                        success: true,
                        message: '회원가입이 완료되었습니다! 10,000 TL이 지급되었습니다.',
                        user: user,
                        token: token
                    });
                } else {
                    resolve({
                        success: false,
                        error: '사용자 정보 저장에 실패했습니다.'
                    });
                }
            }, 1000);
        });
    }

    logout() {
        localStorage.removeItem('tl_user');
        localStorage.removeItem('tl_token');
        localStorage.removeItem('timelink_user');
        localStorage.removeItem('timelink_token');
        
        this.currentUser = null;
        this.token = null;
        
        // 로그아웃 이벤트 발생
        window.dispatchEvent(new CustomEvent('userLoggedOut'));
        
        return {
            success: true,
            message: '로그아웃 되었습니다.'
        };
    }

    updateBalance(amount) {
        if (!this.currentUser) return false;
        
        this.currentUser.balance = (this.currentUser.balance || 0) + amount;
        this.saveUserToStorage(this.currentUser, this.token);
        
        // 잔액 업데이트 이벤트 발생
        window.dispatchEvent(new CustomEvent('balanceUpdated', { 
            detail: { balance: this.currentUser.balance } 
        }));
        
        return true;
    }

    getBalance() {
        return this.currentUser ? (this.currentUser.balance || 0) : 0;
    }
}

// 전역 AuthManager 인스턴스 생성
window.AuthManager = new AuthManager();

// 네비게이션 바 생성 함수
function createNavigationBar() {
    const navContainer = document.getElementById('nav-container');
    if (!navContainer) return;

    const isLoggedIn = window.AuthManager.isLoggedIn();
    const user = window.AuthManager.getUser();
    
    // 현재 페이지 URL 확인
    const currentPath = window.location.pathname;
    const currentPage = currentPath.split('/').pop() || 'index.html';

    const navHTML = `
        <header class="main-header">
            <div class="header-content">
                <!-- Logo -->
                <a href="${navConfig.logo.link}" class="logo">
                    <div class="logo-icon">${navConfig.logo.icon}</div>
                    <div class="logo-text">${navConfig.logo.text}</div>
                </a>

                <!-- 모바일 메뉴 버튼 -->
                <button class="mobile-menu-btn" id="mobileMenuBtn">
                    <i class="fas fa-bars"></i>
                </button>

                <!-- Navigation -->
                <nav class="main-nav" id="mainNav">
                    ${navConfig.menuItems.map(item => `
                        <a href="${item.link}" class="nav-link ${currentPage === item.link ? 'active' : ''}">
                            <i class="fas ${item.icon}"></i> <span>${item.text}</span>
                        </a>
                    `).join('')}
                </nav>

                <!-- User Section -->
                <div class="user-section">
                    <div class="auth-buttons" id="authButtons">
                        ${isLoggedIn ? `
                            <div class="user-info">
                                <span class="user-balance" id="userBalance">
                                    <i class="fas fa-coins"></i> ${user.balance.toLocaleString()} TL
                                </span>
                                <a href="profile.html" class="auth-button">
                                    <i class="fas fa-user"></i> <span>${user.nickname || user.name}</span>
                                </a>
                                <button class="auth-button logout-btn" id="logoutBtn">
                                    <i class="fas fa-sign-out-alt"></i> <span>로그아웃</span>
                                </button>
                            </div>
                        ` : `
                            <a href="login.html" class="auth-button">
                                <i class="fas fa-sign-in-alt"></i> <span>로그인</span>
                            </a>
                            <a href="signup.html" class="auth-button signup">
                                <i class="fas fa-user-plus"></i> <span>회원가입</span>
                            </a>
                        `}
                    </div>
                </div>
            </div>
        </header>
    `;

    navContainer.innerHTML = navHTML;
    
    // 모바일 메뉴 토글 이벤트 추가
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mainNav = document.getElementById('mainNav');
    
    if (mobileMenuBtn && mainNav) {
        mobileMenuBtn.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            
            const icon = mobileMenuBtn.querySelector('i');
            if (mainNav.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
        
        // 모바일에서 메뉴 밖 클릭 시 닫기
        document.addEventListener('click', (e) => {
            if (mainNav.classList.contains('active') && 
                !mainNav.contains(e.target) && 
                !mobileMenuBtn.contains(e.target)) {
                mainNav.classList.remove('active');
                const icon = mobileMenuBtn.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
    
    // 로그아웃 버튼 이벤트
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            if (confirm('로그아웃 하시겠습니까?')) {
                window.AuthManager.logout();
                window.location.href = 'index.html?logout=true';
            }
        });
    }
    
    // 잔액 업데이트 이벤트 리스너
    window.addEventListener('balanceUpdated', (e) => {
        const balanceElement = document.getElementById('userBalance');
        if (balanceElement) {
            balanceElement.innerHTML = `<i class="fas fa-coins"></i> ${e.detail.balance.toLocaleString()} TL`;
        }
    });
}

// DOM 로드 시 네비게이션 생성
document.addEventListener('DOMContentLoaded', () => {
    createNavigationBar();
    
    // 로그인 상태에 따라 페이지 접근 제어
    const protectedPages = ['profile.html', 'dashboard.html', 'studio.html'];
    const currentPage = window.location.pathname.split('/').pop();
    
    if (protectedPages.includes(currentPage) && !window.AuthManager.isLoggedIn()) {
        // 로그인 페이지로 리다이렉트, 현재 URL 저장
        sessionStorage.setItem('redirectAfterLogin', window.location.href);
        window.location.href = 'login.html';
    }
    
    // 로그아웃 파라미터 처리
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('logout') === 'true') {
        window.AuthManager.logout();
    }
});

// 공통 스타일 추가 함수
function addCommonStyles() {
    const styleId = 'timelink-common-styles';
    if (document.getElementById(styleId)) return;
    
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
        /* 공통 네비게이션 스타일 */
        .main-header {
            background: rgba(15, 23, 42, 0.95);
            backdrop-filter: blur(10px);
            border-bottom: 1px solid rgba(255, 107, 0, 0.1);
            position: fixed;
            width: 100%;
            top: 0;
            z-index: 1000;
            padding: 1rem 0;
            height: 70px;
        }

        .header-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 100%;
            position: relative;
            max-width: 1400px;
            margin: 0 auto;
            padding: 0 2rem;
        }

        .logo {
            flex: 0 0 auto;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            text-decoration: none;
            min-width: 150px;
        }

        .logo-icon {
            width: 40px;
            height: 40px;
            background: linear-gradient(135deg, #FF6B00, #FFA500);
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Orbitron', sans-serif;
            font-weight: 700;
            font-size: 1.2rem;
            color: white;
        }

        .logo-text {
            font-family: 'Orbitron', sans-serif;
            font-size: 1.8rem;
            font-weight: 700;
            background: linear-gradient(135deg, #FF6B00, #FFA500);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            white-space: nowrap;
        }

        .main-nav {
            flex: 1;
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 0.5rem;
            padding: 0 1rem;
            max-width: 900px;
            margin: 0 auto;
        }

        .nav-link {
            color: #94a3b8;
            text-decoration: none;
            font-weight: 500;
            padding: 0.5rem 0.8rem;
            border-radius: 8px;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            white-space: nowrap;
            font-size: 0.9rem;
        }

        .nav-link:hover {
            color: white;
            background: rgba(255, 255, 255, 0.05);
        }

        .nav-link.active {
            background: rgba(255, 107, 0, 0.1);
            color: #FFA500;
            border: 1px solid rgba(255, 107, 0, 0.3);
        }

        .nav-link i {
            font-size: 1rem;
        }

        .user-section {
            flex: 0 0 auto;
            display: flex;
            align-items: center;
            gap: 1.5rem;
            min-width: 150px;
            justify-content: flex-end;
        }

        .auth-buttons {
            display: flex;
            gap: 0.75rem;
            align-items: center;
        }

        .auth-button {
            background: rgba(255, 107, 0, 0.1);
            border: 1px solid rgba(255, 107, 0, 0.3);
            border-radius: 8px;
            padding: 0.5rem 1rem;
            color: #FFA500;
            text-decoration: none;
            font-weight: 600;
            font-size: 0.85rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            transition: all 0.3s ease;
            white-space: nowrap;
            cursor: pointer;
        }

        .auth-button:hover {
            background: rgba(255, 107, 0, 0.2);
            transform: translateY(-1px);
        }

        .auth-button.signup {
            background: linear-gradient(135deg, #FF6B00, #FFA500);
            border-color: transparent;
            color: white;
        }

        .user-info {
            display: flex;
            align-items: center;
            gap: 0.75rem;
        }

        .user-balance {
            background: rgba(255, 165, 0, 0.1);
            border: 1px solid rgba(255, 165, 0, 0.3);
            border-radius: 8px;
            padding: 0.5rem 0.75rem;
            font-weight: 600;
            color: #FFA500;
            font-size: 0.85rem;
        }

        .user-balance i {
            margin-right: 0.25rem;
        }

        .logout-btn {
            background: rgba(239, 68, 68, 0.1);
            border-color: rgba(239, 68, 68, 0.3);
            color: #f44336;
        }

        .logout-btn:hover {
            background: rgba(239, 68, 68, 0.2);
        }

        .mobile-menu-btn {
            display: none;
            background: none;
            border: none;
            color: #94a3b8;
            font-size: 1.5rem;
            cursor: pointer;
            transition: color 0.3s ease;
            padding: 0.5rem;
            flex-shrink: 0;
        }

        .mobile-menu-btn:hover {
            color: white;
        }

        /* 반응형 */
        @media (max-width: 1200px) {
            .header-content {
                padding: 0 1.5rem;
            }
            
            .nav-link span {
                display: none;
            }
            
            .nav-link {
                padding: 0.5rem;
            }
            
            .nav-link i {
                font-size: 1.2rem;
            }
        }

        @media (max-width: 992px) {
            .main-nav {
                position: fixed;
                top: 70px;
                left: 0;
                right: 0;
                transform: none;
                background: #0F172A;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                padding: 1rem;
                flex-direction: column;
                gap: 0.5rem;
                display: none;
                z-index: 999;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                max-width: 100%;
            }
            
            .main-nav.active {
                display: flex;
            }
            
            .nav-link {
                width: 100%;
                justify-content: center;
                padding: 1rem;
            }
            
            .nav-link span {
                display: inline;
            }
            
            .mobile-menu-btn {
                display: block;
            }
            
            .user-section {
                min-width: auto;
            }
            
            .auth-buttons {
                display: none;
            }
        }

        @media (max-width: 768px) {
            .user-info {
                flex-direction: column;
                align-items: stretch;
                gap: 0.5rem;
            }
        }
    `;
    
    document.head.appendChild(style);
}

// 스타일 추가 실행
addCommonStyles();
