import { getTranslations, getLocale } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { storefrontRepository } from "@/lib/storefront";

export default async function BlogIndexPage() {
  const locale = (await getLocale()) as "ja" | "en";
  const t = await getTranslations("blog");
  const posts = await storefrontRepository.getStories();

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-12 md:px-8">
      <h1 className="mb-10 text-center text-3xl font-bold uppercase tracking-wider text-(--brand-green)">
        {t("pageTitle")}
      </h1>

      <div className="flex flex-col gap-10">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group grid grid-cols-1 gap-5 border-b border-gray-100 pb-10 last:border-b-0 md:grid-cols-[280px_1fr] md:items-center md:gap-8"
          >
            <div className="relative aspect-4/3 w-full overflow-hidden rounded-lg bg-zinc-50">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>

            <div>
              <p className="text-xs text-gray-400">{post.date}</p>
              <h2 className="mt-1 text-xl font-bold text-gray-900 transition-colors group-hover:text-(--brand-green) md:text-2xl">
                {post.title}
              </h2>
              <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-gray-600">
                {post.excerpt[locale]}
              </p>
              <span className="mt-3 inline-block text-sm font-semibold text-(--brand-green) underline underline-offset-2">
                {t("readMore")}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
