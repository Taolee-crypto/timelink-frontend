// API 통신 모듈
class TimeLinkAPI {
    constructor() {
        this.authBase = API_CONFIG.AUTH_API;
        this.economicBase = API_CONFIG.ECONOMIC_API;
        this.tokenManager = window.tokenManager;
    }
    
    // 공통 요청 처리
    async request(url, options = {}) {
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...options.headers
        };
        
        // 인증 토큰 추가
        const token = this.tokenManager.getToken();
        if (token && options.requireAuth !== false) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        
        try {
            const response = await fetch(url, {
                ...options,
                headers
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                let errorData;
                try {
                    errorData = JSON.parse(errorText);
                } catch (e) {
                    errorData = { message: errorText || `HTTP ${response.status}` };
                }
                throw new Error(errorData.message || `API 요청 실패: ${response.status}`);
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('API 요청 오류:', error);
            throw error;
        }
    }
    
    // ==================== 인증 API ====================
    
    async signup(userData) {
        const url = `${this.authBase}/api/auth/signup`;
        const response = await this.request(url, {
            method: 'POST',
            body: JSON.stringify(userData),
            requireAuth: false
        });
        
        if (response.token) {
            this.tokenManager.setToken(response.token);
            this.tokenManager.setUser(response.user);
        }
        
        return response;
    }
    
    async login(credentials) {
        const url = `${this.authBase}/api/auth/login`;
        const response = await this.request(url, {
            method: 'POST',
            body: JSON.stringify(credentials),
            requireAuth: false
        });
        
        if (response.token) {
            this.tokenManager.setToken(response.token);
            this.tokenManager.setUser(response.user);
        }
        
        return response;
    }
    
    async verifyToken() {
        const url = `${this.authBase}/api/auth/verify`;
        try {
            return await this.request(url, { method: 'GET' });
        } catch (error) {
            this.tokenManager.clearToken();
            throw error;
        }
    }
    
    // ==================== 경제 시스템 API ====================
    
    async checkHealth() {
        const url = `${this.economicBase}/health`;
        return await this.request(url, { 
            method: 'GET',
            requireAuth: false 
        });
    }
    
    async createAsset(assetData) {
        const url = `${this.economicBase}/api/assets`;
        return await this.request(url, {
            method: 'POST',
            body: JSON.stringify(assetData)
        });
    }
    
    async chargeTL(chargeData) {
        const url = `${this.economicBase}/api/tl/charge`;
        return await this.request(url, {
            method: 'POST',
            body: JSON.stringify(chargeData)
        });
    }
    
    async getWallet() {
        try {
            const url = `${this.economicBase}/api/wallet`;
            const response = await this.request(url, { method: 'GET' });
            
            if (response.wallet) {
                this.tokenManager.setWallet(response.wallet);
            }
            
            return response;
        } catch (error) {
            // 기본 지갑 반환
            return {
                wallet: {
                    earned_tl: 0,
                    purchased_tl: 0,
                    promo_tl: 10000,
                    total: 10000
                }
            };
        }
    }
    
    async requestExchange(exchangeData) {
        const url = `${this.economicBase}/api/exchange`;
        return await this.request(url, {
            method: 'POST',
            body: JSON.stringify(exchangeData)
        });
    }
    
    async verifySpotify(spotifyData) {
        const url = `${this.economicBase}/api/spotify`;
        return await this.request(url, {
            method: 'POST',
            body: JSON.stringify(spotifyData)
        });
    }
    
    async checkSpotifyStatus() {
        try {
            const url = `${this.economicBase}/api/spotify`;
            return await this.request(url, { method: 'GET' });
        } catch (error) {
            return { verified: false };
        }
    }
    
    async getTL3List() {
        try {
            const url = `${this.economicBase}/api/tl3`;
            return await this.request(url, { method: 'GET' });
        } catch (error) {
            return { tracks: [] };
        }
    }
    
    async createTL3(tl3Data) {
        const url = `${this.economicBase}/api/tl3`;
        return await this.request(url, {
            method: 'POST',
            body: JSON.stringify(tl3Data)
        });
    }
    
    async chargeTL3Time(trackId, seconds) {
        const url = `${this.economicBase}/api/tl3/charge`;
        return await this.request(url, {
            method: 'POST',
            body: JSON.stringify({ trackId, seconds })
        });
    }
    
    async playTL3(trackId) {
        const url = `${this.economicBase}/api/tl3/play`;
        return await this.request(url, {
            method: 'POST',
            body: JSON.stringify({ trackId })
        });
    }
    
    async startBroadcast(broadcastData) {
        const url = `${this.economicBase}/api/broadcast/start`;
        return await this.request(url, {
            method: 'POST',
            body: JSON.stringify(broadcastData)
        });
    }
    
    async stopBroadcast() {
        const url = `${this.economicBase}/api/broadcast/stop`;
        return await this.request(url, {
            method: 'POST'
        });
    }
    
    async listenTrack(trackData) {
        const url = `${this.economicBase}/api/listen`;
        return await this.request(url, {
            method: 'POST',
            body: JSON.stringify(trackData)
        });
    }
    
    async likeTrack(trackId) {
        const url = `${this.economicBase}/api/listen/like`;
        return await this.request(url, {
            method: 'POST',
            body: JSON.stringify({ trackId })
        });
    }
    
    async watchAd() {
        const url = `${this.economicBase}/api/listen/ad`;
        return await this.request(url, {
            method: 'POST'
        });
    }
}

// 모킹 API (실제 API 실패시 사용)
class MockAPI {
    constructor() {
        this.users = new Map();
        this.tracks = new Map();
        this.wallets = new Map();
    }
    
    async signup(userData) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const user = {
                    id: `user_${Date.now()}`,
                    email: userData.email,
                    name: userData.name,
                    role: userData.role || 'listener',
                    createdAt: new Date().toISOString()
                };
                
                this.users.set(userData.email, user);
                
                const wallet = {
                    earned_tl: 0,
                    purchased_tl: 0,
                    promo_tl: 10000,
                    total: 10000
                };
                this.wallets.set(user.id, wallet);
                
                resolve({
                    success: true,
                    user: user,
                    token: `mock_token_${Date.now()}`
                });
            }, 500);
        });
    }
    
    async login(credentials) {
        return new Promise((resolve) => {
            setTimeout(() => {
                let user = this.users.get(credentials.email);
                
                if (!user) {
                    user = {
                        id: `user_${Date.now()}`,
                        email: credentials.email,
                        name: credentials.email.split('@')[0],
                        role: 'listener',
                        createdAt: new Date().toISOString()
                    };
                    this.users.set(credentials.email, user);
                    
                    const wallet = {
                        earned_tl: 0,
                        purchased_tl: 0,
                        promo_tl: 10000,
                        total: 10000
                    };
                    this.wallets.set(user.id, wallet);
                }
                
                resolve({
                    success: true,
                    user: user,
                    token: `mock_token_${Date.now()}`
                });
            }, 500);
        });
    }
    
    async getWallet() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    wallet: {
                        earned_tl: 500,
                        purchased_tl: 500,
                        promo_tl: 9000,
                        total: 10000
                    }
                });
            }, 300);
        });
    }
    
    async getTL3List() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    tracks: [
                        {
                            id: 'tl3_001',
                            title: 'Chill Vibes #01',
                            mood: 'Relaxed',
                            bpm: 85,
                            length: 180,
                            source: 'Suno AI',
                            timeCharged: 300,
                            playCount: 42,
                            cafePlayCount: 15,
                            contributionScore: 120
                        }
                    ]
                });
            }, 300);
        });
    }
    
    async createTL3(tl3Data) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const track = {
                    id: `tl3_${Date.now()}`,
                    ...tl3Data,
                    timeCharged: 0,
                    playCount: 0,
                    cafePlayCount: 0,
                    contributionScore: 0
                };
                resolve({ track });
            }, 500);
        });
    }
    
    async chargeTL(chargeData) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    wallet: {
                        earned_tl: 500,
                        purchased_tl: 500,
                        promo_tl: 9000 - (chargeData.amount || 0),
                        total: 10000 - (chargeData.amount || 0)
                    }
                });
            }, 300);
        });
    }
    
    async watchAd() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    wallet: {
                        earned_tl: 500,
                        purchased_tl: 550,
                        promo_tl: 9000,
                        total: 10050
                    }
                });
            }, 300);
        });
    }
    
    async playTL3(trackId) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    track: {
                        id: trackId,
                        playCount: 43,
                        contributionScore: 130
                    },
                    wallet: {
                        earned_tl: 502,
                        purchased_tl: 500,
                        promo_tl: 9000,
                        total: 10002
                    }
                });
            }, 300);
        });
    }
    
    async likeTrack(trackId) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    wallet: {
                        earned_tl: 503,
                        purchased_tl: 500,
                        promo_tl: 9000,
                        total: 10003
                    }
                });
            }, 300);
        });
    }
}

// 하이브리드 API (실제 API 실패시 모킹으로 폴백)
class HybridAPI {
    constructor() {
        this.realAPI = new TimeLinkAPI();
        this.mockAPI = new MockAPI();
        this.useMock = false;
        this.initialized = false;
    }
    
    async init() {
        if (this.initialized) return;
        
        try {
            // API 상태 확인
            await this.realAPI.checkHealth();
            this.useMock = false;
            console.log('실제 API 연결 성공');
        } catch (error) {
            this.useMock = true;
            console.log('실제 API 연결 실패, 모킹 모드로 전환');
        }
        
        this.initialized = true;
    }
    
    async callAPI(realCall, mockCall) {
        await this.init();
        
        if (!this.useMock) {
            try {
                return await realCall();
            } catch (error) {
                console.warn('실제 API 호출 실패, 모킹으로 폴백:', error);
                this.useMock = true;
                return await mockCall();
            }
        } else {
            return await mockCall();
        }
    }
    
    // API 메서드들
    async signup(userData) {
        return this.callAPI(
            () => this.realAPI.signup(userData),
            () => this.mockAPI.signup(userData)
        );
    }
    
    async login(credentials) {
        return this.callAPI(
            () => this.realAPI.login(credentials),
            () => this.mockAPI.login(credentials)
        );
    }
    
    async verifyToken() {
        return this.callAPI(
            () => this.realAPI.verifyToken(),
            () => Promise.resolve({ success: true })
        );
    }
    
    async getWallet() {
        return this.callAPI(
            () => this.realAPI.getWallet(),
            () => this.mockAPI.getWallet()
        );
    }
    
    async getTL3List() {
        return this.callAPI(
            () => this.realAPI.getTL3List(),
            () => this.mockAPI.getTL3List()
        );
    }
    
    async createTL3(tl3Data) {
        return this.callAPI(
            () => this.realAPI.createTL3(tl3Data),
            () => this.mockAPI.createTL3(tl3Data)
        );
    }
    
    async chargeTL(chargeData) {
        return this.callAPI(
            () => this.realAPI.chargeTL(chargeData),
            () => this.mockAPI.chargeTL(chargeData)
        );
    }
    
    async chargeTL3Time(trackId, seconds) {
        return this.callAPI(
            () => this.realAPI.chargeTL3Time(trackId, seconds),
            () => Promise.resolve({ success: true })
        );
    }
    
    async playTL3(trackId) {
        return this.callAPI(
            () => this.realAPI.playTL3(trackId),
            () => this.mockAPI.playTL3(trackId)
        );
    }
    
    async watchAd() {
        return this.callAPI(
            () => this.realAPI.watchAd(),
            () => this.mockAPI.watchAd()
        );
    }
    
    async likeTrack(trackId) {
        return this.callAPI(
            () => this.realAPI.likeTrack(trackId),
            () => this.mockAPI.likeTrack(trackId)
        );
    }
    
    async startBroadcast(broadcastData) {
        return this.callAPI(
            () => this.realAPI.startBroadcast(broadcastData),
            () => Promise.resolve({ success: true })
        );
    }
    
    async stopBroadcast() {
        return this.callAPI(
            () => this.realAPI.stopBroadcast(),
            () => Promise.resolve({ success: true })
        );
    }
    
    async listenTrack(trackData) {
        return this.callAPI(
            () => this.realAPI.listenTrack(trackData),
            () => Promise.resolve({ success: true })
        );
    }
    
    async verifySpotify(spotifyData) {
        return this.callAPI(
            () => this.realAPI.verifySpotify(spotifyData),
            () => Promise.resolve({ verified: true })
        );
    }
    
    async checkSpotifyStatus() {
        return this.callAPI(
            () => this.realAPI.checkSpotifyStatus(),
            () => Promise.resolve({ verified: false })
        );
    }
    
    async requestExchange(exchangeData) {
        return this.callAPI(
            () => this.realAPI.requestExchange(exchangeData),
            () => Promise.resolve({ success: true })
        );
    }
}

// 글로벌 API 객체 생성
window.hybridAPI = new HybridAPI();
window.timeLinkAPI = new TimeLinkAPI();
window.mockAPI = new MockAPI();
