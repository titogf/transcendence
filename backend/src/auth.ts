import express from 'express';
import { Express, Request, Response, Router} from 'express';
import bcrypt from "bcryptjs";
import db from "./db";

const router: Router = Router(); // ✅ Asegurar que esto está presente

interface UserRequestBody {
  username: string;
  password: string;
}

router.post("/register", (req: Request<{}, {}, UserRequestBody>, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ error: "Faltan datos" });
    return;
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  db.run(
    `INSERT INTO users (username, password) VALUES (?, ?)`,
    [username, hashedPassword],
    (err) => {
      if (err) {
        res.status(500).json({ error: "Usuario ya existe o error en el registro" });
        return;
      }
      res.json({ message: "Usuario registrado correctamente" });
    }
  );
});

router.post("/login", (req: express.Request<{}, {}, UserRequestBody>, res: express.Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ error: "Faltan datos" });
    return;
  }

  db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, user: any) => {
    if (err || !user) {
      return res.status(401).json({ error: "Usuario no encontrado" });
    }

    const isValid = bcrypt.compareSync(password, user.password);
    if (!isValid) {
      res.status(401).json({ error: "Contraseña incorrecta" });
      return;
    }
    
    res.json({
      username: user.username,
      password: user.password
    });    
    
  });
});

export default router;
