"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Scale, ArrowLeft, Phone, Mail, ChevronDown,
  MessageSquare, Clock, CheckCircle, Send, User, FolderOpen,
} from "lucide-react";
import { DocumentsPanel } from "@/components/shared/DocumentsPanel";

type LeadStatus =
  | "new"
  | "attempting_contact"
  | "contacted"
  | "retained"
  | "in_progress"
  | "settlement"
  | "closed"
  | "lost";

type Lead = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  legal_issue: string;
  state: string;
  message: string | null;
  status: LeadStatus | null;
  notes: string | null;
  created_at: string;
};

type Activity = {
  id: string;
  type: "status_change" | "note";
  body: string | null;
  created_at: string;
};

const STATUSES: { key: LeadStatus; label: string; color: string; bg: string; border: string }[] = [
  { key: "new",                label: "New Lead",              color: "text-blue-700",   bg: "bg-blue-50",   border: "border-blue-200" },
  { key: "attempting_contact", label: "Attempting Contact",    color: "text-amber-700",  bg: "bg-amber-50",  border: "border-amber-200" },
  { key: "contacted",          label: "Contacted — Follow Up", color: "text-orange-700", bg: "bg-orange-50", border: "border-orange-200" },
  { key: "retained",           label: "Retained",              color: "text-purple-700", bg: "bg-purple-50", border: "border-purple-200" },
  { key: "in_progress",        label: "In Progress",           color: "text-indigo-700", bg: "bg-indigo-50", border: "border-indigo-200" },
  { key: "settlement",         label: "Settlement",            color: "text-teal-700",   bg: "bg-teal-50",   border: "border-teal-200" },
  { key: "closed",             label: "Closed / Won",          color: "text-green-700",  bg: "bg-green-50",  border: "border-green-200" },
  { key: "lost",               label: "Lost",                  color: "text-gray-500",   bg: "bg-gray-50",   border: "border-gray-200" },
];

function fmtFull(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

function parseMessage(message: string | null) {
  if (!message) return null;
  return message.split("\n").filter(Boolean).map((line, i) => {
    const colonIdx = line.indexOf(": ");
    if (colonIdx === -1) return <p key={i} className="text-sm text-gray-700">{line}</p>;
    const q = line.slice(0, colonIdx);
    const a = line.slice(colonIdx + 2);
    return (
      <div key={i} className="py-2.5 border-b border-gray-100 last:border-0">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-0.5">{q}</p>
        <p className="text-sm text-gray-900 font-medium">{a}</p>
      </div>
    );
  });
}

type Tab = "details" | "notes" | "documents";

export default function AttorneyLeadDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [lead, setLead] = useState<Lead | null>(null);
  const [activity, setActivity] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("details");
  const [statusOpen, setStatusOpen] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [savingNote, setSavingNote] = useState(false);
  const statusRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    Promise.all([
      fetch(`/api/attorney/leads/${id}`).then((r) => r.json()),
      fetch(`/api/attorney/leads/${id}/activity`).then((r) => r.json()),
    ]).then(([lRes, aRes]) => {
      setLead(lRes.data ?? null);
      setActivity(aRes.data ?? []);
      setLoading(false);
    });
  }, [id]);

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (statusRef.current && !statusRef.current.contains(e.target as Node)) setStatusOpen(false);
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  async function updateStatus(newStatus: LeadStatus) {
    if (!lead) return;
    setUpdatingStatus(true);
    setStatusOpen(false);
    const res = await fetch(`/api/attorney/leads/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) {
      const { data } = await res.json();
      setLead((prev) => prev ? { ...prev, status: data.status } : prev);
      fetch(`/api/attorney/leads/${id}/activity`).then((r) => r.json()).then((a) => setActivity(a.data ?? []));
    }
    setUpdatingStatus(false);
  }

  async function addNote() {
    if (!noteText.trim()) return;
    setSavingNote(true);
    const res = await fetch(`/api/attorney/leads/${id}/activity`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body: noteText }),
    });
    if (res.ok) {
      const { data } = await res.json();
      setActivity((prev) => [data, ...prev]);
      setNoteText("");
    }
    setSavingNote(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-3">
        <p className="text-gray-500">Lead not found.</p>
        <Link href="/attorney-portal" className="text-blue-500 text-sm hover:underline">Back to portal</Link>
      </div>
    );
  }

  const currentStatus = STATUSES.find((s) => s.key === (lead.status ?? "new")) ?? STATUSES[0];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          <Link href="/attorney-portal" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-500 flex items-center justify-center">
              <Scale className="w-[18px] h-[18px] text-white" />
            </div>
            <span className="font-extrabold text-[17px] tracking-tight text-gray-900 hidden sm:block">
              Attorney<span className="text-blue-500">Compete</span>
            </span>
          </Link>
          <Link href="/attorney-portal/leads" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-4 h-4" /> My Leads
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-5 sm:px-8 py-8">
        {/* Lead header */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center shrink-0">
                <User className="w-7 h-7 text-blue-500" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-gray-900">{lead.first_name} {lead.last_name}</h1>
                <p className="text-sm text-gray-500 mt-0.5">{lead.legal_issue} · {lead.state} · {fmtFull(lead.created_at)}</p>
              </div>
            </div>

            {/* Status dropdown */}
            <div className="relative" ref={statusRef}>
              <button
                onClick={() => setStatusOpen((o) => !o)}
                disabled={updatingStatus}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-semibold text-sm transition-all ${currentStatus.bg} ${currentStatus.border} ${currentStatus.color}`}
              >
                {updatingStatus ? "Updating…" : currentStatus.label}
                <ChevronDown className="w-4 h-4" />
              </button>
              {statusOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg z-20 overflow-hidden">
                  {STATUSES.map((s) => (
                    <button
                      key={s.key}
                      onClick={() => updateStatus(s.key)}
                      className={`w-full text-left px-4 py-2.5 text-sm font-medium hover:bg-gray-50 transition-colors ${s.color} ${(lead.status ?? "new") === s.key ? "bg-gray-50 font-bold" : ""}`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick contact */}
          <div className="flex flex-wrap gap-3 mt-5 pt-5 border-t border-gray-100">
            <a href={`mailto:${lead.email}`} className="flex items-center gap-2 text-sm text-gray-700 hover:text-blue-600 transition-colors">
              <Mail className="w-4 h-4 text-gray-400" />{lead.email}
            </a>
            {lead.phone && (
              <a href={`tel:${lead.phone}`} className="flex items-center gap-2 text-sm text-gray-700 hover:text-blue-600 transition-colors">
                <Phone className="w-4 h-4 text-gray-400" />{lead.phone}
              </a>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white border border-gray-200 shadow-sm rounded-2xl p-1.5 mb-6 w-fit">
          {([{ id: "details" as Tab, label: "Lead Details" }, { id: "notes" as Tab, label: "Notes & Activity" }, { id: "documents" as Tab, label: "Documents" }]).map(({ id: tid, label }) => (
            <button
              key={tid}
              onClick={() => setTab(tid)}
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${tab === tid ? "bg-blue-500 text-white shadow" : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"}`}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === "details" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Contact Info</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Full Name</p>
                  <p className="text-sm font-semibold text-gray-900">{lead.first_name} {lead.last_name}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Email</p>
                  <a href={`mailto:${lead.email}`} className="text-sm text-blue-600 hover:underline">{lead.email}</a>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Phone</p>
                  {lead.phone
                    ? <a href={`tel:${lead.phone}`} className="text-sm text-blue-600 hover:underline">{lead.phone}</a>
                    : <p className="text-sm text-gray-400 italic">Not provided</p>}
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">State</p>
                  <p className="text-sm text-gray-900">{lead.state}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Legal Issue</p>
                  <p className="text-sm text-gray-900">{lead.legal_issue}</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Case Details</h2>
              {lead.message ? (
                <div className="divide-y divide-gray-100">{parseMessage(lead.message)}</div>
              ) : (
                <p className="text-sm text-gray-400 italic">No details provided.</p>
              )}
            </div>
          </div>
        )}

        {tab === "notes" && (
          <div className="space-y-4">
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Add Note</h2>
              <textarea
                rows={3}
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Add a note about this lead…"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
              <button
                onClick={addNote}
                disabled={savingNote || !noteText.trim()}
                className="mt-3 flex items-center gap-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-bold px-4 py-2 rounded-xl text-sm transition-colors"
              >
                <Send className="w-4 h-4" />
                {savingNote ? "Saving…" : "Add Note"}
              </button>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Activity</h2>
              {activity.length === 0 ? (
                <p className="text-sm text-gray-400 italic">No activity yet.</p>
              ) : (
                <div className="space-y-3">
                  {activity.map((a) => (
                    <div key={a.id} className="flex gap-3">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${a.type === "note" ? "bg-blue-100" : "bg-gray-100"}`}>
                        {a.type === "note" ? <MessageSquare className="w-3.5 h-3.5 text-blue-500" /> : <CheckCircle className="w-3.5 h-3.5 text-gray-500" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-800">{a.body}</p>
                        <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1"><Clock className="w-3 h-3" />{fmtFull(a.created_at)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {tab === "documents" && (
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
            <div className="flex items-center gap-2 mb-5">
              <FolderOpen className="w-5 h-5 text-gray-400" />
              <div>
                <h2 className="text-sm font-bold text-gray-900">Case Documents</h2>
                <p className="text-xs text-gray-400 mt-0.5">Retainer agreements, police reports, medical records, and other case files.</p>
              </div>
            </div>
            <DocumentsPanel leadId={id} canUpload canDelete />
          </div>
        )}
      </div>
    </div>
  );
}
