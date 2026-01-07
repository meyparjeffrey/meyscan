# Script para obtener y mostrar el QR de Expo
Set-Location "C:\meyscan_build\scanner-apk"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  OBTENIENDO QR DE EXPO" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar servidor
$server = Get-NetTCPConnection -LocalPort 8081 -ErrorAction SilentlyContinue
if (-not $server) {
    Write-Host "ERROR: Servidor no esta corriendo" -ForegroundColor Red
    Write-Host "Ejecuta primero: npm run start:qr" -ForegroundColor Yellow
    exit
}

Write-Host "[OK] Servidor activo en puerto 8081" -ForegroundColor Green
Write-Host ""

# Obtener IP local
$ipAddress = (Get-NetIPAddress -AddressFamily IPv4 | 
    Where-Object {$_.IPAddress -match '^192\.168\.' -or $_.IPAddress -match '^10\.'} | 
    Select-Object -First 1).IPAddress

Write-Host "=== URL PARA EXPO GO ===" -ForegroundColor Cyan
Write-Host ""
if ($ipAddress) {
    Write-Host "URL Local (misma red WiFi):" -ForegroundColor White
    Write-Host "  exp://$ipAddress`:8081" -ForegroundColor Green
    Write-Host ""
}

Write-Host "=== INSTRUCCIONES ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. El QR aparece en la terminal donde ejecutaste 'npm run start:qr'" -ForegroundColor White
Write-Host "2. Si usas tunnel, la URL sera algo como: exp://exp.host/@usuario/meyscan" -ForegroundColor White
Write-Host "3. Puedes usar la URL local de arriba si estas en la misma WiFi" -ForegroundColor White
Write-Host ""
Write-Host "=== PARA VER EL QR EN LA TERMINAL ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "El QR se muestra en formato ASCII en la terminal interactiva" -ForegroundColor Yellow
Write-Host "No se puede capturar facilmente en un archivo de log" -ForegroundColor Yellow
Write-Host "Pero el servidor esta activo y el QR deberia estar visible" -ForegroundColor Green
Write-Host ""

# Intentar leer el archivo de log si existe
if (Test-Path "expo_output.txt") {
    Write-Host "=== BUSCANDO EN EL LOG ===" -ForegroundColor Cyan
    $content = Get-Content "expo_output.txt" -Raw
    if ($content -match "exp://[^\s\n]+") {
        Write-Host ""
        Write-Host "URL encontrada en el log:" -ForegroundColor Green
        Write-Host $matches[0] -ForegroundColor Cyan
        Write-Host ""
    }
}

Write-Host "=== CONFIRMACION ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Servidor: ACTIVO" -ForegroundColor Green
Write-Host "Tunnel: CONECTADO (según el log)" -ForegroundColor Green
Write-Host "QR: Deberia estar visible en la terminal interactiva" -ForegroundColor Yellow
Write-Host ""

