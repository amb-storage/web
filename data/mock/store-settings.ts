import type { StoreSettings } from "@/lib/storefront/types";

export const storeSettings: StoreSettings = {
  storeName: "Amb:STORAGE",
  contactEmail: "theambitionent@gmail.com",
  taxNote: {
    ja: "表示価格はすべて税込です。",
    en: "All prices include tax.",
  },
  socialLinks: [
    { label: "Instagram", href: "https://instagram.com" },
    { label: "TikTok", href: "https://tiktok.com" },
  ],
  shippingReturns: {
    ja: [
      { type: "heading", text: "配送" },
      { type: "list", items: ["商品は丁寧に梱包し、箱に入れてお届けします。", "海外発送の場合、到着までおよそ2〜4週間ほどお時間をいただいております。"] },
      { type: "divider" },
      { type: "heading", text: "返品" },
      { type: "list", items: ["配送中の事故による破損や、当店の手違いによる誤送があった場合は返品を承ります。", "ご不明な点があれば、メールまたはInstagramのDMよりお気軽にお問い合わせください。"] },
    ],
    en: [
      { type: "heading", text: "Shipping" },
      { type: "list", items: ["Every order is carefully packed and shipped in a box.", "International orders typically take about 2-4 weeks to arrive."] },
      { type: "divider" },
      { type: "heading", text: "Returns" },
      { type: "list", items: ["We accept returns if an item arrives damaged in transit or if we shipped the wrong item by mistake.", "Questions are always welcome - reach out by email or Instagram DM."] },
    ],
  },
};
