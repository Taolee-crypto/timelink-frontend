/**
 * TL-Player: TL-Agent 통합 음악 플레이어
 * 
 * 역할:
 * - TL-Agent를 통한 재생 제어
 * - 실시간 UI 업데이트
 * - 사용자 인터랙션 처리
 */

class TLPlayer {
    constructor() {
        this.isPlaying = false;
        this.currentTrack = null;
        this.playlist = [];
        this.currentIndex = -1;
        this.audio = null;
        this.progressInterval = null;
        
        this.elements = {
            player: null,
            playPauseBtn: null,
            progressBar: null,
            progressFill: null,
            currentTime: null,
            totalTime: null,
            title: null,
            artist: null,
            cover: null
        };
    }

    /**
     * 플레이어 초기화
     * @param {Object} elementIds - DOM 요소 ID 객체
     */
    async initialize(elementIds) {
        console.log('🎵 TL-Player 초기화 중...');

        // DOM 요소 연결
        this.bindElements(elementIds);

        // TL-Agent 초기화 확인
        if (!window.TLAgent) {
            console.error('❌ TL-Agent가 로드되지 않았습니다.');
            return false;
        }

        await window.TLAgent.initialize();

        // 이벤트 리스너 등록
        this.setupEventListeners();
        this.setupAgentListeners();

        console.log('✅ TL-Player 초기화 완료');
        return true;
    }

    /**
     * DOM 요소 바인딩
     */
    bindElements(elementIds) {
        this.elements = {
            player: document.getElementById(elementIds.player || 'musicPlayer'),
            playPauseBtn: document.getElementById(elementIds.playPauseBtn || 'playPauseBtn'),
            progressBar: document.getElementById(elementIds.progressBar || 'progressBar'),
            progressFill: document.getElementById(elementIds.progressFill || 'progressFill'),
            currentTime: document.getElementById(elementIds.currentTime || 'currentTime'),
            totalTime: document.getElementById(elementIds.totalTime || 'totalTime'),
            title: document.getElementById(elementIds.title || 'playerTitle'),
            artist: document.getElementById(elementIds.artist || 'playerArtist'),
            cover: document.getElementById(elementIds.cover || 'playerCover')
        };
    }

    /**
     * 이벤트 리스너 설정
     */
    setupEventListeners() {
        // 재생/일시정지 버튼
        if (this.elements.playPauseBtn) {
            this.elements.playPauseBtn.addEventListener('click', () => {
                if (this.isPlaying) {
                    this.pause();
                } else {
                    this.resume();
                }
            });
        }

        // 진행바 클릭
        if (this.elements.progressBar) {
            this.elements.progressBar.addEventListener('click', (e) => {
                // 현재는 시뮬레이션이므로 비활성화
                console.log('진행바 클릭 - 실제 음원 재생 시 구현 예정');
            });
        }
    }

    /**
     * TL-Agent 이벤트 리스너 설정
     */
    setupAgentListeners() {
        // TL 잔액 업데이트
        window.addEventListener('tl-agent:balance_update', (e) => {
            this.onBalanceUpdate(e.detail);
        });

        // TL 잔액 소진
        window.addEventListener('tl-agent:balance_depleted', (e) => {
            this.onBalanceDepleted(e.detail);
        });

        // 수익 처리 완료
        window.addEventListener('tl-agent:revenue_processed', (e) => {
            this.onRevenueProcessed(e.detail);
        });
    }

    /**
     * 트랙 로드 및 재생
     * @param {Object} trackInfo - 트랙 정보
     */
    async loadAndPlay(trackInfo) {
        console.log('🎵 트랙 로드:', trackInfo.title);

        try {
            // TL-Agent를 통한 검증 및 재생 시작
            const result = await window.TLAgent.verifyAndStart(trackInfo);

            if (!result.success) {
                this.showError(result.message);
                return false;
            }

            // 현재 트랙 설정
            this.currentTrack = trackInfo;
            this.isPlaying = true;

            // UI 업데이트
            this.updateUI(trackInfo);
            this.showPlayer();
            this.updatePlayPauseButton(true);

            // 진행바 업데이트 시작
            this.startProgressUpdate(trackInfo);

            console.log('✅ 재생 시작:', trackInfo.title);
            return true;

        } catch (error) {
            console.error('❌ 재생 실패:', error);
            this.showError('재생 중 오류가 발생했습니다.');
            return false;
        }
    }

    /**
     * 재생 일시정지
     */
    pause() {
        if (!this.isPlaying) return;

        this.isPlaying = false;
        window.TLAgent.pause();
        this.updatePlayPauseButton(false);
        this.stopProgressUpdate();
        
        console.log('⏸️ 재생 일시정지');
    }

    /**
     * 재생 재개
     */
    resume() {
        if (this.isPlaying || !this.currentTrack) return;

        this.isPlaying = true;
        window.TLAgent.resume();
        this.updatePlayPauseButton(true);
        this.startProgressUpdate(this.currentTrack);
        
        console.log('▶️ 재생 재개');
    }

    /**
     * 재생 중지
     */
    stop() {
        this.isPlaying = false;
        this.currentTrack = null;
        
        window.TLAgent.stop();
        this.stopProgressUpdate();
        this.hidePlayer();
        
        console.log('⏹️ 재생 중지');
    }

    /**
     * UI 업데이트
     */
    updateUI(trackInfo) {
        if (this.elements.title) {
            this.elements.title.textContent = trackInfo.title || '알 수 없는 제목';
        }
        
        if (this.elements.artist) {
            this.elements.artist.textContent = trackInfo.artist || '알 수 없는 아티스트';
        }

        if (this.elements.totalTime) {
            this.elements.totalTime.textContent = this.formatTime(trackInfo.duration || 0);
        }
    }

    /**
     * 재생/일시정지 버튼 업데이트
     */
    updatePlayPauseButton(isPlaying) {
        if (!this.elements.playPauseBtn) return;

        const icon = this.elements.playPauseBtn.querySelector('i');
        if (icon) {
            icon.className = isPlaying ? 'fas fa-pause' : 'fas fa-play';
        }
    }

    /**
     * 진행바 업데이트 시작
     */
    startProgressUpdate(trackInfo) {
        this.stopProgressUpdate();

        const duration = trackInfo.duration || 180; // 기본 3분
        let elapsed = 0;

        this.progressInterval = setInterval(() => {
            if (!this.isPlaying) return;

            elapsed += 1;
            const progress = (elapsed / duration) * 100;

            // 진행바 업데이트
            if (this.elements.progressFill) {
                this.elements.progressFill.style.width = Math.min(progress, 100) + '%';
            }

            // 현재 시간 업데이트
            if (this.elements.currentTime) {
                this.elements.currentTime.textContent = this.formatTime(elapsed);
            }

            // 재생 완료
            if (elapsed >= duration) {
                this.onTrackEnd();
            }
        }, 1000);
    }

    /**
     * 진행바 업데이트 중지
     */
    stopProgressUpdate() {
        if (this.progressInterval) {
            clearInterval(this.progressInterval);
            this.progressInterval = null;
        }
    }

    /**
     * 플레이어 표시
     */
    showPlayer() {
        if (this.elements.player) {
            this.elements.player.classList.add('active');
        }
    }

    /**
     * 플레이어 숨김
     */
    hidePlayer() {
        if (this.elements.player) {
            this.elements.player.classList.remove('active');
        }
    }

    /**
     * 시간 포맷팅 (초 → MM:SS)
     */
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    /**
     * TL 잔액 업데이트 이벤트 처리
     */
    onBalanceUpdate(data) {
        console.log('💰 잔액 업데이트:', data.currentBalance, 'TL');
        
        // UI에 잔액 표시 (다른 컴포넌트에서 처리)
        const event = new CustomEvent('player:balance_update', { detail: data });
        window.dispatchEvent(event);
    }

    /**
     * TL 잔액 소진 이벤트 처리
     */
    onBalanceDepleted(data) {
        console.warn('⚠️ TL 잔액 소진:', data.message);
        
        this.stop();
        this.showError(data.message);
    }

    /**
     * 수익 처리 완료 이벤트 처리
     */
    onRevenueProcessed(data) {
        console.log('💰 수익 분배 완료:', data.revenue);
    }

    /**
     * 트랙 종료 처리
     */
    onTrackEnd() {
        console.log('✅ 트랙 재생 완료');
        
        this.stop();
        
        // 다음 트랙 재생 (플레이리스트 기능)
        if (this.playlist.length > 0 && this.currentIndex < this.playlist.length - 1) {
            this.playNext();
        }
    }

    /**
     * 다음 트랙 재생
     */
    async playNext() {
        if (this.currentIndex < this.playlist.length - 1) {
            this.currentIndex++;
            await this.loadAndPlay(this.playlist[this.currentIndex]);
        }
    }

    /**
     * 이전 트랙 재생
     */
    async playPrevious() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            await this.loadAndPlay(this.playlist[this.currentIndex]);
        }
    }

    /**
     * 플레이리스트 설정
     */
    setPlaylist(tracks) {
        this.playlist = tracks;
        this.currentIndex = -1;
        console.log(`📝 플레이리스트 설정: ${tracks.length}곡`);
    }

    /**
     * 에러 메시지 표시
     */
    showError(message) {
        // 모달 또는 토스트로 에러 표시
        alert(message);
    }

    /**
     * 플레이어 상태 가져오기
     */
    getStatus() {
        return {
            isPlaying: this.isPlaying,
            currentTrack: this.currentTrack,
            playlistLength: this.playlist.length,
            currentIndex: this.currentIndex
        };
    }

    /**
     * 정리
     */
    cleanup() {
        this.stop();
        this.stopProgressUpdate();
        console.log('🧹 TL-Player 정리 완료');
    }
}

// 전역 인스턴스 생성
window.TLPlayer = new TLPlayer();

console.log('✅ TL-Player 모듈 로드 완료');
