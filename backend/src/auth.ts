import express from "express";
import { Request, Response, Router } from "express";
import bcrypt from "bcryptjs";
import db from "./db";

const router: Router = Router();

interface UserRequestBody {
  name: string;
  email: string;
  username: string;
  password: string;
}

router.post("/register", (req: Request<{}, {}, UserRequestBody>, res: Response) => {
  const { name, email, username, password } = req.body;

  if (!name || !email || !username || !password) {
    res.status(400).json({ error: "Faltan datos" });
    return ;
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  db.get(`SELECT * FROM users WHERE email = ? OR username = ?`, [email, username], (err, user) => {
    if (err) {
      res.status(500).json({ error: "Internal error, try again later" });
      return ;
    }

    if (user) {
      res.status(400).json({ error: "Email or username already in use" });
      return ;
    }

    db.run(
      `INSERT INTO users (name, email, username, password) VALUES (?, ?, ?, ?)`,
      [name, email, username, hashedPassword],
      (insertErr) => {
        if (insertErr) {
          res.status(500).json({ error: "Error al registrar usuario" });
          return ;
        }
        res.json({ message: "Usuario registrado correctamente" });
        return ;
      }
    );
  });
});

router.post("/login", (req: Request<{}, {}, { username: string; password: string }>, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ error: "Faltan datos" });
    return ;
  }

  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(username);
  const query = isEmail ? `SELECT * FROM users WHERE email = ?` : `SELECT * FROM users WHERE username = ?`;

  db.get(query, [username], (err, user: any) => {
    if (err || !user) {
      res.status(401).json({ error: "Usuario no encontrado" });
      return ;
    }

    const isValid = bcrypt.compareSync(password, user.password);
    if (!isValid) {
      res.status(401).json({ error: "Contraseña incorrecta" });
      return ;
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      username: user.username,
    });
  });
});


export default router;
