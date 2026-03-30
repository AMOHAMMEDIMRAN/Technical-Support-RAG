# Start All Services
Write-Host "Starting all services..." -ForegroundColor Cyan
Write-Host ""

# Start Frontend
Write-Host "Starting Frontend (kelo_ui)..." -ForegroundColor Blue
Start-Process -FilePath "cmd" -ArgumentList "/k", "cd kelo_ui && bun dev" -WindowStyle Normal

# Start Backend
Write-Host "Starting Backend..." -ForegroundColor Magenta
Start-Process -FilePath "cmd" -ArgumentList "/k", "cd backend && npm run dev" -WindowStyle Normal

# Start Pipeline
Write-Host "Starting Pipeline..." -ForegroundColor Green
Start-Process -FilePath "cmd" -ArgumentList "/k", "cd pipeline && uvicorn main:app --reload" -WindowStyle Normal

Write-Host ""
Write-Host "All services started in separate windows!" -ForegroundColor Green
Write-Host ""
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Yellow
Write-Host "Backend: http://localhost:3000" -ForegroundColor Yellow
Write-Host "Pipeline: http://localhost:8000" -ForegroundColor Yellow
Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
