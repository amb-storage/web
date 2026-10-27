import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import CustomerVoiceCard from "@/components/CustomerVoiceCard/CustomerVoiceCard";
import { storefrontRepository } from "@/lib/storefront/api-storefront";
import type { Locale } from "@/lib/storefront";

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations("customerVoicePage");
    return { title: t("title"), description: t("intro") };
}

// Toàn bộ đánh giá trong khối Customer Voice của trang Home (admin: Trang website → Trang chủ)
export default async function CustomerVoicePage() {
    const t = await getTranslations("customerVoicePage");
    const home = await storefrontRepository.getHomepage((await getLocale()) as Locale);
    const voices = home?.customerVoices ?? [];

    return (
        <div className="w-full bg-[#ebedef]">
            <header className="flex min-h-[200px] flex-col items-center justify-center bg-[#eef5f0] px-4 py-12 text-center">
                <h1 className="font-stencil text-5xl font-bold uppercase leading-none tracking-[0.03em] text-(--brand-green) sm:text-6xl md:text-7xl">
                    {t("title")}
                </h1>
                <p className="mt-5 max-w-2xl text-sm leading-7 tracking-[0.06em] text-black md:text-base">
                    {t("intro")}
                </p>
            </header>

            <section className="mx-auto w-full max-w-7xl px-4 py-12 md:px-8 md:py-16">
                {voices.length === 0 ? (
                    <div className="py-16 text-center">
                        <p className="text-gray-600">{t("empty")}</p>
                        <Link
                            href="/shop"
                            className="mt-4 inline-block font-semibold text-(--brand-green) underline underline-offset-4"
                        >
                            {t("backToShop")}
                        </Link>
                    </div>
                ) : (
                    <>
                        <p className="mb-6 text-xs font-medium text-black/55">
                            {t("count", { count: voices.length })}
                        </p>
                        <div className="grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3 md:gap-8">
                            {voices.map((voice, index) => (
                                <CustomerVoiceCard key={voice.id} voice={voice} index={index} />
                            ))}
                        </div>
                    </>
                )}
            </section>
        </div>
    );
}
