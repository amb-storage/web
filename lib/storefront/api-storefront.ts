import { apiGet, apiGetOrNull } from "@/lib/api/server";
import type {
    ApiAbout,
    ApiHome,
    ApiNavigationItem,
    ApiPage,
    ApiPolicyDetail,
    ApiPolicySummary,
    ApiProductDetail,
    ApiProductFacets,
    ApiProductSummary,
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
import type { StorefrontRepository } from "./repository";

// Backend giới hạn limit tối đa 100/trang
const PAGE_LIMIT = 100;
// Chặn vòng lặp nếu backend trả totalPages bất thường
const MAX_PAGES = 20;

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
