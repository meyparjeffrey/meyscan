# Monitoreo continuo de logs en tiempo real
Set-Location "C:\meyscan_build\scanner-apk"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  MONITOREO DE LOGS EN TIEMPO REAL" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Monitoreando logs automaticamente..." -ForegroundColor Yellow
Write-Host "Presiona Ctrl+C para detener" -ForegroundColor Yellow
Write-Host ""

$lastSize = 0
$iteration = 0

while ($true) {
    $iteration++
    $timestamp = Get-Date -Format "HH:mm:ss"
    
    # Verificar servidor
    $server = Get-NetTCPConnection -LocalPort 8081 -ErrorAction SilentlyContinue
    if (-not $server -and $iteration -gt 5) {
        Write-Host "[$timestamp] ⚠️ Servidor no detectado" -ForegroundColor Yellow
    }
    
    # Leer logs
    if (Test-Path "expo_logs_completo.txt") {
        $currentSize = (Get-Item "expo_logs_completo.txt").Length
        
        if ($currentSize -gt $lastSize) {
            $content = Get-Content "expo_logs_completo.txt" -Raw -ErrorAction SilentlyContinue
            if ($content) {
                $allLines = $content -split "`n"
                $newLines = $allLines | Select-Object -Skip ([Math]::Max(0, $allLines.Count - 10))
                
                foreach ($line in $newLines) {
                    $trimmed = $line.Trim()
                    if ($trimmed) {
                        # Detectar tipo de log y colorear
                        if ($trimmed -match "ERROR|Error|error|TypeError|ReferenceError") {
                            Write-Host "[$timestamp] $trimmed" -ForegroundColor Red
                        } elseif ($trimmed -match "LOG|\[App\]|\[useAuth\]|\[AppNavigator\]|\[AppContext\]|\[AuthService\]|\[LoginScreen\]|\[HomeScreen\]|\[LoadingSpinner\]") {
                            Write-Host "[$timestamp] $trimmed" -ForegroundColor Cyan
                        } elseif ($trimmed -match "QR|exp://|Tunnel ready|Tunnel connected") {
                            Write-Host "[$timestamp] $trimmed" -ForegroundColor Green
                        } elseif ($trimmed -match "Bundled|Bundling") {
                            Write-Host "[$timestamp] $trimmed" -ForegroundColor Yellow
                        } else {
                            Write-Host "[$timestamp] $trimmed" -ForegroundColor Gray
                        }
                    }
                }
            }
        }
        $lastSize = $currentSize
    }
    
    Start-Sleep -Seconds 1
}

