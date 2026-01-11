// API 모킹 - 인증 관련
class MockAuthAPI {
    constructor() {
        this.users = new Map();
        this.sessions = new Map();
    }
    
    async signup(email, password, name, role) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (this.users.has(email)) {
                    reject(new Error('이미 존재하는 이메일입니다.'));
                    return;
                }
                
                const user = {
                    id: `user_${Date.now()}`,
                    email,
                    name,
                    role,
                    createdAt: new Date().toISOString()
                };
                
                this.users.set(email, { ...user, password });
                
                resolve({
                    success: true,
                    user
                });
            }, 1000);
        });
    }
    
    async login(email, password) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const userData = this.users.get(email);
                
                if (!userData) {
                    // 테스트용 계정 생성
                    const user = {
                        id: `user_${Date.now()}`,
                        email,
                        name: email.split('@')[0],
                        role: 'listener',
                        createdAt: new Date().toISOString()
                    };
                    
                    this.users.set(email, { ...user, password });
                    
                    resolve({
                        success: true,
                        user
                    });
                    return;
                }
                
                if (userData.password !== password) {
                    reject(new Error('비밀번호가 일치하지 않습니다.'));
                    return;
                }
                
                const { password: _, ...user } = userData;
                
                resolve({
                    success: true,
                    user
                });
            }, 1000);
        });
    }
    
    async logout(sessionId) {
        return new Promise((resolve) => {
            setTimeout(() => {
                this.sessions.delete(sessionId);
                resolve({ success: true });
            }, 500);
        });
    }
}

// 글로벌 API 객체 생성
window.mockAuthAPI = new MockAuthAPI();
