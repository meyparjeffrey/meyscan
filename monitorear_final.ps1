$logFile = "C:\meyscan_build\scanner-apk\build_release.log"
$apkPath = "C:\meyscan_build\scanner-apk\android\app\build\outputs\apk\release\app-release.apk"
$apkFinal = "C:\meyscan_build\scanner-apk\MeyScan.apk"

Write-Host "Esperando que termine el build..." -ForegroundColor Cyan
Write-Host "Revisando cada 2 minutos..." -ForegroundColor Gray
Write-Host ""

$checkCount = 0
$maxChecks = 90

while ($checkCount -lt $maxChecks) {
    $checkCount++
    Start-Sleep -Seconds 120
    
    if (Test-Path $apkPath) {
        $size = (Get-Item $apkPath).Length / 1MB
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Green
        Write-Host "  APK GENERADA EXITOSAMENTE!" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Green
        Write-Host "Ubicacion: $apkPath" -ForegroundColor Green
        Write-Host "Tamano: $([math]::Round($size, 2)) MB" -ForegroundColor Green
        Copy-Item $apkPath $apkFinal -Force
        Write-Host "Copiada a: $apkFinal" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Green
        exit 0
    }
    
    if (Test-Path $logFile) {
        $log = Get-Content $logFile -ErrorAction SilentlyContinue
        $errors = $log | Select-String -Pattern "FAILURE|BUILD FAILED" -CaseSensitive
        $success = $log | Select-String -Pattern "BUILD SUCCESSFUL" -CaseSensitive
        
        if ($success) {
            Write-Host "Build completado en el log. Esperando APK..." -ForegroundColor Yellow
            Start-Sleep -Seconds 60
            if (Test-Path $apkPath) {
                Copy-Item $apkPath $apkFinal -Force
                Write-Host "APK copiada!" -ForegroundColor Green
                exit 0
            }
        }
        
        if ($errors) {
            Write-Host ""
            Write-Host "ERROR DETECTADO:" -ForegroundColor Red
            $log | Select-String -Pattern "What went wrong" -Context 0,10 | Select-Object -First 1
            Write-Host ""
            Write-Host "Ultimas 20 lineas:" -ForegroundColor Yellow
            $log | Select-Object -Last 20
            exit 1
        }
        
        $lastLine = $log | Select-Object -Last 1
        Write-Host "[Check $checkCount] $lastLine" -ForegroundColor Gray
    }
}

Write-Host "Tiempo maximo alcanzado" -ForegroundColor Yellow
exit 1
