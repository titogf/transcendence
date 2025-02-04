const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');

const app = express();

// Servir archivos estáticos desde "public"
app.use(express.static(path.join(__dirname, 'public')));

// Ruta para home.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

// Cargar los certificados SSL
const options = {
    key: fs.readFileSync(path.join(__dirname, 'certs', 'server.key')),
    cert: fs.readFileSync(path.join(__dirname, 'certs', 'server.cert'))
};

// Iniciar el servidor HTTPS en el puerto 3000
https.createServer(options, app).listen(8000, '0.0.0.0', () => {
    console.log('Servidor HTTPS corriendo en https://0.0.0.0:8000');
});
