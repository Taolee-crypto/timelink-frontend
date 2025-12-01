// 사용자 파일 로드
function loadUserFiles() {
    updateLibraryDisplay();
    updateFileSelect();
    updateUploadFileSelect();
}

// 라이브러리 표시 업데이트
function updateLibraryDisplay() {
    const libraryList = document.getElementById('libraryList');
    libraryList.innerHTML = '';
    
    if (userFiles.length === 0) {
        libraryList.innerHTML = '<div style="text-align: center; padding: 20px; color: #666;">라이브러리가 비어 있습니다.</div>';
        return;
    }
    
    userFiles.forEach(file => {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        
        const lastPositionInfo = file.lastPosition > 0 ? 
            `<div style="font-size: 0.8rem; color: #888; margin-top: 5px;">마지막 재생 위치: ${formatTime(Math.floor(file.lastPosition))}</div>` : '';
        
        fileItem.innerHTML = `
            <div class="file-info">
                <div class="file-title">
                    ${file.title}
                    <span class="file-type-badge">${file.type.toUpperCase()}</span>
                    ${file.uploaded ? '<span style="background: #4CAF50; color: white; padding: 2px 8px; border-radius: 10px; font-size: 0.7rem;">업로드됨</span>' : ''}
                </div>
                <div class="file-meta">
                    재생 시간: ${formatTime(file.playTime)} | 
                    충전된 TL: ${file.chargedTL.toLocaleString()} TL |
                    초당 가격: ${file.pricePerSecond} TL
                </div>
                ${lastPositionInfo}
            </div>
            <div class="file-actions">
                <button onclick="playFile(${file.id})" ${file.playTime <= 0 ? 'disabled' : ''}>재생</button>
                <button onclick="quickCharge(${file.id}, 1000)" class="btn-warning">1,000 TL 충전</button>
            </div>
        `;
        libraryList.appendChild(fileItem);
    });
}

// 파일에 TL 충전
async function chargeSelectedFile() {
    const fileSelect = document.getElementById('fileSelect');
    const chargeAmount = parseInt(document.getElementById('chargeAmount').value);
    
    if (!fileSelect.value) {
        showStatus('fileChargeStatus', '파일을 선택해주세요.', 'error');
        return;
    }
    
    if (!chargeAmount || chargeAmount < 100) {
        showStatus('fileChargeStatus', '100 TL 이상 충전해주세요.', 'error');
        return;
    }
    
    if (currentUser.tl < chargeAmount) {
        showStatus('fileChargeStatus', 'TL이 부족합니다.', 'error');
        return;
    }
    
    const fileId = parseInt(fileSelect.value);
    const file = userFiles.find(f => f.id === fileId);
    
    if (!file) {
        showStatus('fileChargeStatus', '파일을 찾을 수 없습니다.', 'error');
        return;
    }
    
    try {
        file.chargedTL += chargeAmount;
        file.playTime = Math.floor(file.chargedTL / file.pricePerSecond);
        file.totalTime = file.playTime;
        currentUser.tl -= chargeAmount;
        
        updateUserDisplay();
        updateLibraryDisplay();
        saveDataToStorage();
        
        showStatus('fileChargeStatus', `${chargeAmount} TL이 충전되었습니다. 재생 가능 시간: ${formatTime(file.playTime)}`, 'success');
        
        document.getElementById('chargeAmount').value = '';
        
        // 자동 재생 옵션
        if (confirm('충전이 완료되었습니다. 지금 재생하시겠습니까?')) {
            playFile(fileId);
            switchTab('studio');
        }
        
    } catch (error) {
        showStatus('fileChargeStatus', '충전 중 오류가 발생했습니다.', 'error');
        console.error('Charge error:', error);
    }
}

// 충전 금액 빠른 설정
function setChargeAmount(amount) {
    document.getElementById('chargeAmount').value = amount;
}

// TL 마켓에 업로드
async function uploadToMarket() {
    const uploadFileSelect = document.getElementById('uploadFileSelect');
    
    if (!uploadFileSelect.value) {
        showStatus('uploadStatus', '업로드할 파일을 선택해주세요.', 'error');
        return;
    }
    
    if (currentUser.tl < 300) {
        showStatus('uploadStatus', 'TL이 부족합니다. 업로드 비용은 300 TL입니다.', 'error');
        return;
    }
    
    const fileId = parseInt(uploadFileSelect.value);
    const file = userFiles.find(f => f.id === fileId);
    
    if (!file) {
        showStatus('uploadStatus', '파일을 찾을 수 없습니다.', 'error');
        return;
    }
    
    if (file.type !== 'tl3') {
        showStatus('uploadStatus', 'TL 마켓에는 TL3 파일만 업로드 가능합니다.', 'error');
        return;
    }
    
    if (file.uploaded) {
        showStatus('uploadStatus', '이미 업로드된 파일입니다.', 'error');
        return;
    }
    
    try {
        file.uploaded = true;
        currentUser.tl -= 300; // 업로드 비용 차감
        
        // 마켓에 파일 추가
        const marketFile = {
            ...file,
            marketId: Date.now(),
            purchasePrice: Math.floor(file.pricePerSecond * 300), // 5분 기준 가격
            purchases: 0,
            totalEarnings: 0
        };
        
        marketFiles.push(marketFile);
        
        updateUserDisplay();
        updateLibraryDisplay();
        updateUploadFileSelect();
        loadMarketItems();
        saveDataToStorage();
        
        showStatus('uploadStatus', 'TL 마켓에 파일이 업로드되었습니다!', 'success');
        
        // 통계 업데이트
        userStats.uploadedFiles++;
        updateStats();
        
    } catch (error) {
        showStatus('uploadStatus', '업로드 중 오류가 발생했습니다.', 'error');
        console.error('Upload error:', error);
    }
}

// TL Tube에 업로드
async function uploadToTube() {
    const uploadFileSelect = document.getElementById('uploadFileSelect');
    
    if (!uploadFileSelect.value) {
        showStatus('uploadStatus', '업로드할 파일을 선택해주세요.', 'error');
        return;
    }
    
    if (currentUser.tl < 300) {
        showStatus('uploadStatus', 'TL이 부족합니다. 업로드 비용은 300 TL입니다.', 'error');
        return;
    }
    
    const fileId = parseInt(uploadFileSelect.value);
    const file = userFiles.find(f => f.id === fileId);
    
    if (!file) {
        showStatus('uploadStatus', '파일을 찾을 수 없습니다.', 'error');
        return;
    }
    
    if (file.type !== 'tl4') {
        showStatus('uploadStatus', 'TL Tube에는 TL4 파일만 업로드 가능합니다.', 'error');
        return;
    }
    
    if (file.uploaded) {
        showStatus('uploadStatus', '이미 업로드된 파일입니다.', 'error');
        return;
    }
    
    try {
        file.uploaded = true;
        currentUser.tl -= 300; // 업로드 비용 차감
        
        // Tube에 파일 추가
        const tubeFile = {
            ...file,
            tubeId: Date.now(),
            purchasePrice: Math.floor(file.pricePerSecond * 300), // 5분 기준 가격
            purchases: 0,
            totalEarnings: 0
        };
        
        tubeFiles.push(tubeFile);
        
        updateUserDisplay();
        updateLibraryDisplay();
        updateUploadFileSelect();
        loadVideoItems();
        saveDataToStorage();
        
        showStatus('uploadStatus', 'TL Tube에 파일이 업로드되었습니다!', 'success');
        
        // 통계 업데이트
        userStats.uploadedFiles++;
        updateStats();
        
    } catch (error) {
        showStatus('uploadStatus', '업로드 중 오류가 발생했습니다.', 'error');
        console.error('Upload error:', error);
    }
}

// 파일 재생
function playFile(fileId) {
    const file = userFiles.find(f => f.id === fileId);
    
    if (!file) {
        alert('파일을 찾을 수 없습니다.');
        return;
    }
    
    if (file.playTime <= 0) {
        alert('재생 시간이 없습니다. TL을 충전해주세요.');
        return;
    }
    
    // 이전 재생 중지
    if (timeInterval) {
        clearInterval(timeInterval);
    }
    
    // 플레이어 초기화
    const audioPlayer = document.getElementById('audioPlayer');
    const videoPlayer = document.getElementById('videoPlayer');
    const audioPlayerSection = document.getElementById('audioPlayerSection');
    const videoPlayerSection = document.getElementById('videoPlayerSection');
    
    audioPlayer.pause();
    videoPlayer.pause();
    audioPlayer.src = '';
    videoPlayer.src = '';
    
    // 파일 타입에 따라 적절한 플레이어 표시
    if (file.type === 'tl3') {
        audioPlayerSection.style.display = 'block';
        videoPlayerSection.style.display = 'none';
        audioPlayer.src = file.fileUrl;
        audioPlayer.load();
        
        // 마지막 재생 위치 복원
        if (file.lastPosition > 0) {
            audioPlayer.currentTime = file.lastPosition;
        }
    } else {
        audioPlayerSection.style.display = 'none';
        videoPlayerSection.style.display = 'block';
        videoPlayer.src = file.fileUrl;
        videoPlayer.load();
        
        // 마지막 재생 위치 복원
        if (file.lastPosition > 0) {
            videoPlayer.currentTime = file.lastPosition;
        }
    }
    
    // 시간 정보 설정
    document.getElementById('remainingTime').textContent = formatTime(file.playTime);
    document.getElementById('totalTime').textContent = formatTime(file.totalTime);
    document.getElementById('usedTime').textContent = formatTime(file.usedTime);
    document.getElementById('nowPlaying').textContent = `현재 재생 중: ${file.title} (${file.type.toUpperCase()})`;
    
    currentPlayingFile = fileId;
    
    // 재생 시작
    if (file.type === 'tl3') {
        audioPlayer.play().catch(error => {
            alert('재생을 시작할 수 없습니다.');
        });
    } else {
        videoPlayer.play().catch(error => {
            alert('재생을 시작할 수 없습니다.');
        });
    }
    
    // 시간 감소 추적
    timeInterval = setInterval(() => {
        if (file.playTime > 0) {
            const isPlaying = file.type === 'tl3' ? !audioPlayer.paused : !videoPlayer.paused;
            
            if (isPlaying) {
                file.playTime--;
                file.usedTime++;
                
                // 현재 재생 위치 저장
                file.lastPosition = file.type === 'tl3' ? audioPlayer.currentTime : videoPlayer.currentTime;
                
                document.getElementById('remainingTime').textContent = formatTime(file.playTime);
                document.getElementById('usedTime').textContent = formatTime(file.usedTime);
                
                if (file.playTime <= 0) {
                    if (file.type === 'tl3') {
                        audioPlayer.pause();
                    } else {
                        videoPlayer.pause();
                    }
                    clearInterval(timeInterval);
                    alert('재생 시간이 모두 소진되었습니다.');
                    updateLibraryDisplay();
                    saveDataToStorage();
                }
            }
        }
    }, 1000);
}

// 빠른 충전 기능
function quickCharge(fileId, amount) {
    const file = userFiles.find(f => f.id === fileId);
    
    if (!file) {
        alert('파일을 찾을 수 없습니다.');
        return;
    }
    
    if (currentUser.tl < amount) {
        alert('TL이 부족합니다.');
        return;
    }
    
    // 충전 처리
    file.chargedTL += amount;
    file.playTime = Math.floor(file.chargedTL / file.pricePerSecond);
    file.totalTime = file.playTime;
    currentUser.tl -= amount;
    
    updateUserDisplay();
    updateLibraryDisplay();
    saveDataToStorage();
    
    // 자동 재생
    playFile(fileId);
    switchTab('studio');
}

// 파일 선택 드롭다운 업데이트
function updateFileSelect() {
    const fileSelect = document.getElementById('fileSelect');
    fileSelect.innerHTML = '<option value="">파일 선택</option>';
    
    userFiles.forEach(file => {
        const option = document.createElement('option');
        option.value = file.id;
        option.textContent = `${file.title} (${file.type.toUpperCase()})`;
        fileSelect.appendChild(option);
    });
}

// 업로드 파일 선택 드롭다운 업데이트
function updateUploadFileSelect() {
    const uploadFileSelect = document.getElementById('uploadFileSelect');
    uploadFileSelect.innerHTML = '<option value="">업로드할 파일 선택</option>';
    
    userFiles.forEach(file => {
        if (!file.uploaded) {
            const option = document.createElement('option');
            option.value = file.id;
            option.textContent = `${file.title} (${file.type.toUpperCase()})`;
            uploadFileSelect.appendChild(option);
        }
    });
}
