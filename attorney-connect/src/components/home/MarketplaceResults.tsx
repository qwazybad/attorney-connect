"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpDown, TrendingDown, Star, Trophy } from "lucide-react";
import { ATTORNEYS } from "@/lib/data";
import AttorneyCard from "@/components/compare/AttorneyCard";
import { useReveal } from "@/hooks/useInView";

type SortKey = "recommended" | "lowest-fee" | "highest-rating" | "highest-success";

export default function MarketplaceResults() {
  const [sort, setSort] = useState<SortKey>("recommended");
  const ref = useReveal();

  const sorted = [...ATTORNEYS].sort((a, b) => {
    if (sort === "lowest-fee") return a.feePercent - b.feePercent;
    if (sort === "highest-rating") return b.rating - a.rating;
    if (sort === "highest-success") return b.successRate - a.successRate;
    return 0;
  });

  return (
    <section ref={ref} className="py-24 bg-gray-50" id="compare">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        {/* Header */}
        <div className="reveal flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-6">
          <div>
            <p className="text-xs text-accent-500 font-semibold uppercase tracking-widest mb-2">Live Marketplace</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">Top Attorneys This Week</h2>
            <p className="text-gray-500 mt-2 text-sm">Sorted by our recommendation engine. Change sort to find your best match.</p>
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2 shrink-0">
            <ArrowUpDown className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-400 font-semibold mr-1">Sort:</span>
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
          </div>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {sorted.slice(0, 8).map((attorney, i) => (
            <div key={attorney.id}>
              <AttorneyCard attorney={attorney} rank={sort === "recommended" ? i + 1 : undefined} />
            </div>
          ))}
        </div>

        {/* View all */}
        <div className="reveal reveal-delay-4 text-center mt-10">
          <Link
            href="/compare"
            className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-900 font-semibold px-7 py-3.5 rounded-2xl border border-gray-200 hover:border-gray-300 transition-all duration-200 shadow-card hover:shadow-card-hover text-sm"
          >
            See all {ATTORNEYS.length}+ attorneys
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
