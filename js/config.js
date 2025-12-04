// TL Platform API 설정
const BACKEND_URL = 'https://timelink-backend.timelink-api.workers.dev';
const API_VERSION = 'v1';

// API 요청 함수
async function apiRequest(endpoint, options = {}) {
    const url = `${BACKEND_URL}${endpoint}`;
    
    console.log(`📡 API 요청: ${endpoint}`);
    
    const defaultHeaders = {
        'Content-Type': 'application/json',
    };
    
    const config = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers,
        },
    };
    
    try {
        const response = await fetch(url, config);
        console.log(`📥 응답 상태: ${response.status}`);
        
        // 404가 아닌 경우 JSON 파싱 시도
        if (response.status === 404) {
            return { error: 'Not Found', status: 404 };
        }
        
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            return await response.json();
        } else {
            const text = await response.text();
            console.warn('⚠️ JSON이 아닌 응답:', text.substring(0, 100));
            return { text, status: response.status };
        }
    } catch (error) {
        console.error('❌ API 오류:', error);
        return { error: error.message, status: 0 };
    }
}

// 시스템 건강 상태 확인
async function checkSystemHealth() {
    try {
        console.log('🩺 시스템 건강 상태 확인...');
        
        // 먼저 /health 시도
        let healthResponse = await apiRequest('/health');
        
        // 404면 /api/health 시도
        if (healthResponse.status === 404) {
            healthResponse = await apiRequest('/api/health');
        }
        
        // 그래도 404면 루트 경로 확인
        if (healthResponse.status === 404) {
            const rootResponse = await apiRequest('/');
            if (rootResponse && !rootResponse.error) {
                return { 
                    healthy: true, 
                    backend: BACKEND_URL,
                    message: '백엔드 연결 성공 (루트)'
                };
            }
        }
        
        if (healthResponse && healthResponse.status === 'healthy') {
            return { 
                healthy: true, 
                backend: BACKEND_URL,
                message: '백엔드 연결 성공'
            };
        }
        
        return { 
            healthy: false, 
            backend: BACKEND_URL,
            error: '백엔드 상태 확인 실패',
            details: healthResponse
        };
    } catch (error) {
        console.error('💔 건강 상태 확인 오류:', error);
        return { 
            healthy: false, 
            backend: BACKEND_URL,
            error: error.message
        };
    }
}

// 인증 API
const authAPI = {
    login: (email, password) => 
        apiRequest('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        }),
    
    register: (userData) => 
        apiRequest('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        }),
    
    verify: (token) => 
        apiRequest('/api/auth/verify', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
};

// STUDIO API
const studioAPI = {
    getProjects: () => apiRequest('/api/studio/projects'),
    createProject: (projectData) => 
        apiRequest('/api/studio/create', {
            method: 'POST',
            body: JSON.stringify(projectData)
        })
};

// Music API
const musicAPI = {
    getTracks: () => apiRequest('/api/music/tracks')
};

// Tube API
const tubeAPI = {
    getVideos: () => apiRequest('/api/tube/videos')
};

// 초기화
async function initAPI() {
    console.log('🚀 TLAPI 초기화 시작...');
    
    // 건강 상태 확인
    const health = await checkSystemHealth();
    
    if (health.healthy) {
        console.log('✅ 백엔드 연결 성공:', BACKEND_URL);
        return {
            healthy: true,
            url: BACKEND_URL,
            apis: { authAPI, studioAPI, musicAPI, tubeAPI },
            request: apiRequest
        };
    } else {
        console.error('❌ 백엔드 연결 실패:', health.error);
        return {
            healthy: false,
            url: BACKEND_URL,
            error: health.error,
            // 오프라인 모드용 더미 API
            apis: createMockAPIs(),
            request: apiRequest
        };
    }
}

// 오프라인 모드를 위한 모의 API
function createMockAPIs() {
    return {
        authAPI: {
            login: () => Promise.resolve({
                success: true,
                token: 'mock_token',
                user: { id: 'mock_user', name: '테스트사용자' }
            }),
            register: () => Promise.resolve({
                success: true,
                message: '모의 회원가입 성공'
            })
        },
        studioAPI: {
            getProjects: () => Promise.resolve({
                success: true,
                projects: [
                    { id: 1, name: '모의 프로젝트', type: 'video' }
                ]
            })
        }
    };
}

// 글로벌로 노출
window.TLAPI = {
    init: initAPI,
    request: apiRequest,
    checkHealth: checkSystemHealth,
    url: BACKEND_URL
};

console.log('📱 TL Platform API 설정 완료');
export { apiRequest, checkSystemHealth, authAPI, studioAPI, musicAPI, tubeAPI, initAPI };
