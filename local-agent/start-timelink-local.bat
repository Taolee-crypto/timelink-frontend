@echo off
setlocal EnableExtensions
title TimeLink Local
cd /d "%~dp0"

rem Include common installation locations so a newly installed app is found.
set "PATH=%ProgramFiles%\nodejs;%ProgramFiles%\Cloudflare;%ProgramFiles(x86)%\Cloudflare;%ProgramFiles(x86)%\cloudflared;%LOCALAPPDATA%\Microsoft\WinGet\Links;%PATH%"

rem Cloudflare may install directly under Program Files (x86)\cloudflared.
if exist "%ProgramFiles(x86)%\cloudflared\cloudflared.exe" set "CLOUDFLARED_BIN=%ProgramFiles(x86)%\cloudflared\cloudflared.exe"
if not defined CLOUDFLARED_BIN if exist "%ProgramFiles%\cloudflared\cloudflared.exe" set "CLOUDFLARED_BIN=%ProgramFiles%\cloudflared\cloudflared.exe"

echo.
echo ==========================================
echo              TimeLink Local
echo ==========================================
echo.

where node >nul 2>&1
if errorlevel 1 (
 echo [ERROR] Node.js was not found.
 echo Run install-timelink-local.bat first.
 goto :stop
)

where cloudflared >nul 2>&1
if errorlevel 1 (
 echo [ERROR] cloudflared was not found.
 echo Run install-timelink-local.bat first.
 goto :stop
)

echo Node.js:
node --version
echo cloudflared:
if defined CLOUDFLARED_BIN (
 echo %CLOUDFLARED_BIN%
 "%CLOUDFLARED_BIN%" --version
) else (
 where cloudflared
 cloudflared --version
)
echo.
echo Starting TimeLink Local...
echo Local API: http://127.0.0.1:8787
echo Keep this window open while TimeLink Local is online.
echo.

node server.js
echo.
echo TimeLink Local stopped.
:stop
echo.
echo ==========================================
echo This window will remain open so you can read any error.
echo ==========================================
pause
