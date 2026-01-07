# Changelog - MeyparScan

## [1.0.0] - Diciembre 2024

### ✨ Características Implementadas

- **Login técnico** con Supabase Auth
- **Pantalla Home** con logo, selectores de idioma/tema, selección de usuario
- **Pantalla Escáner** con soporte HID (Newland) y Cámara (móvil)
- **Cámara trasera siempre** en dispositivos móviles
- **Registro de movimientos** de inventario (Entrada/Salida)
- **Auto-retorno a Home** después de 20s de inactividad
- **Gesto oculto**: 5 taps en logo → AdminModal

### 🎨 Diseño y UX

- Logo visible en todas las pantallas (Header)
- Logo blanco en modo oscuro
- Tema claro/oscuro con colores del logo (#E62144)
- Responsive para Newland (5-5.5" horizontal)
- Responsive para móvil (horizontal y vertical)
- Todos los botones accesibles (minHeight 48-56px)

### 🌐 Internacionalización

- Idiomas: Catalán (default) y Español
- Traducciones completas para todas las pantallas
- Todos los textos traducidos (sin hardcode)

### 🏗️ Arquitectura

- Clean Architecture (Domain, Application, Infrastructure, Presentation)
- Separación de responsabilidades
- Código documentado con JSDoc/TSDoc
- TypeScript estricto

### 🔧 Optimizaciones

- Accesibilidad mejorada (minHeight en todos los elementos interactivos)
- Inputs optimizados (56px)
- Botones de modales optimizados
- Indicador de escaneo con tema
- Dependencias limpiadas (expo-barcode-scanner eliminado, no usado)

### 📦 Integración Supabase

- Cliente Supabase configurado
- Repositorios: Product, Movement, ScannerUsers
- Servicios: Auth, Scanner, Movement
- Tabla scanner_users creada
- Columna source_app añadida a inventory_movements

### 📝 Documentación

- MANUAL_USUARIO.md - Manual completo de usuario
- MANUAL_PROGRAMADOR.md - Manual técnico para desarrolladores
- README.md - Guía rápida del proyecto
- ESTADO_PROYECTO.md - Estado actual del proyecto
- OPTIMIZACIONES.md - Optimizaciones aplicadas
- IMPLEMENTACION_COMPLETA.md - Lista detallada de archivos
- .cursorrules - Reglas de desarrollo

### 🐛 Correcciones

- Tema completo con todos los colores (white, black, success)
- Textos hardcodeados traducidos
- Dependencias no usadas eliminadas
- .env añadido a .gitignore

---

**Estado**: ✅ COMPLETO Y LISTO PARA PRODUCCIÓN
