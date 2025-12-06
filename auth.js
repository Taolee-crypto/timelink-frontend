// auth.js 파일 생성 (timelink 폴더에)
import api from './api.js';

export function checkAuth() {
    const publicPages = ['login.html', 'register.html', 'index.html'];
    const currentPage = window.location.pathname.split('/').pop();
    
    // 공개 페이지면 인증 체크 안함
    if (publicPages.includes(currentPage)) return;
    
    // 로그인 상태 체크
    if (!api.isAuthenticated()) {
        window.location.href = 'login.html';
        return false;
    }
    
    return true;
}

export function updateUserInfo() {
    const user = api.getCurrentUser();
    
    // 사용자 정보 표시 요소 업데이트
    const userAvatar = document.getElementById('user-avatar');
    const userName = document.getElementById('user-name');
    const userBalance = document.getElementById('user-balance');
    const welcomeMessage = document.getElementById('welcome-message');
    
    if (userAvatar && user?.name) {
        userAvatar.textContent = user.name.charAt(0).toUpperCase();
    }
    
    if (userName && user?.name) {
        userName.textContent = user.name;
    }
    
    if (userBalance && user?.balance !== undefined) {
        userBalance.textContent = `₩ ${Number(user.balance).toLocaleString()}`;
    }
    
    if (welcomeMessage && user?.name) {
        welcomeMessage.textContent = `${user.name}님, 환영합니다!`;
    }
}
