# api-config.js 업데이트
cat > api-config.js << 'EOF'
// TimeLink API 설정 - GitHub Pages용
class TimeLinkConfig {
    static get API_BASE_URL() {
        // 현재 페이지가 GitHub Pages에 있는지 확인
        const isGitHubPages = window.location.hostname.includes('github.io');
        
        if (isGitHubPages) {
            // GitHub Pages: Cloudflare Worker 프로덕션 URL
            return 'https://timelink-api.taolee-crypto.workers.dev';
        } else if (window.location.hostname === 'localhost' || 
                   window.location.hostname === '127.0.0.1') {
            // 로컬 개발: Cloudflare Worker 개발 서버
            return 'http://127.0.0.1:8787';
        } else {
            // 기타 환경 (백업)
            return 'https://api.timelink.digital';
        }
    }

    static get ENDPOINTS() {
        const base = this.API_BASE_URL;
        return {
            // 기본 API 정보
            API_INFO: `${base}/api`,
            
            // 인증
            AUTH: {
                LOGIN: `${base}/api/auth/login`,
                SIGNUP: `${base}/api/auth/signup`,
                VERIFY: `${base}/api/auth/verify`,
                LOGOUT: `${base}/api/auth/logout`
            },
            
            // 음원
            MUSIC: {
                LIST: `${base}/api/music/list`,
                UPLOAD: `${base}/api/music/upload`,
                DETAIL: (id) => `${base}/api/music/${id}`,
                PURCHASE: (id) => `${base}/api/music/${id}/purchase`,
                DELETE: (id) => `${base}/api/music/${id}`
            },
            
            // 마켓플레이스
            MARKETPLACE: {
                LISTINGS: `${base}/api/marketplace/listings`,
                CREATE: `${base}/api/marketplace/create`,
                BUY: (id) => `${base}/api/marketplace/${id}/buy`
            },
            
            // 대시보드
            DASHBOARD: {
                STATS: `${base}/api/dashboard/stats`,
                EARNINGS: `${base}/api/dashboard/earnings`,
                ACTIVITY: `${base}/api/dashboard/activity`
            },
            
            // 스튜디오
            STUDIO: {
                PROJECTS: `${base}/api/studio/projects`,
                CREATE: `${base}/api/studio/create`,
                EXPORT: (id) => `${base}/api/studio/${id}/export`
            },
            
            // 결제
            PAYMENT: {
                BALANCE: `${base}/api/payment/balance`,
                DEPOSIT: `${base}/api/payment/deposit`,
                WITHDRAW: `${base}/api/payment/withdraw`,
                HISTORY: `${base}/api/payment/history`
            }
        };
    }

    // 토큰 관리
    static setToken(token) {
        localStorage.setItem('timelink_token', token);
        localStorage.setItem('timelink_token_time', Date.now());
    }

    static getToken() {
        const token = localStorage.getItem('timelink_token');
        const tokenTime = localStorage.getItem('timelink_token_time');
        
        // 토큰 만료 체크 (24시간)
        if (token && tokenTime && (Date.now() - parseInt(tokenTime)) > 24 * 60 * 60 * 1000) {
            this.removeToken();
            return null;
        }
        
        return token;
    }

    static removeToken() {
        localStorage.removeItem('timelink_token');
        localStorage.removeItem('timelink_token_time');
    }

    // 로그인 상태 확인
    static isLoggedIn() {
        return !!this.getToken();
    }

    // 로그아웃
    static logout() {
        this.removeToken();
        window.location.href = 'login.html';
    }

    // API 요청 헬퍼
    static async request(endpoint, options = {}) {
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...options.headers
        };

        const token = this.getToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        try {
            const response = await fetch(endpoint, {
                ...options,
                headers
            });

            // 응답이 JSON인지 확인
            const contentType = response.headers.get('content-type');
            const isJson = contentType && contentType.includes('application/json');
            
            if (!response.ok) {
                if (response.status === 401) {
                    // 인증 실패 시 로그아웃
                    this.logout();
                    throw new Error('인증이 만료되었습니다. 다시 로그인해주세요.');
                }
                
                const errorText = isJson ? 
                    (await response.json()).message : 
                    `HTTP ${response.status}`;
                throw new Error(errorText);
            }

            return isJson ? await response.json() : await response.text();
        } catch (error) {
            console.error('API 요청 실패:', error);
            throw error;
        }
    }

    // 파일 업로드 요청
    static async uploadFile(endpoint, formData) {
        const token = this.getToken();
        const headers = {};
        
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers,
                body: formData
            });

            if (!response.ok) {
                throw new Error(`업로드 실패: ${response.status}`);
            }

            return response.json();
        } catch (error) {
            console.error('파일 업로드 실패:', error);
            throw error;
        }
    }

    // API 상태 확인
    static async checkHealth() {
        try {
            const response = await fetch(`${this.API_BASE_URL}/api`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            return {
                online: response.ok,
                status: response.status,
                message: response.ok ? 'API 연결됨' : 'API 연결 실패'
            };
        } catch (error) {
            return {
                online: false,
                status: 0,
                message: error.message
            };
        }
    }
}

// 전역에서 사용 가능하도록
window.TimeLinkConfig = TimeLinkConfig;

// 페이지 로드 시 API 상태 확인
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const health = await TimeLinkConfig.checkHealth();
        console.log('API 상태:', health);
        
        if (!health.online && window.location.pathname !== '/login.html') {
            console.warn('API 서버에 연결할 수 없습니다.');
        }
    } catch (error) {
        console.warn('API 상태 확인 실패:', error);
    }
});
EOF
