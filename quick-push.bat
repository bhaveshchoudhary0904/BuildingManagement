@echo off
echo ================================
echo Auto Git Commit and Push Script
echo ================================
echo.

cd /d "%~dp0"

echo Adding all changes...
git add -A
if %errorlevel% neq 0 (
    echo Error adding files
    pause
    exit /b 1
)

echo.
echo Committing changes...
set /p message="Enter commit message (or press Enter for auto-message): "
if "%message%"=="" (
    set message=Auto-update: %date% %time%
)
git commit -m "%message%"
if %errorlevel% neq 0 (
    echo No changes to commit
    pause
    exit /b 0
)

echo.
echo Pushing to GitHub...
git push origin main
if %errorlevel% neq 0 (
    echo Error pushing to GitHub
    pause
    exit /b 1
)

echo.
echo ================================
echo Successfully pushed to GitHub!
echo ================================
pause