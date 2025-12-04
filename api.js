// api.js - 실제 백엔드와 연동되는 버전
const API_BASE = 'https://timelink-backend.taolee-crypto.workers.dev'; // 실제 백엔드 URL로 변경 필요

class TimeLinkAPI {
    constructor() {
        this.baseUrl = API_BASE;
        this.token = localStorage.getItem('timelink_token');
        this.user = JSON.parse(localStorage.getItem('timelink_user') || '{}');
    }

    // HTTP 요청 유틸리티
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
            console.log(`API Request: ${url}`, options);
            const response = await fetch(url, {
                ...options,
                headers,
                mode: 'cors',
                credentials: 'omit'
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

    // 인증 관련
    async login(email, password) {
        const result = await this.request('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
        
        if (result.success) {
            this.setToken(result.token);
            this.setUser(result.user);
        }
        
        return result;
    }

    async register(userData) {
        return this.request('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    }

    async verifyToken() {
        if (!this.token) return false;
        
        try {
            const result = await this.request('/api/auth/verify');
            return result.success;
        } catch {
            return false;
        }
    }

    // 사용자 정보
    async getUserProfile() {
        try {
            const result = await this.request('/api/user/profile');
            if (result.success) {
                this.setUser(result.user);
            }
            return result;
        } catch (error) {
            console.error('프로필 조회 오류:', error);
            return { success: false, message: '프로필 조회 실패' };
        }
    }

    async updateProfile(userData) {
        return this.request('/api/user/profile', {
            method: 'PUT',
            body: JSON.stringify(userData)
        });
    }

    // 콘텐츠 관련
    async uploadContent(formData) {
        const url = `${this.baseUrl}/api/content/upload`;
        const headers = {};
        
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        const response = await fetch(url, {
            method: 'POST',
            headers,
            body: formData
        });

        return response.json();
    }

    async getContentList(page = 1, limit = 10) {
        return this.request(`/api/content/list?page=${page}&limit=${limit}`);
    }

    async getContentById(id) {
        return this.request(`/api/content/${id}`);
    }

    async deleteContent(id) {
        return this.request(`/api/content/${id}`, {
            method: 'DELETE'
        });
    }

    // 스튜디오 관련
    async getStudioProjects() {
        return this.request('/api/studio/projects');
    }

    async createStudioProject(projectData) {
        return this.request('/api/studio/projects', {
            method: 'POST',
            body: JSON.stringify(projectData)
        });
    }

    // 마켓 관련
    async getMarketItems(category = 'all', page = 1) {
        return this.request(`/api/market/list?category=${category}&page=${page}`);
    }

    async purchaseItem(itemId) {
        return this.request(`/api/market/buy`, {
            method: 'POST',
            body: JSON.stringify({ itemId })
        });
    }

    // 튜브 관련
    async getTubeVideos(page = 1, category = 'music') {
        return this.request(`/api/tube/videos?page=${page}&category=${category}`);
    }

    // 광고 관련
    async getAdStats() {
        return this.request('/api/ad/stats');
    }

    // 토큰 및 사용자 관리
    setToken(token) {
        this.token = token;
        localStorage.setItem('timelink_token', token);
    }

    setUser(user) {
        this.user = user;
        localStorage.setItem('timelink_user', JSON.stringify(user));
    }

    getCurrentUser() {
        return this.user;
    }

    logout() {
        this.token = null;
        this.user = {};
        localStorage.removeItem('timelink_token');
        localStorage.removeItem('timelink_user');
        window.location.href = 'login.html';
    }

    isAuthenticated() {
        return !!this.token && !!this.user?.id;
    }
}

// 글로벌 인스턴스 생성
const api = new TimeLinkAPI();

// 브라우저 개발자 도구에서 테스트용
window.TimeLinkAPI = api;

// 기본 export
export { TimeLinkAPI, api };
export default api;
