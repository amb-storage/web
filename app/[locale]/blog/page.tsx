import { getLocale, getTranslations } from "next-intl/server";
import { storefrontRepository } from "@/lib/storefront/api-storefront";
import type { Locale } from "@/lib/storefront";
import BlogPostGrid from "@/components/BlogPostGrid/BlogPostGrid";
import Pagination from "@/components/Pagination/Pagination";
import FeaturedPostImage from "@/components/FeaturedPostImage/FeaturedPostImage";
import BlogReferences from "./_components/BlogReferences/BlogReferences";

// Danh sách cảm ơn theo trang Mili Talks hiện tại của amb-storage.com, dùng khi CMS chưa có mục Special Thanks
const DEFAULT_REFERENCES = {
    websites: ["usmilitariaforum.com", "heddels.com", "vintageleatherjacket.org"],
    brandShop: [
        "ACORN Buy&Sell Vintage",
        "EXTRA'S GARMENT Supply & Co.",
        "MASH CO. Ltd.",
        "mushroom",
        "THE NAVY-ism",
        "jollyjack",
        "BedfordCord",
        "Berberjin",
        "BIDSTITCH",
        "Marvin's Vintage",
        "G-1 STALKER",
        "Golden State Vintage",
    ],
    collector: [
        "Aota Mituhiro",
        "Jiro Okawa",
        "Satoshi Kakui",
        "Okanineko",
        "Jon of LeatherJacketJawn",
        "Eric Maggiori",
        "Antinio Martinez",
        "Ed Anthony Stanford",
    ],
};

// Số bài mỗi trang ở /blog (chia hết cho lưới 3 cột)
const STORIES_PER_PAGE = 12;

// `?page=2` → 2; giá trị lạ thì về trang 1
function toPage(value: string | string[] | undefined) {
    const raw = Array.isArray(value) ? value[0] : value;
    const page = raw && /^\d+$/.test(raw) ? Number(raw) : 1;
    return Number.isSafeInteger(page) && page > 1 ? page : 1;
}

export default async function BlogIndexPage({ searchParams }: PageProps<"/[locale]/blog">) {
    const t = await getTranslations("blog");
    const locale = (await getLocale()) as Locale;
    const page = toPage((await searchParams).page);
    // Landing (admin) cho intro / bài nổi bật / References; danh sách bài là mọi bài đã xuất bản,
    // chia trang theo `GET /stories` (không bị giới hạn theo số bài cấu hình ở lưới của landing)
    const [landing, storiesPage] = await Promise.all([
        storefrontRepository.getStoriesLanding(locale),
        storefrontRepository.getStoriesPage(locale, page, STORIES_PER_PAGE),
    ]);
    const stories = storiesPage.items;
    // Tiêu đề / mô tả lưới lấy từ lưới đầu tiên của landing (nếu có)
    const gridHeading = landing?.grids[0];
    const grids = [
        {
            id: "all",
            title: gridHeading?.title ?? null,
            description: gridHeading?.description ?? null,
            stories,
        },
    ];
    // Cột Special Thanks soạn trong admin; landing chưa có mục này thì dùng danh sách mặc định
    const referenceGroups = landing?.references?.length
        ? landing.references
        : [
              { title: t("references.specialThanks"), items: DEFAULT_REFERENCES.websites },
              { title: t("references.brandShop"), items: DEFAULT_REFERENCES.brandShop },
              { title: t("references.collector"), items: DEFAULT_REFERENCES.collector },
          ];

    return (
        <div className="w-full bg-(--surface-muted)">
            <section className="mx-auto w-full max-w-[1280px] px-5 py-10 md:px-18 md:py-12">
                <div className="max-w-4xl">
                    <h1 className="text-2xl font-bold uppercase text-(--brand-green) md:text-[40px]">
                        {landing?.intro.heading ?? t("pageTitle")}
                    </h1>
                    <p className="mt-4 whitespace-pre-line text-sm leading-7 tracking-[0.08em] text-black md:text-base">
                        {landing?.intro.introduction ?? t("intro")}
                    </p>
                </div>
                {landing?.featuredStory && (
                    <div className="mt-10 flex justify-center">
                        <FeaturedPostImage
                            image={landing.featuredStory.coverImage}
                            title={landing.featuredStory.title}
                            href={`/blog/${landing.featuredStory.slug}`}
                        />
                    </div>
                )}
            </section>

            <section className="w-full bg-white">
                <div className="mx-auto w-full max-w-[1280px] px-5 py-10 md:px-18 md:py-12">
                    <p className="whitespace-pre-line text-sm leading-7 tracking-[0.08em] text-black md:text-base">
                        {landing?.intro.supportingText ?? t("references.intro")}
                    </p>

                    <BlogReferences groups={referenceGroups} />
                </div>
            </section>

            {grids.map((grid) => (
                <section
                    key={grid.id}
                    className="mx-auto w-full max-w-[1280px] px-5 py-10 md:px-18 md:py-12"
                >
                    {grid.title && (
                        <div className="mb-6 max-w-4xl">
                            <h2 className="text-xl font-bold uppercase text-(--brand-green) md:text-3xl">
                                {grid.title}
                            </h2>
                            {grid.description && (
                                <p className="mt-3 text-sm leading-7 tracking-[0.08em] text-black md:text-base">
                                    {grid.description}
                                </p>
                            )}
                        </div>
                    )}
                    <BlogPostGrid posts={grid.stories} />
                    <Pagination
                        page={storiesPage.page}
                        totalPages={storiesPage.totalPages}
                        hrefFor={(target) => (target > 1 ? `/blog?page=${target}` : "/blog")}
                    />
                </section>
            ))}
        </div>
    );
}
