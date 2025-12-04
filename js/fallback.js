// 백엔드 연결 실패 시 폴백
if (!window.TLAPI || !window.TLAPI.baseURL || window.TLAPI.baseURL.includes('your_subdomain')) {
    console.warn('백엔드 URL이 제대로 설정되지 않았습니다. 폴백 모드로 전환합니다.');
    
    // 폴백 API 클래스
    class FallbackAPI {
        constructor() {
            this.baseURL = 'https://timelink-api.taolee.workers.dev'; // 기본 URL
            console.log('폴백 API 사용 - URL:', this.baseURL);
        }
        
        async checkHealth() {
            return {
                status: 'ok',
                message: '폴백 모드: 백엔드 연결 테스트 중',
                version: '1.0.0-fallback'
            };
        }
        
        async getMarketItems() {
            return {
                items: [
                    {
                        id: 'demo_1',
                        title: '데모 음악 트랙',
                        type: 'tl3',
                        price: 500,
                        seller: 'demo_user',
                        duration: 180
                    },
                    {
                        id: 'demo_2',
                        title: '데모 비디오 콘텐츠',
                        type: 'tl4',
                        price: 1000,
                        seller: 'demo_user',
                        duration: 300
                    }
                ],
                total: 2,
                page: 1
            };
        }
        
        async login(email, password) {
            // 데모 로그인
            return {
                token: 'demo_token_' + Date.now(),
                user: {
                    id: 1,
                    email: email,
                    name: email.split('@')[0],
                    balance: 10000
                }
            };
        }
    }
    
    // 폴백 API로 교체
    window.TLAPI = new FallbackAPI();
    
    // 알림 표시
    setTimeout(() => {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ff9800;
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            z-index: 1000;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            max-width: 400px;
        `;
        notification.innerHTML = `
            <strong>⚠️ 개발자 모드</strong><br>
            백엔드 URL이 설정되지 않았습니다.<br>
            폴백 모드로 실행 중입니다.<br>
            <small style="opacity: 0.8;">config.js 파일에서 백엔드 URL을 설정해주세요.</small>
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 10000);
    }, 2000);
}
