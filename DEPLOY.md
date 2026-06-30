# Deploy GreenRoute — get a public link

This gets you one public URL (like `https://greenroute-xxxx.onrender.com`) that
serves the whole app and works from any device, including your phone. No keeping a
terminal open.

You'll use two free accounts: **GitHub** (to hold the code) and **Render** (to run
it). Budget about 15 minutes the first time.

---

## Step 1 — Put the code on GitHub

Render deploys from a GitHub repository, so the code needs to live there first.

**Easiest (no command line):**
1. Install **GitHub Desktop** (desktop.github.com) and sign in.
2. File → **Add Local Repository** → choose the unzipped `greenroute` folder
   (the one containing `package.json` and `render.yaml`). If it offers to create a
   repository here, say yes.
3. Give it a name, click **Publish repository**. Keep it private if you like.

**Or with the command line**, from inside the `greenroute` folder:
```bash
git init
git add .
git commit -m "GreenRoute"
# create an empty repo on github.com first, then:
git remote add origin https://github.com/YOUR-USERNAME/greenroute.git
git branch -M main
git push -u origin main
```

---

## Step 2 — Deploy on Render

The project includes a `render.yaml` that tells Render exactly how to build and
run everything, so this is nearly one click.

1. Go to **render.com**, sign up (you can log in with GitHub).
2. Click **New → Blueprint**.
3. Connect your GitHub and pick the `greenroute` repository.
4. Render reads `render.yaml`, shows one service named **greenroute**, and fills in
   the settings for you. Click **Apply** / **Create**.
5. Wait for the build to finish and the status to turn **Live** (a few minutes the
   first time — it installs, builds the app, and starts the server).

That's it. Render gives you a URL at the top of the service page.

---

## Step 3 — Open it

Visit the URL Render gave you and sign in:

```
email:    owner@greenroute.app
password: greenroute
```

Share that link with anyone — it works from any device.

---

## Things to know about the free tier

- **It sleeps when idle.** After ~15 minutes of no traffic, Render's free service
  spins down. The next visit wakes it, which takes 30–60 seconds, then it's fast
  again. Upgrading to a paid instance removes the sleep.
- **Data resets on restart.** The free tier has no permanent disk, so when the
  service restarts it starts fresh and automatically re-loads the demo data. Great
  for a demo; not for real records yet.

### Keeping data permanently

Two options when you're ready:

1. **Add a disk (simplest).** Upgrade the service to a paid plan, add a
   **Persistent Disk** in Render, then add an env var `DB_PATH` pointing to a file
   on that disk (e.g. `/var/data/greenroute.json`). Your data then survives
   restarts and deploys.
2. **Move to a real database.** `greenroute-backend/src/store.js` is the only file
   that touches storage — swap it for a Postgres-backed version with the same
   method names and nothing else changes. Render offers a managed Postgres.

---

## Making it yours

- The demo login lives in `greenroute-backend/src/seedData.js` — change the email
  and password there, commit, and Render redeploys automatically on every push.
- Want your own domain (e.g. `app.yourcompany.com`)? Render → your service →
  **Settings → Custom Domains**.

---

## Other hosts

Railway (railway.app) and Fly.io work too with the same single-service setup
(build `npm run build`, start `npm start`). Render is the most beginner-friendly,
which is why it's the default here.

Stuck on any step? Tell me which step and what you see, and I'll walk you through it.
