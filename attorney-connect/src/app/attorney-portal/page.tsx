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
  ShieldCheck,
  ShieldAlert,
  Hourglass,
  Search,
  LayoutDashboard,
} from "lucide-react";
import Link from "next/link";
import type { Attorney, Lead } from "@/lib/supabase";
import { LEGAL_ISSUES, US_STATES } from "@/lib/data";

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab = "dashboard" | "profile" | "webhook" | "leads";

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
  const [city, setCity] = useState(attorney?.city ?? "");
  const [displayState, setDisplayState] = useState(attorney?.state ?? "");
  const [photoUrl, setPhotoUrl] = useState(attorney?.photo_url ?? "");
  const [imagePosition, setImagePosition] = useState(attorney?.image_position ?? "center 15%");
  const [practiceAreas, setPracticeAreas] = useState<string[]>(attorney?.practice_areas ?? []);
  const [licensedStates, setLicensedStates] = useState<string[]>(attorney?.licensed_states ?? []);
  const [billingType, setBillingType] = useState<"contingency" | "hourly" | "flat">(
    (attorney?.billing_type as "contingency" | "hourly" | "flat") ?? "contingency"
  );
  const [feePercent, setFeePercent] = useState(String(attorney?.fee_percent ?? ""));
  const [hourlyRate, setHourlyRate] = useState(String(attorney?.hourly_rate ?? ""));
  const [flatFee, setFlatFee] = useState(String(attorney?.flat_fee ?? ""));
  const [casesWon, setCasesWon] = useState(String(attorney?.cases_won ?? ""));
  const [totalCases, setTotalCases] = useState(String(attorney?.total_cases ?? ""));
  const [recentResult, setRecentResult] = useState(attorney?.recent_result ?? "");
  const [recentResultAmount, setRecentResultAmount] = useState(attorney?.recent_result_amount ?? "");
  const [responseTime, setResponseTime] = useState(String(attorney?.response_time_hours ?? ""));
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"success" | "error" | null>(null);
  const [saveMessage, setSaveMessage] = useState("");
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
    setCity(attorney.city ?? "");
    setDisplayState(attorney.state ?? "");
    setPhotoUrl(attorney.photo_url ?? "");
    setImagePosition(attorney.image_position ?? "center 15%");
    setPracticeAreas(attorney.practice_areas ?? []);
    setLicensedStates(attorney.licensed_states ?? []);
    setBillingType((attorney.billing_type as "contingency" | "hourly" | "flat") ?? "contingency");
    setFeePercent(String(attorney.fee_percent ?? ""));
    setHourlyRate(String(attorney.hourly_rate ?? ""));
    setFlatFee(String(attorney.flat_fee ?? ""));
    setCasesWon(String(attorney.cases_won ?? ""));
    setTotalCases(String(attorney.total_cases ?? ""));
    setRecentResult(attorney.recent_result ?? "");
    setRecentResultAmount(attorney.recent_result_amount ?? "");
    setResponseTime(String(attorney.response_time_hours ?? ""));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attorney?.id]);

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (file.size > 5 * 1024 * 1024) {
      setSaveMessage("Photo must be under 5MB — please resize and try again.");
      setSaveStatus("error");
      setTimeout(() => setSaveStatus(null), 4000);
      if (fileRef.current) fileRef.current.value = "";
      return;
    }

    setUploading(true);

    const form = new FormData();
    form.append("file", file);

    const res = await fetch("/api/attorney/photo", {
      method: "POST",
      body: form,
    });

    const json = await res.json();
    if (res.ok && json.url) {
      setPhotoUrl(json.url);
      if (fileRef.current) fileRef.current.value = "";
    } else {
      setSaveMessage("Photo upload failed — please try a smaller file.");
      setSaveStatus("error");
      setTimeout(() => setSaveStatus(null), 4000);
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
      image_position: imagePosition || null,
      city: city.trim() || null,
      state: displayState || null,
      practice_areas: practiceAreas.length > 0 ? practiceAreas : null,
      licensed_states: licensedStates.length > 0 ? licensedStates : null,
      billing_type: billingType,
      fee_percent: billingType === "contingency" && feePercent !== "" ? parseFloat(feePercent) : null,
      hourly_rate: billingType === "hourly" && hourlyRate !== "" ? parseFloat(hourlyRate) : null,
      flat_fee: billingType === "flat" && flatFee !== "" ? parseFloat(flatFee) : null,
      cases_won: casesWon !== "" ? parseInt(casesWon) : null,
      total_cases: totalCases !== "" ? parseInt(totalCases) : null,
      recent_result: recentResult.trim() || null,
      recent_result_amount: recentResultAmount.trim() || null,
      response_time_hours: responseTime !== "" ? parseFloat(responseTime) : null,
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
      setSaveStatus("success");
      onSaved(payload);
    } else {
      setSaveStatus("error");
    }
    setTimeout(() => setSaveStatus(null), 4000);
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
              type="button"
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
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="mt-2.5 text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors"
            >
              {uploading ? "Uploading…" : "Change photo"}
            </button>
          </div>
        </div>
        {/* Photo position adjuster */}
        {photoUrl && (
          <div className="mt-5">
            <p className="text-xs font-semibold text-gray-500 mb-2">Adjust Photo Position <span className="font-normal text-gray-400">(drag to reposition how it appears on your card)</span></p>
            <div className="flex gap-4 items-start">
              {/* Live preview */}
              <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-gray-200 shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photoUrl}
                  alt="Preview"
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ objectPosition: imagePosition }}
                />
              </div>
              {/* Slider */}
              <div className="flex flex-col gap-1 flex-1 pt-1">
                <div className="flex justify-between text-[10px] text-gray-400 font-medium">
                  <span>Top</span>
                  <span>Bottom</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={parseInt(imagePosition.split(" ")[1] ?? "15")}
                  onChange={(e) => setImagePosition(`center ${e.target.value}%`)}
                  className="w-full accent-blue-500"
                />
                <p className="text-[10px] text-gray-400">Move the slider until your face is centered in the preview.</p>
              </div>
            </div>
          </div>
        )}
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
            icon={MapPin}
            label="City"
            value={city}
            onChange={setCity}
            placeholder="e.g. Los Angeles"
            type="text"
          />
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">State</label>
            <select
              value={displayState}
              onChange={(e) => setDisplayState(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="">Select state</option>
              {US_STATES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
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

        <div className="mt-4 space-y-4">
          {/* Practice Areas */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
              Practice Areas <span className="text-gray-400 normal-case font-normal">({practiceAreas.length} selected)</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {LEGAL_ISSUES.map((issue) => (
                <button
                  key={issue.value}
                  type="button"
                  onClick={() => setPracticeAreas((prev) =>
                    prev.includes(issue.label) ? prev.filter((a) => a !== issue.label) : [...prev, issue.label]
                  )}
                  className={`text-xs px-3 py-2 rounded-lg border font-medium text-left transition-colors ${
                    practiceAreas.includes(issue.label)
                      ? "bg-blue-500 text-white border-blue-500"
                      : "bg-gray-50 text-gray-600 border-gray-200 hover:border-blue-300"
                  }`}
                >
                  {issue.label}
                </button>
              ))}
            </div>
          </div>

          {/* Licensed States */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
              Licensed States <span className="text-gray-400 normal-case font-normal">({licensedStates.length} selected)</span>
            </label>
            <div className="h-48 overflow-y-auto border border-gray-200 rounded-xl p-3 bg-gray-50">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                {US_STATES.map((state) => (
                  <button
                    key={state}
                    type="button"
                    onClick={() => setLicensedStates((prev) =>
                      prev.includes(state) ? prev.filter((s) => s !== state) : [...prev, state]
                    )}
                    className={`text-xs px-2.5 py-1.5 rounded border font-medium transition-colors text-left ${
                      licensedStates.includes(state)
                        ? "bg-blue-500 text-white border-blue-500"
                        : "bg-white text-gray-600 border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    {state}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </SectionCard>

      {/* Fee Structure */}
      <SectionCard>
        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Fee Structure</h3>
        <p className="text-xs text-gray-400 mb-5">Update your fees at any time. Lower fees improve your ranking on the marketplace.</p>

        {/* Billing type */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          {(["contingency", "hourly", "flat"] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => { setBillingType(type); setFeePercent(""); setHourlyRate(""); setFlatFee(""); }}
              className={`flex-1 py-2.5 px-4 rounded-xl border text-sm font-semibold text-center transition-colors ${
                billingType === type ? "bg-blue-500 text-white border-blue-500" : "bg-gray-50 text-gray-600 border-gray-200 hover:border-blue-300"
              }`}
            >
              {type === "contingency" ? "Contingency %" : type === "hourly" ? "Hourly Rate" : "Flat Fee"}
            </button>
          ))}
        </div>

        {billingType === "contingency" && (
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Contingency Fee %</label>
            <div className="flex items-center gap-3">
              <input
                type="number" min="1" max="50" step="0.5"
                value={feePercent}
                onChange={(e) => setFeePercent(e.target.value)}
                placeholder="e.g. 28"
                className="w-28 bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              <span className="text-lg font-bold text-gray-400">%</span>
              <span className="text-xs text-gray-400">Industry avg is 34%</span>
            </div>
            {(() => {
              const pct = parseFloat(feePercent);
              if (!feePercent || isNaN(pct)) return null;
              const diff = Math.abs(pct - 34);
              const savings = Math.round(300000 * diff / 100);
              if (pct < 34) return (
                <p className="text-emerald-600 text-xs font-semibold mt-2">
                  {diff.toFixed(1)}% below avg · clients save ~${savings.toLocaleString()} on a $300K case
                </p>
              );
              if (pct > 34) return (
                <p className="text-red-500 text-xs font-semibold mt-2">
                  {diff.toFixed(1)}% above avg · ~${savings.toLocaleString()} more than avg on a $300K case
                </p>
              );
              return <p className="text-gray-400 text-xs font-semibold mt-2">At industry average</p>;
            })()}
          </div>
        )}

        {billingType === "hourly" && (
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Hourly Rate</label>
            <div className="flex items-center gap-3">
              <span className="text-lg font-bold text-gray-400">$</span>
              <input
                type="number" min="50" max="2000" step="5"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)}
                placeholder="e.g. 300"
                className="w-28 bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              <span className="text-xs text-gray-400">/ hour · Area avg ~$400/hr</span>
            </div>
            {(() => {
              const rate = parseFloat(hourlyRate);
              if (!hourlyRate || isNaN(rate)) return null;
              const diff = Math.abs(rate - 400);
              const savings = Math.round(diff * 10);
              if (rate < 400) return (
                <p className="text-emerald-600 text-xs font-semibold mt-2">
                  ${diff}/hr below avg · clients save ~${savings.toLocaleString()} on 10 hrs
                </p>
              );
              if (rate > 400) return (
                <p className="text-red-500 text-xs font-semibold mt-2">
                  ${diff}/hr above avg · ~${savings.toLocaleString()} more than avg on 10 hrs
                </p>
              );
              return <p className="text-gray-400 text-xs font-semibold mt-2">At area average</p>;
            })()}
          </div>
        )}

        {billingType === "flat" && (
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Flat Fee Amount</label>
            <div className="flex items-center gap-3">
              <span className="text-lg font-bold text-gray-400">$</span>
              <input
                type="number" min="100" step="50"
                value={flatFee}
                onChange={(e) => setFlatFee(e.target.value)}
                placeholder="e.g. 1500"
                className="w-32 bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
              <span className="text-xs text-gray-400">per case</span>
            </div>
          </div>
        )}
      </SectionCard>

      {/* Response Time */}
      <SectionCard>
        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Typical Response Time</h3>
        <p className="text-xs text-gray-400 mb-5">How quickly do you typically respond to new client inquiries? Faster response times improve your ranking.</p>
        <div className="flex flex-wrap gap-2">
          {[
            { label: "Under 1 hour", value: "0.5" },
            { label: "1–2 hours", value: "1" },
            { label: "Same day", value: "4" },
            { label: "Within 24 hours", value: "24" },
            { label: "1–2 business days", value: "48" },
          ].map(({ label, value }) => (
            <button
              key={value}
              type="button"
              onClick={() => setResponseTime(value)}
              className={`px-4 py-2 rounded-xl border text-sm font-semibold transition-colors ${
                responseTime === value
                  ? "bg-blue-500 text-white border-blue-500"
                  : "bg-gray-50 text-gray-600 border-gray-200 hover:border-blue-300"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        {responseTime && (
          <p className="text-xs text-gray-400 mt-3">
            This will display as your response time on your attorney card and profile.
          </p>
        )}
      </SectionCard>

      {/* Case Results */}
      <SectionCard>
        <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
          Case Results
        </h3>
        <p className="text-xs text-gray-400 mb-5">
          Displayed on your public profile and attorney card. Enter your track record to build client trust.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Cases Won</label>
            <input
              type="number"
              min="0"
              value={casesWon}
              onChange={(e) => setCasesWon(e.target.value)}
              placeholder="e.g. 298"
              className="w-full bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Total Cases</label>
            <input
              type="number"
              min="0"
              value={totalCases}
              onChange={(e) => setTotalCases(e.target.value)}
              placeholder="e.g. 321"
              className="w-full bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Notable Result</label>
            <input
              type="text"
              value={recentResult}
              onChange={(e) => setRecentResult(e.target.value)}
              placeholder="e.g. Largest jury verdict in Arizona (2020)"
              className="w-full bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Amount / Outcome</label>
            <input
              type="text"
              value={recentResultAmount}
              onChange={(e) => setRecentResultAmount(e.target.value)}
              placeholder="e.g. $10M+"
              className="w-full bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>
        {casesWon && totalCases && parseInt(totalCases) > 0 && (
          <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3 text-sm text-emerald-700 font-semibold">
            {Math.round((parseInt(casesWon) / parseInt(totalCases)) * 100)}% success rate · will display on your profile
          </div>
        )}
      </SectionCard>

      <div className="flex items-center justify-between gap-3 pt-2">
        <div className="text-sm font-medium">
          {saveStatus === "success" && (
            <span className="flex items-center gap-1.5 text-emerald-600">
              <CheckCircle className="w-4 h-4" /> Profile saved!
            </span>
          )}
          {saveStatus === "error" && (
            <span className="flex items-center gap-1.5 text-red-500">
              <AlertCircle className="w-4 h-4" /> {saveMessage || "Save failed — please try again"}
            </span>
          )}
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 disabled:opacity-60 text-white font-bold px-6 py-3 rounded-xl transition-colors text-sm"
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
          { label: "Total Leads",  value: totalLeads,  color: "bg-blue-100 text-blue-600" },
          { label: "New / Unread", value: newLeads,    color: "bg-amber-100 text-amber-600" },
          { label: "Retained",     value: retained,    color: "bg-purple-100 text-purple-600" },
          { label: "Closed / Won", value: closed,      color: "bg-green-100 text-green-600" },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
              <Inbox className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-gray-900">{value}</p>
              <p className="text-xs text-gray-500 font-medium">{label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent leads */}
        <div className="lg:col-span-2">
          <SectionCard>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-900">Recent Leads</h3>
              <button onClick={() => onTabChange("leads")} className="text-xs text-blue-500 hover:text-blue-700 font-semibold">View all →</button>
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

// ─── Leads Tab ────────────────────────────────────────────────────────────────

const LEAD_STATUSES: { key: string; label: string; dot: string; color: string }[] = [
  { key: "new",                label: "New Lead",              dot: "bg-blue-500",   color: "text-blue-700" },
  { key: "attempting_contact", label: "Attempting Contact",    dot: "bg-amber-500",  color: "text-amber-700" },
  { key: "contacted",          label: "Contacted — Follow Up", dot: "bg-orange-500", color: "text-orange-700" },
  { key: "retained",           label: "Retained",              dot: "bg-purple-500", color: "text-purple-700" },
  { key: "in_progress",        label: "In Progress",           dot: "bg-indigo-500", color: "text-indigo-700" },
  { key: "settlement",         label: "Settlement",            dot: "bg-teal-500",   color: "text-teal-700" },
  { key: "closed",             label: "Closed / Won",          dot: "bg-green-500",  color: "text-green-700" },
  { key: "lost",               label: "Lost",                  dot: "bg-gray-400",   color: "text-gray-500" },
];

function LeadStatusBadge({ status }: { status: string | null }) {
  const s = LEAD_STATUSES.find((x) => x.key === (status ?? "new")) ?? LEAD_STATUSES[0];
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${s.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

function LeadsTab({ leads, loading }: { leads: Lead[]; loading: boolean }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-20 bg-gray-100 rounded-2xl border border-gray-200 animate-pulse" />
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

  const filtered = leads.filter((l) => {
    const q = search.toLowerCase();
    const matchSearch = !q || `${l.first_name} ${l.last_name}`.toLowerCase().includes(q) || l.email.toLowerCase().includes(q) || l.legal_issue.toLowerCase().includes(q);
    const matchStatus = statusFilter === "all" || (l.status ?? "new") === statusFilter;
    return matchSearch && matchStatus;
  });

  const grouped = LEAD_STATUSES.map((s) => ({
    ...s,
    leads: filtered.filter((l) => (l.status ?? "new") === s.key),
  })).filter((g) => g.leads.length > 0);

  return (
    <div className="space-y-5">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or issue…"
            className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 text-sm bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All statuses</option>
          {LEAD_STATUSES.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-8 italic">No leads match your filters.</p>
      ) : (
        grouped.map((group) => (
          <div key={group.key}>
            <div className="flex items-center gap-2 mb-2 px-1">
              <span className={`w-2 h-2 rounded-full ${group.dot}`} />
              <span className={`text-xs font-bold uppercase tracking-widest ${group.color}`}>{group.label}</span>
              <span className="text-xs text-gray-400 font-semibold ml-1">{group.leads.length}</span>
            </div>
            <div className="space-y-2">
              {group.leads.map((lead) => (
                <Link key={lead.id} href={`/attorney-portal/leads/${lead.id}`}>
                  <SectionCard className="hover:border-blue-300 hover:shadow-md transition-all cursor-pointer">
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
                  </SectionCard>
                </Link>
              ))}
            </div>
          </div>
        ))
      )}
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
  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Load attorney profile on mount
  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await fetch(`/api/attorney/profile?id=${user.id}`).then((r) => r.json());
      if (data) setAttorney(data as Attorney);
    })();
  }, [user]);

  // Load leads when leads or dashboard tab is active
  useEffect(() => {
    if (activeTab !== "leads" && activeTab !== "dashboard" || !user) return;
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
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
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
          {activeTab === "dashboard" && (
            <DashboardTab attorney={attorney} leads={leads} leadsLoading={leadsLoading} onTabChange={setActiveTab} />
          )}
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
