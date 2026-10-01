@echo off
title TimeLink Local
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js 20+ is required.
  pause
  exit /b 1
)
where cloudflared >nul 2>nul
if errorlevel 1 (
  echo cloudflared is required and must be in PATH.
  echo Download from https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/
  pause
  exit /b 1
)
npm start
pause
