@echo off
setlocal
title TimeLink Local
cd /d "%~dp0"
where node >nul 2>&1
if errorlevel 1 (
 echo Node.js is not installed. Run install-timelink-local.bat first.
 pause
 exit /b 1
)
where cloudflared >nul 2>&1
if errorlevel 1 (
 echo cloudflared is not installed. Run install-timelink-local.bat first.
 pause
 exit /b 1
)
echo.
echo TimeLink Local is starting...
echo Local API: http://127.0.0.1:8787
echo Keep this window open while TimeLink Local is online.
echo.
node server.js
echo.
echo TimeLink Local has stopped.
pause
