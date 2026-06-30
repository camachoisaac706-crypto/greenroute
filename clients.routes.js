import { Router } from "express";
import { store } from "../store.js";
import { requireAuth } from "../auth.js";

const router = Router();
router.use(requireAuth);

// Company-level targets for the $10M plan (the steady-state business).
const COMPANY = {
  arr: 10000000,
  properties: 600,
  gross_margin: 0.8,
  rule_of_40: 43,
  net_retention: 1.15,
  yoy_growth: 0.35,
};

const MRR = [612, 638, 651, 670, 688, 705, 724, 740, 758, 779, 801, 833];
const MONTHS = ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun"];

router.get("/overview", (req, res) => {
  res.json({
    company: COMPANY,
    mrr: { months: MONTHS, values: MRR, unit: "thousands" },
    today: store.counts(),
  });
});

export default router;
