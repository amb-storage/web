import type {
    AboutContent,
    CmsPage,
    Homepage,
    Locale,
    NavigationItem,
    PolicyContent,
    Product,
    ProductDetail,
    ProductFacets,
    ProductListPage,
    ProductListQuery,
    StoreSettings,
    StoriesLanding,
    Story,
    StoryCard,
} from "./types";

export interface StorefrontRepository {
    getHomepage(locale: Locale): Promise<Homepage | null>;
    getAllProducts(locale: Locale): Promise<Product[]>;
    searchProducts(locale: Locale, query: ProductListQuery): Promise<ProductListPage>;
    getProductBySlug(locale: Locale, slug: string): Promise<ProductDetail | null>;
    getProductFacets(locale: Locale): Promise<ProductFacets>;
    getStories(locale: Locale): Promise<StoryCard[]>;
    getStoriesLanding(locale: Locale): Promise<StoriesLanding | null>;
    getStoryBySlug(locale: Locale, slug: string): Promise<Story | null>;
    getHeaderNavigation(locale: Locale): Promise<NavigationItem[]>;
    getFooterNavigation(locale: Locale): Promise<NavigationItem[]>;
    getStoreSettings(locale: Locale): Promise<StoreSettings>;
    getPage(locale: Locale, slug: string): Promise<CmsPage | null>;
    getAbout(locale: Locale): Promise<AboutContent | null>;
    getPolicies(locale: Locale): Promise<PolicyContent[]>;
}
