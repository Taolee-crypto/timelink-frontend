// TL Platform API 설정 - 완전히 새로운 파일
// 파일명: api-config.js (config.js 대신 사용)

console.log('🎯 API-CONFIG.JS 로드됨 - 새 파일!');

// 백엔드 URL 설정
const TL_BACKEND_URL = 'https://timelink-backend.timelink-api.workers.dev';
const TL_API_VERSION = '2.0.0';

console.log('🔗 백엔드:', TL_BACKEND_URL);
console.log('📅 버전:', TL_API_VERSION);
console.log('⏰ 로드 시간:', new Date().toISOString());

// API 요청 함수
async function tlApiRequest(endpoint, options = {}) {
    const url = TL_BACKEND_URL + endpoint;
    console.log('🌐 API 요청:', endpoint, '→', url);
    
    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });
        
        const text = await response.text();
        console.log('📨 응답:', response.status, text.substring(0, 100));
        
        if (text.trim().startsWith('{') || text.trim().startsWith('[')) {
            try {
                return JSON.parse(text);
            } catch (e) {
                return { text: text, error: 'JSON 파싱 실패' };
            }
        } else {
            return { text: text, status: response.status };
        }
    } catch (error) {
        console.error('💥 네트워크 오류:', error);
        return { error: error.message, offline: true };
    }
}

// 건강 상태 확인
async function tlCheckHealth() {
    console.log('💓 건강 상태 확인');
    
    // 여러 경로 시도
    const paths = ['/', '/health', '/api/health', '/api'];
    
    for (const path of paths) {
        const result = await tlApiRequest(path);
        if (result && !result.error && !result.text?.includes('<!DOCTYPE')) {
            console.log('✅ 연결 성공:', path);
            return {
                success: true,
                backend: TL_BACKEND_URL,
                path: path,
                data: result
            };
        }
    }
    
    console.log('❌ 모든 경로 실패');
    return {
        success: false,
        backend: TL_BACKEND_URL,
        error: '연결 실패'
    };
}

// 글로벌 객체 설정
window.TL_PLATFORM = {
    config: {
        url: TL_BACKEND_URL,
        version: TL_API_VERSION
    },
    api: {
        request: tlApiRequest,
        checkHealth: tlCheckHealth,
        init: async () => {
            console.log('🚀 TL Platform 초기화');
            const health = await tlCheckHealth();
            
            if (health.success) {
                console.log('🎉 시스템 준비 완료');
                return {
                    ready: true,
                    ...health
                };
            } else {
                console.log('⚠️ 오프라인 모드');
                return {
                    ready: false,
                    ...health,
                    mockMode: true
                };
            }
        }
    }
};

console.log('✅ TL Platform API 설정 완료 (api-config.js)');
