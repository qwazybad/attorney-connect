"use client";

import { useEffect, useRef, useState } from "react";
import { useUser, useAuth, UserButton } from "@clerk/nextjs";
import {
  User,
  Building2,
  Phone,
  Globe,
  FileText,
  Webhook,
  ArrowRightLeft,
  Inbox,
  Camera,
  Save,
  CheckCircle,
  AlertCircle,
  Scale,
  LogOut,
  ChevronRight,
  Mail,
  MapPin,
  Clock,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import type { Attorney, Lead } from "@/lib/supabase";

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab = "profile" | "webhook" | "leads";

const LEAD_FIELDS = [
  { key: "first_name", label: "First Name" },
  { key: "last_name", label: "Last Name" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "legal_issue", label: "Legal Issue" },
  { key: "state", label: "State" },
  { key: "message", label: "Message" },
] as const;

type FieldKey = (typeof LEAD_FIELDS)[number]["key"];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

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

function Toast({
  type,
  message,
  onClose,
}: {
  type: "success" | "error";
  message: string;
  onClose: () => void;
}) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl text-sm font-semibold border ${
        type === "success"
          ? "bg-accent-500/10 border-accent-500/30 text-accent-400"
          : "bg-red-500/10 border-red-500/30 text-red-400"
      }`}
    >
      {type === "success" ? (
        <CheckCircle className="w-4 h-4 shrink-0" />
      ) : (
        <AlertCircle className="w-4 h-4 shrink-0" />
      )}
      {message}
    </div>
  );
}

// ─── Profile Tab ──────────────────────────────────────────────────────────────

function ProfileTab({
  attorney,
  onSaved,
}: {
  attorney: Attorney | null;
  onSaved: (updated: Partial<Attorney>) => void;
}) {
  const { user } = useUser();
  const { getToken } = useAuth();

  const [name, setName] = useState(attorney?.name ?? user?.fullName ?? "");
  const [firm, setFirm] = useState(attorney?.firm ?? "");
  const [bio, setBio] = useState(attorney?.bio ?? "");
  const [phone, setPhone] = useState(attorney?.phone ?? "");
  const [website, setWebsite] = useState(attorney?.website ?? "");
  const [photoUrl, setPhotoUrl] = useState(attorney?.photo_url ?? "");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Sync fields when attorney data loads (it arrives after initial render)
  useEffect(() => {
    if (!attorney) return;
    setName(attorney.name ?? user?.fullName ?? "");
    setFirm(attorney.firm ?? "");
    setBio(attorney.bio ?? "");
    setPhone(attorney.phone ?? "");
    setWebsite(attorney.website ?? "");
    setPhotoUrl(attorney.photo_url ?? "");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attorney?.id]);

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploading(true);

    const form = new FormData();
    form.append("file", file);

    const res = await fetch("/api/attorney/photo", {
      method: "POST",
      body: form,
    });

    if (res.ok) {
      const { url } = await res.json();
      setPhotoUrl(url);
    }
    setUploading(false);
  }

  async function handleSave() {
    if (!user) return;
    setSaving(true);

    const payload = {
      id: user.id,
      name: name.trim() || null,
      firm: firm.trim() || null,
      bio: bio.trim() || null,
      phone: phone.trim() || null,
      website: website.trim() || null,
      photo_url: photoUrl || null,
    };

    // Use service-role key via API route or upsert directly
    // For client-side we upsert through the anon key;
    // RLS allows update/insert for own row when using Clerk JWT via Supabase Auth.
    // Simpler: call our own Next.js API endpoint.
    const token = await getToken({ template: "supabase" }).catch(() => null);

    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch("/api/attorney/profile", {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    setSaving(false);
    if (res.ok) {
      onSaved(payload);
    }
  }

  return (
    <div className="space-y-6">
      {/* Photo */}
      <SectionCard>
        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-4">
          Profile Photo
        </h3>
        <div className="flex items-center gap-5">
          <div className="relative">
            {photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={photoUrl}
                alt="Profile"
                className="w-20 h-20 rounded-2xl object-cover border-2 border-gray-200"
              />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-gray-100 border-2 border-gray-200 flex items-center justify-center">
                <User className="w-8 h-8 text-gray-400" />
              </div>
            )}
            <button
              onClick={() => fileRef.current?.click()}
              className="absolute -bottom-2 -right-2 w-7 h-7 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center shadow-lg transition-colors"
            >
              <Camera className="w-3.5 h-3.5 text-white" />
            </button>
          </div>
          <div>
            <p className="text-gray-900 font-semibold text-sm">
              {name || user?.fullName || "Your Name"}
            </p>
            <p className="text-gray-500 text-xs mt-0.5">{firm || "Your Firm"}</p>
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="mt-2.5 text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors"
            >
              {uploading ? "Uploading…" : "Change photo"}
            </button>
          </div>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handlePhotoUpload}
        />
      </SectionCard>

      {/* Details */}
      <SectionCard>
        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-5">
          Firm Details
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field
            icon={User}
            label="Full Name"
            value={name}
            onChange={setName}
            placeholder="Jane Smith"
          />
          <Field
            icon={Building2}
            label="Law Firm"
            value={firm}
            onChange={setFirm}
            placeholder="Smith & Associates"
          />
          <Field
            icon={Phone}
            label="Phone"
            value={phone}
            onChange={setPhone}
            placeholder="+1 (555) 000-0000"
            type="tel"
          />
          <Field
            icon={Globe}
            label="Website"
            value={website}
            onChange={setWebsite}
            placeholder="yourfirm.com"
            type="text"
          />
        </div>

        <div className="mt-4">
          <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
            <span className="flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              Bio
            </span>
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            placeholder="Tell potential clients about your experience, practice areas, and approach..."
            className="w-full bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
          />
        </div>
      </SectionCard>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-60 text-white font-bold px-6 py-3 rounded-xl transition-colors text-sm"
        >
          <Save className="w-4 h-4" />
          {saving ? "Saving…" : "Save Profile"}
        </button>
      </div>
    </div>
  );
}

function Field({
  icon: Icon,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
        <span className="flex items-center gap-1.5">
          <Icon className="w-3.5 h-3.5" />
          {label}
        </span>
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
      />
    </div>
  );
}

// ─── Webhook Tab ──────────────────────────────────────────────────────────────

function WebhookTab({
  attorney,
  onSaved,
}: {
  attorney: Attorney | null;
  onSaved: (updated: Partial<Attorney>) => void;
}) {
  const { user } = useUser();
  const [webhookUrl, setWebhookUrl] = useState(attorney?.webhook_url ?? "");
  const [mapping, setMapping] = useState<Record<FieldKey, string>>(
    () =>
      (attorney?.field_mapping as Record<FieldKey, string>) ??
      ({} as Record<FieldKey, string>)
  );
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    ok: boolean;
    msg: string;
  } | null>(null);

  async function handleSave() {
    if (!user) return;
    setSaving(true);

    const res = await fetch("/api/attorney/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: user.id,
        webhook_url: webhookUrl.trim() || null,
        field_mapping: mapping,
      }),
    });

    setSaving(false);
    if (res.ok) onSaved({ webhook_url: webhookUrl, field_mapping: mapping });
  }

  async function handleTest() {
    if (!webhookUrl.trim()) return;
    setTesting(true);
    setTestResult(null);

    try {
      const res = await fetch(webhookUrl.trim(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          _test: true,
          source: "AttorneyCompete",
          message: "Webhook test from AttorneyCompete portal",
          timestamp: new Date().toISOString(),
        }),
      });
      setTestResult({
        ok: res.ok,
        msg: res.ok
          ? `Success — received HTTP ${res.status}`
          : `Failed — HTTP ${res.status}`,
      });
    } catch {
      setTestResult({ ok: false, msg: "Network error — check the URL and CORS settings" });
    }
    setTesting(false);
  }

  function updateMapping(field: FieldKey, value: string) {
    setMapping((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <div className="space-y-6">
      {/* Webhook URL */}
      <SectionCard>
        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
          Webhook URL
        </h3>
        <p className="text-gray-500 text-xs mb-5">
          When a lead is sent to you, we POST the lead data to this URL. Use this
          to connect your CRM, Zapier, Make.com, or any custom integration.
        </p>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <Webhook className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="url"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder="https://hooks.zapier.com/..."
              className="w-full bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={handleTest}
            disabled={!webhookUrl.trim() || testing}
            className="px-4 py-3 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 border border-gray-200 text-gray-600 text-sm font-semibold rounded-xl transition-colors whitespace-nowrap"
          >
            {testing ? "Testing…" : "Test"}
          </button>
        </div>

        {testResult && (
          <div
            className={`mt-3 flex items-center gap-2 text-xs font-medium px-3 py-2 rounded-lg ${
              testResult.ok
                ? "bg-accent-500/10 text-accent-400"
                : "bg-red-500/10 text-red-400"
            }`}
          >
            {testResult.ok ? (
              <CheckCircle className="w-3.5 h-3.5 shrink-0" />
            ) : (
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            )}
            {testResult.msg}
          </div>
        )}
      </SectionCard>

      {/* Field Mapping */}
      <SectionCard>
        <div className="flex items-start justify-between mb-1.5">
          <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
            Field Mapping
          </h3>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">Optional</span>
        </div>
        <p className="text-gray-500 text-xs mb-5">
          Map our standard field names to your CRM&apos;s field names. Leave blank
          to use our defaults. For example, if your CRM expects{" "}
          <code className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">
            firstname
          </code>{" "}
          instead of{" "}
          <code className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">
            first_name
          </code>
          , enter{" "}
          <code className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">
            firstname
          </code>{" "}
          in the right column.
        </p>

        {/* Header */}
        <div className="grid grid-cols-2 gap-3 mb-2 px-1">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Our Field
          </span>
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Your CRM Field
          </span>
        </div>

        <div className="space-y-2">
          {LEAD_FIELDS.map(({ key, label }) => (
            <div key={key} className="grid grid-cols-2 gap-3 items-center">
              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                <ArrowRightLeft className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <code className="text-xs text-gray-600 font-mono">{key}</code>
                <span className="text-gray-500 text-xs ml-auto">{label}</span>
              </div>
              <input
                type="text"
                value={mapping[key] ?? ""}
                onChange={(e) => updateMapping(key, e.target.value)}
                placeholder={key}
                className="bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Example payload */}
      <SectionCard>
        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-3">
          Example Payload
        </h3>
        <pre className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-xs text-gray-600 overflow-x-auto font-mono leading-relaxed">
          {JSON.stringify(
            {
              ...(Object.fromEntries(
                LEAD_FIELDS.map(({ key }) => [
                  mapping[key] || key,
                  key === "email"
                    ? "jane@example.com"
                    : key === "first_name"
                    ? "Jane"
                    : key === "last_name"
                    ? "Doe"
                    : key === "phone"
                    ? "+1 555-000-0000"
                    : key === "legal_issue"
                    ? "Personal Injury"
                    : key === "state"
                    ? "CA"
                    : "I was in a car accident last week...",
                ])
              ) as Record<string, string>),
              _meta: {
                lead_id: "b1234567-...",
                attorney_id: "user_abc123",
                submitted_at: "2026-03-28T10:00:00Z",
              },
            },
            null,
            2
          )}
        </pre>
      </SectionCard>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-60 text-white font-bold px-6 py-3 rounded-xl transition-colors text-sm"
        >
          <Save className="w-4 h-4" />
          {saving ? "Saving…" : "Save Webhook Settings"}
        </button>
      </div>
    </div>
  );
}

// ─── Leads Tab ────────────────────────────────────────────────────────────────

function LeadsTab({ leads, loading }: { leads: Lead[]; loading: boolean }) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-24 bg-gray-100 rounded-2xl border border-gray-200 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <SectionCard className="text-center py-16">
        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Inbox className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-gray-800 font-bold text-lg mb-1">No leads yet</p>
        <p className="text-gray-400 text-sm max-w-xs mx-auto">
          Leads sent to you via the AttorneyCompete platform will appear here.
        </p>
      </SectionCard>
    );
  }

  return (
    <div className="space-y-3">
      {leads.map((lead) => (
        <SectionCard key={lead.id} className="hover:border-gray-300 transition-colors">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-500/20 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <p className="text-gray-900 font-semibold text-sm">
                    {lead.first_name} {lead.last_name}
                  </p>
                  <p className="text-gray-400 text-xs">{lead.legal_issue}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-gray-500 ml-12">
                <span className="flex items-center gap-1">
                  <Mail className="w-3 h-3" />
                  {lead.email}
                </span>
                {lead.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    {lead.phone}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {lead.state}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatDate(lead.created_at)}
                </span>
              </div>

              {lead.message && (
                <p className="mt-2.5 ml-12 text-xs text-gray-500 leading-relaxed line-clamp-2">
                  {lead.message}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2 sm:ml-4 shrink-0">
              <StatusBadge
                ok={lead.sent_to_webhook}
                label={lead.sent_to_webhook ? "Webhook sent" : "Webhook pending"}
              />
            </div>
          </div>
        </SectionCard>
      ))}
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function AttorneyPortalPage() {
  const { user, isLoaded } = useUser();
  const { signOut } = useAuth();

  const [activeTab, setActiveTab] = useState<Tab>("profile");
  const [attorney, setAttorney] = useState<Attorney | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [leadsLoading, setLeadsLoading] = useState(false);
  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Load attorney profile on mount — also hydrate from join-flow localStorage if present
  useEffect(() => {
    if (!user) return;
    (async () => {
      // Fetch existing profile first
      const { data: existing } = await fetch(`/api/attorney/profile?id=${user.id}`).then(
        (r) => r.json()
      );

      // Only apply pending join-flow data if this is a brand-new account (no profile yet)
      if (!existing) {
        const pendingRaw = localStorage.getItem("acPendingProfile");
        if (pendingRaw) {
          localStorage.removeItem("acPendingProfile");
          try {
            const pending = JSON.parse(pendingRaw);
            await fetch("/api/attorney/profile", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(pending),
            });
          } catch { /* ignore */ }
        }

        const photoDataUrl = localStorage.getItem("acPendingPhoto");
        if (photoDataUrl) {
          localStorage.removeItem("acPendingPhoto");
          try {
            const res = await fetch(photoDataUrl);
            const blob = await res.blob();
            const ext = blob.type.split("/")[1] || "jpg";
            const file = new File([blob], `profile.${ext}`, { type: blob.type });
            const formData = new FormData();
            formData.append("file", file);
            await fetch("/api/attorney/photo", { method: "POST", body: formData });
          } catch { /* ignore */ }
        }

        // Re-fetch after saving pending data
        const { data: fresh } = await fetch(`/api/attorney/profile?id=${user.id}`).then(
          (r) => r.json()
        );
        if (fresh) setAttorney(fresh as Attorney);
      } else {
        // Already has a profile — clear any stale pending data and use existing
        localStorage.removeItem("acPendingProfile");
        localStorage.removeItem("acPendingPhoto");
        setAttorney(existing as Attorney);
      }
    })();
  }, [user]);

  // Load leads when leads tab is active
  useEffect(() => {
    if (activeTab !== "leads" || !user) return;
    setLeadsLoading(true);
    (async () => {
      const { data } = await fetch(`/api/attorney/leads?attorney_id=${user.id}`).then(
        (r) => r.json()
      );
      setLeads((data as Lead[]) ?? []);
      setLeadsLoading(false);
    })();
  }, [activeTab, user]);

  function handleSaved(updated: Partial<Attorney>) {
    setAttorney((prev) => ({ ...(prev ?? ({} as Attorney)), ...updated }));
    setToast({ type: "success", message: "Changes saved successfully" });
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const tabs: { id: Tab; label: string; icon: React.ElementType; badge?: number }[] = [
    { id: "profile", label: "Profile", icon: User },
    { id: "webhook", label: "Webhook & CRM", icon: Webhook },
    { id: "leads", label: "Leads", icon: Inbox, badge: leads.length || undefined },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast */}
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      {/* Top nav */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
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

        {/* Tabs */}
        <div className="flex gap-1 bg-white border border-gray-200 shadow-sm rounded-2xl p-1.5 mb-8 overflow-x-auto">
          {tabs.map(({ id, label, icon: Icon, badge }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex-1 min-w-max flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeTab === id
                  ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
              {badge !== undefined && (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    activeTab === id
                      ? "bg-white/20 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div>
          {activeTab === "profile" && (
            <ProfileTab attorney={attorney} onSaved={handleSaved} />
          )}
          {activeTab === "webhook" && (
            <WebhookTab attorney={attorney} onSaved={handleSaved} />
          )}
          {activeTab === "leads" && (
            <LeadsTab leads={leads} loading={leadsLoading} />
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
