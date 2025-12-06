// TimeLink API 클라이언트
class TimeLinkAPI {
  constructor() {
    // 실제 배포된 Cloudflare Worker URL
    this.baseURL = 'https://timelink-backend.timelink-api.workers.dev';
    
    // 현재 사용할 URL
    this.currentURL = this.baseURL;
    
    // 상태 관리
    this.connectionStatus = 'unknown';
    
    console.log('TimeLinkAPI 초기화됨, URL:', this.baseURL);
  }

  async healthCheck() {
    try {
      console.log('Health check to:', `${this.currentURL}/health`);
      const response = await fetch(`${this.currentURL}/health`, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Health check 성공:', data);
      return data;
    } catch (error) {
      console.error('Health check 실패:', error);
      return { 
        error: '백엔드 연결 실패', 
        details: error.message,
        url: this.currentURL,
        solution: '1. Cloudflare Worker 상태 확인\n2. 네트워크 연결 확인'
      };
    }
  }

  async testConnection() {
    console.log('연결 테스트 시작...');
    const statusElement = document.getElementById('api-status');
    const backendStatusText = document.getElementById('backend-status-text');
    
    if (!statusElement) {
      console.error('api-status element 없음');
      return;
    }

    statusElement.innerHTML = '백엔드 연결 테스트 중...<br><small>URL: ' + this.currentURL + '</small>';
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
          <small>URL: ${this.currentURL}</small>
        `;
        statusElement.className = 'success';
        
        if (backendStatusText) {
          backendStatusText.textContent = '✓ 온라인';
          backendStatusText.className = 'success';
        }
        
        // 성공 시 추가 테스트 옵션 표시
        this.showAdditionalTests();
        
      } else if (health.error) {
        this.connectionStatus = 'error';
        
        statusElement.innerHTML = `
          ⚠️ <strong>백엔드 연결 문제</strong><br>
          오류: ${health.error}<br>
          상세: ${health.details || '알 수 없음'}<br>
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
      `;
      statusElement.className = 'error';
      
      if (backendStatusText) {
        backendStatusText.textContent = '✗ 연결 실패';
        backendStatusText.className = 'error';
      }
    }
  }

  showAdditionalTests() {
    const additionalDiv = document.getElementById('additional-tests');
    if (additionalDiv) {
      additionalDiv.innerHTML = `
        <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 10px; margin-top: 20px;">
          <h4>추가 API 테스트</h4>
          <button onclick="window.TimeLinkAPI.testEndpoint('/test')" class="btn">
            테스트 엔드포인트
          </button>
          <button onclick="window.TimeLinkAPI.testEndpoint('/api/test')" class="btn">
            API 테스트
          </button>
          <button onclick="window.TimeLinkAPI.testLogin()" class="btn">
            로그인 테스트
          </button>
          <button onclick="window.TimeLinkAPI.testContent()" class="btn">
            콘텐츠 테스트
          </button>
          <div id="test-results" style="margin-top: 15px; padding: 15px; background: rgba(0,0,0,0.2); border-radius: 5px; min-height: 100px;">
            테스트 결과가 여기에 표시됩니다
          </div>
        </div>
      `;
    }
  }

  async testLogin() {
    const resultEl = document.getElementById('test-results');
    if (!resultEl) return;
    
    resultEl.innerHTML = '<div class="loading">로그인 테스트 중...</div>';
    
    try {
      const response = await fetch(`${this.currentURL}/api/auth/login`, {
        method: 'POST',
        mode: 'cors',
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
        </div>
      `;
    } catch (error) {
      resultEl.innerHTML = `
        <div class="error">
          ❌ <strong>로그인 실패</strong><br>
          오류: ${error.message}<br>
        </div>
      `;
    }
  }
  
  async testContent() {
    const resultEl = document.getElementById('test-results');
    if (!resultEl) return;
    
    resultEl.innerHTML = '<div class="loading">콘텐츠 목록 로드 중...</div>';
    
    try {
      const response = await fetch(`${this.currentURL}/api/content/list`, {
        method: 'GET',
        mode: 'cors',
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
    const resultEl = document.getElementById('test-results');
    if (!resultEl) return;
    
    resultEl.innerHTML = `<div class="loading">${endpoint} 테스트 중...</div>`;
    
    try {
      const response = await fetch(`${this.currentURL}${endpoint}`, {
        method: 'GET',
        mode: 'cors',
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
          <pre style="background: rgba(0,0,0,0.3); padding: 10px; border-radius: 5px; overflow: auto; max-height: 300px; font-size: 12px;">
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
console.log('TimeLinkAPI 모듈 로드 중... URL:', 'https://timelink-backend.timelink-api.workers.dev');
if (typeof window !== 'undefined') {
  window.TimeLinkAPI = new TimeLinkAPI();
  console.log('✅ TimeLinkAPI가 window 객체에 등록됨');
} else {
  console.error('❌ window 객체를 찾을 수 없음');
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
console.log('✅ TimeLinkAPI 초기화 완료');

// Apple Music 스타일 응답 포맷팅
TimeLinkAPI.prototype.formatResponse = function(data, isSuccess) {
  if (isSuccess) {
    return `
      <div class="status-success" style="background: rgba(48, 209, 88, 0.1); padding: 16px; border-radius: 8px; margin: 12px 0;">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
          <span style="font-size: 20px;">✅</span>
          <strong>${data.service || 'TimeLink 백엔드'}</strong>
        </div>
        <div style="font-size: 13px; line-height: 1.6;">
          <div>상태: <span style="color: #30d158;">${data.status}</span></div>
          <div>환경: ${data.environment}</div>
          <div>시간: ${new Date(data.timestamp).toLocaleString('ko-KR')}</div>
          <div>도메인: ${data.frontend}</div>
        </div>
      </div>
    `;
  } else {
    return `
      <div class="status-error" style="background: rgba(255, 69, 58, 0.1); padding: 16px; border-radius: 8px; margin: 12px 0;">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
          <span style="font-size: 20px;">❌</span>
          <strong>연결 실패</strong>
        </div>
        <div style="font-size: 13px; line-height: 1.6;">
          <div>오류: ${data.error}</div>
          <div>상세: ${data.details}</div>
          <div>URL: ${data.url}</div>
          <div>시간: ${new Date(data.timestamp).toLocaleString('ko-KR')}</div>
        </div>
      </div>
    `;
  }
};

// Apple Music 스타일로 테스트 결과 표시
TimeLinkAPI.prototype.showAppleMusicResult = function(data, elementId) {
  const element = document.getElementById(elementId);
  if (!element) return;
  
  if (data.status === 'healthy') {
    element.innerHTML = this.formatResponse(data, true);
    
    // 시스템 상태 업데이트
    const backendStatus = document.getElementById('backend-status-text');
    if (backendStatus) {
      backendStatus.textContent = '✓ 온라인';
      backendStatus.className = 'status-success';
    }
    
    const systemStatus = document.getElementById('system-status');
    if (systemStatus) {
      systemStatus.textContent = '정상';
      systemStatus.style.background = 'linear-gradient(135deg, #30d158, #34c759)';
    }
    
  } else {
    element.innerHTML = this.formatResponse(data, false);
    
    const backendStatus = document.getElementById('backend-status-text');
    if (backendStatus) {
      backendStatus.textContent = '✗ 오류';
      backendStatus.className = 'status-error';
    }
  }
};

// 기존 testConnection 메서드 수정
const originalTestConnection = TimeLinkAPI.prototype.testConnection;
TimeLinkAPI.prototype.testConnection = function() {
  const statusElement = document.getElementById('api-status');
  if (statusElement) {
    statusElement.innerHTML = `
      <div class="status-loading" style="text-align: center; padding: 20px;">
        <div style="margin-bottom: 8px;">🔍</div>
        <div>백엔드 연결 확인 중...</div>
        <div style="font-size: 11px; margin-top: 8px; color: #98989d;">
          ${this.currentURL}
        </div>
      </div>
    `;
  }
  
  // 원래 메서드 호출
  return originalTestConnection.call(this);
};

// 추가 테스트 표시
TimeLinkAPI.prototype.showAppleMusicTests = function() {
  const additionalDiv = document.getElementById('additional-tests');
  if (additionalDiv) {
    additionalDiv.innerHTML = `
      <div style="margin-top: 24px;">
        <h4 style="font-size: 16px; margin-bottom: 12px; color: #fff;">추가 테스트</h4>
        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          <button class="am-btn am-btn-secondary" style="font-size: 13px; padding: 8px 16px;" 
                  onclick="window.TimeLinkAPI.testLogin()">
            로그인 테스트
          </button>
          <button class="am-btn am-btn-secondary" style="font-size: 13px; padding: 8px 16px;" 
                  onclick="window.TimeLinkAPI.testContent()">
            콘텐츠 테스트
          </button>
          <button class="am-btn am-btn-secondary" style="font-size: 13px; padding: 8px 16px;" 
                  onclick="window.TimeLinkAPI.testEndpoint('/test')">
            테스트 API
          </button>
        </div>
        <div id="test-results" style="margin-top: 16px;"></div>
      </div>
    `;
  }
};
