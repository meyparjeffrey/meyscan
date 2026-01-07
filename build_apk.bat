@echo off
echo --- MeyScan APK Build ---

REM 1. Prep
echo Installing dependencies...
call npm install

REM 2. Prebuild
echo Generating Android project...
rmdir /s /q android 2>nul
call npx expo prebuild --platform android --clean

REM 3. Compile
if exist "android" (
    echo Android folder created. Compiling...
    cd android
    call gradlew assembleRelease
    cd ..
) else (
    echo FAILED to create android folder.
    exit /b 1
)

REM 4. Finalize
if exist "android\app\build\outputs\apk\release\app-release.apk" (
    copy "android\app\build\outputs\apk\release\app-release.apk" "MeyScan.apk" /Y
    echo MeyScan.apk GENERATED SUCCESSFULLY!
) else (
    echo APK file not found after build.
)
