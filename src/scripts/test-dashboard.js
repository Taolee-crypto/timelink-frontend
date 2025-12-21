// 간단한 대시보드 스크립트 (import 없이)
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 TimeLink 대시보드 로드됨');
    
    // 1. 사용자 정보 가져오기
    const userEmail = localStorage.getItem('user_email') || 'new_test_144902@timelink.digital';
    const userNickname = localStorage.getItem('user_nickname') || '새테스트';
    const authToken = localStorage.getItem('auth_token');
    
    console.log('👤 사용자:', userNickname);
    console.log('📧 이메일:', userEmail);
    console.log('🔐 토큰 있음:', !!authToken);
    
    // 2. 사용자 정보 표시
    const updateUserDisplay = () => {
        // 네비게이션 사용자명
        const navUserName = document.getElementById('navUserName');
        if (navUserName) {
            navUserName.textContent = userNickname + '님';
            console.log('✅ 네비게이션 사용자명 설정됨');
        }
        
        // 프로필 정보
        const profileName = document.getElementById('profileName');
        const profileEmail = document.getElementById('profileEmail');
        
        if (profileName) profileName.textContent = userNickname + '님';
        if (profileEmail) profileEmail.textContent = userEmail;
        
        // 아바타
        const avatarInitial = userNickname.charAt(0).toUpperCase();
        document.querySelectorAll('.user-avatar, .profile-avatar').forEach(avatar => {
            avatar.textContent = avatarInitial;
            avatar.style.cssText = 'width:32px;height:32px;border-radius:50%;background:#29C4A9;color:white;display:flex;align-items:center;justify-content:center;font-weight:bold;';
        });
    };
    
    // 3. 드롭다운 기능
    const initDropdown = () => {
        const userToggle = document.getElementById('userToggle');
        const userDropdown = document.getElementById('userDropdown');
        
        if (userToggle && userDropdown) {
            userToggle.addEventListener('click', function(e) {
                e.stopPropagation();
                userDropdown.style.display = 
                    userDropdown.style.display === 'block' ? 'none' : 'block';
            });
            
            // 외부 클릭 시 닫기
            document.addEventListener('click', function() {
                userDropdown.style.display = 'none';
            });
            
            // 로그아웃 버튼
            const logoutBtn = document.getElementById('logoutBtn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    if (confirm('로그아웃 하시겠습니까?')) {
                        localStorage.clear();
                        window.location.href = 'login.html';
                    }
                });
            }
        }
    };
    
    // 4. API 테스트
    const testAPI = async () => {
        if (authToken) {
            try {
                const response = await fetch('https://timelink-backend.timelink-api.workers.dev/api/health');
                const data = await response.json();
                console.log('✅ API 연결 성공:', data.status);
            } catch (error) {
                console.log('❌ API 연결 실패:', error.message);
            }
        }
    };
    
    // 실행
    updateUserDisplay();
    initDropdown();
    testAPI();
    
    console.log('🎉 대시보드 초기화 완료!');
});
