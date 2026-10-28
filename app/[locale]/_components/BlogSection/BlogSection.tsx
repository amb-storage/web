import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Homepage, StoryCard } from "@/lib/storefront";
import BlogPostGrid from "@/components/BlogPostGrid/BlogPostGrid";
import FeaturedPostImage from "@/components/FeaturedPostImage/FeaturedPostImage";

interface BlogSectionProps {
    // `miliTalksIntro` của `GET /home` (thiếu thì dùng messages); bài: `featuredMiliTalk` của Home, không có thì bài mới nhất
    intro?: Homepage["miliTalksIntro"];
    featuredStory?: Homepage["featuredStory"];
    // Các bài còn lại (trừ bài nổi bật), hiện thành lưới bên dưới
    stories?: StoryCard[];
}

export default function BlogSection({
    intro = null,
    featuredStory = null,
    stories = [],
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

                    {/* Hình chọn trong admin (bấm mở /blog); chưa chọn thì dùng ảnh bìa bài nổi bật như trước */}
                    {intro?.image ? (
                        <div className="flex justify-end">
                            <FeaturedPostImage
                                image={intro.image}
                                title={intro.imageAlt ?? intro.heading}
                                href="/blog"
                            />
                        </div>
                    ) : featuredStory ? (
                        <div className="flex justify-end">
                            <FeaturedPostImage
                                image={featuredStory.coverImage}
                                title={featuredStory.title}
                                href={`/blog/${featuredStory.slug}`}
                            />
                        </div>
                    ) : null}
                </div>

                {stories.length > 0 && (
                    <div className="mt-10 md:mt-12">
                        <BlogPostGrid posts={stories} />
                    </div>
                )}
            </div>
        </section>
    );
}
