"use client";

import { useRouter } from "next/navigation";
import { Search, Shield, Star, Zap, ArrowRight, Bot } from "lucide-react";
import { LEGAL_ISSUES } from "@/lib/data";

export default function HeroSection() {
  const router = useRouter();

  return (
    <section className="relative overflow-hidden pt-16" style={{ background: "linear-gradient(135deg, #EAF0FB 0%, #F0EEF8 40%, #F5F0EC 100%)" }}>
      {/* Thin blue top bar */}
      <div className="absolute top-16 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400/40 to-transparent" />

      <div className="relative max-w-5xl mx-auto px-5 sm:px-8 text-center py-10 sm:py-12 lg:py-16">

            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-600 text-[11px] font-bold px-3.5 py-1.5 rounded-full uppercase tracking-widest mb-7 animate-fade-in opacity-0" style={{ animationFillMode: "forwards" }}>
              <Zap className="w-3 h-3 text-blue-500" />
              The First Legal Marketplace
            </div>

            {/* Headline */}
            <h1
              className="text-[2.25rem] sm:text-[3rem] lg:text-[3.75rem] font-extrabold text-navy-900 leading-[1.05] tracking-[-0.02em] mb-5 opacity-0 animate-slide-up"
              style={{ animationFillMode: "forwards" }}
            >
              Attorneys Compete.
              <br />
              <span className="text-blue-500">You Win.</span>
            </h1>

            <p
              className="text-lg text-gray-500 leading-relaxed max-w-lg mx-auto mb-8 opacity-0 animate-slide-up"
              style={{ animationDelay: "0.08s", animationFillMode: "forwards" }}
            >
              Stop guessing what an attorney costs. Start comparing.
            </p>

            {/* CTAs */}
            <div
              className="flex flex-col sm:flex-row gap-3 mb-6 opacity-0 animate-slide-up justify-center"
              style={{ animationDelay: "0.14s", animationFillMode: "forwards" }}
            >
              <button
                onClick={() => router.push("/compare")}
                className="group relative inline-flex items-center justify-center gap-2 bg-navy-900 hover:bg-navy-800 text-white font-bold px-7 py-4 rounded-2xl transition-all duration-200 text-[15px] shadow-lg shadow-navy-900/20 hover:shadow-navy-900/40 overflow-hidden"
              >
                <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] bg-white/10 skew-x-12 transition-transform duration-500 pointer-events-none" />
                <Search className="w-4 h-4" />
                Compare Attorneys — Free
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
              <button
                onClick={() => {
                  const el = document.querySelector("[aria-label='Open legal assistant']") as HTMLButtonElement | null;
                  el?.click();
                }}
                className="group relative inline-flex items-center justify-center gap-2 bg-white border border-gray-200 hover:border-navy-200 text-gray-700 hover:text-navy-900 font-semibold px-7 py-4 rounded-2xl transition-all duration-200 text-[15px] overflow-hidden"
              >
                <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] bg-navy-900/5 skew-x-12 transition-transform duration-500 pointer-events-none" />
                <Bot className="w-4 h-4 text-navy-600" />
                AI Match My Case
              </button>
            </div>

            {/* Trust signals */}
            <div
              className="flex flex-wrap items-center gap-x-6 gap-y-2 opacity-0 animate-slide-up justify-center"
              style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}
            >
              {[
                { icon: Shield, color: "text-emerald-500", label: "Bar-verified attorneys" },
                { icon: Star,   color: "text-yellow-400",   label: "4.8 platform rating" },
                { icon: Zap,    color: "text-blue-500",    label: "Avg response 1.8 hrs" },
              ].map(({ icon: Icon, color, label }) => (
                <span key={label} className="group flex items-center gap-1.5 text-sm text-gray-500 cursor-default">
                  <Icon className={`w-4 h-4 ${color} group-hover:scale-125 transition-transform duration-200`} />
                  {label}
                </span>
              ))}
            </div>

            {/* Quick-select pills */}
            <div
              className="mt-4 opacity-0 animate-slide-up"
              style={{ animationDelay: "0.26s", animationFillMode: "forwards" }}
            >
              <span className="text-[11px] text-gray-400 font-semibold uppercase tracking-widest block mb-2">Popular</span>
              <div className="flex flex-wrap gap-1.5 justify-center">
              {[
                { label: "Personal Injury", area: "Personal Injury" },
                { label: "Car Accident", area: "Car Accident" },
                { label: "Malpractice", area: "Medical Malpractice" },
                { label: "Employment", area: "Employment Law" },
                { label: "Workers' Comp", area: "Workers' Comp" },
              ].map(({ label, area }, i) => (
                <button
                  key={area}
                  onClick={() => {
                    const found = LEGAL_ISSUES.find((i) => i.label === area || i.label.includes(area.split(" ")[0]));
                    if (found) router.push(`/compare?area=${found.value}`);
                  }}
                  className="text-xs font-medium px-3 py-1.5 rounded-full border border-gray-200 text-gray-600 hover:bg-navy-900 hover:text-white hover:border-navy-900 transition-all duration-200 whitespace-nowrap opacity-0 animate-fade-in"
                  style={{ animationDelay: `${0.32 + i * 0.06}s`, animationFillMode: "forwards" }}
                >
                  {label}
                </button>
              ))}
              </div>
            </div>

      </div>
    </section>
  );
}
