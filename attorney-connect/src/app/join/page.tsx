"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Upload,
  Shield,
  Camera,
  User,
  Scale,
} from "lucide-react";
import { LEGAL_ISSUES, US_STATES } from "@/lib/data";

type Step = 1 | 2 | 3 | 4 | 5;

interface FormData {
  firmName: string;
  contactName: string;
  email: string;
  phone: string;
  website: string;
  practiceAreas: string[];
  states: string[];
  yearsExperience: string;
  firmSize: string;
  feePercent: string;
  acceptsContingency: boolean;
  bio: string;
  barLicense: string;
  malpracticeInsurance: string;
}

const FIRM_SIZES = [
  "Solo practitioner",
  "2–5 attorneys",
  "6–15 attorneys",
  "16–50 attorneys",
  "50+ attorneys",
];

const STEPS = [
  { n: 1, label: "Firm Info" },
  { n: 2, label: "Practice" },
  { n: 3, label: "Fees" },
  { n: 4, label: "Documents" },
  { n: 5, label: "Photo" },
];

export default function JoinPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [submitting, setSubmitting] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const photoRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<FormData>({
    firmName: "",
    contactName: "",
    email: "",
    phone: "",
    website: "",
    practiceAreas: [],
    states: [],
    yearsExperience: "",
    firmSize: "",
    feePercent: "",
    acceptsContingency: true,
    bio: "",
    barLicense: "",
    malpracticeInsurance: "",
  });

  function toggleArea(area: string) {
    setForm((f) => ({
      ...f,
      practiceAreas: f.practiceAreas.includes(area)
        ? f.practiceAreas.filter((a) => a !== area)
        : [...f.practiceAreas, area],
    }));
  }

  function toggleState(state: string) {
    setForm((f) => ({
      ...f,
      states: f.states.includes(state)
        ? f.states.filter((s) => s !== state)
        : [...f.states, state],
    }));
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

    if (step < 5) {
      setStep((s) => (s + 1) as Step);
      return;
    }

    // Final step — save to localStorage then send to Clerk sign-up
    setSubmitting(true);

    const pending = {
      name: form.contactName,
      firm: form.firmName,
      bio: form.bio,
      phone: form.phone,
      website: form.website,
      practiceAreas: form.practiceAreas,
      states: form.states,
      yearsExperience: form.yearsExperience,
      firmSize: form.firmSize,
      feePercent: form.feePercent,
      barLicense: form.barLicense,
      malpracticeInsurance: form.malpracticeInsurance,
    };

    try {
      localStorage.setItem("acPendingProfile", JSON.stringify(pending));
    } catch { /* ignore */ }

    if (photoPreview) {
      try {
        localStorage.setItem("acPendingPhoto", photoPreview);
      } catch { /* photo too large to store, skip */ }
    }

    router.push("/attorney-portal/sign-up");
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

          <div className="flex items-center justify-between mb-2">
            <Link
              href="/for-attorneys"
              className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Link>
            <Link
              href="/attorney-portal/sign-in"
              className="text-sm text-blue-500 hover:text-blue-600 font-semibold"
            >
              Already a partner? Sign in →
            </Link>
          </div>

          <h1 className="text-3xl font-extrabold text-gray-900">Apply as a Partner Firm</h1>
          <p className="text-gray-500 mt-2 text-sm">
            Free to apply · Live within 48 hours · No upfront cost
          </p>
        </div>

        {/* Progress */}
        <div className="flex items-center mb-8">
          {STEPS.map(({ n, label }, i) => (
            <div key={n} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                    step > n
                      ? "bg-green-500 text-white"
                      : step === n
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-400"
                  }`}
                >
                  {step > n ? <CheckCircle className="w-5 h-5" /> : n}
                </div>
                <span
                  className={`text-xs mt-1 font-medium ${
                    step === n ? "text-blue-500" : "text-gray-400"
                  }`}
                >
                  {label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={`flex-1 h-px mx-2 mb-4 ${
                    step > n ? "bg-green-400" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Form card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <form onSubmit={handleNext}>

            {/* Step 1 — Firm Info */}
            {step === 1 && (
              <div className="p-7 space-y-4">
                <h2 className="text-xl font-bold text-gray-900 mb-1">Firm Information</h2>
                <p className="text-sm text-gray-500 mb-4">Tell us about your law firm.</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                      Law Firm Name *
                    </label>
                    <input
                      required
                      value={form.firmName}
                      onChange={(e) => setForm({ ...form, firmName: e.target.value })}
                      placeholder="e.g. Smith & Associates, P.C."
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                      Primary Contact *
                    </label>
                    <input
                      required
                      value={form.contactName}
                      onChange={(e) => setForm({ ...form, contactName: e.target.value })}
                      placeholder="Full name"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                      Firm Size *
                    </label>
                    <select
                      required
                      value={form.firmSize}
                      onChange={(e) => setForm({ ...form, firmSize: e.target.value })}
                      className="w-full appearance-none border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-900"
                    >
                      <option value="">Select size</option>
                      {FIRM_SIZES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                      Email *
                    </label>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="contact@yourfirm.com"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                      Phone *
                    </label>
                    <input
                      required
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="(555) 000-0000"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-900"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                      Website
                    </label>
                    <input
                      type="text"
                      value={form.website}
                      onChange={(e) => setForm({ ...form, website: e.target.value })}
                      placeholder="yourfirm.com"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-900"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2 — Practice */}
            {step === 2 && (
              <div className="p-7 space-y-5">
                <h2 className="text-xl font-bold text-gray-900 mb-1">Practice Areas & Jurisdiction</h2>
                <p className="text-sm text-gray-500">
                  Select all that apply. These determine which cases we route to you.
                </p>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
                    Practice Areas * (select all that apply)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {LEGAL_ISSUES.map((issue) => (
                      <button
                        key={issue.value}
                        type="button"
                        onClick={() => toggleArea(issue.label)}
                        className={`text-xs px-3 py-2 rounded-lg border font-medium text-left transition-colors ${
                          form.practiceAreas.includes(issue.label)
                            ? "bg-blue-500 text-white border-blue-500"
                            : "bg-gray-50 text-gray-600 border-gray-200 hover:border-blue-300"
                        }`}
                      >
                        {issue.label}
                      </button>
                    ))}
                  </div>
                  {form.practiceAreas.length === 0 && (
                    <p className="text-xs text-red-500 mt-1">Please select at least one practice area.</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
                    Licensed States * (select all that apply)
                  </label>
                  <div className="h-48 overflow-y-auto border border-gray-200 rounded-lg p-3 bg-gray-50">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                      {US_STATES.map((state) => (
                        <button
                          key={state}
                          type="button"
                          onClick={() => toggleState(state)}
                          className={`text-xs px-2.5 py-1.5 rounded border font-medium transition-colors text-left ${
                            form.states.includes(state)
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

                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                    Years in Practice *
                  </label>
                  <select
                    required
                    value={form.yearsExperience}
                    onChange={(e) => setForm({ ...form, yearsExperience: e.target.value })}
                    className="w-full appearance-none border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-900"
                  >
                    <option value="">Select</option>
                    {["1–3 years", "4–7 years", "8–15 years", "15–25 years", "25+ years"].map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Step 3 — Fees & Bio */}
            {step === 3 && (
              <div className="p-7 space-y-5">
                <h2 className="text-xl font-bold text-gray-900 mb-1">Fee Structure & Bio</h2>
                <p className="text-sm text-gray-500">
                  This is what consumers see. Lower fees improve your placement ranking.
                </p>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                    Contingency Fee Percentage *
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      required
                      type="number"
                      min="1"
                      max="50"
                      step="0.5"
                      value={form.feePercent}
                      onChange={(e) => setForm({ ...form, feePercent: e.target.value })}
                      placeholder="e.g. 28"
                      className="w-32 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-900"
                    />
                    <span className="text-lg font-bold text-gray-400">%</span>
                    <span className="text-xs text-gray-500">
                      Industry average is 34%. Lower fees rank higher.
                    </span>
                  </div>
                  {form.feePercent && parseFloat(form.feePercent) < 33 && (
                    <p className="text-xs text-green-600 font-semibold mt-1.5 flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" />
                      {(33 - parseFloat(form.feePercent)).toFixed(1)}% below average — great for placement!
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                    Attorney Bio / Profile Summary *
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={form.bio}
                    onChange={(e) => setForm({ ...form, bio: e.target.value })}
                    placeholder="Describe your experience, your approach, and why clients choose you. This appears on your public profile."
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 resize-none text-gray-900"
                  />
                  <p className="text-xs text-gray-400 mt-1">{form.bio.length}/500 characters</p>
                </div>

                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-600">
                  <p className="font-semibold mb-1">Placement ranking factors:</p>
                  <ul className="space-y-1 text-xs text-blue-500">
                    <li>• Lower fee % → higher organic ranking</li>
                    <li>• Faster average response time → better placement</li>
                    <li>• Higher client ratings → more visibility</li>
                    <li>• No paid placements — merit only</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Step 4 — Documents */}
            {step === 4 && (
              <div className="p-7 space-y-5">
                <h2 className="text-xl font-bold text-gray-900 mb-1">Verification Documents</h2>
                <p className="text-sm text-gray-500">
                  We verify all attorneys before they go live. Provide your bar number and insurance info.
                </p>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                    State Bar License Number *
                  </label>
                  <input
                    required
                    value={form.barLicense}
                    onChange={(e) => setForm({ ...form, barLicense: e.target.value })}
                    placeholder="e.g. CA-298471"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                    Malpractice Insurance Provider *
                  </label>
                  <input
                    required
                    value={form.malpracticeInsurance}
                    onChange={(e) => setForm({ ...form, malpracticeInsurance: e.target.value })}
                    placeholder="e.g. CUNA Mutual, Zurich, ALPS"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 text-gray-900"
                  />
                </div>

                {["Bar License Certificate", "Malpractice Insurance Certificate"].map((doc) => (
                  <div key={doc}>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                      Upload {doc} <span className="text-gray-400 normal-case font-normal">(optional)</span>
                    </label>
                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-blue-300 transition-colors cursor-pointer bg-gray-50">
                      <Upload className="w-7 h-7 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm text-gray-400">Drag & drop or click to upload</p>
                      <p className="text-xs text-gray-300 mt-1">PDF, JPG, PNG up to 10MB</p>
                    </div>
                  </div>
                ))}

                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-xs text-gray-500">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-4 h-4 text-green-500" />
                    <span className="font-semibold text-gray-700">Your data is secure</span>
                  </div>
                  <p>
                    All documents are encrypted and stored securely. We only use them for
                    verification and never share them with third parties.
                  </p>
                </div>
              </div>
            )}

            {/* Step 5 — Profile Photo */}
            {step === 5 && (
              <div className="p-7 space-y-6">
                <h2 className="text-xl font-bold text-gray-900 mb-1">Profile Photo</h2>
                <p className="text-sm text-gray-500">
                  Add a professional headshot. Profiles with photos get significantly more
                  clicks. You can always update this later.
                </p>

                <div className="flex flex-col items-center gap-5 py-4">
                  {/* Preview */}
                  <div className="relative">
                    {photoPreview ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={photoPreview}
                        alt="Preview"
                        className="w-32 h-32 rounded-2xl object-cover border-2 border-gray-200 shadow"
                      />
                    ) : (
                      <div className="w-32 h-32 rounded-2xl bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
                        <User className="w-12 h-12 text-gray-300" />
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => photoRef.current?.click()}
                      className="absolute -bottom-2 -right-2 w-9 h-9 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center shadow-lg transition-colors"
                    >
                      <Camera className="w-4 h-4 text-white" />
                    </button>
                  </div>

                  <input
                    ref={photoRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoSelect}
                  />

                  <button
                    type="button"
                    onClick={() => photoRef.current?.click()}
                    className="text-sm text-blue-500 hover:text-blue-600 font-semibold transition-colors"
                  >
                    {photoPreview ? "Change photo" : "Upload a photo"}
                  </button>

                  {photoPreview && (
                    <button
                      type="button"
                      onClick={() => setPhotoPreview("")}
                      className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>

                {/* What happens next */}
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
                  <p className="font-semibold text-blue-700 text-sm mb-3">Almost done! Here&apos;s what happens next:</p>
                  <ol className="space-y-2">
                    {[
                      "Create your account and verify your email",
                      "We review your bar license and credentials (24–48 hrs)",
                      "Your profile goes live on the marketplace",
                      "Start receiving leads directly in your portal",
                    ].map((s, i) => (
                      <li key={s} className="flex items-start gap-2.5 text-xs text-blue-600">
                        <span className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center shrink-0 font-bold text-[10px] mt-0.5">
                          {i + 1}
                        </span>
                        {s}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="px-7 pb-7 flex items-center justify-between border-t border-gray-100 pt-5">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep((s) => (s - 1) as Step)}
                  className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 font-medium"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
              ) : (
                <Link
                  href="/for-attorneys"
                  className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 font-medium"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Link>
              )}

              <button
                type="submit"
                disabled={
                  submitting ||
                  (step === 2 && (form.practiceAreas.length === 0 || form.states.length === 0))
                }
                className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white font-bold px-6 py-2.5 rounded-xl transition-colors text-sm"
              >
                {submitting
                  ? "Saving…"
                  : step === 5
                  ? "Create My Account →"
                  : "Continue"}
                {!submitting && step < 5 && <ArrowRight className="w-4 h-4" />}
              </button>
            </div>
          </form>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          By applying you agree to our{" "}
          <Link href="#" className="text-blue-500 hover:underline">Partner Terms</Link> and{" "}
          <Link href="#" className="text-blue-500 hover:underline">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  );
}
