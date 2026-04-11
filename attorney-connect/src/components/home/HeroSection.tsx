"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ChevronDown, Shield, Star, Zap, ArrowRight, Bot } from "lucide-react";
import { LEGAL_ISSUES, US_STATES, TIMELINES } from "@/lib/data";

export default function HeroSection() {
  const router = useRouter();
  const [legalIssue, setLegalIssue] = useState("");
  const [state, setState] = useState("");
  const [timeline, setTimeline] = useState("");
  const [feePreference, setFeePreference] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (legalIssue) params.set("area", legalIssue);
    if (state) params.set("state", state);
    if (timeline) params.set("timeline", timeline);
    if (feePreference) params.set("fee", feePreference);
    router.push(`/compare?${params.toString()}`);
  }

  return (
    <section className="relative bg-white overflow-hidden pt-16">
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
              className="text-lg text-gray-500 leading-relaxed max-w-lg mb-8 opacity-0 animate-slide-up"
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
                className="inline-flex items-center justify-center gap-2 bg-white border border-gray-200 hover:border-navy-200 text-gray-700 hover:text-navy-900 font-semibold px-7 py-4 rounded-2xl transition-all duration-200 text-[15px]"
              >
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

          {/* ── Search card ──────────────────────────────────────── */}
          <div
              className="mt-8 bg-white border border-gray-200/80 rounded-2xl shadow-[0_8px_40px_rgba(15,48,85,0.10)] p-4 sm:p-5 opacity-0 animate-slide-up transition-all duration-300 text-left"
              style={{ animationDelay: "0.1s", animationFillMode: "forwards" }}
            >
              <form onSubmit={handleSearch}>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
                  {[
                    { label: "Legal Issue", value: legalIssue, onChange: setLegalIssue, placeholder: "Select issue type", options: LEGAL_ISSUES.map((i) => ({ value: i.value, label: i.label })) },
                    { label: "Your State", value: state, onChange: setState, placeholder: "Select state", options: US_STATES.map((s) => ({ value: s, label: s })) },
                    { label: "Timeline", value: timeline, onChange: setTimeline, placeholder: "When needed?", options: TIMELINES.map((t) => ({ value: t, label: t })) },
                    { label: "Max Fee", value: feePreference, onChange: setFeePreference, placeholder: "Any fee", options: [{ value: "under-25", label: "Under 25%" }, { value: "under-30", label: "Under 30%" }, { value: "under-33", label: "Under 34% (avg)" }] },
                  ].map(({ label, value, onChange, placeholder, options }) => (
                    <div key={label}>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</label>
                      <div className="relative">
                        <select
                          value={value}
                          onChange={(e) => onChange(e.target.value)}
                          className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-900 text-sm font-medium rounded-xl px-3 py-2.5 pr-8 focus:outline-none focus:ring-2 focus:ring-navy-500/20 focus:border-navy-400 transition-all cursor-pointer"
                        >
                          <option value="">{placeholder}</option>
                          {options.map((o) => (
                            <option key={o.value} value={o.value}>{o.label}</option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  type="submit"
                  className="w-full bg-navy-900 hover:bg-navy-800 text-white font-bold py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 text-sm shadow-lg shadow-navy-900/20"
                >
                  <Search className="w-4 h-4" />
                  Compare Attorneys
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              <p className="text-center text-xs text-gray-400 mt-4">
                Free · No obligation · 2,847 verified firms
              </p>
            </div>

      </div>
    </section>
  );
}
