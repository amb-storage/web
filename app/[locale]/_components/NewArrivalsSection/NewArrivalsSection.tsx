"use client";

import { useTranslations } from "next-intl";
import ProductCarousel from "@/components/ProductCarousel/ProductCarousel";
import type { Product } from "@/lib/storefront";

interface NewArrivalsSectionProps {
    products: Product[];
}

export default function NewArrivalsSection({ products }: NewArrivalsSectionProps) {
    const t = useTranslations("homepage.newArrivals");

    return (
        <ProductCarousel
            products={products}
            title={t("title")}
            previousLabel={t("previous")}
            nextLabel={t("next")}
            surfaceClassName="bg-(--surface-muted)"
        />
    );
}
