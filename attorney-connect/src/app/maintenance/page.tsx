"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Scale, Zap, ArrowRight, CheckCircle, Lock, DollarSign,
  TrendingDown, Users, Star, Shield, Clock, BarChart3,
  RefreshCw, ChevronRight,
} from "lucide-react";

export default function MaintenancePage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    await fetch("/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
    }).catch(() => {});
    setSubmitted(true);
    setSubmitting(false);
  }

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 py-24 overflow-hidden" style={{ background: "linear-gradient(135deg, #EAF0FB 0%, #F0EEF8 40%, #F5F0EC 100%)" }}>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-300/50 to-transparent" />

        <div className="relative z-10 max-w-4xl mx-auto">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-10">
            <div className="w-12 h-12 rounded-2xl bg-blue-500 flex items-center justify-center shadow-lg">
              <Scale className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-gray-900">
              Attorney<span className="text-blue-500">Compete</span>
            </span>
          </div>

          <div className="inline-flex items-center gap-2 bg-white/70 border border-blue-200 text-blue-600 text-xs font-bold px-4 py-2 rounded-full mb-8 uppercase tracking-widest">
            <Zap className="w-3.5 h-3.5" />
            Launching Soon
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight mb-6 text-gray-900">
            The legal marketplace where<br />
            <span className="text-gradient-blue">attorneys compete for your business.</span>
          </h1>
          <p className="text-gray-500 text-lg leading-relaxed mb-12 max-w-2xl mx-auto">
            Compare real fees, ratings, and results before you hire. For attorneys — a flat monthly rate instead of referral fees, so they can charge you less and still win more.
          </p>

          {/* Two-path cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl mx-auto">
            {/* Client path */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm text-left">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-4">
                <Users className="w-5 h-5 text-blue-500" />
              </div>
              <p className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-1">For Clients</p>
              <h3 className="font-extrabold text-gray-900 text-lg mb-2">Find the right attorney</h3>
              <p className="text-gray-500 text-sm mb-5 leading-relaxed">Get notified when we launch. Compare fees and ratings before you ever make a call.</p>
              {submitted ? (
                <div className="flex items-center gap-2 text-emerald-600 text-sm font-semibold">
                  <CheckCircle className="w-4 h-4" />
                  You&apos;re on the list!
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-2">
                  <input
                    type="text"
                    required
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border border-gray-200 text-gray-900 placeholder-gray-400 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400"
                  />
                  <input
                    type="email"
                    required
                    placeholder="Your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-gray-200 text-gray-900 placeholder-gray-400 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400"
                  />
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-bold py-2.5 rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
                  >
                    {submitting ? "Joining..." : "Notify Me at Launch"}
                    {!submitting && <ArrowRight className="w-4 h-4" />}
                  </button>
                </form>
              )}
            </div>

            {/* Attorney path */}
            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6 shadow-sm text-left relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center mb-4">
                  <Scale className="w-5 h-5 text-blue-400" />
                </div>
                <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-1">For Attorneys</p>
                <h3 className="font-extrabold text-white text-lg mb-2">Lock in $249/mo</h3>
                <p className="text-gray-400 text-sm mb-5 leading-relaxed">First 500 attorneys get the founding rate — locked for life. Card saved now, charged at launch.</p>
                <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-4">
                  <Lock className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400 font-semibold">Not charged until launch</span>
                </div>
                <Link
                  href="/for-attorneys"
                  className="group w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2.5 rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
                >
                  Learn More & Apply
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── The Loop — for clients ────────────────────────────── */}
      <section className="py-20 bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-600 text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-widest mb-4">
              <RefreshCw className="w-3 h-3" />
              How the platform works for you
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-4">
              The reason fees go down here — not up.
            </h2>
            <p className="text-gray-500 text-base max-w-2xl mx-auto leading-relaxed">
              Most platforms charge attorneys a percentage of every case they win — so attorneys have to charge you more to cover it. We charge attorneys a flat $249/mo instead. Here&apos;s what that means for you.
            </p>
          </div>

          {/* Loop steps */}
          <div className="flex flex-col sm:flex-row items-start justify-center gap-2 mb-10">
            {([
              { n: "1", title: "Attorneys save", body: "No referral fees means thousands saved per case.", color: "from-emerald-500 to-teal-400", textColor: "text-emerald-600" },
              { n: "2", title: "They charge you less", body: "They can post lower contingency fees and still come out ahead.", color: "from-blue-500 to-indigo-400", textColor: "text-blue-600" },
              { n: "3", title: "Best value ranks highest", body: "Lower fees + strong ratings = higher placement. No pay-to-win.", color: "from-violet-500 to-purple-400", textColor: "text-violet-600" },
              { n: "4", title: "You win", body: "More competitive attorneys, lower fees, better outcomes.", color: "from-amber-400 to-orange-500", textColor: "text-amber-600" },
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

          <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 flex items-start gap-4 max-w-2xl mx-auto">
            <RefreshCw className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
            <p className="text-sm text-gray-500 leading-relaxed">
              <span className="font-bold text-gray-900">Then it compounds.</span>{" "}
              Attorneys who charge lower fees get more clients. More clients means better reviews. Better reviews means even higher ranking. Attorneys and clients benefit from the same loop.
            </p>
          </div>
        </div>
      </section>

      {/* ── Split benefits ───────────────────────────────────── */}
      <section className="py-20 bg-gray-50 border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              Built for both sides of the table
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
            {/* Client benefits */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-xl bg-blue-500 flex items-center justify-center">
                  <Users className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-lg font-extrabold text-gray-900">For Clients</h3>
              </div>
              <div className="space-y-4">
                {[
                  { icon: DollarSign, title: "See real fees before you hire", desc: "Every attorney lists their contingency percentage, hourly rate, or flat fee upfront. No surprises." },
                  { icon: Star, title: "Compare ratings and results", desc: "Client ratings, response times, and verified credentials — all in one place before you make a single call." },
                  { icon: TrendingDown, title: "Attorneys compete for your business", desc: "The platform is designed to push fees down, not up. Lower fees earn higher rankings." },
                ].map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="flex items-start gap-4 bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-blue-500" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm mb-0.5">{title}</p>
                      <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Attorney benefits */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-xl bg-gray-900 flex items-center justify-center">
                  <Scale className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-lg font-extrabold text-gray-900">For Attorneys</h3>
              </div>
              <div className="space-y-4">
                {[
                  { icon: DollarSign, title: "$249/mo flat — not a cut of your cases", desc: "Other platforms take 20–40% of every case. We charge a flat rate. Win a $500K case and we don't see a dime more." },
                  { icon: BarChart3, title: "Merit-based ranking", desc: "You rank higher by charging lower fees and responding faster — not by paying for placement." },
                  { icon: Clock, title: "Founding rate locked for life", desc: "First 500 attorneys lock in $249/mo permanently. After that, the rate goes to $499 and eventually $699." },
                ].map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="flex items-start gap-4 bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                    <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-gray-700" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm mb-0.5">{title}</p>
                      <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────── */}
      <section className="py-20 bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">How it works</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
            {/* Client flow */}
            <div>
              <p className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-6">For Clients</p>
              <div className="space-y-6">
                {[
                  { n: "1", title: "Search by practice area", desc: "Tell us what type of case you have. We show you verified attorneys in your area." },
                  { n: "2", title: "Compare fees and ratings", desc: "See exactly what each attorney charges before you ever pick up the phone." },
                  { n: "3", title: "Contact and hire", desc: "Reach out directly. No middleman, no referral games — just you and the right attorney." },
                ].map((step) => (
                  <div key={step.n} className="flex items-start gap-4">
                    <div className="w-9 h-9 rounded-xl bg-blue-500 flex items-center justify-center text-white font-extrabold text-sm shrink-0">{step.n}</div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm mb-0.5">{step.title}</p>
                      <p className="text-xs text-gray-500 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Attorney flow */}
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">For Attorneys</p>
              <div className="space-y-6">
                {[
                  { n: "1", title: "Apply and get verified", desc: "Fill out your profile. We verify your bar license and credentials within 24–48 hours." },
                  { n: "2", title: "Lock in your founding rate", desc: "Save your card — $0 charged. Your $249/mo rate is locked the moment you submit." },
                  { n: "3", title: "Go live at launch", desc: "When the platform launches your profile goes live. Your card is charged and leads start coming in." },
                  { n: "4", title: "Compete on merit", desc: "Lower your fees, respond faster, build reviews. The platform rewards the best value — not the biggest budget." },
                ].map((step) => (
                  <div key={step.n} className="flex items-start gap-4">
                    <div className="w-9 h-9 rounded-xl bg-gray-900 flex items-center justify-center text-white font-extrabold text-sm shrink-0">{step.n}</div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm mb-0.5">{step.title}</p>
                      <p className="text-xs text-gray-500 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ───────────────────────────────────────── */}
      <section className="relative py-24 bg-gray-900 overflow-hidden">
        <div className="dot-grid absolute inset-0 opacity-30" />
        <div className="orb w-[500px] h-[500px] bg-blue-600/20 top-0 left-1/2 -translate-x-1/2" />
        <div className="relative max-w-4xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <div className="text-center sm:text-left">
              <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-3">For Clients</p>
              <h3 className="text-2xl font-extrabold text-white mb-3">Be first to find your attorney.</h3>
              <p className="text-gray-400 text-sm mb-6">We&apos;ll notify you the moment we launch.</p>
              {submitted ? (
                <div className="flex items-center gap-2 text-emerald-400 text-sm font-semibold justify-center sm:justify-start">
                  <CheckCircle className="w-4 h-4" />
                  You&apos;re on the list!
                </div>
              ) : (
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-bold px-6 py-3 rounded-xl transition-colors text-sm"
                >
                  Join the Waitlist <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="text-center sm:text-left border-t border-gray-800 pt-8 sm:border-t-0 sm:pt-0 sm:border-l sm:pl-8">
              <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-3">For Attorneys</p>
              <h3 className="text-2xl font-extrabold text-white mb-3">Lock in $249/mo before it closes.</h3>
              <p className="text-gray-400 text-sm mb-6">After 500 founding members the rate goes to $499/mo — permanently.</p>
              <Link
                href="/for-attorneys"
                className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-6 py-3 rounded-xl transition-colors text-sm"
              >
                <Lock className="w-4 h-4" />
                Claim Your Founding Rate
              </Link>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 mt-12 pt-8 border-t border-gray-800">
            {[
              { icon: Shield, text: "Bar verified attorneys" },
              { icon: Lock, text: "Card not charged until launch" },
              { icon: CheckCircle, text: "Cancel anytime" },
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
