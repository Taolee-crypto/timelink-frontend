// TL Platform API 설정
// 배포된 백엔드 URL: https://timelink-api.YOUR_SUBDOMAIN.workers.dev

const API_CONFIG = {
    BASE_URL: 'https://timelink-api.YOUR_SUBDOMAIN.workers.dev',
    ENDPOINTS: {
        AUTH: {
            LOGIN: '/auth/login',
            REGISTER: '/auth/register',
            LOGOUT: '/auth/logout',
            TEST: '/auth/test'
        },
        CONTENT: {
            UPLOAD: '/content/upload',
            LIST: '/content/list',
            PLAY: '/content/play'
        },
        MARKET: {
            LIST: '/market/list',
            BUY: '/market/buy',
            SELL: '/market/sell'
        },
        STUDIO: {
            PROJECTS: '/studio/projects',
            SAVE: '/studio/save'
        },
        COPYRIGHT: {
            REQUEST: '/copyright/request',
            STATUS: '/copyright/status'
        }
    }
};

// API 호출 헬퍼 함수
class TLAPI {
    constructor() {
        this.baseURL = API_CONFIG.BASE_URL;
        this.token = localStorage.getItem('tl_token');
        console.log('TLAPI 초기화 - Base URL:', this.baseURL);
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        console.log('API 요청:', url, options.method || 'GET');
        
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        try {
            const response = await fetch(url, {
                ...options,
                headers
            });

            console.log('API 응답 상태:', response.status);
            
            if (response.status === 401) {
                console.warn('인증 만료됨');
                localStorage.removeItem('tl_token');
                localStorage.removeItem('tl_user');
                window.location.href = 'auth.html';
                throw new Error('인증이 만료되었습니다. 다시 로그인해주세요.');
            }

            const data = await response.json();
            
            if (!response.ok) {
                console.error('API 오류:', data);
                throw new Error(data.error || data.message || 'API 요청 실패');
            }

            console.log('API 성공:', data);
            return data;
        } catch (error) {
            console.error('API 요청 실패:', error);
            throw error;
        }
    }

    // 인증 관련 메서드
    async login(email, password) {
        const data = await this.request(API_CONFIG.ENDPOINTS.AUTH.LOGIN, {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });

        if (data.token) {
            this.token = data.token;
            localStorage.setItem('tl_token', data.token);
            localStorage.setItem('tl_user', JSON.stringify(data.user));
            console.log('로그인 성공, 토큰 저장됨');
        }

        return data;
    }

    async register(userData) {
        return this.request(API_CONFIG.ENDPOINTS.AUTH.REGISTER, {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    }

    async testAuth() {
        return this.request(API_CONFIG.ENDPOINTS.AUTH.TEST);
    }

    // 콘텐츠 관련 메서드
    async uploadFile(fileData) {
        return this.request(API_CONFIG.ENDPOINTS.CONTENT.UPLOAD, {
            method: 'POST',
            body: JSON.stringify(fileData)
        });
    }

    // 마켓 관련 메서드
    async getMarketItems() {
        return this.request(API_CONFIG.ENDPOINTS.MARKET.LIST);
    }

    async buyItem(itemId) {
        return this.request(`${API_CONFIG.ENDPOINTS.MARKET.BUY}/${itemId}`, {
            method: 'POST'
        });
    }

    // 시스템 상태 확인
    async checkHealth() {
        try {
            const response = await fetch(this.baseURL);
            return await response.json();
        } catch (error) {
            return {
                status: 'error',
                message: '백엔드 서버에 연결할 수 없습니다',
                error: error.message
            };
        }
    }
}

// 글로벌 API 인스턴스 생성
const api = new TLAPI();
window.TLAPI = api;

// 초기화 시 백엔드 상태 확인
window.addEventListener('DOMContentLoaded', async () => {
    console.log('TL Platform 프론트엔드 로드됨');
    
    // 백엔드 상태 확인
    const health = await api.checkHealth();
    console.log('백엔드 상태:', health);
    
    // 상태 표시 (선택사항)
    const statusElement = document.getElementById('backendStatus');
    if (statusElement) {
        if (health.status === 'ok') {
            statusElement.innerHTML = `✅ 백엔드 연결 성공: ${health.message}`;
            statusElement.style.color = '#4CAF50';
        } else {
            statusElement.innerHTML = `❌ 백엔드 연결 실패: ${health.message}`;
            statusElement.style.color = '#f44336';
        }
    }
});
