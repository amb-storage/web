"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { formatDate } from "@/lib/storefront";
import type { StoryCard } from "@/lib/storefront/types";
import { useBlogPostGridAnimation } from "./useBlogPostGridAnimation";

interface BlogPostGridProps {
    posts: StoryCard[];
}

export default function BlogPostGrid({ posts }: BlogPostGridProps) {
    const t = useTranslations("blog");
    const { gridRef } = useBlogPostGridAnimation();

    return (
        <div
            ref={gridRef}
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8 lg:grid-cols-3"
        >
            {posts.map((post) => (
                <article
                    key={post.slug}
                    className="blog-post-card flex translate-y-10 opacity-0"
                >
                    {/* Cả thẻ là một link: ảnh bìa → ngày đăng → tên bài → tóm tắt → "xem chi tiết" */}
                    <Link
                        href={`/blog/${post.slug}`}
                        className="group flex w-full flex-col overflow-hidden bg-white shadow-sm ring-1 ring-black/5 transition-shadow duration-300 hover:shadow-lg"
                    >
                        <div className="relative aspect-4/5 w-full overflow-hidden bg-[#ebedef]">
                            <div className="blog-post-card-img absolute inset-0">
                                <Image
                                    src={post.coverImage}
                                    alt={post.coverAlt ?? post.title}
                                    fill
                                    sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            </div>
                        </div>

                        <div className="flex flex-1 flex-col px-5 pb-5 pt-4">
                            <time
                                dateTime={post.publishedAt}
                                className="text-xs font-semibold tracking-[0.12em] text-black/50"
                            >
                                {formatDate(post.publishedAt)}
                            </time>
                            <h3 className="mt-2 line-clamp-2 text-base font-bold leading-snug tracking-[0.04em] text-(--brand-green) md:text-lg">
                                {post.title}
                            </h3>
                            {post.excerpt && (
                                <p className="mt-2 line-clamp-3 text-sm leading-6 text-gray-600">
                                    {post.excerpt}
                                </p>
                            )}
                            <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-semibold text-black transition-colors group-hover:text-(--brand-green)">
                                {t("viewDetails")}
                                <ArrowRight
                                    aria-hidden
                                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                                />
                            </span>
                        </div>
                    </Link>
                </article>
            ))}
        </div>
    );
}
