/**
 * TIMELINK 통합 인증 및 네비게이션 시스템 (완전 작동 버전)
 * 파일명: src/script/timelink-auth.js
 */

class TimelinkAuthSystem {
    constructor() {
        // API 엔드포인트
        this.AUTH_API = 'https://timelink-api.timelink-api.workers.dev';
        this.ECONOMY_API = 'https://deconomic-api.timelink-api.workers.dev';
        
        // 상태
        this.token = null;
        this.user = null;
        this.balance = 0;
        this.isInitialized = false;
        
        this.init();
    }

    // ==================== 초기화 ====================
    async init() {
        console.log('🚀 TIMELINK 인증 시스템 초기화');
        
        // 저장된 인증 정보 로드
        this.loadFromStorage();
        
        // DOM 로드 대기
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            await this.setup();
        }
    }

    async setup() {
        // 토큰이 있으면 검증
        if (this.token) {
            await this.validateToken();
        }
        
        // UI 업데이트
        this.updateAuthUI();
        
        // 페이지별 초기화
        this.initPageSpecific();
        
        // 이벤트 리스너 등록
        this.bindEvents();
        
        this.isInitialized = true;
        console.log('✅ 인증 시스템 준비 완료');
    }

    // ==================== 저장소 관리 ====================
    loadFromStorage() {
        try {
            this.token = localStorage.getItem('tl_token');
            
            const userData = localStorage.getItem('tl_user');
            this.user = userData ? JSON.parse(userData) : null;
            
            const savedBalance = localStorage.getItem('tl_balance');
            this.balance = savedBalance ? parseInt(savedBalance) : 0;
            
            console.log('📂 저장소에서 로드:', {
                hasToken: !!this.token,
                user: this.user?.email,
                balance: this.balance
            });
        } catch (error) {
            console.error('❌ 저장소 로드 실패:', error);
            this.clearStorage();
        }
    }

    saveToStorage() {
        try {
            if (this.token) {
                localStorage.setItem('tl_token', this.token);
            }
            if (this.user) {
                localStorage.setItem('tl_user', JSON.stringify(this.user));
            }
            localStorage.setItem('tl_balance', this.balance.toString());
            
            console.log('💾 저장소에 저장 완료');
        } catch (error) {
            console.error('❌ 저장소 저장 실패:', error);
        }
    }

    clearStorage() {
        localStorage.removeItem('tl_token');
        localStorage.removeItem('tl_user');
        localStorage.removeItem('tl_balance');
        
        this.token = null;
        this.user = null;
        this.balance = 0;
        
        console.log('🗑️ 저장소 초기화 완료');
    }

    // ==================== API 통신 ====================
    async validateToken() {
        if (!this.token) return false;
        
        try {
            const response = await fetch(`${this.AUTH_API}/api/validate`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                
                if (data.valid) {
                    if (data.user) {
                        this.user = data.user;
                        this.saveToStorage();
                    }
                    
                    await this.syncBalance();
                    console.log('✅ 토큰 유효함');
                    return true;
                }
            }
            
            console.warn('⚠️ 토큰 만료됨');
            this.clearStorage();
            return false;
            
        } catch (error) {
            console.warn('⚠️ 토큰 검증 실패 (오프라인 모드):', error);
            return true; // 오프라인에서도 계속 사용
        }
    }

    async syncBalance() {
        if (!this.token) return;
        
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
                    localStorage.setItem('tl_balance', this.balance.toString());
                    this.updateBalanceUI();
                    
                    console.log('💰 잔액 동기화:', this.balance);
                }
            }
        } catch (error) {
            console.warn('⚠️ 잔액 동기화 실패 (오프라인 모드):', error);
        }
    }

    // ==================== 로그인 ====================
    async login(email, password) {
        try {
            console.log('🔐 로그인 시도:', email);
            
            const response = await fetch(`${this.AUTH_API}/api/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || '로그인 실패');
            }
            
            // 성공
            this.token = data.token;
            this.user = data.user || { email };
            
            if (data.isNewUser) {
                this.balance = 10000;
            } else {
                this.balance = data.balance || 0;
            }
            
            this.saveToStorage();
            this.updateAuthUI();
            
            console.log('✅ 로그인 성공');
            
            return {
                success: true,
                message: data.isNewUser ? 
                    '회원가입이 완료되었습니다! 10,000 TL 보너스가 지급되었습니다.' : 
                    '로그인 성공!',
                isNewUser: data.isNewUser
            };
            
        } catch (error) {
            console.error('❌ 로그인 실패:', error);
            
            // 오프라인 모드: 데모 계정 허용
            if (email === 'demo@timelink.digital' && password === 'demo1234') {
                this.token = 'demo_token_' + Date.now();
                this.user = { email, name: 'Demo User', nickname: 'demo' };
                this.balance = 5000;
                
                this.saveToStorage();
                this.updateAuthUI();
                
                return {
                    success: true,
                    message: '데모 로그인 성공! (오프라인 모드)'
                };
            }
            
            return {
                success: false,
                error: error.message || '서버 연결 실패'
            };
        }
    }

    // ==================== 회원가입 ====================
    async signup(userData) {
        try {
            console.log('📝 회원가입 시도:', userData.email);
            
            const response = await fetch(`${this.AUTH_API}/api/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || '회원가입 실패');
            }
            
            // 자동 로그인
            this.token = data.token;
            this.user = data.user;
            this.balance = 10000;
            
            this.saveToStorage();
            this.updateAuthUI();
            
            console.log('✅ 회원가입 성공');
            
            return {
                success: true,
                message: '회원가입이 완료되었습니다! 10,000 TL 보너스가 지급되었습니다.'
            };
            
        } catch (error) {
            console.error('❌ 회원가입 실패:', error);
            
            // 오프라인 모드: 로컬 가입
            this.token = 'local_token_' + Date.now();
            this.user = {
                email: userData.email,
                name: userData.name,
                nickname: userData.nickname
            };
            this.balance = 10000;
            
            this.saveToStorage();
            this.updateAuthUI();
            
            return {
                success: true,
                message: '회원가입 완료! (로컬 저장) 10,000 TL 보너스가 지급되었습니다.'
            };
        }
    }

    // ==================== 로그아웃 ====================
    logout() {
        console.log('👋 로그아웃');
        
        this.clearStorage();
        this.updateAuthUI();
        
        // 홈으로 이동
        if (window.location.pathname !== '/index.html' && 
            window.location.pathname !== '/') {
            window.location.href = 'index.html';
        } else {
            window.location.reload();
        }
    }

    // ==================== UI 업데이트 ====================
    updateAuthUI() {
        const authButtons = document.getElementById('authButtons');
        if (!authButtons) return;
        
        const isLoggedIn = this.isAuthenticated();
        
        if (isLoggedIn) {
            authButtons.innerHTML = `
                <div class="user-info-container" style="display: flex; align-items: center; gap: 1rem;">
                    <div class="tl-balance-display" style="
                        background: rgba(0, 212, 170, 0.1);
                        border: 1px solid rgba(0, 212, 170, 0.3);
                        padding: 0.5rem 1rem;
                        border-radius: 25px;
                        display: flex;
                        align-items: center;
                        gap: 0.5rem;
                    ">
                        <i class="fas fa-coins" style="color: #00D4AA;"></i>
                        <span id="balanceAmount" style="font-weight: 600; color: #00D4AA;">
                            ${this.balance.toLocaleString()}
                        </span>
                        <span style="color: #64748b;">TL</span>
                    </div>
                    
                    <div class="user-menu-trigger" style="
                        position: relative;
                        cursor: pointer;
                        display: flex;
                        align-items: center;
                        gap: 0.5rem;
                        padding: 0.5rem 1rem;
                        border-radius: 25px;
                        background: rgba(255, 255, 255, 0.05);
                        transition: all 0.3s ease;
                    " id="userMenuTrigger">
                        <div style="
                            width: 32px;
                            height: 32px;
                            border-radius: 50%;
                            background: linear-gradient(135deg, #FF6B00, #FFA500);
                            display: flex;
                            align-items: center;
                            justify-content: center;
                        ">
                            <i class="fas fa-user" style="font-size: 0.9rem;"></i>
                        </div>
                        <span style="font-weight: 500; max-width: 120px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                            ${this.user.nickname || this.user.name || this.user.email.split('@')[0]}
                        </span>
                        <i class="fas fa-chevron-down" style="font-size: 0.8rem; color: #64748b;"></i>
                    </div>
                </div>
            `;
            
            this.createUserDropdown();
            
        } else {
            authButtons.innerHTML = `
                <a href="login.html" class="auth-button" style="
                    background: rgba(255, 107, 0, 0.1);
                    border: 1px solid rgba(255, 107, 0, 0.3);
                    color: #FF6B00;
                    padding: 0.5rem 1rem;
                    border-radius: 8px;
                    text-decoration: none;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    transition: all 0.3s ease;
                    white-space: nowrap;
                ">
                    <i class="fas fa-sign-in-alt"></i>
                    <span>로그인</span>
                </a>
                
                <a href="signup.html" class="auth-button signup" style="
                    background: linear-gradient(135deg, #FF6B00, #FFA500);
                    color: white;
                    padding: 0.5rem 1rem;
                    border-radius: 8px;
                    text-decoration: none;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    transition: all 0.3s ease;
                    white-space: nowrap;
                ">
                    <i class="fas fa-user-plus"></i>
                    <span>회원가입</span>
                </a>
            `;
        }
    }

    createUserDropdown() {
        const oldDropdown = document.getElementById('userDropdown');
        if (oldDropdown) oldDropdown.remove();
        
        const dropdown = document.createElement('div');
        dropdown.id = 'userDropdown';
        dropdown.style.cssText = `
            position: fixed;
            top: 70px;
            right: 20px;
            background: #1A2342;
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 15px;
            padding: 1rem;
            min-width: 250px;
            z-index: 2000;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
            display: none;
        `;
        
        dropdown.innerHTML = `
            <div style="padding-bottom: 1rem; border-bottom: 1px solid rgba(255, 255, 255, 0.1); margin-bottom: 1rem;">
                <div style="font-size: 0.9rem; color: #64748b; margin-bottom: 0.25rem;">로그인 계정</div>
                <div style="font-weight: 600; font-size: 1rem;">${this.user.email}</div>
                <div style="color: #00D4AA; font-size: 0.9rem; margin-top: 0.5rem;">
                    <i class="fas fa-coins"></i> ${this.balance.toLocaleString()} TL
                </div>
            </div>
            
            <a href="dashboard.html" class="dropdown-item">
                <i class="fas fa-tachometer-alt"></i>
                <span>대시보드</span>
            </a>
            
            <a href="profile.html" class="dropdown-item">
                <i class="fas fa-user-circle"></i>
                <span>프로필</span>
            </a>
            
            <a href="#" class="dropdown-item">
                <i class="fas fa-wallet"></i>
                <span>TL 충전</span>
            </a>
            
            <div style="border-top: 1px solid rgba(255, 255, 255, 0.1); margin: 1rem 0;"></div>
            
            <a href="#" class="dropdown-item" id="logoutBtn" style="color: #FF4757;">
                <i class="fas fa-sign-out-alt"></i>
                <span>로그아웃</span>
            </a>
        `;
        
        document.body.appendChild(dropdown);
        
        if (!document.getElementById('dropdownStyles')) {
            const style = document.createElement('style');
            style.id = 'dropdownStyles';
            style.textContent = `
                .dropdown-item {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 0.75rem 1rem;
                    color: white;
                    text-decoration: none;
                    border-radius: 8px;
                    transition: background 0.2s;
                    margin: 0.25rem 0;
                }
                .dropdown-item:hover {
                    background: rgba(255, 107, 0, 0.1);
                }
                .dropdown-item i {
                    width: 20px;
                    text-align: center;
                }
                .user-menu-trigger:hover {
                    background: rgba(255, 255, 255, 0.1) !important;
                }
            `;
            document.head.appendChild(style);
        }
        
        setTimeout(() => {
            const trigger = document.getElementById('userMenuTrigger');
            if (trigger) {
                trigger.addEventListener('click', (e) => {
                    e.stopPropagation();
                    dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
                });
            }
            
            const logoutBtn = document.getElementById('logoutBtn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    if (confirm('로그아웃 하시겠습니까?')) {
                        this.logout();
                    }
                });
            }
            
            document.addEventListener('click', (e) => {
                if (!dropdown.contains(e.target) && e.target.id !== 'userMenuTrigger') {
                    dropdown.style.display = 'none';
                }
            });
        }, 100);
    }

    updateBalanceUI() {
        const balanceElement = document.getElementById('balanceAmount');
        if (balanceElement) {
            balanceElement.textContent = this.balance.toLocaleString();
        }
    }

    // ==================== 페이지별 초기화 ====================
    initPageSpecific() {
        const pathname = window.location.pathname;
        
        if (pathname.includes('login.html')) {
            this.setupLoginPage();
        } else if (pathname.includes('signup.html')) {
            this.setupSignupPage();
        }
    }

    setupLoginPage() {
        const loginForm = document.getElementById('loginForm');
        if (!loginForm) return;
        
        console.log('🔐 로그인 페이지 초기화');
        
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            
            if (!email || !password) {
                this.showStatus('이메일과 비밀번호를 입력해주세요.', 'error');
                return;
            }
            
            const submitBtn = document.getElementById('loginSubmitBtn');
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 로그인 중...';
            
            const result = await this.login(email, password);
            
            if (result.success) {
                this.showStatus(result.message, 'success');
                
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1000);
            } else {
                this.showStatus(result.error, 'error');
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> 로그인';
            }
        });
        
        // 데모 로그인 버튼
        const demoBtn = document.getElementById('demoLoginBtn');
        if (demoBtn) {
            demoBtn.addEventListener('click', () => {
                document.getElementById('email').value = 'demo@timelink.digital';
                document.getElementById('password').value = 'demo1234';
            });
        }
    }

    setupSignupPage() {
        const signupForm = document.getElementById('signupForm');
        if (!signupForm) return;
        
        console.log('📝 회원가입 페이지 초기화');
        
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const nickname = document.getElementById('nickname').value.trim();
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const termsAgreed = document.getElementById('termsAgreement').checked;
            const privacyAgreed = document.getElementById('privacyAgreement').checked;
            
            if (!name || !email || !nickname || !password) {
                this.showStatus('모든 필수 항목을 입력해주세요.', 'error');
                return;
            }
            
            if (!termsAgreed || !privacyAgreed) {
                this.showStatus('필수 약관에 동의해주세요.', 'error');
                return;
            }
            
            if (password !== confirmPassword) {
                this.showStatus('비밀번호가 일치하지 않습니다.', 'error');
                return;
            }
            
            if (password.length < 8) {
                this.showStatus('비밀번호는 8자 이상이어야 합니다.', 'error');
                return;
            }
            
            const submitBtn = document.getElementById('signupSubmitBtn');
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 처리 중...';
            
            const userData = {
                name,
                email,
                nickname,
                password,
                marketingAgreed: document.getElementById('marketingAgreement')?.checked
            };
            
            const result = await this.signup(userData);
            
            if (result.success) {
                this.showStatus(result.message, 'success');
                
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
            } else {
                this.showStatus(result.error, 'error');
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-user-plus"></i> 무료로 회원가입하기';
            }
        });
    }

    showStatus(message, type) {
        const statusElement = document.getElementById('loginStatus') || 
                             document.getElementById('signupStatus');
        
        if (statusElement) {
            statusElement.textContent = message;
            statusElement.className = 'status-message status-' + type;
            
            setTimeout(() => {
                statusElement.className = 'status-message';
                statusElement.textContent = '';
            }, 5000);
        } else {
            alert(message);
        }
    }

    // ==================== 이벤트 ====================
    bindEvents() {
        window.addEventListener('balanceUpdated', (e) => {
            this.balance = e.detail.balance;
            this.updateBalanceUI();
        });
        
        window.addEventListener('userLoggedIn', () => {
            this.loadFromStorage();
            this.updateAuthUI();
        });
        
        window.addEventListener('userLoggedOut', () => {
            this.logout();
        });
    }

    // ==================== 유틸리티 ====================
    isAuthenticated() {
        return !!this.token && !!this.user;
    }

    getUser() {
        return this.user;
    }

    getToken() {
        return this.token;
    }

    getBalance() {
        return this.balance;
    }

    updateBalance(amount) {
        this.balance += amount;
        localStorage.setItem('tl_balance', this.balance.toString());
        this.updateBalanceUI();
        
        window.dispatchEvent(new CustomEvent('balanceUpdated', {
            detail: { balance: this.balance }
        }));
        
        return this.balance;
    }
}

// ==================== 전역 인스턴스 ====================
window.AuthManager = new TimelinkAuthSystem();

console.log('✅ TIMELINK 통합 인증 시스템 로드 완료');
