import { store } from "./store.js";
import { hashPassword } from "./auth.js";

const CREWS = [
  { id: "A", name: "Crew A", lead: "Marcus Hale", color: "#13503B" },
  { id: "B", name: "Crew B", lead: "Dana Ortiz", color: "#DD8E2C" },
  { id: "C", name: "Crew C", lead: "Priya Nair", color: "#6E8B5E" },
];

const CLIENTS = [
  { name: "Cedar Ridge HOA", tier: "Enterprise", acv: 50000 },
  { name: "Lakemont Business Center", tier: "Enterprise", acv: 50000 },
  { name: "Brightleaf Office Park", tier: "Mid-market", acv: 15000 },
  { name: "Magnolia Town Center", tier: "Mid-market", acv: 15000 },
  { name: "Harborview Apartments", tier: "Mid-market", acv: 15000 },
  { name: "Willow Creek Schools", tier: "Mid-market", acv: 15000 },
  { name: "Stonebrook Estates", tier: "Starter", acv: 5000 },
];

const JOBS = [
  { client: "Cedar Ridge HOA", crew: "A", service: "Mow & edge", status: "done" },
  { client: "Lakemont Business Center", crew: "A", service: "Fertilization", status: "in_progress" },
  { client: "Brightleaf Office Park", crew: "B", service: "Hedge trimming", status: "scheduled" },
  { client: "Magnolia Town Center", crew: "B", service: "Mow & edge", status: "scheduled" },
  { client: "Harborview Apartments", crew: "C", service: "Irrigation check", status: "in_progress" },
  { client: "Willow Creek Schools", crew: "C", service: "Mow & edge", status: "scheduled" },
];

const EQUIPMENT = [
  { name: "Z-Trak Mower 01", type: "Zero-turn mower", crew_id: "A", hours: 412, service_at: 500, status: "active" },
  { name: "Z-Trak Mower 02", type: "Zero-turn mower", crew_id: "B", hours: 488, service_at: 500, status: "active" },
  { name: "Walk-behind 09", type: "Walk-behind mower", crew_id: "C", hours: 233, service_at: 400, status: "active" },
  { name: "F-250 + Trailer", type: "Hauling rig", crew_id: "A", hours: 1820, service_at: 2000, status: "active" },
  { name: "Aerator 03", type: "Tow-behind aerator", crew_id: "B", hours: 511, service_at: 500, status: "maintenance" },
  { name: "Blower Pack 12", type: "Backpack blower", crew_id: "C", hours: 96, service_at: 300, status: "idle" },
];

const INVOICES = [
  { client: "Cedar Ridge HOA", amount: 4166, status: "paid" },
  { client: "Lakemont Business Center", amount: 4166, status: "sent" },
  { client: "Brightleaf Office Park", amount: 1250, status: "sent" },
  { client: "Harborview Apartments", amount: 1250, status: "draft" },
];

const ROUTES = {
  A: [
    { name: "Yard / Depot", x: 12, y: 86 },
    { name: "Cedar Ridge HOA", x: 30, y: 24 },
    { name: "Lakemont Business Center", x: 72, y: 18 },
    { name: "Oakmont Plaza", x: 86, y: 54 },
    { name: "Riverside Condos", x: 58, y: 70 },
    { name: "Hillcrest Library", x: 40, y: 58 },
  ],
  B: [
    { name: "Yard / Depot", x: 12, y: 86 },
    { name: "Brightleaf Office Park", x: 66, y: 30 },
    { name: "Magnolia Town Center", x: 44, y: 16 },
    { name: "Civic Center Greens", x: 82, y: 64 },
    { name: "Parkview Apartments", x: 30, y: 50 },
  ],
  C: [
    { name: "Yard / Depot", x: 12, y: 86 },
    { name: "Harborview Apartments", x: 78, y: 28 },
    { name: "Willow Creek Schools", x: 52, y: 40 },
    { name: "Stonebrook Estates", x: 34, y: 22 },
    { name: "Lakeside Trail Head", x: 64, y: 72 },
    { name: "Elmwood Clinic", x: 24, y: 58 },
  ],
};

store._reset();

CREWS.forEach((c) => store.addCrew(c));

const clientId = {};
CLIENTS.forEach((c) => { clientId[c.name] = store.createClient(c).id; });

JOBS.forEach((j) =>
  store.createJob({ client_id: clientId[j.client], crew_id: j.crew, service: j.service, status: j.status })
);

EQUIPMENT.forEach((e) => store.addEquipment(e));

INVOICES.forEach((i) =>
  store.createInvoice({ client_id: clientId[i.client], amount: i.amount, status: i.status })
);

Object.entries(ROUTES).forEach(([crew, stops]) =>
  stops.forEach((s, idx) => store.addStop({ crew_id: crew, name: s.name, x: s.x, y: s.y, position: idx }))
);

store.createUser({ email: "owner@greenroute.app", password_hash: hashPassword("greenroute"), name: "GreenRoute Owner" });
store.save();

console.log("Seeded GreenRoute database.");
console.log("Demo login →  email: owner@greenroute.app   password: greenroute");
