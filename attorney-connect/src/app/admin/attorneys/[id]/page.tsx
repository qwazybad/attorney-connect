"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Scale, ArrowLeft, Save, Trash2, Send, BadgeCheck, Clock,
  ChevronRight, CheckCircle, ExternalLink, FolderOpen,
} from "lucide-react";
import { DocumentsPanel } from "@/components/shared/DocumentsPanel";
import { LEGAL_ISSUES, US_STATES } from "@/lib/data";

type LeadStatus = "new" | "attempting_contact" | "contacted" | "retained" | "in_progress" | "settlement" | "closed" | "lost";

type AdminAttorney = {
  id: string; name: string | null; firm: string | null; bio: string | null;
  phone: string | null; website: string | null; email: string | null;
  photo_url: string | null; webhook_url: string | null;
  status: "unclaimed" | "claimed_pending" | "active" | "suspended";
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
  id: string; first_name: string; last_name: string; email: string; phone: string | null;
  legal_issue: string; state: string; status: LeadStatus | null; created_at: string;
};

const LEAD_STATUSES: Record<string, { label: string; color: string }> = {
  new:                { label: "New Lead",              color: "text-blue-700 bg-blue-50 border-blue-200" },
  attempting_contact: { label: "Attempting Contact",    color: "text-amber-700 bg-amber-50 border-amber-200" },
  contacted:          { label: "Contacted",             color: "text-orange-700 bg-orange-50 border-orange-200" },
  retained:           { label: "Retained",              color: "text-purple-700 bg-purple-50 border-purple-200" },
  in_progress:        { label: "In Progress",           color: "text-indigo-700 bg-indigo-50 border-indigo-200" },
  settlement:         { label: "Settlement",            color: "text-teal-700 bg-teal-50 border-teal-200" },
  closed:             { label: "Closed / Won",          color: "text-green-700 bg-green-50 border-green-200" },
  lost:               { label: "Lost",                  color: "text-gray-500 bg-gray-50 border-gray-200" },
};

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

const inp = "w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500";
const lbl = "block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5";

type Tab = "profile" | "leads" | "documents";

export default function AttorneyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [attorney, setAttorney] = useState<AdminAttorney | null>(null);
  const [leads, setLeads] = useState<AdminLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("profile");

  // Edit state
  const [fields, setFields] = useState<Record<string, string>>({});
  const [practiceAreas, setPracticeAreas] = useState<string[]>([]);
  const [licensedStates, setLicensedStates] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [emailError, setEmailError] = useState("");

  useEffect(() => {
    Promise.all([
      fetch(`/api/admin/attorneys/${id}`).then((r) => r.json()),
      fetch(`/api/admin/leads?attorney_id=${id}`).then((r) => r.json()),
    ]).then(([aRes, lRes]) => {
      const a: AdminAttorney = aRes.data;
      if (a) {
        setAttorney(a);
        setFields({
          name: a.name ?? "", firm: a.firm ?? "", email: a.email ?? "",
          phone: a.phone ?? "", website: a.website ?? "", bio: a.bio ?? "",
          status: a.status, notes: a.notes ?? "",
          billing_type: a.billing_type ?? "contingency",
          fee_percent: a.fee_percent?.toString() ?? "",
          hourly_rate: a.hourly_rate?.toString() ?? "",
          flat_fee: a.flat_fee?.toString() ?? "",
          city: a.city ?? "", state: a.state ?? "",
          cases_won: a.cases_won?.toString() ?? "",
          total_cases: a.total_cases?.toString() ?? "",
          recent_result: a.recent_result ?? "",
          recent_result_amount: a.recent_result_amount ?? "",
          bar_license: a.bar_license ?? "",
          malpractice_insurance: a.malpractice_insurance ?? "",
          response_time_hours: a.response_time_hours?.toString() ?? "",
          outreach_email: a.outreach_email ?? "",
        });
        setPracticeAreas(a.practice_areas ?? []);
        setLicensedStates(a.licensed_states ?? []);
      }
      // Filter leads client-side from full list
      const allLeads: (AdminLead & { attorney_id: string })[] = lRes.data ?? [];
      setLeads(allLeads.filter((l) => l.attorney_id === id));
      setLoading(false);
    });
  }, [id]);

  async function handleSave() {
    setSaving(true);
    const res = await fetch(`/api/admin/attorneys/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...fields,
        practice_areas: practiceAreas,
        licensed_states: licensedStates,
        fee_percent: fields.fee_percent ? parseFloat(fields.fee_percent) : null,
        hourly_rate: fields.hourly_rate ? parseFloat(fields.hourly_rate) : null,
        flat_fee: fields.flat_fee ? parseFloat(fields.flat_fee) : null,
        cases_won: fields.cases_won ? parseInt(fields.cases_won) : null,
        total_cases: fields.total_cases ? parseInt(fields.total_cases) : null,
        response_time_hours: fields.response_time_hours ? parseFloat(fields.response_time_hours) : null,
      }),
    });
    setSaving(false);
    if (res.ok) {
      const { data } = await res.json();
      setAttorney((prev) => prev ? { ...prev, ...data } : prev);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    await fetch(`/api/admin/attorneys/${id}`, { method: "DELETE" });
    window.location.href = "/admin";
  }

  async function handleSendClaimEmail() {
    setSendingEmail(true); setEmailError("");
    const res = await fetch(`/api/admin/attorneys/${id}/send-claim-email`, { method: "POST" });
    setSendingEmail(false);
    if (res.ok) { setEmailSent(true); setTimeout(() => setEmailSent(false), 4000); }
    else { const j = await res.json(); setEmailError(j.error ?? "Failed to send"); }
  }

  function field(key: string, label: string, type = "text") {
    return (
      <div key={key}>
        <label className={lbl}>{label}</label>
        <input type={type} value={fields[key] ?? ""} onChange={(e) => setFields((p) => ({ ...p, [key]: e.target.value }))} className={inp} />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!attorney) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-3">
        <p className="text-gray-500">Attorney not found.</p>
        <Link href="/admin" className="text-blue-500 text-sm hover:underline">Back to admin</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-500 flex items-center justify-center">
                <Scale className="w-[18px] h-[18px] text-white" />
              </div>
              <span className="font-extrabold text-[17px] tracking-tight text-gray-900 hidden sm:block">
                Attorney<span className="text-blue-500">Compete</span>
              </span>
            </Link>
            <span className="bg-blue-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wide">Admin</span>
          </div>
          <Link href="/admin" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Dashboard
          </Link>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-5 sm:px-8 py-8">
        {/* Attorney header card */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {attorney.photo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={attorney.photo_url} alt="" className="w-16 h-16 rounded-2xl object-cover border border-gray-200 shrink-0" />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center shrink-0">
                  <span className="text-blue-600 font-extrabold text-xl">{(attorney.name ?? attorney.firm ?? "?")[0].toUpperCase()}</span>
                </div>
              )}
              <div>
                <h1 className="text-2xl font-extrabold text-gray-900">{attorney.name ?? <span className="text-gray-400 italic">No name</span>}</h1>
                <p className="text-sm text-gray-500 mt-0.5">{attorney.firm ?? "No firm"}{attorney.city ? ` · ${attorney.city}, ${attorney.state ?? ""}` : ""}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                    attorney.status === "active" ? "bg-green-100 text-green-700" :
                    attorney.status === "claimed_pending" ? "bg-yellow-100 text-yellow-700" :
                    attorney.status === "unclaimed" ? "bg-gray-100 text-gray-500" :
                    "bg-red-100 text-red-600"
                  }`}>
                    {{ unclaimed: "Unclaimed", claimed_pending: "Claimed · Pending", active: "Active", suspended: "Suspended" }[attorney.status]}
                  </span>
                  {attorney.claimed
                    ? <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600"><BadgeCheck className="w-3.5 h-3.5" />Claimed</span>
                    : <span className="flex items-center gap-1 text-xs font-semibold text-amber-600"><Clock className="w-3.5 h-3.5" />Unclaimed</span>
                  }
                  <span className="text-xs text-gray-400">{attorney.lead_count} leads</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Link href={`/attorney/${attorney.id}`} target="_blank" className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-blue-600 border border-gray-200 rounded-lg px-3 py-2 hover:border-blue-300 transition-colors">
                <ExternalLink className="w-3.5 h-3.5" /> Public Profile
              </Link>
              {!attorney.claimed && (
                <div className="flex items-center gap-2">
                  {emailError && <span className="text-xs text-red-500">{emailError}</span>}
                  {emailSent && <span className="text-xs text-emerald-600 font-semibold">Email sent!</span>}
                  <button
                    onClick={handleSendClaimEmail}
                    disabled={sendingEmail || !attorney.outreach_email}
                    title={!attorney.outreach_email ? "No outreach email set" : "Send claim email"}
                    className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white text-xs font-bold px-3 py-2 rounded-lg transition-colors"
                  >
                    <Send className="w-3 h-3" />
                    {sendingEmail ? "Sending…" : "Send Claim Email"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white border border-gray-200 shadow-sm rounded-2xl p-1.5 mb-6 w-fit">
          {([{ id: "profile" as Tab, label: "Profile", count: null }, { id: "leads" as Tab, label: "Leads", count: leads.length }, { id: "documents" as Tab, label: "Documents", count: null }]).map(({ id: tid, label, count }) => (
            <button
              key={tid}
              onClick={() => setTab(tid)}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold transition-all ${tab === tid ? "bg-blue-500 text-white shadow" : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"}`}
            >
              {label}
              {count !== null && (
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${tab === tid ? "bg-white/20 text-white" : "bg-gray-200 text-gray-500"}`}>{count}</span>
              )}
            </button>
          ))}
        </div>

        {tab === "profile" && (
          <div className="space-y-6">
            {/* Status */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Status</p>
              <select value={fields.status} onChange={(e) => setFields((p) => ({ ...p, status: e.target.value }))} className={inp} style={{ maxWidth: 240 }}>
                <option value="unclaimed">Unclaimed</option>
                <option value="claimed_pending">Claimed · Pending</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>

            {/* Basic Info */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Basic Info</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {field("name", "Full Name")}
                {field("firm", "Law Firm")}
                {field("email", "Email")}
                {field("outreach_email", "Outreach Email")}
                {field("phone", "Phone")}
                {field("website", "Website")}
                {field("city", "City")}
                <div>
                  <label className={lbl}>State</label>
                  <select value={fields.state ?? ""} onChange={(e) => setFields((p) => ({ ...p, state: e.target.value }))} className={inp}>
                    <option value="">Select state</option>
                    {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                {field("bar_license", "Bar License")}
                {field("malpractice_insurance", "Malpractice Insurance")}
              </div>
              <div className="mt-4">
                <label className={lbl}>Bio</label>
                <textarea rows={4} value={fields.bio ?? ""} onChange={(e) => setFields((p) => ({ ...p, bio: e.target.value }))} className={`${inp} resize-none`} />
              </div>
            </div>

            {/* Fee Structure */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Fee Structure</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={lbl}>Billing Type</label>
                  <select value={fields.billing_type ?? "contingency"} onChange={(e) => setFields((p) => ({ ...p, billing_type: e.target.value }))} className={inp}>
                    <option value="contingency">Contingency</option>
                    <option value="hourly">Hourly</option>
                    <option value="flat">Flat Fee</option>
                  </select>
                </div>
                {fields.billing_type === "contingency" && field("fee_percent", "Fee % (e.g. 28)", "number")}
                {fields.billing_type === "hourly" && field("hourly_rate", "Hourly Rate ($)", "number")}
                {fields.billing_type === "flat" && field("flat_fee", "Flat Fee ($)", "number")}
              </div>
            </div>

            {/* Case Results */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Case Results</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {field("cases_won", "Cases Won", "number")}
                {field("total_cases", "Total Cases", "number")}
                {field("recent_result", "Recent Result")}
                {field("recent_result_amount", "Recent Result Amount")}
              </div>
            </div>

            {/* Response Time */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Response Time</p>
              <div className="flex flex-wrap gap-2">
                {[{ label: "Under 1 hr", value: "0.5" }, { label: "1–2 hrs", value: "1" }, { label: "Same day", value: "4" }, { label: "24 hrs", value: "24" }, { label: "1–2 days", value: "48" }].map(({ label, value }) => (
                  <button key={value} type="button" onClick={() => setFields((p) => ({ ...p, response_time_hours: value }))}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${fields.response_time_hours === value ? "bg-blue-500 text-white border-blue-500" : "bg-gray-50 text-gray-600 border-gray-200 hover:border-blue-300"}`}>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Practice Areas */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Practice Areas ({practiceAreas.length} selected)</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1.5">
                {LEGAL_ISSUES.map((issue) => (
                  <button key={issue.value} type="button"
                    onClick={() => setPracticeAreas((prev) => prev.includes(issue.label) ? prev.filter((a) => a !== issue.label) : [...prev, issue.label])}
                    className={`text-xs px-3 py-2 rounded-lg border font-medium text-left transition-colors ${practiceAreas.includes(issue.label) ? "bg-blue-500 text-white border-blue-500" : "bg-gray-50 text-gray-600 border-gray-200 hover:border-blue-300"}`}>
                    {issue.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Licensed States */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Licensed States ({licensedStates.length} selected)</p>
              <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-8 gap-1.5">
                {US_STATES.map((s) => (
                  <button key={s} type="button"
                    onClick={() => setLicensedStates((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s])}
                    className={`text-xs px-2 py-1.5 rounded-lg border font-medium transition-colors ${licensedStates.includes(s) ? "bg-blue-500 text-white border-blue-500" : "bg-gray-50 text-gray-600 border-gray-200 hover:border-blue-300"}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Admin Notes */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Admin Notes</p>
              <textarea rows={3} value={fields.notes ?? ""} onChange={(e) => setFields((p) => ({ ...p, notes: e.target.value }))} placeholder="Internal notes about this attorney…" className={`${inp} resize-none`} />
            </div>

            {/* Save / Delete */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 flex items-center gap-3 flex-wrap">
              <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-60 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-colors">
                <Save className="w-4 h-4" />{saved ? "Saved!" : saving ? "Saving…" : "Save Changes"}
              </button>
              {!confirmDelete
                ? <button onClick={() => setConfirmDelete(true)} className="flex items-center gap-2 border border-red-200 text-red-500 hover:bg-red-50 font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"><Trash2 className="w-4 h-4" />Delete Attorney</button>
                : (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-red-500 font-semibold">Confirm delete?</span>
                    <button onClick={handleDelete} disabled={deleting} className="text-xs bg-red-500 text-white font-bold px-3 py-1.5 rounded-lg">{deleting ? "Deleting…" : "Yes, delete"}</button>
                    <button onClick={() => setConfirmDelete(false)} className="text-xs text-gray-500 px-2">Cancel</button>
                  </div>
                )
              }
            </div>
          </div>
        )}

        {tab === "leads" && (
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            {leads.length === 0 ? (
              <div className="py-16 text-center text-gray-400 text-sm italic">No leads for this attorney yet.</div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {["Date", "Client", "Legal Issue", "State", "Status", ""].map((h) => (
                      <th key={h} className="text-left text-xs font-semibold text-gray-500 px-5 py-3.5 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {leads.map((lead) => {
                    const s = LEAD_STATUSES[lead.status ?? "new"] ?? LEAD_STATUSES.new;
                    return (
                      <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-4 text-xs text-gray-500 whitespace-nowrap">{fmt(lead.created_at)}</td>
                        <td className="px-5 py-4">
                          <p className="font-semibold text-gray-900 text-sm">{lead.first_name} {lead.last_name}</p>
                          <p className="text-xs text-gray-500">{lead.email}</p>
                        </td>
                        <td className="px-5 py-4 text-sm text-gray-700">{lead.legal_issue}</td>
                        <td className="px-5 py-4 text-sm text-gray-600">{lead.state}</td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full border ${s.color}`}>
                            <CheckCircle className="w-3 h-3" />{s.label}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <Link href={`/admin/leads/${lead.id}`} className="flex items-center gap-1 text-xs font-semibold text-blue-500 hover:text-blue-700 whitespace-nowrap">
                            View <ChevronRight className="w-3.5 h-3.5" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        )}

        {tab === "documents" && (
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
            <div className="flex items-center gap-2 mb-5">
              <FolderOpen className="w-5 h-5 text-gray-400" />
              <div>
                <h2 className="text-sm font-bold text-gray-900">Attorney Documents</h2>
                <p className="text-xs text-gray-400 mt-0.5">Onboarding agreements, signed contracts, licenses, and other attorney-level files.</p>
              </div>
            </div>
            <DocumentsPanel attorneyId={id} canUpload canDelete />
          </div>
        )}
      </div>
    </div>
  );
}
