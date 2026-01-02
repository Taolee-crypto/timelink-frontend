/**
 * TIMELINK 인증 모듈
 * 로그인 및 회원가입 페이지에 특화된 기능을 제공합니다.
 */

// 전역 상태 메시지 표시 함수
function showStatus(elementId, message, type) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    element.textContent = message;
    element.className = 'status-message';
    element.classList.add('status-' + type);
    
    setTimeout(() => {
        if (element.textContent === message) {
            element.className = 'status-message';
            element.textContent = '';
        }
    }, 5000);
}

// 이메일 유효성 검사
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// 비밀번호 유효성 검사
function isValidPassword(password) {
    return password.length >= 8;
}

// 데모 데이터 초기화
function initializeDemoData() {
    // 데모 사용자가 없으면 생성
    if (!localStorage.getItem('tl_user')) {
        const demoUser = {
            id: 'demo_user_001',
            name: '데모 사용자',
            email: 'demo@timelink.digital',
            nickname: 'DemoCreator',
            balance: 5000,
            joinedAt: new Date().toISOString(),
            verified: true,
            type: 'creator'
        };
        
        localStorage.setItem('tl_user', JSON.stringify(demoUser));
        localStorage.setItem('tl_token', 'demo_token_' + Date.now());
    }
}

// 로그인 페이지 초기화
function initLoginPage() {
    const loginForm = document.getElementById('loginForm');
    const demoLoginBtn = document.getElementById('demoLoginBtn');
    
    if (!loginForm) return;
    
    // 데모 데이터 초기화
    initializeDemoData();
    
    // 이미 로그인된 사용자 체크
    const token = localStorage.getItem('tl_token');
    const urlParams = new URLSearchParams(window.location.search);
    const logoutParam = urlParams.get('logout');
    
    if (token && logoutParam !== 'true') {
        showStatus('loginStatus', '이미 로그인되어 있습니다. 홈페이지로 이동합니다.', 'info');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }
    
    // 로그인 폼 제출 이벤트
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email')?.value.trim() || '';
        const password = document.getElementById('password')?.value || '';
        const rememberMe = document.getElementById('rememberMe')?.checked || false;
        const loginSubmitBtn = document.getElementById('loginSubmitBtn');
        
        // 입력 검증
        if (!email || !password) {
            showStatus('loginStatus', '이메일과 비밀번호를 입력해주세요.', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showStatus('loginStatus', '유효한 이메일 주소를 입력해주세요.', 'error');
            return;
        }
        
        // 로그인 버튼 비활성화
        if (loginSubmitBtn) {
            loginSubmitBtn.disabled = true;
            loginSubmitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 로그인 중...';
        }
        
        // AuthManager를 통한 로그인
        if (window.AuthManager && window.AuthManager.login) {
            try {
                const result = await window.AuthManager.login(email, password);
                
                if (result.success) {
                    showStatus('loginStatus', result.message, 'success');
                    
                    // 리다이렉트 URL 체크
                    const redirectUrl = sessionStorage.getItem('redirectAfterLogin');
                    setTimeout(() => {
                        if (redirectUrl) {
                            sessionStorage.removeItem('redirectAfterLogin');
                            window.location.href = redirectUrl;
                        } else {
                            window.location.href = 'index.html?login=success';
                        }
                    }, 1500);
                } else {
                    showStatus('loginStatus', result.error || '로그인에 실패했습니다.', 'error');
                    if (loginSubmitBtn) {
                        loginSubmitBtn.disabled = false;
                        loginSubmitBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> 로그인';
                    }
                }
            } catch (error) {
                showStatus('loginStatus', '로그인 처리 중 오류가 발생했습니다.', 'error');
                if (loginSubmitBtn) {
                    loginSubmitBtn.disabled = false;
                    loginSubmitBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> 로그인';
                }
            }
        } else {
            // AuthManager가 없는 경우 대체 로그인
            showStatus('loginStatus', '로그인 시스템을 불러오는 중...', 'info');
            
            setTimeout(() => {
                // 간단한 인증 검사
                if ((email === 'realuser@test.com' && password === 'realpass123') ||
                    (email === 'demo@timelink.digital' && password === 'demo1234')) {
                    
                    const user = {
                        id: Date.now().toString(),
                        email: email,
                        name: email.split('@')[0],
                        nickname: email.split('@')[0] + '_' + Math.floor(Math.random() * 1000),
                        balance: email.includes('demo') ? 5000 : 10000,
                        joinedAt: new Date().toISOString(),
                        verified: true,
                        type: 'creator'
                    };
                    
                    localStorage.setItem('tl_user', JSON.stringify(user));
                    localStorage.setItem('tl_token', 'direct_token_' + Date.now());
                    
                    showStatus('loginStatus', '로그인 성공!', 'success');
                    
                    setTimeout(() => {
                        window.location.href = 'index.html?login=success';
                    }, 1000);
                } else {
                    showStatus('loginStatus', '이메일 또는 비밀번호가 올바르지 않습니다.', 'error');
                    if (loginSubmitBtn) {
                        loginSubmitBtn.disabled = false;
                        loginSubmitBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> 로그인';
                    }
                }
            }, 1000);
        }
    });
    
    // 데모 로그인 버튼
    if (demoLoginBtn) {
        demoLoginBtn.addEventListener('click', function() {
            // 데모 계정 정보 자동 입력
            const emailInput = document.getElementById('email');
            const passwordInput = document.getElementById('password');
            const rememberCheckbox = document.getElementById('rememberMe');
            
            if (emailInput) emailInput.value = 'demo@timelink.digital';
            if (passwordInput) passwordInput.value = 'demo1234';
            if (rememberCheckbox) rememberCheckbox.checked = true;
            
            showStatus('loginStatus', '데모 계정으로 로그인합니다.', 'info');
        });
    }
    
    // 소셜 로그인 버튼 이벤트
    document.querySelectorAll('.social-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const platform = this.classList.contains('google') ? 'Google' :
                           this.classList.contains('facebook') ? 'Facebook' : 'Twitter';
            
            showStatus('loginStatus', `${platform} 로그인은 현재 준비 중입니다.`, 'info');
        });
    });
}

// 회원가입 페이지 초기화
function initSignupPage() {
    const signupForm = document.getElementById('signupForm');
    
    if (!signupForm) return;
    
    // 이미 로그인된 경우 홈으로 리다이렉트
    if (localStorage.getItem('tl_token')) {
        window.location.href = 'index.html';
        return;
    }
    
    // 회원가입 폼 제출 이벤트
    signupForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name')?.value.trim() || '';
        const email = document.getElementById('email')?.value.trim() || '';
        const nickname = document.getElementById('nickname')?.value.trim() || '';
        const password = document.getElementById('password')?.value || '';
        const confirmPassword = document.getElementById('confirmPassword')?.value || '';
        const termsAgreed = document.getElementById('termsAgreement')?.checked || false;
        const privacyAgreed = document.getElementById('privacyAgreement')?.checked || false;
        const marketingAgreed = document.getElementById('marketingAgreement')?.checked || false;
        const signupSubmitBtn = document.getElementById('signupSubmitBtn');
        
        // 유효성 검사
        if (!name || !email || !nickname || !password || !confirmPassword) {
            showStatus('signupStatus', '모든 필수 항목을 입력해주세요.', 'error');
            return;
        }
        
        if (!termsAgreed || !privacyAgreed) {
            showStatus('signupStatus', '필수 약관에 동의해주세요.', 'error');
            return;
        }
        
        if (password !== confirmPassword) {
            showStatus('signupStatus', '비밀번호가 일치하지 않습니다.', 'error');
            return;
        }
        
        if (!isValidPassword(password)) {
            showStatus('signupStatus', '비밀번호는 8자 이상이어야 합니다.', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showStatus('signupStatus', '올바른 이메일 형식을 입력해주세요.', 'error');
            return;
        }
        
        // 버튼 상태 변경
        if (signupSubmitBtn) {
            const originalText = signupSubmitBtn.innerHTML;
            signupSubmitBtn.disabled = true;
            signupSubmitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 처리 중...';
        }
        
        // AuthManager를 통한 회원가입
        if (window.AuthManager && window.AuthManager.signup) {
            try {
                const result = await window.AuthManager.signup({
                    name: name,
                    email: email,
                    nickname: nickname,
                    password: password,
                    marketingAgreed: marketingAgreed
                });
                
                if (result.success) {
                    showStatus('signupStatus', result.message, 'success');
                    
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 1500);
                } else {
                    showStatus('signupStatus', result.error || '회원가입에 실패했습니다.', 'error');
                    if (signupSubmitBtn) {
                        signupSubmitBtn.disabled = false;
                        signupSubmitBtn.innerHTML = '<i class="fas fa-user-plus"></i> 무료로 회원가입하기';
                    }
                }
            } catch (error) {
                showStatus('signupStatus', '회원가입 처리 중 오류가 발생했습니다.', 'error');
                if (signupSubmitBtn) {
                    signupSubmitBtn.disabled = false;
                    signupSubmitBtn.innerHTML = '<i class="fas fa-user-plus"></i> 무료로 회원가입하기';
                }
            }
        } else {
            // AuthManager가 없는 경우 대체 회원가입
            showStatus('signupStatus', '회원가입 처리 중...', 'info');
            
            setTimeout(() => {
                const user = {
                    id: Date.now().toString(),
                    name: name,
                    email: email,
                    nickname: nickname,
                    balance: 10000,
                    joinedAt: new Date().toISOString(),
                    verified: true,
                    type: 'creator',
                    marketingAgreed: marketingAgreed
                };
                
                localStorage.setItem('tl_user', JSON.stringify(user));
                localStorage.setItem('tl_token', 'signup_token_' + Date.now());
                
                showStatus('signupStatus', '회원가입이 완료되었습니다! 10,000 TL이 지급되었습니다.', 'success');
                
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
            }, 1000);
        }
    });
    
    // 이름 입력란에 포커스
    const nameInput = document.getElementById('name');
    if (nameInput) {
        nameInput.focus();
    }
}

// 현재 페이지에 맞는 초기화 함수 실행
document.addEventListener('DOMContentLoaded', function() {
    const currentPath = window.location.pathname;
    const currentPage = currentPath.split('/').pop();
    
    if (currentPage === 'login.html') {
        initLoginPage();
    } else if (currentPage === 'signup.html') {
        initSignupPage();
    }
    
    console.log('TIMELINK Auth Module Loaded');
});

// 공통 상태 메시지 스타일 추가
function addAuthStyles() {
    const styleId = 'timelink-auth-styles';
    if (document.getElementById(styleId)) return;
    
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
        .status-message {
            padding: 1rem;
            border-radius: 10px;
            margin-bottom: 1.5rem;
            display: none;
            animation: fadeIn 0.3s ease;
        }
        
        .status-success {
            background: rgba(255, 165, 0, 0.1);
            color: #FFA500;
            border: 1px solid rgba(255, 165, 0, 0.3);
            display: block;
        }
        
        .status-error {
            background: rgba(239, 68, 68, 0.1);
            color: #f44336;
            border: 1px solid rgba(239, 68, 68, 0.3);
            display: block;
        }
        
        .status-info {
            background: rgba(255, 107, 0, 0.1);
            color: #FF6B00;
            border: 1px solid rgba(255, 107, 0, 0.3);
            display: block;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    
    document.head.appendChild(style);
}

// 스타일 추가
addAuthStyles();
