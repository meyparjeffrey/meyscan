# Script para verificar y mostrar información del QR
Set-Location "C:\meyscan_build\scanner-apk"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  VERIFICADOR DE QR EXPO" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar servidor
$server = Get-NetTCPConnection -LocalPort 8081 -ErrorAction SilentlyContinue
if (-not $server) {
    Write-Host "ERROR: El servidor Expo NO esta corriendo" -ForegroundColor Red
    Write-Host "Ejecuta: npm run start:qr" -ForegroundColor Yellow
    exit
}

Write-Host "[OK] Servidor Expo activo en puerto 8081" -ForegroundColor Green
Write-Host ""

# Obtener IP local
$ipAddress = (Get-NetIPAddress -AddressFamily IPv4 | 
    Where-Object {$_.IPAddress -match '^192\.168\.' -or $_.IPAddress -match '^10\.'} | 
    Select-Object -First 1).IPAddress

Write-Host "=== INFORMACION DEL QR ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Busca la ventana de PowerShell donde se ejecuto 'npm run start:qr'" -ForegroundColor White
Write-Host "2. El QR deberia aparecer en esa ventana" -ForegroundColor White
Write-Host "3. Espera 10-15 segundos si aun no lo ves (el tunnel tarda en establecerse)" -ForegroundColor Yellow
Write-Host ""

if ($ipAddress) {
    Write-Host "=== URL ALTERNATIVA ===" -ForegroundColor Cyan
    Write-Host "Si el QR no aparece, usa esta URL en Expo Go:" -ForegroundColor White
    Write-Host ""
    Write-Host "  exp://$ipAddress`:8081" -ForegroundColor Green
    Write-Host ""
    Write-Host "Pasos:" -ForegroundColor White
    Write-Host "  1. Abre Expo Go en tu movil" -ForegroundColor White
    Write-Host "  2. Toca 'Enter URL manually'" -ForegroundColor White
    Write-Host "  3. Pega la URL de arriba" -ForegroundColor White
    Write-Host "  4. Asegurate de estar en la misma red WiFi" -ForegroundColor Yellow
    Write-Host ""
}

Write-Host "=== COMANDOS UTILES EN LA TERMINAL DE EXPO ===" -ForegroundColor Cyan
Write-Host "Presiona estas teclas en la ventana donde corre Expo:" -ForegroundColor White
Write-Host "  ? - Ver todas las opciones" -ForegroundColor Yellow
Write-Host "  w - Abrir en navegador web" -ForegroundColor Yellow
Write-Host "  r - Recargar la app" -ForegroundColor Yellow
Write-Host "  m - Mostrar menu" -ForegroundColor Yellow
Write-Host ""

Write-Host "=== ESTADO ACTUAL ===" -ForegroundColor Cyan
Write-Host "Servidor: ACTIVO" -ForegroundColor Green
Write-Host "Puerto: 8081" -ForegroundColor Green
if ($ipAddress) {
    Write-Host "IP Local: $ipAddress" -ForegroundColor Green
}
Write-Host ""
Write-Host "El QR deberia estar visible en la ventana de PowerShell principal" -ForegroundColor Yellow
Write-Host ""

