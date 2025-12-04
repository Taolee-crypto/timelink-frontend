// timelink/api.js 파일 생성
const API_BASE = 'https://api.timelink.digital';

export class TimeLinkAPI {
  constructor() {
    this.token = localStorage.getItem('timelink_token');
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers
      });

      if (!response.ok) {
        throw new Error(`API 요청 실패: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API 요청 오류:', error);
      throw error;
    }
  }

  // 인증
  async login(email, password) {
    return this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  }

  async register(userData) {
    return this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }

  // 사용자
  async getProfile() {
    return this.request('/api/user/profile');
  }

  // 콘텐츠
  async uploadContent(formData) {
    // 파일 업로드는 multipart/form-data 필요
    const response = await fetch(`${API_BASE}/api/content/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.token}`
      },
      body: formData
    });
    return response.json();
  }

  async getContentList(page = 1) {
    return this.request(`/api/content/list?page=${page}`);
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('timelink_token', token);
  }

  logout() {
    this.token = null;
    localStorage.removeItem('timelink_token');
  }
}

// 전역 인스턴스
window.TimeLinkAPI = new TimeLinkAPI();
