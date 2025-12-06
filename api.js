// /c/Users/win11/timelink/api.js

/**
 * TimeLink API 클라이언트
 * Cloudflare Worker 백엔드와 통신
 */

// ==================== 환경 설정 ====================
const ENV = {
  MODE: 'development', // 'development' | 'production'
  LOCAL_BACKEND_URL: 'http://localhost:8787',
  CLOUDFLARE_WORKER_URL: 'https://timelink-backend.taolee-crypto.workers.dev'
};

// API 기본 URL 설정
const API_BASE_URL = ENV.MODE === 'development' 
  ? ENV.LOCAL_BACKEND_URL 
  : ENV.CLOUDFLARE_WORKER_URL;

// ==================== 유틸리티 함수 ====================
class APIError extends Error {
  constructor(message, status = 0, data = null) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.data = data;
    this.timestamp = new Date().toISOString();
  }
}

// 토큰 관리
const TokenManager = {
  getToken() {
    return localStorage.getItem('timelink_token') || 
           sessionStorage.getItem('timelink_token');
  },
  
  setToken(token, remember = false) {
    if (remember) {
      localStorage.setItem('timelink_token', token);
    } else {
      sessionStorage.setItem('timelink_token', token);
    }
  },
  
  removeToken() {
    localStorage.removeItem('timelink_token');
    sessionStorage.removeItem('timelink_token');
  },
  
  getAuthHeader() {
    const token = this.getToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }
};

// API 요청 기본 함수
const apiRequest = async (endpoint, options = {}) => {
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...TokenManager.getAuthHeader()
  };

  const config = {
    method: 'GET',
    headers: defaultHeaders,
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers
    }
  };

  try {
    const url = endpoint.startsWith('http') 
      ? endpoint 
      : `${API_BASE_URL}${endpoint}`;
    
    console.log(`API Request: ${config.method} ${url}`);
    
    const response = await fetch(url, config);
    const data = await response.json().catch(() => null);
    
    if (!response.ok) {
      throw new APIError(
        data?.message || `HTTP ${response.status}`,
        response.status,
        data
      );
    }
    
    return {
      success: true,
      data: data,
      status: response.status,
      headers: response.headers
    };
    
  } catch (error) {
    console.error('API Request Failed:', error);
    
    if (error instanceof APIError) {
      throw error;
    }
    
    throw new APIError(
      error.message || 'Network error',
      0,
      { originalError: error }
    );
  }
};

// ==================== 인증 API ====================
const AuthAPI = {
  // 로그인
  async login(email, password, remember = false) {
    const result = await apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    
    if (result.data?.token) {
      TokenManager.setToken(result.data.token, remember);
    }
    
    return result;
  },
  
  // 회원가입
  async register(userData) {
    return apiRequest('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },
  
  // 로그아웃
  async logout() {
    try {
      await apiRequest('/api/auth/logout', { method: 'POST' });
    } finally {
      TokenManager.removeToken();
    }
    return { success: true };
  },
  
  // 토큰 갱신
  async refreshToken() {
    return apiRequest('/api/auth/refresh', { method: 'POST' });
  },
  
  // 소셜 로그인 (Google, GitHub 등)
  async socialLogin(provider, token) {
    return apiRequest(`/api/auth/social/${provider}`, {
      method: 'POST',
      body: JSON.stringify({ token })
    });
  },
  
  // 비밀번호 재설정 요청
  async requestPasswordReset(email) {
    return apiRequest('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  },
  
  // 비밀번호 재설정 확인
  async confirmPasswordReset(token, newPassword) {
    return apiRequest('/api/auth/reset-password/confirm', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword })
    });
  }
};

// ==================== 사용자 API ====================
const UserAPI = {
  // 프로필 가져오기
  async getProfile() {
    return apiRequest('/api/user/profile');
  },
  
  // 프로필 업데이트
  async updateProfile(profileData) {
    return apiRequest('/api/user/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  },
  
  // 내 라이브러리
  async getLibrary(options = {}) {
    const params = new URLSearchParams(options);
    return apiRequest(`/api/user/library?${params}`);
  },
  
  // 사용자 통계
  async getStats() {
    return apiRequest('/api/user/stats');
  },
  
  // 잔액 확인
  async getBalance() {
    return apiRequest('/api/user/balance');
  },
  
  // 설정 가져오기
  async getSettings() {
    return apiRequest('/api/user/settings');
  },
  
  // 설정 업데이트
  async updateSettings(settings) {
    return apiRequest('/api/user/settings', {
      method: 'PUT',
      body: JSON.stringify(settings)
    });
  },
  
  // 아바타 업로드
  async uploadAvatar(file) {
    const formData = new FormData();
    formData.append('avatar', file);
    
    return apiRequest('/api/user/avatar', {
      method: 'POST',
      headers: {},
      body: formData
    });
  }
};

// ==================== 콘텐츠 API ====================
const ContentAPI = {
  // 콘텐츠 업로드
  async upload(contentData, file) {
    const formData = new FormData();
    formData.append('metadata', JSON.stringify(contentData));
    if (file) {
      formData.append('file', file);
    }
    
    return apiRequest('/api/content/upload', {
      method: 'POST',
      headers: {},
      body: formData
    });
  },
  
  // 형식 변환
  async convert(contentId, targetFormat, options = {}) {
    return apiRequest('/api/content/convert', {
      method: 'POST',
      body: JSON.stringify({ contentId, targetFormat, ...options })
    });
  },
  
  // 콘텐츠 목록
  async list(options = {}) {
    const params = new URLSearchParams(options);
    return apiRequest(`/api/content/list?${params}`);
  },
  
  // 콘텐츠 재생
  async play(contentId) {
    return apiRequest(`/api/content/play/${contentId}`);
  },
  
  // 콘텐츠 삭제
  async delete(contentId) {
    return apiRequest(`/api/content/delete/${contentId}`, {
      method: 'DELETE'
    });
  },
  
  // 메타데이터 가져오기
  async getMetadata(contentId) {
    return apiRequest(`/api/content/metadata/${contentId}`);
  },
  
  // 메타데이터 업데이트
  async updateMetadata(contentId, metadata) {
    return apiRequest(`/api/content/metadata/${contentId}`, {
      method: 'PUT',
      body: JSON.stringify(metadata)
    });
  }
};

// ==================== 스튜디오 API ====================
const StudioAPI = {
  // 프로젝트 목록
  async getProjects() {
    return apiRequest('/api/studio/projects');
  },
  
  // 프로젝트 생성
  async createProject(projectData) {
    return apiRequest('/api/studio/projects', {
      method: 'POST',
      body: JSON.stringify(projectData)
    });
  },
  
  // 프로젝트 저장
  async saveProject(projectId, projectData) {
    return apiRequest(`/api/studio/projects/${projectId}`, {
      method: 'PUT',
      body: JSON.stringify(projectData)
    });
  },
  
  // 프로젝트 내보내기
  async exportProject(projectId, format) {
    return apiRequest(`/api/studio/export/${projectId}`, {
      method: 'POST',
      body: JSON.stringify({ format })
    });
  },
  
  // 효과 적용
  async applyEffect(projectId, effectData) {
    return apiRequest(`/api/studio/effects/${projectId}`, {
      method: 'POST',
      body: JSON.stringify(effectData)
    });
  }
};

// ==================== 마켓 API ====================
const MarketAPI = {
  // 아이템 목록
  async listItems(options = {}) {
    const params = new URLSearchParams(options);
    return apiRequest(`/api/market/list?${params}`);
  },
  
  // 아이템 판매
  async sellItem(itemData) {
    return apiRequest('/api/market/sell', {
      method: 'POST',
      body: JSON.stringify(itemData)
    });
  },
  
  // 아이템 구매
  async buyItem(itemId, price) {
    return apiRequest('/api/market/buy', {
      method: 'POST',
      body: JSON.stringify({ itemId, price })
    });
  },
  
  // 검색
  async search(query, filters = {}) {
    const params = new URLSearchParams({ q: query, ...filters });
    return apiRequest(`/api/market/search?${params}`);
  },
  
  // 추천 아이템
  async getRecommendations() {
    return apiRequest('/api/market/recommendations');
  },
  
  // 내 판매 목록
  async getMySales() {
    return apiRequest('/api/market/my-sales');
  },
  
  // 내 구매 목록
  async getMyPurchases() {
    return apiRequest('/api/market/my-purchases');
  }
};

// ==================== 튜브 API ====================
const TubeAPI = {
  // 비디오 목록
  async getVideos(options = {}) {
    const params = new URLSearchParams(options);
    return apiRequest(`/api/tube/videos?${params}`);
  },
  
  // 채널 목록
  async getChannels() {
    return apiRequest('/api/tube/channels');
  },
  
  // 댓글 가져오기
  async getComments(videoId) {
    return apiRequest(`/api/tube/comments/${videoId}`);
  },
  
  // 댓글 작성
  async postComment(videoId, comment) {
    return apiRequest(`/api/tube/comments/${videoId}`, {
      method: 'POST',
      body: JSON.stringify({ comment })
    });
  },
  
  // 구독
  async subscribe(channelId) {
    return apiRequest(`/api/tube/subscribe/${channelId}`, {
      method: 'POST'
    });
  },
  
  // 구독 취소
  async unsubscribe(channelId) {
    return apiRequest(`/api/tube/unsubscribe/${channelId}`, {
      method: 'DELETE'
    });
  },
  
  // 내 구독 목록
  async getSubscriptions() {
    return apiRequest('/api/tube/subscriptions');
  }
};

// ==================== 저작권 API ====================
const CopyrightAPI = {
  // 저작권 요청
  async requestCopyright(contentId, proof) {
    return apiRequest('/api/copyright/request', {
      method: 'POST',
      body: JSON.stringify({ contentId, proof })
    });
  },
  
  // 저작권 확인
  async verifyCopyright(contentId) {
    return apiRequest(`/api/copyright/verify/${contentId}`);
  },
  
  // 저작권 목록
  async listCopyrights() {
    return apiRequest('/api/copyright/list');
  },
  
  // 분쟁 제기
  async disputeCopyright(copyrightId, reason) {
    return apiRequest(`/api/copyright/dispute/${copyrightId}`, {
      method: 'POST',
      body: JSON.stringify({ reason })
    });
  }
};

// ==================== 결제 API ====================
const PaymentAPI = {
  // 입금
  async deposit(amount, method = 'crypto') {
    return apiRequest('/api/payment/deposit', {
      method: 'POST',
      body: JSON.stringify({ amount, method })
    });
  },
  
  // 출금
  async withdraw(amount, address) {
    return apiRequest('/api/payment/withdraw', {
      method: 'POST',
      body: JSON.stringify({ amount, address })
    });
  },
  
  // 거래 내역
  async getTransactions(options = {}) {
    const params = new URLSearchParams(options);
    return apiRequest(`/api/payment/transactions?${params}`);
  }
};

// ==================== 관리자 API ====================
const AdminAPI = {
  // 사용자 관리
  async getUsers(options = {}) {
    const params = new URLSearchParams(options);
    return apiRequest(`/api/admin/users?${params}`);
  },
  
  // 콘텐츠 관리
  async getContents(options = {}) {
    const params = new URLSearchParams(options);
    return apiRequest(`/api/admin/contents?${params}`);
  },
  
  // 신고 관리
  async getReports() {
    return apiRequest('/api/admin/reports');
  },
  
  // 시스템 상태
  async getSystemStatus() {
    return apiRequest('/api/admin/system');
  }
};

// ==================== 파일 업로드 유틸리티 ====================
const FileUploader = {
  async uploadFile(file, onProgress = null) {
    const formData = new FormData();
    formData.append('file', file);
    
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      
      if (onProgress) {
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percent = Math.round((event.loaded / event.total) * 100);
            onProgress(percent);
          }
        };
      }
      
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const data = JSON.parse(xhr.responseText);
            resolve(data);
          } catch (e) {
            resolve(xhr.responseText);
          }
        } else {
          reject(new APIError(`Upload failed: ${xhr.statusText}`, xhr.status));
        }
      };
      
      xhr.onerror = () => reject(new APIError('Network error'));
      
      xhr.open('POST', `${API_BASE_URL}/api/upload`);
      const token = TokenManager.getToken();
      if (token) {
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      }
      xhr.send(formData);
    });
  }
};

// ==================== 글로벌 API 객체 ====================
const TimeLinkAPI = {
  // 환경 설정
  config: {
    setMode(mode) {
      ENV.MODE = mode;
      console.log(`API Mode changed to: ${mode}`);
    },
    
    setWorkerUrl(url) {
      ENV.CLOUDFLARE_WORKER_URL = url;
      console.log(`Worker URL changed to: ${url}`);
    },
    
    getCurrentBaseUrl() {
      return ENV.MODE === 'development' 
        ? ENV.LOCAL_BACKEND_URL 
        : ENV.CLOUDFLARE_WORKER_URL;
    }
  },
  
  // 인증 상태 확인
  isAuthenticated() {
    return !!TokenManager.getToken();
  },
  
  // API 모듈들
  auth: AuthAPI,
  user: UserAPI,
  content: ContentAPI,
  studio: StudioAPI,
  market: MarketAPI,
  tube: TubeAPI,
  copyright: CopyrightAPI,
  payment: PaymentAPI,
  admin: AdminAPI,
  upload: FileUploader,
  
  // 유틸리티
  request: apiRequest,
  TokenManager: TokenManager,
  APIError: APIError
};

// ==================== 초기화 ====================
(function init() {
  console.log('TimeLink API Initialized');
  console.log('Base URL:', TimeLinkAPI.config.getCurrentBaseUrl());
  console.log('Mode:', ENV.MODE);
  
  // 글로벌 객체로 노출 (필요시)
  if (typeof window !== 'undefined') {
    window.TimeLinkAPI = TimeLinkAPI;
  }
})();

// 모듈로 내보내기
export default TimeLinkAPI;
export {
  AuthAPI,
  UserAPI,
  ContentAPI,
  StudioAPI,
  MarketAPI,
  TubeAPI,
  CopyrightAPI,
  PaymentAPI,
  AdminAPI,
  FileUploader,
  APIError,
  TokenManager
};
