# GreenRoute — Full Stack

The complete GreenRoute system: a vertical SaaS for commercial landscaping and
grounds-management companies. Two projects that run side by side.

```
greenroute/
  greenroute-backend/    Node + Express API, JWT auth, JSON data store
  greenroute-frontend/   React + Vite app, wired to the API
```

## Run it (two terminals)

**Terminal 1 — the API**
```bash
cd greenroute-backend
npm install
npm run seed        # one time: creates + populates the database
npm start           # http://localhost:4000
```

**Terminal 2 — the web app**
```bash
cd greenroute-frontend
npm install
npm run dev         # http://localhost:5173
```

Open http://localhost:5173 and sign in:

```
email:    owner@greenroute.app
password: greenroute
```

That's the whole system live: log in, manage the schedule, optimize routes,
track equipment, and send invoices — all persisting through the API.

## What works end to end

- **Login** issues a JWT; the app sends it on every request.
- **Overview** pulls company KPIs, the MRR chart, and live operational counts.
- **Schedule** lists jobs by crew; add a job or advance it scheduled → in progress → done.
- **Routes** optimizes each crew's stops server-side (nearest-neighbor) and reports miles saved.
- **Equipment** shows engine hours; "log service" resets the machine.
- **Clients & invoicing** creates invoices (auto-billed at one month of ACV) and moves them draft → sent → paid.

Each project has its own README with deployment notes (Docker / Render / Railway
for the API; any static host for the app) and instructions for scaling the data
layer from the bundled JSON store to Postgres.

## A note on the data store

The backend ships with a dependency-free JSON store so it installs and runs
anywhere with no native build step — ideal for a single-owner business. When you
outgrow it, `greenroute-backend/src/store.js` is the one file to replace with
Postgres; nothing in the API routes changes.
