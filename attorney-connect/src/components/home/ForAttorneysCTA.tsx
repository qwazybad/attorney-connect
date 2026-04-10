"use client";

import Link from "next/link";
import { TrendingUp, Users, DollarSign, BarChart3, ArrowRight, CheckCircle } from "lucide-react";
import { useReveal } from "@/hooks/useInView";

const benefits = [
  { icon: Users,      title: "Pre-qualified leads",      description: "Consumers matched to your exact practice area and state — before they reach you." },
  { icon: DollarSign, title: "Pay when the client signs", description: "Zero upfront cost. Flat referral fee only when a client signs an engagement letter or retainer." },
  { icon: TrendingUp, title: "Compete on merit",          description: "Lower fees and faster response = higher placement. No ads, no paid spots." },
  { icon: BarChart3,  title: "Full analytics dashboard",  description: "Track leads, conversions, and revenue in real time from your portal." },
];

export default function ForAttorneysCTA() {
  const ref = useReveal();

  return (
    <section ref={ref} className="relative bg-navy-900 overflow-hidden py-24">
      {/* Subtle dot grid */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)", backgroundSize: "28px 28px" }}
      />
      {/* Gold accent line top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-400/50 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left */}
          <div>
            <div className="reveal inline-flex items-center gap-2 bg-gold-400/10 border border-gold-400/30 text-gold-300 text-[11px] font-bold px-3.5 py-1.5 rounded-full uppercase tracking-widest mb-6">
              For Law Firms
            </div>
            <h2 className="reveal reveal-delay-1 font-display text-4xl sm:text-5xl font-bold text-white tracking-tight leading-tight mb-5">
              Performance-based leads.{" "}
              <span className="text-gradient-gold">Zero upfront cost.</span>
            </h2>
            <p className="reveal reveal-delay-2 text-navy-200 text-lg mb-8 leading-relaxed">
              AttorneyCompete sends you pre-screened consumers. You pay nothing until a client signs an engagement letter or retainer — no wasted ad spend.
            </p>

            <ul className="reveal reveal-delay-2 space-y-2.5 mb-8">
              {[
                "Apply in under 10 minutes",
                "Bar license verification included",
                "Set your own competitive fee",
                "Cancel anytime — no contracts",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-navy-100">
                  <div className="w-5 h-5 rounded-full bg-gold-400/20 flex items-center justify-center shrink-0">
                    <CheckCircle className="w-3 h-3 text-gold-400" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>

            <div className="reveal reveal-delay-3 flex flex-col sm:flex-row gap-3">
              <Link
                href="/join"
                className="inline-flex items-center justify-center gap-2 bg-gold-400 hover:bg-gold-300 text-navy-950 font-bold px-6 py-3.5 rounded-2xl transition-all duration-200 text-sm"
              >
                Apply as a Partner Firm
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/for-attorneys"
                className="inline-flex items-center justify-center gap-2 border border-white/20 hover:bg-white/10 text-white font-semibold px-6 py-3.5 rounded-2xl transition-all duration-200 text-sm"
              >
                Learn More
              </Link>
            </div>
          </div>

          {/* Right — benefit cards */}
          <div className="grid grid-cols-2 gap-4">
            {benefits.map(({ icon: Icon, title, description }, i) => (
              <div
                key={title}
                className={`reveal reveal-delay-${i + 1} bg-white/5 border border-white/10 hover:bg-white/10 rounded-2xl p-5 transition-all duration-200`}
              >
                <div className="w-10 h-10 rounded-xl bg-gold-400/15 flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5 text-gold-400" />
                </div>
                <h4 className="font-bold text-white text-sm mb-1">{title}</h4>
                <p className="text-xs text-navy-300 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats row */}
        <div className="reveal reveal-delay-3 mt-16 pt-10 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: "$0",    label: "Upfront cost" },
            { value: "48k+",  label: "Cases matched" },
            { value: "4.8★",  label: "Firm satisfaction" },
            { value: "2,800+",label: "Partner firms" },
          ].map(({ value, label }) => (
            <div key={label}>
              <p className="font-display text-3xl font-bold text-white">{value}</p>
              <p className="text-sm text-navy-300 mt-1">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom fade to white */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}
