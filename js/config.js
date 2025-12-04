// TL Platform API 설정 - 최종 버전
// 이 파일은 GitHub Pages에서 TL Platform의 백엔드 연결을 설정합니다.

console.log('🚀 TL Platform Config 로드 시작');

// 백엔드 URL - 이게 가장 중요!
const BACKEND_URL = 'https://timelink-backend.timelink-api.workers.dev';

console.log('✅ BACKEND_URL 설정됨:', BACKEND_URL);
console.log('📅 로드 시간:', new Date().toISOString());

// 간단한 API 요청 함수
async function apiRequest(endpoint, options = {}) {
    const url = BACKEND_URL + endpoint;
    console.log('📡 요청:', endpoint, '→', url);
    
    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });
        
        console.log('📥 응답:', response.status, url);
        
        if (response.ok) {
            try {
                const data = await response.json();
                return data;
            } catch (e) {
                const text = await response.text();
                return { text: text, status: response.status };
            }
        } else {
            return { error: 'Request failed', status: response.status };
        }
    } catch (error) {
        console.error('❌ 네트워크 오류:', error.message);
        return { error: error.message, status: 0 };
    }
}

// 건강 상태 확인
async function checkSystemHealth() {
    console.log('🩺 건강 상태 확인 시작');
    
    // 루트 경로 테스트
    const result = await apiRequest('/');
    
    if (result && !result.error) {
        console.log('✅ 백엔드 연결 성공');
        return {
            healthy: true,
            backend: BACKEND_URL,
            data: result
        };
    } else {
        console.log('❌ 백엔드 연결 실패');
        return {
            healthy: false,
            backend: BACKEND_URL,
            error: result?.error || '연결 실패'
        };
    }
}

// TLAPI 객체
window.TLAPI = {
    init: async () => {
        console.log('🔌 TLAPI 초기화 시작');
        const health = await checkSystemHealth();
        
        if (health.healthy) {
            console.log('🎉 시스템 정상');
            return {
                healthy: true,
                url: BACKEND_URL,
                auth: {
                    login: (email, password) => 
                        apiRequest('/api/auth/login', {
                            method: 'POST',
                            body: JSON.stringify({ email, password })
                        })
                }
            };
        } else {
            console.log('⚠️ 오프라인 모드');
            return {
                healthy: false,
                url: BACKEND_URL,
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
    },
    request: apiRequest,
    checkHealth: checkSystemHealth,
    url: BACKEND_URL
};

console.log('✅ TL Platform Config 로드 완료');
