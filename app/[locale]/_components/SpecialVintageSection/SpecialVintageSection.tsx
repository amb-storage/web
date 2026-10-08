"use client";

import { useTranslations } from "next-intl";
import ProductCarousel from "@/components/ProductCarousel/ProductCarousel";
import type { Product } from "@/lib/storefront";

interface SpecialVintageSectionProps {
    title?: string;
    products?: Product[];
}

export default function SpecialVintageSection({
    title,
    products = [],
}: SpecialVintageSectionProps) {
    const t = useTranslations("homepage.hotSection");

    return (
        <ProductCarousel
            products={products}
            title={title ?? t("title")}
            previousLabel={t("previous")}
            nextLabel={t("next")}
            surfaceClassName="bg-white"
        />
    );
}
