import { clsx } from "clsx";

type BadgeVariant = "best-value" | "top-rated" | "fastest" | "most-reviewed" | "recommended" | "savings";

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  className?: string;
}

const variantMap: Record<string, BadgeVariant> = {
  "Best Value": "best-value",
  "Top Rated": "top-rated",
  "Fastest Response": "fastest",
  "Most Reviewed": "most-reviewed",
  "Recommended": "recommended",
};

export default function Badge({ label, variant, className }: BadgeProps) {
  const v = variant ?? variantMap[label] ?? "recommended";

  return (
    <span
      className={clsx(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase",
        {
          "bg-emerald-100 text-emerald-700": v === "best-value",
          "bg-yellow-100 text-yellow-700": v === "top-rated",
          "bg-accent-100 text-accent-600": v === "fastest",
          "bg-purple-100 text-purple-700": v === "most-reviewed",
          "bg-gray-100 text-gray-600": v === "recommended",
          "bg-emerald-500 text-white": v === "savings",
        },
        className
      )}
    >
      {label}
    </span>
  );
}
