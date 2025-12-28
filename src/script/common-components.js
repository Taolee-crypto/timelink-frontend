<!DOCTYPE html>
<html lang="ko">
<head>
    <!-- ... 기존 meta 태그와 스타일 ... -->
</head>
<body>
    <!-- 공통 네비게이션 바 컨테이너 -->
    <div id="nav-container"></div>
    
    <!-- 기존 메인 컨텐츠 -->
    <main>
        <!-- ... -->
    </main>
    
    <!-- 기존 푸터 -->
    
    <!-- JavaScript -->
    <!-- Font Awesome -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/js/all.min.js"></script>
    <!-- 공통 컴포넌트 -->
    <script src="src/script/common-components.js"></script>
    
    <script>
        // index.html 전용 스크립트
        document.addEventListener('DOMContentLoaded', function() {
            // URL 파라미터 체크
            const urlParams = new URLSearchParams(window.location.search);
            const loginSuccess = urlParams.get('login');
            const logoutSuccess = urlParams.get('logout');
            
            if (loginSuccess === 'success') {
                // 로그인 성공 메시지 표시
                console.log('로그인 성공');
                // 필요시 토스트 메시지 표시 등 추가
            }
            
            if (logoutSuccess === 'true') {
                // 로그아웃 성공 메시지 표시
                console.log('로그아웃 성공');
            }
        });
    </script>
</body>
</html>
