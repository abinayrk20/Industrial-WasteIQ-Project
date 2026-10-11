@echo off
title Push Project to GitHub
color 0A
cd /d "C:\Users\Dell\.gemini\antigravity\scratch\Industrial-Project-Management"

echo ================================================================
echo Pushing Industrial Project Management System (WasteIQ) to GitHub
echo ================================================================
echo.

git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ================================================================
    echo SUCCESS! Project successfully pushed to GitHub!
    echo ================================================================
) else (
    echo.
    echo ================================================================
    echo FAILED to push! 
    echo Please make sure:
    echo 1. The repository is created on github.com
    echo 2. You sign in when the GitHub login prompt appears
    echo ================================================================
)

echo.
pause
