@echo off
title Backscatter
cd /d "%~dp0app"
where node >nul 2>nul || (echo Node.js is not installed. Install it from nodejs.org, then double-click this file again. & pause & exit /b 1)
if exist node_modules (
  call npm run build --silent >nul 2>build-error.txt || (type build-error.txt & pause & exit /b 1)
  del build-error.txt
)
if not exist dist\index.html (echo The app is not built. Run: npm --prefix app install, then double-click this file again. & pause & exit /b 1)
node scripts\serve.mjs dist
pause
