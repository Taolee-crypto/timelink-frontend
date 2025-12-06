class TimeLinkAPI {
  constructor() {
    // 프로덕션 백엔드 URL
    this.baseURL = 'https://timelink-backend.taolee-crypto.workers.dev';
    
    // 현재 사용할 URL
    this.currentURL = this.baseURL;
  }

  async healthCheck() {
    try {
      const response = await fetch(`${this.currentURL}/health`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      return { 
        error: '백엔드 연결 실패', 
        details: error.message,
        url: this.currentURL,
        solution: 'Cloudflare Worker가 배포되었는지 확인하세요'
      };
    }
  }

  async testConnection() {
    const statusElement = document.getElementById('api-status');
    if (!statusElement) return;

    statusElement.innerHTML = '백엔드 연결 테스트 중...<br><small>' + this.currentURL + '</small>';
    statusElement.style.color = 'black';

    try {
      const health = await this.healthCheck();
      
      console.log('백엔드 응답:', health);
      
      if (health.status === 'healthy') {
        statusElement.innerHTML = `
          ✅ <strong>백엔드 연결 성공!</strong><br>
          서비스: ${health.service}<br>
          상태: ${health.status}<br>
          환경: ${health.environment || 'unknown'}<br>
          시간: ${new Date(health.timestamp).toLocaleString()}<br>
          <small>URL: ${this.currentURL}</small>
        `;
        statusElement.style.color = 'green';
        
        // 성공 시 로그인 테스트 버튼 활성화
        this.showLoginTest();
      } else if (health.error) {
        statusElement.innerHTML = `
          ⚠️ <strong>백엔드 연결 문제</strong><br>
          오류: ${health.error}<br>
          상세: ${health.details || '알 수 없음'}<br>
          해결책: ${health.solution || '백엔드 배포 확인 필요'}<br>
          <small>URL: ${this.currentURL}</small>
        `;
        statusElement.style.color = 'orange';
      } else {
        statusElement.innerHTML = `
          ❓ <strong>예상치 못한 응답</strong><br>
          ${JSON.stringify(health, null, 2)}<br>
          <small>URL: ${this.currentURL}</small>
        `;
        statusElement.style.color = 'blue';
      }
    } catch (error) {
      statusElement.innerHTML = `
        ❌ <strong>백엔드 연결 실패</strong><br>
        오류: ${error.message}<br>
        <small>URL: ${this.currentURL}</small>
        <p>백엔드 배포 상태 확인:</p>
        <ol>
          <li>timelink-backend 폴더에서 <code>npx wrangler deploy</code> 실행</li>
          <li>Cloudflare Dashboard에서 Worker 상태 확인</li>
          <li>올바른 URL 확인</li>
        </ol>
      `;
      statusElement.style.color = 'red';
    }
  }

  showLoginTest() {
    const loginTestDiv = document.getElementById('login-test');
    if (loginTestDiv) {
      loginTestDiv.innerHTML = `
        <h4>로그인 테스트</h4>
        <button onclick="TimeLinkAPI.testLogin()" class="btn">
          로그인 테스트 실행
        </button>
        <div id="login-result" style="margin-top: 10px;"></div>
      `;
    }
  }

  async testLogin() {
    const resultEl = document.getElementById('login-result');
    if (!resultEl) return;
    
    resultEl.innerHTML = '로그인 테스트 중...';
    
    try {
      const response = await fetch(`${this.currentURL}/api/auth/login`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          email: 'test@timelink.digital',
          password: 'test123'
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      resultEl.innerHTML = `
        <div style="background: #d4edda; padding: 10px; border-radius: 5px;">
          ✅ <strong>로그인 성공!</strong><br>
          메시지: ${data.message}<br>
          이메일: ${data.user?.email}<br>
          토큰: ${data.token ? data.token.substring(0, 30) + '...' : '없음'}
        </div>
      `;
    } catch (error) {
      resultEl.innerHTML = `
        <div style="background: #f8d7da; padding: 10px; border-radius: 5px;">
          ❌ <strong>로그인 실패</strong><br>
          오류: ${error.message}
        </div>
      `;
    }
  }
}

// 글로벌 객체로 노출
if (typeof window !== 'undefined') {
  window.TimeLinkAPI = new TimeLinkAPI();
}
