import { Router } from "express";
import { store } from "../store.js";
import { signToken, hashPassword, comparePassword, requireAuth } from "../auth.js";
import { wrap, requireFields, HttpError } from "../util.js";

const router = Router();

router.post("/register", wrap((req, res) => {
  requireFields(req.body, ["email", "password", "name"]);
  const { email, password, name } = req.body;
  if (store.getUserByEmail(email)) throw new HttpError(409, "Email already registered");
  const u = store.createUser({ email, password_hash: hashPassword(password), name });
  const user = { id: u.id, email: u.email, name: u.name };
  res.status(201).json({ token: signToken(user), user });
}));

router.post("/login", wrap((req, res) => {
  requireFields(req.body, ["email", "password"]);
  const row = store.getUserByEmail(req.body.email);
  if (!row || !comparePassword(req.body.password, row.password_hash)) {
    throw new HttpError(401, "Invalid email or password");
  }
  const user = { id: row.id, email: row.email, name: row.name };
  res.json({ token: signToken(user), user });
}));

router.get("/me", requireAuth, (req, res) => res.json({ user: req.user }));

export default router;
