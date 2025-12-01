// 전역 상태
window.currentUser = {
    id: 1,
    name: "사용자",
    tl: 10000
};

window.userFiles = [];
window.marketFiles = [];
window.tubeFiles = [];
window.currentPlayingFile = null;
window.timeInterval = null;
window.conversionType = 'tl3';
window.userStats = {
    totalEarnings: 0,
    creatorShare: 0,
    platformShare: 0,
    uploadedFiles: 0,
    earningsHistory: []
};

// DOM 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// 앱 초기화
function initializeApp() {
    setupEventListeners();
    loadDataFromStorage();
    updateUserDisplay();
    loadUserFiles();
    updateStats();
    
    // 초기 데이터 로드
    setTimeout(() => {
        loadMarketItems();
        loadVideoItems();
    }, 500);
}

// 이벤트 리스너 설정
function setupEventListeners() {
    // 모바일 메뉴 토글
    document.querySelector('.mobile-menu-toggle').addEventListener('click', function() {
        document.querySelector('.nav-tabs').classList.toggle('active');
    });
    
    // 탭 전환
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            switchTab(this.dataset.tab);
            // 모바일에서 탭 선택 후 메뉴 닫기
            if (window.innerWidth <= 768) {
                document.querySelector('.nav-tabs').classList.remove('active');
            }
        });
    });
    
    // 화면 크기 변경 시 메뉴 상태 조정
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            document.querySelector('.nav-tabs').classList.remove('active');
        }
    });
    
    // 로컬 스토리지에 상태 저장
    window.addEventListener('beforeunload', saveDataToStorage);
}

// 데이터 로컬 스토리지에서 로드
function loadDataFromStorage() {
    const savedUser = loadFromLocalStorage('tl_user');
    if (savedUser) {
        currentUser = { ...currentUser, ...savedUser };
    }
    
    const savedFiles = loadFromLocalStorage('tl_userFiles');
    if (savedFiles) {
        userFiles = savedFiles;
    }
    
    const savedStats = loadFromLocalStorage('tl_stats');
    if (savedStats) {
        userStats = savedStats;
    }
}

// 데이터 로컬 스토리지에 저장
function saveDataToStorage() {
    saveToLocalStorage('tl_user', currentUser);
    saveToLocalStorage('tl_userFiles', userFiles);
    saveToLocalStorage('tl_stats', userStats);
}

// 탭 전환
function switchTab(tabId) {
    document.querySelectorAll('.nav-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    document.querySelector(`.nav-tab[data-tab="${tabId}"]`).classList.add('active');
    document.getElementById(tabId).classList.add('active');
}

// 사용자 정보 표시 업데이트
function updateUserDisplay() {
    document.getElementById('userTL').textContent = formatNumber(currentUser.tl);
    document.getElementById('currentBalance').textContent = formatNumber(currentUser.tl);
}

// 로그아웃
function logout() {
    if (confirm('정말 로그아웃 하시겠습니까?')) {
        // 실제 구현에서는 백엔드 API 호출
        saveDataToStorage();
        alert('데모 버전에서는 로컬 데이터가 유지됩니다.');
    }
}

// TL 충전
async function chargeTL(amount) {
    const statusEl = document.getElementById('chargeStatus');
    
    // 데모용 처리
    currentUser.tl += amount;
    updateUserDisplay();
    saveDataToStorage();
    
    showStatus('chargeStatus', `${amount} TL이 충전되었습니다!`, 'success');
}
