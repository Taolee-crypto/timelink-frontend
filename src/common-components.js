// styles/common-components.js
// 공통 스타일 및 컴포넌트 정의

// 전체 페이지 공통 스타일
export const commonStyles = `
  :root {
    --primary-color: #6366f1;
    --primary-hover: #4f46e5;
    --secondary-color: #8b5cf6;
    --background-color: #0f172a;
    --surface-color: #1e293b;
    --text-primary: #f8fafc;
    --text-secondary: #cbd5e1;
    --border-color: #334155;
    --success-color: #10b981;
    --error-color: #ef4444;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
    background-color: var(--background-color);
    color: var(--text-primary);
    min-height: 100vh;
    line-height: 1.6;
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  button {
    cursor: pointer;
    font-family: inherit;
  }
`;

// 상단 네비게이션 컴포넌트
export const createNavbar = (currentPage = 'home') => {
  const pages = {
    home: { name: 'Home', url: 'index.html' },
    studio: { name: 'Studio', url: 'studio.html' },
    tltube: { name: 'TLTube', url: 'tltube.html' },
    musicplace: { name: 'MusicPlace', url: 'musicplace.html' },
    dashboard: { name: 'Dashboard', url: 'dashboard.html' },
    charge: { name: 'Charge', url: 'charge.html' }
  };

  return `
    <nav class="navbar">
      <div class="nav-container">
        <!-- 로고 -->
        <div class="nav-logo">
          <a href="index.html">TimeLink</a>
        </div>

        <!-- 메뉴 항목 -->
        <div class="nav-menu">
          ${Object.entries(pages)
            .map(([key, page]) => `
              <a href="${page.url}" class="nav-item ${currentPage === key ? 'active' : ''}">
                ${page.name}
              </a>
            `).join('')}
        </div>

        <!-- 우측 메뉴 -->
        <div class="nav-actions">
          <a href="guide.html" class="nav-link">Guide</a>
          <a href="faq.html" class="nav-link">FAQ</a>
          ${localStorage.getItem('isLoggedIn') === 'true' 
            ? `
              <button class="btn-logout" onclick="handleLogout()">Logout</button>
              <a href="dashboard.html" class="btn-primary">Dashboard</a>
            `
            : `
              <a href="login.html" class="nav-link">Login</a>
              <a href="signup.html" class="btn-primary">Sign Up</a>
            `
          }
        </div>

        <!-- 모바일 메뉴 토글 -->
        <button class="mobile-menu-toggle" aria-label="Toggle menu">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>

    <style>
      .navbar {
        background-color: var(--surface-color);
        border-bottom: 1px solid var(--border-color);
        position: sticky;
        top: 0;
        z-index: 1000;
        padding: 0.75rem 0;
      }

      .nav-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 1.5rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      .nav-logo a {
        font-size: 1.5rem;
        font-weight: bold;
        color: var(--primary-color);
      }

      .nav-menu {
        display: flex;
        gap: 2rem;
        align-items: center;
      }

      .nav-item {
        color: var(--text-secondary);
        padding: 0.5rem 0;
        position: relative;
        transition: color 0.3s ease;
        font-size: 0.95rem;
        font-weight: 500;
        white-space: nowrap; /* 버튼 글씨 줄바꿈 방지 */
      }

      .nav-item:hover {
        color: var(--text-primary);
      }

      .nav-item.active {
        color: var(--primary-color);
      }

      .nav-item.active::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 2px;
        background-color: var(--primary-color);
      }

      .nav-actions {
        display: flex;
        align-items: center;
        gap: 1.5rem;
      }

      .nav-link {
        color: var(--text-secondary);
        transition: color 0.3s ease;
        font-size: 0.95rem;
        font-weight: 500;
        white-space: nowrap; /* 버튼 글씨 줄바꿈 방지 */
      }

      .nav-link:hover {
        color: var(--text-primary);
      }

      .btn-primary {
        background-color: var(--primary-color);
        color: white;
        padding: 0.5rem 1.25rem;
        border-radius: 0.375rem;
        font-weight: 500;
        transition: background-color 0.3s ease;
        font-size: 0.95rem;
        white-space: nowrap; /* 버튼 글씨 줄바꿈 방지 */
      }

      .btn-primary:hover {
        background-color: var(--primary-hover);
      }

      .btn-logout {
        background: none;
        border: 1px solid var(--border-color);
        color: var(--text-secondary);
        padding: 0.5rem 1rem;
        border-radius: 0.375rem;
        font-size: 0.95rem;
        white-space: nowrap; /* 버튼 글씨 줄바꿈 방지 */
      }

      .btn-logout:hover {
        background-color: rgba(239, 68, 68, 0.1);
        color: var(--error-color);
        border-color: var(--error-color);
      }

      .mobile-menu-toggle {
        display: none;
        flex-direction: column;
        gap: 4px;
        background: none;
        border: none;
        padding: 0.5rem;
      }

      .mobile-menu-toggle span {
        width: 24px;
        height: 2px;
        background-color: var(--text-primary);
        transition: 0.3s;
      }

      /* 반응형 디자인 */
      @media (max-width: 768px) {
        .nav-menu,
        .nav-actions {
          display: none;
        }

        .mobile-menu-toggle {
          display: flex;
        }

        .nav-menu.active {
          display: flex;
          flex-direction: column;
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background-color: var(--surface-color);
          padding: 1rem;
          border-top: 1px solid var(--border-color);
        }

        .nav-actions.active {
          display: flex;
          flex-direction: column;
          position: absolute;
          top: calc(100% + 200px);
          left: 0;
          right: 0;
          background-color: var(--surface-color);
          padding: 1rem;
          border-top: 1px solid var(--border-color);
        }
      }
    </style>
  `;
};
