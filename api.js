// 실제 API 통신 모듈 (CORS 대응 버전)
class TimeLinkAPI {
    constructor() {
        this.authBase = 'https://timelink-api.timelink-api.workers.dev';
        this.economicBase = 'https://deconomic-api.timelink-api.workers.dev';
        this.tokenManager = window.tokenManager;
        
        // API 상태 확인
        this.checkAPIs();
    }
    
    // API 상태 확인
    async checkAPIs() {
        try {
            console.log('인증 API 상태 확인 중...');
            const authCheck = await fetch(`${this.authBase}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            });
            console.log('인증 API 상태:', authCheck.status, await authCheck.json());
            
            console.log('경제 API 상태 확인 중...');
            const economicCheck = await fetch(`${this.economicBase}/health`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            });
            console.log('경제 API 상태:', economicCheck.status, await economicCheck.json());
        } catch (error) {
            console.error('API 상태 확인 실패:', error);
        }
    }
    
    // CORS 문제 해결을 위한 프록시 요청 (GitHub Pages용)
    async makeRequest(url, options = {}) {
        // GitHub Pages에서 CORS 문제를 피하기 위한 방법
        // 실제 배포시에는 서버측 프록시를 사용하는 것이 좋습니다
        const corsProxy = 'https://cors-anywhere.herokuapp.com/';
        // 또는: const corsProxy = 'https://api.allorigins.win/raw?url=';
        
        const proxyUrl = corsProxy + encodeURIComponent(url);
        
        try {
            const response = await fetch(proxyUrl, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    ...options.headers
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('프록시 요청 실패:', error);
            
            // 프록시 실패 시 직접 요청 시도
            try {
                const directResponse = await fetch(url, {
                    ...options,
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        ...options.headers
                    }
                });
                
                const data = await directResponse.json();
                return data;
            } catch (directError) {
                console.error('직접 요청도 실패:', directError);
                throw new Error(`API 요청 실패: ${error.message}`);
            }
        }
    }
    
    // 인증 없이 요청
    async requestWithoutAuth(url, options = {}) {
        try {
            const response = await fetch(url, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `API 요청 실패: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('API 요청 오류:', error);
            throw error;
        }
    }
    
    // 인증 포함 요청
    async requestWithAuth(url, options = {}) {
        const token = this.tokenManager.getToken();
        if (!token) {
            throw new Error('인증 토큰이 없습니다.');
        }
        
        try {
            const response = await fetch(url, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (!response.ok) {
                // 토큰 만료 시
                if (response.status === 401) {
                    this.tokenManager.clearToken();
                    throw new Error('인증이 만료되었습니다. 다시 로그인해주세요.');
                }
                
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `API 요청 실패: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('인증 API 요청 오류:', error);
            throw error;
        }
    }
    
    // ==================== 인증 API ====================
    
    // 회원가입
    async signup(userData) {
        const url = `${this.authBase}/api/auth/signup`;
        
        try {
            const response = await this.requestWithoutAuth(url, {
                method: 'POST',
                body: JSON.stringify(userData)
            });
            
            // 토큰 저장
            if (response.token) {
                this.tokenManager.setToken(response.token);
                this.tokenManager.setUser(response.user);
            }
            
            return response;
        } catch (error) {
            throw new Error(`회원가입 실패: ${error.message}`);
        }
    }
    
    // 로그인
    async login(credentials) {
        const url = `${this.authBase}/api/auth/login`;
        
        try {
            const response = await this.requestWithoutAuth(url, {
                method: 'POST',
                body: JSON.stringify(credentials)
            });
            
            // 토큰 저장
            if (response.token) {
                this.tokenManager.setToken(response.token);
                this.tokenManager.setUser(response.user);
            }
            
            return response;
        } catch (error) {
            throw new Error(`로그인 실패: ${error.message}`);
        }
    }
    
    // 토큰 검증
    async verifyToken() {
        const url = `${this.authBase}/api/auth/verify`;
        
        try {
            const response = await this.requestWithAuth(url, {
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
        const url = `${this.economicBase}/health`;
        
        const response = await this.requestWithoutAuth(url, {
            method: 'GET'
        });
        
        return response;
    }
    
    // 자산 생성 (TL3 생성)
    async createAsset(assetData) {
        const url = `${this.economicBase}/api/assets`;
        
        const response = await this.requestWithAuth(url, {
            method: 'POST',
            body: JSON.stringify(assetData)
        });
        
        return response;
    }
    
    // TL 충전
    async chargeTL(chargeData) {
        const url = `${this.economicBase}/api/tl/charge`;
        
        const response = await this.requestWithAuth(url, {
            method: 'POST',
            body: JSON.stringify(chargeData)
        });
        
        return response;
    }
    
    // 지갑 정보 조회
    async getWallet() {
        const url = `${this.economicBase}/api/wallet`;
        
        try {
            const response = await this.requestWithAuth(url, {
                method: 'GET'
            });
            
            // 지갑 정보 저장
            if (response.wallet) {
                this.tokenManager.setWallet(response.wallet);
            }
            
            return response;
        } catch (error) {
            // 지갑이 없을 경우 기본 지갑 반환
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
    
    // 환전 요청
    async requestExchange(exchangeData) {
        const url = `${this.economicBase}/api/exchange`;
        
        const response = await this.requestWithAuth(url, {
            method: 'POST',
            body: JSON.stringify(exchangeData)
        });
        
        return response;
    }
    
    // Spotify 인증
    async verifySpotify(spotifyData) {
        const url = `${this.economicBase}/api/spotify`;
        
        const response = await this.requestWithAuth(url, {
            method: 'POST',
            body: JSON.stringify(spotifyData)
        });
        
        return response;
    }
    
    // Spotify 인증 상태 확인
    async checkSpotifyStatus() {
        const url = `${this.economicBase}/api/spotify`;
        
        try {
            const response = await this.requestWithAuth(url, {
                method: 'GET'
            });
            
            return response;
        } catch (error) {
            // Spotify 인증이 없으면 기본 응답
            return { verified: false };
        }
    }
    
    // TL3 목록 조회
    async getTL3List() {
        const url = `${this.economicBase}/api/tl3`;
        
        try {
            const response = await this.requestWithAuth(url, {
                method: 'GET'
            });
            
            return response;
        } catch (error) {
            // 에러 발생 시 빈 배열 반환
            return { tracks: [] };
        }
    }
    
    // TL3 생성
    async createTL3(tl3Data) {
        const url = `${this.economicBase}/api/tl3`;
        
        const response = await this.requestWithAuth(url, {
            method: 'POST',
            body: JSON.stringify(tl3Data)
        });
        
        return response;
    }
    
    // 방송 시작
    async startBroadcast(broadcastData) {
        const url = `${this.economicBase}/api/broadcast/start`;
        
        const response = await this.requestWithAuth(url, {
            method: 'POST',
            body: JSON.stringify(broadcastData)
        });
        
        return response;
    }
    
    // 방송 중지
    async stopBroadcast() {
        const url = `${this.economicBase}/api/broadcast/stop`;
        
        const response = await this.requestWithAuth(url, {
            method: 'POST'
        });
        
        return response;
    }
    
    // 음악 재생
    async listenTrack(trackData) {
        const url = `${this.economicBase}/api/listen`;
        
        const response = await this.requestWithAuth(url, {
            method: 'POST',
            body: JSON.stringify(trackData)
        });
        
        return response;
    }
    
    // 트랙 좋아요
    async likeTrack(trackId) {
        const url = `${this.economicBase}/api/listen/like`;
        
        const response = await this.requestWithAuth(url, {
            method: 'POST',
            body: JSON.stringify({ trackId })
        });
        
        return response;
    }
    
    // 광고 시청
    async watchAd() {
        const url = `${this.economicBase}/api/listen/ad`;
        
        const response = await this.requestWithAuth(url, {
            method: 'POST'
        });
        
        return response;
    }
}

// 글로벌 API 객체 생성
window.timeLinkAPI = new TimeLinkAPI();
