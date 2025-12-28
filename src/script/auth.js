<script>
    // === 초기화 함수 ===
    function init() {
        setupLoginForm();
        checkAlreadyLoggedIn();
        console.log('🔐 로그인 페이지 초기화 완료');
    }

    // === 로그인 폼 설정 ===
    function setupLoginForm() {
        const loginForm = document.getElementById('loginForm');
        const loginSubmitBtn = document.getElementById('loginSubmitBtn');
        const demoLoginBtn = document.getElementById('demoLoginBtn');
        
        if (loginForm) {
            loginForm.addEventListener('submit', async function(e) {
                e.preventDefault();
                
                const email = document.getElementById('email').value.trim();
                const password = document.getElementById('password').value;
                const rememberMe = document.getElementById('rememberMe').checked;
                
                // 입력 검증
                if (!email || !password) {
                    showStatus('이메일과 비밀번호를 입력해주세요.', 'error', 'loginStatus');
                    return;
                }
                
                if (!isValidEmail(email)) {
                    showStatus('유효한 이메일 주소를 입력해주세요.', 'error', 'loginStatus');
                    return;
                }
                
                // 로그인 버튼 비활성화
                loginSubmitBtn.disabled = true;
                loginSubmitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 로그인 중...';
                
                // 실제 API 로그인
                if (typeof window.auth !== 'undefined' && window.auth.loginUser) {
                    const result = await window.auth.loginUser(email, password, rememberMe);
                    
                    if (result.success) {
                        showStatus(result.message, 'success', 'loginStatus');
                        
                        // handleLoginSuccess 호출
                        if (typeof window.handleLoginSuccess === 'function') {
                            window.handleLoginSuccess({
                                token: result.token,
                                email: email,
                                nickname: result.user?.nickname,
                                balance: result.user?.balance || '10000'
                            });
                        }
                    } else {
                        showStatus(result.error, 'error', 'loginStatus');
                        loginSubmitBtn.disabled = false;
                        loginSubmitBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> 로그인';
                    }
                }
            });
        }
        
        if (demoLoginBtn) {
            demoLoginBtn.addEventListener('click', function() {
                // 데모 계정 정보 자동 입력
                document.getElementById('email').value = 'demo@timelink.digital';
                document.getElementById('password').value = 'demo1234';
                document.getElementById('rememberMe').checked = true;
                
                showStatus('데모 계정으로 로그인합니다.', 'info', 'loginStatus');
            });
        }
        
        // 이메일 유효성 검사
        function isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        }
    }

    // === 이미 로그인된 사용자 체크 ===
    function checkAlreadyLoggedIn() {
        const token = localStorage.getItem('timelink_token');
        const urlParams = new URLSearchParams(window.location.search);
        const logoutParam = urlParams.get('logout');
        
        if (token && logoutParam !== 'true') {
            showStatus('이미 로그인되어 있습니다. 홈페이지로 이동합니다.', 'info', 'loginStatus');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        }
    }

    // === 상태 메시지 표시 ===
    function showStatus(message, type, elementId) {
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

    // === DOM 로드 시 실행 ===
    document.addEventListener('DOMContentLoaded', init);
</script>
