@echo off
setlocal EnableExtensions
title TimeLink Local - Windows Installer
cd /d "%~dp0"
echo.
echo ==========================================
echo        TimeLink Local Windows Installer
echo ==========================================
echo.

where winget >nul 2>&1
if errorlevel 1 (
 echo [ERROR 1] Windows winget is not available.
 echo Please update/install Microsoft App Installer, then run this file again.
 goto :end_error
)

echo [1/3] Installing/checking Node.js 20 LTS...
where node >nul 2>&1
if errorlevel 1 (
 winget install --id OpenJS.NodeJS.LTS --exact --accept-source-agreements --accept-package-agreements
 if errorlevel 1 goto :node_error
)

echo [2/3] Installing/checking Cloudflare cloudflared...
where cloudflared >nul 2>&1
if errorlevel 1 (
 winget install --id Cloudflare.cloudflared --exact --accept-source-agreements --accept-package-agreements
 if errorlevel 1 goto :cloudflare_error
)

rem Refresh PATH for this command window after winget installation.
set "PATH=%ProgramFiles%\nodejs;%ProgramFiles%\Cloudflare;%ProgramFiles(x86)%\Cloudflare;%LOCALAPPDATA%\Microsoft\WinGet\Links;%PATH%"

echo.
echo [CHECK] Node.js:
where node
if errorlevel 1 goto :node_path_error
node --version

echo.
echo [CHECK] cloudflared:
where cloudflared
if errorlevel 1 goto :cloudflare_path_error
cloudflared --version

echo.
echo [3/3] Creating Desktop shortcut...
powershell -NoProfile -ExecutionPolicy Bypass -Command "$ws=New-Object -ComObject WScript.Shell; $s=$ws.CreateShortcut([Environment]::GetFolderPath('Desktop')+'\TimeLink Local.lnk'); $s.TargetPath='%~dp0start-timelink-local.bat'; $s.WorkingDirectory='%~dp0'; $s.Description='TimeLink Local'; $s.Save()"
if errorlevel 1 goto :shortcut_error

echo.
echo ==========================================
echo INSTALLATION COMPLETED
echo ==========================================
echo Desktop shortcut: TimeLink Local
echo.
echo Now double-click the Desktop shortcut.
echo.
pause
exit /b 0

:node_error
echo [ERROR] Node.js installation failed.
goto :end_error
:cloudflare_error
echo [ERROR] cloudflared installation failed.
goto :end_error
:node_path_error
echo [ERROR] Node.js was installed but Windows PATH was not refreshed.
goto :end_error
:cloudflare_path_error
echo [ERROR] cloudflared was installed but Windows PATH was not refreshed.
goto :end_error
:shortcut_error
echo [ERROR] Could not create Desktop shortcut.
goto :end_error
:end_error
echo.
echo The installer is stopping so you can read this error.
pause
exit /b 1
