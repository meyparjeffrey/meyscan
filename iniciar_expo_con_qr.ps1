# Script para iniciar Expo y garantizar que el QR sea visible
Write-Host "=== INICIANDO EXPO CON QR VISIBLE ===" -ForegroundColor Cyan
Write-Host ""

# Cambiar al directorio del proyecto
Set-Location "C:\meyscan_build\scanner-apk"

# Detener cualquier proceso anterior
Write-Host "Deteniendo procesos anteriores..." -ForegroundColor Yellow
Get-NetTCPConnection -LocalPort 8081 -ErrorAction SilentlyContinue | 
    Select-Object -ExpandProperty OwningProcess | 
    ForEach-Object { 
        Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue 
    }
Start-Sleep -Seconds 2

# Verificar que @expo/ngrok esté instalado
Write-Host "Verificando @expo/ngrok..." -ForegroundColor Yellow
$ngrokInstalled = npm list -g @expo/ngrok 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Instalando @expo/ngrok..." -ForegroundColor Yellow
    npm install -g @expo/ngrok@^4.1.0
}

Write-Host ""
Write-Host "=== INICIANDO EXPO CON TUNNEL ===" -ForegroundColor Green
Write-Host "Esto garantiza que el QR sea visible desde cualquier red" -ForegroundColor Cyan
Write-Host ""

# Iniciar Expo con tunnel y limpiar caché
$process = Start-Process -FilePath "npm" -ArgumentList "run", "start:qr" -NoNewWindow -PassThru

Write-Host "Proceso iniciado (PID: $($process.Id))" -ForegroundColor Green
Write-Host ""
Write-Host "Esperando 15 segundos para que el tunnel se establezca..." -ForegroundColor Yellow

# Esperar y monitorear
$timeout = 30
$elapsed = 0
$qrDetected = $false

while ($elapsed -lt $timeout) {
    Start-Sleep -Seconds 2
    $elapsed += 2
    
    # Verificar que el servidor esté activo
    $serverActive = Get-NetTCPConnection -LocalPort 8081 -ErrorAction SilentlyContinue
    if ($serverActive) {
        Write-Host "[$elapsed s] ✓ Servidor activo en puerto 8081" -ForegroundColor Green
        
        # Intentar obtener la URL del tunnel
        try {
            $response = Invoke-WebRequest -Uri "http://localhost:8081" -TimeoutSec 2 -ErrorAction Stop
            if ($response.Content -match "exp://[^\s\"]+") {
                $url = $matches[0]
                Write-Host ""
                Write-Host "=== URL DETECTADA ===" -ForegroundColor Green
                Write-Host "URL: $url" -ForegroundColor Cyan
                Write-Host ""
                $qrDetected = $true
            }
        } catch {
            # El servidor está iniciando, continuar esperando
        }
    } else {
        Write-Host "[$elapsed s] ⏳ Esperando que el servidor inicie..." -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "=== INFORMACIÓN IMPORTANTE ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. El servidor Expo está corriendo" -ForegroundColor White
Write-Host "2. Busca la ventana de terminal donde se ejecutó 'npm run start:qr'" -ForegroundColor White
Write-Host "3. El QR debería aparecer en esa ventana" -ForegroundColor White
Write-Host ""
Write-Host "Si no ves el QR:" -ForegroundColor Yellow
Write-Host "  - Espera 10-15 segundos más (el tunnel tarda en establecerse)" -ForegroundColor White
Write-Host "  - Presiona '?' en la terminal de Expo para ver todas las opciones" -ForegroundColor White
Write-Host "  - Presiona 'w' para abrir en navegador web" -ForegroundColor White
Write-Host ""

# Obtener IP local como alternativa
$ipAddress = (Get-NetIPAddress -AddressFamily IPv4 | 
    Where-Object {$_.IPAddress -match '^192\.168\.' -or $_.IPAddress -match '^10\.'} | 
    Select-Object -First 1).IPAddress

if ($ipAddress) {
    Write-Host "=== URL ALTERNATIVA (SIN QR) ===" -ForegroundColor Cyan
    Write-Host "Si el QR no aparece, usa esta URL en Expo Go:" -ForegroundColor White
    Write-Host "exp://$ipAddress`:8081" -ForegroundColor Green
    Write-Host ""
}

Write-Host "=== MONITOREO CONTINUO ===" -ForegroundColor Cyan
Write-Host "El servidor seguirá corriendo. Revisa la terminal principal." -ForegroundColor Yellow
Write-Host "Presiona Ctrl+C aquí para detener este monitoreo (el servidor seguirá activo)" -ForegroundColor Yellow

