import { Router } from "express";
import { store } from "../store.js";
import { requireAuth } from "../auth.js";
import { wrap, requireFields, oneOf, HttpError } from "../util.js";

const router = Router();
router.use(requireAuth);

const STATUSES = ["draft", "sent", "paid"];
const NEXT = { draft: "sent", sent: "paid", paid: "paid" };

router.get("/", (req, res) => res.json(store.listInvoices()));

// Create an invoice. If amount is omitted, bill one month of the client's ACV.
router.post("/", wrap((req, res) => {
  requireFields(req.body, ["client_id"]);
  const client = store.getClient(req.body.client_id);
  if (!client) throw new HttpError(400, "Unknown client_id");
  const amount = req.body.amount !== undefined ? Number(req.body.amount) : client.acv / 12;
  if (!Number.isFinite(amount) || amount < 0) throw new HttpError(400, "amount must be a positive number");
  if (req.body.status) oneOf(req.body.status, STATUSES, "status");
  res.status(201).json(store.createInvoice({ client_id: client.id, amount, status: req.body.status }));
}));

router.patch("/:id", wrap((req, res) => {
  const inv = store.getInvoice(req.params.id);
  if (!inv) throw new HttpError(404, "Invoice not found");
  let status = inv.status;
  if (req.body.advance) status = NEXT[inv.status];
  else if (req.body.status) { oneOf(req.body.status, STATUSES, "status"); status = req.body.status; }
  res.json(store.setInvoiceStatus(inv.id, status));
}));

export default router;
