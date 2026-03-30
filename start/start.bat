@echo off
REM ========================================
REM Technical Support RAG - Startup Script
REM ========================================

REM Ensure script runs from project root regardless of launch location
set "SCRIPT_DIR=%~dp0"
pushd "%SCRIPT_DIR%.."
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to locate project root directory.
    pause
    exit /b 1
)

echo ========================================
echo Technical Support RAG - Startup Script
echo ========================================
echo.

REM Check if all directories exist
if not exist "kelo_ui" (
    echo ERROR: kelo_ui directory not found!
    echo Please run this script from the project root directory.
    pause
    exit /b 1
)

if not exist "backend" (
    echo ERROR: backend directory not found!
    echo Please run this script from the project root directory.
    pause
    exit /b 1
)

if not exist "pipeline" (
    echo ERROR: pipeline directory not found!
    echo Please run this script from the project root directory.
    pause
    exit /b 1
)

REM Start Frontend (Vite + React)
echo [1/3] Starting Frontend on port 7878...
where bun >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    start "FRONTEND" cmd /k "cd kelo_ui && bun dev"
) else (
    start "FRONTEND" cmd /k "cd kelo_ui && npm run dev"
)
timeout /t 2 /nobreak >nul

REM Start Backend (Node.js + Express)
echo [2/3] Starting Backend on port 5000...
start "BACKEND" cmd /k "cd backend && npm run dev"
timeout /t 2 /nobreak >nul

REM Start Pipeline (FastAPI + Python)
echo [3/3] Starting Pipeline on port 8000...
REM Check if virtual environment exists
if exist "pipeline\venv" (
    start "PIPELINE" cmd /k "cd pipeline && venv\Scripts\activate && uvicorn main:app --reload --host 0.0.0.0 --port 8000"
) else (
    start "PIPELINE" cmd /k "cd pipeline && uvicorn main:app --reload --host 0.0.0.0 --port 8000"
)

echo.
echo ========================================
echo All services started successfully!
echo ========================================
echo.
echo Service URLs:
echo   Frontend:  http://localhost:7878
echo   Backend:   http://localhost:5000
echo   Pipeline:  http://localhost:8000
echo.
echo API Documentation:
echo   Pipeline:  http://localhost:8000/docs
echo.
echo Each service is running in a separate window.
echo Close the service windows to stop them.
echo ========================================
echo.
popd
pause
