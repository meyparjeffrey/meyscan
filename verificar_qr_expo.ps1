# Script para verificar y mostrar el QR de Expo
Write-Host "=== VERIFICADOR DE QR EXPO ===" -ForegroundColor Cyan
Write-Host ""

# Verificar si el servidor está corriendo
$serverActive = Get-NetTCPConnection -LocalPort 8081 -ErrorAction SilentlyContinue
if (-not $serverActive) {
    Write-Host "❌ El servidor Expo NO está corriendo en el puerto 8081" -ForegroundColor Red
    Write-Host "Ejecuta: npm start -- --tunnel" -ForegroundColor Yellow
    exit
}

Write-Host "✓ Servidor Expo activo en puerto 8081" -ForegroundColor Green
Write-Host ""

# Intentar obtener información del servidor
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8081" -TimeoutSec 3 -ErrorAction Stop
    Write-Host "✓ Servidor respondiendo correctamente" -ForegroundColor Green
} catch {
    Write-Host "⚠ El servidor está activo pero no responde aún (puede estar iniciando)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=== INSTRUCCIONES ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Busca la ventana de PowerShell donde ejecutaste 'npm start -- --tunnel'" -ForegroundColor White
Write-Host "2. El QR debería aparecer en esa ventana después de unos segundos" -ForegroundColor White
Write-Host "3. Si no aparece, intenta:" -ForegroundColor White
Write-Host "   - Presionar '?' para ver todas las opciones" -ForegroundColor Yellow
Write-Host "   - Presionar 'w' para abrir en navegador web" -ForegroundColor Yellow
Write-Host "   - Esperar 10-15 segundos más (el tunnel tarda en establecerse)" -ForegroundColor Yellow
Write-Host ""
Write-Host "4. Alternativa: Abre Expo Go y usa 'Enter URL manually'" -ForegroundColor White
Write-Host "   URL típica: exp://192.168.x.x:8081" -ForegroundColor Cyan
Write-Host ""

# Obtener IP local
$ipAddress = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object {$_.IPAddress -like "192.168.*" -or $_.IPAddress -like "10.*"} | Select-Object -First 1).IPAddress
if ($ipAddress) {
    Write-Host "=== URL ALTERNATIVA ===" -ForegroundColor Cyan
    Write-Host "Si el QR no aparece, usa esta URL en Expo Go:" -ForegroundColor White
    Write-Host "exp://$ipAddress`:8081" -ForegroundColor Green
    Write-Host ""
}

Write-Host "=== MONITOREO CONTINUO ===" -ForegroundColor Cyan
Write-Host "Presiona Ctrl+C para salir" -ForegroundColor Yellow
Write-Host ""

# Monitorear continuamente
$checkCount = 0
while ($true) {
    $checkCount++
    $timestamp = Get-Date -Format "HH:mm:ss"
    
    # Verificar si el servidor sigue activo
    $serverActive = Get-NetTCPConnection -LocalPort 8081 -ErrorAction SilentlyContinue
    if ($serverActive) {
        Write-Host "[$timestamp] ✓ Servidor activo (verificación #$checkCount)" -ForegroundColor Green
    } else {
        Write-Host "[$timestamp] ❌ Servidor detenido" -ForegroundColor Red
        break
    }
    
    Start-Sleep -Seconds 5
}

