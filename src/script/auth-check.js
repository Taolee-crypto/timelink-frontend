// scripts/auth-check.js - 타임링크 API 구조에 맞춤

class AuthManager {
    constructor() {
        this.AUTH_API = 'https://timelink-api.timelink-api.workers.dev';
        this.ECONOMY_API = 'https://deconomic-api.timelink-api.workers.dev';
        
        this.token = null;
        this.user = null;
        this.balance = 0;
        
        this.init();
    }

    init() {
        console.log('🔐 타임링크 인증 시스템 시작');
        this.loadAuthState();
        
        // DOM 로드 완료 시 UI 업데이트
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupUI());
        } else {
            this.setupUI();
        }
    }

    // 인증 상태 로드
    loadAuthState() {
        // 1. 토큰 확인 (여러 위치 체크)
        this.token = localStorage.getItem('tl_token') || 
                    sessionStorage.getItem('tl_token');
        
        // 2. 사용자 정보 확인
        const userData = localStorage.getItem('tl_user');
        this.user = userData ? JSON.parse(userData) : null;
        
        // 3. 잔액 확인 (로컬에서 먼저)
        const savedBalance = localStorage.getItem('tl_balance');
        this.balance = savedBalance ? parseInt(savedBalance) : 0;
        
        console.log('📊 인증 상태:', {
            token: this.token ? `있음 (${this.token.substring(0, 20)}...)` : '없음',
            user: this.user,
            balance: this.balance
        });
        
        // 토큰이 있으면 서버에서 잔액 동기화
        if (this.token && this.user) {
            this.syncBalanceFromServer();
        }
    }

    // 서버에서 잔액 동기화
    async syncBalanceFromServer() {
        try {
            const response = await fetch(`${this.ECONOMY_API}/api/wallet/balance`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                if (data.balance !== undefined) {
                    this.balance = data.balance;
                    localStorage.setItem('tl_balance', data.balance.toString());
                    console.log('💰 서버 잔액 동기화:', data.balance);
                }
            }
        } catch (error) {
            console.warn('서버 잔액 조회 실패, 로컬 값 사용:', error);
        }
        
        // UI 업데이트
        this.updateUI();
    }

    // UI 설정
    setupUI() {
        this.updateUI();
        this.bindEvents();
    }

    // UI 업데이트
    updateUI() {
        const userAvatar = document.getElementById('userAvatar');
        const balanceElement = document.getElementById('balanceAmount');
        
        if (!userAvatar) return;
        
        // 로그인 상태에 따라 UI 변경
        if (this.isAuthenticated()) {
            // ✅ 로그인 상태
            userAvatar.innerHTML = '<i class="fas fa-user-check"></i>';
            userAvatar.title = this.user?.email || '내 계정';
            userAvatar.style.cursor = 'pointer';
            userAvatar.onclick = (e) => this.showUserMenu(e);
            
            // 잔액 표시
            if (balanceElement) {
                balanceElement.textContent = this.balance.toLocaleString();
            }
            
            // USER 메뉴 생성
            this.createUserMenu();
            
        } else {
            // ❌ 비로그인 상태
            userAvatar.innerHTML = '<i class="fas fa-user"></i>';
            userAvatar.title = '로그인하기';
            userAvatar.style.cursor = 'pointer';
            userAvatar.onclick = () => {
                window.location.href = 'login.html';
            };
            
            if (balanceElement) {
                balanceElement.textContent = '0';
            }
        }
    }

    // 인증 여부 확인
    isAuthenticated() {
        return !!this.token && !!this.user;
    }

    // 사용자 메뉴 생성
    createUserMenu() {
        // 기존 메뉴 제거
        const oldMenu = document.querySelector('.user-dropdown');
        if (oldMenu) oldMenu.remove();
        
        if (!this.isAuthenticated()) return;
        
        // 새 메뉴 생성
        const menu = document.createElement('div');
        menu.className = 'user-dropdown';
        menu.style.cssText = `
            position: fixed;
            top: 70px;
            right: 20px;
            background: #1A2342;
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 10px;
            padding: 15px;
            min-width: 250px;
            z-index: 1000;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            display: none;
        `;
        
        menu.innerHTML = `
            <div class="user-info" style="padding-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,0.1); margin-bottom: 10px;">
                <div style="font-weight: bold; font-size: 1.1rem;">${this.user.email}</div>
                <div style="color: #00D4AA; font-size: 0.9rem;">${this.balance.toLocaleString()} TL</div>
            </div>
            
            <a href="dashboard.html" class="menu-item">
                <i class="fas fa-tachometer-alt"></i> 대시보드
            </a>
            <a href="charge.html" class="menu-item">
                <i class="fas fa-wallet"></i> 지갑
            </a>
            <a href="#" class="menu-item">
                <i class="fas fa-user-cog"></i> 프로필
            </a>
            <a href="#" class="menu-item">
                <i class="fas fa-cog"></i> 설정
            </a>
            
            <div style="margin-top: 10px; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.1);">
                <a href="#" class="menu-item logout-btn" style="color: #FF4757;">
                    <i class="fas fa-sign-out-alt"></i> 로그아웃
                </a>
            </div>
        `;
        
        document.body.appendChild(menu);
        
        // 메뉴 아이템 스타일
        const style = document.createElement('style');
        style.textContent = `
            .menu-item {
                display: block;
                padding: 10px 15px;
                color: white;
                text-decoration: none;
                border-radius: 5px;
                margin: 2px 0;
                transition: background 0.2s;
            }
            .menu-item:hover {
                background: rgba(0, 102, 255, 0.2);
            }
            .menu-item i {
                width: 20px;
                margin-right: 10px;
            }
            .logout-btn:hover {
                background: rgba(255, 71, 87, 0.1) !important;
            }
        `;
        document.head.appendChild(style);
        
        // 이벤트 바인딩
        menu.querySelector('.logout-btn').addEventListener('click', (e) => {
            e.preventDefault();
            this.logout();
        });
        
        this.userMenu = menu;
    }

    // 사용자 메뉴 표시/숨기기
    showUserMenu(event) {
        if (!this.userMenu) return;
        
        if (this.userMenu.style.display === 'block') {
            this.userMenu.style.display = 'none';
        } else {
            // 위치 조정
            const avatarRect = event.target.getBoundingClientRect();
            this.userMenu.style.top = `${avatarRect.bottom + 10}px`;
            this.userMenu.style.right = `${window.innerWidth - avatarRect.right}px`;
            this.userMenu.style.display = 'block';
            
            // 외부 클릭 시 메뉴 닫기
            setTimeout(() => {
                const closeHandler = (e) => {
                    if (!this.userMenu.contains(e.target) && e.target !== event.target) {
                        this.userMenu.style.display = 'none';
                        document.removeEventListener('click', closeHandler);
                    }
                };
                document.addEventListener('click', closeHandler);
            }, 10);
        }
    }

    // 로그인 처리 (login.html에서 호출)
    async login(email, password) {
        try {
            console.log('로그인 시도:', email);
            
            const response = await fetch(`${this.AUTH_API}/api/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
            
            const data = await response.json();
            
            if (response.ok && data.success) {
                console.log('✅ 로그인 성공:', data);
                
                // 1. 토큰 저장
                this.token = data.token;
                localStorage.setItem('tl_token', this.token);
                
                // 2. 사용자 정보 저장
                this.user = data.user || { email: email };
                localStorage.setItem('tl_user', JSON.stringify(this.user));
                
                // 3. 잔액 설정 (회원가입 보너스)
                if (data.isNewUser) {
                    this.balance = 10000;
                    localStorage.setItem('tl_balance', '10000');
                } else {
                    // 서버에서 잔액 조회
                    await this.syncBalanceFromServer();
                }
                
                return { success: true, data: data };
            } else {
                console.error('❌ 로그인 실패:', data);
                return { success: false, error: data.error || '로그인 실패' };
            }
        } catch (error) {
            console.error('❌ 네트워크 오류:', error);
            return { success: false, error: '서버 연결 실패' };
        }
    }

    // 로그아웃
    logout() {
        console.log('로그아웃 처리');
        
        // 로컬 데이터 삭제
        localStorage.removeItem('tl_token');
        localStorage.removeItem('tl_user');
        localStorage.removeItem('tl_balance');
        
        this.token = null;
        this.user = null;
        this.balance = 0;
        
        // 메뉴 제거
        if (this.userMenu) {
            this.userMenu.remove();
            this.userMenu = null;
        }
        
        // 페이지 새로고침
        window.location.reload();
    }

    // 이벤트 바인딩
    bindEvents() {
        // 페이지 전환 시 잔액 업데이트
        window.addEventListener('pageshow', () => {
            this.loadAuthState();
            this.updateUI();
        });
    }
}

// 글로벌 인스턴스 생성
window.authManager = new AuthManager();

// 로그인 페이지 전용 함수
if (window.location.pathname.includes('login.html')) {
    window.loginUser = async function() {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        const result = await authManager.login(email, password);
        
        if (result.success) {
            // 로그인 성공 시 대시보드로 이동
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1000);
        } else {
            alert(result.error || '로그인 실패');
        }
    };
}
