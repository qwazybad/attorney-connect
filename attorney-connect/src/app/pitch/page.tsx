"use client";

import Link from "next/link";
import {
  Scale, TrendingDown, TrendingUp, Users, Zap, DollarSign,
  BarChart3, Target, ArrowRight, CheckCircle, EyeOff,
  Smartphone, Flag, Shuffle, Search,
} from "lucide-react";
import { useReveal } from "@/hooks/useInView";
import { useEffect } from "react";

export default function PitchPage() {
  const ref = useReveal();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div ref={ref} className="min-h-screen bg-white text-gray-900 overflow-x-hidden">

      {/* ── Hero ────────────────────────────────────────────────── */}
      <section
        className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #EAF0FB 0%, #F0EEF8 40%, #F5F0EC 100%)" }}
      >
        <div className="dot-grid-dark absolute inset-0 opacity-30" />
        <div className="orb w-[600px] h-[600px] bg-blue-400/15 -top-40 -left-40" />
        <div className="orb w-[500px] h-[500px] bg-indigo-400/10 -bottom-20 -right-20" />

        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="reveal inline-flex items-center gap-2 bg-white/70 border border-blue-200 text-blue-600 text-xs font-bold px-4 py-2 rounded-full mb-8 uppercase tracking-widest shadow-sm">
            <Zap className="w-3.5 h-3.5" />
            Investor Presentation · 2026
          </div>
          <div className="reveal reveal-delay-1 flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-blue-500 flex items-center justify-center shadow-lg">
              <Scale className="w-7 h-7 text-white" />
            </div>
            <span className="text-4xl font-extrabold tracking-tight text-gray-900">Attorney<span className="text-blue-500">Compete</span></span>
          </div>
          <h1 className="reveal reveal-delay-2 text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight mb-6 text-gray-900">
            The Marketplace<br />
            <span className="text-gradient-blue">Legal Services</span><br />
            Has Been Waiting For
          </h1>
          <p className="reveal reveal-delay-3 text-base sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed mb-10">
            We are transforming legal services from fragmented, high-cost advertising into a centralized marketplace where attorneys compete and consumers finally have transparency.
          </p>
          <div className="reveal reveal-delay-4 flex flex-wrap items-center justify-center gap-4">
            <a href="#problem" className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-bold px-8 py-4 rounded-2xl transition-colors text-sm shadow-lg">
              See the Opportunity <ArrowRight className="w-4 h-4" />
            </a>
            <Link href="/" className="inline-flex items-center gap-2 bg-white/80 hover:bg-white border border-gray-200 text-gray-700 font-semibold px-8 py-4 rounded-2xl transition-colors text-sm shadow-sm">
              Visit the Platform
            </Link>
          </div>
        </div>

      </section>

      {/* ── The Problem ─────────────────────────────────────────── */}
      <section id="problem" className="py-16 sm:py-32 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <p className="reveal text-blue-600 text-xs font-bold uppercase tracking-widest text-center mb-3">The Problem</p>
          <h2 className="reveal reveal-delay-1 text-4xl sm:text-5xl font-extrabold text-center mb-4 tracking-tight text-gray-900">Legal Advertising Is Broken</h2>
          <p className="reveal reveal-delay-2 text-gray-500 text-center text-lg max-w-2xl mx-auto mb-16">Billions are spent on billboards, radio, and TV — yet consumers can't remember a single name when they actually need an attorney.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
            {[
              { icon: DollarSign, title: "$9.8B Wasted", desc: "Law firms spend $9.8B/year on advertising — mostly on traditional media with no measurable ROI.", color: "text-red-500", bg: "bg-red-50", delay: "reveal-delay-1" },
              { icon: EyeOff, title: "Zero Retention", desc: "Consumers see hundreds of legal ads but retain almost none when they actually need legal help.", color: "text-orange-500", bg: "bg-orange-50", delay: "reveal-delay-2" },
              { icon: Search, title: "No Transparency", desc: "There is no benchmark, no fee comparison, no way for consumers to make an informed choice.", color: "text-yellow-600", bg: "bg-yellow-50", delay: "reveal-delay-3" },
              { icon: Shuffle, title: "Guesswork Marketing", desc: "Attorneys have no data-driven way to reach people who actually need them right now.", color: "text-purple-500", bg: "bg-purple-50", delay: "reveal-delay-4" },
            ].map((card) => (
              <div key={card.title} className={`reveal ${card.delay} card-lift bg-white rounded-2xl p-6 border border-gray-200 shadow-sm`}>
                <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center mb-4`}>
                  <card.icon className={`w-5 h-5 ${card.color}`} />
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{card.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>

          <div className="reveal bg-gray-50 border border-gray-200 rounded-2xl p-6 sm:p-10 max-w-3xl mx-auto text-center">
            <p className="text-xl font-bold text-gray-900 leading-relaxed mb-4">
              Law firms spend billions on advertising to stay top of mind. Consumers see hundreds of ads but retain very few. When legal need arises, recall fails and decision quality suffers.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              AttorneyCompete replaces fragmented advertising with a centralized marketplace where consumers arrive with intent and attorneys compete in real time.
            </p>
          </div>
        </div>
      </section>

      {/* ── The Insight: Market Shift ────────────────────────────── */}
      <section className="py-16 sm:py-32 px-6 bg-gray-50 relative overflow-hidden">
        <div className="dot-grid-dark absolute inset-0 opacity-20" />
        <div className="orb w-[400px] h-[400px] bg-blue-400/10 -top-20 -right-20" />
        <div className="relative max-w-6xl mx-auto">
          <p className="reveal text-blue-600 text-xs font-bold uppercase tracking-widest text-center mb-3">The Big Insight</p>
          <h2 className="reveal reveal-delay-1 text-4xl sm:text-5xl font-extrabold text-center mb-4 tracking-tight text-gray-900">Every Major Industry Has<br />Already Made This Shift</h2>
          <p className="reveal reveal-delay-2 text-gray-500 text-center text-lg max-w-2xl mx-auto mb-16">Consumers moved to marketplaces for mortgages, insurance, travel, and cars. Legal is the last major category that hasn't.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              { industry: "Mortgages", platforms: "LendingTree · Bankrate · FreeRateUpdate", status: "done", emoji: "🏠", delay: "reveal-delay-1" },
              { industry: "Insurance", platforms: "Policygenius · The Zebra · Insurify", status: "done", emoji: "🛡️", delay: "reveal-delay-2" },
              { industry: "Travel", platforms: "Expedia · Kayak · Priceline · Booking.com", status: "done", emoji: "✈️", delay: "reveal-delay-3" },
              { industry: "Cars", platforms: "Autotrader · CarGurus · TrueCar", status: "done", emoji: "🚗", delay: "reveal-delay-4" },
              { industry: "Legal Services", platforms: "AttorneyCompete", status: "us", emoji: "⚖️", delay: "" },
            ].map((row) => (
              <div key={row.industry} className={`reveal ${row.delay} rounded-2xl p-6 border flex items-center gap-5 card-lift ${row.status === "us" ? "bg-blue-500 border-blue-400 col-span-1 sm:col-span-2 shadow-lg" : "bg-white border-gray-200 shadow-sm"}`}>
                <span className="text-4xl">{row.emoji}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className={`font-extrabold text-lg ${row.status === "us" ? "text-white" : "text-gray-900"}`}>{row.industry}</h3>
                    {row.status === "done" && <CheckCircle className="w-4 h-4 text-emerald-500" />}
                    {row.status === "us" && <span className="text-xs bg-white/20 text-white font-bold px-2 py-0.5 rounded-full">Our Opportunity</span>}
                  </div>
                  <p className={`text-sm ${row.status === "us" ? "text-blue-100" : "text-gray-500"}`}>{row.platforms}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── The Solution ─────────────────────────────────────────── */}
      <section className="py-16 sm:py-32 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <p className="reveal text-blue-600 text-xs font-bold uppercase tracking-widest text-center mb-3">The Solution</p>
          <h2 className="reveal reveal-delay-1 text-4xl sm:text-5xl font-extrabold text-center mb-4 tracking-tight text-gray-900">AttorneyCompete Changes Everything</h2>
          <p className="reveal reveal-delay-2 text-gray-500 text-center text-lg max-w-2xl mx-auto mb-16">One platform that aggregates demand, creates transparency, and shifts attorneys from guesswork marketing to performance-based acquisition.</p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16">
            {[
              { icon: Target, title: "Aggregate Demand", desc: "Instead of fragmented ads across thousands of channels, we create a single destination where consumers go when they need legal help.", color: "text-blue-500", bg: "bg-blue-50", delay: "reveal-delay-1" },
              { icon: TrendingDown, title: "Price Transparency", desc: "Consumers see attorney fees, ratings, and response times side by side — for the first time ever in the legal industry.", color: "text-emerald-500", bg: "bg-emerald-50", delay: "reveal-delay-2" },
              { icon: BarChart3, title: "Merit-Based Ranking", desc: "Attorneys are ranked purely on fee, rating, and response time — no paid placements, no pay-to-win. The best value wins.", color: "text-purple-500", bg: "bg-purple-50", delay: "reveal-delay-3" },
            ].map((card) => (
              <div key={card.title} className={`reveal ${card.delay} card-lift bg-white rounded-2xl p-8 border border-gray-200 shadow-sm`}>
                <div className={`w-12 h-12 rounded-xl ${card.bg} flex items-center justify-center mb-5`}>
                  <card.icon className={`w-6 h-6 ${card.color}`} />
                </div>
                <h3 className="font-extrabold text-xl text-gray-900 mb-3">{card.title}</h3>
                <p className="text-gray-500 leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>

          <div className="reveal bg-gray-50 rounded-2xl p-8 border border-gray-200">
            <h3 className="font-extrabold text-xl text-gray-900 mb-6 text-center">How It Works</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { n: "1", title: "Consumer searches", desc: "Client visits AttorneyCompete, filters by practice area, location, and fee — sees ranked results instantly." },
                { n: "2", title: "Attorney competes", desc: "Attorneys are ranked by fee, rating, and response time — not by how much they spend on ads." },
                { n: "3", title: "Lead delivered", desc: "Consumer submits a case request. Attorney receives it directly in their portal and responds immediately." },
              ].map((step) => (
                <div key={step.n} className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-extrabold text-sm shrink-0">{step.n}</div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">{step.title}</h4>
                    <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Business Model ───────────────────────────────────────── */}
      <section className="py-16 sm:py-32 px-6 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #EAF0FB 0%, #F0EEF8 40%, #F5F0EC 100%)" }}>
        <div className="dot-grid-dark absolute inset-0 opacity-20" />
        <div className="orb w-[500px] h-[500px] bg-blue-400/10 top-0 right-0" />
        <div className="orb w-[400px] h-[400px] bg-purple-400/10 bottom-0 left-0" />
        <div className="relative max-w-6xl mx-auto">
          <p className="reveal text-blue-600 text-xs font-bold uppercase tracking-widest text-center mb-3">Business Model</p>
          <h2 className="reveal reveal-delay-1 text-4xl sm:text-5xl font-extrabold text-center mb-4 tracking-tight text-gray-900">Pricing That Scales With the Network</h2>
          <p className="reveal reveal-delay-2 text-gray-600 text-center text-lg max-w-2xl mx-auto mb-16">
            Attorneys pay a flat monthly subscription — not a percentage of their cases. Price increases as the platform grows, rewarding early adopters and compounding revenue automatically.
          </p>

          {/* Milestone pricing */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
            {[
              {
                milestone: "First 500 attorneys",
                price: "$249",
                lock: "Locked for life",
                desc: "Early adopters get founding-member pricing that never increases, no matter how much the platform grows.",
                numColor: "text-emerald-600",
                border: "border-emerald-200",
                badge: "Early Adopter",
                badgeBg: "bg-emerald-50 text-emerald-700",
                delay: "reveal-delay-1",
              },
              {
                milestone: "501 – 2,000 attorneys",
                price: "$499",
                lock: "Standard rate",
                desc: "As consumer demand grows and the platform proves its value, the subscription reflects that.",
                numColor: "text-blue-600",
                border: "border-blue-200",
                badge: "Growth Phase",
                badgeBg: "bg-blue-50 text-blue-700",
                delay: "reveal-delay-2",
              },
              {
                milestone: "2,001+ attorneys",
                price: "$699",
                lock: "Mature network rate",
                desc: "A proven two-sided marketplace with national reach commands a premium. The value justifies it.",
                numColor: "text-purple-600",
                border: "border-purple-200",
                badge: "Scale Phase",
                badgeBg: "bg-purple-50 text-purple-700",
                delay: "reveal-delay-3",
              },
            ].map((plan) => (
              <div key={plan.milestone} className={`reveal ${plan.delay} card-lift bg-white rounded-2xl p-8 border-2 ${plan.border} shadow-sm`}>
                <div className={`inline-flex items-center text-xs font-bold px-3 py-1 rounded-full mb-4 ${plan.badgeBg}`}>
                  {plan.badge}
                </div>
                <p className="text-gray-500 text-sm font-semibold mb-2">{plan.milestone}</p>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className={`text-5xl font-extrabold ${plan.numColor}`}>{plan.price}</span>
                  <span className="text-gray-400 text-sm">/mo</span>
                </div>
                <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-4">{plan.lock}</p>
                <p className="text-gray-500 text-sm leading-relaxed">{plan.desc}</p>
              </div>
            ))}
          </div>

          {/* Revenue at full milestones */}
          {(() => {
            const rows = [
              { label: "500 attorneys @ $249", mrr: "$124,500", arr: "$1,494,000", color: "text-emerald-600" },
              { label: "2,000 attorneys (mixed)", mrr: "$872,500", arr: "$10,470,000", color: "text-blue-600" },
              { label: "2,500 attorneys (mixed)", mrr: "$1,222,000", arr: "$14,664,000", color: "text-purple-600" },
            ];
            return (
              <div className="reveal bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm mb-8">
                <div className="px-6 sm:px-8 pt-6 pb-3 border-b border-gray-100">
                  <p className="text-gray-500 text-sm uppercase tracking-widest font-bold">Revenue at Each Milestone</p>
                </div>
                {/* Mobile */}
                <div className="sm:hidden divide-y divide-gray-100">
                  {rows.map((row, i) => (
                    <div key={i} className="p-5">
                      <p className="text-gray-600 text-sm font-semibold mb-3">{row.label}</p>
                      <div className="flex justify-between">
                        <div>
                          <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Monthly</p>
                          <p className={`text-lg font-bold ${row.color}`}>{row.mrr}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Annual</p>
                          <p className={`text-lg font-semibold ${row.color}`}>{row.arr}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Desktop */}
                <div className="hidden sm:block">
                  <div className="grid grid-cols-3 text-center text-xs font-bold uppercase tracking-widest border-b border-gray-100 bg-gray-50">
                    <div className="p-4 text-gray-400">Milestone</div>
                    <div className="p-4 text-gray-400">Monthly Revenue</div>
                    <div className="p-4 text-gray-400">Annual Revenue</div>
                  </div>
                  {rows.map((row, i) => (
                    <div key={i} className={`grid grid-cols-3 text-center border-b border-gray-100 last:border-b-0 ${i % 2 !== 0 ? "bg-gray-50/60" : "bg-white"}`}>
                      <div className="p-5 text-gray-600 text-sm">{row.label}</div>
                      <div className={`p-5 font-bold ${row.color}`}>{row.mrr}</div>
                      <div className={`p-5 font-semibold ${row.color} opacity-80`}>{row.arr}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* Future revenue */}
          <div className="reveal bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
            <p className="text-gray-400 text-sm uppercase tracking-widest font-bold mb-6 text-center">Beyond 2,500 — Additional Revenue Levers</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
              {[
                { label: "Per-lead fees", desc: "Charge a small fee per qualified lead delivered on top of the subscription" },
                { label: "Continued price increases", desc: "As network effects compound, pricing power grows — especially in new states" },
                { label: "Consumer services", desc: "Document prep, premium consultations, and legal guides on the demand side" },
              ].map((s) => (
                <div key={s.label}>
                  <p className="font-bold text-gray-900 mb-1">{s.label}</p>
                  <p className="text-gray-500 text-sm">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Traction ─────────────────────────────────────────────── */}
      <section className="py-16 sm:py-32 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <p className="reveal text-blue-600 text-xs font-bold uppercase tracking-widest text-center mb-3">Traction</p>
          <h2 className="reveal reveal-delay-1 text-4xl sm:text-5xl font-extrabold text-center mb-4 tracking-tight text-gray-900">3,450 Attorneys. Already Seeded.</h2>
          <p className="reveal reveal-delay-2 text-gray-500 text-center text-lg max-w-2xl mx-auto mb-16">We scraped every AZ Bar attorney with a public email address. Their profiles are live in the platform. Not one has been contacted yet — we're waiting for the right moment to launch outreach.</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { stat: "3,450", label: "Arizona attorneys in the database", sub: "All with verified email addresses", color: "text-blue-500", delay: "reveal-delay-1" },
              { stat: "$0", label: "Spent on attorney acquisition", sub: "Seeded the supply side before spending a dollar", color: "text-emerald-500", delay: "reveal-delay-2" },
              { stat: "1 of 50", label: "States scraped so far", sub: "1.3M attorneys available nationally", color: "text-purple-500", delay: "reveal-delay-3" },
            ].map((item) => (
              <div key={item.stat} className={`reveal ${item.delay} card-lift bg-white rounded-2xl p-8 border border-gray-200 shadow-sm text-center`}>
                <p className={`text-5xl font-extrabold mb-2 ${item.color}`}>{item.stat}</p>
                <p className="text-gray-900 font-semibold mb-1">{item.label}</p>
                <p className="text-gray-400 text-xs">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Market Opportunity ───────────────────────────────────── */}
      <section className="py-16 sm:py-32 px-6 bg-gray-50 relative overflow-hidden">
        <div className="dot-grid-dark absolute inset-0 opacity-20" />
        <div className="orb w-[400px] h-[400px] bg-blue-400/10 top-0 right-0" />
        <div className="relative max-w-6xl mx-auto">
          <p className="reveal text-blue-600 text-xs font-bold uppercase tracking-widest text-center mb-3">Market Opportunity</p>
          <h2 className="reveal reveal-delay-1 text-4xl sm:text-5xl font-extrabold text-center mb-16 tracking-tight text-gray-900">A Massive, Underserved Market</h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
            {[
              { stat: "$9.8B", label: "Spent annually on legal advertising in the US", sub: "Total Addressable Market", delay: "reveal-delay-1" },
              { stat: "1.3M+", label: "Licensed attorneys in the United States", sub: "Potential platform users", delay: "reveal-delay-2" },
              { stat: "100M+", label: "Americans who need legal help each year", sub: "Consumer demand", delay: "reveal-delay-3" },
            ].map((item) => (
              <div key={item.stat} className={`reveal ${item.delay} card-lift bg-white rounded-2xl p-8 border border-gray-200 shadow-sm text-center`}>
                <p className="text-5xl font-extrabold text-blue-500 mb-2">{item.stat}</p>
                <p className="text-gray-900 font-semibold mb-1">{item.label}</p>
                <p className="text-gray-400 text-xs uppercase tracking-widest">{item.sub}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="reveal reveal-delay-1 card-lift bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-4">
                <Users className="w-5 h-5 text-blue-500" />
              </div>
              <h3 className="font-extrabold text-xl text-gray-900 mb-3">Two-Sided Network Effect</h3>
              <p className="text-gray-500 leading-relaxed">More attorneys → better selection for consumers → more consumer traffic → more value for attorneys. Each side reinforces the other, creating a defensible moat.</p>
            </div>
            <div className="reveal reveal-delay-2 card-lift bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center mb-4">
                <DollarSign className="w-5 h-5 text-emerald-500" />
              </div>
              <h3 className="font-extrabold text-xl text-gray-900 mb-3">Multiple Revenue Streams</h3>
              <p className="text-gray-500 leading-relaxed">Attorney subscriptions, per-lead fees, price increases over time, and consumer-facing services — all compounding as the platform expands state by state.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Why Now ──────────────────────────────────────────────── */}
      <section className="py-16 sm:py-32 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <p className="reveal text-blue-600 text-xs font-bold uppercase tracking-widest text-center mb-3">Why Now</p>
          <h2 className="reveal reveal-delay-1 text-4xl sm:text-5xl font-extrabold text-center mb-16 tracking-tight text-gray-900">The Timing Has Never Been Better</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: Smartphone, title: "Mobile-first consumers", desc: "People search for services on their phones the moment they need them — not after seeing a billboard.", color: "text-blue-500", bg: "bg-blue-50", delay: "reveal-delay-1" },
              { icon: TrendingUp, title: "Ad costs exploding", desc: "Google and Meta CPCs for legal keywords are among the highest of any industry — attorneys are desperate for alternatives.", color: "text-red-500", bg: "bg-red-50", delay: "reveal-delay-2" },
              { icon: Zap, title: "AI-driven matching", desc: "Technology now allows us to intelligently match consumers to the right attorney in seconds.", color: "text-yellow-500", bg: "bg-yellow-50", delay: "reveal-delay-3" },
              { icon: BarChart3, title: "Proven playbook", desc: "LendingTree, Zillow, and The Zebra all proved this model works in adjacent industries.", color: "text-emerald-500", bg: "bg-emerald-50", delay: "reveal-delay-1" },
              { icon: Scale, title: "Regulatory tailwinds", desc: "Bar associations are increasingly allowing fee transparency and online attorney marketing.", color: "text-purple-500", bg: "bg-purple-50", delay: "reveal-delay-2" },
              { icon: Flag, title: "Early mover advantage", desc: "No dominant marketplace exists yet. The category is wide open for the first platform that gets to scale.", color: "text-indigo-500", bg: "bg-indigo-50", delay: "reveal-delay-3" },
            ].map((card) => (
              <div key={card.title} className={`reveal ${card.delay} card-lift bg-white rounded-2xl p-6 border border-gray-200 shadow-sm`}>
                <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center mb-4`}>
                  <card.icon className={`w-5 h-5 ${card.color}`} />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{card.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section className="relative py-20 sm:py-40 px-6 overflow-hidden bg-gray-950">
        <div className="dot-grid absolute inset-0 opacity-30" />
        <div className="orb w-[600px] h-[600px] bg-blue-600/20 top-0 left-1/2 -translate-x-1/2" />
        <div className="orb w-[300px] h-[300px] bg-indigo-600/15 bottom-0 left-0" />
        <div className="orb w-[300px] h-[300px] bg-purple-600/10 bottom-0 right-0" />
        <div className="relative max-w-3xl mx-auto text-center">
          <div className="reveal flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-blue-500 flex items-center justify-center shadow-lg">
              <Scale className="w-7 h-7 text-white" />
            </div>
            <span className="text-3xl font-extrabold tracking-tight text-white">Attorney<span className="text-blue-400">Compete</span></span>
          </div>
          <h2 className="reveal reveal-delay-1 text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 text-white">
            Let's Build the<br />
            <span className="text-gradient-blue">LendingTree of Law</span>
          </h2>
          <p className="reveal reveal-delay-2 text-base sm:text-xl text-gray-300 mb-4 leading-relaxed">
            Legal services is one of the last major consumer categories without a dominant marketplace. The platform is built. The supply side is seeded. We're looking for partners who see what we see.
          </p>
          <p className="reveal reveal-delay-3 text-blue-400 font-semibold mb-10">3,450 attorneys in the database. Zero contacted. The outreach starts when you say go.</p>
          <div className="reveal reveal-delay-4 flex flex-wrap items-center justify-center gap-4">
            <a href="mailto:Jackhumphres.jh@gmail.com" className="group relative inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-bold px-10 py-4 rounded-2xl transition-colors text-base overflow-hidden shadow-lg">
              <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] bg-white/10 skew-x-12 transition-transform duration-500 pointer-events-none" />
              Get in Touch <ArrowRight className="w-5 h-5" />
            </a>
            <Link href="/" className="inline-flex items-center gap-2 glass hover:bg-white/10 text-white font-semibold px-10 py-4 rounded-2xl transition-colors text-base">
              See the Platform
            </Link>
          </div>
          <p className="reveal text-gray-600 text-sm mt-8">AttorneyCompete · attorneycompete.com</p>
        </div>
      </section>

    </div>
  );
}
