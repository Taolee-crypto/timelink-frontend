// API 엔드포인트 설정
const API_CONFIG = {
    // 인증 API
    AUTH_API: 'https://timelink-api.timelink-api.workers.dev',
    
    // 경제 시스템 API
    ECONOMIC_API: 'https://deconomic-api.timelink-api.workers.dev',
    
    // 엔드포인트
    ENDPOINTS: {
        // 인증
        SIGNUP: '/api/auth/signup',
        LOGIN: '/api/auth/login',
        VERIFY: '/api/auth/verify',
        
        // 경제 시스템
        HEALTH: '/health',
        ASSET_CREATE: '/api/assets',
        TL_CHARGE: '/api/tl/charge',
        WALLET: '/api/wallet',
        EXCHANGE: '/api/exchange',
        SPOTIFY: '/api/spotify',
        TL3: '/api/tl3',
        BROADCAST: '/api/broadcast',
        LISTEN: '/api/listen'
    }
};

// 토큰 관리
class TokenManager {
    constructor() {
        this.tokenKey = 'timelink_token';
        this.userKey = 'timelink_user';
        this.walletKey = 'timelink_wallet';
    }
    
    setToken(token) {
        localStorage.setItem(this.tokenKey, token);
    }
    
    getToken() {
        return localStorage.getItem(this.tokenKey);
    }
    
    clearToken() {
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem(this.userKey);
        localStorage.removeItem(this.walletKey);
    }
    
    setUser(user) {
        localStorage.setItem(this.userKey, JSON.stringify(user));
    }
    
    getUser() {
        const userStr = localStorage.getItem(this.userKey);
        try {
            return userStr ? JSON.parse(userStr) : null;
        } catch (e) {
            return null;
        }
    }
    
    setWallet(wallet) {
        localStorage.setItem(this.walletKey, JSON.stringify(wallet));
    }
    
    getWallet() {
        const walletStr = localStorage.getItem(this.walletKey);
        try {
            return walletStr ? JSON.parse(walletStr) : null;
        } catch (e) {
            return null;
        }
    }
    
    isAuthenticated() {
        const token = this.getToken();
        const user = this.getUser();
        return !!token && !!user;
    }
}

// 글로벌 토큰 관리자 생성
window.tokenManager = new TokenManager();
