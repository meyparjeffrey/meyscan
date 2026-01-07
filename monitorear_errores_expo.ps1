# Script para monitorear errores de Expo en tiempo real
Set-Location "C:\meyscan_build\scanner-apk"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  MONITOREO DE ERRORES EXPO" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar servidor
$server = Get-NetTCPConnection -LocalPort 8081 -ErrorAction SilentlyContinue
if (-not $server) {
    Write-Host "[ERROR] Servidor no esta corriendo" -ForegroundColor Red
    Write-Host "Iniciando servidor..." -ForegroundColor Yellow
    Start-Process powershell -ArgumentList @(
        "-NoExit",
        "-Command",
        "cd 'C:\meyscan_build\scanner-apk'; npm run start:qr"
    ) -WindowStyle Normal
    Start-Sleep -Seconds 10
}

Write-Host "[OK] Servidor activo" -ForegroundColor Green
Write-Host ""
Write-Host "Monitoreando errores..." -ForegroundColor Yellow
Write-Host "Presiona Ctrl+C para detener" -ForegroundColor Yellow
Write-Host ""

$errorCount = 0
$lastCheck = Get-Date

while ($true) {
    # Verificar si el servidor sigue activo
    $server = Get-NetTCPConnection -LocalPort 8081 -ErrorAction SilentlyContinue
    if (-not $server) {
        Write-Host "[ERROR] Servidor detenido" -ForegroundColor Red
        break
    }
    
    # Leer logs si existen
    if (Test-Path "expo_output.txt") {
        $content = Get-Content "expo_output.txt" -Raw -ErrorAction SilentlyContinue
        if ($content) {
            $lines = $content -split "`n"
            $newLines = $lines | Select-Object -Last 20
            
            # Buscar errores
            $errors = $newLines | Where-Object { 
                $_ -match "error" -or 
                $_ -match "Error" -or 
                $_ -match "ERROR" -or
                $_ -match "failed" -or
                $_ -match "Failed" -or
                $_ -match "exception" -or
                $_ -match "Exception" -or
                $_ -match "TypeError" -or
                $_ -match "ReferenceError" -or
                $_ -match "Cannot" -or
                $_ -match "undefined"
            }
            
            if ($errors) {
                $errorCount++
                Write-Host "[ERROR #$errorCount] Detectado:" -ForegroundColor Red
                $errors | ForEach-Object {
                    Write-Host "  $_" -ForegroundColor Red
                }
                Write-Host ""
            }
        }
    }
    
    # Mostrar estado cada 10 segundos
    $now = Get-Date
    if (($now - $lastCheck).TotalSeconds -ge 10) {
        Write-Host "[$(Get-Date -Format 'HH:mm:ss')] Monitoreando... (Errores detectados: $errorCount)" -ForegroundColor Gray
        $lastCheck = $now
    }
    
    Start-Sleep -Seconds 2
}

