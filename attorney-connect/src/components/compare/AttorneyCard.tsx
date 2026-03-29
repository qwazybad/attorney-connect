import Link from "next/link";
import Image from "next/image";
import { Star, Clock, MapPin, TrendingDown, Trophy, ArrowRight, CheckCircle, Zap } from "lucide-react";
import { Attorney, formatRating, getResponseLabel, getSavingsPercent } from "@/lib/data";
import Badge from "@/components/shared/Badge";

interface AttorneyCardProps {
  attorney: Attorney;
  rank?: number;
}

const badgeGradients: Record<string, string> = {
  "Best Value": "from-emerald-500 to-teal-500",
  "Top Rated": "from-yellow-400 to-orange-400",
  "Fastest Response": "from-blue-400 to-accent-500",
  "Most Reviewed": "from-purple-500 to-violet-500",
  "Recommended": "from-accent-500 to-indigo-500",
};

export default function AttorneyCard({ attorney, rank }: AttorneyCardProps) {
  const savings = getSavingsPercent(attorney.feePercent, attorney.avgFeePercent);
  const winRate = Math.round((attorney.casesWon / attorney.totalCases) * 100);
  const primaryBadge = attorney.badges[0];

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 border border-gray-100/80 flex flex-col">
      {/* Image header */}
      <div className="relative h-40 sm:h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
        <Image
          src={attorney.avatar}
          alt={attorney.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          style={{ objectPosition: attorney.imagePosition ?? "top" }}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Rank badge */}
        {rank && rank <= 3 && (
          <div className="absolute top-3 left-3">
            <div className="w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-xs font-extrabold text-gray-700 shadow">
              #{rank}
            </div>
          </div>
        )}

        {/* Primary badge */}
        {primaryBadge && (
          <div className="absolute top-3 right-3">
            <span className={`inline-flex items-center gap-1 bg-gradient-to-r ${badgeGradients[primaryBadge] ?? "from-gray-500 to-gray-600"} text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow`}>
              {primaryBadge === "Fastest Response" && <Zap className="w-2.5 h-2.5" />}
              {primaryBadge === "Top Rated" && <Star className="w-2.5 h-2.5" />}
              {primaryBadge}
            </span>
          </div>
        )}

        {/* Name overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <p className="font-bold text-white text-base leading-tight">{attorney.name}</p>
          <p className="text-white/70 text-xs font-medium">{attorney.firm}</p>
        </div>
      </div>

      {/* Card body */}
      <div className="p-4 flex flex-col flex-1">
        {/* Location + experience */}
        <div className="flex items-center justify-between mb-3 text-xs text-gray-400 font-medium">
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {attorney.city}, {attorney.state}
          </div>
          <span>{attorney.yearsExperience} yrs exp</span>
        </div>

        {/* Key metrics */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {/* Fee */}
          <div className="bg-gray-50 rounded-xl p-2.5 text-center">
            {attorney.billingType === "hourly" ? (
              <>
                <p className="text-lg font-extrabold text-gray-900 leading-none">${attorney.hourlyRate}<span className="text-xs font-semibold">/hr</span></p>
                <p className="text-[10px] text-gray-400 mt-0.5 font-medium">Hourly</p>
              </>
            ) : (
              <>
                <p className="text-xl font-extrabold text-gray-900 leading-none">{attorney.feePercent}%</p>
                <p className="text-[10px] text-gray-400 mt-0.5 font-medium">Fee</p>
                {savings > 0 && (
                  <div className="flex items-center justify-center gap-0.5 text-emerald-600 mt-1">
                    <TrendingDown className="w-2.5 h-2.5" />
                    <span className="text-[10px] font-bold">-{savings}%</span>
                  </div>
                )}
              </>
            )}
          </div>
          {/* Rating */}
          <div className="bg-gray-50 rounded-xl p-2.5 text-center">
            <div className="flex items-center justify-center gap-0.5">
              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
              <p className="text-xl font-extrabold text-gray-900 leading-none">{formatRating(attorney.rating)}</p>
            </div>
            <p className="text-[10px] text-gray-400 mt-0.5 font-medium">{attorney.reviewCount} reviews</p>
          </div>
          {/* Response */}
          <div className="bg-gray-50 rounded-xl p-2.5 text-center">
            <div className="flex items-center justify-center gap-0.5">
              <Clock className="w-3 h-3 text-accent-500" />
              <p className="text-lg font-extrabold text-gray-900 leading-none">{getResponseLabel(attorney.responseTimeHours)}</p>
            </div>
            <p className="text-[10px] text-gray-400 mt-0.5 font-medium">Response</p>
          </div>
        </div>

        {/* Practice areas */}
        <div className="flex flex-wrap gap-1 mb-3">
          {attorney.practiceAreas.slice(0, 2).map((area) => (
            <span key={area} className="text-[10px] bg-accent-50 text-accent-600 px-2 py-0.5 rounded-full font-semibold">{area}</span>
          ))}
          {attorney.practiceAreas.length > 2 && (
            <span className="text-[10px] bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full font-semibold">+{attorney.practiceAreas.length - 2}</span>
          )}
        </div>

        {/* Recent result */}
        <div className="flex items-center gap-2 bg-emerald-50 rounded-xl px-3 py-2 mb-3">
          <Trophy className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span className="text-[11px] text-gray-600 font-medium truncate">{attorney.recentResult}</span>
          {attorney.recentResultAmount && (
            <span className="text-[11px] text-emerald-700 font-extrabold ml-auto shrink-0">{attorney.recentResultAmount}</span>
          )}
        </div>

        {/* Win rate */}
        <div className="flex items-center justify-between text-[11px] text-gray-400 mb-4">
          <div className="flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-accent-400" />
            {winRate}% success rate
          </div>
          <span>{attorney.casesWon} wins</span>
        </div>

        <div className="mt-auto">
          <Link
            href={`/attorney/${attorney.id}`}
            className="flex items-center justify-center gap-2 w-full bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold py-2.5 rounded-xl transition-all duration-200 group/btn"
          >
            View Profile & Connect
            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
          </Link>
          <p className={`text-center text-[11px] font-semibold mt-1.5 ${savings > 0 && attorney.billingType === "contingency" ? "text-emerald-600" : "invisible"}`}>
            {savings > 0 && attorney.billingType === "contingency" ? `Save ${savings}% vs. avg · ~$${(300000 * savings / 100).toLocaleString()} on a $300K case` : "placeholder"}
          </p>
        </div>
      </div>
    </div>
  );
}
