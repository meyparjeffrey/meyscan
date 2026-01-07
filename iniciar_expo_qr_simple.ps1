# Script simple para iniciar Expo con QR visible
Set-Location "C:\meyscan_build\scanner-apk"

Write-Host "Deteniendo procesos anteriores..." -ForegroundColor Yellow
Get-NetTCPConnection -LocalPort 8081 -ErrorAction SilentlyContinue | 
    Select-Object -ExpandProperty OwningProcess | 
    ForEach-Object { Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue }
Start-Sleep -Seconds 2

Write-Host ""
Write-Host "=== INICIANDO EXPO CON TUNNEL (QR VISIBLE) ===" -ForegroundColor Green
Write-Host ""

# Iniciar Expo con tunnel
npm run start:qr

