# Solución para Problemas de Autenticación

## ✅ Correcciones Aplicadas

### 1. Mejora en Manejo de Errores de Autenticación
- ✅ Añadidos logs de consola para debugging
- ✅ Mensajes de error más específicos y claros
- ✅ Verificación de diferentes tipos de errores de Supabase Auth

### 2. Verificación de Credenciales
- ✅ Logs para verificar que las credenciales se cargan correctamente
- ✅ Mensajes claros si las credenciales no están configuradas

## 🔍 Verificación de Autenticación

### Credenciales Configuradas
Las credenciales están en `app.json > extra`:
- `supabaseUrl`: `https://dmjulfufqftfrwhjhwlz.supabase.co`
- `supabaseAnonKey`: (configurado)

### Método de Autenticación
La aplicación usa `supabase.auth.signInWithPassword()` que es el método estándar de Supabase Auth, igual que INVENTARIOMEYPAR.

## ⚠️ Posibles Problemas

### 1. Usuario Técnico No Existe
**Solución**: Crear el usuario técnico en Supabase Auth:
- Ir a Supabase Dashboard > Authentication > Users
- Crear nuevo usuario con email y contraseña
- Usar ese email/contraseña en la APK

### 2. Credenciales Diferentes
**Verificación**: Asegúrate de que:
- La URL de Supabase es la misma que INVENTARIOMEYPAR
- El Anon Key es el mismo que INVENTARIOMEYPAR

### 3. RLS Policies
**Verificación**: El usuario técnico debe tener permisos para:
- Leer `products` (por código/barcode)
- Insertar en `inventory_movements`
- Actualizar `products.stock_current`

## 📝 Pasos para Verificar

1. **Abrir consola del navegador** (F12)
2. **Intentar login** con las credenciales
3. **Revisar los logs**:
   - `[AuthService] Intentando login con email: ...`
   - `[Supabase Client] Configurado con URL: ...`
   - Cualquier error de Supabase

4. **Verificar en Supabase Dashboard**:
   - Que el usuario técnico existe
   - Que el email/contraseña son correctos
   - Que las RLS policies permiten las operaciones necesarias

## 🔧 Debugging

Si el login falla, revisa la consola del navegador para ver:
- El error exacto de Supabase
- Si las credenciales se cargaron correctamente
- El mensaje de error específico
