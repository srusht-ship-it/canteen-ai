# Start MongoDB Server Script
# This script helps you start MongoDB on Windows

Write-Host "🔍 Checking MongoDB installation..." -ForegroundColor Cyan

# Check if MongoDB service exists
$mongoService = Get-Service -Name MongoDB* -ErrorAction SilentlyContinue

if ($mongoService) {
    Write-Host "✅ Found MongoDB service: $($mongoService.Name)" -ForegroundColor Green
    
    if ($mongoService.Status -eq "Running") {
        Write-Host "✅ MongoDB is already running!" -ForegroundColor Green
        Write-Host "   Connection: mongodb://127.0.0.1:27017" -ForegroundColor Gray
        exit 0
    } else {
        Write-Host "🔄 Starting MongoDB service..." -ForegroundColor Yellow
        try {
            Start-Service -Name $mongoService.Name
            Write-Host "✅ MongoDB service started successfully!" -ForegroundColor Green
            Write-Host "   Connection: mongodb://127.0.0.1:27017" -ForegroundColor Gray
            exit 0
        } catch {
            Write-Host "❌ Failed to start service. You may need to run PowerShell as Administrator." -ForegroundColor Red
            Write-Host "   Try: Right-click PowerShell -> Run as Administrator" -ForegroundColor Yellow
            exit 1
        }
    }
}

# Check if mongod is in PATH
Write-Host "🔍 Checking for mongod executable..." -ForegroundColor Cyan
$mongodPath = Get-Command mongod -ErrorAction SilentlyContinue

if (-not $mongodPath) {
    # Try common installation paths
    $commonPaths = @(
        "C:\Program Files\MongoDB\Server\7.0\bin\mongod.exe",
        "C:\Program Files\MongoDB\Server\6.0\bin\mongod.exe",
        "C:\Program Files\MongoDB\Server\5.0\bin\mongod.exe",
        "C:\MongoDB\Server\7.0\bin\mongod.exe",
        "C:\MongoDB\Server\6.0\bin\mongod.exe"
    )
    
    foreach ($path in $commonPaths) {
        if (Test-Path $path) {
            $mongodPath = $path
            Write-Host "✅ Found mongod at: $path" -ForegroundColor Green
            break
        }
    }
}

if ($mongodPath) {
    $mongodLocation = if ($mongodPath.Source) { $mongodPath.Source } else { $mongodPath }
    Write-Host "✅ Found mongod: $mongodLocation" -ForegroundColor Green
    
    # Create data directory if it doesn't exist
    $dataPath = "C:\data\db"
    if (-not (Test-Path $dataPath)) {
        Write-Host "📁 Creating data directory: $dataPath" -ForegroundColor Yellow
        New-Item -ItemType Directory -Force -Path $dataPath | Out-Null
    }
    
    Write-Host ""
    Write-Host "🚀 Starting MongoDB manually..." -ForegroundColor Green
    Write-Host "   Data path: $dataPath" -ForegroundColor Gray
    Write-Host "   Connection: mongodb://127.0.0.1:27017" -ForegroundColor Gray
    Write-Host ""
    Write-Host "⚠️  Keep this window open while using the application" -ForegroundColor Yellow
    Write-Host "   Press Ctrl+C to stop MongoDB" -ForegroundColor Gray
    Write-Host ""
    
    # Start mongod
    if ($mongodPath.Source) {
        & $mongodPath.Source --dbpath $dataPath
    } else {
        & $mongodPath --dbpath $dataPath
    }
} else {
    Write-Host ""
    Write-Host "❌ MongoDB is not installed or not found!" -ForegroundColor Red
    Write-Host ""
    Write-Host "📥 To install MongoDB:" -ForegroundColor Yellow
    Write-Host "   1. Download from: https://www.mongodb.com/try/download/community" -ForegroundColor Gray
    Write-Host "   2. Run the installer (choose 'Complete' installation)" -ForegroundColor Gray
    Write-Host "   3. During install, check 'Install MongoDB as a Service'" -ForegroundColor Gray
    Write-Host ""
    Write-Host "🐳 Alternative: Use MongoDB Atlas (cloud):" -ForegroundColor Yellow
    Write-Host "   1. Sign up at: https://www.mongodb.com/cloud/atlas/register" -ForegroundColor Gray
    Write-Host "   2. Create a free cluster" -ForegroundColor Gray
    Write-Host "   3. Get connection string and update backend/.env" -ForegroundColor Gray
    Write-Host "   4. Set MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ai-canteen" -ForegroundColor Gray
    Write-Host ""
    exit 1
}
