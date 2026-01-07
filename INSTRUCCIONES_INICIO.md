# Instrucciones para Iniciar la Aplicación

## ⚠️ IMPORTANTE: Configuración Requerida

### 1. Crear archivo .env

Crea un archivo `.env` en la raíz de `scanner-apk/` con:

```
EXPO_PUBLIC_SUPABASE_URL=https://dmjulfufqftfrwhjhwlz.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRtanVsZnVmcWZ0ZnJ3aGpod2x6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM3MTk3NTIsImV4cCI6MjA3OTI5NTc1Mn0.XrSUpg718Gbwi_RkQknJxCENd9OyHfmWpN_QlscfQz0
```

**O** configura las variables en `app.json`:

```json
{
  "expo": {
    "extra": {
      "supabaseUrl": "https://dmjulfufqftfrwhjhwlz.supabase.co",
      "supabaseAnonKey": "tu-anon-key"
    }
  }
}
```

### 2. Instalar dependencias

```bash
cd scanner-apk
npm install
```

### 3. Iniciar servidor de desarrollo

```bash
npm start
```

Luego:
- Presiona `w` para abrir en web
- Presiona `a` para Android
- Presiona `i` para iOS

### 4. Verificar en Supabase

Asegúrate de que:
- ✅ Tabla `scanner_users` existe
- ✅ Columna `source_app` existe en `inventory_movements`
- ✅ RLS policies configuradas para usuario técnico

---

**NOTA**: La aplicación **NO funcionará** sin las credenciales de Supabase configuradas. Se lanzará un error claro si faltan.
