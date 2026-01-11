// 실제 API 통신 모듈
class TimeLinkAPI {
    constructor() {
        this.authBase = API_CONFIG.AUTH_API;
        this.economicBase = API_CONFIG.ECONOMIC_API;
        this.tokenManager = window.tokenManager;
    }
    
    // 공통 헤더
    getHeaders(withAuth = true) {
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
        
        if (withAuth) {
            const token = this.tokenManager.getToken();
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
        }
        
        return headers;
    }
    
    // 공통 요청 처리
    async request(url, options = {}) {
        try {
            const response = await fetch(url, {
                ...options,
                headers: this.getHeaders(options.withAuth !== false)
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || `API 요청 실패: ${response.status}`);
            }
            
            return data;
        } catch (error) {
            console.error('API 요청 오류:', error);
            throw error;
        }
    }
    
    // ==================== 인증 API ====================
    
    // 회원가입
    async signup(userData) {
        const url = `${this.authBase}${API_CONFIG.ENDPOINTS.SIGNUP}`;
        
        const response = await this.request(url, {
            method: 'POST',
            body: JSON.stringify(userData),
            withAuth: false
        });
        
        // 토큰 저장
        if (response.token) {
            this.tokenManager.setToken(response.token);
            this.tokenManager.setUser(response.user);
        }
        
        return response;
    }
    
    // 로그인
    async login(credentials) {
        const url = `${this.authBase}${API_CONFIG.ENDPOINTS.LOGIN}`;
        
        const response = await this.request(url, {
            method: 'POST',
            body: JSON.stringify(credentials),
            withAuth: false
        });
        
        // 토큰 저장
        if (response.token) {
            this.tokenManager.setToken(response.token);
            this.tokenManager.setUser(response.user);
        }
        
        return response;
    }
    
    // 토큰 검증
    async verifyToken() {
        const url = `${this.authBase}${API_CONFIG.ENDPOINTS.VERIFY}`;
        
        try {
            const response = await this.request(url, {
                method: 'GET'
            });
            return response;
        } catch (error) {
            // 토큰이 유효하지 않으면 삭제
            this.tokenManager.clearToken();
            throw error;
        }
    }
    
    // ==================== 경제 시스템 API ====================
    
    // 시스템 상태 확인
    async checkHealth() {
        const url = `${this.economicBase}${API_CONFIG.ENDPOINTS.HEALTH}`;
        
        const response = await this.request(url, {
            method: 'GET',
            withAuth: false
        });
        
        return response;
    }
    
    // 자산 생성 (TL3 생성)
    async createAsset(assetData) {
        const url = `${this.economicBase}${API_CONFIG.ENDPOINTS.ASSET_CREATE}`;
        
        const response = await this.request(url, {
            method: 'POST',
            body: JSON.stringify(assetData)
        });
        
        return response;
    }
    
    // TL 충전
    async chargeTL(chargeData) {
        const url = `${this.economicBase}${API_CONFIG.ENDPOINTS.TL_CHARGE}`;
        
        const response = await this.request(url, {
            method: 'POST',
            body: JSON.stringify(chargeData)
        });
        
        return response;
    }
    
    // 지갑 정보 조회
    async getWallet() {
        const url = `${this.economicBase}${API_CONFIG.ENDPOINTS.WALLET}`;
        
        const response = await this.request(url, {
            method: 'GET'
        });
        
        return response;
    }
    
    // 환전 요청
    async requestExchange(exchangeData) {
        const url = `${this.economicBase}${API_CONFIG.ENDPOINTS.EXCHANGE}`;
        
        const response = await this.request(url, {
            method: 'POST',
            body: JSON.stringify(exchangeData)
        });
        
        return response;
    }
    
    // Spotify 인증
    async verifySpotify(spotifyData) {
        const url = `${this.economicBase}${API_CONFIG.ENDPOINTS.SPOTIFY}`;
        
        const response = await this.request(url, {
            method: 'POST',
            body: JSON.stringify(spotifyData)
        });
        
        return response;
    }
    
    // TL3 목록 조회
    async getTL3List() {
        const url = `${this.economicBase}${API_CONFIG.ENDPOINTS.TL3}`;
        
        const response = await this.request(url, {
            method: 'GET'
        });
        
        return response;
    }
    
    // TL3 생성
    async createTL3(tl3Data) {
        const url = `${this.economicBase}${API_CONFIG.ENDPOINTS.TL3}`;
        
        const response = await this.request(url, {
            method: 'POST',
            body: JSON.stringify(tl3Data)
        });
        
        return response;
    }
    
    // 방송 시작
    async startBroadcast(broadcastData) {
        const url = `${this.economicBase}${API_CONFIG.ENDPOINTS.BROADCAST}/start`;
        
        const response = await this.request(url, {
            method: 'POST',
            body: JSON.stringify(broadcastData)
        });
        
        return response;
    }
    
    // 방송 중지
    async stopBroadcast() {
        const url = `${this.economicBase}${API_CONFIG.ENDPOINTS.BROADCAST}/stop`;
        
        const response = await this.request(url, {
            method: 'POST'
        });
        
        return response;
    }
    
    // 음악 재생
    async listenTrack(trackData) {
        const url = `${this.economicBase}${API_CONFIG.ENDPOINTS.LISTEN}`;
        
        const response = await this.request(url, {
            method: 'POST',
            body: JSON.stringify(trackData)
        });
        
        return response;
    }
    
    // 트랙 좋아요
    async likeTrack(trackId) {
        const url = `${this.economicBase}${API_CONFIG.ENDPOINTS.LISTEN}/like`;
        
        const response = await this.request(url, {
            method: 'POST',
            body: JSON.stringify({ trackId })
        });
        
        return response;
    }
    
    // 광고 시청
    async watchAd() {
        const url = `${this.economicBase}${API_CONFIG.ENDPOINTS.LISTEN}/ad`;
        
        const response = await this.request(url, {
            method: 'POST'
        });
        
        return response;
    }
}

// 글로벌 API 객체 생성
window.timeLinkAPI = new TimeLinkAPI();
