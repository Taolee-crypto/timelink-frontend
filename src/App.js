// timelink/src/App.js
import { createRouter } from './utils/router.js';
import { authService } from './services/auth.js';
import './styles/main.css';

// 페이지 컴포넌트들 (동적 임포트)
const pages = {
  home: () => import('./pages/Home.js'),
  login: () => import('./pages/Login.js'),
  register: () => import('./pages/Register.js'),
  dashboard: () => import('./pages/Dashboard.js'),
  studio: () => import('./pages/Studio.js'),
  market: () => import('./pages/Market.js'),
  tube: () => import('./pages/Tube.js'),
  library: () => import('./pages/Library.js'),
  admin: () => import('./pages/Admin.js'),
  notFound: () => import('./pages/NotFound.js')
};

class TimeLinkApp {
  constructor() {
    this.appElement = document.getElementById('app');
    this.router = createRouter(this);
    this.currentPage = null;
    this.init();
  }

  async init() {
    console.log('TimeLink App Initializing...');
    
    // 인증 상태 확인
    await authService.checkAuth();
    
    // 라우터 시작
    this.router.init();
    
    // 초기 페이지 로드
    await this.loadPage();
    
    console.log('TimeLink App Ready!');
  }

  async loadPage() {
    const path = window.location.pathname;
    const pageName = this.router.getPageName(path);
    
    try {
      // 로딩 상태 표시
      this.showLoading();
      
      // 페이지 컴포넌트 로드
      const pageModule = await pages[pageName]?.();
      const PageComponent = pageModule?.default;
      
      if (PageComponent) {
        // 기존 페이지 제거
        if (this.currentPage?.destroy) {
          this.currentPage.destroy();
        }
        
        // 새 페이지 생성
        this.currentPage = new PageComponent(this);
        this.appElement.innerHTML = '';
        await this.currentPage.render(this.appElement);
        
        // 페이지 이벤트 바인딩
        if (this.currentPage.bindEvents) {
          this.currentPage.bindEvents();
        }
      } else {
        // 404 페이지
        const notFoundModule = await pages.notFound();
        const NotFound = notFoundModule.default;
        this.currentPage = new NotFound(this);
        this.appElement.innerHTML = '';
        await this.currentPage.render(this.appElement);
      }
    } catch (error) {
      console.error('페이지 로드 오류:', error);
      this.showError('페이지를 로드하는 중 오류가 발생했습니다.');
    }
  }

  showLoading() {
    this.appElement.innerHTML = `
      <div class="loading-overlay">
        <div class="spinner"></div>
        <p>로딩 중...</p>
      </div>
    `;
  }

  showError(message) {
    this.appElement.innerHTML = `
      <div class="error-overlay">
        <div class="error-icon">⚠️</div>
        <h3>오류 발생</h3>
        <p>${message}</p>
        <button onclick="location.reload()">새로고침</button>
      </div>
    `;
  }

  navigate(path) {
    this.router.navigate(path);
    this.loadPage();
  }

  logout() {
    authService.logout();
    this.navigate('/login');
  }
}

// 앱 시작
document.addEventListener('DOMContentLoaded', () => {
  window.app = new TimeLinkApp();
});

export default TimeLinkApp;
