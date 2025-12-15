#!/bin/bash

echo "🔨 TimeLink 프론트엔드 빌드 중..."
npm run build

echo "🚀 GitHub Pages에 배포 중..."

# gh-pages가 설치되어 있는지 확인
if ! command -v gh-pages &> /dev/null; then
    echo "gh-pages 설치 중..."
    npm install --save-dev gh-pages
fi

# 배포
npx gh-pages -d dist

echo "✅ 배포 완료!"
echo "🌐 https://taolee-crypto.github.io/timelink/"
