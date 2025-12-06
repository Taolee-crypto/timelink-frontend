// test-api.js 파일 생성 (임시 테스트용)
import api from './api.js';

async function testBackendConnection() {
    console.log('백엔드 연결 테스트 시작...');
    
    try {
        // 1. Health check 테스트
        console.log('Health check 테스트...');
        const healthResponse = await fetch(`${api.baseUrl}/api/health`);
        const healthData = await healthResponse.json();
        console.log('Health check 결과:', healthData);
        
        if (!healthResponse.ok) {
            throw new Error('백엔드 서버가 응답하지 않습니다');
        }
        
        // 2. 사용 가능한 API 엔드포인트 확인
        console.log('\n사용 가능한 엔드포인트:');
        const endpoints = [
            '/api/auth/login',
            '/api/auth/register',
            '/api/content/list',
            '/api/studio/projects',
            '/api/market/list',
            '/api/tube/videos'
        ];
        
        for (const endpoint of endpoints) {
            try {
                const response = await fetch(`${api.baseUrl}${endpoint}`);
                console.log(`${endpoint}: ${response.status}`);
            } catch (error) {
                console.log(`${endpoint}: 연결 실패`);
            }
        }
        
        return true;
    } catch (error) {
        console.error('백엔드 연결 테스트 실패:', error);
        
        // 로컬 개발 서버를 위한 폴백 설정
        console.log('\n로컬 개발 서버를 설정해주세요:');
        console.log('1. timelink-backend 폴더로 이동');
        console.log('2. npm install');
        console.log('3. npx wrangler dev');
        console.log('4. api.js의 API_BASE를 "http://localhost:8787"로 변경');
        
        return false;
    }
}

// 테스트 실행
testBackendConnection().then(isConnected => {
    if (!isConnected) {
        alert('백엔드 서버에 연결할 수 없습니다. 개발자 도구 콘솔을 확인해주세요.');
    }
});
