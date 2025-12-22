<script>
// 인증 상태 관리
class AuthManager {
    constructor() {
        this.token = localStorage.getItem('tl_token');
        this.user = JSON.parse(localStorage.getItem('tl_user') || 'null');
    }

    isAuthenticated() {
        return !!this.token;
    }

    getUser() {
        return this.user;
    }

    async login(email, password) {
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                const data = await response.json();
                this.token = data.token;
                this.user = data.user;
                
                localStorage.setItem('tl_token', this.token);
                localStorage.setItem('tl_user', JSON.stringify(this.user));
                
                return { success: true, user: this.user };
            } else {
                return { success: false, error: '로그인 실패' };
            }
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    logout() {
        this.token = null;
        this.user = null;
        localStorage.removeItem('tl_token');
        localStorage.removeItem('tl_user');
        window.location.href = 'index.html';
    }

    async updateBalance() {
        if (!this.isAuthenticated()) return 0;
        
        try {
            const response = await fetch('/api/wallet/balance', {
                headers: { 'Authorization': `Bearer ${this.token}` }
            });
            
            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('tl_balance', data.balance);
                return data.balance;
            }
        } catch (error) {
            console.error('잔액 조회 실패:', error);
        }
        return localStorage.getItem('tl_balance') || 10000;
    }
}

// 글로벌 인스턴스
window.authManager = new AuthManager();

// 사용자 메뉴 관리
class UserMenuManager {
    constructor() {
        this.userAvatar = document.getElementById('userAvatar');
        this.balanceElement = document.getElementById('balanceAmount');
        this.init();
    }

    async init() {
        this.updateUI();
        this.bindEvents();
        
        if (authManager.isAuthenticated()) {
            const balance = await authManager.updateBalance();
            this.updateBalance(balance);
        }
    }

    updateUI() {
        if (authManager.isAuthenticated()) {
            const user = authManager.getUser();
            this.userAvatar.innerHTML = '<i class="fas fa-user-check"></i>';
            this.userAvatar.title = user?.name || user?.email || '내 계정';
        } else {
            this.userAvatar.innerHTML = '<i class="fas fa-user"></i>';
            this.userAvatar.title = '로그인하기';
        }
    }

    updateBalance(balance) {
        if (this.balanceElement) {
            this.balanceElement.textContent = parseInt(balance).toLocaleString();
        }
    }

    bindEvents() {
        this.userAvatar.addEventListener('click', (e) => {
            if (authManager.isAuthenticated()) {
                this.showUserMenu(e);
            } else {
                window.location.href = 'login.html';
            }
        });

        // 외부 클릭 시 메뉴 닫기
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.user-menu-container')) {
                this.hideUserMenu();
            }
        });
    }

    showUserMenu(event) {
        this.hideUserMenu(); // 기존 메뉴 제거
        
        const menu = document.createElement('div');
        menu.className = 'user-dropdown';
        menu.innerHTML = `
            <a href="dashboard.html" class="dropdown-item">
                <i class="fas fa-tachometer-alt"></i> 대시보드
            </a>
            <a href="charge.html" class="dropdown-item">
                <i class="fas fa-wallet"></i> 지갑
            </a>
            <a href="#" class="dropdown-item">
                <i class="fas fa-user-cog"></i> 프로필
            </a>
            <a href="#" class="dropdown-item">
                <i class="fas fa-cog"></i> 설정
            </a>
            <hr>
            <a href="#" class="dropdown-item logout-btn">
                <i class="fas fa-sign-out-alt"></i> 로그아웃
            </a>
        `;
        
        // 위치 설정
        const rect = this.userAvatar.getBoundingClientRect();
        menu.style.position = 'fixed';
        menu.style.top = `${rect.bottom + 5}px`;
        menu.style.right = `${window.innerWidth - rect.right}px`;
        menu.style.zIndex = '1000';
        
        menu.classList.add('show');
        document.body.appendChild(menu);
        
        // 로그아웃 이벤트
        menu.querySelector('.logout-btn').addEventListener('click', () => {
            authManager.logout();
        });
        
        // 현재 메뉴 저장
        this.currentMenu = menu;
    }

    hideUserMenu() {
        if (this.currentMenu) {
            this.currentMenu.remove();
            this.currentMenu = null;
        }
    }
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
    window.userMenuManager = new UserMenuManager();
});
</script>
