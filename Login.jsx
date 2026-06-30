import React, { useState } from "react";
import { Plus } from "lucide-react";
import { T, display, mono, usd } from "../theme.js";
import { api } from "../api.js";
import { Card, Btn, Badge, StatusPill, Spinner, ErrorNote, useLoad } from "../ui.jsx";

export default function Clients() {
  const clientsQ = useLoad(() => api.clients(), []);
  const invoicesQ = useLoad(() => api.invoices(), []);
  const [busyId, setBusyId] = useState(null);

  const loading = clientsQ.loading || invoicesQ.loading;
  const error = clientsQ.error || invoicesQ.error;
  if (loading) return <Spinner label="Loading accounts" />;
  if (error) return <ErrorNote message={error} onRetry={() => { clientsQ.reload(); invoicesQ.reload(); }} />;

  const clients = clientsQ.data;
  const invoices = invoicesQ.data;
  const outstanding = invoices.filter((i) => i.status !== "paid").reduce((s, i) => s + i.amount, 0);
  const collected = invoices.filter((i) => i.status === "paid").reduce((s, i) => s + i.amount, 0);

  const tierBadge = (t) =>
    t === "Enterprise" ? <Badge bg={T.pineDeep} fg="#EAF3E6">Enterprise</Badge>
    : t === "Mid-market" ? <Badge bg="#EEF3EA" fg={T.pine} br={T.line}>Mid-market</Badge>
    : <Badge bg="#FFFFFF" fg={T.sub} br={T.line}>Starter</Badge>;

  const createInvoice = async (clientId) => {
    setBusyId("c" + clientId);
    try { const inv = await api.createInvoice(clientId); invoicesQ.setData([inv, ...invoices]); }
    finally { setBusyId(null); }
  };
  const advanceInv = async (id) => {
    setBusyId("i" + id);
    try { const updated = await api.advanceInvoice(id); invoicesQ.setData(invoices.map((i) => (i.id === id ? updated : i))); }
    finally { setBusyId(null); }
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 style={{ fontFamily: display, fontWeight: 700, letterSpacing: -0.4 }} className="text-xl">Clients & invoicing</h2>
        <p style={{ color: T.faint }} className="text-sm">Turn finished routes into paid invoices.</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <Card><div style={{ color: T.faint, fontFamily: mono, fontSize: 12 }} className="uppercase">Clients</div><div style={{ fontFamily: display, fontWeight: 800 }} className="text-2xl mt-1">{clients.length}</div></Card>
        <Card><div style={{ color: T.faint, fontFamily: mono, fontSize: 12 }} className="uppercase">Outstanding</div><div style={{ fontFamily: display, fontWeight: 800, color: T.amber }} className="text-2xl mt-1">{usd(outstanding)}</div></Card>
        <Card><div style={{ color: T.faint, fontFamily: mono, fontSize: 12 }} className="uppercase">Collected</div><div style={{ fontFamily: display, fontWeight: 800, color: T.good }} className="text-2xl mt-1">{usd(collected)}</div></Card>
      </div>

      <Card pad={false}>
        <div className="p-4" style={{ borderBottom: `1px solid ${T.lineSoft}` }}><h3 style={{ fontFamily: display, fontWeight: 700 }}>Accounts</h3></div>
        <div>
          {clients.map((c, idx) => (
            <div key={c.id} className="p-4 flex items-center justify-between gap-3" style={{ borderTop: idx ? `1px solid ${T.lineSoft}` : "none" }}>
              <div className="min-w-0">
                <div className="font-medium truncate">{c.name}</div>
                <div style={{ color: T.faint, fontFamily: mono }} className="text-xs mt-0.5">{usd(c.acv)} / yr</div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                {tierBadge(c.tier)}
                <Btn size="sm" kind="outline" onClick={() => createInvoice(c.id)} disabled={busyId === "c" + c.id}><Plus size={14} /> Invoice</Btn>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card pad={false}>
        <div className="p-4" style={{ borderBottom: `1px solid ${T.lineSoft}` }}><h3 style={{ fontFamily: display, fontWeight: 700 }}>Invoices</h3></div>
        <div>
          {invoices.length === 0 && <p style={{ color: T.faint }} className="p-4 text-sm">No invoices yet.</p>}
          {invoices.map((i, idx) => (
            <div key={i.id} className="p-4 flex items-center justify-between gap-3" style={{ borderTop: idx ? `1px solid ${T.lineSoft}` : "none" }}>
              <div className="min-w-0">
                <div className="font-medium truncate">{i.client}</div>
                <div style={{ fontFamily: mono, color: T.sub }} className="text-sm mt-0.5">{usd(i.amount)}</div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <StatusPill status={i.status} />
                {i.status !== "paid" && (
                  <Btn size="sm" kind={i.status === "draft" ? "outline" : "amber"} onClick={() => advanceInv(i.id)} disabled={busyId === "i" + i.id}>
                    {i.status === "draft" ? "Send" : "Mark paid"}
                  </Btn>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
