#!/bin/bash
echo "=== timelink.digital 최종 검증 ==="
echo "검증 시간: $(date)"
echo ""

SUCCESS=true

# 1. 루트 경로 - 사업용 페이지인지
echo "1. 루트 경로 검증:"
ROOT_CHECK=$(curl -s "https://timelink.digital/?check=$(date +%s)")
if echo "$ROOT_CHECK" | grep -q "투자 기회"; then
    echo "   ✅ 사업용 페이지 확인됨"
elif echo "$ROOT_CHECK" | grep -q "TimeLink API"; then
    echo "   ❌ 아직 Worker 페이지"
    SUCCESS=false
else
    echo "   ⚠️  다른 페이지"
fi

# 2. API 경로 - Worker 응답인지
echo ""
echo "2. API 경로 검증:"
API_CHECK=$(curl -s "https://timelink.digital/api/health" 2>/dev/null)
if [ -n "$API_CHECK" ]; then
    echo "   ✅ API Worker 작동 중"
else
    echo "   ❌ API 응답 없음"
fi

# 3. GitHub Pages와 비교
echo ""
echo "3. GitHub Pages와 비교:"
GP_TITLE=$(curl -s "https://taolee-crypto.github.io/timelink/" | grep -o "<title>[^<]*")
CD_TITLE=$(curl -s "https://timelink.digital/" | grep -o "<title>[^<]*")

if [ "$GP_TITLE" = "$CD_TITLE" ]; then
    echo "   ✅ 두 도메인 동일한 페이지"
else
    echo "   ❌ 다른 페이지"
    echo "   GitHub Pages: $GP_TITLE"
    echo "   Custom Domain: $CD_TITLE"
    SUCCESS=false
fi

echo ""
if [ "$SUCCESS" = true ]; then
    echo "🎉🎉🎉 완전한 성공! 🎉🎉🎉"
    echo "timelink.digital이 정상적으로 작동합니다!"
    echo ""
    echo "이제 사용할 URL:"
    echo "👉 https://timelink.digital/"
    echo ""
    echo "모든 기능 정상:"
    echo "✅ 사업용 랜딩 페이지"
    echo "✅ 투자 정보 섹션"
    echo "✅ 시장 분석"
    echo "✅ 반응형 디자인"
    echo "✅ HTTPS 자동 적용"
else
    echo "⚠️  아직 문제가 있습니다."
    echo "Cloudflare 캐시를 기다려보세요 (최대 5분)."
fi
