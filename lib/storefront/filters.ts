import type { Product, ProductQuery } from "./types";

function matchesPrice(product: Product, range?: string) {
  if (!range || range === "all") return true;
  if (range === "under-100000") return product.price.amount < 100000;
  if (range === "100000-200000") {
    return product.price.amount >= 100000 && product.price.amount <= 200000;
  }
  if (range === "over-200000") return product.price.amount > 200000;
  return true;
}

export function filterAndSortProducts(products: readonly Product[], query: ProductQuery = {}) {
  const search = query.search?.trim().toLowerCase();
  const filtered = products.filter((product) => {
    const searchable = [
      product.name.en,
      product.name.ja,
      product.category,
      product.period,
      product.size,
    ]
      .join(" ")
      .toLowerCase();

    return (
      (!search || searchable.includes(search)) &&
      (!query.category || query.category === "all" || product.category === query.category) &&
      (!query.period || query.period === "all" || product.period === query.period) &&
      (!query.size || query.size === "all" || product.size === query.size) &&
      matchesPrice(product, query.price)
    );
  });

  return [...filtered].sort((a, b) => {
    if (query.sort === "price-low") return a.price.amount - b.price.amount;
    if (query.sort === "price-high") return b.price.amount - a.price.amount;
    return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
  });
}
