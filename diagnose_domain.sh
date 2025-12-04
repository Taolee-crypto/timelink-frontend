#!/bin/bash
echo "=== Custom Domain 진단 ==="
echo ""

# 1. HTTP 헤더 비교
echo "1. HTTP 헤더 비교:"
echo "GitHub Pages 헤더:"
curl -I "https://taolee-crypto.github.io/timelink/" | grep -i "cache\|date\|age"
echo ""
echo "Custom Domain 헤더:"
curl -I "https://timelink.digital/" | grep -i "cache\|date\|age"
echo ""

# 2. 파일 해시 비교
echo "2. 파일 내용 비교:"
echo "GitHub Pages 내용 샘플:"
curl -s "https://taolee-crypto.github.io/timelink/" | grep -o "시간 기반[^<]*" | head -1
echo ""
echo "Custom Domain 내용 샘플:"
curl -s "https://timelink.digital/" | grep -o "시간 기반[^<]*" | head -1
echo ""

# 3. 빌드 정보 확인
echo "3. 빌드 정보 확인:"
echo "GitHub Actions 상태 확인: https://github.com/Taolee-crypto/timelink/actions"
echo "Pages 설정 확인: https://github.com/Taolee-crypto/timelink/settings/pages"
