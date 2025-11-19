<#
Windows PowerShell helper to export MongoDB using mongodump --archive
Usage (PowerShell):
  cd backend
  .\export_db.ps1 -OutFile ..\canteen_dump.archive

Requirements: mongodump must be installed and available in PATH (MongoDB Database Tools).
#>

param(
  [string]$OutFile = "..\canteen_dump.archive"
)

# Try to read MONGODB_URI from .env if present
$envFile = Join-Path $PSScriptRoot '.env'
$mongoUri = $null
if (Test-Path $envFile) {
  Get-Content $envFile | ForEach-Object {
    if ($_ -match '^\s*MONGODB_URI\s*=\s*(.+)') {
      $mongoUri = $Matches[1].Trim("'\"")
    }
  }
}

if (-not $mongoUri) {
  Write-Host "MONGODB_URI not found in .env, defaulting to mongodb://localhost:27017/ai-canteen"
  $mongoUri = "mongodb://localhost:27017/ai-canteen"
}

Write-Host "Using MongoDB URI:`n$mongoUri"
Write-Host "Output archive: $OutFile"

# Run mongodump
$cmd = "mongodump --uri `"$mongoUri`" --archive=`"$OutFile`" --gzip"
Write-Host "Running: $cmd"

try {
  $process = Start-Process -FilePath mongodump -ArgumentList "--uri`,"$mongoUri"","--archive=","$OutFile","--gzip" -NoNewWindow -Wait -PassThru -ErrorAction Stop
  if ($process.ExitCode -eq 0) {
    Write-Host "✅ Database exported to $OutFile"
  } else {
    Write-Host "mongodump returned exit code $($process.ExitCode)"
  }
} catch {
  Write-Error "Failed to run mongodump. Make sure MongoDB Database Tools are installed and mongodump is on PATH.`nError: $_"
}
