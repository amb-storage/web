import type { HomepageCollections } from "@/lib/storefront/types";

export const homepage: HomepageCollections = {
  specialVintage: ["p-001", "p-002", "p-003", "p-004", "p-005", "p-006"],
  mostPopular: ["p-011", "p-001", "p-006", "p-012", "p-004"],
  newArrivals: ["p-007", "p-008", "p-009", "p-010"],
  customerVoices: [
    {
      id: "voice-001",
      name: "大阪府のF様",
      quote: "この度はお取引ありがとうございます。写真以上の非常に良い商品でした。大切にさせていただきます。",
      productId: "p-003",
    },
    {
      id: "voice-002",
      name: "横浜市のD様",
      quote: "終始スムーズなお取引をありがとうございました。手元に届いたお品物は想像以上に素晴らしく、大満足です。",
      productId: "p-006",
    },
    {
      id: "voice-003",
      name: "Texas, B.A様",
      quote: "The jacket was too good to pass up. The shop was kind enough to give me a discount right then and there.",
      productId: "p-005",
    },
  ],
};
