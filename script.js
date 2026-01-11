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
let useMockMode = false;

// API 객체 - 안전하게 접근
function getAPI() {
    if (window.hybridAPI) {
        return window.hybridAPI;
    } else if (window.timeLinkAPI) {
        return window.timeLinkAPI;
    } else {
        // 기본 API 객체 생성
        return {
            signup: async () => ({ success: false }),
            login: async () => ({ success: false }),
            getWallet: async () => ({ wallet: { earned_tl: 0, purchased_tl: 0, promo_tl: 10000, total: 10000 } })
        };
    }
}

const api = getAPI();
const tokenManager = window.tokenManager || {
    getToken: () => localStorage.getItem('timelink_token'),
    setToken: (token) => localStorage.setItem('timelink_token', token),
    clearToken: () => localStorage.removeItem('timelink_token'),
    getUser: () => {
        const user = localStorage.getItem('timelink_user');
        return user ? JSON.parse(user) : null;
    },
    setUser: (user) => localStorage.setItem('timelink_user', JSON.stringify(user)),
    setWallet: (wallet) => localStorage.setItem('timelink_wallet', JSON.stringify(wallet)),
    getWallet: () => {
        const wallet = localStorage.getItem('timelink_wallet');
        return wallet ? JSON.parse(wallet) : null;
    },
    isAuthenticated: () => {
        const token = localStorage.getItem('timelink_token');
        const user = localStorage.getItem('timelink_user');
        return !!token && !!user;
    }
};

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
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const nameInput = document.getElementById('name');
    const authError = document.getElementById('auth-error');
    
    if (emailInput) emailInput.value = '';
    if (passwordInput) passwordInput.value = '';
    if (nameInput) nameInput.value = '';
    if (authError) authError.classList.add('hidden');
}

function toggleUserMenu() {
    const dropdown = document.getElementById('user-menu');
    if (dropdown) dropdown.classList.toggle('hidden');
}

// ============================================================================
// AUTH FUNCTIONS
// ============================================================================
function toggleAuthMode() {
    authMode = authMode === 'login' ? 'signup' : 'login';
    
    const authSubtitle = document.getElementById('auth-subtitle');
    const authSubmitText = document.getElementById('auth-submit-text');
    const authToggle = document.getElementById('auth-toggle');
    const roleSelection = document.getElementById('role-selection');
    const nameField = document.getElementById('name-field');
    
    if (authMode === 'login') {
        if (authSubtitle) authSubtitle.textContent = '계정에 로그인';
        if (authSubmitText) authSubmitText.textContent = '로그인';
        if (authToggle) authToggle.textContent = '계정이 없으신가요? 가입하기';
        if (roleSelection) roleSelection.classList.add('hidden');
        if (nameField) nameField.classList.add('hidden');
    } else {
        if (authSubtitle) authSubtitle.textContent = '새 계정 만들기';
        if (authSubmitText) authSubmitText.textContent = '가입하기';
        if (authToggle) authToggle.textContent = '이미 계정이 있으신가요? 로그인';
        if (roleSelection) roleSelection.classList.remove('hidden');
        if (nameField) nameField.classList.remove('hidden');
    }
}

function selectRole(role) {
    selectedRole = role;
    
    const creatorBtn = document.getElementById('creator-btn');
    const cafeBtn = document.getElementById('cafe-btn');
    const listenerBtn = document.getElementById('listener-btn');
    
    if (creatorBtn) {
        creatorBtn.classList.remove('bg-purple-600', 'text-white');
        creatorBtn.classList.add('bg-black', 'bg-opacity-30', 'text-gray-300');
    }
    
    if (cafeBtn) {
        cafeBtn.classList.remove('bg-purple-600', 'text-white');
        cafeBtn.classList.add('bg-black', 'bg-opacity-30', 'text-gray-300');
    }
    
    if (listenerBtn) {
        listenerBtn.classList.remove('bg-purple-600', 'text-white');
        listenerBtn.classList.add('bg-black', 'bg-opacity-30', 'text-gray-300');
    }
    
    const selectedBtn = document.getElementById(`${role}-btn`);
    if (selectedBtn) {
        selectedBtn.classList.remove('bg-black', 'bg-opacity-30', 'text-gray-300');
        selectedBtn.classList.add('bg-purple-600', 'text-white');
    }
}

async function handleAuth(e) {
    e.preventDefault();
    
    const email = document.getElementById('email')?.value;
    const password = document.getElementById('password')?.value;
    const name = document.getElementById('name')?.value || email?.split('@')[0];
    
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
    
    if (submitText) submitText.textContent = authMode === 'login' ? '로그인 중...' : '가입 중...';
    if (spinner) spinner.classList.remove('hidden');
    if (submitBtn) submitBtn.disabled = true;
    
    try {
        let response;
        
        if (authMode === 'signup') {
            console.log('회원가입 시도:', { email, name, role: selectedRole });
            response = await api.signup({
                email,
                password,
                name,
                role: selectedRole
            });
            
            wallet = {
                earned_tl: 0,
                purchased_tl: 0,
                promo_tl: 10000,
                total: 10000
            };
            tokenManager.setWallet(wallet);
            
            showNotification('회원가입이 완료되었습니다! 환영합니다.', 'success');
        } else {
            console.log('로그인 시도:', { email });
            response = await api.login({
                email,
                password
            });
            
            try {
                const walletResponse = await api.getWallet();
                if (walletResponse && walletResponse.wallet) {
                    wallet = walletResponse.wallet;
                    tokenManager.setWallet(wallet);
                }
            } catch (walletError) {
                console.log('지갑 정보 로드 실패:', walletError);
            }
        }
        
        console.log('인증 응답:', response);
        
        if (response && response.user) {
            currentUser = response.user;
            tokenManager.setUser(currentUser);
            
            if (response.token) {
                tokenManager.setToken(response.token);
            }
            
            updateUserUI();
            await showDashboard();
            
            if (currentUser.role === 'creator') {
                await checkSpotifyVerification();
                if (!isSpotifyVerified) {
                    setTimeout(() => {
                        showSpotifyModal();
                    }, 1000);
                }
            }
            
        } else {
            throw new Error('인증에 실패했습니다.');
        }
        
    } catch (error) {
        console.error('인증 오류:', error);
        showError(error.message || '인증에 실패했습니다. 다시 시도해주세요.');
    } finally {
        if (submitText) submitText.textContent = authMode === 'login' ? '로그인' : '가입하기';
        if (spinner) spinner.classList.add('hidden');
        if (submitBtn) submitBtn.disabled = false;
    }
}

async function checkSpotifyVerification() {
    try {
        if (currentUser && currentUser.role === 'creator') {
            const response = await api.checkSpotifyStatus();
            isSpotifyVerified = response.verified || false;
            
            const spotifyBadge = document.getElementById('spotify-badge');
            if (isSpotifyVerified && spotifyBadge) {
                spotifyBadge.classList.remove('hidden');
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
    
    const userEmail = document.getElementById('user-email');
    const userRole = document.getElementById('user-role');
    const userInitial = document.getElementById('user-initial');
    
    if (userEmail) userEmail.textContent = user.email;
    if (userRole) userRole.textContent = user.role === 'creator' ? '크리에이터' : 
                                         user.role === 'cafe' ? '카페' : '리스너';
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
        showNotification(message, 'error');
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
    showNotification('로그아웃되었습니다.', 'info');
}

// ============================================================================
// NOTIFICATION SYSTEM
// ============================================================================
function showNotification(message, type = 'info') {
    // 기존 알림 제거
    const oldNotifications = document.querySelectorAll('.notification');
    oldNotifications.forEach(notif => {
        if (notif.parentNode) {
            notif.parentNode.removeChild(notif);
        }
    });
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
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
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.opacity = '0';
            notification.style.transition = 'opacity 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }
    }, 3000);
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
    if (earnedTlStat)
