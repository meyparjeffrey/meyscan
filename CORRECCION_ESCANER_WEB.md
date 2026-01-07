# Corrección del Escáner en Web

## ✅ Problema Resuelto

### Problema
En web, la aplicación intentaba usar `CameraScanner` porque detectaba el dispositivo como "mobile", pero en web la cámara no funciona correctamente y requiere permisos especiales del navegador.

### Solución
Modificado `useDeviceDetection` para que en web siempre use `HIDScanner` (input de texto) en lugar de `CameraScanner`.

## 📝 Cambios Implementados

**Archivo**: `src/presentation/hooks/useDeviceDetection.ts`

### Antes
```typescript
shouldUseCamera: deviceType === 'mobile',
```
- En web, se detectaba como 'mobile' → intentaba usar cámara
- La cámara no funciona bien en web

### Ahora
```typescript
// En web, NO usar cámara (usar HIDScanner en su lugar)
shouldUseCamera: Platform.OS !== 'web' && deviceType === 'mobile',
```
- En web: siempre usa `HIDScanner` (input de texto)
- En Android/iOS móvil: usa `CameraScanner` (cámara trasera)
- En Android Newland: usa `HIDScanner` (escáner hardware)

## 🎯 Comportamiento por Plataforma

### Web (Navegador)
- ✅ Usa `HIDScanner` (input de texto)
- ✅ No requiere permisos de cámara
- ✅ Permite escribir o pegar códigos manualmente

### Android/iOS Móvil (APK)
- ✅ Usa `CameraScanner` (cámara trasera)
- ✅ Requiere permisos de cámara
- ✅ Escaneo automático con cámara

### Android Newland (APK)
- ✅ Usa `HIDScanner` (escáner hardware)
- ✅ Captura automática desde el escáner incorporado

## 📌 Nota

El usuario puede escribir o pegar códigos de barras manualmente en el campo de texto cuando está en web, lo cual es más práctico para pruebas en desarrollo.
