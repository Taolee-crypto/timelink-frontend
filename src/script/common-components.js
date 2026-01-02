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
        { icon: 'fa-music', text: 'TLMUSIC', link: 'tlmusic.html' },
        { icon: 'fa-broadcast-tower', text: 'CAFE RADIO', link: 'cafe-radio.html' },
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
// 공통 네비게이션 바 생성
document.addEventListener('DOMContentLoaded', function() {
    // 네비게이션 바 컨테이너가 있는지 확인
    const navContainer = document.getElementById('nav-container');
    if (!navContainer) return;

    // 로그인 상태 확인 (세션 스토리지 사용)
    const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';
    const storedUsername = sessionStorage.getItem('username');

    // 네비게이션 바 HTML
    const navbarHTML = `
        <nav style="
            background: rgba(26, 35, 66, 0.95);
            backdrop-filter: blur(10px);
            padding: 1rem 2rem;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            position: sticky;
            top: 0;
            z-index: 1000;
        ">
            <div style="
                max-width: 1400px;
                margin: 0 auto;
                display: flex;
                justify-content: space-between;
                align-items: center;
            ">
                <!-- 로고 -->
                <div style="display: flex; align-items: center; gap: 1rem;">
                    <div style="
                        width: 40px;
                        height: 40px;
                        background: linear-gradient(135deg, #0066FF, #00D4AA);
                        border-radius: 10px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 1.2rem;
                        font-weight: bold;
                        color: white;
                    ">
                        T
                    </div>
                    <span style="
                        font-size: 1.5rem;
                        font-weight: 700;
                        background: linear-gradient(135deg, #0066FF, #00D4AA);
                        -webkit-background-clip: text;
                        -webkit-text-fill-color: transparent;
                    ">
                        TIMEGATE™ STUDIO
                    </span>
                </div>

                <!-- 로그인 상태 표시 -->
                <div id="userStatusArea" style="display: flex; align-items: center; gap: 1rem;">
                    ${isLoggedIn ? `
                        <div style="display: flex; align-items: center; gap: 0.75rem;">
                            <div style="
                                width: 36px;
                                height: 36px;
                                background: linear-gradient(135deg, #9D4EDD, #8B5CF6);
                                border-radius: 50%;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                color: white;
                            ">
                                <i class="fas fa-user"></i>
                            </div>
                            <div>
                                <div style="font-weight: 600; color: white;">${storedUsername || '사용자'}</div>
                                <div style="font-size: 0.8rem; color: #64748b;">로그인 중</div>
                            </div>
                            <button onclick="logout()" style="
                                background: rgba(239, 68, 68, 0.1);
                                color: #ef4444;
                                border: 1px solid rgba(239, 68, 68, 0.3);
                                padding: 0.5rem 1rem;
                                border-radius: 8px;
                                cursor: pointer;
                                font-size: 0.9rem;
                                margin-left: 0.5rem;
                            ">
                                <i class="fas fa-sign-out-alt"></i> 로그아웃
                            </button>
                        </div>
                    ` : `
                        <button onclick="openLoginModal()" style="
                            background: linear-gradient(135deg, #0066FF, #00D4AA);
                            color: white;
                            border: none;
                            padding: 0.75rem 1.5rem;
                            border-radius: 10px;
                            cursor: pointer;
                            font-weight: 600;
                            display: flex;
                            align-items: center;
                            gap: 0.5rem;
                        ">
                            <i class="fas fa-sign-in-alt"></i> 로그인
                        </button>
                    `}
                </div>
            </div>
        </nav>

        <!-- 로그인 모달 (기본적으로 숨김) -->
        <div id="loginModal" style="
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(10, 15, 43, 0.9);
            z-index: 2000;
            backdrop-filter: blur(10px);
        ">
            <div style="
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: #1A2342;
                padding: 2.5rem;
                border-radius: 20px;
                width: 90%;
                max-width: 400px;
                border: 1px solid rgba(255, 255, 255, 0.1);
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
            ">
                <h2 style="color: white; margin-bottom: 0.5rem;">로그인</h2>
                <p style="color: #64748b; margin-bottom: 2rem;">TIMEGATE™ STUDIO에 로그인하세요</p>
                
                <div style="margin-bottom: 1.5rem;">
                    <label style="display: block; color: white; margin-bottom: 0.5rem;">사용자명</label>
                    <input type="text" id="loginUsername" style="
                        width: 100%;
                        padding: 1rem;
                        background: rgba(255, 255, 255, 0.05);
                        border: 1px solid rgba(255, 255, 255, 0.1);
                        border-radius: 10px;
                        color: white;
                        font-size: 1rem;
                    " placeholder="사용자명 입력">
                </div>
                
                <div style="margin-bottom: 2rem;">
                    <label style="display: block; color: white; margin-bottom: 0.5rem;">비밀번호</label>
                    <input type="password" id="loginPassword" style="
                        width: 100%;
                        padding: 1rem;
                        background: rgba(255, 255, 255, 0.05);
                        border: 1px solid rgba(255, 255, 255, 0.1);
                        border-radius: 10px;
                        color: white;
                        font-size: 1rem;
                    " placeholder="비밀번호 입력">
                </div>
                
                <div style="display: flex; gap: 1rem;">
                    <button onclick="performLogin()" style="
                        flex: 1;
                        background: linear-gradient(135deg, #0066FF, #00D4AA);
                        color: white;
                        border: none;
                        padding: 1rem;
                        border-radius: 10px;
                        cursor: pointer;
                        font-weight: 600;
                    ">
                        로그인
                    </button>
                    <button onclick="closeLoginModal()" style="
                        flex: 1;
                        background: rgba(255, 255, 255, 0.1);
                        color: white;
                        border: none;
                        padding: 1rem;
                        border-radius: 10px;
                        cursor: pointer;
                    ">
                        취소
                    </button>
                </div>

                <div style="margin-top: 1.5rem; text-align: center;">
                    <label style="color: #64748b; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
                        <input type="checkbox" id="rememberLogin">
                        <span>로그인 상태 유지</span>
                    </label>
                </div>
            </div>
        </div>
    `;

    navContainer.innerHTML = navbarHTML;
});

// 로그인 모달 열기
function openLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

// 로그인 모달 닫기
function closeLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// 로그인 수행
function performLogin() {
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    const rememberMe = document.getElementById('rememberLogin').checked;

    if (!username || !password) {
        showNotification('사용자명과 비밀번호를 입력해주세요', 'error');
        return;
    }

    // 임시 로그인 처리 (실제로는 서버와 통신해야 함)
    if (rememberMe) {
        // 로컬 스토리지에 저장 (브라우저를 닫아도 유지)
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', username);
    } else {
        // 세션 스토리지에 저장 (브라우저 탭을 닫으면 사라짐)
        sessionStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('username', username);
    }

    // 모달 닫기
    closeLoginModal();
    
    // 페이지 새로고침하여 네비게이션 업데이트
    location.reload();
}

// 로그아웃
function logout() {
    // 모든 저장소에서 로그인 정보 삭제
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    sessionStorage.removeItem('isLoggedIn');
    sessionStorage.removeItem('username');
    
    // 페이지 새로고침
    location.reload();
}

// 알림 표시
function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notificationMessage');
    
    if (!notification || !notificationMessage) return;
    
    notificationMessage.textContent = message;
    notification.className = 'notification';
    notification.classList.add(`notification-${type}`);
    notification.style.display = 'block';
    
    // 5초 후 자동 숨김
    setTimeout(() => {
        notification.style.display = 'none';
    }, 5000);
}
