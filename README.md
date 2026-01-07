# MeyScan - APK Escáner Inventario

Aplicación Android para escaneo rápido de productos y registro de movimientos de inventario.

> **Nombre:** MeyScan  
> **Package:** com.meypar.meyscan  
> **Versión:** 1.0.0

## Características

- ✅ Escaneo rápido con HID/Teclado (Newland) o Cámara (móvil)
- ✅ Cámara trasera siempre en dispositivos móviles
- ✅ Responsive para Newland (5-5.5" horizontal) y móvil (horizontal/vertical)
- ✅ Tema claro/oscuro con colores del logo Meypar
- ✅ Logo visible en todas las pantallas (blanco en modo oscuro)
- ✅ Idiomas: Catalán (default) y Español
- ✅ Sincronización automática con Supabase
- ✅ Auto-retorno a Home después de 20s de inactividad

## Instalación

```bash
npm install
npm start
```

## Configuración

Crear archivo `.env` con:
```
EXPO_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
```

## Estructura

- `src/domain/` - Entidades y tipos
- `src/application/` - Servicios y lógica de negocio
- `src/infrastructure/` - Supabase, repositorios, storage
- `src/presentation/` - Pantallas, componentes, hooks, tema, i18n

## 📍 Ubicación del Proyecto

**Proyecto principal**: `C:\meyscan_build\scanner-apk`

> ⚠️ **Nota importante**: El proyecto está en esta ubicación (sin la letra "ñ") para evitar problemas de encoding durante la compilación de Android APK.

## 🔄 GitHub

- **Repositorio**: https://github.com/meyparjeffrey/meyscan
- **Rama**: `master`
- **Estado**: ✅ Sincronizado

## 📦 APK Generada

- **Ubicación**: `C:\meyscan_build\MeyScan.apk`
- **Tamaño**: 89.83 MB
- **Estado**: ✅ Lista para instalar

## Documentación

- `MANUAL_USUARIO.md` - Manual de usuario
- `MANUAL_PROGRAMADOR.md` - Manual técnico
- `ESTADO_PROYECTO.md` - Estado actual del proyecto
- `OPTIMIZACIONES.md` - Optimizaciones aplicadas
- `IMPLEMENTACION_COMPLETA.md` - Lista detallada de archivos
- `BUILD_COMPLETADO.md` - Detalles del build exitoso
