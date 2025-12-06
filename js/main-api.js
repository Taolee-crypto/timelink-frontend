// index.html 및 기타 페이지에 추가할 스크립트
document.addEventListener('DOMContentLoaded', async function() {
  // 로그인 상태 확인
  if (!TimeLinkAPI.isAuthenticated() && !window.location.pathname.includes('login.html') 
      && !window.location.pathname.includes('register.html')) {
    window.location.href = '/login.html';
    return;
  }

  // 사용자 정보 표시
  const userInfoDiv = document.getElementById('userInfo');
  const userMenuDiv = document.getElementById('userMenu');
  const userNameSpan = document.getElementById('userName');
  
  const currentUser = TimeLinkAPI.getCurrentUser();
  
  if (currentUser) {
    if (userInfoDiv) {
      userInfoDiv.innerHTML = `
        <div class="user-info-card">
          <h3>${currentUser.username || '사용자'}</h3>
          <p>${currentUser.email || ''}</p>
          <p>잔액: ${currentUser.balance || 0} TLT</p>
        </div>
      `;
    }
    
    if (userMenuDiv) {
      userMenuDiv.innerHTML = `
        <span>${currentUser.username || '사용자'}</span>
        <div class="dropdown">
          <a href="/profile.html">프로필</a>
          <a href="/library.html">내 라이브러리</a>
          <a href="/studio.html">스튜디오</a>
          <a href="#" onclick="TimeLinkAPI.logout(); window.location.href='/login.html'">로그아웃</a>
        </div>
      `;
    }
    
    if (userNameSpan) {
      userNameSpan.textContent = currentUser.username || '사용자';
    }
  }

  // 페이지별 데이터 로딩
  const path = window.location.pathname;
  
  if (path.includes('index.html') || path === '/') {
    await loadHomePage();
  } else if (path.includes('music-market.html')) {
    await loadMarketPage();
  } else if (path.includes('studio.html')) {
    await loadStudioPage();
  } else if (path.includes('tube.html')) {
    await loadTubePage();
  } else if (path.includes('advertiser-dashboard.html')) {
    await loadDashboardPage();
  }
});

// 홈페이지 데이터 로드
async function loadHomePage() {
  const contentListDiv = document.getElementById('contentList');
  const marketItemsDiv = document.getElementById('marketItems');
  const statsDiv = document.getElementById('stats');
  
  try {
    // 콘텐츠 목록
    if (contentListDiv) {
      const contentData = await TimeLinkAPI.getContentList(6);
      if (contentData && contentData.success && contentData.contents) {
        contentListDiv.innerHTML = contentData.contents.map(item => `
          <div class="content-item">
            <div class="content-thumbnail">🎵</div>
            <div class="content-info">
              <h4>${item.title}</h4>
              <p>${item.description?.substring(0, 60) || '설명 없음'}...</p>
              <div class="content-meta">
                <span>${item.creator_name || '익명'}</span>
                <span>${item.price || 0} TLT</span>
              </div>
            </div>
          </div>
        `).join('');
      } else {
        contentListDiv.innerHTML = '<p>콘텐츠가 없습니다.</p>';
      }
    }
    
    // 마켓 아이템
    if (marketItemsDiv) {
      const marketData = await TimeLinkAPI.getMarketList();
      if (marketData && marketData.success && marketData.items) {
        marketItemsDiv.innerHTML = marketData.items.slice(0, 4).map(item => `
          <div class="market-item">
            <h4>${item.title}</h4>
            <p>${item.description?.substring(0, 50) || '설명 없음'}...</p>
            <div class="market-meta">
              <span>판매자: ${item.seller_name}</span>
              <span class="price">${item.price} TLT</span>
            </div>
            <button class="btn-buy" onclick="buyItem(${item.id})">구매</button>
          </div>
        `).join('');
      } else {
        marketItemsDiv.innerHTML = '<p>마켓 아이템이 없습니다.</p>';
      }
    }
    
    // 통계 정보
    if (statsDiv) {
      const user = TimeLinkAPI.getCurrentUser();
      statsDiv.innerHTML = `
        <div class="stat-card">
          <h4>내 잔액</h4>
          <p class="stat-value">${user?.balance || 0} TLT</p>
        </div>
        <div class="stat-card">
          <h4>콘텐츠</h4>
          <p class="stat-value">0개</p>
        </div>
        <div class="stat-card">
          <h4>판매</h4>
          <p class="stat-value">0건</p>
        </div>
      `;
    }
    
  } catch (error) {
    console.error('데이터 로드 오류:', error);
  }
}

// 마켓 페이지 로드
async function loadMarketPage() {
  const marketContainer = document.getElementById('marketContainer');
  if (!marketContainer) return;
  
  try {
    const marketData = await TimeLinkAPI.getMarketList();
    if (marketData && marketData.success && marketData.items) {
      marketContainer.innerHTML = marketData.items.map(item => `
        <div class="market-listing">
          <div class="listing-header">
            <h3>${item.title}</h3>
            <span class="listing-price">${item.price} TLT</span>
          </div>
          <p>${item.description || '설명 없음'}</p>
          <div class="listing-footer">
            <span>판매자: ${item.seller_name}</span>
            <button class="btn-primary" onclick="buyItem(${item.id})">구매하기</button>
          </div>
        </div>
      `).join('');
    } else {
      marketContainer.innerHTML = '<p>판매 중인 아이템이 없습니다.</p>';
    }
  } catch (error) {
    marketContainer.innerHTML = `<p>마켓 데이터를 불러오는데 실패했습니다: ${error.message}</p>`;
  }
}

// 스튜디오 페이지 로드
async function loadStudioPage() {
  const projectsDiv = document.getElementById('studioProjects');
  if (!projectsDiv) return;
  
  try {
    const projectsData = await TimeLinkAPI.getStudioProjects();
    if (projectsData && projectsData.success) {
      // 스튜디오 프로젝트 표시
      projectsDiv.innerHTML = '<p>스튜디오 기능 준비 중...</p>';
    } else {
      projectsDiv.innerHTML = `
        <div class="empty-state">
          <h3>프로젝트가 없습니다</h3>
          <p>새로운 프로젝트를 시작해보세요!</p>
          <button class="btn-primary" onclick="createNewProject()">새 프로젝트</button>
        </div>
      `;
    }
  } catch (error) {
    projectsDiv.innerHTML = `<p>프로젝트를 불러오는데 실패했습니다: ${error.message}</p>`;
  }
}

// 튜브 페이지 로드
async function loadTubePage() {
  const videosDiv = document.getElementById('tubeVideos');
  if (!videosDiv) return;
  
  try {
    const videosData = await TimeLinkAPI.getTubeVideos();
    if (videosData && videosData.success && videosData.videos) {
      videosDiv.innerHTML = videosData.videos.map(video => `
        <div class="video-card">
          <div class="video-thumbnail">📹</div>
          <div class="video-info">
            <h4>${video.title}</h4>
            <p>${video.description?.substring(0, 80) || '설명 없음'}...</p>
            <div class="video-meta">
              <span>👁️ ${video.view_count || 0}</span>
              <span>👍 ${video.like_count || 0}</span>
            </div>
          </div>
        </div>
      `).join('');
    } else {
      videosDiv.innerHTML = '<p>동영상이 없습니다.</p>';
    }
  } catch (error) {
    videosDiv.innerHTML = `<p>동영상을 불러오는데 실패했습니다: ${error.message}</p>`;
  }
}

// 대시보드 페이지 로드
async function loadDashboardPage() {
  const dashboardContent = document.getElementById('dashboardContent');
  if (!dashboardContent) return;
  
  dashboardContent.innerHTML = `
    <div class="dashboard-grid">
      <div class="dashboard-card">
        <h3>광고 통계</h3>
        <p>준비 중...</p>
      </div>
      <div class="dashboard-card">
        <h3>수익 현황</h3>
        <p>준비 중...</p>
      </div>
      <div class="dashboard-card">
        <h3>콘텐츠 분석</h3>
        <p>준비 중...</p>
      </div>
    </div>
  `;
}

// 유틸리티 함수
function buyItem(itemId) {
  alert(`아이템 ID: ${itemId} 구매 기능 준비 중...`);
  // 실제 구현시 구매 로직
}

function createNewProject() {
  alert('새 프로젝트 생성 기능 준비 중...');
}

// 전역 함수
window.buyItem = buyItem;
window.createNewProject = createNewProject;
