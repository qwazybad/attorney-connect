"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CheckCircle, DollarSign, Users, BarChart3, TrendingDown,
  ArrowRight, Shield, Clock, Zap, Lock, Star, Flag, Calculator,
  RefreshCw, ChevronRight,
} from "lucide-react";
import { useReveal } from "@/hooks/useInView";

const features = [
  { icon: DollarSign, title: "Flat monthly rate — not a cut of your cases", description: "Other platforms take 20–40% of every case they refer. We charge a flat subscription. Win a $500K case and we don't see a dime more than the attorney next to you.", gradient: "from-emerald-500 to-teal-400" },
  { icon: TrendingDown, title: "Merit-based ranking", description: "You rank higher by charging lower fees and responding faster — not by paying for placement. No pay-to-win. The best value wins.", gradient: "from-blue-500 to-indigo-400" },
  { icon: Users, title: "Consumers arrive with intent", description: "People come to AttorneyCompete because they need an attorney right now — not because they saw a billboard three weeks ago.", gradient: "from-violet-500 to-purple-400" },
  { icon: Clock, title: "Response time matters", description: "Your average response time is displayed publicly and factors into your ranking. Fast responders win more cases.", gradient: "from-amber-400 to-orange-500" },
  { icon: Shield, title: "Verified bar profile", description: "Your bar license, malpractice insurance, and credentials are verified and displayed on your profile — building consumer trust instantly.", gradient: "from-teal-400 to-cyan-500" },
  { icon: BarChart3, title: "No paid placements", description: "We don't sell top spots. Every attorney earns their position through fee competitiveness, ratings, and responsiveness. Period.", gradient: "from-rose-400 to-pink-500" },
];

const steps = [
  { number: "1", title: "Apply online", description: "Fill out your firm profile, upload your bar license, and set your fee structure. Takes under 10 minutes.", gradient: "from-blue-500 to-indigo-400" },
  { number: "2", title: "Verification (24–48 hrs)", description: "We verify your bar license, check for disciplinary actions, and confirm your malpractice insurance.", gradient: "from-violet-500 to-purple-400" },
  { number: "3", title: "Secure your founding rate", description: "Enter your card — $0 is charged. Your $249/mo founding member rate is locked for life the moment you save it.", gradient: "from-emerald-500 to-teal-400" },
  { number: "4", title: "Go live at launch", description: "When the platform launches you'll be notified. Your card is charged and your profile goes live to start receiving leads.", gradient: "from-amber-400 to-orange-500" },
];

const faqs = [
  { q: "What does $249/mo actually include?", a: "A fully verified attorney profile, placement in consumer search results, direct lead delivery to your portal, and your ranking based on fee, rating, and response time. No add-ons required." },
  { q: "When does billing start?", a: "Your card is saved when you sign up but we do not charge it until the platform officially launches. You'll receive an email before any charge goes out." },
  { q: "What happens to my rate after 500 founding members?", a: "New attorneys joining after the first 500 pay $499/mo. Your founding rate of $249/mo is locked permanently — it never increases no matter how large the platform grows." },
  { q: "How does the ranking work?", a: "Attorneys are ranked by a combination of fee competitiveness, client rating, and average response time. There are no paid placements — the best value rises to the top." },
  { q: "Can I cancel?", a: "Yes. No contracts, no minimums, no cancellation fees. If you cancel, your profile is removed from search results. You can rejoin at the then-current rate." },
  { q: "How do you verify attorneys?", a: "We check your state bar license number against the bar's public records, look for any disciplinary history, and confirm active malpractice insurance. The process takes 24–48 hours." },
];

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);
}

function SliderField({ label, value, min, max, step, format, onChange }: {
  label: string; value: number; min: number; max: number; step: number;
  format: (v: number) => string; onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-semibold text-gray-700">{label}</label>
        <span className="text-sm font-bold text-blue-600">{format(value)}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-blue-500 cursor-pointer"
      />
      <div className="flex justify-between text-xs text-gray-400 mt-1">
        <span>{format(min)}</span>
        <span>{format(max)}</span>
      </div>
    </div>
  );
}

export default function ForAttorneysPage() {
  const [calcMode, setCalcMode] = useState<"referral" | "flat" | "flat-plus" | "flat-plus-pct">("referral");
  const [caseValue, setCaseValue] = useState(100000);
  const [referralPct, setReferralPct] = useState(30);
  const [casesPerMonth, setCasesPerMonth] = useState(2);
  const [leadSpend, setLeadSpend] = useState(3000);
  const [leadCostPerLead, setLeadCostPerLead] = useState(1500);
  const [leadsPerMonth, setLeadsPerMonth] = useState(5);
  const [engagementFee, setEngagementFee] = useState(1500);
  const [retainersSigned, setRetainersSigned] = useState(3);
  const [settlementValue, setSettlementValue] = useState(100000);
  const [settlementPct, setSettlementPct] = useState(15);
  const [casesSettled, setCasesSettled] = useState(2);

  const currentCost = (() => {
    if (calcMode === "referral") return caseValue * (referralPct / 100) * casesPerMonth;
    if (calcMode === "flat") return leadSpend;
    if (calcMode === "flat-plus") return (leadCostPerLead * leadsPerMonth) + (engagementFee * retainersSigned);
    return (leadCostPerLead * leadsPerMonth) + (engagementFee * retainersSigned) + (settlementValue * (settlementPct / 100) * casesSettled);
  })();
  const savings = Math.max(0, currentCost - 249);

  const flywheelRef = useReveal();
  const featuresRef = useReveal();
  const calcRef = useReveal();
  const stepsRef = useReveal();
  const pricingRef = useReveal();
  const faqRef = useReveal();
  const ctaRef = useReveal();

  return (
    <div className="min-h-screen bg-white">

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative border-b border-gray-100 overflow-hidden pt-32 pb-20" style={{ background: "linear-gradient(135deg, #EAF0FB 0%, #F0EEF8 40%, #F5F0EC 100%)" }}>
        <div className="absolute top-[88px] left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400/40 to-transparent" />

        <div className="relative max-w-4xl mx-auto px-5 sm:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/70 border border-blue-200 text-blue-600 text-[11px] font-bold px-3.5 py-1.5 rounded-full uppercase tracking-widest mb-7 opacity-0 animate-fade-in" style={{ animationFillMode: "forwards" }}>
            <Zap className="w-3 h-3 text-blue-500" />
            Founding Member Rate · First 500 Only · $249/mo Locked for Life
          </div>

          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-[-0.02em] text-gray-900 leading-[1.05] mb-6 opacity-0 animate-slide-up" style={{ animationFillMode: "forwards" }}>
            Stop paying referral fees.<br />
            <span className="text-gradient-blue">Pay a flat rate instead.</span>
          </h1>

          <p className="text-lg text-gray-500 mb-8 leading-relaxed max-w-2xl mx-auto opacity-0 animate-slide-up" style={{ animationDelay: "0.1s", animationFillMode: "forwards" }}>
            Other platforms take 20–40% of every case they send you. On a $100,000 settlement that's $30,000 gone before you see it. AttorneyCompete charges $249/mo flat — and your earnings stay yours.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center opacity-0 animate-slide-up" style={{ animationDelay: "0.15s", animationFillMode: "forwards" }}>
            <Link
              href="/join"
              className="group relative inline-flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-bold px-8 py-4 rounded-2xl transition-all duration-200 shadow-lg text-base overflow-hidden"
            >
              <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] bg-white/10 skew-x-12 transition-transform duration-500 pointer-events-none" />
              Claim Your Founding Rate
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
            </Link>
            <a
              href="#how-it-works"
              className="group relative inline-flex items-center justify-center gap-2 bg-white border border-gray-200 hover:border-gray-300 text-gray-700 font-semibold px-8 py-4 rounded-2xl transition-all duration-200 text-base overflow-hidden"
            >
              See How It Works
            </a>
          </div>
        </div>
      </section>

      {/* ── Savings Calculator ────────────────────────────────── */}
      <section ref={calcRef} className="py-20 bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-10">
            <div className="reveal inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-600 text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-widest mb-4">
              <Calculator className="w-3 h-3" />
              Savings Calculator
            </div>
            <h2 className="reveal reveal-delay-1 text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              See what you&apos;re actually paying
            </h2>
            <p className="reveal reveal-delay-2 text-gray-500 mt-3 text-base">
              Choose how you currently pay for leads and see the real comparison.
            </p>
          </div>

          {/* Mode tabs */}
          <div className="reveal flex flex-wrap gap-2 justify-center mb-8">
            {[
              { id: "referral" as const, label: "Referral Fee (%)" },
              { id: "flat" as const, label: "Flat Fee for Leads" },
              { id: "flat-plus" as const, label: "Flat Fee + Engagement" },
              { id: "flat-plus-pct" as const, label: "Flat Fee + Engagement + % of Settlement" },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setCalcMode(m.id)}
                className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${calcMode === m.id ? "bg-blue-500 text-white shadow-sm" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
              >
                {m.label}
              </button>
            ))}
          </div>

          {/* Inputs */}
          <div className="reveal reveal-delay-1 bg-gray-50 rounded-2xl p-6 border border-gray-100 mb-6 space-y-6">
            {calcMode === "referral" && (<>
              <SliderField label="Average case value" value={caseValue} min={25000} max={500000} step={5000} format={fmt} onChange={setCaseValue} />
              <SliderField label="Referral fee percentage" value={referralPct} min={15} max={45} step={1} format={(v) => `${v}%`} onChange={setReferralPct} />
              <SliderField label="Cases referred per month" value={casesPerMonth} min={1} max={10} step={1} format={(v) => `${v}`} onChange={setCasesPerMonth} />
            </>)}
            {calcMode === "flat" && (
              <SliderField label="Monthly spend on lead packages" value={leadSpend} min={500} max={10000} step={100} format={fmt} onChange={setLeadSpend} />
            )}
            {calcMode === "flat-plus" && (<>
              <SliderField label="Cost per lead" value={leadCostPerLead} min={500} max={5000} step={100} format={fmt} onChange={setLeadCostPerLead} />
              <SliderField label="Leads purchased per month" value={leadsPerMonth} min={1} max={30} step={1} format={(v) => `${v}`} onChange={setLeadsPerMonth} />
              <SliderField label="Fee per retainer / engagement signed" value={engagementFee} min={500} max={5000} step={100} format={fmt} onChange={setEngagementFee} />
              <SliderField label="Retainers signed per month" value={retainersSigned} min={1} max={20} step={1} format={(v) => `${v}`} onChange={setRetainersSigned} />
              <div className="text-xs text-gray-400 pt-1 border-t border-gray-200">
                Lead cost: {fmt(leadCostPerLead * leadsPerMonth)} + Engagement fees: {fmt(engagementFee * retainersSigned)} = <span className="font-semibold text-gray-600">{fmt(leadCostPerLead * leadsPerMonth + engagementFee * retainersSigned)}/mo total</span>
              </div>
            </>)}
            {calcMode === "flat-plus-pct" && (<>
              <SliderField label="Cost per lead" value={leadCostPerLead} min={500} max={5000} step={100} format={fmt} onChange={setLeadCostPerLead} />
              <SliderField label="Leads purchased per month" value={leadsPerMonth} min={1} max={30} step={1} format={(v) => `${v}`} onChange={setLeadsPerMonth} />
              <SliderField label="Fee per retainer / engagement signed" value={engagementFee} min={500} max={5000} step={100} format={fmt} onChange={setEngagementFee} />
              <SliderField label="Retainers signed per month" value={retainersSigned} min={1} max={20} step={1} format={(v) => `${v}`} onChange={setRetainersSigned} />
              <SliderField label="Average settlement value" value={settlementValue} min={25000} max={500000} step={5000} format={fmt} onChange={setSettlementValue} />
              <SliderField label="Settlement percentage taken" value={settlementPct} min={5} max={40} step={1} format={(v) => `${v}%`} onChange={setSettlementPct} />
              <SliderField label="Cases that settle per month" value={casesSettled} min={1} max={10} step={1} format={(v) => `${v}`} onChange={setCasesSettled} />
              <div className="text-xs text-gray-400 pt-1 border-t border-gray-200 space-y-0.5">
                <div>Lead cost: {fmt(leadCostPerLead * leadsPerMonth)} + Engagement fees: {fmt(engagementFee * retainersSigned)} + Settlement cut: {fmt(settlementValue * (settlementPct / 100) * casesSettled)}</div>
                <div>= <span className="font-semibold text-gray-600">{fmt((leadCostPerLead * leadsPerMonth) + (engagementFee * retainersSigned) + (settlementValue * (settlementPct / 100) * casesSettled))}/mo total</span></div>
              </div>
            </>)}
          </div>

          {/* Output */}
          <div className="reveal reveal-delay-2 grid grid-cols-3 gap-4 text-center">
            <div className="bg-red-50 border border-red-100 rounded-2xl p-5">
              <p className="text-xs text-gray-400 font-semibold mb-2">Your current cost</p>
              <p className="text-2xl font-extrabold text-red-500">{fmt(currentCost)}</p>
              <p className="text-xs text-gray-400 mt-1">per month</p>
            </div>
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
              <p className="text-xs text-gray-400 font-semibold mb-2">AttorneyCompete</p>
              <p className="text-2xl font-extrabold text-blue-600">$249</p>
              <p className="text-xs text-gray-400 mt-1">per month flat</p>
            </div>
            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5">
              <p className="text-xs text-gray-400 font-semibold mb-2">You save</p>
              <p className="text-2xl font-extrabold text-emerald-600">{fmt(savings)}</p>
              <p className="text-xs text-gray-400 mt-1">per month</p>
            </div>
          </div>

          {savings > 0 && (
            <p className="reveal text-center text-sm text-gray-500 mt-5">
              That&apos;s{" "}
              <span className="font-bold text-emerald-600">{fmt(savings * 12)}</span>
              {" "}saved per year.
            </p>
          )}
        </div>
      </section>

      {/* ── Flywheel ──────────────────────────────────────────── */}
      <section ref={flywheelRef} className="py-20 border-b border-gray-100" style={{ background: "linear-gradient(135deg, #EAF0FB 0%, #F0EEF8 40%, #F5F0EC 100%)" }}>
        <div className="max-w-4xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-12">
            <div className="reveal inline-flex items-center gap-2 bg-white/70 border border-blue-200 text-blue-600 text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-widest mb-4">
              <RefreshCw className="w-3 h-3" />
              The Flywheel
            </div>
            <h2 className="reveal reveal-delay-1 text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
              Pass the savings on.<br />Watch the leads come back.
            </h2>
            <p className="reveal reveal-delay-2 text-gray-500 text-base max-w-2xl mx-auto leading-relaxed">
              When you&apos;re not handing 30% to a referral platform, you can afford to charge clients less. Lower fees earn you a higher ranking here. Higher ranking means more leads. More leads means more cases — at any margin. It compounds.
            </p>
          </div>

          {/* Cycle steps */}
          <div className="reveal reveal-delay-1 flex flex-col sm:flex-row items-center justify-center mb-10 gap-2">
            {([
              { n: "1", title: "You save", body: "No referral fees. $249/mo flat instead of thousands per case.", color: "from-emerald-500 to-teal-400", textColor: "text-emerald-600" },
              { n: "2", title: "Post lower fees", body: "Pass the savings to clients. Charge 25% instead of 33%. You can afford it.", color: "from-blue-500 to-indigo-400", textColor: "text-blue-600" },
              { n: "3", title: "Rank higher", body: "Fee competitiveness is a core ranking signal. Lower rates = more visibility.", color: "from-violet-500 to-purple-400", textColor: "text-violet-600" },
              { n: "4", title: "Win more cases", body: "More traffic, more leads, more clients. Revenue grows even at lower margins.", color: "from-amber-400 to-orange-500", textColor: "text-amber-600" },
            ] as const).flatMap((step, i, arr) => [
              <div key={step.n} className="flex sm:flex-col items-center gap-4 sm:gap-0 sm:text-center flex-1 min-w-0 max-w-[180px]">
                <div className={`w-14 h-14 shrink-0 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-md`}>
                  <span className="text-xl font-extrabold text-white">{step.n}</span>
                </div>
                <div className="sm:mt-4">
                  <p className={`font-bold text-sm mb-1 ${step.textColor}`}>{step.title}</p>
                  <p className="text-xs text-gray-500 leading-relaxed">{step.body}</p>
                </div>
              </div>,
              i < arr.length - 1 ? (
                <div key={`arrow-${i}`} className="hidden sm:flex items-center justify-center shrink-0 self-start mt-5">
                  <ChevronRight className="w-5 h-5 text-gray-300" />
                </div>
              ) : null,
            ])}
          </div>

          {/* Loop callout */}
          <div className="reveal bg-white/80 border border-gray-200 rounded-2xl p-5 shadow-sm flex items-start gap-4 max-w-2xl mx-auto">
            <RefreshCw className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-gray-900 text-sm mb-1">Then it loops</p>
              <p className="text-gray-500 text-sm leading-relaxed">More cases → stronger reviews and response metrics → even higher ranking → more leads. Every attorney who competes on value makes the platform more valuable for everyone — including you.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────── */}
      <section ref={featuresRef} className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <div className="reveal inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-600 text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-widest mb-4">
              Why AttorneyCompete
            </div>
            <h2 className="reveal reveal-delay-1 text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
              A better deal for attorneys
            </h2>
            <p className="reveal reveal-delay-2 mt-4 text-gray-500 text-lg">
              Built around your interests, not a percentage of your wins.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, description, gradient }, i) => (
              <div key={title} className={`reveal reveal-delay-${(i % 3) + 1} card-lift bg-white rounded-2xl p-6 shadow-sm border border-gray-100`}>
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-4 shadow-sm`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 text-base mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────────── */}
      <section id="how-it-works" ref={stepsRef} className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <div className="reveal inline-flex items-center gap-2 bg-gray-100 text-gray-600 text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-widest mb-4">
              The Process
            </div>
            <h2 className="reveal reveal-delay-1 text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
              Live in 4 simple steps
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map(({ number, title, description, gradient }, i) => (
              <div key={number} className={`reveal reveal-delay-${i + 1} flex flex-col items-center text-center`}>
                <div className="relative mb-6">
                  <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}>
                    <span className="text-3xl font-extrabold text-white">{number}</span>
                  </div>
                  {i < steps.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 left-full w-full h-px bg-gradient-to-r from-gray-200 to-transparent -translate-y-1/2" />
                  )}
                </div>
                <h3 className="font-bold text-gray-900 text-base mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ───────────────────────────────────────────── */}
      <section id="pricing" ref={pricingRef} className="relative py-24 overflow-hidden" style={{ background: "linear-gradient(135deg, #EAF0FB 0%, #F0EEF8 40%, #F5F0EC 100%)" }}>
        <div className="max-w-5xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-16">
            <div className="reveal inline-flex items-center gap-2 bg-white/70 border border-blue-200 text-blue-600 text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-widest mb-5">
              Pricing
            </div>
            <h2 className="reveal reveal-delay-1 text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
              Pricing that scales with the platform
            </h2>
            <p className="reveal reveal-delay-2 text-gray-500 text-lg max-w-xl mx-auto">
              Get in early and your rate is locked forever. The founding member window closes after the first 500 attorneys.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
            {[
              {
                badge: "Founding Member",
                badgeIcon: Star,
                badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
                price: "$249",
                label: "First 500 attorneys",
                lock: "Locked for life",
                desc: "Secure your rate now. Card saved, not charged until launch.",
                border: "border-emerald-300",
                ring: "ring-2 ring-emerald-200",
                numColor: "text-emerald-600",
                delay: "reveal-delay-1",
                cta: true,
              },
              {
                badge: "Standard",
                badgeIcon: Flag,
                badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
                price: "$499",
                label: "501–2,000 attorneys",
                lock: "Standard rate",
                desc: "As the platform grows and proves its value, pricing reflects that.",
                border: "border-blue-200",
                ring: "",
                numColor: "text-blue-600",
                delay: "reveal-delay-2",
                cta: false,
              },
              {
                badge: "Scale",
                badgeIcon: Zap,
                badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
                price: "$699",
                label: "2,001+ attorneys",
                lock: "Mature network rate",
                desc: "A proven national marketplace commands a premium. The value justifies it.",
                border: "border-purple-200",
                ring: "",
                numColor: "text-purple-600",
                delay: "reveal-delay-3",
                cta: false,
              },
            ].map((plan) => (
              <div key={plan.badge} className={`reveal ${plan.delay} card-lift bg-white rounded-2xl p-8 border-2 ${plan.border} ${plan.ring} shadow-sm`}>
                <div className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border mb-4 ${plan.badgeColor}`}>
                  <plan.badgeIcon className="w-3 h-3" />
                  {plan.badge}
                </div>
                <p className="text-gray-500 text-sm font-semibold mb-2">{plan.label}</p>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className={`text-5xl font-extrabold ${plan.numColor}`}>{plan.price}</span>
                  <span className="text-gray-400 text-sm">/mo</span>
                </div>
                <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-4">{plan.lock}</p>
                <p className="text-gray-500 text-sm leading-relaxed mb-6">{plan.desc}</p>
                {plan.cta && (
                  <Link
                    href="/join"
                    className="group relative block w-full text-center bg-blue-500 hover:bg-blue-600 text-white font-bold px-6 py-3 rounded-xl transition-colors text-sm overflow-hidden"
                  >
                    <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] bg-white/10 skew-x-12 transition-transform duration-500 pointer-events-none" />
                    Claim This Rate
                    <ArrowRight className="w-4 h-4 inline ml-1.5" />
                  </Link>
                )}
              </div>
            ))}
          </div>

          <div className="reveal bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex items-start gap-4 max-w-2xl mx-auto">
            <Lock className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-gray-900 text-sm mb-1">Your card is saved — not charged until launch</p>
              <p className="text-gray-500 text-sm">We'll email you before the platform goes live and before any billing begins. You'll know exactly when and what you're being charged.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────── */}
      <section id="faq" ref={faqRef} className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-14">
            <div className="reveal inline-flex items-center gap-2 bg-gray-100 text-gray-600 text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-widest mb-4">
              FAQ
            </div>
            <h2 className="reveal reveal-delay-1 text-4xl font-extrabold text-gray-900 tracking-tight">
              Common questions
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map(({ q, a }, i) => (
              <details
                key={q}
                className={`reveal reveal-delay-${(i % 3) + 1} group bg-gray-50 border border-gray-100 rounded-2xl overflow-hidden hover:shadow-sm transition-all duration-200`}
              >
                <summary className="flex items-center justify-between p-5 cursor-pointer font-semibold text-gray-900 text-sm select-none list-none">
                  {q}
                  <span className="w-6 h-6 rounded-full bg-gray-200 group-open:bg-blue-500 flex items-center justify-center shrink-0 ml-3 transition-colors duration-200">
                    <span className="text-gray-600 group-open:text-white text-base leading-none font-bold transition-colors duration-200 group-open:rotate-45 inline-block transition-transform">+</span>
                  </span>
                </summary>
                <div className="px-5 pb-5 text-sm text-gray-500 leading-relaxed border-t border-gray-100 pt-4">
                  {a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ────────────────────────────────────────── */}
      <section ref={ctaRef} className="relative py-24 bg-gray-900 overflow-hidden">
        <div className="dot-grid absolute inset-0 opacity-30" />
        <div className="orb w-[500px] h-[500px] bg-blue-600/20 top-0 left-1/2 -translate-x-1/2" />
        <div className="relative max-w-3xl mx-auto px-5 sm:px-8 text-center">
          <div className="reveal inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-widest mb-6">
            <Lock className="w-3 h-3" />
            Founding Member · First 500 Only
          </div>
          <h2 className="reveal reveal-delay-1 text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            Lock in $249/mo before<br />the window closes.
          </h2>
          <p className="reveal reveal-delay-2 text-gray-400 text-lg mb-10 max-w-xl mx-auto">
            After 500 founding members the rate goes to $499/mo — and eventually $699/mo. Your founding rate is locked for life. Card saved today, charged at launch.
          </p>
          <div className="reveal reveal-delay-3 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/join"
              className="group relative inline-flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-bold px-10 py-4 rounded-2xl transition-all duration-200 text-base overflow-hidden shadow-lg"
            >
              <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] bg-white/10 skew-x-12 transition-transform duration-500 pointer-events-none" />
              Claim Your Founding Rate
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/compare"
              className="group relative inline-flex items-center justify-center gap-2 glass hover:bg-white/10 text-white font-semibold px-10 py-4 rounded-2xl transition-all duration-200 text-base overflow-hidden"
            >
              Browse the Marketplace
            </Link>
          </div>
          <div className="reveal reveal-delay-4 flex items-center justify-center gap-6 mt-10">
            {[
              { icon: CheckCircle, text: "No charge until launch" },
              { icon: Lock, text: "Rate locked for life" },
              { icon: Shield, text: "Cancel anytime" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-1.5 text-xs text-gray-500">
                <Icon className="w-3.5 h-3.5 text-gray-600" />
                {text}
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
