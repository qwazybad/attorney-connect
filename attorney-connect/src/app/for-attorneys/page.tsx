"use client";

import Link from "next/link";
import {
  CheckCircle, DollarSign, Users, BarChart3, TrendingUp,
  ArrowRight, Shield, Clock, Zap,
} from "lucide-react";
import { useReveal } from "@/hooks/useInView";

const steps = [
  { number: "1", title: "Apply online", description: "Fill out your firm profile, upload your bar license, and set your fee percentage. Takes under 10 minutes.", gradient: "from-accent-500 to-emerald-400" },
  { number: "2", title: "Verification (24–48 hrs)", description: "We verify your bar license, check for disciplinary actions, and confirm your malpractice insurance.", gradient: "from-blue-500 to-accent-500" },
  { number: "3", title: "Go live", description: "Once approved, your profile is live and you start receiving matched leads immediately.", gradient: "from-violet-500 to-purple-600" },
  { number: "4", title: "Pay when client signs", description: "Once a client signs an engagement letter or retainer agreement, you remit our platform fee. No upfront costs, no subscriptions.", gradient: "from-amber-400 to-orange-500" },
];

const features = [
  { icon: DollarSign, title: "Zero upfront cost", description: "No application fees, no monthly subscriptions, no pay-per-click. You only pay when a client signs an engagement letter or retainer agreement.", gradient: "from-accent-500 to-emerald-400" },
  { icon: Users, title: "Pre-qualified leads", description: "Consumers have already answered key questions about their case. You get context before the first call.", gradient: "from-blue-500 to-accent-500" },
  { icon: BarChart3, title: "Performance dashboard", description: "Track leads, conversion rates, response times, and revenue from a single intuitive dashboard.", gradient: "from-violet-500 to-purple-600" },
  { icon: Clock, title: "Faster case acquisition", description: "Our matching algorithm routes cases to you based on practice area, state, and fee competitiveness.", gradient: "from-amber-400 to-orange-500" },
  { icon: Shield, title: "Trust signals", description: "Your profile shows bar verification, malpractice insurance confirmation, and verified reviews.", gradient: "from-teal-400 to-cyan-500" },
  { icon: TrendingUp, title: "Merit-based visibility", description: "Firms with lower fees and faster responses rank higher. No paid placements — quality wins.", gradient: "from-rose-400 to-pink-500" },
];

const faqs = [
  { q: "What is the performance fee?", a: "Our fee is a flat referral fee due when a client signs an engagement letter or retainer agreement with your firm. The exact rate is disclosed during onboarding and varies by practice area. There are no fees before that moment." },
  { q: "How does the matching work?", a: "When a consumer submits their case, our system matches them with attorneys based on practice area, state bar license, fee range, and availability. You'll receive a notification within minutes." },
  { q: "Can I control which cases I receive?", a: "Yes. You set your practice areas, geographic coverage, case types you accept, and minimum case thresholds. You can pause lead flow at any time." },
  { q: "How do you verify attorneys?", a: "We check your state bar license, look for disciplinary history, and confirm active malpractice insurance. The process typically takes 24–48 hours." },
  { q: "What if a client disputes the fee?", a: "Our partner agreement includes clear terms. Disputes are handled by our partner success team and are rare — less than 0.5% of cases." },
  { q: "Is there a minimum commitment?", a: "No. There are no contracts, no minimums, and no cancellation fees. You can pause or close your account at any time." },
];

export default function ForAttorneysPage() {
  const featuresRef = useReveal();
  const stepsRef = useReveal();
  const pricingRef = useReveal();
  const faqRef = useReveal();
  const ctaRef = useReveal();

  return (
    <div className="min-h-screen bg-white">

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative bg-white border-b border-gray-100 overflow-hidden pt-32 pb-20">
        <div className="absolute top-[88px] left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400/40 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-5 sm:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-600 text-[11px] font-bold px-3.5 py-1.5 rounded-full uppercase tracking-widest mb-7 opacity-0 animate-fade-in" style={{ animationFillMode: "forwards" }}>
              <Zap className="w-3 h-3 text-blue-500" />
              Performance-based · Zero upfront · 2,800+ partner firms
            </div>

            <h1 className="text-5xl sm:text-6xl font-extrabold tracking-[-0.02em] text-navy-900 leading-[1.05] mb-6 opacity-0 animate-slide-up" style={{ animationFillMode: "forwards" }}>
              Grow your practice with{" "}
              <span className="text-gradient-blue">performance-based</span>{" "}
              leads.
            </h1>

            <p className="text-lg text-gray-500 mb-10 leading-relaxed max-w-2xl opacity-0 animate-slide-up" style={{ animationDelay: "0.1s", animationFillMode: "forwards" }}>
              AttorneyCompete sends you pre-qualified consumers actively looking for representation.
              You pay nothing until a client signs an engagement letter or retainer agreement with your firm. No wasted ad spend. Pure results.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 opacity-0 animate-slide-up" style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}>
              <Link
                href="/join"
                className="group relative inline-flex items-center justify-center gap-2 bg-navy-900 hover:bg-navy-800 text-white font-bold px-8 py-4 rounded-2xl transition-all duration-200 shadow-lg shadow-navy-900/20 text-base overflow-hidden"
              >
                <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] bg-white/10 skew-x-12 transition-transform duration-500 pointer-events-none" />
                Apply as a Partner Firm
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center gap-2 bg-white border border-gray-200 hover:border-navy-300 text-gray-700 hover:text-navy-900 font-semibold px-8 py-4 rounded-2xl transition-all duration-200 text-base"
              >
                See How It Works
              </a>
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
              Everything your firm needs to grow
            </h2>
            <p className="reveal reveal-delay-2 mt-4 text-gray-500 text-lg">
              Built for modern law firms who want results, not just exposure.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, description, gradient }, i) => (
              <div key={title} className={`reveal reveal-delay-${(i % 3) + 1} card-lift bg-white rounded-2xl p-6 shadow-card border border-gray-100`}>
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
      <section id="pricing" ref={pricingRef} className="relative py-24 bg-navy-900 overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-25" />

        <div className="relative z-10 max-w-4xl mx-auto px-5 sm:px-8 text-center">
          <div className="reveal inline-flex items-center gap-2 glass text-white/60 text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-widest mb-5">
            Pricing
          </div>
          <h2 className="reveal reveal-delay-1 text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            Pay when the client signs
          </h2>
          <p className="reveal reveal-delay-2 text-gray-200 mb-12 text-lg max-w-xl mx-auto">
            No subscriptions. No pay-per-click. A flat referral fee due only when a client signs an engagement letter or retainer agreement.
            If you don&apos;t earn, we don&apos;t earn.
          </p>

          <div className="reveal reveal-delay-2 glass-dark rounded-3xl p-8 sm:p-12 max-w-lg mx-auto">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Zap className="w-10 h-10 text-accent-400" />
              <p className="text-7xl font-extrabold text-white">$0</p>
            </div>
            <p className="text-gray-200 text-lg mb-8">Upfront. Always.</p>

            <ul className="space-y-3.5 text-left mb-10">
              {[
                "No application fee",
                "No monthly subscription",
                "No pay-per-lead fees",
                "Flat referral fee due when client signs an engagement letter or retainer agreement",
                "Cancel anytime, no penalties",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-gray-200">
                  <div className="w-5 h-5 rounded-full bg-accent-500/20 flex items-center justify-center shrink-0">
                    <CheckCircle className="w-3.5 h-3.5 text-accent-400" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>

            <Link
              href="/join"
              className="block w-full text-center bg-blue-500 hover:bg-blue-600 text-white font-bold px-8 py-4 rounded-2xl transition-all duration-200 hover:shadow-[0_4px_20px_rgba(59,130,246,0.4)] text-base"
            >
              Apply Now — It&apos;s Free
              <ArrowRight className="w-5 h-5 inline ml-2" />
            </Link>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* ── FAQ ───────────────────────────────────────────────── */}
      <section id="faq" ref={faqRef} className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-14">
            <div className="reveal inline-flex items-center gap-2 bg-gray-100 text-gray-600 text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-widest mb-4">
              FAQ
            </div>
            <h2 className="reveal reveal-delay-1 text-4xl font-extrabold text-gray-900 tracking-tight">
              Partner FAQs
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map(({ q, a }, i) => (
              <details
                key={q}
                className={`reveal reveal-delay-${(i % 3) + 1} group bg-gray-50 border border-gray-100 rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-200`}
              >
                <summary className="flex items-center justify-between p-5 cursor-pointer font-semibold text-gray-900 text-sm select-none list-none">
                  {q}
                  <span className="w-6 h-6 rounded-full bg-gray-200 group-open:bg-accent-500 flex items-center justify-center shrink-0 ml-3 transition-colors duration-200">
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
      <section ref={ctaRef} className="relative py-24 bg-navy-900 overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-25" />

        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 text-center">
          <h2 className="reveal text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            Ready to grow your caseload?
          </h2>
          <p className="reveal reveal-delay-1 text-gray-200 text-lg mb-10 max-w-xl mx-auto">
            Join 2,800+ law firms already using AttorneyCompete to compete for high-quality cases.
          </p>
          <div className="reveal reveal-delay-2 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/join"
              className="inline-flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-bold px-10 py-4 rounded-2xl transition-all duration-200 hover:shadow-[0_4px_20px_rgba(59,130,246,0.4)] text-base"
            >
              Apply as a Partner Firm
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/compare"
              className="inline-flex items-center justify-center gap-2 glass hover:bg-white/10 text-white font-semibold px-10 py-4 rounded-2xl transition-all duration-200 text-base"
            >
              Browse the Marketplace
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
