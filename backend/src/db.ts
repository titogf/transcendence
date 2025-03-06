import sqlite3 from "sqlite3";

const db = new sqlite3.Database("./src/database.db", (err) => {
  if (err) console.error("❌ Error al conectar con SQLite:", err);
  else console.log("✅ Base de datos conectada");
});

// Crear la tabla de usuarios si no existe
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    )
  `);
});

export default db;
