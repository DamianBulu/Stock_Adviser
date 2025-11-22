# Ghid de Instalare - Hermes Stock Analysis

## 📋 Cerințe Preliminare

Aplicația necesită **Node.js** (versiunea 18 sau mai nouă) și **npm** (vine cu Node.js).

## 🔧 Instalare Node.js

### Opțiunea 1: Download direct (Recomandat)
1. Accesează: https://nodejs.org/
2. Descarcă versiunea **LTS** (Long Term Support)
3. Rulează installer-ul și urmează pașii
4. **Important**: Bifează opțiunea "Add to PATH" în timpul instalării
5. Restart PowerShell/Terminal după instalare

### Opțiunea 2: Cu Chocolatey (dacă ai Chocolatey instalat)
```powershell
choco install nodejs
```

### Opțiunea 3: Cu winget (Windows 10/11)
```powershell
winget install OpenJS.NodeJS.LTS
```

## ✅ Verificare Instalare

După instalare, deschide un **nou** PowerShell/Terminal și verifică:

```powershell
node --version
npm --version
```

Ar trebui să vezi versiunile instalate.

## 🚀 Instalare Dependențe Proiect

După ce Node.js este instalat:

```powershell
cd D:\Hermes_Hackathon
npm install
```

## ▶️ Rulare Aplicație

```powershell
npm run dev
```

Aplicația va rula pe: `http://localhost:5173`

## ⚠️ Probleme Comune

### "npm nu este recunoscut"
- **Soluție**: Restart PowerShell/Terminal după instalarea Node.js
- Verifică că Node.js este în PATH: `$env:PATH`

### "EACCES" sau permisiuni
- Rulează PowerShell ca Administrator
- Sau folosește: `npm install --global --force`

### Port 5173 ocupat
- Schimbă portul în `vite.config.js` sau oprește procesul care folosește portul

## 📝 Note

- Prima instalare (`npm install`) poate dura 1-2 minute
- Dependențele se instalează în folderul `node_modules/`
- Nu comitați `node_modules/` în git (deja în `.gitignore`)




