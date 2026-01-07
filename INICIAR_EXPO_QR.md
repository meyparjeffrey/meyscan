# 📱 Cómo Ver el QR de Expo Go

## ⚠️ Problema

El puerto 8081 está ocupado por otro proceso (probablemente el servidor web).

## ✅ Solución: Iniciar Expo en Modo Interactivo

### Opción 1: Desde Terminal de Cursor (Recomendado)

1. **Abre una terminal nueva en Cursor**:
   - `Terminal > New Terminal` o `Ctrl+Shift+`` (backtick)

2. **Navega al proyecto**:
   ```bash
   cd "c:\Users\JeffreyBolaños\Desktop\APKINVENTARIO\scanner-apk"
   ```

3. **Inicia Expo**:
   ```bash
   npm start
   ```

4. **Deberías ver**:
   - Un código QR en la terminal
   - Opciones: `Press a │ open Android`, `Press i │ open iOS simulator`, etc.

5. **Escanea el QR** con Expo Go en tu móvil

### Opción 2: Usar Tunnel (Si no estás en la misma WiFi)

```bash
npm start -- --tunnel
```

Esto crea una conexión pública que funciona desde cualquier red.

### Opción 3: Usar Puerto Diferente

Si el puerto 8081 sigue ocupado:

```bash
npx expo start --port 8082
```

---

## 🔍 Verificar que el Servidor Esté Corriendo

Después de ejecutar `npm start`, deberías ver algo como:

```
› Metro waiting on exp://192.168.1.100:8081
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)

┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│   ████████████████████████████████████████████████████████████████████  │
│   ████████████████████████████████████████████████████████████████████  │
│   ████████████████████████████████████████████████████████████████████  │
│   ████████████████████████████████████████████████████████████████████  │
│   ████████████████████████████████████████████████████████████████████  │
│   ████████████████████████████████████████████████████████████████████  │
│   ████████████████████████████████████████████████████████████████████  │
│   ████████████████████████████████████████████████████████████████████  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘

› Press a │ open Android
› Press i │ open iOS simulator
› Press w │ open web

› Press r │ reload app
› Press m │ toggle menu
› Press ? │ show all commands
```

---

## 📱 Conectar con Expo Go

1. **Abre Expo Go** en tu móvil
2. **Toca "Scan QR Code"**
3. **Escanea el QR** que aparece en la terminal
4. **Espera** a que la app se cargue

---

## ⚠️ Si No Aparece el QR

### Verifica que:
- [ ] El servidor esté corriendo (`npm start`)
- [ ] No haya errores en la terminal
- [ ] El puerto 8081 esté libre (o usa otro puerto)
- [ ] La terminal sea lo suficientemente grande para mostrar el QR

### Solución Alternativa: URL Manual

Si el QR no aparece, puedes:

1. Busca en la terminal: `exp://192.168.x.x:8081`
2. En Expo Go, toca "Enter URL manually"
3. Escribe la URL que aparece

---

## 🎯 Comandos Útiles en Expo CLI

Mientras `npm start` está corriendo, puedes presionar:

- `a` - Abrir en Android emulator
- `i` - Abrir en iOS simulator
- `w` - Abrir en navegador web
- `r` - Recargar la app
- `m` - Mostrar menú
- `?` - Mostrar todos los comandos

---

## 💡 Recomendación

**Para ver el QR claramente**:
1. Maximiza la terminal
2. Aumenta el tamaño de la fuente si es necesario
3. Asegúrate de que la terminal sea lo suficientemente ancha

**Si prefieres no usar QR**:
- Usa `npm run web` y prueba en Chrome DevTools
- O usa tunnel: `npm start -- --tunnel`
