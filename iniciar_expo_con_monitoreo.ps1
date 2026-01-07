# Script para iniciar Expo con monitoreo completo de logs
Set-Location "C:\meyscan_build\scanner-apk"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  INICIANDO EXPO CON MONITOREO COMPLETO" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Limpiar logs anteriores
if (Test-Path "expo_logs_completo.txt") {
    Remove-Item "expo_logs_completo.txt" -Force
    Write-Host "Logs anteriores eliminados" -ForegroundColor Yellow
}

Write-Host "Iniciando Expo con tunnel..." -ForegroundColor Yellow
Write-Host "Los logs se capturaran automaticamente" -ForegroundColor Yellow
Write-Host ""

# Iniciar Expo y capturar TODA la salida
$process = Start-Process -FilePath "npm" -ArgumentList "run", "start:qr" -NoNewWindow -PassThru -RedirectStandardOutput "expo_logs_completo.txt" -RedirectStandardError "expo_errors.txt"

Write-Host "Proceso Expo iniciado (PID: $($process.Id))" -ForegroundColor Green
Write-Host ""

# Monitorear logs en tiempo real
Write-Host "=== MONITOREO DE LOGS ACTIVO ===" -ForegroundColor Cyan
Write-Host ""

$lastSize = 0
$iteration = 0

while ($true) {
    $iteration++
    $timestamp = Get-Date -Format "HH:mm:ss"
    
    # Verificar que el proceso siga corriendo
    try {
        $proc = Get-Process -Id $process.Id -ErrorAction Stop
    } catch {
        Write-Host "[$timestamp] Proceso detenido" -ForegroundColor Red
        break
    }
    
    # Leer nuevos logs
    if (Test-Path "expo_logs_completo.txt") {
        $currentSize = (Get-Item "expo_logs_completo.txt").Length
        
        if ($currentSize -gt $lastSize) {
            $content = Get-Content "expo_logs_completo.txt" -Raw -ErrorAction SilentlyContinue
            if ($content) {
                $allLines = $content -split "`n"
                $newLines = $allLines | Select-Object -Skip ([Math]::Max(0, $allLines.Count - 20))
                
                # Mostrar nuevas líneas
                foreach ($line in $newLines) {
                    if ($line.Trim()) {
                        # Colorear según el tipo de log
                        if ($line -match "ERROR|Error|error") {
                            Write-Host "[$timestamp] $line" -ForegroundColor Red
                        } elseif ($line -match "LOG|\[App\]|\[useAuth\]|\[AppNavigator\]|\[AppContext\]|\[AuthService\]|\[LoginScreen\]|\[HomeScreen\]") {
                            Write-Host "[$timestamp] $line" -ForegroundColor Cyan
                        } elseif ($line -match "QR|exp://|Tunnel") {
                            Write-Host "[$timestamp] $line" -ForegroundColor Green
                        } else {
                            Write-Host "[$timestamp] $line" -ForegroundColor Gray
                        }
                    }
                }
            }
        }
        $lastSize = $currentSize
    }
    
    # Verificar errores
    if (Test-Path "expo_errors.txt") {
        $errors = Get-Content "expo_errors.txt" -ErrorAction SilentlyContinue
        if ($errors) {
            $newErrors = $errors | Select-Object -Last 5
            foreach ($error in $newErrors) {
                if ($error.Trim()) {
                    Write-Host "[$timestamp] [ERROR] $error" -ForegroundColor Red
                }
            }
        }
    }
    
    # Estado cada 30 segundos
    if ($iteration % 15 -eq 0) {
        $server = Get-NetTCPConnection -LocalPort 8081 -ErrorAction SilentlyContinue
        if ($server) {
            Write-Host "[$timestamp] ✓ Servidor activo en puerto 8081" -ForegroundColor Green
        }
    }
    
    Start-Sleep -Seconds 2
}

Write-Host ""
Write-Host "=== MONITOREO DETENIDO ===" -ForegroundColor Cyan

