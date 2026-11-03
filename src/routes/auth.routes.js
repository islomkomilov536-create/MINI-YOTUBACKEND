import { Router } from "express";
import bcrypt from "bcrypt";
import { query } from "../db.js";
import { validate } from "../middleware/validate.js";
import { registerSchema, LoginSchema } from "../validators/schema.js";
import { sendMail } from "../utils/mailer.js";
import { generateToken } from "../utils/jwt.js";

const Authrouter = Router();

// ---------- register ----------
Authrouter.post("/register", validate(registerSchema), async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const exists = await query("SELECT id FROM users WHERE email = $1", [email]);
    if (exists.rows.length > 0) {
      return res.status(409).json({ message: "Bu email allaqachon ro'yxatdan o'tgan" });
    }

    const hash = await bcrypt.hash(password, 10);
    const result = await query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email",
      [name, email, hash]
    );
    const user = result.rows[0];

   
    await sendMail(
  user.email,
  "MiniTube'ga xush kelibsiz",
  `<h2>Salom, ${user.name}!</h2>
   <p>MiniTube platformasiga xush kelibsiz!</p>`
);

    res.status(201).json({ user, token: generateToken(user) });
  } catch (err) {
    next(err);
  }
});

// ---------- login ----------
Authrouter.post("/login", validate(LoginSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const result = await query("SELECT * FROM users WHERE email = $1", [email]);
    const found = result.rows[0];

    const ok = found && (await bcrypt.compare(password, found.password));
    if (!ok) {
      return res.status(401).json({ message: "Email yoki parol noto'g'ri" });
    }

    const user = { id: found.id, name: found.name, email: found.email };
    res.status(200).json({ user, token: generateToken(user) });
  } catch (err) {
    next(err);
  }
});

export default Authrouter

