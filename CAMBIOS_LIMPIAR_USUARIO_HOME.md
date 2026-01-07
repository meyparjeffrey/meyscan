# Cambios: Limpiar Usuario al Volver a Home

## ✅ Cambio Implementado

### Limpiar Usuario Activo al Volver a Home

**Antes**: 
- Al volver a Home desde ScannerScreen, el usuario seleccionado se mantenía
- No se podía seleccionar un usuario diferente sin usar el botón de limpiar

**Ahora**:
- Al volver a Home (botón Home o timeout), el usuario activo se limpia automáticamente
- Siempre se puede seleccionar un usuario nuevo al volver a Home

## 📝 Código Modificado

**Archivo**: `src/presentation/screens/ScannerScreen.tsx`

### 1. Importar setActiveUser del contexto
```typescript
const { theme, activeUser, setActiveUser } = useAppContext();
```

### 2. Limpiar usuario al presionar botón Home
```typescript
<Button
  title="Home"
  onPress={() => {
    clearScanner();
    setActiveUser(null); // Limpiar usuario activo al volver a Home
    navigation.navigate('Home');
  }}
/>
```

### 3. Limpiar usuario en timeout automático
```typescript
timeoutRef.current = setTimeout(() => {
  clearScanner();
  setActiveUser(null); // Limpiar usuario activo al volver a Home
  navigation.navigate('Home');
}, INACTIVITY_TIMEOUT_MS);
```

## 🎯 Comportamiento Actualizado

### Flujo Completo
1. Usuario selecciona un usuario en Home
2. Navega automáticamente a Scanner
3. Realiza escaneos y movimientos
4. Al volver a Home (botón o timeout):
   - ✅ Se limpia el escáner
   - ✅ Se limpia el usuario activo
   - ✅ Aparece el botón "Usuario" para seleccionar de nuevo
   - ✅ No se muestra el usuario anterior

## 📌 Nota

Esto permite que diferentes operarios puedan usar la misma APK sin tener que limpiar manualmente el usuario anterior. Cada vez que se vuelve a Home, se puede seleccionar un usuario diferente.
