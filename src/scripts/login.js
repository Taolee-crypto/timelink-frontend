// login.js - TIMELINK 로그인/회원가입 기능

// 현재 활성화된 폼 상태
let currentForm = 'login';

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    // 이벤트 리스너 설정
    setupEventListeners();
    
    // 로그인 폼 기본값 설정 (개발용)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        document.getElementById('email').value = 'test@timelink.digital';
        document.getElementById('password').value = 'Password123!';
        document.getElementById('signupEmail').value = 'newuser@timelink.digital';
        document.getElementById('signupPassword').value = 'Password123!';
    }
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
    
    // ESC 키로 뒤로가기
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && currentForm !== 'login') {
            showLogin();
        }
    });
}

// 폼 표시 전환
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
    // 탭 버튼 업데이트
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    if (currentForm === 'login') {
        document.querySelector('.tab-btn:first-child').classList.add('active');
    } else if (currentForm === 'signup') {
        document.querySelector('.tab-btn:last-child').classList.add('active');
    }
    
    // 폼 컨테이너 업데이트
    document.querySelectorAll('.form-container').forEach(container => {
        container.classList.remove('active');
    });
    
    document.getElementById(currentForm + 'Container').classList.add('active');
}

// 비밀번호 표시/숨기기 토글
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const toggleBtn = input.parentElement.querySelector('.toggle-password i');
    
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
    const strengthBar = document.getElementById('strengthBar');
    const strengthText = document.getElementById('strengthText');
    
    if (!strengthBar || !strengthText) return;
    
    let strength = 0;
    let color = '';
    let text = '';
    
    // 길이 체크
    if (password.length >= 8) strength += 25;
    if (password.length >= 12) strength += 25;
    
    // 복잡성 체크
    if (/[A-Z]/.test(password)) strength += 25; // 대문자
    if (/[0-9]/.test(password)) strength += 25; // 숫자
    if (/[^A-Za-z0-9]/.test(password)) strength += 25; // 특수문자
    
    // 최대 100으로 제한
    strength = Math.min(strength, 100);
    
    // 강도에 따른 색상 및 텍스트
    if (strength < 40) {
        color = '#FF6B6B'; // 약함
        text = '약함';
    } else if (strength < 70) {
        color = '#FFA726'; // 보통
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
    strengthText.textContent = `비밀번호 강도: ${text}`;
    strengthText.style.color = color;
}

// 비밀번호 일치 확인
function checkPasswordMatch() {
    const password = document.getElementById('signupPassword').value;
    const confirm = document.getElementById('confirmPassword').value;
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

// 로그인 처리
function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    
    // 간단한 유효성 검사
    if (!email || !password) {
        alert('이메일과 비밀번호를 모두 입력해주세요.');
        return;
    }
    
    if (!validateEmail(email)) {
        alert('올바른 이메일 형식을 입력해주세요.');
        return;
    }
    
    // 로딩 상태 표시
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 로그인 중...';
    submitBtn.disabled = true;
    
    // 실제 애플리케이션에서는 여기서 서버 API 호출
    setTimeout(() => {
        // 더미 사용자 데이터 (실제로는 서버에서 인증)
        const userData = {
            id: 1,
            name: '김타임',
            email: email,
            balance: 10000,
            joinDate: new Date().toISOString()
        };
        
        // localStorage에 로그인 정보 저장
        localStorage.setItem('tl_loggedIn', 'true');
        localStorage.setItem('tl_user', JSON.stringify(userData));
        localStorage.setItem('tl_balance', '10000');
        
        if (rememberMe) {
            localStorage.setItem('tl_rememberEmail', email);
        }
        
        // 로그인 성공 알림
        alert('로그인 성공! TIMELINK에 오신 것을 환영합니다.');
        
        // 홈페이지로 리디렉션
        window.location.href = 'index.html';
        
    }, 1500);
}

// 회원가입 처리
function handleSignup(event) {
    event.preventDefault();
    
    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const agreeTerms = document.getElementById('agreeTerms').checked;
    
    // 유효성 검사
    if (!name || !email || !password || !confirmPassword) {
        alert('모든 필수 항목을 입력해주세요.');
        return;
    }
    
    if (!validateEmail(email)) {
        alert('올바른 이메일 형식을 입력해주세요.');
        return;
    }
    
    if (password.length < 8) {
        alert('비밀번호는 8자 이상이어야 합니다.');
        return;
    }
    
    if (password !== confirmPassword) {
        alert('비밀번호가 일치하지 않습니다.');
        return;
    }
    
    if (!agreeTerms) {
        alert('이용약관에 동의해주세요.');
        return;
    }
    
    // 로딩 상태 표시
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 가입 중...';
    submitBtn.disabled = true;
    
    // 실제 애플리케이션에서는 여기서 서버 API 호출
    setTimeout(() => {
        // 더미 사용자 데이터 생성
        const userData = {
            id: Date.now(),
            name: name,
            email: email,
            balance: 10000, // 가입 보너스 10,000 TL
            joinDate: new Date().toISOString(),
            marketingAgree: document.getElementById('agreeMarketing').checked
        };
        
        // localStorage에 사용자 정보 저장
        localStorage.setItem('tl_loggedIn', 'true');
        localStorage.setItem('tl_user', JSON.stringify(userData));
        localStorage.setItem('tl_balance', '10000');
        localStorage.setItem('tl_newUser', 'true'); // 새 사용자 플래그
        
        // 성공 메시지 표시
        showSuccess();
        
        // 버튼 상태 복원
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        
    }, 2000);
}

// 비밀번호 찾기 처리
function handleForgotPassword(event) {
    event.preventDefault();
    
    const email = document.getElementById('forgotEmail').value.trim();
    
    if (!email) {
        alert('이메일을 입력해주세요.');
        return;
    }
    
    if (!validateEmail(email)) {
        alert('올바른 이메일 형식을 입력해주세요.');
        return;
    }
    
    // 로딩 상태 표시
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn
