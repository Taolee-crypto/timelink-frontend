// TIMELINK 인증 관리자 - auth-manager.js
class AuthManager {
    constructor() {
        this.userData = null;
        this.init();
    }

    init() {
        this.loadUserFromCookie();
        this.checkAuthStatus();
        
        // 쿠키 동의 요청 처리 (3rd-party 쿠키 피하기)
        this.handleCookieConsent();
    }

    loadUserFromCookie() {
        try {
            // localStorage 사용 (3rd-party 쿠키 문제 방지)
            const userData = localStorage.getItem('timelink_user');
            const authToken = localStorage.getItem('timelink_token');
            
            if (userData && authToken) {
                this.userData = JSON.parse(userData);
                console.log('User loaded from localStorage:', this.userData.email);
            }
        } catch (e) {
            console.error('Failed to load user:', e);
        }
    }

    saveUserToStorage(userData, token) {
        try {
            localStorage.setItem('timelink_user', JSON.stringify(userData));
            localStorage.setItem('timelink_token', token || 'demo_token_' + Date.now());
            sessionStorage.setItem('timelink_session', 'active');
            
            // 쿠키도 함께 저장 (필요한 경우)
            document.cookie = `timelink_session=active; path=/; max-age=86400; SameSite=Lax`;
        } catch (e) {
            console.error('Failed to save user:', e);
        }
    }

    clearStorage() {
        localStorage.removeItem('timelink_user');
        localStorage.removeItem('timelink_token');
        sessionStorage.removeItem('timelink_session');
        
        // 쿠키 삭제
        document.cookie = 'timelink_session=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
    }

    login(userData, token) {
        this.userData = userData;
        this.saveUserToStorage(userData, token);
        this.updateAllPages();
        
        // 로그인 후 홈페이지로 리다이렉트
        if (window.location.pathname.includes('login.html') || 
            window.location.pathname.includes('signup.html')) {
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        }
        
        return true;
    }

    logout() {
        this.clearStorage();
        this.userData = null;
        this.updateAllPages();
        
        // 로그아웃 후 홈페이지로 리다이렉트
        if (!window.location.pathname.includes('index.html')) {
            window.location.href = 'index.html';
        }
    }

    isLoggedIn() {
        const hasUser = localStorage.getItem('timelink_user');
        const hasToken = localStorage.getItem('timelink_token');
        return !!(hasUser && hasToken);
    }

    getUser() {
        return this.userData;
    }

    checkAuthStatus() {
        if (!this.isLoggedIn()) {
            // 로그인 필요한 페이지들
            const protectedPages = [
                'studio.html',
                'shareplace.html', 
                'tltube.html',
                'tlmusic.html',
                'cafe-radio.html',
                'ad-plaza.html',
                'profile.html'
            ];
            
            const currentPage = window.location.pathname.split('/').pop();
            
            if (protectedPages.includes(currentPage)) {
                // alert('로그인이 필요합니다.');
                // window.location.href = 'login.html';
                // 실제 서비스에서는 주석 해제
            }
        }
    }

    handleCookieConsent() {
        // 쿠키 동의 배너 제거
        const cookieBanner = document.getElementById('cookie-banner');
        if (cookieBanner) {
            cookieBanner.style.display = 'none';
        }
    }

    updateAllPages() {
        this.updateHeader();
        this.updateNavigation();
        this.updateBalanceDisplay();
    }

    updateHeader() {
        const elements = {
            tlBalance: document.getElementById('tlBalance'),
            userAvatar: document.getElementById('userAvatar'),
            balanceAmount: document.getElementById('balanceAmount'),
            loginLogoutBtn: document.getElementById('loginLogoutBtn'),
            userSection: document.querySelector('.user-section'),
            userEmail: document.getElementById('userEmail'),
            logoutBtn: document.getElementById('logoutBtn')
        };

        if (this.isLoggedIn()) {
            // 로그인 상태
            if (elements.tlBalance) elements.tlBalance.style.display = 'flex';
            if (elements.userAvatar) elements.userAvatar.style.display = 'flex';
            if (elements.balanceAmount) {
                elements.balanceAmount.textContent = this.userData?.balance?.toLocaleString() || '1,500';
            }
            if (elements.loginLogoutBtn) {
                elements.loginLogoutBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i> LOGOUT';
                elements.loginLogoutBtn.href = 'javascript:void(0)';
                elements.loginLogoutBtn.onclick = () => this.logout();
            }
            if (elements.userEmail) {
                elements.userEmail.textContent = this.userData?.email || 'user@timelink.digital';
            }
        } else {
            // 로그아웃 상태
            if (elements.tlBalance) elements.tlBalance.style.display = 'none';
            if (elements.userAvatar) elements.userAvatar.style.display = 'none';
            if (elements.loginLogoutBtn) {
                elements.loginLogoutBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> LOGIN';
                elements.loginLogoutBtn.href = 'login.html';
                elements.loginLogoutBtn.onclick = null;
            }
        }
    }

    updateNavigation() {
        // 현재 페이지 활성화
        const currentPage = window.location.pathname.split('/').pop();
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === currentPage || 
                (currentPage === '' && href === 'index.html') ||
                (currentPage === 'index.html' && href === 'index.html')) {
                link.classList.add('active');
            }
        });
    }

    updateBalanceDisplay() {
        const balanceElements = document.querySelectorAll('.tl-balance, #balanceAmount');
        balanceElements.forEach(el => {
            if (el.id === 'balanceAmount' && this.isLoggedIn()) {
                el.textContent = this.userData?.balance?.toLocaleString() || '1,500';
            }
        });
    }
}

// 글로벌 인스턴스 생성
window.timelinkAuth = new AuthManager();

// DOM 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    if (window.timelinkAuth) {
        window.timelinkAuth.updateAllPages();
    }
});
