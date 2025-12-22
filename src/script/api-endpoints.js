// TimeLink API 엔드포인트
const API_BASE_URL = 'https://timelink-api.timelink-api.workers.dev';

const API_ENDPOINTS = {
    health: \\https://timelink-backend.timelink-api.workers.dev/health\,
    signup: \\https://timelink-backend.timelink-api.workers.dev/api/auth/signup\,
    login: \\https://timelink-backend.timelink-api.workers.dev/api/auth/login\,
    verify: \\https://timelink-backend.timelink-api.workers.dev/api/auth/verify\,
    resend: \\https://timelink-backend.timelink-api.workers.dev/api/auth/resend-verification\
};

// CORS 문제 해결을 위한 fetch 래퍼
async function fetchWithCORS(url, options = {}) {
    const response = await fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        },
        mode: 'cors'
    });
    return response;
}

export { API_BASE_URL, API_ENDPOINTS, fetchWithCORS };
