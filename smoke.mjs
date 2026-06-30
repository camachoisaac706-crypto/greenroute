import React from "react";
import { Sprout, Zap, ArrowRight, Check, CalendarDays, Route, Wrench, FileText, Phone, Mail } from "lucide-react";
import { T, display, body, mono } from "../theme.js";
import { Badge, Btn, Card, MiniRoute } from "../ui.jsx";

export default function Site({ openApp }) {
  const features = [
    { icon: CalendarDays, t: "Crew scheduling", d: "Assign crews, balance loads, and see who's where without a single text message." },
    { icon: Route, t: "Route optimization", d: "Order every stop by shortest drive. Cut windshield time so crews mow more before noon." },
    { icon: Wrench, t: "Equipment tracking", d: "Engine hours per machine and service due before it strands a crew in the field." },
    { icon: FileText, t: "Billing & invoices", d: "Turn a finished route into an invoice. Send it, watch it get paid, chase the rest." },
  ];
  const tiers = [
    { name: "Starter", price: "$5,000", per: "/year", who: "Solo operators and small books of business.", pts: ["Up to 40 properties", "1 crew", "Scheduling + invoicing"], hi: false },
    { name: "Mid-market", price: "$15,000", per: "/year", who: "Growing crews running multiple routes a day.", pts: ["Up to 200 properties", "Unlimited crews", "Route optimization", "Equipment tracking"], hi: true },
    { name: "Enterprise", price: "$50,000", per: "/year", who: "Multi-branch grounds-management firms.", pts: ["Unlimited properties", "Multi-yard support", "API & integrations", "Priority support"], hi: false },
  ];
  return (
    <div style={{ background: T.paper, color: T.ink, fontFamily: body }}>
      <header className="sticky top-0 z-20" style={{ background: "rgba(233,237,229,0.85)", backdropFilter: "blur(8px)", borderBottom: `1px solid ${T.line}` }}>
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span style={{ background: T.pine }} className="w-8 h-8 rounded-lg grid place-items-center"><Sprout size={18} color="#EAF3E6" /></span>
            <span style={{ fontFamily: display, fontWeight: 800, letterSpacing: -0.4 }} className="text-lg">GreenRoute</span>
          </div>
          <nav className="hidden md:flex items-center gap-7 text-sm" style={{ color: T.sub }}>
            <a href="#features" className="hover:opacity-70">Features</a>
            <a href="#pricing" className="hover:opacity-70">Pricing</a>
            <a href="#built" className="hover:opacity-70">Who it's for</a>
          </nav>
          <Btn onClick={openApp} size="sm">Open app <ArrowRight size={15} /></Btn>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-5 pt-14 pb-12 md:pt-20 md:pb-16 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <Badge bg="#FFFFFF" fg={T.pine} br={T.line}><Zap size={11} /> Vertical SaaS for grounds crews</Badge>
          <h1 style={{ fontFamily: display, fontWeight: 800, letterSpacing: -1.2, lineHeight: 1.02 }} className="mt-4 text-4xl md:text-5xl">
            Run the whole yard from one screen.
          </h1>
          <p style={{ color: T.sub }} className="mt-4 text-lg max-w-md">
            GreenRoute is the operating system for commercial landscaping companies — scheduling, routing, equipment, and billing for the businesses that keep hundreds of properties green.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Btn onClick={openApp} kind="amber">Open the live app <ArrowRight size={16} /></Btn>
            <Btn kind="outline" onClick={() => document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })}>See pricing</Btn>
          </div>
          <div className="mt-7 flex items-center gap-6" style={{ fontFamily: mono, color: T.faint, fontSize: 13 }}>
            <span><b style={{ color: T.ink }}>600</b> properties</span>
            <span><b style={{ color: T.ink }}>$10.0M</b> billed / yr</span>
            <span><b style={{ color: T.ink }}>92%</b> renew</span>
          </div>
        </div>
        <div className="relative">
          <div style={{ background: T.pineDeep, borderColor: T.pine }} className="rounded-3xl border p-4 aspect-square">
            <div className="flex items-center justify-between px-1 pb-3">
              <span style={{ color: "#CFE0C8", fontFamily: mono, fontSize: 12 }}>crew_a · morning route</span>
              <span style={{ color: T.amber, fontFamily: mono, fontSize: 12 }}>6 stops</span>
            </div>
            <div className="rounded-2xl overflow-hidden" style={{ background: T.pine, height: "calc(100% - 2rem)" }}>
              <MiniRoute />
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="max-w-6xl mx-auto px-5 py-12">
        <p style={{ color: T.amber, fontFamily: mono, fontSize: 12, letterSpacing: 1 }} className="uppercase">What's inside</p>
        <h2 style={{ fontFamily: display, fontWeight: 700, letterSpacing: -0.6 }} className="mt-2 text-2xl md:text-3xl">Four jobs, one tool, no spreadsheets.</h2>
        <div className="mt-8 grid sm:grid-cols-2 gap-4">
          {features.map((f) => (
            <Card key={f.t}>
              <span style={{ background: "#EEF3EA" }} className="w-10 h-10 rounded-xl grid place-items-center"><f.icon size={20} color={T.pine} /></span>
              <h3 style={{ fontFamily: display, fontWeight: 700 }} className="mt-4 text-lg">{f.t}</h3>
              <p style={{ color: T.sub }} className="mt-1.5 text-sm leading-relaxed">{f.d}</p>
            </Card>
          ))}
        </div>
      </section>

      <section id="pricing" className="max-w-6xl mx-auto px-5 py-12">
        <p style={{ color: T.amber, fontFamily: mono, fontSize: 12, letterSpacing: 1 }} className="uppercase">Pricing</p>
        <h2 style={{ fontFamily: display, fontWeight: 700, letterSpacing: -0.6 }} className="mt-2 text-2xl md:text-3xl">Priced by the size of your book.</h2>
        <div className="mt-8 grid md:grid-cols-3 gap-4">
          {tiers.map((p) => (
            <div key={p.name} style={{ background: p.hi ? T.pineDeep : T.card, borderColor: p.hi ? T.pine : T.line, color: p.hi ? "#EAF3E6" : T.ink }} className="rounded-2xl border p-6 flex flex-col">
              <div className="flex items-center justify-between">
                <span style={{ fontFamily: display, fontWeight: 700 }} className="text-lg">{p.name}</span>
                {p.hi && <Badge bg={T.amber} fg="#241400">Most picked</Badge>}
              </div>
              <div className="mt-4 flex items-end gap-1">
                <span style={{ fontFamily: display, fontWeight: 800, letterSpacing: -1 }} className="text-3xl">{p.price}</span>
                <span style={{ color: p.hi ? "#A9C6A0" : T.faint }} className="text-sm mb-1">{p.per}</span>
              </div>
              <p style={{ color: p.hi ? "#BFD6B7" : T.sub }} className="mt-2 text-sm">{p.who}</p>
              <ul className="mt-4 space-y-2 flex-1">
                {p.pts.map((pt) => (
                  <li key={pt} className="flex items-center gap-2 text-sm"><Check size={15} color={p.hi ? T.amber : T.pine} /> {pt}</li>
                ))}
              </ul>
              <div className="mt-5"><Btn onClick={openApp} kind={p.hi ? "amber" : "outline"} size="sm">Start with {p.name}</Btn></div>
            </div>
          ))}
        </div>
      </section>

      <section id="built" className="max-w-6xl mx-auto px-5 py-12">
        <div style={{ background: T.card, borderColor: T.line }} className="rounded-3xl border p-8 md:p-10 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 style={{ fontFamily: display, fontWeight: 700, letterSpacing: -0.6 }} className="text-2xl md:text-3xl">Built by an operator, run as a one-person shop.</h2>
            <p style={{ color: T.sub }} className="mt-3 leading-relaxed">
              GreenRoute is a sole proprietorship — one owner, full ownership, every dollar of profit flowing through a single Schedule C. The software stays lean on purpose: the four things a grounds-management company does every day, and nothing it doesn't.
            </p>
            <div className="mt-5 flex flex-wrap gap-3 items-center">
              <Btn onClick={openApp}>Open the app <ArrowRight size={16} /></Btn>
              <span className="inline-flex items-center gap-2 text-sm" style={{ color: T.sub }}><Phone size={15} /> (555) 014-2200</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[["$10.0M", "billed / yr"], ["600", "properties"], ["115%", "net retention"], ["43", "Rule of 40"]].map(([n, l]) => (
              <div key={l} style={{ background: T.paper, borderColor: T.line }} className="rounded-xl border p-4">
                <div style={{ fontFamily: display, fontWeight: 800, letterSpacing: -0.5 }} className="text-2xl">{n}</div>
                <div style={{ color: T.faint, fontFamily: mono, fontSize: 12 }} className="mt-0.5">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer style={{ borderTop: `1px solid ${T.line}`, color: T.faint }} className="max-w-6xl mx-auto px-5 py-8 mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
        <div className="flex items-center gap-2"><Sprout size={16} color={T.pine} /><span>GreenRoute — a sole proprietorship.</span></div>
        <span className="inline-flex items-center gap-1"><Mail size={14} /> hello@greenroute.app</span>
      </footer>
    </div>
  );
}
