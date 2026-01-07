# Monitoreo continuo de errores de Expo
Set-Location "C:\meyscan_build\scanner-apk"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  MONITOREO CONTINUO DE ERRORES" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Monitoreando errores en tiempo real..." -ForegroundColor Yellow
Write-Host "Escanea el QR y observa los errores aqui" -ForegroundColor Yellow
Write-Host "Presiona Ctrl+C para detener" -ForegroundColor Yellow
Write-Host ""

$lastSize = 0
$errorCount = 0
$iteration = 0

while ($true) {
    $iteration++
    $timestamp = Get-Date -Format "HH:mm:ss"
    
    # Verificar servidor
    $server = Get-NetTCPConnection -LocalPort 8081 -ErrorAction SilentlyContinue
    if (-not $server) {
        Write-Host "[$timestamp] [ERROR] Servidor detenido" -ForegroundColor Red
        break
    }
    
    # Leer logs
    if (Test-Path "expo_output.txt") {
        $currentSize = (Get-Item "expo_output.txt").Length
        
        # Si el archivo creció, hay nuevos logs
        if ($currentSize -gt $lastSize) {
            $content = Get-Content "expo_output.txt" -Raw -ErrorAction SilentlyContinue
            if ($content) {
                $allLines = $content -split "`n"
                $newLines = $allLines | Select-Object -Skip ([Math]::Max(0, $allLines.Count - 50))
                
                # Buscar errores, warnings y problemas
                $issues = $newLines | Where-Object { 
                    $_ -match "error|Error|ERROR" -or 
                    $_ -match "failed|Failed|FAILED" -or
                    $_ -match "exception|Exception|EXCEPTION" -or
                    $_ -match "TypeError|ReferenceError|SyntaxError" -or
                    $_ -match "Cannot|undefined|null" -or
                    $_ -match "Warning|WARNING" -or
                    $_ -match "Failed to|Unable to|Error:" -or
                    $_ -match "\[Error\]|\[ERROR\]"
                }
                
                if ($issues) {
                    $errorCount++
                    Write-Host ""
                    Write-Host "[$timestamp] === ERROR #$errorCount DETECTADO ===" -ForegroundColor Red
                    $issues | Select-Object -Last 10 | ForEach-Object {
                        if ($_ -match "error|Error|ERROR|failed|Failed|exception|Exception") {
                            Write-Host "  [ERROR] $_" -ForegroundColor Red
                        } elseif ($_ -match "Warning|WARNING") {
                            Write-Host "  [WARNING] $_" -ForegroundColor Yellow
                        } else {
                            Write-Host "  [INFO] $_" -ForegroundColor Cyan
                        }
                    }
                    Write-Host ""
                }
                
                # Mostrar últimas líneas importantes cada 30 segundos
                if ($iteration % 15 -eq 0) {
                    $recent = $allLines | Select-Object -Last 5
                    $hasActivity = $recent | Where-Object { $_ -notmatch "^\s*$" }
                    if ($hasActivity) {
                        Write-Host "[$timestamp] Actividad reciente:" -ForegroundColor Gray
                        $recent | ForEach-Object { Write-Host "  $_" -ForegroundColor Gray }
                    }
                }
            }
        }
        
        $lastSize = $currentSize
    } else {
        # Si no existe el archivo, intentar leer de la salida estándar
        Write-Host "[$timestamp] Esperando logs..." -ForegroundColor Gray
    }
    
    # Estado cada 20 iteraciones (40 segundos)
    if ($iteration % 20 -eq 0) {
        Write-Host "[$timestamp] Monitoreando... (Errores: $errorCount, Servidor: ACTIVO)" -ForegroundColor Green
    }
    
    Start-Sleep -Seconds 2
}

Write-Host ""
Write-Host "=== MONITOREO DETENIDO ===" -ForegroundColor Cyan
Write-Host "Total de errores detectados: $errorCount" -ForegroundColor Yellow

