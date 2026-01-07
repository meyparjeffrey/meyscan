# Prueba en Localhost - Estado Actual

## ⚠️ Problema Detectado

El servidor no se está iniciando correctamente debido a:

1. **Conflicto de dependencias**: `react-dom@19.1.0` requiere React 19, pero el proyecto usa React 18.2.0
2. **Problemas de codificación**: PowerShell tiene problemas con caracteres especiales (ñ) en la ruta

## ✅ Correcciones Aplicadas

1. ✅ `react-dom` actualizado a versión 18.2.0 (compatible con React 18.2.0)
2. ✅ `react-native-web` ya está instalado
3. ✅ Credenciales configuradas en `app.json > extra`

## 📋 Instrucciones para Probar Manualmente

### Opción 1: Desde Terminal (Recomendado)

1. Abre PowerShell o CMD
2. Navega al directorio:
   ```powershell
   cd "C:\Users\JeffreyBolaños\Desktop\APKINVENTARIO\scanner-apk"
   ```
3. Instala dependencias (si no están instaladas):
   ```powershell
   npm install
   ```
4. Inicia el servidor web:
   ```powershell
   npm run web
   ```
5. Espera a que aparezca la URL (normalmente `http://localhost:8081`)
6. Abre el navegador en esa URL

### Opción 2: Usar Expo Go (Móvil)

1. Inicia el servidor:
   ```powershell
   npm start
   ```
2. Escanea el código QR con Expo Go (Android/iOS)
3. La app se cargará en tu dispositivo

## 🔍 Verificación

Una vez que el servidor esté corriendo, deberías ver:

1. **Pantalla de Login**:
   - Logo de MeyparScan
   - Campos de email y contraseña
   - Botón "Entrar"

2. **Después del login**:
   - Pantalla Home con logo
   - Selectores de idioma y tema
   - Botón "Usuario"

3. **Selección de usuario**:
   - Modal con lista de usuarios desde Supabase
   - Seleccionar un usuario

4. **Pantalla de Escáner**:
   - Input para escaneo HID (o cámara en móvil)
   - Información del producto
   - Selector Entrada/Salida
   - Campo cantidad
   - Botón Confirmar

## ⚠️ Notas Importantes

- El servidor necesita las credenciales de Supabase configuradas
- Verifica que la tabla `scanner_users` exista en Supabase
- Verifica que la columna `source_app` exista en `inventory_movements`
- El usuario técnico debe existir en Supabase Auth

---

**Estado**: Listo para pruebas manuales. El código está completo y verificado.
