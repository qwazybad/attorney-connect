"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Star, Clock, MapPin, CheckCircle, Trophy, Phone, Mail,
  ArrowLeft, TrendingDown, Scale, Shield, FileText, Zap,
} from "lucide-react";
import { ATTORNEYS, formatRating, getResponseLabel, getSavingsPercent } from "@/lib/data";
import { useReveal } from "@/hooks/useInView";

const MOCK_REVIEWS = [
  { name: "Michael R.", rating: 5, date: "2 weeks ago", text: "Absolutely phenomenal attorney. Handled everything professionally and settled for more than I expected. Highly recommend." },
  { name: "Tricia L.", rating: 5, date: "1 month ago", text: "Best decision I made was choosing this attorney. The fee was fair and they were always responsive — never felt like just a case number." },
  { name: "James K.", rating: 5, date: "2 months ago", text: "Professional, responsive, and got results. Responded to my inquiry within the hour and had my case fully assessed the same day." },
  { name: "Angela M.", rating: 4, date: "3 months ago", text: "Very knowledgeable and genuinely cared about my outcome. Would recommend to anyone looking for a serious, trustworthy attorney." },
];

export default function AttorneyProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const attorney = ATTORNEYS.find((a) => a.id === id);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const mainRef = useReveal();
  const sidebarRef = useReveal();

  if (!attorney) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-500 mb-3">Attorney not found.</p>
          <Link href="/compare" className="text-accent-500 hover:underline font-semibold">
            Back to Compare
          </Link>
        </div>
      </div>
    );
  }

  const savings = getSavingsPercent(attorney.feePercent, attorney.avgFeePercent);
  const winRate = Math.round((attorney.casesWon / attorney.totalCases) * 100);
  const isHourly = attorney.billingType === "hourly";

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative bg-gray-800 overflow-hidden">
        {/* Orbs */}
        <div className="orb orb-blue animate-glow-pulse w-[500px] h-[500px] -top-40 -left-40 opacity-40" />
        <div className="orb orb-purple animate-glow-pulse w-[400px] h-[400px] top-1/2 -right-20 opacity-30" style={{ animationDelay: "1.2s" }} />
        <div className="orb orb-teal animate-float-slow w-[250px] h-[250px] bottom-0 left-1/3 opacity-20" />
        <div className="dot-grid absolute inset-0 opacity-30" />

        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 pt-8 pb-0">
          {/* Back button */}
          <button
            onClick={() => router.back()}
            className="opacity-0 animate-fade-in flex items-center gap-1.5 text-sm text-white/60 hover:text-white transition-colors mb-8"
            style={{ animationDelay: "0.1s", animationFillMode: "forwards" }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to results
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-end">
            {/* Left: Info */}
            <div className="pb-12">
              {/* Badges */}
              <div className="opacity-0 animate-slide-up flex flex-wrap gap-2 mb-5" style={{ animationDelay: "0.15s", animationFillMode: "forwards" }}>
                {attorney.badges.map((badge) => (
                  <span key={badge} className="glass text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                    {badge === "Fastest Response" && <Zap className="w-3 h-3 text-yellow-300" />}
                    {badge === "Top Rated" && <Star className="w-3 h-3 text-yellow-300 fill-yellow-300" />}
                    {badge === "Best Value" && <TrendingDown className="w-3 h-3 text-accent-300" />}
                    {badge}
                  </span>
                ))}
              </div>

              {/* Name & firm */}
              <h1 className="opacity-0 animate-slide-up text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-2" style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}>
                {attorney.name}
              </h1>
              <p className="opacity-0 animate-slide-up text-lg text-white font-medium mb-4" style={{ animationDelay: "0.25s", animationFillMode: "forwards" }}>
                {attorney.firm}
              </p>

              {/* Meta */}
              <div className="opacity-0 animate-slide-up flex flex-wrap gap-4 text-sm text-gray-200 mb-6" style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}>
                <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" />{attorney.city}, {attorney.state}</span>
                <span className="flex items-center gap-1.5"><Scale className="w-4 h-4" />{attorney.yearsExperience} yrs experience</span>
                <span className="flex items-center gap-1.5"><Shield className="w-4 h-4 text-accent-400" />Bar: {attorney.barNumber}</span>
              </div>

              {/* Bio */}
              <p className="opacity-0 animate-slide-up text-white leading-relaxed text-sm max-w-lg" style={{ animationDelay: "0.35s", animationFillMode: "forwards" }}>
                {attorney.bio}
              </p>

              {/* Stats bar */}
              <div className="opacity-0 animate-slide-up grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8" style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}>
                <div className="glass rounded-2xl p-3 text-center">
                  <p className="text-2xl font-extrabold text-white">
                    {isHourly ? `$${attorney.hourlyRate}` : `${attorney.feePercent}%`}
                  </p>
                  <p className="text-[10px] text-white/50 mt-0.5 font-medium">{isHourly ? "Per Hour" : "Fee"}</p>
                  {!isHourly && savings > 0 && (
                    <p className="text-[10px] text-accent-300 font-bold mt-0.5">-{savings}% avg</p>
                  )}
                </div>
                <div className="glass rounded-2xl p-3 text-center">
                  <div className="flex items-center justify-center gap-0.5">
                    <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                    <p className="text-2xl font-extrabold text-white">{formatRating(attorney.rating)}</p>
                  </div>
                  <p className="text-[10px] text-white/50 mt-0.5 font-medium">{attorney.reviewCount} reviews</p>
                </div>
                <div className="glass rounded-2xl p-3 text-center">
                  <p className="text-2xl font-extrabold text-white">{getResponseLabel(attorney.responseTimeHours)}</p>
                  <p className="text-[10px] text-white/50 mt-0.5 font-medium">Response</p>
                </div>
                <div className="glass rounded-2xl p-3 text-center">
                  <p className="text-2xl font-extrabold text-white">{winRate}%</p>
                  <p className="text-[10px] text-white/50 mt-0.5 font-medium">Success</p>
                </div>
              </div>
            </div>

            {/* Right: Photo */}
            <div className="opacity-0 animate-slide-up hidden lg:flex justify-end items-end" style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}>
              <div className="relative w-72 h-80 rounded-t-3xl overflow-hidden shadow-2xl">
                <Image
                  src={attorney.avatar}
                  alt={attorney.name}
                  fill
                  className="object-cover"
                  style={{ objectPosition: attorney.imagePosition ?? "top" }}
                  sizes="288px"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-800/60 via-transparent to-transparent" />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom fade into content */}
        <div className="h-8 bg-gradient-to-b from-transparent to-gray-50" />
      </section>

      {/* ── Main content ─────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left: Details */}
          <div ref={mainRef} className="lg:col-span-2 space-y-6">

            {/* Practice areas */}
            <div className="reveal bg-white rounded-2xl border border-gray-100 p-6 shadow-card">
              <h2 className="font-extrabold text-gray-900 text-lg mb-4">Practice Areas</h2>
              <div className="flex flex-wrap gap-2 mb-5">
                {attorney.practiceAreas.map((area) => (
                  <span key={area} className="bg-accent-50 text-accent-600 text-sm px-3 py-1.5 rounded-xl font-semibold border border-accent-100">
                    {area}
                  </span>
                ))}
              </div>
              <h3 className="font-semibold text-gray-500 text-xs uppercase tracking-widest mb-2">Licensed In</h3>
              <div className="flex flex-wrap gap-2">
                {attorney.states.map((s) => (
                  <span key={s} className="bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-lg font-medium">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Recent results */}
            <div className="reveal reveal-delay-1 bg-white rounded-2xl border border-gray-100 p-6 shadow-card">
              <h2 className="font-extrabold text-gray-900 text-lg mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                Case Results
              </h2>
              <div className="bg-gradient-to-r from-accent-50 to-emerald-50 border border-accent-100 rounded-2xl p-5 mb-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-bold text-gray-800 text-base">{attorney.recentResult}</p>
                    <p className="text-xs text-gray-400 mt-0.5 font-medium">Most recent result</p>
                  </div>
                  {attorney.recentResultAmount && (
                    <p className="text-3xl font-extrabold text-accent-500 shrink-0">{attorney.recentResultAmount}</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-3 gap-3">
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-2xl font-extrabold text-gray-900">{attorney.casesWon}</p>
                  <p className="text-xs text-gray-400 mt-0.5 font-medium">Cases Won</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-2xl font-extrabold text-gray-900">{attorney.totalCases}</p>
                  <p className="text-xs text-gray-400 mt-0.5 font-medium">Total Cases</p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 text-center">
                  <p className="text-2xl font-extrabold text-accent-500">{winRate}%</p>
                  <p className="text-xs text-gray-400 mt-0.5 font-medium">Success Rate</p>
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div className="reveal reveal-delay-2 bg-white rounded-2xl border border-gray-100 p-6 shadow-card">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-extrabold text-gray-900 text-lg">Client Reviews</h2>
                <div className="flex items-center gap-1.5">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  <span className="text-xl font-extrabold text-gray-900">{formatRating(attorney.rating)}</span>
                  <span className="text-sm text-gray-400 font-medium">({attorney.reviewCount})</span>
                </div>
              </div>
              <div className="space-y-4">
                {MOCK_REVIEWS.map((review, i) => (
                  <div key={i} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-500 to-indigo-500 flex items-center justify-center text-white text-xs font-extrabold">
                          {review.name[0]}
                        </div>
                        <span className="font-semibold text-sm text-gray-800">{review.name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: review.rating }).map((_, j) => (
                          <Star key={j} className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                        ))}
                        <span className="text-xs text-gray-400 ml-1">{review.date}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{review.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div ref={sidebarRef} className="lg:col-span-1">
            <div className="sticky top-20 space-y-4">

              {/* Fee highlight */}
              <div className="reveal bg-gray-800 rounded-2xl p-5 relative overflow-hidden">
                <div className="orb orb-blue w-40 h-40 -top-10 -right-10 opacity-40" />
                <div className="relative">
                  <p className="text-gray-200 text-xs font-semibold uppercase tracking-widest mb-1">
                    {isHourly ? "Hourly Rate" : "Contingency Fee"}
                  </p>
                  {isHourly ? (
                    <p className="text-5xl font-extrabold text-white">
                      ${attorney.hourlyRate}<span className="text-2xl text-white/50">/hr</span>
                    </p>
                  ) : (
                    <>
                      <p className="text-5xl font-extrabold text-white">{attorney.feePercent}%</p>
                      {savings > 0 && (
                        <>
                          <p className="text-gray-200 text-sm mt-1">{savings}% below the {attorney.avgFeePercent}% industry average</p>
                          <div className="mt-3 bg-white/10 rounded-xl p-3">
                            <p className="text-white/60 text-xs">On a $300K settlement you save:</p>
                            <p className="text-2xl font-extrabold text-accent-300 mt-0.5">
                              ${(300000 * savings / 100).toLocaleString()}
                            </p>
                          </div>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Contact form */}
              <div className="reveal reveal-delay-1 bg-white rounded-2xl border border-gray-100 p-5 shadow-card">
                <h3 className="font-extrabold text-gray-900 text-base mb-1">Get a Free Case Review</h3>
                <p className="text-xs text-gray-400 mb-4">
                  No obligation · Responds in {getResponseLabel(attorney.responseTimeHours)}
                </p>

                {submitted ? (
                  <div className="text-center py-6">
                    <div className="w-14 h-14 rounded-full bg-accent-50 flex items-center justify-center mx-auto mb-3">
                      <CheckCircle className="w-8 h-8 text-accent-500" />
                    </div>
                    <p className="font-extrabold text-gray-900">Request Sent!</p>
                    <p className="text-sm text-gray-400 mt-1">
                      {attorney.name} will reach out within {getResponseLabel(attorney.responseTimeHours)}.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-3">
                    <input
                      type="text"
                      placeholder="Your full name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent-500 bg-gray-50"
                    />
                    <input
                      type="email"
                      placeholder="Email address"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent-500 bg-gray-50"
                    />
                    <input
                      type="tel"
                      placeholder="Phone number"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent-500 bg-gray-50"
                    />
                    <textarea
                      placeholder="Briefly describe your case..."
                      rows={3}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-accent-500 bg-gray-50 resize-none"
                    />
                    <button
                      type="submit"
                      className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 rounded-xl transition-colors text-sm"
                    >
                      Request Free Consultation
                    </button>
                  </form>
                )}

                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-100">
                  <button className="flex-1 flex items-center justify-center gap-1.5 border border-gray-200 text-gray-700 text-xs font-semibold py-2.5 rounded-xl hover:bg-gray-50 transition-colors">
                    <Phone className="w-3.5 h-3.5" />
                    Call
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-1.5 border border-gray-200 text-gray-700 text-xs font-semibold py-2.5 rounded-xl hover:bg-gray-50 transition-colors">
                    <Mail className="w-3.5 h-3.5" />
                    Email
                  </button>
                </div>
              </div>

              {/* Trust signals */}
              <div className="reveal reveal-delay-2 bg-white rounded-2xl border border-gray-100 p-4 shadow-card">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Verified by AttorneyCompete</p>
                <div className="space-y-2.5">
                  {[
                    "Bar license verified",
                    "Background check completed",
                    "Malpractice insurance confirmed",
                    "No obligation — 100% free review",
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2 text-xs text-gray-600 font-medium">
                      <div className="w-4 h-4 rounded-full bg-accent-50 flex items-center justify-center shrink-0">
                        <Shield className="w-2.5 h-2.5 text-accent-500" />
                      </div>
                      {item}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
