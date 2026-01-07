# 📱 Configurar Dispositivo en Radon - Guía Paso a Paso

## 🎯 Situación Actual

Radon muestra "No devices found" porque necesita que configures un dispositivo para mostrar tu app.

## ✅ Opciones Disponibles

Tienes **3 opciones** para usar Radon con tu proyecto:

---

## 🚀 OPCIÓN 1: Expo Go (Móvil Físico) - RECOMENDADO

**Ventajas**: 
- ✅ No requiere instalaciones adicionales
- ✅ Pruebas en dispositivo real
- ✅ Funciona inmediatamente

### Pasos:

1. **Instala Expo Go en tu móvil**:
   - **Android**: [Google Play - Expo Go](https://play.google.com/store/apps/details?id=host.exp.exponent)
   - **iOS**: [App Store - Expo Go](https://apps.apple.com/us/app/expo-go/id982107779)

2. **En Radon Panel**:
   - Haz clic en **"+ Create new device"**
   - Selecciona **"Expo Go"**
   - O busca la opción **"Expo"** o **"Expo Go"**

3. **Inicia el servidor Expo** (si no está corriendo):
   ```bash
   npm start
   ```
   **NOTA**: Usa `npm start` (NO `npm run web`) para Expo Go

4. **Escanea el QR**:
   - En Radon deberías ver un código QR
   - Abre Expo Go en tu móvil
   - Escanea el QR
   - Tu app se cargará en el móvil

---

## 🖥️ OPCIÓN 2: Web Preview (Navegador) - MÁS RÁPIDO

**Ventajas**:
- ✅ No requiere móvil
- ✅ Funciona inmediatamente
- ✅ Perfecto para desarrollo rápido

### Pasos:

1. **Asegúrate de que el servidor web esté corriendo**:
   ```bash
   npm run web
   ```

2. **En Radon Panel**:
   - Busca la opción **"Web"** o **"Web Preview"**
   - O haz clic en el icono de **navegador/web** en la barra superior
   - Deberías ver una opción para abrir en navegador

3. **Alternativa - Abrir directamente**:
   - Si no aparece la opción, abre manualmente:
   - Ve a: `http://localhost:8081`
   - Radon debería detectarlo automáticamente

---

## 📱 OPCIÓN 3: Emulador Android (Requiere Android Studio)

**Ventajas**:
- ✅ Emulación completa
- ✅ Múltiples dispositivos
- ✅ Muy realista

**Desventajas**:
- ⚠️ Requiere Android Studio (pesado)
- ⚠️ Configuración más compleja

### Pasos:

1. **Instala Android Studio** (si no lo tienes):
   - Descarga desde: https://developer.android.com/studio
   - Instala y configura

2. **Crea un AVD (Android Virtual Device)**:
   - Abre Android Studio
   - Ve a: `Tools > Device Manager`
   - Clic en "Create Device"
   - Selecciona un dispositivo (ej: Pixel 5)
   - Descarga una imagen del sistema (ej: Android 13)
   - Finaliza la creación

3. **Inicia el emulador**:
   - En Device Manager, haz clic en "Play" ▶️
   - Espera a que el emulador se inicie

4. **En Radon Panel**:
   - Haz clic en **"Add Android"**
   - O **"+ Create new device"** → **"Android"**
   - Radon debería detectar el emulador automáticamente
   - Selecciona el emulador que está corriendo

5. **Inicia tu app**:
   ```bash
   npm start
   ```
   - Radon debería cargar tu app en el emulador

---

## 🎯 RECOMENDACIÓN PARA TI

Dado que estás en **Windows** y quieres probar rápido:

### **Mejor Opción: Expo Go + Móvil Físico**

1. Instala Expo Go en tu móvil Android
2. En Radon: **"+ Create new device"** → **"Expo Go"**
3. Ejecuta: `npm start` (en terminal)
4. Escanea el QR que aparece
5. ¡Tu app se carga en el móvil!

### **Alternativa Rápida: Web Preview**

1. Ejecuta: `npm run web`
2. En Radon, busca el icono de **web/navegador**
3. O abre manualmente: `http://localhost:8081`
4. Radon detectará la conexión

---

## 🔍 Si No Aparecen las Opciones

### Verificar que el servidor esté corriendo:

```bash
# Para Expo Go
npm start

# Para Web
npm run web
```

### Verificar en Radon:

1. **Recarga el panel**: `Ctrl+Shift+P` → `Radon: Reload`
2. **Verifica la conexión**: Deberías ver el estado del servidor
3. **Revisa los logs**: En la terminal deberías ver la URL del servidor

---

## 📋 Checklist de Configuración

- [ ] Servidor Expo corriendo (`npm start` o `npm run web`)
- [ ] Radon Panel abierto
- [ ] Dispositivo seleccionado/creado en Radon
- [ ] App cargándose en el dispositivo/vista previa
- [ ] Hot reload funcionando

---

## ⚠️ Solución de Problemas

### "No devices found" persiste

1. **Verifica que el servidor esté corriendo**
2. **Recarga Radon**: `Ctrl+Shift+P` → `Radon: Reload`
3. **Reinicia Cursor** completamente
4. **Verifica la URL**: Debería ser `http://localhost:8081`

### Expo Go no se conecta

1. Asegúrate de usar `npm start` (no `npm run web`)
2. Verifica que el QR sea visible
3. Asegúrate de que tu móvil esté en la misma red WiFi
4. O usa `npm start --tunnel` para conexión remota

### Web Preview no funciona

1. Verifica que `npm run web` esté corriendo
2. Abre manualmente: `http://localhost:8081`
3. Verifica que no haya errores en la consola

---

## 🎉 Siguiente Paso

**Elige una opción y sigue los pasos**. La más rápida es **Expo Go con tu móvil físico**.

¿Qué opción quieres usar? Te guío paso a paso.
