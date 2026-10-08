import type { LocalizedText } from "@/lib/storefront/types";

export const collections: Array<{ id: string; name: LocalizedText }> = [
  { id: "special-vintage", name: { ja: "スペシャルヴィンテージ", en: "Special Vintage" } },
  { id: "most-popular", name: { ja: "人気の商品", en: "Most Popular" } },
  { id: "new-arrivals", name: { ja: "新着アイテム", en: "New Arrivals" } },
];
