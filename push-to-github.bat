@echo off
chcp 65001 >nul
title Day Code Len GitHub - DVDmultilPET
echo ========================================================
echo   DANG DAY TOAN BO CODE LEN GITHUB: dvdmultipet
echo ========================================================
echo.
set "PATH=C:\Program Files\Git\cmd;%PATH%"
cd /d "e:\DEVERLOP"

git add .
git commit -m "feat: synchronize products, enhance product routing, add video render engine and optimize social links"
git push -u origin main

echo.
echo ========================================================
echo   DA DAY CODE LEN GITHUB THANH CONG!
echo   Bam phim bat ky de dong cua so...
echo ========================================================
pause
