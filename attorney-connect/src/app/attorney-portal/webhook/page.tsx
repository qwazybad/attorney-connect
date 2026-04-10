"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import {
  Scale, ArrowLeft, Webhook, Save, CheckCircle, AlertCircle, ArrowRightLeft,
} from "lucide-react";
import type { Attorney } from "@/lib/supabase";

const LEAD_FIELDS = [
  { key: "first_name", label: "First Name" },
  { key: "last_name",  label: "Last Name" },
  { key: "email",      label: "Email" },
  { key: "phone",      label: "Phone" },
  { key: "legal_issue",label: "Legal Issue" },
  { key: "state",      label: "State" },
  { key: "message",    label: "Message" },
] as const;

type FieldKey = (typeof LEAD_FIELDS)[number]["key"];

function SectionCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white border border-gray-200 shadow-sm rounded-2xl p-6 ${className}`}>
      {children}
    </div>
  );
}

export default function AttorneyWebhookPage() {
  const { user, isLoaded } = useUser();

  const [loading, setLoading] = useState(true);
  const [webhookUrl, setWebhookUrl] = useState("");
  const [mapping, setMapping] = useState<Record<FieldKey, string>>({} as Record<FieldKey, string>);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"success" | "error" | null>(null);
  const [testResult, setTestResult] = useState<{ ok: boolean; msg: string } | null>(null);

  useEffect(() => {
    if (!isLoaded || !user) return;
    fetch(`/api/attorney/profile?id=${user.id}`)
      .then((r) => r.json())
      .then(({ data }) => {
        if (data) {
          const a = data as Attorney;
          setWebhookUrl(a.webhook_url ?? "");
          setMapping((a.field_mapping as Record<FieldKey, string>) ?? ({} as Record<FieldKey, string>));
        }
        setLoading(false);
      });
  }, [user, isLoaded]);

  async function handleSave() {
    if (!user) return;
    setSaving(true);
    const res = await fetch("/api/attorney/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: user.id, webhook_url: webhookUrl.trim() || null, field_mapping: mapping }),
    });
    setSaving(false);
    setSaveStatus(res.ok ? "success" : "error");
    setTimeout(() => setSaveStatus(null), 4000);
  }

  async function handleTest() {
    if (!webhookUrl.trim()) return;
    setTesting(true);
    setTestResult(null);
    try {
      const res = await fetch(webhookUrl.trim(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _test: true, source: "AttorneyCompete", message: "Webhook test", timestamp: new Date().toISOString() }),
      });
      setTestResult({ ok: res.ok, msg: res.ok ? `Success — received HTTP ${res.status}` : `Failed — HTTP ${res.status}` });
    } catch {
      setTestResult({ ok: false, msg: "Network error — check the URL and CORS settings" });
    }
    setTesting(false);
  }

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

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
          <Link href="/attorney-portal" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Dashboard
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-5 sm:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Webhook & CRM</h1>
          <p className="text-sm text-gray-500 mt-1">Connect your CRM, Zapier, Make.com, or any custom integration.</p>
        </div>

        <div className="space-y-6">
          {/* Webhook URL */}
          <SectionCard>
            <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Webhook URL</h3>
            <p className="text-gray-500 text-xs mb-5">
              When a lead is sent to you, we POST the lead data to this URL. Use this to connect your CRM, Zapier, Make.com, or any custom integration.
            </p>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Webhook className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="url" value={webhookUrl} onChange={(e) => setWebhookUrl(e.target.value)} placeholder="https://hooks.zapier.com/..."
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
              </div>
              <button onClick={handleTest} disabled={!webhookUrl.trim() || testing}
                className="px-4 py-3 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 border border-gray-200 text-gray-600 text-sm font-semibold rounded-xl transition-colors whitespace-nowrap">
                {testing ? "Testing…" : "Test"}
              </button>
            </div>
            {testResult && (
              <div className={`mt-3 flex items-center gap-2 text-xs font-medium px-3 py-2 rounded-lg ${testResult.ok ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"}`}>
                {testResult.ok ? <CheckCircle className="w-3.5 h-3.5 shrink-0" /> : <AlertCircle className="w-3.5 h-3.5 shrink-0" />}
                {testResult.msg}
              </div>
            )}
          </SectionCard>

          {/* Field Mapping */}
          <SectionCard>
            <div className="flex items-start justify-between mb-1.5">
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">Field Mapping</h3>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">Optional</span>
            </div>
            <p className="text-gray-500 text-xs mb-5">
              Map our standard field names to your CRM&apos;s field names. Leave blank to use our defaults. For example, if your CRM expects{" "}
              <code className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">firstname</code> instead of{" "}
              <code className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">first_name</code>, enter{" "}
              <code className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">firstname</code> in the right column.
            </p>
            <div className="grid grid-cols-2 gap-3 mb-2 px-1">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Our Field</span>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Your CRM Field</span>
            </div>
            <div className="space-y-2">
              {LEAD_FIELDS.map(({ key, label }) => (
                <div key={key} className="grid grid-cols-2 gap-3 items-center">
                  <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                    <ArrowRightLeft className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                    <code className="text-xs text-gray-600 font-mono">{key}</code>
                    <span className="text-gray-500 text-xs ml-auto">{label}</span>
                  </div>
                  <input type="text" value={mapping[key] ?? ""} onChange={(e) => setMapping((prev) => ({ ...prev, [key]: e.target.value }))}
                    placeholder={key}
                    className="bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Example Payload */}
          <SectionCard>
            <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-3">Example Payload</h3>
            <pre className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-xs text-gray-600 overflow-x-auto font-mono leading-relaxed">
              {JSON.stringify({
                ...(Object.fromEntries(LEAD_FIELDS.map(({ key }) => [
                  mapping[key] || key,
                  key === "email" ? "jane@example.com" : key === "first_name" ? "Jane" : key === "last_name" ? "Doe"
                    : key === "phone" ? "+1 555-000-0000" : key === "legal_issue" ? "Personal Injury"
                    : key === "state" ? "CA" : "I was in a car accident last week...",
                ])) as Record<string, string>),
                _meta: { lead_id: "b1234567-...", attorney_id: "user_abc123", submitted_at: "2026-03-28T10:00:00Z" },
              }, null, 2)}
            </pre>
          </SectionCard>

          {/* Save */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <div className="text-sm font-medium">
              {saveStatus === "success" && <span className="flex items-center gap-1.5 text-emerald-600"><CheckCircle className="w-4 h-4" /> Settings saved!</span>}
              {saveStatus === "error" && <span className="flex items-center gap-1.5 text-red-500"><AlertCircle className="w-4 h-4" /> Save failed — please try again</span>}
            </div>
            <button onClick={handleSave} disabled={saving}
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-60 text-white font-bold px-6 py-3 rounded-xl transition-colors text-sm">
              <Save className="w-4 h-4" />
              {saving ? "Saving…" : "Save Webhook Settings"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
