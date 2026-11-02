import type { MetadataRoute } from "next";
import { absoluteUrl, imageSrc, localizedPath } from "@/lib/seo/site";
import { storefrontRepository } from "@/lib/storefront/api-storefront";

// Làm mới mỗi giờ để có sản phẩm và bài mới
export const revalidate = 3600;

const entry = (path: string, lastModified?: string, images?: string[]): MetadataRoute.Sitemap[number] => ({
    url: absoluteUrl(localizedPath("ja", path)),
    lastModified,
    images,
    alternates: {
        languages: {
            ja: absoluteUrl(localizedPath("ja", path)),
            en: absoluteUrl(localizedPath("en", path)),
        },
    },
});

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // API lỗi vẫn trả sitemap các trang tĩnh, không làm hỏng file
    const [products, stories] = await Promise.all([
        storefrontRepository.getAllProducts("ja").catch(() => []),
        storefrontRepository.getStories("ja").catch(() => []),
    ]);
    return [
        ...["/", "/shop", "/blog", "/contact"].map((path) => entry(path)),
        ...products.map((product) =>
            entry(
                `/shop/${product.slug}`,
                product.publishedAt,
                product.images.slice(0, 1).map((image) => absoluteUrl(imageSrc(image))),
            ),
        ),
        ...stories.map((story) =>
            entry(`/blog/${story.slug}`, story.publishedAt, [absoluteUrl(imageSrc(story.coverImage))]),
        ),
    ];
}
