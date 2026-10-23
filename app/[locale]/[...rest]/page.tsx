import type { Metadata } from "next";
import { cache } from "react";
import { notFound } from "next/navigation";
import { getLocale } from "next-intl/server";
import CmsSections from "@/components/CmsSections/CmsSections";
import { storefrontRepository } from "@/lib/storefront/api-storefront";
import type { Locale } from "@/lib/storefront";

// Slug Page trên CMS chỉ gồm chữ thường, số và gạch ngang (giống normalizePublicSlug của backend)
const PAGE_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// URL 1 cấp không khớp route nào → thử Page CMS (`GET /pages/:slug`), không có thì null
const getPage = cache(async (locale: Locale, rest: string[]) => {
    const [slug] = rest;
    if (rest.length !== 1 || !slug || !PAGE_SLUG_PATTERN.test(slug)) return null;
    return storefrontRepository.getPage(locale, slug);
});

export async function generateMetadata({
    params,
}: PageProps<"/[locale]/[...rest]">): Promise<Metadata> {
    const { rest } = await params;
    const page = await getPage((await getLocale()) as Locale, rest);
    if (!page) return {};
    return {
        title: page.seo?.title ?? page.title ?? undefined,
        description: page.seo?.description ?? undefined,
    };
}

// Không có Page tương ứng thì hiện not-found.tsx (có header/footer + bản dịch)
export default async function CatchAllPage({
    params,
}: PageProps<"/[locale]/[...rest]">) {
    const { rest } = await params;
    const page = await getPage((await getLocale()) as Locale, rest);

    if (!page) notFound();

    return (
        <div className="w-full bg-white">
            {page.title && (
                <header className="flex min-h-[200px] items-center justify-center bg-[#eef5f0] px-4 py-12">
                    <h1 className="text-center font-stencil text-5xl font-bold uppercase leading-none tracking-[0.03em] text-(--brand-green) sm:text-6xl md:text-7xl">
                        {page.title}
                    </h1>
                </header>
            )}
            <CmsSections sections={page.sections} />
        </div>
    );
}
