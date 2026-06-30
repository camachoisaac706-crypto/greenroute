# GreenRoute — Full Stack

A vertical SaaS for commercial landscaping and grounds-management companies.

```
greenroute/
  package.json           one-command production build (serves app + API together)
  render.yaml            one-click deploy config for Render
  DEPLOY.md              step-by-step guide to a public link
  greenroute-backend/    Node + Express API, JWT auth, JSON data store
  greenroute-frontend/   React + Vite app
```

## Want a public link? → see DEPLOY.md
That gets you one URL that works from any device, with no terminal to keep open.

---

## Run it on your own computer

You need Node.js 18+ (nodejs.org). Two ways:

### A) Single URL (production mode) — closest to the deployed version
```bash
npm run build      # builds the app and folds it into the backend
npm start          # serves everything at http://localhost:4000
```
Open http://localhost:4000 and sign in.

### B) Two terminals (dev mode) — live reload while editing
```bash
# Terminal 1 — API
cd greenroute-backend && npm install && npm start        # http://localhost:4000

# Terminal 2 — web app (proxies /api to the backend automatically)
cd greenroute-frontend && npm install && npm run dev      # http://localhost:5173
```
Open http://localhost:5173 and sign in.

**Either way, keep the window(s) open** — the link only works while the server runs.

Demo login:
```
email:    owner@greenroute.app
password: greenroute
```

---

## What works end to end

- **Login** issues a JWT; the app sends it on every request.
- **Overview** — company KPIs, the MRR chart, live operational counts.
- **Schedule** — jobs by crew; add a job or advance it scheduled → in progress → done.
- **Routes** — server-side nearest-neighbor optimization, with miles saved.
- **Equipment** — engine hours; "log service" resets the machine.
- **Clients & invoicing** — create invoices (one month of ACV) and move them draft → sent → paid.

The backend auto-loads demo data on first run, so there's no separate seed step
needed for a quick start (run `npm run seed` in the backend only if you want to
reset to the demo state).

Each project also has its own README with more detail.
