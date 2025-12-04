import { setupDropZone, showMessage } from './modules/utils.js';
import player from './modules/player.js';
import { appState } from './modules/state.js';
import { uiManager } from './modules/ui.js';

class TLApp {
  constructor() {
    this.init();
  }
  
  async init() {
    try {
      // 이벤트 리스너 설정
      this.setupEventListeners();
      
      // 드롭존 설정
      this.setupDropZones();
      
      // 샘플 데이터 생성
      this.createSampleData();
      
      // UI 초기화
      uiManager.updateDashboard();
      uiManager.updateMarket();
      
      console.log('TL Platform initialized');
      
    } catch (error) {
      console.error('App initialization failed:', error);
    }
  }
  
  setupEventListeners() {
    // 탭 전환
    document.getElementById('dashboardTab').addEventListener('click', () => uiManager.switchTab('dashboard'));
    document.getElementById('p2pTab').addEventListener('click', () => uiManager.switchTab('p2p'));
    document.getElementById('studioTab').addEventListener('click', () => uiManager.switchTab('studio'));
    document.getElementById('marketTab').addEventListener('click', () => uiManager.switchTab('market'));
    document.getElementById('copyrightTab').addEventListener('click', () => uiManager.switchTab('copyright'));
    
    // 변환 버튼
    document.getElementById('convertTl3Btn').addEventListener('click', () => this.convertP2P('tl3'));
    document.getElementById('convertTl4Btn').addEventListener('click', () => this.convertP2P('tl4'));
    document.getElementById('convertStudioBtn').addEventListener('click', () => this.convertStudio());
    
    // 기타 이벤트 리스너들...
    this.setupButtonEvents();
  }
  
  setupButtonEvents() {
    // 라이브러리 버튼
    document.getElementById('libraryBtn').addEventListener('click', () => this.showMyLibrary());
    
    // 충전 버튼
    document.getElementById('chargeBtn').addEventListener('click', () => this.showChargeModal());
    
    // 로그아웃 버튼
    document.getElementById('logoutBtn').addEventListener('click', () => this.logout());
    
    // 마켓 검색 버튼
    document.getElementById('searchBtn').addEventListener('click', () => this.searchMarket());
    document.getElementById('sellBtn').addEventListener('click', () => this.showSellModal());
    
    // 저작권 버튼
    document.getElementById('requestCopyrightBtn').addEventListener('click', () => this.requestCopyright());
    
    // 이벤트 위임: 동적 생성 버튼들
    document.addEventListener('click', (e) => {
      // 재생 버튼
      if (e.target.closest('.play-button')) {
        const fileId = parseInt(e.target.closest('.play-button').dataset.fileId);
        this.playFile(fileId);
      }
      
      // 구매 버튼
      if (e.target.closest('.buy-button')) {
        const itemId = parseInt(e.target.closest('.buy-button').dataset.itemId);
        this.buyFile(itemId);
      }
      
      // 판매 버튼
      if (e.target.closest('.sell-button')) {
        const fileId = parseInt(e.target.closest('.sell-button').dataset.fileId);
        this.sellFileModal(fileId);
      }
    });
  }
  
  setupDropZones() {
    setupDropZone('mp3DropZone', 'audio/*', this.handleFileUpload.bind(this));
    setupDropZone('mp4DropZone', 'video/*', this.handleFileUpload.bind(this));
    setupDropZone('studioDropZone', 'audio/*,video/*', this.handleFileUpload.bind(this));
  }
  
  handleFileUpload(file, zoneId) {
    const isAudio = zoneId.includes('mp3') || zoneId.includes('studio');
    const isVideo = zoneId.includes('mp4');
    
    const zone = document.getElementById(zoneId);
    const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
    
    zone.innerHTML = `
      <div style="font-size: 2rem;">${isAudio ? '🎵' : '🎬'}</div>
      <div style="margin: 10px 0; font-weight: bold;">${file.name}</div>
      <div style="color: #666; font-size: 0.9rem;">${sizeMB} MB</div>
      <div style="color: #4CAF50; margin-top: 10px;">✓ 업로드 완료</div>
    `;
    
    const statusDiv = zoneId.replace('DropZone', 'Status');
    showMessage('파일 업로드 완료!', 'success', statusDiv);
  }
  
  async playFile(fileId) {
    const file = appState.getFileById(fileId);
    if (!file) {
      showMessage('파일을 찾을 수 없습니다.', 'error');
      return;
    }
    
    // 플레이어를 사용한 재생
    const success = await player.play(file);
    
    if (success) {
      // 재생 모달 표시
      this.showPlayModal(file);
      
      // 플레이어 시간 업데이트 콜백 설정
      player.onTimeUpdate = (file, currentTime, maxTime, currentCost) => {
        this.updatePlaybackUI(file, currentTime, maxTime, currentCost);
      };
    }
  }
  
  updatePlaybackUI(file, currentTime, maxTime, currentCost) {
    const progressBar = document.getElementById('playbackProgress');
    const currentTimeEl = document.getElementById('currentTime');
    const remainingTimeEl = document.getElementById('remainingTime');
    const currentCostEl = document.getElementById('currentCost');
    
    if (progressBar) {
      const progressPercent = (currentTime / maxTime) * 100;
      progressBar.style.width = `${progressPercent}%`;
    }
    
    if (currentTimeEl) {
      currentTimeEl.textContent = formatTime(currentTime);
    }
    
    if (remainingTimeEl) {
      const remaining = maxTime - currentTime;
      remainingTimeEl.textContent = formatTime(remaining);
    }
    
    if (currentCostEl) {
      currentCostEl.textContent = currentCost.toFixed(2);
    }
  }
  
  // 기존 변환 함수들...
  convertP2P(type) {
    // 기존 변환 로직 유지
  }
  
  convertStudio() {
    // 기존 스튜디오 변환 로직
  }
  
  // 기타 메소드들...
  showMyLibrary() { /* ... */ }
  showChargeModal() { /* ... */ }
  logout() { /* ... */ }
  searchMarket() { /* ... */ }
  showSellModal() { /* ... */ }
  requestCopyright() { /* ... */ }
  buyFile(itemId) { /* ... */ }
  sellFileModal(fileId) { /* ... */ }
  
  createSampleData() {
    // 기존 샘플 데이터 생성 로직
    if (appState.currentUser.files.length === 0) {
      const sampleFiles = [
        {
          id: 1,
          title: "샘플 음악 1",
          type: "tl3",
          pricePerSecond: 0.5,
          playTime: 300,
          usedTime: 0,
          earnings: { total: 25 },
          createdAt: new Date().toISOString(),
          audioUrl: "https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3",
          isCertified: false,
          isStudio: false
        }
      ];
      
      sampleFiles.forEach(file => {
        appState.addFile(file);
      });
    }
  }
}

// 앱 시작
document.addEventListener('DOMContentLoaded', () => {
  window.tlApp = new TLApp();
});
