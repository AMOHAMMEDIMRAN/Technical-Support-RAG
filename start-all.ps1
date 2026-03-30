# Technical Support RAG - Start All Services
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Starting Technical Support RAG Services" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Start Frontend (Vite + React)
Write-Host "[1/3] Starting Frontend on port 7878..." -ForegroundColor Blue
Start-Process -FilePath "cmd" -ArgumentList "/k", "cd kelo_ui && bun dev" -WindowStyle Normal
Start-Sleep -Seconds 2

# Start Backend (Node.js + Express)
Write-Host "[2/3] Starting Backend on port 5000..." -ForegroundColor Magenta
Start-Process -FilePath "cmd" -ArgumentList "/k", "cd backend && npm run dev" -WindowStyle Normal
Start-Sleep -Seconds 2

# Start Pipeline (FastAPI + Python)
Write-Host "[3/3] Starting Pipeline on port 8000..." -ForegroundColor Green
Start-Process -FilePath "cmd" -ArgumentList "/k", "cd pipeline && uvicorn main:app --reload --host 0.0.0.0 --port 8000" -WindowStyle Normal

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "All services started successfully!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Service URLs:" -ForegroundColor White
Write-Host "  Frontend:  " -NoNewline -ForegroundColor White
Write-Host "http://localhost:7878" -ForegroundColor Yellow
Write-Host "  Backend:   " -NoNewline -ForegroundColor White
Write-Host "http://localhost:5000" -ForegroundColor Yellow
Write-Host "  Pipeline:  " -NoNewline -ForegroundColor White
Write-Host "http://localhost:8000" -ForegroundColor Yellow
Write-Host ""
Write-Host "Each service is running in a separate window." -ForegroundColor Gray
Write-Host "Close the service windows to stop them." -ForegroundColor Gray
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
