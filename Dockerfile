# syntax=docker/dockerfile:1
# CUP FICCT — Frontend (Vite + React) para Railway.

# --- Etapa 1: build estático ---
FROM node:20-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# URL del API: se inyecta en build (Vite la "hornea" en el bundle).
# En Railway define la variable VITE_API_URL en el servicio del frontend.
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}
RUN npm run build

# --- Etapa 2: servidor estático (nginx) ---
FROM nginx:alpine

# Plantilla con el puerto dinámico de Railway ($PORT) y fallback SPA.
COPY docker/default.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html

ENV PORT=8080
EXPOSE 8080
# El entrypoint oficial de nginx procesa las plantillas (envsubst) y arranca.
