"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Star, MapPin, Trophy,
  ArrowLeft, TrendingDown, Scale, Shield, Zap,
} from "lucide-react";
import { ATTORNEYS, Attorney, formatRating, getResponseLabel, getSavingsPercent, getHourlySavingsPercent } from "@/lib/data";
import { useReveal } from "@/hooks/useInView";
import LeadFunnel from "@/components/shared/LeadFunnel";

function parseYears(val: unknown): number {
  if (typeof val === "number") return val;
  if (typeof val === "string") {
    const m = val.match(/(\d+)/);
    return m ? parseInt(m[1]) : 0;
  }
  return 0;
}

function mapRow(row: Record<string, unknown>): Attorney {
  const states = (row.licensed_states as string[]) || [];
  return {
    id: row.id as string,
    name: (row.name as string) || "Attorney",
    firm: (row.firm as string) || "",
    avatar: (row.photo_url as string) || "",
    bio: (row.bio as string) || "",
    practiceAreas: (row.practice_areas as string[]) || [],
    states,
    city: (row.city as string) || undefined,
    state: (row.state as string) || states[0] || undefined,
    billingType: ((row.billing_type as string) || "contingency") as Attorney["billingType"],
    feePercent: (row.fee_percent as number) || 33,
    avgFeePercent: 34,
    hourlyRate: (row.hourly_rate as number) || undefined,
    avgHourlyRate: 400,
    flatFee: (row.flat_fee as number) || undefined,
    yearsExperience: parseYears(row.years_experience),
    rating: 0,
    reviewCount: 0,
    responseTimeHours: (row.response_time_hours as number) || 24,
    casesWon: (row.cases_won as number) || 0,
    totalCases: (row.total_cases as number) || 0,
    recentResult: (row.recent_result as string) || undefined,
    recentResultAmount: (row.recent_result_amount as string) || undefined,
    successRate: 0,
    badges: [],
    phone: (row.phone as string) || undefined,
    website: (row.website as string) || undefined,
    imagePosition: (row.image_position as string) || undefined,
  };
}

const MOCK_REVIEWS = [
  { name: "Michael R.", rating: 5, date: "2 weeks ago", text: "Absolutely phenomenal attorney. Handled everything professionally and settled for more than I expected. Highly recommend." },
  { name: "Tricia L.", rating: 5, date: "1 month ago", text: "Best decision I made was choosing this attorney. The fee was fair and they were always responsive — never felt like just a case number." },
  { name: "James K.", rating: 5, date: "2 months ago", text: "Professional, responsive, and got results. Responded to my inquiry within the hour and had my case fully assessed the same day." },
  { name: "Angela M.", rating: 4, date: "3 months ago", text: "Very knowledgeable and genuinely cared about my outcome. Would recommend to anyone looking for a serious, trustworthy attorney." },
];

export default function AttorneyProfilePage() {
  const { id } = useParams();
  const router = useRouter();

  const staticMatch = ATTORNEYS.find((a) => a.id === id);
  const [attorney, setAttorney] = useState<Attorney | null>(staticMatch ?? null);
  const [loading, setLoading] = useState(!staticMatch);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (staticMatch) return;
    fetch(`/api/attorneys/${id}`)
      .then((r) => r.json())
      .then(({ data, error }) => {
        if (error || !data) setNotFound(true);
        else setAttorney(mapRow(data));
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id, staticMatch]);

  const [funnelOpen, setFunnelOpen] = useState(false);

  const mainRef = useReveal();
  const sidebarRef = useReveal();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (notFound || !attorney) {
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
  const hourlySavings = attorney.billingType === "hourly" && attorney.hourlyRate && attorney.avgHourlyRate
    ? getHourlySavingsPercent(attorney.hourlyRate, attorney.avgHourlyRate)
    : 0;
  const winRate = attorney.totalCases > 0 ? Math.round((attorney.casesWon / attorney.totalCases) * 100) : null;
  const isHourly = attorney.billingType === "hourly";


  return (
    <>
    <div className="min-h-screen bg-gray-50">

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative bg-white border-b border-gray-100 overflow-hidden">
        {/* Subtle right-panel tint */}
        <div className="absolute inset-y-0 right-0 w-[38%] bg-navy-50/60 hidden lg:block pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 pt-8 pb-0">
          {/* Back button */}
          <button
            onClick={() => router.back()}
            className="opacity-0 animate-fade-in flex items-center gap-1.5 text-sm text-gray-400 hover:text-navy-900 transition-colors mb-8"
            style={{ animationDelay: "0.1s", animationFillMode: "forwards" }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to results
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pb-12">
            {/* Left: Info */}
            <div className="lg:col-span-7">
              {/* Mobile photo */}
              {attorney.avatar && (
                <div className="opacity-0 animate-slide-up lg:hidden flex justify-center mb-6" style={{ animationDelay: "0.15s", animationFillMode: "forwards" }}>
                  <div className="relative w-28 h-28 rounded-full overflow-hidden ring-4 ring-gray-100 shadow-lg">
                    <Image
                      src={attorney.avatar}
                      alt={attorney.name}
                      fill
                      className="object-cover"
                      style={{ objectPosition: attorney.imagePosition ?? "top" }}
                      sizes="112px"
                      priority
                    />
                  </div>
                </div>
              )}

              {/* Badges */}
              <div className="opacity-0 animate-slide-up flex flex-wrap gap-2 mb-5" style={{ animationDelay: "0.15s", animationFillMode: "forwards" }}>
                {attorney.badges.map((badge) => (
                  <span key={badge} className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 border ${
                    badge === "Top Rated" ? "bg-yellow-50 border-yellow-200 text-yellow-700" :
                    badge === "Fastest Response" ? "bg-blue-50 border-blue-200 text-blue-700" :
                    badge === "Best Value" ? "bg-emerald-50 border-emerald-200 text-emerald-700" :
                    "bg-gray-100 border-gray-200 text-gray-600"
                  }`}>
                    {badge === "Fastest Response" && <Zap className="w-3 h-3" />}
                    {badge === "Top Rated" && <Star className="w-3 h-3 fill-current" />}
                    {badge === "Best Value" && <TrendingDown className="w-3 h-3" />}
                    {badge}
                  </span>
                ))}
              </div>

              {/* Name & firm */}
              <h1 className="opacity-0 animate-slide-up text-4xl sm:text-5xl font-extrabold text-navy-900 tracking-[-0.02em] leading-tight mb-2" style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}>
                {attorney.name}
              </h1>
              <p className="opacity-0 animate-slide-up text-lg text-gray-500 font-medium mb-4" style={{ animationDelay: "0.25s", animationFillMode: "forwards" }}>
                {attorney.firm}
              </p>

              {/* Meta */}
              <div className="opacity-0 animate-slide-up flex flex-wrap gap-4 text-sm text-gray-400 mb-5" style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}>
                {(attorney.city || attorney.state) && (
                  <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" />{[attorney.city, attorney.state].filter(Boolean).join(", ")}</span>
                )}
                {attorney.yearsExperience > 0 && (
                  <span className="flex items-center gap-1.5"><Scale className="w-4 h-4" />{attorney.yearsExperience} yrs experience</span>
                )}
                {attorney.barNumber && (
                  <span className="flex items-center gap-1.5"><Shield className="w-4 h-4 text-emerald-500" />Bar: {attorney.barNumber}</span>
                )}
              </div>

              {/* Bio */}
              {attorney.bio && (
                <p className="opacity-0 animate-slide-up text-gray-500 leading-relaxed text-sm max-w-lg mb-0" style={{ animationDelay: "0.35s", animationFillMode: "forwards" }}>
                  {attorney.bio}
                </p>
              )}

              {/* Stats row */}
              <div className="opacity-0 animate-slide-up flex flex-wrap gap-3 mt-7" style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}>
                <div className="bg-white border border-gray-200 rounded-2xl px-5 py-3 text-center shadow-sm min-w-[80px]">
                  <p className="text-2xl font-extrabold text-navy-900 leading-none">
                    {isHourly ? `$${attorney.hourlyRate}` : `${attorney.feePercent}%`}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-1 font-medium">{isHourly ? "Per Hour" : "Fee"}</p>
                  {!isHourly && savings > 0 && (
                    <p className="text-[10px] text-emerald-600 font-bold mt-0.5">-{savings}% avg</p>
                  )}
                </div>
                {attorney.rating > 0 && (
                  <div className="bg-white border border-gray-200 rounded-2xl px-5 py-3 text-center shadow-sm min-w-[80px]">
                    <div className="flex items-center justify-center gap-1 leading-none">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <p className="text-2xl font-extrabold text-navy-900">{formatRating(attorney.rating)}</p>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1 font-medium">{attorney.reviewCount} reviews</p>
                  </div>
                )}
                <div className="bg-white border border-gray-200 rounded-2xl px-5 py-3 text-center shadow-sm min-w-[80px]">
                  <p className="text-2xl font-extrabold text-navy-900 leading-none">{getResponseLabel(attorney.responseTimeHours)}</p>
                  <p className="text-[10px] text-gray-400 mt-1 font-medium">Response</p>
                </div>
                {winRate !== null && (
                  <div className="bg-white border border-gray-200 rounded-2xl px-5 py-3 text-center shadow-sm min-w-[80px]">
                    <p className="text-2xl font-extrabold text-navy-900 leading-none">{winRate}%</p>
                    <p className="text-[10px] text-gray-400 mt-1 font-medium">Success</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Photo */}
            {attorney.avatar && (
              <div className="opacity-0 animate-slide-up hidden lg:flex lg:col-span-5 justify-end items-end" style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}>
                <div className="relative w-72 h-80 rounded-t-3xl overflow-hidden shadow-[0_8px_40px_rgba(15,48,85,0.15)]">
                  <Image
                    src={attorney.avatar}
                    alt={attorney.name}
                    fill
                    className="object-cover"
                    style={{ objectPosition: attorney.imagePosition ?? "top" }}
                    sizes="288px"
                    priority
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Main content ─────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left: Details */}
          <div ref={mainRef} className="lg:col-span-2 space-y-6">

            {/* Practice areas */}
            {(attorney.practiceAreas.length > 0 || attorney.states.length > 0) && (
              <div className="reveal bg-white rounded-2xl border border-gray-100 p-6 shadow-card">
                {attorney.practiceAreas.length > 0 && (
                  <>
                    <h2 className="font-extrabold text-gray-900 text-lg mb-4">Practice Areas</h2>
                    <div className="flex flex-wrap gap-2 mb-5">
                      {attorney.practiceAreas.map((area) => (
                        <span key={area} className="bg-accent-50 text-accent-600 text-sm px-3 py-1.5 rounded-xl font-semibold border border-accent-100">
                          {area}
                        </span>
                      ))}
                    </div>
                  </>
                )}
                {attorney.states.length > 0 && (
                  <>
                    <h3 className="font-semibold text-gray-500 text-xs uppercase tracking-widest mb-2">Licensed In</h3>
                    <div className="flex flex-wrap gap-2">
                      {attorney.states.map((s) => (
                        <span key={s} className="bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-lg font-medium">
                          {s}
                        </span>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Recent results — only shown if attorney has entered data */}
            {(attorney.recentResult || attorney.casesWon > 0) && (
              <div className="reveal reveal-delay-1 bg-white rounded-2xl border border-gray-100 p-6 shadow-card">
                <h2 className="font-extrabold text-gray-900 text-lg mb-4 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  Case Results
                </h2>
                {attorney.recentResult && (
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
                )}
                {attorney.casesWon > 0 && (
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-gray-50 rounded-xl p-3 text-center">
                      <p className="text-2xl font-extrabold text-gray-900">{attorney.casesWon}</p>
                      <p className="text-xs text-gray-400 mt-0.5 font-medium">Cases Won</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3 text-center">
                      <p className="text-2xl font-extrabold text-gray-900">{attorney.totalCases}</p>
                      <p className="text-xs text-gray-400 mt-0.5 font-medium">Total Cases</p>
                    </div>
                    {winRate !== null && (
                      <div className="bg-gray-50 rounded-xl p-3 text-center">
                        <p className="text-2xl font-extrabold text-accent-500">{winRate}%</p>
                        <p className="text-xs text-gray-400 mt-0.5 font-medium">Success Rate</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Reviews */}
            <div className="reveal reveal-delay-2 bg-white rounded-2xl border border-gray-100 p-6 shadow-card">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-extrabold text-gray-900 text-lg">Client Reviews</h2>
                {attorney.rating > 0 && (
                  <div className="flex items-center gap-1.5">
                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    <span className="text-xl font-extrabold text-gray-900">{formatRating(attorney.rating)}</span>
                    <span className="text-sm text-gray-400 font-medium">({attorney.reviewCount})</span>
                  </div>
                )}
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
              <div className="reveal bg-navy-900 rounded-2xl p-5 relative overflow-hidden">
                <div className="relative">
                  <p className="text-navy-200 text-xs font-semibold uppercase tracking-widest mb-1">
                    {isHourly ? "Hourly Rate" : "Contingency Fee"}
                  </p>
                  {isHourly ? (
                    <>
                      <p className="text-5xl font-extrabold text-white">
                        ${attorney.hourlyRate}<span className="text-2xl text-white/50">/hr</span>
                      </p>
                      {hourlySavings > 0 && attorney.avgHourlyRate && (
                        <>
                          <p className="text-gray-300 text-sm mt-1">{hourlySavings}% below the ${attorney.avgHourlyRate}/hr area average</p>
                          <div className="mt-3 bg-white/10 rounded-xl p-3">
                            <p className="text-gray-300 text-xs">Save per 10 hours vs. avg:</p>
                            <p className="text-2xl font-extrabold text-emerald-400 mt-0.5">
                              ${((attorney.avgHourlyRate - attorney.hourlyRate!) * 10).toLocaleString()}
                            </p>
                          </div>
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      <p className="text-5xl font-extrabold text-white">{attorney.feePercent}%</p>
                      {savings > 0 && (
                        <>
                          <p className="text-gray-300 text-sm mt-1">{savings}% below the {attorney.avgFeePercent}% industry average</p>
                          <div className="mt-3 bg-white/10 rounded-xl p-3">
                            <p className="text-gray-300 text-xs">On a $300K settlement you save:</p>
                            <p className="text-2xl font-extrabold text-emerald-400 mt-0.5">
                              ${(300000 * savings / 100).toLocaleString()}
                            </p>
                          </div>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Consultation CTA */}
              <div className="reveal reveal-delay-1 bg-white rounded-2xl border border-gray-100 p-5 shadow-card">
                <h3 className="font-extrabold text-gray-900 text-base mb-1">Get a Free Case Review</h3>
                <p className="text-xs text-gray-400 mb-4">
                  No obligation · Responds in {getResponseLabel(attorney.responseTimeHours)}
                </p>
                <button
                  type="button"
                  onClick={() => setFunnelOpen(true)}
                  className="w-full bg-navy-900 hover:bg-navy-800 active:bg-navy-700 text-white font-bold py-3.5 rounded-xl transition-colors text-sm"
                >
                  Start Free Consultation
                </button>
                <p className="text-xs text-center text-gray-400 mt-3">Takes 60 seconds · No spam</p>
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

    <LeadFunnel
      attorney={{
        id: attorney.id,
        name: attorney.name,
        practiceAreas: attorney.practiceAreas,
        responseTimeHours: attorney.responseTimeHours,
      }}
      open={funnelOpen}
      onClose={() => setFunnelOpen(false)}
    />
    </>
  );
}
