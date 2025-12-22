<!-- index.html의 head 부분에 추가 -->
<script src="scripts/auth-check.js"></script>

<!-- body 끝부분에 추가 -->
<script>
// auth-check.js와 연동
document.addEventListener('DOMContentLoaded', async function() {
    const balanceElement = document.getElementById('balanceAmount');
    const userAvatar = document.getElementById('userAvatar');
    
    if (authManager && authManager.isAuthenticated()) {
        // 로그인 상태
        const user = authManager.getUser();
        userAvatar.innerHTML = '<i class="fas fa-user-check"></i>';
        userAvatar.title = user?.name || user?.email || '내 계정';
        
        // 잔액 업데이트
        const balance = await authManager.updateBalance();
        if (balanceElement) {
            balanceElement.textContent = parseInt(balance).toLocaleString();
        }
        
        // 사용자 메뉴 이벤트
        userAvatar.addEventListener('click', showUserMenu);
    } else {
        // 비로그인 상태
        userAvatar.innerHTML = '<i class="fas fa-user"></i>';
        userAvatar.title = '로그인하기';
        userAvatar.addEventListener('click', function() {
            window.location.href = 'login.html';
        });
        
        if (balanceElement) {
            balanceElement.textContent = '0';
        }
    }
});

function showUserMenu() {
    // 간단한 알림으로 대체 (실제는 드롭다운 구현)
    if (confirm('로그아웃하시겠습니까?')) {
        authManager.logout();
    }
}
</script>
