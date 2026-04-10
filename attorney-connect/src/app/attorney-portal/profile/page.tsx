"use client";

import { useEffect, useRef, useState } from "react";
import { useUser, useAuth } from "@clerk/nextjs";
import Link from "next/link";
import {
  Scale, ArrowLeft, User, Building2, Phone, Globe, FileText,
  Camera, Save, CheckCircle, AlertCircle, MapPin,
} from "lucide-react";
import type { Attorney } from "@/lib/supabase";
import { LEGAL_ISSUES, US_STATES } from "@/lib/data";

function SectionCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white border border-gray-200 shadow-sm rounded-2xl p-6 ${className}`}>
      {children}
    </div>
  );
}

function Field({
  icon: Icon, label, value, onChange, placeholder, type = "text", incomplete = false,
}: {
  icon: React.ElementType; label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string; incomplete?: boolean;
}) {
  return (
    <div>
      <label className={`block text-xs font-semibold mb-1.5 uppercase tracking-wide ${incomplete ? "text-red-500" : "text-gray-500"}`}>
        <span className="flex items-center gap-1.5">
          <Icon className="w-3.5 h-3.5" />
          {label}
          {incomplete && <span className="ml-auto normal-case font-normal text-red-400">Required</span>}
        </span>
      </label>
      <input
        type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className={`w-full text-gray-900 placeholder-gray-400 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 border ${
          incomplete ? "bg-red-50 border-red-300 focus:border-red-400 focus:ring-red-300" : "bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
        }`}
      />
    </div>
  );
}

export default function AttorneyProfilePage() {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);

  const [attorney, setAttorney] = useState<Attorney | null>(null);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [firm, setFirm] = useState("");
  const [bio, setBio] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [city, setCity] = useState("");
  const [displayState, setDisplayState] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [imagePosition, setImagePosition] = useState("center 15%");
  const [practiceAreas, setPracticeAreas] = useState<string[]>([]);
  const [licensedStates, setLicensedStates] = useState<string[]>([]);
  const [billingType, setBillingType] = useState<"contingency" | "hourly" | "flat">("contingency");
  const [feePercent, setFeePercent] = useState("");
  const [hourlyRate, setHourlyRate] = useState("");
  const [flatFee, setFlatFee] = useState("");
  const [casesWon, setCasesWon] = useState("");
  const [totalCases, setTotalCases] = useState("");
  const [recentResult, setRecentResult] = useState("");
  const [recentResultAmount, setRecentResultAmount] = useState("");
  const [responseTime, setResponseTime] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"success" | "error" | null>(null);
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    if (!isLoaded || !user) return;
    fetch(`/api/attorney/profile?id=${user.id}`)
      .then((r) => r.json())
      .then(({ data }) => {
        if (data) {
          const a = data as Attorney;
          setAttorney(a);
          setName(a.name ?? user.fullName ?? "");
          setFirm(a.firm ?? "");
          setBio(a.bio ?? "");
          setPhone(a.phone ?? "");
          setWebsite(a.website ?? "");
          setCity(a.city ?? "");
          setDisplayState(a.state ?? "");
          setPhotoUrl(a.photo_url ?? "");
          setImagePosition(a.image_position ?? "center 15%");
          setPracticeAreas(a.practice_areas ?? []);
          setLicensedStates(a.licensed_states ?? []);
          setBillingType((a.billing_type as "contingency" | "hourly" | "flat") ?? "contingency");
          setFeePercent(String(a.fee_percent ?? ""));
          setHourlyRate(String(a.hourly_rate ?? ""));
          setFlatFee(String(a.flat_fee ?? ""));
          setCasesWon(String(a.cases_won ?? ""));
          setTotalCases(String(a.total_cases ?? ""));
          setRecentResult(a.recent_result ?? "");
          setRecentResultAmount(a.recent_result_amount ?? "");
          setResponseTime(String(a.response_time_hours ?? ""));
        }
        setLoading(false);
      });
  }, [user, isLoaded]);

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
    const res = await fetch("/api/attorney/photo", { method: "POST", body: form });
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
      name: name.trim() || null, firm: firm.trim() || null, bio: bio.trim() || null,
      phone: phone.trim() || null, website: website.trim() || null,
      photo_url: photoUrl || null, image_position: imagePosition || null,
      city: city.trim() || null, state: displayState || null,
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
    const token = await getToken({ template: "supabase" }).catch(() => null);
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    const res = await fetch("/api/attorney/profile", { method: "POST", headers, body: JSON.stringify(payload) });
    setSaving(false);
    if (res.ok) {
      setSaveStatus("success");
      setAttorney((prev) => prev ? { ...prev, ...payload } as Attorney : prev);
    } else {
      setSaveStatus("error");
    }
    setTimeout(() => setSaveStatus(null), 4000);
  }

  const incomplete = {
    photo: !photoUrl,
    name: !name.trim(),
    bio: !bio.trim() || bio.trim().length < 20,
    practiceAreas: practiceAreas.length === 0,
    licensedStates: licensedStates.length === 0,
    fee: (billingType === "contingency" && !feePercent) || (billingType === "hourly" && !hourlyRate) || (billingType === "flat" && !flatFee),
    responseTime: !responseTime,
    website: !website.trim(),
  };
  const incompleteCount = Object.values(incomplete).filter(Boolean).length;

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
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">My Profile</h1>
          <p className="text-sm text-gray-500 mt-1">Update your public profile visible to potential clients.</p>
        </div>

        <div className="space-y-6">
          {/* Incomplete banner */}
          {incompleteCount > 0 && (
            <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-2xl px-5 py-4">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-sm text-red-700">{incompleteCount} profile {incompleteCount === 1 ? "field is" : "fields are"} incomplete</p>
                <p className="text-xs text-red-500 mt-0.5">Fields highlighted in red below need to be filled in.</p>
              </div>
            </div>
          )}

          {/* Photo */}
          <SectionCard>
            <h3 className={`text-sm font-semibold uppercase tracking-wider mb-4 ${incomplete.photo ? "text-red-500" : "text-gray-600"}`}>
              Profile Photo{incomplete.photo && <span className="ml-2 text-xs font-normal normal-case text-red-400">— Required</span>}
            </h3>
            <div className="flex items-center gap-5">
              <div className="relative">
                {photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={photoUrl} alt="Profile" className="w-20 h-20 rounded-2xl object-cover border-2 border-gray-200" style={{ objectPosition: imagePosition }} />
                ) : (
                  <div className={`w-20 h-20 rounded-2xl flex items-center justify-center border-2 ${incomplete.photo ? "bg-red-50 border-red-300" : "bg-gray-100 border-gray-200"}`}>
                    <User className={`w-8 h-8 ${incomplete.photo ? "text-red-300" : "text-gray-400"}`} />
                  </div>
                )}
                <button type="button" onClick={() => fileRef.current?.click()}
                  className="absolute -bottom-2 -right-2 w-7 h-7 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center shadow-lg transition-colors">
                  <Camera className="w-3.5 h-3.5 text-white" />
                </button>
              </div>
              <div>
                <p className="text-gray-900 font-semibold text-sm">{name || user?.fullName || "Your Name"}</p>
                <p className="text-gray-500 text-xs mt-0.5">{firm || "Your Firm"}</p>
                <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
                  className="mt-2.5 text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors">
                  {uploading ? "Uploading…" : "Change photo"}
                </button>
              </div>
            </div>
            {photoUrl && (
              <div className="mt-5">
                <p className="text-xs font-semibold text-gray-500 mb-2">Adjust Photo Position <span className="font-normal text-gray-400">(drag to reposition)</span></p>
                <div className="flex gap-4 items-start">
                  <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-gray-200 shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={photoUrl} alt="Preview" className="absolute inset-0 w-full h-full object-cover" style={{ objectPosition: imagePosition }} />
                  </div>
                  <div className="flex flex-col gap-1 flex-1 pt-1">
                    <div className="flex justify-between text-[10px] text-gray-400 font-medium"><span>Top</span><span>Bottom</span></div>
                    <input type="range" min={0} max={100} value={parseInt(imagePosition.split(" ")[1] ?? "15")}
                      onChange={(e) => setImagePosition(`center ${e.target.value}%`)} className="w-full accent-blue-500" />
                    <p className="text-[10px] text-gray-400">Move the slider until your face is centered.</p>
                  </div>
                </div>
              </div>
            )}
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
          </SectionCard>

          {/* Firm Details */}
          <SectionCard>
            <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-5">Firm Details</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field icon={User} label="Full Name" value={name} onChange={setName} placeholder="Jane Smith" incomplete={incomplete.name} />
              <Field icon={Building2} label="Law Firm" value={firm} onChange={setFirm} placeholder="Smith & Associates" />
              <Field icon={MapPin} label="City" value={city} onChange={setCity} placeholder="e.g. Los Angeles" />
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">State</label>
                <select value={displayState} onChange={(e) => setDisplayState(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                  <option value="">Select state</option>
                  {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <Field icon={Phone} label="Phone" value={phone} onChange={setPhone} placeholder="+1 (555) 000-0000" type="tel" />
              <Field icon={Globe} label="Website" value={website} onChange={setWebsite} placeholder="yourfirm.com" incomplete={incomplete.website} />
            </div>
            <div className="mt-4">
              <label className={`block text-xs font-semibold mb-1.5 uppercase tracking-wide ${incomplete.bio ? "text-red-500" : "text-gray-500"}`}>
                <span className="flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" />
                  Bio
                  {incomplete.bio && <span className="ml-auto normal-case font-normal text-red-400">Required (min 20 characters)</span>}
                </span>
              </label>
              <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={4}
                placeholder="Tell potential clients about your experience, practice areas, and approach..."
                className={`w-full text-gray-900 placeholder-gray-400 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 resize-none border ${
                  incomplete.bio ? "bg-red-50 border-red-300 focus:border-red-400 focus:ring-red-300" : "bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                }`} />
            </div>

            <div className="mt-4 space-y-4">
              {/* Practice Areas */}
              <div>
                <label className={`block text-xs font-semibold mb-2 uppercase tracking-wide ${incomplete.practiceAreas ? "text-red-500" : "text-gray-500"}`}>
                  Practice Areas{" "}
                  <span className={`normal-case font-normal ${incomplete.practiceAreas ? "text-red-400" : "text-gray-400"}`}>
                    {practiceAreas.length === 0 ? "— Required, select at least one" : `(${practiceAreas.length} selected)`}
                  </span>
                </label>
                <div className={`grid grid-cols-2 sm:grid-cols-3 gap-1.5 rounded-xl p-1 ${incomplete.practiceAreas ? "bg-red-50 border border-red-200" : ""}`}>
                  {LEGAL_ISSUES.map((issue) => (
                    <button key={issue.value} type="button"
                      onClick={() => setPracticeAreas((prev) => prev.includes(issue.label) ? prev.filter((a) => a !== issue.label) : [...prev, issue.label])}
                      className={`text-xs px-3 py-2 rounded-lg border font-medium text-left transition-colors ${
                        practiceAreas.includes(issue.label) ? "bg-blue-500 text-white border-blue-500" : "bg-gray-50 text-gray-600 border-gray-200 hover:border-blue-300"
                      }`}>
                      {issue.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Licensed States */}
              <div>
                <label className={`block text-xs font-semibold mb-2 uppercase tracking-wide ${incomplete.licensedStates ? "text-red-500" : "text-gray-500"}`}>
                  Licensed States{" "}
                  <span className={`normal-case font-normal ${incomplete.licensedStates ? "text-red-400" : "text-gray-400"}`}>
                    {licensedStates.length === 0 ? "— Required, select at least one" : `(${licensedStates.length} selected)`}
                  </span>
                </label>
                <div className={`h-48 overflow-y-auto rounded-xl p-3 border ${incomplete.licensedStates ? "border-red-300 bg-red-50" : "border-gray-200 bg-gray-50"}`}>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                    {US_STATES.map((state) => (
                      <button key={state} type="button"
                        onClick={() => setLicensedStates((prev) => prev.includes(state) ? prev.filter((s) => s !== state) : [...prev, state])}
                        className={`text-xs px-2.5 py-1.5 rounded border font-medium transition-colors text-left ${
                          licensedStates.includes(state) ? "bg-blue-500 text-white border-blue-500" : "bg-white text-gray-600 border-gray-200 hover:border-blue-300"
                        }`}>
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
            <h3 className={`text-sm font-semibold uppercase tracking-wider mb-1.5 ${incomplete.fee ? "text-red-500" : "text-gray-600"}`}>
              Fee Structure{incomplete.fee && <span className="ml-2 text-xs font-normal normal-case text-red-400">— Enter your fee amount</span>}
            </h3>
            <p className="text-xs text-gray-400 mb-5">Update your fees at any time. Lower fees improve your ranking.</p>
            <div className="flex flex-col sm:flex-row gap-3 mb-5">
              {(["contingency", "hourly", "flat"] as const).map((type) => (
                <button key={type} type="button"
                  onClick={() => { setBillingType(type); setFeePercent(""); setHourlyRate(""); setFlatFee(""); }}
                  className={`flex-1 py-2.5 px-4 rounded-xl border text-sm font-semibold text-center transition-colors ${
                    billingType === type ? "bg-blue-500 text-white border-blue-500" : "bg-gray-50 text-gray-600 border-gray-200 hover:border-blue-300"
                  }`}>
                  {type === "contingency" ? "Contingency %" : type === "hourly" ? "Hourly Rate" : "Flat Fee"}
                </button>
              ))}
            </div>
            {billingType === "contingency" && (
              <div>
                <label className={`block text-xs font-semibold mb-1.5 uppercase tracking-wide ${incomplete.fee ? "text-red-500" : "text-gray-500"}`}>Contingency Fee %</label>
                <div className="flex items-center gap-3">
                  <input type="number" min="1" max="50" step="0.5" value={feePercent} onChange={(e) => setFeePercent(e.target.value)} placeholder="e.g. 28"
                    className={`w-28 text-gray-900 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 border ${incomplete.fee ? "bg-red-50 border-red-300 focus:border-red-400 focus:ring-red-300" : "bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"}`} />
                  <span className="text-lg font-bold text-gray-400">%</span>
                  <span className="text-xs text-gray-400">Industry avg is 34%</span>
                </div>
              </div>
            )}
            {billingType === "hourly" && (
              <div>
                <label className={`block text-xs font-semibold mb-1.5 uppercase tracking-wide ${incomplete.fee ? "text-red-500" : "text-gray-500"}`}>Hourly Rate</label>
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-gray-400">$</span>
                  <input type="number" min="50" max="2000" step="5" value={hourlyRate} onChange={(e) => setHourlyRate(e.target.value)} placeholder="e.g. 300"
                    className={`w-28 text-gray-900 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 border ${incomplete.fee ? "bg-red-50 border-red-300 focus:border-red-400 focus:ring-red-300" : "bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"}`} />
                  <span className="text-xs text-gray-400">/ hour</span>
                </div>
              </div>
            )}
            {billingType === "flat" && (
              <div>
                <label className={`block text-xs font-semibold mb-1.5 uppercase tracking-wide ${incomplete.fee ? "text-red-500" : "text-gray-500"}`}>Flat Fee Amount</label>
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-gray-400">$</span>
                  <input type="number" min="100" step="50" value={flatFee} onChange={(e) => setFlatFee(e.target.value)} placeholder="e.g. 1500"
                    className={`w-32 text-gray-900 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 border ${incomplete.fee ? "bg-red-50 border-red-300 focus:border-red-400 focus:ring-red-300" : "bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-blue-500"}`} />
                </div>
              </div>
            )}
          </SectionCard>

          {/* Response Time */}
          <SectionCard>
            <h3 className={`text-sm font-semibold uppercase tracking-wider mb-1.5 ${incomplete.responseTime ? "text-red-500" : "text-gray-600"}`}>
              Typical Response Time{incomplete.responseTime && <span className="ml-2 text-xs font-normal normal-case text-red-400">— Required, select one</span>}
            </h3>
            <p className="text-xs text-gray-400 mb-5">How quickly do you typically respond to new client inquiries?</p>
            <div className="flex flex-wrap gap-2">
              {[
                { label: "Under 1 hour", value: "0.5" },
                { label: "1–2 hours", value: "1" },
                { label: "Same day", value: "4" },
                { label: "Within 24 hours", value: "24" },
                { label: "1–2 business days", value: "48" },
              ].map(({ label, value }) => (
                <button key={value} type="button" onClick={() => setResponseTime(value)}
                  className={`px-4 py-2 rounded-xl border text-sm font-semibold transition-colors ${
                    responseTime === value ? "bg-blue-500 text-white border-blue-500" : "bg-gray-50 text-gray-600 border-gray-200 hover:border-blue-300"
                  }`}>
                  {label}
                </button>
              ))}
            </div>
          </SectionCard>

          {/* Case Results */}
          <SectionCard>
            <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Case Results</h3>
            <p className="text-xs text-gray-400 mb-5">Displayed on your public profile. Enter your track record to build client trust.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Cases Won</label>
                <input type="number" min="0" value={casesWon} onChange={(e) => setCasesWon(e.target.value)} placeholder="e.g. 298"
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Total Cases</label>
                <input type="number" min="0" value={totalCases} onChange={(e) => setTotalCases(e.target.value)} placeholder="e.g. 321"
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Notable Result</label>
                <input type="text" value={recentResult} onChange={(e) => setRecentResult(e.target.value)} placeholder="e.g. Largest jury verdict in Arizona (2020)"
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Amount / Outcome</label>
                <input type="text" value={recentResultAmount} onChange={(e) => setRecentResultAmount(e.target.value)} placeholder="e.g. $10M+"
                  className="w-full bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
              </div>
            </div>
            {casesWon && totalCases && parseInt(totalCases) > 0 && (
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3 text-sm text-emerald-700 font-semibold">
                {Math.round((parseInt(casesWon) / parseInt(totalCases)) * 100)}% success rate · will display on your profile
              </div>
            )}
          </SectionCard>

          {/* Save bar */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <div className="text-sm font-medium">
              {saveStatus === "success" && (
                <span className="flex items-center gap-1.5 text-emerald-600"><CheckCircle className="w-4 h-4" /> Profile saved!</span>
              )}
              {saveStatus === "error" && (
                <span className="flex items-center gap-1.5 text-red-500"><AlertCircle className="w-4 h-4" /> {saveMessage || "Save failed — please try again"}</span>
              )}
            </div>
            <button onClick={handleSave} disabled={saving}
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 disabled:opacity-60 text-white font-bold px-6 py-3 rounded-xl transition-colors text-sm">
              <Save className="w-4 h-4" />
              {saving ? "Saving…" : "Save Profile"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
