# Etapa 1: Compilación con Node
FROM node:20.17-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci --include=dev

ARG VITE_API_URL
ARG VITE_FRONTEND_URL
ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_FRONTEND_URL=${VITE_FRONTEND_URL}

COPY . .

RUN npm run build

# Etapa 2: Servir con Nginx
FROM nginx:1.27-alpine

RUN rm -rf /usr/share/nginx/html/*

COPY --from=build /app/dist /usr/share/nginx/html

COPY ./nginx.config /etc/nginx/conf.d/default.conf

# Copiar el entrypoint script
COPY ./docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 80

ENTRYPOINT ["/docker-entrypoint.sh"]
