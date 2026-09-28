"use client";

import { StaticImageData } from "next/image";
import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "@/components/ProductCard/ProductCard";
import { useCarousel } from "@/hooks/use-carousel";

interface RelatedProduct {
  id: string | number;
  title: string;
  price: string;
  image: string | StaticImageData;
  href: string;
  stock?: "available" | "low" | "soldOut";
}

interface RelatedProductsProps {
  title: string;
  products: RelatedProduct[];
}

export default function RelatedProducts({ title, products }: RelatedProductsProps) {
  const t = useTranslations("productDetail");
  const tCard = useTranslations("homepage.productCard");
  const { sliderRef, canScrollLeft, canScrollRight, scroll, resetAllHovers } =
    useCarousel(products.length);

  if (products.length === 0) return null;

  return (
    <section className="w-full border-t border-gray-100 py-12">
      <div className="flex items-center justify-between pb-6">
        <h2 className="text-xl font-bold text-[#1B3B2B] md:text-2xl">{title}</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className="rounded-full border border-gray-200 p-2.5 transition-all duration-300 hover:border-black hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:pointer-events-none disabled:opacity-30"
            aria-label={t("previous")}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className="rounded-full border border-gray-200 p-2.5 transition-all duration-300 hover:border-black hover:bg-black hover:text-white disabled:cursor-not-allowed disabled:pointer-events-none disabled:opacity-30"
            aria-label={t("next")}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div
        ref={sliderRef}
        onScroll={resetAllHovers}
        onMouseLeave={resetAllHovers}
        className="no-scrollbar flex gap-6 overflow-x-auto scroll-smooth pb-2 pt-2"
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
    </section>
  );
}
