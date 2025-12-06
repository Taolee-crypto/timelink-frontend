@echo off
echo TimeLink 개발 서버 시작
echo ==========================

REM 백엔드 확인
echo 백엔드 확인 중...
curl http://localhost:8787/api/test > nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ 백엔드 실행 중: http://localhost:8787
) else (
    echo ⚠️ 백엔드가 실행되지 않았습니다
    echo 다른 터미널에서 다음 명령어 실행:
    echo cd C:\Users\win11\timelink-backend
    echo npx wrangler dev src/index.js
    echo.
)

REM 프론트엔드 서버 시작
echo.
echo 🌐 프론트엔드 서버 시작 중...
echo URL: http://localhost:3000/login.html
echo.
echo 📋 테스트 계정:
echo 이메일: integration@test.com
echo 비밀번호: test123
echo.

REM Python 서버 시작
where python > nul 2>&1
if %errorlevel% equ 0 (
    echo 📦 Python 서버 사용
    start python -m http.server 3000
) else (
    where python3 > nul 2>&1
    if %errorlevel% equ 0 (
        echo 📦 Python3 서버 사용
        start python3 -m http.server 3000
    ) else (
        echo ❌ Python이 설치되어 있지 않습니다
        echo 브라우저에서 직접 파일을 열어주세요:
        echo C:\Users\win11\timelink\login.html
        pause
        exit /b 1
    )
)

REM 브라우저 자동 열기
timeout /t 2 /nobreak > nul
start chrome http://localhost:3000/login.html

echo.
echo ✅ 서버가 시작되었습니다!
echo 브라우저에서 테스트해보세요.
echo 서버 종료: Ctrl+C
echo.
pause
