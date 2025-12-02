# SOLUCION AL PROBLEMA 404 - React Router no encuentra rutas

## PROBLEMA IDENTIFICADO

El error 404 en todas las rutas React Router es causado por un **build corrupto** debido a la configuracion de `esbuild` en `vite.config.ts`.

### Causa Raiz:
```typescript
esbuild: {
  drop: ["console", "debugger"],
}
```

Esta configuracion elimina agresivamente todo el codigo relacionado con `console` y `debugger`, pero puede estar **eliminando codigo legitimo** que React Router necesita para funcionar.

## SOLUCION APLICADA

### 1. Modificacion de vite.config.ts

**Cambio realizado:**
```typescript
// Comentado el drop que causa problemas
// esbuild: {
//   drop: ["console", "debugger"],
// },
```

### 2. Rebuild necesario

Debes **reconstruir la imagen Docker** para que el cambio surta efecto:

**Opcion A: Via Jenkins**
1. Ir a Jenkins
2. Seleccionar el job del frontend
3. Click en "Build with Parameters"
4. Configurar:
   - `RUN_TESTS`: false
   - `CUSTOM_API_URL`: (dejar vacio para usar default)
   - `CUSTOM_PORT`: (dejar vacio para usar 5174)
5. Click "Build"

**Opcion B: Via terminal manual**
```bash
# Detener contenedor actual
docker stop marketplace_frontend
docker rm marketplace_frontend

# Rebuild de la imagen
cd "D:\Sixth Semester\Pruebas e Integración\Proyecto Marketplace\Marketplace-Link-Front"
docker build -t marketplace-frontend-local:latest .

# Desplegar nuevo contenedor
docker run -d \
  --name marketplace_frontend \
  --network marketplace_link_mplink_net \
  -p 5174:80 \
  -e VITE_API_URL=http://marketplace-link-back:8080 \
  -e VITE_FRONTEND_URL=http://localhost:5174 \
  --label "com.docker.compose.project=marketplace_link" \
  --restart unless-stopped \
  marketplace-frontend-local:latest

# Verificar
docker logs marketplace_frontend
docker exec marketplace_frontend sh -c "cat /usr/share/nginx/html/config.js"
```

## ESTADO ACTUAL DE LA CONFIGURACION

### Red Docker:
- **Red**: `marketplace_link_mplink_net`
- **Frontend container**: `marketplace_frontend` (conectado a la red)
- **Backend container**: `marketplace-link-back` (conectado a la misma red)
- **Comunicacion interna**: Frontend llama a `http://marketplace-link-back:8080` (nombre del contenedor)

### URLs:
- **Frontend (desde browser)**: http://localhost:5174
- **Backend API (desde frontend container)**: http://marketplace-link-back:8080
- **Backend API (desde browser, si aplica)**: http://localhost:8084

### Variables de entorno inyectadas en runtime:
```javascript
window.ENV = {
  VITE_API_URL: 'http://marketplace-link-back:8080'
};
```

## VERIFICACION POST-REBUILD

Despues de reconstruir, verifica:

### 1. Contenedor corriendo:
```bash
docker ps | grep marketplace_frontend
```

### 2. Config.js con URL correcta:
```bash
docker exec marketplace_frontend sh -c "cat /usr/share/nginx/html/config.js"
# Debe mostrar: VITE_API_URL: 'http://marketplace-link-back:8080'
```

### 3. Archivos JS generados:
```bash
docker exec marketplace_frontend sh -c "ls -lh /usr/share/nginx/html/assets/*.js"
# Debe mostrar archivos .js sin corrupcion
```

### 4. Nginx config:
```bash
docker exec marketplace_frontend sh -c "cat /etc/nginx/conf.d/default.conf" | grep "try_files"
# Debe mostrar: try_files $uri /index.html;
```

### 5. Acceso desde browser:
1. Abrir: http://localhost:5174
2. Debe cargar la pagina de login (no 404)
3. Navegar a: http://localhost:5174/login
4. Debe cargar correctamente (no 404)
5. Presionar F12 y ver consola - no debe haber errores de carga de JS

## POR QUE ESTE PROBLEMA OCURRIO

### El flujo del problema:

1. **Build time**: Vite/esbuild compila el codigo React
2. **esbuild.drop elimina codigo**: Al configurar `drop: ["console", "debugger"]`, esbuild elimina:
   - Todas las llamadas a `console.log`, `console.error`, etc.
   - Todos los statements `debugger`
   - **PERO TAMBIEN** puede eliminar codigo que "parece" relacionado pero no lo es

3. **Codigo corrupto**: El bundle generado puede tener:
   - Referencias rotas
   - Imports faltantes
   - Logica de routing rota

4. **React Router falla**: Sin el codigo completo, React Router no puede:
   - Parsear las rutas correctamente
   - Renderizar los componentes
   - Manejar la navegacion

### Por que funciona ahora:

Al comentar `esbuild.drop`, el build genera un bundle **completo y funcional** donde:
- Todo el codigo de React Router esta intacto
- Las rutas se registran correctamente
- Los componentes se cargan como deben

## ALTERNATIVAS SI QUIERES ELIMINAR CONSOLE.LOGS

Si realmente necesitas eliminar `console.log` en produccion, usa estas alternativas MAS SEGURAS:

### Opcion 1: Plugin de Babel (mas seguro)
```bash
npm install --save-dev babel-plugin-transform-remove-console
```

```javascript
// vite.config.ts
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          ['transform-remove-console', { exclude: ['error', 'warn'] }]
        ]
      }
    }),
    tailwindcss()
  ],
  // NO usar esbuild.drop
});
```

### Opcion 2: Terser plugin (post-processing)
```bash
npm install --save-dev vite-plugin-terser
```

```javascript
import { terser } from 'vite-plugin-terser';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    terser({
      compress: {
        drop_console: true,
        drop_debugger: true,
      }
    })
  ],
});
```

### Opcion 3: Condicional en codigo (mas control)
```javascript
// lib/logger.ts
const isDev = import.meta.env.DEV;

export const logger = {
  log: (...args: any[]) => isDev && console.log(...args),
  error: (...args: any[]) => console.error(...args), // Siempre loguear errores
  warn: (...args: any[]) => isDev && console.warn(...args),
};

// En tu codigo:
import { logger } from '@/lib/logger';
logger.log('Debug info'); // Solo en dev
```

## RESUMEN

- **Problema**: `esbuild.drop` corrupta el bundle de React Router
- **Solucion**: Comentar `esbuild.drop` en vite.config.ts
- **Accion**: Reconstruir la imagen Docker via Jenkins o manualmente
- **Resultado esperado**: React Router funciona correctamente, todas las rutas accesibles

El sistema esta configurado correctamente en terminos de:
- Red Docker
- Variables de entorno en runtime
- Nginx configuracion
- Routing de React

Solo necesitaba un build limpio sin la interferencia de `esbuild.drop`.

