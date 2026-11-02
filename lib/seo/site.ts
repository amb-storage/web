import type { Metadata } from "next";
import { routing } from "@/i18n/routing";
import type { Locale, ProductImage } from "@/lib/storefront";

export const SITE_NAME = "Amb:STORAGE";
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://amb-storage.com").replace(/\/+$/, "");

// Tiếng Nhật không có prefix (localePrefix "as-needed"), tiếng Anh nằm dưới /en
export function localizedPath(locale: Locale, path: string) {
    const clean = path === "/" ? "" : path;
    const localized = locale === routing.defaultLocale ? clean : `/${locale}${clean}`;
    return localized || "/";
}

export const absoluteUrl = (path: string) => new URL(path, SITE_URL).toString();

export const imageSrc = (image: ProductImage) => (typeof image === "string" ? image : image.src);

// Canonical + hreflang cho cả 2 ngôn ngữ của một đường dẫn
export function alternatesFor(locale: Locale, path: string): Metadata["alternates"] {
    return {
        canonical: localizedPath(locale, path),
        languages: {
            ja: localizedPath("ja", path),
            en: localizedPath("en", path),
            "x-default": localizedPath(routing.defaultLocale, path),
        },
    };
}

interface ShareMetadata {
    locale: Locale;
    path: string;
    title?: string;
    description?: string;
    image?: ProductImage;
    type?: "website" | "article";
}

// Thẻ xem trước khi dán link (Facebook, LINE, Zalo, X…); Next ghi đè nguyên khối openGraph của layout
export function shareMetadata({ locale, path, title, description, image, type = "website" }: ShareMetadata): Metadata {
    const images = image ? [imageSrc(image)] : undefined;
    return {
        alternates: alternatesFor(locale, path),
        openGraph: {
            siteName: SITE_NAME,
            type,
            url: localizedPath(locale, path),
            locale: locale === "ja" ? "ja_JP" : "en_US",
            title,
            description,
            images,
        },
        twitter: { card: images ? "summary_large_image" : "summary", title, description, images },
    };
}
