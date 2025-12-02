# Etapa 1: Compilación con Node
FROM node:20.17-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci --include=dev

COPY . .

RUN npm run build

# Etapa 2: Servir con Nginx
FROM nginx:1.27-alpine

RUN rm -rf /usr/share/nginx/html/*

COPY --from=build /app/dist /usr/share/nginx/html

COPY ./nginx.config /etc/nginx/conf.d/default.conf

# Copiar el entrypoint para configuración en runtime
COPY ./docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 80

# Usar el entrypoint para reemplazar variables antes de iniciar nginx
ENTRYPOINT ["/docker-entrypoint.sh"]
