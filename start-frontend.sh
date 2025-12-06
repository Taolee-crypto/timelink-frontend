#!/bin/bash
echo "🚀 프론트엔드 개발 서버 시작"
echo "==========================="

# 백엔드 상태 확인
echo "1. 백엔드 상태 확인..."
curl -s http://localhost:8787/api/test | grep -q "success" && echo "✅ 백엔드 연결됨" || echo "⚠️ 백엔드 확인 필요"

# 로컬 서버 시작
echo -e "\n2. 로컬 서버 시작..."
echo "🌐 프론트엔드 URL: http://localhost:3000"
echo "🔗 백엔드 API: http://localhost:8787"
echo ""
echo "📋 테스트 계정:"
echo "이메일: integration@test.com"
echo "비밀번호: test123"
echo ""

# 사용 가능한 서버 옵션
if command -v python3 &> /dev/null; then
    echo "Python3 HTTP 서버 실행 중..."
    python3 -m http.server 3000
elif command -v python &> /dev/null; then
    echo "Python HTTP 서버 실행 중..."
    python -m http.server 3000
elif command -v npx &> /dev/null; then
    echo "npx http-server 실행 중..."
    npx http-server -p 3000
else
    echo "❌ HTTP 서버를 찾을 수 없습니다."
    echo "다음 중 하나를 설치하세요:"
    echo "- Python3: python3 -m http.server 3000"
    echo "- Node.js: npx http-server -p 3000"
    echo ""
    echo "또는 브라우저에서 직접 파일을 열 수 있습니다:"
    echo "file:///c/Users/win11/timelink/login.html"
fi
