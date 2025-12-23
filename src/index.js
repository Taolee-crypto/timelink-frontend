// TimeLink 메인 JavaScript 파일

// 다국어 기능
let currentLanguage = 'ko';

// 다국어 텍스트 데이터
const translations = {
    ko: {
        musicSubtitle: "양자내성 암호화로 보호된 고품질 음원을 시간 단위로 감상하세요",
        streamButton: "스트리밍 시작",
        viewAllAlbums: "전체 앨범 보기",
        feature1: "양자내성 보안",
        feature2: "시간 단위 결제", 
        feature3: "수익 공유",
        feature4: "글로벌 스트리밍",
        featureDesc1: "CRYSTALS-DILITHIUM 암호화 적용",
        featureDesc2: "원하는 만큼만 구매하고 청구",
        featureDesc3: "아티스트와 50:50 수익 분배",
        featureDesc4: "전 세계 어디서나 접근 가능"
    },
    en: {
        musicSubtitle: "Enjoy high-quality music protected by quantum-resistant encryption on a time-based system",
        streamButton: "Start Streaming",
        viewAllAlbums: "View All Albums",
        feature1: "Quantum-Resistant Security",
        feature2: "Time-Based Payment",
        feature3: "Revenue Sharing",
        feature4: "Global Streaming",
        featureDesc1: "CRYSTALS-DILITHIUM encryption applied",
        featureDesc2: "Buy and pay only for what you use",
        featureDesc3: "50:50 revenue share with artists",
        featureDesc4: "Accessible anywhere in the world"
    },
    jp: {
        musicSubtitle: "量子耐性暗号化で保護された高品質な音楽を時間単位でお楽しみください",
        streamButton: "ストリーミング開始",
        viewAllAlbums: "すべてのアルバムを見る",
        feature1: "量子耐性セキュリティ",
        feature2: "時間単位の支払い",
        feature3: "収益共有",
        feature4: "グローバルストリーミング",
        featureDesc1: "CRYSTALS-DILITHIUM暗号化を適用",
        featureDesc2: "必要な分だけ購入して請求",
        featureDesc3: "アーティストと50:50の収益分配",
        featureDesc4: "世界中どこからでもアクセス可能"
    },
    cn: {
        musicSubtitle: "通过量子抗性加密保护的高品质音乐，按时间单位欣赏",
        streamButton: "开始流媒体",
        viewAllAlbums: "查看所有专辑",
        feature1: "量子抗性安全",
        feature2: "基于时间的支付",
        feature3: "收益共享",
        feature4: "全球流媒体",
        featureDesc1: "应用CRYSTALS-DILITHIUM加密",
        featureDesc2: "按需购买和支付",
        featureDesc3: "与艺术家50:50收益分成",
        featureDesc4: "全球任何地方都可访问"
    },
    es: {
        musicSubtitle: "Disfruta de música de alta calidad protegida por cifrado resistente a cuánticos en un sistema basado en tiempo",
        streamButton: "Comenzar Streaming",
        viewAllAlbums: "Ver Todos los Álbumes",
        feature1: "Seguridad Cuántico-Resistente",
        feature2: "Pago Basado en Tiempo",
        feature3: "Compartir Ingresos",
        feature4: "Streaming Global",
        featureDesc1: "Cifrado CRYSTALS-DILITHIUM aplicado",
        featureDesc2: "Compra y paga solo por lo que usas",
        featureDesc3: "50:50 participación de ingresos con artistas",
        featureDesc4: "Accesible en cualquier parte del mundo"
    }
};

// Simple user menu toggle
function toggleUserMenu() {
    alert('로그인 페이지로 이동합니다.');
    window.location.href = 'login.html';
}

// Update balance if logged in
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in (simulated)
    const isLoggedIn = localStorage.getItem('tl_loggedIn') === 'true';
    const balanceElement = document.getElementById('balanceAmount');
    
    if (isLoggedIn) {
        // Update user avatar
        document.querySelector('.user-avatar i').className = 'fas fa-user-check';
        
        // Update balance from localStorage or default
        const savedBalance = localStorage.getItem('tl_balance');
        if (savedBalance) {
            balanceElement.textContent = parseInt(savedBalance).toLocaleString();
        }
    } else {
        // Show login button in avatar
        document.querySelector('.user-avatar').title = '로그인하기';
    }
    
    // Initialize language options
    initializeLanguageOptions();
});

// 언어 메뉴 토글
function toggleLanguageMenu() {
    const menu = document.getElementById('languageMenu');
    const chevron = document.querySelector('.current-language i');
    
    menu.classList.toggle('show');
    chevron.style.transform = menu.classList.contains('show') ? 'rotate(180deg)' : 'rotate(0)';
    
    // 외부 클릭시 메뉴 닫기
    if (menu.classList.contains('show')) {
        setTimeout(() => {
            document.addEventListener('click', closeLanguageMenuOnClickOutside);
        }, 0);
    }
}

// 외부 클릭시 언어 메뉴 닫기
function closeLanguageMenuOnClickOutside(event) {
    const menu = document.getElementById('languageMenu');
    const selector = document.querySelector('.language-selector');
    
    if (!selector.contains(event.target) && !menu.contains(event.target)) {
        menu.classList.remove('show');
        document.querySelector('.current-language i').style.transform = 'rotate(0)';
        document.removeEventListener('click', closeLanguageMenuOnClickOutside);
    }
}

// 언어 변경 함수
function changeLanguage(langCode, flag, languageName) {
    currentLanguage = langCode;
    
    // UI 업데이트
    document.querySelector('.lang-flag').textContent = flag;
    document.querySelector('.lang-text').textContent = languageName;
    
    // 선택된 언어 강조 표시
    document.querySelectorAll('.language-option').forEach(option => {
        option.classList.remove('selected');
    });
    event.currentTarget.classList.add('selected');
    
    // 텍스트 번역 적용
    updateTranslations(langCode);
    
    // 메뉴 닫기
    toggleLanguageMenu();
}

// 텍스트 번역 업데이트
function updateTranslations(langCode) {
    const texts = translations[langCode];
    
    // 음악 섹션 텍스트 업데이트
    const subtitle = document.getElementById('musicSubtitle');
    if (subtitle) subtitle.textContent = texts.musicSubtitle;
    
    // 스트리밍 버튼 업데이트
    document.querySelectorAll('.btn-stream').forEach(btn => {
        btn.innerHTML = `<i class="fas fa-headphones"></i> ${texts.streamButton}`;
    });
    
    // 전체 앨범 버튼 업데이트
    const viewAllBtn = document.querySelector('.cta-center .btn');
    if (viewAllBtn) {
        viewAllBtn.innerHTML = `<i class="fas fa-record-vinyl"></i> ${texts.viewAllAlbums}`;
    }
    
    // 기능 텍스트 업데이트
    const features = document.querySelectorAll('.music-features .feature');
    if (features.length >= 4) {
        features[0].querySelector('h4').textContent = texts.feature1;
        features[0].querySelector('p').textContent = texts.featureDesc1;
        
        features[1].querySelector('h4').textContent = texts.feature2;
        features[1].querySelector('p').textContent = texts.featureDesc2;
        
        features[2].querySelector('h4').textContent = texts.feature3;
        features[2].querySelector('p').textContent = texts.featureDesc3;
        
        features[3].querySelector('h4').textContent = texts.feature4;
        features[3].querySelector('p').textContent = texts.featureDesc4;
    }
    
    // 언어 설정 저장
    localStorage.setItem('tl_language', langCode);
}

// 언어 옵션 초기화
function initializeLanguageOptions() {
    const savedLanguage = localStorage.getItem('tl_language') || 'ko';
    
    // 저장된 언어에 따라 초기 설정
    const langData = {
        'ko': { flag: '🇰🇷', name: '한국어' },
        'en': { flag: '🇺🇸', name: 'English' },
        'jp': { flag: '🇯🇵', name: '日本語' },
        'cn': { flag: '🇨🇳', name: '中文' },
        'es': { flag: '🇪🇸', name: 'Español' }
    };
    
    if (langData[savedLanguage]) {
        document.querySelector('.lang-flag').textContent = langData[savedLanguage].flag;
        document.querySelector('.lang-text').textContent = langData[savedLanguage].name;
        updateTranslations(savedLanguage);
        
        // 해당 언어 옵션에 selected 클래스 추가
        document.querySelectorAll('.language-option').forEach(option => {
            if (option.querySelector('.lang-text').textContent === langData[savedLanguage].name) {
                option.classList.add('selected');
            }
        });
    }
}

// 앨범 재생 기능
function playAlbum(albumId) {
    alert(`앨범 ${albumId} 미리듣기 재생 중...`);
    // 실제 구현에서는 오디오 플레이어 API와 통합
}

// 앨범 스트리밍 시작
function streamAlbum(albumId) {
    const isLoggedIn = localStorage.getItem('tl_loggedIn') === 'true';
    
    if (!isLoggedIn) {
        alert('스트리밍을 시작하려면 로그인이 필요합니다.');
        window.location.href = 'login.html';
        return;
    }
    
    const balance = parseInt(localStorage.getItem('tl_balance') || 10000);
    
    if (balance < 5) {
        alert('TL 잔액이 부족합니다. 충전이 필요합니다.');
        window.location.href = 'charge.html';
        return;
    }
    
    // 스트리밍 시작
    alert(`앨범 ${albumId} 스트리밍 시작! TL이 시간당 차감됩니다.`);
    
    // 음악 플레이어 열기
    openMusicPlayer(albumId);
}

// 음악 플레이어 열기
function openMusicPlayer(albumId) {
    // 이미 플레이어가 열려있으면 닫기
    const existingPlayer = document.getElementById('musicPlayer');
    if (existingPlayer) {
        existingPlayer.remove();
    }
    
    const playerHtml = `
        <div class="music-player-overlay" id="musicPlayer">
            <div class="music-player">
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
                                <div class="progress"></div>
                            </div>
                            <div class="time-display">
                                <span class="current-time">0:00</span>
                                <span class="total-time">3:45</span>
                            </div>
                        </div>
                    </div>
                    <div class="player-controls">
                        <button class="control-btn" onclick="skipTrack(-1)"><i class="fas fa-step-backward"></i></button>
                        <button class="control-btn play-btn-large" id="playPauseBtn" onclick="togglePlayPause()"><i class="fas fa-play"></i></button>
                        <button class="control-btn" onclick="skipTrack(1)"><i class="fas fa-step-forward"></i></button>
                        <div class="volume-control">
                            <i class="fas fa-volume-up"></i>
                            <input type="range" min="0" max="100" value="80" class="volume-slider" oninput="changeVolume(this.value)">
                        </div>
                    </div>
                    <div class="tl-consumption">
                        <div class="tl-icon">TL</div>
                        <span>소비량: <strong>0.08 TL/초</strong></span>
                        <span class="balance">잔액: <strong id="playerBalance">${localStorage.getItem('tl_balance') || 10000} TL</strong></span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // 플레이어 추가
    const playerDiv = document.createElement('div');
    playerDiv.innerHTML = playerHtml;
    document.body.appendChild(playerDiv);
    
    // 3초마다 TL 차감 (시뮬레이션)
    startTLDeduction();
    
    // 프로그레스 바 애니메이션
    startProgressAnimation();
}

// TL 차감 시작 (시뮬레이션)
function startTLDeduction() {
    // 기존 인터벌 정리
    if (window.deductionInterval) {
        clearInterval(window.deductionInterval);
    }
    
    window.deductionInterval = setInterval(() => {
        const balanceElement = document.getElementById('playerBalance');
        const currentBalance = parseInt(balanceElement.textContent);
        const newBalance = Math.max(0, currentBalance - 5);
        balanceElement.textContent = newBalance + ' TL';
        
        // 로컬스토리지 업데이트
        localStorage.setItem('tl_balance', newBalance);
        
        // 페이지 내 잔액 표시 업데이트
        const balanceDisplay = document.getElementById('balanceAmount');
        if (balanceDisplay) {
            balanceDisplay.textContent = newBalance.toLocaleString();
        }
        
        // 잔액이 0이 되면 알림
        if (newBalance <= 0) {
            clearInterval(window.deductionInterval);
            alert('TL 잔액이 모두 소진되었습니다. 충전이 필요합니다.');
            closeMusicPlayer();
        }
    }, 3000); // 3초마다 5TL 차감
}

// 프로그레스 바 애니메이션 시작
function startProgressAnimation() {
    const progressBar = document.querySelector('.progress');
    if (!progressBar) return;
    
    let progress = 0;
    const interval = setInterval(() => {
        progress += 1;
        if (progress > 100) {
            progress = 0;
            // 다음 트랙으로 자동 이동 (시뮬레이션)
            skipTrack(1);
        }
        progressBar.style.width = progress + '%';
        
        // 시간 표시 업데이트
        const currentTime = document.querySelector('.current-time');
        const totalTime = document.querySelector('.total-time');
        if (currentTime && totalTime) {
            const currentSeconds = Math.floor(progress * 3.45 / 100);
            currentTime.textContent = formatTime(currentSeconds);
        }
    }, 300);
    
    window.progressInterval = interval;
}

// 시간 형식 변환 (초 -> 분:초)
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// 재생/일시정지 토글
function togglePlayPause() {
    const playPauseBtn = document.getElementById('playPauseBtn');
    const icon = playPauseBtn.querySelector('i');
    
    if (icon.classList.contains('fa-play')) {
        icon.className = 'fas fa-pause';
        // 재생 로직
        if (window.progressInterval) {
            clearInterval(window.progressInterval);
        }
        startProgressAnimation();
        if (window.deductionInterval) {
            clearInterval(window.deductionInterval);
        }
        startTLDeduction();
    } else {
        icon.className = 'fas fa-play';
        // 일시정지 로직
        if (window.progressInterval) {
            clearInterval(window.progressInterval);
        }
        if (window.deductionInterval) {
            clearInterval(window.deductionInterval);
        }
    }
}

// 트랙 스킵
function skipTrack(direction) {
    alert(direction > 0 ? '다음 트랙으로 이동합니다' : '이전 트랙으로 이동합니다');
    // 프로그레스 바 초기화
    const progressBar = document.querySelector('.progress');
    if (progressBar) {
        progressBar.style.width = '0%';
    }
    
    // 시간 표시 초기화
    const currentTime = document.querySelector('.current-time');
    if (currentTime) {
        currentTime.textContent = '0:00';
    }
}

// 볼륨 조절
function changeVolume(value) {
    const volumeIcon = document.querySelector('.volume-control i');
    if (value == 0) {
        volumeIcon.className = 'fas fa-volume-mute';
    } else if (value < 50) {
        volumeIcon.className = 'fas fa-volume-down';
    } else {
        volumeIcon.className = 'fas fa-volume-up';
    }
}

// 음악 플레이어 닫기
function closeMusicPlayer() {
    const player = document.getElementById('musicPlayer');
    if (player) {
        player.remove();
    }
    
    // 모든 인터벌 정리
    if (window.deductionInterval) {
        clearInterval(window.deductionInterval);
    }
    if (window.progressInterval) {
        clearInterval(window.progressInterval);
    }
}

// 페이지 로드시 다국어 데이터 저장
if (typeof translations === 'undefined') {
    window.translations = translations;
}

// 외부 클릭시 메뉴 닫기 이벤트 설정
document.addEventListener('click', function(event) {
    const menu = document.getElementById('languageMenu');
    const selector = document.querySelector('.language-selector');
    
    if (menu && menu.classList.contains('show') && 
        !selector.contains(event.target) && 
        !menu.contains(event.target)) {
        menu.classList.remove('show');
        document.querySelector('.current-language i').style.transform = 'rotate(0)';
    }
});

// ESC 키로 음악 플레이어 닫기
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeMusicPlayer();
    }
});

// 페이지 언로드시 인터벌 정리
window.addEventListener('beforeunload', function() {
    if (window.deductionInterval) {
        clearInterval(window.deductionInterval);
    }
    if (window.progressInterval) {
        clearInterval(window.progressInterval);
    }
});
