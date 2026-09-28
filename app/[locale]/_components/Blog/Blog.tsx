import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import jacket3 from "@/assets/jacket-3.jpeg";
import FeaturedPostImage from "./FeaturedPostImage";

export default function BlogSection() {
  const t = useTranslations("homepage.blog");

  return (
    <section className="w-full bg-white py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:items-center md:gap-16">
          <div className="flex flex-col gap-6">
            <h2 className="text-3xl md:text-4xl font-extrabold uppercase tracking-wider text-[#1B3B2B]">
              {t("title")}
            </h2>

            <p className="text-base leading-relaxed text-gray-700">
              {t.rich("lead", {
                b: (chunks) => (
                  <span className="font-bold text-gray-900">{chunks}</span>
                ),
              })}
            </p>

            <p className="text-base leading-relaxed text-gray-600">
              {t("description")}
            </p>

            <Link
              href="/blog"
              className="inline-block w-fit rounded bg-[#1B3B2B] px-6 py-3 text-sm font-semibold text-white shadow-lg transition-colors duration-200 hover:bg-[#12271d]"
            >
              {t("readMore")}
            </Link>
          </div>

          <FeaturedPostImage
            image={jacket3}
            title={t("featuredPost.title")}
            subtitle={t("featuredPost.subtitle")}
          />
        </div>
      </div>
    </section>
  );
}
