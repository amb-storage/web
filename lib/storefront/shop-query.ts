import type { ProductListQuery, ProductSort } from "./types";

type SearchParamValue = string | string[] | undefined;

const SORTS: readonly ProductSort[] = ["newest", "price-low", "price-high"];
// Slug category / size giống normalizePublicSlug của backend (size "40R" → "40r")
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const MAX_SEARCH_LENGTH = 255;
const MAX_PRICE = 2147483647;

function first(value: SearchParamValue) {
    return Array.isArray(value) ? value[0] : value;
}

function toSlug(value: SearchParamValue) {
    const slug = first(value)?.trim().toLowerCase();
    return slug && slug !== "all" && SLUG_PATTERN.test(slug) ? slug : undefined;
}

function toInteger(value: SearchParamValue, max: number) {
    const raw = first(value)?.trim();
    if (!raw || !/^\d+$/.test(raw)) return undefined;
    const number = Number(raw);
    return Number.isSafeInteger(number) && number <= max ? number : undefined;
}

// URL → bộ lọc hợp lệ; giá trị sai thì bỏ qua thay vì để backend trả 400
export function parseShopSearchParams(
    params: Record<string, SearchParamValue>,
): ProductListQuery {
    const search = first(params.search)?.trim().slice(0, MAX_SEARCH_LENGTH) || undefined;
    const sortValue = first(params.sort);
    const sort = SORTS.find((item) => item === sortValue);
    const priceMin = toInteger(params.minPrice, MAX_PRICE);
    let priceMax = toInteger(params.maxPrice, MAX_PRICE);
    if (priceMin !== undefined && priceMax !== undefined && priceMax < priceMin) priceMax = undefined;
    const page = toInteger(params.page, MAX_PRICE);

    return {
        search,
        category: toSlug(params.category),
        size: toSlug(params.size),
        priceMin,
        priceMax,
        sort: sort && sort !== "newest" ? sort : undefined,
        inStock: first(params.inStock) === "1" || undefined,
        page: page && page > 1 ? page : undefined,
    };
}

// Bộ lọc → query string cho URL `/shop` (bỏ giá trị mặc định cho URL gọn)
export function toShopSearch(query: ProductListQuery) {
    const params = new URLSearchParams();
    if (query.search) params.set("search", query.search);
    if (query.category) params.set("category", query.category);
    if (query.size) params.set("size", query.size);
    if (query.priceMin !== undefined) params.set("minPrice", String(query.priceMin));
    if (query.priceMax !== undefined) params.set("maxPrice", String(query.priceMax));
    if (query.sort && query.sort !== "newest") params.set("sort", query.sort);
    if (query.inStock) params.set("inStock", "1");
    if (query.page && query.page > 1) params.set("page", String(query.page));
    const search = params.toString();
    return search ? `?${search}` : "";
}
