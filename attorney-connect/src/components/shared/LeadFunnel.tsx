"use client";

import { useState } from "react";
import { X, ChevronLeft, CheckCircle, Loader2 } from "lucide-react";
import { US_STATES } from "@/lib/data";

// ── Types ─────────────────────────────────────────────────────────────────────

type Question = {
  id: string;
  text: string;
  type: "choice" | "text";
  options?: string[];
  placeholder?: string;
};

type FunnelDef = { questions: Question[] };

// ── Specialty question sets ───────────────────────────────────────────────────

const FUNNELS: Record<string, FunnelDef> = {
  injury: {
    questions: [
      { id: "type", text: "What type of incident occurred?", type: "choice", options: ["Car accident", "Slip & fall", "Workplace injury", "Wrongful death", "Pedestrian accident", "Other injury"] },
      { id: "when", text: "When did this happen?", type: "choice", options: ["Within the last 30 days", "1–3 months ago", "3–12 months ago", "Over a year ago"] },
      { id: "medical", text: "Have you received medical treatment?", type: "choice", options: ["Yes, currently treating", "Yes, treatment is complete", "Not yet, but I need to", "No injuries requiring treatment"] },
      { id: "fault", text: "Do you believe you were at fault at all?", type: "choice", options: ["No, not at fault", "Possibly partially", "Unsure", "Yes, partially"] },
      { id: "represented", text: "Are you currently represented by another attorney?", type: "choice", options: ["No", "Yes", "I had one but parted ways"] },
    ],
  },
  malpractice: {
    questions: [
      { id: "type", text: "What type of medical malpractice occurred?", type: "choice", options: ["Misdiagnosis or delayed diagnosis", "Surgical error", "Medication error", "Birth injury", "Hospital negligence", "Other"] },
      { id: "when", text: "When did this occur?", type: "choice", options: ["Within the last 6 months", "6–12 months ago", "1–2 years ago", "Over 2 years ago"] },
      { id: "harm", text: "What harm resulted?", type: "choice", options: ["Permanent injury or disability", "Extended hospital stay", "Additional surgery required", "Worsened condition", "Death of a loved one"] },
      { id: "second_opinion", text: "Have you sought a second medical opinion?", type: "choice", options: ["Yes", "No", "In progress"] },
    ],
  },
  workers_comp: {
    questions: [
      { id: "type", text: "What type of workplace injury?", type: "choice", options: ["Sudden accident", "Repetitive stress injury", "Occupational illness", "Equipment malfunction", "Slip & fall at work", "Other"] },
      { id: "reported", text: "Have you reported the injury to your employer?", type: "choice", options: ["Yes", "No", "Unsure how to"] },
      { id: "claim", text: "Has a workers' comp claim been filed?", type: "choice", options: ["Yes, it was approved", "Yes, it was denied", "Yes, it's pending", "No claim filed yet"] },
      { id: "employed", text: "Are you still employed there?", type: "choice", options: ["Yes", "No — I was let go", "No — I resigned", "On leave"] },
    ],
  },
  employment: {
    questions: [
      { id: "type", text: "What type of issue are you facing?", type: "choice", options: ["Race or national origin discrimination", "Gender or pregnancy discrimination", "Age discrimination", "Disability discrimination", "Sexual harassment", "Wrongful termination", "Retaliation", "Wage theft / unpaid overtime"] },
      { id: "employed", text: "Are you still employed there?", type: "choice", options: ["Yes", "No — terminated", "No — I resigned", "On leave"] },
      { id: "hr", text: "Have you reported this to HR or a supervisor?", type: "choice", options: ["Yes, and nothing was done", "Yes, and it got worse", "No", "There is no HR department"] },
      { id: "when", text: "When did this start?", type: "choice", options: ["Within the last 30 days", "1–6 months ago", "6–12 months ago", "Over a year ago"] },
    ],
  },
  criminal: {
    questions: [
      { id: "type", text: "What type of charge are you facing?", type: "choice", options: ["DUI / DWI", "Drug offense", "Assault or battery", "Theft or fraud", "Domestic violence", "White collar / financial", "Traffic violation", "Other"] },
      { id: "severity", text: "Is this a felony or misdemeanor?", type: "choice", options: ["Felony", "Misdemeanor", "Not sure yet", "Not yet charged — under investigation"] },
      { id: "court_date", text: "Do you have a court date scheduled?", type: "choice", options: ["Yes, within the next 30 days", "Yes, more than 30 days out", "No court date yet", "I was just arrested"] },
      { id: "police", text: "Have you spoken to police without an attorney present?", type: "choice", options: ["No", "Yes, briefly", "Yes, gave a full statement"] },
    ],
  },
  family: {
    questions: [
      { id: "type", text: "What do you need help with?", type: "choice", options: ["Divorce", "Child custody or visitation", "Child support", "Spousal support / alimony", "Adoption", "Prenuptial agreement", "Domestic violence / protective order", "Other"] },
      { id: "children", text: "Are minor children involved?", type: "choice", options: ["Yes", "No"] },
      { id: "property", text: "Is significant property or assets involved?", type: "choice", options: ["Yes", "No", "Unsure"] },
      { id: "other_party", text: "Is the other party represented by an attorney?", type: "choice", options: ["Yes", "Not yet", "Unsure"] },
    ],
  },
  immigration: {
    questions: [
      { id: "type", text: "What do you need help with?", type: "choice", options: ["Visa application or extension", "Green card / permanent residency", "Citizenship / naturalization", "Deportation defense", "Asylum claim", "Work authorization / EAD", "Family petition", "Other"] },
      { id: "status", text: "What is your current immigration status?", type: "choice", options: ["US citizen", "Permanent resident (green card)", "Visa holder (work, student, etc.)", "Undocumented", "Pending status", "Prefer not to say"] },
      { id: "deadline", text: "Is there a deadline or court date involved?", type: "choice", options: ["Yes, within 30 days", "Yes, within 3 months", "No immediate deadline", "Unsure"] },
    ],
  },
  bankruptcy: {
    questions: [
      { id: "type", text: "What type of bankruptcy are you considering?", type: "choice", options: ["Chapter 7 (liquidation)", "Chapter 13 (repayment plan)", "Chapter 11 (business)", "Not sure which applies"] },
      { id: "debt_type", text: "What is the primary type of debt?", type: "choice", options: ["Credit card debt", "Medical bills", "Business debts", "Mortgage / home loan", "Student loans", "Multiple types"] },
      { id: "urgency", text: "Are you currently facing any of the following?", type: "choice", options: ["Wage garnishment", "Foreclosure proceedings", "Creditor lawsuits", "Collection calls / letters", "None of the above"] },
    ],
  },
  real_estate: {
    questions: [
      { id: "type", text: "What do you need help with?", type: "choice", options: ["Buying or selling dispute", "Landlord-tenant issue", "Foreclosure defense", "Title or deed issue", "HOA dispute", "Construction defect", "Zoning or land use", "Other"] },
      { id: "property_type", text: "Is this residential or commercial property?", type: "choice", options: ["Residential", "Commercial", "Both"] },
      { id: "deadline", text: "Is there a deadline or court date?", type: "choice", options: ["Yes, within 30 days", "Yes, within 3 months", "No immediate deadline"] },
    ],
  },
  business: {
    questions: [
      { id: "type", text: "What do you need help with?", type: "choice", options: ["Business formation (LLC, Corp, etc.)", "Contract drafting or dispute", "Partnership / shareholder issue", "Employment matter", "Intellectual property", "Business sale or acquisition", "Regulatory compliance", "Other"] },
      { id: "stage", text: "What stage is your business?", type: "choice", options: ["Starting a new business", "Established business (under 5 years)", "Established business (5+ years)", "Winding down / closing"] },
      { id: "litigation", text: "Is there active or threatened litigation?", type: "choice", options: ["Yes, we've been sued", "Yes, we're considering suing", "Not yet but concerned", "No litigation involved"] },
    ],
  },
  mass_tort: {
    questions: [
      { id: "type", text: "What product or situation affected you?", type: "choice", options: ["Defective product", "Dangerous pharmaceutical / drug", "Defective medical device", "Data breach / privacy violation", "Environmental contamination", "Other"] },
      { id: "when", text: "When were you harmed?", type: "choice", options: ["Within the last year", "1–3 years ago", "3–5 years ago", "Over 5 years ago"] },
      { id: "others", text: "Are you aware of others affected by the same issue?", type: "choice", options: ["Yes, many people", "Yes, a few others", "Not sure", "I believe I'm the only one"] },
    ],
  },
  disability: {
    questions: [
      { id: "type", text: "What type of claim?", type: "choice", options: ["Initial SSDI application", "Initial SSI application", "Appeal after denial", "Continuing disability review", "Not sure which applies"] },
      { id: "denied", text: "Have you been denied before?", type: "choice", options: ["No, first time applying", "Denied once", "Denied twice or more"] },
      { id: "condition", text: "What is the nature of your disability?", type: "choice", options: ["Physical condition", "Mental health condition", "Both physical and mental", "Prefer not to say"] },
    ],
  },
  nursing_home: {
    questions: [
      { id: "type", text: "What type of abuse or neglect occurred?", type: "choice", options: ["Physical abuse", "Emotional or psychological abuse", "Financial exploitation", "Neglect (hygiene, nutrition, medical)", "Medication errors", "Wrongful death", "Other"] },
      { id: "still_there", text: "Is the person still in the facility?", type: "choice", options: ["Yes", "No — they were moved", "No — they passed away"] },
      { id: "reported", text: "Have you reported this to authorities?", type: "choice", options: ["Yes, to adult protective services", "Yes, to local police", "Not yet", "We reported to the facility but nothing changed"] },
    ],
  },
  general: {
    questions: [
      { id: "description", text: "Briefly describe what you need legal help with:", type: "text", placeholder: "e.g. I was in a car accident and need help with my insurance claim..." },
      { id: "urgency", text: "How urgent is your situation?", type: "choice", options: ["Very urgent — I have a deadline soon", "Somewhat urgent — within a few weeks", "Not urgent — planning ahead"] },
      { id: "prior_attorney", text: "Have you worked with an attorney on this before?", type: "choice", options: ["No, this is my first time", "I consulted one but didn't hire", "Yes, previously hired one"] },
    ],
  },
};

// ── Area → funnel key mapping ─────────────────────────────────────────────────

function getFunnelKey(area: string): string {
  const a = area.toLowerCase();
  if (a.includes("personal injury") || a.includes("car accident") || a.includes("slip") || a.includes("wrongful death")) return "injury";
  if (a.includes("malpractice")) return "malpractice";
  if (a.includes("workers")) return "workers_comp";
  if (a.includes("employment") || a.includes("sexual harassment") || a.includes("wrongful termination")) return "employment";
  if (a.includes("criminal")) return "criminal";
  if (a.includes("family") || a.includes("divorce") || a.includes("custody")) return "family";
  if (a.includes("immigration")) return "immigration";
  if (a.includes("bankruptcy")) return "bankruptcy";
  if (a.includes("real estate")) return "real_estate";
  if (a.includes("business") || a.includes("corporate")) return "business";
  if (a.includes("mass tort") || a.includes("product liability") || a.includes("class action")) return "mass_tort";
  if (a.includes("social security") || a.includes("disability")) return "disability";
  if (a.includes("nursing home")) return "nursing_home";
  return "general";
}

// ── Props ─────────────────────────────────────────────────────────────────────

type Props = {
  attorney: {
    id: string;
    name: string;
    practiceAreas: string[];
    responseTimeHours: number;
  };
  open: boolean;
  onClose: () => void;
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function LeadFunnel({ attorney, open, onClose }: Props) {
  const [selectedArea, setSelectedArea] = useState<string | null>(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [contact, setContact] = useState({ firstName: "", lastName: "", email: "", phone: "", state: "" });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  if (!open) return null;

  function reset() {
    setSelectedArea(null);
    setQuestionIndex(0);
    setAnswers({});
    setContact({ firstName: "", lastName: "", email: "", phone: "", state: "" });
    setDone(false);
    setSubmitting(false);
  }

  function handleClose() {
    reset();
    onClose();
  }

  const funnelKey = selectedArea ? getFunnelKey(selectedArea) : null;
  const questions = funnelKey ? (FUNNELS[funnelKey]?.questions ?? FUNNELS.general.questions) : [];
  const isContactStep = selectedArea !== null && questionIndex >= questions.length;
  const totalSteps = (selectedArea ? questions.length + 1 : 0) + 1; // +1 for area picker, +1 for contact
  const currentStep = selectedArea === null ? 1 : questionIndex + 2;
  const progress = totalSteps > 1 ? Math.round((currentStep / (totalSteps)) * 100) : 0;

  async function handleSubmit() {
    if (!contact.firstName || !contact.lastName || !contact.email || !contact.state) return;
    setSubmitting(true);

    // Build message from answers
    const messageLines = selectedArea ? [`Practice area: ${selectedArea}`] : [];
    questions.forEach((q) => {
      if (answers[q.id]) messageLines.push(`${q.text}: ${answers[q.id]}`);
    });

    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        attorney_id: attorney.id,
        first_name: contact.firstName,
        last_name: contact.lastName,
        email: contact.email,
        phone: contact.phone || null,
        legal_issue: selectedArea ?? "General inquiry",
        state: contact.state,
        message: messageLines.join("\n"),
      }),
    });

    setSubmitting(false);
    if (res.ok) setDone(true);
  }

  const inp = "w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <div>
            <p className="text-xs text-gray-400 font-medium">Free Consultation</p>
            <p className="font-bold text-gray-900 text-sm">{attorney.name}</p>
          </div>
          <button type="button" onClick={handleClose} className="text-gray-400 hover:text-gray-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress bar */}
        {selectedArea && !done && (
          <div className="h-1 bg-gray-100 shrink-0">
            <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6">

          {/* Done state */}
          {done && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-9 h-9 text-emerald-500" />
              </div>
              <h3 className="text-xl font-extrabold text-gray-900 mb-2">Request Sent!</h3>
              <p className="text-gray-500 text-sm">
                {attorney.name} will review your case and reach out within{" "}
                <span className="font-semibold text-gray-700">
                  {attorney.responseTimeHours <= 1 ? "1 hour" : attorney.responseTimeHours <= 8 ? "a few hours" : "24 hours"}
                </span>.
              </p>
              <button type="button" onClick={handleClose} className="mt-6 w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 rounded-xl text-sm transition-colors">
                Close
              </button>
            </div>
          )}

          {/* Area picker */}
          {!done && selectedArea === null && (
            <div>
              <h3 className="text-lg font-extrabold text-gray-900 mb-1">What do you need help with?</h3>
              <p className="text-sm text-gray-400 mb-5">Select the area that best describes your situation.</p>
              <div className="grid grid-cols-1 gap-2">
                {attorney.practiceAreas.map((area) => (
                  <button
                    key={area}
                    type="button"
                    onClick={() => { setSelectedArea(area); setQuestionIndex(0); }}
                    className="text-left px-4 py-3.5 rounded-xl border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-colors text-sm font-semibold text-gray-700"
                  >
                    {area}
                  </button>
                ))}
                {attorney.practiceAreas.length === 0 && (
                  <button type="button" onClick={() => { setSelectedArea("General inquiry"); setQuestionIndex(0); }}
                    className="text-left px-4 py-3.5 rounded-xl border-2 border-blue-400 bg-blue-50 text-sm font-semibold text-blue-700">
                    General legal inquiry
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Questions */}
          {!done && selectedArea !== null && !isContactStep && (() => {
            const q = questions[questionIndex];
            if (!q) return null;
            return (
              <div>
                <p className="text-xs text-blue-500 font-semibold uppercase tracking-wide mb-2">{selectedArea}</p>
                <h3 className="text-lg font-extrabold text-gray-900 mb-5">{q.text}</h3>
                {q.type === "choice" && q.options && (
                  <div className="grid grid-cols-1 gap-2">
                    {q.options.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          setAnswers((prev) => ({ ...prev, [q.id]: opt }));
                          setQuestionIndex((i) => i + 1);
                        }}
                        className={`text-left px-4 py-3.5 rounded-xl border-2 transition-colors text-sm font-semibold ${
                          answers[q.id] === opt
                            ? "border-blue-500 bg-blue-50 text-blue-700"
                            : "border-gray-200 hover:border-blue-300 hover:bg-gray-50 text-gray-700"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
                {q.type === "text" && (
                  <div>
                    <textarea
                      rows={4}
                      placeholder={q.placeholder}
                      value={answers[q.id] ?? ""}
                      onChange={(e) => setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                    <button
                      type="button"
                      onClick={() => setQuestionIndex((i) => i + 1)}
                      disabled={!answers[q.id]?.trim()}
                      className="mt-3 w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-40 text-white font-bold py-3 rounded-xl text-sm transition-colors"
                    >
                      Continue
                    </button>
                  </div>
                )}
              </div>
            );
          })()}

          {/* Contact info step */}
          {!done && isContactStep && (
            <div>
              <p className="text-xs text-blue-500 font-semibold uppercase tracking-wide mb-2">{selectedArea}</p>
              <h3 className="text-lg font-extrabold text-gray-900 mb-1">Almost there</h3>
              <p className="text-sm text-gray-400 mb-5">Where should {attorney.name} send the free consultation details?</p>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <input className={inp} placeholder="First name" value={contact.firstName} onChange={(e) => setContact((c) => ({ ...c, firstName: e.target.value }))} />
                  <input className={inp} placeholder="Last name" value={contact.lastName} onChange={(e) => setContact((c) => ({ ...c, lastName: e.target.value }))} />
                </div>
                <input className={inp} type="email" placeholder="Email address" value={contact.email} onChange={(e) => setContact((c) => ({ ...c, email: e.target.value }))} />
                <input className={inp} type="tel" placeholder="Phone number" value={contact.phone} onChange={(e) => setContact((c) => ({ ...c, phone: e.target.value }))} />
                <select className={inp} value={contact.state} onChange={(e) => setContact((c) => ({ ...c, state: e.target.value }))}>
                  <option value="">Which state are you in?</option>
                  {US_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting || !contact.firstName || !contact.lastName || !contact.email || !contact.phone || !contact.state}
                  className="w-full bg-gray-900 hover:bg-gray-800 disabled:opacity-50 text-white font-bold py-3.5 rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
                >
                  {submitting ? <><Loader2 className="w-4 h-4 animate-spin" />Sending…</> : "Request Free Consultation"}
                </button>

                <p className="text-xs text-center text-gray-400">No spam. No obligation. Your info is only shared with {attorney.name}.</p>
              </div>
            </div>
          )}

        </div>

        {/* Back button */}
        {!done && selectedArea !== null && (
          <div className="px-6 pb-5 shrink-0">
            <button
              type="button"
              onClick={() => {
                if (isContactStep) {
                  setQuestionIndex(questions.length - 1);
                } else if (questionIndex === 0) {
                  setSelectedArea(null);
                  setQuestionIndex(0);
                } else {
                  setQuestionIndex((i) => i - 1);
                }
              }}
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 font-medium transition-colors"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Back
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
