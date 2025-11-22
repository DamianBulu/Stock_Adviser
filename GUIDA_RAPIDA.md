# 🚀 Ghid Rapid - Hermes Stock Analysis

## ⚡ Pornire Rapidă

### Opțiunea 1: Cu script PowerShell (Recomandat)
```powershell
.\start.ps1
```

### Opțiunea 2: Manual
```powershell
# Reîncarcă PATH-ul (dacă npm nu este recunoscut)
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

# Pornește aplicația
npm run dev
```

## 🌐 Accesare Aplicație

După ce aplicația pornește, deschide în browser:
**http://localhost:5173**

## 🔐 Login

- **Username:** `damian`
- **Password:** `damian123`

## 📊 Testare

Caută companii cu simboluri:
- **AAPL** - Apple
- **TSLA** - Tesla  
- **MSFT** - Microsoft
- **GOOGL** - Google
- **NVDA** - NVIDIA

## ⚠️ Probleme Comune

### "npm nu este recunoscut"
**Soluție:** Rulează această comandă înainte:
```powershell
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
```

### Port 5173 ocupat
**Soluție:** Închide procesul care folosește portul sau schimbă portul în `vite.config.js`

### Erori API
- Alpha Vantage: 5 calls/minute (free tier)
- Verifică conexiunea la internet
- Verifică că API keys sunt corecte

## 🛑 Oprire Aplicație

Apasă `Ctrl + C` în terminal




