@echo off
echo Starting all services...
echo.

REM Start Frontend
start "FRONTEND" cmd /k "cd kelo_ui && bun dev"

REM Start Backend
start "BACKEND" cmd /k "cd backend && npm run dev"

REM Start Pipeline
start "PIPELINE" cmd /k "cd pipeline && uvicorn main:app --reload"

echo All services started in separate windows!
echo.
echo Frontend: http://localhost:5173
echo Backend: http://localhost:3000
echo Pipeline: http://localhost:8000
echo.
echo Press any key to exit...
pause >nul
