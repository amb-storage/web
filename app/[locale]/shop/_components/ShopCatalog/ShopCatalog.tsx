"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import ProductCard from "@/components/ProductCard/ProductCard";
import { filterAndSortProducts } from "@/lib/storefront";
import type { Product, ProductQuery, ProductSort } from "@/lib/storefront";

interface ShopCatalogProps {
    products: Product[];
    initialSearch: string;
    initialCategory: string;
}

const initialFilters = {
    category: "all",
    period: "all",
    price: "all",
    size: "all",
};

export default function ShopCatalog({
    products,
    initialSearch,
    initialCategory,
}: ShopCatalogProps) {
    const t = useTranslations("shop");
    const tCard = useTranslations("homepage.productCard");
    const [filters, setFilters] = useState({
        ...initialFilters,
        category: initialCategory,
    });
    const [search, setSearch] = useState(initialSearch);
    const [sort, setSort] = useState<ProductSort>("newest");

    const options = useMemo(
        () => ({
            categories: [
                ...new Set(products.map((product) => product.category)),
            ],
            periods: [
                ...new Set(products.map((product) => product.period)),
            ].sort(),
            sizes: [...new Set(products.map((product) => product.size))].sort(),
        }),
        [products],
    );

    const visibleProducts = useMemo(() => {
        const query: ProductQuery = { ...filters, search, sort };
        return filterAndSortProducts(products, query);
    }, [filters, products, search, sort]);

    const setFilter = (key: keyof typeof filters, value: string) => {
        setFilters((current) => ({ ...current, [key]: value }));
    };

    const clearFilters = () => {
        setFilters(initialFilters);
        setSearch("");
        setSort("newest");
    };

    return (
        <section className="bg-(--surface-muted) px-4 py-8 md:px-8 md:py-12">
            <div className="mx-auto max-w-7xl">
                <div className="flex flex-col gap-4 border-b border-gray-200 pb-6 lg:flex-row lg:items-end lg:justify-between">
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                        <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                            {t("filters.category")}
                            <select
                                value={filters.category}
                                onChange={(event) =>
                                    setFilter("category", event.target.value)
                                }
                                className="mt-2 block w-full rounded border border-gray-200 bg-white px-3 py-2.5 text-sm font-normal normal-case tracking-normal text-gray-800 outline-none focus:border-(--brand-green)"
                            >
                                <option value="all">{t("all")}</option>
                                {options.categories.map((category) => (
                                    <option key={category} value={category}>
                                        {t(`categories.${category}`)}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                            {t("filters.periods")}
                            <select
                                value={filters.period}
                                onChange={(event) =>
                                    setFilter("period", event.target.value)
                                }
                                className="mt-2 block w-full rounded border border-gray-200 bg-white px-3 py-2.5 text-sm font-normal normal-case tracking-normal text-gray-800 outline-none focus:border-(--brand-green)"
                            >
                                <option value="all">{t("all")}</option>
                                {options.periods.map((period) => (
                                    <option key={period} value={period}>
                                        {period}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                            {t("filters.prices")}
                            <select
                                value={filters.price}
                                onChange={(event) =>
                                    setFilter("price", event.target.value)
                                }
                                className="mt-2 block w-full rounded border border-gray-200 bg-white px-3 py-2.5 text-sm font-normal normal-case tracking-normal text-gray-800 outline-none focus:border-(--brand-green)"
                            >
                                <option value="all">{t("all")}</option>
                                <option value="under-100000">
                                    {t("priceRanges.under")}
                                </option>
                                <option value="100000-200000">
                                    {t("priceRanges.middle")}
                                </option>
                                <option value="over-200000">
                                    {t("priceRanges.over")}
                                </option>
                            </select>
                        </label>
                        <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                            {t("filters.size")}
                            <select
                                value={filters.size}
                                onChange={(event) =>
                                    setFilter("size", event.target.value)
                                }
                                className="mt-2 block w-full rounded border border-gray-200 bg-white px-3 py-2.5 text-sm font-normal normal-case tracking-normal text-gray-800 outline-none focus:border-(--brand-green)"
                            >
                                <option value="all">{t("all")}</option>
                                {options.sizes.map((size) => (
                                    <option key={size} value={size}>
                                        {size}
                                    </option>
                                ))}
                            </select>
                        </label>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <label className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                            {t("sort.label")}
                            <select
                                value={sort}
                                onChange={(event) =>
                                    setSort(event.target.value as ProductSort)
                                }
                                className="ml-2 rounded border border-gray-200 bg-white px-3 py-2.5 text-sm font-normal normal-case tracking-normal text-gray-800 outline-none focus:border-(--brand-green)"
                            >
                                <option value="newest">
                                    {t("sort.newest")}
                                </option>
                                <option value="price-low">
                                    {t("sort.priceLow")}
                                </option>
                                <option value="price-high">
                                    {t("sort.priceHigh")}
                                </option>
                            </select>
                        </label>
                        <button
                            type="button"
                            onClick={clearFilters}
                            className="text-sm font-semibold text-(--brand-green) underline underline-offset-4"
                        >
                            {t("clear")}
                        </button>
                    </div>
                </div>

                <div className="mt-5 flex gap-3">
                    <label htmlFor="catalog-search" className="sr-only">
                        {t("search")}
                    </label>
                    <input
                        id="catalog-search"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder={t("searchPlaceholder")}
                        className="min-w-0 flex-1 rounded border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-(--brand-green)"
                    />
                    <span className="self-center text-sm text-gray-500">
                        {visibleProducts.length} / {products.length}
                    </span>
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
        </section>
    );
}
