// TL Platform API 설정
const BACKEND_URL = 'https://timelink-backend.timelink-api.workers.dev';

// API 요청 함수 (강화된 버전)
async function apiRequest(endpoint, options = {}) {
    const url = BACKEND_URL + endpoint;
    
    console.log(`📡 API 요청: ${endpoint}`, url);
    
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
        
        // 먼저 텍스트로 읽어서 확인
        const text = await response.text();
        console.log(`📄 응답 텍스트 (처음 200자):`, text.substring(0, 200));
        
        // JSON 파싱 시도
        if (text.trim().startsWith('{') || text.trim().startsWith('[')) {
            try {
                const json = JSON.parse(text);
                return json;
            } catch (e) {
                console.warn('JSON 파싱 실패:', e.message);
                return { text, status: response.status, error: 'Invalid JSON' };
            }
        } else {
            return { text, status: response.status };
        }
    } catch (error) {
        console.error('❌ 네트워크 오류:', error);
        return { 
            error: error.message, 
            status: 0,
            offline: true 
        };
    }
}

// 시스템 건강 상태 확인 (강화된 버전)
async function checkSystemHealth() {
    console.log('🩺 시스템 건강 상태 확인 시작...');
    console.log('백엔드 URL:', BACKEND_URL);
    
    // 여러 경로 시도
    const testEndpoints = [
        '/health',
        '/',
        '/api',
        '/api/health'
    ];
    
    for (const endpoint of testEndpoints) {
        console.log(`테스트 중: ${endpoint}`);
        const result = await apiRequest(endpoint);
        
        if (result && !result.error && result.status !== 404) {
            console.log(`✅ 성공: ${endpoint}`, result);
            return {
                healthy: true,
                endpoint: endpoint,
                data: result,
                backend: BACKEND_URL
            };
        }
        
        if (result.status === 404) {
            console.log(`⚠️ 404: ${endpoint}`);
            continue;
        }
    }
    
    console.error('❌ 모든 경로 테스트 실패');
    return {
        healthy: false,
        backend: BACKEND_URL,
        error: '모든 API 경로 실패',
        lastTested: testEndpoints
    };
}

// 인증 API (간단한 버전)
const authAPI = {
    login: async (email, password) => {
        console.log('로그인 시도:', email);
        const result = await apiRequest('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
        console.log('로그인 결과:', result);
        return result;
    },
    
    register: (userData) => 
        apiRequest('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        })
};

// 초기화 함수
async function initAPI() {
    console.log('🚀 TLAPI 초기화 시작');
    
    const health = await checkSystemHealth();
    
    if (health.healthy) {
        console.log('✅ 백엔드 연결 성공');
        showStatus('success', '시스템 정상');
        
        return {
            healthy: true,
            url: BACKEND_URL,
            health: health,
            auth: authAPI
        };
    } else {
        console.error('❌ 백엔드 연결 실패');
        showStatus('error', '백엔드 연결 실패');
        
        // 모의 API 반환
        return {
            healthy: false,
            url: BACKEND_URL,
            error: health.error,
            mockMode: true,
            auth: {
                login: () => Promise.resolve({
                    success: true,
                    token: 'mock_token',
                    user: { name: '테스트 사용자' }
                })
            }
        };
    }
}

// 상태 표시 함수
function showStatus(type, message) {
    const statusEl = document.getElementById('system-status') || createStatusElement();
    statusEl.className = `system-status system-status-${type}`;
    statusEl.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-triangle'}"></i> ${message}`;
    document.body.appendChild(statusEl);
    
    setTimeout(() => {
        statusEl.style.opacity = '0';
        setTimeout(() => statusEl.remove(), 1000);
    }, 3000);
}

function createStatusElement() {
    const el = document.createElement('div');
    el.id = 'system-status';
    el.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 10px 20px;
        border-radius: 8px;
        color: white;
        z-index: 10000;
        font-weight: bold;
        transition: opacity 0.5s;
    `;
    return el;
}

// 글로벌 노출
window.TLAPI = {
    init: initAPI,
    request: apiRequest,
    checkHealth: checkSystemHealth,
    url: BACKEND_URL,
    auth: authAPI
};

console.log('📱 TL Platform API 설정 로드됨');

// 스타일 추가
const style = document.createElement('style');
style.textContent = `
.system-status-success { background: #10b981; }
.system-status-error { background: #ef4444; }
.system-status-warning { background: #f59e0b; }
`;
document.head.appendChild(style);
