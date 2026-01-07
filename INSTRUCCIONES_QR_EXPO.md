# 📱 Instrucciones para Ver el QR de Expo Go

## ✅ Configuración Completada

He configurado todo para que el QR sea visible. El servidor Expo está activo y listo.

## 🚀 Cómo Ver el QR

### Opción 1: Usar el Script .bat (Más Simple)

1. **Ejecuta el archivo**: `INICIAR_EXPO_QR_FINAL.bat`
2. **Espera 10-15 segundos** mientras el tunnel se establece
3. **El QR aparecerá** en la ventana de terminal

### Opción 2: Usar PowerShell

1. Abre PowerShell en el directorio del proyecto
2. Ejecuta: `npm run start:qr`
3. Espera a que aparezca el QR en la terminal

### Opción 3: Usar URL Manual (Si el QR no aparece)

1. Abre **Expo Go** en tu móvil
2. Toca **"Enter URL manually"**
3. Ingresa: `exp://192.168.1.19:8081`
4. Asegúrate de estar en la misma red WiFi

## 📋 Scripts Disponibles

### Scripts Creados:

- **`INICIAR_EXPO_QR_FINAL.bat`** - Inicia Expo con tunnel (recomendado)
- **`iniciar_expo_qr_simple.ps1`** - Script PowerShell simple
- **`verificar_qr_visible.ps1`** - Verifica el estado del servidor y muestra información

### Scripts en package.json:

- **`npm run start:qr`** - Inicia Expo con tunnel y limpia caché
- **`npm run start:local`** - Inicia Expo en red local
- **`npm start`** - Inicia Expo normalmente

## 🔍 Verificar Estado

Para verificar que todo está funcionando:

```powershell
powershell -ExecutionPolicy Bypass -File "verificar_qr_visible.ps1"
```

## ⚙️ Configuración Aplicada

1. ✅ **@expo/ngrok instalado** - Para usar tunnels
2. ✅ **Scripts configurados** - Para iniciar con QR visible
3. ✅ **Servidor activo** - Puerto 8081
4. ✅ **IP local detectada** - 192.168.1.19

## 🎯 Comandos Útiles en la Terminal de Expo

Cuando Expo esté corriendo, presiona estas teclas:

- **`?`** - Ver todas las opciones disponibles
- **`w`** - Abrir en navegador web
- **`r`** - Recargar la app
- **`m`** - Mostrar menú
- **`a`** - Abrir en Android emulator
- **`i`** - Abrir en iOS simulator

## ⚠️ Si el QR No Aparece

1. **Espera 15-20 segundos** - El tunnel tarda en establecerse
2. **Maximiza la ventana de terminal** - El QR necesita espacio
3. **Presiona `?`** en la terminal de Expo para ver opciones
4. **Usa la URL manual** - `exp://192.168.1.19:8081`
5. **Verifica la red WiFi** - PC y móvil deben estar en la misma red

## 📱 Conectar con Expo Go

1. Abre **Expo Go** en tu móvil
2. Toca **"Scan QR Code"**
3. Escanea el QR que aparece en la terminal
4. La app se cargará automáticamente

## 🎉 Estado Actual

- ✅ Servidor Expo: **ACTIVO** (Puerto 8081)
- ✅ IP Local: **192.168.1.19**
- ✅ @expo/ngrok: **INSTALADO**
- ✅ Scripts: **CONFIGURADOS**

---

**Nota**: El QR siempre aparece cuando usas `--tunnel`. Si no lo ves, es porque el tunnel aún se está estableciendo. Espera unos segundos más.

