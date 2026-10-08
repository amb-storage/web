import type { Locale, Product } from "./types";

export interface ProductBadge {
  id: string;
  label: string;
  variant: "default" | "accent" | "brand" | "sold";
}

export function getProductBadges(product: Product, locale: Locale): ProductBadge[] {
  return [
    ...(product.availability === "SOLD_OUT"
      ? [{ id: "availability-sold", label: "SOLD", variant: "sold" as const }]
      : []),
    ...product.tags.slice(0, 2).map((tag) => ({
      id: tag.id,
      label: tag.label[locale],
      variant: tag.variant ?? "default",
    })),
  ];
}
