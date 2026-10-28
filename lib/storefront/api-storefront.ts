import { ApiError, apiGet, apiGetOrNull } from "@/lib/api/server";
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
    ApiStoreSettings,
    ApiStoriesLanding,
    ApiStoryCard,
    ApiStoryDetail,
} from "@/lib/api/types";
import {
    toHomepage,
    toNavigationItems,
    toProduct,
    toProductDetail,
    toStoreSettings,
    toStoriesLanding,
    toStory,
    toStoryCard,
} from "./api-mappers";
import { isPurchasable } from "./filters";
import type { StorefrontRepository } from "./repository";
import type { ProductListQuery, ProductSort } from "./types";

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
    popular: "popular",
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

// Đồ vintage thường chỉ có 1 cái: tình trạng còn hàng phải luôn mới, nên dữ liệu sản phẩm
// không dùng cache fetch của Next (0 = không cache). Nội dung CMS / menu / settings vẫn cache 60s.
const LIVE_STOCK = 0;

// Chỉ dùng ở server component (gọi thẳng API_BASE_URL)
export const storefrontRepository: StorefrontRepository = {
    async getHomepage(locale) {
        // Trang chủ có các dải sản phẩm (badge SOLD OUT) → không cache như sản phẩm
        const home = await apiGetOrNull<ApiHome>("/home", { locale, revalidate: LIVE_STOCK });
        return home ? toHomepage(home) : null;
    },

    async getPopularProducts(locale, limit) {
        // Xếp theo lượt xem trang sản phẩm 30 ngày gần nhất; bằng nhau thì hàng mới trước
        const result = await apiGet<ApiPage<ApiProductSummary>>("/products", {
            locale,
            query: { sort: "popular", page: 1, limit },
            revalidate: LIVE_STOCK,
        });
        return result.items.map(toProduct);
    },

    async getAllProducts(locale) {
        const products = await fetchAllPages((page) =>
            apiGet<ApiPage<ApiProductSummary>>("/products", {
                locale,
                query: { sort: "newest", page, limit: PAGE_LIMIT },
                revalidate: LIVE_STOCK,
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
                revalidate: LIVE_STOCK,
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
                revalidate: LIVE_STOCK,
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
            { locale, revalidate: LIVE_STOCK },
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

    async getStoriesPage(locale, page, limit) {
        const result = await apiGet<ApiPage<ApiStoryCard>>("/stories", {
            locale,
            query: { page, limit },
        });
        return {
            items: result.items.map(toStoryCard),
            total: result.total,
            page: result.page,
            totalPages: result.totalPages,
        };
    },

    async getStoriesLanding(locale) {
        try {
            // 404 khi chưa xuất bản landing Mili Talks → trang /blog dùng nội dung mặc định
            const landing = await apiGetOrNull<ApiStoriesLanding>("/content/stories", { locale });
            return landing ? toStoriesLanding(landing) : null;
        } catch (error) {
            // 503 STORE_CMS_INTEGRITY_FAILURE: landing đã xuất bản nhưng nội dung không hợp lệ → không làm sập /blog
            if (error instanceof ApiError && error.status === 503) {
                console.error("[stories landing] published landing is invalid", error.code);
                return null;
            }
            throw error;
        }
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
        return apiGetOrNull<ApiAbout>("/content/about", { locale });
    },

    async getPolicies(locale) {
        const { items } = await apiGet<{ items: ApiPolicySummary[] }>(
            "/content/policies",
            { locale },
        );
        const policies = await Promise.all(
            items.map((item) =>
                apiGetOrNull<ApiPolicyDetail>(
                    `/content/policies/${encodeURIComponent(item.slug)}`,
                    { locale },
                ),
            ),
        );
        return policies.flatMap((policy) =>
            policy
                ? [
                      {
                          slug: policy.slug,
                          title: policy.title,
                          effectiveAt: policy.effectiveAt,
                          sections: policy.sections,
                      },
                  ]
                : [],
        );
    },
};
