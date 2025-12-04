import { saveToLocalStorage, loadFromLocalStorage } from './utils.js';

class AppState {
  constructor() {
    this.currentUser = this.loadUserData();
    this.platformData = this.loadPlatformData();
  }
  
  loadUserData() {
    return loadFromLocalStorage('tl_user', {
      tl: 10000,
      files: [],
      earnings: { total: 0, creator: 0, copyright: 0 },
      username: "사용자1"
    });
  }
  
  loadPlatformData() {
    return loadFromLocalStorage('tl_platform', {
      marketItems: [],
      copyrightRequests: []
    });
  }
  
  saveUserData() {
    saveToLocalStorage('tl_user', this.currentUser);
  }
  
  savePlatformData() {
    saveToLocalStorage('tl_platform', this.platformData);
  }
  
  saveAll() {
    this.saveUserData();
    this.savePlatformData();
  }
  
  // 파일 관련 메소드
  addFile(file) {
    this.currentUser.files.push(file);
    this.saveUserData();
  }
  
  getFileById(id) {
    return this.currentUser.files.find(f => f.id === id) || 
           this.platformData.marketItems.find(m => m.id === id);
  }
  
  // TL 잔액 업데이트
  updateBalance(amount) {
    this.currentUser.tl += amount;
    this.saveUserData();
  }
  
  // 마켓 아이템 추가
  addMarketItem(item) {
    this.platformData.marketItems.push(item);
    this.savePlatformData();
  }
}

export const appState = new AppState();
