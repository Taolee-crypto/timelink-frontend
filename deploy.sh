#!/bin/bash

echo "🚀 TimeLink 프론트엔드 배포 시작..."

# 1. public 디렉토리 정리
echo "📁 public 디렉토리 정리..."
rm -rf public/*
mkdir -p public/scripts/styles

# 2. 소스 파일 복사
echo "📦 소스 파일 복사..."
cp -r src/* public/

# 3. 공통 컴포넌트 복사
echo "🔄 공통 컴포넌트 복사..."
cp -r scripts/styles/* public/scripts/styles/

# 4. 모든 HTML 파일의 상대 경로 확인
echo "🔧 HTML 파일 경로 검사..."
for html_file in public/*.html; do
    if [ -f "$html_file" ]; then
        echo "  처리 중: $(basename $html_file)"
        # ./ 경로로 통일 (상대경로)
        sed -i 's|href="/|href="./|g' "$html_file"
        sed -i 's|src="/|src="./|g' "$html_file"
    fi
done

# 5. CNAME 파일 생성 - timelink.digital 도메인
echo "🌐 CNAME 설정 (timelink.digital)..."
echo "timelink.digital" > public/CNAME

# 6. .nojekyll 파일 생성 (GitHub Pages용)
touch public/.nojekyll

# 7. robots.txt 생성
echo "🤖 robots.txt 생성..."
cat > public/robots.txt << EOF
User-agent: *
Allow: /
Sitemap: https://timelink.digital/sitemap.xml

# 크롤링 지연
Crawl-delay: 2
EOF

# 8. sitemap.xml 생성 (간단 버전)
echo "🗺 sitemap.xml 생성..."
cat > public/sitemap.xml << EOF
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>https://timelink.digital/</loc>
        <lastmod>$(date +%Y-%m-%d)</lastmod>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
    </url>
    <url>
        <loc>https://timelink.digital/index.html</loc>
        <lastmod>$(date +%Y-%m-%d)</lastmod>
        <changefreq>daily</changefreq>
        <priority>0.9</priority>
    </url>
    <url>
        <loc>https://timelink.digital/signup.html</loc>
        <lastmod>$(date +%Y-%m-%d)</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
    </url>
    <url>
        <loc>https://timelink.digital/login.html</loc>
        <lastmod>$(date +%Y-%m-%d)</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.7</priority>
    </url>
    <url>
        <loc>https://timelink.digital/dashboard.html</loc>
        <lastmod>$(date +%Y-%m-%d)</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
    </url>
</urlset>
EOF

# 9. favicon 설정 파일
echo "🎨 favicon 설정..."
cat > public/favicon-config.html << EOF
<link rel="apple-touch-icon" sizes="180x180" href="./apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="32x32" href="./favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="./favicon-16x16.png">
<link rel="manifest" href="./site.webmanifest">
<link rel="mask-icon" href="./safari-pinned-tab.svg" color="#7c4dff">
<meta name="msapplication-TileColor" content="#0a0a1a">
<meta name="theme-color" content="#7c4dff">
EOF

# 10. 배포
echo "🚀 GitHub Pages 배포 중..."
git add public/
git commit -m "Deploy: $(date +'%Y-%m-%d %H:%M:%S') - 도메인 timelink.digital으로 업데이트"
git push origin main

echo "✅ 배포 완료!"
echo "🌐 사이트 주소: https://taolee-crypto.github.io/timelink-frontend/"
echo "🌐 도메인 주소: https://timelink.digital"
echo ""
echo "⚠️  도메인 설정 확인사항:"
echo "1. GitHub Pages 설정에서 Custom domain을 'timelink.digital'로 설정"
echo "2. DNS 공급자에서 다음 레코드 추가:"
echo "   - CNAME: timelink.digital → taolee-crypto.github.io"
echo "   - 또는 A 레코드: 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153"
