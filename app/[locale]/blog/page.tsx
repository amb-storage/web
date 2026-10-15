import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { storefrontRepository } from "@/lib/storefront";

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
                    <h1 className="text-2xl font-bold uppercase tracking-[0.05em] text-(--brand-green) md:text-[40px]">
                        {t("pageTitle")}
                    </h1>
                    <p className="mt-4 whitespace-pre-line text-sm leading-7 tracking-[0.08em] text-black md:text-base">
                        {t("intro")}
                    </p>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                    {posts.map((post) => (
                        <article key={post.slug}>
                            <Link
                                href={`/blog/${post.slug}`}
                                className="group block"
                            >
                                <div className="relative aspect-3/4 w-full overflow-hidden bg-white">
                                    <Image
                                        src={post.coverImage}
                                        alt={post.title}
                                        fill
                                        sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                </div>
                                <h2 className="mt-4 h-18 line-clamp-2 md:mt-6 text-3xl font-bold text-(--brand-green)">
                                    {post.title}
                                </h2>
                                <span className="my-4 inline-block text-sm italic tracking-[0.08em] text-black underline underline-offset-4">
                                    {t("readMore")}
                                </span>
                            </Link>
                        </article>
                    ))}
                </div>
            </section>

            <section className="w-full bg-white">
                <div className="mx-auto w-full px-5 py-10 md:px-20 md:py-12">
                    <p className="whitespace-pre-line text-sm leading-7 tracking-[0.08em] text-black md:text-base">
                        {t("references.intro")}
                    </p>

                    <div className="mt-8 grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-16">
                        {referenceGroups.map((group) => (
                            <div key={group.title}>
                                <h2 className="text-xl font-bold text-(--brand-green)">
                                    {group.title}
                                </h2>
                                <ul className="list-none space-y-0.5 pl-5 text-sm font-semibold leading-6 tracking-[0.05em] text-black">
                                    {group.items.map((item) => (
                                        <li
                                            key={item}
                                            className="before:mr-2 before:content-['\2022']"
                                        >
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
