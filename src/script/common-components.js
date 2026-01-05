// common-component.js - TIMELINK 통합 인증 시스템 (완전본 - 수정됨)
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
        // DOM 로드 완료 대기
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupEverything();
            });
        } else {
            this.setupEverything();
        }
    }
    
    setupEverything() {
        this.updateAuthButtons();
        this.highlightActiveNav();
        this.setupGlobalFunctions();
        this.checkAndGiveSignupBonus();
        this.bindAllButtons();
    }
    
    // 1. 인증 버튼 업데이트
    updateAuthButtons() {
        const authButtons = document.getElementById('authButtons');
        if (!authButtons) {
            console.log('authButtons 요소를 찾을 수 없음');
            return;
        }

        const user = this.getUser();
        const balance = this.getBalance();
        
        if (user) {
            // 로그인 상태
            authButtons.innerHTML = `
                <div style="display: flex; align-items: center; gap: 1rem;">
                    <div class="tl-balance" style="
                        display: flex; align-items: center; gap: 0.5rem;
                        padding: 0.5rem 1rem; background: linear-gradient(135deg, #FFD166, #FFB347);
                        border-radius: 10px; color: #0A0F2B; font-weight: bold;
                        cursor: default;
                    ">
                        <i class="fas fa-coins"></i>
                        <span>${parseInt(balance).toLocaleString()} TL</span>
                    </div>
                    <div class="user-profile" style="display: flex; align-items: center; gap: 0.75rem; padding: 0.5rem 1rem; 
                         background: rgba(255,255,255,0.05); border-radius: 10px; cursor: pointer;" 
                         onclick="window.timelinkAuth.logout()">
                        <div class="user-avatar" style="width: 36px; height: 36px; background: linear-gradient(135deg, #1E90FF, #4169E1);
                             border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                            <i class="fas fa-user" style="color: white;"></i>
                        </div>
                        <span class="user-name" style="color: white; font-weight: 500;">${user.name || user.email}</span>
                        <i class="fas fa-sign-out-alt" style="color: #94a3b8;"></i>
                    </div>
                </div>
            `;
        } else {
            // 비로그인 상태
            authButtons.innerHTML = `
                <div class="auth-buttons-container" style="display: flex; gap: 0.75rem; align-items: center;">
                    <button class="login-button" style="
                        padding: 0.5rem 1.25rem; border-radius: 8px; border: 1px solid rgba(255,255,255,0.2);
                        background: transparent; color: white; cursor: pointer; display: flex;
                        align-items: center; gap: 0.5rem; font-weight: 500;">
                        <i class="fas fa-sign-in-alt"></i> 로그인
                    </button>
                    <button class="signup-button" style="
                        padding: 0.5rem 1.25rem; border-radius: 8px; border: none;
                        background: linear-gradient(135deg, #1E90FF, #4169E1); color: white;
                        cursor: pointer; display: flex; align-items: center; gap: 0.5rem; font-weight: 500;">
                        <i class="fas fa-user-plus"></i> 회원가입
                    </button>
                </div>
            `;
        }
        
        // 새로 생성된 버튼에 이벤트 바인딩
        this.bindAuthButtons();
    }
    
    // 모든 버튼 이벤트 바인딩
    bindAllButtons() {
        this.bindAuthButtons();
        this.bindPageSignupButtons();
    }
    
    // 헤더 인증 버튼 이벤트 바인딩
    bindAuthButtons() {
        const authButtons = document.getElementById('authButtons');
        if (!authButtons) return;
        
        // 로그인 버튼
        const loginBtn = authButtons.querySelector('.login-button');
        if (loginBtn) {
            loginBtn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.showLoginModal();
            };
        }
        
        // 회원가입 버튼
        const signupBtn = authButtons.querySelector('.signup-button');
        if (signupBtn) {
            signupBtn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.showSignupModal();
            };
        }
    }
    
    // 페이지 내 모든 회원가입 버튼 이벤트 바인딩
    bindPageSignupButtons() {
        // 클래스로 찾기
        document.querySelectorAll('.signup-btn, .signup-button, .cta-button[onclick*="signup"], button[onclick*="Signup"], button[onclick*="signup"]').forEach(btn => {
            btn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.showSignupModal();
            };
        });
        
        // onclick 속성으로 찾기
        document.querySelectorAll('button[onclick*="showSignupModal"], button[onclick*="timelinkAuth.showSignupModal"]').forEach(btn => {
            const oldOnClick = btn.getAttribute('onclick');
            btn.removeAttribute('onclick');
            btn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.showSignupModal();
            };
        });
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
            this.showToast('로그인 처리 중...', 'info');
            
            const response = await this.mockLoginAPI(email, password);
            
            if (response.success) {
                this.saveUser(response.user);
                this.saveToken(response.token);
                
                this.updateAuthButtons();
                this.showToast('로그인 성공!', 'success');
                
                // 모달 닫기
                this.closeAuthModal();
                
                // 1.5초 후 페이지 새로고침
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
                
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
            this.showToast('회원가입 처리 중...', 'info');
            
            const response = await this.mockSignupAPI(name, email, password);
            
            if (response.success) {
                this.saveUser(response.user);
                this.saveToken(response.token);
                
                // 회원가입 보너스 지급
                this.addTransaction('회원가입 보너스', 10000, '신규 회원가입 보너스');
                this.updateBalance(10000);
                localStorage.setItem(this.bonusGivenKey, 'true');
                
                this.updateAuthButtons();
                this.showToast('🎉 회원가입 성공! 10,000 TL 보너스가 지급되었습니다.', 'success');
                
                // 모달 닫기
                this.closeAuthModal();
                
                // 1.5초 후 페이지 새로고침
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
                
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
        // 기존 모달 제거
        this.closeAuthModal();
        
        const modalHTML = `
            <div class="timelink-auth-modal-overlay" style="
                position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background: rgba(0,0,0,0.7); backdrop-filter: blur(5px);
                z-index: 9999; display: flex; align-items: center; justify-content: center;
            ">
                <div class="timelink-auth-modal-content" style="
                    background: #1a1f37; border-radius: 16px; padding: 2rem;
                    width: 90%; max-width: 400px; box-shadow: 0 20px 40px rgba(0,0,0,0.3);
                ">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem;">
                        <h2 style="color: white; margin: 0; font-size: 1.5rem;">
                            ${type === 'login' ? '로그인' : '회원가입'}
                        </h2>
                        <button class="close-auth-modal" style="
                            background: none; border: none; color: #94a3b8; font-size: 1.5rem;
                            cursor: pointer; padding: 0; width: 30px; height: 30px;
                            display: flex; align-items: center; justify-content: center;
                            border-radius: 50%;
                        ">&times;</button>
                    </div>
                    
                    <form id="timelink-${type}Form" style="display: flex; flex-direction: column; gap: 1.25rem;">
                        ${type === 'signup' ? `
                            <div>
                                <label style="display: block; color: #cbd5e1; margin-bottom: 0.5rem; font-size: 0.9rem;">이름</label>
                                <input type="text" id="timelink-${type}Name" placeholder="이름을 입력하세요" required style="
                                    width: 100%; padding: 0.75rem 1rem; background: rgba(255,255,255,0.05);
                                    border: 1px solid rgba(255,255,255,0.1); border-radius: 8px;
                                    color: white; font-size: 0.9rem;
                                ">
                            </div>
                        ` : ''}
                        
                        <div>
                            <label style="display: block; color: #cbd5e1; margin-bottom: 0.5rem; font-size: 0.9rem;">이메일</label>
                            <input type="email" id="timelink-${type}Email" placeholder="이메일을 입력하세요" required style="
                                width: 100%; padding: 0.75rem 1rem; background: rgba(255,255,255,0.05);
                                border: 1px solid rgba(255,255,255,0.1); border-radius: 8px;
                                color: white; font-size: 0.9rem;
                            ">
                        </div>
                        
                        <div>
                            <label style="display: block; color: #cbd5e1; margin-bottom: 0.5rem; font-size: 0.9rem;">비밀번호</label>
                            <input type="password" id="timelink-${type}Password" placeholder="비밀번호를 입력하세요" required style="
                                width: 100%; padding: 0.75rem 1rem; background: rgba(255,255,255,0.05);
                                border: 1px solid rgba(255,255,255,0.1); border-radius: 8px;
                                color: white; font-size: 0.9rem;
                            ">
                        </div>
                        
                        ${type === 'signup' ? `
                            <div>
                                <label style="display: block; color: #cbd5e1; margin-bottom: 0.5rem; font-size: 0.9rem;">비밀번호 확인</label>
                                <input type="password" id="timelink-confirmPassword" placeholder="비밀번호를 다시 입력하세요" required style="
                                    width: 100%; padding: 0.75rem 1rem; background: rgba(255,255,255,0.05);
                                    border: 1px solid rgba(255,255,255,0.1); border-radius: 8px;
                                    color: white; font-size: 0.9rem;
                                ">
                            </div>
                            <div class="signup-bonus" style="
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
                            <p>아직 계정이 없으신가요? <a href="#" class="switch-to-signup" style="color: #3b82f6; text-decoration: none;">회원가입</a></p>
                        </div>
                    ` : `
                        <div style="text-align: center; margin-top: 1.5rem; padding-top: 1.5rem;
                             border-top: 1px solid rgba(255,255,255,0.1); color: #94a3b8; font-size: 0.9rem;">
                            <p>이미 계정이 있으신가요? <a href="#" class="switch-to-login" style="color: #3b82f6; text-decoration: none;">로그인</a></p>
                        </div>
                    `}
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // 모달 이벤트 바인딩
        const overlay = document.querySelector('.timelink-auth-modal-overlay');
        const closeBtn = overlay.querySelector('.close-auth-modal');
        const form = document.getElementById(`timelink-${type}Form`);
        
        // 닫기 버튼
        closeBtn.onclick = () => this.closeAuthModal();
        
        // 배경 클릭 시 닫기
        overlay.onclick = (e) => {
            if (e.target === overlay) {
                this.closeAuthModal();
            }
        };
        
        // 폼 제출
        form.onsubmit = async (e) => {
            e.preventDefault();
            
            if (type === 'login') {
                const email = document.getElementById('timelink-loginEmail').value;
                const password = document.getElementById('timelink-loginPassword').value;
                await this.login(email, password);
            } else {
                const name = document.getElementById('timelink-signupName').value;
                const email = document.getElementById('timelink-signupEmail').value;
                const password = document.getElementById('timelink-signupPassword').value;
                const confirmPassword = document.getElementById('timelink-confirmPassword').value;
                
                if (password !== confirmPassword) {
                    this.showToast('비밀번호가 일치하지 않습니다.', 'error');
                    return;
                }
                
                await this.signup(name, email, password);
            }
        };
        
        // 로그인/회원가입 전환 링크
        if (type === 'login') {
            const switchLink = overlay.querySelector('.switch-to-signup');
            if (switchLink) {
                switchLink.onclick = (e) => {
                    e.preventDefault();
                    this.closeAuthModal();
                    setTimeout(() => this.showSignupModal(), 300);
                };
            }
        } else {
            const switchLink = overlay.querySelector('.switch-to-login');
            if (switchLink) {
                switchLink.onclick = (e) => {
                    e.preventDefault();
                    this.closeAuthModal();
                    setTimeout(() => this.showLoginModal(), 300);
                };
            }
        }
    }
    
    closeAuthModal() {
        const modal = document.querySelector('.timelink-auth-modal-overlay');
        if (modal) {
            modal.remove();
        }
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
        // 기존 토스트 제거
        document.querySelectorAll('.timelink-toast').forEach(toast => toast.remove());
        
        const toast = document.createElement('div');
        toast.className = 'timelink-toast';
        toast.innerHTML = `
            <div style="
                position: fixed; top: 20px; right: 20px; padding: 12px 24px;
                background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
                color: white; border-radius: 8px; z-index: 10001;
                animation: timelinkToastSlideIn 0.3s ease; box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                font-weight: 500;
            ">
                ${message}
            </div>
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'timelinkToastSlideOut 0.3s ease';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.remove();
                }
            }, 300);
        }, 3000);
        
        // 애니메이션 스타일 추가
        if (!document.querySelector('#timelink-toast-styles')) {
            const style = document.createElement('style');
            style.id = 'timelink-toast-styles';
            style.textContent = `
                @keyframes timelinkToastSlideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes timelinkToastSlideOut {
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

// 글로벌 함수 강제 설정 (중복 방지)
if (!window.timelinkGlobalFunctionsSet) {
    window.timelinkGlobalFunctionsSet = true;
    
    // common-component.js가 완전히 로드된 후 실행
    setTimeout(() => {
        if (window.timelinkAuth) {
            window.logout = () => window.timelinkAuth.logout();
            window.showLoginModal = () => window.timelinkAuth.showLoginModal();
            window.showSignupModal = () => window.timelinkAuth.showSignupModal();
            window.buyWithTL = (price, itemName) => window.timelinkAuth.buyItem(price, itemName);
            window.getCurrentUser = () => window.timelinkAuth.getUser();
            window.getTLBalance = () => window.timelinkAuth.getBalance();
            window.updateTLBalance = (amount) => window.timelinkAuth.updateBalance(amount);
            window.addTLBonus = (amount, reason) => window.timelinkAuth.addBonus(amount, reason);
            window.isLoggedIn = () => window.timelinkAuth.isAuthenticated();
            
            console.log('TIMELINK 글로벌 함수 설정 완료');
        }
    }, 100);
}

// 즉시 실행 함수로 모든 버튼 이벤트 바인딩
(function bindTimelinkButtons() {
    // 페이지 로드 시
    document.addEventListener('DOMContentLoaded', function() {
        // 약간의 지연 후 버튼 바인딩
        setTimeout(() => {
            if (window.timelinkAuth) {
                window.timelinkAuth.bindAllButtons();
            }
        }, 500);
    });
    
    // DOM 변경 감지 (동적 콘텐츠용)
    const observer = new MutationObserver(function(mutations) {
        if (window.timelinkAuth) {
            window.timelinkAuth.bindAllButtons();
        }
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
