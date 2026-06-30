import React from "react";
import { CircleDollarSign, MapPin, TrendingUp, Zap, Check, Wrench, Users } from "lucide-react";
import { T, display, mono, usd } from "../theme.js";
import { api } from "../api.js";
import { Card, KPI, BarChart, Badge, Spinner, ErrorNote, useLoad } from "../ui.jsx";

export default function Overview() {
  const { data, loading, error, reload } = useLoad(() => api.overview(), []);
  if (loading) return <Spinner label="Loading dashboard" />;
  if (error) return <ErrorNote message={error} onRetry={reload} />;

  const { company, mrr, today } = data;
  const pct = (n) => Math.round(n * 100) + "%";
  const activity = [
    { i: Check, t: `${today.jobsDone} of ${today.jobsTotal} jobs marked complete today`, c: T.good },
    { i: CircleDollarSign, t: `${usd(today.outstanding)} in invoices outstanding`, c: T.amber },
    { i: Wrench, t: today.serviceDue ? `${today.serviceDue} machine due for service` : "All equipment in service", c: today.serviceDue ? T.bad : T.good },
    { i: Users, t: `${today.crewsActive} crews currently on route`, c: T.pine },
  ];

  return (
    <div className="space-y-5">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPI label="Annual revenue" value={"$" + (company.arr / 1e6).toFixed(1) + "M"} sub={pct(company.yoy_growth) + " YoY"} icon={CircleDollarSign} />
        <KPI label="Properties" value={company.properties.toLocaleString()} sub={pct(company.net_retention) + " net retention"} icon={MapPin} />
        <KPI label="Gross margin" value={pct(company.gross_margin)} sub="healthy" icon={TrendingUp} accent={T.amberSoft} />
        <KPI label="Rule of 40" value={company.rule_of_40} sub="over 40" icon={Zap} accent={T.amberSoft} />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <h3 style={{ fontFamily: display, fontWeight: 700 }} className="text-lg">Monthly recurring revenue</h3>
                <p style={{ color: T.faint }} className="text-sm">Trailing 12 months · in {mrr.unit}</p>
              </div>
              <Badge bg={T.amberSoft} fg="#7A4B12" br="#EAD3A8">${mrr.values[mrr.values.length - 1]}K / mo</Badge>
            </div>
            <div className="mt-4"><BarChart data={mrr.values} labels={mrr.months} /></div>
          </Card>
        </div>

        <Card>
          <h3 style={{ fontFamily: display, fontWeight: 700 }} className="text-lg">Today on the ground</h3>
          <div className="mt-3 space-y-3">
            {activity.map((a, i) => (
              <div key={i} className="flex items-start gap-3">
                <span style={{ background: "#F1F5EF" }} className="w-7 h-7 rounded-lg grid place-items-center shrink-0"><a.i size={14} color={a.c} /></span>
                <span className="text-sm" style={{ color: T.ink }}>{a.t}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
