# 📱 Instrucciones para Configurar el Icono de la APK

## Ubicación del Icono Original

El icono original está en: `logo/icon.ico`

## Pasos para Configurar el Icono

### Opción 1: Usar ImageMagick (Recomendado)

1. **Instalar ImageMagick:**
   - Descargar desde: https://imagemagick.org/script/download.php
   - Instalar en Windows

2. **Ejecutar el script:**
   ```powershell
   .\convert-icon.ps1
   ```

3. **O manualmente:**
   ```powershell
   magick convert assets\icon.ico -resize 1024x1024 assets\icon.png
   magick convert assets\icon.ico -resize 512x512 assets\adaptive-icon.png
   ```

### Opción 2: Usar Herramienta Online

1. Ir a: https://convertio.co/es/ico-png/
2. Subir `logo/icon.ico`
3. Convertir a PNG
4. Descargar y renombrar a `icon.png`
5. Redimensionar a 1024x1024px (puedes usar https://www.iloveimg.com/resize-image)
6. Copiar a `assets/icon.png`
7. Crear también `assets/adaptive-icon.png` de 512x512px

### Opción 3: Usar Paint.NET o GIMP

1. Abrir `logo/icon.ico` en Paint.NET o GIMP
2. Exportar como PNG
3. Redimensionar a 1024x1024px para `icon.png`
4. Redimensionar a 512x512px para `adaptive-icon.png`
5. Guardar en `assets/`

## Archivos Necesarios

- ✅ `assets/icon.png` - 1024x1024px (icono principal)
- ✅ `assets/adaptive-icon.png` - 512x512px (icono adaptativo para Android)

## Verificación

Después de crear los archivos, verifica que:
- Los archivos existen en `assets/`
- Tienen el tamaño correcto (1024x1024 y 512x512)
- Se ven correctamente en un visor de imágenes

## Nota

El archivo `icon.ico` original se mantiene en `logo/` como respaldo.
Los archivos `.ico` no se suben a Git (están en `.gitignore`).
