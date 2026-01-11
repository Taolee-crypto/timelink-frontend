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
// AUTH FUNCTIONS
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
        let userData;
        
        if (authMode === 'signup') {
            userData = await mockApi.signup(email, password, name, selectedRole);
        } else {
            userData = await mockApi.login(email, password);
        }
        
        currentUser = userData.user;
        
        // Initialize wallet for new users
        if (authMode === 'signup') {
            wallet = {
                earned_tl: 0,
                purchased_tl: 0,
                promo_tl: 10000,
                total: 10000
            };
        } else {
            // For login, get wallet from API
            wallet = await mockApi.getWallet(currentUser.id);
        }
        
        // Update UI
        document.getElementById('user-email').textContent = currentUser.email;
        document.getElementById('user-name').textContent = currentUser.name || currentUser.email.split('@')[0];
        document.getElementById('user-role-text').textContent = 
            currentUser.role === 'creator' ? '크리에이터' : 
            currentUser.role === 'cafe' ? '카페' : '리스너';
        
        // Initialize user avatar
        const userInitial = document.querySelector('.user-avatar i');
        if (userInitial) {
            userInitial.textContent = (currentUser.name || currentUser.email).charAt(0).toUpperCase();
        }
        
        // Check Spotify verification
        if (currentUser.role === 'creator') {
            const spotifyData = await mockApi.checkSpotifyVerification(currentUser.id);
            isSpotifyVerified = spotifyData.verified;
        }
        
        showDashboard();
        
        // Show Spotify modal for creators
        if (currentUser.role === 'creator' && !isSpotifyVerified) {
            setTimeout(() => {
                showSpotifyModal();
            }, 1000);
        }
        
    } catch (error) {
        showError(error.message);
    } finally {
        submitText.textContent = authMode === 'login' ? '로그인' : '가입하기';
        spinner.classList.add('hidden');
        submitBtn.disabled = false;
    }
}

function showError(message) {
    const errorDiv = document.getElementById('auth-error');
    const errorMessage = document.getElementById('error-message');
    
    errorMessage.textContent = message;
    errorDiv.classList.remove('hidden');
}

function logout() {
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
// WALLET FUNCTIONS
// ============================================================================
async function watchAd() {
    try {
        const result = await mockApi.watchAd(currentUser.id);
        wallet = result.wallet;
        updateWalletDisplay();
        
        alert('광고 시청 완료! +50 TL (환전 불가) 획득');
    } catch (error) {
        alert(error.message);
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
// SPOTIFY VERIFICATION
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
        const result = await mockApi.verifySpotify(currentUser.id, authCode);
        isSpotifyVerified = result.verified;
        
        document.getElementById('spotify-badge').classList.remove('hidden');
        document.getElementById('spotify-modal').classList.add('hidden');
        
        if (document.getElementById('spotify-prompt')) {
            document.getElementById('spotify-prompt').classList.add('hidden');
        }
        
        alert('Spotify 인증이 완료되었습니다! 이제 TL3 변환이 가능합니다.');
        
        if (currentUser.role === 'creator') {
            renderDashboard();
        }
    } catch (error) {
        alert(error.message);
    }
}

// ============================================================================
// EXCHANGE FUNCTIONS
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
        const result = await mockApi.exchangeTL(currentUser.id, amount);
        wallet = result.wallet;
        updateWalletDisplay();
        
        closeModal('exchange-modal');
        alert(`${amount} TL 환전 신청이 완료되었습니다. 처리에는 3-5 영업일이 소요됩니다.`);
    } catch (error) {
        alert(error.message);
    }
}

// ============================================================================
// DASHBOARD RENDERING
// ============================================================================
function renderDashboard() {
    const roleBadge = document.getElementById('role-badge');
    roleBadge.innerHTML = `
        <i class="fas fa-user"></i>
        <span>${currentUser.role === 'creator' ? '크리에이터' : 
                currentUser.role === 'cafe' ? '카페' : '리스너'}</span>
    `;
    
    updateWalletDisplay();
    
    document.getElementById('creator-dashboard').classList.add('hidden');
    document.getElementById('cafe-dashboard').classList.add('hidden');
    document.getElementById('listener-dashboard').classList.add('hidden');
    
    if (currentUser.role === 'creator') {
        renderCreatorDashboard();
    } else if (currentUser.role === 'cafe') {
        renderCafeDashboard();
    } else {
        renderListenerDashboard();
    }
}

// ============================================================================
// CREATOR DASHBOARD
// ============================================================================
async function renderCreatorDashboard() {
    const container = document.getElementById('creator-dashboard');
    container.classList.remove('hidden');
    
    // Load TL3 list
    try {
        const data = await mockApi.getCreatorTL3(currentUser.id);
        tl3List = data.tracks || [];
    } catch (error) {
        console.error('Error loading TL3:', error);
        tl3List = [];
    }
    
    // Update stats
    document.getElementById('total-tl3').textContent = tl3List.length;
    document.getElementById('total-plays').textContent = tl3List.reduce((sum, t) => sum + (t.playCount || 0), 0);
    document.getElementById('contribution-score').textContent = tl3List.reduce((sum, t) => sum + (t.contributionScore || 0), 0);
    document.getElementById('earned-tl-stat').textContent = wallet.earned_tl.toLocaleString();
    
    // Show/hide Spotify prompt
    const spotifyPrompt = document.getElementById('spotify-prompt');
    if (!isSpotifyVerified) {
        spotifyPrompt.classList.remove('hidden');
    } else {
        spotifyPrompt.classList.add('hidden');
    }
    
    // Render TL3 list
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
        creatorId: currentUser.id
    };
    
    try {
        const result = await mockApi.createTL3(trackData);
        tl3List.push(result.track);
        
        e.target.reset();
        toggleConverter();
        
        alert('TL3 변환 완료! 시간을 충전하면 재생할 수 있습니다.');
        renderCreatorDashboard();
    } catch (error) {
        alert(error.message);
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
        const result = await mockApi.chargeTL3Time(trackId, seconds, currentUser.id);
        wallet = result.wallet;
        
        const trackIndex = tl3List.findIndex(t => t.id === trackId);
        if (trackIndex > -1) {
            tl3List[trackIndex].timeCharged = (tl3List[trackIndex].timeCharged || 0) + seconds;
        }
        
        updateWalletDisplay();
        renderTL3List();
        
        alert(`${seconds}초 충전 완료! -${cost} TL`);
    } catch (error) {
        alert(error.message);
    }
}

async function simulatePlay(trackId) {
    try {
        const result = await mockApi.playTL3(trackId, currentUser.id);
        
        const trackIndex = tl3List.findIndex(t => t.id === trackId);
        if (trackIndex > -1) {
            tl3List[trackIndex] = result.track;
        }
        
        wallet = result.wallet || wallet;
        updateWalletDisplay();
        
        alert('재생 완료! +2 TL (환전 가능) 기여 보상 획득');
        renderCreatorDashboard();
    } catch (error) {
        alert(error.message);
    }
}

// ============================================================================
// CAFE DASHBOARD
// ============================================================================
function renderCafeDashboard() {
    const container = document.getElementById('cafe-dashboard');
    container.classList.remove('hidden');
    
    // Update broadcast time display
    document.getElementById('broadcast-time').textContent = 
        `${Math.floor(broadcastTime / 60)}:${(broadcastTime % 60).toString().padStart(2, '0')}`;
    document.getElementById('tl-spent').textContent = tlSpent + ' TL';
    
    // Show/hide now playing
    const nowPlaying = document.getElementById('now-playing');
    if (broadcasting) {
        nowPlaying.classList.remove('hidden');
    } else {
        nowPlaying.classList.add('hidden');
    }
}

async function toggleBroadcast() {
    if (!broadcasting) {
        // Start broadcast
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
            await mockApi.startBroadcast(currentUser.id, mood);
            broadcasting = true;
            broadcastTime = 0;
            tlSpent = 0;
            
            broadcastInterval = setInterval(async () => {
                broadcastTime++;
                
                document.getElementById('broadcast-time').textContent = 
                    `${Math.floor(broadcastTime / 60)}:${(broadcastTime % 60).toString().padStart(2, '0')}`;
                
                // Deduct TL every 10 seconds
                if (broadcastTime % 10 === 0 && broadcastTime > 0) {
                    const cost = 10;
                    if (wallet.total >= cost) {
                        const result = await mockApi.deductTL(currentUser.id, cost, 'broadcast');
                        wallet = result.wallet;
                        tlSpent += cost;
                        
                        document.getElementById('tl-spent').textContent = tlSpent + ' TL';
                        updateWalletDisplay();
                        
                        // Continue broadcast
                        await mockApi.continueBroadcast(currentUser.id);
                    } else {
                        clearInterval(broadcastInterval);
                        broadcasting = false;
                        await mockApi.stopBroadcast(currentUser.id);
                        alert('TL이 부족하여 방송이 중단되었습니다');
                        renderCafeDashboard();
                    }
                }
            }, 1000);
            
            renderCafeDashboard();
        } catch (error) {
            alert(error.message);
        }
    } else {
        // Stop broadcast
        clearInterval(broadcastInterval);
        broadcasting = false;
        
        try {
            await mockApi.stopBroadcast(currentUser.id);
        } catch (error) {
            console.error('Error stopping broadcast:', error);
        }
        
        renderCafeDashboard();
    }
}

// ============================================================================
// LISTENER DASHBOARD
// ============================================================================
async function renderListenerDashboard() {
    const container = document.getElementById('listener-dashboard');
    container.classList.remove('hidden');
    
    // Load recommended tracks
    let tracks = [];
    try {
        const data = await mockApi.getRecommendedTracks();
        tracks = data.tracks || [];
    } catch (error) {
        console.error('Error loading tracks:', error);
        tracks = [
            { id: '1', title: 'Chill Vibes #01', mood: 'Relaxed', bpm: 85, creator: 'Creator A', likes: 142 },
            { id: '2', title: 'Energy Boost', mood: 'Energetic', bpm: 128, creator: 'Creator B', likes: 89 },
            { id: '3', title: 'Focus Flow', mood: 'Focus', bpm: 95, creator: 'Creator C', likes: 203 },
            { id: '4', title: 'Happy Day', mood: 'Happy', bpm: 110, creator: 'Creator A', likes: 156 }
        ];
    }
    
    // Update play time display
    document.getElementById('play-time').textContent = 
        `${Math.floor(playTime / 60)}:${(playTime % 60).toString().padStart(2, '0')}`;
    
    // Render tracks list
    const tracksList = document.getElementById('tracks-list');
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
                        <span class="creator">by ${track.creator}</span>
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
        // Stop playing
        clearInterval(playInterval);
        playing = null;
        renderListenerDashboard();
    } else {
        // Start playing
        if (playing) {
            clearInterval(playInterval);
        }
        
        playing = trackId;
        playTime = 0;
        
        try {
            await mockApi.listenTrack(trackId, currentUser.id);
            
            playInterval = setInterval(async () => {
                playTime++;
                
                document.getElementById('play-time').textContent = 
                    `${Math.floor(playTime / 60)}:${(playTime % 60).toString().padStart(2, '0')}`;
                
                // Earn TL every 30 seconds
                if (playTime % 30 === 0 && playTime > 0) {
                    const result = await mockApi.earnTL(currentUser.id, 1, 'listening');
                    wallet = result.wallet;
                    updateWalletDisplay();
                }
            }, 1000);
            
            renderListenerDashboard();
        } catch (error) {
            alert(error.message);
            playing = null;
            renderListenerDashboard();
        }
    }
}

async function likeTrack(trackId) {
    try {
        const result = await mockApi.likeTrack(trackId, currentUser.id);
        wallet = result.wallet || wallet;
        updateWalletDisplay();
        
        alert('좋아요 완료! +1 TL 획득');
    } catch (error) {
        alert(error.message);
    }
}

// ============================================================================
// INITIALIZATION
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {
    // Close dropdowns when clicking outside
    document.addEventListener('click', (event) => {
        const userMenu = document.getElementById('user-dropdown');
        const userBtn = document.querySelector('.user-btn');
        
        if (userMenu && !userMenu.contains(event.target) && !userBtn.contains(event.target)) {
            userMenu.classList.add('hidden');
        }
        
        // Close modals when clicking outside
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            if (!modal.contains(event.target) && !modal.classList.contains('hidden')) {
                modal.classList.add('hidden');
            }
        });
    });
    
    // Initialize with landing page
    showLanding();
});

// ============================================================================
// MOCK API FUNCTIONS
// ============================================================================
const mockApi = {
    // Auth functions
    async signup(email, password, name, role) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        return {
            success: true,
            user: {
                id: `user_${Date.now()}`,
                email,
                name,
                role,
                createdAt: new Date().toISOString()
            }
        };
    },
    
    async login(email, password) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        return {
            success: true,
            user: {
                id: `user_${Date.now()}`,
                email,
                name: '테스트 사용자',
                role: 'listener',
                createdAt: new Date().toISOString()
            }
        };
    },
    
    // Wallet functions
    async getWallet(userId) {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        return {
            earned_tl: 0,
            purchased_tl: 0,
            promo_tl: 10000,
            total: 10000
        };
    },
    
    async watchAd(userId) {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const newWallet = {
            earned_tl: wallet.earned_tl,
            purchased_tl: wallet.purchased_tl + 50,
            promo_tl: wallet.promo_tl,
            total: wallet.total + 50
        };
        
        return { wallet: newWallet };
    },
    
    async deductTL(userId, amount, type) {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        let remaining = amount;
        const newWallet = { ...wallet };
        
        if (newWallet.promo_tl >= remaining) {
            newWallet.promo_tl -= remaining;
        } else {
            remaining -= newWallet.promo_tl;
            newWallet.promo_tl = 0;
            
            if (newWallet.purchased_tl >= remaining) {
                newWallet.purchased_tl -= remaining;
            } else {
                remaining -= newWallet.purchased_tl;
                newWallet.purchased_tl = 0;
                newWallet.earned_tl -= remaining;
            }
        }
        
        newWallet.total = newWallet.promo_tl + newWallet.purchased_tl + newWallet.earned_tl;
        
        return { wallet: newWallet };
    },
    
    async earnTL(userId, amount, type) {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const newWallet = {
            earned_tl: wallet.earned_tl + amount,
            purchased_tl: wallet.purchased_tl,
            promo_tl: wallet.promo_tl,
            total: wallet.total + amount
        };
        
        return { wallet: newWallet };
    },
    
    // Spotify functions
    async checkSpotifyVerification(userId) {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        return { verified: false };
    },
    
    async verifySpotify(userId, authCode) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        return { verified: true };
    },
    
    // Exchange functions
    async exchangeTL(userId, amount) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const newWallet = {
            earned_tl: wallet.earned_tl - amount,
            purchased_tl: wallet.purchased_tl,
            promo_tl: wallet.promo_tl,
            total: wallet.total - amount
        };
        
        return { wallet: newWallet };
    },
    
    // TL3 functions
    async createTL3(trackData) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        return {
            track: {
                id: `tl3_${Date.now()}`,
                ...trackData,
                timeCharged: 0,
                playCount: 0,
                cafePlayCount: 0,
                contributionScore: 0
            }
        };
    },
    
    async getCreatorTL3(userId) {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        return { tracks: [] };
    },
    
    async chargeTL3Time(trackId, seconds, userId) {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const cost = Math.ceil(seconds / 60) * 10;
        const newWallet = await this.deductTL(userId, cost, 'charge');
        
        return newWallet;
    },
    
    async playTL3(trackId, userId) {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const track = {
            id: trackId,
            title: 'Sample Track',
            mood: 'Relaxed',
            bpm: 85,
            playCount: 1,
            cafePlayCount: 0,
            contributionScore: 10,
            timeCharged: 300
        };
        
        const newWallet = await this.earnTL(userId, 2, 'playback');
        
        return { track, wallet: newWallet.wallet };
    },
    
    // Cafe functions
    async startBroadcast(cafeId, mood) {
        await new Promise(resolve => setTimeout(resolve, 500));
        return { success: true };
    },
    
    async stopBroadcast(cafeId) {
        await new Promise(resolve => setTimeout(resolve, 500));
        return { success: true };
    },
    
    async continueBroadcast(cafeId) {
        await new Promise(resolve => setTimeout(resolve, 500));
        return { success: true };
    },
    
    // Listener functions
    async getRecommendedTracks() {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        return {
            tracks: [
                { id: '1', title: 'Chill Vibes #01', mood: 'Relaxed', bpm: 85, creator: 'Creator A', likes: 142 },
                { id: '2', title: 'Energy Boost', mood: 'Energetic', bpm: 128, creator: 'Creator B', likes: 89 },
                { id: '3', title: 'Focus Flow', mood: 'Focus', bpm: 95, creator: 'Creator C', likes: 203 },
                { id: '4', title: 'Happy Day', mood: 'Happy', bpm: 110, creator: 'Creator A', likes: 156 }
            ]
        };
    },
    
    async listenTrack(trackId, userId) {
        await new Promise(resolve => setTimeout(resolve, 500));
        return { success: true };
    },
    
    async likeTrack(trackId, userId) {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const newWallet = await this.earnTL(userId, 1, 'engagement');
        return { wallet: newWallet.wallet };
    }
};
