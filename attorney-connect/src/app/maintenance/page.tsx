"use client";

import { useState } from "react";
import Link from "next/link";
import { Scale, Zap, ArrowRight, CheckCircle, Lock, Users } from "lucide-react";

export default function MaintenancePage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
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
    <div className="min-h-screen overflow-x-hidden" style={{ background: "linear-gradient(135deg, #EAF0FB 0%, #F0EEF8 40%, #F5F0EC 100%)" }}>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-300/50 to-transparent" />

      <div className="relative min-h-screen flex flex-col items-center justify-center px-6 py-24">
        <div className="w-full max-w-2xl mx-auto text-center">

          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-blue-500 flex items-center justify-center shadow-lg">
              <Scale className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-gray-900">
              Attorney<span className="text-blue-500">Compete</span>
            </span>
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/70 border border-blue-200 text-blue-600 text-xs font-bold px-4 py-2 rounded-full mb-8 uppercase tracking-widest">
            <Zap className="w-3.5 h-3.5" />
            Launching Soon
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight mb-5 text-gray-900">
            The legal marketplace where<br />
            <span className="text-gradient-blue">attorneys compete for your business.</span>
          </h1>
          <p className="text-gray-500 text-base sm:text-lg leading-relaxed mb-12 max-w-xl mx-auto">
            Compare real fees, ratings, and results before you submit a lead. We&apos;re putting the finishing touches on the platform — it&apos;s almost ready.
          </p>

          {/* Two-path cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
            {/* Client path */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm text-left">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-4">
                <Users className="w-5 h-5 text-blue-500" />
              </div>
              <p className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-1">For Clients</p>
              <h3 className="font-extrabold text-gray-900 text-lg mb-2">Find the right attorney</h3>
              <p className="text-gray-500 text-sm mb-5 leading-relaxed">Get notified when we launch. Compare fees and ratings before you ever submit a lead.</p>
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
                <p className="text-gray-200 text-sm mb-5 leading-relaxed">First 500 attorneys get the founding rate — locked for life. Card saved now, charged at launch.</p>
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
      </div>
    </div>
  );
}
