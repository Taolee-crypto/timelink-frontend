// studio.js - TL3 스튜디오 메인 기능

document.addEventListener('DOMContentLoaded', function() {
    console.log('studio.js 로드됨');
    
    // 1. 파일 선택 버튼 이벤트 핸들러
    setupFileSelection();
    
    // 2. TL 슬라이더 이벤트 핸들러
    setupTLSlider();
    
    // 3. TL3 생성 버튼 이벤트 핸들러
    setupCreateButton();
    
    // 4. 플레이어 컨트롤 이벤트 핸들러
    setupPlayerControls();
    
    // 5. 샘플 데이터 로드
    loadSampleData();
});

// 파일 선택 설정
function setupFileSelection() {
    const selectFileBtn = document.getElementById('selectFileBtn');
    const fileInput = document.getElementById('musicFileInput');
    const uploadArea = document.getElementById('uploadArea');
    const fileInfo = document.getElementById('fileInfo');
    
    if (!selectFileBtn || !fileInput) {
        console.error('필수 요소를 찾을 수 없습니다');
        return;
    }
    
    // 파일 선택 버튼 클릭 이벤트
    selectFileBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        console.log('파일 선택 버튼 클릭됨');
        fileInput.click();
    });
    
    // 업로드 영역 클릭 이벤트
    if (uploadArea) {
        uploadArea.addEventListener('click', function() {
            console.log('업로드 영역 클릭됨');
            fileInput.click();
        });
    }
    
    // 파일 입력 변경 이벤트
    fileInput.addEventListener('change', function(e) {
        console.log('파일 변경됨:', e.target.files[0]?.name);
        const file = e.target.files[0];
        
        if (file) {
            // 파일 정보 표시
            if (fileInfo) {
                fileInfo.innerHTML = `
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <i class="fas fa-check-circle" style="color: var(--success);"></i>
                        <span style="color: var(--success); font-weight: 600;">${file.name}</span>
                    </div>
                    <div style="font-size: 0.85rem; margin-top: 0.25rem;">
                        크기: ${formatFileSize(file.size)} | 
                        형식: ${file.type || getFileExtension(file.name)}
                    </div>
                `;
            }
            
            // 파일 유효성 검사
            validateFile(file);
        }
    });
    
    // 드래그 앤 드롭 이벤트
    if (uploadArea) {
        // 드래그 오버
        uploadArea.addEventListener('dragover', function(e) {
            e.preventDefault();
            e.stopPropagation();
            uploadArea.style.borderColor = 'var(--creator)';
            uploadArea.style.background = 'rgba(139, 92, 246, 0.1)';
        });
        
        // 드래그 리브
        uploadArea.addEventListener('dragleave', function(e) {
            e.preventDefault();
            e.stopPropagation();
            uploadArea.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            uploadArea.style.background = 'rgba(26, 26, 46, 0.3)';
        });
        
        // 드롭
        uploadArea.addEventListener('drop', function(e) {
            e.preventDefault();
            e.stopPropagation();
            uploadArea.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            uploadArea.style.background = 'rgba(26, 26, 46, 0.3)';
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                const file = files[0];
                
                // DataTransfer에서 파일을 FileInput에 설정
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(file);
                fileInput.files = dataTransfer.files;
                
                // change 이벤트 트리거
                const changeEvent = new Event('change', { bubbles: true });
                fileInput.dispatchEvent(changeEvent);
            }
        });
    }
}

// 파일 유효성 검사
function validateFile(file) {
    const validationMessage = document.getElementById('fileValidation');
    const validationText = document.getElementById('validationText');
    const durationInfo = document.getElementById('fileDurationInfo');
    
    if (!validationMessage || !validationText) return;
    
    // 허용된 확장자
    const allowedExtensions = ['.mp3', '.wav', '.m4a', '.ogg', '.flac'];
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
        'audio/flac'
    ];
    
    let isValid = false;
    
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
    }
    
    if (!isValid) {
        validationText.innerHTML = `
            <i class="fas fa-exclamation-circle"></i> 
            지원되지 않는 파일 형식입니다.
            <br>지원 형식: MP3, WAV, M4A, OGG, FLAC
        `;
        validationMessage.className = 'validation-message validation-error';
        validationMessage.style.display = 'block';
        return;
    }
    
    // 파일 크기 검사 (50MB)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
        validationText.innerHTML = `
            <i class="fas fa-exclamation-circle"></i> 
            파일 크기가 너무 큽니다 (최대 50MB).
            <br>현재 파일 크기: ${formatFileSize(file.size)}
        `;
        validationMessage.className = 'validation-message validation-error';
        validationMessage.style.display = 'block';
        return;
    }
    
    // 성공 메시지
    validationText.innerHTML = `
        <i class="fas fa-check-circle"></i> 
        파일이 유효합니다. 오디오 길이를 분석하는 중...
    `;
    validationMessage.className = 'validation-message validation-success';
    validationMessage.style.display = 'block';
    
    // 오디오 길이 분석
    analyzeAudioDuration(file, durationInfo);
}

// 오디오 길이 분석
function analyzeAudioDuration(file, durationElement) {
    if (!durationElement) return;
    
    const audio = new Audio();
    const objectURL = URL.createObjectURL(file);
    
    audio.src = objectURL;
    audio.preload = 'metadata';
    
    audio.addEventListener('loadedmetadata', function() {
        const duration = audio.duration;
        durationElement.innerHTML = `
            <i class="fas fa-clock"></i> 
            재생 시간: ${formatTime(duration)} (${Math.round(duration)}초)
        `;
        URL.revokeObjectURL(objectURL);
    });
    
    audio.addEventListener('error', function() {
        durationElement.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i> 
            길이 분석 실패
        `;
        URL.revokeObjectURL(objectURL);
    });
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
        id: 'tl3_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
        title: musicTitle,
        artist: artistName,
        genre: musicGenre || '미지정',
        tlAmount: tlValue,
        tlRemaining: tlValue,
        fileName: fileInput.files[0].name,
        fileSize: fileInput.files[0].size,
        createdAt: new Date().toISOString(),
        isSample: false
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
    
    // 로컬 스토리지에 저장
    saveTL3ToStorage(tl3File);
}

// 플레이어에 전송
function sendToPlayer(tl3File) {
    console.log('플레이어에 전송:', tl3File.title);
    
    // 현재 트랙 정보 업데이트
    document.getElementById('currentTrack').textContent = tl3File.title;
    document.getElementById('currentArtist').textContent = tl3File.artist;
    document.getElementById('currentTL').textContent = `남은 TL: ${tl3File.tlRemaining.toLocaleString()}`;
    
    // TL 정보 업데이트
    document.getElementById('remainingTL').textContent = tl3File.tlRemaining.toLocaleString();
    document.getElementById('tlUsed').textContent = `사용: 0 TL`;
    
    // 재생 버튼 활성화
    const playBtn = document.getElementById('playBtn');
    if (playBtn) {
        playBtn.disabled = false;
    }
    
    // 앨범 아트 업데이트
    updateAlbumArt(tl3File.genre);
}

// 앨범 아트 업데이트
function updateAlbumArt(genre) {
    const albumArt = document.getElementById('albumArt');
    if (!albumArt) return;
    
    // 장르에 따른 아이콘 선택
    let icon = 'fas fa-music';
    let color = 'var(--creator)';
    
    if (genre.includes('Electronic') || genre.includes('EDM')) {
        icon = 'fas fa-bolt';
        color = '#FF6B35';
    } else if (genre.includes('Chill') || genre.includes('Ambient')) {
        icon = 'fas fa-cloud';
        color = '#00D4AA';
    } else if (genre.includes('Rock') || genre.includes('Metal')) {
        icon = 'fas fa-guitar';
        color = '#EF4444';
    } else if (genre.includes('Jazz') || genre.includes('Blues')) {
        icon = 'fas fa-saxophone';
        color = '#9D4EDD';
    }
    
    albumArt.innerHTML = `<i class="${icon}"></i>`;
    albumArt.style.background = `rgba(${hexToRgb(color)}, 0.1)`;
    albumArt.style.color = color;
}

// 플레이어 컨트롤 설정
function setupPlayerControls() {
    const playBtn = document.getElementById('playBtn');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const progressBar = document.getElementById('progressBar');
    
    if (playBtn) {
        playBtn.addEventListener('click', togglePlayPause);
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
}

// 재생/일시정지 토글
function togglePlayPause() {
    const playIcon = document.getElementById('playIcon');
    const isPlaying = playIcon.classList.contains('fa-pause');
    
    if (isPlaying) {
        // 일시정지
        playIcon.className = 'fas fa-play';
        showNotification('재생 일시정지', 'info');
    } else {
        // 재생
        playIcon.className = 'fas fa-pause';
        showNotification('음원 재생 시작', 'success');
        
        // TL 차감 시뮬레이션 시작
        startTLConsumption();
    }
}

// 이전 트랙
function playPrev() {
    showNotification('이전 트랙으로 이동', 'info');
}

// 다음 트랙
function playNext() {
    showNotification('다음 트랙으로 이동', 'info');
}

// 오디오 탐색
function seekAudio(e) {
    const progressBar = e.currentTarget;
    const clickPosition = e.offsetX;
    const totalWidth = progressBar.clientWidth;
    const percentage = (clickPosition / totalWidth) * 100;
    
    document.getElementById('progress').style.width = percentage + '%';
    
    // 시간 업데이트
    const currentTime = document.getElementById('currentTime');
    if (currentTime) {
        const totalSeconds = 180; // 샘플 길이
        const currentSeconds = Math.round((percentage / 100) * totalSeconds);
        currentTime.textContent = formatTime(currentSeconds);
    }
}

// TL 소비 시뮬레이션
function startTLConsumption() {
    const remainingTL = document.getElementById('remainingTL');
    const consumptionProgress = document.getElementById('consumptionProgress');
    
    if (!remainingTL || !consumptionProgress) return;
    
    let tlAmount = parseInt(remainingTL.textContent.replace(/,/g, '') || '0');
    let progress = 0;
    
    // 1초마다 TL 차감
    const interval = setInterval(() => {
        if (tlAmount <= 0) {
            clearInterval(interval);
            document.getElementById('playIcon').className = 'fas fa-play';
            showNotification('TL이 모두 소진되었습니다', 'warning');
            return;
        }
        
        // TL 차감
        tlAmount -= 1;
        progress = ((tlAmount - 1) / (tlAmount + 1)) * 100;
        
        // UI 업데이트
        remainingTL.textContent = tlAmount.toLocaleString();
        document.getElementById('currentTL').textContent = `남은 TL: ${tlAmount.toLocaleString()}`;
        consumptionProgress.style.width = `${100 - progress}%`;
        
        // 사용량 업데이트
        const totalTL = tlAmount + (100 - progress);
        document.getElementById('tlUsed').textContent = `사용: ${Math.round(100 - progress)} TL`;
        
    }, 1000); // 1초마다
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
            fileSize: 10240000,
            createdAt: '2024-01-15T10:30:00Z',
            isSample: true
        },
        {
            id: 'sample_2',
            title: 'Ocean Breeze',
            artist: 'Ambient Generator',
            genre: 'Chill Ambient',
            tlAmount: 7200,
            tlRemaining: 7200,
            fileName: 'ocean_breeze.wav',
            fileSize: 20480000,
            createdAt: '2024-01-10T14:20:00Z',
            isSample: true
        }
    ];
    
    // 1초 후 샘플 데이터 추가
    setTimeout(() => {
        sampleTL3Files.forEach(file => {
            addTL3ToList(file);
        });
    }, 1000);
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

function getFileExtension(filename) {
    return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
}

function hexToRgb(hex) {
    // #RRGGBB 또는 #RGB 형식 처리
    hex = hex.replace('#', '');
    
    if (hex.length === 3) {
        hex = hex.split('').map(char => char + char).join('');
    }
    
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    return `${r}, ${g}, ${b}`;
}

// TL 충전 함수 (전역에서 접근 가능하게)
window.chargeTL = function(amount) {
    const remainingTL = document.getElementById('remainingTL');
    if (!remainingTL || remainingTL.textContent === '-') {
        showNotification('먼저 TL3 파일을 선택해주세요', 'error');
        return;
    }
    
    let currentTL = parseInt(remainingTL.textContent.replace(/,/g, '') || '0');
    currentTL += amount;
    
    // UI 업데이트
    remainingTL.textContent = currentTL.toLocaleString();
    document.getElementById('currentTL').textContent = `남은 TL: ${currentTL.toLocaleString()}`;
    
    // 선택된 TL3 항목 업데이트
    const activeItem = document.querySelector('.tl3-item.active');
    if (activeItem) {
        const tlElement = activeItem.querySelector('.tl3-item-info div:nth-child(3)');
        if (tlElement) {
            tlElement.innerHTML = `<i class="fas fa-coins"></i> ${currentTL.toLocaleString()} TL`;
        }
    }
    
    showNotification(`${amount.toLocaleString()} TL이 충전되었습니다!`, 'success');
};
