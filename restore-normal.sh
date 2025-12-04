#!/bin/bash
echo "=== 정상적인 TL Platform 복원 ==="

# index.html을 정상 버전으로 복원
cat > index.html << 'HTML'
<!DOCTYPE html>
<html lang="ko" data-theme="light">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TL Platform - 통합 웹3.0 플랫폼</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.css">
    <style>
        :root {
            --primary: #4361ee;
            --secondary: #3a0ca3;
            --accent: #f72585;
            --success: #4cc9f0;
            --warning: #f8961e;
            --dark: #1a1a2e;
            --light: #f8f9fa;
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        body {
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
            color: #e2e8f0;
            min-height: 100vh;
            overflow-x: hidden;
        }
        
        .navbar {
            background: rgba(15, 23, 42, 0.9);
            backdrop-filter: blur(10px);
            padding: 1rem 2rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            position: fixed;
            width: 100%;
            top: 0;
            z-index: 1000;
            border-bottom: 1px solid rgba(148, 163, 184, 0.1);
        }
        
        .logo {
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 1.8rem;
            font-weight: bold;
            background: linear-gradient(90deg, #4361ee, #4cc9f0);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        
        .logo i {
            font-size: 2rem;
            color: #4361ee;
        }
        
        .nav-links {
            display: flex;
            gap: 2rem;
            align-items: center;
        }
        
        .nav-links a {
            color: #cbd5e1;
            text-decoration: none;
            padding: 0.5rem 1rem;
            border-radius: 8px;
            transition: all 0.3s ease;
            font-weight: 500;
        }
        
        .nav-links a:hover {
            background: rgba(67, 97, 238, 0.1);
            color: #60a5fa;
        }
        
        .auth-buttons {
            display: flex;
            gap: 1rem;
        }
        
        .btn {
            padding: 0.7rem 1.5rem;
            border-radius: 8px;
            border: none;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            display: inline-flex;
            align-items: center;
            gap: 8px;
        }
        
        .btn-primary {
            background: linear-gradient(135deg, #4361ee 0%, #3a0ca3 100%);
            color: white;
        }
        
        .btn-secondary {
            background: transparent;
            border: 2px solid #4361ee;
            color: #4361ee;
        }
        
        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
        }
        
        .hero {
            padding: 8rem 2rem 4rem;
            text-align: center;
            max-width: 1200px;
            margin: 0 auto;
        }
        
        .hero h1 {
            font-size: 3.5rem;
            background: linear-gradient(90deg, #60a5fa, #a855f7);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 1.5rem;
            line-height: 1.2;
        }
        
        .hero p {
            font-size: 1.2rem;
            color: #94a3b8;
            max-width: 800px;
            margin: 0 auto 2rem;
            line-height: 1.6;
        }
        
        .platform-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            padding: 2rem;
            max-width: 1200px;
            margin: 0 auto;
        }
        
        .platform-card {
            background: rgba(30, 41, 59, 0.7);
            border-radius: 16px;
            padding: 2rem;
            text-align: center;
            transition: all 0.3s ease;
            border: 1px solid rgba(148, 163, 184, 0.1);
            position: relative;
            overflow: hidden;
        }
        
        .platform-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 4px;
            background: linear-gradient(90deg, var(--primary), var(--accent));
        }
        
        .platform-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            border-color: var(--primary);
        }
        
        .platform-icon {
            font-size: 3rem;
            margin-bottom: 1rem;
            color: var(--primary);
        }
        
        .platform-card h3 {
            font-size: 1.5rem;
            margin-bottom: 1rem;
            color: #f1f5f9;
        }
        
        .features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1.5rem;
            padding: 4rem 2rem;
            background: rgba(15, 23, 42, 0.5);
            margin: 2rem auto;
            border-radius: 20px;
            max-width: 1200px;
        }
        
        .feature-item {
            display: flex;
            align-items: flex-start;
            gap: 1rem;
            padding: 1.5rem;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 12px;
            transition: all 0.3s ease;
        }
        
        .feature-item:hover {
            background: rgba(67, 97, 238, 0.1);
            transform: translateX(5px);
        }
        
        .feature-icon {
            font-size: 1.5rem;
            color: var(--success);
            background: rgba(76, 201, 240, 0.1);
            padding: 0.8rem;
            border-radius: 10px;
        }
        
        .language-selector {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 1000;
        }
        
        .lang-btn {
            background: rgba(15, 23, 42, 0.9);
            border: 1px solid #334155;
            color: white;
            padding: 0.8rem 1.5rem;
            border-radius: 50px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 10px;
            font-weight: 500;
            transition: all 0.3s ease;
        }
        
        .lang-btn:hover {
            background: rgba(67, 97, 238, 0.9);
        }
        
        .lang-dropdown {
            position: absolute;
            bottom: 60px;
            right: 0;
            background: rgba(15, 23, 42, 0.95);
            border-radius: 12px;
            padding: 1rem;
            display: none;
            min-width: 200px;
            border: 1px solid #334155;
        }
        
        .lang-dropdown.show {
            display: block;
        }
        
        .lang-option {
            padding: 0.8rem;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .lang-option:hover {
            background: rgba(67, 97, 238, 0.2);
        }
        
        .footer {
            text-align: center;
            padding: 3rem 2rem;
            background: rgba(15, 23, 42, 0.9);
            margin-top: 4rem;
            border-top: 1px solid rgba(148, 163, 184, 0.1);
        }
        
        .connection-status {
            position: fixed;
            bottom: 80px;
            left: 20px;
            background: #10b981;
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
            z-index: 1000;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        @media (max-width: 768px) {
            .navbar {
                flex-direction: column;
                gap: 1rem;
                padding: 1rem;
            }
            
            .nav-links {
                flex-wrap: wrap;
                justify-content: center;
                gap: 1rem;
            }
            
            .hero h1 {
                font-size: 2.5rem;
            }
            
            .platform-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <!-- 네비게이션 바 -->
    <nav class="navbar">
        <div class="logo">
            <i class="fas fa-infinity"></i>
            TL Platform
        </div>
        <div class="nav-links">
            <a href="#home"><i class="fas fa-home"></i> 홈</a>
            <a href="#platforms"><i class="fas fa-th-large"></i> 플랫폼</a>
            <a href="#features"><i class="fas fa-star"></i> 기능</a>
            <a href="auth.html"><i class="fas fa-user"></i> 마이페이지</a>
            <a href="advertiser-dashboard.html"><i class="fas fa-chart-line"></i> 광고관리</a>
        </div>
        <div class="auth-buttons">
            <button class="btn btn-primary" onclick="window.location.href='login.html'">
                <i class="fas fa-sign-in-alt"></i> 로그인
            </button>
            <button class="btn btn-secondary" onclick="window.location.href='register.html'">
                <i class="fas fa-user-plus"></i> 회원가입
            </button>
        </div>
    </nav>

    <!-- 히어로 섹션 -->
    <section class="hero" id="home">
        <h1>통합 웹3.0 플랫폼</h1>
        <p>TL STUDIO, TL 뮤직마켓, TL 튜브를 하나의 플랫폼에서 경험하세요.<br>
           블록체인 기반의 혁신적인 서비스와 다양한 수익 창출 기회를 제공합니다.</p>
        <div style="display: flex; gap: 1rem; justify-content: center; margin-top: 2rem;">
            <button class="btn btn-primary" onclick="window.location.href='#platforms'">
                <i class="fas fa-rocket"></i> 시작하기
            </button>
            <button class="btn btn-secondary" onclick="showDemo()">
                <i class="fas fa-play-circle"></i> 데모보기
            </button>
        </div>
    </section>

    <!-- 플랫폼 그리드 -->
    <section id="platforms" style="padding: 2rem;">
        <h2 style="text-align: center; font-size: 2.5rem; margin-bottom: 3rem; color: #f1f5f9;">주요 플랫폼</h2>
        <div class="platform-grid">
            <div class="platform-card">
                <div class="platform-icon">
                    <i class="fas fa-video"></i>
                </div>
                <h3>TL STUDIO</h3>
                <p>프로페셔널 콘텐츠 제작을 위한 통합 스튜디오.<br>영상 편집, 라이브 스트리밍, 협업 툴까지.</p>
                <button class="btn btn-primary" style="margin-top: 1rem;" onclick="openStudio()">
                    <i class="fas fa-play"></i> 시작하기
                </button>
            </div>
            
            <div class="platform-card">
                <div class="platform-icon">
                    <i class="fas fa-music"></i>
                </div>
                <h3>TL 뮤직마켓</h3>
                <p>블록체인 기반 음원 거래 플랫폼.<br>NFT 음원, 로열티 관리, 아티스트 지원.</p>
                <button class="btn btn-primary" style="margin-top: 1rem;" onclick="openMusicMarket()">
                    <i class="fas fa-shopping-cart"></i> 둘러보기
                </button>
            </div>
            
            <div class="platform-card">
                <div class="platform-icon">
                    <i class="fas fa-film"></i>
                </div>
                <h3>TL 튜브</h3>
                <p>수익 공유형 영상 플랫폼.<br>시청 수익, 광고 수익, 커뮤니티 기여 보상.</p>
                <button class="btn btn-primary" style="margin-top: 1rem;" onclick="openTube()">
                    <i class="fas fa-tv"></i> 시청하기
                </button>
            </div>
        </div>
    </section>

    <!-- 기능 섹션 -->
    <section id="features" class="features">
        <div class="feature-item">
            <div class="feature-icon">
                <i class="fas fa-globe"></i>
            </div>
            <div>
                <h3>다국어 지원</h3>
                <p>한국어, 영어, 일본어, 중국어 등 다양한 언어 지원</p>
            </div>
        </div>
        
        <div class="feature-item">
            <div class="feature-icon">
                <i class="fas fa-shield-alt"></i>
            </div>
            <div>
                <h3>보안 인증</h3>
                <p>블록체인 기반 보안과 이중 인증 시스템</p>
            </div>
        </div>
        
        <div class="feature-item">
            <div class="feature-icon">
                <i class="fas fa-bolt"></i>
            </div>
            <div>
                <h3>실시간 처리</h3>
                <p>Cloudflare Workers 기반의 초고속 데이터 처리</p>
            </div>
        </div>
        
        <div class="feature-item">
            <div class="feature-icon">
                <i class="fas fa-chart-pie"></i>
            </div>
            <div>
                <h3>수익 분석</h3>
                <p>실시간 수익 추적과 상세한 분석 리포트</p>
            </div>
        </div>
    </section>

    <!-- 연결 상태 -->
    <div class="connection-status" id="connectionStatus">
        <i class="fas fa-spinner fa-spin"></i>
        <span>시스템 확인 중...</span>
    </div>

    <!-- 언어 선택기 -->
    <div class="language-selector">
        <div class="lang-btn" onclick="toggleLanguageDropdown()">
            <i class="fas fa-language"></i>
            <span id="current-language">한국어</span>
            <i class="fas fa-chevron-up"></i>
        </div>
        <div class="lang-dropdown" id="languageDropdown">
            <div class="lang-option" onclick="changeLanguage('ko')">
                <span>🇰🇷 한국어</span>
            </div>
            <div class="lang-option" onclick="changeLanguage('en')">
                <span>🇺🇸 English</span>
            </div>
            <div class="lang-option" onclick="changeLanguage('ja')">
                <span>🇯🇵 日本語</span>
            </div>
            <div class="lang-option" onclick="changeLanguage('zh')">
                <span>🇨🇳 中文</span>
            </div>
        </div>
    </div>

    <!-- 푸터 -->
    <footer class="footer">
        <p>© 2024 TL Platform. 모든 권리 보유.</p>
        <p style="margin-top: 1rem; color: #94a3b8; font-size: 0.9rem;">
            블록체인 기반 통합 웹3.0 플랫폼 | 
            <a href="#" style="color: #60a5fa;">개인정보처리방침</a> | 
            <a href="#" style="color: #60a5fa;">이용약관</a>
        </p>
    </footer>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js"></script>
    
    <script>
    // TL Platform 메인 JavaScript
    const BACKEND_URL = 'https://timelink-backend.timelink-api.workers.dev';
    const PLATFORM_VERSION = '2.0.0';
    
    console.log('🚀 TL Platform 시작');
    console.log('🔗 백엔드:', BACKEND_URL);
    console.log('📅 버전:', PLATFORM_VERSION);
    
    // 토스트 설정
    toastr.options = {
        positionClass: 'toast-top-right',
        progressBar: true,
        closeButton: true,
        timeOut: 3000
    };
    
    // 백엔드 연결 확인
    async function checkBackendConnection() {
        const statusEl = document.getElementById('connectionStatus');
        
        try {
            const response = await fetch(BACKEND_URL + '/');
            const data = await response.json();
            
            statusEl.innerHTML = '<i class="fas fa-check-circle"></i> <span>시스템 정상</span>';
            statusEl.style.background = '#10b981';
            
            console.log('✅ 백엔드 연결 성공:', data);
            return true;
        } catch (error) {
            statusEl.innerHTML = '<i class="fas fa-exclamation-triangle"></i> <span>연결 실패</span>';
            statusEl.style.background = '#ef4444';
            
            console.error('❌ 백엔드 연결 실패:', error);
            return false;
        }
    }
    
    // 언어 관리
    let currentLanguage = localStorage.getItem('tl_language') || 'ko';
    
    function toggleLanguageDropdown() {
        const dropdown = document.getElementById('languageDropdown');
        dropdown.classList.toggle('show');
    }
    
    function changeLanguage(lang) {
        currentLanguage = lang;
        localStorage.setItem('tl_language', lang);
        
        const langNames = {
            'ko': '한국어',
            'en': 'English', 
            'ja': '日本語',
            'zh': '中文'
        };
        
        document.getElementById('current-language').textContent = langNames[lang];
        toggleLanguageDropdown();
        
        toastr.success('언어가 변경되었습니다: ' + langNames[lang]);
    }
    
    // 플랫폼 열기 함수
    function openStudio() {
        toastr.info('TL STUDIO 페이지로 이동합니다...');
        // 실제 구현시: window.location.href = 'studio.html';
    }
    
    function openMusicMarket() {
        toastr.info('TL 뮤직마켓 페이지로 이동합니다...');
        // 실제 구현시: window.location.href = 'music-market.html';
    }
    
    function openTube() {
        toastr.info('TL 튜브 페이지로 이동합니다...');
        // 실제 구현시: window.location.href = 'tube.html';
    }
    
    function showDemo() {
        toastr.info('시스템 데모를 시작합니다...');
        // 데모 기능 구현
    }
    
    // 페이지 로드 시 초기화
    document.addEventListener('DOMContentLoaded', async function() {
        console.log('📱 TL Platform 초기화 시작');
        
        // 언어 설정 적용
        changeLanguage(currentLanguage);
        
        // 백엔드 연결 확인
        const isConnected = await checkBackendConnection();
        
        if (isConnected) {
            toastr.success('TL Platform이 준비되었습니다!');
            
            // 로그인 상태 확인
            const token = localStorage.getItem('tl_token');
            if (token) {
                // 로그인 상태면 UI 업데이트
                const authButtons = document.querySelector('.auth-buttons');
                authButtons.innerHTML = \`
                    <button class="btn btn-primary" onclick="window.location.href='auth.html'">
                        <i class="fas fa-user-circle"></i> 마이페이지
                    </button>
                    <button class="btn btn-secondary" onclick="logout()">
                        <i class="fas fa-sign-out-alt"></i> 로그아웃
                    </button>
                \`;
            }
        } else {
            toastr.warning('백엔드에 연결할 수 없습니다. 오프라인 모드로 실행됩니다.');
        }
        
        console.log('✅ TL Platform 초기화 완료');
    });
    
    // 로그아웃 함수
    function logout() {
        localStorage.removeItem('tl_token');
        localStorage.removeItem('tl_user');
        toastr.success('로그아웃되었습니다');
        location.reload();
    }
    
    // 외부 클릭 시 언어 드롭다운 닫기
    document.addEventListener('click', function(event) {
        const dropdown = document.getElementById('languageDropdown');
        const langBtn = document.querySelector('.lang-btn');
        
        if (!langBtn.contains(event.target) && !dropdown.contains(event.target)) {
            dropdown.classList.remove('show');
        }
    });
    
    // API 테스트 함수 (개발용)
    window.testAPI = async function() {
        try {
            const response = await fetch(BACKEND_URL + '/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: 'test@tlplatform.com',
                    password: 'test123'
                })
            });
            
            const data = await response.json();
            console.log('API 테스트 결과:', data);
            toastr.info('API 테스트 완료');
            return data;
        } catch (error) {
            console.error('API 테스트 오류:', error);
            toastr.error('API 테스트 실패');
        }
    };
    </script>
</body>
</html>
HTML

echo "✅ 정상적인 TL Platform으로 복원 완료"
