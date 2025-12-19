// TimeLink 인증 모듈
const API_BASE_URL = 'http://localhost:3003';

// 이메일 유효성 검사
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// 비밀번호 강도 검사
function checkPasswordStrength(password) {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    return {
        score: strength,
        level: strength < 2 ? 'weak' : strength < 4 ? 'medium' : 'strong'
    };
}

// 회원가입 함수
export async function signup(userData) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData)
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || '회원가입에 실패했습니다.');
        }
        
        return {
            success: true,
            data: data,
            email: userData.email
        };
        
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
}

// 이메일 인증 확인 함수
export async function verifyEmail(email, code) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/verify-email`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, code })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || '인증에 실패했습니다.');
        }
        
        return {
            success: true,
            data: data
        };
        
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
}

// 로그인 함수
export async function login(email, password) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || '로그인에 실패했습니다.');
        }
        
        // 로컬 스토리지에 인증 정보 저장
        if (data.token) {
            localStorage.setItem('timelink_token', data.token);
            localStorage.setItem('timelink_user', JSON.stringify(data.user));
            localStorage.setItem('timelink_auth', 'true');
        }
        
        return {
            success: true,
            data: data
        };
        
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
}

// 로그아웃 함수
export function logout() {
    localStorage.removeItem('timelink_token');
    localStorage.removeItem('timelink_user');
    localStorage.removeItem('timelink_auth');
    window.location.href = 'login.html';
}

// 인증 상태 확인
export function checkAuth() {
    const token = localStorage.getItem('timelink_token');
    const auth = localStorage.getItem('timelink_auth');
    const user = localStorage.getItem('timelink_user');
    
    return {
        isAuthenticated: !!(token && auth === 'true'),
        user: user ? JSON.parse(user) : null,
        token: token
    };
}

// 인증이 필요한 페이지에서 호출
export function requireAuth(redirectUrl = 'login.html') {
    const auth = checkAuth();
    if (!auth.isAuthenticated) {
        window.location.href = redirectUrl;
        return false;
    }
    return true;
}

// 사용자 정보 가져오기
export function getUserInfo() {
    const user = localStorage.getItem('timelink_user');
    return user ? JSON.parse(user) : null;
}

// 토큰 가져오기
export function getToken() {
    return localStorage.getItem('timelink_token');
}

// 이메일 재전송 함수
export async function resendVerificationEmail(email) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/resend-verification`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || '이메일 재전송에 실패했습니다.');
        }
        
        return {
            success: true,
            data: data
        };
        
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
}

// 비밀번호 재설정 요청
export async function requestPasswordReset(email) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/request-password-reset`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || '비밀번호 재설정 요청에 실패했습니다.');
        }
        
        return {
            success: true,
            data: data
        };
        
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
}

// 비밀번호 재설정 확인
export async function resetPassword(token, newPassword) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token, newPassword })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || '비밀번호 재설정에 실패했습니다.');
        }
        
        return {
            success: true,
            data: data
        };
        
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
}

export default {
    validateEmail,
    checkPasswordStrength,
    signup,
    verifyEmail,
    login,
    logout,
    checkAuth,
    requireAuth,
    getUserInfo,
    getToken,
    resendVerificationEmail,
    requestPasswordReset,
    resetPassword
};
