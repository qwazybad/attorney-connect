"use client";

import { useReveal } from "@/hooks/useInView";

export default function EducationalSection() {
  const ref = useReveal();

  return (
    <section ref={ref} className="py-24 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">

        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-16">
          <div className="reveal inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-600 text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-widest mb-4">
            Know Before You Sign
          </div>
          <h2 className="reveal reveal-delay-1 text-4xl sm:text-5xl font-bold text-navy-900 tracking-tight leading-tight">
            Most people overpay on{" "}
            <span className="text-red-500">legal fees</span>
          </h2>
          <p className="reveal reveal-delay-2 mt-4 text-gray-500 text-lg leading-relaxed">
            Attorney fees are negotiable — whether hourly, contingency, or flat fee. Our marketplace creates competition so firms offer their best rate, not a default quote.
          </p>
        </div>

        {/* 3-card row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
          {[
            {
              label: "Industry Default",
              fee: "$400/hr or 33%",
              color: "text-red-500",
              bg: "bg-red-50",
              border: "border-red-100",
              badge: "What most people pay",
              badgeBg: "bg-red-100 text-red-600",
              desc: "Walk into any attorney's office without comparing and you'll be quoted the default rate — every time.",
            },
            {
              label: "AttorneyCompete Avg",
              fee: "$290/hr or 27%",
              color: "text-accent-500",
              bg: "bg-accent-50",
              border: "border-accent-100",
              badge: "Our platform average",
              badgeBg: "bg-accent-100 text-accent-600",
              desc: "Because our attorneys compete for your case, fees trend significantly below market — hourly or contingency.",
            },
            {
              label: "Best Available",
              fee: "$150/hr or 20%",
              color: "text-emerald-600",
              bg: "bg-emerald-50",
              border: "border-emerald-100",
              badge: "Lowest fee on platform",
              badgeBg: "bg-emerald-100 text-emerald-700",
              desc: "The most competitive attorneys on our platform — keeping significantly more money in your pocket.",
            },
          ].map(({ label, fee, color, bg, border, badge, badgeBg, desc }, i) => (
            <div
              key={label}
              className={`reveal reveal-delay-${i + 1} card-lift bg-white rounded-2xl border ${border} p-6 shadow-card`}
            >
              <div className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${badgeBg} mb-4`}>{badge}</div>
              <div className={`text-3xl font-extrabold ${color} mb-1 leading-tight`}>{fee}</div>
              <div className="text-sm font-semibold text-gray-700 mb-2">{label}</div>
              <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* Dark comparison panel */}
        <div className="reveal bg-navy-900 rounded-3xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-8 lg:p-12 flex flex-col justify-center">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-4 leading-tight">
                On a $500,000 settlement,<br />
                <span className="text-gradient">a 10% savings is $50,000</span>
              </h3>
              <p className="text-gray-200 mb-6 leading-relaxed">
                That&apos;s a car. A year of tuition. A down payment. Our platform helps you keep it.
              </p>
              <ul className="space-y-3">
                {[
                  "All fees displayed upfront",
                  "Sort attorneys by lowest fee in one click",
                  "See your savings vs. market average",
                  "All attorneys bar-verified before listing",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-white">
                    <div className="w-5 h-5 rounded-full bg-accent-500/20 flex items-center justify-center shrink-0">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent-400" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Comparison table */}
            <div className="bg-white/5 p-8 lg:p-12 flex items-center">
              <div className="w-full">
                <p className="text-xs text-gray-200 uppercase tracking-widest font-semibold mb-5">
                  Fee Comparison · $500,000 Settlement
                </p>
                <div className="space-y-3">
                  {[
                    { label: "Industry Average", fee: 33, highlight: false },
                    { label: "Typical Directory", fee: 33, highlight: false },
                    { label: "AttorneyCompete Avg", fee: 27, highlight: false },
                    { label: "Best on Platform", fee: 20, highlight: true },
                  ].map(({ label, fee, highlight }) => {
                    const youKeep = 500000 * (1 - fee / 100);
                    const maxKeep = 500000 * 0.8;
                    const width = (youKeep / maxKeep) * 100;
                    return (
                      <div key={label} className={`p-3.5 rounded-xl ${highlight ? "bg-white/10 border border-white/20" : ""}`}>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className={`text-sm font-medium ${highlight ? "text-white" : "text-gray-200"}`}>{label}</span>
                          <div className="flex items-center gap-3">
                            <span className={`text-xs font-semibold ${highlight ? "text-accent-400" : "text-gray-300"}`}>{fee}%</span>
                            <span className={`text-sm font-bold ${highlight ? "text-white" : "text-white"}`}>${youKeep.toLocaleString()}</span>
                          </div>
                        </div>
                        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${highlight ? "bg-accent-400" : "bg-white/20"}`}
                            style={{ width: `${width}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
                  <span className="text-xs text-gray-300">Max savings vs. average</span>
                  <span className="text-xl font-extrabold text-emerald-400">+$65,000</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
