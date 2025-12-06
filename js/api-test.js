class TimeLinkAPI {
  constructor() {
    // 프로덕션 백엔드 URL
    this.baseURL = 'https://timelink-backend.taolee-crypto.workers.dev';
    
    // 현재 사용할 URL
    this.currentURL = this.baseURL;
    
    // 상태 관리
    this.connectionStatus = 'unknown';
  }

  async healthCheck() {
    try {
      const response = await fetch(`${this.currentURL}/health`, {
        method: 'GET',
        mode: 'cors',
        credentials: 'include',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Health check failed:', error);
      return { 
        error: '백엔드 연결 실패', 
        details: error.message,
        url: this.currentURL,
        solution: 'Cloudflare Worker 상태를 확인하세요'
      };
    }
  }

  async testConnection() {
    const statusElement = document.getElementById('api-status');
    const backendStatusText = document.getElementById('backend-status-text');
    
    if (!statusElement) return;

    statusElement.innerHTML = '백엔드 연결 테스트 중...<br><small>' + this.currentURL + '</small>';
    statusElement.className = 'loading';
    
    if (backendStatusText) {
      backendStatusText.textContent = '테스트 중...';
      backendStatusText.className = 'warning';
    }

    try {
      const health = await this.healthCheck();
      
      console.log('백엔드 응답:', health);
      
      if (health.status === 'healthy') {
        this.connectionStatus = 'connected';
        
        statusElement.innerHTML = `
          ✅ <strong>백엔드 연결 성공!</strong><br>
          서비스: ${health.service}<br>
          상태: ${health.status}<br>
          환경: ${health.environment || 'unknown'}<br>
          도메인: ${health.frontend || 'timelink.digital'}<br>
          시간: ${new Date(health.timestamp).toLocaleString()}<br>
          CORS: ${health.cors?.allowedOrigin || '설정됨'}<br>
          <small>URL: ${this.currentURL}</small>
        `;
        statusElement.className = 'success';
        
        if (backendStatusText) {
          backendStatusText.textContent = '✓ 온라인';
          backendStatusText.className = 'success';
        }
        
        // 성공 시 로그인 테스트 버튼 활성화
        this.showLoginTest();
        
        // 추가 테스트 옵션 표시
        this.showAdditionalTests();
        
      } else if (health.error) {
        this.connectionStatus = 'error';
        
        statusElement.innerHTML = `
          ⚠️ <strong>백엔드 연결 문제</strong><br>
          오류: ${health.error}<br>
          상세: ${health.details || '알 수 없음'}<br>
          해결책: ${health.solution || '백엔드 배포 확인 필요'}<br>
          <small>URL: ${this.currentURL}</small>
        `;
        statusElement.className = 'error';
        
        if (backendStatusText) {
          backendStatusText.textContent = '✗ 오류';
          backendStatusText.className = 'error';
        }
      } else {
        this.connectionStatus = 'unknown';
        
        statusElement.innerHTML = `
          ❓ <strong>예상치 못한 응답</strong><br>
          ${JSON.stringify(health, null, 2)}<br>
          <small>URL: ${this.currentURL}</small>
        `;
        statusElement.className = 'warning';
        
        if (backendStatusText) {
          backendStatusText.textContent = '⚠️ 이상';
          backendStatusText.className = 'warning';
        }
      }
    } catch (error) {
      this.connectionStatus = 'failed';
      
      statusElement.innerHTML = `
        ❌ <strong>백엔드 연결 실패</strong><br>
        오류: ${error.message}<br>
        <small>URL: ${this.currentURL}</small>
        <p><strong>해결 방법:</strong></p>
        <ol>
          <li>Cloudflare Worker가 배포되었는지 확인</li>
          <li>Worker URL이 올바른지 확인</li>
          <li>브라우저 개발자 도구(F12) → Network 탭에서 확인</li>
          <li>CORS 설정 확인</li>
        </ol>
      `;
      statusElement.className = 'error';
      
      if (backendStatusText) {
        backendStatusText.textContent = '✗ 연결 실패';
        backendStatusText.className = 'error';
      }
    }
  }

  showLoginTest() {
    const loginTestDiv = document.getElementById('login-test');
    if (loginTestDiv) {
      loginTestDiv.innerHTML = `
        <h4>인증 테스트</h4>
        <button onclick="TimeLinkAPI.testLogin()" class="btn">
          로그인 테스트 실행
        </button>
        <button onclick="TimeLinkAPI.testContent()" class="btn">
          콘텐츠 목록 테스트
        </button>
        <div id="login-result" style="margin-top: 10px;"></div>
      `;
    }
  }
  
  showAdditionalTests() {
    const additionalDiv = document.getElementById('additional-tests');
    if (additionalDiv) {
      additionalDiv.innerHTML = `
        <h4>추가 API 테스트</h4>
        <button onclick="TimeLinkAPI.testEndpoint('/test')" class="btn">테스트 엔드포인트</button>
        <button onclick="TimeLinkAPI.testEndpoint('/api/test')" class="btn">API 테스트</button>
        <button onclick="TimeLinkAPI.testEndpoint('/')" class="btn">루트 엔드포인트</button>
        <div id="additional-result" style="margin-top: 10px;"></div>
      `;
    }
  }

  async testLogin() {
    const resultEl = document.getElementById('login-result');
    if (!resultEl) return;
    
    resultEl.innerHTML = '<div class="loading">로그인 테스트 중...</div>';
    
    try {
      const response = await fetch(`${this.currentURL}/api/auth/login`, {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
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
        <div class="success">
          ✅ <strong>로그인 성공!</strong><br>
          메시지: ${data.message}<br>
          사용자: ${data.user?.name} (${data.user?.email})<br>
          토큰: ${data.token ? data.token.substring(0, 30) + '...' : '없음'}<br>
          CORS: ${data.cors || '설정됨'}
        </div>
      `;
    } catch (error) {
      resultEl.innerHTML = `
        <div class="error">
          ❌ <strong>로그인 실패</strong><br>
          오류: ${error.message}<br>
          <small>백엔드 CORS 설정을 확인하세요</small>
        </div>
      `;
    }
  }
  
  async testContent() {
    const resultEl = document.getElementById('login-result');
    if (!resultEl) return;
    
    resultEl.innerHTML = '<div class="loading">콘텐츠 목록 로드 중...</div>';
    
    try {
      const response = await fetch(`${this.currentURL}/api/content/list`, {
        method: 'GET',
        mode: 'cors',
        credentials: 'include',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (data.success && data.items) {
        const itemsHtml = data.items.map(item => `
          <div style="border-bottom: 1px solid rgba(255,255,255,0.1); padding: 10px 0;">
            <strong>${item.title}</strong><br>
            타입: ${item.type} | 길이: ${item.duration}초 | 가격: ${item.price}원
          </div>
        `).join('');
        
        resultEl.innerHTML = `
          <div class="success">
            ✅ <strong>콘텐츠 목록 로드 완료!</strong><br>
            총 ${data.total}개 항목<br>
            ${itemsHtml}
          </div>
        `;
      } else {
        resultEl.innerHTML = `
          <div class="warning">
            ⚠️ <strong>예상치 못한 응답</strong><br>
            ${JSON.stringify(data, null, 2)}
          </div>
        `;
      }
    } catch (error) {
      resultEl.innerHTML = `
        <div class="error">
          ❌ <strong>콘텐츠 로드 실패</strong><br>
          오류: ${error.message}
        </div>
      `;
    }
  }
  
  async testEndpoint(endpoint) {
    const resultEl = document.getElementById('additional-result') || document.getElementById('login-result');
    if (!resultEl) return;
    
    resultEl.innerHTML = `<div class="loading">${endpoint} 테스트 중...</div>`;
    
    try {
      const response = await fetch(`${this.currentURL}${endpoint}`, {
        method: 'GET',
        mode: 'cors',
        credentials: 'include',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      resultEl.innerHTML = `
        <div class="success">
          ✅ <strong>${endpoint} 테스트 성공!</strong><br>
          <pre style="background: rgba(0,0,0,0.3); padding: 10px; border-radius: 5px; overflow: auto; max-height: 300px;">
${JSON.stringify(data, null, 2)}
          </pre>
        </div>
      `;
    } catch (error) {
      resultEl.innerHTML = `
        <div class="error">
          ❌ <strong>${endpoint} 테스트 실패</strong><br>
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

// CSS 클래스 정의
const style = document.createElement('style');
style.textContent = `
  .loading { color: #fbbf24; }
  .success { color: #4ade80; }
  .error { color: #f87171; }
  .warning { color: #fbbf24; }
`;
document.head.appendChild(style);
