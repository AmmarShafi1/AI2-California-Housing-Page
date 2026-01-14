@echo off
echo ============================================
echo California Housing Predictor - GitHub Pages
echo ============================================
echo.

:input
set /p REPO_URL="Enter your GitHub repository URL (e.g., https://github.com/username/repo.git): "

if "%REPO_URL%"=="" (
    echo Error: Repository URL cannot be empty
    goto input
)

echo.
echo Initializing Git repository...
git init

echo.
echo Adding files...
git add .

echo.
echo Committing files...
git commit -m "Initial commit: California Housing Price Predictor"

echo.
echo Adding remote repository...
git remote add origin %REPO_URL%

echo.
echo Renaming branch to main...
git branch -M main

echo.
echo Pushing to GitHub...
git push -u origin main

echo.
echo ============================================
echo Deployment Complete!
echo ============================================
echo.
echo Next steps:
echo 1. Go to your GitHub repository
echo 2. Click Settings ^> Pages
echo 3. Under "Source", select "main" branch and "/" (root)
echo 4. Click Save
echo 5. Wait a few minutes and visit your site!
echo.
pause

