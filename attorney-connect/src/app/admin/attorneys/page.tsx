"use client";

import { useEffect, useState, Suspense } from "react";
import { useUser, useAuth, UserButton } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Scale, Users, CheckCircle, Clock, XCircle, Inbox,
  Search, Plus, LogOut, X, ChevronDown, ArrowLeft,
} from "lucide-react";
import { LEGAL_ISSUES, US_STATES } from "@/lib/data";

type Status = "unclaimed" | "claimed_pending" | "active" | "suspended";

const STATUS_LABELS: Record<Status, string> = {
  unclaimed: "Unclaimed",
  claimed_pending: "Claimed · Pending",
  active: "Active",
  suspended: "Suspended",
};

type AdminAttorney = {
  id: string; name: string | null; firm: string | null; bio: string | null;
  phone: string | null; website: string | null; email: string | null;
  photo_url: string | null; webhook_url: string | null; status: Status;
  notes: string | null; practice_areas: string[] | null; licensed_states: string[] | null;
  billing_type: string | null; fee_percent: number | null; hourly_rate: number | null; flat_fee: number | null;
  city: string | null; state: string | null;
  outreach_email: string | null; created_at: string; lead_count: number;
};

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function StatusPill({ status }: { status: Status }) {
  const map: Record<Status, string> = {
    unclaimed:       "bg-gray-100 text-gray-500",
    claimed_pending: "bg-yellow-100 text-yellow-700",
    active:          "bg-green-100 text-green-700",
    suspended:       "bg-red-100 text-red-600",
  };
  const icons: Record<Status, React.ReactNode> = {
    unclaimed:       <Inbox className="w-3 h-3" />,
    claimed_pending: <Clock className="w-3 h-3" />,
    active:          <CheckCircle className="w-3 h-3" />,
    suspended:       <XCircle className="w-3 h-3" />,
  };
  return <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${map[status]}`}>{icons[status]} {STATUS_LABELS[status]}</span>;
}

function AddAttorneyModal({ onClose, onAdded }: { onClose: () => void; onAdded: (a: AdminAttorney) => void }) {
  const [form, setForm] = useState({
    name: "", firm: "", outreach_email: "", phone: "", website: "",
    city: "", state: "", billing_type: "contingency",
    fee_percent: "", hourly_rate: "", flat_fee: "", status: "active",
  });
  const [practiceAreas, setPracticeAreas] = useState<string[]>([]);
  const [licensedStates, setLicensedStates] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setSaving(true); setError("");
    const payload = {
      ...form, email: form.outreach_email,
      fee_percent: form.fee_percent ? parseFloat(form.fee_percent) : null,
      hourly_rate: form.hourly_rate ? parseFloat(form.hourly_rate) : null,
      flat_fee: form.flat_fee ? parseFloat(form.flat_fee) : null,
      practice_areas: practiceAreas, licensed_states: licensedStates,
    };
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
          <div>
            <h2 className="text-lg font-bold text-gray-900">Seed Attorney Profile</h2>
            <p className="text-xs text-gray-500 mt-0.5">Profile goes live immediately. Send a claim email so they can take ownership.</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {([{ key: "name", label: "Full Name *", placeholder: "Jane Smith" }, { key: "firm", label: "Law Firm *", placeholder: "Smith & Associates" }, { key: "outreach_email", label: "Outreach Email", placeholder: "jane@smithlaw.com" }, { key: "phone", label: "Phone", placeholder: "(555) 000-0000" }, { key: "city", label: "City", placeholder: "Los Angeles" }] as { key: string; label: string; placeholder: string }[]).map(({ key, label, placeholder }) => (
              <div key={key}>
                <label className={lbl}>{label}</label>
                <input required={label.includes("*")} value={(form as Record<string, string>)[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} placeholder={placeholder} className={inp} />
              </div>
            ))}
            <div>
              <label className={lbl}>State</label>
              <select value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} className={inp}>
                <option value="">Select state</option>
                {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3 border-b border-gray-100 pb-2">Fee Structure</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={lbl}>Billing Type</label>
                <select value={form.billing_type} onChange={(e) => setForm({ ...form, billing_type: e.target.value })} className={inp}>
                  <option value="contingency">Contingency</option><option value="hourly">Hourly</option><option value="flat">Flat Fee</option>
                </select>
              </div>
              {form.billing_type === "contingency" && <div><label className={lbl}>Fee %</label><input type="number" value={form.fee_percent} onChange={(e) => setForm({ ...form, fee_percent: e.target.value })} placeholder="28" className={inp} /></div>}
              {form.billing_type === "hourly" && <div><label className={lbl}>Hourly Rate ($)</label><input type="number" value={form.hourly_rate} onChange={(e) => setForm({ ...form, hourly_rate: e.target.value })} placeholder="300" className={inp} /></div>}
              {form.billing_type === "flat" && <div><label className={lbl}>Flat Fee ($)</label><input type="number" value={form.flat_fee} onChange={(e) => setForm({ ...form, flat_fee: e.target.value })} placeholder="2500" className={inp} /></div>}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3 border-b border-gray-100 pb-2">Practice Areas ({practiceAreas.length} selected)</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {LEGAL_ISSUES.map((issue) => (
                <button key={issue.value} type="button" onClick={() => setPracticeAreas((prev) => prev.includes(issue.label) ? prev.filter((a) => a !== issue.label) : [...prev, issue.label])}
                  className={`text-xs px-3 py-2 rounded-lg border font-medium text-left transition-colors ${practiceAreas.includes(issue.label) ? "bg-blue-500 text-white border-blue-500" : "bg-gray-50 text-gray-600 border-gray-200 hover:border-blue-300"}`}>
                  {issue.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3 border-b border-gray-100 pb-2">Licensed States ({licensedStates.length} selected)</p>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5 max-h-40 overflow-y-auto">
              {US_STATES.map((s) => (
                <button key={s} type="button" onClick={() => setLicensedStates((prev) => prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s])}
                  className={`text-xs px-2 py-1.5 rounded-lg border font-medium transition-colors ${licensedStates.includes(s) ? "bg-blue-500 text-white border-blue-500" : "bg-gray-50 text-gray-600 border-gray-200 hover:border-blue-300"}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className={lbl}>Status</label>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className={inp}>
              <option value="unclaimed">Unclaimed</option><option value="claimed_pending">Claimed · Pending</option><option value="active">Active</option><option value="suspended">Suspended</option>
            </select>
          </div>
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

function AttorneysContent() {
  const { user, isLoaded } = useUser();
  const { signOut } = useAuth();
  const searchParams = useSearchParams();
  const statusParam = searchParams.get("status") as "all" | Status | null;

  const [attorneys, setAttorneys] = useState<AdminAttorney[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | Status>(statusParam ?? "all");
  const [showAdd, setShowAdd] = useState(false);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(25);

  useEffect(() => {
    fetch("/api/admin/attorneys").then((r) => r.json()).then(({ data }) => {
      setAttorneys(data ?? []);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    setStatusFilter(statusParam ?? "all");
  }, [statusParam]);

  const filtered = attorneys.filter((a) => {
    const q = search.toLowerCase();
    return (!q || (a.name ?? "").toLowerCase().includes(q) || (a.firm ?? "").toLowerCase().includes(q) || (a.email ?? "").toLowerCase().includes(q)) &&
      (statusFilter === "all" || a.status === statusFilter);
  });

  // Reset to page 0 when filters change
  useEffect(() => { setPage(0); }, [search, statusFilter, pageSize]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice(page * pageSize, (page + 1) * pageSize);

  const counts: Record<"all" | Status, number> = {
    all:             attorneys.length,
    unclaimed:       attorneys.filter((a) => a.status === "unclaimed").length,
    claimed_pending: attorneys.filter((a) => a.status === "claimed_pending").length,
    active:          attorneys.filter((a) => a.status === "active").length,
    suspended:       attorneys.filter((a) => a.status === "suspended").length,
  };

  const STATUS_PILLS: { key: "all" | Status; label: string; color: string; activeColor: string }[] = [
    { key: "all",             label: "All",             color: "bg-white text-gray-600 border-gray-200",       activeColor: "bg-blue-500 text-white border-blue-500" },
    { key: "unclaimed",       label: "Unclaimed",       color: "bg-white text-gray-500 border-gray-200",       activeColor: "bg-gray-500 text-white border-gray-500" },
    { key: "claimed_pending", label: "Claimed·Pending", color: "bg-white text-yellow-700 border-yellow-200",   activeColor: "bg-yellow-400 text-white border-yellow-400" },
    { key: "active",          label: "Active",          color: "bg-white text-green-700 border-green-200",     activeColor: "bg-green-500 text-white border-green-500" },
    { key: "suspended",       label: "Suspended",       color: "bg-white text-red-600 border-red-200",         activeColor: "bg-red-500 text-white border-red-500" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-500 flex items-center justify-center"><Scale className="w-[18px] h-[18px] text-white" /></div>
              <span className="font-extrabold text-[17px] tracking-tight text-gray-900 hidden sm:block">Attorney<span className="text-blue-500">Compete</span></span>
            </Link>
            <span className="bg-blue-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wide">Admin</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Dashboard
            </Link>
            <div className="h-5 w-px bg-gray-200 hidden sm:block" />
            <span className="text-sm text-gray-500 hidden sm:block">{user?.primaryEmailAddress?.emailAddress}</span>
            <UserButton appearance={{ elements: { avatarBox: "w-8 h-8 rounded-xl" } }} />
            <button onClick={() => signOut({ redirectUrl: "/" })} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 transition-colors"><LogOut className="w-3.5 h-3.5" /><span className="hidden sm:block">Sign out</span></button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Attorneys</h1>
            <p className="text-sm text-gray-500 mt-1">{attorneys.length} total · {counts.active} active · {counts.claimed_pending} pending approval · {counts.unclaimed} unclaimed</p>
          </div>
          <button onClick={() => setShowAdd(true)} className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-bold px-4 py-2.5 rounded-xl text-sm transition-colors">
            <Plus className="w-4 h-4" /> Add Attorney
          </button>
        </div>

        {/* Status filter pills */}
        <div className="flex flex-wrap gap-2 mb-5">
          {STATUS_PILLS.map(({ key, label, color, activeColor }) => (
            <button key={key} onClick={() => setStatusFilter(key)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${statusFilter === key ? activeColor : color}`}>
              {label} ({counts[key]})
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="flex gap-3 mb-5">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, firm, or email…"
              className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24"><div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>{["Attorney", "Status", "Leads", "Fee", "Joined", ""].map((h) => <th key={h} className="text-left text-xs font-semibold text-gray-500 px-5 py-3.5 uppercase tracking-wide">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginated.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-12 text-gray-400 text-sm">No attorneys found.</td></tr>
                ) : paginated.map((a) => (
                  <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <Link href={`/admin/attorneys/${a.id}`} className="flex items-center gap-3">
                        {a.photo_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={a.photo_url} alt="" className="w-9 h-9 rounded-xl object-cover border border-gray-200 shrink-0" />
                        ) : (
                          <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                            <span className="text-blue-600 font-bold text-sm">{(a.name ?? a.firm ?? "?")[0].toUpperCase()}</span>
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-gray-900 text-sm hover:text-blue-600 transition-colors">{a.name ?? <span className="text-gray-400 italic">No name</span>}</p>
                          <p className="text-xs text-gray-500">{a.firm ?? "—"}</p>
                        </div>
                      </Link>
                    </td>
                    <td className="px-5 py-4"><StatusPill status={a.status} /></td>
                    <td className="px-5 py-4"><span className="inline-flex items-center gap-1 text-sm font-semibold text-gray-700"><Inbox className="w-3.5 h-3.5 text-gray-400" />{a.lead_count}</span></td>
                    <td className="px-5 py-4 text-sm text-gray-600">{a.fee_percent != null ? `${a.fee_percent}%` : a.hourly_rate != null ? `$${a.hourly_rate}/hr` : a.flat_fee != null ? `$${a.flat_fee}` : <span className="text-gray-300">—</span>}</td>
                    <td className="px-5 py-4 text-sm text-gray-500 whitespace-nowrap">{fmt(a.created_at)}</td>
                    <td className="px-5 py-4"><Link href={`/admin/attorneys/${a.id}`} className="text-blue-400 hover:text-blue-600"><ChevronDown className="w-4 h-4 -rotate-90" /></Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination footer */}
        {!loading && filtered.length > 0 && (
          <div className="flex items-center justify-between mt-4 px-1">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>Show</span>
              {[20, 30, 50].map((n) => (
                <button key={n} onClick={() => setPageSize(n)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors ${pageSize === n ? "bg-blue-500 text-white border-blue-500" : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"}`}>
                  {n}
                </button>
              ))}
              <span className="ml-1 text-gray-400">of {filtered.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">Page {page + 1} of {totalPages}</span>
              <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-gray-200 bg-white text-gray-600 hover:border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                Prev
              </button>
              <button onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-gray-200 bg-white text-gray-600 hover:border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {showAdd && <AddAttorneyModal onClose={() => setShowAdd(false)} onAdded={(a) => { setAttorneys((p) => [a, ...p]); setShowAdd(false); }} />}
    </div>
  );
}

export default function AdminAttorneysPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <AttorneysContent />
    </Suspense>
  );
}
