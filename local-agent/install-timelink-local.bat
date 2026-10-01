@echo off
setlocal
title TimeLink Local - One Click Installer
cd /d "%~dp0"
echo.
echo ==========================================
echo       TimeLink Local One-Click Installer
echo ==========================================
echo.
where winget >nul 2>&1
if errorlevel 1 (
 echo [ERROR] winget was not found.
 echo Install Microsoft App Installer first, then run this again.
 pause
 exit /b 1
)
echo [1/3] Checking Node.js...
where node >nul 2>&1
if errorlevel 1 (
 echo Installing Node.js 20 LTS...
 winget install --id OpenJS.NodeJS.LTS --exact --accept-source-agreements --accept-package-agreements
 if errorlevel 1 goto :fail
)
echo [2/3] Checking cloudflared...
where cloudflared >nul 2>&1
if errorlevel 1 (
 echo Installing Cloudflare cloudflared...
 winget install --id Cloudflare.cloudflared --exact --accept-source-agreements --accept-package-agreements
 if errorlevel 1 goto :fail
)
echo [3/3] Creating Desktop shortcut...
powershell -NoProfile -ExecutionPolicy Bypass -Command "$ws=New-Object -ComObject WScript.Shell; $s=$ws.CreateShortcut([Environment]::GetFolderPath('Desktop')+'\TimeLink Local.lnk'); $s.TargetPath='%~dp0start-timelink-local.bat'; $s.WorkingDirectory='%~dp0'; $s.Save()"
echo.
echo Installation completed.
echo Double-click TimeLink Local on the Desktop to start.
echo.
pause
exit /b 0
:fail
echo.
echo Installation failed. Please run this installer as Administrator and try again.
pause
exit /b 1
