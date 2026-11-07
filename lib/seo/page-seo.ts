import type { Metadata } from "next";
import { storefrontRepository } from "@/lib/storefront/api-storefront";
import type { Locale } from "@/lib/storefront";
import { shareMetadata } from "./site";

type FixedPage = "shop" | "contact" | "customerVoice";

// Tiêu đề/mô tả admin nhập ở Cài đặt → SEO các trang cố định; trống hoặc API lỗi thì dùng mặc định
export async function fixedPageMetadata(
    locale: Locale,
    page: FixedPage,
    path: string,
    fallback: { title: string; description?: string },
): Promise<Metadata> {
    const settings = await storefrontRepository.getStoreSettings(locale).catch(() => null);
    const seo = settings?.pageSeo[page];
    const title = seo?.title ?? fallback.title;
    const description = seo?.description ?? fallback.description;
    return { title, description, ...shareMetadata({ locale, path, title, description }) };
}
