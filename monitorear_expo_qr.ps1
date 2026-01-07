# Script para monitorear Expo y detectar el QR
$process = Start-Process -FilePath "npm" -ArgumentList "start", "--", "--tunnel" -NoNewWindow -PassThru -RedirectStandardOutput "expo_output.log" -RedirectStandardError "expo_error.log"

Write-Host "Expo iniciando... Esperando QR..." -ForegroundColor Yellow
Write-Host "PID del proceso: $($process.Id)" -ForegroundColor Cyan

$timeout = 60 # 60 segundos máximo
$elapsed = 0
$qrFound = $false
$urlFound = $false

while ($elapsed -lt $timeout -and -not $qrFound) {
    Start-Sleep -Seconds 2
    $elapsed += 2
    
    # Leer el log de salida
    if (Test-Path "expo_output.log") {
        $output = Get-Content "expo_output.log" -Raw -ErrorAction SilentlyContinue
        
        # Buscar QR (patrones comunes)
        if ($output -match "exp://" -or $output -match "qr code" -or $output -match "Scan the QR") {
            Write-Host "`n=== QR DETECTADO ===" -ForegroundColor Green
            Write-Host $output -ForegroundColor White
            $qrFound = $true
        }
        
        # Buscar URL de Expo
        if ($output -match "exp://[^\s]+") {
            $url = $matches[0]
            Write-Host "`n=== URL ENCONTRADA ===" -ForegroundColor Green
            Write-Host "URL: $url" -ForegroundColor Cyan
            $urlFound = $true
        }
        
        # Mostrar últimas líneas
        $lines = $output -split "`n" | Select-Object -Last 10
        if ($lines.Count -gt 0) {
            Write-Host "`n--- Últimas líneas del log ---" -ForegroundColor Gray
            $lines | ForEach-Object { Write-Host $_ }
        }
    }
    
    # Verificar errores
    if (Test-Path "expo_error.log") {
        $errors = Get-Content "expo_error.log" -ErrorAction SilentlyContinue
        if ($errors) {
            Write-Host "`n--- Errores detectados ---" -ForegroundColor Red
            $errors | Select-Object -Last 5 | ForEach-Object { Write-Host $_ -ForegroundColor Red }
        }
    }
    
    Write-Host "`nEsperando... ($elapsed/$timeout segundos)" -ForegroundColor Yellow
}

if (-not $qrFound -and -not $urlFound) {
    Write-Host "`n=== NO SE DETECTÓ QR DESPUÉS DE $timeout SEGUNDOS ===" -ForegroundColor Red
    Write-Host "Revisa los logs manualmente:" -ForegroundColor Yellow
    Write-Host "  - expo_output.log" -ForegroundColor Cyan
    Write-Host "  - expo_error.log" -ForegroundColor Cyan
} else {
    Write-Host "`n=== MONITOREO COMPLETADO ===" -ForegroundColor Green
    Write-Host "El servidor sigue corriendo. Revisa la terminal principal para ver el QR completo." -ForegroundColor Cyan
}

Write-Host "`nPresiona Ctrl+C para detener el monitoreo (el servidor seguirá corriendo)" -ForegroundColor Yellow

