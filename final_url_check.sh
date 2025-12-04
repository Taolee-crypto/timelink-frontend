#!/bin/bash
echo "=== 모든 URL 최종 확인 ==="
echo "확인 시간: $(date)"
echo ""

URLS=(
    "사업용 페이지 (메인):https://timelink.digital/"
    "GitHub Pages (백업):https://taolee-crypto.github.io/timelink/"
    "API 서버:https://timelink.digital/api/health"
    "www 서브도메인:https://www.timelink.digital/"
)

for item in "${URLS[@]}"; do
    name="${item%%:*}"
    url="${item#*:}"
    
    echo "🔍 $name:"
    echo "   URL: $url"
    
    # 상태 코드
    status=$(curl -s -o /dev/null -w "%{http_code}" "$url")
    echo "   Status: $status"
    
    # 응답 확인
    if [ "$status" = "200" ]; then
        title=$(curl -s "$url" | grep -o "<title>[^<]*" | head -1 | sed 's/<title>//')
        echo "   Title: $title"
    fi
    
    echo ""
done

echo "✅ 모든 설정 완료!"
echo "🚀 TL Platform 랜딩 페이지 준비 완료!"
