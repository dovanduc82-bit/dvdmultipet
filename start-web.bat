@echo off
title PetNutri - Modern Jamstack Pet Food Store
echo ========================================================
echo   KHOI DONG WEBSITE BAN THUC AN THU CUNG PETNUTRI
echo ========================================================
set PATH=%LOCALAPPDATA%\Programs\nodejs;%PATH%
cd /d "%~dp0"
echo [1/2] Dang mo trinh duyet...
start http://localhost:3000
echo [2/2] Dang khoi chay may chu Next.js...
npm run dev
pause
