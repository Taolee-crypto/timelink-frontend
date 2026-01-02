// studio.js - 간소화된 플레이어 버전

console.log('studio.js 로드됨 - 간소화 버전');

// 전역 변수
let currentTL3 = null;
let isPlaying = false;
let tlConsumptionInterval = null;
let tlRemaining = 0;
let tlUsed = 0;
let playbackTimer = null;
let currentPlaybackTime = 0;
let totalPlaybackTime = 180; // 샘플 재생 시간 (3분)

// DOM이 로드된 후 실행
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded - studio.js 간소화 버전');
    
    // 모든 이벤트 리스너 설정
    setupAllEventListeners();
    
    // 플레이어 초기화
    initializePlayer();
    
    // 샘플 데이터 로드
    setTimeout(loadSampleData, 1000);
});

// 모든 이벤트 리스너 설정
function setupAllEventListeners() {
    console.log('이벤트 리스너 설정 시작');
    
    // 1. 파일 선택 버튼
    const selectFileBtn = document.getElementById('selectFileBtn');
    const fileInput = document.getElementById('musicFileInput');
    const uploadArea = document.getElementById('uploadArea');
    
    if (selectFileBtn && fileInput) {
        selectFileBtn.addEventListener('click', function(e) {
            e.preventDefault();
            fileInput.click();
            console.log('파일 선택 버튼 클릭');
        });
        
        // 파일 변경 이벤트
        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                console.log('파일 선택됨:', file.name);
                updateFileInfo(file);
            }
        });
    }
    
    if (uploadArea) {
        uploadArea.addEventListener('click', function() {
            fileInput.click();
        });
    }
    
    // 2. TL 슬라이더
    const timeSlider = document.getElementById('timeSlider');
    if (timeSlider) {
        timeSlider.addEventListener('input', updateTLDisplay);
        updateTLDisplay(); // 초기 표시
    }
    
    // 3. TL3 생성 버튼
    const createTL3Btn = document.getElementById('createTL3Btn');
    if (createTL3Btn) {
        createTL3Btn.addEventListener('click', function() {
            console.log('TL3 생성 버튼 클릭');
            createTL3File();
        });
    }
    
    // 4. 플레이어 컨트롤
    const playBtn = document.getElementById('playBtn');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const progressBar = document.getElementById('progressBar');
    
    if (playBtn) {
        playBtn.addEventListener('click', function() {
            console.log('재생 버튼 클릭');
            togglePlayback();
        });
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            console.log('이전 버튼 클릭');
            showMessage('이전 곡 기능은 준비 중입니다');
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            console.log('다음 버튼 클릭');
            showMessage('다음 곡 기능은 준비 중입니다');
        });
    }
    
    if (progressBar) {
        progressBar.addEventListener('click', function(e) {
            console.log('프로그레스 바 클릭');
            seekPlayback(e);
        });
    }
    
    console.log('이벤트 리스너 설정 완료');
}

// 플레이어 초기화
function initializePlayer() {
    console.log('플레이어 초기화');
    
    // 플레이어 버튼 비활성화
    const playBtn = document.getElementById('playBtn');
    if (playBtn) {
        playBtn.disabled = true;
    }
    
    // TL 소비율 표시
    const consumptionRate = document.getElementById('consumptionRate');
    if (consumptionRate) {
        consumptionRate.textContent = '-1 TL/초';
    }
    
    // 재생 시간 표시 초기화
    updateTimeDisplay();
}

// 파일 정보 업데이트
function updateFileInfo(file) {
    const fileInfo = document.getElementById('fileInfo');
    if (!fileInfo) return;
    
    fileInfo.innerHTML = `
        <div style="color: var(--success);">
            <i class="fas fa-check-circle"></i> ${file.name}
        </div>
        <div style="font-size: 0.85rem; margin-top: 0.25rem; color: var(--gray);">
            크기: ${formatFileSize(file.size)}
        </div>
    `;
}

// TL 디스플레이 업데이트
function updateTLDisplay() {
    const timeSlider = document.getElementById('timeSlider');
    const tlAmount = document.getElementById('tlAmount');
    const totalTimeDisplay = document.getElementById('totalTimeDisplay');
    
    if (!timeSlider || !tlAmount || !totalTimeDisplay) return;
    
    const tlValue = parseInt(timeSlider.value);
    
    // TL 금액 표시
    tlAmount.textContent = tlValue.toLocaleString() + ' TL';
    
    // 시간 변환
    const hours = Math.floor(tlValue / 3600);
    const minutes = Math.floor((tlValue % 3600) / 60);
    const seconds = tlValue % 60;
    
    let timeString = '';
    if (hours > 0) timeString += `${hours}시간 `;
    if (minutes > 0 || hours > 0) timeString += `${minutes}분 `;
    timeString += `${seconds}초`;
    
    totalTimeDisplay.textContent = timeString;
}

// TL3 파일 생성
function createTL3File() {
    console.log('TL3 파일 생성 시작');
    
    // 입력값 가져오기
    const musicTitle = document.getElementById('musicTitle').value.trim();
    const artistName = document.getElementById('artistName').value.trim();
    const musicGenre = document.getElementById('musicGenre').value.trim();
    const fileInput = document.getElementById('musicFileInput');
    
    // 입력값 검증
    if (!musicTitle) {
        showMessage('음원 제목을 입력해주세요');
        document.getElementById('musicTitle').focus();
        return;
    }
    
    if (!artistName) {
        showMessage('아티스트명을 입력해주세요');
        document.getElementById('artistName').focus();
        return;
    }
    
    if (!fileInput.files || fileInput.files.length === 0) {
        showMessage('음원 파일을 선택해주세요');
        return;
    }
    
    // TL 값 가져오기
    const tlValue = parseInt(document.getElementById('timeSlider').value);
    
    // TL3 객체 생성
    const tl3File = {
        id: 'tl3_' + Date.now(),
        title: musicTitle,
        artist: artistName,
        genre: musicGenre || '미지정',
        tlAmount: tlValue,
        tlRemaining: tlValue,
        fileName: fileInput.files[0].name,
        createdAt: new Date().toLocaleString(),
        isActive: true
    };
    
    console.log('TL3 파일 생성됨:', tl3File);
    
    // TL3 목록에 추가
    addTL3ToList(tl3File);
    
    // 플레이어에 전송
    sendToPlayer(tl3File);
    
    // 성공 메시지
    showMessage(`"${musicTitle}" TL3 파일이 생성되었습니다!\n남은 TL: ${tlValue.toLocaleString()} TL`);
}

// TL3 목록에 추가
function addTL3ToList(tl3File) {
    const tl3List = document.getElementById('tl3List');
    const emptyMessage = document.getElementById('emptyLibraryMessage');
    const libraryCount = document.getElementById('libraryCount');
    
    if (!tl3List) return;
    
    // 빈 메시지 숨기기
    if (emptyMessage) {
        emptyMessage.style.display = 'none';
    }
    
    // TL3 아이템 생성
    const tl3Item = document.createElement('div');
    tl3Item.className = 'tl3-item';
    tl3Item.dataset.id = tl3File.id;
    
    tl3Item.innerHTML = `
        <div class="tl3-item-icon">
            <i class="fas fa-music"></i>
        </div>
        <div class="tl3-item-info">
            <div class="tl3-item-title">${tl3File.title}</div>
            <div class="tl3-item-artist">${tl3File.artist} • ${tl3File.genre}</div>
            <div style="font-size: 0.8rem; color: var(--tl-color); margin-top: 0.25rem;">
                <i class="fas fa-coins"></i> ${tl3File.tlRemaining.toLocaleString()} TL
            </div>
        </div>
        <div style="font-size: 1.2rem; color: var(--gray);">
            <i class="fas fa-play"></i>
        </div>
    `;
    
    // 클릭 이벤트
    tl3Item.addEventListener('click', function() {
        // 모든 항목에서 active 클래스 제거
        document.querySelectorAll('.tl3-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // 현재 항목에 active 클래스 추가
        tl3Item.classList.add('active');
        
        // 플레이어에 로드
        sendToPlayer(tl3File);
    });
    
    // 목록에 추가 (맨 위에)
    tl3List.insertBefore(tl3Item, tl3List.firstChild);
    
    // 카운트 업데이트
    if (libraryCount) {
        const count = document.querySelectorAll('.tl3-item').length;
        libraryCount.textContent = `(${count})`;
    }
}

// 플레이어에 전송
function sendToPlayer(tl3File) {
    console.log('플레이어에 전송:', tl3File.title);
    
    // 현재 TL3 저장
    currentTL3 = tl3File;
    tlRemaining = tl3File.tlRemaining;
    tlUsed = 0;
    currentPlaybackTime = 0;
    
    // 현재 트랙 정보 업데이트
    const currentTrack = document.getElementById('currentTrack');
    const currentArtist = document.getElementById('currentArtist');
    const currentTL = document.getElementById('currentTL');
    
    if (currentTrack) currentTrack.textContent = tl3File.title;
    if (currentArtist) currentArtist.textContent = tl3File.artist;
    if (currentTL) currentTL.textContent = `남은 TL: ${tlRemaining.toLocaleString()}`;
    
    // TL 정보 업데이트
    const remainingTL = document.getElementById('remainingTL');
    const tlUsedElement = document.getElementById('tlUsed');
    
    if (remainingTL) remainingTL.textContent = tlRemaining.toLocaleString();
    if (tlUsedElement) tlUsedElement.textContent = `사용: ${tlUsed} TL`;
    
    // TL 소비 프로그레스 초기화
    const consumptionProgress = document.getElementById('consumptionProgress');
    if (consumptionProgress) consumptionProgress.style.width = '0%';
    
    // 재생 버튼 활성화
    const playBtn = document.getElementById('playBtn');
    const playIcon = document.getElementById('playIcon');
    
    if (playBtn) {
        playBtn.disabled = false;
    }
    if (playIcon) {
        playIcon.className = 'fas fa-play';
    }
    
    // 재생 시간 초기화
    updateTimeDisplay();
    
    // 프로그레스 바 초기화
    const progress = document.getElementById('progress');
    if (progress) progress.style.width = '0%';
    
    // 재생 중이면 정지
    if (isPlaying) {
        stopPlayback();
    }
    
    console.log('플레이어 로드 완료');
}

// 재생/일시정지 토글
function togglePlayback() {
    console.log('togglePlayback 호출');
    console.log('currentTL3:', currentTL3);
    console.log('tlRemaining:', tlRemaining);
    console.log('isPlaying:', isPlaying);
    
    if (!currentTL3) {
        showMessage('먼저 TL3 파일을 선택해주세요');
        return;
    }
    
    if (tlRemaining <= 0) {
        showMessage('TL이 부족합니다. TL을 충전해주세요.');
        return;
    }
    
    if (isPlaying) {
        pausePlayback();
    } else {
        startPlayback();
    }
}

// 재생 시작
function startPlayback() {
    console.log('재생 시작');
    
    if (!currentTL3) return;
    
    isPlaying = true;
    const playIcon = document.getElementById('playIcon');
    if (playIcon) {
        playIcon.className = 'fas fa-pause';
    }
    
    showMessage(`"${currentTL3.title}" 재생 시작`);
    
    // 재생 시간 타이머 시작
    playbackTimer = setInterval(() => {
        if (currentPlaybackTime >= totalPlaybackTime) {
            // 곡 종료
            stopPlayback();
            showMessage('재생이 완료되었습니다');
            return;
        }
        
        currentPlaybackTime++;
        updateTimeDisplay();
        
        // 프로그레스 바 업데이트
        const progressPercent = (currentPlaybackTime / totalPlaybackTime) * 100;
        const progress = document.getElementById('progress');
        if (progress) {
            progress.style.width = `${progressPercent}%`;
        }
        
        console.log('재생 중...', currentPlaybackTime, '초');
    }, 1000); // 1초마다
    
    // TL 소비 시작
    startTLConsumption();
}

// 일시정지
function pausePlayback() {
    console.log('일시정지');
    
    isPlaying = false;
    const playIcon = document.getElementById('playIcon');
    if (playIcon) {
        playIcon.className = 'fas fa-play';
    }
    
    showMessage('재생 일시정지');
    
    // 타이머 정지
    if (playbackTimer) {
        clearInterval(playbackTimer);
        playbackTimer = null;
    }
    
    // TL 소비 정지
    stopTLConsumption();
}

// 재생 정지
function stopPlayback() {
    console.log('재생 정지');
    
    isPlaying = false;
    const playIcon = document.getElementById('playIcon');
    if (playIcon) {
        playIcon.className = 'fas fa-play';
    }
    
    // 타이머 정지
    if (playbackTimer) {
        clearInterval(playbackTimer);
        playbackTimer = null;
    }
    
    // TL 소비 정지
    stopTLConsumption();
    
    // 재생 시간 초기화
    currentPlaybackTime = 0;
    updateTimeDisplay();
    const progress = document.getElementById('progress');
    if (progress) {
        progress.style.width = '0%';
    }
}

// 재생 위치 이동
function seekPlayback(e) {
    console.log('재생 위치 이동');
    
    if (!currentTL3 || totalPlaybackTime <= 0) return;
    
    const progressBar = e.currentTarget;
    const clickPosition = e.offsetX;
    const totalWidth = progressBar.clientWidth;
    const percentage = (clickPosition / totalWidth) * 100;
    
    // 재생 위치 계산
    currentPlaybackTime = Math.round((percentage / 100) * totalPlaybackTime);
    
    // 프로그레스 바 업데이트
    const progress = document.getElementById('progress');
    if (progress) {
        progress.style.width = `${percentage}%`;
    }
    
    // 시간 표시 업데이트
    updateTimeDisplay();
}

// TL 소비 시작
function startTLConsumption() {
    console.log('TL 소비 시작');
    
    if (tlConsumptionInterval) {
        clearInterval(tlConsumptionInterval);
    }
    
    tlConsumptionInterval = setInterval(() => {
        if (tlRemaining <= 0) {
            // TL 소진
            stopTLConsumption();
            stopPlayback();
            showMessage('TL이 모두 소진되었습니다');
            return;
        }
        
        // TL 차감 (초당 1TL)
        tlRemaining -= 1;
        tlUsed += 1;
        
        console.log('TL 차감:', tlRemaining, '남음');
        
        // UI 업데이트
        const remainingTL = document.getElementById('remainingTL');
        const tlUsedElement = document.getElementById('tlUsed');
        const currentTL = document.getElementById('currentTL');
        
        if (remainingTL) remainingTL.textContent = tlRemaining.toLocaleString();
        if (tlUsedElement) tlUsedElement.textContent = `사용: ${tlUsed} TL`;
        if (currentTL) currentTL.textContent = `남은 TL: ${tlRemaining.toLocaleString()}`;
        
        // TL 소비 프로그레스 업데이트
        const totalTL = currentTL3.tlAmount;
        const consumptionPercent = (tlUsed / totalTL) * 100;
        const consumptionProgress = document.getElementById('consumptionProgress');
        if (consumptionProgress) {
            consumptionProgress.style.width = `${consumptionPercent}%`;
        }
        
        // 선택된 TL3 항목 업데이트
        const activeItem = document.querySelector('.tl3-item.active');
        if (activeItem) {
            const tlElement = activeItem.querySelector('.tl3-item-info div:nth-child(3)');
            if (tlElement) {
                tlElement.innerHTML = `<i class="fas fa-coins"></i> ${tlRemaining.toLocaleString()} TL`;
            }
        }
        
        // TL3 객체 업데이트
        if (currentTL3) {
            currentTL3.tlRemaining = tlRemaining;
        }
        
    }, 1000); // 1초마다
}

// TL 소비 정지
function stopTLConsumption() {
    console.log('TL 소비 정지');
    if (tlConsumptionInterval) {
        clearInterval(tlConsumptionInterval);
        tlConsumptionInterval = null;
    }
}

// 시간 표시 업데이트
function updateTimeDisplay() {
    const currentTime = formatTime(currentPlaybackTime);
    const totalTime = formatTime(totalPlaybackTime);
    
    const currentTimeElement = document.getElementById('currentTime');
    const totalTimeElement = document.getElementById('totalTime');
    
    if (currentTimeElement) currentTimeElement.textContent = currentTime;
    if (totalTimeElement) totalTimeElement.textContent = totalTime;
}

// 샘플 데이터 로드
function loadSampleData() {
    console.log('샘플 데이터 로드');
    
    const sampleTL3Files = [
        {
            id: 'sample_1',
            title: 'Neon Dreams',
            artist: 'Synthwave AI',
            genre: 'Electronic Synthwave',
            tlAmount: 5000,
            tlRemaining: 5000,
            fileName: 'neon_dreams.mp3',
            createdAt: '2024-01-15',
            isActive: true
        },
        {
            id: 'sample_2',
            title: 'Ocean Breeze',
            artist: 'Ambient Generator',
            genre: 'Chill Ambient',
            tlAmount: 7200,
            tlRemaining: 7200,
            fileName: 'ocean_breeze.wav',
            createdAt: '2024-01-10',
            isActive: true
        }
    ];
    
    sampleTL3Files.forEach(file => {
        addTL3ToList(file);
    });
}

// 유틸리티 함수들
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function showMessage(message) {
    console.log('메시지:', message);
    alert(message);
}

// TL 충전 함수 (전역에서 접근 가능하게)
window.chargeTL = function(amount) {
    console.log('TL 충전:', amount);
    
    if (!currentTL3) {
        showMessage('먼저 TL3 파일을 선택해주세요');
        return;
    }
    
    let currentTL = tlRemaining || 0;
    currentTL += amount;
    
    // 전역 변수 업데이트
    tlRemaining = currentTL;
    
    console.log('새 TL 잔액:', tlRemaining);
    
    // UI 업데이트
    const remainingTL = document.getElementById('remainingTL');
    const currentTLElement = document.getElementById('currentTL');
    
    if (remainingTL) remainingTL.textContent = currentTL.toLocaleString();
    if (currentTLElement) currentTLElement.textContent = `남은 TL: ${currentTL.toLocaleString()}`;
    
    // 선택된 TL3 항목 업데이트
    const activeItem = document.querySelector('.tl3-item.active');
    if (activeItem) {
        const tlElement = activeItem.querySelector('.tl3-item-info div:nth-child(3)');
        if (tlElement) {
            tlElement.innerHTML = `<i class="fas fa-coins"></i> ${currentTL.toLocaleString()} TL`;
        }
    }
    
    // TL3 객체 업데이트
    if (currentTL3) {
        currentTL3.tlRemaining = currentTL;
        currentTL3.tlAmount = Math.max(currentTL3.tlAmount, currentTL);
    }
    
    showMessage(`${amount.toLocaleString()} TL이 충전되었습니다!`);
};
