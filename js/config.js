// TL Platform API 설정 - Cloudflare Workers
const API_CONFIG = {
    BASE_URL: '',
    ENDPOINTS: {
        ROOT: '/',
        HEALTH: '/health',
        MARKET: {
            LIST: '/market/list'
        },
        AUTH: {
            LOGIN: '/auth/login',
            REGISTER: '/auth/register'
        },
        CONTENT: {
            UPLOAD: '/content/upload'
        }
    }
};

// API 호출 클래스
class TLAPI {
    constructor() {
        this.baseURL = API_CONFIG.BASE_URL;
        this.token = localStorage.getItem('tl_token');
        console.log('🚀 TLAPI 초기화 완료:', this.baseURL);
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        console.log('📡 API 요청:', url);
        
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

            console.log('📥 응답 상태:', response.status);
            
            if (response.status === 401) {
                localStorage.removeItem('tl_token');
                localStorage.removeItem('tl_user');
                window.location.href = 'auth.html';
                throw new Error('인증이 만료되었습니다.');
            }

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || data.message || 'API 요청 실패');
            }

            console.log('✅ API 성공:', data);
            return data;
        } catch (error) {
            console.error('❌ API 오류:', error);
            throw error;
        }
    }

    // 시스템 상태 확인
    async checkHealth() {
        return this.request(API_CONFIG.ENDPOINTS.HEALTH);
    }

    // 마켓 아이템 가져오기
    async getMarketItems() {
        return this.request('/market/list');
    }

    // 로그인
    async login(email, password) {
        const data = await this.request(API_CONFIG.ENDPOINTS.AUTH.LOGIN, {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });

        if (data.token) {
            this.token = data.token;
            localStorage.setItem('tl_token', data.token);
            localStorage.setItem('tl_user', JSON.stringify(data.user));
        }

        return data;
    }

    // 회원가입
    async register(userData) {
        return this.request(API_CONFIG.ENDPOINTS.AUTH.REGISTER, {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    }

    // 파일 업로드
    async uploadFile(fileData) {
        return this.request(API_CONFIG.ENDPOINTS.CONTENT.UPLOAD, {
            method: 'POST',
            body: JSON.stringify(fileData)
        });
    }
}

// 글로벌 인스턴스 생성
const api = new TLAPI();
window.TLAPI = api;

// 페이지 로드 시 API 상태 확인
window.addEventListener('DOMContentLoaded', async () => {
    console.log('📱 TL Platform 프론트엔드 로드됨');
    
    try {
        const health = await api.checkHealth();
        console.log('💚 백엔드 상태:', health);
        
        // 상태 표시 업데이트
        const statusElement = document.getElementById('backendStatus');
        if (statusElement) {
            statusElement.textContent = '✅ 온라인';
            statusElement.className = 'status-value online';
        }
    } catch (error) {
        console.error('💔 백엔드 연결 실패:', error);
    }
});
