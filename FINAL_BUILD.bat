@echo off
setlocal
echo --- MeyScan SUPER CLEAN APK BUILD ---
echo Intentando cerrar procesos bloqueantes...

:: Matar procesos que suelen bloquear archivos
taskkill /F /IM java.exe /T 2>nul
taskkill /F /IM node.exe /T 2>nul
taskkill /F /IM adb.exe /T 2>nul

echo Esperando liberacion de archivos...
timeout /t 3 /nobreak

set "JAVA_HOME=C:\Program Files\Microsoft\jdk-17.0.17.10-hotspot"
set "PATH=%JAVA_HOME%\bin;%PATH%"
set "ANDROID_HOME=C:\Android"
set "ANDROID_SDK_ROOT=C:\Android"
:: Cambiamos a una ruta de cache totalmente nueva para evitar el error de metadata.bin
set "GRADLE_USER_HOME=C:\gradle_cache_new_%RANDOM%"

cd /d C:\meyscan_build\scanner-apk\android

echo.
echo Iniciando compilacion SIN DEMONIO (mas lento pero mas seguro)...
echo.

call gradlew.bat assembleRelease --no-daemon -Porg.gradle.jvmargs=-Xmx4096m

if exist "app\build\outputs\apk\release\app-release.apk" (
    copy "app\build\outputs\apk\release\app-release.apk" "..\..\..\MeyScan.apk" /Y
    echo.
    echo ✅ ✅ ✅ APK GENERADA EXITOSAMENTE en C:\meyscan_build\MeyScan.apk
    echo ✅ ✅ ✅ TAMBIEN COPIADA A C:\MeyScan.apk
) else (
    echo.
    echo ❌ Fallo en la compilacion final.
    echo Revisa si algun antivirus esta bloqueando la carpeta C:\meyscan_build
)

echo.
echo Presione una tecla para salir...
pause >nul
