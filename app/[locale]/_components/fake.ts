import jacket1 from "@/assets/jacket-1.jpeg"; // Thay bằng đường dẫn ảnh thực tế của bạn
import jacket2 from "@/assets/jacket-2.jpeg";
import jacket3 from "@/assets/jacket-3.jpeg";
import jacket4 from "@/assets/jacket-4.jpeg";
import jacket5 from "@/assets/jacket-5.jpeg";
import jacket6 from "@/assets/jacket-6.jpeg";

export const specialVintageProducts = [
  {
    id: 1,
    title: "40s USAAF B-15A Flight Jacket 36",
    price: "110.000 ¥",
    image: jacket1,
    href: "/shop-now/40s-usaaf-b15a",
    isSoldOut: false,
  },
  {
    id: 2,
    title: "40s US NAVY N-1 Deck Jacket 38",
    price: "143.000 ¥",
    image: jacket2,
    href: "/shop-now/40s-us-navy-n1",
    isSoldOut: false,
  },
  {
    id: 3,
    title: "50s USAF L-2A Flight Jacket 36",
    price: "484.000 ¥",
    image: jacket3,
    href: "/shop-now/50s-usaf-l2a",
    isSoldOut: false,
  },
  {
    id: 4,
    title: "50s US NAVY G-1 Flight Jacket 38",
    price: "132.000 ¥",
    image: jacket4,
    href: "/shop-now/50s-us-navy-g1",
    isSoldOut: false,
  },
  {
    id: 5,
    title: "50s Levi's 507XX Denim Jacket 40",
    price: "440.000 ¥",
    image: jacket5,
    href: "/shop-now/50s-levis-507xx",
    isSoldOut: true, // Đã có sẵn nhãn "在庫切れ" (Hết hàng)
  },
  {
    id: 6,
    title: "60s US NAVY A-2 Deck Flight Jacket 38",
    price: "88.000 ¥",
    image: jacket6,
    href: "/shop-now/60s-us-navy-a2",
    isSoldOut: false,
  },
];