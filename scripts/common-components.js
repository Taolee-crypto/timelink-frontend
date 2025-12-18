// common-components.js - 헤더 로그인/회원가입 버튼 추가

// 헤더 생성 함수 (common-components.js에 추가)
function createHeader() {
    const headerHTML = `
        <nav class="navbar navbar-expand-lg navbar-dark fixed-top" style="background: rgba(10, 10, 26, 0.95); backdrop-filter: blur(10px); border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
            <div class="container">
                <!-- 로고 -->
                <a class="navbar-brand" href="./index.html">
                    <div class="d-flex align-items-center">
                        <div class="logo-icon me-2" style="width: 40px; height: 40px; border-radius: 10px; background: linear-gradient(135deg, #7c4dff, #536dfe); display: flex; align-items: center; justify-content: center;">
                            <i class="bi bi-infinity text-white"></i>
                        </div>
                        <span class="fw-bold fs-4" style="background: linear-gradient(135deg, #7c4dff, #00e5ff); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">TimeLink</span>
                    </div>
                </a>
                
                <!-- 모바일 토글 버튼 -->
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span class="navbar-toggler-icon"></span>
                </button>
                
                <!-- 네비게이션 메뉴 -->
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav me-auto">
                        <li class="nav-item">
                            <a class="nav-link active" href="./index.html">HOME</a>
                       </li>
                        <li class="nav-item">
                            <a class="nav-link" href="./studio.html">STUDIO</a>
                       </li>
                        <li class="nav-item">
                            <a class="nav-link" href="./musicplace.html">MUSIC</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="./tltube.html">TUBE</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="./dashboard.html">DASHBOARD</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="./charge.html">CHARGE</a>
                        </li>
                    </ul>
                    
                    <!-- 로그인/회원가입 버튼 (비로그인 상태) -->
                    <div class="auth-buttons d-flex gap-2">
                        <a href="./login.html" class="btn btn-login auth-btn">
                            <i class="bi bi-box-arrow-in-right me-1"></i>로그인
                        </a>
                        <a href="./signup.html" class="btn btn-signup auth-btn">
                            <i class="bi bi-person-plus me-1"></i>회원가입
                        </a>
                    </div>
                </div>
            </div>
        </nav>
    `;
    
    document.body.insertAdjacentHTML('afterbegin', headerHTML);
    
    // 로그인 상태 확인
    checkAuthState();
}

// 인증 상태 확인 및 UI 업데이트
function checkAuthState() {
    const authToken = localStorage.getItem('auth_token');
    const userData = JSON.parse(localStorage.getItem('user_data') || 'null');
    
    if (authToken && userData) {
        // 로그인된 상태: 로그인/회원가입 버튼 대신 사용자 정보 표시
        const authButtons = document.querySelector('.auth-buttons');
        if (authButtons) {
            authButtons.innerHTML = `
                <div class="d-flex align-items-center gap-3">
                    <div class="user-info d-flex align-items-center gap-2">
                        <div class="user-avatar" style="width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, #7c4dff, #536dfe); display: flex; align-items: center; justify-content: center; font-weight: 600; color: white;">
                            ${userData.name ? userData.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div class="user-details d-none d-md-block">
                            <div class="user-name" style="font-size: 0.9rem; font-weight: 600;">${userData.name || '사용자'}</div>
                            <div class="user-balance" style="font-size: 0.8rem; color: #00e5ff; font-weight: 600;">
                                <i class="bi bi-currency-exchange"></i>
                                ${userData.balance ? userData.balance.toLocaleString() : '0'} TL
                            </div>
                        </div>
                    </div>
                    <a href="./dashboard.html" class="btn btn-primary auth-btn" style="padding: 6px 16px;">
                        <i class="bi bi-speedometer2 me-1"></i>대시보드
                    </a>
                    <a href="#" class="btn btn-outline-light auth-btn" onclick="logoutUser()" style="padding: 6px 16px;">
                        <i class="bi bi-box-arrow-right"></i>
                    </a>
                </div>
            `;
        }
    }
}

// 로그아웃 함수
function logoutUser() {
    // 로컬 스토리지 정리
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    localStorage.removeItem('user_email');
    localStorage.removeItem('remember_me');
    localStorage.removeItem('saved_email');
    
    // 페이지 새로고침
    window.location.reload();
}

// DOM이 로드되면 헤더 생성
document.addEventListener('DOMContentLoaded', createHeader);
