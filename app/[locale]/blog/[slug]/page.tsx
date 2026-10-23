import type { Metadata } from "next";
import { cache } from "react";
import { notFound } from "next/navigation";
import { getLocale } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { storefrontRepository } from "@/lib/storefront/api-storefront";
import { formatDate, type Locale } from "@/lib/storefront";
import CmsSections from "@/components/CmsSections/CmsSections";

// generateMetadata và page dùng chung 1 lần gọi API trong cùng request
const getStory = cache((locale: Locale, slug: string) =>
    storefrontRepository.getStoryBySlug(locale, slug),
);

export async function generateMetadata({
    params,
}: PageProps<"/[locale]/blog/[slug]">): Promise<Metadata> {
    const { slug } = await params;
    const post = await getStory((await getLocale()) as Locale, slug);
    if (!post) return {};
    return {
        title: post.seo?.title ?? post.title,
        description: post.seo?.description ?? post.excerpt,
    };
}

export default async function BlogPostPage({
    params,
}: PageProps<"/[locale]/blog/[slug]">) {
    const { slug } = await params;
    const post = await getStory((await getLocale()) as Locale, slug);

    if (!post) notFound();

    return (
        <div className="bg-[#eff5f0]">
            <header className="bg-white py-8 mx-auto">
                <div className="mx-auto max-w-3xl">
                    <span className="text-[13px] font-semibold">
                        {formatDate(post.publishedAt)}
                    </span>
                    <h1 className="mt-2 line-clamp-2 text-3xl font-bold leading-tight text-(--brand-green) md:text-[40px]">
                        {post.title}
                    </h1>
                </div>
            </header>

            <div className="mx-auto max-w-2xl bg-[#eff5f0] px-5 pb-10">
                <Image
                    src={post.coverImage}
                    alt={post.coverAlt ?? post.title}
                    width={1080}
                    height={1350}
                    priority
                    className="mx-auto h-auto w-full object-cover"
                />
                <p className="mx-auto mt-2 text-sm tracking-[0.08em]">
                    <Link
                        href={`/blog/${post.slug}`}
                        className="text-(--brand-green) underline"
                    >
                        in English and Japanese by Amb:STORAGE
                    </Link>
                </p>
            </div>

            <CmsSections sections={post.sections} />
        </div>
    );
}
