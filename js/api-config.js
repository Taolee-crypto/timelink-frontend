// TimeLink 프론트엔드 API 설정
const API_CONFIG = {
  BASE_URL: 'http://localhost:8787',
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/api/auth/login',
      REGISTER: '/api/auth/register',
      LOGOUT: '/api/auth/logout',
      REFRESH: '/api/auth/refresh'
    },
    USER: {
      PROFILE: '/api/user/profile',
      LIBRARY: '/api/user/library',
      BALANCE: '/api/user/balance',
      SETTINGS: '/api/user/settings'
    },
    CONTENT: {
      UPLOAD: '/api/content/upload',
      LIST: '/api/content/list',
      DETAIL: '/api/content',
      DELETE: '/api/content/delete'
    },
    MARKET: {
      LIST: '/api/market/list',
      BUY: '/api/market/buy',
      SELL: '/api/market/sell',
      SEARCH: '/api/market/search'
    },
    STUDIO: {
      PROJECTS: '/api/studio/projects',
      SAVE: '/api/studio/save',
      EXPORT: '/api/studio/export'
    },
    TUBE: {
      VIDEOS: '/api/tube/videos',
      CHANNELS: '/api/tube/channels',
      COMMENTS: '/api/tube/comments'
    }
  }
};

// API 호출 유틸리티
class TimeLinkAPI {
  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL;
    this.token = localStorage.getItem('timelink_token');
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const config = {
      ...options,
      headers
    };

    try {
      const response = await fetch(url, config);
      
      if (response.status === 401) {
        // 토큰 만료 처리
        this.clearAuth();
        window.location.href = '/login.html';
        return null;
      }

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'API 요청 실패');
      }

      return data;
    } catch (error) {
      console.error('API 요청 오류:', error);
      throw error;
    }
  }

  // 인증 관련 메서드
  async login(email, password) {
    try {
      const data = await this.request(API_CONFIG.ENDPOINTS.AUTH.LOGIN, {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      
      if (data && data.token) {
        this.setAuth(data.token, data.user || {});
        return data;
      }
      return data;
    } catch (error) {
      console.error('로그인 오류:', error);
      throw error;
    }
  }

  async register(email, password, username) {
    try {
      return await this.request(API_CONFIG.ENDPOINTS.AUTH.REGISTER, {
        method: 'POST',
        body: JSON.stringify({ email, password, username })
      });
    } catch (error) {
      console.error('회원가입 오류:', error);
      throw error;
    }
  }

  async logout() {
    try {
      await this.request(API_CONFIG.ENDPOINTS.AUTH.LOGOUT, {
        method: 'POST'
      });
    } catch (error) {
      console.log('로그아웃 오류:', error);
    } finally {
      this.clearAuth();
    }
  }

  // 인증 상태 관리
  setAuth(token, user) {
    this.token = token;
    localStorage.setItem('timelink_token', token);
    localStorage.setItem('timelink_user', JSON.stringify(user));
  }

  clearAuth() {
    this.token = null;
    localStorage.removeItem('timelink_token');
    localStorage.removeItem('timelink_user');
  }

  isAuthenticated() {
    return !!this.token;
  }

  getCurrentUser() {
    const userStr = localStorage.getItem('timelink_user');
    return userStr ? JSON.parse(userStr) : null;
  }

  // 사용자 API
  async getProfile() {
    return await this.request(API_CONFIG.ENDPOINTS.USER.PROFILE, {
      method: 'GET'
    });
  }

  // 콘텐츠 API
  async getContentList(limit = 10, offset = 0) {
    return await this.request(`${API_CONFIG.ENDPOINTS.CONTENT.LIST}?limit=${limit}&offset=${offset}`, {
      method: 'GET'
    });
  }

  // 마켓 API
  async getMarketList() {
    return await this.request(API_CONFIG.ENDPOINTS.MARKET.LIST, {
      method: 'GET'
    });
  }

  // 스튜디오 API
  async getStudioProjects() {
    return await this.request(API_CONFIG.ENDPOINTS.STUDIO.PROJECTS, {
      method: 'GET'
    });
  }

  // 튜브 API
  async getTubeVideos() {
    return await this.request(API_CONFIG.ENDPOINTS.TUBE.VIDEOS, {
      method: 'GET'
    });
  }
}

// 전역 API 인스턴스 생성
window.TimeLinkAPI = new TimeLinkAPI();
