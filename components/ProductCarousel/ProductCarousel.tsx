"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import ProductCard from "@/components/ProductCard/ProductCard";
import { useCarousel } from "@/hooks/useCarousel";
import type { Product } from "@/lib/storefront";
import { cn } from "@/lib/utils";

export interface ProductCarouselProps {
    products: Product[];
    title: string;
    previousLabel: string;
    nextLabel: string;
    surfaceClassName?: string;
}

export default function ProductCarousel({
    products,
    title,
    previousLabel,
    nextLabel,
    surfaceClassName = "bg-white",
}: ProductCarouselProps) {
    const tCard = useTranslations("homepage.productCard");
    const { sliderRef, canScrollLeft, canScrollRight, scroll, resetAllHovers } =
        useCarousel(products.length);

    return (
        <section
            className={cn(
                "w-full min-w-0 max-w-full select-none py-2 md:py-7",
                surfaceClassName,
            )}
        >
            <div className="min-w-0 max-w-full space-y-4 px-3 md:px-10">
                <div className="flex items-center justify-between border-b border-gray-100 px-3 pb-1.5 md:px-10 md:pb-4">
                    <h2 className="text-2xl font-bold tracking-tight text-(--brand-green) md:text-3xl">
                        {title}
                    </h2>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => scroll("left")}
                            disabled={!canScrollLeft}
                            className="rounded-full border border-gray-200 p-2.5 transition-all duration-300 hover:border-black hover:bg-black hover:text-white disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-30"
                            aria-label={previousLabel}
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                            type="button"
                            onClick={() => scroll("right")}
                            disabled={!canScrollRight}
                            className="rounded-full border border-gray-200 p-2.5 transition-all duration-300 hover:border-black hover:bg-black hover:text-white disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-30"
                            aria-label={nextLabel}
                        >
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                <div
                    ref={sliderRef}
                    onScroll={resetAllHovers}
                    onMouseLeave={resetAllHovers}
                    className="flex min-w-0 max-w-full gap-[2.5vw] overflow-x-auto pb-4 pt-2 no-scrollbar scroll-smooth md:pb-8"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                    {products.map((product) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            viewDetailsLabel={tCard("viewDetails")}
                            addToCartLabel={tCard("addToCart")}
                            inCartLabel={tCard("inCart")}
                            soldLabel={tCard("sold")}
                            taxInLabel={tCard("taxIn")}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
