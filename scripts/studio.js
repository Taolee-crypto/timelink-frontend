// 변환 타입 선택 이벤트 설정
document.addEventListener('DOMContentLoaded', function() {
    setupStudioEventListeners();
});

function setupStudioEventListeners() {
    // 변환 타입 선택
    document.querySelectorAll('.type-option').forEach(option => {
        option.addEventListener('click', function() {
            document.querySelectorAll('.type-option').forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            conversionType = this.dataset.type;
            
            // 파일 입력 accept 속성 변경
            const fileInput = document.getElementById('fileInput');
            if (conversionType === 'tl3') {
                fileInput.accept = 'audio/*';
            } else {
                fileInput.accept = 'video/*';
            }
        });
    });
    
    // 드래그 앤 드롭 이벤트
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    
    dropZone.addEventListener('click', () => fileInput.click());
    
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('active');
    });
    
    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('active');
    });
    
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('active');
        
        if (e.dataTransfer.files.length) {
            fileInput.files = e.dataTransfer.files;
            // 파일 선택 시 파일 이름 표시
            dropZone.querySelector('p').textContent = `선택된 파일: ${e.dataTransfer.files[0].name}`;
        }
    });
    
    fileInput.addEventListener('change', () => {
        if (fileInput.files.length) {
            dropZone.querySelector('p').textContent = `선택된 파일: ${fileInput.files[0].name}`;
        }
    });
    
    // 플레이어 이벤트
    const audioPlayer = document.getElementById('audioPlayer');
    const videoPlayer = document.getElementById('videoPlayer');
    
    audioPlayer.addEventListener('ended', function() {
        handlePlaybackEnded();
    });
    
    videoPlayer.addEventListener('ended', function() {
        handlePlaybackEnded();
    });
}

// 파일 변환
async function convertFile() {
    const fileInput = document.getElementById('fileInput');
    const statusEl = document.getElementById('convertStatus');
    
    if (!fileInput.files[0]) {
        showStatus('convertStatus', '파일을 선택해주세요.', 'error');
        return;
    }
    
    if (currentUser.tl < 500) {
        showStatus('convertStatus', 'TL이 부족합니다. 충전이 필요합니다.', 'error');
        return;
    }
    
    // 파일 타입 검증
    const file = fileInput.files[0];
    if (conversionType === 'tl3' && !file.type.startsWith('audio/')) {
        showStatus('convertStatus', 'TL3는 오디오 파일만 변환 가능합니다.', 'error');
        return;
    }
    
    if (conversionType === 'tl4' && !file.type.startsWith('video/')) {
        showStatus('convertStatus', 'TL4는 비디오 파일만 변환 가능합니다.', 'error');
        return;
    }
    
    // 백엔드 API 호출 - 파일 업로드 및 변환
    try {
        showStatus('convertStatus', '파일 변환 중...', 'warning');
        
        // 실제로는 FormData를 사용하여 파일 업로드
        const formData = new FormData();
        formData.append('file', fileInput.files[0]);
        formData.append('type', conversionType);
        formData.append('pricePerSecond', document.getElementById('pricePerSecond').value);
        
        // 데모용 가상 응답
        setTimeout(() => {
            const newFile = {
                id: Date.now(),
                title: fileInput.files[0].name.replace(/\.[^/.]+$/, ""),
                type: conversionType,
                fileType: fileInput.files[0].type,
                pricePerSecond: parseFloat(document.getElementById('pricePerSecond').value),
                playTime: 0,
                totalTime: 0,
                usedTime: 0,
                chargedTL: 0,
                fileUrl: URL.createObjectURL(fileInput.files[0]),
                owner: currentUser.name,
                ownerId: currentUser.id,
                uploaded: false,
                lastPosition: 0
            };
            
            userFiles.push(newFile);
            currentUser.tl -= 500; // 변환 비용 차감
            
            updateUserDisplay();
            updateLibraryDisplay();
            updateFileSelect();
            updateUploadFileSelect();
            saveDataToStorage();
            
            showStatus('convertStatus', `${conversionType.toUpperCase()} 파일이 생성되었습니다! 파일에 TL을 충전해주세요.`, 'success');
            
            fileInput.value = '';
            document.getElementById('dropZone').querySelector('p').textContent = '파일을 여기에 드래그하거나 클릭하여 선택하세요';
            
            // 자동으로 충전 탭으로 이동
            setTimeout(() => {
                switchTab('library');
            }, 1500);
            
        }, 1500);
        
    } catch (error) {
        showStatus('convertStatus', '파일 변환 중 오류가 발생했습니다.', 'error');
        console.error('Conversion error:', error);
    }
}

// 재생 종료 처리
function handlePlaybackEnded() {
    if (currentPlayingFile) {
        const file = userFiles.find(f => f.id === currentPlayingFile);
        if (file) {
            file.usedTime = file.totalTime;
            file.playTime = 0;
            updateLibraryDisplay();
            saveDataToStorage();
        }
    }
}
