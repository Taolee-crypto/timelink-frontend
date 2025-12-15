// api-config.js - 백엔드 API 엔드포인트 설정
class TimeLinkConfig {
    static get API_BASE_URL() {
        // 로컬 개발 환경
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            return 'http://localhost:3000/api';
        }
        
        // Cloudflare Worker 배포 환경
        return 'https://api.timelink.digital/api';
    }

    static get ENDPOINTS() {
        return {
            // 인증 관련
            AUTH: {
                LOGIN: `${this.API_BASE_URL}/auth/login`,
                SIGNUP: `${this.API_BASE_URL}/auth/signup`,
                VERIFY_EMAIL: `${this.API_BASE_URL}/auth/verify-email`,
                LOGOUT: `${this.API_BASE_URL}/auth/logout`,
                REFRESH_TOKEN: `${this.API_BASE_URL}/auth/refresh-token`
            },
            
            // 음원 관련
            MUSIC: {
                UPLOAD: `${this.API_BASE_URL}/music/upload`,
                LIST: `${this.API_BASE_URL}/music/list`,
                PURCHASE: `${this.API_BASE_URL}/music/purchase`,
                DETAIL: (id) => `${this.API_BASE_URL}/music/${id}`,
                MY_UPLOADS: `${this.API_BASE_URL}/music/my-uploads`,
                MY_PURCHASES: `${this.API_BASE_URL}/music/my-purchases`
            },
            
            // P2P 마켓플레이스
            MARKETPLACE: {
                LISTINGS: `${this.API_BASE_URL}/marketplace/listings`,
                CREATE_LISTING: `${this.API_BASE_URL}/marketplace/create`,
                BUY: `${this.API_BASE_URL}/marketplace/buy`,
                CANCEL_LISTING: (id) => `${this.API_BASE_URL}/marketplace/${id}/cancel`
            },
            
            // 결제 및 충전
            PAYMENT: {
                CHARGE: `${this.API_BASE_URL}/payment/charge`,
                BALANCE: `${this.API_BASE_URL}/payment/balance`,
                TRANSACTIONS: `${this.API_BASE_URL}/payment/transactions`,
                WITHDRAW: `${this.API_BASE_URL}/payment/withdraw`
            },
            
            // 대시보드 데이터
            DASHBOARD: {
                STATS: `${this.API_BASE_URL}/dashboard/stats`,
                EARNINGS: `${this.API_BASE_URL}/dashboard/earnings`,
                ACTIVITY: `${this.API_BASE_URL}/dashboard/activity`
            },
            
            // 스튜디오 (음원 생성/편집)
            STUDIO: {
                PROJECTS: `${this.API_BASE_URL}/studio/projects`,
                CREATE_PROJECT: `${this.API_BASE_URL}/studio/create`,
                EXPORT: `${this.API_BASE_URL}/studio/export`,
                SAVE: `${this.API_BASE_URL}/studio/save`
            }
        };
    }

    // SendGrid 이메일 설정
    static get EMAIL_CONFIG() {
        return {
            VERIFICATION_TEMPLATE_ID: 'd-xxxxxxx', // 실제 SendGrid 템플릿 ID로 교체
            SENDER_EMAIL: 'noreply@timelink.digital',
            SENDER_NAME: 'TimeLink'
        };
    }

    // 토큰 관리
    static setToken(token) {
        localStorage.setItem('timelink_token', token);
    }

    static getToken() {
        return localStorage.getItem('timelink_token');
    }

    static removeToken() {
        localStorage.removeItem('timelink_token');
    }

    // API 요청 헬퍼 함수
    static async apiRequest(endpoint, options = {}) {
        const token = this.getToken();
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(endpoint, {
            ...options,
            headers
        });

        if (!response.ok) {
            if (response.status === 401) {
                // 토큰 만료 시 로그인 페이지로 리디렉션
                this.removeToken();
                window.location.href = '/login.html';
                throw new Error('인증이 만료되었습니다. 다시 로그인해주세요.');
            }
            throw new Error(`API 요청 실패: ${response.status}`);
        }

        return response.json();
    }
}

// 글로벌 접근을 위해 window 객체에 추가
window.TimeLinkConfig = TimeLinkConfig;
