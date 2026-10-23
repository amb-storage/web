import type { StaticImageData } from "next/image";
import type {
    ApiAbout,
    ApiAvailability,
    ApiPolicySection,
    ApiSection,
    ApiSeo,
} from "@/lib/api/types";

export type Locale = "ja" | "en";
export type Availability = ApiAvailability;
export type Currency = "JPY";

export interface Money {
    amount: number;
    currency: Currency;
}

export type ProductImage = string | StaticImageData;

export interface StorefrontTaxonomy {
    id: string;
    slug: string;
    label: string;
}

// Dữ liệu đã được backend chọn sẵn đúng ngôn ngữ (Accept-Language), nên mọi chuỗi là string thường
export interface Product {
    id: string;
    slug: string;
    name: string;
    description: string | null;
    condition: string | null;
    price: Money;
    size: string | null;
    quantity: number | null;
    availability: Availability;
    categories: StorefrontTaxonomy[];
    images: ProductImage[];
    imageAlt: string | null;
    publishedAt: string;
}

export interface ProductDetail extends Product {
    seo: { title: string; description: string | null };
    details: Array<{ key: string; label: string; value: string }>;
    policyLinks: Array<{ slug: string; href: string; label: string }>;
}

export type ProductSort = "newest" | "price-low" | "price-high";

export interface ProductQuery {
    search?: string;
    category?: string;
    priceMin?: number;
    priceMax?: number;
    size?: string;
    inStock?: boolean;
    sort?: ProductSort;
}

export interface ProductFacets {
    categories: Array<StorefrontTaxonomy & { count: number }>;
    sizes: Array<StorefrontTaxonomy & { count: number }>;
    minPrice: number | null;
    maxPrice: number | null;
}

export interface StoryCard {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    coverImage: ProductImage;
    coverAlt: string | null;
    publishedAt: string;
}

export type StorySection = ApiSection;

export interface Story extends StoryCard {
    seo: ApiSeo | null;
    sections: StorySection[];
}

export interface HomeHeroCategory {
    key: string;
    title: string;
    image: ProductImage;
    href: string;
}

export interface CustomerVoice {
    id: string;
    name: string;
    quote: string;
    image: ProductImage;
    href: string;
}

export interface Homepage {
    title: string | null;
    seo: ApiSeo | null;
    heroCategories: HomeHeroCategory[];
    specialVintage: Product[];
    newArrivals: Product[];
    mostPopular: Product[];
    customerVoices: CustomerVoice[];
    miliTalksIntro: {
        heading: string;
        introduction: string;
        supportingText: string | null;
    } | null;
    featuredStory: StoryCard | null;
}

export interface NavigationItem {
    label: string;
    href: string;
    external: boolean;
    children: NavigationItem[];
}

export interface StoreSettings {
    storeName: string | null;
    contactEmail: string | null;
    taxDisplayMode: "NONE" | "TAX_INCLUDED" | "TAX_EXCLUDED";
    taxNote: string | null;
    footerText: string | null;
    socialLinks: Array<{ label: string; href: string }>;
}

export interface CmsPage {
    slug: string;
    title: string | null;
    seo: ApiSeo | null;
    sections: ApiSection[];
}

export type AboutContent = ApiAbout;

export interface PolicyContent {
    slug: string;
    title: string;
    effectiveAt: string;
    sections: ApiPolicySection[];
}
