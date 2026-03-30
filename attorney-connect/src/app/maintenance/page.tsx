"use client";

import { useState } from "react";
import { Scale, TrendingDown, Star, Zap, Users, BarChart3, CheckCircle, ArrowRight } from "lucide-react";

export default function MaintenancePage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    // Send waitlist notification to admin
    await fetch("/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
    }).catch(() => {});
    setSubmitted(true);
    setSubmitting(false);
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white overflow-x-hidden">

      {/* Hero */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden py-20">
        <div className="dot-grid absolute inset-0 opacity-30" />
        <div className="orb w-[600px] h-[600px] bg-blue-600/20 -top-40 left-1/2 -translate-x-1/2" />

        <div className="relative z-10 max-w-3xl mx-auto">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-10">
            <div className="w-12 h-12 rounded-2xl bg-blue-500 flex items-center justify-center shadow-lg">
              <Scale className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight">
              Attorney<span className="text-blue-400">Compete</span>
            </span>
          </div>

          <div className="inline-flex items-center gap-2 glass text-blue-300 text-xs font-bold px-4 py-2 rounded-full mb-8 uppercase tracking-widest">
            <Zap className="w-3.5 h-3.5" />
            Coming Soon
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight mb-6">
            The Marketplace Where<br />
            <span className="text-blue-400">Attorneys Compete</span><br />
            For Your Cases
          </h1>
          <p className="text-gray-300 text-lg leading-relaxed mb-10 max-w-2xl mx-auto">
            AttorneyCompete is launching soon — a transparent legal marketplace where attorneys list their fees, ratings, and results, and clients choose the best fit. No more guesswork. No more wasted ad spend.
          </p>

          {/* Waitlist form */}
          {submitted ? (
            <div className="glass rounded-2xl px-8 py-8 max-w-md mx-auto">
              <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
              <h3 className="text-xl font-extrabold text-white mb-2">You're on the list!</h3>
              <p className="text-gray-400 text-sm">We'll email you the moment we launch. Thanks for your interest in AttorneyCompete.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 max-w-md mx-auto text-left">
              <h3 className="text-lg font-extrabold text-white mb-1 text-center">Join the Attorney Waitlist</h3>
              <p className="text-gray-400 text-xs text-center mb-5">Be first to get listed when we launch. Free to join.</p>
              <div className="space-y-3">
                <input
                  type="text"
                  required
                  placeholder="Your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/10 border border-white/10 text-white placeholder-gray-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400"
                />
                <input
                  type="email"
                  required
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/10 border border-white/10 text-white placeholder-gray-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-400"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-800 text-white font-bold py-3 rounded-xl transition-colors text-sm flex items-center justify-center gap-2"
                >
                  {submitting ? "Joining..." : "Join the Waitlist"}
                  {!submitting && <ArrowRight className="w-4 h-4" />}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 px-6 bg-gray-900">
        <div className="max-w-5xl mx-auto">
          <p className="text-blue-400 text-xs font-bold uppercase tracking-widest text-center mb-3">Why AttorneyCompete</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-center mb-12 tracking-tight">Built for Attorneys Who Want to Grow</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: TrendingDown,
                color: "text-emerald-400",
                bg: "bg-emerald-400/10",
                title: "Stop Wasting Ad Budget",
                desc: "No more billboards, radio spots, or Google Ads that nobody remembers. Get in front of clients at the exact moment they need an attorney.",
              },
              {
                icon: Users,
                color: "text-blue-400",
                bg: "bg-blue-400/10",
                title: "Leads Delivered to You",
                desc: "Potential clients find your profile, review your fees and results, and send you a case inquiry directly — no middleman, no games.",
              },
              {
                icon: Star,
                color: "text-yellow-400",
                bg: "bg-yellow-400/10",
                title: "Build Your Reputation",
                desc: "Showcase your ratings, case results, win rate, and fee structure. Let your track record do the selling.",
              },
              {
                icon: BarChart3,
                color: "text-purple-400",
                bg: "bg-purple-400/10",
                title: "Compete on Merit",
                desc: "Rankings are based on fee, rating, and response time — not how much you spend on ads. The best attorneys rise to the top.",
              },
              {
                icon: Zap,
                color: "text-orange-400",
                bg: "bg-orange-400/10",
                title: "Respond in Real Time",
                desc: "Leads come straight to your portal. Respond fast, get more clients. Attorneys with faster response times rank higher.",
              },
              {
                icon: CheckCircle,
                color: "text-accent-400",
                bg: "bg-blue-400/10",
                title: "Free to Apply",
                desc: "No upfront cost to join. Create your profile, get verified, and go live on the marketplace — all at no charge to get started.",
              },
            ].map((card) => (
              <div key={card.title} className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
                <div className={`w-10 h-10 ${card.bg} rounded-xl flex items-center justify-center mb-4`}>
                  <card.icon className={`w-5 h-5 ${card.color}`} />
                </div>
                <h3 className="font-bold text-white text-base mb-2">{card.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-6 bg-gray-950 relative overflow-hidden">
        <div className="dot-grid absolute inset-0 opacity-20" />
        <div className="relative max-w-4xl mx-auto">
          <p className="text-blue-400 text-xs font-bold uppercase tracking-widest text-center mb-3">How It Works</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-center mb-12 tracking-tight">Live in 48 Hours</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { n: "1", title: "Apply Free", desc: "Fill out your profile — firm info, practice areas, fee structure, and a bio. Takes about 5 minutes." },
              { n: "2", title: "Get Verified", desc: "Our team reviews your bar license and credentials within 48 hours and approves your profile." },
              { n: "3", title: "Start Receiving Leads", desc: "Your profile goes live on the marketplace. Clients find you, review your fees, and contact you directly." },
            ].map((step) => (
              <div key={step.n} className="text-center">
                <div className="w-14 h-14 rounded-full bg-blue-500 text-white flex items-center justify-center font-extrabold text-xl mx-auto mb-4">{step.n}</div>
                <h3 className="font-bold text-white text-lg mb-2">{step.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 px-6 bg-gray-900 text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-3xl font-extrabold mb-4">Ready to Get More Clients?</h2>
          <p className="text-gray-400 mb-8">Join the waitlist and be among the first attorneys on the platform when we launch.</p>
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-bold px-8 py-4 rounded-2xl transition-colors"
          >
            Join the Waitlist <ArrowRight className="w-4 h-4" />
          </a>
          <p className="text-gray-500 text-xs mt-6">Questions? <a href="mailto:support@attorneycompete.com" className="text-blue-400 hover:underline">support@attorneycompete.com</a></p>
        </div>
      </section>

    </div>
  );
}
