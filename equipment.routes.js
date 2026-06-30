import { Router } from "express";
import { store } from "../store.js";
import { requireAuth } from "../auth.js";

const router = Router();
router.use(requireAuth);

router.get("/", (req, res) => res.json(store.listCrews()));

export default router;
