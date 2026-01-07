# Instalación de Radon - Emulador Móvil en Cursor

## 📱 ¿Qué es Radon?

Radon es una extensión para Cursor/VS Code que permite emular dispositivos iOS y Android directamente dentro del editor, permitiendo probar tu app React Native/Expo sin salir de Cursor.

## ✅ Requisitos

- Cursor versión 0.32 o superior
- Proyecto Expo/React Native configurado
- **macOS**: Soporte completo para iOS y Android
- **Windows/Linux**: Soporte para Android (beta)

## 🚀 Instalación

### Método 1: Desde la Interfaz de Cursor (Recomendado)

1. **Abre el Panel de Extensiones**:
   - Presiona `Ctrl+Shift+X` (Windows/Linux) o `Cmd+Shift+X` (macOS)
   - O haz clic en el icono de Extensiones en la barra lateral izquierda

2. **Busca Radon**:
   - En el buscador, escribe: `Radon` o `natewallace.vscode-radon`
   - Deberías ver "Radon - React Native IDE" por Software Mansion

3. **Instala**:
   - Haz clic en "Install"
   - Espera a que se complete la instalación

4. **Reinicia Cursor** (si es necesario)

### Método 2: Desde la Línea de Comandos

```bash
# Instalar Radon usando el ID de la extensión
code --install-extension natewallace.vscode-radon
```

**Nota**: Si `code` no funciona, usa `cursor` en su lugar:
```bash
cursor --install-extension natewallace.vscode-radon
```

## 🔍 Verificación de Instalación

### Paso 1: Verificar que está Instalada

1. Abre el Panel de Extensiones (`Ctrl+Shift+X`)
2. Busca "Radon"
3. Deberías ver "Radon - React Native IDE" con estado "Installed"

### Paso 2: Abrir el Panel de Radon

1. Presiona `Ctrl+Shift+P` (o `Cmd+Shift+P` en macOS) para abrir la paleta de comandos
2. Escribe: `Radon: Open Panel`
3. Selecciona el comando
4. Deberías ver el panel de Radon abierto

### Paso 3: Configurar el Proyecto

1. En el panel de Radon, deberías ver opciones para:
   - **iOS Simulator**: Si estás en macOS
   - **Android Emulator**: Si tienes Android Studio instalado
   - **Expo Go**: Para conectar con Expo Go en dispositivo físico

2. Asegúrate de que tu proyecto Expo esté corriendo:
   ```bash
   npm start
   # o
   npm run web
   ```

## 📋 Uso con tu Proyecto MeyparScan

### Opción A: Con Expo Web (Actual)

1. Inicia el servidor:
   ```bash
   npm run web
   ```

2. En Radon, selecciona "Web Preview"
3. Deberías ver tu app en el panel de Radon

### Opción B: Con Expo Go (Móvil Real)

1. Inicia Expo:
   ```bash
   npm start
   ```

2. En Radon, selecciona "Expo Go"
3. Escanea el QR que aparece
4. Tu app se cargará en el dispositivo

### Opción C: Con Emulador Android

1. Asegúrate de tener Android Studio instalado
2. Crea un AVD (Android Virtual Device) desde Android Studio
3. Inicia el emulador
4. En Radon, selecciona el emulador
5. Tu app se cargará automáticamente

## 🎯 Características de Radon

- ✅ **Vista Previa Integrada**: Ve tu app junto al código
- ✅ **Element Inspector**: Haz clic en elementos para ir al código
- ✅ **Network Inspector**: Monitorea peticiones de red
- ✅ **Hot Reload**: Cambios instantáneos
- ✅ **Debugging**: Herramientas de depuración integradas

## ⚠️ Solución de Problemas

### Radon no aparece en Extensiones

1. Verifica que estés usando Cursor (no VS Code)
2. Verifica la versión: `Help > About` (debe ser 0.32+)
3. Intenta buscar por el ID: `natewallace.vscode-radon`

### El panel de Radon no se abre

1. Reinicia Cursor completamente
2. Verifica que la extensión esté habilitada en Extensiones
3. Intenta el comando: `Radon: Reload`

### No detecta el emulador

1. Asegúrate de que Android Studio esté instalado
2. Verifica que el emulador esté corriendo
3. Ejecuta: `adb devices` para verificar conexión

## 📚 Recursos

- **Documentación oficial**: https://ide.swmansion.com/
- **Marketplace**: https://marketplace.visualstudio.com/items?itemName=natewallace.vscode-radon
- **GitHub**: https://github.com/software-mansion/radon

## ✅ Checklist de Verificación

- [ ] Radon instalado en Cursor
- [ ] Panel de Radon abierto
- [ ] Proyecto Expo corriendo (`npm start` o `npm run web`)
- [ ] Vista previa funcionando en Radon
- [ ] Hot reload funcionando

---

**Nota**: Si Radon no está disponible o no funciona en tu sistema, puedes usar:
- **Chrome DevTools** (ya lo tienes configurado)
- **Expo Go** en tu móvil físico
- **Android Studio Emulator** (más pesado pero completo)
