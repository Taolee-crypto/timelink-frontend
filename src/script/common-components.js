// common-component.js - TIMELINK 통합 인증 시스템 (완전본)
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
            this.setupGlobalFunctions();
            this.checkAndGiveSignupBonus();
        });
    }
    
    // 1. 인증 버튼 업데이트
    updateAuthButtons() {
        const authButtons = document.getElementById('authButtons');
        if (!authButtons) return;

        const user = this.getUser();
        const balance = this.getBalance();
        
        if (user) {
            // 로그인 상태
            authButtons.innerHTML = `
                <div style="display: flex; align-items: center; gap: 1rem;">
                    <div style="
                        display: flex; align-items: center; gap: 0.5rem;
                        padding: 0.5rem 1rem; background: linear-gradient(135deg, #FFD166, #FFB347);
                        border-radius: 10px; color: #0A0F2B; font-weight: bold;
                    ">
                        <i class="fas fa-coins"></i>
                        <span>${parseInt(balance).toLocaleString()} TL</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 0.75rem; padding: 0.5rem 1rem; 
                         background: rgba(255,255,255,0.05); border-radius: 10px; cursor: pointer;" 
                         onclick="timelinkAuth.logout()">
                        <div style="width: 36px; height: 36px; background: linear-gradient(135deg, #1E90FF, #4169E1);
                             border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                            <i class="fas fa-user" style="color: white;"></i>
                        </div>
                        <span style="color: white; font-weight: 500;">${user.name || user.email}</span>
                        <i class="fas fa-sign-out-alt" style="color: #94a3b8;"></i>
                    </div>
                </div>
            `;
        } else {
            // 비로그인 상태
            authButtons.innerHTML = `
                <div style="display: flex; gap: 0.75rem; align-items: center;">
                    <button onclick="timelinkAuth.showLoginModal()" style="
                        padding: 0.5rem 1.25rem; border-radius: 8px; border: 1px solid rgba(255,255,255,0.2);
                        background: transparent; color: white; cursor: pointer; display: flex;
                        align-items: center; gap: 0.5rem; font-weight: 500;">
                        <i class="fas fa-sign-in-alt"></i> 로그인
                    </button>
                    <button onclick="timelinkAuth.showSignupModal()" style="
                        padding: 0.5rem 1.25rem; border-radius: 8px; border: none;
                        background: linear-gradient(135deg, #1E90FF, #4169E1); color: white;
                        cursor: pointer; display: flex; align-items: center; gap: 0.5rem; font-weight: 500;">
                        <i class="fas fa-user-plus"></i> 회원가입
                    </button>
                </div>
            `;
        }
    }
    
    // 2. 네비게이션 하이라이트
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
    
    // 3. 회원가입 보너스 확인
    checkAndGiveSignupBonus() {
        const user = this.getUser();
        const bonusGiven = localStorage.getItem(this.bonusGivenKey);
        
        if (user && !bonusGiven) {
            // 회원가입 보너스 10,000 TL 지급
            this.addTransaction('회원가입 보너스', 10000, '신규 회원가입 보너스');
            this.updateBalance(10000);
            localStorage.setItem(this.bonusGivenKey, 'true');
            
            // 페이지에 환영 메시지 표시
            this.showToast('🎉 회원가입을 축하합니다! 10,000 TL 보너스가 지급되었습니다.', 'success');
        }
    }
    
    // 4. 글로벌 함수 설정
    setupGlobalFunctions() {
        // 글로벌 함수로 노출
        window.logout = () => this.logout();
        window.showLoginModal = () => this.showLoginModal();
        window.showSignupModal = () => this.showSignupModal();
        window.buyWithTL = (price, itemName) => this.buyItem(price, itemName);
        window.getCurrentUser = () => this.getUser();
        window.getTLBalance = () => this.getBalance();
        window.updateTLBalance = (amount) => this.updateBalance(amount);
        window.addTLBonus = (amount, reason) => this.addBonus(amount, reason);
        window.isLoggedIn = () => this.isAuthenticated();
    }
    
    // 5. 사용자 정보 관리
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
    
    // 6. TL 잔액 관리
    getBalance() {
        try {
            const balance = localStorage.getItem(this.balanceKey);
            return balance ? parseInt(balance) : 0;
        } catch (error) {
            return 0;
        }
    }
    
    updateBalance(amount) {
        const currentBalance = this.getBalance();
        const newBalance = currentBalance + amount;
        localStorage.setItem(this.balanceKey, newBalance.toString());
        
        // 거래내역 저장
        const type = amount >= 0 ? '입금' : '출금';
        this.addTransaction(type, amount);
        
        // UI 업데이트
        this.updateAuthButtons();
        
        return newBalance;
    }
    
    // 7. 아이템 구매 함수 (모든 페이지에서 사용)
    buyItem(price, itemName) {
        if (!this.isAuthenticated()) {
            this.showToast('로그인이 필요합니다!', 'error');
            this.showLoginModal();
            return false;
        }
        
        const balance = this.getBalance();
        if (balance >= price) {
            this.updateBalance(-price);
            this.showToast(`${itemName} 구매 완료! ${price.toLocaleString()} TL 차감`, 'success');
            return true;
        } else {
            this.showToast(`TL 잔액이 부족합니다!\n필요: ${price.toLocaleString()} TL\n보유: ${balance.toLocaleString()} TL`, 'error');
            return false;
        }
    }
    
    // 8. 보너스 추가
    addBonus(amount, reason = '보너스') {
        if (this.isAuthenticated()) {
            this.updateBalance(amount);
            this.addTransaction(reason, amount);
            this.showToast(`${reason}: ${amount.toLocaleString()} TL 추가!`, 'success');
            return true;
        }
        return false;
    }
    
    // 9. 거래내역 관리
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
    
    // 10. 인증 관련 메서드
    async login(email, password) {
        try {
            const response = await this.mockLoginAPI(email, password);
            
            if (response.success) {
                this.saveUser(response.user);
                this.saveToken(response.token);
                
                this.updateAuthButtons();
                this.showToast('로그인 성공!', 'success');
                
                // 모달 닫기
                this.closeAuthModal();
                
                return true;
            } else {
                this.showToast(response.message, 'error');
                return false;
            }
        } catch (error) {
            this.showToast('로그인 중 오류가 발생했습니다.', 'error');
            return false;
        }
    }
    
    async signup(name, email, password) {
        try {
            const response = await this.mockSignupAPI(name, email, password);
            
            if (response.success) {
                this.saveUser(response.user);
                this.saveToken(response.token);
                
                this.updateAuthButtons();
                this.showToast('회원가입 성공!', 'success');
                
                // 모달 닫기
                this.closeAuthModal();
                
                return true;
            } else {
                this.showToast(response.message, 'error');
                return false;
            }
        } catch (error) {
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
    
    isAuthenticated() {
        return !!this.getUser();
    }
    
    // 11. 모달 관련
    showLoginModal() {
        this.showAuthModal('login');
    }
    
    showSignupModal() {
        this.showAuthModal('signup');
    }
    
    showAuthModal(type) {
        const modalHTML = `
            <div class="auth-modal-overlay" style="
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background: rgba(0,0,0,0.7); backdrop-filter: blur(5px);
                z-index: 9998; display: flex; align-items: center; justify-content: center;
            ">
                <div class="auth-modal-content" style="
                    background: #1a1f37; border-radius: 16px; padding: 2rem;
                    width: 90%; max-width: 400px; box-shadow: 0 20px 40px rgba(0,0,0,0.3);
                ">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                        <h2 style="color: white; margin: 0; font-size: 1.5rem;">
                            ${type === 'login' ? '로그인' : '회원가입'}
                        </h2>
                        <button onclick="this.closest('.auth-modal-overlay').remove()" style="
                            background: none; border: none; color: #94a3b8; font-size: 1.5rem;
                            cursor: pointer; padding: 0; width: 30px; height: 30px;
                            display: flex; align-items: center; justify-content: center;
                            border-radius: 50%;
                        ">&times;</button>
                    </div>
                    
                    <form id="${type}Form" style="display: flex; flex-direction: column; gap: 1.25rem;">
                        ${type === 'signup' ? `
                            <div>
                                <label style="display: block; color: #cbd5e1; margin-bottom: 0.5rem; font-size: 0.9rem;">이름</label>
                                <input type="text" id="${type}Name" placeholder="이름을 입력하세요" required style="
                                    width: 100%; padding: 0.75rem 1rem; background: rgba(255,255,255,0.05);
                                    border: 1px solid rgba(255,255,255,0.1); border-radius: 8px;
                                    color: white; font-size: 0.9rem;
                                ">
                            </div>
                        ` : ''}
                        
                        <div>
                            <label style="display: block; color: #cbd5e1; margin-bottom: 0.5rem; font-size: 0.9rem;">이메일</label>
                            <input type="email" id="${type}Email" placeholder="이메일을 입력하세요" required style="
                                width: 100%; padding: 0.75rem 1rem; background: rgba(255,255,255,0.05);
                                border: 1px solid rgba(255,255,255,0.1); border-radius: 8px;
                                color: white; font-size: 0.9rem;
                            ">
                        </div>
                        
                        <div>
                            <label style="display: block; color: #cbd5e1; margin-bottom: 0.5rem; font-size: 0.9rem;">비밀번호</label>
                            <input type="password" id="${type}Password" placeholder="비밀번호를 입력하세요" required style="
                                width: 100%; padding: 0.75rem 1rem; background: rgba(255,255,255,0.05);
                                border: 1px solid rgba(255,255,255,0.1); border-radius: 8px;
                                color: white; font-size: 0.9rem;
                            ">
                        </div>
                        
                        ${type === 'signup' ? `
                            <div>
                                <label style="display: block; color: #cbd5e1; margin-bottom: 0.5rem; font-size: 0.9rem;">비밀번호 확인</label>
                                <input type="password" id="confirmPassword" placeholder="비밀번호를 다시 입력하세요" required style="
                                    width: 100%; padding: 0.75rem 1rem; background: rgba(255,255,255,0.05);
                                    border: 1px solid rgba(255,255,255,0.1); border-radius: 8px;
                                    color: white; font-size: 0.9rem;
                                ">
                            </div>
                            <div style="
                                display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem;
                                background: linear-gradient(135deg, rgba(255, 209, 102, 0.1), rgba(255, 179, 71, 0.1));
                                border-radius: 8px; margin-bottom: 1.25rem; color: #FFD166;
                                font-size: 0.85rem;
                            ">
                                <i class="fas fa-gift"></i>
                                <span>회원가입 시 10,000 TL 보너스 지급!</span>
                            </div>
                        ` : ''}
                        
                        <button type="submit" style="
                            padding: 0.75rem; background: linear-gradient(135deg, #1E90FF, #4169E1);
                            color: white; border: none; border-radius: 8px; font-weight: 500;
                            cursor: pointer; font-size: 1rem;
                        ">
                            ${type === 'login' ? '로그인' : '회원가입'}
                        </button>
                    </form>
                    
                    ${type === 'login' ? `
                        <div style="text-align: center; margin-top: 1.5rem; padding-top: 1.5rem;
                             border-top: 1px solid rgba(255,255,255,0.1); color: #94a3b8; font-size: 0.9rem;">
                            <p>아직 계정이 없으신가요? <a href="#" onclick="
                                document.querySelector('.auth-modal-overlay').remove();
                                timelinkAuth.showSignupModal();
                            " style="color: #3b82f6; text-decoration: none;">회원가입</a></p>
                        </div>
                    ` : `
                        <div style="text-align: center; margin-top: 1.5rem; padding-top: 1.5rem;
                             border-top: 1px solid rgba(255,255,255,0.1); color: #94a3b8; font-size: 0.9rem;">
                            <p>이미 계정이 있으신가요? <a href="#" onclick="
                                document.querySelector('.auth-modal-overlay').remove();
                                timelinkAuth.showLoginModal();
                            " style="color: #3b82f6; text-decoration: none;">로그인</a></p>
                        </div>
                    `}
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
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
            
            // 성공 시 페이지 새로고침
            if (this.isAuthenticated()) {
                setTimeout(() => location.reload(), 1500);
            }
        });
    }
    
    closeAuthModal() {
        const modal = document.querySelector('.auth-modal-overlay');
        if (modal) modal.remove();
    }
    
    // 12. 모의 API
    async mockLoginAPI(email, password) {
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
    
    async mockSignupAPI(name, email, password) {
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
    
    // 13. 토스트 메시지
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = 'timelink-toast';
        toast.innerHTML = `
            <div style="
                position: fixed; top: 20px; right: 20px; padding: 12px 24px;
                background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
                color: white; border-radius: 8px; z-index: 10000;
                animation: toastSlideIn 0.3s ease; box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            ">
                ${message}
            </div>
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'toastSlideOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
        
        // 애니메이션 스타일 추가
        if (!document.querySelector('#toast-styles')) {
            const style = document.createElement('style');
            style.id = 'toast-styles';
            style.textContent = `
                @keyframes toastSlideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes toastSlideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }
}

// 글로벌 인스턴스 생성
window.timelinkAuth = new TimelinkAuth();
