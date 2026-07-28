@echo off
color 0A
echo ========================================
echo   Gym Management System - Health Check
echo ========================================
echo.

cd /d "%~dp0"

echo [Checking] Python installation...
backend\env\Scripts\python.exe --version >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Python is installed
) else (
    echo [ERROR] Python not found
    goto :error
)

echo [Checking] Virtual environment...
if exist "backend\env\Scripts\python.exe" (
    echo [OK] Virtual environment exists
) else (
    echo [ERROR] Virtual environment not found
    goto :error
)

echo [Checking] Database...
if exist "backend\db.sqlite3" (
    echo [OK] Database exists
) else (
    echo [WARNING] Database not found - run migrations
)

echo [Checking] Django installation...
backend\env\Scripts\python.exe -c "import django; print('[OK] Django version:', django.get_version())" 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Django not installed
    goto :error
)

echo [Checking] Required packages...
backend\env\Scripts\python.exe -c "import rest_framework, corsheaders, rest_framework_simplejwt" 2>nul
if %errorlevel% equ 0 (
    echo [OK] All packages installed
) else (
    echo [ERROR] Some packages missing
    goto :error
)

echo.
echo ========================================
echo   All Checks Passed!
echo ========================================
echo.
echo   Your system is ready to run.
echo   Use START_GYM_SYSTEM.bat to start.
echo.
pause
exit /b 0

:error
echo.
echo ========================================
echo   System Check Failed!
echo ========================================
echo.
echo   Please check the errors above.
echo   Refer to QUICK_START.md for setup.
echo.
pause
exit /b 1
