# Script de monitoreo del build
$logFile = "C:\meyscan_build\scanner-apk\build_release.log"
$maxWaitTime = 1800 # 30 minutos máximo
$checkInterval = 30 # Revisar cada 30 segundos
$startTime = Get-Date
$lastSize = 0
$noProgressCount = 0

Write-Host "=== MONITOREANDO COMPILACION APK ===" -ForegroundColor Cyan
Write-Host "Log: $logFile" -ForegroundColor Gray
Write-Host ""

while ($true) {
    $elapsed = (Get-Date) - $startTime
    
    if ($elapsed.TotalSeconds -gt $maxWaitTime) {
        Write-Host "`n[ERROR] Tiempo máximo excedido ($maxWaitTime segundos)" -ForegroundColor Red
        break
    }
    
    if (Test-Path $logFile) {
        $currentSize = (Get-Item $logFile).Length
        $content = Get-Content $logFile -Tail 20 -ErrorAction SilentlyContinue
        
        # Verificar si hay errores
        $errors = $content | Select-String -Pattern "FAILURE|BUILD FAILED|error:|Error:|ERROR" -CaseSensitive
        
        if ($errors) {
            Write-Host "`n[ERROR DETECTADO]" -ForegroundColor Red
            Write-Host $errors -ForegroundColor Yellow
            Write-Host "`nRevisando log completo..." -ForegroundColor Yellow
            break
        }
        
        # Verificar si se completó exitosamente
        $success = $content | Select-String -Pattern "BUILD SUCCESSFUL|BUILD SUCCEEDED" -CaseSensitive
        
        if ($success) {
            Write-Host "`n[EXITO] Compilacion completada!" -ForegroundColor Green
            break
        }
        
        # Verificar progreso
        if ($currentSize -eq $lastSize) {
            $noProgressCount++
            if ($noProgressCount -gt 10) {
                Write-Host "`n[ADVERTENCIA] No hay progreso en el log desde hace $($noProgressCount * $checkInterval) segundos" -ForegroundColor Yellow
            }
        } else {
            $noProgressCount = 0
            $lastSize = $currentSize
        }
        
        # Mostrar última línea del log
        $lastLine = $content | Select-Object -Last 1
        if ($lastLine) {
            Write-Host "[$($elapsed.ToString('mm\:ss'))] $lastLine" -ForegroundColor Gray
        }
    } else {
        Write-Host "[$($elapsed.ToString('mm\:ss'))] Esperando inicio del build..." -ForegroundColor Gray
    }
    
    Start-Sleep -Seconds $checkInterval
}

Write-Host "`n=== FIN DEL MONITOREO ===" -ForegroundColor Cyan
