# Usuarios Añadidos en Supabase

## ✅ Usuarios Insertados Correctamente

Se han añadido **13 usuarios** en la tabla `scanner_users` de Supabase:

1. ✅ **Aleix Paricio**
2. ✅ **Alex Gómez**
3. ✅ **Antonio Manzano**
4. ✅ **Carles Villar**
5. ✅ **Daniel Lorite**
6. ✅ **Ignacio Curley**
7. ✅ **Ismael Fuentes**
8. ✅ **Israel Lerma**
9. ✅ **Ivan Hormigo**
10. ✅ **Jaume Prats**
11. ✅ **Javier Castro**
12. ✅ **Marc Rosell**
13. ✅ **Toni Oliver**

## 📋 Detalles

- **Tabla**: `scanner_users`
- **Estado**: Todos los usuarios están `enabled = true`
- **Orden**: Ordenados alfabéticamente por `display_name`
- **Fecha de creación**: 2025-12-17 15:40:31 UTC

## 🔍 Verificación

Todos los usuarios están disponibles para selección en la APK. La aplicación leerá estos usuarios desde Supabase cuando se abra el modal de selección de usuario en la pantalla Home.

## 📝 Notas

- Los usuarios se pueden gestionar desde Supabase Dashboard:
  - Añadir nuevos usuarios
  - Deshabilitar usuarios (cambiar `enabled` a `false`)
  - Añadir notas en el campo `notes`
  - Ver `last_seen_at` y `last_seen_device` para rastrear uso
