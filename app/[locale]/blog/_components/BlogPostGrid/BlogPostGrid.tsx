"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { Story } from "@/lib/storefront/types";
import { useBlogPostGridAnimation } from "./useBlogPostGridAnimation";

interface BlogPostGridProps {
    posts: Story[];
}

export default function BlogPostGrid({ posts }: BlogPostGridProps) {
    const { gridRef } = useBlogPostGridAnimation();

    return (
        <div
            ref={gridRef}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3"
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
                                    alt={post.title}
                                    fill
                                    sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            </div>
                        </div>
                    </Link>
                </article>
            ))}
        </div>
    );
}
