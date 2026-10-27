import type { Metadata } from "next";
import { cache } from "react";
import { getLocale, getTranslations } from "next-intl/server";
import { storefrontRepository } from "@/lib/storefront/api-storefront";
import type { Locale } from "@/lib/storefront";
import BlogPostGrid from "@/components/BlogPostGrid/BlogPostGrid";
import FeaturedPostImage from "@/components/FeaturedPostImage/FeaturedPostImage";
import BlogReferences from "./_components/BlogReferences/BlogReferences";

const getLanding = cache((locale: Locale) => storefrontRepository.getStoriesLanding(locale));

export async function generateMetadata(): Promise<Metadata> {
    const landing = await getLanding((await getLocale()) as Locale);
    return {
        title: landing?.seo?.title ?? landing?.title ?? "Mili Talks",
        description: landing?.seo?.description ?? undefined,
    };
}

export default async function BlogIndexPage() {
    const t = await getTranslations("blog");
    const locale = (await getLocale()) as Locale;
    // Ưu tiên landing Mili Talks soạn trong admin; chưa xuất bản thì dùng nội dung mặc định + toàn bộ bài
    const landing = await getLanding(locale);
    const grids = landing
        ? landing.grids
        : [
              {
                  id: "all",
                  title: null,
                  description: null,
                  stories: await storefrontRepository.getStories(locale),
              },
          ];
    const referenceGroups = landing?.references ?? [];

    return (
        <div className="w-full bg-(--surface-muted)">
            <section className="mx-auto w-full max-w-[1280px] px-5 py-10 md:px-18 md:py-12">
                <div className="max-w-4xl">
                    <h1 className="text-2xl font-bold uppercase text-(--brand-green) md:text-[40px]">
                        {landing?.intro.heading ?? t("pageTitle")}
                    </h1>
                    <p className="mt-4 whitespace-pre-line text-sm leading-7 tracking-[0.08em] text-black md:text-base">
                        {landing?.intro.introduction ?? t("intro")}
                    </p>
                </div>
                {landing?.featuredStory && (
                    <div className="mt-10 flex justify-center">
                        <FeaturedPostImage
                            image={landing.featuredStory.coverImage}
                            title={landing.featuredStory.title}
                            href={`/blog/${landing.featuredStory.slug}`}
                        />
                    </div>
                )}
            </section>

            <section className="w-full bg-white">
                <div className="mx-auto w-full max-w-[1280px] px-5 py-10 md:px-18 md:py-12">
                    <p className="whitespace-pre-line text-sm leading-7 tracking-[0.08em] text-black md:text-base">
                        {landing?.intro.supportingText ?? t("references.intro")}
                    </p>

                    {referenceGroups.length ? <BlogReferences groups={referenceGroups} /> : null}
                </div>
            </section>

            {grids.map((grid) => (
                <section
                    key={grid.id}
                    className="mx-auto w-full max-w-[1280px] px-5 py-10 md:px-18 md:py-12"
                >
                    {grid.title && (
                        <div className="mb-6 max-w-4xl">
                            <h2 className="text-xl font-bold uppercase text-(--brand-green) md:text-3xl">
                                {grid.title}
                            </h2>
                            {grid.description && (
                                <p className="mt-3 text-sm leading-7 tracking-[0.08em] text-black md:text-base">
                                    {grid.description}
                                </p>
                            )}
                        </div>
                    )}
                    <BlogPostGrid posts={grid.stories} />
                </section>
            ))}
        </div>
    );
}
