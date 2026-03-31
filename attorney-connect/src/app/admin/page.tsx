"use client";

import { useEffect, useState } from "react";
import { useAuth, useUser, UserButton } from "@clerk/nextjs";
import {
  Scale, Users, CheckCircle, Clock, XCircle, Inbox,
  ChevronDown, ChevronUp, Search, Plus, Save, Trash2,
  LogOut, Phone, Globe, Mail, FileText, Star,
  AlertCircle, X, ExternalLink,
} from "lucide-react";
import Link from "next/link";

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
  created_at: string; lead_count: number;
};

type AdminLead = {
  id: string; attorney_id: string; attorney_name: string | null; attorney_firm: string | null;
  first_name: string; last_name: string; email: string; phone: string | null;
  legal_issue: string; state: string; message: string | null; sent_to_webhook: boolean; created_at: string;
};

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
function fmtFull(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function StatusPill({ status }: { status: Status }) {
  const map: Record<Status, string> = { active: "bg-green-100 text-green-700", pending: "bg-yellow-100 text-yellow-700", suspended: "bg-red-100 text-red-600" };
  const icons: Record<Status, React.ReactNode> = { active: <CheckCircle className="w-3 h-3" />, pending: <Clock className="w-3 h-3" />, suspended: <XCircle className="w-3 h-3" /> };
  return <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${map[status]}`}>{icons[status]} {status}</span>;
}

function StatCard({ label, value, icon: Icon, color }: { label: string; value: number; icon: React.ElementType; color: string }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex items-center gap-4">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${color}`}><Icon className="w-5 h-5" /></div>
      <div><p className="text-2xl font-extrabold text-gray-900">{value}</p><p className="text-xs text-gray-500 font-medium">{label}</p></div>
    </div>
  );
}

function AddAttorneyModal({ onClose, onAdded }: { onClose: () => void; onAdded: (a: AdminAttorney) => void }) {
  const [form, setForm] = useState({ name: "", firm: "", email: "", phone: "", website: "", status: "active" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setSaving(true); setError("");
    const res = await fetch("/api/admin/attorneys", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    const json = await res.json(); setSaving(false);
    if (!res.ok) { setError(json.error ?? "Failed"); return; }
    onAdded({ ...json.data, lead_count: 0 }); onClose();
  }
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Add Attorney Manually</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {[{ key: "name", label: "Full Name", placeholder: "Jane Smith", required: true }, { key: "firm", label: "Law Firm", placeholder: "Smith & Associates", required: true }, { key: "email", label: "Email", placeholder: "jane@firm.com", required: false }, { key: "phone", label: "Phone", placeholder: "(555) 000-0000", required: false }, { key: "website", label: "Website", placeholder: "yourfirm.com", required: false }].map(({ key, label, placeholder, required }) => (
            <div key={key}>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">{label}</label>
              <input required={required} value={(form as Record<string, string>)[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} placeholder={placeholder} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          ))}
          <div>
            <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Status</label>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="active">Active</option><option value="pending">Pending</option><option value="suspended">Suspended</option>
            </select>
          </div>
          {error && <p className="text-xs text-red-500">{error}</p>}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 border border-gray-200 text-gray-600 font-semibold py-2.5 rounded-xl text-sm hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2.5 rounded-xl text-sm disabled:opacity-60">{saving ? "Adding…" : "Add Attorney"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function DetailPanel({ attorney, leads, onUpdate, onDelete, onClose }: { attorney: AdminAttorney; leads: AdminLead[]; onUpdate: (u: AdminAttorney) => void; onDelete: (id: string) => void; onClose: () => void }) {
  const [fields, setFields] = useState({
    name: attorney.name ?? "", firm: attorney.firm ?? "", email: attorney.email ?? "",
    phone: attorney.phone ?? "", website: attorney.website ?? "", bio: attorney.bio ?? "",
    status: attorney.status, notes: attorney.notes ?? "",
    billing_type: attorney.billing_type ?? "contingency",
    fee_percent: attorney.fee_percent?.toString() ?? "",
    hourly_rate: attorney.hourly_rate?.toString() ?? "",
    flat_fee: attorney.flat_fee?.toString() ?? "",
    city: attorney.city ?? "", state: attorney.state ?? "",
    cases_won: attorney.cases_won?.toString() ?? "",
    total_cases: attorney.total_cases?.toString() ?? "",
    recent_result: attorney.recent_result ?? "",
    recent_result_amount: attorney.recent_result_amount ?? "",
    bar_license: attorney.bar_license ?? "",
    malpractice_insurance: attorney.malpractice_insurance ?? "",
  });
  const [saving, setSaving] = useState(false); const [saved, setSaved] = useState(false); const [confirmDelete, setConfirmDelete] = useState(false); const [deleting, setDeleting] = useState(false);

  async function handleSave() {
    setSaving(true);
    const res = await fetch(`/api/admin/attorneys/${attorney.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({
      ...fields,
      fee_percent: fields.fee_percent ? parseFloat(fields.fee_percent) : null,
      hourly_rate: fields.hourly_rate ? parseFloat(fields.hourly_rate) : null,
      flat_fee: fields.flat_fee ? parseFloat(fields.flat_fee) : null,
      cases_won: fields.cases_won ? parseInt(fields.cases_won) : null,
      total_cases: fields.total_cases ? parseInt(fields.total_cases) : null,
    }) });
    setSaving(false);
    if (res.ok) { const { data } = await res.json(); onUpdate({ ...attorney, ...data }); setSaved(true); setTimeout(() => setSaved(false), 2000); }
  }
  async function handleDelete() { setDeleting(true); await fetch(`/api/admin/attorneys/${attorney.id}`, { method: "DELETE" }); onDelete(attorney.id); }

  const myLeads = leads.filter((l) => l.attorney_id === attorney.id);

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50">
        <div className="flex items-center gap-3">
          {attorney.photo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={attorney.photo_url} alt="" className="w-10 h-10 rounded-xl object-cover border border-gray-200" />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center"><span className="text-blue-600 font-bold text-sm">{(attorney.name ?? attorney.firm ?? "?")[0].toUpperCase()}</span></div>
          )}
          <div><p className="font-bold text-gray-900 text-sm">{attorney.name ?? "—"}</p><p className="text-xs text-gray-500">{attorney.firm ?? "No firm"}</p></div>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100"><X className="w-4 h-4" /></button>
      </div>
      <div className="p-6 space-y-6">
        {/* Status */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Status</label>
          <select value={fields.status} onChange={(e) => setFields({ ...fields, status: e.target.value as Status })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="active">Active</option><option value="pending">Pending</option><option value="suspended">Suspended</option>
          </select>
        </div>

        {/* Basic info */}
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3 border-b border-gray-100 pb-2">Basic Info</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {([{ key: "name", label: "Full Name" }, { key: "firm", label: "Law Firm" }, { key: "email", label: "Email" }, { key: "phone", label: "Phone" }, { key: "website", label: "Website" }, { key: "city", label: "City" }, { key: "state", label: "Display State" }, { key: "bar_license", label: "Bar License" }, { key: "malpractice_insurance", label: "Malpractice Insurance" }] as { key: string; label: string }[]).map(({ key, label }) => (
              <div key={key}>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">{label}</label>
                <input value={(fields as Record<string, string>)[key]} onChange={(e) => setFields({ ...fields, [key]: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            ))}
          </div>
        </div>

        {/* Bio */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Bio</label>
          <textarea rows={3} value={fields.bio} onChange={(e) => setFields({ ...fields, bio: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
        </div>

        {/* Fee Structure */}
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3 border-b border-gray-100 pb-2">Fee Structure</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Billing Type</label>
              <select value={fields.billing_type} onChange={(e) => setFields({ ...fields, billing_type: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="contingency">Contingency</option>
                <option value="hourly">Hourly</option>
                <option value="flat">Flat Fee</option>
              </select>
            </div>
            {fields.billing_type === "contingency" && (
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Fee % (e.g. 28)</label>
                <input type="number" value={fields.fee_percent} onChange={(e) => setFields({ ...fields, fee_percent: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            )}
            {fields.billing_type === "hourly" && (
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Hourly Rate ($)</label>
                <input type="number" value={fields.hourly_rate} onChange={(e) => setFields({ ...fields, hourly_rate: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            )}
            {fields.billing_type === "flat" && (
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Flat Fee ($)</label>
                <input type="number" value={fields.flat_fee} onChange={(e) => setFields({ ...fields, flat_fee: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            )}
          </div>
        </div>

        {/* Case Results */}
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3 border-b border-gray-100 pb-2">Case Results</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Cases Won</label>
              <input type="number" value={fields.cases_won} onChange={(e) => setFields({ ...fields, cases_won: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Total Cases</label>
              <input type="number" value={fields.total_cases} onChange={(e) => setFields({ ...fields, total_cases: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Recent Result</label>
              <input value={fields.recent_result} onChange={(e) => setFields({ ...fields, recent_result: e.target.value })} placeholder="e.g. Personal Injury Settlement" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Recent Result Amount</label>
              <input value={fields.recent_result_amount} onChange={(e) => setFields({ ...fields, recent_result_amount: e.target.value })} placeholder="e.g. $1.2M" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
          </div>
        </div>

        {/* Practice areas & states (read + display) */}
        {(attorney.practice_areas?.length || attorney.licensed_states?.length) ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {attorney.practice_areas?.length ? <div><p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Practice Areas</p><div className="flex flex-wrap gap-1.5">{attorney.practice_areas.map((a) => <span key={a} className="text-xs bg-blue-50 text-blue-600 border border-blue-100 px-2 py-0.5 rounded-full">{a}</span>)}</div></div> : null}
            {attorney.licensed_states?.length ? <div><p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Licensed States</p><div className="flex flex-wrap gap-1.5">{attorney.licensed_states.map((s) => <span key={s} className="text-xs bg-gray-100 text-gray-600 border border-gray-200 px-2 py-0.5 rounded-full">{s}</span>)}</div></div> : null}
          </div>
        ) : null}

        {/* Admin Notes */}
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Admin Notes</label>
          <textarea rows={2} value={fields.notes} onChange={(e) => setFields({ ...fields, notes: e.target.value })} placeholder="Internal notes about this attorney…" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-60 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors"><Save className="w-4 h-4" />{saved ? "Saved!" : saving ? "Saving…" : "Save Changes"}</button>
          {!confirmDelete ? <button onClick={() => setConfirmDelete(true)} className="flex items-center gap-2 border border-red-200 text-red-500 hover:bg-red-50 font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors"><Trash2 className="w-4 h-4" />Delete</button> : <div className="flex items-center gap-2"><span className="text-xs text-red-500 font-semibold">Confirm delete?</span><button onClick={handleDelete} disabled={deleting} className="text-xs bg-red-500 text-white font-bold px-3 py-1.5 rounded-lg">{deleting ? "Deleting…" : "Yes, delete"}</button><button onClick={() => setConfirmDelete(false)} className="text-xs text-gray-500 px-2">Cancel</button></div>}
        </div>
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Leads Sent ({myLeads.length})</p>
          {myLeads.length === 0 ? <p className="text-sm text-gray-400 italic">No leads sent to this attorney yet.</p> : (
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200"><tr>{["Date", "Client", "Issue", "State", "Webhook"].map((h) => <th key={h} className="text-left text-xs font-semibold text-gray-500 px-4 py-2.5 uppercase tracking-wide">{h}</th>)}</tr></thead>
                <tbody className="divide-y divide-gray-100">
                  {myLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{fmt(lead.created_at)}</td>
                      <td className="px-4 py-3 font-medium text-gray-900 text-sm">{lead.first_name} {lead.last_name}</td>
                      <td className="px-4 py-3 text-gray-600 text-sm">{lead.legal_issue}</td>
                      <td className="px-4 py-3 text-gray-600 text-sm">{lead.state}</td>
                      <td className="px-4 py-3"><span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${lead.sent_to_webhook ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>{lead.sent_to_webhook ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}{lead.sent_to_webhook ? "Sent" : "Pending"}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AttorneysTab({ attorneys, leads, onUpdate, onDelete, onAdded }: { attorneys: AdminAttorney[]; leads: AdminLead[]; onUpdate: (a: AdminAttorney) => void; onDelete: (id: string) => void; onAdded: (a: AdminAttorney) => void }) {
  const [search, setSearch] = useState(""); const [statusFilter, setStatusFilter] = useState<"all" | Status>("all"); const [selected, setSelected] = useState<AdminAttorney | null>(null); const [showAdd, setShowAdd] = useState(false);
  const filtered = attorneys.filter((a) => { const q = search.toLowerCase(); return (!q || (a.name ?? "").toLowerCase().includes(q) || (a.firm ?? "").toLowerCase().includes(q) || (a.email ?? "").toLowerCase().includes(q)) && (statusFilter === "all" || a.status === statusFilter); });
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, firm, or email…" className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as "all" | Status)} className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"><option value="all">All statuses</option><option value="active">Active</option><option value="pending">Pending</option><option value="suspended">Suspended</option></select>
        <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-colors whitespace-nowrap"><Plus className="w-4 h-4" />Add Attorney</button>
      </div>
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200"><tr>{["Attorney", "Status", "Leads", "Fee %", "Joined", ""].map((h) => <th key={h} className="text-left text-xs font-semibold text-gray-500 px-5 py-3.5 uppercase tracking-wide">{h}</th>)}</tr></thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.length === 0 ? <tr><td colSpan={6} className="text-center py-12 text-gray-400 text-sm">No attorneys found.</td></tr> : filtered.map((a) => (
              <tr key={a.id} onClick={() => setSelected(selected?.id === a.id ? null : a)} className={`cursor-pointer transition-colors ${selected?.id === a.id ? "bg-blue-50" : "hover:bg-gray-50"}`}>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    {a.photo_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={a.photo_url} alt="" className="w-9 h-9 rounded-xl object-cover border border-gray-200 shrink-0" />
                    ) : <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center shrink-0"><span className="text-blue-600 font-bold text-sm">{(a.name ?? a.firm ?? "?")[0].toUpperCase()}</span></div>}
                    <div><p className="font-semibold text-gray-900 text-sm">{a.name ?? <span className="text-gray-400 italic">No name</span>}</p><p className="text-xs text-gray-500">{a.firm ?? "—"}</p></div>
                  </div>
                </td>
                <td className="px-5 py-4"><StatusPill status={a.status} /></td>
                <td className="px-5 py-4"><span className="inline-flex items-center gap-1 text-sm font-semibold text-gray-700"><Inbox className="w-3.5 h-3.5 text-gray-400" />{a.lead_count}</span></td>
                <td className="px-5 py-4 text-sm text-gray-600">{a.fee_percent != null ? `${a.fee_percent}%` : <span className="text-gray-300">—</span>}</td>
                <td className="px-5 py-4 text-sm text-gray-500 whitespace-nowrap">{fmt(a.created_at)}</td>
                <td className="px-5 py-4 text-gray-400">{selected?.id === a.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selected && <DetailPanel attorney={selected} leads={leads} onUpdate={(u) => { onUpdate(u); setSelected(u); }} onDelete={(id) => { onDelete(id); setSelected(null); }} onClose={() => setSelected(null)} />}
      {showAdd && <AddAttorneyModal onClose={() => setShowAdd(false)} onAdded={(a) => { onAdded(a); setShowAdd(false); }} />}
    </div>
  );
}

function LeadsTab({ leads, attorneys }: { leads: AdminLead[]; attorneys: AdminAttorney[] }) {
  const [search, setSearch] = useState(""); const [attorneyFilter, setAttorneyFilter] = useState("all"); const [expanded, setExpanded] = useState<string | null>(null);
  const filtered = leads.filter((l) => { const q = search.toLowerCase(); return (!q || `${l.first_name} ${l.last_name}`.toLowerCase().includes(q) || l.email.toLowerCase().includes(q) || l.legal_issue.toLowerCase().includes(q)) && (attorneyFilter === "all" || l.attorney_id === attorneyFilter); });
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by client name, email, or legal issue…" className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
        <select value={attorneyFilter} onChange={(e) => setAttorneyFilter(e.target.value)} className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"><option value="all">All attorneys</option>{attorneys.map((a) => <option key={a.id} value={a.id}>{a.name ?? a.firm ?? a.id}</option>)}</select>
      </div>
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200"><tr>{["Date", "Client", "Legal Issue", "State", "Attorney", "Webhook", ""].map((h) => <th key={h} className="text-left text-xs font-semibold text-gray-500 px-5 py-3.5 uppercase tracking-wide">{h}</th>)}</tr></thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.length === 0 ? <tr><td colSpan={7} className="text-center py-12 text-gray-400 text-sm">No leads found.</td></tr> : filtered.map((lead) => (
              <>
                <tr key={lead.id} onClick={() => setExpanded(expanded === lead.id ? null : lead.id)} className={`cursor-pointer transition-colors ${expanded === lead.id ? "bg-blue-50" : "hover:bg-gray-50"}`}>
                  <td className="px-5 py-4 text-xs text-gray-500 whitespace-nowrap">{fmtFull(lead.created_at)}</td>
                  <td className="px-5 py-4"><p className="font-semibold text-gray-900 text-sm">{lead.first_name} {lead.last_name}</p><p className="text-xs text-gray-500">{lead.email}</p></td>
                  <td className="px-5 py-4 text-sm text-gray-700">{lead.legal_issue}</td>
                  <td className="px-5 py-4 text-sm text-gray-600">{lead.state}</td>
                  <td className="px-5 py-4 text-sm text-gray-700">{lead.attorney_name ?? <span className="text-gray-400 italic">Unknown</span>}</td>
                  <td className="px-5 py-4"><span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${lead.sent_to_webhook ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>{lead.sent_to_webhook ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}{lead.sent_to_webhook ? "Sent" : "Pending"}</span></td>
                  <td className="px-5 py-4 text-gray-400">{expanded === lead.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}</td>
                </tr>
                {expanded === lead.id && (
                  <tr key={`${lead.id}-detail`} className="bg-blue-50/50">
                    <td colSpan={7} className="px-8 py-5">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                        <div><p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Phone</p><p className="text-gray-900">{lead.phone ?? "—"}</p></div>
                        <div><p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Attorney Firm</p><p className="text-gray-900">{lead.attorney_firm ?? "—"}</p></div>
                        <div><p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Lead ID</p><p className="text-gray-500 font-mono text-xs">{lead.id}</p></div>
                        {lead.message && <div className="sm:col-span-3"><p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Message</p><p className="text-gray-700 leading-relaxed">{lead.message}</p></div>}
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

type Tab = "attorneys" | "leads";

export default function AdminPage() {
  const { user } = useUser(); const { signOut } = useAuth();
  const [tab, setTab] = useState<Tab>("attorneys");
  const [attorneys, setAttorneys] = useState<AdminAttorney[]>([]);
  const [leads, setLeads] = useState<AdminLead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetch("/api/admin/attorneys").then((r) => r.json()), fetch("/api/admin/leads").then((r) => r.json())]).then(([aRes, lRes]) => { setAttorneys(aRes.data ?? []); setLeads(lRes.data ?? []); setLoading(false); });
  }, []);

  const stats = { total: attorneys.length, active: attorneys.filter((a) => a.status === "active").length, pending: attorneys.filter((a) => a.status === "pending").length, suspended: attorneys.filter((a) => a.status === "suspended").length, leads: leads.length };

  return (
    <div className="min-h-screen bg-gray-50">
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
        <div className="mb-8"><h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">CRM Dashboard</h1><p className="text-gray-500 text-sm mt-1">Manage attorneys, view leads, and track your platform.</p></div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          <StatCard label="Total Attorneys" value={stats.total} icon={Users} color="bg-blue-100 text-blue-600" />
          <StatCard label="Active" value={stats.active} icon={CheckCircle} color="bg-green-100 text-green-600" />
          <StatCard label="Pending" value={stats.pending} icon={Clock} color="bg-yellow-100 text-yellow-600" />
          <StatCard label="Suspended" value={stats.suspended} icon={XCircle} color="bg-red-100 text-red-500" />
          <StatCard label="Total Leads" value={stats.leads} icon={Inbox} color="bg-purple-100 text-purple-600" />
        </div>
        <div className="flex gap-1 bg-white border border-gray-200 shadow-sm rounded-2xl p-1.5 mb-6 w-fit">
          {([{ id: "attorneys" as Tab, label: "Attorneys", count: stats.total }, { id: "leads" as Tab, label: "Leads", count: stats.leads }]).map(({ id, label, count }) => (
            <button key={id} onClick={() => setTab(id)} className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold transition-all ${tab === id ? "bg-blue-500 text-white shadow" : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"}`}>
              {label}<span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${tab === id ? "bg-white/20 text-white" : "bg-gray-200 text-gray-500"}`}>{count}</span>
            </button>
          ))}
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-24"><div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>
        ) : tab === "attorneys" ? (
          <AttorneysTab attorneys={attorneys} leads={leads} onUpdate={(u) => setAttorneys((p) => p.map((a) => a.id === u.id ? { ...a, ...u } : a))} onDelete={(id) => setAttorneys((p) => p.filter((a) => a.id !== id))} onAdded={(a) => setAttorneys((p) => [a, ...p])} />
        ) : (
          <LeadsTab leads={leads} attorneys={attorneys} />
        )}
        <div className="mt-12 pt-8 border-t border-gray-200 flex items-center justify-between text-xs text-gray-400">
          <p>© 2026 AttorneyCompete · Admin</p>
          <Link href="/attorney-portal" className="hover:text-gray-600 flex items-center gap-1">Attorney Portal <ExternalLink className="w-3 h-3" /></Link>
        </div>
      </div>
    </div>
  );
}
