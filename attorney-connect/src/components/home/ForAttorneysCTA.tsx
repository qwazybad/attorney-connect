"use client";

"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { TrendingUp, Users, DollarSign, BarChart3, ArrowRight, CheckCircle } from "lucide-react";
import { useReveal } from "@/hooks/useInView";

function AnimatedNumber({ target, prefix = "", suffix = "" }: { target: number; prefix?: string; suffix?: string }) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const start = Date.now();
        const duration = 1800;
        const tick = () => {
          const elapsed = Date.now() - start;
          const progress = Math.min(elapsed / duration, 1);
          const ease = 1 - Math.pow(1 - progress, 4);
          setValue(Math.round(target * ease));
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.5 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{prefix}{value.toLocaleString()}{suffix}</span>;
}

const benefits = [
  { icon: Users, title: "Pre-qualified leads", description: "Consumers matched to your exact practice area and state." },
  { icon: DollarSign, title: "Pay when the client signs", description: "Zero upfront cost. You pay a flat referral fee only when a client signs an engagement letter or retainer agreement." },
  { icon: TrendingUp, title: "Compete on merit", description: "Lower fees and faster response = higher placement. No ads." },
  { icon: BarChart3, title: "Full analytics dashboard", description: "Track leads, conversions, and revenue in real time." },
];

export default function ForAttorneysCTA() {
  const ref = useReveal();

  return (
    <section ref={ref} className="relative py-24 bg-gray-800 overflow-hidden">
      <div className="absolute inset-0 dot-grid opacity-20" />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left */}
          <div>
            <div className="reveal inline-flex items-center gap-2 glass text-white/60 text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-widest mb-5">
              For Law Firms
            </div>
            <h2 className="reveal reveal-delay-1 text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-5">
              Performance-based leads.{" "}
              <span className="text-gradient">Zero upfront cost.</span>
            </h2>
            <p className="reveal reveal-delay-2 text-gray-200 text-lg mb-8 leading-relaxed">
              AttorneyCompete sends you pre-screened consumers. You pay nothing until a client signs an engagement letter or retainer agreement with your firm — no wasted ad spend.
            </p>

            <ul className="reveal reveal-delay-2 space-y-2.5 mb-8">
              {["Apply in under 10 minutes", "Bar license verification included", "Set your own competitive fee", "Cancel anytime — no contracts"].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm text-white">
                  <CheckCircle className="w-4 h-4 text-accent-400 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>

            <div className="reveal reveal-delay-3 flex flex-col sm:flex-row gap-3">
              <Link href="/join" className="inline-flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-bold px-6 py-3.5 rounded-2xl transition-all duration-200 hover:shadow-[0_4px_24px_rgba(59,130,246,0.4)]">
                Apply as a Partner Firm
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/for-attorneys" className="inline-flex items-center justify-center gap-2 glass text-white font-semibold px-6 py-3.5 rounded-2xl transition-all duration-200 hover:bg-white/10">
                Learn More
              </Link>
            </div>
          </div>

          {/* Right — benefit cards */}
          <div className="grid grid-cols-2 gap-4">
            {benefits.map(({ icon: Icon, title, description }, i) => (
              <div key={title} className={`reveal reveal-delay-${i + 1} glass rounded-2xl p-5 hover:bg-white/10 transition-all duration-200 card-lift`}>
                <div className="w-10 h-10 rounded-xl bg-accent-500/20 flex items-center justify-center mb-3">
                  <Icon className="w-5 h-5 text-accent-400" />
                </div>
                <h4 className="font-bold text-white text-sm mb-1">{title}</h4>
                <p className="text-xs text-gray-300 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats row */}
        <div className="reveal reveal-delay-3 mt-16 pt-10 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { prefix: "$", target: 0, suffix: "", label: "Upfront cost" },
            { prefix: "", target: 48000, suffix: "+", label: "Cases matched" },
            { prefix: "", target: 48, suffix: "★", label: "Firm satisfaction", decimal: true },
            { prefix: "", target: 2800, suffix: "+", label: "Partner firms" },
          ].map(({ prefix, target, suffix, label, decimal }) => (
            <div key={label} className="text-center">
              <p className="text-3xl font-extrabold text-white">
                {target === 0 ? "$0" : decimal ? `4.8${suffix}` : <AnimatedNumber prefix={prefix} target={target} suffix={suffix} />}
              </p>
              <p className="text-sm text-gray-300 mt-1">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
