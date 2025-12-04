// TL Platform API 설정
const BACKEND_URL = 'https://timelink-backend.timelink-api.workers.dev';

console.log('🔧 BACKEND_URL 설정:', BACKEND_URL);

// API 요청 함수 (개선된 버전)
async function apiRequest(endpoint, options = {}) {
    // 절대 경로인지 확인
    let url;
    if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
        url = endpoint;
    } else {
        url = BACKEND_URL + endpoint;
    }
    
    console.log(`📡 API 요청: ${endpoint}`);
    console.log(`🔗 전체 URL: ${url}`);
    
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
        console.log(`📥 응답 상태: ${response.status} ${response.statusText}`);
        
        // 응답이 JSON인지 확인
        const contentType = response.headers.get('content-type');
        const text = await response.text();
        
        if (response.status === 404) {
            console.warn(`⚠️ 404 오류: ${url}`);
            return { 
                error: 'Not Found', 
                status: 404,
                url: url 
            };
        }
        
        if (contentType && contentType.includes('application/json')) {
            try {
                return JSON.parse(text);
            } catch (e) {
                console.error('❌ JSON 파싱 오류:', e.message);
                return { 
                    text: text.substring(0, 200), 
                    error: 'Invalid JSON',
                    status: response.status 
                };
            }
        } else {
            console.warn('⚠️ JSON이 아닌 응답:', text.substring(0, 100));
            return { 
                text: text.substring(0, 200), 
                status: response.status,
                contentType: contentType 
            };
        }
    } catch (error) {
        console.error('❌ 네트워크 오류:', error.message);
        return { 
            error: error.message, 
            status: 0,
            offline: true 
        };
    }
}

// 시스템 건강 상태 확인 (개선된 버전)
async function checkSystemHealth() {
    console.log('🩺 시스템 건강 상태 확인 시작...');
    console.log('🔗 백엔드 URL:', BACKEND_URL);
    
    // 여러 경로 시도
    const testEndpoints = [
        '/health',
        '/',
        '/api',
        '/api/health'
    ];
    
    for (const endpoint of testEndpoints) {
        console.log(`🔍 테스트 중: ${endpoint}`);
        const result = await apiRequest(endpoint);
        
        // 성공적인 응답 확인
        if (result && result.status === 'healthy') {
            console.log(`✅ ${endpoint} 성공:`, result);
            return {
                healthy: true,
                endpoint: endpoint,
                data: result,
                backend: BACKEND_URL,
                timestamp: new Date().toISOString()
            };
        }
        
        // 일반적인 성공 응답
        if (result && !result.error && result.status !== 404) {
            console.log(`✅ ${endpoint} 연결 성공:`, result);
            return {
                healthy: true,
                endpoint: endpoint,
                data: result,
                backend: BACKEND_URL,
                timestamp: new Date().toISOString()
            };
        }
        
        console.log(`⚠️ ${endpoint} 실패:`, result?.error || result?.status);
    }
    
    // 모든 경로 실패
    console.error('❌ 모든 API 경로 테스트 실패');
    return {
        healthy: false,
        backend: BACKEND_URL,
        error: '모든 API 경로 연결 실패',
        lastTested: testEndpoints,
        timestamp: new Date().toISOString()
    };
}

// 인증 API
const authAPI = {
    login: async (email, password) => {
        console.log('🔐 로그인 시도:', email);
        const result = await apiRequest('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
        console.log('📝 로그인 결과:', result);
        return result;
    },
    
    register: async (userData) => {
        console.log('📝 회원가입 시도:', userData.email);
        const result = await apiRequest('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
        console.log('📝 회원가입 결과:', result);
        return result;
    }
};

// 초기화 함수
async function initAPI() {
    console.log('🚀 TLAPI 초기화 시작');
    console.log('🌐 프론트엔드 URL:', window.location.origin);
    console.log('🔗 백엔드 URL:', BACKEND_URL);
    
    const health = await checkSystemHealth();
    
    if (health.healthy) {
        console.log('✅ 백엔드 연결 성공');
        console.log('📊 건강 상태:', health);
        
        if (typeof showNotification === 'function') {
            showNotification('시스템 정상 작동 중', 'success');
        }
        
        return {
            healthy: true,
            url: BACKEND_URL,
            health: health,
            auth: authAPI,
            timestamp: new Date().toISOString()
        };
    } else {
        console.error('❌ 백엔드 연결 실패');
        console.error('📊 실패 정보:', health);
        
        if (typeof showNotification === 'function') {
            showNotification('백엔드 서버에 연결할 수 없습니다. 오프라인 모드로 전환됩니다.', 'warning');
        }
        
        // 모의 API 반환
        return {
            healthy: false,
            url: BACKEND_URL,
            error: health.error,
            mockMode: true,
            timestamp: new Date().toISOString(),
            auth: {
                login: (email, password) => Promise.resolve({
                    success: true,
                    message: '오프라인 모드 로그인',
                    token: 'mock_token_' + Date.now(),
                    user: {
                        id: 'mock_user',
                        name: email.split('@')[0] || '사용자',
                        email: email,
                        language: 'ko'
                    }
                }),
                register: (userData) => Promise.resolve({
                    success: true,
                    message: '오프라인 모드 회원가입',
                    token: 'mock_token_' + Date.now(),
                    user: {
                        id: 'mock_user_' + Date.now(),
                        name: userData.name,
                        email: userData.email,
                        language: userData.language || 'ko'
                    }
                })
            }
        };
    }
}

// 글로벌 노출
window.TLAPI = {
    init: initAPI,
    request: apiRequest,
    checkHealth: checkSystemHealth,
    url: BACKEND_URL,
    auth: authAPI
};

console.log('📱 TL Platform API 설정 완료');
