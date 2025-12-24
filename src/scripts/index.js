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
        const chevron = document.querySelector('.current-language i');
        if (chevron) chevron.style.transform = 'rotate(0)';
        document.removeEventListener('click', closeLanguageMenuOnClickOutside);
    }
}

// 언어 변경
function changeLanguage(langCode, flag, languageName) {
    currentLanguage = langCode;
    
    // UI 업데이트
    const flagElement = document.querySelector('.lang-flag');
    const textElement = document.querySelector('.lang-text');
    
    if (flagElement) flagElement.textContent = flag;
    if (textElement) textElement.textContent = languageName;
    
    // 선택된 언어 강조
    document.querySelectorAll('.language-option').forEach(option => {
        option.classList.remove('selected');
    });
    event.currentTarget.classList.add('selected');
    
    // 메뉴 닫기
    toggleLanguageMenu();
    
    // 언어 설정 저장
    localStorage.setItem('tl_language', langCode);
    
    // 알림
    showAlert(`언어가 ${languageName}로 변경되었습니다.`, 'success');
}

// 새 사용자 확인
function checkNewUser() {
    const isNewUser = localStorage.getItem('tl_newUser') === 'true';
    if (isNewUser) {
        showAlert('TIMELINK에 오신 것을 환영합니다! 10,000 TL 보너스가 지급되었습니다.', 'success');
        localStorage.removeItem('tl_newUser'); // 한 번만 표시
    }
}

// 앨범 재생
function playAlbum(albumId) {
    if (!isLoggedIn) {
        showAlert('미리듣기를 하려면 로그인이 필요합니다.', 'info');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
        return;
    }
    
    // 미리듣기 로직 (가상)
    showAlert(`앨범 ${albumId} 미리듣기 재생 중...`, 'info');
    
    // 미리듣기 플레이어 표시
    showPreviewPlayer(albumId);
}

// 앨범 스트리밍
function streamAlbum(albumId) {
    if (!isLoggedIn) {
        showAlert('스트리밍을 시작하려면 로그인이 필요합니다.', 'info');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
        return;
    }
    
    // 잔액 체크
    if (tlBalance < 5) {
        showAlert('TL 잔액이 부족합니다. 충전이 필요합니다.', 'error');
        return;
    }
    
    // 스트리밍 시작
    showAlert(`앨범 ${albumId} 스트리밍 시작! TL이 시간당 차감됩니다.`, 'success');
    
    // 음악 플레이어 열기
    openMusicPlayer(albumId);
}

// 미리듣기 플레이어
function showPreviewPlayer(albumId) {
    const playerHtml = `
        <div class="music-player-overlay" onclick="closeMusicPlayer()">
            <div class="music-player" onclick="event.stopPropagation()">
                <div class="player-header">
                    <h3>미리듣기 (30초)</h3>
                    <button class="close-player" onclick="closeMusicPlayer()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="player-body">
                    <div class="now-playing">
                        <div class="album-art">
                            <img src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" alt="Album">
                        </div>
                        <div class="track-info">
                            <h4>미리듣기 중...</h4>
                            <p>스트리밍 시작으로 전체 음원 감상</p>
                            <div class="progress-bar">
                                <div class="progress" style="width: 0%"></div>
                            </div>
                            <div class="time-display">
                                <span class="current-time">0:00</span>
                                <span class="total-time">0:30</span>
                            </div>
                        </div>
                    </div>
                    <div class="player-controls">
                        <button class="control-btn" onclick="skipTrack(-1)"><i class="fas fa-step-backward"></i></button>
                        <button class="control-btn play-btn-large" onclick="startPreview()">
                            <i class="fas fa-play"></i>
                        </button>
                        <button class="control-btn" onclick="skipTrack(1)"><i class="fas fa-step-forward"></i></button>
                    </div>
                    <button class="btn btn-primary btn-block" onclick="streamAlbum(${albumId}); closeMusicPlayer()">
                        <i class="fas fa-headphones"></i> 전체 스트리밍 시작
                    </button>
                </div>
            </div>
        </div>
    `;
    
    showModal(playerHtml);
}

// 음악 플레이어 열기
function openMusicPlayer(albumId) {
    if (!isLoggedIn) {
        showAlert('로그인이 필요합니다.', 'error');
        return;
    }
    
    const playerHtml = `
        <div class="music-player-overlay" onclick="closeMusicPlayer()">
            <div class="music-player" onclick="event.stopPropagation()">
                <div class="player-header">
                    <h3>TL MUSIC PLAYER</h3>
                    <button class="close-player" onclick="closeMusicPlayer()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="player-body">
                    <div class="now-playing">
                        <div class="album-art">
                            <img src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80" alt="Album">
                        </div>
                        <div class="track-info">
                            <h4>Quantum Beats - Track 1</h4>
                            <p>Neural Nexus</p>
                            <div class="progress-bar">
                                <div class="progress" style="width: 30%"></div>
                            </div>
                            <div class="time-display">
                                <span class="current-time">1:15</span>
                                <span class="total-time">3:45</span>
                            </div>
                        </div>
                    </div>
                    <div class="player-controls">
                        <button class="control-btn" onclick="skipTrack(-1)"><i class="fas fa-step-backward"></i></button>
                        <button class="control-btn play-btn-large" id="playPauseBtn" onclick="togglePlayPause()">
                            <i class="fas fa-pause"></i>
                        </button>
                        <button class="control-btn" onclick="skipTrack(1)"><i class="fas fa-step-forward"></i></button>
                    </div>
                    <div class="tl-consumption">
                        <div class="tl-icon">TL</div>
                        <span>소비량: <strong>0.08 TL/초</strong></span>
                        <span class="balance">잔액: <strong id="playerBalance">${tlBalance} TL</strong></span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    showModal(playerHtml);
    
    // TL 차감 시뮬레이션 시작
    startTLDeduction();
}

// TL 차감 시뮬레이션
function startTLDeduction() {
    if (window.deductionInterval) {
        clearInterval(window.deductionInterval);
    }
    
    window.deductionInterval = setInterval(() => {
        if (tlBalance <= 0) {
            clearInterval(window.deductionInterval);
            showAlert('TL 잔액이 모두 소진되었습니다. 충전이 필요합니다.', 'error');
            closeMusicPlayer();
            return;
        }
        
        // 잔액 감소
        tlBalance = Math.max(0, tlBalance - 5);
        
        // 로컬스토리지 업데이트
        localStorage.setItem('tl_balance', tlBalance.toString());
        
        // UI 업데이트
        const playerBalance = document.getElementById('playerBalance');
        const pageBalance = document.getElementById('balanceAmount');
        
        if (playerBalance) playerBalance.textContent = tlBalance + ' TL';
        if (pageBalance) pageBalance.textContent = tlBalance.toLocaleString();
        
        // 잔액이 적을 때 경고
        if (tlBalance < 50) {
            const warning = document.querySelector('.tl-consumption');
            if (warning) {
                warning.style.background = 'rgba(255, 107, 107, 0.2)';
                warning.style.border = '1px solid rgba(255, 107, 107, 0.5)';
            }
        }
    }, 3000);
}

// 미리듣기 시작
function startPreview() {
    const progressBar = document.querySelector('.progress');
    const playBtn = document.querySelector('.play-btn-large i');
    
    if (!progressBar) return;
    
    let progress = 0;
    const interval = setInterval(() => {
        progress += 1;
        if (progress >= 100) {
            clearInterval(interval);
            playBtn.className = 'fas fa-play';
            showAlert('미리듣기가 종료되었습니다.', 'info');
            return;
        }
        progressBar.style.width = progress + '%';
        
        const currentTime = document.querySelector('.current-time');
        if (currentTime) {
            const seconds = Math.floor(progress * 30 / 100);
            currentTime.textContent = `0:${seconds.toString().padStart(2, '0')}`;
        }
    }, 300);
    
    playBtn.className = 'fas fa-pause';
    window.previewInterval = interval;
}

// 재생/일시정지 토글
function togglePlayPause() {
    const playPauseBtn = document.getElementById('playPauseBtn');
    if (!playPauseBtn) return;
    
    const icon = playPauseBtn.querySelector('i');
    if (!icon) return;
    
    if (icon.classList.contains('fa-play')) {
        icon.className = 'fas fa-pause';
        // 재생 로직
        showAlert('재생 시작', 'info');
    } else {
        icon.className = 'fas fa-play';
        // 일시정지 로직
        showAlert('일시정지', 'info');
    }
}

// 트랙 스킵
function skipTrack(direction) {
    showAlert(direction > 0 ? '다음 트랙으로 이동합니다' : '이전 트랙으로 이동합니다', 'info');
}

// 모달 표시
function showModal(html) {
    // 기존 모달 제거
    const existingModal = document.querySelector('.music-player-overlay');
    if (existingModal) {
        existingModal.remove();
    }
    
    // 새 모달 추가
    const modalDiv = document.createElement('div');
    modalDiv.innerHTML = html;
    document.body.appendChild(modalDiv);
}

// 음악 플레이어 닫기
function closeMusicPlayer() {
    const player = document.querySelector('.music-player-overlay');
    if (player) {
        player.remove();
    }
    
    // 인터벌 정리
    if (window.deductionInterval) {
        clearInterval(window.deductionInterval);
    }
    if (window.previewInterval) {
        clearInterval(window.previewInterval);
    }
}

// 이벤트 리스너 설정
function setupEventListeners() {
    // ESC 키로 모달 닫기
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeMusicPlayer();
        }
    });
    
    // 외부 클릭시 메뉴 닫기
    document.addEventListener('click', function(event) {
        const menu = document.getElementById('languageMenu');
        const selector = document.querySelector('.language-selector');
        
        if (menu && menu.classList.contains('show') && 
            !selector?.contains(event.target) && 
            !menu.contains(event.target)) {
            menu.classList.remove('show');
            const chevron = document.querySelector('.current-language i');
            if (chevron) chevron.style.transform = 'rotate(0)';
        }
    });
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
        top: 90px;
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

// 페이지 언로드시 정리
window.addEventListener('beforeunload', function() {
    if (window.deductionInterval) {
        clearInterval(window.deductionInterval);
    }
    if (window.previewInterval) {
        clearInterval(window.previewInterval);
    }
});

// 글로벌 함수 내보내기
window.handleUserClick = handleUserClick;
window.closeUserMenu = closeUserMenu;
window.logout = logout;
window.toggleLanguageMenu = toggleLanguageMenu;
window.changeLanguage = changeLanguage;
window.playAlbum = playAlbum;
window.streamAlbum = streamAlbum;
window.closeMusicPlayer = closeMusicPlayer;
window.togglePlayPause = togglePlayPause;
window.skipTrack = skipTrack;
window.startPreview = startPreview;

console.log('TIMELINK 메인 스크립트 로드 완료');
