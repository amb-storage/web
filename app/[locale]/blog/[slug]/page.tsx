import { notFound } from "next/navigation";
import { getLocale } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { storefrontRepository } from "@/lib/storefront";
import { BlogPostContent } from "./_components/BlogPostContent";

export default async function BlogPostPage({
    params,
}: PageProps<"/[locale]/blog/[slug]">) {
    const { slug } = await params;
    const post = await storefrontRepository.getStoryBySlug(slug);

    if (!post) notFound();

    const locale = (await getLocale()) as "ja" | "en";

    return (
        <div className="bg-[#eff5f0]">
            <header className="bg-white py-8 mx-auto">
                <div className="mx-auto max-w-3xl">
                    <span className="text-[13px] font-semibold">
                        {post.date}
                    </span>
                    <h1 className="mt-2 line-clamp-2 text-3xl font-bold leading-tight text-(--brand-green) md:text-[40px]">
                        {post.title}
                    </h1>
                </div>
            </header>

            <div className="mx-auto max-w-2xl bg-[#eff5f0] px-5 pb-10">
                <Image
                    src={post.coverImage}
                    alt={post.title}
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

            {post.contentSections ? (
                <BlogPostContent
                    sections={post.contentSections}
                    locale={locale}
                />
            ) : (
                <div className="mx-auto bg-white px-5 py-12 md:px-8 md:py-16">
                    <div
                        className="[&_a]:text-(--brand-green) [&_a]:underline [&_h2]:mb-3 [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-(--brand-green) [&_img]:my-6 [&_img]:w-full [&_img]:rounded-lg [&_li]:mb-1 [&_p]:mb-4 [&_p]:leading-relaxed [&_p]:text-gray-700 [&_strong]:font-semibold [&_strong]:text-gray-900 [&_ul]:list-disc [&_ul]:pl-6]"
                        dangerouslySetInnerHTML={{
                            __html: post.contentHtml[locale],
                        }}
                    />
                </div>
            )}
        </div>
    );
}
