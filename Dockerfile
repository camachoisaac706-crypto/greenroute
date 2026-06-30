import { Router } from "express";
import { store } from "../store.js";
import { requireAuth } from "../auth.js";
import { wrap, HttpError } from "../util.js";
import { nearestNeighbor, routeMiles, driveMinutes } from "../optimize.js";

const router = Router();
router.use(requireAuth);

function payload(crewId) {
  const stops = store.getStops(crewId);
  return { crew_id: crewId, stops, miles: routeMiles(stops), drive_minutes: driveMinutes(stops) };
}

router.get("/:crewId", wrap((req, res) => {
  if (!store.getCrew(req.params.crewId)) throw new HttpError(404, "Crew not found");
  res.json(payload(req.params.crewId));
}));

// Reorder stops by nearest-neighbor from the depot, persist new order.
router.post("/:crewId/optimize", wrap((req, res) => {
  if (!store.getCrew(req.params.crewId)) throw new HttpError(404, "Crew not found");
  const before = store.getStops(req.params.crewId);
  const ordered = nearestNeighbor(before);
  store.setStopOrder(req.params.crewId, ordered.map((s) => s.id));
  res.json({
    ...payload(req.params.crewId),
    miles_before: routeMiles(before),
    miles_saved: +(routeMiles(before) - routeMiles(ordered)).toFixed(2),
  });
}));

export default router;
