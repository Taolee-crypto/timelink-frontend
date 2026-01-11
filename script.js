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
let useMockMode = false; // 모킹 모드 여부

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

// 모달 닫기 함수
function closeModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
}

// ============================================================================
// AUTH FUNCTIONS (하이브리드 API 연동)
// ============================================================================
function toggleAuthMode() {
    authMode = authMode === 'login' ? 'signup' : 'login';
    
    const authSubtitle = document.getElementById('auth-subtitle');
    const authSubmitText = document.getElementById('auth-submit-text');
    const authToggle = document.getElementById('auth-toggle');
    const roleSelection = document.getElementById('role-selection');
    const nameField = document.getElementById('name-field');
    
    if (authMode === 'login') {
        authSubtitle.textContent = '계정에 로그인';
        authSubmitText.textContent = '로그인';
        authToggle.textContent = '계정이 없으신가요? 가입하기';
        roleSelection.classList.add('hidden');
        nameField.classList.add('hidden');
    } else {
        authSubtitle.textContent = '새 계정 만들기';
        authSubmitText.textContent = '가입하기';
        authToggle.textContent = '이미 계정이 있으신가요? 로그인';
        roleSelection.classList.remove('hidden');
        nameField.classList.remove('hidden');
    }
}

function selectRole(role) {
    selectedRole = role;
    
    // 모든 버튼에서 active 클래스 제거
    const creatorBtn = document.getElementById('creator-btn');
    const cafeBtn = document.getElementById('cafe-btn');
    const listenerBtn = document.getElementById('listener-btn');
    
    creatorBtn.classList.remove('bg-purple-600', 'text-white');
    creatorBtn.classList.add('bg-black', 'bg-opacity-30', 'text-gray-300');
    
    cafeBtn.classList.remove('bg-purple-600', 'text-white');
    cafeBtn.classList.add('bg-black', 'bg-opacity-30', 'text-gray-300');
    
    listenerBtn.classList.remove('bg-purple-600', 'text-white');
    listenerBtn.classList.add('bg-black', 'bg-opacity-30', 'text-gray-300');
    
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
    
    // 입력 유효성 검사
    if (!email || !password) {
        showError('이메일과 비밀번호를 입력해주세요.');
        return;
    }
    
    if (authMode === 'signup' && !name) {
        showError('이름을 입력해주세요.');
        return;
    }
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const submitText = document.getElementById('auth-submit-text');
    const spinner = document.getElementById('auth-spinner');
    
    submitText.textContent = authMode === 'login' ? '로그인 중...' : '가입 중...';
    spinner.classList.remove('hidden');
    submitBtn.disabled = true;
    
    try {
        // API 사용 가능 여부 확인
        await testAPIConnection();
        
        let response;
        
        if (authMode === 'signup') {
            console.log('회원가입 시도:', { email, name, role: selectedRole });
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
            
            if (useMockMode) {
                alert('데모 모드: 회원가입이 완료되었습니다! 환영합니다.');
            }
        } else {
            console.log('로그인 시도:', { email });
            response = await api.login({
                email,
                password
            });
            
            // 지갑 정보 로드 시도
            try {
                const walletResponse = await api.getWallet();
                if (walletResponse && walletResponse.wallet) {
                    wallet = walletResponse.wallet;
                    tokenManager.setWallet(wallet);
                }
            } catch (walletError) {
                console.log('지갑 정보를 불러오지 못했습니다. 기본 지갑을 사용합니다.');
            }
        }
        
        console.log('인증 응답:', response);
        
        if (response && response.user) {
            currentUser = response.user;
            tokenManager.setUser(currentUser);
            
            if (response.token) {
                tokenManager.setToken(response.token);
            }
            
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
            
            if (useMockMode) {
                console.log('모킹 모드로 실행 중입니다.');
            }
        } else {
            throw new Error('인증 응답이 올바르지 않습니다.');
        }
        
    } catch (error) {
        console.error('인증 오류:', error);
        
        // API 실패시 모킹 인증 시도
        if (!useMockMode) {
            console.log('API 실패, 모킹 인증 시도');
            await mockAuth(email, password, name);
        } else {
            showError(error.message || '인증에 실패했습니다. 다시 시도해주세요.');
        }
    } finally {
        submitText.textContent = authMode === 'login' ? '로그인' : '가입하기';
        spinner.classList.add('hidden');
        submitBtn.disabled = false;
    }
}

// API 연결 테스트
async function testAPIConnection() {
    try {
        // 경제 API 테스트
        const economicTest = await fetch('https://deconomic-api.timelink-api.workers.dev/health', {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
        });
        
        if (economicTest.ok) {
            console.log('경제 API 연결 성공');
            useMockMode = false;
            return true;
        }
    } catch (error) {
        console.log('API 연결 실패, 모킹 모드로 전환:', error);
        useMockMode = true;
    }
    
    return false;
}

// 모킹 인증 (API 실패시)
async function mockAuth(email, password, name) {
    try {
        // 간단한 모킹 인증
        currentUser = {
            id: `user_${Date.now()}`,
            email,
            name: name || email.split('@')[0],
            role: selectedRole,
            createdAt: new Date().toISOString()
        };
        
        // 모킹 토큰 생성
        const mockToken = `mock_${Date.now()}_${Math.random().toString(36).substr(2)}`;
        
        tokenManager.setUser(currentUser);
        tokenManager.setToken(mockToken);
        tokenManager.setWallet(wallet);
        
        updateUserUI();
        await showDashboard();
        
        // 모킹 모드 알림
        setTimeout(() => {
            showNotification('데모 모드로 실행 중입니다. 실제 API가 연결되지 않았습니다.', 'info');
        }, 500);
        
    } catch (mockError) {
        console.error('모킹 인증 오류:', mockError);
        showError('인증에 실패했습니다. 잠시 후 다시 시도해주세요.');
    }
}

async function checkSpotifyVerification() {
    try {
        if (currentUser && currentUser.role === 'creator') {
            const response = await api.checkSpotifyStatus();
            isSpotifyVerified = response.verified || false;
            
            if (isSpotifyVerified) {
                document.getElementById('spotify-badge').classList.remove('hidden');
            }
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
    if (userInitial) {
        const displayName = user.name || user.email;
        userInitial.textContent = displayName.charAt(0).toUpperCase();
    }
}

function showError(message) {
    const errorDiv = document.getElementById('auth-error');
    const errorMessage = document.getElementById('error-message');
    
    if (errorDiv && errorMessage) {
        errorMessage.textContent = message;
        errorDiv.classList.remove('hidden');
    } else {
        alert(message);
    }
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
// WALLET FUNCTIONS
// ============================================================================
async function watchAd() {
    try {
        const response = await api.watchAd();
        if (response && response.wallet) {
            wallet = response.wallet;
        } else {
            // 모킹: 광고 시청 보상
            wallet.purchased_tl += 50;
            wallet.total += 50;
        }
        
        updateWalletDisplay();
        showNotification('광고 시청 완료! +50 TL (환전 불가) 획득', 'success');
    } catch (error) {
        console.error('광고 시청 오류:', error);
        showNotification('광고 시청에 실패했습니다.', 'error');
    }
}

function updateWalletDisplay() {
    const totalTl = document.getElementById('total-tl');
    const earnedTl = document.getElementById('earned-tl');
    const earnedTlStat = document.getElementById('earned-tl-stat');
    const listenerEarnedTl = document.getElementById('listener-earned-tl');
    
    if (totalTl) totalTl.textContent = wallet.total.toLocaleString() + ' TL';
    if (earnedTl) earnedTl.textContent = wallet.earned_tl.toLocaleString() + ' TL';
    if (earnedTlStat) earnedTlStat.textContent = wallet.earned_tl.toLocaleString();
    if (listenerEarnedTl) listenerEarnedTl.textContent = wallet.earned_tl.toLocaleString();
}

// ============================================================================
// SPOTIFY VERIFICATION
// ============================================================================
function showSpotifyModal() {
    document.getElementById('spotify-modal').classList.remove('hidden');
    const userMenu = document.getElementById('user-menu');
    if (userMenu) userMenu.classList.add('hidden');
}

function connectSpotify() {
    document.getElementById('spotify-connect-section').classList.add('hidden');
    document.getElementById('spotify-auth-section').classList.remove('hidden');
}

async function verifySpotify() {
    const authCode = document.getElementById('spotify-auth-code').value;
    
    if (!authCode) {
        showNotification('Spotify Auth Code를 입력해주세요.', 'warning');
        return;
    }
    
    try {
        const response = await api.verifySpotify({
            authCode,
            userId: currentUser.id
        });
        
        isSpotifyVerified = true;
        const spotifyBadge = document.getElementById('spotify-badge');
        if (spotifyBadge) spotifyBadge.classList.remove('hidden');
        
        closeModal('spotify-modal');
        
        const spotifyPrompt = document.getElementById('spotify-prompt');
        if (spotifyPrompt) spotifyPrompt.classList.add('hidden');
        
        showNotification('Spotify 인증이 완료되었습니다! 이제 TL3 변환이 가능합니다.', 'success');
        
        if (currentUser.role === 'creator') {
            await renderDashboard();
        }
    } catch (error) {
        console.error('Spotify 인증 오류:', error);
        showNotification('Spotify 인증에 실패했습니다.', 'error');
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
    
    // 이벤트 리스너 제거 후 재설정
    amountInput.oninput = function() {
        const amount = parseInt(this.value) || 0;
        const maxAmount = wallet.earned_tl;
        
        if (amount > maxAmount) {
            this.value = maxAmount;
        }
        
        const displayAmount = parseInt(this.value) || 0;
        document.getElementById('exchange-estimate').textContent = displayAmount.toLocaleString() + ' KRW';
    };
}

async function processExchange() {
    const amount = parseInt(document.getElementById('exchange-amount').value);
    
    if (!amount || amount <= 0) {
        showNotification('환전할 금액을 입력해주세요.', 'warning');
        return;
    }
    
    if (amount > wallet.earned_tl) {
        showNotification('환전 가능한 금액을 초과했습니다.', 'error');
        return;
    }
    
    try {
        const response = await api.requestExchange({
            amount,
            currency: 'KRW'
        });
        
        if (response && response.wallet) {
            wallet = response.wallet;
        } else {
            // 모킹: 환전 처리
            wallet.earned_tl -= amount;
            wallet.total -= amount;
        }
        
        updateWalletDisplay();
        closeModal('exchange-modal');
        
        showNotification(`${amount} TL 환전 신청이 완료되었습니다. 처리에는 3-5 영업일이 소요됩니다.`, 'success');
    } catch (error) {
        console.error('환전 오류:', error);
        showNotification('환전 신청에 실패했습니다.', 'error');
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
    
    currentUser = user;
    
    // 지갑 정보 로드
    const savedWallet = tokenManager.getWallet();
    if (savedWallet) {
        wallet = savedWallet;
    }
    
    // 역할 배지 업데이트
    const roleBadge = document.getElementById('role-badge');
    if (roleBadge) {
        const roleText = user.role === 'creator' ? '크리에이터' : 
                         user.role === 'cafe' ? '카페' : '리스너';
        roleBadge.innerHTML = `<i class="fas fa-user mr-1"></i><span>${roleText}</span>`;
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
// CREATOR DASHBOARD
// ============================================================================
async function renderCreatorDashboard() {
    const container = document.getElementById('creator-dashboard');
    container.classList.remove('hidden');
    
    // TL3 목록 로드
    try {
        const response = await api.getTL3List();
        tl3List = response.tracks || response.assets || [];
        console.log('TL3 목록:', tl3List);
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
    if (spotifyPrompt) {
        if (!isSpotifyVerified) {
            spotifyPrompt.classList.remove('hidden');
        } else {
            spotifyPrompt.classList.add('hidden');
        }
    }
    
    // TL3 목록 렌더링
    renderTL3List();
}

function toggleConverter() {
    const form = document.getElementById('converter-form');
    if (form) {
        form.classList.toggle('hidden');
    }
}

async function convertToTL3(e) {
    e.preventDefault();
    
    if (!isSpotifyVerified) {
        showNotification('TL3 변환을 위해서는 Spotify 인증이 필요합니다.', 'warning');
        showSpotifyModal();
        return;
    }
    
    const title = document.getElementById('track-title');
    const mood = document.getElementById('track-mood');
    const bpm = document.getElementById('track-bpm');
    const length = document.getElementById('track-length');
    const source = document.getElementById('track-source');
    
    if (!title || !mood || !bpm || !length) {
        showNotification('필수 정보를 모두 입력해주세요.', 'warning');
        return;
    }
    
    const trackData = {
        title: title.value,
        mood: mood.value,
        bpm: parseInt(bpm.value) || 85,
        length: parseInt(length.value) || 180,
        source: source?.value || 'Unknown',
        type: 'music',
        format: 'tl3'
    };
    
    try {
        const response = await api.createTL3(trackData);
        const newTrack = response.track || response.asset || {
            id: `tl3_${Date.now()}`,
            ...trackData,
            timeCharged: 0,
            playCount: 0,
            cafePlayCount: 0,
            contributionScore: 0
        };
        
        tl3List.push(newTrack);
        
        e.target.reset();
        toggleConverter();
        
        showNotification('TL3 변환 완료! 시간을 충전하면 재생할 수 있습니다.', 'success');
        await renderCreatorDashboard();
    } catch (error) {
        console.error('TL3 변환 오류:', error);
        showNotification('TL3 변환에 실패했습니다.', 'error');
    }
}

function renderTL3List() {
    const container = document.getElementById('tl3-list');
    if (!container) return;
    
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
        showNotification('TL이 부족합니다', 'error');
        return;
    }
    
    try {
        // TL 차감 API 호출
        const chargeResponse = await api.chargeTL({
            amount: cost,
            type: 'tl3_charge',
            metadata: { trackId, seconds }
        });
        
        // TL3 시간 충전
        await api.chargeTL3Time(trackId, seconds);
        
        if (chargeResponse && chargeResponse.wallet) {
            wallet = chargeResponse.wallet;
        } else {
            // 모킹: TL 차감
            wallet.total -= cost;
            wallet.promo_tl = Math.max(0, wallet.promo_tl - cost);
        }
        
        const trackIndex = tl3List.findIndex(t => t.id === trackId);
        if (trackIndex > -1) {
            tl3List[trackIndex].timeCharged = (tl3List[trackIndex].timeCharged || 0) + seconds;
        }
        
        updateWalletDisplay();
        renderTL3List();
        
        showNotification(`${seconds}초 충전 완료! -${cost} TL`, 'success');
    } catch (error) {
        console.error('시간 충전 오류:', error);
        showNotification('시간 충전에 실패했습니다.', 'error');
    }
}

async function simulatePlay(trackId) {
    const trackIndex = tl3List.findIndex(t => t.id === trackId);
    
    if (trackIndex === -1 || !tl3List[trackIndex].timeCharged || tl3List[trackIndex].timeCharged === 0) {
        showNotification('재생할 시간이 충전되지 않았습니다.', 'warning');
        return;
    }
    
    try {
        const response = await api.playTL3(trackId);
        
        // 트랙 정보 업데이트
        if (response && response.track) {
            tl3List[trackIndex] = response.track;
        } else {
            // 모킹: 재생 횟수 증가
            tl3List[trackIndex].playCount = (tl3List[trackIndex].playCount || 0) + 1;
            tl3List[trackIndex].contributionScore = (tl3List[trackIndex].contributionScore || 0) + 10;
        }
        
        // 보상 지급
        if (response && response.wallet) {
            wallet = response.wallet;
        } else {
            // 모킹: TL 보상
            wallet.earned_tl += 2;
            wallet.total += 2;
        }
        
        updateWalletDisplay();
        
        showNotification('재생 완료! +2 TL (환전 가능) 기여 보상 획득', 'success');
        await renderCreatorDashboard();
    } catch (error) {
        console.error('재생 오류:', error);
        showNotification('재생에 실패했습니다.', 'error');
    }
}

// ============================================================================
// CAFE DASHBOARD
// ============================================================================
async function renderCafeDashboard() {
    const container = document.getElementById('cafe-dashboard');
    if (container) container.classList.remove('hidden');
    
    // 방송 시간 표시 업데이트
    const broadcastTimeElement = document.getElementById('broadcast-time');
    const tlSpentElement = document.getElementById('tl-spent');
    const broadcastStatus = document.getElementById('broadcast-status');
    const broadcastBtn = document.getElementById('broadcast-btn');
    const broadcastIcon = document.getElementById('broadcast-icon');
    const broadcastBtnText = document.getElementById('broadcast-btn-text');
    
    if (broadcastTimeElement) {
        broadcastTimeElement.textContent = 
            `${Math.floor(broadcastTime / 60)}:${(broadcastTime % 60).toString().padStart(2, '0')}`;
    }
    
    if (tlSpentElement) {
        tlSpentElement.textContent = tlSpent + ' TL';
    }
    
    // 방송 상태 업데이트
    if (broadcastStatus) {
        if (broadcasting) {
            broadcastStatus.textContent = '● 방송 중';
            broadcastStatus.className = 'text-2xl font-bold text-green-600';
        } else {
            broadcastStatus.textContent = '○ 대기 중';
            broadcastStatus.className = 'text-2xl font-bold text-gray-400';
        }
    }
    
    // 방송 버튼 업데이트
    if (broadcastBtn && broadcastIcon && broadcastBtnText) {
        if (broadcasting) {
            broadcastBtn.className = 'w-full py-4 rounded-lg font-semibold transition btn-hover flex items-center justify-center space-x-3 bg-red-600 hover:bg-red-700 text-white';
            broadcastIcon.className = 'fas fa-stop';
            broadcastBtnText.textContent = '방송 중단';
        } else {
            broadcastBtn.className = 'w-full py-4 rounded-lg font-semibold transition btn-hover flex items-center justify-center space-x-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white';
            broadcastIcon.className = 'fas fa-play';
            broadcastBtnText.textContent = '방송 시작';
        }
    }
    
    // 현재 재생 중 표시/숨김
    const nowPlaying = document.getElementById('now-playing');
    if (nowPlaying) {
        if (broadcasting) {
            nowPlaying.classList.remove('hidden');
        } else {
            nowPlaying.classList.add('hidden');
        }
    }
}

async function toggleBroadcast() {
    const moodSelect = document.getElementById('cafe-mood');
    if (!moodSelect) return;
    
    if (!broadcasting) {
        // 방송 시작
        const mood = moodSelect.value;
        
        if (!mood) {
            showNotification('무드를 선택해주세요.', 'warning');
            return;
        }
        
        if (wallet.total < 10) {
            showNotification('방송을 시작하려면 최소 10 TL이 필요합니다', 'error');
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
                
                const broadcastTimeElement = document.getElementById('broadcast-time');
                if (broadcastTimeElement) {
                    broadcastTimeElement.textContent = 
                        `${Math.floor(broadcastTime / 60)}:${(broadcastTime % 60).toString().padStart(2, '0')}`;
                }
                
                // 10초마다 TL 차감
                if (broadcastTime % 10 === 0 && broadcastTime > 0) {
                    const cost = 10;
                    if (wallet.total >= cost) {
                        try {
                            const response = await api.chargeTL({
                                amount: cost,
                                type: 'broadcast'
                            });
                            
                            if (response && response.wallet) {
                                wallet = response.wallet;
                            } else {
                                // 모킹: TL 차감
                                wallet.total -= cost;
                                wallet.promo_tl = Math.max(0, wallet.promo_tl - cost);
                            }
                            
                            tlSpent += cost;
                            
                            const tlSpentElement = document.getElementById('tl-spent');
                            if (tlSpentElement) {
                                tlSpentElement.textContent = tlSpent + ' TL';
                            }
                            
                            updateWalletDisplay();
                        } catch (error) {
                            console.error('TL 차감 실패:', error);
                            clearInterval(broadcastInterval);
                            broadcasting = false;
                            await api.stopBroadcast();
                            showNotification('TL 차감에 실패하여 방송이 중단되었습니다', 'error');
                            await renderCafeDashboard();
                        }
                    } else {
                        clearInterval(broadcastInterval);
                        broadcasting = false;
                        await api.stopBroadcast();
                        showNotification('TL이 부족하여 방송이 중단되었습니다', 'error');
                        await renderCafeDashboard();
                    }
                }
            }, 1000);
            
            await renderCafeDashboard();
            showNotification('방송이 시작되었습니다.', 'success');
        } catch (error) {
            console.error('방송 시작 오류:', error);
            showNotification('방송 시작에 실패했습니다.', 'error');
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
        showNotification('방송이 중단되었습니다.', 'info');
    }
}

// ============================================================================
// LISTENER DASHBOARD
// ============================================================================
async function renderListenerDashboard() {
    const container = document.getElementById('listener-dashboard');
    if (container) container.classList.remove('hidden');
    
    // 추천 트랙 로드
    let tracks = [];
    try {
        const response = await api.getTL3List();
        tracks = response.tracks || response.assets || [];
        
        // 샘플 데이터 추가 (트랙이 없을 경우)
        if (tracks.length === 0) {
            tracks = [
                { id: '1', title: 'Chill Vibes #01', mood: 'Relaxed', bpm: 85, creator: 'Creator A', likes: 142, length: 180 },
                { id: '2', title: 'Energy Boost', mood: 'Energetic', bpm: 128, creator: 'Creator B', likes: 89, length: 210 },
                { id: '3', title: 'Focus Flow', mood: 'Focus', bpm: 95, creator: 'Creator C', likes: 203, length: 240 },
                { id: '4', title: 'Happy Day', mood: 'Happy', bpm: 110, creator: 'Creator A', likes: 156, length: 195 }
            ];
        }
    } catch (error) {
        console.error('추천 트랙 조회 실패:', error);
        tracks = [
            { id: '1', title: 'Chill Vibes #01', mood: 'Relaxed', bpm: 85, creator: 'Creator A', likes: 142, length: 180 },
            { id: '2', title: 'Energy Boost', mood: 'Energetic', bpm: 128, creator: 'Creator B', likes: 89, length: 210 },
            { id: '3', title: 'Focus Flow', mood: 'Focus', bpm: 95, creator: 'Creator C', likes: 203, length: 240 },
            { id: '4', title: 'Happy Day', mood: 'Happy', bpm: 110, creator: 'Creator A', likes: 156, length: 195 }
        ];
    }
    
    // 재생 시간 표시 업데이트
    const playTimeElement = document.getElementById('play-time');
    if (playTimeElement) {
        playTimeElement.textContent = 
            `${Math.floor(playTime / 60)}:${(playTime % 60).toString().padStart(2, '0')}`;
    }
    
    // 재생 상태 업데이트
    const playStatus = document.getElementById('play-status');
    if (playStatus) {
        if (playing) {
            playStatus.textContent = '● Playing';
            playStatus.className = 'text-2xl font-bold text-green-600';
        } else {
            playStatus.textContent = '○ Stopped';
            playStatus.className = 'text-2xl font-bold text-gray-400';
        }
    }
    
    // 트랙 목록 렌더링
    const tracksList = document.getElementById('tracks-list');
    if (tracksList) {
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
                                <span class="text-gray-500">by ${track.creator || 'Unknown'}</span>
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
}

async function togglePlay(trackId) {
    if (playing === trackId) {
        // 재생 중지
        clearInterval(playInterval);
        playing = null;
        await renderListenerDashboard();
        showNotification('재생이 중지되었습니다.', 'info');
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
                
                const playTimeElement = document.getElementById('play-time');
                if (playTimeElement) {
                    playTimeElement.textContent = 
                        `${Math.floor(playTime / 60)}:${(playTime % 60).toString().padStart(2, '0')}`;
                }
                
                // 30초마다 TL 획득
                if (playTime % 30 === 0 && playTime > 0) {
                    try {
                        const response = await api.chargeTL({
                            amount: 1,
                            type: 'listening_reward'
                        });
                        
                        if (response && response.wallet) {
                            wallet = response.wallet;
                            updateWalletDisplay();
                            showNotification('+1 TL 획득! (30초 재생 보상)', 'success');
                        }
                    } catch (error) {
                        console.error('TL 획득 실패:', error);
                    }
                }
            }, 1000);
            
            await renderListenerDashboard();
            showNotification('음악 재생을 시작합니다.', 'success');
        } catch (error) {
            console.error('재생 오류:', error);
            playing = null;
            await renderListenerDashboard();
            showNotification('재생에 실패했습니다.', 'error');
        }
    }
}

async function likeTrack(trackId) {
    try {
        const response = await api.likeTrack(trackId);
        
        if (response && response.wallet) {
            wallet = response.wallet;
            updateWalletDisplay();
        } else {
            // 모킹: 좋아요 보상
            wallet.earned_tl += 1;
            wallet.total += 1;
            updateWalletDisplay();
        }
        
        showNotification('좋아요 완료! +1 TL 획득', 'success');
        await renderListenerDashboard();
    } catch (error) {
        console.error('좋아요 오류:', error);
        showNotification('좋아요에 실패했습니다.', 'error');
    }
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
function showNotification(message, type = 'info') {
    // 간단한 알림 생성
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg text-white ${
        type === 'success' ? 'bg-green-500' :
        type === 'error' ? 'bg-red-500' :
        type === 'warning' ? 'bg-yellow-500' :
        'bg-blue-500'
    }`;
    notification.innerHTML = `
        <div class="flex items-center">
            <i class="fas ${
                type === 'success' ? 'fa-check-circle' :
                type === 'error' ? 'fa-exclamation-circle' :
                type === 'warning' ? 'fa-exclamation-triangle' :
                'fa-info-circle'
            } mr-2"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // 3초 후 제거
    setTimeout(() => {
        notification.style.transition = 'opacity 0.3s ease';
        notification.style.opacity = '0';
        setTimeout(() => {
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// API 연결 테스트 함수 (디버그용)
async function testAPIConnectionManual() {
    try {
        showNotification('API 연결 테스트 중...', 'info');
        
        // 인증 API 테스트
        const authTest = await fetch('https://timelink-api.timelink-api.workers.dev/', {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
        });
        
        const authData = await authTest.json();
        console.log('인증 API 응답:', authData);
        
        // 경제 API 테스트
        const economicTest = await fetch('https://deconomic-api.timelink-api.workers.dev/health', {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
        });
        
        const economicData = await economicTest.json();
        console.log('경제 API 응답:', economicData);
        
        showNotification(`API 연결 성공!\n인증 API: ${authData.service}\n경제 API: ${economicData.service}`, 'success');
        
        return true;
    } catch (error) {
        console.error('API 연결 테스트 실패:', error);
        showNotification('API 연결에 실패했습니다. 모킹 모드로 전환합니다.', 'error');
        useMockMode = true;
        return false;
    }
}

// ============================================================================
// INITIALIZATION
// ============================================================================
document.addEventListener('DOMContentLoaded', async () => {
    console.log('TIMELINK 플랫폼 초기화 중...');
    
    // API 연결 테스트
    await testAPIConnection();
    
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
            
            if (useMockMode) {
                setTimeout(() => {
                    showNotification('데모 모드로 실행 중입니다. 실제 API가 연결되지 않았습니다.', 'info');
                }, 1000);
            }
            
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
            if (!modal.contains(event.target) && !modal.classList.contains('hidden')) {
                modal.classList.add('hidden');
            }
        });
    });
    
    // 모킹 모드 알림
    if (useMockMode) {
        console.log('모킹 모드 활성화');
        setTimeout(() => {
            showNotification('데모 모드로 실행 중입니다. 모든 데이터는 로컬에 저장됩니다.', 'info');
        }, 2000);
    }
});

// 글로벌 테스트 함수 (콘솔에서 실행 가능)
window.testAPIConnection = testAPIConnectionManual;
window.resetApp = () => {
    tokenManager.clearToken();
    showLanding();
    showNotification('앱이 초기화되었습니다.', 'info');
};
