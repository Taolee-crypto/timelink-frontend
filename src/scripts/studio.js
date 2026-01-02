// studio.js - TL3 스튜디오 메인 기능

// DOM이 로드된 후 실행
document.addEventListener('DOMContentLoaded', function() {
    // 파일 선택 버튼 이벤트 리스너
    const selectFileBtn = document.getElementById('selectFileBtn');
    const fileInput = document.getElementById('musicFileInput');
    const uploadArea = document.getElementById('uploadArea');
    
    if (selectFileBtn) {
        selectFileBtn.addEventListener('click', function(e) {
            e.stopPropagation(); // 이벤트 버블링 방지
            fileInput.click();
        });
    }
    
    if (uploadArea) {
        uploadArea.addEventListener('click', function() {
            fileInput.click();
        });
    }
    
    if (fileInput) {
        fileInput.addEventListener('change', handleFileSelect);
    }
    
    // 파일 드래그 앤 드롭 기능
    if (uploadArea) {
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
                handleFileDrop(files[0]);
            }
        });
    }
    
    // TL 슬라이더 이벤트 리스너
    const timeSlider = document.getElementById('timeSlider');
    if (timeSlider) {
        timeSlider.addEventListener('input', updateTLDisplay);
    }
    
    // TL3 생성 버튼 이벤트 리스너
    const createTL3Btn = document.getElementById('createTL3Btn');
    if (createTL3Btn) {
        createTL3Btn.addEventListener('click', createTL3File);
    }
    
    // 플레이어 컨트롤 이벤트 리스너
    const playBtn = document.getElementById('playBtn');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const progressBar = document.getElementById('progressBar');
    
    if (playBtn) {
        playBtn.addEventListener('click', togglePlay);
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', playPrev);
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', playNext);
    }
    
    if (progressBar) {
        progressBar.addEventListener('click', seekAudio);
    }
    
    // 초기화
    updateTLDisplay();
    
    // 테스트용: 샘플 TL3 파일 추가
    addSampleTL3Files();
});

// 파일 선택 처리 함수
function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        validateAndDisplayFile(file);
    }
}

// 파일 드롭 처리 함수
function handleFileDrop(file) {
    if (file) {
        validateAndDisplayFile(file);
    }
}

// 파일 유효성 검사 및 정보 표시
function validateAndDisplayFile(file) {
    const fileInfo = document.getElementById('fileInfo');
    const validationMessage = document.getElementById('fileValidation');
    const validationText = document.getElementById('validationText');
    const durationInfo = document.getElementById('fileDurationInfo');
    const musicFileInput = document.getElementById('musicFileInput');
    
    // 허용된 파일 타입
    const allowedTypes = ['audio/mp3', 'audio/wav', 'audio/mpeg', 'audio/x-m4a', 'audio/ogg', 'audio/flac'];
    const allowedExtensions = ['.mp3', '.wav', '.m4a', '.ogg', '.flac'];
    
    // 파일 확장자 확인
    const fileName = file.name.toLowerCase();
    const isValidExtension = allowedExtensions.some(ext => fileName.endsWith(ext));
    const isValidType = allowedTypes.includes(file.type);
    
    // 파일 크기 확인 (50MB 제한)
    const maxSize = 50 * 1024 * 1024; // 50MB
    
    // 유효성 검사
    if (!isValidExtension && !isValidType) {
        validationText.textContent = '지원되지 않는 파일 형식입니다. MP3, WAV, M4A, OGG, FLAC 파일만 업로드 가능합니다.';
        validationMessage.className = 'validation-message validation-error';
        validationMessage.style.display = 'block';
        fileInfo.innerHTML = `<span style="color: var(--danger)">${file.name}</span>`;
        return;
    }
    
    if (file.size > maxSize) {
        validationText.textContent = `파일 크기가 너무 큽니다. (${formatFileSize(file.size)} / 최대 50MB)`;
        validationMessage.className = 'validation-message validation-error';
        validationMessage.style.display = 'block';
        fileInfo.innerHTML = `<span style="color: var(--danger)">${file.name}</span>`;
        return;
    }
    
    // 파일 정보 표시
    fileInfo.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="color: var(--success)">
                <i class="fas fa-check-circle"></i> ${file.name}
            </span>
            <span style="font-size: 0.85rem;">${formatFileSize(file.size)}</span>
        </div>
    `;
    
    // 성공 메시지
    validationText.textContent = '파일이 유효합니다. 파일을 분석 중입니다...';
    validationMessage.className = 'validation-message validation-success';
    validationMessage.style.display = 'block';
    
    // 오디오 파일 길이 분석
    analyzeAudioDuration(file);
}

// 오디오 파일 길이 분석
function analyzeAudioDuration(file) {
    const durationInfo = document.getElementById('fileDurationInfo');
    
    // 오디오 파일을 임시로 로드하여 길이 확인
    const audio = new Audio();
    const objectURL = URL.createObjectURL(file);
    
    audio.src = objectURL;
    
    audio.addEventListener('loadedmetadata', function() {
        const duration = audio.duration;
        durationInfo.textContent = `길이: ${formatTime(duration)}`;
        
        // TL 슬라이더 자동 조정 (파일 길이의 100배까지)
        const timeSlider = document.getElementById('timeSlider');
        if (timeSlider) {
            const minTL = Math.ceil(duration) * 100; // 최소 100배 재생 가능
            timeSlider.min = minTL;
            
            // 현재 값이 최소값보다 작으면 조정
            if (parseInt(timeSlider.value) < minTL) {
                timeSlider.value = minTL;
                updateTLDisplay();
            }
            
            // 권장값 설정 (파일 길이의 500배)
            const recommendedTL = Math.ceil(duration) * 500;
            if (recommendedTL < 10000) { // 최대 10,000 TL 제한
                timeSlider.value = recommendedTL;
                updateTLDisplay();
            }
        }
        
        // 오브젝트 URL 정리
        URL.revokeObjectURL(objectURL);
    });
    
    audio.addEventListener('error', function() {
        durationInfo.textContent = '길이 분석 실패';
        durationInfo.style.color = 'var(--warning)';
    });
}

// TL 디스플레이 업데이트
function updateTLDisplay() {
    const timeSlider = document.getElementById('timeSlider');
    const tlAmount = document.getElementById('tlAmount');
    const totalTimeDisplay = document.getElementById('totalTimeDisplay');
    
    if (timeSlider && tlAmount && totalTimeDisplay) {
        const tlValue = parseInt(timeSlider.value);
        
        // TL 금액 표시 (천단위 콤마)
        tlAmount.textContent = tlValue.toLocaleString() + ' TL';
        
        // 총 재생 시간 계산
        const totalSeconds = tlValue;
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        
        let timeString = '';
        if (hours > 0) {
            timeString += `${hours}시간 `;
        }
        if (minutes > 0 || hours > 0) {
            timeString += `${minutes}분 `;
        }
        timeString += `${seconds}초`;
        
        totalTimeDisplay.textContent = timeString;
    }
}

// TL3 파일 생성
function createTL3File() {
    // 로그인 상태 확인
    const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true' || 
                      localStorage.getItem('isLoggedIn') === 'true';
    
    if (!isLoggedIn) {
        showNotification('TL3 파일을 생성하려면 먼저 로그인해주세요', 'error');
        openLoginModal();
        return;
    }
    
    // 입력값 확인
    const musicTitle = document.getElementById('musicTitle').value.trim();
    const artistName = document.getElementById('artistName').value.trim();
    const fileInput = document.getElementById('musicFileInput');
    
    if (!musicTitle || !artistName) {
        showNotification('음원 제목과 아티스트명을 입력해주세요', 'error');
        return;
    }
    
    if (!fileInput.files || fileInput.files.length === 0) {
        showNotification('음원 파일을 선택해주세요', 'error');
        return;
    }
    
    const tlValue = parseInt(document.getElementById('timeSlider').value);
    
    // TL3 객체 생성
    const tl3File = {
        id: generateId(),
        title: musicTitle,
        artist: artistName,
        genre: document.getElementById('musicGenre').value.trim(),
        tlAmount: tlValue,
        tlRemaining: tlValue,
        file: fileInput.files[0],
        createdAt: new Date().toISOString(),
        owner: sessionStorage.getItem('username') || localStorage.getItem('username') || 'Unknown'
    };
    
    // TL3 파일 목록에 추가
    addTL3ToList(tl3File);
    
    // 플레이어에 전송
    sendToPlayer(tl3File);
    
    // 성공 메시지
    showNotification(`"${musicTitle}" TL3 파일이 생성되었습니다`, 'success');
    
    // 폼 초기화 (파일은 유지)
    document.getElementById('musicTitle').value = '';
    document.getElementById('artistName').value = '';
    document.getElementById('musicGenre').value = '';
    document.getElementById('fileInfo').innerHTML = '파일을 선택해주세요';
    document.getElementById('fileValidation').style.display = 'none';
    document.getElementById('timeSlider').value = '3600';
    updateTLDisplay();
    
    // 파일 입력 초기화
    fileInput.value = '';
}

// TL3 파일 목록에 추가
function addTL3ToList(tl3File) {
    const tl3List = document.getElementById('tl3List');
    const emptyMessage = document.getElementById('emptyLibraryMessage');
    const libraryCount = document.getElementById('libraryCount');
    
    if (emptyMessage) {
        emptyMessage.style.display = 'none';
    }
    
    // 새로운 TL3 아이템 생성
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
    
    // 클릭 이벤트 추가
    tl3Item.addEventListener('click', function() {
        // 활성화 상태 변경
        document.querySelectorAll('.tl3-item').forEach(item => {
            item.classList.remove('active');
        });
        tl3Item.classList.add('active');
        
        // 플레이어에 로드
        loadTL3ToPlayer(tl3File);
    });
    
    // 목록에 추가 (맨 위에)
    tl3List.insertBefore(tl3Item, tl3List.firstChild);
    
    // 카운트 업데이트
    if (libraryCount) {
        const count = document.querySelectorAll('.tl3-item').length;
        libraryCount.textContent = `(${count})`;
    }
    
    // 로컬 스토리지에 저장
    saveTL3ToStorage(tl3File);
}

// 플레이어에 TL3 파일 전송
function sendToPlayer(tl3File) {
    // 현재 트랙 정보 업데이트
    document.getElementById('currentTrack').textContent = tl3File.title;
    document.getElementById('currentArtist').textContent = tl3File.artist;
    document.getElementById('currentTL').textContent = `남은 TL: ${tl3File.tlRemaining.toLocaleString()}`;
    
    // 잔여 TL 업데이트
    document.getElementById('remainingTL').textContent = tl3File.tlRemaining.toLocaleString();
    
    // 앨범 아트 업데이트
    const albumArt = document.getElementById('albumArt');
    albumArt.innerHTML = '<i class="fas fa-music"></i>';
    albumArt.style.background = 'rgba(139, 92, 246, 0.1)';
    
    // 재생 버튼 활성화
    document.getElementById('playBtn').disabled = false;
}

// 샘플 TL3 파일 추가 (테스트용)
function addSampleTL3Files() {
    const sampleFiles = [
        {
            id: 'sample1',
            title: 'Neon Dreams',
            artist: 'Synthwave AI',
            genre: 'Synthwave',
            tlAmount: 5000,
            tlRemaining: 5000,
            createdAt: '2024-01-15T10:30:00Z'
        },
        {
            id: 'sample2',
            title: 'Ocean Breeze',
            artist: 'Ambient Generator',
            genre: 'Ambient',
            tlAmount: 7200,
            tlRemaining: 7200,
            createdAt: '2024-01-10T14:20:00Z'
        }
    ];
    
    // 2초 후에 샘플 파일 추가
    setTimeout(() => {
        sampleFiles.forEach(file => addTL3ToList(file));
    }, 2000);
}

// 로컬 스토리지에 TL3 저장
function saveTL3ToStorage(tl3File) {
    try {
        const storedTL3 = JSON.parse(localStorage.getItem('tl3Library')) || [];
        storedTL3.unshift(tl3File);
        localStorage.setItem('tl3Library', JSON.stringify(storedTL3));
    } catch (error) {
        console.error('TL3 저장 실패:', error);
    }
}

// 플레이어 기능들
let currentAudio = null;
let isPlaying = false;
let currentTL3 = null;

function togglePlay() {
    if (!currentTL3) {
        showNotification('재생할 TL3 파일을 선택해주세요', 'error');
        return;
    }
    
    if (isPlaying) {
        pauseAudio();
    } else {
        playAudio();
    }
}

function playAudio() {
    // 실제 구현에서는 오디오 파일 재생 로직이 필요
    showNotification('오디오 재생 시작', 'info');
    isPlaying = true;
    document.getElementById('playIcon').className = 'fas fa-pause';
}

function pauseAudio() {
    showNotification('오디오 일시정지', 'info');
    isPlaying = false;
    document.getElementById('playIcon').className = 'fas fa-play';
}

function playPrev() {
    showNotification('이전 트랙', 'info');
}

function playNext() {
    showNotification('다음 트랙', 'info');
}

function seekAudio(e) {
    const progressBar = e.currentTarget;
    const clickPosition = e.offsetX;
    const totalWidth = progressBar.clientWidth;
    const percentage = (clickPosition / totalWidth) * 100;
    
    document.getElementById('progress').style.width = percentage + '%';
}

function loadTL3ToPlayer(tl3File) {
    currentTL3 = tl3File;
    
    document.getElementById('currentTrack').textContent = tl3File.title;
    document.getElementById('currentArtist').textContent = tl3File.artist;
    document.getElementById('currentTL').textContent = `남은 TL: ${tl3File.tlRemaining.toLocaleString()}`;
    document.getElementById('remainingTL').textContent = tl3File.tlRemaining.toLocaleString();
}

// TL 충전 (테스트용)
function chargeTL(amount) {
    // 로그인 상태 확인
    const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true' || 
                      localStorage.getItem('isLoggedIn') === 'true';
    
    if (!isLoggedIn) {
        showNotification('TL을 충전하려면 먼저 로그인해주세요', 'error');
        openLoginModal();
        return;
    }
    
    // 현재 선택된 TL3 파일에 충전
    if (currentTL3) {
        currentTL3.tlRemaining += amount;
        currentTL3.tlAmount += amount;
        
        // 화면 업데이트
        document.getElementById('currentTL').textContent = `남은 TL: ${currentTL3.tlRemaining.toLocaleString()}`;
        document.getElementById('remainingTL').textContent = currentTL3.tlRemaining.toLocaleString();
        
        // TL3 목록 업데이트
        const tl3Item = document.querySelector(`.tl3-item[data-id="${currentTL3.id}"]`);
        if (tl3Item) {
            const tlElement = tl3Item.querySelector('.tl3-item-info div:nth-child(3)');
            if (tlElement) {
                tlElement.innerHTML = `<i class="fas fa-coins"></i> ${currentTL3.tlRemaining.toLocaleString()} TL`;
            }
        }
        
        showNotification(`${amount.toLocaleString()} TL이 충전되었습니다`, 'success');
    } else {
        showNotification('먼저 TL3 파일을 선택해주세요', 'error');
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
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// 전역 함수로 노출
window.chargeTL = chargeTL;
