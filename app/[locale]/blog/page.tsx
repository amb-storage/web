import { getTranslations } from "next-intl/server";
import { storefrontRepository } from "@/lib/storefront";
import BlogPostGrid from "./_components/BlogPostGrid/BlogPostGrid";
import BlogReferences from "./_components/BlogReferences/BlogReferences";

export default async function BlogIndexPage() {
    const t = await getTranslations("blog");
    const posts = await storefrontRepository.getStories();
    const referenceGroups = [
        {
            title: t("references.specialThanks"),
            items: [
                "usmilitariaforum.com",
                "heddels.com",
                "vintageleatherjacket.org",
            ],
        },
        {
            title: t("references.brandShop"),
            items: [
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
        },
        {
            title: t("references.collector"),
            items: [
                "Aota Mituhiro",
                "Jiro Okawa",
                "Satoshi Kakui",
                "Okanineko",
                "Jon of LeatherJacketJawn",
                "Eric Maggiori",
                "Antinio Martinez",
                "Ed Anthony Stanford",
            ],
        },
    ];

    return (
        <div className="w-full bg-(--surface-muted)">
            <section className="mx-auto w-full max-w-[1280px] px-5 py-10 md:px-18 md:py-12">
                <div className="max-w-4xl">
                    <h1 className="text-2xl font-bold uppercase text-(--brand-green) md:text-[40px]">
                        {t("pageTitle")}
                    </h1>
                    <p className="mt-4 whitespace-pre-line text-sm leading-7 tracking-[0.08em] text-black md:text-base">
                        {t("intro")}
                    </p>
                </div>
            </section>

            <section className="w-full bg-white">
                <div className="mx-auto w-full max-w-[1280px] px-5 py-10 md:px-18 md:py-12">
                    <p className="whitespace-pre-line text-sm leading-7 tracking-[0.08em] text-black md:text-base">
                        {t("references.intro")}
                    </p>

                    <BlogReferences groups={referenceGroups} />
                </div>
            </section>

            <section className="mx-auto w-full max-w-[1280px] px-5 py-10 md:px-18 md:py-12">
                <BlogPostGrid posts={posts} />
            </section>
        </div>
    );
}
