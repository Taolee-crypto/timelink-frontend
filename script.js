// ============================================================================
// STATE MANAGEMENT
// ============================================================================
let authMode = 'login';
let selectedRole = 'listener';
let currentUser = null;
let wallet = {
    earned_tl: 0,
    purchased_tl: 0,
    promo_tl: 10000,
    total: 10000
};
let tl3List = [];
let broadcasting = false;
let broadcastInterval = null;
let broadcastTime = 0;
let tlSpent = 0;
let playing = null;
let playInterval = null;
let playTime = 0;
let isSpotifyVerified = false;

// API 객체
const api = window.timeLinkAPI;
const tokenManager = window.tokenManager;

// ============================================================================
// NAVIGATION
// ============================================================================
function showLanding() {
    document.getElementById('landing-page').classList.remove('hidden');
    document.getElementById('auth-page').classList.add('hidden');
    document.getElementById('dashboard').classList.add('hidden');
}

function showAuth() {
    document.getElementById('landing-page').classList.add('hidden');
    document.getElementById('auth-page').classList.remove('hidden');
    document.getElementById('dashboard').classList.add('hidden');
    resetAuthForm();
}

function showDashboard() {
    document.getElementById('landing-page').classList.add('hidden');
    document.getElementById('auth-page').classList.add('hidden');
    document.getElementById('dashboard').classList.remove('hidden');
    renderDashboard();
}

function resetAuthForm() {
    document.getElementById('email').value = '';
    document.getElementById('password').value = '';
    document.getElementById('name').value = '';
    document.getElementById('auth-error').classList.add('hidden');
}

function toggleUserMenu() {
    const dropdown = document.getElementById('user-dropdown');
    dropdown.classList.toggle('hidden');
}

// ============================================================================
// AUTH FUNCTIONS (실제 API 연동)
// ============================================================================
function toggleAuthMode() {
    authMode = authMode === 'login' ? 'signup' : 'login';
    
    const title = document.getElementById('auth-title');
    const subtitle = document.getElementById('auth-subtitle');
    const submitText = document.getElementById('submit-text');
    const toggleBtn = document.getElementById('toggle-btn');
    const roleSelection = document.getElementById('role-selection');
    const nameGroup = document.getElementById('name-group');
    
    if (authMode === 'login') {
        title.textContent = '계정에 로그인';
        subtitle.textContent = 'TIMELINK 플랫폼에 오신 것을 환영합니다';
        submitText.textContent = '로그인';
        toggleBtn.textContent = '계정이 없으신가요? 가입하기';
        roleSelection.classList.add('hidden');
        nameGroup.classList.add('hidden');
    } else {
        title.textContent = '새 계정 만들기';
        subtitle.textContent = 'TIMELINK 플랫폼에 가입하세요';
        submitText.textContent = '가입하기';
        toggleBtn.textContent = '이미 계정이 있으신가요? 로그인';
        roleSelection.classList.remove('hidden');
        nameGroup.classList.remove('hidden');
    }
}

function selectRole(role) {
    selectedRole = role;
    
    document.querySelectorAll('.role-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    document.getElementById(`${role}-btn`).classList.add('active');
}

async function handleAuth(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const name = document.getElementById('name')?.value || email.split('@')[0];
    
    const submitBtn = document.getElementById('submit-btn');
    const submitText = document.getElementById('submit-text');
    const spinner = document.getElementById('submit-spinner');
    
    submitText.textContent = authMode === 'login' ? '로그인 중...' : '가입 중...';
    spinner.classList.remove('hidden');
    submitBtn.disabled = true;
    
    try {
        let response;
        
        if (authMode === 'signup') {
            // 실제 회원가입 API 호출
            response = await api.signup({
                email,
                password,
                name,
                role: selectedRole
            });
        } else {
            // 실제 로그인 API 호출
            response = await api.login({
                email,
                password
            });
        }
        
        currentUser = response.user;
        
        // 지갑 정보 가져오기
        await fetchWallet();
        
        // UI 업데이트
        updateUserUI();
        
        // 대시보드 표시
        showDashboard();
        
        // 크리에이터는 Spotify 인증 확인
        if (currentUser.role === 'creator') {
            await checkSpotifyVerification();
            if (!isSpotifyVerified) {
                setTimeout(() => {
                    showSpotifyModal();
                }, 1000);
            }
        }
        
    } catch (error) {
        showError(error.message || '인증에 실패했습니다. 다시 시도해주세요.');
    } finally {
        submitText.textContent = authMode === 'login' ? '로그인' : '가입하기';
        spinner.classList.add('hidden');
        submitBtn.disabled = false;
    }
}

async function fetchWallet() {
    try {
        const response = await api.getWallet();
        wallet = response.wallet || wallet;
        updateWalletDisplay();
    } catch (error) {
        console.error('지갑 정보 조회 실패:', error);
        // 기본 지갑 사용
        updateWalletDisplay();
    }
}

async function checkSpotifyVerification() {
    try {
        const user = tokenManager.getUser();
        if (user && user.role === 'creator') {
            // TODO: Spotify 인증 상태 확인 API 호출
            // 임시로 false 반환
            isSpotifyVerified = false;
        }
    } catch (error) {
        console.error('Spotify 인증 확인 실패:', error);
        isSpotifyVerified = false;
    }
}

function updateUserUI() {
    const user = tokenManager.getUser();
    if (!user) return;
    
    document.getElementById('user-email').textContent = user.email;
    document.getElementById('user-name').textContent = user.name || user.email.split('@')[0];
    document.getElementById('user-role-text').textContent = 
        user.role === 'creator' ? '크리에이터' : 
        user.role === 'cafe' ? '카페' : '리스너';
    
    // 사용자 아바타 업데이트
    const userAvatar = document.querySelector('.user-avatar i');
    if (userAvatar) {
        const displayName = user.name || user.email;
        userAvatar.textContent = displayName.charAt(0).toUpperCase();
    }
}

function showError(message) {
    const errorDiv = document.getElementById('auth-error');
    const errorMessage = document.getElementById('error-message');
    
    errorMessage.textContent = message;
    errorDiv.classList.remove('hidden');
}

function logout() {
    tokenManager.clearToken();
    currentUser = null;
    wallet = { earned_tl: 0, purchased_tl: 0, promo_tl: 0, total: 0 };
    tl3List = [];
    broadcasting = false;
    playing = null;
    
    if (broadcastInterval) clearInterval(broadcastInterval);
    if (playInterval) clearInterval(playInterval);
    
    showLanding();
}

// ============================================================================
// WALLET FUNCTIONS (실제 API 연동)
// ============================================================================
async function watchAd() {
    try {
        const response = await api.watchAd();
        wallet = response.wallet || wallet;
        updateWalletDisplay();
        
        alert('광고 시청 완료! +50 TL (환전 불가) 획득');
    } catch (error) {
        alert(error.message || '광고 시청에 실패했습니다.');
    }
}

function updateWalletDisplay() {
    document.getElementById('total-tl').textContent = wallet.total.toLocaleString() + ' TL';
    document.getElementById('earned-tl').textContent = wallet.earned_tl.toLocaleString() + ' TL';
    
    if (document.getElementById('earned-tl-stat')) {
        document.getElementById('earned-tl-stat').textContent = wallet.earned_tl.toLocaleString();
    }
}

// ============================================================================
// SPOTIFY VERIFICATION (실제 API 연동)
// ============================================================================
function showSpotifyModal() {
    document.getElementById('spotify-modal').classList.remove('hidden');
    document.getElementById('user-dropdown').classList.add('hidden');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
}

function connectSpotify() {
    document.getElementById('spotify-connect-section').classList.add('hidden');
    document.getElementById('spotify-auth-section').classList.remove('hidden');
}

async function verifySpotify() {
    const authCode = document.getElementById('spotify-auth-code').value;
    
    if (!authCode) {
        alert('Spotify Auth Code를 입력해주세요.');
        return;
    }
    
    try {
        const response = await api.verifySpotify({
            authCode,
            userId: currentUser.id
        });
        
        isSpotifyVerified = true;
        document.getElementById('spotify-badge').classList.remove('hidden');
        closeModal('spotify-modal');
        
        if (document.getElementById('spotify-prompt')) {
            document.getElementById('spotify-prompt').classList.add('hidden');
        }
        
        alert('Spotify 인증이 완료되었습니다! 이제 TL3 변환이 가능합니다.');
        
        if (currentUser.role === 'creator') {
            renderDashboard();
        }
    } catch (error) {
        alert(error.message || 'Spotify 인증에 실패했습니다.');
    }
}

// ============================================================================
// EXCHANGE FUNCTIONS (실제 API 연동)
// ============================================================================
function showExchangeModal() {
    document.getElementById('exchange-available').textContent = wallet.earned_tl.toLocaleString() + ' TL';
    document.getElementById('exchange-amount').value = '';
    document.getElementById('exchange-estimate').textContent = '0 KRW';
    document.getElementById('exchange-modal').classList.remove('hidden');
    
    const amountInput = document.getElementById('exchange-amount');
    amountInput.max = wallet.earned_tl;
    
    amountInput.addEventListener('input', function() {
        const amount = parseInt(this.value) || 0;
        if (amount > wallet.earned_tl) {
            this.value = wallet.earned_tl;
        }
        document.getElementById('exchange-estimate').textContent = (amount || 0).toLocaleString() + ' KRW';
    });
}

async function processExchange() {
    const amount = parseInt(document.getElementById('exchange-amount').value);
    
    if (!amount || amount <= 0) {
        alert('환전할 금액을 입력해주세요.');
        return;
    }
    
    if (amount > wallet.earned_tl) {
        alert('환전 가능한 금액을 초과했습니다.');
        return;
    }
    
    try {
        const response = await api.requestExchange({
            amount,
            currency: 'KRW'
        });
        
        wallet = response.wallet || wallet;
        updateWalletDisplay();
        
        closeModal('exchange-modal');
        alert(`${amount} TL 환전 신청이 완료되었습니다. 처리에는 3-5 영업일이 소요됩니다.`);
    } catch (error) {
        alert(error.message || '환전 신청에 실패했습니다.');
    }
}

// ============================================================================
// DASHBOARD RENDERING
// ============================================================================
function renderDashboard() {
    const user = tokenManager.getUser();
    if (!user) {
        showAuth();
        return;
    }
    
    const roleBadge = document.getElementById('role-badge');
    roleBadge.innerHTML = `
        <i class="fas fa-user"></i>
        <span>${user.role === 'creator' ? '크리에이터' : 
                user.role === 'cafe' ? '카페' : '리스너'}</span>
    `;
    
    updateWalletDisplay();
    
    document.getElementById('creator-dashboard').classList.add('hidden');
    document.getElementById('cafe-dashboard').classList.add('hidden');
    document.getElementById('listener-dashboard').classList.add('hidden');
    
    if (user.role === 'creator') {
        renderCreatorDashboard();
    } else if (user.role === 'cafe') {
        renderCafeDashboard();
    } else {
        renderListenerDashboard();
    }
}

// ============================================================================
// CREATOR DASHBOARD (실제 API 연동)
// ============================================================================
async function renderCreatorDashboard() {
    const container = document.getElementById('creator-dashboard');
    container.classList.remove('hidden');
    
    // TL3 목록 로드
    try {
        const response = await api.getTL3List();
        tl3List = response.tracks || [];
    } catch (error) {
        console.error('TL3 목록 조회 실패:', error);
        tl3List = [];
    }
    
    // 통계 업데이트
    document.getElementById('total-tl3').textContent = tl3List.length;
    document.getElementById('total-plays').textContent = tl3List.reduce((sum, t) => sum + (t.playCount || 0), 0);
    document.getElementById('contribution-score').textContent = tl3List.reduce((sum, t) => sum + (t.contributionScore || 0), 0);
    document.getElementById('earned-tl-stat').textContent = wallet.earned_tl.toLocaleString();
    
    // Spotify 프롬프트 표시/숨김
    const spotifyPrompt = document.getElementById('spotify-prompt');
    if (!isSpotifyVerified) {
        spotifyPrompt.classList.remove('hidden');
    } else {
        spotifyPrompt.classList.add('hidden');
    }
    
    // TL3 목록 렌더링
    renderTL3List();
}

function toggleConverter() {
    const form = document.getElementById('converter-form');
    form.classList.toggle('hidden');
}

async function convertToTL3(e) {
    e.preventDefault();
    
    if (!isSpotifyVerified) {
        alert('TL3 변환을 위해서는 Spotify 인증이 필요합니다.');
        showSpotifyModal();
        return;
    }
    
    const trackData = {
        title: document.getElementById('track-title').value,
        mood: document.getElementById('track-mood').value,
        bpm: parseInt(document.getElementById('track-bpm').value),
        length: parseInt(document.getElementById('track-length').value),
        source: document.getElementById('track-source').value || 'Unknown'
    };
    
    try {
        const response = await api.createTL3(trackData);
        tl3List.push(response.track);
        
        e.target.reset();
        toggleConverter();
        
        alert('TL3 변환 완료! 시간을 충전하면 재생할 수 있습니다.');
        renderCreatorDashboard();
    } catch (error) {
        alert(error.message || 'TL3 변환에 실패했습니다.');
    }
}

function renderTL3List() {
    const container = document.getElementById('tl3-list');
    
    if (tl3List.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-music"></i>
                <p>아직 변환된 TL3가 없습니다</p>
                <p class="subtext">위에서 새 음악을 변환해보세요!</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = tl3List.map(track => `
        <div class="tl3-item">
            <div class="tl3-header">
                <h3>${track.title}</h3>
                <div class="tl3-tags">
                    <span class="tag mood">${track.mood}</span>
                    <span class="tag bpm">${track.bpm} BPM</span>
                    <span class="tag source">${track.source}</span>
                </div>
            </div>
            <div class="tl3-stats">
                <div class="stat">
                    <span class="stat-label">충전 시간</span>
                    <span class="stat-value green">${Math.floor((track.timeCharged || 0) / 60)}:${((track.timeCharged || 0) % 60).toString().padStart(2, '0')}</span>
                </div>
                <div class="stat">
                    <span class="stat-label">재생 횟수</span>
                    <span class="stat-value">${track.playCount || 0}</span>
                </div>
                <div class="stat">
                    <span class="stat-label">카페 방송</span>
                    <span class="stat-value">${track.cafePlayCount || 0}</span>
                </div>
                <div class="stat">
                    <span class="stat-label">기여 점수</span>
                    <span class="stat-value blue">${track.contributionScore || 0}</span>
                </div>
            </div>
            <div class="tl3-actions">
                <button onclick="chargeTime('${track.id}', 60)" class="action-btn small">
                    <i class="fas fa-bolt"></i>
                    1분 충전 (10 TL)
                </button>
                <button onclick="chargeTime('${track.id}', 300)" class="action-btn small">
                    <i class="fas fa-bolt"></i>
                    5분 충전 (50 TL)
                </button>
                <button onclick="simulatePlay('${track.id}')" ${!track.timeCharged || track.timeCharged === 0 ? 'disabled' : ''} class="action-btn small ${track.timeCharged > 0 ? 'play-btn' : 'disabled-btn'}">
                    <i class="fas fa-play"></i>
                    재생 시뮬레이션
                </button>
            </div>
        </div>
    `).join('');
}

async function chargeTime(trackId, seconds) {
    const cost = Math.ceil(seconds / 60) * 10;
    
    if (wallet.total < cost) {
        alert('TL이 부족합니다');
        return;
    }
    
    try {
        const response = await api.chargeTL({
            trackId,
            seconds,
            amount: cost
        });
        
        wallet = response.wallet || wallet;
        
        const trackIndex = tl3List.findIndex(t => t.id === trackId);
        if (trackIndex > -1) {
            tl3List[trackIndex].timeCharged = (tl3List[trackIndex].timeCharged || 0) + seconds;
        }
        
        updateWalletDisplay();
        renderTL3List();
        
        alert(`${seconds}초 충전 완료! -${cost} TL`);
    } catch (error) {
        alert(error.message || '시간 충전에 실패했습니다.');
    }
}

async function simulatePlay(trackId) {
    try {
        const response = await api.listenTrack({
            trackId,
            action: 'play'
        });
        
        const trackIndex = tl3List.findIndex(t => t.id === trackId);
        if (trackIndex > -1 && response.track) {
            tl3List[trackIndex] = response.track;
        }
        
        if (response.wallet) {
            wallet = response.wallet;
            updateWalletDisplay();
        }
        
        alert('재생 완료! +2 TL (환전 가능) 기여 보상 획득');
        renderCreatorDashboard();
    } catch (error) {
        alert(error.message || '재생에 실패했습니다.');
    }
}

// ============================================================================
// CAFE DASHBOARD (실제 API 연동)
// ============================================================================
function renderCafeDashboard() {
    const container = document.getElementById('cafe-dashboard');
    container.classList.remove('hidden');
    
    // 방송 시간 표시 업데이트
    document.getElementById('broadcast-time').textContent = 
        `${Math.floor(broadcastTime / 60)}:${(broadcastTime % 60).toString().padStart(2, '0')}`;
    document.getElementById('tl-spent').textContent = tlSpent + ' TL';
    
    // 현재 재생 중 표시/숨김
    const nowPlaying = document.getElementById('now-playing');
    if (broadcasting) {
        nowPlaying.classList.remove('hidden');
    } else {
        nowPlaying.classList.add('hidden');
    }
}

async function toggleBroadcast() {
    if (!broadcasting) {
        // 방송 시작
        const mood = document.getElementById('cafe-mood').value;
        
        if (!mood) {
            alert('무드를 선택해주세요.');
            return;
        }
        
        if (wallet.total < 10) {
            alert('방송을 시작하려면 최소 10 TL이 필요합니다');
            return;
        }
        
        try {
            await api.startBroadcast({
                mood,
                cafeId: currentUser.id
            });
            
            broadcasting = true;
            broadcastTime = 0;
            tlSpent = 0;
            
            broadcastInterval = setInterval(async () => {
                broadcastTime++;
                
                document.getElementById('broadcast-time').textContent = 
                    `${Math.floor(broadcastTime / 60)}:${(broadcastTime % 60).toString().padStart(2, '0')}`;
                
                // 10초마다 TL 차감
                if (broadcastTime % 10 === 0 && broadcastTime > 0) {
                    const cost = 10;
                    if (wallet.total >= cost) {
                        try {
                            const response = await api.chargeTL({
                                amount: cost,
                                type: 'broadcast'
                            });
                            
                            wallet = response.wallet || wallet;
                            tlSpent += cost;
                            
                            document.getElementById('tl-spent').textContent = tlSpent + ' TL';
                            updateWalletDisplay();
                        } catch (error) {
                            console.error('TL 차감 실패:', error);
                            clearInterval(broadcastInterval);
                            broadcasting = false;
                            alert('TL 차감에 실패하여 방송이 중단되었습니다');
                            renderCafeDashboard();
                        }
                    } else {
                        clearInterval(broadcastInterval);
                        broadcasting = false;
                        await api.stopBroadcast();
                        alert('TL이 부족하여 방송이 중단되었습니다');
                        renderCafeDashboard();
                    }
                }
            }, 1000);
            
            renderCafeDashboard();
        } catch (error) {
            alert(error.message || '방송 시작에 실패했습니다.');
        }
    } else {
        // 방송 중단
        clearInterval(broadcastInterval);
        broadcasting = false;
        
        try {
            await api.stopBroadcast();
        } catch (error) {
            console.error('방송 중단 실패:', error);
        }
        
        renderCafeDashboard();
    }
}

// ============================================================================
// LISTENER DASHBOARD (실제 API 연동)
// ============================================================================
async function renderListenerDashboard() {
    const container = document.getElementById('listener-dashboard');
    container.classList.remove('hidden');
    
    // 추천 트랙 로드
    let tracks = [];
    try {
        const response = await api.getTL3List();
        tracks = response.tracks || [];
    } catch (error) {
        console.error('추천 트랙 조회 실패:', error);
        tracks = [];
    }
    
    // 재생 시간 표시 업데이트
    document.getElementById('play-time').textContent = 
        `${Math.floor(playTime / 60)}:${(playTime % 60).toString().padStart(2, '0')}`;
    
    // 트랙 목록 렌더링
    const tracksList = document.getElementById('tracks-list');
    if (tracks.length === 0) {
        tracksList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-music"></i>
                <p>추천 음악이 없습니다</p>
            </div>
        `;
        return;
    }
    
    tracksList.innerHTML = tracks.map(track => `
        <div class="track-item">
            <div class="track-info">
                <button onclick="togglePlay('${track.id}')" class="play-btn ${playing === track.id ? 'playing' : ''}">
                    <i class="fas ${playing === track.id ? 'fa-pause' : 'fa-play'}"></i>
                </button>
                <div class="track-details">
                    <h3>${track.title}</h3>
                    <div class="track-meta">
                        <span class="mood">${track.mood}</span>
                        <span class="bpm">${track.bpm} BPM</span>
                        <span class="creator">by ${track.creator || 'Unknown'}</span>
                    </div>
                </div>
            </div>
            <div class="track-actions">
                <button onclick="likeTrack('${track.id}')" class="like-btn">
                    <i class="fas fa-heart"></i>
                    <span>${track.likes || 0}</span>
                </button>
            </div>
        </div>
    `).join('');
}

async function togglePlay(trackId) {
    if (playing === trackId) {
        // 재생 중지
        clearInterval(playInterval);
        playing = null;
        renderListenerDashboard();
    } else {
        // 재생 시작
        if (playing) {
            clearInterval(playInterval);
        }
        
        playing = trackId;
        playTime = 0;
        
        try {
            await api.listenTrack({
                trackId,
                action: 'play'
            });
            
            playInterval = setInterval(async () => {
                playTime++;
                
                document.getElementById('play-time').textContent = 
                    `${Math.floor(playTime / 60)}:${(playTime % 60).toString().padStart(2, '0')}`;
                
                // 30초마다 TL 획득
                if (playTime % 30 === 0 && playTime > 0) {
                    try {
                        const response = await api.chargeTL({
                            amount: 1,
                            type: 'listening_reward'
                        });
                        
                        if (response.wallet) {
                            wallet = response.wallet;
                            updateWalletDisplay();
                        }
                    } catch (error) {
                        console.error('TL 획득 실패:', error);
                    }
                }
            }, 1000);
            
            renderListenerDashboard();
        } catch (error) {
            alert(error.message || '재생에 실패했습니다.');
            playing = null;
            renderListenerDashboard();
        }
    }
}

async function likeTrack(trackId) {
    try {
        const response = await api.likeTrack(trackId);
        
        if (response.wallet) {
            wallet = response.wallet;
            updateWalletDisplay();
        }
        
        alert('좋아요 완료! +1 TL 획득');
    } catch (error) {
        alert(error.message || '좋아요에 실패했습니다.');
    }
}

// ============================================================================
// INITIALIZATION
// ============================================================================
document.addEventListener('DOMContentLoaded', async () => {
    // 토큰 확인 및 자동 로그인
    if (tokenManager.isAuthenticated()) {
        try {
            // 토큰 검증
            await api.verifyToken();
            
            // 사용자 정보 로드
            currentUser = tokenManager.getUser();
            
            // 지갑 정보 로드
            await fetchWallet();
            
            // Spotify 인증 확인
            if (currentUser.role === 'creator') {
                await checkSpotifyVerification();
            }
            
            // 대시보드 표시
            showDashboard();
            return;
        } catch (error) {
            console.error('자동 로그인 실패:', error);
            tokenManager.clearToken();
        }
    }
    
    // 로그인되지 않은 상태면 랜딩 페이지 표시
    showLanding();
    
    // 드롭다운 외부 클릭 닫기
    document.addEventListener('click', (event) => {
        const userMenu = document.getElementById('user-dropdown');
        const userBtn = document.querySelector('.user-btn');
        
        if (userMenu && !userMenu.contains(event.target) && !userBtn.contains(event.target)) {
            userMenu.classList.add('hidden');
        }
        
        // 모달 외부 클릭 닫기
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (!modal.contains(event.target) && !modal.classList.contains('hidden')) {
                modal.classList.add('hidden');
            }
        });
    });
});
