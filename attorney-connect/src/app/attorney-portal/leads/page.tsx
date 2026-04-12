"use client";

import { useEffect, useState, Suspense } from "react";
import { useUser } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Scale, ArrowLeft, Inbox, Search, User, Mail, Phone, ChevronRight,
} from "lucide-react";
import type { Lead } from "@/lib/supabase";

const LEAD_STATUSES: { key: string; label: string; dot: string; color: string; bg: string; border: string }[] = [
  { key: "new",                label: "New Lead",              dot: "bg-blue-500",   color: "text-blue-700",   bg: "bg-blue-50",   border: "border-blue-200" },
  { key: "attempting_contact", label: "Attempting Contact",    dot: "bg-amber-500",  color: "text-amber-700",  bg: "bg-amber-50",  border: "border-amber-200" },
  { key: "contacted",          label: "Contacted — Follow Up", dot: "bg-orange-500", color: "text-orange-700", bg: "bg-orange-50", border: "border-orange-200" },
  { key: "retained",           label: "Retained",              dot: "bg-purple-500", color: "text-purple-700", bg: "bg-purple-50", border: "border-purple-200" },
  { key: "in_progress",        label: "In Progress",           dot: "bg-indigo-500", color: "text-indigo-700", bg: "bg-indigo-50", border: "border-indigo-200" },
  { key: "settlement",         label: "Settlement",            dot: "bg-teal-500",   color: "text-teal-700",   bg: "bg-teal-50",   border: "border-teal-200" },
  { key: "closed",             label: "Closed / Won",          dot: "bg-green-500",  color: "text-green-700",  bg: "bg-green-50",  border: "border-green-200" },
  { key: "lost",               label: "Lost",                  dot: "bg-gray-400",   color: "text-gray-500",   bg: "bg-gray-50",   border: "border-gray-200" },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

function LeadStatusBadge({ status }: { status: string | null }) {
  const s = LEAD_STATUSES.find((x) => x.key === (status ?? "new")) ?? LEAD_STATUSES[0];
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${s.bg} ${s.border} ${s.color} border`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

function LeadsContent() {
  const { user, isLoaded } = useUser();
  const searchParams = useSearchParams();
  const statusParam = searchParams.get("status");

  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState(statusParam ?? "all");
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(25);

  useEffect(() => {
    if (!isLoaded || !user) return;
    setLoading(true);
    fetch(`/api/attorney/leads?attorney_id=${user.id}`)
      .then((r) => r.json())
      .then(({ data }) => {
        setLeads((data as Lead[]) ?? []);
        setLoading(false);
      });
  }, [user, isLoaded]);

  // Sync filter when URL param changes (e.g. navigating from dashboard card)
  useEffect(() => {
    setStatusFilter(statusParam ?? "all");
  }, [statusParam]);

  const filtered = leads.filter((l) => {
    const q = search.toLowerCase();
    const matchSearch = !q ||
      `${l.first_name} ${l.last_name}`.toLowerCase().includes(q) ||
      l.email.toLowerCase().includes(q) ||
      l.legal_issue.toLowerCase().includes(q);
    const matchStatus = statusFilter === "all" || (l.status ?? "new") === statusFilter;
    return matchSearch && matchStatus;
  });

  // Reset page on filter change
  useEffect(() => { setPage(0); }, [search, statusFilter, pageSize]);

  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice(page * pageSize, (page + 1) * pageSize);

  const grouped = LEAD_STATUSES.map((s) => ({
    ...s,
    leads: paginated.filter((l) => (l.status ?? "new") === s.key),
  })).filter((g) => g.leads.length > 0);

  const activeStatusInfo = LEAD_STATUSES.find((s) => s.key === statusFilter);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          <Link href="/attorney-portal" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-500 flex items-center justify-center">
              <Scale className="w-[18px] h-[18px] text-white" />
            </div>
            <span className="font-extrabold text-[17px] tracking-tight text-gray-900 hidden sm:block">
              Attorney<span className="text-blue-500">Compete</span>
            </span>
          </Link>
          <Link href="/attorney-portal" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Dashboard
          </Link>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-5 sm:px-8 py-8">
        {/* Page title */}
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            {activeStatusInfo ? activeStatusInfo.label : "My Leads"}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {activeStatusInfo
              ? `Showing all leads with status: ${activeStatusInfo.label}`
              : "All leads assigned to you"}
          </p>
        </div>

        {/* Status filter pills */}
        <div className="flex flex-wrap gap-2 mb-5">
          <button
            onClick={() => setStatusFilter("all")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
              statusFilter === "all"
                ? "bg-blue-500 text-white border-blue-500"
                : "bg-white text-gray-600 border-gray-200 hover:border-blue-300"
            }`}
          >
            All ({leads.length})
          </button>
          {LEAD_STATUSES.map((s) => {
            const count = leads.filter((l) => (l.status ?? "new") === s.key).length;
            if (count === 0) return null;
            return (
              <button
                key={s.key}
                onClick={() => setStatusFilter(s.key)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
                  statusFilter === s.key
                    ? `${s.bg} ${s.color} ${s.border}`
                    : "bg-white text-gray-600 border-gray-200 hover:border-blue-300"
                }`}
              >
                {s.label} ({count})
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or issue…"
            className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Content */}
        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-20 bg-white rounded-2xl border border-gray-200 animate-pulse" />
            ))}
          </div>
        ) : leads.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-16 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Inbox className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-800 font-bold text-lg mb-1">No leads yet</p>
            <p className="text-gray-400 text-sm max-w-xs mx-auto">
              Leads sent to you via AttorneyCompete will appear here.
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-12 italic">No leads match your filters.</p>
        ) : (
          <div className="space-y-6">
            {grouped.map((group) => (
              <div key={group.key}>
                <div className="flex items-center gap-2 mb-2 px-1">
                  <span className={`w-2 h-2 rounded-full ${group.dot}`} />
                  <span className={`text-xs font-bold uppercase tracking-widest ${group.color}`}>{group.label}</span>
                  <span className="text-xs text-gray-400 font-semibold ml-1">{group.leads.length}</span>
                </div>
                <div className="space-y-2">
                  {group.leads.map((lead) => (
                    <Link key={lead.id} href={`/attorney-portal/leads/${lead.id}`}>
                      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-500/20 flex items-center justify-center shrink-0">
                              <User className="w-4 h-4 text-blue-400" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-gray-900 font-semibold text-sm truncate">
                                {lead.first_name} {lead.last_name}
                              </p>
                              <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-gray-400 mt-0.5">
                                <span>{lead.legal_issue}</span>
                                <span>{lead.state}</span>
                                <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{lead.email}</span>
                                {lead.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{lead.phone}</span>}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <LeadStatusBadge status={lead.status} />
                            <span className="text-xs text-gray-400 hidden sm:block whitespace-nowrap">{formatDate(lead.created_at)}</span>
                            <ChevronRight className="w-4 h-4 text-gray-300" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
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
    </div>
  );
}

export default function AttorneyLeadsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <LeadsContent />
    </Suspense>
  );
}
