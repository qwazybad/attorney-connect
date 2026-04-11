"use client";

import { useEffect, useState } from "react";
import { useAuth, useUser, UserButton } from "@clerk/nextjs";
import {
  Scale, Users, CheckCircle, Clock, XCircle, Inbox,
  LogOut, X, ExternalLink, Webhook, ShieldAlert, TrendingUp,
  ChevronRight, Mail, Trophy, AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import { LEGAL_ISSUES, US_STATES } from "@/lib/data";

type Status = "active" | "pending" | "suspended";

type AdminAttorney = {
  id: string; name: string | null; firm: string | null; bio: string | null;
  phone: string | null; website: string | null; email: string | null;
  photo_url: string | null; webhook_url: string | null; status: Status;
  notes: string | null; practice_areas: string[] | null; licensed_states: string[] | null;
  years_experience: string | null; firm_size: string | null;
  billing_type: string | null; fee_percent: number | null; hourly_rate: number | null; flat_fee: number | null;
  city: string | null; state: string | null;
  cases_won: number | null; total_cases: number | null;
  recent_result: string | null; recent_result_amount: string | null;
  bar_license: string | null; malpractice_insurance: string | null;
  response_time_hours: number | null;
  clerk_id: string | null; claimed: boolean; claim_token: string | null; outreach_email: string | null;
  created_at: string; lead_count: number;
};

type AdminLead = {
  id: string; attorney_id: string; attorney_name: string | null; attorney_firm: string | null;
  first_name: string; last_name: string; email: string; phone: string | null;
  legal_issue: string; state: string; message: string | null; sent_to_webhook: boolean;
  status: string | null; created_at: string;
};

const LEAD_PIPELINE: { key: string; label: string; dot: string; color: string; bg: string }[] = [
  { key: "new",                label: "New",              dot: "bg-blue-500",   color: "text-blue-700",   bg: "bg-blue-50" },
  { key: "attempting_contact", label: "Attempting",       dot: "bg-amber-500",  color: "text-amber-700",  bg: "bg-amber-50" },
  { key: "contacted",          label: "Contacted",        dot: "bg-orange-500", color: "text-orange-700", bg: "bg-orange-50" },
  { key: "retained",           label: "Retained",         dot: "bg-purple-500", color: "text-purple-700", bg: "bg-purple-50" },
  { key: "in_progress",        label: "In Progress",      dot: "bg-indigo-500", color: "text-indigo-700", bg: "bg-indigo-50" },
  { key: "settlement",         label: "Settlement",       dot: "bg-teal-500",   color: "text-teal-700",   bg: "bg-teal-50" },
  { key: "closed",             label: "Closed / Won",     dot: "bg-green-500",  color: "text-green-700",  bg: "bg-green-50" },
  { key: "lost",               label: "Lost",             dot: "bg-gray-400",   color: "text-gray-500",   bg: "bg-gray-50" },
];

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
function fmtShort(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function StatusPill({ status }: { status: Status }) {
  const map: Record<Status, string> = { active: "bg-green-100 text-green-700", pending: "bg-yellow-100 text-yellow-700", suspended: "bg-red-100 text-red-600" };
  const icons: Record<Status, React.ReactNode> = { active: <CheckCircle className="w-3 h-3" />, pending: <Clock className="w-3 h-3" />, suspended: <XCircle className="w-3 h-3" /> };
  return <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${map[status]}`}>{icons[status]} {status}</span>;
}

function StatCard({ label, value, icon: Icon, color, href, sub }: { label: string; value: number | string; icon: React.ElementType; color: string; href?: string; sub?: string }) {
  const inner = (
    <>
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${color}`}><Icon className="w-5 h-5" /></div>
      <div>
        <p className="text-2xl font-extrabold text-gray-900">{value}</p>
        <p className="text-xs text-gray-500 font-medium group-hover:text-blue-500 transition-colors">{label}</p>
        {sub && <p className="text-[10px] text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </>
  );
  if (href) return <Link href={href} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex items-center gap-4 hover:border-blue-300 hover:shadow-md transition-all group">{inner}</Link>;
  return <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex items-center gap-4">{inner}</div>;
}

function SectionCard({ title, icon: Icon, children, action }: { title: string; icon: React.ElementType; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-gray-400" />
          <h2 className="text-sm font-bold text-gray-900">{title}</h2>
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

function LeadVolumeChart({ leads }: { leads: AdminLead[] }) {
  const days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    return d.toISOString().slice(0, 10);
  });

  const data = days.map((day) => ({
    day,
    count: leads.filter((l) => l.created_at.slice(0, 10) === day).length,
  }));

  const max = Math.max(...data.map((d) => d.count), 1);
  const total = data.reduce((s, d) => s + d.count, 0);
  const chartH = 80;

  return (
    <div>
      <div className="flex items-end gap-[2px] h-[80px]">
        {data.map(({ day, count }) => {
          const h = Math.max((count / max) * chartH, count > 0 ? 4 : 1);
          return (
            <div key={day} className="flex-1 flex flex-col items-center justify-end group relative">
              <div
                className={`w-full rounded-t-sm transition-all ${count > 0 ? "bg-blue-400 group-hover:bg-blue-500" : "bg-gray-100"}`}
                style={{ height: `${h}px` }}
              />
              {count > 0 && (
                <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                  {count} lead{count !== 1 ? "s" : ""}<br /><span className="font-normal">{fmtShort(day)}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="flex justify-between text-[10px] text-gray-400 mt-1.5">
        <span>{fmtShort(days[0])}</span>
        <span className="text-gray-500 font-semibold">{total} leads this month</span>
        <span>Today</span>
      </div>
    </div>
  );
}

function AddAttorneyModal({ onClose, onAdded }: { onClose: () => void; onAdded: (a: AdminAttorney) => void }) {
  const [form, setForm] = useState({ name: "", firm: "", outreach_email: "", phone: "", website: "", city: "", state: "", billing_type: "contingency", fee_percent: "", hourly_rate: "", flat_fee: "", status: "active" });
  const [practiceAreas, setPracticeAreas] = useState<string[]>([]);
  const [licensedStates, setLicensedStates] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setSaving(true); setError("");
    const payload = { ...form, email: form.outreach_email, fee_percent: form.fee_percent ? parseFloat(form.fee_percent) : null, hourly_rate: form.hourly_rate ? parseFloat(form.hourly_rate) : null, flat_fee: form.flat_fee ? parseFloat(form.flat_fee) : null, practice_areas: practiceAreas, licensed_states: licensedStates };
    const res = await fetch("/api/admin/attorneys", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    const json = await res.json(); setSaving(false);
    if (!res.ok) { setError(json.error ?? "Failed"); return; }
    onAdded({ ...json.data, lead_count: 0 }); onClose();
  }

  const inp = "w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500";
  const lbl = "block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5";

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
          <div><h2 className="text-lg font-bold text-gray-900">Seed Attorney Profile</h2><p className="text-xs text-gray-500 mt-0.5">Profile goes live immediately. Send a claim email so they can take ownership.</p></div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {([{ key: "name", label: "Full Name *", placeholder: "Jane Smith" }, { key: "firm", label: "Law Firm *", placeholder: "Smith & Associates" }, { key: "outreach_email", label: "Outreach Email", placeholder: "jane@smithlaw.com" }, { key: "phone", label: "Phone", placeholder: "(555) 000-0000" }, { key: "city", label: "City", placeholder: "Los Angeles" }] as { key: string; label: string; placeholder: string }[]).map(({ key, label, placeholder }) => (
              <div key={key}><label className={lbl}>{label}</label><input required={label.includes("*")} value={(form as Record<string, string>)[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} placeholder={placeholder} className={inp} /></div>
            ))}
            <div><label className={lbl}>State</label><select value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} className={inp}><option value="">Select state</option>{US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}</select></div>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3 border-b border-gray-100 pb-2">Fee Structure</p>
            <div className="grid grid-cols-2 gap-4">
              <div><label className={lbl}>Billing Type</label><select value={form.billing_type} onChange={(e) => setForm({ ...form, billing_type: e.target.value })} className={inp}><option value="contingency">Contingency</option><option value="hourly">Hourly</option><option value="flat">Flat Fee</option></select></div>
              {form.billing_type === "contingency" && <div><label className={lbl}>Fee %</label><input type="number" value={form.fee_percent} onChange={(e) => setForm({ ...form, fee_percent: e.target.value })} placeholder="28" className={inp} /></div>}
              {form.billing_type === "hourly" && <div><label className={lbl}>Hourly Rate ($)</label><input type="number" value={form.hourly_rate} onChange={(e) => setForm({ ...form, hourly_rate: e.target.value })} placeholder="300" className={inp} /></div>}
              {form.billing_type === "flat" && <div><label className={lbl}>Flat Fee ($)</label><input type="number" value={form.flat_fee} onChange={(e) => setForm({ ...form, flat_fee: e.target.value })} placeholder="2500" className={inp} /></div>}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3 border-b border-gray-100 pb-2">Practice Areas ({practiceAreas.length} selected)</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {LEGAL_ISSUES.map((issue) => <button key={issue.value} type="button" onClick={() => setPracticeAreas((p) => p.includes(issue.label) ? p.filter((a) => a !== issue.label) : [...p, issue.label])} className={`text-xs px-3 py-2 rounded-lg border font-medium text-left transition-colors ${practiceAreas.includes(issue.label) ? "bg-blue-500 text-white border-blue-500" : "bg-gray-50 text-gray-600 border-gray-200 hover:border-blue-300"}`}>{issue.label}</button>)}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3 border-b border-gray-100 pb-2">Licensed States ({licensedStates.length} selected)</p>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5 max-h-40 overflow-y-auto">
              {US_STATES.map((s) => <button key={s} type="button" onClick={() => setLicensedStates((p) => p.includes(s) ? p.filter((x) => x !== s) : [...p, s])} className={`text-xs px-2 py-1.5 rounded-lg border font-medium transition-colors ${licensedStates.includes(s) ? "bg-blue-500 text-white border-blue-500" : "bg-gray-50 text-gray-600 border-gray-200 hover:border-blue-300"}`}>{s}</button>)}
            </div>
          </div>
          <div><label className={lbl}>Status</label><select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className={inp}><option value="active">Active</option><option value="pending">Pending</option><option value="suspended">Suspended</option></select></div>
          {error && <p className="text-xs text-red-500">{error}</p>}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 border border-gray-200 text-gray-600 font-semibold py-2.5 rounded-xl text-sm hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2.5 rounded-xl text-sm disabled:opacity-60">{saving ? "Adding…" : "Seed Profile"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const { user } = useUser();
  const { signOut } = useAuth();
  const [attorneys, setAttorneys] = useState<AdminAttorney[]>([]);
  const [leads, setLeads] = useState<AdminLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [sendingClaimId, setSendingClaimId] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/attorneys").then((r) => r.json()),
      fetch("/api/admin/leads").then((r) => r.json()),
    ]).then(([aRes, lRes]) => {
      setAttorneys(aRes.data ?? []);
      setLeads(lRes.data ?? []);
      setLoading(false);
    }).catch((err) => {
      console.error("Admin fetch failed:", err);
      setLoading(false);
    });
  }, []);

  async function approveAttorney(id: string) {
    setApprovingId(id);
    const res = await fetch(`/api/admin/attorneys/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: "active" }) });
    if (res.ok) setAttorneys((prev) => prev.map((a) => a.id === id ? { ...a, status: "active" } : a));
    setApprovingId(null);
  }

  async function sendClaimEmail(id: string) {
    setSendingClaimId(id);
    await fetch(`/api/admin/attorneys/${id}/send-claim-email`, { method: "POST" });
    setSendingClaimId(null);
  }

  // ── Derived stats ────────────────────────────────────────────────────────────
  const stats = {
    total: attorneys.length,
    active: attorneys.filter((a) => a.status === "active").length,
    pending: attorneys.filter((a) => a.status === "pending").length,
    suspended: attorneys.filter((a) => a.status === "suspended").length,
    leads: leads.length,
  };

  const pendingAttorneys = attorneys.filter((a) => a.status === "pending");
  const unclaimedAttorneys = attorneys.filter((a) => !a.claimed);
  const webhookCount = attorneys.filter((a) => !!a.webhook_url).length;
  const recentLeads = [...leads].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 8);
  const topAttorneys = [...attorneys].sort((a, b) => b.lead_count - a.lead_count).filter((a) => a.lead_count > 0).slice(0, 5);

  const retainedCount = leads.filter((l) => l.status === "retained").length;
  const closedCount = leads.filter((l) => l.status === "closed").length;
  const retentionRate = leads.length > 0 ? Math.round(((retainedCount + closedCount) / leads.length) * 100) : 0;

  const thisMonth = new Date();
  thisMonth.setDate(1); thisMonth.setHours(0, 0, 0, 0);
  const leadsThisMonth = leads.filter((l) => new Date(l.created_at) >= thisMonth).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-500 flex items-center justify-center"><Scale className="w-[18px] h-[18px] text-white" /></div>
              <span className="font-extrabold text-[17px] tracking-tight text-gray-900 hidden sm:block">Attorney<span className="text-blue-500">Compete</span></span>
            </Link>
            <span className="bg-blue-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wide">Admin</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500 hidden sm:block">{user?.primaryEmailAddress?.emailAddress}</span>
            <div className="h-5 w-px bg-gray-200 hidden sm:block" />
            <UserButton appearance={{ elements: { avatarBox: "w-8 h-8 rounded-xl" } }} />
            <button onClick={() => signOut({ redirectUrl: "/" })} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 transition-colors"><LogOut className="w-3.5 h-3.5" /><span className="hidden sm:block">Sign out</span></button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-8">
        {/* Page header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">CRM Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">Platform overview — attorneys, leads, and business metrics.</p>
          </div>
          <div className="flex gap-2">
            <Link href="/admin/attorneys" className="flex items-center gap-2 border border-gray-200 text-gray-600 font-semibold px-4 py-2 rounded-xl text-sm hover:bg-gray-50 transition-colors">
              <Users className="w-4 h-4" /> Attorneys
            </Link>
            <Link href="/admin/leads" className="flex items-center gap-2 border border-gray-200 text-gray-600 font-semibold px-4 py-2 rounded-xl text-sm hover:bg-gray-50 transition-colors">
              <Inbox className="w-4 h-4" /> Leads
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-32"><div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>
        ) : (
          <div className="space-y-6">
            {/* ── Top stat cards ─────────────────────────────────────────────── */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              <StatCard label="Total Attorneys" value={stats.total}      icon={Users}       color="bg-blue-100 text-blue-600"    href="/admin/attorneys" />
              <StatCard label="Active"          value={stats.active}     icon={CheckCircle} color="bg-green-100 text-green-600"  href="/admin/attorneys?status=active" />
              <StatCard label="Pending"         value={stats.pending}    icon={Clock}       color="bg-yellow-100 text-yellow-600" href="/admin/attorneys?status=pending" />
              <StatCard label="Total Leads"     value={stats.leads}      icon={Inbox}       color="bg-purple-100 text-purple-600" href="/admin/leads" sub={`${leadsThisMonth} this month`} />
              <StatCard label="Retention Rate"  value={`${retentionRate}%`} icon={TrendingUp} color="bg-teal-100 text-teal-600" />
            </div>

            {/* ── Lead pipeline breakdown ─────────────────────────────────────── */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
              <div className="flex items-center gap-2 mb-4">
                <Inbox className="w-4 h-4 text-gray-400" />
                <h2 className="text-sm font-bold text-gray-900">Lead Pipeline</h2>
                <span className="text-xs text-gray-400 ml-1">— {leads.length} total across all attorneys</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
                {LEAD_PIPELINE.map(({ key, label, dot, color, bg }) => {
                  const count = leads.filter((l) => (l.status ?? "new") === key).length;
                  const pct = leads.length > 0 ? Math.round((count / leads.length) * 100) : 0;
                  return (
                    <Link key={key} href={`/admin/leads?status=${key}`}
                      className={`${bg} rounded-xl px-3 py-3 border border-transparent hover:border-blue-200 hover:shadow-sm transition-all group`}>
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className={`w-2 h-2 rounded-full ${dot} shrink-0`} />
                        <span className={`text-xs font-semibold ${color} truncate`}>{label}</span>
                      </div>
                      <p className="text-2xl font-extrabold text-gray-900">{count}</p>
                      <p className="text-[10px] text-gray-400">{pct}% of total</p>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* ── Lead volume chart ───────────────────────────────────────────── */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-4 h-4 text-gray-400" />
                <h2 className="text-sm font-bold text-gray-900">Lead Volume</h2>
                <span className="text-xs text-gray-400 ml-1">— last 30 days</span>
              </div>
              <LeadVolumeChart leads={leads} />
            </div>

            {/* ── Middle row ──────────────────────────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent leads */}
              <div className="lg:col-span-2">
                <SectionCard title="Recent Leads" icon={Inbox} action={<Link href="/admin/leads" className="text-xs text-blue-500 hover:text-blue-700 font-semibold">View all →</Link>}>
                  {recentLeads.length === 0 ? (
                    <p className="text-sm text-gray-400 italic p-5">No leads yet.</p>
                  ) : (
                    <div className="divide-y divide-gray-50">
                      {recentLeads.map((lead) => {
                        const s = LEAD_PIPELINE.find((p) => p.key === (lead.status ?? "new")) ?? LEAD_PIPELINE[0];
                        return (
                          <Link key={lead.id} href={`/admin/leads/${lead.id}`} className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 transition-colors group">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                                <span className="text-xs font-bold text-gray-500">{lead.first_name[0]}{lead.last_name[0]}</span>
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-gray-900 truncate">{lead.first_name} {lead.last_name}</p>
                                <p className="text-xs text-gray-400 truncate">{lead.legal_issue} · {lead.attorney_name ?? "Unassigned"}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 shrink-0 ml-2">
                              <span className={`hidden sm:flex items-center gap-1 text-xs font-semibold ${s.color}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />{s.label}
                              </span>
                              <span className="text-xs text-gray-400 hidden md:block whitespace-nowrap">{fmtShort(lead.created_at)}</span>
                              <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </SectionCard>
              </div>

              {/* Right sidebar */}
              <div className="space-y-5">
                {/* Platform health */}
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 space-y-4">
                  <h2 className="text-sm font-bold text-gray-900">Platform Health</h2>

                  {/* Webhook health */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-600">
                        <Webhook className="w-3.5 h-3.5 text-gray-400" /> Webhook Setup
                      </div>
                      <span className="text-xs font-bold text-gray-700">{webhookCount}/{stats.active} active</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: stats.active > 0 ? `${Math.round((webhookCount / stats.active) * 100)}%` : "0%" }} />
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1">{stats.active - webhookCount} active {stats.active - webhookCount === 1 ? "attorney" : "attorneys"} without a webhook</p>
                  </div>

                  {/* Unclaimed */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-600">
                        <Mail className="w-3.5 h-3.5 text-gray-400" /> Claimed Profiles
                      </div>
                      <span className="text-xs font-bold text-gray-700">{stats.total - unclaimedAttorneys.length}/{stats.total}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full transition-all" style={{ width: stats.total > 0 ? `${Math.round(((stats.total - unclaimedAttorneys.length) / stats.total) * 100)}%` : "0%" }} />
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1">{unclaimedAttorneys.length} unclaimed {unclaimedAttorneys.length === 1 ? "profile" : "profiles"}</p>
                  </div>
                </div>

                {/* Pending approvals */}
                <SectionCard title="Pending Approvals" icon={AlertTriangle}
                  action={pendingAttorneys.length > 0 ? <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">{pendingAttorneys.length}</span> : undefined}>
                  {pendingAttorneys.length === 0 ? (
                    <p className="text-sm text-gray-400 italic p-4">All caught up!</p>
                  ) : (
                    <div className="divide-y divide-gray-50">
                      {pendingAttorneys.map((a) => (
                        <div key={a.id} className="flex items-center justify-between px-4 py-3 gap-2">
                          <Link href={`/admin/attorneys/${a.id}`} className="flex items-center gap-2.5 min-w-0 hover:text-blue-600 transition-colors">
                            {a.photo_url ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={a.photo_url} alt="" className="w-8 h-8 rounded-lg object-cover border border-gray-200 shrink-0" />
                            ) : (
                              <div className="w-8 h-8 rounded-lg bg-yellow-100 flex items-center justify-center shrink-0">
                                <span className="text-yellow-700 font-bold text-xs">{(a.name ?? a.firm ?? "?")[0].toUpperCase()}</span>
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="text-xs font-semibold text-gray-900 truncate">{a.name ?? <span className="italic text-gray-400">No name</span>}</p>
                              <p className="text-[10px] text-gray-400 truncate">{a.firm ?? "—"}</p>
                            </div>
                          </Link>
                          <button
                            onClick={() => approveAttorney(a.id)}
                            disabled={approvingId === a.id}
                            className="shrink-0 text-xs bg-green-500 hover:bg-green-600 disabled:opacity-60 text-white font-bold px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap">
                            {approvingId === a.id ? "…" : "Approve"}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </SectionCard>

                {/* Unclaimed profiles */}
                {unclaimedAttorneys.length > 0 && (
                  <SectionCard title="Unclaimed Profiles" icon={ShieldAlert}
                    action={<span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{unclaimedAttorneys.length}</span>}>
                    <div className="divide-y divide-gray-50 max-h-48 overflow-y-auto">
                      {unclaimedAttorneys.slice(0, 50).map((a) => (
                        <div key={a.id} className="flex items-center justify-between px-4 py-3 gap-2">
                          <Link href={`/admin/attorneys/${a.id}`} className="flex items-center gap-2 min-w-0 hover:text-blue-600 transition-colors">
                            <div className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                              <span className="text-gray-500 font-bold text-xs">{(a.name ?? a.firm ?? "?")[0].toUpperCase()}</span>
                            </div>
                            <p className="text-xs font-semibold text-gray-800 truncate">{a.name ?? a.firm ?? "Unknown"}</p>
                          </Link>
                          {a.outreach_email && (
                            <button onClick={() => sendClaimEmail(a.id)} disabled={sendingClaimId === a.id}
                              className="shrink-0 text-xs text-blue-500 hover:text-blue-700 font-semibold disabled:opacity-50 whitespace-nowrap">
                              {sendingClaimId === a.id ? "Sending…" : "Send Claim"}
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </SectionCard>
                )}
              </div>
            </div>

            {/* ── Top attorneys leaderboard ───────────────────────────────────── */}
            {topAttorneys.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-gray-400" />
                    <h2 className="text-sm font-bold text-gray-900">Top Attorneys by Lead Volume</h2>
                  </div>
                  <Link href="/admin/attorneys" className="text-xs text-blue-500 hover:text-blue-700 font-semibold">View all →</Link>
                </div>
                <div className="divide-y divide-gray-50">
                  {topAttorneys.map((a, i) => {
                    const maxLeads = topAttorneys[0].lead_count;
                    return (
                      <Link key={a.id} href={`/admin/attorneys/${a.id}`} className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-50 transition-colors group">
                        <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-extrabold shrink-0 ${i === 0 ? "bg-yellow-100 text-yellow-700" : i === 1 ? "bg-gray-100 text-gray-600" : i === 2 ? "bg-orange-100 text-orange-700" : "bg-gray-50 text-gray-400"}`}>
                          {i + 1}
                        </span>
                        {a.photo_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={a.photo_url} alt="" className="w-8 h-8 rounded-xl object-cover border border-gray-200 shrink-0" />
                        ) : (
                          <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                            <span className="text-blue-600 font-bold text-sm">{(a.name ?? a.firm ?? "?")[0].toUpperCase()}</span>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">{a.name ?? <span className="italic text-gray-400">No name</span>}</p>
                          <p className="text-xs text-gray-400 truncate">{a.firm ?? "—"}{a.state ? ` · ${a.state}` : ""}</p>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden hidden sm:block">
                            <div className="h-full bg-blue-400 rounded-full" style={{ width: `${Math.round((a.lead_count / maxLeads) * 100)}%` }} />
                          </div>
                          <span className="text-sm font-extrabold text-gray-700 w-8 text-right">{a.lead_count}</span>
                          <StatusPill status={a.status} />
                          <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200 flex items-center justify-between text-xs text-gray-400">
          <p>© 2026 AttorneyCompete · Admin</p>
          <Link href="/attorney-portal" className="hover:text-gray-600 flex items-center gap-1">Attorney Portal <ExternalLink className="w-3 h-3" /></Link>
        </div>
      </div>

      {showAdd && <AddAttorneyModal onClose={() => setShowAdd(false)} onAdded={(a) => { setAttorneys((p) => [a, ...p]); setShowAdd(false); }} />}
    </div>
  );
}
