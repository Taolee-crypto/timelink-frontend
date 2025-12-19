// TimeLink 공통 컴포넌트
import { checkAuth, logout } from './auth.js';

// 네비게이션 바 생성
export function createNavbar() {
    const auth = checkAuth();
    
    const navbarHTML = `
        <nav style="position: fixed; top: 0; left: 0; right: 0; background: linear-gradient(135deg, #4a1e8a 0%, #1a237e 100%); padding: 15px 30px; display: flex; justify-content: space-between; align-items: center; z-index: 1000; box-shadow: 0 2px 20px rgba(0,0,0,0.3);">
            <div style="display: flex; align-items: center; gap: 20px;">
                <a href="index.html" style="color: white; text-decoration: none; font-size: 24px; font-weight: bold; display: flex; align-items: center; gap: 10px;">
                    <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #7c4dff 0%, #536dfe 100%); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 20px;">
                        <i class="bi bi-infinity"></i>
                    </div>
                    TimeLink
                </a>
                
                <div style="display: flex; gap: 15px;">
                    <a href="studio.html" style="color: rgba(255,255,255,0.8); text-decoration: none; padding: 8px 15px; border-radius: 8px; transition: all 0.3s;">Studio</a>
                    <a href="tltube.html" style="color: rgba(255,255,255,0.8); text-decoration: none; padding: 8px 15px; border-radius: 8px; transition: all 0.3s;">TLTube</a>
                    <a href="musicplace.html" style="color: rgba(255,255,255,0.8); text-decoration: none; padding: 8px 15px; border-radius: 8px; transition: all 0.3s;">MusicPlace</a>
                    <a href="dashboard.html" style="color: rgba(255,255,255,0.8); text-decoration: none; padding: 8px 15px; border-radius: 8px; transition: all 0.3s;">Dashboard</a>
                </div>
            </div>
            
            <div style="display: flex; align-items: center; gap: 15px;">
                ${auth.isAuthenticated ? `
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <div style="background: rgba(255,255,255,0.1); padding: 8px 15px; border-radius: 20px; display: flex; align-items: center; gap: 8px;">
                            <i class="bi bi-wallet2"></i>
                            <span>${auth.user?.balance || 0} TL</span>
                        </div>
                        <div style="background: rgba(255,255,255,0.1); padding: 8px 15px; border-radius: 20px;">
                            <span>${auth.user?.name || '사용자'}</span>
                        </div>
                        <button onclick="logout()" style="background: rgba(255,64,129,0.8); color: white; border: none; padding: 8px 20px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; gap: 5px; transition: all 0.3s;">
                            <i class="bi bi-box-arrow-right"></i>
                            로그아웃
                        </button>
                    </div>
                ` : `
                    <div style="display: flex; gap: 10px;">
                        <a href="login.html" style="background: transparent; color: white; border: 2px solid rgba(255,255,255,0.3); padding: 8px 20px; border-radius: 8px; text-decoration: none; transition: all 0.3s;">로그인</a>
                        <a href="signup.html" style="background: linear-gradient(135deg, #7c4dff 0%, #536dfe 100%); color: white; padding: 8px 20px; border-radius: 8px; text-decoration: none; transition: all 0.3s;">회원가입</a>
                    </div>
                `}
            </div>
        </nav>
        
        <div style="height: 70px;"></div> <!-- 네비게이션 높이만큼 여백 -->
    `;
    
    // 네비게이션 바를 body 시작 부분에 삽입
    document.body.insertAdjacentHTML('afterbegin', navbarHTML);
    
    // 로그아웃 함수를 전역으로 노출
    window.logout = logout;
}

// 푸터 생성
export function createFooter() {
    const footerHTML = `
        <footer style="background: #050510; color: #8a8aaa; padding: 40px 20px; margin-top: 60px; border-top: 1px solid rgba(255,255,255,0.05);">
            <div style="max-width: 1200px; margin: 0 auto;">
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 40px; margin-bottom: 40px;">
                    <div>
                        <div style="color: white; font-size: 24px; font-weight: bold; margin-bottom: 20px; display: flex; align-items: center; gap: 10px;">
                            <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #7c4dff 0%, #536dfe 100%); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 20px;">
                                <i class="bi bi-infinity"></i>
                            </div>
                            TimeLink
                        </div>
                        <p style="line-height: 1.6;">음원 스트리밍과 디지털 콘텐츠를 위한 혁신적인 플랫폼</p>
                    </div>
                    
                    <div>
                        <h4 style="color: white; margin-bottom: 20px;">서비스</h4>
                        <ul style="list-style: none; padding: 0; line-height: 2;">
                            <li><a href="studio.html" style="color: #8a8aaa; text-decoration: none; transition: color 0.3s;">Studio</a></li>
                            <li><a href="tltube.html" style="color: #8a8aaa; text-decoration: none; transition: color 0.3s;">TLTube</a></li>
                            <li><a href="musicplace.html" style="color: #8a8aaa; text-decoration: none; transition: color 0.3s;">MusicPlace</a></li>
                            <li><a href="dashboard.html" style="color: #8a8aaa; text-decoration: none; transition: color 0.3s;">Dashboard</a></li>
                        </ul>
                    </div>
                    
                    <div>
                        <h4 style="color: white; margin-bottom: 20px;">지원</h4>
                        <ul style="list-style: none; padding: 0; line-height: 2;">
                            <li><a href="guide.html" style="color: #8a8aaa; text-decoration: none; transition: color 0.3s;">사용 가이드</a></li>
                            <li><a href="faq.html" style="color: #8a8aaa; text-decoration: none; transition: color 0.3s;">FAQ</a></li>
                            <li><a href="charge.html" style="color: #8a8aaa; text-decoration: none; transition: color 0.3s;">충전하기</a></li>
                        </ul>
                    </div>
                    
                    <div>
                        <h4 style="color: white; margin-bottom: 20px;">문의</h4>
                        <p style="margin-bottom: 10px;"><i class="bi bi-envelope"></i> support@timelink.com</p>
                        <p><i class="bi bi-telephone"></i> 02-1234-5678</p>
                    </div>
                </div>
                
                <div style="border-top: 1px solid rgba(255,255,255,0.05); padding-top: 20px; text-align: center; font-size: 14px;">
                    <p>© 2024 TimeLink. All rights reserved.</p>
                    <p style="margin-top: 10px;">
                        <a href="#" style="color: #8a8aaa; text-decoration: none; margin: 0 10px;">이용약관</a>
                        <a href="#" style="color: #8a8aaa; text-decoration: none; margin: 0 10px;">개인정보처리방침</a>
                    </p>
                </div>
            </div>
        </footer>
    `;
    
    // 푸터를 body 끝 부분에 삽입
    document.body.insertAdjacentHTML('beforeend', footerHTML);
}

// 로딩 스피너 생성
export function createLoadingSpinner() {
    return `
        <div style="display: inline-block; width: 20px; height: 20px; border: 3px solid rgba(255,255,255,0.3); border-radius: 50%; border-top-color: white; animation: spin 1s linear infinite;"></div>
        <style>
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
        </style>
    `;
}

// 토스트 메시지 표시
export function showToast(message, type = 'info') {
    const types = {
        success: { bg: 'linear-gradient(135deg, #00c853 0%, #64dd17 100%)', icon: '✓' },
        error: { bg: 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)', icon: '✗' },
        info: { bg: 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)', icon: 'ℹ' },
        warning: { bg: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)', icon: '⚠' }
    };
    
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${types[type]?.bg || types.info.bg};
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        gap: 10px;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        max-width: 400px;
    `;
    
    toast.innerHTML = `
        <span style="font-size: 1.2rem;">${types[type]?.icon || 'ℹ'}</span>
        <span>${message}</span>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
    
    // 애니메이션 스타일 추가
    if (!document.getElementById('toast-styles')) {
        const style = document.createElement('style');
        style.id = 'toast-styles';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
}

// 모달 창 생성
export function createModal(title, content, buttons = []) {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.8);
        backdrop-filter: blur(10px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        animation: fadeIn 0.3s ease;
    `;
    
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
        border: 1px solid rgba(124, 77, 255, 0.3);
        border-radius: 20px;
        padding: 30px;
        max-width: 500px;
        width: 90%;
        max-height: 90vh;
        overflow-y: auto;
        position: relative;
        animation: slideUp 0.3s ease;
    `;
    
    modalContent.innerHTML = `
        <div style="margin-bottom: 20px;">
            <h3 style="color: white; margin: 0 0 10px 0; font-size: 1.5rem;">${title}</h3>
            <div style="height: 3px; background: linear-gradient(135deg, #7c4dff 0%, #536dfe 100%); width: 50px;"></div>
        </div>
        
        <div style="color: #b8b8d1; line-height: 1.6; margin-bottom: 30px;">
            ${content}
        </div>
        
        <div style="display: flex; justify-content: flex-end; gap: 10px;">
            ${buttons.map((btn, i) => `
                <button style="
                    background: ${btn.primary ? 'linear-gradient(135deg, #7c4dff 0%, #536dfe 100%)' : 'transparent'};
                    color: white;
                    border: ${btn.primary ? 'none' : '2px solid rgba(255,255,255,0.2)'};
                    padding: 10px 20px;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.3s;
                "
                onclick="${btn.onclick}">
                    ${btn.text}
                </button>
            `).join('')}
            
            <button style="
                background: transparent;
                color: #8a8aaa;
                border: 2px solid rgba(255,255,255,0.1);
                padding: 10px 20px;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.3s;
            "
            onclick="this.closest('.modal-container')?.remove()">
                닫기
            </button>
        </div>
    `;
    
    modal.appendChild(modalContent);
    
    // 모달 클릭시 닫기
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    // 애니메이션 스타일 추가
    if (!document.getElementById('modal-styles')) {
        const style = document.createElement('style');
        style.id = 'modal-styles';
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes slideUp {
                from { transform: translateY(30px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
    
    modal.classList.add('modal-container');
    document.body.appendChild(modal);
    
    return modal;
}

// 페이지 초기화
export function initPage() {
    // 공통 컴포넌트 생성
    createNavbar();
    createFooter();
    
    // 인증 확인 (대시보드 등에서 사용)
    if (window.location.pathname.includes('dashboard.html')) {
        const auth = checkAuth();
        if (!auth.isAuthenticated) {
            window.location.href = 'login.html';
            return false;
        }
    }
    
    return true;
}

// 전역으로 함수 노출
window.showToast = showToast;
window.createModal = createModal;

export default {
    createNavbar,
    createFooter,
    createLoadingSpinner,
    showToast,
    createModal,
    initPage
};
