# 📦 Crear Repositorio Remoto - MeyScan

## Opción 1: GitHub (Recomendado)

### Crear Repo en GitHub:

1. Ve a: https://github.com/new
2. Nombre del repositorio: `meyscan` o `MeyScan`
3. Descripción: "APK Android para escaneo rápido de productos y registro de movimientos de inventario"
4. Público o Privado (según prefieras)
5. **NO** inicializar con README, .gitignore o licencia (ya los tenemos)
6. Click en "Create repository"

### Conectar y Subir:

```bash
# Añadir remote
git remote add origin https://github.com/TU-USUARIO/meyscan.git

# O si usas SSH:
git remote add origin git@github.com:TU-USUARIO/meyscan.git

# Subir código
git branch -M main
git push -u origin main
```

## Opción 2: GitLab

1. Ve a: https://gitlab.com/projects/new
2. Nombre: `meyscan`
3. Crear proyecto
4. Seguir instrucciones para conectar

## Opción 3: Bitbucket

1. Ve a: https://bitbucket.org/repo/create
2. Nombre: `meyscan`
3. Crear repositorio
4. Seguir instrucciones para conectar

## Verificación

Después de subir, verifica que:
- ✅ Todos los archivos están en el remoto
- ✅ No hay errores en el push
- ✅ El README se muestra correctamente

## Nota

Si ya tienes un repositorio remoto configurado, puedes hacer push directamente:
```bash
git push -u origin main
```
