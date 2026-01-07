# 📱 Solución: Usar Expo Go Directamente (Sin Radon)

## ⚠️ Problema Detectado

Radon en Windows está en **beta** y tiene limitaciones. La opción "Expo Go" puede no aparecer en el panel.

## ✅ SOLUCIÓN: Usar Expo Go Directamente

**No necesitas Radon para usar Expo Go**. Puedes conectarte directamente desde tu móvil.

---

## 🚀 Pasos para Conectar Expo Go (SIN Radon)

### Paso 1: Instalar Expo Go en tu Móvil

- **Android**: [Descargar Expo Go](https://play.google.com/store/apps/details?id=host.exp.exponent)
- **iOS**: [Descargar Expo Go](https://apps.apple.com/us/app/expo-go/id982107779)

### Paso 2: Iniciar el Servidor Expo

Abre una terminal en Cursor y ejecuta:

```bash
cd "c:\Users\JeffreyBolaños\Desktop\APKINVENTARIO\scanner-apk"
npm start
```

**IMPORTANTE**: Usa `npm start` (NO `npm run web`)

### Paso 3: Ver el Código QR

Después de ejecutar `npm start`, deberías ver:

```
› Metro waiting on exp://192.168.x.x:8081
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)
```

Y un **código QR** en la terminal.

### Paso 4: Escanear el QR

1. **Abre Expo Go** en tu móvil
2. **Toca "Scan QR Code"** o usa la cámara
3. **Escanea el QR** que aparece en la terminal
4. **Tu app se cargará** automáticamente en el móvil

---

## 🔧 Si No Aparece el QR o No Se Conecta

### Opción A: Usar Tunnel (Recomendado)

Si tu móvil y PC no están en la misma red WiFi:

```bash
npm start -- --tunnel
```

Esto crea una conexión pública que funciona desde cualquier red.

### Opción B: Verificar Red WiFi

1. Asegúrate de que tu PC y móvil estén en la **misma red WiFi**
2. En Windows, configura la red como **"Privada"** (no pública)
3. Desactiva temporalmente el firewall si bloquea la conexión

### Opción C: Usar IP Manual

1. En la terminal, busca la IP que aparece: `exp://192.168.x.x:8081`
2. En Expo Go, toca "Enter URL manually"
3. Escribe: `exp://TU_IP:8081` (reemplaza TU_IP con la IP que aparece)

---

## 🎯 Alternativa: Web Preview (Más Simple)

Si Expo Go te da problemas, usa **Web Preview** directamente:

### Opción 1: Chrome DevTools (Ya lo tienes)

1. Ejecuta: `npm run web`
2. Abre Chrome
3. Presiona `F12` → `Ctrl+Shift+M` (Toggle Device Toolbar)
4. Selecciona un dispositivo móvil
5. Prueba tu app

### Opción 2: Abrir Directamente

1. Ejecuta: `npm run web`
2. Abre: `http://localhost:8081`
3. Usa Chrome DevTools para simular móvil

---

## 📋 Checklist Rápido

### Para Expo Go:
- [ ] Expo Go instalado en el móvil
- [ ] `npm start` ejecutándose
- [ ] QR visible en la terminal
- [ ] Móvil y PC en la misma WiFi
- [ ] QR escaneado con Expo Go
- [ ] App cargándose en el móvil

### Para Web Preview:
- [ ] `npm run web` ejecutándose
- [ ] Navegador abierto en `http://localhost:8081`
- [ ] Chrome DevTools activado (`F12`)
- [ ] Device Toolbar activado (`Ctrl+Shift+M`)

---

## 🎉 Recomendación Final

**Para desarrollo rápido**: Usa **Web Preview con Chrome DevTools**
- ✅ Funciona inmediatamente
- ✅ No requiere móvil
- ✅ Puedes simular cualquier dispositivo
- ✅ Ya lo tienes configurado

**Para pruebas reales**: Usa **Expo Go en tu móvil**
- ✅ Pruebas en dispositivo real
- ✅ Cámara funciona
- ✅ Más realista

---

## ⚠️ Sobre Radon en Windows

Radon en Windows está en **beta** y puede tener:
- ❌ Opciones limitadas en el panel
- ❌ Expo Go puede no aparecer
- ❌ Algunas características no funcionan

**Solución**: Usa Expo Go directamente (sin Radon) o Web Preview.

---

¿Quieres que te guíe paso a paso con alguna de estas opciones?
