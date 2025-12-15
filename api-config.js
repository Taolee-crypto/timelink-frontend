// Timelink 백엔드 API 설정
const API_CONFIG = {
    BASE_URL: 'https://timelink.digital/api',
    ENDPOINTS: {
        // 인증
        SIGNUP: '/auth/signup',
        LOGIN: '/auth/login',
        VERIFY_EMAIL: '/auth/verify-email',
        
        // TL Studio
        CONVERT_TL3: '/studio/convert-tl3',
        CONVERT_TL4: '/studio/convert-tl4',
        GET_MY_LIBRARY: '/studio/my-library',
        
        // 콘텐츠
        UPLOAD_CONTENT: '/content/upload',
        GET_CONTENT: '/content/get',
        
        // 지갑
        GET_BALANCE: '/wallet/balance',
        CHARGE_TL: '/wallet/charge',
        GET_HISTORY: '/wallet/history',
        
        // 마켓플레이스
        P2P_LISTINGS: '/marketplace/p2p-listings',
        BUY_CONTENT: '/marketplace/buy'
    }
};

// 글로벌 변수로 설정
window.TIMELINK_API = API_CONFIG;
console.log('✅ Timelink API 설정 로드 완료');
