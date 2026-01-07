# Script para monitorear logs de Expo en tiempo real
Set-Location "C:\meyscan_build\scanner-apk"

Write-Host "=== INICIANDO EXPO CON MONITOREO DE LOGS ===" -ForegroundColor Cyan
Write-Host ""

# Detener procesos anteriores
Get-NetTCPConnection -LocalPort 8081 -ErrorAction SilentlyContinue | 
    Select-Object -ExpandProperty OwningProcess | 
    ForEach-Object { Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue }

Start-Sleep -Seconds 2

Write-Host "Iniciando Expo con tunnel..." -ForegroundColor Yellow
Write-Host "Los logs apareceran en tiempo real" -ForegroundColor Yellow
Write-Host "Presiona Ctrl+C para detener" -ForegroundColor Yellow
Write-Host ""

# Iniciar Expo y mostrar logs en tiempo real
npm run start:qr

