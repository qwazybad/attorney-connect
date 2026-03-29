"use client";

import { useEffect, useRef, useState } from "react";
import { Building2, Clock, Star, FileCheck } from "lucide-react";

function AnimatedNumber({ target, suffix = "" }: { target: number; suffix?: string }) {
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

  return <span ref={ref}>{value.toLocaleString()}{suffix}</span>;
}

const stats = [
  { icon: Building2, value: 2847, suffix: "+", label: "Verified Law Firms", color: "text-accent-500", bg: "bg-accent-500/10" },
  { icon: Clock, value: 18, suffix: " min", label: "Avg First Response", color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { icon: Star, value: 48, suffix: "/5.0", label: "Platform Rating", color: "text-yellow-500", bg: "bg-yellow-500/10" },
  { icon: FileCheck, value: 48293, suffix: "+", label: "Cases Matched", color: "text-purple-500", bg: "bg-purple-500/10" },
];

export default function StatsBar() {
  return (
    <section className="bg-white py-16 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map(({ icon: Icon, value, suffix, label, color, bg }) => (
            <div key={label} className="flex flex-col items-center text-center group">
              <div className={`w-12 h-12 rounded-2xl ${bg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                <Icon className={`w-6 h-6 ${color}`} />
              </div>
              <p className="text-3xl font-extrabold text-gray-900 tracking-tight">
                {label === "Platform Rating" ? (
                  <span>4.8<span className="text-gray-300 text-xl">/5.0</span></span>
                ) : (
                  <AnimatedNumber target={value} suffix={label === "Platform Rating" ? "" : suffix} />
                )}
              </p>
              <p className="text-sm text-gray-400 font-medium mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
