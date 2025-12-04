// api.js 파일 전체 내용
const API_BASE = 'http://localhost:8787';  // 이 줄이 이렇게 되어야 함

class TimeLinkAPI {
    constructor() {
        this.baseUrl = API_BASE;
        this.token = localStorage.getItem('timelink_token');
        this.user = JSON.parse(localStorage.getItem('timelink_user') || '{}');
    }

    // register 메서드가 있어야 함
    async register(userData) {
        return this.request('/api/auth/register', {
            method: 'POST',
            body: userData
        });
    }

    // request 메서드가 있어야 함
    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        try {
            console.log(`API 요청: ${url}`, options);
            const response = await fetch(url, {
                ...options,
                headers,
                mode: 'cors'
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

    // 기타 메서드들...
}

// 글로벌 인스턴스
const api = new TimeLinkAPI();
window.TimeLinkAPI = api;

export { TimeLinkAPI, api };
export default api;
