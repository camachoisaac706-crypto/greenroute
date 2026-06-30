import "dotenv/config";
import express from "express";
import cors from "cors";

import "./store.js"; // initialise the data store on boot
import authRoutes from "./routes/auth.routes.js";
import clientRoutes from "./routes/clients.routes.js";
import crewRoutes from "./routes/crews.routes.js";
import jobRoutes from "./routes/jobs.routes.js";
import equipmentRoutes from "./routes/equipment.routes.js";
import invoiceRoutes from "./routes/invoices.routes.js";
import routeRoutes from "./routes/routes.routes.js";
import metricRoutes from "./routes/metrics.routes.js";

const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ ok: true, service: "greenroute-api", time: new Date().toISOString() }));

app.use("/api/auth", authRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/crews", crewRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/equipment", equipmentRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/routes", routeRoutes);
app.use("/api/metrics", metricRoutes);

// 404
app.use((req, res) => res.status(404).json({ error: `Not found: ${req.method} ${req.path}` }));

// central error handler
app.use((err, req, res, _next) => {
  const status = err.status || 500;
  if (status >= 500) console.error(err);
  res.status(status).json({ error: err.message || "Internal server error" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`GreenRoute API listening on http://localhost:${PORT}`));

export default app;
