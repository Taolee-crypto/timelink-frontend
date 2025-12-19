// auth.js - 인증 관련 공통 기능

const API_BASE_URL = 'https://timelink-backend.timelink-api.workers.dev';

// 인증 상태 확인
export async function checkAuth() {
    const authToken = localStorage.getItem('auth_token');
    
    if (!authToken) {
        return false;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/verify`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (response.ok) {
            return true;
        } else {
            // 토큰이 유효하지 않으면 제거
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_data');
            return false;
        }
    } catch (error) {
        console.error('인증 확인 오류:', error);
        return false;
    }
}

// 사용자 정보 가져오기
export async function getUserData() {
    const authToken = localStorage.getItem('auth_token');
    
    if (!authToken) {
        return null;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/user/profile`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (response.ok) {
            const userData = await response.json();
            localStorage.setItem('user_data', JSON.stringify(userData));
            return userData;
        }
    } catch (error) {
        console.error('사용자 정보 가져오기 오류:', error);
    }
    
    return null;
}

// TL 잔액 가져오기
export async function getBalance() {
    const authToken = localStorage.getItem('auth_token');
    
    if (!authToken) {
        return 0;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/user/balance`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            
            // 로컬 스토리지 업데이트
            const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
            userData.balance = data.balance;
            localStorage.setItem('user_data', JSON.stringify(userData));
            
            return data.balance;
        }
    } catch (error) {
        console.error('잔액 조회 오류:', error);
    }
    
    return 0;
}

// 로그아웃
export async function logout() {
    const authToken = localStorage.getItem('auth_token');
    
    if (authToken) {
        try {
            await fetch(`${API_BASE_URL}/api/auth/logout`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authToken}`
                }
            });
        } catch (error) {
            console.error('로그아웃 API 오류:', error);
        }
    }
    
    // 로컬 스토리지 정리
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    localStorage.removeItem('user_email');
    localStorage.removeItem('remember_me');
    localStorage.removeItem('saved_email');
    
    // 로그인 페이지로 이동
    window.location.href = 'login.html';
}

// 상단 네비게이션 바 업데이트
export function updateNavbar() {
    const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
    
    // 사용자 이름 업데이트
    const userNameElement = document.getElementById('userName');
    const userAvatarElement = document.getElementById('userAvatar');
    const userBalanceElement = document.getElementById('userBalance');
    
    if (userNameElement && userData.name) {
        userNameElement.textContent = userData.name;
    }
    
    if (userAvatarElement && userData.name) {
        userAvatarElement.textContent = userData.name.charAt(0).toUpperCase();
    }
    
    if (userBalanceElement && userData.balance !== undefined) {
        userBalanceElement.textContent = userData.balance.toLocaleString();
    }
}
