#!/bin/bash

echo "⚡ TimeLink 빠른 배포 시작..."

# 1. 경로 확인
if [ ! -d "src" ]; then
    echo "❌ src 디렉토리를 찾을 수 없습니다!"
    exit 1
fi

# 2. 도메인 설정
echo "🌐 도메인: timelink.digital"
echo "timelink.digital" > public/CNAME

# 3. 배포
echo "🚀 배포 중..."
cp -r src/* public/ 2>/dev/null || true
cp -r scripts/styles/* public/scripts/styles/ 2>/dev/null || true

# 4. Git 배포
git add public/
git commit -m "Quick deploy: $(date +'%H:%M:%S')"
git push origin main

echo "✅ 빠른 배포 완료!"
echo "🌐 https://timelink.digital"
echo "🌐 https://taolee-crypto.github.io/timelink-frontend/"
