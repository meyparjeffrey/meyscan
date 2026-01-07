$logFile = "C:\meyscan_build\scanner-apk\build_release.log"
$apkPath = "C:\meyscan_build\scanner-apk\android\app\build\outputs\apk\release\app-release.apk"

Write-Host "=== MONITOREO CONTINUO DEL BUILD ===" -ForegroundColor Cyan
Write-Host "Revisando cada 60 segundos..." -ForegroundColor Gray
Write-Host ""

$checkCount = 0
$maxChecks = 60 # 60 minutos máximo

while ($checkCount -lt $maxChecks) {
    $checkCount++
    Start-Sleep -Seconds 60
    
    # Verificar si la APK existe
    if (Test-Path $apkPath) {
        $size = (Get-Item $apkPath).Length / 1MB
        Write-Host "`n✅✅✅ APK GENERADA EXITOSAMENTE! ✅✅✅" -ForegroundColor Green
        Write-Host "Ubicación: $apkPath" -ForegroundColor Green
        Write-Host "Tamaño: $([math]::Round($size, 2)) MB" -ForegroundColor Green
        Copy-Item $apkPath "C:\meyscan_build\scanner-apk\MeyScan.apk" -Force
        Write-Host "Copiada a: C:\meyscan_build\scanner-apk\MeyScan.apk" -ForegroundColor Green
        exit 0
    }
    
    # Verificar errores en el log
    if (Test-Path $logFile) {
        $log = Get-Content $logFile -ErrorAction SilentlyContinue
        $errors = $log | Select-String -Pattern "FAILURE|BUILD FAILED" -CaseSensitive
        $success = $log | Select-String -Pattern "BUILD SUCCESSFUL" -CaseSensitive
        
        if ($success) {
            Write-Host "`n✅ BUILD COMPLETADO EN EL LOG!" -ForegroundColor Green
            Write-Host "Esperando generación de APK..." -ForegroundColor Yellow
            Start-Sleep -Seconds 30
            if (Test-Path $apkPath) {
                Copy-Item $apkPath "C:\meyscan_build\scanner-apk\MeyScan.apk" -Force
                Write-Host "✅ APK copiada exitosamente!" -ForegroundColor Green
                exit 0
            }
        }
        
        if ($errors) {
            Write-Host "`n❌ ERROR DETECTADO EN EL LOG:" -ForegroundColor Red
            $errorDetails = $log | Select-String -Pattern "What went wrong|Where:|Execution failed" -Context 0,10
            Write-Host $errorDetails -ForegroundColor Yellow
            Write-Host "`nRevisando log completo para más detalles..." -ForegroundColor Yellow
            exit 1
        }
        
        # Mostrar progreso
        $lastLine = $log | Select-Object -Last 1
        $logSize = (Get-Item $logFile).Length / 1KB
        Write-Host "[Check $checkCount/$maxChecks] Log: $([math]::Round($logSize, 1)) KB | $lastLine" -ForegroundColor Gray
    } else {
        Write-Host "[Check $checkCount/$maxChecks] Esperando inicio del build..." -ForegroundColor Gray
    }
}

Write-Host "`n⚠️ Tiempo máximo de espera alcanzado" -ForegroundColor Yellow
exit 1
