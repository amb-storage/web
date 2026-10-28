import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { StoryCard } from "@/lib/storefront";

interface ProductMiliTalkProps {
    // `miliTalk` của `GET /products/:slug`: bài Mili Talks gắn trong admin
    story: StoryCard;
}

export default async function ProductMiliTalk({ story }: ProductMiliTalkProps) {
    const t = await getTranslations("productDetail.miliTalk");
    return (
        <section className="mt-12 border-t border-gray-200 pt-10">
            <h2 className="mb-6 text-2xl font-bold tracking-tight text-[#1B3B2B] md:text-3xl">{t("title")}</h2>
            <Link
                href={`/blog/${story.slug}`}
                className="group grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,320px)_1fr] md:items-center"
            >
                <div className="relative aspect-4/3 w-full overflow-hidden bg-gray-100">
                    <Image
                        src={story.coverImage}
                        alt={story.coverAlt ?? story.title}
                        fill
                        sizes="(min-width: 768px) 320px, 100vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                </div>
                <div className="flex flex-col gap-3">
                    <h3 className="text-lg font-bold text-black group-hover:underline md:text-xl">{story.title}</h3>
                    <p className="line-clamp-3 text-sm leading-7 text-gray-700">{story.excerpt}</p>
                    <span className="w-fit text-sm font-semibold text-(--brand-green) underline underline-offset-4">
                        {t("readMore")}
                    </span>
                </div>
            </Link>
        </section>
    );
}
