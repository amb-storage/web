import { apiGet, apiGetOrNull } from "@/lib/api/server";
import type {
    ApiAbout,
    ApiCmsPage,
    ApiHome,
    ApiNavigationItem,
    ApiPage,
    ApiPolicyDetail,
    ApiPolicySummary,
    ApiProductDetail,
    ApiProductFacets,
    ApiProductSort,
    ApiProductSummary,
    ApiRichTextAbout,
    ApiRichTextPolicyDetail,
    ApiStoreSettings,
    ApiStoryCard,
    ApiStoryDetail,
} from "@/lib/api/types";
import {
    toHomepage,
    toNavigationItems,
    toProduct,
    toProductDetail,
    toStoreSettings,
    toStory,
    toStoryCard,
} from "./api-mappers";
import { isPurchasable } from "./filters";
import type { StorefrontRepository } from "./repository";
import type { PolicyContent, ProductListQuery, ProductSort } from "./types";

// Backend giới hạn limit tối đa 100/trang
const PAGE_LIMIT = 100;
// Chặn vòng lặp nếu backend trả totalPages bất thường
const MAX_PAGES = 20;
// Số sản phẩm mỗi trang ở /shop
const SHOP_PAGE_SIZE = 24;

const API_PRODUCT_SORT = {
    newest: "newest",
    "price-low": "price_asc",
    "price-high": "price_desc",
} as const satisfies Record<ProductSort, ApiProductSort>;

// Bộ lọc web → query của `GET /products` (category / size gửi dạng mảng slug)
function toApiProductFilters(query: ProductListQuery) {
    return {
        category: query.category ? [query.category] : undefined,
        size: query.size ? [query.size] : undefined,
        q: query.search,
        minPrice: query.priceMin,
        maxPrice: query.priceMax,
        sort: API_PRODUCT_SORT[query.sort ?? "newest"],
    };
}

// Lấy hết các trang của một danh sách phân trang
async function fetchAllPages<T>(
    fetchPage: (page: number) => Promise<ApiPage<T>>,
): Promise<T[]> {
    const first = await fetchPage(1);
    const lastPage = Math.min(first.totalPages, MAX_PAGES);
    if (lastPage <= 1) return first.items;
    const rest = await Promise.all(
        Array.from({ length: lastPage - 1 }, (_, index) => fetchPage(index + 2)),
    );
    return [first, ...rest].flatMap((page) => page.items);
}

// Chỉ dùng ở server component (gọi thẳng API_BASE_URL)
export const storefrontRepository: StorefrontRepository = {
    async getHomepage(locale) {
        const home = await apiGetOrNull<ApiHome>("/home", { locale });
        return home ? toHomepage(home) : null;
    },

    async getAllProducts(locale) {
        const products = await fetchAllPages((page) =>
            apiGet<ApiPage<ApiProductSummary>>("/products", {
                locale,
                query: { sort: "newest", page, limit: PAGE_LIMIT },
                revalidate: 30,
            }),
        );
        return products.map(toProduct);
    },

    async searchProducts(locale, query) {
        const page = query.page ?? 1;
        const filters = toApiProductFilters(query);
        if (!query.inStock) {
            const result = await apiGet<ApiPage<ApiProductSummary>>("/products", {
                locale,
                query: { ...filters, page, limit: SHOP_PAGE_SIZE },
                revalidate: 30,
            });
            return {
                items: result.items.map(toProduct),
                total: result.total,
                page,
                totalPages: result.totalPages,
            };
        }
        // API chưa có filter "còn hàng" → lấy hết theo các bộ lọc khác rồi lọc + chia trang ở web
        const matching = await fetchAllPages((apiPage) =>
            apiGet<ApiPage<ApiProductSummary>>("/products", {
                locale,
                query: { ...filters, page: apiPage, limit: PAGE_LIMIT },
                revalidate: 30,
            }),
        );
        const inStock = matching.map(toProduct).filter(isPurchasable);
        return {
            items: inStock.slice((page - 1) * SHOP_PAGE_SIZE, page * SHOP_PAGE_SIZE),
            total: inStock.length,
            page,
            totalPages: Math.ceil(inStock.length / SHOP_PAGE_SIZE),
        };
    },

    async getProductBySlug(locale, slug) {
        // Slug cũ được backend trả 308 về slug canonical; fetch tự follow redirect
        const product = await apiGetOrNull<ApiProductDetail>(
            `/products/${encodeURIComponent(slug)}`,
            { locale, revalidate: 30 },
        );
        return product ? toProductDetail(product) : null;
    },

    async getProductFacets(locale) {
        return apiGet<ApiProductFacets>("/products/facets", { locale });
    },

    async getStories(locale) {
        const stories = await fetchAllPages((page) =>
            apiGet<ApiPage<ApiStoryCard>>("/stories", {
                locale,
                query: { page, limit: PAGE_LIMIT },
            }),
        );
        return stories.map(toStoryCard);
    },

    async getStoryBySlug(locale, slug) {
        const story = await apiGetOrNull<ApiStoryDetail>(
            `/stories/${encodeURIComponent(slug)}`,
            { locale },
        );
        return story ? toStory(story) : null;
    },

    async getHeaderNavigation(locale) {
        const navigation = await apiGet<{ items: ApiNavigationItem[] }>(
            "/navigation/header",
            { locale },
        );
        return toNavigationItems(navigation.items);
    },

    async getFooterNavigation(locale) {
        const navigation = await apiGet<{ items: ApiNavigationItem[] }>(
            "/navigation/footer",
            { locale },
        );
        return toNavigationItems(navigation.items);
    },

    async getStoreSettings(locale) {
        const settings = await apiGet<ApiStoreSettings>("/settings", { locale });
        return toStoreSettings(settings);
    },

    async getPage(locale, slug) {
        return apiGetOrNull<ApiCmsPage>(`/pages/${encodeURIComponent(slug)}`, { locale });
    },

    async getAbout(locale) {
        return apiGetOrNull<ApiAbout | ApiRichTextAbout>("/content/about", { locale });
    },

    async getPolicies(locale) {
        const { items } = await apiGet<{ items: ApiPolicySummary[] }>(
            "/content/policies",
            { locale },
        );
        const policies = await Promise.all(
            items.map((item) =>
                apiGetOrNull<ApiPolicyDetail | ApiRichTextPolicyDetail>(
                    `/content/policies/${encodeURIComponent(item.slug)}`,
                    { locale },
                ),
            ),
        );
        return policies.flatMap((policy): PolicyContent[] => {
            if (!policy) return [];
            const base = { slug: policy.slug, title: policy.title, effectiveAt: policy.effectiveAt };
            return [
                policy.schemaVersion === 1
                    ? { ...base, kind: "richText", body: policy.body }
                    : { ...base, kind: "sections", sections: policy.sections },
            ];
        });
    },
};
