import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import FeaturedPostImage from "./FeaturedPostImage";

export default function BlogSection() {
    const t = useTranslations("homepage.blog");

    return (
        <section className="w-full bg-white py-8 md:py-12">
            <div className="mx-auto px-4 md:px-12">
                <div className="grid grid-cols-1 gap-10 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] md:items-center md:gap-16">
                    <div className="flex flex-col gap-4 md:pr-4">
                        <h2 className="text-3xl font-extrabold uppercase tracking-wider text-(--brand-green) md:text-4xl">
                            {t("title")}
                        </h2>

                        <p className="text-base leading-relaxed text-gray-700">
                            {t.rich("lead", {
                                b: (chunks) => (
                                    <span className="font-bold text-gray-900">
                                        {chunks}
                                    </span>
                                ),
                            })}
                        </p>

                        <p className="text-base leading-relaxed text-gray-600">
                            {t("description")}
                        </p>

                        <Link
                            href="/blog"
                            className="inline-block w-fit bg-(--brand-green) px-5 py-2.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-(--brand-green-dark)"
                        >
                            {t("readMore")}
                        </Link>
                    </div>

                    <div className="flex justify-end">
                        <FeaturedPostImage
                            image="/images/amb-live/home/stories/mili-talks-feature.png"
                            title={t("featuredPost.title")}
                            href="/blog/us-navy-n1-deck-jacket-unlocking-the-details"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
