// TimeLink 공통 컴포넌트 (PATCHED)
(function () {
  'use strict';

  /* ===============================
     공통 헤더 생성 (CSS 구조에 맞춤)
  =============================== */
  function createHeader() {
    return `
<header class="main-header">
  <div class="nav-container">

    <a href="./index.html" class="logo">
      <i class="bi bi-music-note-beamed"></i>
      TIMELINK
    </a>

    <button class="mobile-menu-toggle" id="mobileMenuBtn">☰</button>

    <ul class="main-menu" id="mainMenu">

      <li class="menu-item">
        <a href="./index.html" class="menu-link">홈</a>
      </li>

      <li class="menu-item">
        <a href="./studio.html" class="menu-link">Studio</a>
      </li>

      <li class="menu-item">
        <a href="./tltube.html" class="menu-link">TL Tube</a>
      </li>

      <li class="menu-item">
        <a href="./dashboard.html" class="menu-link">대시보드</a>
      </li>

      <li class="menu-item">
        <a href="./charge.html" class="menu-link">TL 충전</a>
      </li>

      <li class="menu-item">
        <a href="./faq.html" class="menu-link">FAQ</a>
      </li>

    </ul>

  </div>
</header>`;
  }

  /* ===============================
     공통 푸터 (경로만 수정)
  =============================== */
  function createFooter() {
    return `
<footer class="footer">
  <div class="container">
    <p>© 2024 TimeLink. All rights reserved.</p>
  </div>
</footer>`;
  }

  /* ===============================
     현재 페이지 active 처리
  =============================== */
  function setActiveMenu() {
    const current =
      location.pathname.split('/').pop() || 'index.html';

    document.querySelectorAll('.menu-link').forEach(link => {
      const page = link.getAttribute('href').replace('./', '');
      link.classList.toggle('active', page === current);
    });
  }

  /* ===============================
     헤더 스크롤 효과 (클래스명 수정)
  =============================== */
  function initHeaderScroll() {
    const header = document.querySelector('.main-header');
    if (!header) return;

    window.addEventListener('scroll', () => {
      header.style.backgroundColor =
        window.scrollY > 50
          ? 'rgba(26,35,126,0.98)'
          : 'rgba(26,35,126,0.95)';
    });
  }

  /* ===============================
     모바일 메뉴 토글
  =============================== */
  function initMobileMenu() {
    const btn = document.getElementById('mobileMenuBtn');
    const menu = document.getElementById('mainMenu');
    if (!btn || !menu) return;

    btn.addEventListener('click', () => {
      menu.classList.toggle('active');
    });
  }

  /* ===============================
     초기화
  =============================== */
  document.addEventListener('DOMContentLoaded', () => {
    // header 위치 고정 삽입
    const headerTarget = document.getElementById('header');
    if (headerTarget) {
      headerTarget.innerHTML = createHeader();
    }

    // footer 하단 삽입
    document.body.insertAdjacentHTML(
      'beforeend',
      createFooter()
    );

    setActiveMenu();
    initHeaderScroll();
    initMobileMenu();
  });

})();
