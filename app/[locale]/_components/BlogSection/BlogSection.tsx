import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Homepage } from "@/lib/storefront";
import FeaturedPostImage from "./FeaturedPostImage";

interface BlogSectionProps {
    // `miliTalksIntro` / `featuredMiliTalk` của `GET /home`; thiếu thì dùng nội dung mặc định trong messages
    intro?: Homepage["miliTalksIntro"];
    featuredStory?: Homepage["featuredStory"];
}

export default function BlogSection({
    intro = null,
    featuredStory = null,
}: BlogSectionProps) {
    const t = useTranslations("homepage.blog");

    return (
        <section className="w-full bg-white py-8 md:py-12">
            <div className="mx-auto px-4 md:px-12">
                <div className="grid grid-cols-1 gap-10 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] md:items-center md:gap-16">
                    <div className="flex flex-col gap-4 md:pr-4">
                        <h2 className="text-3xl font-bold uppercase text-(--brand-green) md:text-4xl">
                            {intro?.heading ?? t("title")}
                        </h2>

                        <p className="text-base leading-relaxed text-gray-700">
                            {intro
                                ? intro.introduction
                                : t.rich("lead", {
                                      b: (chunks) => (
                                          <span className="font-bold text-gray-900">
                                              {chunks}
                                          </span>
                                      ),
                                  })}
                        </p>

                        <p className="text-base leading-relaxed text-gray-600">
                            {intro ? intro.supportingText : t("description")}
                        </p>

                        <Link
                            href="/blog"
                            className="inline-block w-fit bg-(--brand-green) px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-(--brand-green-dark)"
                        >
                            {t("readMore")}
                        </Link>
                    </div>

                    {featuredStory && (
                        <div className="flex justify-end">
                            <FeaturedPostImage
                                image={featuredStory.coverImage}
                                title={featuredStory.title}
                                href={`/blog/${featuredStory.slug}`}
                            />
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
