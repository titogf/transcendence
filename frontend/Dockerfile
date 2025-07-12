FROM node:18

WORKDIR /app

# Copia package.json y package-lock.json
COPY package*.json ./

# Instala dependencias
RUN npm install

# Copia todo el frontend
COPY . .

# Compila TS + TailwindCSS
RUN npm run build

# Expone el puerto que uses en server.js
EXPOSE 5173

# Lanza el servidor
CMD ["node", "server.js"]
