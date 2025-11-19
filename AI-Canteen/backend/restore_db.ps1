<#
Windows PowerShell helper to restore MongoDB from an archive created by mongodump
Usage (PowerShell):
  cd backend
  .\restore_db.ps1 -InFile ..\canteen_dump.archive

Requirements: mongorestore must be installed and available in PATH (MongoDB Database Tools).
This script will attempt to read MONGODB_URI from .env; if not found it defaults to mongodb://localhost:27017/ai-canteen
By default the script will drop existing data in the target DB before restoring (--drop). Use -NoDrop to keep existing data.
#>

param(
  [string]$InFile = "..\canteen_dump.archive",
  [switch]$NoDrop
)

# Resolve the script directory and .env
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

# Validate input file
$resolvedIn = Resolve-Path -LiteralPath $InFile -ErrorAction SilentlyContinue
if (-not $resolvedIn) {
  Write-Error "Input archive not found: $InFile`nPlease provide a valid archive path, e.g. .\\restore_db.ps1 -InFile ..\\canteen_dump.archive"
  exit 1
}

$fullIn = $resolvedIn.Path
Write-Host "Using MongoDB URI: $mongoUri"
Write-Host "Restoring archive: $fullIn"

# Build arguments
$args = @("--uri", "$mongoUri", "--archive=$fullIn", "--gzip")
if (-not $NoDrop) {
  $args += "--drop"
  Write-Host "The '--drop' flag will remove existing collections before restore. To keep existing data, run with -NoDrop." -ForegroundColor Yellow
} else {
  Write-Host "Restoring without dropping existing data (--NoDrop provided)." -ForegroundColor Yellow
}

# Run mongorestore
try {
  Write-Host "Running: mongorestore $($args -join ' ')"
  $process = Start-Process -FilePath mongorestore -ArgumentList $args -NoNewWindow -Wait -PassThru -ErrorAction Stop
  if ($process.ExitCode -eq 0) {
    Write-Host "✅ Database restored from archive: $fullIn"
  } else {
    Write-Error "mongorestore returned exit code $($process.ExitCode)"
  }
} catch {
  Write-Error "Failed to run mongorestore. Make sure MongoDB Database Tools are installed and 'mongorestore' is on PATH.`nError: $_"
  exit 1
}
