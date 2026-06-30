// Dependency-free persistence layer.
// All data lives in memory and is flushed to a JSON file after every write.
// This keeps the backend install-anywhere (no native build) and is plenty for
// a single-node app. To scale, swap this module for Postgres/Prisma — the route
// handlers only ever call the methods exported here.

import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_PATH = process.env.DB_PATH || path.join(__dirname, "..", "data.json");

const empty = () => ({
  seq: { users: 0, clients: 0, jobs: 0, equipment: 0, invoices: 0, stops: 0 },
  users: [],
  crews: [],
  clients: [],
  jobs: [],
  equipment: [],
  invoices: [],
  routeStops: [],
});

let state = empty();

function load() {
  if (fs.existsSync(DATA_PATH)) {
    try {
      state = { ...empty(), ...JSON.parse(fs.readFileSync(DATA_PATH, "utf8")) };
    } catch {
      state = empty();
    }
  }
}
function save() {
  fs.writeFileSync(DATA_PATH, JSON.stringify(state, null, 2));
}
const nextId = (coll) => (state.seq[coll] += 1);

load();

/* ---- joins ---- */
const clientName = (id) => (state.clients.find((c) => c.id === id) || {}).name || null;
const crewName = (id) => (state.crews.find((c) => c.id === id) || {}).name || null;

const joinJob = (j) => ({
  id: j.id, service: j.service, status: j.status, scheduled_for: j.scheduled_for,
  client_id: j.client_id, client: clientName(j.client_id),
  crew_id: j.crew_id, crew_name: crewName(j.crew_id),
});
const joinInvoice = (i) => ({
  id: i.id, amount: i.amount, status: i.status, issued_at: i.issued_at,
  client_id: i.client_id, client: clientName(i.client_id),
});

const today = () => new Date().toISOString().slice(0, 10);
const now = () => new Date().toISOString();

export const store = {
  /* raw access (used by seed) */
  _reset() { state = empty(); save(); },
  _state: () => state,
  save,

  /* users */
  getUserByEmail: (email) => state.users.find((u) => u.email === email) || null,
  createUser({ email, password_hash, name }) {
    const u = { id: nextId("users"), email, password_hash, name, created_at: now() };
    state.users.push(u); save(); return u;
  },

  /* crews */
  listCrews: () => state.crews.slice().sort((a, b) => a.id.localeCompare(b.id)),
  getCrew: (id) => state.crews.find((c) => c.id === id) || null,
  addCrew(c) { state.crews.push(c); save(); },

  /* clients */
  listClients: () =>
    state.clients.slice().sort((a, b) => b.acv - a.acv || a.name.localeCompare(b.name)),
  getClient: (id) => state.clients.find((c) => c.id === Number(id)) || null,
  createClient({ name, tier, acv, status = "active" }) {
    const c = { id: nextId("clients"), name, tier, acv: Math.round(acv), status };
    state.clients.push(c); save(); return c;
  },

  /* jobs */
  listJobs: () => state.jobs.slice().sort((a, b) => b.id - a.id).map(joinJob),
  getJob: (id) => state.jobs.find((j) => j.id === Number(id)) || null,
  getJobJoined: (id) => { const j = store.getJob(id); return j ? joinJob(j) : null; },
  createJob({ client_id, crew_id, service, status = "scheduled" }) {
    const j = { id: nextId("jobs"), client_id: Number(client_id), crew_id, service, status, scheduled_for: today() };
    state.jobs.push(j); save(); return joinJob(j);
  },
  setJobStatus(id, status) {
    const j = store.getJob(id); if (!j) return null;
    j.status = status; save(); return joinJob(j);
  },
  deleteJob(id) {
    const before = state.jobs.length;
    state.jobs = state.jobs.filter((j) => j.id !== Number(id));
    const changed = state.jobs.length !== before; if (changed) save(); return changed;
  },

  /* equipment */
  listEquipment: () => state.equipment.slice().sort((a, b) => a.id - b.id),
  getEquipment: (id) => state.equipment.find((e) => e.id === Number(id)) || null,
  addEquipment(e) { state.equipment.push({ id: nextId("equipment"), ...e }); save(); },
  updateEquipment(id, { hours, status }) {
    const e = store.getEquipment(id); if (!e) return null;
    if (hours !== undefined) e.hours = hours;
    if (status !== undefined) e.status = status;
    save(); return e;
  },

  /* invoices */
  listInvoices: () => state.invoices.slice().sort((a, b) => b.id - a.id).map(joinInvoice),
  getInvoice: (id) => state.invoices.find((i) => i.id === Number(id)) || null,
  createInvoice({ client_id, amount, status = "draft" }) {
    const i = { id: nextId("invoices"), client_id: Number(client_id), amount: Math.round(amount), status, issued_at: now() };
    state.invoices.push(i); save(); return joinInvoice(i);
  },
  setInvoiceStatus(id, status) {
    const i = store.getInvoice(id); if (!i) return null;
    i.status = status; save(); return joinInvoice(i);
  },

  /* route stops */
  addStop(s) { state.routeStops.push({ id: nextId("stops"), ...s }); save(); },
  getStops: (crewId) =>
    state.routeStops.filter((s) => s.crew_id === crewId).sort((a, b) => a.position - b.position),
  setStopOrder(crewId, orderedIds) {
    orderedIds.forEach((id, pos) => {
      const s = state.routeStops.find((r) => r.id === id);
      if (s) s.position = pos;
    });
    save();
  },

  /* metrics counts */
  counts() {
    const jobs = state.jobs;
    const inv = state.invoices;
    return {
      jobsTotal: jobs.length,
      jobsDone: jobs.filter((j) => j.status === "done").length,
      crewsActive: new Set(jobs.filter((j) => j.status !== "done").map((j) => j.crew_id)).size,
      outstanding: inv.filter((i) => i.status !== "paid").reduce((s, i) => s + i.amount, 0),
      collected: inv.filter((i) => i.status === "paid").reduce((s, i) => s + i.amount, 0),
      serviceDue: state.equipment.filter((e) => e.status === "maintenance").length,
    };
  },
};

export default store;
