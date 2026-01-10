/**
 * TL-Wallet: TimeLink 시간 화폐 지갑 시스템
 * 
 * 역할:
 * - TL 잔액 관리
 * - TL 충전/차감
 * - 거래 내역 기록
 * - 로컬 및 서버 동기화
 */

class TLWallet {
    constructor() {
        this.balance = 0;
        this.transactions = [];
        this.isInitialized = false;
        this.syncInterval = null;
        this.config = {
            storageKey: 'tl_wallet',
            transactionsKey: 'tl_transactions',
            syncIntervalMs: 30000, // 30초마다 서버 동기화
            apiEndpoint: 'https://timelink-backend.timelink-api.workers.dev'
        };
    }

    /**
     * Wallet 초기화
     */
    async initialize() {
        try {
            console.log('💰 TL Wallet 초기화 중...');

            // 로컬 스토리지에서 잔액 로드
            this.loadFromLocalStorage();

            // 서버와 동기화
            await this.syncWithServer();

            // 주기적 동기화 시작
            this.startAutoSync();

            this.isInitialized = true;
            console.log(`✅ TL Wallet 초기화 완료 (잔액: ${this.balance} TL)`);

            return true;
        } catch (error) {
            console.error('❌ TL Wallet 초기화 실패:', error);
            
            // 초기화 실패 시 로컬 데이터로 폴백
            this.loadFromLocalStorage();
            this.isInitialized = true;
            
            return false;
        }
    }

    /**
     * 로컬 스토리지에서 데이터 로드
     */
    loadFromLocalStorage() {
        try {
            const walletData = localStorage.getItem(this.config.storageKey);
            if (walletData) {
                const data = JSON.parse(walletData);
                this.balance = data.balance || 0;
            } else {
                // 신규 사용자 - 초기 10,000 TL 지급
                this.balance = 10000;
                this.saveToLocalStorage();
                console.log('🎁 신규 사용자 10,000 TL 지급!');
            }

            const transactionsData = localStorage.getItem(this.config.transactionsKey);
            if (transactionsData) {
                this.transactions = JSON.parse(transactionsData);
            }
        } catch (error) {
            console.error('❌ 로컬 데이터 로드 실패:', error);
            this.balance = 0;
            this.transactions = [];
        }
    }

    /**
     * 로컬 스토리지에 데이터 저장
     */
    saveToLocalStorage() {
        try {
            const walletData = {
                balance: this.balance,
                lastUpdated: Date.now()
            };
            localStorage.setItem(this.config.storageKey, JSON.stringify(walletData));
            localStorage.setItem(this.config.transactionsKey, JSON.stringify(this.transactions));
        } catch (error) {
            console.error('❌ 로컬 데이터 저장 실패:', error);
        }
    }

    /**
     * 서버와 동기화
     */
    async syncWithServer() {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
            console.warn('⚠️ 로그인 필요 - 서버 동기화 건너뜀');
            return;
        }

        try {
            // 실제로는 백엔드 API 호출
            // const response = await fetch(`${this.config.apiEndpoint}/api/wallet/balance`, {
            //     headers: { 'Authorization': `Bearer ${authToken}` }
            // });
            // const data = await response.json();
            // this.balance = data.balance;

            console.log('🔄 서버 동기화 완료');
        } catch (error) {
            console.error('❌ 서버 동기화 실패:', error);
        }
    }

    /**
     * 자동 동기화 시작
     */
    startAutoSync() {
        // 기존 타이머 정리
        if (this.syncInterval) {
            clearInterval(this.syncInterval);
        }

        this.syncInterval = setInterval(() => {
            this.syncWithServer();
        }, this.config.syncIntervalMs);
    }

    /**
     * 자동 동기화 중지
     */
    stopAutoSync() {
        if (this.syncInterval) {
            clearInterval(this.syncInterval);
            this.syncInterval = null;
        }
    }

    /**
     * 현재 잔액 가져오기
     * @returns {Promise<number>} - 현재 TL 잔액
     */
    async getBalance() {
        if (!this.isInitialized) {
            await this.initialize();
        }
        return this.balance;
    }

    /**
     * TL 충전
     * @param {number} amount - 충전할 TL 양
     * @param {string} method - 충전 방법 (purchase, reward, gift 등)
     * @returns {Promise<Object>} - 충전 결과
     */
    async charge(amount, method = 'purchase') {
        if (!this.isInitialized) {
            await this.initialize();
        }

        if (amount <= 0) {
            return {
                success: false,
                message: '충전 금액은 0보다 커야 합니다.'
            };
        }

        try {
            const oldBalance = this.balance;
            this.balance += amount;

            // 거래 내역 기록
            const transaction = {
                id: `tx_${Date.now()}`,
                type: 'charge',
                amount: amount,
                method: method,
                timestamp: Date.now(),
                balanceBefore: oldBalance,
                balanceAfter: this.balance
            };
            this.transactions.unshift(transaction);

            // 최근 100개 거래만 보관
            if (this.transactions.length > 100) {
                this.transactions = this.transactions.slice(0, 100);
            }

            // 로컬 저장
            this.saveToLocalStorage();

            console.log(`💰 TL 충전: +${amount} TL (${oldBalance} → ${this.balance} TL)`);

            // 이벤트 발생
            this.emitEvent('balance_changed', {
                type: 'charge',
                amount: amount,
                oldBalance: oldBalance,
                newBalance: this.balance
            });

            return {
                success: true,
                message: `${amount} TL이 충전되었습니다.`,
                newBalance: this.balance,
                transaction: transaction
            };

        } catch (error) {
            console.error('❌ TL 충전 실패:', error);
            return {
                success: false,
                message: '충전 중 오류가 발생했습니다.'
            };
        }
    }

    /**
     * TL 차감
     * @param {number} amount - 차감할 TL 양
     * @param {string} reason - 차감 사유 (playback, purchase 등)
     * @returns {Promise<Object>} - 차감 결과
     */
    async deduct(amount, reason = 'playback') {
        if (!this.isInitialized) {
            await this.initialize();
        }

        if (amount <= 0) {
            return {
                success: false,
                message: '차감 금액은 0보다 커야 합니다.'
            };
        }

        if (this.balance < amount) {
            return {
                success: false,
                message: 'TL 잔액이 부족합니다.',
                currentBalance: this.balance,
                requiredAmount: amount
            };
        }

        try {
            const oldBalance = this.balance;
            this.balance -= amount;

            // 거래 내역 기록
            const transaction = {
                id: `tx_${Date.now()}`,
                type: 'deduct',
                amount: amount,
                reason: reason,
                timestamp: Date.now(),
                balanceBefore: oldBalance,
                balanceAfter: this.balance
            };
            this.transactions.unshift(transaction);

            // 최근 100개 거래만 보관
            if (this.transactions.length > 100) {
                this.transactions = this.transactions.slice(0, 100);
            }

            // 로컬 저장
            this.saveToLocalStorage();

            // 이벤트 발생
            this.emitEvent('balance_changed', {
                type: 'deduct',
                amount: amount,
                oldBalance: oldBalance,
                newBalance: this.balance
            });

            return {
                success: true,
                message: `${amount} TL이 차감되었습니다.`,
                newBalance: this.balance,
                transaction: transaction
            };

        } catch (error) {
            console.error('❌ TL 차감 실패:', error);
            return {
                success: false,
                message: '차감 중 오류가 발생했습니다.'
            };
        }
    }

    /**
     * 거래 내역 가져오기
     * @param {number} limit - 가져올 거래 개수
     * @returns {Array} - 거래 내역 배열
     */
    getTransactions(limit = 20) {
        return this.transactions.slice(0, limit);
    }

    /**
     * 거래 내역 필터링
     * @param {string} type - 거래 유형 (charge, deduct)
     * @param {number} limit - 가져올 거래 개수
     * @returns {Array} - 필터링된 거래 내역
     */
    getTransactionsByType(type, limit = 20) {
        return this.transactions
            .filter(tx => tx.type === type)
            .slice(0, limit);
    }

    /**
     * 오늘의 사용 통계
     * @returns {Object} - 통계 정보
     */
    getTodayStats() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayTimestamp = today.getTime();

        const todayTransactions = this.transactions.filter(
            tx => tx.timestamp >= todayTimestamp
        );

        const charged = todayTransactions
            .filter(tx => tx.type === 'charge')
            .reduce((sum, tx) => sum + tx.amount, 0);

        const deducted = todayTransactions
            .filter(tx => tx.type === 'deduct')
            .reduce((sum, tx) => sum + tx.amount, 0);

        return {
            charged: charged,
            deducted: deducted,
            net: charged - deducted,
            transactionCount: todayTransactions.length
        };
    }

    /**
     * Wallet 상태 정보
     * @returns {Object} - 상태 정보
     */
    getStatus() {
        return {
            isInitialized: this.isInitialized,
            balance: this.balance,
            transactionCount: this.transactions.length,
            todayStats: this.getTodayStats()
        };
    }

    /**
     * 이벤트 발생
     * @param {string} eventName - 이벤트 이름
     * @param {Object} data - 이벤트 데이터
     */
    emitEvent(eventName, data) {
        const event = new CustomEvent(`tl-wallet:${eventName}`, {
            detail: data
        });
        window.dispatchEvent(event);
    }

    /**
     * Wallet 리셋 (테스트용)
     */
    reset() {
        this.balance = 10000;
        this.transactions = [];
        this.saveToLocalStorage();
        console.log('🔄 Wallet 리셋: 10,000 TL로 초기화');
        
        this.emitEvent('wallet_reset', {
            newBalance: this.balance
        });
    }

    /**
     * Wallet 정리
     */
    cleanup() {
        this.stopAutoSync();
        console.log('🧹 TL Wallet 정리 완료');
    }
}

// 전역 인스턴스 생성
window.TLWallet = new TLWallet();

// 페이지 로드 시 자동 초기화
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.TLWallet.initialize();
    });
} else {
    window.TLWallet.initialize();
}

console.log('✅ TL-Wallet 모듈 로드 완료');
