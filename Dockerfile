# Dockerfile simple para el frontend TreeVu (React + Vite)
FROM node:lts-alpine

# install simple http server for serving static content
RUN apk update
RUN apk add git

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
COPY package-lock.json ./

# Instalar dependencias
RUN npm install
RUN npm install vite -g

# Copiar código fuente
COPY . .

# Exponer puerto de desarrollo
EXPOSE 3000

# Comando para desarrollo (con hot reload)
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]