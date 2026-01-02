// studio.js - TIMEGATE™ STUDIO 완전 기능 버전 (재귀 호출 문제 수정)

console.log('TIMEGATE™ STUDIO 시스템 로드됨');

// 전역 변수
let currentTL3 = null;
let isPlaying = false;
let tlConsumptionInterval = null;
let playbackTimer = null;
let currentPlaybackTime = 0;
let audioPlayer = null;
let tl3Library = [];

// DOM이 로드된 후 실행
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded - TIMEGATE™ STUDIO 초기화');
    
    // 오디오 플레이어 초기화
    initializeAudioPlayer();
    
    // 모든 이벤트 리스너 설정
    setupAllEventListeners();
    
    // 플레이어 초기화
    initializePlayer();
    
    // 라이브러리 로드
    loadTL3Library();
    
    console.log('시스템 초기화 완료');
});

// 오디오 플레이어 초기화
function initializeAudioPlayer() {
    // 기존 audio 요소 사용 또는 새로 생성
    audioPlayer = document.getElementById('audioPlayer');
    if (!audioPlayer) {
        audioPlayer = new Audio();
        audioPlayer.preload = 'metadata';
        audioPlayer.volume = 0.7;
    }
    
    // 오디오 이벤트 리스너 설정
    audioPlayer.addEventListener('timeupdate', updateAudioProgress);
    audioPlayer.addEventListener('ended', handleAudioEnded);
    audioPlayer.addEventListener('error', handleAudioError);
    audioPlayer.addEventListener('loadedmetadata', handleAudioLoaded);
    audioPlayer.addEventListener('canplay', handleAudioCanPlay);
    
    console.log('오디오 플레이어 초기화 완료');
}

// 오디오 이벤트 핸들러
function updateAudioProgress() {
    if (!audioPlayer || !audioPlayer.duration) return;
    
    currentPlaybackTime = Math.floor(audioPlayer.currentTime);
    
    // 프로그레스 바 업데이트
    const progressPercent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    const progressBar = document.getElementById('progress');
    if (progressBar) {
        progressBar.style.width = `${progressPercent}%`;
    }
    
    // 시간 표시 업데이트
    updateTimeDisplay();
    
    // 총 재생 시간 업데이트
    const totalTimeElement = document.getElementById('totalTime');
    if (totalTimeElement && audioPlayer.duration) {
        totalTimeElement.textContent = formatTime(audioPlayer.duration);
    }
}

function handleAudioEnded() {
    console.log('오디오 재생 완료');
    stopPlayback();
    showNotificationMessage('재생이 완료되었습니다', 'info');
}

function handleAudioError(e) {
    console.error('오디오 에러:', e);
    showNotificationMessage('오디오 재생 중 오류가 발생했습니다', 'error');
    stopPlayback();
}

function handleAudioLoaded() {
    console.log('오디오 메타데이터 로드됨:', audioPlayer.duration);
    
    if (currentTL3 && !currentTL3.duration) {
        currentTL3.duration = audioPlayer.duration;
        saveTL3Library();
    }
}

function handleAudioCanPlay() {
    console.log('오디오 재생 가능');
}

// 모든 이벤트 리스너 설정
function setupAllEventListeners() {
    console.log('이벤트 리스너 설정 시작');
    
    // 1. 파일 업로드 관련
    setupFileUploadListeners();
    
    // 2. TL 슬라이더
    const timeSlider = document.getElementById('timeSlider');
    if (timeSlider) {
        timeSlider.addEventListener('input', updateTLDisplay);
        updateTLDisplay(); // 초기 표시
    }
    
    // 3. TL3 생성 버튼
    const createTL3Btn = document.getElementById('createTL3Btn');
    if (createTL3Btn) {
        createTL3Btn.addEventListener('click', createTL3File);
    }
    
    // 4. 플레이어 컨트롤
    setupPlayerControls();
    
    // 5. 드래그 앤 드롭
    setupDragAndDrop();
    
    console.log('이벤트 리스너 설정 완료');
}

// 파일 업로드 리스너 설정
function setupFileUploadListeners() {
    const selectFileBtn = document.getElementById('selectFileBtn');
    const fileInput = document.getElementById('musicFileInput');
    const uploadArea = document.getElementById('uploadArea');
    
    if (!selectFileBtn || !fileInput) {
        console.error('파일 업로드 요소를 찾을 수 없음');
        return;
    }
    
    // 파일 선택 버튼
    selectFileBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        fileInput.click();
    });
    
    // 파일 입력 변경
    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            handleFileSelection(file);
        }
    });
    
    // 업로드 영역 클릭
    if (uploadArea) {
        uploadArea.addEventListener('click', function() {
            fileInput.click();
        });
    }
}

// 드래그 앤 드롭 설정
function setupDragAndDrop() {
    const uploadArea = document.getElementById('uploadArea');
    if (!uploadArea) return;
    
    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        e.stopPropagation();
        uploadArea.style.borderColor = 'var(--creator)';
        uploadArea.style.background = 'rgba(139, 92, 246, 0.1)';
    });
    
    uploadArea.addEventListener('dragleave', function(e) {
        e.preventDefault();
        e.stopPropagation();
        uploadArea.style.borderColor = 'rgba(255, 255, 255, 0.2)';
        uploadArea.style.background = 'rgba(26, 26, 46, 0.3)';
    });
    
    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        e.stopPropagation();
        uploadArea.style.borderColor = 'rgba(255, 255, 255, 0.2)';
        uploadArea.style.background = 'rgba(26, 26, 46, 0.3)';
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileSelection(files[0]);
        }
    });
}

// 파일 선택 처리
function handleFileSelection(file) {
    console.log('파일 선택됨:', file.name);
    
    // 파일 정보 표시
    updateFileInfo(file);
    
    // 파일 유효성 검사
    const isValid = validateAudioFile(file);
    
    if (isValid) {
        // 오디오 길이 분석
        analyzeAudioDuration(file);
    }
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
            크기: ${formatFileSize(file.size)} | 형식: ${file.type || getFileExtension(file.name)}
        </div>
    `;
}

// 오디오 파일 유효성 검사
function validateAudioFile(file) {
    const validationMessage = document.getElementById('fileValidation');
    const validationText = document.getElementById('validationText');
    const durationInfo = document.getElementById('fileDurationInfo');
    
    if (!validationMessage || !validationText) return false;
    
    // 허용된 확장자
    const allowedExtensions = ['.mp3', '.wav', '.m4a', '.ogg', '.flac', '.aac'];
    const fileName = file.name.toLowerCase();
    const extension = fileName.substring(fileName.lastIndexOf('.'));
    
    // 허용된 MIME 타입
    const allowedMimeTypes = [
        'audio/mpeg',
        'audio/wav',
        'audio/x-wav',
        'audio/mp4',
        'audio/x-m4a',
        'audio/ogg',
        'audio/flac',
        'audio/aac'
    ];
    
    let isValid = false;
    let errorMessage = '';
    
    // 확장자 검사
    if (allowedExtensions.includes(extension)) {
        isValid = true;
    }
    // MIME 타입 검사
    else if (file.type && allowedMimeTypes.includes(file.type)) {
        isValid = true;
    }
    // 파일 타입이 없는 경우 확장자만 검사
    else if (!file.type && allowedExtensions.includes(extension)) {
        isValid = true;
    } else {
        errorMessage = '지원되지 않는 파일 형식입니다. MP3, WAV, M4A, OGG, FLAC, AAC 파일만 업로드 가능합니다.';
    }
    
    // 파일 크기 검사 (100MB 제한)
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
        isValid = false;
        errorMessage = `파일 크기가 너무 큽니다 (최대 100MB). 현재: ${formatFileSize(file.size)}`;
    }
    
    // 결과 표시
    if (!isValid) {
        validationText.textContent = errorMessage;
        validationMessage.className = 'validation-message validation-error';
        validationMessage.style.display = 'block';
        
        if (durationInfo) durationInfo.textContent = '';
        return false;
    }
    
    // 성공 메시지
    validationText.textContent = '파일이 유효합니다! 오디오 정보를 분석하는 중...';
    validationMessage.className = 'validation-message validation-success';
    validationMessage.style.display = 'block';
    
    return true;
}

// 오디오 길이 분석
function analyzeAudioDuration(file) {
    const durationInfo = document.getElementById('fileDurationInfo');
    if (!durationInfo) return;
    
    const tempAudio = new Audio();
    const objectURL = URL.createObjectURL(file);
    
    tempAudio.src = objectURL;
    tempAudio.preload = 'metadata';
    
    tempAudio.addEventListener('loadedmetadata', function() {
        const duration = tempAudio.duration;
        const minutes = Math.floor(duration / 60);
        const seconds = Math.floor(duration % 60);
        
        durationInfo.innerHTML = `
            <i class="fas fa-clock"></i> 
            재생 시간: ${minutes}:${seconds.toString().padStart(2, '0')} (${Math.round(duration)}초)
        `;
        
        // TL 슬라이더 최소값 자동 설정 (파일 길이의 10배)
        const timeSlider = document.getElementById('timeSlider');
        if (timeSlider && duration > 0) {
            const minTL = Math.ceil(duration) * 10;
            timeSlider.min = Math.max(60, minTL);
            
            // 현재 값이 최소값보다 작으면 조정
            if (parseInt(timeSlider.value) < timeSlider.min) {
                timeSlider.value = timeSlider.min;
                updateTLDisplay();
            }
        }
        
        URL.revokeObjectURL(objectURL);
    });
    
    tempAudio.addEventListener('error', function() {
        durationInfo.textContent = '오디오 길이 분석 실패';
        durationInfo.style.color = 'var(--warning)';
        URL.revokeObjectURL(objectURL);
    });
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
    if (seconds > 0 || (hours === 0 && minutes === 0)) timeString += `${seconds}초`;
    
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
        showNotificationMessage('음원 제목을 입력해주세요', 'error');
        document.getElementById('musicTitle').focus();
        return;
    }
    
    if (!artistName) {
        showNotificationMessage('아티스트명을 입력해주세요', 'error');
        document.getElementById('artistName').focus();
        return;
    }
    
    if (!fileInput.files || fileInput.files.length === 0) {
        showNotificationMessage('음원 파일을 선택해주세요', 'error');
        return;
    }
    
    const audioFile = fileInput.files[0];
    
    // 파일 유효성 검사
    if (!validateAudioFile(audioFile)) {
        return;
    }
    
    // TL 값 가져오기
    const tlValue = parseInt(document.getElementById('timeSlider').value);
    
    // 오디오 파일을 Blob URL로 변환
    const audioUrl = URL.createObjectURL(audioFile);
    
    // TL3 객체 생성
    const tl3File = {
        id: 'tl3_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        title: musicTitle,
        artist: artistName,
        genre: musicGenre || '미지정',
        tlAmount: tlValue,
        tlRemaining: tlValue,
        fileName: audioFile.name,
        fileSize: audioFile.size,
        fileType: audioFile.type,
        audioUrl: audioUrl,
        duration: 0, // 나중에 설정
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isActive: true,
        playCount: 0
    };
    
    console.log('TL3 파일 생성됨:', tl3File);
    
    // 오디오 길이 분석 후 저장
    const tempAudio = new Audio();
    tempAudio.src = audioUrl;
    tempAudio.preload = 'metadata';
    
    tempAudio.addEventListener('loadedmetadata', function() {
        tl3File.duration = tempAudio.duration;
        console.log('오디오 길이 분석 완료:', tl3File.duration);
        
        // TL3 목록에 추가
        addTL3ToList(tl3File);
        
        // 라이브러리에 저장
        tl3Library.unshift(tl3File);
        saveTL3Library();
        
        // 플레이어에 전송
        sendToPlayer(tl3File);
        
        // 성공 메시지
        showNotificationMessage(
            `"${musicTitle}" TL3 파일이 생성되었습니다!<br>재생 시간: ${formatTime(tl3File.duration)}<br>남은 TL: ${tlValue.toLocaleString()} TL`,
            'success'
        );
        
        // 폼 초기화
        resetForm();
    });
    
    tempAudio.addEventListener('error', function() {
        console.error('오디오 분석 실패');
        showNotificationMessage('오디오 파일 분석 중 오류가 발생했습니다', 'error');
        URL.revokeObjectURL(audioUrl);
    });
}

// TL3 목록에 추가
function addTL3ToList(tl3File) {
    const tl3List = document.getElementById('tl3List');
    const emptyMessage = document.getElementById('emptyLibraryMessage');
    const libraryCount = document.getElementById('libraryCount');
    
    if (!tl3List) {
        console.error('tl3List 요소를 찾을 수 없음');
        return;
    }
    
    // 빈 메시지 숨기기
    if (emptyMessage) {
        emptyMessage.style.display = 'none';
    }
    
    // TL3 아이템 생성
    const tl3Item = document.createElement('div');
    tl3Item.className = 'tl3-item';
    tl3Item.dataset.id = tl3File.id;
    tl3Item.dataset.tl = tl3File.tlRemaining;
    
    tl3Item.innerHTML = `
        <div class="tl3-item-icon">
            <i class="fas fa-music"></i>
        </div>
        <div class="tl3-item-info">
            <div class="tl3-item-title">${tl3File.title}</div>
            <div class="tl3-item-artist">${tl3File.artist} • ${tl3File.genre}</div>
            <div style="font-size: 0.8rem; color: var(--tl-color); margin-top: 0.25rem;">
                <i class="fas fa-coins"></i> 
                <span class="tl-value">${tl3File.tlRemaining.toLocaleString()}</span> TL
                <span style="font-size: 0.7rem; color: var(--gray); margin-left: 0.5rem;">
                    <i class="fas fa-clock"></i> ${formatTime(tl3File.duration || 0)}
                </span>
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

// 플레이어 초기화
function initializePlayer() {
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

// 플레이어에 전송
function sendToPlayer(tl3File) {
    console.log('플레이어에 전송:', tl3File.title);
    
    // 현재 TL3 저장
    currentTL3 = tl3File;
    currentPlaybackTime = 0;
    
    // 플레이어 디스플레이 업데이트
    updatePlayerDisplay(tl3File);
    
    // 오디오 플레이어에 URL 설정
    if (audioPlayer && tl3File.audioUrl) {
        // 기존 오디오 정지
        if (!audioPlayer.paused) {
            audioPlayer.pause();
        }
        
        // 새 오디오 URL 설정
        audioPlayer.src = tl3File.audioUrl;
        
        // 메타데이터 로드
        audioPlayer.load();
        
        console.log('오디오 플레이어에 URL 설정:', tl3File.audioUrl);
    }
    
    // TL 소비 프로그레스 초기화
    const consumptionProgress = document.getElementById('consumptionProgress');
    if (consumptionProgress) {
        consumptionProgress.style.width = '0%';
    }
    
    // 재생 버튼 활성화
    const playBtn = document.getElementById('playBtn');
    const playIcon = document.getElementById('playIcon');
    
    if (playBtn) {
        playBtn.disabled = false;
    }
    if (playIcon) {
        playIcon.className = 'fas fa-play';
    }
    
    // 재생 상태 초기화
    isPlaying = false;
    
    // 재생 시간 초기화
    updateTimeDisplay();
    
    // 프로그레스 바 초기화
    const progress = document.getElementById('progress');
    if (progress) {
        progress.style.width = '0%';
    }
    
    console.log('플레이어 로드 완료');
}

// 플레이어 디스플레이 업데이트
function updatePlayerDisplay(tl3File) {
    const currentTrack = document.getElementById('currentTrack');
    const currentArtist = document.getElementById('currentArtist');
    const currentTL = document.getElementById('currentTL');
    const remainingTL = document.getElementById('remainingTL');
    const tlUsedElement = document.getElementById('tlUsed');
    const albumArt = document.getElementById('albumArt');
    
    if (currentTrack) currentTrack.textContent = tl3File.title;
    if (currentArtist) currentArtist.textContent = tl3File.artist;
    
    const tlRemaining = tl3File.tlRemaining;
    const tlUsed = tl3File.tlAmount - tlRemaining;
    
    if (currentTL) currentTL.textContent = `남은 TL: ${tlRemaining.toLocaleString()}`;
    if (remainingTL) remainingTL.textContent = tlRemaining.toLocaleString();
    if (tlUsedElement) tlUsedElement.textContent = `사용: ${tlUsed} TL`;
    
    // 앨범 아트 업데이트 (장르별 아이콘)
    if (albumArt) {
        updateAlbumArt(tl3File.genre, albumArt);
    }
}

// 앨범 아트 업데이트
function updateAlbumArt(genre, albumArt) {
    let icon = 'fas fa-music';
    let color = 'var(--creator)';
    
    if (genre) {
        genre = genre.toLowerCase();
        
        if (genre.includes('electronic') || genre.includes('edm') || genre.includes('techno')) {
            icon = 'fas fa-bolt';
            color = '#FF6B35';
        } else if (genre.includes('chill') || genre.includes('ambient') || genre.includes('relax')) {
            icon = 'fas fa-cloud';
            color = '#00D4AA';
        } else if (genre.includes('rock') || genre.includes('metal') || genre.includes('punk')) {
            icon = 'fas fa-guitar';
            color = '#EF4444';
        } else if (genre.includes('jazz') || genre.includes('blues') || genre.includes('soul')) {
            icon = 'fas fa-saxophone';
            color = '#9D4EDD';
        } else if (genre.includes('hip') || genre.includes('rap')) {
            icon = 'fas fa-microphone';
            color = '#FFD166';
        } else if (genre.includes('classical') || genre.includes('orchestral')) {
            icon = 'fas fa-violin';
            color = '#8B5CF6';
        } else if (genre.includes('pop')) {
            icon = 'fas fa-star';
            color = '#EC4899';
        }
    }
    
    albumArt.innerHTML = `<i class="${icon}"></i>`;
    albumArt.style.color = color;
}

// 재생/일시정지 토글
function togglePlayback() {
    if (!currentTL3) {
        showNotificationMessage('먼저 TL3 파일을 선택해주세요', 'error');
        return;
    }
    
    if (currentTL3.tlRemaining <= 0) {
        showNotificationMessage('TL이 부족합니다. TL을 충전해주세요.', 'warning');
        return;
    }
    
    if (!audioPlayer || !audioPlayer.src) {
        showNotificationMessage('오디오 파일을 로드하는 중입니다...', 'info');
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
    if (!currentTL3 || !audioPlayer) return;
    
    // 실제 오디오 재생
    audioPlayer.play().then(() => {
        isPlaying = true;
        const playIcon = document.getElementById('playIcon');
        if (playIcon) {
            playIcon.className = 'fas fa-pause';
        }
        
        console.log('오디오 재생 시작');
        
        // TL 소비 시작
        startTLConsumption();
        
        // 재생 카운트 증가
        currentTL3.playCount = (currentTL3.playCount || 0) + 1;
        
        // 재생 시작 알림
        showNotificationMessage(`"${currentTL3.title}" 재생 시작`, 'info');
    }).catch(error => {
        console.error('오디오 재생 실패:', error);
        showNotificationMessage('오디오 재생에 실패했습니다: ' + error.message, 'error');
    });
}

// 일시정지
function pausePlayback() {
    if (!audioPlayer) return;
    
    audioPlayer.pause();
    isPlaying = false;
    
    const playIcon = document.getElementById('playIcon');
    if (playIcon) {
        playIcon.className = 'fas fa-play';
    }
    
    // TL 소비 정지
    stopTLConsumption();
    
    showNotificationMessage('재생 일시정지', 'info');
}

// 재생 정지
function stopPlayback() {
    if (!audioPlayer) return;
    
    audioPlayer.pause();
    audioPlayer.currentTime = 0;
    isPlaying = false;
    
    const playIcon = document.getElementById('playIcon');
    if (playIcon) {
        playIcon.className = 'fas fa-play';
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

// 이전 곡
function playPrevious() {
    showNotificationMessage('이전 곡 기능은 준비 중입니다', 'info');
}

// 다음 곡
function playNext() {
    showNotificationMessage('다음 곡 기능은 준비 중입니다', 'info');
}

// 재생 위치 이동
function seekPlayback(e) {
    if (!currentTL3 || !audioPlayer || !audioPlayer.duration) return;
    
    const progressBar = e.currentTarget;
    const clickPosition = e.offsetX;
    const totalWidth = progressBar.clientWidth;
    const percentage = (clickPosition / totalWidth) * 100;
    
    // 재생 위치 계산
    const seekTime = (percentage / 100) * audioPlayer.duration;
    audioPlayer.currentTime = seekTime;
    
    // 프로그레스 바 업데이트
    const progress = document.getElementById('progress');
    if (progress) {
        progress.style.width = `${percentage}%`;
    }
    
    // 시간 표시 업데이트
    currentPlaybackTime = Math.floor(seekTime);
    updateTimeDisplay();
}

// TL 소비 시작
function startTLConsumption() {
    console.log('TL 소비 시작');
    
    if (tlConsumptionInterval) {
        clearInterval(tlConsumptionInterval);
    }
    
    tlConsumptionInterval = setInterval(() => {
        if (!currentTL3 || currentTL3.tlRemaining <= 0) {
            // TL 소진
            stopTLConsumption();
            stopPlayback();
            showNotificationMessage('TL이 모두 소진되었습니다', 'warning');
            return;
        }
        
        // TL 차감 (초당 1TL)
        currentTL3.tlRemaining -= 1;
        
        console.log('TL 차감:', currentTL3.tlRemaining, '남음');
        
        // UI 업데이트
        updatePlayerDisplay(currentTL3);
        
        // TL 소비 프로그레스 업데이트
        const totalTL = currentTL3.tlAmount;
        const tlUsed = totalTL - currentTL3.tlRemaining;
        const consumptionPercent = (tlUsed / totalTL) * 100;
        const consumptionProgress = document.getElementById('consumptionProgress');
        if (consumptionProgress) {
            consumptionProgress.style.width = `${consumptionPercent}%`;
        }
        
        // 선택된 TL3 항목 업데이트
        updateActiveTL3Item(currentTL3);
        
        // 라이브러리 업데이트
        saveTL3Library();
        
    }, 1000); // 1초마다
}

// 활성 TL3 항목 업데이트
function updateActiveTL3Item(tl3File) {
    const activeItem = document.querySelector('.tl3-item.active');
    if (activeItem && activeItem.dataset.id === tl3File.id) {
        const tlElement = activeItem.querySelector('.tl-value');
        if (tlElement) {
            tlElement.textContent = tl3File.tlRemaining.toLocaleString();
        }
        activeItem.dataset.tl = tl3File.tlRemaining;
    }
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
    
    const currentTimeElement = document.getElementById('currentTime');
    if (currentTimeElement) {
        currentTimeElement.textContent = currentTime;
    }
}

// 라이브러리 로드
function loadTL3Library() {
    try {
        const stored = localStorage.getItem('tl3Library');
        if (stored) {
            tl3Library = JSON.parse(stored);
            console.log('TL3 라이브러리 로드됨:', tl3Library.length, '개 항목');
            
            // UI에 표시
            tl3Library.forEach(file => {
                addTL3ToList(file);
            });
        } else {
            console.log('저장된 TL3 라이브러리가 없습니다');
        }
    } catch (error) {
        console.error('라이브러리 로드 실패:', error);
        tl3Library = [];
    }
}

// 라이브러리 저장
function saveTL3Library() {
    try {
        // 현재 TL3 업데이트
        if (currentTL3) {
            const index = tl3Library.findIndex(item => item.id === currentTL3.id);
            if (index !== -1) {
                tl3Library[index] = currentTL3;
                currentTL3.updatedAt = new Date().toISOString();
            }
        }
        
        localStorage.setItem('tl3Library', JSON.stringify(tl3Library));
        console.log('TL3 라이브러리 저장됨:', tl3Library.length, '개 항목');
    } catch (error) {
        console.error('라이브러리 저장 실패:', error);
    }
}

// 폼 초기화
function resetForm() {
    document.getElementById('musicTitle').value = '';
    document.getElementById('artistName').value = '';
    document.getElementById('musicGenre').value = '';
    document.getElementById('musicFileInput').value = '';
    document.getElementById('fileInfo').innerHTML = '파일을 선택해주세요';
    
    const validationMessage = document.getElementById('fileValidation');
    if (validationMessage) {
        validationMessage.style.display = 'none';
    }
    
    const durationInfo = document.getElementById('fileDurationInfo');
    if (durationInfo) {
        durationInfo.textContent = '';
    }
    
    document.getElementById('timeSlider').value = '3600';
    updateTLDisplay();
}

// 알림 메시지 표시 (재귀 호출 문제 해결)
function showNotificationMessage(message, type = 'info') {
    console.log('알림:', message, type);
    
    // common-components.js의 showNotification이 있으면 사용
    if (typeof window.showNotification === 'function' && window.showNotification !== showNotificationMessage) {
        window.showNotification(message, type);
        return;
    }
    
    // 자체 알림 시스템
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notificationMessage');
    
    if (notification && notificationMessage) {
        notificationMessage.innerHTML = message;
        notification.className = 'notification';
        notification.classList.add(`notification-${type}`);
        notification.style.display = 'block';
        
        setTimeout(() => {
            notification.style.display = 'none';
        }, 5000);
    } else {
        // 최종 fallback: 간단한 alert
        alert(message);
    }
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
    if (isNaN(seconds) || seconds < 0) return '0:00';
    
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function getFileExtension(filename) {
    const extension = filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
    return extension ? `.${extension}` : '';
}

// TL 충전 함수 (전역에서 접근 가능하게)
window.chargeTL = function(amount) {
    console.log('TL 충전 요청:', amount);
    
    if (!currentTL3) {
        showNotificationMessage('먼저 TL3 파일을 선택해주세요', 'error');
        return;
    }
    
    console.log('충전 전:', currentTL3.tlRemaining);
    
    // TL 충전
    currentTL3.tlRemaining += amount;
    currentTL3.tlAmount = Math.max(currentTL3.tlAmount, currentTL3.tlRemaining);
    
    console.log('충전 후:', currentTL3.tlRemaining);
    
    // UI 업데이트
    updatePlayerDisplay(currentTL3);
    
    // 선택된 TL3 항목 업데이트
    updateActiveTL3Item(currentTL3);
    
    // 라이브러리 업데이트
    saveTL3Library();
    
    showNotificationMessage(
        `${amount.toLocaleString()} TL이 충전되었습니다!<br>총 TL: ${currentTL3.tlRemaining.toLocaleString()} TL`,
        'success'
    );
};

// 개발자 도구용 유틸리티
window.studioUtils = {
    getCurrentTL3: () => currentTL3,
    getLibrary: () => tl3Library,
    resetLibrary: () => {
        localStorage.removeItem('tl3Library');
        tl3Library = [];
        const tl3List = document.getElementById('tl3List');
        if (tl3List) {
            tl3List.innerHTML = `
                <div id="emptyLibraryMessage" style="text-align: center; padding: 2rem; color: var(--gray);">
                    <i class="fas fa-music" style="font-size: 2rem; margin-bottom: 1rem;"></i>
                    <div>TL3 파일이 없습니다.<br>왼쪽에서 TL3 파일을 생성해주세요.</div>
                </div>
            `;
        }
        showNotificationMessage('라이브러리가 초기화되었습니다', 'info');
    },
    addTestTL3: (title, tlAmount) => {
        const testFile = {
            id: 'test_' + Date.now(),
            title: title || '테스트 음원',
            artist: '테스트 아티스트',
            genre: '테스트 장르',
            tlAmount: tlAmount || 1000,
            tlRemaining: tlAmount || 1000,
            fileName: 'test.mp3',
            fileSize: 1024000,
            fileType: 'audio/mpeg',
            audioUrl: '',
            duration: 120,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isActive: true,
            playCount: 0
        };
        
        tl3Library.unshift(testFile);
        addTL3ToList(testFile);
        saveTL3Library();
        showNotificationMessage('테스트 TL3 파일이 추가되었습니다', 'success');
    },
    
    // 테스트용 오디오 추가
    addTestAudio: function() {
        // 간단한 오디오 테스트 파일 생성
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 440; // A4 음
        gainNode.gain.value = 0.1;
        
        oscillator.start();
        
        // 2초 후 정지
        setTimeout(() => {
            oscillator.stop();
            showNotificationMessage('테스트 오디오 재생 완료', 'success');
        }, 2000);
    }
};

console.log('TIMEGATE™ STUDIO 시스템 초기화 완료');
