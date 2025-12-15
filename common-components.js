// common-components.js - 모든 페이지에서 공통으로 사용할 컴포넌트
class TimeLinkComponents {
    static renderHeader(currentPage = '') {
        return `
        <header class="header">
            <div class="container">
                <div class="nav-container">
                    <a href="index.html" class="logo">
                        <i class="bi bi-infinity"></i>
                        TIMELINK
                    </a>
                    
                    <button class="mobile-nav-toggle" id="mobileNavToggle">
                        <i class="bi bi-list"></i>
                    </button>
                    
                    <nav class="nav-menu" id="navMenu">
                        <a href="index.html" class="nav-link ${currentPage === 'index' ? 'active' : ''}">
                            <i class="bi bi-house"></i> 홈
                        </a>
                        <a href="p2p-marketplace.html" class="nav-link ${currentPage === 'p2p-marketplace' ? 'active' : ''}">
                            <i class="bi bi-arrow-left-right"></i> P2P 마켓
                        </a>
                        <a href="p2p-music.html" class="nav-link ${currentPage === 'p2p-music' ? 'active' : ''}">
                            <i class="bi bi-music-note-beamed"></i> TL MUSICPLACE
                        </a>
                        <a href="studio.html" class="nav-link ${currentPage === 'studio' ? 'active' : ''}">
                            <i class="bi bi-palette"></i> TL STUDIO
                        </a>
                        <a href="tltube.html" class="nav-link ${currentPage === 'tltube' ? 'active' : ''}">
                            <i class="bi bi-play-btn"></i> TL TUBE
                        </a>
                        <a href="charge.html" class="nav-link ${currentPage === 'charge' ? 'active' : ''}">
                            <i class="bi bi-lightning-charge"></i> TL 충전
                        </a>
                        <a href="dashboard.html" class="nav-link ${currentPage === 'dashboard' ? 'active' : ''}">
                            <i class="bi bi-graph-up"></i> 대시보드
                        </a>
                        <a href="guide.html" class="nav-link ${currentPage === 'guide' ? 'active' : ''}">
                            <i class="bi bi-question-circle"></i> 이용방법
                        </a>
                    </nav>
                    
                    <div class="nav-right">
                        <div class="user-menu">
                            <a href="login.html" class="btn btn-secondary btn-sm">로그인</a>
                            <a href="signup.html" class="btn btn-primary btn-sm">회원가입</a>
                        </div>
                    </div>
                </div>
            </div>
        </header>
        `;
    }

    static renderFooter() {
        return `
        <footer class="footer">
            <div class="container">
                <div class="row">
                    <div class="col-lg-4 mb-5">
                        <div class="footer-logo">
                            <i class="bi bi-music-note-beamed me-2"></i>
                            TimeLink P2P MUSIC
                        </div>
                        <p class="opacity-75">
                            개인 음원 소유자와 창작자를 연결하는 혁신적인 P2P 음악 플랫폼입니다.
                            공정한 수익 분배와 투명한 거래로 새로운 음악 경제를 만들어갑니다.
                        </p>
                    </div>
                    
                    <div class="col-lg-2 col-md-4 mb-5">
                        <h6 class="fw-bold text-white mb-4">서비스</h6>
                        <ul class="list-unstyled">
                            <li class="mb-3"><a href="p2p-marketplace.html" class="text-white-50 text-decoration-none">P2P 마켓플레이스</a></li>
                            <li class="mb-3"><a href="studio.html" class="text-white-50 text-decoration-none">TL Studio</a></li>
                            <li class="mb-3"><a href="dashboard.html" class="text-white-50 text-decoration-none">대시보드</a></li>
                        </ul>
                    </div>
                    
                    <div class="col-lg-3 col-md-4 mb-5">
                        <h6 class="fw-bold text-white mb-4">지원</h6>
                        <ul class="list-unstyled">
                            <li class="mb-3"><a href="faq.html" class="text-white-50 text-decoration-none">자주 묻는 질문</a></li>
                            <li class="mb-3"><a href="copyright-guide.html" class="text-white-50 text-decoration-none">저작권 가이드</a></li>
                            <li class="mb-3"><a href="revenue-policy.html" class="text-white-50 text-decoration-none">수익 정책</a></li>
                            <li class="mb-3"><a href="guide.html" class="text-white-50 text-decoration-none">이용방법</a></li>
                        </ul>
                    </div>
                    
                    <div class="col-lg-3 col-md-4 mb-5">
                        <h6 class="fw-bold text-white mb-4">연락처</h6>
                        <ul class="list-unstyled">
                            <li class="mb-3">
                                <i class="bi bi-envelope me-2"></i>support@timelink.digital
                            </li>
                            <li>
                                <i class="bi bi-globe me-2"></i>timelink.digital
                            </li>
                        </ul>
                    </div>
                </div>
                
                <hr class="opacity-25 my-4">
                
                <div class="row">
                    <div class="col-md-6">
                        <p class="small opacity-50 mb-0">
                            © 2024 TimeLink. All rights reserved.
                        </p>
                    </div>
                    <div class="col-md-6 text-md-end">
                        <p class="small opacity-50 mb-0">
                            P2P Music Marketplace v2.0
                        </p>
                    </div>
                </div>
            </div>
        </footer>
        `;
    }

    static renderFloatingAction() {
        return `
        <div class="floating-action">
            <a href="studio.html" class="btn btn-floating">
                <i class="bi bi-upload me-2"></i>음원 업로드
            </a>
        </div>
        `;
    }
}
