# Dockerfile para MineChamp Wake-on-Connect Proxy
# Imagen ultra ligera para minimizar costos

FROM node:20-alpine

WORKDIR /app

# Copiar archivos del proyecto
COPY package.json .
COPY proxy.js .

# Instalar dependencias
RUN npm install --production

# Puerto del proxy
EXPOSE 25565

# Variables de entorno por defecto
ENV PROXY_PORT=25565 \
    MC_SERVER_HOST=minecraft-server \
    MC_SERVER_PORT=25565 \
    COOLDOWN_MINUTES=2

# Comando de inicio
CMD ["node", "proxy.js"]
