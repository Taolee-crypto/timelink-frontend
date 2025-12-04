import { formatTime, showMessage } from './utils.js';

class Player {
  constructor() {
    this.audio = null;
    this.currentFile = null;
    this.isPlaying = false;
    this.playInterval = null;
    this.currentPlaybackTime = 0;
    this.currentPlaybackCost = 0;
    this.userInteracted = false;
    
    this.initUserInteraction();
  }
  
  initUserInteraction() {
    // 사용자 인터랙션 감지 (브라우저 자동 재생 정책 대응)
    const enableAudio = () => {
      this.userInteracted = true;
      console.log('User interacted, audio enabled');
      
      // 이벤트 리스너 제거
      document.removeEventListener('click', enableAudio);
      document.removeEventListener('touchstart', enableAudio);
      document.removeEventListener('keydown', enableAudio);
    };
    
    document.addEventListener('click', enableAudio);
    document.addEventListener('touchstart', enableAudio);
    document.addEventListener('keydown', enableAudio);
  }
  
  async play(file) {
    if (!this.userInteracted) {
      this.showInteractionPrompt(file);
      return;
    }
    
    return this.startPlayback(file);
  }
  
  async startPlayback(file) {
    try {
      this.currentFile = file;
      this.currentPlaybackTime = 0;
      this.currentPlaybackCost = 0;
      
      // 기존 로직: 시뮬레이션된 재생
      if (this.playInterval) clearInterval(this.playInterval);
      
      const maxTime = file.playTime - (file.usedTime || 0);
      if (maxTime <= 0) {
        showMessage('사용 가능한 시간이 모두 소진되었습니다.', 'error');
        return;
      }
      
      let playbackSeconds = 0;
      
      this.playInterval = setInterval(() => {
        playbackSeconds++;
        this.currentPlaybackTime++;
        
        // 파일 사용 시간 업데이트
        file.usedTime = (file.usedTime || 0) + 1;
        
        // 비용 계산
        const costThisSecond = file.pricePerSecond;
        this.currentPlaybackCost += costThisSecond;
        
        // 수익 업데이트
        if (!file.sellerId) {
          file.earnings.total = (file.earnings.total || 0) + costThisSecond;
          if (file.isCertified) {
            file.earnings.copyright = (file.earnings.copyright || 0) + costThisSecond;
          }
        }
        
        // 실제 오디오 재생 (샘플 오디오)
        if (!this.audio && playbackSeconds === 1) {
          this.playRealAudio(file);
        }
        
        // UI 업데이트 콜백
        if (this.onTimeUpdate) {
          this.onTimeUpdate(file, playbackSeconds, maxTime, this.currentPlaybackCost);
        }
        
        // 최대 재생 시간 도달 시 정지
        if (playbackSeconds >= maxTime) {
          this.stop();
          showMessage('사용 가능한 시간이 모두 소진되었습니다.', 'info');
        }
        
      }, 1000);
      
      this.isPlaying = true;
      return true;
      
    } catch (error) {
      console.error('Playback error:', error);
      showMessage('재생 중 오류가 발생했습니다.', 'error');
      return false;
    }
  }
  
  playRealAudio(file) {
    // 실제 오디오 재생 (브라우저 정책 준수)
    const audioUrl = file.audioUrl || this.getSampleAudioUrl();
    
    this.audio = new Audio(audioUrl);
    this.audio.volume = 0.5;
    
    // 사용자 인터랙션 후 재생 시도
    const playAudio = () => {
      if (this.userInteracted) {
        this.audio.play().catch(e => {
          console.log('Audio play failed, will retry on interaction:', e);
        });
      }
    };
    
    // 지금 재생 시도
    playAudio();
    
    // 사용자 인터랙션 시 재시도
    document.addEventListener('click', playAudio, { once: true });
  }
  
  getSampleAudioUrl() {
    const samples = [
      'https://assets.mixkit.co/music/preview/mixkit-tech-house-vibes-130.mp3',
      'https://assets.mixkit.co/music/preview/mixkit-driving-ambition-32.mp3',
      'https://assets.mixkit.co/music/preview/mixkit-game-show-suspense-waiting-667.mp3'
    ];
    return samples[Math.floor(Math.random() * samples.length)];
  }
  
  pause() {
    if (this.playInterval) {
      clearInterval(this.playInterval);
      this.playInterval = null;
    }
    
    if (this.audio) {
      this.audio.pause();
    }
    
    this.isPlaying = false;
  }
  
  stop() {
    this.pause();
    this.currentPlaybackTime = 0;
    this.currentPlaybackCost = 0;
    
    if (this.audio) {
      this.audio.currentTime = 0;
    }
  }
  
  showInteractionPrompt(file) {
    // 인터랙션 요청 모달 표시
    const modalHtml = `
      <div id="interactionPrompt" style="
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
      ">
        <div style="
          background: white;
          padding: 30px;
          border-radius: 12px;
          max-width: 400px;
          text-align: center;
        ">
          <div style="font-size: 3rem; margin-bottom: 20px;">🎵</div>
          <h3 style="margin-bottom: 15px;">재생 준비</h3>
          <p style="margin-bottom: 20px; color: #666;">
            브라우저 보안 정책으로 인해<br>
            오디오 재생 전에 사용자 확인이 필요합니다.
          </p>
          <p style="margin-bottom: 20px; font-size: 0.9rem; color: #888;">
            <strong>${file.title}</strong><br>
            ${formatTime(file.playTime - (file.usedTime || 0))} 남음
          </p>
          <div style="display: flex; gap: 10px;">
            <button onclick="window.player.userInteracted = true; 
                           document.getElementById('interactionPrompt').remove();
                           window.player.startPlayback(window.player.currentFile)" 
              style="
                flex: 1;
                background: #4f46e5;
                color: white;
                border: none;
                padding: 12px;
                border-radius: 6px;
                font-size: 1rem;
                cursor: pointer;
              ">
              확인 및 재생
            </button>
            <button onclick="document.getElementById('interactionPrompt').remove()"
              style="
                flex: 1;
                background: #e5e7eb;
                color: #666;
                border: none;
                padding: 12px;
                border-radius: 6px;
                font-size: 1rem;
                cursor: pointer;
              ">
              취소
            </button>
          </div>
        </div>
      </div>
    `;
    
    const modal = document.createElement('div');
    modal.innerHTML = modalHtml;
    document.body.appendChild(modal);
  }
}

// 글로벌 플레이어 인스턴스
window.player = new Player();
export default window.player;
