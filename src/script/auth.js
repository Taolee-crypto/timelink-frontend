const API_BASE_URL = "https://timelink-api.timelink-api.workers.dev";

// 인증 관련 JavaScript

// 이메일 인증
async function verifyEmail(email, verificationCode) {
    try {
        const response = await fetch(API_BASE_URL + '/api/auth/verify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                verificationCode: verificationCode
            })
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('이메일 인증 오류:', error);
        return { success: false, error: '서버 연결 실패' };
    }
}

// 로그인 함수
async function loginUser(email, password) {
    try {
        const response = await fetch(API_BASE_URL + '/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        const data = await response.json();
        
        if (data.success) {
            // 토큰 저장
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            return { success: true, user: data.user };
        } else {
            return { success: false, error: data.error };
        }
    } catch (error) {
        console.error('로그인 오류:', error);
        return { success: false, error: '서버 연결 실패' };
    }
}

// 회원가입 함수
async function signupUser(email, password, name) {
    try {
        const response = await fetch(API_BASE_URL + '/api/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password,
                name: name
            })
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('회원가입 오류:', error);
        return { success: false, error: '서버 연결 실패' };
    }
}

// 로그아웃 함수
function logoutUser() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'login.html';
}

// 토큰 확인 함수
function isLoggedIn() {
    return localStorage.getItem('token') !== null;
}

// 현재 사용자 정보 가져오기
function getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
}
