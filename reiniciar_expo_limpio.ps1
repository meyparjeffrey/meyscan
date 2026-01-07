# Script para reiniciar Expo con cache limpio
Set-Location "C:\meyscan_build\scanner-apk"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  REINICIANDO EXPO CON CACHE LIMPIO" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Detener procesos de Expo
Write-Host "Deteniendo procesos de Expo..." -ForegroundColor Yellow
Get-NetTCPConnection -LocalPort 8081,8082 -ErrorAction SilentlyContinue | 
  Select-Object -ExpandProperty OwningProcess | 
  ForEach-Object { 
    Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue 
  }

Get-Process | Where-Object {$_.ProcessName -eq "node"} | 
  Where-Object {$_.MainWindowTitle -like "*expo*" -or $_.CommandLine -like "*expo*"} | 
  Stop-Process -Force -ErrorAction SilentlyContinue

Start-Sleep -Seconds 2

# Limpiar cache
Write-Host "Limpiando cache..." -ForegroundColor Yellow
if (Test-Path ".expo") {
  Remove-Item -Path ".expo" -Recurse -Force -ErrorAction SilentlyContinue
  Write-Host "  ✓ Cache .expo eliminada" -ForegroundColor Green
}

if (Test-Path "node_modules/.cache") {
  Remove-Item -Path "node_modules/.cache" -Recurse -Force -ErrorAction SilentlyContinue
  Write-Host "  ✓ Cache node_modules eliminada" -ForegroundColor Green
}

Write-Host ""
Write-Host "Iniciando Expo con tunnel..." -ForegroundColor Green
Write-Host ""

# Iniciar Expo
npm run start:qr

