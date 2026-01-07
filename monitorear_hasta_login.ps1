# Monitoreo continuo hasta que aparezca LoginScreen
Set-Location "C:\meyscan_build\scanner-apk"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  MONITOREO CONTINUO HASTA LOGIN" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Monitoreando logs hasta que aparezca LoginScreen..." -ForegroundColor Yellow
Write-Host "Presiona Ctrl+C para detener" -ForegroundColor Yellow
Write-Host ""

$iteration = 0
$loginScreenDetected = $false

while (-not $loginScreenDetected) {
    $iteration++
    $timestamp = Get-Date -Format "HH:mm:ss"
    
    # Verificar si hay logs nuevos
    if (Test-Path "expo_logs_completo.txt") {
        $content = Get-Content "expo_logs_completo.txt" -Raw -ErrorAction SilentlyContinue
        if ($content) {
            $lines = $content -split "`n"
            $recentLines = $lines | Select-Object -Last 20
            
            foreach ($line in $recentLines) {
                $trimmed = $line.Trim()
                if ($trimmed) {
                    # Detectar LoginScreen
                    if ($trimmed -match "LoginScreen.*MONTANDOSE|LoginScreen.*PANTALLA DE LOGIN") {
                        Write-Host "[$timestamp] 🎯 LOGINSCREEN DETECTADO!" -ForegroundColor Green
                        $loginScreenDetected = $true
                        break
                    }
                    
                    # Mostrar logs importantes
                    if ($trimmed -match "ERROR|Error|❌") {
                        Write-Host "[$timestamp] $trimmed" -ForegroundColor Red
                    } elseif ($trimmed -match "LOG.*\[App\]|LOG.*\[AppNavigator\]|LOG.*\[useAuth\]|LOG.*\[LoadingSpinner\]|LOG.*\[LoginScreen\]") {
                        Write-Host "[$timestamp] $trimmed" -ForegroundColor Cyan
                    } elseif ($trimmed -match "Loading|loading|LOADING") {
                        Write-Host "[$timestamp] $trimmed" -ForegroundColor Yellow
                    }
                }
            }
        }
    }
    
    if (-not $loginScreenDetected) {
        Write-Host "[$timestamp] Monitoreando... (Iteracion $iteration)" -ForegroundColor DarkGray
        Start-Sleep -Seconds 2
    }
}

if ($loginScreenDetected) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  LOGINSCREEN DETECTADO!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "La pantalla de login se ha montado correctamente" -ForegroundColor White
} else {
    Write-Host ""
    Write-Host "Monitoreo detenido" -ForegroundColor Yellow
}

