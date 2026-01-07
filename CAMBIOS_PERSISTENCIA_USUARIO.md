# Cambios en Persistencia del Usuario Activo

## ✅ Cambio Implementado

### Usuario Activo NO Persiste en Web (Refresh)

**Antes**: 
- El usuario seleccionado se guardaba en AsyncStorage (localStorage en web)
- Al refrescar el navegador (F5), el usuario seguía seleccionado

**Ahora**:
- **En Web**: El usuario activo NO se guarda ni se carga desde LocalStorage
  - Al refrescar (F5), el usuario se resetea
  - Aparece el botón "Usuario" para seleccionar de nuevo
- **En Android/iOS (APK)**: El usuario activo SÍ se guarda y persiste
  - Al cerrar y abrir la app, el usuario sigue seleccionado
  - Solo se resetea si se cierra completamente la app

## 📝 Código Modificado

**Archivo**: `src/presentation/context/AppContext.tsx`

### 1. Carga de Usuario Activo

```typescript
// Solo cargar usuario activo en Android/iOS, NO en web
// En web, el usuario se resetea al refrescar (F5)
// En la APK, el usuario persiste al cerrar/abrir la app
const savedUser = Platform.OS !== 'web' 
  ? await LocalStorage.getActiveUser() 
  : null;
```

### 2. Guardado de Usuario Activo

```typescript
const setActiveUser = async (user: ScannerUser | null) => {
  setActiveUserState(user);
  // Solo guardar usuario activo en Android/iOS, NO en web
  if (Platform.OS !== 'web') {
    await LocalStorage.saveActiveUser(user);
  }
};
```

## 🎯 Comportamiento por Plataforma

### Web (Navegador)
- ✅ Al refrescar (F5): Usuario se resetea
- ✅ Aparece botón "Usuario" para seleccionar
- ✅ No persiste entre refrescos

### Android/iOS (APK)
- ✅ Al cerrar/abrir la app: Usuario persiste
- ✅ Al refrescar dentro de la app: Usuario persiste
- ✅ Solo se resetea si se cierra completamente la app

## 📌 Nota

El tema y el idioma SÍ persisten en ambas plataformas (web y APK), solo el usuario activo tiene este comportamiento diferenciado.
