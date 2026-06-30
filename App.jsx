import React, { useEffect, useState, useCallback } from "react";
import { Loader2, AlertCircle, TrendingUp } from "lucide-react";
import { T, display, body, mono } from "./theme.js";

/* data-loading hook: returns { data, loading, error, reload } */
export function useLoad(fn, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const run = useCallback(() => {
    let alive = true;
    setLoading(true);
    setError(null);
    Promise.resolve(fn())
      .then((d) => alive && setData(d))
      .catch((e) => alive && setError(e.message || "Something went wrong"))
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  useEffect(run, [run]);
  return { data, loading, error, reload: run, setData };
}

export function Spinner({ label = "Loading" }) {
  return (
    <div className="flex items-center gap-2 py-10 justify-center" style={{ color: T.faint }}>
      <Loader2 size={18} style={{ animation: "spin 0.9s linear infinite" }} />
      <span style={{ fontFamily: mono, fontSize: 13 }}>{label}…</span>
    </div>
  );
}

export function ErrorNote({ message, onRetry }) {
  return (
    <div style={{ background: "#F7E2DC", borderColor: "#EBC4B9", color: "#7A2E1E" }} className="rounded-xl border p-4 flex items-start gap-3">
      <AlertCircle size={18} className="mt-0.5 shrink-0" />
      <div>
        <div className="text-sm font-medium">{message}</div>
        {onRetry && (
          <button onClick={onRetry} className="mt-1 text-sm underline" style={{ color: "#7A2E1E" }}>Try again</button>
        )}
      </div>
    </div>
  );
}

export function Badge({ children, bg, fg, br }) {
  return (
    <span
      style={{ background: bg, color: fg, borderColor: br || "transparent", fontFamily: mono, fontSize: 11, letterSpacing: 0.3 }}
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border font-medium uppercase"
    >
      {children}
    </span>
  );
}

export function Btn({ children, onClick, kind = "primary", size = "md", disabled, type = "button" }) {
  const base = "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-transform active:scale-95";
  const pad = size === "sm" ? "px-3 py-1.5 text-sm" : "px-4 py-2.5 text-sm";
  const styles =
    kind === "primary" ? { background: T.pine, color: "#F4F8F2" }
    : kind === "amber" ? { background: T.amber, color: "#241400" }
    : { background: "#FFFFFF", color: T.ink };
  const border = kind === "outline" ? `1px solid ${T.line}` : "none";
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      style={{ ...styles, fontFamily: body, opacity: disabled ? 0.45 : 1, border }}
      className={`${base} ${pad}`}>
      {children}
    </button>
  );
}

export function Card({ children, pad = true, className = "" }) {
  return (
    <div style={{ background: T.card, borderColor: T.line }} className={`rounded-2xl border ${pad ? "p-5" : ""} ${className}`}>
      {children}
    </div>
  );
}

export function StatusPill({ status }) {
  const map = {
    scheduled: { t: "Scheduled", bg: "#EEF2EA", fg: T.sub, br: T.line },
    in_progress: { t: "In progress", bg: T.amberSoft, fg: "#7A4B12", br: "#EAD3A8" },
    done: { t: "Complete", bg: "#E2EFE6", fg: T.good, br: "#C4E0CE" },
    active: { t: "Active", bg: "#E2EFE6", fg: T.good, br: "#C4E0CE" },
    idle: { t: "Idle", bg: "#EEF2EA", fg: T.sub, br: T.line },
    maintenance: { t: "Service due", bg: "#F7E2DC", fg: T.bad, br: "#EBC4B9" },
    paid: { t: "Paid", bg: "#E2EFE6", fg: T.good, br: "#C4E0CE" },
    sent: { t: "Sent", bg: T.amberSoft, fg: "#7A4B12", br: "#EAD3A8" },
    draft: { t: "Draft", bg: "#EEF2EA", fg: T.sub, br: T.line },
  };
  const s = map[status] || map.scheduled;
  return <Badge bg={s.bg} fg={s.fg} br={s.br}>{s.t}</Badge>;
}

export function KPI({ label, value, sub, icon: Icon, accent }) {
  return (
    <Card>
      <div className="flex items-center justify-between">
        <span style={{ color: T.faint, fontFamily: mono, fontSize: 12, letterSpacing: 0.3 }} className="uppercase">{label}</span>
        <span style={{ background: accent || "#EEF3EA" }} className="w-8 h-8 rounded-lg grid place-items-center">
          <Icon size={16} color={T.pine} />
        </span>
      </div>
      <div style={{ fontFamily: display, fontWeight: 800, letterSpacing: -0.8 }} className="mt-3 text-3xl">{value}</div>
      {sub && <div style={{ color: T.good, fontFamily: mono, fontSize: 12 }} className="mt-1 flex items-center gap-1"><TrendingUp size={13} /> {sub}</div>}
    </Card>
  );
}

export function BarChart({ data, labels }) {
  const max = Math.max(...data, 1);
  return (
    <svg viewBox="0 0 360 150" className="w-full">
      {[0.25, 0.5, 0.75, 1].map((g) => (
        <line key={g} x1="0" x2="360" y1={140 - g * 120} y2={140 - g * 120} stroke={T.lineSoft} strokeWidth="1" />
      ))}
      {data.map((v, i) => {
        const h = (v / max) * 120;
        const w = 360 / data.length;
        const x = i * w + w * 0.2;
        const bw = w * 0.6;
        const last = i === data.length - 1;
        return (
          <g key={i}>
            <rect x={x} y={140 - h} width={bw} height={h} rx="2.5" fill={last ? T.amber : T.moss} opacity={last ? 1 : 0.85} />
            <text x={x + bw / 2} y="149" textAnchor="middle" fontSize="7.5" fontFamily={mono} fill={T.faint}>{labels[i]}</text>
          </g>
        );
      })}
    </svg>
  );
}

const HERO_STOPS = [
  { x: 12, y: 86 }, { x: 30, y: 24 }, { x: 72, y: 18 }, { x: 86, y: 54 }, { x: 58, y: 70 }, { x: 40, y: 58 },
];
export function MiniRoute() {
  const path = HERO_STOPS.map((s) => `${s.x},${s.y}`).join(" ");
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <defs>
        <pattern id="g" width="10" height="10" patternUnits="userSpaceOnUse">
          <path d="M10 0H0V10" fill="none" stroke="#FFFFFF" strokeOpacity="0.12" strokeWidth="0.4" />
        </pattern>
      </defs>
      <rect x="0" y="0" width="100" height="100" fill="url(#g)" />
      <polyline points={path} fill="none" stroke={T.amber} strokeWidth="1.4" strokeDasharray="200" strokeDashoffset="200"
        strokeLinecap="round" strokeLinejoin="round" style={{ animation: "draw 2.2s ease forwards 0.3s" }} />
      {HERO_STOPS.map((s, i) => (
        <g key={i} style={{ animation: `pop 0.4s ease forwards ${0.3 + i * 0.28}s`, opacity: 0 }}>
          <circle cx={s.x} cy={s.y} r={i === 0 ? 2.8 : 2.1} fill={i === 0 ? T.amber : "#F4F8F2"} stroke={T.pineDeep} strokeWidth="0.6" />
          <text x={s.x} y={s.y + 0.9} textAnchor="middle" fontSize="2.2" fontFamily={mono} fill={i === 0 ? "#241400" : T.pineDeep} fontWeight="600">
            {i === 0 ? "Y" : i}
          </text>
        </g>
      ))}
    </svg>
  );
}

export function RouteMapSVG({ stops, color }) {
  const path = stops.map((s) => `${s.x},${s.y}`).join(" ");
  return (
    <svg viewBox="0 0 100 100" className="w-full" style={{ maxHeight: 380 }}>
      <defs>
        <pattern id="grid2" width="10" height="10" patternUnits="userSpaceOnUse">
          <path d="M10 0H0V10" fill="none" stroke="#FFFFFF" strokeOpacity="0.08" strokeWidth="0.4" />
        </pattern>
      </defs>
      <rect width="100" height="100" fill="url(#grid2)" />
      <polyline points={path} fill="none" stroke={color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" opacity="0.9" />
      {stops.map((s, i) => (
        <g key={s.id ?? i}>
          <circle cx={s.x} cy={s.y} r={i === 0 ? 3 : 2.4} fill={i === 0 ? T.amber : "#F4F8F2"} stroke={T.pineDeep} strokeWidth="0.7" />
          <text x={s.x} y={s.y + 1} textAnchor="middle" fontSize="2.6" fontFamily={mono} fontWeight="600" fill={i === 0 ? "#241400" : T.pineDeep}>
            {i === 0 ? "Y" : i}
          </text>
        </g>
      ))}
    </svg>
  );
}
