"use client";

import React, { useRef } from "react";
import { useTranslations } from "next-intl";
import Image, { StaticImageData } from "next/image";
import { Link } from "@/i18n/navigation";
import gsap from "gsap";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProductItem {
  id: string | number;
  title: string;
  price: string;
  image: string | StaticImageData;
  href: string;
  isSoldOut?: boolean;
}

interface CarouselProps {
  title?: string;
  products?: ProductItem[];
}

export default function SpecialVintageCarousel({
  title,
  products,
}: CarouselProps) {
  const t = useTranslations("homepage.hotSection");
  const sliderRef = useRef<HTMLDivElement>(null);

  // Xử lý nút bấm trượt Carousel sang trái/phải
  const scroll = (direction: "left" | "right") => {
    const slider = sliderRef.current;
    if (!slider) return;

    const scrollAmount = direction === "left" ? -350 : 350;
    slider.scrollBy({
      left: scrollAmount,
      behavior: "smooth",
    });
  };

  // Animation Hover cực "quao" với GSAP (Không dùng shadow thô, dùng scale & dịch chuyển tinh tế)
  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const img = card.querySelector(".product-img");
    const quickBtn = card.querySelector(".quick-shop-btn");
    const info = card.querySelector(".product-info");

    // Ảnh phóng to & bay bổng lên trên
    if (img) {
      gsap.to(img, { 
        scale: 1.08, 
        y: -10, 
        duration: 0.5, 
        ease: "power3.out" 
      });
    }
    
    // Nút Quick Shop trượt từ dưới lên mượt mà có độ nảy nhẹ
    if (quickBtn) {
      gsap.to(quickBtn, { 
        opacity: 1, 
        y: 0, 
        duration: 0.4, 
        ease: "back.out(1.5)" 
      });
    }

    // Phần text nhấc nhẹ theo
    if (info) {
      gsap.to(info, { 
        y: -2, 
        duration: 0.3, 
        ease: "power2.out" 
      });
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const img = card.querySelector(".product-img");
    const quickBtn = card.querySelector(".quick-shop-btn");
    const info = card.querySelector(".product-info");

    if (img) {
      gsap.to(img, { 
        scale: 1, 
        y: 0, 
        duration: 0.5, 
        ease: "power3.out" 
      });
    }

    if (quickBtn) {
      gsap.to(quickBtn, { 
        opacity: 0, 
        y: 15, 
        duration: 0.3, 
        ease: "power2.in" 
      });
    }

    if (info) {
      gsap.to(info, { 
        y: 0, 
        duration: 0.3, 
        ease: "power2.out" 
      });
    }
  };

  return (
    <section className="w-full py-12 bg-white select-none">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header của Section & Nút điều hướng */}
        <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-4">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1B3B2B] tracking-tight">
            {title ?? t("title")}
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll("left")}
              className="p-2.5 rounded-full border border-gray-200 hover:bg-black hover:text-white hover:border-black transition-all duration-300"
              aria-label={t("previous")}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="p-2.5 rounded-full border border-gray-200 hover:bg-black hover:text-white hover:border-black transition-all duration-300"
              aria-label={t("next")}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Khung chứa Carousel trượt ngang */}
        <div
          ref={sliderRef}
          className="flex gap-6 overflow-x-auto no-scrollbar scroll-smooth pb-8 pt-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {products?.map((product) => (
            <div
              key={product.id}
              className="min-w-[260px] md:min-w-[280px] flex-shrink-0 cursor-pointer group"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <Link href={product.href} className="block">
                {/* Khung ảnh sản phẩm: Trong suốt hoàn toàn, không shadow, nằm trọn trên nền trắng */}
                <div className="relative h-[360px] flex items-center justify-center p-4">
                  {/* Badge "在庫切れ" (Hết hàng) */}
                  {product.isSoldOut && (
                    <span className="absolute top-2 left-2 z-20 bg-red-600 text-white text-xs font-semibold px-2.5 py-1 rounded">
                      {t("soldOut")}
                    </span>
                  )}

                  {/* Ảnh sản phẩm tách nền */}
                  <div className="w-full h-full relative">
                    <Image
                      src={product.image}
                      alt={product.title}
                      fill
                      className="product-img object-contain transition-transform"
                    />
                  </div>

                  {/* Nút Quick Shop (クイックショップ) chạy hiệu ứng GSAP trượt lên */}
                  <div className="quick-shop-btn absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 translate-y-6 z-20 w-[85%]">
                    <button className="w-full bg-[#1B3B2B] hover:bg-[#12271d] text-white text-sm font-medium py-3 rounded-md shadow-xl transition-colors tracking-wide">
                      {t("quickShop")}
                    </button>
                  </div>
                </div>

                {/* Thông tin sản phẩm (Tiêu đề & Giá) */}
                <div className="product-info mt-3 px-1">
                  <h3 className="text-sm font-normal text-gray-700 line-clamp-2 min-h-[40px] group-hover:text-black transition-colors">
                    {product.title}
                  </h3>
                  <p className="mt-1.5 font-bold text-gray-900 text-base">
                    {product.price}
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}