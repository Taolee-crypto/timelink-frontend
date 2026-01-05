// common-component.js - TIMELINK 공통 컴포넌트

document.addEventListener('DOMContentLoaded', function() {
    // 헤더 렌더링
    renderHeader();
    
    // 푸터 렌더링
    renderFooter();
    
    // 인증 버튼 렌더링
    renderHeaderAuthButtons();
    
    // 페이지별 초기화
    initPageComponents();
    
    // TL 잔액 업데이트
    updateTLBalance();
});

// 헤더 렌더링 함수
function renderHeader() {
    const headerContainer = document.getElementById('headerContainer');
    if (!headerContainer) return;
    
    headerContainer.innerHTML = `
        <header class="main-header">
            <div class="header-content">
                <a href="index.html" class="logo">
                    <div class="logo-icon">TL</div>
                    <div class="logo-text">TIMELINK</div>
                </a>

                <nav class="main-nav">
                    <a href="index.html" class="nav-link">
                        <i class="fas fa-home"></i> HOME
                    </a>
                    <a href="studio.html" class="nav-link">
                        <i class="fas fa-sliders-h"></i> STUDIO
                    </a>
                    <a href="tlmusic.html" class="nav-link">
                        <i class="fas fa-music"></i> TLMUSIC
                    </a>
                    <a href="cafe-radio.html" class="nav-link">
                        <i class="fas fa-broadcast-tower"></i> CAFE RADIO
                    </a>
                    <a href="tlstore.html" class="nav-link">
                        <i class="fas fa-shopping-cart"></i> TLSTORE
                    </a>
                </nav>

                <div id="authButtons"></div>
            </div>
        </header>
    `;
}

// 푸터 렌더링 함수
function renderFooter() {
    const footerContainer = document.getElementById('footerContainer');
    if (!footerContainer) return;
    
    footerContainer.innerHTML = `
        <footer class="main-footer">
            <div class="footer-content">
                <div class="footer-grid">
                    <div class="footer-column">
                        <h3>TIMELINK STUDIO</h3>
                        <ul>
                            <li><a href="#">회사 소개</a></li>
                            <li><a href="#">연혁</a></li>
                            <li><a href="#">투자자 정보</a></li>
                            <li><a href="#">채용 정보</a></li>
                        </ul>
                    </div>
                    <div class="footer-column">
                        <h3>서비스</h3>
                        <ul>
                            <li><a href="studio.html">STUDIO</a></li>
                            <li><a href="tlmusic.html">TLMUSIC</a></li>
                            <li><a href="cafe-radio.html">CAFE RADIO</a></li>
                            <li><a href="tlstore.html">TLSTORE</a></li>
                        </ul>
                    </div>
                    <div class="footer-column">
                        <h3>고객 지원</h3>
                        <ul>
                            <li><a href="#">자주 묻는 질문</a></li>
                            <li><a href="#">이용 약관</a></li>
                            <li><a href="#">개인정보 처리방침</a></li>
                            <li><a href="#">문의하기</a></li>
                        </ul>
                    </div>
                    <div class="footer-column">
                        <h3>연락처</h3>
                        <ul>
                            <li><i class="fas fa-envelope"></i> contact@timelink.studio</li>
                            <li><i class="fas fa-phone"></i> 02-1234-5678</li>
                            <li><i class="fas fa-map-marker-alt"></i> 서울시 강남구 테헤란로 123</li>
                        </ul>
                    </div>
                </div>
                <div class="footer-bottom">
                    <p>&copy; 2023 TIMELINK STUDIO. All rights reserved.</p>
                    <p>TLMUSIC 및 CAFE RADIO는 TIMELINK STUDIO의 등록상표입니다.</p>
                </div>
            </div>
        </footer>
    `;
}

// 헤더에 authButtons 렌더링
function renderHeaderAuthButtons() {
    const authButtons = document.getElementById('authButtons');
    if (!authButtons) return;
    
    const user = JSON.parse(localStorage.getItem('timelink_user'));
    
    if (user) {
        // 로그인된 상태 - TL 잔액 표시 추가
        const tlBalance = localStorage.getItem('timelink_tl_balance') || '10000';
        
        authButtons.innerHTML = `
            <style>
                .user-menu {
                    position: relative;
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                }
                
                .user-info {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 0.5rem 1rem;
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 10px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                
                .user-info:hover {
                    background: rgba(255, 255, 255, 0.1);
                }
                
                .user-avatar {
                    width: 36px;
                    height: 36px;
                    background: linear-gradient(135deg, #1E90FF, #4169E1);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                }
                
                .user-name {
                    color: white;
                    font-weight: 500;
                }
                
                .user-tl-balance {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.5rem 1rem;
                    background: linear-gradient(135deg, #FFD166, #FFB347);
                    border-radius: 10px;
                    color: #0A0F2B;
                    font-weight: bold;
                }
                
                .dropdown-menu {
                    position: absolute;
                    top: 100%;
                    right: 0;
                    background: #1A2342;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                    min-width: 220px;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                    display: none;
                    z-index: 1000;
                    margin-top: 0.5rem;
                }
                
                .dropdown-menu.show {
                    display: block;
                }
                
                .dropdown-item {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 0.75rem 1rem;
                    color: #94A3B8;
                    text-decoration: none;
                    transition: all 0.3s ease;
                    border: none;
                    background: none;
                    width: 100%;
                    text-align: left;
                    font-family: 'Inter', sans-serif;
                    font-size: 0.95rem;
                    cursor: pointer;
                }
                
                .dropdown-item:hover {
                    background: rgba(30, 144, 255, 0.1);
                    color: white;
                }
                
                .dropdown-divider {
                    height: 1px;
                    background: rgba(255, 255, 255, 0.1);
                    margin: 0.5rem 0;
                }
                
                .auth-buttons {
                    display: flex;
                    gap: 0.75rem;
                    align-items: center;
                }
                
                .btn-outline {
                    background: transparent;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    color: white;
                    padding: 0.5rem 1.25rem;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                
                .btn-outline:hover {
                    background: rgba(255, 255, 255, 0.1);
                    border-color: rgba(255, 255, 255, 0.3);
                }
                
                .btn-primary {
                    background: linear-gradient(135deg, #1E90FF, #4169E1);
                    border: none;
                    color: white;
                    padding: 0.5rem 1.25rem;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                
                .btn-primary:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 20px rgba(30, 144, 255, 0.3);
                }
                
                @media (max-width: 768px) {
                    .user-name {
                        display: none;
                    }
                    
                    .auth-buttons {
                        gap: 0.5rem;
                    }
                }
            </style>
            
            <div class="user-menu">
                <div class="user-tl-balance">
                    <i class="fas fa-coins"></i>
                    <span>${parseInt(tlBalance).toLocaleString()} TL</span>
                </div>
                <div class="user-info">
                    <div class="user-avatar">
                        <i class="fas fa-user"></i>
                    </div>
                    <span class="user-name">${user.name || user.email}</span>
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
        
        // 드롭다운 메뉴 이벤트
        const userInfo = document.querySelector('.user-info');
        const dropdownMenu = document.querySelector('.dropdown-menu');
        
        userInfo.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdownMenu.classList.toggle('show');
        });
        
        document.addEventListener('click', () => {
            dropdownMenu.classList.remove('show');
        });
        
        // 로그아웃 버튼
        const logoutBtn = document.querySelector('.logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.removeItem('timelink_user');
                localStorage.removeItem('timelink_token');
                localStorage.removeItem('timelink_tl_balance');
                location.reload();
            });
        }
    } else {
        // 로그인 안된 상태
        authButtons.innerHTML = `
            <style>
                .auth-buttons {
                    display: flex;
                    gap: 0.75rem;
                    align-items: center;
                }
                
                .btn-outline {
                    background: transparent;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    color: white;
                    padding: 0.5rem 1.25rem;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-weight: 500;
                }
                
                .btn-outline:hover {
                    background: rgba(255, 255, 255, 0.1);
                    border-color: rgba(255, 255, 255, 0.3);
                }
                
                .btn-primary {
                    background: linear-gradient(135deg, #1E90FF, #4169E1);
                    border: none;
                    color: white;
                    padding: 0.5rem 1.25rem;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-weight: 500;
                }
                
                .btn-primary:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 20px rgba(30, 144, 255, 0.3);
                }
                
                @media (max-width: 768px) {
                    .auth-buttons {
                        gap: 0.5rem;
                    }
                    
                    .btn-outline span,
                    .btn-primary span {
                        display: none;
                    }
                    
                    .btn-outline,
                    .btn-primary {
                        padding: 0.5rem;
                        width: 40px;
                        height: 40px;
                        justify-content: center;
                    }
                }
            </style>
            
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
        
        // 로그인/회원가입 버튼 이벤트
        const loginBtn = document.getElementById('loginBtn');
        const signupBtn = document.getElementById('signupBtn');
        
        if (loginBtn) {
            loginBtn.addEventListener('click', () => {
                openAuthModal('login');
            });
        }
        
        if (signupBtn) {
            signupBtn.addEventListener('click', () => {
                openAuthModal('signup');
            });
        }
    }
}

// 인증 모달 열기
function openAuthModal(type = 'login') {
    // 기존 모달 제거
    const existingModal = document.querySelector('.auth-modal-overlay');
    if (existingModal) {
        existingModal.remove();
    }
    
    const modalHTML = `
        <div class="auth-modal-overlay">
            <div class="auth-modal">
                <button class="close-auth-modal">&times;</button>
                <div class="auth-tabs">
                    <button class="auth-tab ${type === 'login' ? 'active' : ''}" data-tab="login">로그인</button>
                    <button class="auth-tab ${type === 'signup' ? 'active' : ''}" data-tab="signup">회원가입</button>
                </div>
                <div class="auth-content">
                    <form class="auth-form ${type === 'login' ? 'active' : ''}" id="loginForm">
                        <div class="form-group">
                            <label for="loginEmail">이메일</label>
                            <input type="email" id="loginEmail" placeholder="이메일을 입력하세요" required>
                        </div>
                        <div class="form-group">
                            <label for="loginPassword">비밀번호</label>
                            <input type="password" id="loginPassword" placeholder="비밀번호를 입력하세요" required>
                        </div>
                        <div class="form-options">
                            <label class="checkbox">
                                <input type="checkbox" id="rememberMe">
                                <span>로그인 상태 유지</span>
                            </label>
                            <a href="#" class="forgot-password">비밀번호 찾기</a>
                        </div>
                        <button type="submit" class="btn btn-primary btn-block">
                            <i class="fas fa-sign-in-alt"></i> 로그인
                        </button>
                        <div class="divider">
                            <span>또는</span>
                        </div>
                        <button type="button" class="btn btn-outline btn-block social-login">
                            <i class="fab fa-google"></i> Google로 로그인
                        </button>
                        <button type="button" class="btn btn-outline btn-block social-login">
                            <i class="fas fa-envelope"></i> 이메일로 계속하기
                        </button>
                    </form>
                    
                    <form class="auth-form ${type === 'signup' ? 'active' : ''}" id="signupForm">
                        <div class="welcome-bonus">
                            <i class="fas fa-gift"></i>
                            <span>회원가입 보너스: 10,000 TL 지급!</span>
                        </div>
                        <div class="form-group">
                            <label for="signupName">이름</label>
                            <input type="text" id="signupName" placeholder="이름을 입력하세요" required>
                        </div>
                        <div class="form-group">
                            <label for="signupEmail">이메일</label>
                            <input type="email" id="signupEmail" placeholder="이메일을 입력하세요" required>
                        </div>
                        <div class="form-group">
                            <label for="signupPassword">비밀번호</label>
                            <input type="password" id="signupPassword" placeholder="비밀번호를 입력하세요" required>
                            <small class="password-hint">최소 8자 이상, 영문+숫자 조합</small>
                        </div>
                        <div class="form-group">
                            <label for="confirmPassword">비밀번호 확인</label>
                            <input type="password" id="confirmPassword" placeholder="비밀번호를 다시 입력하세요" required>
                        </div>
                        <div class="form-options">
                            <label class="checkbox">
                                <input type="checkbox" id="termsAgree" required>
                                <span><a href="#">이용약관</a> 및 <a href="#">개인정보처리방침</a>에 동의합니다</span>
                            </label>
                            <label class="checkbox">
                                <input type="checkbox" id="newsletterAgree">
                                <span>뉴스레터 및 프로모션 알림 수신 동의</span>
                            </label>
                        </div>
                        <button type="submit" class="btn btn-success btn-block">
                            <i class="fas fa-user-plus"></i> 10,000 TL 받고 회원가입
                        </button>
                        <div class="divider">
                            <span>또는</span>
                        </div>
                        <button type="button" class="btn btn-outline btn-block social-login">
                            <i class="fab fa-google"></i> Google로 회원가입
                        </button>
                    </form>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // 모달 스타일 추가
    const style = document.createElement('style');
    style.textContent = `
        .auth-modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000;
            animation: fadeIn 0.3s ease;
        }
        
        .auth-modal {
            background: #1A2342;
            border-radius: 20px;
            width: 90%;
            max-width: 450px;
            max-height: 90vh;
            overflow-y: auto;
            position: relative;
            animation: slideUp 0.3s ease;
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
        }
        
        .close-auth-modal {
            position: absolute;
            top: 1rem;
            right: 1rem;
            background: none;
            border: none;
            color: #94A3B8;
            font-size: 1.5rem;
            cursor: pointer;
            z-index: 10;
        }
        
        .close-auth-modal:hover {
            color: white;
        }
        
        .auth-tabs {
            display: flex;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            padding: 0 2rem;
            margin-top: 3rem;
        }
        
        .auth-tab {
            flex: 1;
            padding: 1rem;
            background: none;
            border: none;
            color: #94A3B8;
            font-size: 1.1rem;
            font-weight: 600;
            cursor: pointer;
            position: relative;
            transition: all 0.3s ease;
        }
        
        .auth-tab:hover {
            color: white;
        }
        
        .auth-tab.active {
            color: #1E90FF;
        }
        
        .auth-tab.active::after {
            content: '';
            position: absolute;
            bottom: -1px;
            left: 0;
            right: 0;
            height: 2px;
            background: #1E90FF;
        }
        
        .auth-content {
            padding: 2rem;
        }
        
        .auth-form {
            display: none;
        }
        
        .auth-form.active {
            display: block;
        }
        
        .welcome-bonus {
            background: linear-gradient(135deg, #FFD166, #FFB347);
            color: #0A0F2B;
            padding: 1rem;
            border-radius: 10px;
            text-align: center;
            margin-bottom: 1.5rem;
            font-weight: bold;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
        }
        
        .form-group {
            margin-bottom: 1.5rem;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 0.5rem;
            color: #94A3B8;
            font-size: 0.9rem;
            font-weight: 500;
        }
        
        .form-group input {
            width: 100%;
            padding: 0.75rem 1rem;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            color: white;
            font-family: 'Inter', sans-serif;
            font-size: 1rem;
        }
        
        .form-group input:focus {
            outline: none;
            border-color: #1E90FF;
            box-shadow: 0 0 0 2px rgba(30, 144, 255, 0.2);
        }
        
        .password-hint {
            display: block;
            margin-top: 0.25rem;
            color: #64748B;
            font-size: 0.8rem;
        }
        
        .form-options {
            margin-bottom: 1.5rem;
        }
        
        .checkbox {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            margin-bottom: 0.75rem;
            color: #94A3B8;
            font-size: 0.9rem;
            cursor: pointer;
        }
        
        .checkbox input[type="checkbox"] {
            width: auto;
            margin: 0;
        }
        
        .checkbox a {
            color: #1E90FF;
            text-decoration: none;
        }
        
        .checkbox a:hover {
            text-decoration: underline;
        }
        
        .forgot-password {
            color: #1E90FF;
            text-decoration: none;
            font-size: 0.9rem;
            float: right;
        }
        
        .forgot-password:hover {
            text-decoration: underline;
        }
        
        .btn-block {
            width: 100%;
            padding: 1rem;
            font-size: 1rem;
            font-weight: 600;
            margin-bottom: 1rem;
        }
        
        .btn-success {
            background: linear-gradient(135deg, #00D4AA, #00B894);
            border: none;
            color: white;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .btn-success:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(0, 212, 170, 0.3);
        }
        
        .divider {
            display: flex;
            align-items: center;
            margin: 1.5rem 0;
            color: #64748B;
        }
        
        .divider::before,
        .divider::after {
            content: '';
            flex: 1;
            height: 1px;
            background: rgba(255, 255, 255, 0.1);
        }
        
        .divider span {
            padding: 0 1rem;
            font-size: 0.9rem;
        }
        
        .social-login {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.75rem;
            padding: 0.75rem;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            color: white;
            cursor: pointer;
            transition: all 0.3s ease;
            font-size: 0.95rem;
        }
        
        .social-login:hover {
            background: rgba(255, 255, 255, 0.1);
            border-color: rgba(255, 255, 255, 0.2);
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        @keyframes slideUp {
            from { transform: translateY(50px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        
        @media (max-width: 480px) {
            .auth-modal {
                width: 95%;
                padding: 0;
            }
            
            .auth-content {
                padding: 1.5rem;
            }
            
            .auth-tabs {
                padding: 0 1.5rem;
            }
        }
    `;
    document.head.appendChild(style);
    
    // 모달 이벤트 설정
    const closeBtn = document.querySelector('.close-auth-modal');
    const overlay = document.querySelector('.auth-modal-overlay');
    const tabs = document.querySelectorAll('.auth-tab');
    const forms = document.querySelectorAll('.auth-form');
    
    closeBtn.addEventListener('click', () => {
        overlay.remove();
        document.head.removeChild(style);
    });
    
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.remove();
            document.head.removeChild(style);
        }
    });
    
    // 탭 전환
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabType = tab.dataset.tab;
            
            tabs.forEach(t => t.classList.remove('active'));
            forms.forEach(f => f.classList.remove('active'));
            
            tab.classList.add('active');
            document.getElementById(`${tabType}Form`).classList.add('active');
        });
    });
    
    // 로그인 폼 제출
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            // 로그인 처리
            handleLogin(email, password);
        });
    }
    
    // 회원가입 폼 제출
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('signupName').value;
            const email = document.getElementById('signupEmail').value;
            const password = document.getElementById('signupPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            // 회원가입 처리
            handleSignup(name, email, password, confirmPassword);
        });
    }
}

// 로그인 처리
function handleLogin(email, password) {
    // 간단한 유효성 검사
    if (!email || !password) {
        showToast('이메일과 비밀번호를 입력해주세요.', 'error');
        return;
    }
    
    // 로딩 표시
    showLoading();
    
    // 시뮬레이션 API 호출
    setTimeout(() => {
        hideLoading();
        
        // 테스트용 - 실제로는 서버 검증 필요
        const user = {
            email: email,
            name: email.split('@')[0],
            id: Date.now().toString()
        };
        
        // 로그인 성공
        localStorage.setItem('timelink_user', JSON.stringify(user));
        localStorage.setItem('timelink_token', 'simulated_token_' + Date.now());
        
        // TL 잔액 설정 (처음 로그인 시 10,000 TL)
        if (!localStorage.getItem('timelink_tl_balance')) {
            localStorage.setItem('timelink_tl_balance', '10000');
        }
        
        // 모달 닫기
        const overlay = document.querySelector('.auth-modal-overlay');
        if (overlay) overlay.remove();
        
        // 페이지 새로고침
        showToast('로그인 성공! 10,000 TL이 지급되었습니다.', 'success');
        
        setTimeout(() => {
            location.reload();
        }, 1500);
        
    }, 1000);
}

// 회원가입 처리
function handleSignup(name, email, password, confirmPassword) {
    // 유효성 검사
    if (!name || !email || !password || !confirmPassword) {
        showToast('모든 필드를 입력해주세요.', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showToast('비밀번호가 일치하지 않습니다.', 'error');
        return;
    }
    
    if (password.length < 8) {
        showToast('비밀번호는 최소 8자 이상이어야 합니다.', 'error');
        return;
    }
    
    // 로딩 표시
    showLoading();
    
    // 시뮬레이션 API 호출
    setTimeout(() => {
        hideLoading();
        
        // 회원가입 성공
        const user = {
            name: name,
            email: email,
            id: Date.now().toString(),
            joinedAt: new Date().toISOString()
        };
        
        localStorage.setItem('timelink_user', JSON.stringify(user));
        localStorage.setItem('timelink_token', 'simulated_token_' + Date.now());
        
        // 회원가입 보너스 10,000 TL 지급
        localStorage.setItem('timelink_tl_balance', '10000');
        
        // 모달 닫기
        const overlay = document.querySelector('.auth-modal-overlay');
        if (overlay) overlay.remove();
        
        // 환영 메시지
        showToast(`환영합니다 ${name}님! 10,000 TL이 지급되었습니다.`, 'success');
        
        setTimeout(() => {
            location.reload();
        }, 1500);
        
    }, 1000);
}

// TL 잔액 업데이트
function updateTLBalance() {
    const user = JSON.parse(localStorage.getItem('timelink_user'));
    if (!user) return;
    
    // TL 잔액이 없으면 기본 10,000 TL 설정
    if (!localStorage.getItem('timelink_tl_balance')) {
        localStorage.setItem('timelink_tl_balance', '10000');
    }
}

// 페이지별 컴포넌트 초기화
function initPageComponents() {
    // 현재 페이지 확인
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // 네비게이션 활성화
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// 토스트 메시지 표시
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="toast-close">&times;</button>
    `;
    
    document.body.appendChild(toast);
    
    // 스타일 추가
    if (!document.querySelector('.toast-style')) {
        const style = document.createElement('style');
        style.className = 'toast-style';
        style.textContent = `
            .toast {
                position: fixed;
                top: 100px;
                right: 20px;
                background: #1A2342;
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 10px;
                padding: 1rem 1.5rem;
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 1rem;
                min-width: 300px;
                max-width: 400px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                z-index: 3000;
                transform: translateX(150%);
                animation: slideIn 0.3s ease forwards;
            }
            
            .toast-success {
                border-left: 4px solid #00D4AA;
            }
            
            .toast-error {
                border-left: 4px solid #FF6B35;
            }
            
            .toast-info {
                border-left: 4px solid #1E90FF;
            }
            
            .toast-content {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                color: white;
                flex: 1;
            }
            
            .toast-content i {
                font-size: 1.2rem;
            }
            
            .toast-success .toast-content i {
                color: #00D4AA;
            }
            
            .toast-error .toast-content i {
                color: #FF6B35;
            }
            
            .toast-info .toast-content i {
                color: #1E90FF;
            }
            
            .toast-close {
                background: none;
                border: none;
                color: #94A3B8;
                font-size: 1.2rem;
                cursor: pointer;
                padding: 0;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .toast-close:hover {
                color: white;
            }
            
            @keyframes slideIn {
                from { transform: translateX(150%); }
                to { transform: translateX(0); }
            }
            
            @media (max-width: 768px) {
                .toast {
                    top: 20px;
                    right: 10px;
                    left: 10px;
                    min-width: auto;
                    max-width: none;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // 자동 제거
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease forwards';
        
        // slideOut 애니메이션 추가
        const style = document.querySelector('.toast-style');
        if (!style.textContent.includes('slideOut')) {
            style.textContent += `
                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(150%); opacity: 0; }
                }
            `;
        }
        
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 4000);
    
    // 닫기 버튼 이벤트
    const closeBtn = toast.querySelector('.toast-close');
    closeBtn.addEventListener('click', () => {
        toast.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    });
}

// 로딩 표시
function showLoading() {
    const loading = document.createElement('div');
    loading.className = 'loading-overlay';
    loading.innerHTML = `
        <div class="loading-spinner">
            <div class="spinner"></div>
            <div class="loading-text">처리 중...</div>
        </div>
    `;
    
    // 스타일 추가
    if (!document.querySelector('.loading-style')) {
        const style = document.createElement('style');
        style.className = 'loading-style';
        style.textContent = `
            .loading-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(10, 15, 43, 0.9);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 4000;
            }
            
            .loading-spinner {
                text-align: center;
            }
            
            .spinner {
                width: 50px;
                height: 50px;
                border: 3px solid rgba(30, 144, 255, 0.3);
                border-top-color: #1E90FF;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 0 auto 1rem;
            }
            
            .loading-text {
                color: white;
                font-size: 1rem;
            }
            
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(loading);
}

// 로딩 숨기기
function hideLoading() {
    const loading = document.querySelector('.loading-overlay');
    if (loading) {
        loading.remove();
    }
}

// 전역 함수 내보내기
window.openAuthModal = openAuthModal;
window.showToast = showToast;
window.showLoading = showLoading;
window.hideLoading = hideLoading;
