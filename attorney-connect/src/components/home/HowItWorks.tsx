"use client";

import Link from "next/link";
import { ClipboardList, LayoutGrid, Handshake, ArrowRight } from "lucide-react";
import { useReveal } from "@/hooks/useInView";

const steps = [
  {
    number: "01",
    icon: ClipboardList,
    title: "Answer a few questions",
    description: "Tell us your legal issue, location, and timeline. Under 2 minutes. Completely free.",
    gradient: "from-blue-500 to-accent-500",
  },
  {
    number: "02",
    icon: LayoutGrid,
    title: "Compare side by side",
    description: "See fees, ratings, response times, and real case results. Sort by lowest fee instantly.",
    gradient: "from-violet-500 to-purple-600",
  },
  {
    number: "03",
    icon: Handshake,
    title: "Choose and connect",
    description: "Submit your case to your chosen attorney at zero cost. You only pay if you win.",
    gradient: "from-emerald-500 to-teal-500",
  },
];

export default function HowItWorks() {
  const ref = useReveal();

  return (
    <section id="how-it-works" ref={ref} className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <div className="reveal inline-flex items-center gap-2 bg-accent-50 border border-accent-100 text-accent-600 text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-widest mb-4">
            How It Works
          </div>
          <h2 className="reveal reveal-delay-1 text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
            Get competing offers in minutes
          </h2>
          <p className="reveal reveal-delay-2 mt-4 text-gray-500 text-lg">
            Modeled after mortgage comparison platforms — fast, transparent, always free.
          </p>
        </div>

        <div className="relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-14 left-1/2 -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map(({ number, icon: Icon, title, description, gradient }, i) => (
              <div key={number} className={`reveal reveal-delay-${i + 1} flex flex-col items-center text-center`}>
                <div className="relative mb-6">
                  <div className={`w-28 h-28 rounded-3xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300`}>
                    <Icon className="w-12 h-12 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white border-2 border-gray-100 flex items-center justify-center">
                    <span className="text-xs font-extrabold text-gray-400">{number}</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed max-w-xs">{description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="reveal reveal-delay-3 mt-14 text-center">
          <Link
            href="/compare"
            className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-bold px-8 py-4 rounded-2xl text-base transition-all duration-200 hover:shadow-[0_8px_30px_rgba(0,0,0,0.2)]"
          >
            Start Comparing Now
            <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="mt-3 text-xs text-gray-400 font-medium">No account required · 100% free · No obligation</p>
        </div>
      </div>
    </section>
  );
}
