"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { ChevronDown, SlidersHorizontal, X, TrendingDown, Star, ArrowUpDown, Trophy } from "lucide-react";
import { ATTORNEYS, LEGAL_ISSUES, US_STATES, Attorney } from "@/lib/data";
import AttorneyCard from "@/components/compare/AttorneyCard";

type SortKey = "recommended" | "lowest-fee" | "highest-rating" | "fastest-response" | "highest-success";

// Map a raw Supabase attorney row to the Attorney shape used by AttorneyCard
function parseYears(val: unknown): number {
  if (typeof val === "number") return val;
  if (typeof val === "string") {
    const m = val.match(/(\d+)/);
    return m ? parseInt(m[1]) : 0;
  }
  return 0;
}

function mapSupabaseAttorney(row: Record<string, unknown>): Attorney {
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

function ComparePageInner() {
  const searchParams = useSearchParams();

  const [sort, setSort] = useState<SortKey>("recommended");
  const [filterState, setFilterState] = useState(searchParams.get("state") ?? "");
  const [filterArea, setFilterArea] = useState(searchParams.get("area") ?? "");
  const [filterMaxFee, setFilterMaxFee] = useState(searchParams.get("fee") ?? "");
  const [filterMinSuccess, setFilterMinSuccess] = useState("");
  const [filterBilling, setFilterBilling] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const [liveAttorneys, setLiveAttorneys] = useState<Attorney[] | null>(null);
  const [loadingLive, setLoadingLive] = useState(true);

  useEffect(() => {
    fetch("/api/attorneys")
      .then((r) => r.json())
      .then(({ data }) => {
        if (Array.isArray(data) && data.length > 0) {
          setLiveAttorneys(data.map(mapSupabaseAttorney));
        } else {
          setLiveAttorneys([]);
        }
      })
      .catch(() => setLiveAttorneys([]))
      .finally(() => setLoadingLive(false));
  }, []);

  const baseAttorneys = [...ATTORNEYS, ...(liveAttorneys ?? [])];

  const filtered = useMemo(() => {
    return baseAttorneys.filter((a) => {
      if (filterState && !a.states.includes(filterState)) return false;
      if (filterArea) {
        const issue = LEGAL_ISSUES.find((i) => i.value === filterArea);
        if (issue) {
          const keyword = issue.label.split(" ")[0].toLowerCase();
          const matches = a.practiceAreas.some((p) => p.toLowerCase().includes(keyword));
          if (!matches) return false;
        }
      }
      if (filterMaxFee) {
        const max = parseInt(filterMaxFee.replace("under-", ""));
        if (a.feePercent >= max) return false;
      }
      if (filterMinSuccess) {
        const min = parseInt(filterMinSuccess);
        if (a.successRate < min) return false;
      }
      if (filterBilling && a.billingType !== filterBilling) return false;
      return true;
    });
  }, [baseAttorneys, filterState, filterArea, filterMaxFee, filterMinSuccess, filterBilling]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      if (sort === "lowest-fee") return a.feePercent - b.feePercent;
      if (sort === "highest-rating") return b.rating - a.rating;
      if (sort === "fastest-response") return a.responseTimeHours - b.responseTimeHours;
      if (sort === "highest-success") return b.successRate - a.successRate;
      return 0;
    });
  }, [filtered, sort]);

  const areaLabel = LEGAL_ISSUES.find((i) => i.value === filterArea)?.label ?? "";
  const activeFilterCount = [filterState, filterArea, filterMaxFee, filterMinSuccess, filterBilling].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page header */}
      <div className="bg-gray-950 text-white pt-24 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs text-emerald-400 font-semibold uppercase tracking-widest mb-2">Live Marketplace</p>
          <h1 className="text-3xl font-extrabold mb-1">
            {areaLabel ? `${areaLabel} Attorneys` : "Compare Attorneys"}
            {filterState ? ` in ${filterState}` : ""}
          </h1>
          <p className="text-white text-sm">
            {loadingLive ? "Loading attorneys…" : `${sorted.length} attorneys available`} · Sort by fee, rating, success rate, or response time
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Sort + filter bar */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6 flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Sort */}
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Sort:</span>
          </div>
          {(
            [
              { key: "recommended", label: "Recommended", icon: null },
              { key: "lowest-fee", label: "Lowest Fee", icon: TrendingDown },
              { key: "highest-rating", label: "Highest Rated", icon: Star },
              { key: "highest-success", label: "Success Rate", icon: Trophy },
              { key: "fastest-response", label: "Fastest Response", icon: null },
            ] as { key: SortKey; label: string; icon: React.ElementType | null }[]
          ).map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setSort(key)}
              className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${
                sort === key
                  ? "bg-accent-500 text-white border-accent-500"
                  : "bg-white text-gray-600 border-gray-200 hover:border-accent-200"
              }`}
            >
              {Icon && <Icon className="w-3 h-3" />}
              {label}
            </button>
          ))}

          <div className="ml-auto">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 border border-gray-200 hover:border-accent-200 px-3 py-1.5 rounded-lg transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Filters
              {activeFilterCount > 0 && (
                <span className="bg-accent-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center ml-0.5">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Filter panel */}
        {showFilters && (
          <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 text-sm">Filter Results</h3>
              <button onClick={() => setShowFilters(false)}>
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {/* Practice area */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  Specialty / Practice Area
                </label>
                <div className="relative">
                  <select
                    value={filterArea}
                    onChange={(e) => setFilterArea(e.target.value)}
                    className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg px-3 py-2.5 pr-8 focus:outline-none focus:ring-2 focus:ring-accent-500"
                  >
                    <option value="">All Areas</option>
                    {LEGAL_ISSUES.map((i) => (
                      <option key={i.value} value={i.value}>{i.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* State filter */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  State
                </label>
                <div className="relative">
                  <select
                    value={filterState}
                    onChange={(e) => setFilterState(e.target.value)}
                    className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg px-3 py-2.5 pr-8 focus:outline-none focus:ring-2 focus:ring-accent-500"
                  >
                    <option value="">All States</option>
                    {US_STATES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Max fee */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  Max Fee
                </label>
                <div className="relative">
                  <select
                    value={filterMaxFee}
                    onChange={(e) => setFilterMaxFee(e.target.value)}
                    className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg px-3 py-2.5 pr-8 focus:outline-none focus:ring-2 focus:ring-accent-500"
                  >
                    <option value="">Any Fee</option>
                    <option value="under-25">Under 25%</option>
                    <option value="under-28">Under 28%</option>
                    <option value="under-30">Under 30%</option>
                    <option value="under-33">Under 34%</option>
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Min success rate */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  Min. Success Rate
                </label>
                <div className="relative">
                  <select
                    value={filterMinSuccess}
                    onChange={(e) => setFilterMinSuccess(e.target.value)}
                    className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg px-3 py-2.5 pr-8 focus:outline-none focus:ring-2 focus:ring-accent-500"
                  >
                    <option value="">Any Rate</option>
                    <option value="85">85%+</option>
                    <option value="90">90%+</option>
                    <option value="93">93%+</option>
                    <option value="95">95%+</option>
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Billing type */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                  Fee Type
                </label>
                <div className="relative">
                  <select
                    value={filterBilling}
                    onChange={(e) => setFilterBilling(e.target.value)}
                    className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg px-3 py-2.5 pr-8 focus:outline-none focus:ring-2 focus:ring-accent-500"
                  >
                    <option value="">All Types</option>
                    <option value="contingency">Contingency</option>
                    <option value="hourly">Hourly</option>
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {activeFilterCount > 0 && (
              <button
                onClick={() => { setFilterState(""); setFilterArea(""); setFilterMaxFee(""); setFilterMinSuccess(""); setFilterBilling(""); }}
                className="mt-3 text-xs text-red-500 hover:text-red-600 font-medium"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}

        {/* Active filter chips */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {areaLabel && (
              <span className="inline-flex items-center gap-1 bg-accent-100 text-accent-600 text-xs font-medium px-2.5 py-1 rounded-full">
                {areaLabel}
                <button onClick={() => setFilterArea("")}><X className="w-3 h-3" /></button>
              </span>
            )}
            {filterState && (
              <span className="inline-flex items-center gap-1 bg-accent-100 text-accent-600 text-xs font-medium px-2.5 py-1 rounded-full">
                {filterState}
                <button onClick={() => setFilterState("")}><X className="w-3 h-3" /></button>
              </span>
            )}
            {filterMaxFee && (
              <span className="inline-flex items-center gap-1 bg-accent-100 text-accent-600 text-xs font-medium px-2.5 py-1 rounded-full">
                Fee: {filterMaxFee.replace("under-", "< ")}%
                <button onClick={() => setFilterMaxFee("")}><X className="w-3 h-3" /></button>
              </span>
            )}
            {filterMinSuccess && (
              <span className="inline-flex items-center gap-1 bg-accent-100 text-accent-600 text-xs font-medium px-2.5 py-1 rounded-full">
                Success: {filterMinSuccess}%+
                <button onClick={() => setFilterMinSuccess("")}><X className="w-3 h-3" /></button>
              </span>
            )}
            {filterBilling && (
              <span className="inline-flex items-center gap-1 bg-accent-100 text-accent-600 text-xs font-medium px-2.5 py-1 rounded-full">
                {filterBilling === "contingency" ? "Contingency" : "Hourly"}
                <button onClick={() => setFilterBilling("")}><X className="w-3 h-3" /></button>
              </span>
            )}
          </div>
        )}

        {/* Results count */}
        <p className="text-sm text-gray-500 mb-4">
          Showing <strong className="text-gray-900">{sorted.length}</strong> attorneys
        </p>

        {/* Attorney cards grid */}
        {sorted.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {sorted.map((attorney, i) => (
              <AttorneyCard key={attorney.id} attorney={attorney} rank={sort === "recommended" ? i + 1 : undefined} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <p className="text-gray-500 font-medium">No attorneys match your current filters.</p>
            <button
              onClick={() => { setFilterState(""); setFilterArea(""); setFilterMaxFee(""); setFilterMinSuccess(""); setFilterBilling(""); }}
              className="mt-3 text-accent-500 text-sm font-semibold hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Disclaimer */}
        <p className="mt-10 text-xs text-gray-400 leading-relaxed border-t border-gray-100 pt-6">
          Attorney fees and results shown are representative and may vary. Past results do not guarantee future outcomes.
          AttorneyCompete is not a law firm and does not provide legal advice. All attorneys are independently licensed.
        </p>
      </div>
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense>
      <ComparePageInner />
    </Suspense>
  );
}
