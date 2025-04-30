import https from "https";
import fs from "fs";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import authRoutes from "./auth";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: ["http://localhost:5173", "http://127.0.0.1:5173", "http://10.12.15.1:5173"], credentials: true}));
app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.use("/auth", authRoutes);

const httpsOptions = {
  key: fs.readFileSync("certs/key.pem"),
  cert: fs.readFileSync("certs/cert.pem"),
};

// app.listen(PORT, () => {
//   console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
// });

https.createServer(httpsOptions, app).listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en https://localhost:${PORT}`);
});