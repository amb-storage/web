"use client";

import { useTranslations } from "next-intl";
import ProductCarousel from "@/components/ProductCarousel/ProductCarousel";
import type { Product } from "@/lib/storefront";

interface MostPopularSectionProps {
    products: Product[];
}

export default function MostPopularSection({ products }: MostPopularSectionProps) {
    const t = useTranslations("homepage.mostPopular");

    return (
        <ProductCarousel
            products={products}
            title={t("title")}
            previousLabel={t("previous")}
            nextLabel={t("next")}
            surfaceClassName="bg-white"
        />
    );
}
