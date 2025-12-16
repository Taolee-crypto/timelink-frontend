// /src/script/common-components.js
// 공통 헤더 컴포넌트
(function() {
    function createHeader() {
        return `
        <header class="header">
            <div class="container">
                <div class="nav-container">
                    <a href="/index.html" class="logo">
                        <i class="bi bi-infinity"></i>
                        TIMELINK
                    </a>
                    
                    <nav class="nav-menu">
                        <a href="/index.html#p2p" class="nav-link">
                            <i class="bi bi-arrow-left-right"></i> P2P
                        </a>
                        <a href="/studio.html" class="nav-link">
                            <i class="bi bi-palette"></i> TL STUDIO
                        </a>
                        <a href="/p2p-marketplace.html" class="nav-link active">
                            <i class="bi bi-music-note-beamed"></i> TL MUSICPLACE
                        </a>
                        <a href="/tltube.html" class="nav-link">
                            <i class="bi bi-play-btn"></i> TL TUBE
                        </a>
                        <a href="/charge.html" class="nav-link">
                            <i class="bi bi-lightning-charge"></i> TL 충전
                        </a>
                        <a href="/guide.html" class="nav-link">
                            <i class="bi bi-question-circle"></i> 이용방법
                        </a>
                    </nav>
                    
                    <div class="nav-right">
                        <div class="user-menu">
                            <a href="/login.html" class="btn btn-secondary btn-sm">로그인</a>
                            <a href="/signup.html" class="btn btn-primary btn-sm">회원가입</a>
                        </div>
                    </div>
                </div>
            </div>
        </header>
        `;
    }

    // 페이지 로드 시 헤더 삽입
    document.addEventListener('DOMContentLoaded', function() {
        const headerElement = document.createElement('div');
        headerElement.innerHTML = createHeader();
        document.body.insertBefore(headerElement.firstChild, document.body.firstChild);
        
        // 현재 페이지에 맞는 메뉴 항목 활성화
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            const linkHref = link.getAttribute('href');
            if (linkHref.includes(currentPage)) {
                link.classList.add('active');
                link.classList.add('text-white');
            } else {
                link.classList.remove('active');
                link.classList.remove('text-white');
            }
        });

        // 헤더 스크롤 효과
        window.addEventListener('scroll', function() {
            const header = document.querySelector('.header');
            if (window.scrollY > 50) {
                header.style.backgroundColor = 'rgba(15, 15, 26, 0.98)';
                header.style.backdropFilter = 'blur(15px)';
            } else {
                header.style.backgroundColor = 'rgba(15, 15, 26, 0.95)';
                header.style.backdropFilter = 'blur(10px)';
            }
        });
    });
})();
