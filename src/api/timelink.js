// TimeLink API 클라이언트
class TimeLinkAPI {
  constructor() {
    this.musicServerUrl = 'https://music.timelink.com';
    this.videoServerUrl = 'https://video.timelink.com';
    this.authServerUrl = 'https://auth.timelink.com';
    this.token = localStorage.getItem('tl_access_token');
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('tl_access_token', token);
  }

  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    
    return headers;
  }

  // 음악 파일 업로드
  async uploadMusic(file, metadata = {}) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('metadata', JSON.stringify(metadata));

    const response = await fetch(`${this.musicServerUrl}/upload`, {
      method: 'POST',
      headers: this.token ? { 'Authorization': `Bearer ${this.token}` } : {},
      body: formData
    });

    return response.json();
  }

  // 음악 파일 변환
  async convertMusic(fileId, options = {}) {
    const response = await fetch(`${this.musicServerUrl}/convert`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ fileId, ...options })
    });

    return response.json();
  }

  // 비디오 업로드
  async uploadVideo(file, metadata = {}) {
    const formData = new FormData();
    formData.append('video', file);
    formData.append('metadata', JSON.stringify(metadata));

    const response = await fetch(`${this.videoServerUrl}/upload`, {
      method: 'POST',
      headers: this.token ? { 'Authorization': `Bearer ${this.token}` } : {},
      body: formData
    });

    return response.json();
  }

  // 사용자 등록
  async register(userData) {
    const response = await fetch(`${this.authServerUrl}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });

    return response.json();
  }

  // 로그인
  async login(credentials) {
    const response = await fetch(`${this.authServerUrl}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });

    const data = await response.json();
    
    if (data.success && data.tokens) {
      this.setToken(data.tokens.accessToken);
      localStorage.setItem('tl_refresh_token', data.tokens.refreshToken);
    }

    return data;
  }

  // 파일 충전
  async chargeFile(fileId, amount, paymentMethod = 'wallet') {
    const response = await fetch(`${this.musicServerUrl}/charge/${fileId}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ 
        amount, 
        paymentMethod,
        timestamp: new Date().toISOString()
      })
    });

    return response.json();
  }

  // WebSocket을 통한 실시간 업데이트
  createConversionWebSocket(jobId) {
    const wsUrl = `wss://music.timelink.com/ws/conversion/${jobId}`;
    const ws = new WebSocket(wsUrl);
    
    ws.onopen = () => {
      console.log('WebSocket 연결됨');
    };
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('변환 상태 업데이트:', data);
      // 상태 업데이트 로직
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket 오류:', error);
    };
    
    return ws;
  }
}

export default new TimeLinkAPI();
