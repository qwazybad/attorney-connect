"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ChevronDown, Shield, Star, Zap, ArrowRight } from "lucide-react";
import Image from "next/image";
import { LEGAL_ISSUES, US_STATES, TIMELINES } from "@/lib/data";
import ParticleCloud from "@/components/shared/ParticleCloud";

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
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-white">

      {/* Subtle dot grid */}
      <div className="absolute inset-0 dot-grid-dark opacity-50" />

      {/* Soft gradient blobs */}
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-blue-100 opacity-60 blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-40 w-[500px] h-[500px] rounded-full bg-emerald-100 opacity-50 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] rounded-full bg-blue-50 opacity-40 blur-3xl pointer-events-none" />

      {/* Lady Justice — right side */}
      <div className="absolute right-0 top-0 h-full w-[50%] pointer-events-none hidden lg:block">
        <Image
          src="/pineapple-diaries.jpeg"
          alt="Lady Justice"
          fill
          className="object-cover object-center"
          style={{ opacity: 0.08, maskImage: "linear-gradient(to right, transparent 0%, black 40%)", WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 40%)" }}
          priority
        />
      </div>

      {/* Bottom fade into next section */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-50 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 pt-28 pb-20">
        <div className="max-w-4xl mx-auto text-center">

          {/* Pill badge */}
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full px-4 py-1.5 text-sm text-blue-600 font-semibold mb-8 animate-fade-in">
            <Zap className="w-3.5 h-3.5 text-blue-500" />
            <span>AI-powered matching · 2,847 verified firms · Free for consumers</span>
          </div>

          {/* Main headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-gray-900 leading-[1.05] mb-6 opacity-0 animate-slide-up" style={{ animationFillMode: "forwards" }}>
            When Attorneys{" "}
            <span className="text-gray-900">Compete,</span>
            <br />
            <span className="text-blue-500">You Win.</span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto mb-10 opacity-0 animate-slide-up" style={{ animationDelay: "0.1s", animationFillMode: "forwards" }}>
            Compare fees, ratings, and results from top attorneys — transparently.
            The average contingency fee is{" "}
            <span className="text-gray-900 font-semibold underline">34%</span>. Many attorneys on our platform charge significantly less.
          </p>

          {/* Search form */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 max-w-4xl mx-auto shadow-[0_8px_40px_rgba(0,0,0,0.08)] opacity-0 animate-slide-up" style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}>
            <form onSubmit={handleSearch}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
                {[
                  {
                    label: "Legal Issue",
                    value: legalIssue,
                    onChange: setLegalIssue,
                    placeholder: "Select issue type",
                    options: LEGAL_ISSUES.map((i) => ({ value: i.value, label: i.label })),
                  },
                  {
                    label: "Your State",
                    value: state,
                    onChange: setState,
                    placeholder: "Select state",
                    options: US_STATES.map((s) => ({ value: s, label: s })),
                  },
                  {
                    label: "Timeline",
                    value: timeline,
                    onChange: setTimeline,
                    placeholder: "When do you need help?",
                    options: TIMELINES.map((t) => ({ value: t, label: t })),
                  },
                  {
                    label: "Max Fee",
                    value: feePreference,
                    onChange: setFeePreference,
                    placeholder: "Any fee",
                    options: [
                      { value: "under-25", label: "Under 25%" },
                      { value: "under-30", label: "Under 30%" },
                      { value: "under-33", label: "Under 34% (avg)" },
                    ],
                  },
                ].map(({ label, value, onChange, placeholder, options }) => (
                  <div key={label}>
                    <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-1.5 ml-0.5">
                      {label}
                    </label>
                    <div className="relative">
                      <select
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-900 text-sm font-medium rounded-xl px-3 py-2.5 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all cursor-pointer"
                      >
                        <option value="">{placeholder}</option>
                        {options.map((o) => (
                          <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 text-[15px] hover:shadow-[0_4px_20px_rgba(59,130,246,0.4)]"
              >
                <Search className="w-[18px] h-[18px]" />
                Compare Attorneys — It&apos;s Free
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-3 flex flex-wrap items-center justify-center gap-5 text-xs text-gray-500 font-semibold">
              <span className="flex items-center gap-1.5"><Shield className="w-3.5 h-3.5 text-green-500" /> No obligation</span>
              <span className="flex items-center gap-1.5"><Star className="w-3.5 h-3.5 text-yellow-400" /> Verified reviews</span>
              <span className="flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-blue-500" /> Avg response 1.8 hrs</span>
            </div>
          </div>

          {/* Quick links */}
          <div className="mt-8 flex flex-wrap justify-center gap-2 opacity-0 animate-slide-up" style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}>
            {["Personal Injury", "Car Accident", "Medical Malpractice", "Employment Law", "Workers' Comp"].map((area) => (
              <button
                key={area}
                onClick={() => {
                  const found = LEGAL_ISSUES.find((i) => i.label === area || i.label.includes(area.split(" ")[0]));
                  if (found) router.push(`/compare?area=${found.value}`);
                }}
                className="bg-white border border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-500 text-xs font-medium px-3.5 py-1.5 rounded-full transition-all duration-200 shadow-sm"
              >
                {area}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
