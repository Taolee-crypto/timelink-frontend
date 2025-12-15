cat > common-components.js << 'EOF'
// TimeLink 공통 컴포넌트

class TimeLinkComponents {
    // 현재 페이지 이름 가져오기
    static getCurrentPage() {
        const path = window.location.pathname;
        const page = path.split('/').pop() || 'index.html';
        return page.replace('.html', '');
    }

    // 헤더 렌더링
    static renderHeader() {
        const currentPage = this.getCurrentPage();
        
        const navItems = [
            { id: 'index', name: '홈', icon: 'house', href: 'index.html' },
            { id: 'p2p-marketplace', name: 'P2P 마켓', icon: 'shop', href: 'p2p-marketplace.html' },
            { id: 'p2p-music', name: 'TL MUSICPLACE', icon: 'music-note-beamed', href: 'p2p-music.html' },
            { id: 'studio', name: 'TL STUDIO', icon: 'palette', href: 'studio.html' },
            { id: 'tltube', name: 'TL TUBE', icon: 'play-btn', href: 'tltube.html' },
            { id: 'dashboard', name: '대시보드', icon: 'graph-up', href: 'dashboard.html' },
            { id: 'charge', name: 'TL 충전', icon: 'lightning-charge', href: 'charge.html' },
            { id: 'guide', name: '이용방법', icon: 'question-circle', href: 'guide.html' }
        ];

        const navLinks = navItems.map(item => `
            <a href="${item.href}" class="nav-link ${currentPage === item.id ? 'active' : ''}">
                <i class="bi bi-${item.icon}"></i> ${item.name}
            </a>
        `).join('');

        return `
        <header class="header fade-in">
            <div class="container">
                <div class="nav-container">
                    <a href="index.html" class="logo">
                        <i class="bi bi-infinity"></i> TIMELINK
                    </a>
                    
                    <nav class="nav-menu">
                        ${navLinks}
                    </nav>
                    
                    <div class="user-menu">
                        <a href="login.html" class="btn btn-secondary btn-sm">
                            <i class="bi bi-box-arrow-in-right"></i> 로그인
                        </a>
                        <a href="signup.html" class="btn btn-primary btn-sm">
                            <i class="bi bi-person-plus"></i> 회원가입
                        </a>
                    </div>
                </div>
            </div>
        </header>
        `;
    }

    // 푸터 렌더링
    static renderFooter() {
        return `
        <footer class="footer fade-in">
            <div class="container">
                <div class="row">
                    <div class="col-lg-4 mb-5">
                        <div class="footer-logo">
                            <i class="bi bi-music-note-beamed"></i> TimeLink
                        </div>
                        <p class="text-muted">
                            개인 음원 소유자와 창작자를 연결하는<br>
                            혁신적인 P2P 음악 플랫폼입니다.
                        </p>
                        <div class="mt-3">
                            <a href="#" class="btn btn-sm btn-secondary me-2">
                                <i class="bi bi-twitter"></i>
                            </a>
                            <a href="#" class="btn btn-sm btn-secondary me-2">
                                <i class="bi bi-facebook"></i>
                            </a>
                            <a href="#" class="btn btn-sm btn-secondary">
                                <i class="bi bi-instagram"></i>
                            </a>
                        </div>
                    </div>
                    
                    <div class="col-lg-2 col-md-4 mb-5">
                        <h6>서비스</h6>
                        <ul class="list-unstyled">
                            <li class="mb-2"><a href="p2p-marketplace.html">P2P 마켓</a></li>
                            <li class="mb-2"><a href="studio.html">TL Studio</a></li>
                            <li class="mb-2"><a href="tltube.html">TL Tube</a></li>
                            <li class="mb-2"><a href="dashboard.html">대시보드</a></li>
                        </ul>
                    </div>
                    
                    <div class="col-lg-3 col-md-4 mb-5">
                        <h6>지원</h6>
                        <ul class="list-unstyled">
                            <li class="mb-2"><a href="faq.html">자주 묻는 질문</a></li>
                            <li class="mb-2"><a href="guide.html">이용방법</a></li>
                            <li class="mb-2"><a href="copyright-guide.html">저작권 가이드</a></li>
                            <li class="mb-2"><a href="revenue-policy.html">수익 정책</a></li>
                        </ul>
                    </div>
                    
                    <div class="col-lg-3 col-md-4 mb-5">
                        <h6>연락처</h6>
                        <ul class="list-unstyled">
                            <li class="mb-2">
                                <i class="bi bi-envelope me-2"></i>
                                support@timelink.digital
                            </li>
                            <li class="mb-2">
                                <i class="bi bi-globe me-2"></i>
                                timelink.digital
                            </li>
                        </ul>
                    </div>
                </div>
                
                <hr class="opacity-25 my-4">
                
                <div class="row">
                    <div class="col-md-6">
                        <p class="small text-muted mb-0">
                            © 2024 TimeLink. All rights reserved.
                        </p>
                    </div>
                    <div class="col-md-6 text-md-end">
                        <p class="small text-muted mb-0">
                            v2.0 • P2P Music Marketplace
                        </p>
                    </div>
                </div>
            </div>
        </footer>
        `;
    }

    // 플로팅 액션 버튼
    static renderFloatingAction() {
        return `
        <div class="floating-action">
            <a href="studio.html" class="btn btn-primary btn-lg shadow-lg">
                <i class="bi bi-plus-lg me-2"></i>음원 업로드
            </a>
        </div>
        `;
    }

    // 로딩 스피너
    static renderLoadingSpinner(text = '로딩 중...') {
        return `
        <div class="text-center p-4">
            <div class="spinner mx-auto"></div>
            <p class="mt-3 text-muted">${text}</p>
        </div>
        `;
    }

    // API 오류 메시지
    static renderApiError(message = 'API 연결에 실패했습니다.') {
        return `
        <div class="alert alert-error">
            <i class="bi bi-exclamation-triangle me-2"></i>
            ${message}
            <button class="btn btn-sm btn-secondary float-end" onclick="location.reload()">
                다시 시도
            </button>
        </div>
        `;
    }

    // 빈 상태 메시지
    static renderEmptyState(icon = 'inbox', title = '내용이 없습니다', message = '데이터를 찾을 수 없습니다.') {
        return `
        <div class="text-center p-5">
            <i class="bi bi-${icon} fs-1 text-muted mb-3"></i>
            <h5 class="mb-2">${title}</h5>
            <p class="text-muted">${message}</p>
        </div>
        `;
    }

    // 페이지 초기화
    static async initializePage() {
        // 헤더와 푸터 삽입
        document.getElementById('header-container').innerHTML = this.renderHeader();
        document.getElementById('footer-container').innerHTML = this.renderFooter();
        
        // 플로팅 액션 버튼 추가 (특정 페이지에서만)
        if (['studio', 'p2p-music', 'p2p-marketplace'].includes(this.getCurrentPage())) {
            document.body.insertAdjacentHTML('beforeend', this.renderFloatingAction());
        }

        // 모바일 네비게이션 이벤트 리스너 추가
        this.setupMobileNavigation();
        
        // API 상태 확인
        await this.checkApiStatus();
    }

    // 모바일 네비게이션 설정
    static setupMobileNavigation() {
        const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (mobileMenuToggle && navMenu) {
            mobileMenuToggle.addEventListener('click', () => {
                navMenu.classList.toggle('show');
            });
        }
    }

    // API 상태 확인
    static async checkApiStatus() {
        try {
            const apiConfig = window.TimeLinkConfig || window.TimeLinkAPI;
            if (!apiConfig) return;
            
            const response = await fetch(apiConfig.API_BASE_URL + '/api');
            if (!response.ok) {
                console.warn('API 서버 연결 상태 불안정');
            }
        } catch (error) {
            console.warn('API 서버 확인 실패:', error.message);
        }
    }

    // 토큰 확인
    static checkAuth() {
        const token = localStorage.getItem('timelink_token');
        const currentPage = this.getCurrentPage();
        
        // 로그인이 필요한 페이지들
        const protectedPages = ['dashboard', 'studio', 'p2p-music'];
        
        if (protectedPages.includes(currentPage) && !token) {
            window.location.href = 'login.html?redirect=' + currentPage;
            return false;
        }
        
        return !!token;
    }

    // 로그아웃
    static logout() {
        localStorage.removeItem('timelink_token');
        window.location.href = 'index.html';
    }

    // 사용자 정보 가져오기
    static getUserInfo() {
        const token = localStorage.getItem('timelink_token');
        if (!token) return null;
        
        try {
            // JWT 토큰 디코딩 (Base64)
            const payload = token.split('.')[1];
            return JSON.parse(atob(payload));
        } catch (error) {
            console.error('토큰 디코딩 실패:', error);
            return null;
        }
    }

    // 포맷터
    static formatPrice(amount) {
        return new Intl.NumberFormat('ko-KR', {
            style: 'currency',
            currency: 'KRW'
        }).format(amount).replace('₩', '') + ' TL';
    }

    static formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    static formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
}

// 전역 등록
window.TimeLinkComponents = TimeLinkComponents;

// 페이지 로드 시 자동 초기화
document.addEventListener('DOMContentLoaded', () => {
    if (window.TimeLinkComponents) {
        TimeLinkComponents.initializePage();
    }
});
EOF
