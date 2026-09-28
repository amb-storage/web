"use client";

import { useTranslations } from "next-intl";
import { StaticImageData } from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "@/components/ProductCard/ProductCard";
import { useCarousel } from "@/hooks/use-carousel";

interface ProductItem {
  id: string | number;
  title: string;
  price: string;
  image: string | StaticImageData;
  href: string;
  stock?: "available" | "low" | "soldOut";
}

interface CarouselProps {
  title?: string;
  products?: ProductItem[];
}

export default function SpecialVintageCarousel({
  title,
  products = [],
}: CarouselProps) {
  const t = useTranslations("homepage.hotSection");
  const tCard = useTranslations("homepage.productCard");
  const { sliderRef, canScrollLeft, canScrollRight, scroll, resetAllHovers } =
    useCarousel(products.length);

  return (
    <section className="w-full py-12 bg-white select-none">
      <div className=" mx-auto md:px-20">
        {/* Header của Section & Nút điều hướng */}
        <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-4">
          <h2 className="text-2xl md:text-3xl font-bold text-[#1B3B2B] tracking-tight">
            {title ?? t("title")}
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className="p-2.5 rounded-full border border-gray-200 hover:bg-black hover:text-white hover:border-black transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed disabled:pointer-events-none"
              aria-label={t("previous")}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className="p-2.5 rounded-full border border-gray-200 hover:bg-black hover:text-white hover:border-black transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed disabled:pointer-events-none"
              aria-label={t("next")}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Khung chứa Carousel trượt ngang */}
        <div
          ref={sliderRef}
          onScroll={resetAllHovers}
          onMouseLeave={resetAllHovers}
          className="flex gap-6 overflow-x-auto no-scrollbar scroll-smooth pb-8 pt-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {products.map((product) => (
            <ProductCard
              key={product.id}
              title={product.title}
              price={product.price}
              image={product.image}
              href={product.href}
              stock={product.stock}
              stockLabel={tCard(product.stock === "low" ? "lowStock" : "soldOut")}
              viewDetailsLabel={tCard("viewDetails")}
              addToCartLabel={tCard("addToCart")}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
