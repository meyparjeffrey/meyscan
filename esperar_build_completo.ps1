$logFile = "C:\meyscan_build\scanner-apk\build_release.log"
$apkPath = "C:\meyscan_build\scanner-apk\android\app\build\outputs\apk\release\app-release.apk"
$apkFinal = "C:\meyscan_build\scanner-apk\MeyScan.apk"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  ESPERANDO COMPLETAR BUILD DE APK" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$startTime = Get-Date
$checkCount = 0
$maxChecks = 120 # 2 horas máximo (120 * 60 segundos)
$lastLogSize = 0
$noProgressCount = 0

while ($checkCount -lt $maxChecks) {
    $checkCount++
    $elapsed = (Get-Date) - $startTime
    $elapsedStr = "{0:hh\:mm\:ss}" -f $elapsed
    
    # Verificar si la APK existe
    if (Test-Path $apkPath) {
        $size = (Get-Item $apkPath).Length / 1MB
        Write-Host "`n========================================" -ForegroundColor Green
        Write-Host "  ✅✅✅ APK GENERADA EXITOSAMENTE! ✅✅✅" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Green
        Write-Host "Tiempo total: $elapsedStr" -ForegroundColor Gray
        Write-Host "Ubicación: $apkPath" -ForegroundColor Green
        Write-Host "Tamaño: $([math]::Round($size, 2)) MB" -ForegroundColor Green
        
        # Copiar APK
        try {
            Copy-Item $apkPath $apkFinal -Force
            Write-Host "`n✅ APK copiada a: $apkFinal" -ForegroundColor Green
            Write-Host "========================================" -ForegroundColor Green
            exit 0
        } catch {
            Write-Host "⚠️ Error al copiar APK: $_" -ForegroundColor Yellow
            Write-Host "La APK está en: $apkPath" -ForegroundColor Yellow
            exit 0
        }
    }
    
    # Verificar errores en el log
    if (Test-Path $logFile) {
        $log = Get-Content $logFile -ErrorAction SilentlyContinue
        $currentLogSize = (Get-Item $logFile).Length
        
        # Verificar si hay progreso
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
            Write-Host "`n✅ BUILD COMPLETADO EN EL LOG!" -ForegroundColor Green
            Write-Host "Esperando generación de APK..." -ForegroundColor Yellow
            Start-Sleep -Seconds 30
            
            if (Test-Path $apkPath) {
                Copy-Item $apkPath $apkFinal -Force
                Write-Host "✅ APK copiada exitosamente!" -ForegroundColor Green
                exit 0
            } else {
                Write-Host "⚠️ Build completado pero APK no encontrada aún..." -ForegroundColor Yellow
                Write-Host "Esperando 60 segundos más..." -ForegroundColor Yellow
                Start-Sleep -Seconds 60
                if (Test-Path $apkPath) {
                    Copy-Item $apkPath $apkFinal -Force
                    Write-Host "✅ APK encontrada y copiada!" -ForegroundColor Green
                    exit 0
                }
            }
        }
        
        if ($errors) {
            Write-Host "`n========================================" -ForegroundColor Red
            Write-Host "  ❌ ERROR DETECTADO EN EL BUILD" -ForegroundColor Red
            Write-Host "========================================" -ForegroundColor Red
            Write-Host "Tiempo transcurrido: $elapsedStr" -ForegroundColor Gray
            
            # Obtener detalles del error
            $errorDetails = $log | Select-String -Pattern "What went wrong|Where:|Execution failed" -Context 0,15
            Write-Host "`nDetalles del error:" -ForegroundColor Yellow
            Write-Host $errorDetails -ForegroundColor Yellow
            
            Write-Host "`nÚltimas 30 líneas del log:" -ForegroundColor Cyan
            $log | Select-Object -Last 30 | ForEach-Object { Write-Host $_ }
            
            Write-Host "`n========================================" -ForegroundColor Red
            exit 1
        }
        
        # Mostrar progreso
        $lastLine = $log | Select-Object -Last 1
        $logSizeKB = [math]::Round($currentLogSize / 1KB, 1)
        
        if ($noProgressCount -gt 5) {
            Write-Host "[$elapsedStr] ADVERTENCIA: Sin progreso desde hace $($noProgressCount * 60) segundos | Log: $logSizeKB KB" -ForegroundColor Yellow
        } else {
            $displayLine = if ($lastLine) { $lastLine.Substring(0, [Math]::Min(80, $lastLine.Length)) } else { "..." }
            Write-Host "[$elapsedStr] Progresando... | Log: $logSizeKB KB | $displayLine" -ForegroundColor Gray
        }
    } else {
        Write-Host "[$elapsedStr] Esperando inicio del build..." -ForegroundColor Gray
    }
    
    Start-Sleep -Seconds 60
}

Write-Host "`n========================================" -ForegroundColor Yellow
Write-Host "  ⚠️ TIEMPO MÁXIMO ALCANZADO" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Yellow
Write-Host "Tiempo transcurrido: $elapsedStr" -ForegroundColor Gray

# Verificar estado final
if (Test-Path $apkPath) {
    Write-Host "`n✅ APK encontrada al final!" -ForegroundColor Green
    Copy-Item $apkPath $apkFinal -Force
    exit 0
} else {
    Write-Host "`n❌ APK no generada después de $maxChecks minutos" -ForegroundColor Red
    if (Test-Path $logFile) {
        Write-Host "`nUltimas 50 lineas del log:" -ForegroundColor Cyan
        Get-Content $logFile -Tail 50
    }
    exit 1
}
