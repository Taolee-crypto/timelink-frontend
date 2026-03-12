# TimeLink i18n 전체 배포 스크립트
# 사용법: 이 파일을 다운받은 폴더에서 PowerShell로 실행
#   cd C:\Users\win11\Desktop
#   .\deploy-i18n.ps1

$FRONTEND = "C:\Users\win11\Desktop\timelink-frontend\public"
$SCRIPT_DIR = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "=== TimeLink i18n 배포 ===" -ForegroundColor Cyan

# 1. 파일 목록
$files = @(
  "i18n.js",
  "login.html",
  "signup.html",
  "shareplace.html",
  "creator.html",
  "dashboard.html",
  "chart.html",
  "cafe-radio.html",
  "incar.html",
  "cafe-channel.html",
  "incar-channel.html",
  "admin.html"
)

# 2. 복사
Write-Host "`n[1/3] 파일 복사 중..." -ForegroundColor Yellow
foreach ($f in $files) {
  $src = Join-Path $SCRIPT_DIR $f
  $dst = Join-Path $FRONTEND $f
  if (Test-Path $src) {
    Copy-Item $src $dst -Force
    Write-Host "  OK: $f" -ForegroundColor Green
  } else {
    Write-Host "  SKIP (없음): $f" -ForegroundColor Gray
  }
}

# 3. Git push
Write-Host "`n[2/3] Git 커밋 & 푸시..." -ForegroundColor Yellow
Set-Location "C:\Users\win11\Desktop\timelink-frontend"
git add -A
git commit -m "feat: i18n 6개국어 지원 (KO/EN/JA/ZH/TH/VI)"
git push origin main

Write-Host "`n[3/3] 완료!" -ForegroundColor Cyan
Write-Host "Cloudflare Pages가 자동 배포를 시작합니다." -ForegroundColor White
Write-Host "https://www.timelink.digital 에서 우상단 국기 버튼으로 언어 전환 확인하세요." -ForegroundColor White
