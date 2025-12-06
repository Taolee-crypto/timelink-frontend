#!/bin/bash
echo "🔄 HTML 파일 업데이트 중..."

# 1. index.html 업데이트
if [ -f "index.html" ]; then
    echo "📄 index.html 업데이트..."
    # 간단한 수정 - head에 스타일 추가
    sed -i '/<\/head>/i\    <link rel="stylesheet" href="css/api-styles.css">' index.html
    # body 끝에 스크립트 추가
    sed -i '/<\/body>/i\    <script src="js/api-config.js"></script>\n    <script src="js/main-api.js"></script>' index.html
fi

# 2. login.html 업데이트
if [ -f "login.html" ]; then
    echo "📄 login.html 업데이트..."
    sed -i '/<\/head>/i\    <link rel="stylesheet" href="css/api-styles.css">' login.html
    sed -i '/<\/body>/i\    <script src="js/api-config.js"></script>\n    <script src="js/login-api.js"></script>' login.html
    
    # 메시지 표시를 위한 div 추가 (존재하지 않으면)
    if ! grep -q "id=\"message\"" login.html; then
        sed -i '/<form/i\        <div id="message"></div>' login.html
    fi
fi

# 3. register.html 업데이트
if [ -f "register.html" ]; then
    echo "📄 register.html 업데이트..."
    sed -i '/<\/head>/i\    <link rel="stylesheet" href="css/api-styles.css">' register.html
    sed -i '/<\/body>/i\    <script src="js/api-config.js"></script>\n    <script src="js/login-api.js"></script>' register.html
    
    if ! grep -q "id=\"message\"" register.html; then
        sed -i '/<form/i\        <div id="message"></div>' register.html
    fi
fi

# 4. 다른 HTML 파일들도 업데이트
for html_file in music-market.html studio.html tube.html advertiser-dashboard.html; do
    if [ -f "$html_file" ]; then
        echo "📄 $html_file 업데이트..."
        sed -i '/<\/head>/i\    <link rel="stylesheet" href="css/api-styles.css">' "$html_file"
        sed -i '/<\/body>/i\    <script src="js/api-config.js"></script>\n    <script src="js/main-api.js"></script>' "$html_file"
    fi
done

echo "✅ HTML 파일 업데이트 완료!"
echo ""
echo "📱 테스트 방법:"
echo "1. 브라우저에서 login.html 열기"
echo "2. 이메일: integration@test.com, 비밀번호: test123 으로 로그인"
echo "3. 로그인 성공 후 index.html로 이동"
echo "4. 데이터가 표시되는지 확인"
