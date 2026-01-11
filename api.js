// api.js
// TIMELINK API 서비스 - 실제 API 엔드포인트 사용

const TimelinkAPIService = {
    // 실제 API 엔드포인트
    AUTH_API: 'https://timelink-api.timelink-api.workers.dev',
    ECONOMIC_API: 'https://deconomic-api.timelink-api.workers.dev',
    
    // 인증 토큰
    token: null,
    user: null,

    // 초기화
    init() {
        this.loadAuthToken();
        this.loadUser();
    },

    // 로컬 스토리지에서 토큰 로드
    loadAuthToken() {
        this.token = localStorage.getItem('timelink_token');
        return this.token;
    },

    // 로컬 스토리지에서 사용자 정보 로드
    loadUser() {
        const userData = localStorage.getItem('timelink_user');
        if (userData) {
            try {
                this.user = JSON.parse(userData);
            } catch (e) {
                console.error('사용자 정보 파싱 실패:', e);
                this.user = null;
            }
        }
        return this.user;
    },

    // 공통 헤더
    getHeaders(includeAuth = true) {
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };

        if (includeAuth && this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        return headers;
    },

    // API 호출 래퍼
    async callAPI(url, options = {}) {
        try {
            const response = await fetch(url, {
                ...options,
                headers: this.getHeaders(options.includeAuth !== false)
            });

            const data = await response.json();

            if (!response.ok) {
                // 토큰 만료 시 재시도
                if (response.status === 401 && this.token) {
                    console.log('토큰 만료, 로그아웃 처리');
                    this.logout();
                    window.location.reload();
                }
                throw new Error(data.message || `API 오류: ${response.status}`);
            }

            return { success: true, data };
        } catch (error) {
            console.error('API 호출 오류:', error);
            return { 
                success: false, 
                error: error.message || '네트워크 오류가 발생했습니다'
            };
        }
    },

    // ==================== 인증 API ====================
    
    // 1. 로그인
    async login(email, password) {
        const result = await this.callAPI(`${this.AUTH_API}/auth/login`, {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });

        if (result.success) {
            this.token = result.data.token;
            this.user = result.data.user;
            
            // 로컬 스토리지 저장
            localStorage.setItem('timelink_token', this.token);
            localStorage.setItem('timelink_user', JSON.stringify(this.user));
            
            // 새로고침 토큰도 저장
            if (result.data.refresh_token) {
                localStorage.setItem('timelink_refresh_token', result.data.refresh_token);
            }
        }

        return result;
    },

    // 2. 회원가입
    async register(userData) {
        const result = await this.callAPI(`${this.AUTH_API}/auth/register`, {
            method: 'POST',
            body: JSON.stringify(userData)
        });

        if (result.success) {
            this.token = result.data.token;
            this.user = result.data.user;
            
            localStorage.setItem('timelink_token', this.token);
            localStorage.setItem('timelink_user', JSON.stringify(this.user));
        }

        return result;
    },

    // 3. 로그아웃
    logout() {
        this.token = null;
        this.user = null;
        localStorage.removeItem('timelink_token');
        localStorage.removeItem('timelink_user');
        localStorage.removeItem('timelink_refresh_token');
    },

    // 4. 토큰 갱신
    async refreshToken() {
        const refreshToken = localStorage.getItem('timelink_refresh_token');
        if (!refreshToken) {
            return { success: false, error: '리프레시 토큰 없음' };
        }

        const result = await this.callAPI(`${this.AUTH_API}/auth/refresh`, {
            method: 'POST',
            body: JSON.stringify({ refresh_token: refreshToken })
        });

        if (result.success) {
            this.token = result.data.access_token;
            localStorage.setItem('timelink_token', this.token);
        }

        return result;
    },

    // ==================== 경제적 API (ECONOMIC_API) ====================
    
    // 1. TL 잔액 조회
    async getBalance() {
        return await this.callAPI(`${this.ECONOMIC_API}/wallet/balance`);
    },

    // 2. TL 충전
    async chargeTL(amount, paymentMethod) {
        return await this.callAPI(`${this.ECONOMIC_API}/wallet/charge`, {
            method: 'POST',
            body: JSON.stringify({
                amount,
                payment_method: paymentMethod,
                currency: 'TL'
            })
        });
    },

    // 3. 수익 조회
    async getRevenue(period = 'monthly') {
        return await this.callAPI(`${this.ECONOMIC_API}/revenue?period=${period}`);
    },

    // 4. 출금 요청
    async requestWithdrawal(amount, bankInfo) {
        return await this.callAPI(`${this.ECONOMIC_API}/withdrawal/request`, {
            method: 'POST',
            body: JSON.stringify({
                amount,
                bank_info: bankInfo
            })
        });
    },

    // 5. 거래 내역 조회
    async getTransactions(page = 1, limit = 20) {
        return await this.callAPI(`${this.ECONOMIC_API}/transactions?page=${page}&limit=${limit}`);
    },

    // ==================== 음원 관리 API ====================
    
    // 1. 음원 업로드
    async uploadMusic(file, metadata) {
        const formData = new FormData();
        formData.append('audio_file', file);
        formData.append('title', metadata.title);
        formData.append('artist', metadata.artist);
        formData.append('genre', metadata.genre);
        formData.append('quality', metadata.quality);

        try {
            const response = await fetch(`${this.AUTH_API}/music/upload`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.token}`
                },
                body: formData
            });

            const data = await response.json();
            return { success: response.ok, data };
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    // 2. TL3 변환
    async convertToTL3(musicId, quality = 'standard') {
        return await this.callAPI(`${this.AUTH_API}/music/${musicId}/convert`, {
            method: 'POST',
            body: JSON.stringify({ quality })
        });
    },

    // 3. 내 TL3 파일 목록
    async getMyTL3Files(page = 1, limit = 20) {
        return await this.callAPI(`${this.AUTH_API}/music/tl3/my?page=${page}&limit=${limit}`);
    },

    // 4. 음원 재생 통계
    async getMusicStats(musicId) {
        return await this.callAPI(`${this.AUTH_API}/music/${musicId}/stats`);
    },

    // ==================== Marketplace API ====================
    
    // 1. 음원 검색
    async searchMusic(query, filters = {}) {
        const params = new URLSearchParams({
            q: query,
            ...filters
        });
        return await this.callAPI(`${this.AUTH_API}/marketplace/search?${params}`);
    },

    // 2. 음원 구매
    async purchaseMusic(musicId) {
        return await this.callAPI(`${this.AUTH_API}/marketplace/purchase`, {
            method: 'POST',
            body: JSON.stringify({ music_id: musicId })
        });
    },

    // ==================== CAFE-RADIO API ====================
    
    // 1. 카페 등록
    async registerCafe(cafeData) {
        return await this.callAPI(`${this.AUTH_API}/cafe/register`, {
            method: 'POST',
            body: JSON.stringify(cafeData)
        });
    },

    // 2. 카페 라디오 생성
    async createCafeRadio(radioData) {
        return await this.callAPI(`${this.AUTH_API}/cafe/radio`, {
            method: 'POST',
            body: JSON.stringify(radioData)
        });
    },

    // 3. 카페 재생 통계
    async getCafePlayStats(cafeId) {
        return await this.callAPI(`${this.AUTH_API}/cafe/${cafeId}/stats`);
    },

    // ==================== 통합 API ====================
    
    // 1. 대시보드 데이터
    async getDashboardData() {
        return await this.callAPI(`${this.AUTH_API}/dashboard`);
    },

    // 2. 알림 목록
    async getNotifications() {
        return await this.callAPI(`${this.AUTH_API}/notifications`);
    },

    // 3. 프로필 업데이트
    async updateProfile(profileData) {
        return await this.callAPI(`${this.AUTH_API}/profile`, {
            method: 'PUT',
            body: JSON.stringify(profileData)
        });
    },

    // 4. API 상태 체크
    async checkAPIStatus() {
        try {
            const [authResponse, economicResponse] = await Promise.all([
                fetch(`${this.AUTH_API}/health`),
                fetch(`${this.ECONOMIC_API}/health`)
            ]);

            return {
                auth_api: authResponse.ok,
                economic_api: economicResponse.ok,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            return {
                auth_api: false,
                economic_api: false,
                error: error.message
            };
        }
    }
};

// 싱글톤 인스턴스
window.TimelinkAPI = TimelinkAPIService;

// 자동 초기화
document.addEventListener('DOMContentLoaded', () => {
    TimelinkAPIService.init();
});
