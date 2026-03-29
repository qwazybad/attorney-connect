"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Scale } from "lucide-react";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-gray-200/60 shadow-sm">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 rounded-xl bg-blue-500 flex items-center justify-center">
              <Scale className="w-[18px] h-[18px] text-white" />
            </div>
            <span className="font-extrabold text-[17px] tracking-tight text-gray-900">
              Attorney<span className="text-gradient-blue">Compete</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-7">
            {[
              { href: "/compare", label: "Compare" },
              { href: "/for-attorneys", label: "For Firms" },
              { href: "/#how-it-works", label: "How It Works" },
            ].map(({ href, label }) => (
              <Link key={href} href={href} className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200">
                {label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link href="/for-attorneys" className="text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors duration-200">
              Partner With Us
            </Link>
            <Link href="/compare" className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all duration-200">
              Get Free Quotes
            </Link>
          </div>

          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors" aria-label="Toggle menu">
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-5 py-4 space-y-1">
          {[
            { href: "/compare", label: "Compare Attorneys" },
            { href: "/for-attorneys", label: "For Law Firms" },
            { href: "/#how-it-works", label: "How It Works" },
          ].map(({ href, label }) => (
            <Link key={href} href={href} onClick={() => setMobileOpen(false)} className="block py-2.5 text-sm font-medium text-gray-700 hover:text-accent-500 transition-colors">
              {label}
            </Link>
          ))}
          <div className="pt-3 border-t border-gray-100">
            <Link href="/compare" onClick={() => setMobileOpen(false)} className="block w-full text-center bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold px-4 py-3 rounded-xl">
              Get Free Quotes
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
