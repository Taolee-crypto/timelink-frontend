// api.js - 로컬 백엔드로 연결
const API_BASE = 'http://localhost:8787'; // 로컬 개발 서버

class TimeLinkAPI {
    constructor() {
        this.baseUrl = API_BASE;
        this.token = localStorage.getItem('timelink_token');
        this.user = JSON.parse(localStorage.getItem('timelink_user') || '{}');
    }

    // HTTP 요청 유틸리티 (CORS 문제 해결)
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
            
            const fetchOptions = {
                ...options,
                headers,
                mode: 'cors',
                credentials: 'omit'
            };

            // body가 있는 경우만 JSON.stringify
            if (options.body && typeof options.body === 'object') {
                fetchOptions.body = JSON.stringify(options.body);
            }

            const response = await fetch(url, fetchOptions);
            
            // 응답이 JSON인지 확인
            const contentType = response.headers.get('content-type');
            let data;
            
            if (contentType && contentType.includes('application/json')) {
                data = await response.json();
            } else {
                const text = await response.text();
                console.warn('JSON 응답이 아님:', text);
                data = { success: false, message: '서버 응답 오류' };
            }

            if (!response.ok) {
                throw new Error(data.message || `API 요청 실패: ${response.status}`);
            }

            return data;
        } catch (error) {
            console.error('API 요청 오류:', error);
            
            // 로컬 개발 중에는 더미 데이터 반환
            if (this.isLocalDev()) {
                console.log('로컬 개발 모드: 더미 데이터 반환');
                return this.getMockData(endpoint, options);
            }
            
            throw error;
        }
    }

    // 로컬 개발 모드인지 확인
    isLocalDev() {
        return this.baseUrl.includes('localhost') || this.baseUrl.includes('127.0.0.1');
    }

    // 더미 데이터 생성 (개발용)
    getMockData(endpoint, options) {
        console.log(`더미 데이터 생성: ${endpoint}`);
        
        // 엔드포인트별 더미 데이터
        const mockData = {
            '/api/auth/login': {
                success: true,
                token: 'mock-jwt-token-' + Date.now(),
                user: {
                    id: 1,
                    email: 'test@timelink.com',
                    name: '테스트 사용자',
                    balance: 50000
                }
            },
            '/api/auth/register': {
                success: true,
                message: '회원가입 성공'
            },
            '/api/auth/verify': {
                success: true
            },
            '/api/user/profile': {
                success: true,
                user: {
                    id: 1,
                    email: 'test@timelink.com',
                    name: '테스트 사용자',
                    balance: 75000,
                    createdAt: new Date().toISOString()
                }
            },
            '/api/content/list': {
                success: true,
                data: [
                    {
                        id: '1',
                        title: 'First Track',
                        author: '테스트 아티스트',
                        duration: 180,
                        views: 1500,
                        created_at: new Date().toISOString()
                    },
                    {
                        id: '2',
                        title: 'Chill Vibes',
                        author: '디제이 킴',
                        duration: 240,
                        views: 3200,
                        created_at: new Date(Date.now() - 86400000).toISOString()
                    }
                ],
                total: 2
            },
            '/api/studio/projects': {
                success: true,
                projects: [
                    { id: 'proj1', name: 'My First Song', lastModified: new Date().toISOString() },
                    { id: 'proj2', name: 'Summer Beat', lastModified: new Date(Date.now() - 172800000).toISOString() }
                ]
            },
            '/api/market/list': {
                success: true,
                items: [
                    { id: 'item1', name: 'Bass Pack', price: 15000, seller: 'SoundMaster' },
                    { id: 'item2', name: 'Vocal Samples', price: 25000, seller: 'VocalLab' }
                ]
            },
            '/api/tube/videos': {
                success: true,
                videos: [
                    { id: 'vid1', title: 'How to Make Lofi', views: 15000, duration: 600 },
                    { id: 'vid2', title: 'Mixing Tutorial', views: 8000, duration: 900 }
                ]
            },
            '/api/ad/stats': {
                success: true,
                totalTracks: 15,
                totalViews: 45000,
                totalEarnings: 125000,
                avgRating: 4.5
            },
            '/api/health': {
                status: 'ok',
                timestamp: new Date().toISOString(),
                environment: 'development'
            }
        };

        // 기본 응답
        const defaultResponse = {
            success: true,
            message: '더미 데이터',
            timestamp: new Date().toISOString()
        };

        return mockData[endpoint] || defaultResponse;
    }

    // 나머지 메서드들은 그대로 유지...
    async login(email, password) {
        const result = await this.request('/api/auth/login', {
            method: 'POST',
            body: { email, password }
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
            body: userData
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

    async getUserProfile() {
        const result = await this.request('/api/user/profile');
        if (result.success) {
            this.setUser(result.user);
        }
        return result;
    }

    // ... 기존 메서드들
}

// 글로벌 인스턴스
const api = new TimeLinkAPI();
window.TimeLinkAPI = api;

export { TimeLinkAPI, api };
export default api;
