@echo off
echo ========================================
echo   INICIANDO EXPO CON QR VISIBLE
echo ========================================
echo.

cd /d "C:\meyscan_build\scanner-apk"

echo Deteniendo procesos anteriores...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8081') do (
    taskkill /F /PID %%a >nul 2>&1
)

timeout /t 2 /nobreak >nul

echo.
echo Iniciando Expo con tunnel (esto garantiza que el QR sea visible)...
echo.
echo IMPORTANTE: El QR aparecera en esta ventana despues de unos segundos
echo.

REM Iniciar Expo con tunnel y forzar visualizacion del QR
npx expo start --tunnel --clear

pause

