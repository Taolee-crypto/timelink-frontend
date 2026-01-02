// studio.js - 완전한 TL3 플레이어 구현

console.log('studio.js 로드됨 - 플레이어 버전');

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
    console.log('DOMContentLoaded - studio.js 플레이어 버전');
    
    // 파일 선택 버튼 이벤트 설정
    setupFileSelection();
    
    // TL 슬라이더 이벤트 설정
    setupTLSlider();
    
    // TL3 생성 버튼 이벤트 설정
    setupCreateButton();
    
    // 플레이어 컨트롤 이벤트 설정
    setupPlayerControls();
    
    // 플레이어 초기화
    initializePlayer();
    
    // 샘플 데이터 로드
    setTimeout(loadSampleData, 1000);
});

// 플레이어 초기화
function initializePlayer() {
    // 플레이어 버튼 비활성화
    document.getElementById('playBtn').disabled = true;
    document.getElementById('prevBtn').disabled = true;
    document.getElementById('nextBtn').disabled = true;
    
    // TL 소비율 표시
    document.getElementById('consumptionRate').textContent = '-1 TL/초';
    
    // 재생 시간 표시 초기화
    updateTimeDisplay();
}

// 파일 선택 설정
function setupFileSelection() {
    const selectFileBtn = document.getElementById('selectFileBtn');
    const fileInput = document.getElementById('musicFileInput');
    
    if (!selectFileBtn || !fileInput) {
        console.error('필수 요소를 찾을 수 없음');
        return;
    }
    
    // 파일 선택 버튼 클릭 이벤트
    selectFileBtn.addEventListener('click', function(e) {
        console.log('파일 선택 버튼 클릭됨');
        e.preventDefault();
        e.stopPropagation();
        fileInput.click();
    });
    
    // 파일 입력 변경 이벤트
    fileInput.addEventListener('change', function(e) {
        console.log('파일 변경됨');
        const file = e.target.files[0];
        
        if (file) {
            console.log('선택된 파일:', file.name);
            
            // 파일 정보 표시
            const fileInfo = document.getElementById('fileInfo');
            if (fileInfo) {
                fileInfo.innerHTML = `
                    <div style="color: var(--success);">
                        <i class="fas fa-check-circle"></i> ${file.name}
                    </div>
                    <div style="font-size: 0.85rem; margin-top: 0.25rem; color: var(--gray);">
                        크기: ${formatFileSize(file.size)}
                    </div>
                `;
            }
            
            // 파일 유효성 검사 메시지 표시
            showFileValidation(file);
        }
    });
    
    // 업로드 영역 클릭 이벤트
    const uploadArea = document.getElementById('uploadArea');
    if (uploadArea) {
        uploadArea.addEventListener('click', function() {
            console.log('업로드 영역 클릭됨');
            fileInput.click();
        });
    }
}

// 파일 유효성 검사 메시지 표시
function showFileValidation(file) {
    const validationMessage = document.getElementById('fileValidation');
    const validationText = document.getElementById('validationText');
    
    if (!validationMessage || !validationText) return;
    
    // 허용된 확장자
    const allowedExtensions = ['.mp3', '.wav', '.m4a', '.ogg', '.flac'];
    const fileName = file.name.toLowerCase();
    const extension = fileName.substring(fileName.lastIndexOf('.'));
    
    let isValid = false;
    
    // 확장자 검사
    if (allowedExtensions.includes(extension)) {
        isValid = true;
    }
    // MIME 타입 검사
    else if (file.type && file.type.startsWith('audio/')) {
        isValid = true;
    }
    
    if (!isValid) {
        validationText.textContent = '지원되지 않는 파일 형식입니다. MP3, WAV, M4A, OGG, FLAC 파일만 업로드 가능합니다.';
        validationMessage.className = 'validation-message validation-error';
        validationMessage.style.display = 'block';
        return;
    }
    
    // 파일 크기 검사 (50MB)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
        validationText.textContent = `파일 크기가 너무 큽니다 (최대 50MB). 현재: ${formatFileSize(file.size)}`;
        validationMessage.className = 'validation-message validation-error';
        validationMessage.style.display = 'block';
        return;
    }
    
    // 성공 메시지
    validationText.textContent = '파일이 유효합니다!';
    validationMessage.className = 'validation-message validation-success';
    validationMessage.style.display = 'block';
}

// TL 슬라이더 설정
function setupTLSlider() {
    const timeSlider = document.getElementById('timeSlider');
    if (!timeSlider) return;
    
    timeSlider.addEventListener('input', updateTLDisplay);
    updateTLDisplay(); // 초기 표시
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

// TL3 생성 버튼 설정
function setupCreateButton() {
    const createTL3Btn = document.getElementById('createTL3Btn');
    if (!createTL3Btn) return;
    
    createTL3Btn.addEventListener('click', createTL3File);
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
        showNotification('음원 제목을 입력해주세요', 'error');
        document.getElementById('musicTitle').focus();
        return;
    }
    
    if (!artistName) {
        showNotification('아티스트명을 입력해주세요', 'error');
        document.getElementById('artistName').focus();
        return;
    }
    
    if (!fileInput.files || fileInput.files.length === 0) {
        showNotification('음원 파일을 선택해주세요', 'error');
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
    
    // 성공 알림
    showNotification(
        `"${musicTitle}" TL3 파일이 생성되었습니다!<br>남은 TL: ${tlValue.toLocaleString()} TL`,
        'success'
    );
    
    // 폼 초기화 (선택사항)
    // resetForm();
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
    document.getElementById('currentTrack').textContent = tl3File.title;
    document.getElementById('currentArtist').textContent = tl3File.artist;
    document.getElementById('currentTL').textContent = `남은 TL: ${tlRemaining.toLocaleString()}`;
    
    // TL 정보 업데이트
    document.getElementById('remainingTL').textContent = tlRemaining.toLocaleString();
    document.getElementById('tlUsed').textContent = `사용: ${tlUsed} TL`;
    
    // TL 소비 프로그레스 초기화
    document.getElementById('consumptionProgress').style.width = '0%';
    
    // 재생 버튼 활성화
    document.getElementById('playBtn').disabled = false;
    document.getElementById('playIcon').className = 'fas fa-play';
    
    // 재생 시간 초기화
    updateTimeDisplay();
    document.getElementById('progress').style.width = '0%';
    
    // 재생 중이면 정지
    if (isPlaying) {
        stopPlayback();
    }
    
    // 플레이어 컨트롤 활성화
    document.getElementById('prevBtn').disabled = false;
    document.getElementById('nextBtn').disabled = false;
}

// 플레이어 컨트롤 설정
function setupPlayerControls() {
    const playBtn = document.getElementById('playBtn');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const progressBar = document.getElementById('progressBar');
    
    if (playBtn) {
        playBtn.addEventListener('click', togglePlayback);
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', playPrevious);
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', playNext);
    }
    
    if (progressBar) {
        progressBar.addEventListener('click', seekPlayback);
    }
}

// 재생/일시정지 토글
function togglePlayback() {
    if (!currentTL3) {
        showNotification('먼저 TL3 파일을 선택해주세요', 'error');
        return;
    }
    
    if (tlRemaining <= 0) {
        showNotification('TL이 부족합니다. TL을 충전해주세요.', 'error');
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
    if (!currentTL3) return;
    
    isPlaying = true;
    document.getElementById('playIcon').className = 'fas fa-pause';
    
    showNotification(`"${currentTL3.title}" 재생 시작`, 'success');
    
    // 재생 시간 타이머 시작
    playbackTimer = setInterval(() => {
        if (currentPlaybackTime >= totalPlaybackTime) {
            // 곡 종료
            stopPlayback();
            showNotification('재생이 완료되었습니다', 'info');
            return;
        }
        
        currentPlaybackTime++;
        updateTimeDisplay();
        
        // 프로그레스 바 업데이트
        const progressPercent = (currentPlaybackTime / totalPlaybackTime) * 100;
        document.getElementById('progress').style.width = `${progressPercent}%`;
    }, 1000); // 1초마다
    
    // TL 소비 시작
    startTLConsumption();
}

// 일시정지
function pausePlayback() {
    isPlaying = false;
    document.getElementById('playIcon').className = 'fas fa-play';
    
    showNotification('재생 일시정지', 'info');
    
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
    isPlaying = false;
    document.getElementById('playIcon').className = 'fas fa-play';
    
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
    document.getElementById('progress').style.width = '0%';
}

// 이전 곡
function playPrevious() {
    showNotification('이전 곡 재생', 'info');
    // 실제 구현에서는 이전 트랙 로드 로직 필요
}

// 다음 곡
function playNext() {
    showNotification('다음 곡 재생', 'info');
    // 실제 구현에서는 다음 트랙 로드 로직 필요
}

// 재생 위치 이동
function seekPlayback(e) {
    if (!currentTL3 || totalPlaybackTime <= 0) return;
    
    const progressBar = e.currentTarget;
    const clickPosition = e.offsetX;
    const totalWidth = progressBar.clientWidth;
    const percentage = (clickPosition / totalWidth) * 100;
    
    // 재생 위치 계산
    currentPlaybackTime = Math.round((percentage / 100) * totalPlaybackTime);
    
    // 프로그레스 바 업데이트
    document.getElementById('progress').style.width = `${percentage}%`;
    
    // 시간 표시 업데이트
    updateTimeDisplay();
    
    // TL 소비량도 업데이트 (단순화된 구현)
    if (isPlaying) {
        // TL 소비 재시작
        stopTLConsumption();
        startTLConsumption();
    }
}

// TL 소비 시작
function startTLConsumption() {
    if (tlConsumptionInterval) {
        clearInterval(tlConsumptionInterval);
    }
    
    tlConsumptionInterval = setInterval(() => {
        if (tlRemaining <= 0) {
            // TL 소진
            stopTLConsumption();
            stopPlayback();
            showNotification('TL이 모두 소진되었습니다', 'warning');
            return;
        }
        
        // TL 차감 (초당 1TL)
        tlRemaining -= 1;
        tlUsed += 1;
        
        // UI 업데이트
        document.getElementById('remainingTL').textContent = tlRemaining.toLocaleString();
        document.getElementById('tlUsed').textContent = `사용: ${tlUsed} TL`;
        document.getElementById('currentTL').textContent = `남은 TL: ${tlRemaining.toLocaleString()}`;
        
        // TL 소비 프로그레스 업데이트
        const totalTL = currentTL3.tlAmount;
        const consumptionPercent = (tlUsed / totalTL) * 100;
        document.getElementById('consumptionProgress').style.width = `${consumptionPercent}%`;
        
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
    if (tlConsumptionInterval) {
        clearInterval(tlConsumptionInterval);
        tlConsumptionInterval = null;
    }
}

// 시간 표시 업데이트
function updateTimeDisplay() {
    const currentTime = formatTime(currentPlaybackTime);
    const totalTime = formatTime(totalPlaybackTime);
    
    document.getElementById('currentTime').textContent = currentTime;
    document.getElementById('totalTime').textContent = totalTime;
}

// 샘플 데이터 로드
function loadSampleData() {
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

// 폼 초기화 (선택사항)
function resetForm() {
    document.getElementById('musicTitle').value = '';
    document.getElementById('artistName').value = '';
    document.getElementById('musicGenre').value = '';
    document.getElementById('musicFileInput').value = '';
    document.getElementById('fileInfo').innerHTML = '파일을 선택해주세요';
    document.getElementById('fileValidation').style.display = 'none';
    document.getElementById('timeSlider').value = '3600';
    updateTLDisplay();
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

// 알림 표시 함수 (common-components.js와 호환)
function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notificationMessage');
    
    if (!notification || !notificationMessage) {
        // common-components.js의 showNotification이 없으면 alert 사용
        alert(message);
        return;
    }
    
    notificationMessage.innerHTML = message;
    notification.className = 'notification';
    notification.classList.add(`notification-${type}`);
    notification.style.display = 'block';
    
    // 자동 숨김
    setTimeout(() => {
        notification.style.display = 'none';
    }, 5000);
}

// TL 충전 함수 (전역에서 접근 가능하게)
window.chargeTL = function(amount) {
    if (!currentTL3) {
        showNotification('먼저 TL3 파일을 선택해주세요', 'error');
        return;
    }
    
    let currentTL = tlRemaining || 0;
    currentTL += amount;
    
    // 전역 변수 업데이트
    tlRemaining = currentTL;
    
    // UI 업데이트
    document.getElementById('remainingTL').textContent = currentTL.toLocaleString();
    document.getElementById('currentTL').textContent = `남은 TL: ${currentTL.toLocaleString()}`;
    
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
    
    showNotification(`${amount.toLocaleString()} TL이 충전되었습니다!`, 'success');
};
