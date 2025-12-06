// 공통 헤더/푸터 로드
document.addEventListener('DOMContentLoaded', function() {
  loadHeader();
  loadFooter();
});

function loadHeader() {
  const headerPlaceholder = document.getElementById('header-placeholder');
  if (!headerPlaceholder) return;
  
  const user = TimeLinkAPI.getCurrentUser();
  
  headerPlaceholder.innerHTML = `
    <header>
      <div class="header-container">
        <div class="logo">
          <a href="/index.html">TimeLink</a>
        </div>
        <nav>
          <a href="/index.html">홈</a>
          <a href="/music-market.html">마켓</a>
          <a href="/studio.html">스튜디오</a>
          <a href="/tube.html">튜브</a>
          <a href="/advertiser-dashboard.html">광고</a>
        </nav>
        <div class="user-menu" id="userMenu">
          ${user ? `
            <span>${user.username}</span>
            <div class="dropdown">
              <a href="/profile.html">프로필</a>
              <a href="/library.html">라이브러리</a>
              <a href="#" onclick="TimeLinkAPI.logout(); window.location.href='/login.html'">로그아웃</a>
            </div>
          ` : `
            <a href="/login.html" class="btn-login">로그인</a>
            <a href="/register.html" class="btn-register">회원가입</a>
          `}
        </div>
      </div>
    </header>
  `;
}

function loadFooter() {
  const footerPlaceholder = document.getElementById('footer-placeholder');
  if (!footerPlaceholder) return;
  
  footerPlaceholder.innerHTML = `
    <footer>
      <div class="footer-container">
        <div class="footer-section">
          <h3>TimeLink</h3>
          <p>음악 콘텐츠 생성 및 거래 플랫폼</p>
        </div>
        <div class="footer-section">
          <h4>서비스</h4>
          <a href="/index.html">홈</a>
          <a href="/music-market.html">마켓플레이스</a>
          <a href="/studio.html">스튜디오</a>
          <a href="/tube.html">튜브</a>
        </div>
        <div class="footer-section">
          <h4>계정</h4>
          <a href="/login.html">로그인</a>
          <a href="/register.html">회원가입</a>
          <a href="/profile.html">프로필</a>
        </div>
        <div class="footer-copyright">
          <p>&copy; 2024 TimeLink. All rights reserved.</p>
        </div>
      </div>
    </footer>
  `;
}
