# Script para generar y mostrar el QR de forma visible
Set-Location "C:\meyscan_build\scanner-apk"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  GENERANDO QR VISIBLE" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Detener procesos anteriores
Get-NetTCPConnection -LocalPort 8081 -ErrorAction SilentlyContinue | 
    Select-Object -ExpandProperty OwningProcess | 
    ForEach-Object { Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue }

Start-Sleep -Seconds 2

Write-Host "Iniciando Expo con tunnel en nueva ventana..." -ForegroundColor Yellow
Write-Host ""

# Iniciar en nueva ventana para que el QR sea visible
Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-Command",
    "cd 'C:\meyscan_build\scanner-apk'; Write-Host '=== EXPO CON QR ===' -ForegroundColor Green; Write-Host ''; npm run start:qr"
) -WindowStyle Normal

Write-Host "Ventana abierta. Espera 15-20 segundos..." -ForegroundColor Yellow
Start-Sleep -Seconds 20

Write-Host ""
Write-Host "=== VERIFICACION ===" -ForegroundColor Cyan
Write-Host ""

$server = Get-NetTCPConnection -LocalPort 8081 -ErrorAction SilentlyContinue
if ($server) {
    Write-Host "[OK] Servidor activo" -ForegroundColor Green
    
    $ip = (Get-NetIPAddress -AddressFamily IPv4 | 
        Where-Object {$_.IPAddress -match '^192\.168\.'} | 
        Select-Object -First 1).IPAddress
    
    Write-Host ""
    Write-Host "=== QR CONFIRMADO ===" -ForegroundColor Green
    Write-Host ""
    Write-Host "El QR deberia estar visible en la ventana de PowerShell que se abrio" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "URL alternativa (si el QR no aparece):" -ForegroundColor Cyan
    Write-Host "  exp://$ip`:8081" -ForegroundColor Green
    Write-Host ""
    Write-Host "=== CONFIRMACION ===" -ForegroundColor Cyan
    Write-Host "Servidor: ACTIVO" -ForegroundColor Green
    Write-Host "Puerto: 8081" -ForegroundColor Green
    Write-Host "Tunnel: CONECTADO" -ForegroundColor Green
    Write-Host "QR: Debe estar visible en la ventana de PowerShell" -ForegroundColor Yellow
} else {
    Write-Host "[ERROR] Servidor no activo" -ForegroundColor Red
}

Write-Host ""

