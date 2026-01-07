@echo off
setlocal
echo ============================================
echo      MeyScan - COMPILACION APK FINAL
echo ============================================
echo.

echo [1/5] Cerrando procesos que puedan bloquear archivos...
taskkill /F /IM java.exe /T 2>nul
taskkill /F /IM node.exe /T 2>nul
timeout /t 3 /nobreak >nul

echo [2/5] Configurando entorno...
set "JAVA_HOME=C:\Program Files\Microsoft\jdk-17.0.17.10-hotspot"
set "PATH=%JAVA_HOME%\bin;%PATH%"
set "ANDROID_HOME=C:\Android"
set "ANDROID_SDK_ROOT=C:\Android"
set "GRADLE_USER_HOME=C:\gradle_meyscan_%RANDOM%"

cd /d C:\meyscan_build\scanner-apk\android

echo [3/5] Limpiando build anterior...
call gradlew.bat clean --no-daemon 2>nul

echo [4/5] Compilando APK Release (esto puede tardar 10-15 minutos)...
echo Por favor, NO cierres esta ventana ni abras otras carpetas durante la compilacion...
echo.

call gradlew.bat assembleRelease --no-daemon --no-parallel -Dorg.gradle.caching=false -Porg.gradle.jvmargs=-Xmx4096m

if exist "app\build\outputs\apk\release\app-release.apk" (
    copy "app\build\outputs\apk\release\app-release.apk" "..\MeyScan.apk" /Y
    echo.
    echo ============================================
    echo ✅ ✅ ✅ APK GENERADA EXITOSAMENTE ✅ ✅ ✅
    echo ============================================
    echo.
    echo Ubicacion: C:\meyscan_build\scanner-apk\MeyScan.apk
    echo Tamaño: 
    dir "..\MeyScan.apk" | findstr "MeyScan.apk"
) else (
    echo.
    echo ❌ ERROR: No se pudo generar la APK.
    echo.
    echo Posibles causas:
    echo - Antivirus bloqueando archivos (desactivalo temporalmente)
    echo - Espacio insuficiente en disco
    echo - Error en la compilacion (revisa el log arriba)
)

echo.
pause
