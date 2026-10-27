import type {
    ApiHome,
    ApiMediaSummary,
    ApiNavigationItem,
    ApiProductDetail,
    ApiProductSummary,
    ApiStoreSettings,
    ApiStoriesLanding,
    ApiStoryCard,
    ApiStoryDetail,
} from "@/lib/api/types";
import type {
    Homepage,
    NavigationItem,
    Product,
    ProductDetail,
    StoreSettings,
    StoriesLanding,
    Story,
    StoryCard,
} from "./types";

// URL media backend trả dạng tương đối `/api/v1/media/:id`, trình duyệt đi qua rewrite cùng origin
export function mediaSrc(media: ApiMediaSummary) {
    return media.url;
}

export function toProduct(product: ApiProductSummary): Product {
    const media = [product.primaryMedia, product.secondaryMedia].filter(
        (item): item is ApiMediaSummary => item !== null,
    );
    return {
        id: product.id,
        slug: product.slug,
        name: product.name,
        description: product.description,
        condition: product.condition,
        price: { amount: product.price, currency: "JPY" },
        size: product.size,
        quantity: product.quantity,
        availability: product.availability,
        categories: product.categories,
        images: media.map(mediaSrc),
        imageAlt: media[0]?.alt ?? null,
        publishedAt: product.publishedAt,
    };
}

export function toProductDetail(product: ApiProductDetail): ProductDetail {
    const base = toProduct(product);
    return {
        ...base,
        // Trang chi tiết dùng toàn bộ gallery thay vì chỉ ảnh primary/secondary
        images: product.media.length > 0 ? product.media.map(mediaSrc) : base.images,
        seo: product.seo,
        details: product.details,
        policyLinks: product.policyLinks,
    };
}

export function toStoryCard(story: ApiStoryCard): StoryCard {
    return {
        id: story.id,
        slug: story.slug,
        title: story.title,
        excerpt: story.excerpt,
        coverImage: mediaSrc(story.coverMedia),
        coverAlt: story.coverMedia.alt,
        publishedAt: story.publishedAt,
    };
}

export function toStory(story: ApiStoryDetail): Story {
    return { ...toStoryCard(story), seo: story.seo, sections: story.sections };
}

export function toStoriesLanding(landing: ApiStoriesLanding): StoriesLanding {
    return {
        title: landing.title,
        seo: landing.seo,
        intro: landing.intro,
        featuredStory: landing.featuredTalk ? toStoryCard(landing.featuredTalk) : null,
        grids: landing.grids.map((grid) => ({
            id: grid.id,
            title: grid.title,
            description: grid.description,
            stories: grid.talks.map(toStoryCard),
        })),
        references: landing.references ?? null,
    };
}

export function toHomepage(home: ApiHome): Homepage {
    const { left, right } = home.categoryHeroSplit;
    return {
        title: home.title,
        seo: home.seo,
        heroCategories: [left, right].map((side) => ({
            key: side.category.slug,
            title: side.label,
            image: mediaSrc(side.media),
            href: side.href,
        })),
        specialVintage: home.specialVintage?.products.map(toProduct) ?? [],
        newArrivals: home.newArrivals?.products.map(toProduct) ?? [],
        mostPopular: home.mostPopular?.products.map(toProduct) ?? [],
        customerVoices: (home.customerVoice?.items ?? []).flatMap((voice) => {
            const product = voice.product ? toProduct(voice.product) : null;
            if (!product || product.images.length === 0) return [];
            return [
                {
                    id: voice.id,
                    name: voice.name ?? "",
                    quote: voice.quote,
                    image: product.images[0],
                    href: `/shop/${product.slug}`,
                },
            ];
        }),
        miliTalksIntro: home.miliTalksIntro ?? null,
        featuredStory: home.featuredMiliTalk ? toStoryCard(home.featuredMiliTalk) : null,
    };
}

// Backend trả href theo route API cho Page / Policy; web dùng route riêng:
// `/pages/<slug>` → `/<slug>` (catch-all [...rest]), `/content/policies/<slug>` → `/policy#<slug>`
export function toWebHref(href: string) {
    const page = /^\/pages\/([^/?#]+)\/?$/.exec(href);
    if (page) return `/${page[1]}`;
    const policy = /^\/content\/policies\/([^/?#]+)\/?$/.exec(href);
    if (policy) return `/policy#${policy[1]}`;
    return href;
}

export function toNavigationItems(items: ApiNavigationItem[]): NavigationItem[] {
    return items.map((item) => ({
        label: item.label,
        href: item.external ? item.href : toWebHref(item.href),
        external: item.external,
        children: toNavigationItems(item.children),
    }));
}

export function toStoreSettings(settings: ApiStoreSettings): StoreSettings {
    return {
        storeName: settings.storeName,
        contactEmail: settings.contactEmail,
        taxDisplayMode: settings.taxDisplayMode,
        taxNote: settings.taxNote,
        footerText: settings.footerText,
        socialLinks: settings.socialLinks,
    };
}
