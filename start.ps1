# Script pentru a porni aplicația Hermes
# Reîncarcă PATH-ul pentru a găsi Node.js și npm

# Reîncarcă variabilele de mediu
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

# Verifică dacă Node.js este disponibil
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js nu este găsit în PATH!" -ForegroundColor Red
    Write-Host "Te rugăm să reîncărci PowerShell sau să instalezi Node.js." -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Node.js găsit: $(node --version)" -ForegroundColor Green
Write-Host "✅ npm găsit: $(npm --version)" -ForegroundColor Green
Write-Host ""
Write-Host "🚀 Pornesc aplicația..." -ForegroundColor Cyan
Write-Host ""

# Pornește aplicația
npm run dev




