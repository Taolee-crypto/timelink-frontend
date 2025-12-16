// TimeLink 공통 컴포넌트
(function() {
    'use strict';
    
    // 공통 헤더 생성
    function createHeader() {
        return `
        <header class="header">
            <div class="nav-container">
                <a href="/index.html" class="logo">
                    <i class="bi bi-music-note-beamed"></i>
                    TIMELINK
                </a>
                
                <nav class="nav-menu">
                    <a href="/index.html" class="nav-link">
                        <i class="bi bi-house-door"></i> 홈
                    </a>
                    <a href="/p2p-marketplace.html" class="nav-link">
                        <i class="bi bi-arrow-left-right"></i> P2P 마켓
                    </a>
                    <a href="/studio.html" class="nav-link">
                        <i class="bi bi-palette"></i> TL Studio
                    </a>
                    <a href="/tltube.html" class="nav-link">
                        <i class="bi bi-play-btn"></i> TL Tube
                    </a>
                    <a href="/dashboard.html" class="nav-link">
                        <i class="bi bi-speedometer2"></i> 대시보드
                    </a>
                    <a href="/charge.html" class="nav-link">
                        <i class="bi bi-lightning-charge"></i> TL 충전
                    </a>
                </nav>
                
                <div class="nav-right">
                    <div class="user-menu">
                        <a href="/login.html" class="btn btn-secondary btn-sm">
                            <i class="bi bi-box-arrow-in-right"></i> 로그인
                        </a>
                        <a href="/signup.html" class="btn btn-primary btn-sm">
                            <i class="bi bi-person-plus"></i> 회원가입
                        </a>
                    </div>
                </div>
            </div>
        </header>`;
    }
    
    // 공통 푸터 생성
    function createFooter() {
        return `
        <footer class="footer">
            <div class="container">
                <div class="row">
                    <div class="col-lg-4 mb-5">
                        <div class="footer-logo">
                            <i class="bi bi-music-note-beamed me-2"></i>
                            TimeLink
                        </div>
                        <p class="text-gray">
                            음원의 진정한 가치를 발견하는 P2P 플랫폼<br>
                            창작자와 수집가를 위한 공정한 음악 경제
                        </p>
                        <div class="mt-4">
                            <a href="#" class="text-gray me-3"><i class="bi bi-twitter"></i></a>
                            <a href="#" class="text-gray me-3"><i class="bi bi-instagram"></i></a>
                            <a href="#" class="text-gray me-3"><i class="bi bi-discord"></i></a>
                            <a href="#" class="text-gray"><i class="bi bi-telegram"></i></a>
                        </div>
                    </div>
                    
                    <div class="col-lg-2 col-md-4 mb-5">
                        <h6>서비스</h6>
                        <ul>
                            <li><a href="/p2p-marketplace.html"><i class="bi bi-chevron-right"></i> P2P 마켓</a></li>
                            <li><a href="/studio.html"><i class="bi bi-chevron-right"></i> TL Studio</a></li>
                            <li><a href="/tltube.html"><i class="bi bi-chevron-right"></i> TL Tube</a></li>
                            <li><a href="/dashboard.html"><i class="bi bi-chevron-right"></i> 대시보드</a></li>
                        </ul>
                    </div>
                    
                    <div class="col-lg-3 col-md-4 mb-5">
                        <h6>계정</h6>
                        <ul>
                            <li><a href="/login.html"><i class="bi bi-chevron-right"></i> 로그인</a></li>
                            <li><a href="/signup.html"><i class="bi bi-chevron-right"></i> 회원가입</a></li>
                            <li><a href="/dashboard.html"><i class="bi bi-chevron-right"></i> 내 프로필</a></li>
                            <li><a href="/charge.html"><i class="bi bi-chevron-right"></i> TL 충전</a></li>
                        </ul>
                    </div>
                    
                    <div class="col-lg-3 col-md-4 mb-5">
                        <h6>지원</h6>
                        <ul>
                            <li><a href="/guide.html"><i class="bi bi-chevron-right"></i> 이용방법</a></li>
                            <li><a href="/faq.html"><i class="bi bi-chevron-right"></i> 자주묻는질문</a></li>
                            <li><a href="#"><i class="bi bi-chevron-right"></i> 저작권 안내</a></li>
                            <li><a href="#"><i class="bi bi-chevron-right"></i> 문의하기</a></li>
                        </ul>
                    </div>
                </div>
                
                <div class="footer-copyright">
                    <p class="mb-0">© 2024 TimeLink. All rights reserved. | P2P Music Marketplace v3.0</p>
                </div>
            </div>
        </footer>`;
    }
    
    // 현재 페이지에 맞는 메뉴 활성화
    function setActiveMenu() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            const linkPage = href.split('/').pop();
            
            // 페이지가 정확히 일치하거나 index.html인 경우
            if (linkPage === currentPage || 
                (currentPage === '' && linkPage === 'index.html') ||
                (currentPage === 'index.html' && href === '/')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
    
    // 헤더 스크롤 효과
    function initHeaderScroll() {
        const header = document.querySelector('.header');
        if (!header) return;
        
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                header.style.backgroundColor = 'rgba(10, 10, 26, 0.98)';
                header.style.backdropFilter = 'blur(25px)';
            } else {
                header.style.backgroundColor = 'rgba(10, 10, 26, 0.95)';
                header.style.backdropFilter = 'blur(20px)';
            }
        });
    }
    
    // 부드러운 스크롤
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                if (href === '#' || !href.startsWith('#')) return;
                
                e.preventDefault();
                const targetId = href;
                const target = document.querySelector(targetId);
                
                if (target) {
                    window.scrollTo({
                        top: target.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    // 초기화
    document.addEventListener('DOMContentLoaded', function() {
        // 헤더 삽입
        const headerContainer = document.createElement('div');
        headerContainer.innerHTML = createHeader();
        document.body.insertBefore(headerContainer.firstChild, document.body.firstChild);
        
        // 푸터 삽입
        const footerContainer = document.createElement('div');
        footerContainer.innerHTML = createFooter();
        document.body.appendChild(footerContainer.firstChild);
        
        // 기능 초기화
        setActiveMenu();
        initHeaderScroll();
        initSmoothScroll();
        
        // 페이지별 추가 초기화
        if (typeof initPageSpecific === 'function') {
            initPageSpecific();
        }
    });
    
    // 전역 함수로 노출
    window.TimeLink = window.TimeLink || {};
    window.TimeLink.Common = {
        setActiveMenu: setActiveMenu,
        initHeaderScroll: initHeaderScroll,
        initSmoothScroll: initSmoothScroll
    };
})();
