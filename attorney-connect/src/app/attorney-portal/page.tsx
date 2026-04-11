"use client";

import { useEffect, useState } from "react";
import { useUser, useAuth, UserButton } from "@clerk/nextjs";
import {
  User,
  Webhook,
  Inbox,
  CheckCircle,
  AlertCircle,
  Scale,
  LogOut,
  ChevronRight,
  Clock,
  ExternalLink,
  ShieldCheck,
  ShieldAlert,
  Hourglass,
  LayoutDashboard,
  FolderOpen,
} from "lucide-react";
import Link from "next/link";
import type { Attorney, Lead } from "@/lib/supabase";

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab = "dashboard" | "profile" | "webhook" | "leads" | "documents";

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusBadge({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
        ok ? "bg-accent-500/15 text-accent-400" : "bg-gray-100 text-gray-500"
      }`}
    >
      {ok ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
      {label}
    </span>
  );
}

function SectionCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-white border border-gray-200 shadow-sm rounded-2xl p-6 ${className}`}
    >
      {children}
    </div>
  );
}

// ─── Approval Status Banner ───────────────────────────────────────────────────

function ApprovalBanner({ status }: { status: "pending" | "active" | "suspended" | null }) {
  if (!status || status === "active") {
    if (status === "active") {
      return (
        <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl px-5 py-3.5 mb-8">
          <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
          <div>
            <p className="font-bold text-sm">Your profile is live</p>
            <p className="text-xs text-emerald-700 mt-0.5">Clients can find and contact you on AttorneyCompete.</p>
          </div>
        </div>
      );
    }
    return null;
  }

  if (status === "suspended") {
    return (
      <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-800 rounded-2xl px-5 py-3.5 mb-8">
        <ShieldAlert className="w-5 h-5 text-red-500 shrink-0" />
        <div>
          <p className="font-bold text-sm">Account suspended</p>
          <p className="text-xs text-red-700 mt-0.5">Your profile is not visible. Please contact support for assistance.</p>
        </div>
      </div>
    );
  }

  // pending (default)
  return (
    <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl px-5 py-3.5 mb-8">
      <Hourglass className="w-5 h-5 text-amber-500 shrink-0" />
      <div>
        <p className="font-bold text-sm">Application under review</p>
        <p className="text-xs text-amber-800 mt-0.5">Our team is verifying your credentials. You&apos;ll be notified within 2 business days once approved.</p>
      </div>
    </div>
  );
}


// ─── Dashboard Tab ────────────────────────────────────────────────────────────

function profileCompleteness(attorney: Attorney | null): { label: string; done: boolean }[] {
  if (!attorney) return [];
  return [
    { label: "Profile photo",     done: !!attorney.photo_url },
    { label: "Full name",         done: !!attorney.name },
    { label: "Bio",               done: !!attorney.bio && attorney.bio.length > 20 },
    { label: "Practice areas",    done: (attorney.practice_areas?.length ?? 0) > 0 },
    { label: "Licensed states",   done: (attorney.licensed_states?.length ?? 0) > 0 },
    { label: "Fee structure",     done: !!attorney.billing_type && (!!attorney.fee_percent || !!attorney.hourly_rate || !!attorney.flat_fee) },
    { label: "Response time",     done: !!attorney.response_time_hours },
    { label: "Website",           done: !!attorney.website },
  ];
}

function DashboardTab({
  attorney,
  leads,
  leadsLoading,
  onTabChange,
}: {
  attorney: Attorney | null;
  leads: Lead[];
  leadsLoading: boolean;
  onTabChange: (tab: Tab) => void;
}) {
  const completeness = profileCompleteness(attorney);
  const doneCount = completeness.filter((c) => c.done).length;
  const pct = Math.round((doneCount / completeness.length) * 100);

  const totalLeads = leads.length;
  const newLeads = leads.filter((l) => !l.status || l.status === "new").length;
  const retained = leads.filter((l) => l.status === "retained").length;
  const closed = leads.filter((l) => l.status === "closed").length;

  const recentLeads = leads.slice(0, 5);

  const LEAD_STATUS_MAP: Record<string, { label: string; color: string; dot: string }> = {
    new:                { label: "New Lead",           color: "text-blue-700",   dot: "bg-blue-500" },
    attempting_contact: { label: "Attempting Contact", color: "text-amber-700",  dot: "bg-amber-500" },
    contacted:          { label: "Contacted",          color: "text-orange-700", dot: "bg-orange-500" },
    retained:           { label: "Retained",           color: "text-purple-700", dot: "bg-purple-500" },
    in_progress:        { label: "In Progress",        color: "text-indigo-700", dot: "bg-indigo-500" },
    settlement:         { label: "Settlement",         color: "text-teal-700",   dot: "bg-teal-500" },
    closed:             { label: "Closed / Won",       color: "text-green-700",  dot: "bg-green-500" },
    lost:               { label: "Lost",               color: "text-gray-500",   dot: "bg-gray-400" },
  };

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <SectionCard>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          {attorney?.photo_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={attorney.photo_url} alt="" className="w-20 h-20 rounded-2xl object-cover border border-gray-200 shrink-0" />
          ) : (
            <div className="w-20 h-20 rounded-2xl bg-blue-100 flex items-center justify-center shrink-0">
              <span className="text-blue-600 font-extrabold text-2xl">
                {(attorney?.name ?? attorney?.firm ?? "?")[0]?.toUpperCase()}
              </span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">Welcome back</p>
            <h2 className="text-2xl font-extrabold text-gray-900 truncate">{attorney?.name ?? "Attorney"}</h2>
            {attorney?.firm && <p className="text-sm text-gray-500 mt-0.5">{attorney.firm}{attorney.city ? ` · ${attorney.city}, ${attorney.state ?? ""}` : ""}</p>}
          </div>
          <div className="flex flex-wrap gap-2 shrink-0">
            {attorney?.id && (
              <Link href={`/attorney/${attorney.id}`} target="_blank"
                className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-blue-600 border border-gray-200 rounded-lg px-3 py-2 hover:border-blue-300 transition-colors">
                <ExternalLink className="w-3.5 h-3.5" /> Public Profile
              </Link>
            )}
            <button onClick={() => onTabChange("profile")}
              className="flex items-center gap-1.5 text-xs bg-blue-500 hover:bg-blue-600 text-white font-bold px-3 py-2 rounded-lg transition-colors">
              <User className="w-3.5 h-3.5" /> Edit Profile
            </button>
          </div>
        </div>
      </SectionCard>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Leads",  value: totalLeads,  color: "bg-blue-100 text-blue-600",   href: "/attorney-portal/leads" },
          { label: "New / Unread", value: newLeads,    color: "bg-amber-100 text-amber-600",  href: "/attorney-portal/leads?status=new" },
          { label: "Retained",     value: retained,    color: "bg-purple-100 text-purple-600", href: "/attorney-portal/leads?status=retained" },
          { label: "Closed / Won", value: closed,      color: "bg-green-100 text-green-600",  href: "/attorney-portal/leads?status=closed" },
        ].map(({ label, value, color, href }) => (
          <Link key={label} href={href} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex items-center gap-4 hover:border-blue-300 hover:shadow-md transition-all group">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
              <Inbox className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <p className="text-2xl font-extrabold text-gray-900">{value}</p>
              <p className="text-xs text-gray-500 font-medium group-hover:text-blue-500 transition-colors">{label}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Lead Pipeline */}
      <SectionCard>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Inbox className="w-4 h-4 text-gray-400" />
            <h3 className="text-sm font-bold text-gray-900">Lead Pipeline</h3>
            <span className="text-xs text-gray-400 font-medium">— {totalLeads} total across all statuses</span>
          </div>
          <Link href="/attorney-portal/leads" className="text-xs text-blue-500 hover:text-blue-700 font-semibold">View all →</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {[
            { key: "new",                label: "New",          dot: "bg-blue-500",   bg: "bg-blue-50",   text: "text-blue-700" },
            { key: "attempting_contact", label: "Attempting",   dot: "bg-amber-500",  bg: "bg-amber-50",  text: "text-amber-700" },
            { key: "contacted",          label: "Contacted",    dot: "bg-orange-500", bg: "bg-orange-50", text: "text-orange-700" },
            { key: "retained",           label: "Retained",     dot: "bg-purple-500", bg: "bg-purple-50", text: "text-purple-700" },
            { key: "in_progress",        label: "In Progress",  dot: "bg-indigo-500", bg: "bg-indigo-50", text: "text-indigo-700" },
            { key: "settlement",         label: "Settlement",   dot: "bg-teal-500",   bg: "bg-teal-50",   text: "text-teal-700" },
            { key: "closed",             label: "Closed / Won", dot: "bg-green-500",  bg: "bg-green-50",  text: "text-green-700" },
            { key: "lost",               label: "Lost",         dot: "bg-gray-400",   bg: "bg-gray-50",   text: "text-gray-500" },
          ].map(({ key, label, dot, bg, text }) => {
            const count = leads.filter((l) => (l.status ?? "new") === key).length;
            const pct = totalLeads > 0 ? Math.round((count / totalLeads) * 100) : 0;
            return (
              <Link key={key} href={`/attorney-portal/leads?status=${key}`}
                className={`${bg} rounded-2xl p-4 border border-transparent hover:border-gray-200 transition-all`}>
                <div className="flex items-center gap-1.5 mb-2">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${dot}`} />
                  <span className={`text-xs font-semibold ${text} truncate`}>{label}</span>
                </div>
                <p className="text-2xl font-extrabold text-gray-900">{count}</p>
                <p className="text-xs text-gray-400 mt-1">{pct}% of total</p>
              </Link>
            );
          })}
        </div>
      </SectionCard>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent leads */}
        <div className="lg:col-span-2">
          <SectionCard>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-900">Recent Leads</h3>
              <Link href="/attorney-portal/leads" className="text-xs text-blue-500 hover:text-blue-700 font-semibold">View all →</Link>
            </div>
            {leadsLoading ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />)}
              </div>
            ) : recentLeads.length === 0 ? (
              <div className="text-center py-8">
                <Inbox className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-400">No leads yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {recentLeads.map((lead) => {
                  const s = LEAD_STATUS_MAP[lead.status ?? "new"] ?? LEAD_STATUS_MAP.new;
                  return (
                    <Link key={lead.id} href={`/attorney-portal/leads/${lead.id}`}
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all group">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                          <User className="w-4 h-4 text-blue-400" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">{lead.first_name} {lead.last_name}</p>
                          <p className="text-xs text-gray-400 truncate">{lead.legal_issue} · {lead.state}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 ml-2">
                        <span className={`hidden sm:flex items-center gap-1 text-xs font-semibold ${s.color}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />{s.label}
                        </span>
                        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </SectionCard>
        </div>

        {/* Profile completeness */}
        <div>
          <SectionCard>
            <h3 className="text-sm font-bold text-gray-900 mb-1">Profile Completeness</h3>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${pct === 100 ? "bg-green-500" : pct >= 60 ? "bg-blue-500" : "bg-amber-500"}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="text-xs font-bold text-gray-500">{pct}%</span>
            </div>
            <div className="space-y-2">
              {completeness.map(({ label, done }) => (
                <div key={label} className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${done ? "bg-green-100" : "bg-gray-100"}`}>
                    {done
                      ? <CheckCircle className="w-3 h-3 text-green-500" />
                      : <AlertCircle className="w-3 h-3 text-gray-400" />}
                  </div>
                  <span className={`text-xs font-medium ${done ? "text-gray-600" : "text-gray-400"}`}>{label}</span>
                </div>
              ))}
            </div>
            {pct < 100 && (
              <button onClick={() => onTabChange("profile")}
                className="mt-4 w-full text-xs font-bold text-blue-500 hover:text-blue-700 border border-blue-200 hover:border-blue-400 py-2 rounded-xl transition-colors">
                Complete your profile →
              </button>
            )}
          </SectionCard>
        </div>
      </div>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function AttorneyPortalPage() {
  const { user, isLoaded } = useUser();
  const { signOut } = useAuth();

  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [attorney, setAttorney] = useState<Attorney | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [leadsLoading, setLeadsLoading] = useState(false);
  // Load attorney profile on mount
  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await fetch(`/api/attorney/profile?id=${user.id}`).then((r) => r.json());
      if (data) setAttorney(data as Attorney);
    })();
  }, [user]);

  // Load leads for dashboard stats
  useEffect(() => {
    if (activeTab !== "dashboard" || !user) return;
    setLeadsLoading(true);
    (async () => {
      const { data } = await fetch(`/api/attorney/leads?attorney_id=${user.id}`).then(
        (r) => r.json()
      );
      setLeads((data as Lead[]) ?? []);
      setLeadsLoading(false);
    })();
  }, [activeTab, user]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const tabs: { id: Tab; label: string; icon: React.ElementType; badge?: number; href?: string }[] = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "profile",   label: "Profile",   icon: User,         href: "/attorney-portal/profile" },
    { id: "webhook",   label: "Webhook & CRM", icon: Webhook,  href: "/attorney-portal/webhook" },
    { id: "leads",     label: "Leads",     icon: Inbox,        href: "/attorney-portal/leads", badge: leads.length || undefined },
    { id: "documents", label: "Documents", icon: FolderOpen,   href: "/attorney-portal/documents" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top nav */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          <Link href="/attorney-portal" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-500 flex items-center justify-center">
              <Scale className="w-[18px] h-[18px] text-white" />
            </div>
            <span className="font-extrabold text-[17px] tracking-tight text-gray-900 hidden sm:block">
              Attorney<span className="text-blue-500">Compete</span>
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 hidden sm:block">
              {attorney?.firm ?? user?.primaryEmailAddress?.emailAddress}
            </span>

            <div className="h-5 w-px bg-gray-200 mx-1 hidden sm:block" />

            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-8 h-8 rounded-xl",
                },
              }}
            />

            <button
              onClick={() => signOut({ redirectUrl: "/" })}
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900 transition-colors ml-1"
              title="Sign out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:block">Sign out</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-8">
        {/* Page header */}
        <div className="mb-8">
          <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-3">
            <Link href="/" className="hover:text-gray-600 transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-gray-500">Attorney Portal</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                Attorney Portal
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Manage your profile, CRM integration, and incoming leads.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge ok={!!attorney?.webhook_url} label="Webhook" />
              <StatusBadge ok={!!attorney?.name} label="Profile" />
            </div>
          </div>
        </div>

        {/* Approval status banner */}
        <ApprovalBanner status={attorney?.status ?? "pending"} />

        {/* Tabs */}
        <div className="flex gap-1 bg-white border border-gray-200 shadow-sm rounded-2xl p-1.5 mb-8 overflow-x-auto">
          {tabs.map(({ id, label, icon: Icon, badge, href }) => {
            const isActive = activeTab === id;
            const cls = `flex-1 min-w-max flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
              isActive ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20" : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
            }`;
            const inner = (
              <>
                <Icon className="w-4 h-4" />
                {label}
                {badge !== undefined && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${isActive ? "bg-white/20 text-white" : "bg-gray-200 text-gray-500"}`}>
                    {badge}
                  </span>
                )}
              </>
            );
            if (href) {
              return <Link key={id} href={href} className={cls}>{inner}</Link>;
            }
            return (
              <button key={id} onClick={() => setActiveTab(id)} className={cls}>{inner}</button>
            );
          })}
        </div>

        {/* Tab content — dashboard only; all other tabs navigate to their own pages */}
        <div>
          {activeTab === "dashboard" && (
            <DashboardTab attorney={attorney} leads={leads} leadsLoading={leadsLoading} onTabChange={setActiveTab} />
          )}
        </div>

        {/* Footer links */}
        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-wrap items-center justify-between gap-4 text-xs text-gray-400">
          <p>© 2026 AttorneyCompete · Attorney Portal</p>
          <div className="flex items-center gap-4">
            <Link href="/compare" className="hover:text-gray-600 transition-colors flex items-center gap-1">
              View Marketplace <ExternalLink className="w-3 h-3" />
            </Link>
            <Link href="/for-attorneys" className="hover:text-gray-600 transition-colors">
              Partner Docs
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
