const sqlite3 = require("sqlite3");

// Conexión a la base de datos
const db = new sqlite3.Database("./database.db", (err) => {
  if (err) {
    console.error("❌ Error al conectar con SQLite:", err);
  } else {
    console.log("✅ Base de datos conectada");
  }
});

// Crear las tablas si no existen
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      avatar INTEGER DEFAULT 0,
      wins INTEGER DEFAULT 0,
      losses INTEGER DEFAULT 0,
      goals_scored INTEGER DEFAULT 0,
      goals_conceded INTEGER DEFAULT 0,
      matches_played INTEGER DEFAULT 0
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS matches (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      date TEXT,
      opponent TEXT,
      goals_scored INTEGER,
      goals_conceded INTEGER,
      result TEXT,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )
  `);
});

module.exports = db;
