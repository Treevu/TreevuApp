# TreeVu Frontend - Docker Setup

Dockerfile simple para desarrollo del frontend React + Vite.

## 🚀 Uso Rápido

### Con Docker Compose (Recomendado):
```bash
# Ejecutar en desarrollo
docker-compose up

# Ejecutar en segundo plano
docker-compose up -d

# Reconstruir y ejecutar
docker-compose up --build

# Detener servicios
docker-compose down
```

### Comandos Docker tradicionales:
```bash
# Construir la imagen
docker build -t treevu-frontend .

# Ejecutar el contenedor
docker run -p 3000:3000 -v $(pwd):/app -v /app/node_modules treevu-frontend

# Con variables de entorno
docker run -p 3000:3000 -v $(pwd):/app -v /app/node_modules --env-file .env treevu-frontend
```

## 🔧 Características

- ✅ **Hot reload** habilitado
- ✅ **Volúmenes montados** para desarrollo en tiempo real
- ✅ **Variables de entorno** soportadas
- ✅ **Puerto 3000** expuesto
- ✅ **Node.js 18 Alpine** (imagen ligera)

## 📁 Estructura

- `Dockerfile` - Imagen simple para desarrollo
- `docker-compose.yml` - Orquestación del servicio frontend
- `.dockerignore` - Archivos excluidos del contexto Docker

## 🌐 Acceso

Una vez ejecutado, la aplicación estará disponible en:
- **Frontend:** http://localhost:3000

## 💡 Notas

- El contenedor usa volúmenes para sincronizar cambios en tiempo real
- Asegúrate de tener tu archivo `.env` configurado con las variables necesarias
- Para producción, considera usar un build multi-stage con Nginx