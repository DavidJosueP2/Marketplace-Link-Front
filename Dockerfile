# Etapa 1: Compilación con Node
FROM node:20.19-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./

# Instalar dependencias con reintentos y mayor timeout
RUN npm ci --include=dev --maxsockets=5 --fetch-timeout=60000 || \
    npm ci --include=dev --maxsockets=5 --fetch-timeout=60000 || \
    npm ci --include=dev --maxsockets=5 --fetch-timeout=60000

ARG VITE_API_URL
ARG VITE_FRONTEND_URL
ARG VITE_AZURE_STORAGE_URL
ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_FRONTEND_URL=${VITE_FRONTEND_URL}
ENV VITE_AZURE_STORAGE_URL=${VITE_AZURE_STORAGE_URL}

COPY . .

RUN npm run build

# Etapa 2: Servir con Nginx
FROM nginx:1.27-alpine

RUN rm -rf /usr/share/nginx/html/*

COPY --from=build /app/dist /usr/share/nginx/html

COPY ./nginx.config /etc/nginx/conf.d/default.conf

# Copiar el entrypoint script para configuración en runtime
COPY ./docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 80

ENTRYPOINT ["/docker-entrypoint.sh"]
