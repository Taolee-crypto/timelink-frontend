// auth.js - TimeLink 6자리 인증번호 시스템
const API_BASE_URL = 'https://timelink-backend.timelink-api.workers.dev';

class AuthService {
    constructor() {
        this.initEventListeners();
        this.checkRedirects();
    }
    
    initEventListeners() {
        // 로그인 폼
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }
        
        // 회원가입 폼
        const signupForm = document.getElementById('signupForm');
        if (signupForm) {
            signupForm.addEventListener('submit', (e) => this.handleSignup(e));
        }
        
        // 인증번호 확인 폼
        const verifyForm = document.getElementById('verifyForm');
        if (verifyForm) {
            verifyForm.addEventListener('submit', (e) => this.handleVerify(e));
        }
        
        // 로그아웃 버튼들
        document.querySelectorAll('.logout-btn, [onclick*="logout"]').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleLogout(e));
        });
    }
    
    checkRedirects() {
        const currentPath = window.location.pathname;
        
        // 이미 인증된 사용자가 로그인/회원가입 페이지에 접근하면 대시보드로
        if ((currentPath.includes('login.html') || 
             currentPath.includes('signup.html') || 
             currentPath.includes('verify.html')) && 
            this.isAuthenticated()) {
            window.location.href = 'dashboard.html';
        }
        
        // 인증되지 않은 사용자가 대시보드 접근하면 로그인으로
        if (currentPath.includes('dashboard.html') && !this.isAuthenticated()) {
            window.location.href = 'login.html';
        }
    }
    
    // 회원가입 처리
    async handleSignup(event) {
        event.preventDefault();
        
        const form = event.target;
        const email = form.querySelector('#email').value;
        const password = form.querySelector('#password').value;
        const confirmPassword = form.querySelector('#confirmPassword')?.value;
        
        // 유효성 검사
        if (!this.validateEmail(email)) {
            this.showError('유효한 이메일을 입력해주세요.');
            return;
        }
        
        if (password.length < 6) {
            this.showError('비밀번호는 최소 6자 이상이어야 합니다.');
            return;
        }
        
        if (confirmPassword && password !== confirmPassword) {
            this.showError('비밀번호가 일치하지 않습니다.');
            return;
        }
        
        try {
            this.showLoading('회원가입 중...');
            
            const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            
            const result = await response.json();
            
            if (response.ok) {
                // 이메일 저장하고 인증번호 페이지로
                localStorage.setItem('pending_email', email);
                localStorage.setItem('pending_type', 'signup');
                
                this.showSuccess('인증번호가 이메일로 발송되었습니다.');
                
                setTimeout(() => {
                    window.location.href = 'verify.html';
                }, 1500);
                
            } else {
                this.showError(result.message || '회원가입에 실패했습니다.');
            }
            
        } catch (error) {
            console.error('회원가입 오류:', error);
            this.showError('서버 연결에 실패했습니다. 다시 시도해주세요.');
        } finally {
            this.hideLoading();
        }
    }
    
    // 로그인 처리
    async handleLogin(event) {
        event.preventDefault();
        
        const form = event.target;
        const email = form.querySelector('#loginEmail').value;
        const password = form.querySelector('#loginPassword').value;
        const rememberMe = form.querySelector('#rememberMe')?.checked;
        
        if (!this.validateEmail(email)) {
            this.showError('유효한 이메일을 입력해주세요.');
            return;
        }
        
        try {
            this.showLoading('로그인 중...');
            
            const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            
            const result = await response.json();
            
            if (response.ok) {
                // 이메일 저장하고 인증번호 페이지로
                localStorage.setItem('pending_email', email);
                localStorage.setItem('pending_type', 'login');
                
                if (rememberMe) {
                    localStorage.setItem('saved_email', email);
                }
                
                this.showSuccess('인증번호가 이메일로 발송되었습니다.');
                
                setTimeout(() => {
                    window.location.href = 'verify.html';
                }, 1500);
                
            } else {
                this.showError(result.message || '로그인에 실패했습니다.');
            }
            
        } catch (error) {
            console.error('로그인 오류:', error);
            this.showError('서버 연결에 실패했습니다.');
        } finally {
            this.hideLoading();
        }
    }
    
    // 인증번호 확인 처리
    async handleVerify(event) {
        event.preventDefault();
        
        const form = event.target;
        const code = form.querySelector('#authCode').value;
        const email = localStorage.getItem('pending_email');
        
        if (!email) {
            this.showError('이메일 정보를 찾을 수 없습니다.');
            setTimeout(() => window.location.href = 'login.html', 2000);
            return;
        }
        
        if (!code || code.length !== 6 || !/^\d+$/.test(code)) {
            this.showError('6자리 숫자 인증번호를 입력해주세요.');
            return;
        }
        
        try {
            this.showLoading('인증번호 확인 중...');
            
            const response = await fetch(`${API_BASE_URL}/api/auth/verify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code })
            });
            
            const result = await response.json();
            
            if (response.ok) {
                // 인증 성공
                localStorage.setItem('auth_token', result.token || 'verified');
                localStorage.setItem('user_email', email);
                localStorage.setItem('verification_status', 'verified');
                
                // 기본 사용자 데이터 생성
                const userData = {
                    name: email.split('@')[0],
                    email: email,
                    balance: 10000,
                    role: 'user',
                    verified: true,
                    created_at: new Date().toISOString()
                };
                
                localStorage.setItem('user_data', JSON.stringify(userData));
                
                // 임시 데이터 정리
                localStorage.removeItem('pending_email');
                localStorage.removeItem('pending_type');
                
                this.showSuccess('인증 성공! 대시보드로 이동합니다.');
                
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1500);
                
            } else {
                this.showError(result.message || '인증번호가 일치하지 않습니다.');
            }
            
        } catch (error) {
            console.error('인증 오류:', error);
            
            // 개발 모드: 테스트용 가짜 인증
            if (code === '123456') {
                console.log('개발 모드: 테스트 인증 성공');
                
                localStorage.setItem('auth_token', 'dev_verified');
                localStorage.setItem('user_email', email);
                localStorage.setItem('verification_status', 'verified');
                
                const userData = {
                    name: email.split('@')[0],
                    email: email,
                    balance: 10000,
                    role: 'user',
                    verified: true,
                    created_at: new Date().toISOString()
                };
                
                localStorage.setItem('user_data', JSON.stringify(userData));
                localStorage.removeItem('pending_email');
                localStorage.removeItem('pending_type');
                
                this.showSuccess('인증 성공! (개발 모드)');
                
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1000);
            } else {
                this.showError('인증 서버에 연결할 수 없습니다.');
            }
        } finally {
            this.hideLoading();
        }
    }
    
    // 로그아웃 처리
    handleLogout(event) {
        if (event) event.preventDefault();
        
        // 모든 인증 관련 데이터 정리
        const keysToRemove = [
            'auth_token',
            'user_email',
            'user_data',
            'verification_status',
            'pending_email',
            'pending_type',
            'saved_email'
        ];
        
        keysToRemove.forEach(key => localStorage.removeItem(key));
        
        // 로그인 페이지로 이동
        window.location.href = 'login.html';
    }
    
    // 인증 상태 확인
    isAuthenticated() {
        const token = localStorage.getItem('auth_token');
        const status = localStorage.getItem('verification_status');
        return (token || status === 'verified') && localStorage.getItem('user_email');
    }
    
    // 현재 사용자 정보
    getCurrentUser() {
        try {
            const data = localStorage.getItem('user_data');
            return data ? JSON.parse(data) : null;
        } catch {
            return null;
        }
    }
    
    // 이메일 유효성 검사
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    // UI 헬퍼 함수들
    showLoading(message = '처리 중...') {
        let loader = document.getElementById('auth-loader');
        if (!loader) {
            loader = document.createElement('div');
            loader.id = 'auth-loader';
            loader.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                z-index: 9999;
                color: white;
            `;
            document.body.appendChild(loader);
        }
        
        loader.innerHTML = `
            <div class="spinner-border text-primary mb-3" style="width: 3rem; height: 3rem;"></div>
            <h5>${message}</h5>
        `;
        loader.style.display = 'flex';
    }
    
    hideLoading() {
        const loader = document.getElementById('auth-loader');
        if (loader) {
            loader.style.display = 'none';
        }
    }
    
    showError(message) {
        this.showAlert('danger', message);
    }
    
    showSuccess(message) {
        this.showAlert('success', message);
    }
    
    showAlert(type, message) {
        // 기존 알림 제거
        const oldAlert = document.querySelector('.auth-alert');
        if (oldAlert) oldAlert.remove();
        
        const alertEl = document.createElement('div');
        alertEl.className = `alert alert-${type} auth-alert alert-dismissible fade show`;
        alertEl.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            min-width: 300px;
            max-width: 400px;
        `;
        
        alertEl.innerHTML = `
            <div class="d-flex align-items-center">
                <i class="bi ${type === 'success' ? 'bi-check-circle' : 'bi-exclamation-triangle'} me-2"></i>
                <div>${message}</div>
                <button type="button" class="btn-close ms-auto" data-bs-dismiss="alert"></button>
            </div>
        `;
        
        document.body.appendChild(alertEl);
        
        // 5초 후 자동 제거
        setTimeout(() => {
            if (alertEl.parentNode) {
                alertEl.remove();
            }
        }, 5000);
    }
}

// 전역 인스턴스 생성
document.addEventListener('DOMContentLoaded', () => {
    window.auth = new AuthService();
    
    // 저장된 이메일이 있으면 로그인 폼에 채우기
    const savedEmail = localStorage.getItem('saved_email');
    if (savedEmail) {
        const emailInput = document.getElementById('loginEmail');
        if (emailInput) {
            emailInput.value = savedEmail;
            const rememberCheck = document.getElementById('rememberMe');
            if (rememberCheck) rememberCheck.checked = true;
        }
    }
});
