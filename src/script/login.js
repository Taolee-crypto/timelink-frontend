/**
 * TIMELINK - 로그인/회원가입 기능
 * 이 파일은 로그인 페이지의 모든 기능을 처리합니다.
 */

// 전역 변수
let currentForm = 'login'; // 현재 활성화된 폼: 'login', 'signup', 'forgot', 'success'
let passwordStrength = 0;

// DOM이 로드되면 실행
document.addEventListener('DOMContentLoaded', function() {
    console.log('TIMELINK 로그인 페이지 로드됨');
    
    // 이벤트 리스너 설정
    setupEventListeners();
    
    // 개발 환경에서 테스트용 데이터 설정
    initializeTestData();
    
    // 로그인 상태 확인
    checkExistingLogin();
});

// 이벤트 리스너 설정
function setupEventListeners() {
    // 로그인 폼 제출
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // 회원가입 폼 제출
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
    
    // 비밀번호 찾기 폼 제출
    const forgotForm = document.getElementById('forgotForm');
    if (forgotForm) {
        forgotForm.addEventListener('submit', handleForgotPassword);
    }
    
    // ESC 키로 로그인 폼으로 돌아가기
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && currentForm !== 'login') {
            showLogin();
        }
    });
    
    // 뒤로가기 버튼
    const backButton = document.querySelector('.back-button');
    if (backButton) {
        backButton.addEventListener('click', function(e) {
            e.preventDefault();
            window.history.back();
        });
    }
}

// 개발 환경 테스트 데이터
function initializeTestData() {
    // 로컬호스트에서만 테스트 데이터 설정
    if (window.location.hostname === 'localhost' || window.location.hostname.includes('127.0.0.1')) {
        console.log('개발 환경: 테스트 데이터 설정');
        
        // 로그인 폼 테스트 데이터
        const loginEmail = document.getElementById('email');
        const loginPassword = document.getElementById('password');
        
        if (loginEmail) loginEmail.value = 'test@timelink.digital';
        if (loginPassword) loginPassword.value = 'Test1234!';
        
        // 회원가입 폼 테스트 데이터
        const signupName = document.getElementById('signupName');
        const signupEmail = document.getElementById('signupEmail');
        const signupPassword = document.getElementById('signupPassword');
        const confirmPassword = document.getElementById('confirmPassword');
        
        if (signupName) signupName.value = '김타임';
        if (signupEmail) signupEmail.value = 'newuser@timelink.digital';
        if (signupPassword) signupPassword.value = 'Test1234!';
        if (confirmPassword) confirmPassword.value = 'Test1234!';
        
        // 비밀번호 강도 업데이트
        checkPasswordStrength('Test1234!');
        checkPasswordMatch();
    }
}

// 기존 로그인 확인
function checkExistingLogin() {
    const isLoggedIn = localStorage.getItem('tl_loggedIn') === 'true';
    if (isLoggedIn) {
        // 이미 로그인된 경우 홈페이지로 리다이렉트
        showAlert('이미 로그인된 상태입니다. 홈페이지로 이동합니다.', 'info');
        setTimeout(() => {
            window.location.href = '../index.html';
        }, 1500);
    }
}

// 폼 전환 함수들
function showLogin() {
    currentForm = 'login';
    updateFormDisplay();
}

function showSignup() {
    currentForm = 'signup';
    updateFormDisplay();
}

function showForgotPassword() {
    currentForm = 'forgot';
    updateFormDisplay();
}

function showSuccess() {
    currentForm = 'success';
    updateFormDisplay();
}

// 폼 디스플레이 업데이트
function updateFormDisplay() {
    console.log(`폼 전환: ${currentForm}`);
    
    // 모든 탭 버튼 비활성화
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // 현재 폼에 맞는 탭 활성화
    if (currentForm === 'login') {
        const loginTab = document.querySelector('.tab-btn:first-child');
        if (loginTab) loginTab.classList.add('active');
    } else if (currentForm === 'signup') {
        const signupTab = document.querySelector('.tab-btn:last-child');
        if (signupTab) signupTab.classList.add('active');
    }
    
    // 모든 폼 컨테이너 숨기기
    document.querySelectorAll('.form-container').forEach(container => {
        container.classList.remove('active');
    });
    
    // 현재 폼 컨테이너 표시
    const currentContainer = document.getElementById(currentForm + 'Container');
    if (currentContainer) {
        currentContainer.classList.add('active');
    }
}

// 비밀번호 표시/숨기기 토글
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    if (!input) return;
    
    const toggleBtn = input.parentElement.querySelector('.toggle-password i');
    if (!toggleBtn) return;
    
    if (input.type === 'password') {
        input.type = 'text';
        toggleBtn.className = 'fas fa-eye-slash';
    } else {
        input.type = 'password';
        toggleBtn.className = 'fas fa-eye';
    }
}

// 비밀번호 강도 체크
function checkPasswordStrength(password) {
    if (!password) return;
    
    const strengthBar = document.getElementById('strengthBar');
    const strengthText = document.getElementById('strengthText');
    
    if (!strengthBar || !strengthText) return;
    
    let strength = 0;
    
    // 길이 체크 (최대 40점)
    if (password.length >= 8) strength += 20;
    if (password.length >= 12) strength += 20;
    
    // 복잡성 체크 (최대 60점)
    if (/[A-Z]/.test(password)) strength += 15; // 대문자
    if (/[a-z]/.test(password)) strength += 15; // 소문자
    if (/[0-9]/.test(password)) strength += 15; // 숫자
    if (/[^A-Za-z0-9]/.test(password)) strength += 15; // 특수문자
    
    // 최대 100점
    strength = Math.min(strength, 100);
    passwordStrength = strength;
    
    // 강도에 따른 색상 및 텍스트
    let color, text;
    
    if (strength < 30) {
        color = '#FF6B6B'; // 약함
        text = '매우 약함';
    } else if (strength < 50) {
        color = '#FFA726'; // 보통
        text = '약함';
    } else if (strength < 70) {
        color = '#FFD700'; // 보통
        text = '보통';
    } else if (strength < 90) {
        color = '#42A5F5'; // 강함
        text = '강함';
    } else {
        color = '#00D4AA'; // 매우 강함
        text = '매우 강함';
    }
    
    // UI 업데이트
    strengthBar.style.width = strength + '%';
    strengthBar.style.backgroundColor = color;
    strengthText.textContent = `비밀번호 강도: ${text} (${strength}점)`;
    strengthText.style.color = color;
}

// 비밀번호 일치 확인
function checkPasswordMatch() {
    const password = document.getElementById('signupPassword')?.value || '';
    const confirm = document.getElementById('confirmPassword')?.value || '';
    const matchDiv = document.getElementById('passwordMatch');
    
    if (!matchDiv) return;
    
    if (!confirm) {
        matchDiv.textContent = '';
        matchDiv.style.color = '';
        return;
    }
    
    if (password === confirm) {
        matchDiv.textContent = '✓ 비밀번호가 일치합니다';
        matchDiv.style.color = '#00D4AA';
    } else {
        matchDiv.textContent = '✗ 비밀번호가 일치하지 않습니다';
        matchDiv.style.color = '#FF6B6B';
    }
}

// 이메일 유효성 검사
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// 로그인 처리
async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('email')?.value.trim() || '';
    const password = document.getElementById('password')?.value || '';
    const rememberMe = document.getElementById('rememberMe')?.checked || false;
    
    // 유효성 검사
    if (!email || !password) {
        showAlert('이메일과 비밀번호를 모두 입력해주세요.', 'error');
        return;
    }
    
    if (!validateEmail(email)) {
        showAlert('올바른 이메일 형식을 입력해주세요.', 'error');
        return;
    }
    
    // 로딩 상태 시작
    const submitBtn = event.target.querySelector('button[type="submit"]');
    if (submitBtn) {
        startLoading(submitBtn, '로그인 중...');
    }
    
    try {
        // 실제 애플리케이션에서는 API 호출
        // const response = await fetch('/api/login', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ email, password })
        // });
        
        // 더미 응답 (2초 대기)
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // 더미 사용자 데이터
        const userData = {
            id: Date.now(),
            name: '김타임',
            email: email,
            balance: 10000,
            joinDate: new Date().toISOString(),
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(email)}&background=0066FF&color=fff`
        };
        
        // 로컬 스토리지에 저장
        localStorage.setItem('tl_loggedIn', 'true');
        localStorage.setItem('tl_user', JSON.stringify(userData));
        localStorage.setItem('tl_balance', '10000');
        
        if (rememberMe) {
            localStorage.setItem('tl_rememberEmail', email);
        }
        
        // 성공 메시지
        showAlert('로그인 성공! TIMELINK에 오신 것을 환영합니다.', 'success');
        
        // 홈페이지로 리디렉션
        setTimeout(() => {
            window.location.href = '../index.html';
        }, 1000);
        
    } catch (error) {
        console.error('로그인 오류:', error);
        showAlert('로그인 중 오류가 발생했습니다. 다시 시도해주세요.', 'error');
        
        // 로딩 상태 종료
        if (submitBtn) {
            stopLoading(submitBtn, '<i class="fas fa-sign-in-alt"></i> 로그인');
        }
    }
}

// 회원가입 처리
async function handleSignup(event) {
    event.preventDefault();
    
    const name = document.getElementById('signupName')?.value.trim() || '';
    const email = document.getElementById('signupEmail')?.value.trim() || '';
    const password = document.getElementById('signupPassword')?.value || '';
    const confirmPassword = document.getElementById('confirmPassword')?.value || '';
    const agreeTerms = document.getElementById('agreeTerms')?.checked || false;
    const agreeMarketing = document.getElementById('agreeMarketing')?.checked || false;
    
    // 유효성 검사
    if (!name || !email || !password || !confirmPassword) {
        showAlert('모든 필수 항목을 입력해주세요.', 'error');
        return;
    }
    
    if (!validateEmail(email)) {
        showAlert('올바른 이메일 형식을 입력해주세요.', 'error');
        return;
    }
    
    if (password.length < 8) {
        showAlert('비밀번호는 8자 이상이어야 합니다.', 'error');
        return;
    }
    
    if (passwordStrength < 50) {
        showAlert('비밀번호 강도가 너무 약합니다. 더 강력한 비밀번호를 사용해주세요.', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showAlert('비밀번호가 일치하지 않습니다.', 'error');
        return;
    }
    
    if (!agreeTerms) {
        showAlert('이용약관에 동의해주세요.', 'error');
        return;
    }
    
    // 로딩 상태 시작
    const submitBtn = event.target.querySelector('button[type="submit"]');
    if (submitBtn) {
        startLoading(submitBtn, '가입 중...');
    }
    
    try {
        // 실제 애플리케이션에서는 API 호출
        // const response = await fetch('/api/signup', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({ name, email, password, agreeMarketing })
        // });
        
        // 더미 응답 (2초 대기)
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // 더미 사용자 데이터
        const userData = {
            id: Date.now(),
            name: name,
            email: email,
            balance: 10000, // 가입 보너스
            joinDate: new Date().toISOString(),
            marketingAgree: agreeMarketing,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0066FF&color=fff`
        };
        
        // 로컬 스토리지에 저장
        localStorage.setItem('tl_loggedIn', 'true');
        localStorage.setItem('tl_user', JSON.stringify(userData));
        localStorage.setItem('tl_balance', '10000');
        localStorage.setItem('tl_newUser', 'true');
        
        // 성공 메시지 표시
        showSuccess();
        
        // 로딩 상태 종료
        if (submitBtn) {
            stopLoading(submitBtn, '<i class="fas fa-user-plus"></i> 회원가입');
        }
        
    } catch (error) {
        console.error('회원가입 오류:', error);
        showAlert('회원가입 중 오류가 발생했습니다. 다시 시도해주세요.', 'error');
        
        // 로딩 상태 종료
        if (submitBtn) {
            stopLoading(submitBtn, '<i class="fas fa-user-plus"></i> 회원가입');
        }
    }
}

// 비밀번호 찾기 처리
async function handleForgotPassword(event) {
    event.preventDefault();
    
    const email = document.getElementById('forgotEmail')?.value.trim() || '';
    
    if (!email) {
        showAlert('이메일을 입력해주세요.', 'error');
        return;
    }
    
    if (!validateEmail(email)) {
        showAlert('올바른 이메일 형식을 입력해주세요.', 'error');
        return;
    }
    
    // 로딩 상태 시작
    const submitBtn = event.target.querySelector('button[type="submit"]');
    if (submitBtn) {
        startLoading(submitBtn, '전송 중...');
    }
    
    try {
        // 더미 응답 (2초 대기)
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        showAlert(`비밀번호 재설정 링크가 ${email}로 전송되었습니다.`, 'success');
        
        // 2초 후 로그인 폼으로 전환
        setTimeout(() => {
            showLogin();
            
            // 로딩 상태 종료
            if (submitBtn) {
                stopLoading(submitBtn, '<i class="fas fa-paper-plane"></i> 재설정 링크 보내기');
            }
        }, 2000);
        
    } catch (error) {
        console.error('비밀번호 찾기 오류:', error);
        showAlert('요청 처리 중 오류가 발생했습니다. 다시 시도해주세요.', 'error');
        
        // 로딩 상태 종료
        if (submitBtn) {
            stopLoading(submitBtn, '<i class="fas fa-paper-plane"></i> 재설정 링크 보내기');
        }
    }
}

// Google 로그인
function loginWithGoogle() {
    showAlert('Google 로그인 기능은 현재 준비 중입니다.', 'info');
    // 실제 구현: Google OAuth 통합
}

// 홈페이지로 리디렉션
function redirectToHome() {
    showAlert('TIMELINK 홈페이지로 이동합니다.', 'success');
    setTimeout(() => {
        window.location.href = '../index.html';
    }, 1000);
}

// 로딩 상태 시작
function startLoading(button, text) {
    button.disabled = true;
    button.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${text}`;
    button.classList.add('loading');
}

// 로딩 상태 종료
function stopLoading(button, originalHTML) {
    button.disabled = false;
    button.innerHTML = originalHTML;
    button.classList.remove('loading');
}

// 알림 표시
function showAlert(message, type = 'info') {
    // 기존 알림 제거
    const existingAlert = document.querySelector('.custom-alert');
    if (existingAlert) {
        existingAlert.remove();
    }
    
    // 색상 설정
    let backgroundColor, color, icon;
    switch (type) {
        case 'success':
            backgroundColor = '#00D4AA';
            color = '#0A0F2B';
            icon = 'fa-check-circle';
            break;
        case 'error':
            backgroundColor = '#FF6B6B';
            color = '#FFFFFF';
            icon = 'fa-exclamation-circle';
            break;
        case 'warning':
            backgroundColor = '#FFD700';
            color = '#0A0F2B';
            icon = 'fa-exclamation-triangle';
            break;
        default:
            backgroundColor = '#0066FF';
            color = '#FFFFFF';
            icon = 'fa-info-circle';
    }
    
    // 알림 요소 생성
    const alertDiv = document.createElement('div');
    alertDiv.className = 'custom-alert';
    alertDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${backgroundColor};
        color: ${color};
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        gap: 0.75rem;
        z-index: 9999;
        animation: slideIn 0.3s ease;
        max-width: 400px;
        font-weight: 500;
    `;
    
    alertDiv.innerHTML = `
        <i class="fas ${icon}"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(alertDiv);
    
    // 3초 후 자동 제거
    setTimeout(() => {
        alertDiv.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.parentNode.removeChild(alertDiv);
            }
        }, 300);
    }, 3000);
}

// 애니메이션 CSS 추가
if (!document.querySelector('#alert-animations')) {
    const style = document.createElement('style');
    style.id = 'alert-animations';
    style.textContent = `
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
        
        .custom-alert {
            animation: slideIn 0.3s ease;
        }
    `;
    document.head.appendChild(style);
}

// 글로벌 함수 내보내기
window.showLogin = showLogin;
window.showSignup = showSignup;
window.showForgotPassword = showForgotPassword;
window.redirectToHome = redirectToHome;
window.togglePassword = togglePassword;
window.checkPasswordStrength = checkPasswordStrength;
window.checkPasswordMatch = checkPasswordMatch;
window.loginWithGoogle = loginWithGoogle;

console.log('TIMELINK 로그인 스크립트 로드 완료');
