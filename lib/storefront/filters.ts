import type { Product, ProductQuery } from "./types";

// Chỉ AVAILABLE mới mua được; TEMPORARILY_UNAVAILABLE / SOLD_OUT / UNAVAILABLE đều coi như hết hàng
export function isPurchasable(product: Pick<Product, "availability">) {
    return product.availability === "AVAILABLE";
}

export function filterAndSortProducts(products: readonly Product[], query: ProductQuery = {}) {
    const search = query.search?.trim().toLowerCase();
    const filtered = products.filter((product) => {
        const searchable = [
            product.name,
            product.size ?? "",
            ...product.categories.flatMap((category) => [category.slug, category.label]),
        ]
            .join(" ")
            .toLowerCase();

        return (
            (!search || searchable.includes(search)) &&
            (!query.category ||
                query.category === "all" ||
                product.categories.some((category) => category.slug === query.category)) &&
            (!query.size || query.size === "all" || product.size === query.size) &&
            (query.priceMin === undefined || product.price.amount >= query.priceMin) &&
            (query.priceMax === undefined || product.price.amount <= query.priceMax) &&
            (!query.inStock || isPurchasable(product))
        );
    });

    return [...filtered].sort((a, b) => {
        if (query.sort === "price-low") return a.price.amount - b.price.amount;
        if (query.sort === "price-high") return b.price.amount - a.price.amount;
        return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });
}
