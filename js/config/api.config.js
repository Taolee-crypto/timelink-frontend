// 환경별 API 엔드포인트
const API_CONFIG = {
  development: {
    BASE_URL: 'http://localhost:8787',
    SOCKET_URL: 'ws://localhost:8788'
  },
  staging: {
    BASE_URL: 'https://staging.api.timelink.digital',
    SOCKET_URL: 'wss://staging.api.timelink.digital/ws'
  },
  production: {
    BASE_URL: 'https://api.timelink.digital',
    SOCKET_URL: 'wss://api.timelink.digital/ws'
  }
};

// 현재 환경 감지
const getCurrentEnv = () => {
  if (window.location.hostname.includes('localhost')) return 'development';
  if (window.location.hostname.includes('staging')) return 'staging';
  return 'production';
};

export const CONFIG = API_CONFIG[getCurrentEnv()];
