"use client";

import { Search, Scale, Bot, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useReveal } from "@/hooks/useInView";

const pillars = [
  {
    icon: Search,
    color: "text-blue-500",
    bg: "bg-blue-50",
    border: "border-blue-100",
    title: "See Real Fees Live",
    desc: "No more \"call for pricing.\" Every attorney on our platform lists their exact fee structure — contingency, hourly, or flat fee — right on their profile, updated in real time.",
  },
  {
    icon: Scale,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
    title: "Every Practice Area",
    desc: "Personal injury, immigration, family law, estate planning, wills & trusts, criminal defense, business law, and more. If you have a legal need, we have an attorney for it.",
  },
  {
    icon: Bot,
    color: "text-purple-500",
    bg: "bg-purple-50",
    border: "border-purple-100",
    title: "AI-Powered Matching",
    desc: "Not sure what type of attorney you need? Describe your situation in plain English and our AI instantly routes you to the right attorney — then you compare live fees and choose.",
  },
];

export default function WhyNowSection() {
  const ref = useReveal();

  return (
    <section ref={ref} className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">

        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="reveal inline-flex items-center gap-2 bg-gray-100 border border-gray-200 text-gray-600 text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-widest mb-4">
            Why This Didn't Exist Before
          </div>
          <h2 className="reveal reveal-delay-1 text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight mb-6">
            The Legal Industry's Best Kept Secret —{" "}
            <span className="text-blue-500">Attorney Fees Are Negotiable</span>
          </h2>
          <p className="reveal reveal-delay-2 text-gray-500 text-lg leading-relaxed">
            For decades, finding an attorney meant calling around, getting vague quotes, and hoping you weren't overpaying. There was never a centralized place to compare — until now. AttorneyCompete is the first live marketplace where attorney fees are public, competitive, and searchable in real time. Like LendingTree did for mortgages, we're bringing transparency to legal services.
          </p>
        </div>

        {/* 3 pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
          {pillars.map(({ icon: Icon, color, bg, border, title, desc }, i) => (
            <div key={title} className={`reveal reveal-delay-${i + 1} bg-white rounded-2xl border ${border} p-7 shadow-sm card-lift`}>
              <div className={`w-11 h-11 ${bg} rounded-xl flex items-center justify-center mb-5`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* Bottom CTA strip */}
        <div className="reveal bg-gray-950 rounded-3xl px-8 py-10 text-center">
          <p className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-3">The Bottom Line</p>
          <p className="text-white text-2xl sm:text-3xl font-extrabold mb-8 max-w-2xl mx-auto leading-tight">
            "The first time in history you can shop for an attorney the same way you shop for anything else."
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => {
                const el = document.querySelector("[aria-label='Open legal assistant']") as HTMLButtonElement | null;
                el?.click();
              }}
              className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-bold px-6 py-3.5 rounded-xl transition-colors text-sm"
            >
              <Bot className="w-4 h-4" />
              Try the AI Match
            </button>
            <Link
              href="/compare"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-3.5 rounded-xl transition-colors text-sm"
            >
              Browse All Attorneys
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
