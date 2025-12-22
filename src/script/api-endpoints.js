// backend-api-endpoints.js
const API_ENDPOINTS = {
    // 파일 변환 관련
    CONVERT_FILE: '/api/studio/convert',
    GET_CONVERTED_FILES: '/api/studio/files',
    CHARGE_FILE: '/api/studio/file/charge',
    
    // 마켓플레이스 관련
    REGISTER_TO_MARKETPLACE: '/api/marketplace/register',
    GET_MARKETPLACE_FILES: '/api/marketplace/list',
    GET_MARKETPLACE_FILE: '/api/marketplace/file/:id',
    SEARCH_MARKETPLACE: '/api/marketplace/search',
    
    // TL 관리 관련
    GET_TL_BALANCE: '/api/tl/balance',
    CHARGE_TL: '/api/tl/charge',
    GET_TL_HISTORY: '/api/tl/history',
    
    // 재생 관련
    START_PLAYBACK: '/api/playback/start',
    PAUSE_PLAYBACK: '/api/playback/pause',
    STOP_PLAYBACK: '/api/playback/stop',
    GET_PLAYBACK_STATUS: '/api/playback/status',
    
    // 저작권 관련
    VERIFY_COPYRIGHT: '/api/copyright/verify',
    REQUEST_COPYRIGHT_APPROVAL: '/api/copyright/request-approval'
};

module.exports = API_ENDPOINTS;



