@echo off
setlocal enabledelayedexpansion
echo ============================================
echo      MeyScan - BUILD APK FINAL
echo ============================================
echo.

:: Configurar entorno
set "JAVA_HOME=C:\Program Files\Microsoft\jdk-17.0.17.10-hotspot"
set "PATH=%JAVA_HOME%\bin;%PATH%"
set "ANDROID_HOME=C:\Android"
set "ANDROID_SDK_ROOT=C:\Android"

:: Usar una carpeta de cache limpia y única
set "GRADLE_USER_HOME=C:\gradle_meyscan_%RANDOM%"

cd /d C:\meyscan_build\scanner-apk\android

echo Limpiando builds anteriores...
call gradlew.bat clean 2>nul

echo.
echo Iniciando compilacion APK Release...
echo Esto puede tardar 10-15 minutos...
echo.

:: Compilar con configuracion optimizada
call gradlew.bat assembleRelease ^
    --no-daemon ^
    --no-parallel ^
    -Dorg.gradle.caching=false ^
    -Dorg.gradle.configureondemand=false ^
    -Porg.gradle.jvmargs=-Xmx4096m ^
    -Porg.gradle.parallel=false

if %ERRORLEVEL% EQU 0 (
    if exist "app\build\outputs\apk\release\app-release.apk" (
        copy "app\build\outputs\apk\release\app-release.apk" "..\..\..\MeyScan.apk" /Y
        echo.
        echo ============================================
        echo ✅ EXITO: APK GENERADA
        echo ============================================
        echo Ubicacion: C:\meyscan_build\MeyScan.apk
        echo.
        dir "..\..\..\MeyScan.apk" | findstr "MeyScan.apk"
    ) else (
        echo.
        echo ❌ ERROR: APK no encontrada en la ruta esperada
    )
) else (
    echo.
    echo ❌ ERROR: Fallo en la compilacion
    echo Revisa los mensajes de error arriba
)

echo.
pause
