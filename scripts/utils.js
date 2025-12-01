// 유틸리티 함수들

// 시간 포맷팅 (초 -> MM:SS)
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// 숫자에 천단위 콤마 추가
function formatNumber(num) {
    return num.toLocaleString();
}

// 상태 메시지 표시
function showStatus(elementId, message, type = 'success') {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = message;
        element.className = `status ${type}`;
        
        // 일정 시간 후 메시지 제거
        if (type !== 'error') {
            setTimeout(() => {
                element.textContent = '';
                element.className = 'status';
            }, 3000);
        }
    }
}

// 파일 크기 포맷팅
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// 파일 타입 확인
function getFileType(fileName) {
    const extension = fileName.split('.').pop().toLowerCase();
    const audioExtensions = ['mp3', 'wav', 'ogg', 'flac', 'm4a', 'aac'];
    const videoExtensions = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv', 'webm'];
    
    if (audioExtensions.includes(extension)) return 'audio';
    if (videoExtensions.includes(extension)) return 'video';
    return 'other';
}

// 입력값 검증
function validateInput(value, min, max) {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return false;
    if (numValue < min || numValue > max) return false;
    return true;
}

// 로컬 스토리지 저장
function saveToLocalStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (error) {
        console.error('Local storage save error:', error);
        return false;
    }
}

// 로컬 스토리지에서 로드
function loadFromLocalStorage(key) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Local storage load error:', error);
        return null;
    }
}

// UUID 생성
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// 파일 URL 생성 (데모용)
function createFileURL(file, type) {
    if (file instanceof File) {
        return URL.createObjectURL(file);
    }
    // 데모용 더미 URL 생성
    return type === 'audio' ? 'assets/demo-audio.mp3' : 'assets/demo-video.mp4';
}

// 날짜 포맷팅
function formatDate(date) {
    const d = new Date(date);
    return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getDate().toString().padStart(2, '0')} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
}
