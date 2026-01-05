// timelink-auth.js - TIMELINK 통합 인증 시스템
class TimelinkAuth {
    constructor() {
        this.userKey = 'timelink_user';
        this.tokenKey = 'timelink_token';
        this.balanceKey = 'timelink_tl_balance';
        this.bonusGivenKey = 'timelink_bonus_given';
        this.transactionsKey = 'timelink_transactions';
        
        this.init();
    }
    
    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.updateAuthButtons();
            this.highlightActiveNav();
            this.setupEventListeners();
        });
    }
    
    setupEventListeners() {
        // 로그인/회원가입 버튼 이벤트
        document.addEventListener('click', (e) => {
            if (e.target.id === 'loginBtn' || e.target.closest('#loginBtn')) {
                this.showLoginModal();
            }
            if (e.target.id === 'signupBtn' || e.target.closest('#signupBtn')) {
                this.showSignupModal();
            }
        });
    }
    
    updateAuthButtons() {
        const authButtons = document.getElementById('authButtons');
        if (!authButtons) return;

        const user = this.getUser();
        const balance = this.getBalance();
        
        if (user) {
            // 로그인 상태
            authButtons.innerHTML = `
                <div class="auth-logged-in">
                    <div class="tl-balance-display">
                        <i class="fas fa-coins"></i>
                        <span>${balance.toLocaleString()} TL</span>
                    </div>
                    <div class="user-menu-container">
                        <div class="user-profile" onclick="toggleUserMenu()">
                            <div class="user-avatar">
                                <i class="fas fa-user"></i>
                            </div>
                            <span class="user-name">${user.name || user.email}</span>
                            <i class="fas fa-chevron-down"></i>
                        </div>
                        <div class="user-dropdown-menu" id="userDropdown">
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
                            <button class="dropdown-item logout-btn" onclick="timelinkAuth.logout()">
                                <i class="fas fa-sign-out-alt"></i> 로그아웃
                            </button>
                        </div>
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
    
    highlightActiveNav() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPage || 
                (currentPage === '' && href === 'index.html') ||
                (currentPage === 'index.html' && href === 'index.html')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
    
    // 인증 관련 메서드
    async login(email, password) {
        try {
            // 모의 로그인 API 호출
            const response = await this.mockLoginAPI(email, password);
            
            if (response.success) {
                this.saveUser(response.user);
                this.saveToken(response.token);
                
                // 첫 로그인 시 보너스 확인
                if (!localStorage.getItem(this.bonusGivenKey)) {
                    this.addBonus(10000, '회원가입 보너스');
                    localStorage.setItem(this.bonusGivenKey, 'true');
                }
                
                this.updateAuthButtons();
                this.showToast('로그인 성공!', 'success');
                return true;
            } else {
                this.showToast(response.message, 'error');
                return false;
            }
        } catch (error) {
            console.error('로그인 오류:', error);
            this.showToast('로그인 중 오류가 발생했습니다.', 'error');
            return false;
        }
    }
    
    async signup(name, email, password) {
        try {
            // 모의 회원가입 API 호출
            const response = await this.mockSignupAPI(name, email, password);
            
            if (response.success) {
                this.saveUser(response.user);
                this.saveToken(response.token);
                
                // 회원가입 보너스 10,000 TL 지급
                this.addBonus(10000, '회원가입 보너스');
                localStorage.setItem(this.bonusGivenKey, 'true');
                
                this.updateAuthButtons();
                this.showToast('🎉 회원가입 성공! 10,000 TL이 지급되었습니다.', 'success');
                return true;
            } else {
                this.showToast(response.message, 'error');
                return false;
            }
        } catch (error) {
            console.error('회원가입 오류:', error);
            this.showToast('회원가입 중 오류가 발생했습니다.', 'error');
            return false;
        }
    }
    
    logout() {
        if (confirm('로그아웃 하시겠습니까?')) {
            localStorage.removeItem(this.userKey);
            localStorage.removeItem(this.tokenKey);
            // 잔액은 유지
            this.updateAuthButtons();
            this.showToast('로그아웃되었습니다.', 'info');
            
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        }
    }
    
    // 사용자 데이터 관리
    getUser() {
        try {
            const userData = localStorage.getItem(this.userKey);
            return userData ? JSON.parse(userData) : null;
        } catch (error) {
            return null;
        }
    }
    
    saveUser(user) {
        localStorage.setItem(this.userKey, JSON.stringify(user));
    }
    
    saveToken(token) {
        localStorage.setItem(this.tokenKey, token);
    }
    
    // TL 잔액 관리
    getBalance() {
        try {
            const balance = localStorage.getItem(this.balanceKey);
            return balance ? parseInt(balance) : 10000;
        } catch (error) {
            return 10000;
        }
    }
    
    updateBalance(amount) {
        const currentBalance = this.getBalance();
        const newBalance = currentBalance + amount;
        localStorage.setItem(this.balanceKey, newBalance.toString());
        
        // 거래내역 저장
        this.addTransaction(amount >= 0 ? '입금' : '출금', amount);
        
        this.updateAuthButtons();
        return newBalance;
    }
    
    addBonus(amount, description = '보너스') {
        const newBalance = this.updateBalance(amount);
        this.addTransaction(description, amount);
        return newBalance;
    }
    
    // 거래내역 관리
    addTransaction(type, amount, description = '') {
        try {
            let transactions = JSON.parse(localStorage.getItem(this.transactionsKey) || '[]');
            
            transactions.unshift({
                id: Date.now(),
                type: type,
                amount: amount,
                description: description,
                date: new Date().toLocaleString('ko-KR'),
                timestamp: Date.now()
            });
            
            // 최근 50개만 유지
            if (transactions.length > 50) {
                transactions = transactions.slice(0, 50);
            }
            
            localStorage.setItem(this.transactionsKey, JSON.stringify(transactions));
        } catch (error) {
            console.error('거래내역 저장 오류:', error);
        }
    }
    
    getTransactions() {
        try {
            return JSON.parse(localStorage.getItem(this.transactionsKey) || '[]');
        } catch (error) {
            return [];
        }
    }
    
    // 모달 관련
    showLoginModal() {
        this.showAuthModal('login');
    }
    
    showSignupModal() {
        this.showAuthModal('signup');
    }
    
    showAuthModal(type) {
        // 기존 모달 제거
        const existingModal = document.querySelector('.auth-modal');
        if (existingModal) existingModal.remove();
        
        const modalHTML = `
            <div class="auth-modal">
                <div class="auth-modal-overlay" onclick="this.parentElement.remove()"></div>
                <div class="auth-modal-content">
                    <div class="auth-modal-header">
                        <h2>${type === 'login' ? '로그인' : '회원가입'}</h2>
                        <button class="close-btn" onclick="this.closest('.auth-modal').remove()">&times;</button>
                    </div>
                    <form id="${type}Form" class="auth-form">
                        ${type === 'signup' ? `
                            <div class="form-group">
                                <label for="signupName">이름</label>
                                <input type="text" id="signupName" placeholder="이름을 입력하세요" required>
                            </div>
                        ` : ''}
                        
                        <div class="form-group">
                            <label for="${type}Email">이메일</label>
                            <input type="email" id="${type}Email" placeholder="이메일을 입력하세요" required>
                        </div>
                        
                        <div class="form-group">
                            <label for="${type}Password">비밀번호</label>
                            <input type="password" id="${type}Password" placeholder="비밀번호를 입력하세요" required>
                        </div>
                        
                        ${type === 'signup' ? `
                            <div class="form-group">
                                <label for="confirmPassword">비밀번호 확인</label>
                                <input type="password" id="confirmPassword" placeholder="비밀번호를 다시 입력하세요" required>
                            </div>
                            <div class="bonus-notice">
                                <i class="fas fa-gift"></i>
                                <span>회원가입 시 10,000 TL 보너스 지급!</span>
                            </div>
                        ` : ''}
                        
                        <button type="submit" class="btn btn-primary btn-block">
                            ${type === 'login' ? '로그인' : '회원가입'}
                        </button>
                    </form>
                    
                    ${type === 'login' ? `
                        <div class="auth-modal-footer">
                            <p>아직 계정이 없으신가요? <a href="#" onclick="timelinkAuth.showSignupModal()">회원가입</a></p>
                        </div>
                    ` : `
                        <div class="auth-modal-footer">
                            <p>이미 계정이 있으신가요? <a href="#" onclick="timelinkAuth.showLoginModal()">로그인</a></p>
                        </div>
                    `}
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // 폼 제출 이벤트 설정
        const form = document.getElementById(`${type}Form`);
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (type === 'login') {
                const email = document.getElementById('loginEmail').value;
                const password = document.getElementById('loginPassword').value;
                await this.login(email, password);
            } else {
                const name = document.getElementById('signupName').value;
                const email = document.getElementById('signupEmail').value;
                const password = document.getElementById('signupPassword').value;
                const confirmPassword = document.getElementById('confirmPassword').value;
                
                if (password !== confirmPassword) {
                    this.showToast('비밀번호가 일치하지 않습니다.', 'error');
                    return;
                }
                
                await this.signup(name, email, password);
            }
            
            // 성공 시 모달 닫기
            if (this.getUser()) {
                document.querySelector('.auth-modal').remove();
                setTimeout(() => location.reload(), 1500);
            }
        });
    }
    
    // 유틸리티 메서드
    mockLoginAPI(email, password) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve({
                    success: true,
                    user: {
                        id: Date.now(),
                        email: email,
                        name: email.split('@')[0],
                        role: 'user',
                        createdAt: new Date().toISOString()
                    },
                    token: 'mock_jwt_token_' + Date.now(),
                    message: '로그인 성공'
                });
            }, 1000);
        });
    }
    
    mockSignupAPI(name, email, password) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve({
                    success: true,
                    user: {
                        id: Date.now(),
                        email: email,
                        name: name,
                        role: 'user',
                        createdAt: new Date().toISOString()
                    },
                    token: 'mock_jwt_token_' + Date.now(),
                    message: '회원가입 성공'
                });
            }, 1000);
        });
    }
    
    showToast(message, type = 'info') {
        // 간단한 토스트 메시지
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 24px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            border-radius: 8px;
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
    
    isAuthenticated() {
        return !!this.getUser();
    }
}

// 글로벌 인스턴스 생성
window.timelinkAuth = new TimelinkAuth();

// 글로벌 헬퍼 함수들
window.toggleUserMenu = function() {
    const dropdown = document.getElementById('userDropdown');
    if (dropdown) {
        dropdown.classList.toggle('show');
    }
};

// 드롭다운 닫기
document.addEventListener('click', (e) => {
    if (!e.target.closest('.user-menu-container')) {
        const dropdowns = document.querySelectorAll('.user-dropdown-menu');
        dropdowns.forEach(dropdown => {
            dropdown.classList.remove('show');
        });
    }
});

// CSS 스타일 추가
const authStyles = `
.auth-logged-in {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.tl-balance-display {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: linear-gradient(135deg, #FFD166, #FFB347);
    border-radius: 10px;
    color: #0A0F2B;
    font-weight: bold;
    font-size: 0.9rem;
}

.user-menu-container {
    position: relative;
}

.user-profile {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.5rem 1rem;
    background: rgba(255,255,255,0.05);
    border-radius: 10px;
    cursor: pointer;
    transition: background 0.2s;
}

.user-profile:hover {
    background: rgba(255,255,255,0.1);
}

.user-avatar {
    width: 36px;
    height: 36px;
    background: linear-gradient(135deg, #1E90FF, #4169E1);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.user-avatar i {
    color: white;
    font-size: 0.9rem;
}

.user-name {
    color: white;
    font-weight: 500;
    font-size: 0.9rem;
}

.user-dropdown-menu {
    position: absolute;
    top: 100%;
    right: 0;
    width: 220px;
    background: #1a1f37;
    border-radius: 10px;
    padding: 0.5rem;
    margin-top: 0.5rem;
    box-shadow: 0 10px 25px rgba(0,0,0,0.3);
    display: none;
    z-index: 1000;
}

.user-dropdown-menu.show {
    display: block;
}

.dropdown-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    color: #cbd5e1;
    text-decoration: none;
    border-radius: 6px;
    transition: all 0.2s;
}

.dropdown-item:hover {
    background: rgba(255,255,255,0.05);
    color: white;
}

.dropdown-item i {
    width: 20px;
    color: #94a3b8;
}

.dropdown-divider {
    height: 1px;
    background: rgba(255,255,255,0.1);
    margin: 0.5rem 0;
}

.logout-btn {
    background: transparent;
    border: none;
    width: 100%;
    text-align: left;
    cursor: pointer;
    color: #ef4444 !important;
}

.logout-btn i {
    color: #ef4444 !important;
}

.auth-buttons {
    display: flex;
    gap: 0.75rem;
    align-items: center;
}

.btn {
    padding: 0.5rem 1.25rem;
    border-radius: 8px;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    border: none;
    font-size: 0.9rem;
    transition: all 0.2s;
}

.btn-outline {
    background: transparent;
    border: 1px solid rgba(255,255,255,0.2);
    color: white;
}

.btn-outline:hover {
    background: rgba(255,255,255,0.05);
}

.btn-primary {
    background: linear-gradient(135deg, #1E90FF, #4169E1);
    color: white;
}

.btn-primary:hover {
    opacity: 0.9;
}

.btn-block {
    width: 100%;
    justify-content: center;
}

/* Auth Modal Styles */
.auth-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 9999;
}

.auth-modal-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    backdrop-filter: blur(5px);
}

.auth-modal-content {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #1a1f37;
    border-radius: 16px;
    padding: 2rem;
    width: 90%;
    max-width: 400px;
    box-shadow: 0 20px 40px rgba(0,0,0,0.3);
}

.auth-modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
}

.auth-modal-header h2 {
    color: white;
    margin: 0;
    font-size: 1.5rem;
}

.close-btn {
    background: none;
    border: none;
    color: #94a3b8;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
}

.close-btn:hover {
    background: rgba(255,255,255,0.05);
    color: white;
}

.form-group {
    margin-bottom: 1.25rem;
}

.form-group label {
    display: block;
    color: #cbd5e1;
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
}

.form-group input {
    width: 100%;
    padding: 0.75rem 1rem;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 8px;
    color: white;
    font-size: 0.9rem;
    transition: border 0.2s;
}

.form-group input:focus {
    outline: none;
    border-color: #3b82f6;
}

.bonus-notice {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem;
    background: linear-gradient(135deg, rgba(255, 209, 102, 0.1), rgba(255, 179, 71, 0.1));
    border-radius: 8px;
    margin-bottom: 1.25rem;
    color: #FFD166;
    font-size: 0.85rem;
}

.auth-modal-footer {
    text-align: center;
    margin-top: 1.5rem;
    padding-top: 1.5rem;
    border-top: 1px solid rgba(255,255,255,0.1);
    color: #94a3b8;
    font-size: 0.9rem;
}

.auth-modal-footer a {
    color: #3b82f6;
    text-decoration: none;
}

.auth-modal-footer a:hover {
    text-decoration: underline;
}

/* Toast Animation */
@keyframes slideIn {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

@keyframes slideOut {
    from {
        transform: translateX(0);
        opacity: 1;
    }
    to {
        transform: translateX(100%);
        opacity: 0;
    }
}

/* Active Nav Link */
.nav-link.active {
    color: #3b82f6 !important;
    font-weight: 600;
}

.nav-link.active i {
    color: #3b82f6 !important;
}
`;

// 스타일 추가
const styleSheet = document.createElement('style');
styleSheet.textContent = authStyles;
document.head.appendChild(styleSheet);
