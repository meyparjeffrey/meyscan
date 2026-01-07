$logFile = "C:\meyscan_build\scanner-apk\build_release.log"
$apkPath = "C:\meyscan_build\scanner-apk\android\app\build\outputs\apk\release\app-release.apk"
$apkFinal = "C:\meyscan_build\scanner-apk\MeyScan.apk"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  MONITOREO BUILD APK - TIEMPO REAL" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Actualizando cada 15 segundos..." -ForegroundColor Gray
Write-Host "Presiona Ctrl+C para detener" -ForegroundColor Gray
Write-Host ""

while ($true) {
    Clear-Host
    $time = Get-Date -Format "HH:mm:ss"
    Write-Host "=== MONITOREO BUILD - $time ===" -ForegroundColor Cyan
    Write-Host ""
    
    # Verificar APK
    if (Test-Path $apkPath) {
        $size = (Get-Item $apkPath).Length / 1MB
        Write-Host "APK GENERADA EXITOSAMENTE!" -ForegroundColor Green
        Write-Host "Tamano: $([math]::Round($size, 2)) MB" -ForegroundColor Green
        Copy-Item $apkPath $apkFinal -Force
        Write-Host "Copiada a: $apkFinal" -ForegroundColor Green
        break
    }
    
    # Verificar log
    if (Test-Path $logFile) {
        $log = Get-Content $logFile -ErrorAction SilentlyContinue
        $logSize = (Get-Item $logFile).Length / 1KB
        
        $errors = $log | Select-String -Pattern "FAILURE|BUILD FAILED" -CaseSensitive
        $success = $log | Select-String -Pattern "BUILD SUCCESSFUL" -CaseSensitive
        
        if ($success) {
            Write-Host "Build completado! Esperando APK..." -ForegroundColor Green
            Start-Sleep -Seconds 30
            if (Test-Path $apkPath) {
                Copy-Item $apkPath $apkFinal -Force
                Write-Host "APK copiada!" -ForegroundColor Green
                break
            }
        }
        
        if ($errors) {
            Write-Host "ERROR DETECTADO:" -ForegroundColor Red
            $log | Select-String -Pattern "What went wrong" -Context 0,10 | Select-Object -First 1
            Write-Host ""
            Write-Host "Ultimas 20 lineas:" -ForegroundColor Yellow
            $log | Select-Object -Last 20
            break
        }
        
        Write-Host "Estado: Progresando..." -ForegroundColor Yellow
        Write-Host "Log: $([math]::Round($logSize, 1)) KB" -ForegroundColor Gray
        Write-Host ""
        Write-Host "Ultimas 5 lineas:" -ForegroundColor Cyan
        $log | Select-Object -Last 5 | ForEach-Object { Write-Host $_ -ForegroundColor White }
    } else {
        Write-Host "Esperando inicio del build..." -ForegroundColor Gray
    }
    
    Write-Host ""
    Write-Host "Siguiente actualizacion en 15 segundos..." -ForegroundColor DarkGray
    Start-Sleep -Seconds 15
}

Write-Host ""
Write-Host "Monitoreo finalizado." -ForegroundColor Cyan
