# 🚀 Radon - Configuración Completa para MeyparScan

## ✅ Estado: Configurado y Listo

Radon ha sido configurado para trabajar con tu proyecto MeyparScan.

## 🎯 Configuración Aplicada

### Archivos Creados:
- ✅ `.vscode/settings.json` - Configuración de Radon
- ✅ `RADON_SETUP.md` - Esta guía

### Configuración de Radon:
- ✅ Habilitado automáticamente
- ✅ Modo preview: Web
- ✅ Puerto Expo: 8081
- ✅ Puerto Web: 8081
- ✅ Auto-inicio activado

## 🚀 Iniciar Radon con tu Proyecto

### Paso 1: Iniciar el Servidor Expo

Abre una terminal en Cursor y ejecuta:

```bash
cd "c:\Users\JeffreyBolaños\Desktop\APKINVENTARIO\scanner-apk"
npm run web
```

O si prefieres el modo desarrollo completo:

```bash
npm start
```

### Paso 2: Abrir Panel de Radon

1. **Presiona `Ctrl+Shift+P`** (paleta de comandos)
2. Escribe: `Radon: Open Panel`
3. Selecciona el comando
4. El panel de Radon se abrirá en la parte inferior o lateral

### Paso 3: Conectar con tu Proyecto

En el panel de Radon, deberías ver:

#### Opción A: Web Preview (Recomendado para pruebas rápidas)
- Selecciona "Web Preview"
- Deberías ver tu app cargándose
- URL: `http://localhost:8081`

#### Opción B: Expo Go (Móvil Real)
- Selecciona "Expo Go"
- Escanea el QR que aparece
- Tu app se cargará en tu móvil

#### Opción C: Android Emulator (Si tienes Android Studio)
- Asegúrate de que el emulador esté corriendo
- Selecciona el emulador en Radon
- Tu app se cargará automáticamente

## 🎨 Características de Radon Activas

### 1. Vista Previa Integrada
- Ve tu app junto al código
- Hot reload automático
- Cambios instantáneos

### 2. Element Inspector
- Haz clic en cualquier elemento de la app
- Salta directamente al código fuente
- Navegación rápida

### 3. Network Inspector
- Monitorea todas las peticiones a Supabase
- Ve los datos que se envían/reciben
- Debug de red en tiempo real

### 4. React DevTools
- Inspecciona el árbol de componentes
- Ve props y estado
- Profiling de rendimiento

## 📱 Probar tu App en Diferentes Dispositivos

### En Radon puedes:

1. **Cambiar Dimensiones**:
   - Selecciona diferentes dispositivos
   - Newland (512x450)
   - Samsung Galaxy S20 Ultra (412x915)
   - iPhone, iPad, etc.

2. **Cambiar Orientación**:
   - Vertical/Horizontal
   - Prueba el responsive

3. **Simular Red**:
   - Throttling de conexión
   - Simula 3G, 4G, WiFi

## 🔧 Comandos Útiles de Radon

Presiona `Ctrl+Shift+P` y escribe:

- `Radon: Open Panel` - Abrir panel principal
- `Radon: Reload` - Recargar la vista previa
- `Radon: Open DevTools` - Abrir herramientas de desarrollo
- `Radon: Toggle Preview` - Mostrar/ocultar vista previa

## 🎯 Flujo de Trabajo Recomendado

1. **Inicia el servidor**:
   ```bash
   npm run web
   ```

2. **Abre Radon Panel** (`Ctrl+Shift+P` → `Radon: Open Panel`)

3. **Selecciona "Web Preview"**

4. **Prueba tu app**:
   - Login
   - Home
   - Escáner
   - Búsqueda
   - Movimientos

5. **Usa Element Inspector**:
   - Haz clic en elementos para ir al código
   - Debug rápido

6. **Monitorea Red**:
   - Ve las peticiones a Supabase
   - Verifica que todo funcione

## ⚡ Atajos de Teclado

- `Ctrl+Shift+P` → Paleta de comandos
- `Ctrl+Shift+R` → Recargar Radon (si está disponible)
- `F12` → DevTools del navegador (si usas Web Preview)

## 🐛 Solución de Problemas

### Radon no muestra la app

1. Verifica que el servidor esté corriendo:
   ```bash
   npm run web
   ```

2. Verifica la URL en Radon: `http://localhost:8081`

3. Recarga Radon: `Ctrl+Shift+P` → `Radon: Reload`

### No se conecta con Expo Go

1. Asegúrate de usar `npm start` (no `npm run web`)
2. Verifica que el QR sea visible
3. Asegúrate de que tu móvil esté en la misma red WiFi

### El panel de Radon está vacío

1. Reinicia Cursor completamente
2. Abre el panel de nuevo: `Radon: Open Panel`
3. Verifica que la extensión esté habilitada

## 📊 Verificación de Estado

### ✅ Checklist:

- [ ] Servidor Expo corriendo (`npm run web`)
- [ ] Panel de Radon abierto
- [ ] Vista previa mostrando la app
- [ ] Hot reload funcionando
- [ ] Element Inspector funcionando
- [ ] Network Inspector funcionando

## 🎉 ¡Listo!

Radon está completamente configurado y listo para usar. Ahora puedes:

- ✅ Ver tu app en tiempo real
- ✅ Debuggear fácilmente
- ✅ Probar en diferentes dispositivos
- ✅ Inspeccionar elementos
- ✅ Monitorear red

**¡Disfruta del poder de Radon!** 🚀
