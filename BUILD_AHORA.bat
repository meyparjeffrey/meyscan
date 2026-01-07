@echo off
setlocal
echo ============================================
echo      MeyScan - COMPILACION DE EMERGENCIA
echo ============================================
echo.

echo 1. Cerrando procesos de Java y Node...
taskkill /F /IM java.exe /T 2>nul
taskkill /F /IM node.exe /T 2>nul

echo 2. Eliminando cache corrupta...
rmdir /s /q "C:\gradle_final_stable" 2>nul
rmdir /s /q "C:\meyscan_build\scanner-apk\android\.gradle" 2>nul

echo 3. Configurando entorno...
set "JAVA_HOME=C:\Program Files\Microsoft\jdk-17.0.17.10-hotspot"
set "PATH=%JAVA_HOME%\bin;%PATH%"
set "ANDROID_HOME=C:\Android"
set "ANDROID_SDK_ROOT=C:\Android"

:: Usamos una carpeta de cache que NO EXISTE para que sea 100% limpia
set "GRADLE_USER_HOME=C:\cache_meyscan_limpia"

cd /d C:\meyscan_build\scanner-apk\android

echo 4. Iniciando compilacion (esto descargara Gradle de nuevo de forma limpia)...
echo Ten paciencia, este proceso puede tardar 5-10 minutos...
echo.

call gradlew.bat assembleRelease --no-daemon --no-build-cache -Porg.gradle.jvmargs=-Xmx4096m

if exist "app\build\outputs\apk\release\app-release.apk" (
    copy "app\build\outputs\apk\release\app-release.apk" "C:\meyscan_build\MeyScan.apk" /Y
    echo.
    echo ============================================
    echo ✅ EXITO: APK GENERADA en C:\meyscan_build\MeyScan.apk
    echo ============================================
) else (
    echo.
    echo ❌ ERROR: No se pudo generar la APK.
    echo Si ves "Access Denied", por favor desactiva el Antivirus 5 minutos.
)

pause
