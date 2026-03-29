"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle, ArrowRight, ArrowLeft, Upload, Shield } from "lucide-react";
import { LEGAL_ISSUES, US_STATES } from "@/lib/data";

type Step = 1 | 2 | 3 | 4;

interface FormData {
  // Step 1: Firm info
  firmName: string;
  contactName: string;
  email: string;
  phone: string;
  website: string;
  // Step 2: Practice
  practiceAreas: string[];
  states: string[];
  yearsExperience: string;
  firmSize: string;
  // Step 3: Fees & terms
  feePercent: string;
  acceptsContingency: boolean;
  bio: string;
  // Step 4: Documents
  barLicense: string;
  malpracticeInsurance: string;
}

const FIRM_SIZES = ["Solo practitioner", "2–5 attorneys", "6–15 attorneys", "16–50 attorneys", "50+ attorneys"];

export default function JoinPage() {
  const [step, setStep] = useState<Step>(1);
  const [submitted, setSubmitted] = useState(false);
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

  function handleNext(e: React.FormEvent) {
    e.preventDefault();
    if (step < 4) setStep((s) => (s + 1) as Step);
    else setSubmitted(true);
  }

  const STEPS = [
    { n: 1, label: "Firm Info" },
    { n: 2, label: "Practice" },
    { n: 3, label: "Fees" },
    { n: 4, label: "Documents" },
  ];

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-10 max-w-md w-full text-center shadow-lg">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-9 h-9 text-green-600" />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Application Submitted!</h2>
          <p className="text-gray-500 mb-6 text-sm leading-relaxed">
            Thank you, <strong>{form.contactName || form.firmName}</strong>! Our team will review your application
            and verify your credentials within 24–48 hours. You&apos;ll receive an email at{" "}
            <strong>{form.email}</strong> with next steps.
          </p>
          <div className="bg-accent-50 border border-accent-100 rounded-xl p-4 text-sm text-accent-500 mb-6 text-left">
            <p className="font-semibold mb-1">What happens next:</p>
            <ul className="space-y-1">
              {["Bar license verification", "Background check", "Malpractice insurance confirmation", "Profile goes live"].map((s) => (
                <li key={s} className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-accent-500" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
          <Link href="/" className="text-accent-500 text-sm font-semibold hover:underline">
            Return to homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/for-attorneys" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-accent-500 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Partner Info
          </Link>
          <h1 className="text-3xl font-extrabold text-gray-900">Apply as a Partner Firm</h1>
          <p className="text-gray-500 mt-2 text-sm">Free to apply · Live within 48 hours · No upfront cost</p>
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
                      ? "bg-accent-500 text-white"
                      : "bg-gray-200 text-gray-400"
                  }`}
                >
                  {step > n ? <CheckCircle className="w-5 h-5" /> : n}
                </div>
                <span className={`text-xs mt-1 font-medium ${step === n ? "text-accent-500" : "text-gray-400"}`}>
                  {label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-px mx-2 mb-4 ${step > n ? "bg-green-400" : "bg-gray-200"}`} />
              )}
            </div>
          ))}
        </div>

        {/* Form card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <form onSubmit={handleNext}>
            {/* Step 1 */}
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
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 bg-gray-50"
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
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 bg-gray-50"
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
                      className="w-full appearance-none border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 bg-gray-50"
                    >
                      <option value="">Select size</option>
                      {FIRM_SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
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
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 bg-gray-50"
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
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 bg-gray-50"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                      Website
                    </label>
                    <input
                      type="url"
                      value={form.website}
                      onChange={(e) => setForm({ ...form, website: e.target.value })}
                      placeholder="https://yourfirm.com"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 bg-gray-50"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <div className="p-7 space-y-5">
                <h2 className="text-xl font-bold text-gray-900 mb-1">Practice Areas & Jurisdiction</h2>
                <p className="text-sm text-gray-500">Select all that apply. These determine which cases we route to you.</p>

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
                            ? "bg-accent-500 text-white border-accent-500"
                            : "bg-gray-50 text-gray-600 border-gray-200 hover:border-accent-200"
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
                              ? "bg-accent-500 text-white border-accent-500"
                              : "bg-white text-gray-600 border-gray-200 hover:border-accent-200"
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
                    className="w-full appearance-none border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 bg-gray-50"
                  >
                    <option value="">Select</option>
                    {["1–3 years", "4–7 years", "8–15 years", "15–25 years", "25+ years"].map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Step 3 */}
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
                      className="w-32 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 bg-gray-50"
                    />
                    <span className="text-lg font-bold text-gray-400">%</span>
                    <span className="text-xs text-gray-500">
                      Industry average is 34%. Lower fees rank higher on our platform.
                    </span>
                  </div>
                  {form.feePercent && parseFloat(form.feePercent) < 33 && (
                    <p className="text-xs text-green-600 font-semibold mt-1.5 flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" />
                      {(33 - parseFloat(form.feePercent)).toFixed(1)}% below industry average — great for placement!
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
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 bg-gray-50 resize-none"
                  />
                  <p className="text-xs text-gray-400 mt-1">{form.bio.length}/500 characters</p>
                </div>

                <div className="bg-accent-50 border border-accent-100 rounded-xl p-4 text-sm text-accent-500">
                  <p className="font-semibold mb-1">Placement ranking factors:</p>
                  <ul className="space-y-1 text-xs text-accent-500">
                    <li>• Lower fee % → higher organic ranking</li>
                    <li>• Faster average response time → better placement</li>
                    <li>• Higher client ratings → more visibility</li>
                    <li>• No paid placements — merit only</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Step 4 */}
            {step === 4 && (
              <div className="p-7 space-y-5">
                <h2 className="text-xl font-bold text-gray-900 mb-1">Verification Documents</h2>
                <p className="text-sm text-gray-500">
                  We verify all attorneys before they go live. Upload or provide your bar number and insurance info.
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
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 bg-gray-50"
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
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 bg-gray-50"
                  />
                </div>

                {/* Upload areas */}
                {["Bar License Certificate", "Malpractice Insurance Certificate"].map((doc) => (
                  <div key={doc}>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                      Upload {doc} (optional)
                    </label>
                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-accent-200 transition-colors cursor-pointer bg-gray-50">
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
                  <p>All documents are encrypted and stored securely. We only use them for verification purposes and never share them with third parties.</p>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="px-7 pb-7 flex items-center justify-between">
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
                <Link href="/for-attorneys" className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 font-medium">
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Link>
              )}
              <button
                type="submit"
                disabled={step === 2 && (form.practiceAreas.length === 0 || form.states.length === 0)}
                className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white font-bold px-6 py-2.5 rounded-xl transition-colors text-sm"
              >
                {step === 4 ? "Submit Application" : "Continue"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          By applying you agree to our{" "}
          <Link href="#" className="text-accent-500 hover:underline">Partner Terms</Link> and{" "}
          <Link href="#" className="text-accent-500 hover:underline">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  );
}
