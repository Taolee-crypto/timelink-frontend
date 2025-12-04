// TL Platform API 설정 - 버전: 20251204.1
const BACKEND_URL = 'https://timelink-backend.timelink-api.workers.dev';
const CONFIG_VERSION = '20251204.1';

console.log('🚀 TL Platform API 설정 로드됨');
console.log('🔧 버전:', CONFIG_VERSION);
console.log('🔗 백엔드 URL:', BACKEND_URL);
console.log('🌐 현재 URL:', window.location.href);

// API 요청 함수
async function apiRequest(endpoint, options = {}) {
    // 절대 경로가 아니면 백엔드 URL 추가
    let url;
    if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
        url = endpoint;
    } else {
        url = BACKEND_URL + endpoint;
    }
    
    console.log(`📡 API 요청: ${endpoint} → ${url}`);
    
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
        console.log(`📥 응답: ${response.status} ${response.statusText}`);
        
        const text = await response.text();
        
        // JSON 파싱 시도
        if (text.trim().startsWith('{') || text.trim().startsWith('[')) {
            try {
                return JSON.parse(text);
            } catch (e) {
                console.warn('JSON 파싱 실패:', e.message);
                return { 
                    text: text.substring(0, 200), 
                    error: 'Invalid JSON',
                    status: response.status 
                };
            }
        } else {
            // HTML 응답 (404 페이지 등)
            if (text.includes('<!DOCTYPE') || text.includes('<html')) {
                console.warn('HTML 응답 받음 - 잘못된 URL일 수 있음');
                return {
                    error: 'HTML response received',
                    status: response.status,
                    isHtml: true,
                    url: url
                };
            }
            return { text: text, status: response.status };
        }
    } catch (error) {
        console.error('❌ 네트워크 오류:', error.message);
        return { 
            error: error.message, 
            status: 0,
            url: url
        };
    }
}

// 건강 상태 확인 (단순화된 버전)
async function checkSystemHealth() {
    console.log('🩺 건강 상태 확인 시작');
    
    // 여러 경로 시도
    const endpoints = ['/', '/health', '/api/health', '/api'];
    
    for (const endpoint of endpoints) {
        console.log(`테스트: ${endpoint}`);
        const result = await apiRequest(endpoint);
        
        if (result && !result.isHtml && !result.error) {
            console.log(`✅ 성공: ${endpoint}`);
            return {
                healthy: true,
                endpoint: endpoint,
                data: result,
                backend: BACKEND_URL
            };
        }
        
        if (result && result.status === 404) {
            console.log(`⚠️ 404: ${endpoint}`);
            continue;
        }
    }
    
    console.error('❌ 모든 경로 실패');
    return {
        healthy: false,
        backend: BACKEND_URL,
        error: 'Connection failed'
    };
}

// API 초기화
async function initAPI() {
    console.log('🚀 API 초기화 시작');
    
    const health = await checkSystemHealth();
    
    if (health.healthy) {
        console.log('✅ 백엔드 연결 성공');
        return {
            healthy: true,
            url: BACKEND_URL,
            health: health
        };
    } else {
        console.error('❌ 백엔드 연결 실패');
        return {
            healthy: false,
            url: BACKEND_URL,
            error: health.error
        };
    }
}

// 글로벌 노출
window.TLAPI = {
    init: initAPI,
    request: apiRequest,
    checkHealth: checkSystemHealth,
    url: BACKEND_URL,
    version: CONFIG_VERSION
};

console.log('📱 TL Platform API 설정 완료 - 캐시 방지 버전');
