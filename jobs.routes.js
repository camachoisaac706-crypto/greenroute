import { Router } from "express";
import { store } from "../store.js";
import { requireAuth } from "../auth.js";
import { wrap, oneOf, HttpError } from "../util.js";

const router = Router();
router.use(requireAuth);

const STATUSES = ["active", "idle", "maintenance"];

router.get("/", (req, res) => res.json(store.listEquipment()));

// {service:true} logs a service (hours->0, status->active); or set status/hours.
router.patch("/:id", wrap((req, res) => {
  const e = store.getEquipment(req.params.id);
  if (!e) throw new HttpError(404, "Equipment not found");
  let hours, status;
  if (req.body.service) { hours = 0; status = "active"; }
  if (req.body.hours !== undefined) hours = Math.max(0, Math.round(Number(req.body.hours)));
  if (req.body.status) { oneOf(req.body.status, STATUSES, "status"); status = req.body.status; }
  res.json(store.updateEquipment(e.id, { hours, status }));
}));

export default router;
