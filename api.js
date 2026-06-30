import React, { useState } from "react";
import {
  Sprout, LayoutDashboard, CalendarDays, Route as RouteIcon, Wrench, Users, ChevronRight, LogOut,
} from "lucide-react";
import { T, display, body, mono } from "./theme.js";
import { api } from "./api.js";

import Site from "./pages/Site.jsx";
import Login from "./pages/Login.jsx";
import Overview from "./pages/Overview.jsx";
import Schedule from "./pages/Schedule.jsx";
import Routes from "./pages/Routes.jsx";
import Equipment from "./pages/Equipment.jsx";
import Clients from "./pages/Clients.jsx";

const NAV = [
  { id: "overview", label: "Overview", icon: LayoutDashboard, El: Overview },
  { id: "schedule", label: "Schedule", icon: CalendarDays, El: Schedule },
  { id: "routes", label: "Routes", icon: RouteIcon, El: Routes },
  { id: "equipment", label: "Equipment", icon: Wrench, El: Equipment },
  { id: "clients", label: "Clients", icon: Users, El: Clients },
];

function Shell({ onLogout }) {
  const [tab, setTab] = useState("overview");
  const Active = NAV.find((n) => n.id === tab).El;

  return (
    <div style={{ background: T.paper, color: T.ink, fontFamily: body, minHeight: "100%" }} className="flex">
      <aside style={{ background: T.pineDeep, borderColor: T.pine }} className="hidden md:flex w-60 shrink-0 flex-col border-r p-4">
        <div className="flex items-center gap-2 px-1 mb-6">
          <span style={{ background: T.amber }} className="w-8 h-8 rounded-lg grid place-items-center"><Sprout size={18} color="#241400" /></span>
          <span style={{ fontFamily: display, fontWeight: 800, color: "#EAF3E6" }} className="text-lg">GreenRoute</span>
        </div>
        <nav className="space-y-1 flex-1">
          {NAV.map((n) => {
            const on = tab === n.id;
            return (
              <button key={n.id} onClick={() => setTab(n.id)}
                style={{ background: on ? T.pine : "transparent", color: on ? "#F4F8F2" : "#AEC8A6" }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium">
                <n.icon size={17} /> {n.label}
              </button>
            );
          })}
        </nav>
        <button onClick={onLogout} style={{ color: "#AEC8A6" }} className="flex items-center gap-2 px-3 py-2 text-sm">
          <LogOut size={15} /> Sign out
        </button>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col">
        <header style={{ background: T.card, borderColor: T.line }} className="border-b px-5 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 md:hidden">
            <span style={{ background: T.pine }} className="w-8 h-8 rounded-lg grid place-items-center"><Sprout size={17} color="#EAF3E6" /></span>
            <span style={{ fontFamily: display, fontWeight: 800 }}>GreenRoute</span>
          </div>
          <span className="hidden md:block capitalize" style={{ fontFamily: display, fontWeight: 700, letterSpacing: -0.3 }}>{tab}</span>
          <div className="flex items-center gap-3">
            <span style={{ color: T.faint, fontFamily: mono }} className="hidden sm:block text-xs">sole proprietorship</span>
            <button onClick={onLogout} title="Sign out" className="md:hidden" style={{ color: T.sub }}><LogOut size={18} /></button>
            <span style={{ background: T.pine, color: "#EAF3E6", fontFamily: mono }} className="w-8 h-8 rounded-full grid place-items-center text-xs font-semibold">GR</span>
          </div>
        </header>

        <div className="md:hidden flex gap-1 px-3 py-2 overflow-x-auto" style={{ background: T.card, borderBottom: `1px solid ${T.line}` }}>
          {NAV.map((n) => {
            const on = tab === n.id;
            return (
              <button key={n.id} onClick={() => setTab(n.id)}
                style={{ background: on ? T.pine : "#EEF3EA", color: on ? "#F4F8F2" : T.sub }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap">
                <n.icon size={14} /> {n.label}
              </button>
            );
          })}
        </div>

        <main className="p-5 md:p-7 flex-1"><Active /></main>
      </div>
    </div>
  );
}

export default function App() {
  // 'site' | 'login' | 'app'
  const [view, setView] = useState(api.token ? "app" : "site");

  const openApp = () => setView(api.token ? "app" : "login");
  const logout = () => { api.setToken(null); setView("site"); };

  if (view === "login") return <Login onAuthed={() => setView("app")} backToSite={() => setView("site")} />;
  if (view === "app") return <Shell onLogout={logout} />;
  return <Site openApp={openApp} />;
}
