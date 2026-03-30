"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpDown, TrendingDown, Star, Trophy } from "lucide-react";
import { ATTORNEYS, Attorney, LEGAL_ISSUES } from "@/lib/data";
import AttorneyCard from "@/components/compare/AttorneyCard";
import { useReveal } from "@/hooks/useInView";

type SortKey = "recommended" | "lowest-fee" | "highest-rating" | "highest-success";

const SPECIALTIES = [
  { value: "", label: "All" },
  ...LEGAL_ISSUES.map(({ value, label }) => ({ value, label })),
];

function mapRow(row: Record<string, unknown>): Attorney {
  return {
    id: row.id as string,
    name: (row.name as string) || "Attorney",
    firm: (row.firm as string) || "",
    avatar: (row.photo_url as string) || "",
    bio: (row.bio as string) || "",
    practiceAreas: (row.practice_areas as string[]) || [],
    states: (row.licensed_states as string[]) || [],
    billingType: ((row.billing_type as string) || "contingency") as Attorney["billingType"],
    feePercent: (row.fee_percent as number) || 33,
    avgFeePercent: 34,
    hourlyRate: (row.hourly_rate as number) || undefined,
    avgHourlyRate: 400,
    flatFee: (row.flat_fee as number) || undefined,
    yearsExperience: (row.years_experience as number) || 0,
    rating: 0,
    reviewCount: 0,
    responseTimeHours: 24,
    casesWon: (row.cases_won as number) || 0,
    totalCases: (row.total_cases as number) || 0,
    recentResult: (row.recent_result as string) || undefined,
    recentResultAmount: (row.recent_result_amount as string) || undefined,
    successRate: 0,
    badges: [],
    phone: (row.phone as string) || undefined,
    website: (row.website as string) || undefined,
  };
}

export default function MarketplaceResults() {
  const [sort, setSort] = useState<SortKey>("recommended");
  const [specialty, setSpecialty] = useState("");
  const [liveAttorneys, setLiveAttorneys] = useState<Attorney[] | null>(null);
  const ref = useReveal();

  useEffect(() => {
    fetch("/api/attorneys")
      .then((r) => r.json())
      .then(({ data }) => {
        if (Array.isArray(data) && data.length > 0) {
          setLiveAttorneys(data.map(mapRow));
        } else {
          setLiveAttorneys([]);
        }
      })
      .catch(() => setLiveAttorneys([]));
  }, []);

  const baseAttorneys = liveAttorneys && liveAttorneys.length > 0 ? liveAttorneys : ATTORNEYS;

  const filtered = useMemo(() => {
    if (!specialty) return baseAttorneys;
    const issue = LEGAL_ISSUES.find((i) => i.value === specialty);
    if (!issue) return baseAttorneys;
    const keyword = issue.label.split(" ")[0].toLowerCase();
    return baseAttorneys.filter((a) =>
      a.practiceAreas.some((p) => p.toLowerCase().includes(keyword))
    );
  }, [baseAttorneys, specialty]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      if (sort === "lowest-fee") return a.feePercent - b.feePercent;
      if (sort === "highest-rating") return b.rating - a.rating;
      if (sort === "highest-success") return b.successRate - a.successRate;
      return 0;
    });
  }, [filtered, sort]);

  const compareHref = specialty ? `/compare?area=${specialty}` : "/compare";

  return (
    <section ref={ref} className="py-24 bg-gray-50" id="compare">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        {/* Header */}
        <div className="reveal text-center mb-8">
          <p className="text-xs text-accent-500 font-semibold uppercase tracking-widest mb-2">Live Marketplace</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">Top Attorneys This Week</h2>
          <p className="text-gray-500 mt-2 text-sm">Filter by specialty, then sort by fee, rating, or success rate.</p>
        </div>

        {/* Filters bar */}
        <div className="reveal mb-8 flex flex-wrap items-center gap-3">
          {/* Specialty dropdown */}
          <select
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            className="text-sm font-semibold px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            {SPECIALTIES.map(({ value, label }) => (
              <option key={value} value={value}>{value === "" ? "All Specialties" : label}</option>
            ))}
          </select>

          <div className="w-px h-6 bg-gray-200" />

          <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
          {(
            [
              { key: "recommended", label: "Recommended", icon: null },
              { key: "lowest-fee", label: "Lowest Fee", icon: TrendingDown },
              { key: "highest-rating", label: "Top Rated", icon: Star },
              { key: "highest-success", label: "Success Rate", icon: Trophy },
            ] as { key: SortKey; label: string; icon: React.ElementType | null }[]
          ).map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setSort(key)}
              className={`text-xs font-semibold px-3.5 py-2 rounded-xl border transition-all duration-200 flex items-center gap-1.5 ${
                sort === key
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
              }`}
            >
              {Icon && <Icon className="w-3 h-3" />}
              {label}
            </button>
          ))}
          <span className="ml-auto text-xs text-gray-400 font-medium">
            {sorted.length} attorney{sorted.length !== 1 ? "s" : ""} matching
          </span>
        </div>

        {/* Cards grid */}
        {sorted.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {sorted.slice(0, 8).map((attorney, i) => (
              <div key={attorney.id}>
                <AttorneyCard attorney={attorney} rank={sort === "recommended" ? i + 1 : undefined} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-gray-400">
            <p className="text-lg font-semibold mb-1">No attorneys found</p>
            <p className="text-sm">Try a different specialty or <Link href="/compare" className="text-blue-500 hover:underline">browse all</Link>.</p>
          </div>
        )}

        {/* View all */}
        <div className="reveal reveal-delay-4 text-center mt-10">
          <Link
            href={compareHref}
            className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-900 font-semibold px-7 py-3.5 rounded-2xl border border-gray-200 hover:border-gray-300 transition-all duration-200 shadow-card hover:shadow-card-hover text-sm"
          >
            See all {specialty ? `${sorted.length}` : `${baseAttorneys.length}+`} attorneys{specialty ? ` in ${SPECIALTIES.find(s => s.value === specialty)?.label}` : ""}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
