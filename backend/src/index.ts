import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware CORS para permitir peticiones desde el frontend
app.use(cors({ origin: ["http://localhost:5173", "http://127.0.0.1:5173"] }));

// Middleware para parsear JSON
app.use(express.json());

// Servir archivos estáticos desde la carpeta "src"
app.use(express.static(path.join(__dirname)));

// Ruta para servir "home.html" cuando se acceda a "/"
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "home.html"));
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
