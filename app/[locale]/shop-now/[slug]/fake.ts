import type { StaticImageData } from "next/image";
import jacket4 from "@/assets/jacket-4.jpeg";

export type DescriptionBlock =
  | { type: "heading"; text: string }
  | { type: "list"; items: string[] }
  | { type: "paragraph"; text: string }
  | { type: "divider" };

export interface ProductDetail {
  slug: string;
  title: string;
  price: string;
  images: StaticImageData[];
  stock: "available" | "low" | "soldOut";
  descriptionBlocks: Record<"ja" | "en", DescriptionBlock[]>;
}

// Mock chi tiết sản phẩm - hiện chỉ có 1 sản phẩm mẫu (khớp slug với mostPopularProducts trong
// _components/fake.ts). Thêm sản phẩm mới vào đây khi cần trang detail thật cho slug đó.
export const productDetails: ProductDetail[] = [
  {
    slug: "50s-us-navy-g1-40",
    title: "50s US NAVY G-1 Flight Jacket 40",
    price: "82.500 ¥",
    images: [jacket4, jacket4, jacket4, jacket4],
    stock: "soldOut",
    descriptionBlocks: {
      ja: [
        { type: "heading", text: "商品詳細" },
        {
          type: "list",
          items: [
            "ビッグサイズ",
            "ネームパッチ付き",
            "MIL-J-7823 / Cagleco Sportswear製",
            "袖リブなし",
          ],
        },
        { type: "divider" },
        {
          type: "paragraph",
          text: "撮影時の照明環境により、実際の色味と多少異なる場合がございます。",
        },
        { type: "divider" },
        { type: "heading", text: "サイズ：40" },
        {
          type: "list",
          items: [
            "肩幅：約46cm",
            "身幅：約55cm",
            "袖丈：約55cm",
            "前丈：約67cm",
            "後丈：約64cm",
          ],
        },
        { type: "paragraph", text: "※実寸のため多少の誤差はご了承ください。" },
        {
          type: "paragraph",
          text: "身長165〜175cm前後の方であれば、中にTシャツやシャツを重ね着してもゆとりのあるサイズ感です。",
        },
        { type: "divider" },
        { type: "heading", text: "コンディション" },
        { type: "list", items: ["USED（中古）"] },
        {
          type: "paragraph",
          text: "※状態の判定は当店独自の基準によるものです。ご了承の上ご注文ください。",
        },
        { type: "divider" },
        {
          type: "paragraph",
          text: "全国送料無料／ご注文から1〜2日以内に発送いたします。",
        },
      ],
      en: [
        { type: "heading", text: "Product Details" },
        {
          type: "list",
          items: [
            "Oversized fit",
            "Name patch included",
            "MIL-J-7823 spec, made by Cagleco Sportswear",
            "No rib cuffs",
          ],
        },
        { type: "divider" },
        {
          type: "paragraph",
          text: "Actual colors may vary slightly from the photos depending on lighting.",
        },
        { type: "divider" },
        { type: "heading", text: "Size: 40" },
        {
          type: "list",
          items: [
            "Shoulder: approx. 46cm",
            "Chest width: approx. 55cm",
            "Sleeve length: approx. 55cm",
            "Front length: approx. 67cm",
            "Back length: approx. 64cm",
          ],
        },
        {
          type: "paragraph",
          text: "Measurements are hand-taken, so please allow for small variances.",
        },
        {
          type: "paragraph",
          text: "Comfortably fits most people around 165-175cm, with room to layer a T-shirt or shirt underneath.",
        },
        { type: "divider" },
        { type: "heading", text: "Condition" },
        { type: "list", items: ["Used"] },
        {
          type: "paragraph",
          text: "Condition is graded using our own in-house standard - please keep this in mind before ordering.",
        },
        { type: "divider" },
        {
          type: "paragraph",
          text: "Free shipping nationwide. Ships within 1-2 business days of order.",
        },
      ],
    },
  },
];

export function getProductDetail(slug: string) {
  return productDetails.find((product) => product.slug === slug);
}

// Chính sách vận chuyển/đổi trả - áp dụng chung cho mọi sản phẩm, không phải nội dung riêng
// từng item nên để tách khỏi productDetails.
export const shippingReturnsBlocks: Record<"ja" | "en", DescriptionBlock[]> = {
  ja: [
    { type: "heading", text: "配送" },
    {
      type: "list",
      items: [
        "商品は丁寧に梱包し、箱に入れてお届けします。",
        "配送にかかる日数は商品ごとに異なりますので、商品ページの説明をご確認ください（国内配送の場合）。",
        "海外発送の場合、到着までおよそ2〜4週間ほどお時間をいただいております。",
      ],
    },
    { type: "divider" },
    { type: "heading", text: "返品" },
    {
      type: "list",
      items: [
        "配送中の事故による破損や、当店の手違いによる誤送があった場合は返品を承ります。",
        "ご注文内容の誤りやお客様都合による破損については、返品をお受けできません。",
        "ご不明な点があれば、メールまたはInstagramのDMよりお気軽にお問い合わせください。",
      ],
    },
  ],
  en: [
    { type: "heading", text: "Shipping" },
    {
      type: "list",
      items: [
        "Every order is carefully packed and shipped in a box.",
        "Delivery times vary by item - check the product page for details (domestic shipping only).",
        "International orders typically take about 2-4 weeks to arrive.",
      ],
    },
    { type: "divider" },
    { type: "heading", text: "Returns" },
    {
      type: "list",
      items: [
        "We accept returns if an item arrives damaged in transit or if we shipped the wrong item by mistake.",
        "We're unable to accept returns for order mistakes or damage that happens after delivery on the customer's end.",
        "Questions are always welcome - reach out by email or Instagram DM.",
      ],
    },
  ],
};
