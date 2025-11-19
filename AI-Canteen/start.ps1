# AI Canteen - Quick Start Script
# This script helps you start both frontend and backend servers

Write-Host "🍃 AI Canteen - Starting Application..." -ForegroundColor Green
Write-Host ""

# Check if MongoDB is running
Write-Host "📊 Checking MongoDB status..." -ForegroundColor Cyan
$mongoService = Get-Service -Name "MongoDB" -ErrorAction SilentlyContinue

if ($mongoService) {
    if ($mongoService.Status -eq "Running") {
        Write-Host "✅ MongoDB is already running" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Starting MongoDB service..." -ForegroundColor Yellow
        Start-Service -Name "MongoDB"
        Start-Sleep -Seconds 2
        Write-Host "✅ MongoDB started successfully" -ForegroundColor Green
    }
} else {
    Write-Host "❌ MongoDB service not found!" -ForegroundColor Red
    Write-Host "   Please install MongoDB or use MongoDB Atlas" -ForegroundColor Yellow
    Write-Host "   See BACKEND_SETUP.md for instructions" -ForegroundColor Yellow
    Write-Host ""
    $continue = Read-Host "Continue anyway? (y/n)"
    if ($continue -ne "y") {
        exit
    }
}

Write-Host ""
Write-Host "🚀 Starting Backend Server..." -ForegroundColor Cyan
Write-Host "   Backend will run on: http://localhost:5000" -ForegroundColor Gray

# Start backend in a new PowerShell window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'd:\VIT(24-27)\Year 3\AI-Canteen\backend'; Write-Host '🔧 Backend Server Starting...' -ForegroundColor Cyan; npm run dev"

Write-Host "✅ Backend terminal opened" -ForegroundColor Green
Start-Sleep -Seconds 3

Write-Host ""
Write-Host "⚛️  Starting Frontend Server..." -ForegroundColor Cyan
Write-Host "   Frontend will run on: http://localhost:3000" -ForegroundColor Gray

# Start frontend in a new PowerShell window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'd:\VIT(24-27)\Year 3\AI-Canteen\my-frontend'; Write-Host '⚛️  Frontend Server Starting...' -ForegroundColor Cyan; npm start"

Write-Host "✅ Frontend terminal opened" -ForegroundColor Green

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "🎉 AI Canteen Application Starting!" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host ""
Write-Host "📝 Application URLs:" -ForegroundColor Cyan
Write-Host "   Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "   Backend:  http://localhost:5000" -ForegroundColor White
Write-Host ""
Write-Host "💡 Tips:" -ForegroundColor Cyan
Write-Host "   - Wait for both servers to start (15-30 seconds)" -ForegroundColor Gray
Write-Host "   - Frontend will open in your browser automatically" -ForegroundColor Gray
Write-Host "   - Check the terminal windows for any errors" -ForegroundColor Gray
Write-Host "   - Press Ctrl+C in terminal windows to stop servers" -ForegroundColor Gray
Write-Host ""
Write-Host "📚 Documentation:" -ForegroundColor Cyan
Write-Host "   - AUTHENTICATION_SETUP.md - Complete system overview" -ForegroundColor Gray
Write-Host "   - BACKEND_SETUP.md - Backend setup guide" -ForegroundColor Gray
Write-Host "   - backend/README.md - API documentation" -ForegroundColor Gray
Write-Host ""
Write-Host "Press any key to exit this window..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
