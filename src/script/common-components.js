// common-component.js (최종본)
document.addEventListener('DOMContentLoaded', function() {
    // 인증 버튼만 업데이트
    updateAuthButtons();
    highlightActiveNav();
});

function updateAuthButtons() {
    const authButtons = document.getElementById('authButtons');
    if (!authButtons) return;

    const user = JSON.parse(localStorage.getItem('timelink_user'));
    
    if (user) {
        const tlBalance = localStorage.getItem('timelink_tl_balance') || '10000';
        authButtons.innerHTML = `
            <div style="display: flex; align-items: center; gap: 1rem;">
                <div style="
                    display: flex; align-items: center; gap: 0.5rem;
                    padding: 0.5rem 1rem; background: linear-gradient(135deg, #FFD166, #FFB347);
                    border-radius: 10px; color: #0A0F2B; font-weight: bold;
                ">
                    <i class="fas fa-coins"></i>
                    <span>${parseInt(tlBalance).toLocaleString()} TL</span>
                </div>
                <div style="display: flex; align-items: center; gap: 0.75rem; padding: 0.5rem 1rem; 
                     background: rgba(255,255,255,0.05); border-radius: 10px; cursor: pointer;" 
                     onclick="logout()">
                    <div style="width: 36px; height: 36px; background: linear-gradient(135deg, #1E90FF, #4169E1);
                         border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                        <i class="fas fa-user" style="color: white;"></i>
                    </div>
                    <span style="color: white; font-weight: 500;">${user.name || user.email}</span>
                    <i class="fas fa-sign-out-alt" style="color: #94a3b8;"></i>
                </div>
            </div>
        `;
    } else {
        authButtons.innerHTML = `
            <div style="display: flex; gap: 0.75rem; align-items: center;">
                <button onclick="showLoginModal()" style="
                    padding: 0.5rem 1.25rem; border-radius: 8px; border: 1px solid rgba(255,255,255,0.2);
                    background: transparent; color: white; cursor: pointer; display: flex;
                    align-items: center; gap: 0.5rem; font-weight: 500;">
                    <i class="fas fa-sign-in-alt"></i> 로그인
                </button>
                <button onclick="showSignupModal()" style="
                    padding: 0.5rem 1.25rem; border-radius: 8px; border: none;
                    background: linear-gradient(135deg, #1E90FF, #4169E1); color: white;
                    cursor: pointer; display: flex; align-items: center; gap: 0.5rem; font-weight: 500;">
                    <i class="fas fa-user-plus"></i> 회원가입
                </button>
            </div>
        `;
    }
}

function highlightActiveNav() {
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

window.logout = function() {
    if (confirm('로그아웃 하시겠습니까?')) {
        localStorage.removeItem('timelink_user');
        localStorage.removeItem('timelink_token');
        localStorage.removeItem('timelink_tl_balance');
        setTimeout(() => location.reload(), 500);
    }
};

window.showLoginModal = function() {
    alert('로그인 모달 (실제로는 모달창이 열립니다)');
    // 실제 구현: 모달창 열기
};

window.showSignupModal = function() {
    alert('회원가입 모달 - 10,000 TL 보너스!');
    // 실제 구현: 모달창 열기
};
