import { notFound } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";
import Image from "next/image";
import { ChevronLeft } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { getBlogPost } from "../fake";

export default async function BlogPostPage({
  params,
}: PageProps<"/[locale]/blog/[slug]">) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) notFound();

  const locale = (await getLocale()) as "ja" | "en";
  const t = await getTranslations("blog");

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12 md:px-8">
      <Link
        href="/blog"
        className="mb-6 inline-flex items-center gap-1 text-sm text-gray-500 transition-colors hover:text-black"
      >
        <ChevronLeft className="h-4 w-4" />
        {t("backToBlog")}
      </Link>

      <p className="text-xs text-gray-400">{post.date}</p>
      <h1 className="mt-1 text-2xl font-bold text-gray-900 md:text-4xl">
        {post.title}
      </h1>

      <div className="relative mt-6 aspect-[16/9] w-full overflow-hidden rounded-lg bg-zinc-50">
        <Image
          src={post.coverImage}
          alt={post.title}
          fill
          priority
          className="object-cover"
        />
      </div>

      {/* Nội dung bài viết: HTML tĩnh tự viết/kiểm soát (không phải input người dùng), render
          trực tiếp qua dangerouslySetInnerHTML. Style áp cho các thẻ con qua Tailwind arbitrary
          variant thay vì cài thêm plugin typography. */}
      <div
        className="mt-8 [&_a]:text-[#1B3B2B] [&_a]:underline [&_h2]:mb-3 [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-[#1B3B2B] [&_img]:my-6 [&_img]:w-full [&_img]:rounded-lg [&_li]:mb-1 [&_p]:mb-4 [&_p]:leading-relaxed [&_p]:text-gray-700 [&_strong]:font-semibold [&_strong]:text-gray-900 [&_ul]:list-disc [&_ul]:pl-6"
        dangerouslySetInnerHTML={{ __html: post.contentHtml[locale] }}
      />
    </div>
  );
}
