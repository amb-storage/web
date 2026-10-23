"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Check, SlidersHorizontal, X } from "lucide-react";
import { cn } from "@/lib/utils";
import ProductCard from "@/components/ProductCard/ProductCard";
import { filterAndSortProducts } from "@/lib/storefront";
import type { Product, ProductFacets, ProductSort } from "@/lib/storefront";
import RefineDrawer from "../RefineDrawer/RefineDrawer";
import {
    emptyRefineFilters,
    hasRefineFilters,
    type RefineFilters,
} from "../RefineDrawer/useRefineDrawer";
import SortDropdown from "../SortDropdown/SortDropdown";

interface ShopCatalogProps {
    products: Product[];
    facets: ProductFacets;
    initialSearch: string;
    initialCategory: string;
}

// Ô giá trống hoặc không phải số thì bỏ qua điều kiện đó
function toPrice(value: string) {
    if (value.trim() === "") return undefined;
    const amount = Number(value);
    return Number.isFinite(amount) ? amount : undefined;
}

export default function ShopCatalog({
    products,
    facets,
    initialSearch,
    initialCategory,
}: ShopCatalogProps) {
    const t = useTranslations("shop");
    const tCard = useTranslations("homepage.productCard");
    const [filters, setFilters] = useState<RefineFilters>({
        ...emptyRefineFilters,
        category: initialCategory,
    });
    const [search, setSearch] = useState(initialSearch);
    const [inStock, setInStock] = useState(false);
    const [sort, setSort] = useState<ProductSort>("newest");
    const [isRefineOpen, setIsRefineOpen] = useState(false);
    // Đổi key mỗi lần mở để drawer mount lại với bản nháp = bộ lọc hiện tại
    const [refineKey, setRefineKey] = useState(0);

    // Danh mục / size lấy từ `GET /products/facets` (backend đã tính sẵn theo sản phẩm đang bán)
    const options = useMemo(
        () => ({
            categories: facets.categories.map((category) => ({
                value: category.slug,
                label: category.label.toUpperCase(),
            })),
            // Lọc theo size hiển thị của sản phẩm (vd. "40R"), không theo slug đã lowercase
            sizes: facets.sizes.map((size) => ({ value: size.label, label: size.label })),
        }),
        [facets],
    );

    const visibleProducts = useMemo(
        () =>
            filterAndSortProducts(products, {
                search,
                sort,
                inStock,
                category: filters.category,
                size: filters.size,
                priceMin: toPrice(filters.priceMin),
                priceMax: toPrice(filters.priceMax),
            }),
        [filters, inStock, products, search, sort],
    );

    const openRefine = () => {
        setRefineKey((key) => key + 1);
        setIsRefineOpen(true);
    };

    return (
        <section className="bg-white px-4 py-8 md:px-8 md:py-12">
            <div className="mx-auto max-w-7xl">
                {/* Thanh lọc: In Stock bên trái, nút lọc + sắp xếp bên phải */}
                <div className="flex items-center justify-between gap-4">
                    <div className="flex min-w-0 flex-wrap items-center gap-x-6 gap-y-2">
                        <label className="flex cursor-pointer select-none items-center gap-3 text-xs font-medium leading-4">
                            <input
                                type="checkbox"
                                checked={inStock}
                                onChange={(event) => setInStock(event.target.checked)}
                                className="peer sr-only"
                            />
                            <span
                                aria-hidden
                                className={cn(
                                    "grid h-6 w-6 place-content-center rounded-md transition-colors duration-300 peer-focus-visible:ring-2 peer-focus-visible:ring-black/40",
                                    inStock ? "bg-black text-white" : "bg-black/6 text-[#e2e2e2]",
                                )}
                            >
                                <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                            </span>
                            {t("inStock")}
                        </label>

                        <p className="text-xs font-medium leading-[1.33] text-black/55">
                            {t("itemCount", { count: visibleProducts.length })}
                        </p>

                        {search && (
                            <span className="flex items-center gap-1 rounded-full bg-black/4 py-1 pl-3 pr-1.5 text-xs">
                                “{search}”
                                <button
                                    type="button"
                                    onClick={() => setSearch("")}
                                    aria-label={t("clearSearch")}
                                    className="grid h-5 w-5 place-content-center rounded-full hover:bg-black/6"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </span>
                        )}
                    </div>

                    <div className="flex shrink-0 gap-2">
                        <button
                            type="button"
                            onClick={openRefine}
                            aria-label={t("refine.open")}
                            className="relative grid h-10 w-10 place-content-center rounded-full border border-[#222] transition-colors duration-500 hover:bg-black hover:text-white"
                        >
                            <SlidersHorizontal className="h-3.5 w-3.5" strokeWidth={1.5} />
                            {hasRefineFilters(filters) && (
                                <span
                                    aria-hidden
                                    className="absolute right-0.5 top-0.5 h-2 w-2 rounded-full bg-(--brand-green)"
                                />
                            )}
                        </button>
                        <SortDropdown value={sort} onChange={setSort} />
                    </div>
                </div>

                {visibleProducts.length === 0 ? (
                    <div className="py-20 text-center text-gray-600">
                        {t("empty")}
                    </div>
                ) : (
                    <div className="mt-8 grid grid-cols-1 gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
                        {visibleProducts.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                className="min-w-0 w-full"
                                viewDetailsLabel={tCard("viewDetails")}
                                addToCartLabel={tCard("addToCart")}
                                inCartLabel={tCard("inCart")}
                                soldLabel={tCard("sold")}
                                taxInLabel={tCard("taxIn")}
                            />
                        ))}
                    </div>
                )}
            </div>

            <RefineDrawer
                key={refineKey}
                open={isRefineOpen}
                applied={filters}
                categories={options.categories}
                sizes={options.sizes}
                onClose={() => setIsRefineOpen(false)}
                onApply={setFilters}
            />
        </section>
    );
}
