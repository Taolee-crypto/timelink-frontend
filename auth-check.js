// scripts/auth-check.js
// 타임링크 인증 상태 관리 모듈

class AuthManager {
    constructor() {
        this.token = localStorage.getItem('tl_token');
        this.user = JSON.parse(localStorage.getItem('tl_user') || 'null');
        this.balance = parseInt(localStorage.getItem('tl_balance') || '0');
        this.init();
    }

    init() {
        // 페이지 로드 시 인증 상태 확인
        document.addEventListener('DOMContentLoaded', () => {
            this.checkAuthStatus();
            this.updateUI();
        });
    }

    // 인증 상태 확인
    async checkAuthStatus() {
        if (!this.token) {
            return false;
        }

        try {
            const response = await fetch('/api/auth/verify', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                this.clearAuth();
                return false;
            }

            const data = await response.json();
            if (data.user) {
                this.user = data.user;
                localStorage.setItem('tl_user', JSON.stringify(data.user));
                
                // 잔액 업데이트
                await this.updateBalance();
                return true;
            }
        } catch (error) {
            console.error('인증 확인 오류:', error);
            return false;
        }

        return false;
    }

    // 로그인
    async login(email, password) {
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

            if (response.ok) {
                const data = await response.json();
                
                // 토큰과 사용자 정보 저장
                this.token = data.token;
                this.user = data.user;
                
                localStorage.setItem('tl_token', this.token);
                localStorage.setItem('tl_user', JSON.stringify(this.user));
                
                // 초기 잔액 설정 (회원가입 보너스)
                if (data.isNewUser) {
                    this.balance = 10000;
                    localStorage.setItem('tl_balance', '10000');
                } else {
                    await this.updateBalance();
                }
                
                // 성공 콜백
                if (typeof this.onLoginSuccess === 'function') {
                    this.onLoginSuccess(data);
                }
                
                return { success: true, data: data };
            } else {
                const error = await response.json();
                return { success: false, error: error.message || '로그인 실패' };
            }
        } catch (error) {
            console.error('로그인 오류:', error);
            return { success: false, error: '네트워크 오류가 발생했습니다' };
        }
    }

    // 로그아웃
    logout() {
        this.clearAuth();
        
        // 로그아웃 API 호출
        fetch('/api/auth/logout', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json'
            }
        }).catch(error => {
            console.error('로그아웃 오류:', error);
        });
        
        // 페이지 리로드
        window.location.href = 'index.html';
    }

    // 회원가입
    async signup(userData) {
        try {
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            if (response.ok) {
                const data = await response.json();
                
                // 이메일 인증 필요 여부 확인
                if (data.requiresVerification) {
                    return { 
                        success: true, 
                        requiresVerification: true,
                        message: '이메일 인증이 필요합니다'
                    };
                } else {
                    // 자동 로그인
                    return await this.login(userData.email, userData.password);
                }
            } else {
                const error = await response.json();
                return { success: false, error: error.message || '회원가입 실패' };
            }
        } catch (error) {
            console.error('회원가입 오류:', error);
            return { success: false, error: '네트워크 오류가 발생했습니다' };
        }
    }

    // 이메일 인증 확인
    async verifyEmail(token) {
        try {
            const response = await fetch(`/api/auth/verify-email?token=${token}`, {
                method: 'GET'
            });

            if (response.ok) {
                const data = await response.json();
                
                // 인증 성공 시 자동 로그인
                if (data.token) {
                    this.token = data.token;
                    this.user = data.user;
                    this.balance = 10000; // 회원가입 보너스
                    
                    localStorage.setItem('tl_token', this.token);
                    localStorage.setItem('tl_user', JSON.stringify(this.user));
                    localStorage.setItem('tl_balance', '10000');
                    
                    return { success: true, data: data };
                }
            } else {
                const error = await response.json();
                return { success: false, error: error.message || '인증 실패' };
            }
        } catch (error) {
            console.error('이메일 인증 오류:', error);
            return { success: false, error: '네트워크 오류가 발생했습니다' };
        }
    }

    // 잔액 업데이트
    async updateBalance() {
        if (!this.token) {
            this.balance = 0;
            return 0;
        }

        try {
            const response = await fetch('/api/wallet/balance', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                this.balance = data.balance || 0;
                localStorage.setItem('tl_balance', this.balance.toString());
                return this.balance;
            }
        } catch (error) {
            console.error('잔액 조회 오류:', error);
        }

        return this.balance;
    }

    // TL 충전
    async chargeTL(amount, paymentMethod) {
        if (!this.token) {
            return { success: false, error: '로그인이 필요합니다' };
        }

        try {
            const response = await fetch('/api/wallet/charge', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    amount: amount,
                    paymentMethod: paymentMethod
                })
            });

            if (response.ok) {
                const data = await response.json();
                this.balance = data.newBalance;
                localStorage.setItem('tl_balance', this.balance.toString());
                return { success: true, data: data };
            } else {
                const error = await response.json();
                return { success: false, error: error.message || '충전 실패' };
            }
        } catch (error) {
            console.error('TL 충전 오류:', error);
            return { success: false, error: '네트워크 오류가 발생했습니다' };
        }
    }

    // TL 사용
    async useTL(amount, description) {
        if (!this.token) {
            return { success: false, error: '로그인이 필요합니다' };
        }

        if (this.balance < amount) {
            return { success: false, error: '잔액이 부족합니다' };
        }

        try {
            const response = await fetch('/api/wallet/use', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    amount: amount,
                    description: description
                })
            });

            if (response.ok) {
                const data = await response.json();
                this.balance = data.newBalance;
                localStorage.setItem('tl_balance', this.balance.toString());
                return { success: true, data: data };
            } else {
                const error = await response.json();
                return { success: false, error: error.message || '사용 실패' };
            }
        } catch (error) {
            console.error('TL 사용 오류:', error);
            return { success: false, error: '네트워크 오류가 발생했습니다' };
        }
    }

    // 인증 정보 초기화
    clearAuth() {
        this.token = null;
        this.user = null;
        this.balance = 0;
        
        localStorage.removeItem('tl_token');
        localStorage.removeItem('tl_user');
        localStorage.removeItem('tl_balance');
        
        // 로그아웃 콜백
        if (typeof this.onLogout === 'function') {
            this.onLogout();
        }
    }

    // 현재 인증 상태
    isAuthenticated() {
        return !!this.token && !!this.user;
    }

    // 현재 사용자 정보
    getUser() {
        return this.user;
    }

    // 현재 TL 잔액
    getBalance() {
        return this.balance;
    }

    // UI 업데이트
    updateUI() {
        const balanceElements = document.querySelectorAll('.tl-balance-amount, #balanceAmount, [data-balance]');
        const userAvatarElements = document.querySelectorAll('.user-avatar, [data-user-avatar]');
        const authButtons = document.querySelectorAll('[data-auth-action]');
        
        if (this.isAuthenticated()) {
            // 로그인 상태
            balanceElements.forEach(el => {
                el.textContent = this.balance.toLocaleString();
            });
            
            userAvatarElements.forEach(el => {
                const user = this.getUser();
                if (user && user.avatar) {
                    el.innerHTML = `<img src="${user.avatar}" alt="${user.name}">`;
                } else if (user && user.name) {
                    el.innerHTML = `<span>${user.name.charAt(0)}</span>`;
                } else {
                    el.innerHTML = '<i class="fas fa-user-check"></i>';
                }
                el.title = user?.name || user?.email || '내 계정';
            });
            
            authButtons.forEach(btn => {
                const action = btn.getAttribute('data-auth-action');
                if (action === 'login') {
                    btn.textContent = '로그아웃';
                    btn.onclick = () => this.logout();
                }
            });
        } else {
            // 비로그인 상태
            balanceElements.forEach(el => {
                el.textContent = '0';
            });
            
            userAvatarElements.forEach(el => {
                el.innerHTML = '<i class="fas fa-user"></i>';
                el.title = '로그인하기';
                el.onclick = () => window.location.href = 'login.html';
            });
            
            authButtons.forEach(btn => {
                const action = btn.getAttribute('data-auth-action');
                if (action === 'login') {
                    btn.textContent = '로그인';
                    btn.onclick = () => window.location.href = 'login.html';
                }
            });
        }
    }

    // 사용자 메뉴 토글
    setupUserMenu() {
        const userAvatar = document.querySelector('.user-avatar');
        if (!userAvatar) return;

        userAvatar.addEventListener('click', (e) => {
            if (this.isAuthenticated()) {
                this.toggleUserDropdown(e);
            } else {
                window.location.href = 'login.html';
            }
        });
    }

    // 사용자 드롭다운 메뉴
    toggleUserDropdown(event) {
        // 기존 드롭다운 제거
        const existingDropdown = document.querySelector('.user-dropdown');
        if (existingDropdown) {
            existingDropdown.remove();
            return;
        }

        // 새 드롭다운 생성
        const dropdown = document.createElement('div');
        dropdown.className = 'user-dropdown';
        dropdown.innerHTML = `
            <div class="dropdown-header">
                <div class="user-info">
                    <div class="user-name">${this.user?.name || '사용자'}</div>
                    <div class="user-email">${this.user?.email || ''}</div>
                </div>
            </div>
            <div class="dropdown-body">
                <a href="dashboard.html" class="dropdown-item">
                    <i class="fas fa-tachometer-alt"></i> 대시보드
                </a>
                <a href="charge.html" class="dropdown-item">
                    <i class="fas fa-wallet"></i> 지갑 (${this.balance.toLocaleString()} TL)
                </a>
                <a href="#" class="dropdown-item">
                    <i class="fas fa-user-cog"></i> 프로필 설정
                </a>
                <a href="#" class="dropdown-item">
                    <i class="fas fa-cog"></i> 계정 설정
                </a>
                <hr>
                <a href="#" class="dropdown-item logout-btn">
                    <i class="fas fa-sign-out-alt"></i> 로그아웃
                </a>
            </div>
        `;

        // 스타일 적용
        dropdown.style.cssText = `
            position: fixed;
            top: ${event.clientY + 10}px;
            left: ${event.clientX - 200}px;
            background: white;
            color: #333;
            border-radius: 8px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
            min-width: 250px;
            z-index: 1000;
            overflow: hidden;
        `;

        // 헤더 스타일
        dropdown.querySelector('.dropdown-header').style.cssText = `
            background: linear-gradient(135deg, #0066FF, #00D4AA);
            color: white;
            padding: 1rem;
        `;

        // 항목 스타일
        dropdown.querySelectorAll('.dropdown-item').forEach(item => {
            item.style.cssText = `
                display: block;
                padding: 0.75rem 1rem;
                color: #333;
                text-decoration: none;
                border-bottom: 1px solid #eee;
                transition: background 0.2s;
            `;
            item.addEventListener('mouseenter', () => {
                item.style.background = '#f5f5f5';
            });
            item.addEventListener('mouseleave', () => {
                item.style.background = 'transparent';
            });
        });

        // 로그아웃 버튼
        dropdown.querySelector('.logout-btn').addEventListener('click', () => {
            this.logout();
        });

        // 문서에 추가
        document.body.appendChild(dropdown);

        // 외부 클릭 시 닫기
        const closeDropdown = (e) => {
            if (!dropdown.contains(e.target) && !event.target.closest('.user-avatar')) {
                dropdown.remove();
                document.removeEventListener('click', closeDropdown);
            }
        };

        setTimeout(() => {
            document.addEventListener('click', closeDropdown);
        }, 10);
    }
}

// 글로벌 인스턴스 생성
if (!window.authManager) {
    window.authManager = new AuthManager();
}

// 페이지 로드 시 인증 상태 확인 및 UI 업데이트
document.addEventListener('DOMContentLoaded', () => {
    if (window.authManager) {
        authManager.checkAuthStatus().then(() => {
            authManager.updateUI();
            authManager.setupUserMenu();
        });
    }
});

// 로그인 폼 처리 (login.html용)
function setupLoginForm() {
    const loginForm = document.getElementById('loginForm');
    if (!loginForm) return;

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const errorElement = document.getElementById('loginError');
        
        // 로딩 표시
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 로그인 중...';
        submitBtn.disabled = true;
        
        // 로그인 시도
        const result = await authManager.login(email, password);
        
        if (result.success) {
            // 성공 시 대시보드로 이동
            window.location.href = 'dashboard.html';
        } else {
            // 실패 시 에러 표시
            if (errorElement) {
                errorElement.textContent = result.error;
                errorElement.style.display = 'block';
            }
            
            // 버튼 복원
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

// 회원가입 폼 처리 (signup.html용)
function setupSignupForm() {
    const signupForm = document.getElementById('signupForm');
    if (!signupForm) return;

    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const userData = {
            email: document.getElementById('email').value,
            name: document.getElementById('name').value,
            nickname: document.getElementById('nickname').value,
            password: document.getElementById('password').value,
            passwordConfirm: document.getElementById('passwordConfirm').value
        };
        
        const errorElement = document.getElementById('signupError');
        
        // 비밀번호 확인
        if (userData.password !== userData.passwordConfirm) {
            if (errorElement) {
                errorElement.textContent = '비밀번호가 일치하지 않습니다';
                errorElement.style.display = 'block';
            }
            return;
        }
        
        // 로딩 표시
        const submitBtn = signupForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 가입 중...';
        submitBtn.disabled = true;
        
        // 회원가입 시도
        const result = await authManager.signup(userData);
        
        if (result.success) {
            if (result.requiresVerification) {
                // 이메일 인증 필요
                window.location.href = 'verify.html?email=' + encodeURIComponent(userData.email);
            } else {
                // 자동 로그인 성공
                window.location.href = 'dashboard.html';
            }
        } else {
            // 실패 시 에러 표시
            if (errorElement) {
                errorElement.textContent = result.error;
                errorElement.style.display = 'block';
            }
            
            // 버튼 복원
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

// 이메일 인증 처리 (verify.html용)
function setupEmailVerification() {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const email = urlParams.get('email');
    
    if (token) {
        // 토큰으로 인증 시도
        const verifyMessage = document.getElementById('verifyMessage');
        const verifyBtn = document.getElementById('verifyBtn');
        
        if (verifyMessage) {
            verifyMessage.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 이메일 인증 중...';
        }
        
        authManager.verifyEmail(token).then(result => {
            if (verifyMessage) {
                if (result.success) {
                    verifyMessage.innerHTML = '<i class="fas fa-check-circle"></i> 이메일 인증이 완료되었습니다!<br>자동으로 로그인됩니다.';
                    setTimeout(() => {
                        window.location.href = 'dashboard.html';
                    }, 2000);
                } else {
                    verifyMessage.innerHTML = `<i class="fas fa-times-circle"></i> 인증 실패: ${result.error}`;
                }
            }
        });
    } else if (email) {
        // 이메일 재전송 버튼
        const resendBtn = document.getElementById('resendBtn');
        if (resendBtn) {
            resendBtn.addEventListener('click', async () => {
                const result = await fetch('/api/auth/resend-verification', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: email })
                });
                
                if (result.ok) {
                    alert('인증 이메일을 재전송했습니다. 이메일을 확인해주세요.');
                }
            });
        }
    }
}

// 페이지별 초기화
document.addEventListener('DOMContentLoaded', () => {
    const currentPage = window.location.pathname.split('/').pop();
    
    switch(currentPage) {
        case 'login.html':
        case 'login':
            setupLoginForm();
            break;
        case 'signup.html':
        case 'signup':
            setupSignupForm();
            break;
        case 'verify.html':
        case 'verify':
            setupEmailVerification();
            break;
    }
});

// 인증 에러 처리
function handleAuthError(error) {
    console.error('인증 오류:', error);
    
    // 로그인 페이지로 리다이렉트
    if (error.status === 401 || error.message === '토큰 만료') {
        authManager.clearAuth();
        window.location.href = 'login.html?expired=true';
    }
}

// API 요청 헬퍼 (인증 토큰 자동 추가)
function authFetch(url, options = {}) {
    if (!options.headers) {
        options.headers = {};
    }
    
    if (authManager.isAuthenticated()) {
        options.headers['Authorization'] = `Bearer ${authManager.token}`;
    }
    
    return fetch(url, options)
        .then(response => {
            if (response.status === 401) {
                handleAuthError({ status: 401, message: '인증이 필요합니다' });
                return Promise.reject('인증이 필요합니다');
            }
            return response;
        })
        .catch(error => {
            handleAuthError(error);
            return Promise.reject(error);
        });
}

// 글로벌 헬퍼 함수
window.authFetch = authFetch;

export default AuthManager;
