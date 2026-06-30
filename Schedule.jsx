import React, { useState, useEffect } from "react";
import { Route } from "lucide-react";
import { T, display, mono } from "../theme.js";
import { api } from "../api.js";
import { Card, Btn, Badge, RouteMapSVG, Spinner, ErrorNote, useLoad } from "../ui.jsx";

export default function Routes() {
  const crewsQ = useLoad(() => api.crews(), []);
  const [crew, setCrew] = useState(null);

  useEffect(() => {
    if (crewsQ.data && !crew) setCrew(crewsQ.data[0].id);
  }, [crewsQ.data, crew]);

  const routeQ = useLoad(() => (crew ? api.route(crew) : Promise.resolve(null)), [crew]);
  const [optimized, setOptimized] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => { setOptimized(false); }, [crew]);

  if (crewsQ.loading) return <Spinner label="Loading routes" />;
  if (crewsQ.error) return <ErrorNote message={crewsQ.error} onRetry={crewsQ.reload} />;

  const crews = crewsQ.data;
  const crewColor = (crews.find((c) => c.id === crew) || {}).color || T.pine;
  const route = routeQ.data;

  const optimize = async () => {
    setBusy(true);
    try { const res = await api.optimizeRoute(crew); routeQ.setData(res); setOptimized(true); }
    finally { setBusy(false); }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 style={{ fontFamily: display, fontWeight: 700, letterSpacing: -0.4 }} className="text-xl">Route optimizer</h2>
          <p style={{ color: T.faint }} className="text-sm">Shortest drive from the yard, stop by stop.</p>
        </div>
        <div className="flex items-center gap-2">
          {crews.map((c) => (
            <button key={c.id} onClick={() => setCrew(c.id)}
              style={{ background: crew === c.id ? T.pine : "#FFFFFF", color: crew === c.id ? "#F4F8F2" : T.ink, borderColor: T.line }}
              className="px-3 py-1.5 rounded-lg border text-sm font-medium">{c.name}</button>
          ))}
        </div>
      </div>

      {routeQ.loading || !route ? <Spinner label="Loading route" />
        : routeQ.error ? <ErrorNote message={routeQ.error} onRetry={routeQ.reload} />
        : (
        <div className="grid lg:grid-cols-2 gap-4">
          <Card pad={false} className="overflow-hidden">
            <div className="p-4 flex items-center justify-between" style={{ borderBottom: `1px solid ${T.lineSoft}` }}>
              <span style={{ fontFamily: mono, color: T.sub, fontSize: 13 }}>{String(crew).toLowerCase()}_route · {route.stops.length} stops</span>
              <span style={{ fontFamily: mono, color: optimized ? T.good : T.amber, fontSize: 13 }}>{route.miles.toFixed(1)} mi · {route.drive_minutes} min</span>
            </div>
            <div style={{ background: T.pineDeep }} className="p-4"><RouteMapSVG stops={route.stops} color={crewColor} /></div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <h3 style={{ fontFamily: display, fontWeight: 700 }}>Stop order</h3>
              {optimized && <Badge bg="#E2EFE6" fg={T.good} br="#C4E0CE">Optimized · saved {route.miles_saved} mi</Badge>}
            </div>
            <ol className="mt-3 space-y-2">
              {route.stops.map((s, i) => (
                <li key={s.id} className="flex items-center gap-3 text-sm">
                  <span style={{ background: i === 0 ? T.amber : "#EEF3EA", color: i === 0 ? "#241400" : T.pine, fontFamily: mono }} className="w-6 h-6 rounded-md grid place-items-center text-xs font-semibold shrink-0">{i === 0 ? "Y" : i}</span>
                  <span className={i === 0 ? "font-medium" : ""}>{s.name}</span>
                </li>
              ))}
            </ol>
            <div className="mt-4 flex gap-2">
              <Btn size="sm" kind="amber" onClick={optimize} disabled={busy || optimized}><Route size={15} /> {busy ? "Optimizing" : "Optimize route"}</Btn>
            </div>
            <p style={{ color: T.faint }} className="mt-3 text-xs">
              Nearest-neighbor from the yard, computed on the server. {optimized ? "Crews drive the shorter loop." : "Tap optimize to cut windshield time."}
            </p>
          </Card>
        </div>
      )}
    </div>
  );
}
