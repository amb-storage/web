import { getLocale, getTranslations } from "next-intl/server";
import { storefrontRepository } from "@/lib/storefront/api-storefront";
import type { Locale } from "@/lib/storefront";
import ContactForm from "./_components/ContactForm/ContactForm";
import ContactInfo from "./_components/ContactInfo/ContactInfo";

// Email dự phòng khi Store settings chưa có / API lỗi (đúng địa chỉ trên amb-storage.com)
const DEFAULT_EMAIL = "theambitionent@gmail.com";

export default async function ContactPage() {
    const locale = (await getLocale()) as Locale;
    const t = await getTranslations("contentPages.contact");
    // Trang liên hệ vẫn phải mở được khi API settings lỗi, nên không để lỗi này làm sập trang
    const settings = await storefrontRepository.getStoreSettings(locale).catch(() => null);
    const email = settings?.contactEmail ?? DEFAULT_EMAIL;

    return (
        <div className="mx-auto w-full max-w-5xl px-4 pb-20 md:px-10 md:pb-28">
            <section className="py-10 md:py-14">
                <h2 className="text-2xl font-bold text-(--brand-green) md:text-3xl">{t("title")}</h2>
                <p className="mt-5 max-w-3xl whitespace-pre-line text-sm leading-8 text-gray-700 md:text-base">
                    {t("intro")}
                </p>
            </section>
            <div className="grid gap-10 md:grid-cols-[1fr_300px]">
                <ContactForm fallbackEmail={email} />
                <ContactInfo email={email} />
            </div>
        </div>
    );
}
