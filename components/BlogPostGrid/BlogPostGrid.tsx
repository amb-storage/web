"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
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
            className="grid grid-cols-1 gap-x-4 gap-y-10 sm:grid-cols-2 md:grid-cols-3"
        >
            {posts.map((post) => (
                <article
                    key={post.slug}
                    className="blog-post-card translate-y-10 opacity-0"
                >
                    <Link href={`/blog/${post.slug}`} className="group block">
                        <div className="relative aspect-3/4 w-full overflow-hidden bg-white">
                            <div className="blog-post-card-img absolute inset-0">
                                <Image
                                    src={post.coverImage}
                                    alt={post.coverAlt ?? post.title}
                                    fill
                                    sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            </div>
                        </div>

                        {/* Tên bài + link xem chi tiết dưới ảnh; cả thẻ là một link */}
                        <h3 className="mt-4 line-clamp-2 text-base font-bold leading-snug tracking-[0.04em] text-(--brand-green) transition-colors group-hover:text-(--brand-green-dark) md:text-lg">
                            {post.title}
                        </h3>
                        <span className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-black underline-offset-4 group-hover:underline">
                            {t("viewDetails")}
                            <ArrowRight
                                aria-hidden
                                className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                            />
                        </span>
                    </Link>
                </article>
            ))}
        </div>
    );
}
