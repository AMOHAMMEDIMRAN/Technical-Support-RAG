@echo off
REM ========================================
REM Technical Support RAG - Setup Script
REM Installs all dependencies for all services
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
echo Technical Support RAG - Setup Script
echo ========================================
echo.
echo This script will install dependencies for:
echo   - Frontend (kelo_ui)
echo   - Backend (backend)
echo   - Pipeline (pipeline)
echo.
echo Please wait, this may take a few minutes...
echo ========================================
echo.

REM Check if directories exist
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

echo.
echo ========================================
echo [1/3] Installing Frontend Dependencies
echo ========================================
echo.

REM Check if bun is installed
where bun >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo WARNING: Bun is not installed!
    echo.
    echo Please install Bun from https://bun.sh/
    echo.
    echo Alternative: Using npm instead...
    cd kelo_ui
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo ERROR: Failed to install frontend dependencies!
        cd ..
        pause
        exit /b 1
    )
    cd ..
) else (
    cd kelo_ui
    call bun install
    if %ERRORLEVEL% NEQ 0 (
        echo ERROR: Failed to install frontend dependencies!
        cd ..
        pause
        exit /b 1
    )
    cd ..
    echo Frontend dependencies installed successfully!
)

echo.
echo ========================================
echo [2/3] Installing Backend Dependencies
echo ========================================
echo.

cd backend

REM Check if Node.js is installed
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    cd ..
    pause
    exit /b 1
)

call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to install backend dependencies!
    cd ..
    pause
    exit /b 1
)

cd ..
echo Backend dependencies installed successfully!

echo.
echo ========================================
echo [3/3] Installing Pipeline Dependencies
echo ========================================
echo.

cd pipeline

REM Check if Python is installed
where python >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Python is not installed!
    echo Please install Python 3.10+ from https://www.python.org/
    cd ..
    pause
    exit /b 1
)

REM Check Python version
python --version
echo.

REM Create virtual environment if it doesn't exist
if not exist "venv" (
    echo Creating Python virtual environment...
    python -m venv venv
    if %ERRORLEVEL% NEQ 0 (
        echo ERROR: Failed to create virtual environment!
        cd ..
        pause
        exit /b 1
    )
    echo Virtual environment created successfully!
)

echo Activating virtual environment and installing dependencies...
call venv\Scripts\activate.bat
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to activate virtual environment!
    cd ..
    pause
    exit /b 1
)

pip install --upgrade pip
pip install -r requirements.txt
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to install pipeline dependencies!
    call deactivate
    cd ..
    pause
    exit /b 1
)

call deactivate
cd ..
echo Pipeline dependencies installed successfully!

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo All dependencies have been installed successfully!
echo.
echo Environment setup:
echo   Frontend: bun/npm packages installed
echo   Backend:  npm packages installed
echo   Pipeline: Python venv created and packages installed
echo.
echo Next steps:
echo   1. Configure environment variables:
echo      - Copy backend\.env.example to backend\.env
echo      - Copy kelo_ui\.env.example to kelo_ui\.env
echo   2. Make sure MongoDB is running
echo   3. Run: start\start.bat
echo.
echo ========================================
echo.
popd
pause
