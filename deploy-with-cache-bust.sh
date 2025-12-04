#!/bin/bash
echo "=== 강제 캐시 무효화 배포 ==="

# 1. 현재 시간으로 캐시 버스터 생성
CACHE_BUSTER=$(date +%s)
echo "캐시 버스터: $CACHE_BUSTER"

# 2. index.html에 캐시 버스터 적용
cat > index.html << HTML
<!DOCTYPE html>
<!-- 
  캐시 버스터: $CACHE_BUSTER
  생성 시간: $(date)
-->
<html>
<head>
    <meta charset="UTF-8">
    <title>TL Platform :: CB-$CACHE_BUSTER</title>
    <script>
    // 캐시 완전 무효화
    if (window.location.search.indexOf('cb=') === -1) {
        window.location.search = '?cb=$CACHE_BUSTER&t=' + Date.now();
    }
    
    const BACKEND = 'https://timelink-backend.timelink-api.workers.dev';
    
    // 모든 캐시 삭제 시도
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(function(registrations) {
            for(let registration of registrations) {
                registration.unregister();
            }
        });
    }
    
    if ('caches' in window) {
        caches.keys().then(function(keyList) {
            return Promise.all(keyList.map(function(key) {
                return caches.delete(key);
            }));
        });
    }
    
    // 페이지가 캐시되지 않도록 설정
    window.onpageshow = function(event) {
        if (event.persisted) {
            window.location.reload();
        }
    };
    
    async function test() {
        const response = await fetch(BACKEND + '/');
        const text = await response.text();
        document.getElementById('result').innerHTML = \`
            <h2 style="color: \${response.ok ? 'green' : 'red'}">
                \${response.ok ? '✅ 성공' : '❌ 실패'}
            </h2>
            <p><strong>백엔드:</strong> \${BACKEND}</p>
            <p><strong>상태:</strong> \${response.status}</p>
            <p><strong>응답:</strong> \${text.substring(0, 200)}</p>
            <p><strong>캐시 버스터:</strong> $CACHE_BUSTER</p>
            <p><strong>테스트 시간:</strong> \${new Date().toLocaleString()}</p>
        \`;
    }
    
    window.onload = test;
    </script>
    <style>
        body { font-family: Arial; padding: 20px; }
        #result { 
            padding: 20px; 
            background: #f0f0f0; 
            border-radius: 10px; 
            margin: 20px 0; 
        }
    </style>
</head>
<body>
    <h1>🔧 TL Platform - 캐시 버스터: $CACHE_BUSTER</h1>
    <p>이 페이지는 강제로 캐시를 무효화합니다.</p>
    <button onclick="test()">테스트</button>
    <div id="result">테스트 중...</div>
    <div style="margin-top: 30px; padding: 15px; background: #fff3cd; border-radius: 5px;">
        <strong>배포 정보:</strong><br>
        캐시 버스터: $CACHE_BUSTER<br>
        배포 시간: $(date)<br>
        GitHub Pages 캐시 강제 무효화
    </div>
</body>
</html>
HTML

# 3. GitHub에 강제 배포
git add -A
git commit -m "강제 캐시 무효화 배포 (버스터: $CACHE_BUSTER)"
git push origin main

echo ""
echo "✅ 배포 완료!"
echo "🔗 테스트 URL: https://taolee-crypto.github.io/timelink/?cb=$CACHE_BUSTER"
echo ""
echo "🚨 시크릿 모드에서 테스트하세요!"
