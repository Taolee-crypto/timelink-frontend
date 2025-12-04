// 다국어 지원 함수들
const translations = {
    ko: {
        welcome: 'TL Platform에 오신 것을 환영합니다',
        login: '로그인',
        register: '회원가입',
        studio: 'STUDIO',
        music: '뮤직마켓',
        tube: '튜브',
        features: '주요 기능',
        languages: '언어',
        copyright: '© 2024 TL Platform. 모든 권리 보유.',
        home: '홈',
        platforms: '플랫폼',
        mypage: '마이페이지',
        ads: '광고관리'
    },
    en: {
        welcome: 'Welcome to TL Platform',
        login: 'Login',
        register: 'Register',
        studio: 'STUDIO',
        music: 'Music Market',
        tube: 'Tube',
        features: 'Features',
        languages: 'Languages',
        copyright: '© 2024 TL Platform. All rights reserved.',
        home: 'Home',
        platforms: 'Platforms',
        mypage: 'My Page',
        ads: 'Ad Management'
    },
    ja: {
        welcome: 'TL Platformへようこそ',
        login: 'ログイン',
        register: '新規登録',
        studio: 'スタジオ',
        music: 'ミュージックマーケット',
        tube: 'チューブ',
        features: '主な機能',
        languages: '言語',
        copyright: '© 2024 TL Platform. 全著作権所有.',
        home: 'ホーム',
        platforms: 'プラットフォーム',
        mypage: 'マイページ',
        ads: '広告管理'
    },
    zh: {
        welcome: '欢迎来到 TL Platform',
        login: '登录',
        register: '注册',
        studio: '工作室',
        music: '音乐市场',
        tube: '视频',
        features: '主要功能',
        languages: '语言',
        copyright: '© 2024 TL Platform. 版权所有.',
        home: '首页',
        platforms: '平台',
        mypage: '我的页面',
        ads: '广告管理'
    }
};

// 언어 적용 함수
function applyLanguage(lang) {
    if (!translations[lang]) {
        lang = 'ko'; // 기본 언어
    }
    
    console.log(`🌐 언어 적용: ${lang}`);
    
    // 언어 설정 저장
    localStorage.setItem('tl_language', lang);
    
    // 언어 버튼 업데이트
    const langButton = document.getElementById('current-language');
    if (langButton) {
        langButton.textContent = {
            ko: '한국어',
            en: 'English',
            ja: '日本語',
            zh: '中文'
        }[lang];
    }
    
    // 페이지 요소 번역 적용
    const trans = translations[lang];
    
    // 제목 요소 업데이트
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (trans[key]) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = trans[key];
            } else {
                element.textContent = trans[key];
            }
        }
    });
    
    // 특정 ID가 있는 요소 업데이트
    const elements = {
        'nav-home': trans.home,
        'nav-platforms': trans.platforms,
        'nav-mypage': trans.mypage,
        'nav-ads': trans.ads,
        'btn-login': trans.login,
        'btn-register': trans.register,
        'welcome-text': trans.welcome,
        'footer-copyright': trans.copyright
    };
    
    Object.keys(elements).forEach(id => {
        const element = document.getElementById(id);
        if (element && elements[id]) {
            element.textContent = elements[id];
        }
    });
    
    // 언어 변경 알림
    showNotification(`언어가 ${lang === 'ko' ? '한국어' : lang === 'en' ? 'English' : lang === 'ja' ? '日本語' : '中文'}로 변경되었습니다.`, 'info');
    
    return lang;
}

// 언어 변경 함수
function changeLanguage(lang) {
    applyLanguage(lang);
    
    // 언어 드롭다운 닫기
    const dropdown = document.getElementById('languageDropdown');
    if (dropdown) {
        dropdown.classList.remove('show');
    }
}

// 언어 드롭다운 토글
function toggleLanguageDropdown() {
    const dropdown = document.getElementById('languageDropdown');
    if (dropdown) {
        dropdown.classList.toggle('show');
    }
}

// 알림 표시 함수
function showNotification(message, type = 'info') {
    console.log(`[${type.toUpperCase()}] ${message}`);
    
    // 간단한 토스트 알림
    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // 스타일
    toast.style.cssText = `
        position: fixed;
        bottom: 80px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
        max-width: 300px;
    `;
    
    document.body.appendChild(toast);
    
    // 3초 후 제거
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
    
    // 애니메이션 키프레임
    if (!document.querySelector('#toast-animations')) {
        const style = document.createElement('style');
        style.id = 'toast-animations';
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// 글로벌 노출
window.applyLanguage = applyLanguage;
window.changeLanguage = changeLanguage;
window.toggleLanguageDropdown = toggleLanguageDropdown;
window.showNotification = showNotification;
