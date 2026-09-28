import jacket1 from "@/assets/jacket-1.jpeg"; // Thay bằng đường dẫn ảnh thực tế của bạn
import jacket2 from "@/assets/jacket-2.jpeg";
import jacket3 from "@/assets/jacket-3.jpeg";
import jacket4 from "@/assets/jacket-4.jpeg";
import jacket5 from "@/assets/jacket-5.jpeg";
import jacket6 from "@/assets/jacket-6.jpeg";
import jacket7 from "@/assets/jacket-7.jpeg";

export const specialVintageProducts = [
  {
    id: 1,
    title: "40s USAAF B-15A Flight Jacket 36",
    price: "110.000 ¥",
    image: jacket1,
    href: "/shop-now/40s-usaaf-b15a",
    stock: "available" as const,
  },
  {
    id: 2,
    title: "40s US NAVY N-1 Deck Jacket 38",
    price: "143.000 ¥",
    image: jacket2,
    href: "/shop-now/40s-us-navy-n1",
    stock: "low" as const,
  },
  {
    id: 3,
    title: "50s USAF L-2A Flight Jacket 36",
    price: "484.000 ¥",
    image: jacket3,
    href: "/shop-now/50s-usaf-l2a",
    stock: "available" as const,
  },
  {
    id: 4,
    title: "50s US NAVY G-1 Flight Jacket 38",
    price: "132.000 ¥",
    image: jacket4,
    href: "/shop-now/50s-us-navy-g1",
    stock: "available" as const,
  },
  {
    id: 5,
    title: "50s Levi's 507XX Denim Jacket 40",
    price: "440.000 ¥",
    image: jacket5,
    href: "/shop-now/50s-levis-507xx",
    stock: "soldOut" as const, // Đã có sẵn nhãn "在庫切れ" (Hết hàng)
  },
  {
    id: 6,
    title: "60s US NAVY A-2 Deck Flight Jacket 38",
    price: "88.000 ¥",
    image: jacket6,
    href: "/shop-now/60s-us-navy-a2",
    stock: "available" as const,
  },
];

export const newArrivalProducts = [
  {
    id: 1,
    title: "70s Levi's Type III Trucker Jacket 38",
    price: "98.000 ¥",
    image: jacket7,
    href: "/shop-now/70s-levis-type3-trucker",
    stock: "available" as const,
  },
  {
    id: 2,
    title: "60s US ARMY M-65 Field Jacket 40",
    price: "155.000 ¥",
    image: jacket4,
    href: "/shop-now/60s-us-army-m65",
    stock: "low" as const,
  },
  {
    id: 3,
    title: "80s Wrangler 11MJ Denim Jacket 36",
    price: "76.000 ¥",
    image: jacket2,
    href: "/shop-now/80s-wrangler-11mj",
    stock: "available" as const,
  },
  {
    id: 4,
    title: "70s USAF CWU-45P Flight Jacket 38",
    price: "210.000 ¥",
    image: jacket1,
    href: "/shop-now/70s-usaf-cwu45p",
    stock: "available" as const,
  },
];

export const mostPopularProducts = [
  {
    id: 1,
    title: "50s Levi's 507XX Denim Jacket 40",
    price: "440.000 ¥",
    image: jacket5,
    href: "/shop-now/50s-levis-507xx-40",
    stock: "available" as const,
  },
  {
    id: 2,
    title: "40s USAAF B-15A Flight Jacket 38",
    price: "118.000 ¥",
    image: jacket1,
    href: "/shop-now/40s-usaaf-b15a-38",
    stock: "low" as const,
  },
  {
    id: 3,
    title: "60s US NAVY A-2 Deck Flight Jacket 40",
    price: "92.000 ¥",
    image: jacket6,
    href: "/shop-now/60s-us-navy-a2-40",
    stock: "available" as const,
  },
  {
    id: 4,
    title: "70s Levi's Type III Trucker Jacket 40",
    price: "104.000 ¥",
    image: jacket7,
    href: "/shop-now/70s-levis-type3-trucker-40",
    stock: "soldOut" as const,
  },
  {
    id: 5,
    title: "50s US NAVY G-1 Flight Jacket 40",
    price: "82.500 ¥",
    image: jacket4,
    href: "/shop-now/50s-us-navy-g1-40",
    stock: "soldOut" as const,
  },
];

export const customerVoices = [
  {
    id: 1,
    name: "大阪府のF様",
    quote:
      "この度はお取引ありがとうございます。こちらの都合に合わせて頂き、迅速な対応に写真以上の非常に良い商品でした。大切にさせていただきます。また機会がありましたらよろしくお願いいします。",
    image: jacket3,
    href: "/shop-now/50s-usaf-l2a",
  },
  {
    id: 2,
    name: "横浜市のD様",
    quote:
      "終始スムーズなお取引をありがとうございました。梱包もとても丁寧で、発送も早く大変助かりました。手元に届いたお品物は想像以上に素晴らしく、大満足です！また機会があればよろしくお願いいたします。",
    image: jacket6,
    href: "/shop-now/60s-us-navy-a2",
  },
  {
    id: 3,
    name: "Texas, B.A様",
    quote:
      "Been following Amb:STORAGE on IG for quite some time, and I finally made it to Osaka to meet up and check out this piece in person. So glad the shop agreed to the meet-up and was patient enough to wait for me for such a long time. The jacket was too good to pass up, and the shop was kind enough to give me a discount right then and there. Highly recommended!",
    image: jacket5,
    href: "/shop-now/50s-levis-507xx",
  },
];
