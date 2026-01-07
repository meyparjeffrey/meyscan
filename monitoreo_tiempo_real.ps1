$logFile = "C:\meyscan_build\scanner-apk\build_release.log"
$apkPath = "C:\meyscan_build\scanner-apk\android\app\build\outputs\apk\release\app-release.apk"
$apkFinal = "C:\meyscan_build\scanner-apk\MeyScan.apk"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  MONITOREO EN TIEMPO REAL DEL BUILD" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Revisando cada 30 segundos..." -ForegroundColor Gray
Write-Host "Presiona Ctrl+C para detener el monitoreo" -ForegroundColor Gray
Write-Host ""

$startTime = Get-Date
$lastLogSize = 0
$noProgressCount = 0

while ($true) {
    $elapsed = (Get-Date) - $startTime
    $elapsedStr = "{0:hh\:mm\:ss}" -f $elapsed
    
    # Verificar si la APK existe
    if (Test-Path $apkPath) {
        $size = (Get-Item $apkPath).Length / 1MB
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Green
        Write-Host "  ✅✅✅ APK GENERADA EXITOSAMENTE! ✅✅✅" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Green
        Write-Host "Tiempo total: $elapsedStr" -ForegroundColor Gray
        Write-Host "Ubicacion: $apkPath" -ForegroundColor Green
        Write-Host "Tamano: $([math]::Round($size, 2)) MB" -ForegroundColor Green
        
        try {
            Copy-Item $apkPath $apkFinal -Force
            Write-Host ""
            Write-Host "APK copiada a: $apkFinal" -ForegroundColor Green
        } catch {
            Write-Host "La APK esta en: $apkPath" -ForegroundColor Yellow
        }
        
        Write-Host "========================================" -ForegroundColor Green
        break
    }
    
    # Verificar el log
    if (Test-Path $logFile) {
        $log = Get-Content $logFile -ErrorAction SilentlyContinue
        $currentLogSize = (Get-Item $logFile).Length
        
        # Verificar progreso
        if ($currentLogSize -eq $lastLogSize) {
            $noProgressCount++
        } else {
            $noProgressCount = 0
            $lastLogSize = $currentLogSize
        }
        
        # Buscar errores
        $errors = $log | Select-String -Pattern "FAILURE|BUILD FAILED" -CaseSensitive
        $success = $log | Select-String -Pattern "BUILD SUCCESSFUL" -CaseSensitive
        
        if ($success) {
            Write-Host ""
            Write-Host "[$elapsedStr] BUILD COMPLETADO EN EL LOG!" -ForegroundColor Green
            Write-Host "[$elapsedStr] Esperando generacion de APK..." -ForegroundColor Yellow
            Start-Sleep -Seconds 60
            
            if (Test-Path $apkPath) {
                Copy-Item $apkPath $apkFinal -Force
                Write-Host "[$elapsedStr] APK copiada exitosamente!" -ForegroundColor Green
                break
            }
        }
        
        if ($errors) {
            Write-Host ""
            Write-Host "========================================" -ForegroundColor Red
            Write-Host "  ERROR DETECTADO" -ForegroundColor Red
            Write-Host "========================================" -ForegroundColor Red
            Write-Host "Tiempo transcurrido: $elapsedStr" -ForegroundColor Gray
            
            $errorDetails = $log | Select-String -Pattern "What went wrong|Where:|Execution failed" -Context 0,10
            Write-Host ""
            Write-Host "Detalles del error:" -ForegroundColor Yellow
            Write-Host $errorDetails -ForegroundColor Yellow
            
            Write-Host ""
            Write-Host "Ultimas 25 lineas del log:" -ForegroundColor Cyan
            $log | Select-Object -Last 25 | ForEach-Object { Write-Host $_ }
            
            Write-Host ""
            Write-Host "========================================" -ForegroundColor Red
            break
        }
        
        # Mostrar progreso
        $lastLine = $log | Select-Object -Last 1
        $logSizeKB = [math]::Round($currentLogSize / 1KB, 1)
        
        # Filtrar líneas vacías o muy largas
        if ($lastLine -and $lastLine.Length -lt 150) {
            if ($noProgressCount -gt 3) {
                Write-Host "[$elapsedStr] ADVERTENCIA: Sin progreso desde hace $($noProgressCount * 30) seg | Log: $logSizeKB KB" -ForegroundColor Yellow
            } else {
                $displayLine = if ($lastLine) { $lastLine.Substring(0, [Math]::Min(80, $lastLine.Length)) } else { "..." }
                Write-Host "[$elapsedStr] Log: $logSizeKB KB | $displayLine" -ForegroundColor Gray
            }
        } else {
            Write-Host "[$elapsedStr] Progresando... | Log: $logSizeKB KB" -ForegroundColor Gray
        }
    } else {
        Write-Host "[$elapsedStr] Esperando inicio del build..." -ForegroundColor Gray
    }
    
    Start-Sleep -Seconds 30
}

Write-Host ""
Write-Host "Monitoreo finalizado." -ForegroundColor Cyan
