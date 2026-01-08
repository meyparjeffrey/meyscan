# 🚀 Instrucciones para Acceder a la Aplicación

## ✅ Estado Actual

Los servicios están **EJECUTÁNDOSE** en segundo plano:

### 📱 **Expo Go (Móvil) - Modo Tunnel**
- **Puerto**: 8081
- **Estado**: ✅ Activo
- **Cómo acceder**:
  1. Busca en la terminal donde ejecutaste `npm start -- --tunnel`
  2. Deberías ver un **código QR**
  3. Si no lo ves, presiona la tecla **`s`** en esa terminal para mostrarlo
  4. Escanea el QR con la app **Expo Go** en tu móvil

### 🌐 **Localhost (Web)**
- **URL**: http://localhost:8081
- **Estado**: ✅ Activo
- **Cómo acceder**:
  - El navegador debería haberse abierto automáticamente
  - Si no, abre manualmente: http://localhost:8081

## 🔧 Comandos Útiles

### Ver el QR Code en la terminal:
```powershell
# En la terminal donde está corriendo Expo, presiona:
s
```

### Reiniciar Expo Go:
```powershell
cd c:\meyscan_build\scanner-apk
npm start -- --tunnel
```

### Reiniciar Web:
```powershell
cd c:\meyscan_build\scanner-apk
npm run web
```

### Ver procesos activos:
```powershell
Get-Process | Where-Object {$_.ProcessName -like "*node*"} | Select-Object ProcessName, Id
```

### Verificar puertos:
```powershell
netstat -ano | findstr ":8081"
```

## ⚠️ Notas Importantes

1. **QR Code**: Si no aparece el QR, presiona `s` en la terminal de Expo
2. **Tunnel**: El modo tunnel puede tardar unos segundos en conectarse
3. **Puerto 8081**: Ambos servicios (Expo Go y Web) comparten el mismo puerto
4. **Reinicio**: Si algo no funciona, detén los procesos (Ctrl+C) y reinicia

## 🐛 Solución de Problemas

### El QR no aparece:
- Presiona `s` en la terminal de Expo
- Verifica que el proceso esté corriendo: `Get-Process node`

### El localhost no carga:
- Verifica que el puerto esté libre: `netstat -ano | findstr ":8081"`
- Reinicia el servidor web: `npm run web`

### Error de conexión en móvil:
- Asegúrate de estar en modo **tunnel** (`--tunnel`)
- Verifica que tu móvil y PC estén en la misma red (o usa tunnel)
- Revisa el firewall de Windows

