# TimeLink 모든 서버 실행 (현재 폴더 기준)
Write-Host "🚀 TimeLink 서버 실행..." -ForegroundColor Cyan
Write-Host "현재 위치: $PWD" -ForegroundColor Green

# 1. 프론트엔드 서버 (현재 폴더)
Write-Host "1️⃣ 프론트엔드 서버 시작..." -ForegroundColor Yellow
$frontendJob = Start-Job -ScriptBlock { npm run dev }

# 2. 백엔드 서버 (상대 경로)
Write-Host "2️⃣ 백엔드 서버 시작..." -ForegroundColor Yellow
$backendJob = Start-Job -ScriptBlock { 
    cd ..\timelink-backend
    npm start
}

# 3. 프록시 서버 (현재 폴더)
Write-Host "3️⃣ 프록시 서버 시작..." -ForegroundColor Yellow
$proxyJob = Start-Job -ScriptBlock { node proxy-3003.js }

# 작업 모니터링
Write-Host "`n✅ 모든 서버를 백그라운드에서 시작했습니다!" -ForegroundColor Green
Write-Host "`n📊 작업 상태:" -ForegroundColor Magenta
Get-Job | Format-Table -AutoSize

Write-Host "`n🌐 대시보드 열기: http://localhost:6199/dashboard.html" -ForegroundColor Cyan
Write-Host "`n서버를 종료하려면: Stop-Job *" -ForegroundColor Yellow
