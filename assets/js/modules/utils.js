// 시간 포맷팅
export function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// 메시지 표시
export function showMessage(message, type, elementId) {
  const element = elementId ? document.getElementById(elementId) : null;
  
  if (element) {
    element.innerHTML = `
      <div style="padding: 10px; background: ${type === 'error' ? '#ffebee' : type === 'success' ? '#e8f5e9' : '#e3f2fd'}; 
                  color: ${type === 'error' ? '#c62828' : type === 'success' ? '#2e7d32' : '#1565c0'}; 
                  border-radius: 5px; margin: 10px 0;">
          ${message}
      </div>
    `;
  } else {
    alert(message);
  }
}

// 데이터 저장/로드
export function saveToLocalStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('저장 오류:', e);
  }
}

export function loadFromLocalStorage(key, defaultValue = null) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (e) {
    console.error('로드 오류:', e);
    return defaultValue;
  }
}

// 파일 업로드 처리
export function setupDropZone(zoneId, fileType = 'audio/*', onUpload) {
  const zone = document.getElementById(zoneId);
  if (!zone) return;
  
  zone.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = fileType;
    input.onchange = (e) => {
      if (onUpload) onUpload(e.target.files[0], zoneId);
    };
    input.click();
  });
  
  // 드래그 앤 드롭 이벤트
  zone.addEventListener('dragover', (e) => {
    e.preventDefault();
    zone.style.borderColor = '#536dfe';
  });
  
  zone.addEventListener('dragleave', () => {
    zone.style.borderColor = '#ccc';
  });
  
  zone.addEventListener('drop', (e) => {
    e.preventDefault();
    zone.style.borderColor = '#ccc';
    if (e.dataTransfer.files.length && onUpload) {
      onUpload(e.dataTransfer.files[0], zoneId);
    }
  });
}
