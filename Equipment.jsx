// Single source of truth for talking to the GreenRoute API.
// Base URL comes from VITE_API_URL, falling back to local dev.

const BASE =
  (import.meta.env && import.meta.env.VITE_API_URL) || "http://localhost:4000/api";

let token = localStorage.getItem("gr_token") || null;

function setToken(t) {
  token = t;
  if (t) localStorage.setItem("gr_token", t);
  else localStorage.removeItem("gr_token");
}

async function req(path, { method = "GET", body } = {}) {
  let res;
  try {
    res = await fetch(BASE + path, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new Error("Can't reach the API. Is the backend running on " + BASE + "?");
  }
  if (res.status === 204) return null;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 401 && token) setToken(null); // expired/invalid → force re-login
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return data;
}

export const api = {
  get token() { return token; },
  setToken,
  baseUrl: BASE,

  login: (email, password) => req("/auth/login", { method: "POST", body: { email, password } }),
  me: () => req("/auth/me"),

  clients: () => req("/clients"),
  crews: () => req("/crews"),

  jobs: () => req("/jobs"),
  addJob: (b) => req("/jobs", { method: "POST", body: b }),
  advanceJob: (id) => req(`/jobs/${id}`, { method: "PATCH", body: { advance: true } }),

  equipment: () => req("/equipment"),
  serviceEquipment: (id) => req(`/equipment/${id}`, { method: "PATCH", body: { service: true } }),

  invoices: () => req("/invoices"),
  createInvoice: (client_id) => req("/invoices", { method: "POST", body: { client_id } }),
  advanceInvoice: (id) => req(`/invoices/${id}`, { method: "PATCH", body: { advance: true } }),

  route: (crew) => req(`/routes/${crew}`),
  optimizeRoute: (crew) => req(`/routes/${crew}/optimize`, { method: "POST" }),

  overview: () => req("/metrics/overview"),
};

export default api;
