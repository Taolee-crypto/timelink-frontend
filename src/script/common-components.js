/**
 * TIMELINK 공통 컴포넌트 시스템
 * 파일명: src/script/common-components.js
 * 모든 페이지에서 사용하는 네비게이션과 푸터를 자동으로 생성합니다.
 */

(function() {
    'use strict';

    // ==================== 네비게이션 설정 ====================
    const NAV_CONFIG = {
        logo: {
            icon: 'TL',
            text: 'TIMELINK',
            link: 'index.html'
        },
        menuItems: [
            { 
                icon: 'fa-home', 
                text: 'HOME', 
                link: 'index.html',
                id: 'nav-home'
            },
            { 
                icon: 'fa-sliders-h', 
                text: 'STUDIO', 
                link: 'studio.html',
                id: 'nav-studio'
            },
            { 
                icon: 'fa-music', 
                text: 'TLMUSIC', 
                link: 'tlmusic.html',
                id: 'nav-tlmusic'
            },
            { 
                icon: 'fa-broadcast-tower', 
                text: 'CAFE RADIO', 
                link: 'cafe-radio.html',
                id: 'nav-cafe'
            }
        ]
    };

    // ==================== 공통 스타일 ====================
    const COMMON_STYLES = `
        <style id="common-component-styles">
            /* 헤더 공통 스타일 */
            .main-header {
                background: rgba(10, 15, 43, 0.95);
                backdrop-filter: blur(10px);
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                position: fixed;
                width: 100%;
                top: 0;
                z-index: 1000;
                padding: 1rem 0;
                height: 70px;
            }

            .header-content {
                display: flex;
                justify-content: space-between;
                align-items: center;
                max-width: 1400px;
                margin: 0 auto;
                padding: 0 2rem;
                height: 100%;
            }

            .logo {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                text-decoration: none;
                flex-shrink: 0;
            }

            .logo-icon {
                width: 40px;
                height: 40px;
                background: linear-gradient(135deg, #FF6B00, #FFA500);
                border-radius: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-family: 'Orbitron', sans-serif;
                font-weight: 700;
                font-size: 1.2rem;
                color: white;
            }

            .logo-text {
                font-family: 'Orbitron', sans-serif;
                font-size: 1.8rem;
                font-weight: 700;
                background: linear-gradient(135deg, #FF6B00, #FFA500);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                white-space: nowrap;
            }

            .main-nav {
                display: flex;
                gap: 0.5rem;
                flex: 1;
                justify-content: center;
                max-width: 600px;
            }

            .nav-link {
                color: #94a3b8;
                text-decoration: none;
                font-weight: 500;
                padding: 0.5rem 1rem;
                border-radius: 8px;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                gap: 0.5rem;
                white-space: nowrap;
                font-size: 0.95rem;
            }

            .nav-link:hover {
                color: white;
                background: rgba(255, 255, 255, 0.05);
            }

            .nav-link.active {
                background: rgba(255, 107, 0, 0.1);
                color: #FF6B00;
                border: 1px solid rgba(255, 107, 0, 0.2);
            }

            .nav-link i {
                font-size: 1rem;
            }

            /* 모바일 메뉴 버튼 */
            .mobile-menu-btn {
                display: none;
                background: none;
                border: none;
                color: #94a3b8;
                font-size: 1.5rem;
                cursor: pointer;
                padding: 0.5rem;
                transition: color 0.3s ease;
            }

            .mobile-menu-btn:hover {
                color: white;
            }

            /* 사용자 섹션 */
            #authButtons {
                display: flex;
                align-items: center;
                gap: 1rem;
                flex-shrink: 0;
            }

            /* 반응형 */
            @media (max-width: 992px) {
                .main-nav {
                    position: fixed;
                    top: 70px;
                    left: 0;
                    right: 0;
                    background: rgba(10, 15, 43, 0.98);
                    backdrop-filter: blur(10px);
                    flex-direction: column;
                    padding: 1rem;
                    gap: 0.5rem;
                    display: none;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                    max-width: 100%;
                }

                .main-nav.active {
                    display: flex;
                }

                .nav-link {
                    width: 100%;
                    justify-content: center;
                    padding: 1rem;
                }

                .mobile-menu-btn {
                    display: block;
                }

                .logo-text {
                    font-size: 1.5rem;
                }

                .header-content {
                    padding: 0 1rem;
                }
            }

            @media (max-width: 768px) {
                .logo-text {
                    display: none;
                }
            }
        </style>
    `;

    // ==================== 네비게이션 컴포넌트 ====================
    class NavigationComponent {
        constructor() {
            this.currentPage = this.getCurrentPage();
            this.init();
        }

        init() {
            // 스타일 추가
            if (!document.getElementById('common-component-styles')) {
                document.head.insertAdjacentHTML('beforeend', COMMON_STYLES);
            }

            // DOM 로드 대기
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.render());
            } else {
                this.render();
            }
        }

        getCurrentPage() {
            const path = window.location.pathname;
            const page = path.split('/').pop() || 'index.html';
            return page.replace('.html', '');
        }

        isActivePage(link) {
            const linkPage = link.replace('.html', '');
            return this.currentPage === linkPage || 
                   (this.currentPage === '' && linkPage === 'index');
        }

        createNavigation() {
            const menuItemsHTML = NAV_CONFIG.menuItems.map(item => {
                const isActive = this.isActivePage(item.link);
                return `
                    <a href="${item.link}" 
                       id="${item.id}"
                       class="nav-link ${isActive ? 'active' : ''}">
                        <i class="fas ${item.icon}"></i>
                        <span>${item.text}</span>
                    </a>
                `;
            }).join('');

            return `
                <header class="main-header" id="mainHeader">
                    <div class="header-content">
                        <a href="${NAV_CONFIG.logo.link}" class="logo">
                            <div class="logo-icon">${NAV_CONFIG.logo.icon}</div>
                            <div class="logo-text">${NAV_CONFIG.logo.text}</div>
                        </a>

                        <button class="mobile-menu-btn" id="mobileMenuBtn" aria-label="메뉴">
                            <i class="fas fa-bars"></i>
                        </button>

                        <nav class="main-nav" id="mainNav">
                            ${menuItemsHTML}
                        </nav>

                        <div id="authButtons"></div>
                    </div>
                </header>
            `;
        }

        render() {
            // 기존 헤더가 있으면 제거
            const existingHeader = document.getElementById('mainHeader');
            if (existingHeader) {
                existingHeader.remove();
            }

            // body 시작 부분에 헤더 삽입
            document.body.insertAdjacentHTML('afterbegin', this.createNavigation());

            // body에 padding-top 추가 (헤더 높이만큼)
            if (!document.body.style.paddingTop) {
                document.body.style.paddingTop = '70px';
            }

            // 이벤트 리스너 등록
            this.bindEvents();

            console.log('✅ 네비게이션 컴포넌트 렌더링 완료');
        }

        bindEvents() {
            // 모바일 메뉴 토글
            const mobileMenuBtn = document.getElementById('mobileMenuBtn');
            const mainNav = document.getElementById('mainNav');

            if (mobileMenuBtn && mainNav) {
                mobileMenuBtn.addEventListener('click', () => {
                    mainNav.classList.toggle('active');
                    
                    const icon = mobileMenuBtn.querySelector('i');
                    if (mainNav.classList.contains('active')) {
                        icon.className = 'fas fa-times';
                    } else {
                        icon.className = 'fas fa-bars';
                    }
                });

                // 네비게이션 링크 클릭 시 모바일 메뉴 닫기
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.addEventListener('click', () => {
                        if (window.innerWidth <= 992) {
                            mainNav.classList.remove('active');
                            mobileMenuBtn.querySelector('i').className = 'fas fa-bars';
                        }
                    });
                });

                // 외부 클릭 시 메뉴 닫기
                document.addEventListener('click', (e) => {
                    if (mainNav.classList.contains('active') && 
                        !mainNav.contains(e.target) && 
                        !mobileMenuBtn.contains(e.target)) {
                        mainNav.classList.remove('active');
                        mobileMenuBtn.querySelector('i').className = 'fas fa-bars';
                    }
                });
            }
        }
    }

    // ==================== 푸터 컴포넌트 ====================
    class FooterComponent {
        constructor() {
            this.init();
        }

        init() {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.render());
            } else {
                this.render();
            }
        }

        createFooter() {
            return `
                <footer class="main-footer" id="mainFooter" style="
                    background: #1E293B;
                    padding: 3rem 0 2rem;
                    border-top: 1px solid rgba(255, 107, 0, 0.2);
                    margin-top: 4rem;
                ">
                    <div style="max-width: 1400px; margin: 0 auto; padding: 0 2rem;">
                        <div style="
                            display: grid;
                            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                            gap: 3rem;
                            margin-bottom: 3rem;
                        ">
                            <div>
                                <h4 style="font-size: 1.3rem; margin-bottom: 1.5rem; color: white;">
                                    TIMELINK MUSIC
                                </h4>
                                <p style="color: #94a3b8; margin-bottom: 0.75rem;">
                                    창작자의 음악이 돈이 되는 플랫폼
                                </p>
                                <p style="color: #94a3b8; margin-bottom: 0.75rem;">
                                    <i class="fas fa-envelope" style="color: #FFA500; margin-right: 0.5rem;"></i>
                                    music@timelink.digital
                                </p>
                            </div>
                            
                            <div>
                                <h4 style="font-size: 1.3rem; margin-bottom: 1.5rem; color: white;">
                                    서비스
                                </h4>
                                <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                                    <a href="studio.html" style="color: #94a3b8; text-decoration: none; transition: color 0.3s;">
                                        STUDIO
                                    </a>
                                    <a href="tlmusic.html" style="color: #94a3b8; text-decoration: none; transition: color 0.3s;">
                                        TLMUSIC
                                    </a>
                                    <a href="cafe-radio.html" style="color: #94a3b8; text-decoration: none; transition: color 0.3s;">
                                        CAFE RADIO
                                    </a>
                                </div>
                            </div>
                            
                            <div>
                                <h4 style="font-size: 1.3rem; margin-bottom: 1.5rem; color: white;">
                                    수익 시스템
                                </h4>
                                <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                                    <a href="#" style="color: #94a3b8; text-decoration: none; transition: color 0.3s;">
                                        70-20-30 배분 구조
                                    </a>
                                    <a href="#" style="color: #94a3b8; text-decoration: none; transition: color 0.3s;">
                                        TL 경제 가이드
                                    </a>
                                    <a href="#" style="color: #94a3b8; text-decoration: none; transition: color 0.3s;">
                                        수익 출금 안내
                                    </a>
                                </div>
                            </div>
                            
                            <div>
                                <h4 style="font-size: 1.3rem; margin-bottom: 1.5rem; color: white;">
                                    지원
                                </h4>
                                <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                                    <a href="#" style="color: #94a3b8; text-decoration: none; transition: color 0.3s;">
                                        고객센터
                                    </a>
                                    <a href="#" style="color: #94a3b8; text-decoration: none; transition: color 0.3s;">
                                        자주 묻는 질문
                                    </a>
                                    <a href="#" style="color: #94a3b8; text-decoration: none; transition: color 0.3s;">
                                        이용약관
                                    </a>
                                    <a href="#" style="color: #94a3b8; text-decoration: none; transition: color 0.3s;">
                                        개인정보처리방침
                                    </a>
                                </div>
                            </div>
                        </div>
                        
                        <div style="
                            text-align: center;
                            padding-top: 2rem;
                            border-top: 1px solid rgba(255, 255, 255, 0.1);
                            color: #94a3b8;
                            font-size: 0.9rem;
                        ">
                            <p style="margin-bottom: 0.5rem;">
                                © 2024 TIMELINK MUSIC. All rights reserved.
                            </p>
                            <p>
                                70% 원저작권자 - 20% 업로더 - 30% 플랫폼 수익 배분 시스템
                            </p>
                        </div>
                    </div>
                </footer>

                <style>
                    .main-footer a:hover {
                        color: #FFA500 !important;
                    }
                </style>
            `;
        }

        render() {
            // 기존 푸터가 있으면 제거
            const existingFooter = document.getElementById('mainFooter');
            if (existingFooter) {
                existingFooter.remove();
            }

            // body 끝에 푸터 추가
            document.body.insertAdjacentHTML('beforeend', this.createFooter());

            console.log('✅ 푸터 컴포넌트 렌더링 완료');
        }
    }

    // ==================== 알림 시스템 ====================
    window.showNotification = function(message, type = 'info') {
        // 기존 알림 제거
        const existing = document.getElementById('globalNotification');
        if (existing) existing.remove();

        // 새 알림 생성
        const notification = document.createElement('div');
        notification.id = 'globalNotification';
        notification.style.cssText = `
            position: fixed;
            top: 90px;
            right: 20px;
            background: ${type === 'success' ? 'rgba(0, 212, 170, 0.95)' : 
                         type === 'error' ? 'rgba(239, 68, 68, 0.95)' : 
                         type === 'warning' ? 'rgba(255, 165, 0, 0.95)' : 
                         'rgba(0, 102, 255, 0.95)'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            max-width: 400px;
            font-size: 0.95rem;
            animation: slideInRight 0.3s ease;
        `;
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.75rem;">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 
                               type === 'error' ? 'fa-exclamation-circle' : 
                               type === 'warning' ? 'fa-exclamation-triangle' : 
                               'fa-info-circle'}" style="font-size: 1.2rem;"></i>
                <div>${message}</div>
            </div>
        `;

        // 애니메이션 스타일
        if (!document.getElementById('notificationStyles')) {
            const style = document.createElement('style');
            style.id = 'notificationStyles';
            style.textContent = `
                @keyframes slideInRight {
                    from {
                        transform: translateX(400px);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                @keyframes slideOutRight {
                    from {
                        transform: translateX(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(400px);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(notification);

        // 자동 제거
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    };

    // ==================== 로딩 인디케이터 ====================
    window.showLoading = function(message = '처리 중...') {
        const loading = document.createElement('div');
        loading.id = 'globalLoading';
        loading.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 20000;
        `;
        loading.innerHTML = `
            <div style="
                background: linear-gradient(145deg, #1A2342, #0F172A);
                padding: 2rem 3rem;
                border-radius: 15px;
                text-align: center;
                border: 1px solid rgba(255, 107, 0, 0.3);
            ">
                <div style="
                    width: 50px;
                    height: 50px;
                    border: 4px solid rgba(255, 107, 0, 0.2);
                    border-top-color: #FF6B00;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin: 0 auto 1rem;
                "></div>
                <div style="color: white; font-size: 1.1rem;">${message}</div>
            </div>
        `;

        // 애니메이션
        if (!document.getElementById('loadingStyles')) {
            const style = document.createElement('style');
            style.id = 'loadingStyles';
            style.textContent = `
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(loading);
    };

    window.hideLoading = function() {
        const loading = document.getElementById('globalLoading');
        if (loading) loading.remove();
    };

    // ==================== 초기화 ====================
    console.log('🚀 TIMELINK 공통 컴포넌트 시스템 로드');
    
    // 네비게이션과 푸터 자동 생성
    window.TimelinkNavigation = new NavigationComponent();
    window.TimelinkFooter = new FooterComponent();

    console.log('✅ 공통 컴포넌트 초기화 완료');
})();
