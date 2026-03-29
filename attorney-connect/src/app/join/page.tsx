"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { SignUp } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle, ArrowRight, ArrowLeft, Upload, Shield,
  Camera, User, Scale,
} from "lucide-react";
import { LEGAL_ISSUES, US_STATES } from "@/lib/data";

type Step = 1 | 2 | 3 | 4 | 5 | 6;

interface FormData {
  firmName: string; contactName: string; email: string; phone: string; website: string;
  practiceAreas: string[]; states: string[]; yearsExperience: string; firmSize: string;
  billingType: "contingency" | "hourly" | "flat"; feePercent: string; hourlyRate: string; bio: string;
  barLicense: string; malpracticeInsurance: string;
}

const FIRM_SIZES = ["Solo practitioner", "2–5 attorneys", "6–15 attorneys", "16–50 attorneys", "50+ attorneys"];

const STEPS = [
  { n: 1, label: "Account" },
  { n: 2, label: "Firm" },
  { n: 3, label: "Practice" },
  { n: 4, label: "Fees" },
  { n: 5, label: "Documents" },
  { n: 6, label: "Photo" },
];

function JoinPageInner() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [photoPreview, setPhotoPreview] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const photoRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<FormData>({
    firmName: "", contactName: "", email: "", phone: "", website: "",
    practiceAreas: [], states: [], yearsExperience: "", firmSize: "",
    billingType: "contingency", feePercent: "", hourlyRate: "", bio: "",
    barLicense: "", malpracticeInsurance: "",
  });

  const stepParam = parseInt(searchParams.get("step") ?? "1") as Step;

  // Redirect logic
  useEffect(() => {
    if (!isLoaded) return;
    if (user && stepParam === 1) router.replace("/join?step=2");
    if (!user && stepParam > 1) router.replace("/join");
  }, [user, isLoaded, stepParam, router]);

  const currentStep: Step = user ? (stepParam > 1 ? stepParam : 2) : 1;

  function toggleArea(area: string) {
    setForm((f) => ({ ...f, practiceAreas: f.practiceAreas.includes(area) ? f.practiceAreas.filter((a) => a !== area) : [...f.practiceAreas, area] }));
  }

  function toggleState(state: string) {
    setForm((f) => ({ ...f, states: f.states.includes(state) ? f.states.filter((s) => s !== state) : [...f.states, state] }));
  }

  function handlePhotoSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPhotoPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  async function handleNext(e: React.FormEvent) {
    e.preventDefault();
    if (currentStep < 6) {
      router.push(`/join?step=${currentStep + 1}`);
      return;
    }
    // Final step — save everything
    setSubmitting(true);
    try {
      await fetch("/api/attorney/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.contactName,
          firm: form.firmName,
          bio: form.bio,
          phone: form.phone,
          website: form.website,
          email: form.email,
          practice_areas: form.practiceAreas,
          licensed_states: form.states,
          years_experience: form.yearsExperience,
          firm_size: form.firmSize,
          billing_type: form.billingType,
          fee_percent: form.billingType === "contingency" && form.feePercent ? parseFloat(form.feePercent) : null,
          hourly_rate: form.billingType === "hourly" && form.hourlyRate ? parseFloat(form.hourlyRate) : null,
          flat_fee: form.billingType === "flat" && form.feePercent ? parseFloat(form.feePercent) : null,
          bar_license: form.barLicense,
          malpractice_insurance: form.malpracticeInsurance,
          status: "pending",
        }),
      });

      if (photoPreview) {
        const res = await fetch(photoPreview);
        const blob = await res.blob();
        const ext = blob.type.split("/")[1] || "jpg";
        const file = new File([blob], `profile.${ext}`, { type: blob.type });
        const formData = new FormData();
        formData.append("file", file);
        await fetch("/api/attorney/photo", { method: "POST", body: formData });
      }
    } catch { /* ignore */ }
    router.push("/attorney-portal");
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-9 h-9 rounded-xl bg-blue-500 flex items-center justify-center shadow">
              <Scale className="w-5 h-5 text-white" />
            </div>
            <span className="font-extrabold text-lg tracking-tight text-gray-900">
              Attorney<span className="text-blue-500">Compete</span>
            </span>
          </Link>
          <div className="flex items-center mb-2">
            <Link href="/" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800">
              <ArrowLeft className="w-4 h-4" /> Back
            </Link>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900">Apply as a Partner Firm</h1>
          <p className="text-gray-500 mt-2 text-sm">Free to apply · Live within 48 hours · No upfront cost</p>
        </div>

        {/* Progress bar */}
        <div className="flex items-start mb-8">
          {STEPS.map(({ n, label }, i) => (
            <div key={n} className="flex items-start flex-1">
              <div className="flex flex-col items-center flex-1">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-colors shrink-0 ${currentStep > n ? "bg-green-500 text-white" : currentStep === n ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-400"}`}>
                  {currentStep > n ? <CheckCircle className="w-5 h-5" /> : n}
                </div>
                <span className={`text-xs mt-1 font-medium text-center whitespace-nowrap ${currentStep === n ? "text-blue-500" : "text-gray-400"}`}>{label}</span>
              </div>
              {i < STEPS.length - 1 && <div className={`flex-1 h-px mx-2 mt-4 ${currentStep > n ? "bg-green-400" : "bg-gray-200"}`} />}
            </div>
          ))}
        </div>

        {/* Step 1 — Clerk SignUp */}
        {currentStep === 1 && (
          <div>
            <div className="flex justify-center w-full">
            <SignUp
              routing="hash"
              forceRedirectUrl="/join?step=2"
              signInUrl="/attorney-portal/sign-in"
              appearance={{
                elements: {
                  rootBox: "w-full flex justify-center",
                  card: "bg-white border border-gray-200 shadow-sm rounded-2xl",
                  headerTitle: "text-gray-900 font-bold",
                  headerSubtitle: "text-gray-500",
                  socialButtonsBlockButton: "bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors",
                  socialButtonsBlockButtonText: "text-gray-700 font-medium",
                  dividerLine: "bg-gray-200",
                  dividerText: "text-gray-400",
                  formFieldLabel: "text-gray-600 font-semibold",
                  formFieldInput: "bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500",
                  phoneInputBox: "bg-gray-50 border border-gray-200 text-gray-900 rounded-xl",
                  otpCodeFieldInput: "bg-gray-50 border border-gray-200 text-gray-900 rounded-xl",
                  identityPreviewText: "text-gray-700",
                  identityPreviewEditButtonIcon: "text-blue-500",
                  formButtonPrimary: "bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl transition-colors",
                  footerActionLink: "text-blue-500 hover:text-blue-600",
                  alertText: "text-red-500",
                  formResendCodeLink: "text-blue-500",
                },
              }}
            />
            </div>
          </div>
        )}

        {/* Steps 2–6 — Form */}
        {currentStep >= 2 && user && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <form onSubmit={handleNext}>
              {/* Step 2 — Firm Info */}
              {currentStep === 2 && (
                <div className="p-7 space-y-4">
                  <h2 className="text-xl font-bold text-gray-900 mb-1">Firm Information</h2>
                  <p className="text-sm text-gray-500 mb-4">Tell us about your law firm.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Law Firm Name *</label>
                      <input required value={form.firmName} onChange={(e) => setForm({ ...form, firmName: e.target.value })} placeholder="e.g. Smith & Associates, P.C." className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-900" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Primary Contact *</label>
                      <input required value={form.contactName} onChange={(e) => setForm({ ...form, contactName: e.target.value })} placeholder="Full name" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-900" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Firm Size *</label>
                      <select required value={form.firmSize} onChange={(e) => setForm({ ...form, firmSize: e.target.value })} className="w-full appearance-none border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-900">
                        <option value="">Select size</option>
                        {FIRM_SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Phone *</label>
                      <input required type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="(555) 000-0000" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-900" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Website</label>
                      <input type="text" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} placeholder="yourfirm.com" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-900" />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3 — Practice */}
              {currentStep === 3 && (
                <div className="p-7 space-y-5">
                  <h2 className="text-xl font-bold text-gray-900 mb-1">Practice Areas & Jurisdiction</h2>
                  <p className="text-sm text-gray-500">Select all that apply. These determine which cases we route to you.</p>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Practice Areas * (select all that apply)</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {LEGAL_ISSUES.map((issue) => (
                        <button key={issue.value} type="button" onClick={() => toggleArea(issue.label)} className={`text-xs px-3 py-2 rounded-lg border font-medium text-left transition-colors ${form.practiceAreas.includes(issue.label) ? "bg-blue-500 text-white border-blue-500" : "bg-gray-50 text-gray-600 border-gray-200 hover:border-blue-300"}`}>{issue.label}</button>
                      ))}
                    </div>
                    {form.practiceAreas.length === 0 && <p className="text-xs text-red-500 mt-1">Please select at least one practice area.</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">Licensed States * (select all that apply)</label>
                    <div className="h-48 overflow-y-auto border border-gray-200 rounded-lg p-3 bg-gray-50">
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                        {US_STATES.map((state) => (
                          <button key={state} type="button" onClick={() => toggleState(state)} className={`text-xs px-2.5 py-1.5 rounded border font-medium transition-colors text-left ${form.states.includes(state) ? "bg-blue-500 text-white border-blue-500" : "bg-white text-gray-600 border-gray-200 hover:border-blue-300"}`}>{state}</button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Years in Practice *</label>
                    <select required value={form.yearsExperience} onChange={(e) => setForm({ ...form, yearsExperience: e.target.value })} className="w-full appearance-none border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-900">
                      <option value="">Select</option>
                      {["1–3 years", "4–7 years", "8–15 years", "15–25 years", "25+ years"].map((y) => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                </div>
              )}

              {/* Step 4 — Fees & Bio */}
              {currentStep === 4 && (
                <div className="p-7 space-y-5">
                  <h2 className="text-xl font-bold text-gray-900 mb-1">Fee Structure & Bio</h2>
                  <p className="text-sm text-gray-500">This is what consumers see. Lower fees improve your placement ranking.</p>

                  {/* Billing type selector */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">How do you charge clients? *</label>
                    <div className="grid grid-cols-3 gap-3">
                      {(["contingency", "hourly", "flat"] as const).map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setForm({ ...form, billingType: type, feePercent: "", hourlyRate: "" })}
                          className={`py-3 px-4 rounded-xl border text-sm font-semibold text-center transition-colors ${form.billingType === type ? "bg-blue-500 text-white border-blue-500" : "bg-gray-50 text-gray-600 border-gray-200 hover:border-blue-300"}`}
                        >
                          {type === "contingency" ? "Contingency %" : type === "hourly" ? "Hourly Rate" : "Flat Fee"}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Contingency */}
                  {form.billingType === "contingency" && (
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Contingency Fee Percentage *</label>
                      <div className="flex items-center gap-3">
                        <input required type="number" min="1" max="50" step="0.5" value={form.feePercent} onChange={(e) => setForm({ ...form, feePercent: e.target.value })} placeholder="e.g. 28" className="w-32 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-900" />
                        <span className="text-lg font-bold text-gray-400">%</span>
                        <span className="text-xs text-gray-500">Industry avg is 34%. Lower fees rank higher.</span>
                      </div>
                      {form.feePercent && parseFloat(form.feePercent) < 33 && (
                        <p className="text-xs text-green-600 font-semibold mt-1.5 flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" />{(33 - parseFloat(form.feePercent)).toFixed(1)}% below average — great for placement!</p>
                      )}
                      {form.feePercent && parseFloat(form.feePercent) >= 33 && (
                        <p className="text-xs text-red-500 font-semibold mt-1.5 flex items-center gap-1"><ArrowRight className="w-3.5 h-3.5 rotate-90" />{(parseFloat(form.feePercent) - 33).toFixed(1)}% above average — lower fees rank higher.</p>
                      )}
                    </div>
                  )}

                  {/* Hourly */}
                  {form.billingType === "hourly" && (
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Hourly Rate *</label>
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-bold text-gray-400">$</span>
                        <input required type="number" min="50" max="2000" step="5" value={form.hourlyRate} onChange={(e) => setForm({ ...form, hourlyRate: e.target.value })} placeholder="e.g. 300" className="w-32 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-900" />
                        <span className="text-xs text-gray-500">/ hour · Area avg is ~$350–$450/hr.</span>
                      </div>
                      {form.hourlyRate && parseFloat(form.hourlyRate) < 350 && (
                        <p className="text-xs text-green-600 font-semibold mt-1.5 flex items-center gap-1"><CheckCircle className="w-3.5 h-3.5" />${(350 - parseFloat(form.hourlyRate)).toFixed(0)}/hr below average — great for placement!</p>
                      )}
                      {form.hourlyRate && parseFloat(form.hourlyRate) >= 350 && (
                        <p className="text-xs text-red-500 font-semibold mt-1.5 flex items-center gap-1"><ArrowRight className="w-3.5 h-3.5 rotate-90" />${(parseFloat(form.hourlyRate) - 350).toFixed(0)}/hr above average — lower rates rank higher.</p>
                      )}
                    </div>
                  )}

                  {/* Flat fee */}
                  {form.billingType === "flat" && (
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Flat Fee Amount *</label>
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-bold text-gray-400">$</span>
                        <input required type="number" min="100" step="50" value={form.feePercent} onChange={(e) => setForm({ ...form, feePercent: e.target.value })} placeholder="e.g. 1500" className="w-40 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-900" />
                        <span className="text-xs text-gray-500">per case or service.</span>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Attorney Bio / Profile Summary *</label>
                    <textarea required rows={5} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder="Describe your experience, your approach, and why clients choose you. This appears on your public profile." className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 resize-none text-gray-900" />
                    <p className="text-xs text-gray-400 mt-1">{form.bio.length}/500 characters</p>
                  </div>
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-600">
                    <p className="font-semibold mb-1">Placement ranking factors:</p>
                    <ul className="space-y-1 text-xs text-blue-500">
                      <li>• Lower fees → higher organic ranking</li>
                      <li>• Faster average response time → better placement</li>
                      <li>• Higher client ratings → more visibility</li>
                      <li>• No paid placements — merit only</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Step 5 — Documents */}
              {currentStep === 5 && (
                <div className="p-7 space-y-5">
                  <h2 className="text-xl font-bold text-gray-900 mb-1">Verification Documents</h2>
                  <p className="text-sm text-gray-500">We verify all attorneys before they go live.</p>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">State Bar License Number *</label>
                    <input required value={form.barLicense} onChange={(e) => setForm({ ...form, barLicense: e.target.value })} placeholder="e.g. CA-298471" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-900" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Malpractice Insurance Provider *</label>
                    <input required value={form.malpracticeInsurance} onChange={(e) => setForm({ ...form, malpracticeInsurance: e.target.value })} placeholder="e.g. CUNA Mutual, Zurich, ALPS" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-900" />
                  </div>
                  {["Bar License Certificate", "Malpractice Insurance Certificate"].map((doc) => (
                    <div key={doc}>
                      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Upload {doc} <span className="text-gray-400 normal-case font-normal">(optional)</span></label>
                      <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-blue-300 transition-colors cursor-pointer bg-gray-50">
                        <Upload className="w-7 h-7 text-gray-300 mx-auto mb-2" />
                        <p className="text-sm text-gray-400">Drag & drop or click to upload</p>
                        <p className="text-xs text-gray-300 mt-1">PDF, JPG, PNG up to 10MB</p>
                      </div>
                    </div>
                  ))}
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-xs text-gray-500">
                    <div className="flex items-center gap-2 mb-2"><Shield className="w-4 h-4 text-green-500" /><span className="font-semibold text-gray-700">Your data is secure</span></div>
                    <p>All documents are encrypted and stored securely. We only use them for verification and never share them with third parties.</p>
                  </div>
                </div>
              )}

              {/* Step 6 — Photo */}
              {currentStep === 6 && (
                <div className="p-7 space-y-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-1">Profile Photo</h2>
                  <p className="text-sm text-gray-500">Add a professional headshot. Profiles with photos get significantly more clicks. You can always update this later.</p>
                  <div className="flex flex-col items-center gap-5 py-4">
                    <div className="relative">
                      {photoPreview ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={photoPreview} alt="Preview" className="w-32 h-32 rounded-2xl object-cover border-2 border-gray-200 shadow" />
                      ) : (
                        <div className="w-32 h-32 rounded-2xl bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center"><User className="w-12 h-12 text-gray-300" /></div>
                      )}
                      <button type="button" onClick={() => photoRef.current?.click()} className="absolute -bottom-2 -right-2 w-9 h-9 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center shadow-lg transition-colors"><Camera className="w-4 h-4 text-white" /></button>
                    </div>
                    <input ref={photoRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoSelect} />
                    <button type="button" onClick={() => photoRef.current?.click()} className="text-sm text-blue-500 hover:text-blue-600 font-semibold transition-colors">{photoPreview ? "Change photo" : "Upload a photo"}</button>
                    {photoPreview && <button type="button" onClick={() => setPhotoPreview("")} className="text-xs text-gray-400 hover:text-gray-600 transition-colors">Remove</button>}
                  </div>
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
                    <p className="font-semibold text-blue-700 text-sm mb-3">You&apos;re almost done! Here&apos;s what happens next:</p>
                    <ol className="space-y-2">
                      {["We review your bar license and credentials (24–48 hrs)", "Your profile goes live on the marketplace", "Start receiving leads directly in your portal"].map((s, i) => (
                        <li key={s} className="flex items-start gap-2.5 text-xs text-blue-600">
                          <span className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center shrink-0 font-bold text-[10px] mt-0.5">{i + 1}</span>{s}
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="px-7 pb-7 flex items-center justify-between border-t border-gray-100 pt-5">
                {currentStep > 2 ? (
                  <button type="button" onClick={() => router.push(`/join?step=${currentStep - 1}`)} className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 font-medium"><ArrowLeft className="w-4 h-4" />Back</button>
                ) : (
                  <Link href="/" className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 font-medium"><ArrowLeft className="w-4 h-4" />Back</Link>
                )}
                <button
                  type="submit"
                  disabled={submitting || (currentStep === 3 && (form.practiceAreas.length === 0 || form.states.length === 0))}
                  className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white font-bold px-6 py-2.5 rounded-xl transition-colors text-sm"
                >
                  {submitting ? "Submitting…" : currentStep === 6 ? "Complete Application" : "Continue"}
                  {!submitting && currentStep < 6 && <ArrowRight className="w-4 h-4" />}
                </button>
              </div>
            </form>
          </div>
        )}

        <p className="text-center text-xs text-gray-400 mt-4">
          By applying you agree to our{" "}
          <Link href="#" className="text-blue-500 hover:underline">Partner Terms</Link> and{" "}
          <Link href="#" className="text-blue-500 hover:underline">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  );
}

export default function JoinPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>}>
      <JoinPageInner />
    </Suspense>
  );
}
