// API 클라이언트
class APIClient {
  constructor() {
    this.baseURL = 'https://your-backend.workers.dev/api';
    this.token = localStorage.getItem('tl_token');
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
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

      if (response.status === 401) {
        this.handleUnauthorized();
        throw new Error('Unauthorized');
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  handleUnauthorized() {
    localStorage.removeItem('tl_token');
    window.location.href = '#login';
  }

  // 인증
  async login(username, password) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });
    
    if (response.token) {
      this.token = response.token;
      localStorage.setItem('tl_token', response.token);
    }
    
    return response;
  }

  // 파일 업로드
  async uploadFile(file, metadata) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('metadata', JSON.stringify(metadata));

    return await this.request('/files/upload', {
      method: 'POST',
      body: formData,
      headers: {} // FormData는 Content-Type 자동 설정
    });
  }

  // 나머지 메소드들...
}

export const api = new APIClient();
