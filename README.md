import React, { useState } from "react";
import { Plus, X, Clock, Check } from "lucide-react";
import { T, display, body, mono } from "../theme.js";
import { api } from "../api.js";
import { Card, Btn, StatusPill, Spinner, ErrorNote, useLoad } from "../ui.jsx";

export default function Schedule() {
  const jobsQ = useLoad(() => api.jobs(), []);
  const crewsQ = useLoad(() => api.crews(), []);
  const clientsQ = useLoad(() => api.clients(), []);

  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ client_id: "", crew_id: "", service: "Mow & edge" });
  const [busyId, setBusyId] = useState(null);

  const loading = jobsQ.loading || crewsQ.loading || clientsQ.loading;
  const error = jobsQ.error || crewsQ.error || clientsQ.error;
  if (loading) return <Spinner label="Loading schedule" />;
  if (error) return <ErrorNote message={error} onRetry={() => { jobsQ.reload(); crewsQ.reload(); clientsQ.reload(); }} />;

  const crews = crewsQ.data;
  const clients = clientsQ.data;
  const jobs = jobsQ.data;

  const advance = async (id) => {
    setBusyId(id);
    try { const updated = await api.advanceJob(id); jobsQ.setData(jobs.map((j) => (j.id === id ? updated : j))); }
    finally { setBusyId(null); }
  };

  const addJob = async () => {
    const client_id = Number(form.client_id || clients[0].id);
    const crew_id = form.crew_id || crews[0].id;
    const created = await api.addJob({ client_id, crew_id, service: form.service || "Mow & edge" });
    jobsQ.setData([created, ...jobs]);
    setAdding(false);
    setForm({ client_id: "", crew_id: "", service: "Mow & edge" });
  };

  const field = "w-full rounded-lg border px-3 py-2 text-sm";
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 style={{ fontFamily: display, fontWeight: 700, letterSpacing: -0.4 }} className="text-xl">Today's schedule</h2>
          <p style={{ color: T.faint }} className="text-sm">{jobs.length} jobs across {crews.length} crews</p>
        </div>
        <Btn size="sm" onClick={() => setAdding((v) => !v)}>{adding ? <X size={15} /> : <Plus size={15} />}{adding ? "Cancel" : "Add job"}</Btn>
      </div>

      {adding && (
        <Card>
          <div className="grid sm:grid-cols-3 gap-3">
            <div>
              <label style={{ color: T.sub }} className="text-xs">Property</label>
              <select value={form.client_id} onChange={(e) => setForm({ ...form, client_id: e.target.value })} style={{ borderColor: T.line, fontFamily: body }} className={field}>
                {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label style={{ color: T.sub }} className="text-xs">Crew</label>
              <select value={form.crew_id} onChange={(e) => setForm({ ...form, crew_id: e.target.value })} style={{ borderColor: T.line, fontFamily: body }} className={field}>
                {crews.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label style={{ color: T.sub }} className="text-xs">Service</label>
              <input value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })} style={{ borderColor: T.line, fontFamily: body }} className={field} />
            </div>
          </div>
          <div className="mt-3"><Btn size="sm" kind="amber" onClick={addJob}><Plus size={15} /> Add to schedule</Btn></div>
        </Card>
      )}

      <div className="grid md:grid-cols-3 gap-4">
        {crews.map((crew) => {
          const list = jobs.filter((j) => j.crew_id === crew.id);
          return (
            <Card key={crew.id}>
              <div className="flex items-center gap-2 pb-3" style={{ borderBottom: `1px solid ${T.lineSoft}` }}>
                <span style={{ background: crew.color }} className="w-3 h-3 rounded-full" />
                <span style={{ fontFamily: display, fontWeight: 700 }}>{crew.name}</span>
                <span style={{ color: T.faint }} className="text-xs ml-auto">{crew.lead}</span>
              </div>
              <div className="mt-3 space-y-3">
                {list.length === 0 && <p style={{ color: T.faint }} className="text-sm">No jobs assigned.</p>}
                {list.map((j) => (
                  <div key={j.id} className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-sm font-medium truncate">{j.client}</div>
                      <div style={{ color: T.faint }} className="text-xs">{j.service}</div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <StatusPill status={j.status} />
                      {j.status !== "done" && (
                        <button onClick={() => advance(j.id)} disabled={busyId === j.id} title="Advance" style={{ borderColor: T.line, opacity: busyId === j.id ? 0.5 : 1 }} className="w-7 h-7 rounded-lg border grid place-items-center">
                          {j.status === "scheduled" ? <Clock size={14} color={T.amber} /> : <Check size={14} color={T.good} />}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
