// timelink-auth.js - TIMELINK 인증 시스템

class TimelinkAuth {
    constructor() {
        this.baseURL = 'https://api.timelink.studio'; // 실제 API 엔드포인트
        this.localStorageKey = 'timelink_auth';
        this.tokenKey = 'timelink_token';
        this.userKey = 'timelink_user';
        this.balanceKey = 'timelink_tl_balance';
        
        this.init();
    }
    
    init() {
        this.loadUserData();
        this.setupEventListeners();
        this.updateUI();
    }
    
    // 로컬 스토리지에서 사용자 데이터 로드
    loadUserData() {
        try {
            const userData = localStorage.getItem(this.userKey);
            if (userData) {
                this.user = JSON.parse(userData);
            }
            
            const token = localStorage.getItem(this.tokenKey);
            if (token) {
                this.token = token;
            }
            
            const balance = localStorage.getItem(this.balanceKey);
            if (balance) {
                this.balance = parseInt(balance);
            } else {
                // 기본 잔액 설정
                this.balance = 10000;
                this.saveBalance();
            }
        } catch (error) {
            console.error('사용자 데이터 로드 중 오류:', error);
            this.clearAuth();
        }
    }
    
    // 사용자 데이터 저장
    saveUserData(user) {
        try {
            this.user = user;
            localStorage.setItem(this.userKey, JSON.stringify(user));
            this.updateUI();
        } catch (error) {
            console.error('사용자 데이터 저장 중 오류:', error);
        }
    }
    
    // 토큰 저장
    saveToken(token) {
        try {
            this.token = token;
            localStorage.setItem(this.tokenKey, token);
        } catch (error) {
            console.error('토큰 저장 중 오류:', error);
        }
    }
    
    // TL 잔액 저장
    saveBalance() {
        try {
            localStorage.setItem(this.balanceKey, this.balance.toString());
            this.updateUI();
        } catch (error) {
            console.error('잔액 저장 중 오류:', error);
        }
    }
    
    // TL 잔액 업데이트
    updateBalance(amount) {
        this.balance += amount;
        this.saveBalance();
        return this.balance;
    }
    
    // 현재 TL 잔액 조회
    getBalance() {
        return this.balance;
    }
    
    // 이벤트 리스너 설정
    setupEventListeners() {
        // 로그인 폼 이벤트
        document.addEventListener('submit', (e) => {
            if (e.target.id === 'loginForm') {
                e.preventDefault();
                this.handleLogin(e);
            }
            
            if (e.target.id === 'signupForm') {
                e.preventDefault();
                this.handleSignup(e);
            }
        });
        
        // 로그아웃 이벤트
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('logout-btn') || 
                e.target.closest('.logout-btn')) {
                this.logout();
            }
        });
    }
    
    // UI 업데이트
    updateUI() {
        // 헤더 업데이트
        this.updateHeader();
        
        // 페이지별 UI 업데이트
        this.updatePageUI();
    }
    
    // 헤더 업데이트
    updateHeader() {
        const authButtons = document.getElementById('authButtons');
        if (!authButtons) return;
        
        if (this.isAuthenticated()) {
            // 로그인 상태
            const tlBalance = this.getBalance().toLocaleString();
            
            authButtons.innerHTML = `
                <div class="user-menu">
                    <div class="user-tl-balance">
                        <i class="fas fa-coins"></i>
                        <span>${tlBalance} TL</span>
                    </div>
                    <div class="user-info">
                        <div class="user-avatar">
                            <i class="fas fa-user"></i>
                        </div>
                        <span class="user-name">${this.user.name || this.user.email}</span>
                        <i class="fas fa-chevron-down"></i>
                    </div>
                    <div class="dropdown-menu">
                        <a href="dashboard.html" class="dropdown-item">
                            <i class="fas fa-tachometer-alt"></i> 대시보드
                        </a>
                        <a href="my-music.html" class="dropdown-item">
                            <i class="fas fa-music"></i> 내 음원
                        </a>
                        <a href="my-cafe.html" class="dropdown-item">
                            <i class="fas fa-store"></i> 내 카페
                        </a>
                        <a href="wallet.html" class="dropdown-item">
                            <i class="fas fa-wallet"></i> TL 지갑
                        </a>
                        <div class="dropdown-divider"></div>
                        <a href="profile.html" class="dropdown-item">
                            <i class="fas fa-user-cog"></i> 프로필 설정
                        </a>
                        <div class="dropdown-divider"></div>
                        <button class="dropdown-item logout-btn">
                            <i class="fas fa-sign-out-alt"></i> 로그아웃
                        </button>
                    </div>
                </div>
            `;
        } else {
            // 비로그인 상태
            authButtons.innerHTML = `
                <div class="auth-buttons">
                    <button class="btn btn-outline" id="loginBtn">
                        <i class="fas fa-sign-in-alt"></i>
                        <span>로그인</span>
                    </button>
                    <button class="btn btn-primary" id="signupBtn">
                        <i class="fas fa-user-plus"></i>
                        <span>회원가입</span>
                    </button>
                </div>
            `;
        }
    }
    
    // 페이지별 UI 업데이트
    updatePageUI() {
        const currentPage = window.location.pathname.split('/').pop();
        
        // 대시보드 페이지
        if (currentPage === 'dashboard.html' || currentPage.includes('dashboard')) {
            this.updateDashboard();
        }
        
        // 지갑 페이지
        if (currentPage === 'wallet.html' || currentPage.includes('wallet')) {
            this.updateWallet();
        }
    }
    
    // 대시보드 업데이트
    updateDashboard() {
        if (!this.isAuthenticated()) return;
        
        const tlBalance = this.getBalance().toLocaleString();
        const welcomeElement = document.getElementById('welcomeMessage');
        const balanceElement = document.getElementById('dashboardBalance');
        
        if (welcomeElement) {
            welcomeElement.textContent = `${this.user.name}님, 환영합니다!`;
        }
        
        if (balanceElement) {
            balanceElement.textContent = `${tlBalance} TL`;
        }
    }
    
    // 지갑 페이지 업데이트
    updateWallet() {
        if (!this.isAuthenticated()) return;
        
        const balanceElement = document.getElementById('walletBalance');
        const transactionsElement = document.getElementById('walletTransactions');
        
        if (balanceElement) {
            balanceElement.textContent = this.getBalance().toLocaleString();
        }
        
        if (transactionsElement) {
            // 거래 내역 표시
            this.displayTransactionHistory(transactionsElement);
        }
    }
    
    // 거래 내역 표시
    displayTransactionHistory(container) {
        const transactions = this.getTransactionHistory();
        
        if (transactions.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-wallet"></i>
                    <p>아직 거래 내역이 없습니다.</p>
                </div>
            `;
            return;
        }
        
        let html = '';
        transactions.forEach(transaction => {
            const amountClass = transaction.amount >= 0 ? 'positive' : 'negative';
            const sign = transaction.amount >= 0 ? '+' : '';
            
            html += `
                <div class="transaction-item">
                    <div class="transaction-info">
                        <div class="transaction-type">${transaction.type}</div>
                        <div class="transaction-date">${transaction.date}</div>
                    </div>
                    <div class="transaction-amount ${amountClass}">
                        ${sign}${transaction.amount.toLocaleString()} TL
                    </div>
                </div>
            `;
        });
        
        container.innerHTML = html;
    }
    
    // 거래 내역 조회
    getTransactionHistory() {
        const history = localStorage.getItem('timelink_transactions');
        return history ? JSON.parse(history) : [
            {
                type: '회원가입 보너스',
                amount: 10000,
                date: new Date().toLocaleDateString('ko-KR'),
                description: '신규 회원가입 보너스'
            }
        ];
    }
    
    // 거래 내역 추가
    addTransaction(type, amount, description = '') {
        const transactions = this.getTransactionHistory();
        
        transactions.unshift({
            type: type,
            amount: amount,
            date: new Date().toLocaleDateString('ko-KR'),
            description: description,
            timestamp: Date.now()
        });
        
        // 최근 50개만 저장
        if (transactions.length > 50) {
            transactions.length = 50;
        }
        
        localStorage.setItem('timelink_transactions', JSON.stringify(transactions));
    }
    
    // 로그인 처리
    async handleLogin(event) {
        event.preventDefault();
        
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        if (!this.validateEmail(email)) {
            this.showMessage('유효한 이메일 주소를 입력해주세요.', 'error');
            return;
        }
        
        if (!password) {
            this.showMessage('비밀번호를 입력해주세요.', 'error');
            return;
        }
        
        // 로딩 표시
        this.showLoading();
        
        try {
            // API 호출 (시뮬레이션)
            const response = await this.mockLoginAPI(email, password);
            
            if (response.success) {
                // 인증 정보 저장
                this.saveUserData(response.user);
                this.saveToken(response.token);
                
                // 로그인 보너스 (첫 로그인 시에만)
                if (!localStorage.getItem('timelink_login_bonus_given')) {
                    this.updateBalance(10000);
                    this.addTransaction('로그인 보너스', 10000, '첫 로그인 보너스');
                    localStorage.setItem('timelink_login_bonus_given', 'true');
                    this.showMessage('로그인 성공! 10,000 TL이 지급되었습니다.', 'success');
                } else {
                    this.showMessage('로그인 성공!', 'success');
                }
                
                // 모달 닫기
                this.closeAuthModal();
                
                // 페이지 새로고침
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
                
            } else {
                this.showMessage(response.message || '로그인에 실패했습니다.', 'error');
            }
            
        } catch (error) {
            console.error('로그인 오류:', error);
            this.showMessage('로그인 중 오류가 발생했습니다.', 'error');
            
        } finally {
            this.hideLoading();
        }
    }
    
    // 회원가입 처리
    async handleSignup(event) {
        event.preventDefault();
        
        const name = document.getElementById('signupName').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        // 유효성 검사
        if (!name || name.length < 2) {
            this.showMessage('이름을 2자 이상 입력해주세요.', 'error');
            return;
        }
        
        if (!this.validateEmail(email)) {
            this.showMessage('유효한 이메일 주소를 입력해주세요.', 'error');
            return;
        }
        
        if (!this.validatePassword(password)) {
            this.showMessage('비밀번호는 8자 이상, 영문과 숫자를 포함해야 합니다.', 'error');
            return;
        }
        
        if (password !== confirmPassword) {
            this.showMessage('비밀번호가 일치하지 않습니다.', 'error');
            return;
        }
        
        // 로딩 표시
        this.showLoading();
        
        try {
            // API 호출 (시뮬레이션)
            const response = await this.mockSignupAPI(name, email, password);
            
            if (response.success) {
                // 인증 정보 저장
                this.saveUserData(response.user);
                this.saveToken(response.token);
                
                // 회원가입 보너스 10,000 TL 지급
                this.updateBalance(10000);
                this.addTransaction('회원가입 보너스', 10000, '신규 회원가입 보너스');
                
                this.showMessage('회원가입 성공! 10,000 TL이 지급되었습니다.', 'success');
                
                // 모달 닫기
                this.closeAuthModal();
                
                // 페이지 새로고침
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
                
            } else {
                this.showMessage(response.message || '회원가입에 실패했습니다.', 'error');
            }
            
        } catch (error) {
            console.error('회원가입 오류:', error);
            this.showMessage('회원가입 중 오류가 발생했습니다.', 'error');
            
        } finally {
            this.hideLoading();
        }
    }
    
    // 로그아웃
    logout() {
        if (confirm('로그아웃 하시겠습니까?')) {
            this.clearAuth();
            this.showMessage('로그아웃되었습니다.', 'info');
            
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        }
    }
    
    // 인증 정보 초기화
    clearAuth() {
        this.user = null;
        this.token = null;
        
        localStorage.removeItem(this.userKey);
        localStorage.removeItem(this.tokenKey);
        
        // 잔액은 유지
        // localStorage.removeItem(this.balanceKey);
        
        this.updateUI();
    }
    
    // 인증 상태 확인
    isAuthenticated() {
        return !!this.user && !!this.token;
    }
    
    // 현재 사용자 정보
    getCurrentUser() {
        return this.user;
    }
    
    // 인증 토큰
    getToken() {
        return this.token;
    }
    
    // 모의 API 함수들
    async mockLoginAPI(email, password) {
        // 실제로는 서버와 통신
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 테스트용 성공 응답
        return {
            success: true,
            user: {
                id: Date.now().toString(),
                email: email,
                name: email.split('@')[0],
                role: 'user',
                createdAt: new Date().toISOString()
            },
            token: 'mock_jwt_token_' + Date.now(),
            message: '로그인 성공'
        };
    }
    
    async mockSignupAPI(name, email, password) {
        // 실제로는 서버와 통신
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 테스트용 성공 응답
        return {
            success: true,
            user: {
                id: Date.now().toString(),
                email: email,
                name: name,
                role: 'user',
                createdAt: new Date().toISOString()
            },
            token: 'mock_jwt_token_' + Date.now(),
            message: '회원가입 성공'
        };
    }
    
    // 유틸리티 함수들
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    validatePassword(password) {
        // 최소 8자, 영문+숫자 포함
        const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
        return re.test(password);
    }
    
    showMessage(message, type = 'info') {
        // common-component.js의 showToast 사용
        if (typeof window.showToast === 'function') {
            window.showToast(message, type);
        } else {
            alert(message);
        }
    }
    
    showLoading() {
        if (typeof window.showLoading === 'function') {
            window.showLoading();
        }
    }
    
    hideLoading() {
        if (typeof window.hideLoading === 'function') {
            window.hideLoading();
        }
    }
    
    closeAuthModal() {
        const modal = document.querySelector('.auth-modal-overlay');
        if (modal) {
            modal.remove();
        }
    }
}

// 글로벌 인스턴스 생성
window.timelinkAuth = new TimelinkAuth();
