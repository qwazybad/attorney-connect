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
  { icon: Building2, value: 2847, suffix: "+", label: "Verified Law Firms",  iconColor: "text-navy-600",  iconBg: "bg-navy-100" },
  { icon: Clock,     value: 18,   suffix: " min", label: "Avg First Response", iconColor: "text-emerald-600", iconBg: "bg-emerald-50" },
  { icon: Star,      value: 48,   suffix: "",    label: "Platform Rating",    iconColor: "text-gold-500",  iconBg: "bg-gold-50" },
  { icon: FileCheck, value: 48293, suffix: "+",  label: "Cases Matched",     iconColor: "text-blue-600",  iconBg: "bg-blue-50" },
];

export default function StatsBar() {
  return (
    <section className="bg-white border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 divide-y-2 md:divide-y-0 md:divide-x divide-gray-100">
          {stats.map(({ icon: Icon, value, suffix, label, iconColor, iconBg }, i) => (
            <div key={label} className={`flex flex-col items-center text-center ${i > 0 && i % 2 === 0 ? "pt-8 md:pt-0" : ""} md:px-8`}>
              <div className={`w-11 h-11 rounded-2xl ${iconBg} flex items-center justify-center mb-3`}>
                <Icon className={`w-5 h-5 ${iconColor}`} />
              </div>
              <p className="text-3xl font-extrabold text-navy-900 tracking-tight font-display">
                {label === "Platform Rating" ? (
                  <>4.8<span className="text-gray-300 text-xl font-sans font-medium">/5.0</span></>
                ) : (
                  <AnimatedNumber target={value} suffix={suffix} />
                )}
              </p>
              <p className="text-sm text-gray-400 font-medium mt-1">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
