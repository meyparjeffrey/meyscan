# 🚀 Build APK Local - MeyScan

## Requisitos Previos

1. **Android Studio** instalado
2. **Java JDK 11 o superior**
3. **Android SDK** configurado
4. **Variables de entorno:**
   - `ANDROID_HOME` apuntando al SDK de Android
   - `JAVA_HOME` apuntando al JDK

## Pasos para Build Local

### 1. Preparar el Proyecto

```bash
# Instalar dependencias
npm install

# Generar carpetas nativas de Android
npx expo prebuild --platform android
```

### 2. Convertir Icono

El icono está en `assets/icon.ico`. Necesitas convertirlo a PNG:

```bash
# Opción 1: Con ImageMagick
magick convert assets/icon.ico -resize 1024x1024 assets/icon.png
magick convert assets/icon.ico -resize 512x512 assets/adaptive-icon.png

# Opción 2: Usar herramienta online
# https://convertio.co/es/ico-png/
# Subir icon.ico y descargar como PNG 1024x1024
```

### 3. Build APK

```bash
# Opción A: Con Expo (más fácil)
npx expo build:android -t apk

# Opción B: Con Gradle directamente (más control)
cd android
./gradlew assembleRelease
# El APK estará en: android/app/build/outputs/apk/release/app-release.apk
```

### 4. Firmar el APK (Opcional para producción)

```bash
# Generar keystore (solo primera vez)
keytool -genkeypair -v -storetype PKCS12 -keystore meyscan-release-key.keystore -alias meyscan-key -keyalg RSA -keysize 2048 -validity 10000

# Firmar APK
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore meyscan-release-key.keystore app-release-unsigned.apk meyscan-key

# Alinear APK
zipalign -v 4 app-release-unsigned.apk MeyScan.apk
```

## Ubicación del APK

- **Expo build:** Se descarga automáticamente o está en la carpeta de descargas
- **Gradle build:** `android/app/build/outputs/apk/release/app-release.apk`

## Notas

- El APK se llamará **MeyScan.apk**
- Package name: `com.meypar.meyscan`
- Versión: `1.0.0` (versionCode: 1)
