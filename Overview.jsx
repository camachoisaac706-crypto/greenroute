import React, { useState } from "react";
import { Truck, Wrench } from "lucide-react";
import { T, display, mono } from "../theme.js";
import { api } from "../api.js";
import { Card, Btn, StatusPill, Spinner, ErrorNote, useLoad } from "../ui.jsx";

export default function Equipment() {
  const { data, loading, error, reload, setData } = useLoad(() => api.equipment(), []);
  const [busyId, setBusyId] = useState(null);

  if (loading) return <Spinner label="Loading equipment" />;
  if (error) return <ErrorNote message={error} onRetry={reload} />;

  const logService = async (id) => {
    setBusyId(id);
    try { const updated = await api.serviceEquipment(id); setData(data.map((e) => (e.id === id ? updated : e))); }
    finally { setBusyId(null); }
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 style={{ fontFamily: display, fontWeight: 700, letterSpacing: -0.4 }} className="text-xl">Equipment</h2>
        <p style={{ color: T.faint }} className="text-sm">Engine hours and service status across the fleet.</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map((e) => {
          const pct = Math.min(100, (e.hours / e.service_at) * 100);
          const due = e.status === "maintenance";
          return (
            <Card key={e.id}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2"><Truck size={16} color={T.pine} /><span style={{ fontFamily: display, fontWeight: 700 }}>{e.name}</span></div>
                  <p style={{ color: T.faint }} className="text-xs mt-0.5">{e.type} · Crew {e.crew_id}</p>
                </div>
                <StatusPill status={e.status} />
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between text-xs" style={{ fontFamily: mono, color: T.sub }}>
                  <span>{e.hours} hrs</span><span>service at {e.service_at}</span>
                </div>
                <div style={{ background: T.lineSoft }} className="mt-1.5 h-2 rounded-full overflow-hidden">
                  <div style={{ width: pct + "%", background: due ? T.bad : pct > 85 ? T.amber : T.moss }} className="h-full rounded-full" />
                </div>
              </div>
              {due && <div className="mt-3"><Btn size="sm" onClick={() => logService(e.id)} disabled={busyId === e.id}><Wrench size={14} /> {busyId === e.id ? "Logging" : "Log service"}</Btn></div>}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
