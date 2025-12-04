#!/bin/bash
echo "🚀 TL Platform 시작..."

# 백엔드 시작
cd ~/timelink-backend
npx wrangler dev --local &
BACKEND_PID=$!
echo "✅ 백엔드 시작됨 (PID: $BACKEND_PID)"

# 2초 대기
sleep 2

# 프론트엔드 시작
cd ~/timelink
python3 -m http.server 8000 &
FRONTEND_PID=$!
echo "✅ 프론트엔드 시작됨 (PID: $FRONTEND_PID)"

echo ""
echo "🌐 접속: http://localhost:8000"
echo "🔧 백엔드: http://localhost:8787"
echo ""
echo "종료: kill $BACKEND_PID $FRONTEND_PID"

# 프론트엔드가 종료될 때까지 대기
wait $FRONTEND_PID
