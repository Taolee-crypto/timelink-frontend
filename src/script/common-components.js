// timelink-auth.js - TIMELINK 인증 시스템

class TimelinkAuth {
    constructor() {
        this.apiBaseUrl = 'https://api.timelink.studio'; // 실제 API 엔드포인트
        this.init();
    }

    init() {
        console.log('Timelink Auth 시스템 초기화');
        
        // 페이지 로드 시 인증 상태 확인
        this.checkAuthStatus();
        
        // 이벤트 리스너 설정
        this.setupGlobalListeners();
    }

    // 인증 상태 확인
    checkAuthStatus() {
        const user = localStorage.getItem('timelink_user');
        const token = localStorage.getItem('timelink_token');
        
        if (user && token) {
            console.log('사용자가 로그인되어 있습니다.');
            this.updateUserInterface(true);
        } else {
            console.log('사용자가 로그아웃 상태입니다.');
            this.updateUserInterface(false);
        }
    }

    // 글로벌 이벤트 리스너 설정
    setupGlobalListeners() {
        // 스토리지 변경 감지 (다른 탭에서 로그인/로그아웃 시)
        window.addEventListener('storage', (e) => {
            if (e.key === 'timelink_user' || e.key === 'timelink_token') {
                this.checkAuthStatus();
            }
        });

        // 페이지 전환 시 인증 상태 확인
        window.addEventListener('popstate', () => {
            this.checkAuthStatus();
        });
    }

    // UI 업데이트
    updateUserInterface(isLoggedIn) {
        // 헤더의 인증 버튼 업데이트 (common-components.js에서 처리됨)
        // 필요한 경우 추가 UI 업데이트 로직
    }

    // 로그인 처리 (API 연동)
    async login(email, password) {
        try {
            // 실제 API 호출
            // const response = await fetch(`${this.apiBaseUrl}/auth/login`, {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify({ email, password })
            // });

            // const data = await response.json();

            // 더미 응답 (실제로는 API 호출)
            const data = {
                success: true,
                user: {
                    id: 'user_' + Date.now(),
                    email: email,
                    name: email.split('@')[0],
                    role: 'user',
                    createdAt: new Date().toISOString()
                },
                token: 'jwt_token_' + Date.now(),
                message: '로그인 성공'
            };

            if (data.success) {
                // 인증 정보 저장
                localStorage.setItem('timelink_user', JSON.stringify(data.user));
                localStorage.setItem('timelink_token', data.token);

                // 첫 로그인 시 10,000 TL 보너스
                if (!localStorage.getItem('timelink_tl_balance')) {
                    localStorage.setItem('timelink_tl_balance', '10000');
                    this.addTransaction('로그인 보너스', 10000, '첫 로그인 보너스');
                }

                return { success: true, user: data.user };
            } else {
                return { success: false, message: data.message || '로그인 실패' };
            }
        } catch (error) {
            console.error('로그인 오류:', error);
            return { success: false, message: '로그인 중 오류가 발생했습니다.' };
        }
    }

    // 회원가입 처리
    async signup(name, email, password) {
        try {
            // 실제 API 호출
            // const response = await fetch(`${this.apiBaseUrl}/auth/signup`, {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify({ name, email, password })
            // });

            // const data = await response.json();

            // 더미 응답
            const data = {
                success: true,
                user: {
                    id: 'user_' + Date.now(),
                    email: email,
                    name: name,
                    role: 'user',
                    createdAt: new Date().toISOString()
                },
                token: 'jwt_token_' + Date.now(),
                message: '회원가입 성공'
            };

            if (data.success) {
                // 인증 정보 저장
                localStorage.setItem('timelink_user', JSON.stringify(data.user));
                localStorage.setItem('timelink_token', data.token);

                // 회원가입 보너스 10,000 TL
                localStorage.setItem('timelink_tl_balance', '10000');
                this.addTransaction('회원가입 보너스', 10000, '신규 회원가입 보너스');

                return { success: true, user: data.user };
            } else {
                return { success: false, message: data.message || '회원가입 실패' };
            }
        } catch (error) {
            console.error('회원가입 오류:', error);
            return { success: false, message: '회원가입 중 오류가 발생했습니다.' };
        }
    }

    // 로그아웃
    logout() {
        // 인증 정보 제거
        localStorage.removeItem('timelink_user');
        localStorage.removeItem('timelink_token');
        
        // 잔액은 유지 (선택사항)
        // localStorage.removeItem('timelink_tl_balance');

        // 페이지 새로고침
        setTimeout(() => {
            window.location.reload();
        }, 500);

        return { success: true, message: '로그아웃 되었습니다.' };
    }

    // 현재 사용자 정보 조회
    getCurrentUser() {
        const userData = localStorage.getItem('timelink_user');
        return userData ? JSON.parse(userData) : null;
    }

    // 인증 토큰 조회
    getToken() {
        return localStorage.getItem('timelink_token');
    }

    // 인증 여부 확인
    isAuthenticated() {
        return !!this.getCurrentUser() && !!this.getToken();
    }

    // TL 잔액 조회
    getTLBalance() {
        const balance = localStorage.getItem('timelink_tl_balance');
        return balance ? parseInt(balance) : 0;
    }

    // TL 잔액 업데이트
    updateTLBalance(amount) {
        const currentBalance = this.getTLBalance();
        const newBalance = currentBalance + amount;
        localStorage.setItem('timelink_tl_balance', newBalance.toString());
        return newBalance;
    }

    // 거래 내역 추가
    addTransaction(type, amount, description = '') {
        const transactions = this.getTransactions();
        
        transactions.unshift({
            id: 'tx_' + Date.now(),
            type: type,
            amount: amount,
            description: description,
            date: new Date().toISOString(),
            timestamp: Date.now()
        });

        // 최근 50개만 저장
        if (transactions.length > 50) {
            transactions.length = 50;
        }

        localStorage.setItem('timelink_transactions', JSON.stringify(transactions));
    }

    // 거래 내역 조회
    getTransactions() {
        const transactions = localStorage.getItem('timelink_transactions');
        return transactions ? JSON.parse(transactions) : [];
    }

    // API 요청 헤더 생성
    getAuthHeaders() {
        const token = this.getToken();
        return {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
    }

    // 보호된 API 요청
    async protectedRequest(url, options = {}) {
        if (!this.isAuthenticated()) {
            throw new Error('인증이 필요합니다.');
        }

        const headers = {
            ...this.getAuthHeaders(),
            ...options.headers
        };

        const response = await fetch(`${this.apiBaseUrl}${url}`, {
            ...options,
            headers
        });

        if (response.status === 401) {
            // 토큰 만료 시 로그아웃
            this.logout();
            throw new Error('세션이 만료되었습니다. 다시 로그인해주세요.');
        }

        return response;
    }

    // 사용자 프로필 업데이트
    async updateProfile(profileData) {
        try {
            const response = await this.protectedRequest('/user/profile', {
                method: 'PUT',
                body: JSON.stringify(profileData)
            });

            const data = await response.json();

            if (data.success) {
                // 로컬스토리지 업데이트
                const currentUser = this.getCurrentUser();
                const updatedUser = { ...currentUser, ...data.user };
                localStorage.setItem('timelink_user', JSON.stringify(updatedUser));

                return { success: true, user: updatedUser };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            console.error('프로필 업데이트 오류:', error);
            return { success: false, message: error.message };
        }
    }

    // 비밀번호 변경
    async changePassword(currentPassword, newPassword) {
        try {
            const response = await this.protectedRequest('/user/change-password', {
                method: 'POST',
                body: JSON.stringify({ currentPassword, newPassword })
            });

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('비밀번호 변경 오류:', error);
            return { success: false, message: error.message };
        }
    }

    // 회원 탈퇴
    async deleteAccount() {
        try {
            const response = await this.protectedRequest('/user/delete', {
                method: 'DELETE'
            });

            const data = await response.json();

            if (data.success) {
                // 모든 데이터 제거
                localStorage.removeItem('timelink_user');
                localStorage.removeItem('timelink_token');
                localStorage.removeItem('timelink_tl_balance');
                localStorage.removeItem('timelink_transactions');

                return { success: true, message: '회원 탈퇴가 완료되었습니다.' };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            console.error('회원 탈퇴 오류:', error);
            return { success: false, message: error.message };
        }
    }

    // TL 구매
    async purchaseTL(amount, paymentMethod) {
        try {
            const response = await this.protectedRequest('/wallet/purchase', {
                method: 'POST',
                body: JSON.stringify({ amount, paymentMethod })
            });

            const data = await response.json();

            if (data.success) {
                // 잔액 업데이트
                const newBalance = this.updateTLBalance(amount);
                this.addTransaction('TL 구매', amount, `${paymentMethod}로 구매`);

                return { 
                    success: true, 
                    newBalance: newBalance,
                    transactionId: data.transactionId 
                };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            console.error('TL 구매 오류:', error);
            return { success: false, message: error.message };
        }
    }

    // TL 출금
    async withdrawTL(amount, bankInfo) {
        try {
            const currentBalance = this.getTLBalance();
            
            if (currentBalance < amount) {
                return { success: false, message: '잔액이 부족합니다.' };
            }

            const response = await this.protectedRequest('/wallet/withdraw', {
                method: 'POST',
                body: JSON.stringify({ amount, bankInfo })
            });

            const data = await response.json();

            if (data.success) {
                // 잔액 업데이트
                const newBalance = this.updateTLBalance(-amount);
                this.addTransaction('TL 출금', -amount, `${bankInfo.bankName}로 출금`);

                return { 
                    success: true, 
                    newBalance: newBalance,
                    withdrawalId: data.withdrawalId 
                };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            console.error('TL 출금 오류:', error);
            return { success: false, message: error.message };
        }
    }
}

// 글로벌 인스턴스 생성
window.timelinkAuth = new TimelinkAuth();
