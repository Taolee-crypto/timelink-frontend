/**
 * TL-Agent: TimeLink 시간 검증 및 차감 에이전트
 * 
 * 역할:
 * - MP3/MP4 재생 전 TL 잔액 검증
 * - 실시간 TL 차감
 * - 수익 분배 처리
 * - 재생 제어
 */

class TLAgent {
    constructor() {
        this.isInitialized = false;
        this.currentSession = null;
        this.deductionTimer = null;
        this.config = {
            deductionRate: 1, // 초당 차감 TL (기본값)
            checkInterval: 1000, // 1초마다 차감
            minBalance: 0, // 최소 잔액
            apiEndpoint: 'https://timelink-backend.timelink-api.workers.dev'
        };
    }

    /**
     * TL-Agent 초기화
     */
    async initialize() {
        try {
            console.log('🤖 TL-Agent 초기화 중...');
            
            // TL Wallet 연결
            if (!window.TLWallet) {
                throw new Error('TL Wallet이 로드되지 않았습니다.');
            }

            this.isInitialized = true;
            console.log('✅ TL-Agent 초기화 완료');
            
            return true;
        } catch (error) {
            console.error('❌ TL-Agent 초기화 실패:', error);
            return false;
        }
    }

    /**
     * 파일 재생 전 검증
     * @param {Object} fileInfo - 파일 정보 (id, title, artist, tlCost, duration)
     * @returns {Promise<Object>} - 검증 결과
     */
    async verifyAndStart(fileInfo) {
        if (!this.isInitialized) {
            await this.initialize();
        }

        try {
            console.log('🔍 TL 검증 시작:', fileInfo.title);

            // 1. 사용자 인증 확인
            const authToken = localStorage.getItem('authToken');
            if (!authToken) {
                return {
                    success: false,
                    error: 'LOGIN_REQUIRED',
                    message: '로그인이 필요합니다.'
                };
            }

            // 2. TL 잔액 확인
            const balance = await window.TLWallet.getBalance();
            const requiredTL = this.calculateRequiredTL(fileInfo);

            console.log(`💰 현재 잔액: ${balance} TL`);
            console.log(`💵 필요 TL: ${requiredTL} TL`);

            if (balance < requiredTL) {
                return {
                    success: false,
                    error: 'INSUFFICIENT_BALANCE',
                    message: `TL이 부족합니다. (필요: ${requiredTL} TL, 보유: ${balance} TL)`,
                    currentBalance: balance,
                    requiredTL: requiredTL
                };
            }

            // 3. 파일 메타데이터 검증
            const metadata = await this.verifyFileMetadata(fileInfo);
            if (!metadata.isValid) {
                return {
                    success: false,
                    error: 'INVALID_FILE',
                    message: '파일 메타데이터가 유효하지 않습니다.'
                };
            }

            // 4. 재생 세션 생성
            this.currentSession = {
                fileId: fileInfo.id,
                fileInfo: fileInfo,
                metadata: metadata,
                startTime: Date.now(),
                startBalance: balance,
                deductedTL: 0,
                isActive: true
            };

            // 5. 실시간 차감 시작
            this.startDeduction(fileInfo);

            console.log('✅ TL 검증 완료 - 재생 시작');

            return {
                success: true,
                message: '재생이 시작되었습니다.',
                session: this.currentSession
            };

        } catch (error) {
            console.error('❌ TL 검증 실패:', error);
            return {
                success: false,
                error: 'VERIFICATION_ERROR',
                message: error.message
            };
        }
    }

    /**
     * 필요한 TL 계산
     * @param {Object} fileInfo - 파일 정보
     * @returns {number} - 필요한 TL
     */
    calculateRequiredTL(fileInfo) {
        // duration은 초 단위
        const durationSeconds = fileInfo.duration || 0;
        const tlPerSecond = fileInfo.tlCostPerSecond || this.config.deductionRate;
        
        // 최소 10초 분량의 TL은 필요
        const minTL = 10 * tlPerSecond;
        
        return Math.max(minTL, tlPerSecond * 10); // 최소 10초는 재생 가능하도록
    }

    /**
     * 파일 메타데이터 검증
     * @param {Object} fileInfo - 파일 정보
     * @returns {Promise<Object>} - 메타데이터
     */
    async verifyFileMetadata(fileInfo) {
        // 실제로는 백엔드 API를 호출하여 파일 메타데이터를 검증
        // 여기서는 시뮬레이션
        
        return {
            isValid: true,
            fileId: fileInfo.id,
            tlCostPerSecond: fileInfo.tlCostPerSecond || 1,
            copyright: {
                owner: fileInfo.copyrightOwner || 'Unknown',
                uploader: fileInfo.uploader || 'Unknown',
                isDirectUpload: fileInfo.isDirectUpload || false
            },
            revenue: {
                copyrightOwner: fileInfo.isDirectUpload ? 70 : 50,
                uploader: fileInfo.isDirectUpload ? 0 : 20,
                platform: 30
            }
        };
    }

    /**
     * 실시간 TL 차감 시작
     * @param {Object} fileInfo - 파일 정보
     */
    startDeduction(fileInfo) {
        // 기존 타이머 정리
        if (this.deductionTimer) {
            clearInterval(this.deductionTimer);
        }

        const tlPerSecond = fileInfo.tlCostPerSecond || this.config.deductionRate;
        const intervalMs = this.config.checkInterval;

        console.log(`⏱️ TL 차감 시작 (${tlPerSecond} TL/초)`);

        this.deductionTimer = setInterval(async () => {
            if (!this.currentSession || !this.currentSession.isActive) {
                this.stopDeduction();
                return;
            }

            try {
                // 1초 치 TL 차감
                const deducted = await window.TLWallet.deduct(tlPerSecond);
                
                if (!deducted.success) {
                    console.warn('⚠️ TL 차감 실패:', deducted.message);
                    this.stopDeduction();
                    
                    // 재생 중단 이벤트 발생
                    this.emitEvent('balance_depleted', {
                        message: 'TL 잔액이 부족하여 재생이 중단되었습니다.',
                        deductedTL: this.currentSession.deductedTL
                    });
                    
                    return;
                }

                // 세션 정보 업데이트
                this.currentSession.deductedTL += tlPerSecond;
                
                // 잔액 업데이트 이벤트 발생
                this.emitEvent('balance_update', {
                    currentBalance: deducted.newBalance,
                    deductedTL: this.currentSession.deductedTL
                });

                console.log(`💸 TL 차감: ${tlPerSecond} TL (남은 잔액: ${deducted.newBalance} TL)`);

            } catch (error) {
                console.error('❌ TL 차감 중 오류:', error);
                this.stopDeduction();
            }
        }, intervalMs);
    }

    /**
     * TL 차감 중지
     */
    stopDeduction() {
        if (this.deductionTimer) {
            clearInterval(this.deductionTimer);
            this.deductionTimer = null;
            console.log('⏹️ TL 차감 중지');
        }

        if (this.currentSession) {
            this.currentSession.isActive = false;
            
            // 수익 분배 처리
            this.processRevenue();
        }
    }

    /**
     * 재생 일시정지
     */
    pause() {
        if (this.currentSession) {
            this.currentSession.isActive = false;
        }
        
        if (this.deductionTimer) {
            clearInterval(this.deductionTimer);
            this.deductionTimer = null;
        }
        
        console.log('⏸️ 재생 일시정지 - TL 차감 중지');
    }

    /**
     * 재생 재개
     */
    resume() {
        if (this.currentSession && !this.currentSession.isActive) {
            this.currentSession.isActive = true;
            this.startDeduction(this.currentSession.fileInfo);
            console.log('▶️ 재생 재개 - TL 차감 재시작');
        }
    }

    /**
     * 재생 종료
     */
    stop() {
        this.stopDeduction();
        this.currentSession = null;
        console.log('⏹️ 재생 종료');
    }

    /**
     * 수익 분배 처리
     */
    async processRevenue() {
        if (!this.currentSession || this.currentSession.deductedTL === 0) {
            return;
        }

        try {
            const metadata = this.currentSession.metadata;
            const totalTL = this.currentSession.deductedTL;

            const revenue = {
                copyrightOwner: Math.floor(totalTL * metadata.revenue.copyrightOwner / 100),
                uploader: Math.floor(totalTL * metadata.revenue.uploader / 100),
                platform: Math.floor(totalTL * metadata.revenue.platform / 100)
            };

            console.log('💰 수익 분배:', revenue);

            // 실제로는 백엔드 API 호출
            // await this.sendRevenueToAPI(revenue);

            this.emitEvent('revenue_processed', {
                totalTL: totalTL,
                revenue: revenue,
                fileInfo: this.currentSession.fileInfo
            });

        } catch (error) {
            console.error('❌ 수익 분배 처리 실패:', error);
        }
    }

    /**
     * 이벤트 발생
     * @param {string} eventName - 이벤트 이름
     * @param {Object} data - 이벤트 데이터
     */
    emitEvent(eventName, data) {
        const event = new CustomEvent(`tl-agent:${eventName}`, {
            detail: data
        });
        window.dispatchEvent(event);
    }

    /**
     * 현재 세션 정보 가져오기
     */
    getCurrentSession() {
        return this.currentSession;
    }

    /**
     * Agent 상태 확인
     */
    getStatus() {
        return {
            isInitialized: this.isInitialized,
            hasActiveSession: this.currentSession !== null && this.currentSession.isActive,
            currentSession: this.currentSession
        };
    }
}

// 전역 인스턴스 생성
window.TLAgent = new TLAgent();

console.log('✅ TL-Agent 모듈 로드 완료');
