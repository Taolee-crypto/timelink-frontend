// 간단한 네비게이션 생성 (디버그용)
function createNavigation() {
    console.log("createNavigation 함수 실행됨");
    
    // 로그인 상태 확인
    const userStr = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    let user = null;
    let isLoggedIn = false;
    let username = "Guest";
    
    if (userStr && token) {
        try {
            user = JSON.parse(userStr);
            isLoggedIn = true;
            username = user.username || "User";
        } catch (e) {
            console.error("사용자 데이터 파싱 오류:", e);
        }
    }
    
    // 간단한 네비게이션 HTML
    return `
        <header class="main-header" style="background: #1a237e; color: white; padding: 15px 0;">
            <div style="max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; padding: 0 20px;">
                <!-- 로고 -->
                <div>
                    <a href="index.html" style="color: #00b0ff; font-size: 24px; font-weight: bold; text-decoration: none;">
                        TIMELINK
                    </a>
                </div>
                
                <!-- 메인 메뉴 -->
                <nav>
                    <ul style="display: flex; gap: 20px; list-style: none; margin: 0; padding: 0;">
                        <li><a href="index.html" style="color: white; text-decoration: none; padding: 8px 16px; border-radius: 4px;">🏠 HOME</a></li>
                        <li><a href="studio.html" style="color: white; text-decoration: none; padding: 8px 16px; border-radius: 4px;">🎵 STUDIO</a></li>
                        <li><a href="dashboard.html" style="color: white; text-decoration: none; padding: 8px 16px; border-radius: 4px;">📊 DASHBOARD</a></li>
                    </ul>
                </nav>
                
                <!-- 사용자 섹션 -->
                <div>
                    ${isLoggedIn ? 
                        `<div style="display: flex; align-items: center; gap: 10px;">
                            <span>👤 ${username}</span>
                            <button onclick="logoutSimple()" style="background: #ff4444; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">
                                로그아웃
                            </button>
                        </div>` 
                        : 
                        `<div style="display: flex; gap: 10px;">
                            <a href="login.html" style="background: #666; color: white; padding: 8px 16px; border-radius: 4px; text-decoration: none;">로그인</a>
                            <a href="signup.html" style="background: #00b0ff; color: white; padding: 8px 16px; border-radius: 4px; text-decoration: none;">회원가입</a>
                        </div>`
                    }
                </div>
            </div>
        </header>
        
        <!-- 헤더 배너 -->
        <div style="background: linear-gradient(135deg, #1a237e, #3949ab); padding: 60px 0; text-align: center; color: white;">
            <h1 style="margin: 0 0 10px 0;">TimeLink</h1>
            <p style="margin: 0; opacity: 0.9;">디지털 자산 P2P 플랫폼</p>
        </div>
    `;
}

function logoutSimple() {
    if (confirm('로그아웃하시겠습니까?')) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        window.location.href = 'index.html';
    }
}

// 페이지 로드 시 네비게이션 추가
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOMContentLoaded 이벤트 발생");
    
    // 네비게이션 생성
    const navHTML = createNavigation();
    
    // body 시작 부분에 삽입
    const navContainer = document.createElement('div');
    navContainer.innerHTML = navHTML;
    document.body.insertBefore(navContainer, document.body.firstChild);
    
    console.log("네비게이션 추가 완료");
});

// 전역 함수 노출
window.createNavigation = createNavigation;
window.logoutSimple = logoutSimple;
