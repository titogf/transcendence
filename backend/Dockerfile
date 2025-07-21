# backend/Dockerfile
FROM node:18

WORKDIR /app

RUN apt-get update && \
    apt-get install -y build-essential python3 make g++ sqlite3

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
