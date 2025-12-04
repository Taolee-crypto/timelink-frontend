import { appState } from './state.js';
import { formatTime } from './utils.js';

class UIManager {
  constructor() {
    this.currentTab = 'dashboard';
  }
  
  // 탭 전환
  switchTab(tabId) {
    this.currentTab = tabId;
    
    // 모든 탭 콘텐츠 숨기기
    document.querySelectorAll('.tab-content').forEach(tab => {
      tab.classList.remove('active');
    });
    
    // 모든 탭 아이템 비활성화
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.remove('active');
    });
    
    // 선택한 탭 활성화
    document.getElementById(tabId).classList.add('active');
    document.getElementById(tabId + 'Tab').classList.add('active');
  }
  
  // 대시보드 업데이트
  updateDashboard() {
    const user = appState.currentUser;
    
    // 통계 업데이트
    document.getElementById('totalFiles').textContent = `${user.files.length}개`;
    document.getElementById('totalEarnings').textContent = `${user.earnings.total.toFixed(2)} TL`;
    document.getElementById('copyrightEarnings').textContent = `${user.earnings.copyright.toFixed(2)} TL`;
    document.getElementById('balance').textContent = `${user.tl.toLocaleString()} TL`;
    document.getElementById('headerBalance').textContent = `${user.tl.toLocaleString()} TL`;
    
    // 최근 파일 목록 업데이트
    this.updateRecentFiles();
  }
  
  updateRecentFiles() {
    const recentFilesDiv = document.getElementById('recentFiles');
    const recentFiles = [...appState.currentUser.files]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 4);
    
    let html = '';
    recentFiles.forEach(file => {
      const remainingTime = file.playTime - file.usedTime;
      html += `
        <div class="market-item">
          <h4>${file.title}</h4>
          <div style="margin: 10px 0;">
            <span class="badge ${file.type === 'tl3' ? 'tl3-badge' : 'tl4-badge'}">${file.type.toUpperCase()}</span>
            ${file.isStudio ? '<span class="badge" style="background: #9C27B0;">스튜디오</span>' : ''}
            ${file.isCertified ? '<span class="badge certified-badge">인증</span>' : ''}
          </div>
          <div style="margin: 10px 0;">
            <div>남은 시간: ${formatTime(remainingTime)}</div>
            <div>가격: ${file.pricePerSecond} TL/초</div>
            <div>수익: ${file.earnings?.total || 0} TL</div>
          </div>
          <div style="display: flex; gap: 10px;">
            <button class="btn btn-primary play-button" data-file-id="${file.id}" style="flex: 1;">재생하기</button>
            <button class="btn btn-warning sell-button" data-file-id="${file.id}" style="flex: 1;">판매하기</button>
          </div>
        </div>
      `;
    });
    
    recentFilesDiv.innerHTML = html || '<div style="text-align: center; padding: 40px; color: #666;">파일이 없습니다.</div>';
  }
  
  // 마켓 업데이트
  updateMarket() {
    const marketDiv = document.getElementById('marketItems');
    let html = '';
    
    appState.platformData.marketItems.forEach(item => {
      const remainingTime = item.playTime - (item.usedTime || 0);
      html += `
        <div class="market-item">
          <h4>${item.title}</h4>
          <div style="margin: 10px 0;">
            <span class="badge ${item.type === 'tl3' ? 'tl3-badge' : 'tl4-badge'}">${item.type.toUpperCase()}</span>
            ${item.isCertified ? '<span class="badge certified-badge">인증됨</span>' : '<span class="badge uncertified-badge">미인증</span>'}
          </div>
          <div style="margin: 10px 0;">
            <div>판매자: ${item.sellerName}</div>
            <div>남은 시간: ${formatTime(remainingTime)}</div>
            <div>가격: ${item.price.toLocaleString()} TL</div>
            <div>초당 사용료: ${item.pricePerSecond} TL</div>
          </div>
          <button class="btn btn-success buy-button" data-item-id="${item.id}" style="width: 100%;">구매하기</button>
        </div>
      `;
    });
    
    marketDiv.innerHTML = html || '<div style="text-align: center; padding: 40px; color: #666;">판매 중인 파일이 없습니다.</div>';
  }
}

export const uiManager = new UIManager();
