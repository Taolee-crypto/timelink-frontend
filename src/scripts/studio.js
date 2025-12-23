<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>STUDIO | TIMELINK - 콘텐츠 변환 플랫폼</title>
    
    <!-- Fonts & Icons -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Orbitron:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    
    <!-- Styles -->
    <link rel="stylesheet" href="studio.css">
    <style>
        /* studio.html 전용 스타일만 유지 */
        /* (원래 studio.html의 스타일 중 studio.css로 이동하지 않은 부분) */
        /* 스튜디오 전용 스타일들... */
    </style>
</head>
<body>
    <!-- 공통 헤더 -->
    <header class="tl-header">
        <div class="header-container">
            <!-- 로고 -->
            <a href="index.html" class="tl-logo">
                <div class="tl-logo-icon">TL</div>
                <div class="tl-logo-text">TIMELINK</div>
            </a>

            <!-- 네비게이션 -->
            <nav class="tl-nav">
                <a href="studio.html" class="nav-link active">
                    <i class="fas fa-sliders-h"></i> <span>STUDIO</span>
                </a>
                <a href="shareplace.html" class="nav-link">
                    <i class="fas fa-store"></i> <span>SHAREPLACE</span>
                </a>
                <a href="tltube.html" class="nav-link">
                    <i class="fas fa-play-circle"></i> <span>TLTUBE</span>
                </a>
                <a href="tlmusic.html" class="nav-link">
                    <i class="fas fa-music"></i> <span>TLMUSIC</span>
                </a>
                <a href="cafe-radio.html" class="nav-link">
                    <i class="fas fa-broadcast-tower"></i> <span>CAFE RADIO</span>
                </a>
            </nav>

            <!-- 사용자 메뉴 -->
            <div class="user-section">
                <div class="tl-balance" id="tlBalance">
                    <div class="tl-icon">TL</div>
                    <span id="balanceAmount">0</span>
                </div>
                
                <div class="user-avatar" id="userAvatar">
                    <i class="fas fa-user"></i>
                </div>
            </div>
        </div>
    </header>

    <!-- 나머지 studio.html 콘텐츠... -->
    
    <!-- Scripts -->
    <script src="studio.js"></script>
    <script>
        // studio.html 전용 JavaScript (필요한 경우)
    </script>
</body>
</html>
