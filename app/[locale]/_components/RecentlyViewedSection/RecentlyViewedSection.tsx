"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import ProductCarousel from "@/components/ProductCarousel/ProductCarousel";
import type { Product } from "@/lib/storefront";
import {
    RECENTLY_VIEWED_EVENT,
    readRecentlyViewedIds,
} from "./RecentlyViewedTracker";

export default function RecentlyViewedSection({ products }: { products: Product[] }) {
    const t = useTranslations("homepage.recentlyViewed");
    const [viewedIds, setViewedIds] = useState<string[]>([]);
    const viewedProducts = viewedIds
        .map((id) => products.find((product) => product.id === id))
        .filter((product): product is Product => Boolean(product));

    useEffect(() => {
        const update = () => setViewedIds(readRecentlyViewedIds());
        update();
        window.addEventListener("storage", update);
        window.addEventListener(RECENTLY_VIEWED_EVENT, update);
        return () => {
            window.removeEventListener("storage", update);
            window.removeEventListener(RECENTLY_VIEWED_EVENT, update);
        };
    }, []);

    if (viewedProducts.length === 0) return null;

    return (
        <ProductCarousel
            products={viewedProducts}
            title={t("title")}
            previousLabel={t("previous")}
            nextLabel={t("next")}
            surfaceClassName="bg-(--surface-muted)"
        />
    );
}
