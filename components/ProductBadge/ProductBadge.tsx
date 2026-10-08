import { cn } from "@/lib/utils";
import type { ProductBadge as ProductBadgeData } from "@/lib/storefront/product-badges";

interface ProductBadgeProps {
  badge: ProductBadgeData;
  className?: string;
}

export default function ProductBadge({ badge, className }: ProductBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] shadow-sm",
        badge.variant === "sold" && "bg-red-600 text-white",
        badge.variant === "brand" && "bg-(--brand-green) text-white",
        badge.variant === "accent" && "bg-white text-(--brand-green) ring-1 ring-(--brand-green)",
        badge.variant === "default" && "bg-white/95 text-gray-700 ring-1 ring-gray-200",
        className,
      )}
    >
      {badge.label}
    </span>
  );
}
