@echo off
echo ========================================
echo   Gym Management System - Starting...
echo ========================================
echo.

cd /d "%~dp0"

echo [1/3] Activating virtual environment...
call backend\env\Scripts\activate.bat

echo [2/3] Starting Django server...
start "Gym Management Backend" cmd /k "backend\env\Scripts\python.exe backend\manage.py runserver"

timeout /t 3 /nobreak >nul

echo [3/3] Opening browser...
start http://127.0.0.1:8000/static/login.html

echo.
echo ========================================
echo   System Started Successfully!
echo ========================================
echo.
echo   Dashboard: http://127.0.0.1:8000/static/login.html
echo   Admin Panel: http://127.0.0.1:8000/admin/
echo.
echo   Login Credentials:
echo   Email: admin@example.com
echo   Password: admin@123
echo.
echo   Press any key to exit this window...
echo   (Backend server will keep running)
echo ========================================
pause >nul
