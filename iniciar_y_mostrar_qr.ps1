# Script para iniciar Expo y mostrar el QR de forma visible
Set-Location "C:\meyscan_build\scanner-apk"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  INICIANDO EXPO CON QR VISIBLE" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Iniciar Expo con tunnel y capturar salida
Write-Host "Iniciando Expo con tunnel..." -ForegroundColor Yellow
Write-Host "Espera 15-20 segundos para que aparezca el QR..." -ForegroundColor Yellow
Write-Host ""

# Ejecutar y mostrar salida en tiempo real
npm run start:qr 2>&1 | ForEach-Object {
    Write-Host $_ -ForegroundColor White
    # Detectar si hay QR o URL
    if ($_ -match "exp://") {
        Write-Host ""
        Write-Host "=== QR/URL DETECTADO ===" -ForegroundColor Green
        Write-Host $_
    }
}

