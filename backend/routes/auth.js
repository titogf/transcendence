const bcrypt = require("bcryptjs");
const util = require("util");
const db = require("../db");
const { OAuth2Client } = require("google-auth-library");
const googleClient = new OAuth2Client("125487297400-n3bg28smb3i77ra2lroqco76vc6s964u.apps.googleusercontent.com");

const dbGet = util.promisify(db.get).bind(db);
const dbRun = util.promisify(db.run).bind(db);
const dbAll = util.promisify(db.all).bind(db);

async function authRoutes(fastify, options) {
  // Registro
  fastify.post("/register", async (request, reply) => {
    const { name, email, username, password } = request.body;

    if (!name || !email || !username || !password) {
      return reply.code(400).send({ error: "Faltan datos" });
    }

    try {
      const existingUser = await dbGet(
        `SELECT * FROM users WHERE email = ? OR username = ?`,
        [email, username]
      );

      if (username == 'IA') {
        return reply.code(400).send({ error: "Invalid username" });
      }
      if (existingUser) {
        return reply.code(400).send({ error: "Email o usuario ya existe" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      await dbRun(
        `INSERT INTO users (name, email, username, password) VALUES (?, ?, ?, ?)`,
        [name, email, username, hashedPassword]
      );

      return reply.send({ message: "Usuario registrado correctamente" });
    } catch (err) {
      console.error("Error en /register:", err);
      return reply.code(500).send({ error: "Error interno del servidor" });
    }
  });

  // Login
  fastify.post("/login", async (request, reply) => {
    const { username, password } = request.body;

    if (!username || !password) {
      return reply.code(400).send({ error: "Faltan datos" });
    }

    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(username);
    const query = isEmail
      ? `SELECT * FROM users WHERE email = ?`
      : `SELECT * FROM users WHERE username = ?`;

    try {
      const user = await dbGet(query, [username]);

      if (!user) {
        return reply.code(401).send({ error: "Usuario no encontrado" });
      }

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return reply.code(401).send({ error: "Contraseña incorrecta" });
      }

      return reply.send({
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
        wins: user.wins,
        losses: user.losses,
        goals_scored: user.goals_scored,
        goals_conceded: user.goals_conceded,
        matches_played: user.matches_played,
      });
    } catch (err) {
      console.error("Error en login:", err);
      return reply.code(500).send({ error: "Error de base de datos" });
    }
  });

  // Obtener datos de usuario
  fastify.get("/user/:username", async (request, reply) => {
    const { username } = request.params;

    try {
      const user = await dbGet(
        `SELECT * FROM users WHERE username = ?`,
        [username]
      );

      if (!user) {
        return reply.code(404).send({ error: "Usuario no encontrado" });
      }

      return reply.send(user);
    } catch (err) {
      console.error("Error en /user/:username:", err);
      return reply.code(500).send({ error: "Error interno del servidor" });
    }
  });

  fastify.get("/user-info/:username", async (request, reply) => {
    const { username } = request.params;

    try {
      const user = await dbGet(
        `SELECT id, name, email, username, avatar, wins, losses, goals_scored, goals_conceded, matches_played
         FROM users WHERE username = ?`,
        [username]
      );

      if (!user) {
        return reply.code(404).send({ error: "Usuario no encontrado" });
      }

      return reply.send(user);
    } catch (err) {
      console.error("Error en /user-info/:username:", err);
      return reply.code(500).send({ error: "Error interno del servidor" });
    }
  });

  // Validar usuario
  fastify.post("/validate-user", async (request, reply) => {
    const { username, password } = request.body;

    if (!username || !password) {
      return reply.code(400).send({ error: "Faltan datos" });
    }

    try {
      const user = await dbGet(
        `SELECT * FROM users WHERE username = ?`,
        [username]
      );

      if (!user) {
        return reply.code(404).send({ error: "Usuario no encontrado" });
      }

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return reply.code(401).send({ error: "Contraseña incorrecta" });
      }

      return reply.send({ success: true });
    } catch (err) {
      console.error("Error en /validate-user:", err);
      return reply.code(500).send({ error: "Error interno del servidor" });
    }
  });

  // ✅ Obtener historial de partidas de un usuario (usando await dbAll)
  fastify.get("/user-matches/:username", async (request, reply) => {
    const { username } = request.params;

    try {
      const user = await dbGet(
        `SELECT id FROM users WHERE username = ?`,
        [username]
      );

      if (!user) {
        return reply.code(404).send({ error: "Usuario no encontrado" });
      }

      const matches = await dbAll(
        `SELECT * FROM matches WHERE user_id = ? ORDER BY date DESC`,
        [user.id]
      );

      return reply.send(matches);
    } catch (err) {
      console.error("Error en /user-matches/:username:", err);
      return reply.code(500).send({ error: "Error interno del servidor" });
    }
  });

  // Registrar resultado de partida
  fastify.post("/match-result", async (request, reply) => {
    const { winner, loser, winner_goals, loser_goals } = request.body;

    if (!winner || !loser) {
      return reply.code(400).send({ error: "Faltan datos" });
    }

    try {
      if (winner != 'IA'){
        await dbRun(
          `UPDATE users SET 
            wins = wins + 1,
            goals_scored = goals_scored + ?,
            goals_conceded = goals_conceded + ?,
            matches_played = matches_played + 1
          WHERE username = ?`,
          [winner_goals, loser_goals, winner]
        );
      }

      if (loser != 'IA'){
        await dbRun(
          `UPDATE users SET 
            losses = losses + 1,
            goals_scored = goals_scored + ?,
            goals_conceded = goals_conceded + ?,
            matches_played = matches_played + 1
          WHERE username = ?`,
          [loser_goals, winner_goals, loser]
        );
      }

      const winnerRow = await dbGet(
        `SELECT id FROM users WHERE username = ?`,
        [winner]
      );
      const loserRow = await dbGet(
        `SELECT id FROM users WHERE username = ?`,
        [loser]
      );

      const date = new Date().toISOString();

      if (winnerRow) {
        await dbRun(
          `INSERT INTO matches (user_id, date, opponent, goals_scored, goals_conceded, result)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [winnerRow.id, date, loser, winner_goals, loser_goals, "win"]
        );
      }

      if (loserRow) {
        await dbRun(
          `INSERT INTO matches (user_id, date, opponent, goals_scored, goals_conceded, result)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [loserRow.id, date, winner, loser_goals, winner_goals, "loss"]
        );
      }

      return reply.send({ message: "Partida actualizada correctamente" });
    } catch (err) {
      console.error("Error en /match-result:", err);
      return reply.code(500).send({ error: "Error interno del servidor" });
    }
  });

  fastify.post("/google", async (request, reply) => {
    const { token } = request.body;

    if (!token) {
      return reply.code(400).send({ error: "Token no proporcionado" });
    }

    try {
      const ticket = await googleClient.verifyIdToken({
        idToken: token,
        audience: "125487297400-n3bg28smb3i77ra2lroqco76vc6s964u.apps.googleusercontent.com",
      });
  
      const payload = ticket.getPayload();
      const email = payload?.email;
      const name = payload?.name;
  
      // Verifica si el usuario existe
      let user = await dbGet("SELECT * FROM users WHERE email = ?", [email]);
  
      if (!user) {
        // Crear usuario si no existe (puedes adaptar los campos)
        await dbRun(
          `INSERT INTO users (name, email, username, password) VALUES (?, ?, ?, ?)`,
          [name, email, email.split("@")[0], ""]  // sin contraseña
        );
        user = await dbGet("SELECT * FROM users WHERE email = ?", [email]);
      }
  
      return reply.send({
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
        wins: user.wins,
        losses: user.losses,
        goals_scored: user.goals_scored,
        goals_conceded: user.goals_conceded,
        matches_played: user.matches_played,
      });
    } catch (err) {
      console.error("Error en /auth/google:", err);
      return reply.code(401).send({ error: "Token inválido" });
    }
  });

  fastify.post("/update-profile", async (request, reply) => {
    const { currentUsername, newAvatar, newUsername, newEmail, newPassword } = request.body;

    try {
      const user = await dbGet("SELECT * FROM users WHERE username = ?", [currentUsername]);
      if (!user) {
        return reply.code(404).send({ error: "Usuario no encontrado" });
      }

      const updatedAvatar = newAvatar || user.avatar;
      const updatedUsername = newUsername || user.username;
      const updatedEmail = newEmail || user.email;
      const updatedPassword = newPassword
        ? await bcrypt.hash(newPassword, 10)
        : user.password;

      await dbRun(
        `UPDATE users SET avatar = ?, username = ?, email = ?, password = ? WHERE username = ?`,
        [updatedAvatar, updatedUsername, updatedEmail, updatedPassword, currentUsername]
      );

      return reply.send({ success: true });
    } catch (err) {
      console.error("Error en /update-profile:", err);
      return reply.code(500).send({ error: "Error al actualizar perfil" });
    }
  });

  // Eliminar cuenta de usuario
  fastify.post("/delete-account", async (request, reply) => {
    const { username } = request.body;

    if (!username) {
      return reply.code(400).send({ error: "Missing username" });
    }
    try {
      await dbRun(`DELETE FROM matches WHERE user_id = (SELECT id FROM users WHERE username = ?)`, [username]);
      await dbRun(`DELETE FROM users WHERE username = ?`, [username]);

      return reply.send({ success: true, message: "Account deleted successfully" });
    } catch (err) {
      console.error("Error in /delete-account:", err);
      return reply.code(500).send({ error: "Internal server error" });
    }
  });

}

module.exports = authRoutes;
