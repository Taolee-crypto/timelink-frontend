#!/bin/bash
echo "🚀 TimeLink 배포..."

# public 폴더 정리
rm -rf public
mkdir -p public

# HTML 파일 복사
cp *.html public/ 2>/dev/null
[ -d "src" ] && cp src/*.html public/ 2>/dev/null

# JS 파일 복사
mkdir -p public/scripts
cp *.js public/scripts/ 2>/dev/null
[ -d "scripts" ] && cp -r scripts/* public/scripts/ 2>/dev/null
[ -d "src/scripts" ] && cp -r src/scripts/* public/scripts/ 2>/dev/null

# CSS 파일 복사
mkdir -p public/styles
cp *.css public/styles/ 2>/dev/null
[ -d "styles" ] && cp -r styles/* public/styles/ 2>/dev/null
[ -d "src/styles" ] && cp -r src/styles/* public/styles/ 2>/dev/null

# 설정
echo "timelink.digital" > public/CNAME
touch public/.nojekyll

# 결과
echo "✅ 완료!"
ls -la public/
