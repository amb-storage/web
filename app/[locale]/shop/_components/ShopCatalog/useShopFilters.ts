"use client";

import { useTransition } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { toShopSearch, type ProductListQuery } from "@/lib/storefront";
import type { RefineFilters } from "../RefineDrawer/useRefineDrawer";

// Ô giá trống hoặc không phải số nguyên thì bỏ qua điều kiện đó
function toPrice(value: string) {
    const trimmed = value.trim();
    return /^\d+$/.test(trimmed) ? Number(trimmed) : undefined;
}

// Bộ lọc nằm trên URL: đổi filter = điều hướng tới `/shop?...`, server gọi `GET /products` theo URL đó
export function useShopFilters(query: ProductListQuery) {
    const router = useRouter();
    const pathname = usePathname();
    const [isPending, startTransition] = useTransition();

    // Đổi bộ lọc thì quay về trang 1
    const update = (patch: Partial<ProductListQuery>) => {
        const next = { ...query, ...patch, page: undefined };
        startTransition(() => {
            router.push(`${pathname}${toShopSearch(next)}`, { scroll: false });
        });
    };

    const refineFilters: RefineFilters = {
        category: query.category ?? "all",
        size: query.size ?? "all",
        priceMin: query.priceMin === undefined ? "" : String(query.priceMin),
        priceMax: query.priceMax === undefined ? "" : String(query.priceMax),
    };

    const applyRefine = (filters: RefineFilters) =>
        update({
            category: filters.category === "all" ? undefined : filters.category,
            size: filters.size === "all" ? undefined : filters.size,
            priceMin: toPrice(filters.priceMin),
            priceMax: toPrice(filters.priceMax),
        });

    return {
        isPending,
        refineFilters,
        applyRefine,
        setSort: (sort: ProductListQuery["sort"]) => update({ sort }),
        setInStock: (inStock: boolean) => update({ inStock: inStock || undefined }),
        clearSearch: () => update({ search: undefined }),
    };
}
