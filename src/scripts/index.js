/**
 * TIMELINK - 메인 페이지 JavaScript
 * 로그인 상태 관리 및 모든 상호작용 처리
 */

// 전역 변수
let currentLanguage = 'ko';
let isLoggedIn = false;
let tlBalance = 0;
let currentUser = null;

// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', function() {
    console.log('TIMELINK 메인 페이지 로드됨');
    
    // 로그인 상태 확인
    checkLoginStatus();
    
    // UI 업데이트
    updateUI();
    
    // 다국어 초기화
    initializeLanguage();
    
    // 이벤트 리스너 설정
    setupEventListeners();
    
    // 새 사용자 환영 메시지
    checkNewUser();
});

// 로그인 상태 확인
function checkLoginStatus() {
    const savedLogin = localStorage.getItem('tl_loggedIn');
    const savedUser = localStorage.getItem('tl_user');
    const savedBalance = localStorage.getItem('tl_balance');
    
    if (savedLogin === 'true' && savedUser) {
        isLoggedIn = true;
        currentUser = JSON.parse(savedUser);
        tlBalance = parseInt(savedBalance) || 10000;
        
        console.log('로그인 상태:', currentUser.name);
    } else {
        console.log('비로그인 상태');
    }
}

// UI 업데이트
function updateUI() {
    updateHeaderUI();
    
    // 로그인 상태에 따라 CTA 버튼 변경
    updateCTAButtons();
}

// 헤더 UI 업데이트
function updateHeaderUI() {
    const balanceElement = document.getElementById('balanceAmount');
    const tlBalanceDiv = document.querySelector('.tl-balance');
    const userAvatar = document.querySelector('.user-avatar');
    const userIcon = userAvatar?.querySelector('i');
    
    if (!userAvatar || !userIcon) return;
    
    if (isLoggedIn && currentUser) {
        // 로그인 상태
        if (balanceElement) {
            balanceElement.textContent = tlBalance.toLocaleString();
        }
        if (tlBalanceDiv) {
            tlBalanceDiv.style.display = 'flex';
        }
        
        // 사용자 아이콘 업데이트
        userIcon.className = 'fas fa-user-check';
        userAvatar.title = `${currentUser.name}님`;
        userAvatar.style.background = 'var(--gradient-primary)';
        
    } else {
        // 비로그인 상태
        if (tlBalanceDiv) {
            tlBalanceDiv.style.display = 'none';
        }
        
        // 사용자 아이콘 기본 상태
        userIcon.className = 'fas fa-user';
        userAvatar.title = '로그인하기';
        userAvatar.style.background = 'var(--dark-card)';
        userAvatar.style.cursor = 'pointer';
    }
}

// CTA 버튼 업데이트
function updateCTAButtons() {
    const ctaButtons = document.querySelector('.cta-buttons');
    if (!ctaButtons) return;
    
    if (isLoggedIn) {
        // 로그인 상태: "내 콘텐츠 보기" 버튼
        ctaButtons.innerHTML = `
            <a href="studio.html" class="btn btn-primary">
                <i class="fas fa-sliders-h"></i> 콘텐츠 변환 시작
            </a>
            <a href="shareplace.html" class="btn btn-secondary">
                <i class="fas fa-store"></i> 마켓플레이스 탐색
            </a>
        `;
    } else {
        // 비로그인 상태: 기본 버튼
        ctaButtons.innerHTML = `
            <a href="login.html" class="btn btn-primary">
                <i class="fas fa-gift"></i> 무료로 시작하기 (10,000TL 보너스)
            </a>
            <a href="studio.html" class="btn btn-secondary">
                <i class="fas fa-play"></i> 체험해보기
            </a>
        `;
    }
}

// 사용자 아이콘 클릭 처리
function handleUserClick() {
    if (!isLoggedIn) {
        // 비로그인 상태: 로그인 페이지로 이동
        showAlert('로그인이 필요합니다. 로그인 페이지로 이동합니다.', 'info');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1000);
        return;
    }
    
    // 로그인 상태: 사용자 메뉴 표시
    toggleUserMenu();
}

// 사용자 메뉴 표시
function toggleUserMenu() {
    // 기존 메뉴 제거
    const existingMenu = document.querySelector('.user-dropdown-overlay');
    if (existingMenu) {
        existingMenu.remove();
        return;
    }
    
    // 새 메뉴 생성
    const menuHtml = `
        <div class="user-dropdown-overlay" onclick="closeUserMenu()">
            <div class="user-dropdown" onclick="event.stopPropagation()">
                <div class="user-info">
                    <div class="user-avatar-small">
                        <i class="fas fa-user-check"></i>
                    </div>
                    <div class="user-details">
                        <h4>${currentUser?.name || '사용자'}</h4>
                        <p>${currentUser?.email || ''}</p>
                        <div class="user-balance">
                            <span class="tl-icon-small">TL</span>
                            <span>${tlBalance.toLocaleString()} TL</span>
                        </div>
                    </div>
                </div>
                <div class="dropdown-divider"></div>
                <div class="dropdown-menu">
                    <a href="profile.html" class="dropdown-item">
                        <i class="fas fa-user"></i> 프로필 설정
                    </a>
                    <a href="wallet.html" class="dropdown-item">
                        <i class="fas fa-wallet"></i> TL 지갑
                    </a>
                    <a href="my-content.html" class="dropdown-item">
                        <i class="fas fa-folder"></i> 내 콘텐츠
                    </a>
                    <div class="dropdown-divider"></div>
                    <a href="settings.html" class="dropdown-item">
                        <i class="fas fa-cog"></i> 설정
                    </a>
                    <button class="dropdown-item logout-btn" onclick="logout()">
                        <i class="fas fa-sign-out-alt"></i> 로그아웃
                    </button>
                </div>
            </div>
        </div>
    `;
    
    const menuDiv = document.createElement('div');
    menuDiv.innerHTML = menuHtml;
    document.body.appendChild(menuDiv);
}

// 사용자 메뉴 닫기
function closeUserMenu() {
    const menu = document.querySelector('.user-dropdown-overlay');
    if (menu) {
        menu.remove();
    }
}

// 로그아웃
function logout() {
    if (confirm('로그아웃 하시겠습니까?')) {
        // localStorage 초기화
        localStorage.removeItem('tl_loggedIn');
        localStorage.removeItem('tl_user');
        localStorage.removeItem('tl_balance');
        localStorage.removeItem('tl_newUser');
        
        // 전역 변수 초기화
        isLoggedIn = false;
        currentUser = null;
        tlBalance = 0;
        
        // UI 업데이트
        updateUI();
        
        // 메뉴 닫기
        closeUserMenu();
        
        // 알림
        showAlert('로그아웃 되었습니다.', 'success');
        
        // 페이지 새로고침 (선택사항)
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    }
}

// 다국어 기능
function initializeLanguage() {
    const savedLanguage = localStorage.getItem('tl_language') || 'ko';
    currentLanguage = savedLanguage;
    
    const langData = {
        'ko': { flag: '🇰🇷', name: '한국어' },
        'en': { flag: '🇺🇸', name: 'English' },
        'jp': { flag: '🇯🇵', name: '日本語' },
        'cn': { flag: '🇨🇳', name: '中文' },
        'es': { flag: '🇪🇸', name: 'Español' }
    };
    
    if (langData[savedLanguage]) {
        const flagElement = document.querySelector('.lang-flag');
        const textElement = document.querySelector('.lang-text');
        
        if (flagElement) flagElement.textContent = langData[savedLanguage].flag;
        if (textElement) textElement.textContent = langData[savedLanguage].name;
    }
}

// 언어 메뉴 토글
function toggleLanguageMenu() {
    const menu = document.getElementById('languageMenu');
    const chevron = document.querySelector('.current-language i');
    
    if (!menu || !chevron) return;
    
    const isShowing = menu.classList.contains('show');
    menu.classList.toggle('show');
    chevron.style.transform = isShowing ? 'rotate(0)' : 'rotate(180deg)';
    
    // 외부 클릭시 닫기
    if (!isShowing) {
        setTimeout(() => {
            document.addEventListener('click', closeLanguageMenuOnClickOutside);
        }, 0);
    }
}

// 외부 클릭시 언어 메뉴 닫기
function closeLanguageMenuOnClickOutside(event) {
    const menu = document.getElementById('languageMenu');
    const selector = document.querySelector('.language-selector');
    
    if (!selector?.contains(event.target) && !menu?.contains(event.target)) {
        menu?.classList.remove('show');
        const chevron = document.querySelector('.
