"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { Scale, Search, ChevronRight, ArrowLeft, Inbox } from "lucide-react";

type LeadStatus =
  | "new"
  | "attempting_contact"
  | "contacted"
  | "retained"
  | "in_progress"
  | "settlement"
  | "closed"
  | "lost";

type AdminLead = {
  id: string;
  attorney_id: string;
  attorney_name: string | null;
  attorney_firm: string | null;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  legal_issue: string;
  state: string;
  message: string | null;
  status: LeadStatus | null;
  created_at: string;
};

type AdminAttorney = { id: string; name: string | null; firm: string | null };

const STATUSES: { key: LeadStatus; label: string; color: string; bg: string; dot: string }[] = [
  { key: "new",               label: "New Lead",           color: "text-blue-700",   bg: "bg-blue-50 border-blue-200",   dot: "bg-blue-500" },
  { key: "attempting_contact",label: "Attempting Contact", color: "text-amber-700",  bg: "bg-amber-50 border-amber-200", dot: "bg-amber-500" },
  { key: "contacted",         label: "Contacted — Follow Up", color: "text-orange-700", bg: "bg-orange-50 border-orange-200", dot: "bg-orange-500" },
  { key: "retained",          label: "Retained",           color: "text-purple-700", bg: "bg-purple-50 border-purple-200", dot: "bg-purple-500" },
  { key: "in_progress",       label: "In Progress",        color: "text-indigo-700", bg: "bg-indigo-50 border-indigo-200", dot: "bg-indigo-500" },
  { key: "settlement",        label: "Settlement",         color: "text-teal-700",   bg: "bg-teal-50 border-teal-200",   dot: "bg-teal-500" },
  { key: "closed",            label: "Closed / Won",       color: "text-green-700",  bg: "bg-green-50 border-green-200", dot: "bg-green-500" },
  { key: "lost",              label: "Lost",               color: "text-gray-500",   bg: "bg-gray-50 border-gray-200",   dot: "bg-gray-400" },
];

function fmt(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function StatusBadge({ status }: { status: LeadStatus | null }) {
  const s = STATUSES.find((x) => x.key === (status ?? "new")) ?? STATUSES[0];
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${s.bg} ${s.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

export default function LeadsPipelinePage() {
  const { isLoaded } = useAuth();
  const [leads, setLeads] = useState<AdminLead[]>([]);
  const [attorneys, setAttorneys] = useState<AdminAttorney[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [attorneyFilter, setAttorneyFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<"all" | LeadStatus>("all");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(25);

  // Fetch attorney list once for the filter dropdown
  useEffect(() => {
    if (!isLoaded) return;
    fetch("/api/admin/attorneys?all=1")
      .then((r) => r.json())
      .then(({ data }) => setAttorneys(data ?? []));
  }, [isLoaded]);

  // Server-side fetch with debounced search
  useEffect(() => {
    if (!isLoaded) return;
    setLoading(true);
    const t = setTimeout(() => {
      const params = new URLSearchParams({ page: String(page), limit: String(pageSize) });
      if (search) params.set("search", search);
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (attorneyFilter !== "all") params.set("attorney_id", attorneyFilter);
      fetch(`/api/admin/leads?${params}`)
        .then((r) => r.json())
        .then(({ data, total: t }) => {
          setLeads(data ?? []);
          setTotal(t ?? 0);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }, search ? 300 : 0);
    return () => clearTimeout(t);
  }, [isLoaded, search, attorneyFilter, statusFilter, page, pageSize]);

  // Reset page on filter change
  useEffect(() => { setPage(0); }, [search, attorneyFilter, statusFilter, pageSize]);

  const totalPages = Math.ceil(total / pageSize);

  // Group current page by status
  const grouped = STATUSES.map((s) => ({
    ...s,
    leads: leads.filter((l) => (l.status ?? "new") === s.key),
  })).filter((g) => g.leads.length > 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="flex items-center gap-2.5">
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

      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Leads Pipeline</h1>
            <p className="text-gray-500 text-sm mt-1">{total} total leads</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, phone, or legal issue…"
              className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={attorneyFilter}
            onChange={(e) => setAttorneyFilter(e.target.value)}
            className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All attorneys</option>
            {attorneys.map((a) => (
              <option key={a.id} value={a.id}>{a.name ?? a.firm ?? a.id}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as "all" | LeadStatus)}
            className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All statuses</option>
            {STATUSES.map((s) => (
              <option key={s.key} value={s.key}>{s.label}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : leads.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Inbox className="w-10 h-10 text-gray-300 mb-3" />
            <p className="text-gray-400 text-sm">No leads found.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {grouped.map((group) => (
              <div key={group.key}>
                <div className="flex items-center gap-2 mb-2 px-1">
                  <span className={`w-2 h-2 rounded-full ${group.dot}`} />
                  <span className={`text-xs font-bold uppercase tracking-widest ${group.color}`}>{group.label}</span>
                  <span className="text-xs text-gray-400 font-semibold ml-1">{group.leads.length}</span>
                </div>

                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        {["Client", "Legal Issue", "State", "Attorney", "Date", ""].map((h) => (
                          <th key={h} className="text-left text-xs font-semibold text-gray-500 px-5 py-3 uppercase tracking-wide">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {group.leads.map((lead) => (
                        <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-5 py-4">
                            <p className="font-semibold text-gray-900 text-sm">{lead.first_name} {lead.last_name}</p>
                            <p className="text-xs text-gray-500">{lead.email}</p>
                            {lead.phone && <p className="text-xs text-gray-400">{lead.phone}</p>}
                          </td>
                          <td className="px-5 py-4 text-sm text-gray-700">{lead.legal_issue}</td>
                          <td className="px-5 py-4 text-sm text-gray-600">{lead.state}</td>
                          <td className="px-5 py-4">
                            {lead.attorney_name ? (
                              <Link href={`/admin/attorneys/${lead.attorney_id}`} className="text-sm text-blue-600 hover:underline font-medium" onClick={(e) => e.stopPropagation()}>
                                {lead.attorney_name}
                              </Link>
                            ) : (
                              <span className="text-gray-400 italic text-sm">Unknown</span>
                            )}
                          </td>
                          <td className="px-5 py-4 text-xs text-gray-500 whitespace-nowrap">{fmt(lead.created_at)}</td>
                          <td className="px-5 py-4">
                            <Link href={`/admin/leads/${lead.id}`} className="flex items-center gap-1 text-xs font-semibold text-blue-500 hover:text-blue-700 whitespace-nowrap">
                              View <ChevronRight className="w-3.5 h-3.5" />
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination footer */}
        {!loading && total > 0 && (
          <div className="flex items-center justify-between mt-4 px-1">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>Show</span>
              {[20, 30, 50].map((n) => (
                <button key={n} onClick={() => setPageSize(n)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors ${pageSize === n ? "bg-blue-500 text-white border-blue-500" : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"}`}>
                  {n}
                </button>
              ))}
              <span className="ml-1 text-gray-400">of {total}</span>
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
    </div>
  );
}
