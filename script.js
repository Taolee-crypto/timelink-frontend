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
const api = window.hybridAPI || window.timeLinkAPI;
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

async function showDashboard() {
    document.getElementById('landing-page').classList.add('hidden');
    document.getElementById('auth-page').classList.add('hidden');
    document.getElementById('dashboard').classList.remove('hidden');
    await renderDashboard();
}

function resetAuthForm() {
    document.getElementById('email').value = '';
    document.getElementById('password').value = '';
    document.getElementById('name').value = '';
    document.getElementById('auth-error').classList.add('hidden');
}

function toggleUserMenu() {
    const dropdown = document.getElementById('user-menu');
    dropdown.classList.toggle('hidden');
}

// ============================================================================
// AUTH FUNCTIONS (실제 API 연동)
// ============================================================================
function toggleAuthMode() {
    authMode = authMode === 'login' ? 'signup' : 'login';
    
    const title = document.getElementById('auth-subtitle');
    const submitText = document.getElementById('auth-submit-text');
    const toggleBtn = document.getElementById('auth-toggle');
    const roleSelection = document.getElementById('role-selection');
    const nameField = document.getElementById('name-field');
    
    if (authMode === 'login') {
        title.textContent = '계정에 로그인';
        submitText.textContent = '로그인';
        toggleBtn.textContent = '계정이 없으신가요? 가입하기';
        roleSelection.classList.add('hidden');
        nameField.classList.add('hidden');
    } else {
        title.textContent = '새 계정 만들기';
        submitText.textContent = '가입하기';
        toggleBtn.textContent = '이미 계정이 있으신가요? 로그인';
        roleSelection.classList.remove('hidden');
        nameField.classList.remove('hidden');
    }
}

function selectRole(role) {
    selectedRole = role;
    
    // 모든 버튼에서 active 클래스 제거
    document.querySelectorAll('.role-btn').forEach(btn => {
        btn.classList.remove('bg-purple-600', 'text-white');
        btn.classList.add('bg-black', 'bg-opacity-30', 'text-gray-300');
    });
    
    // 선택된 버튼에 active 클래스 추가
    const selectedBtn = document.getElementById(`${role}-btn`);
    selectedBtn.classList.remove('bg-black', 'bg-opacity-30', 'text-gray-300');
    selectedBtn.classList.add('bg-purple-600', 'text-white');
}

async function handleAuth(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const name = document.getElementById('name')?.value || email.split('@')[0];
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const submitText = document.getElementById('auth-submit-text');
    const spinner = document.getElementById('auth-spinner');
    
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
            
            // 기본 지갑 설정
            wallet = {
                earned_tl: 0,
                purchased_tl: 0,
                promo_tl: 10000,
                total: 10000
            };
            tokenManager.setWallet(wallet);
            
            alert('회원가입이 완료되었습니다! 환영합니다.');
        } else {
            // 실제 로그인 API 호출
            response = await api.login({
                email,
                password
            });
            
            // 지갑 정보 로드 시도
            try {
                const walletResponse = await api.getWallet();
                wallet = walletResponse.wallet || wallet;
            } catch (walletError) {
                console.log('지갑 정보를 불러오지 못했습니다. 기본 지갑을 사용합니다.');
            }
        }
        
        currentUser = response.user;
        
        // UI 업데이트
        updateUserUI();
        
        // 대시보드 표시
        await showDashboard();
        
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

async function checkSpotifyVerification() {
    try {
        const response = await api.checkSpotifyStatus();
        isSpotifyVerified = response.verified || false;
        
        if (isSpotifyVerified) {
            document.getElementById('spotify-badge').classList.remove('hidden');
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
    document.getElementById('user-role').textContent = user.role === 'creator' ? '크리에이터' : 
                                                     user.role === 'cafe' ? '카페' : '리스너';
    
    // 사용자 아바타 업데이트
    const userInitial = document.getElementById('user-initial');
    const displayName = user.name || user.email;
    userInitial.textContent = displayName.charAt(0).toUpperCase();
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
    
    if (document.getElementById('listener-earned-tl')) {
        document.getElementById('listener-earned-tl').textContent = wallet.earned_tl.toLocaleString();
    }
}

// ============================================================================
// SPOTIFY VERIFICATION (실제 API 연동)
// ============================================================================
function showSpotifyModal() {
    document.getElementById('spotify-modal').classList.remove('hidden');
    document.getElementById('user-menu').classList.add('hidden');
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
            await renderDashboard();
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
async function renderDashboard() {
    const user = tokenManager.getUser();
    if (!user) {
        showAuth();
        return;
    }
    
    const roleBadge = document.getElementById('role-badge');
    const roleText = user.role === 'creator' ? '크리에이터' : 
                     user.role === 'cafe' ? '카페' : '리스너';
    roleBadge.innerHTML = `<i class="fas fa-user mr-1"></i><span>${roleText}</span>`;
    
    // 지갑 정보 업데이트
    const savedWallet = tokenManager.getWallet();
    if (savedWallet) {
        wallet = savedWallet;
    }
    updateWalletDisplay();
    
    // 대시보드 내용 숨기기
    document.getElementById('creator-dashboard').classList.add('hidden');
    document.getElementById('cafe-dashboard').classList.add('hidden');
    document.getElementById('listener-dashboard').classList.add('hidden');
    
    if (user.role === 'creator') {
        await renderCreatorDashboard();
    } else if (user.role === 'cafe') {
        await renderCafeDashboard();
    } else {
        await renderListenerDashboard();
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
        tl3List = response.tracks || response.assets || [];
    } catch (error) {
        console.error('TL3 목록 조회 실패:', error);
        tl3List = [];
    }
    
    // 통계 업데이트
    document.getElementById('total-tl3').textContent = tl3List.length;
    const totalPlays = tl3List.reduce((sum, t) => sum + (t.playCount || 0), 0);
    document.getElementById('total-plays').textContent = totalPlays;
    const totalScore = tl3List.reduce((sum, t) => sum + (t.contributionScore || 0), 0);
    document.getElementById('contribution-score').textContent = totalScore;
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
        source: document.getElementById('track-source').value || 'Unknown',
        type: 'music',
        format: 'tl3'
    };
    
    try {
        const response = await api.createTL3(trackData);
        const newTrack = response.track || response.asset;
        tl3List.push(newTrack);
        
        e.target.reset();
        toggleConverter();
        
        alert('TL3 변환 완료! 시간을 충전하면 재생할 수 있습니다.');
        await renderCreatorDashboard();
    } catch (error) {
        alert(error.message || 'TL3 변환에 실패했습니다.');
    }
}

function renderTL3List() {
    const container = document.getElementById('tl3-list');
    
    if (tl3List.length === 0) {
        container.innerHTML = `
            <div class="p-6 text-center text-gray-500">
                <i class="fas fa-music text-4xl mb-4 text-gray-300"></i>
                <p>아직 변환된 TL3가 없습니다.</p>
                <p class="text-sm text-gray-400">위에서 새 음악을 변환해보세요!</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = tl3List.map(track => `
        <div class="p-6 hover:bg-gray-50 transition">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div class="flex-1">
                    <h4 class="text-lg font-bold text-gray-900 mb-1">${track.title}</h4>
                    <div class="flex flex-wrap gap-2 text-sm text-gray-600">
                        <span class="bg-purple-100 text-purple-700 px-2 py-1 rounded">${track.mood}</span>
                        <span>${track.bpm || 85} BPM</span>
                        <span>·</span>
                        <span>${Math.floor((track.length || 180) / 60)}:${((track.length || 180) % 60).toString().padStart(2, '0')}</span>
                        <span>·</span>
                        <span class="text-gray-500">${track.source || 'Unknown'}</span>
                    </div>
                    <div class="mt-2 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                        <div>
                            <div class="text-gray-500">충전 시간</div>
                            <div class="font-semibold text-green-600">${Math.floor((track.timeCharged || 0) / 60)}:${((track.timeCharged || 0) % 60).toString().padStart(2, '0')}</div>
                        </div>
                        <div>
                            <div class="text-gray-500">재생 횟수</div>
                            <div class="font-semibold">${track.playCount || 0}</div>
                        </div>
                        <div>
                            <div class="text-gray-500">카페 방송</div>
                            <div class="font-semibold">${track.cafePlayCount || 0}</div>
                        </div>
                        <div>
                            <div class="text-gray-500">기여 점수</div>
                            <div class="font-semibold text-blue-600">${track.contributionScore || 0}</div>
                        </div>
                    </div>
                </div>
                <div class="flex flex-col gap-2">
                    <button onclick="chargeTime('${track.id}', 60)" class="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition text-sm">
                        <i class="fas fa-bolt mr-1"></i>1분 충전 (10 TL)
                    </button>
                    <button onclick="chargeTime('${track.id}', 300)" class="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600 transition text-sm">
                        <i class="fas fa-bolt mr-1"></i>5분 충전 (50 TL)
                    </button>
                    <button onclick="simulatePlay('${track.id}')" ${!track.timeCharged || track.timeCharged === 0 ? 'disabled' : ''} class="${track.timeCharged > 0 ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-300 cursor-not-allowed'} text-white px-4 py-2 rounded-lg font-medium transition text-sm">
                        <i class="fas fa-play mr-1"></i>재생 시뮬레이션
                    </button>
                </div>
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
        // TL 차감 API 호출
        const chargeResponse = await api.chargeTL({
            amount: cost,
            type: 'tl3_charge',
            metadata: { trackId, seconds }
        });
        
        // TL3 시간 충전 API 호출
        const timeResponse = await api.chargeTL3Time(trackId, seconds);
        
        wallet = chargeResponse.wallet || wallet;
        
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
    const trackIndex = tl3List.findIndex(t => t.id === trackId);
    
    if (!tl3List[trackIndex].timeCharged || tl3List[trackIndex].timeCharged === 0) return;
    
    try {
        const response = await api.playTL3(trackId);
        
        // 트랙 정보 업데이트
        if (response.track) {
            tl3List[trackIndex] = response.track;
        }
        
        // 보상 지급
        if (response.wallet) {
            wallet = response.wallet;
            updateWalletDisplay();
        }
        
        alert('재생 완료! +2 TL (환전 가능) 기여 보상 획득');
        await renderCreatorDashboard();
    } catch (error) {
        alert(error.message || '재생에 실패했습니다.');
    }
}

// ============================================================================
// CAFE DASHBOARD (실제 API 연동)
// ============================================================================
async function renderCafeDashboard() {
    const container = document.getElementById('cafe-dashboard');
    container.classList.remove('hidden');
    
    // 방송 시간 표시 업데이트
    document.getElementById('broadcast-time').textContent = 
        `${Math.floor(broadcastTime / 60)}:${(broadcastTime % 60).toString().padStart(2, '0')}`;
    document.getElementById('tl-spent').textContent = tlSpent + ' TL';
    
    // 방송 상태 업데이트
    const broadcastStatus = document.getElementById('broadcast-status');
    const broadcastBtn = document.getElementById('broadcast-btn');
    const broadcastIcon = document.getElementById('broadcast-icon');
    const broadcastBtnText = document.getElementById('broadcast-btn-text');
    
    if (broadcasting) {
        broadcastStatus.textContent = '● 방송 중';
        broadcastStatus.className = 'text-2xl font-bold text-green-600';
        broadcastBtn.className = 'w-full py-4 rounded-lg font-semibold transition btn-hover flex items-center justify-center space-x-3 bg-red-600 hover:bg-red-700 text-white';
        broadcastIcon.className = 'fas fa-stop';
        broadcastBtnText.textContent = '방송 중단';
    } else {
        broadcastStatus.textContent = '○ 대기 중';
        broadcastStatus.className = 'text-2xl font-bold text-gray-400';
        broadcastBtn.className = 'w-full py-4 rounded-lg font-semibold transition btn-hover flex items-center justify-center space-x-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white';
        broadcastIcon.className = 'fas fa-play';
        broadcastBtnText.textContent = '방송 시작';
    }
    
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
                            await api.stopBroadcast();
                            alert('TL 차감에 실패하여 방송이 중단되었습니다');
                            await renderCafeDashboard();
                        }
                    } else {
                        clearInterval(broadcastInterval);
                        broadcasting = false;
                        await api.stopBroadcast();
                        alert('TL이 부족하여 방송이 중단되었습니다');
                        await renderCafeDashboard();
                    }
                }
            }, 1000);
            
            await renderCafeDashboard();
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
        
        await renderCafeDashboard();
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
        const response = await api.getRecommendedTracks();
        tracks = response.tracks || [];
    } catch (error) {
        console.error('추천 트랙 조회 실패:', error);
        // 샘플 데이터
        tracks = [
            { id: '1', title: 'Chill Vibes #01', mood: 'Relaxed', bpm: 85, creator: 'Creator A', likes: 142, length: 180 },
            { id: '2', title: 'Energy Boost', mood: 'Energetic', bpm: 128, creator: 'Creator B', likes: 89, length: 210 },
            { id: '3', title: 'Focus Flow', mood: 'Focus', bpm: 95, creator: 'Creator C', likes: 203, length: 240 },
            { id: '4', title: 'Happy Day', mood: 'Happy', bpm: 110, creator: 'Creator A', likes: 156, length: 195 }
        ];
    }
    
    // 재생 시간 표시 업데이트
    document.getElementById('play-time').textContent = 
        `${Math.floor(playTime / 60)}:${(playTime % 60).toString().padStart(2, '0')}`;
    
    // 재생 상태 업데이트
    const playStatus = document.getElementById('play-status');
    if (playing) {
        playStatus.textContent = '● Playing';
        playStatus.className = 'text-2xl font-bold text-green-600';
    } else {
        playStatus.textContent = '○ Stopped';
        playStatus.className = 'text-2xl font-bold text-gray-400';
    }
    
    // 트랙 목록 렌더링
    const tracksList = document.getElementById('tracks-list');
    if (tracks.length === 0) {
        tracksList.innerHTML = `
            <div class="p-6 text-center text-gray-500">
                <i class="fas fa-music text-4xl mb-4 text-gray-300"></i>
                <p>추천 음악이 없습니다</p>
            </div>
        `;
        return;
    }
    
    tracksList.innerHTML = tracks.map(track => `
        <div class="p-6 hover:bg-gray-50 transition">
            <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div class="flex items-center space-x-4 flex-1">
                    <button onclick="togglePlay('${track.id}')" class="w-12 h-12 rounded-full flex items-center justify-center transition ${playing === track.id ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-purple-600 hover:bg-purple-700 text-white'}">
                        <i class="fas ${playing === track.id ? 'fa-pause' : 'fa-play'} ${playing === track.id ? '' : 'ml-0.5'}"></i>
                    </button>
                    <div class="flex-1">
                        <h4 class="text-lg font-bold text-gray-900">${track.title}</h4>
                        <div class="flex flex-wrap gap-2 text-sm text-gray-600 mt-1">
                            <span class="bg-purple-100 text-purple-700 px-2 py-1 rounded">${track.mood}</span>
                            <span>${track.bpm} BPM</span>
                            <span>·</span>
                            <span class="text-gray-500">by ${track.creator}</span>
                        </div>
                    </div>
                </div>
                <div class="flex items-center space-x-3">
                    <button onclick="likeTrack('${track.id}')" class="flex items-center space-x-1 text-gray-600 hover:text-red-500 transition">
                        <i class="fas fa-heart"></i>
                        <span class="text-sm">${track.likes || 0}</span>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

async function togglePlay(trackId) {
    if (playing === trackId) {
        // 재생 중지
        clearInterval(playInterval);
        playing = null;
        await renderListenerDashboard();
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
            
            await renderListenerDashboard();
        } catch (error) {
            alert(error.message || '재생에 실패했습니다.');
            playing = null;
            await renderListenerDashboard();
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
        await renderListenerDashboard();
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
            const savedWallet = tokenManager.getWallet();
            if (savedWallet) {
                wallet = savedWallet;
            }
            
            // Spotify 인증 확인
            if (currentUser.role === 'creator') {
                await checkSpotifyVerification();
            }
            
            // 대시보드 표시
            await showDashboard();
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
        const userMenu = document.getElementById('user-menu');
        const userBtn = document.querySelector('.user-btn');
        
        if (userMenu && userBtn && !userMenu.contains(event.target) && !userBtn.contains(event.target)) {
            userMenu.classList.add('hidden');
        }
        
        // 모달 외부 클릭 닫기
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            const modalContent = modal.querySelector('div > div');
            if (modalContent && !modalContent.contains(event.target) && !modal.classList.contains('hidden')) {
                modal.classList.add('hidden');
            }
        });
    });
});
