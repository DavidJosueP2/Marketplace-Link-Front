# Marketplace Link — Frontend

Cliente web de **Marketplace Link**, un marketplace geolocalizado donde los
usuarios publican productos y servicios, los exploran en un mapa, los marcan como
favoritos y participan en un flujo de moderación (reportes, incidencias y
apelaciones).

Este repositorio contiene **únicamente el frontend**. La API está en el
repositorio [`Marketplace_Link`](../Marketplace_Link).

## ¿Qué problema resuelve?

Ofrece la interfaz para descubrir publicaciones cercanas en un mapa, gestionar
las propias publicaciones, autenticarse por roles (comprador, vendedor,
moderador, administrador) y operar el flujo de moderación del marketplace.

## Tecnologías

- **React 19** + **TypeScript**
- **Vite 7** (build y dev server)
- **Tailwind CSS 4** + **Radix UI / shadcn**
- **React Router 7**, **TanStack Query** y **TanStack Table**
- **Axios** (cliente HTTP), **Leaflet** (mapas)
- **Vitest** (unit) + **Playwright** (E2E)
- Servido en producción con **Nginx** (imagen Docker multi-stage)

## Roles del sistema

- **Comprador** — explora publicaciones, marca favoritos, reporta.
- **Vendedor** — crea y gestiona sus publicaciones, apela decisiones.
- **Moderador** — revisa incidencias y reportes, resuelve y modera.
- **Administrador** — gestión global.

## Estructura del proyecto

```
src/
├── assets/        # Imágenes y recursos estáticos
├── auth/          # Lógica de autenticación (contexto, guards)
├── components/    # Componentes (common, marketplace, modals, ui, users)
├── config/        # Configuración de entorno (env.ts)
├── context/       # React Contexts globales
├── data/          # Datos mock para desarrollo/UI
├── hooks/         # Custom hooks (marketplace, users)
├── layouts/       # Layouts de página
├── lib/           # Utilidades (imageUtils, etc.)
├── pages/         # Páginas (auth, marketplace, profile)
├── routes/        # Definición de rutas
├── services/      # Clientes de la API REST por dominio
├── styles/        # Estilos globales
└── types/         # Tipos TypeScript compartidos
```

## Variables de entorno

Copia `.env.example` a `.env` y ajústalo:

| Variable | Descripción |
|---|---|
| `VITE_API_URL` | URL base del backend (p. ej. `http://localhost:8080` o `https://midominio.com/api`) |
| `VITE_FRONTEND_URL` | URL pública del propio frontend |
| `FRONT_PORT` | Puerto publicado del contenedor (Docker) |
| `VITE_MAX_FILE_SIZE` | Tamaño máximo de archivo en subidas (bytes) |
| `VITE_MAX_FILES` | Número máximo de archivos por subida |
| `VITE_NODE_ENV` | Entorno (`development` / `production`) |

> El valor de `VITE_API_URL` se inyecta en build, pero también puede
> sobreescribirse en **runtime** mediante `/config.js` (lo genera
> `docker-entrypoint.sh`), sin necesidad de reconstruir la imagen.

## Ejecución en local

### Requisitos
- Node.js 20+ (probado con Node 22)
- El backend corriendo (ver su README)

```bash
cp .env.example .env        # ajusta VITE_API_URL al backend
npm ci
npm run dev                 # http://localhost:5174
```

### Scripts útiles

```bash
npm run dev          # servidor de desarrollo
npm run build        # build de producción (genera dist/)
npm run preview      # previsualiza el build
npm run lint         # ESLint
npm run typecheck    # comprobación de tipos
npm run test         # tests unitarios (Vitest)
npm run test:e2e     # tests E2E (Playwright)
```

## Ejecución con Docker

El frontend se compila y se sirve con Nginx. Se conecta a la red `back_mplink_net`
creada por el compose del backend, por lo que **debes levantar antes el backend**.

```bash
cp .env.example .env        # ajusta VITE_API_URL, VITE_FRONTEND_URL, FRONT_PORT
docker compose up -d --build
```

- Frontend disponible en `http://localhost:${FRONT_PORT}` (5174 por defecto).

### Comandos útiles (Docker)

```bash
docker compose ps
docker compose logs -f marketplace_frontend
docker compose restart marketplace_frontend
docker compose down
```

## Despliegue en VPS

El despliegue conjunto (backend + base de datos + frontend + Nginx + HTTPS) se
documenta en el repositorio del backend:
[`Marketplace_Link/docs/deployment-vps.md`](../Marketplace_Link/docs/deployment-vps.md).

## Nginx (contenedor del frontend)

La imagen incluye `nginx.config`, que:
- Sirve los archivos estáticos del build con cache de assets.
- Resuelve el routing de la SPA (todas las rutas → `index.html`).
- Expone `/health` para healthchecks.

En producción, este contenedor se sitúa **detrás** de un Nginx reverse proxy del
host que termina TLS y enruta `/` al frontend y `/api/` al backend.

## Estado actual

Funcional: autenticación por roles, exploración de publicaciones en mapa,
favoritos, gestión de publicaciones propias y flujo de moderación.

> **Imágenes:** el backend ya no persiste binarios de imágenes (ver su README).
> Las imágenes nuevas no quedarán accesibles; la UI muestra la referencia o un
> placeholder. Es una limitación conocida del despliegue actual.

## Mejoras futuras recomendadas

- Code-splitting adicional: el chunk principal supera los 500 kB.
- Migrar los servicios aún en `.js` (`authService.js`, `passwordService.js`) a
  TypeScript para unificar la base de código.
