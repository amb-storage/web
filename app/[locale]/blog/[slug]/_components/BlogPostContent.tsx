import Image from "next/image";
import type { Locale, StoryContentSection } from "@/lib/storefront/types";

const richTextClassName =
    "text-[13px] tracking-[0.1em] [&_a]:text-(--brand-green) [&_a]:underline [&_h2]:mb-4 [&_h2]:mt-0 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:leading-tight [&_h2]:text-(--brand-green) [&_li]:mb-2 [&_p]:mb-6 [&_p]:leading-[1.45] [&_p]:text-gray-900 [&_strong]:font-semibold [&_strong]:text-gray-900 [&_ul]:list-disc [&_ul]:pl-5";

function StoryHtml({ html }: { html: string }) {
    return (
        <div
            className={richTextClassName}
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
}

function ContactSection({
    section,
    locale,
}: {
    section: Extract<StoryContentSection, { type: "contact" }>;
    locale: Locale;
}) {
    return (
        <section className="bg-white px-5 py-10 md:px-8 md:py-12">
            <div className="mx-auto grid max-w-4xl gap-10 md:grid-cols-[0.95fr_1.05fr] md:gap-12">
                <div>
                    <h2 className="max-w-sm text-2xl font-bold leading-[1.2] text-(--brand-green)">
                        {section.title[locale]}
                    </h2>
                    <p className="mt-5 max-w-sm text-[13px] leading-[1.55] tracking-[0.06em] text-gray-900">
                        {section.description[locale]}
                    </p>
                    <p className="mt-5 max-w-sm text-[13px] leading-[1.55] tracking-[0.06em] text-gray-900">
                        {locale === "ja"
                            ? "以下の情報を入力してください。お見積りはできるだけ早くご返信いたします。"
                            : "Please enter the information below. We will get back to you as soon as possible."}
                    </p>
                </div>
                <div className="grid gap-3">
                    <label className="sr-only" htmlFor="blog-contact-name">
                        {locale === "ja" ? "氏名" : "Name"}
                    </label>
                    <input
                        id="blog-contact-name"
                        placeholder={locale === "ja" ? "氏名 *" : "Name *"}
                        className="h-10 border border-[#a8a8a8] bg-white px-3 text-sm outline-none placeholder:text-gray-500 focus:border-(--brand-green)"
                    />
                    <label className="sr-only" htmlFor="blog-contact-email">
                        {locale === "ja" ? "メールアドレス" : "Email"}
                    </label>
                    <input
                        id="blog-contact-email"
                        type="email"
                        placeholder={
                            locale === "ja" ? "メールアドレス *" : "Email *"
                        }
                        className="h-10 border border-[#a8a8a8] bg-white px-3 text-sm outline-none placeholder:text-gray-500 focus:border-(--brand-green)"
                    />
                    <label className="sr-only" htmlFor="blog-contact-title">
                        {locale === "ja" ? "タイトル" : "Title"}
                    </label>
                    <input
                        id="blog-contact-title"
                        placeholder={locale === "ja" ? "タイトル" : "Title"}
                        className="h-10 border border-[#a8a8a8] bg-white px-3 text-sm outline-none placeholder:text-gray-500 focus:border-(--brand-green)"
                    />
                    <label className="sr-only" htmlFor="blog-contact-message">
                        {locale === "ja" ? "メッセージ" : "Message"}
                    </label>
                    <textarea
                        id="blog-contact-message"
                        rows={4}
                        placeholder={
                            locale === "ja"
                                ? "その他、重要と思われる情報がございましたら、ご教示いただけますと幸いです。 *"
                                : "Please share any other important information. *"
                        }
                        className="resize-none border border-[#a8a8a8] bg-white px-3 py-3 text-sm outline-none placeholder:text-gray-500 focus:border-(--brand-green)"
                    />
                    <p className="mt-2 text-[10px] leading-4 tracking-[0.04em] text-gray-500">
                        {locale === "ja"
                            ? "このフォームはreCAPTCHAによって保護されており、Googleの個人情報保護方針および利用規約が適用されます。"
                            : "This form is protected by reCAPTCHA and Google's Privacy Policy and Terms of Service apply."}
                    </p>
                    <button
                        type="button"
                        className="w-fit bg-[#a9c8b0] px-5 py-2 text-sm text-white"
                    >
                        {locale === "ja" ? "送信" : "Send"}
                    </button>
                </div>
            </div>
        </section>
    );
}

export function BlogPostContent({
    sections,
    locale,
}: {
    sections: StoryContentSection[];
    locale: Locale;
}) {
    return (
        <div className="overflow-hidden">
            {sections.map((section, index) => {
                if (section.type === "contact") {
                    return (
                        <ContactSection
                            key={`contact-${index}`}
                            section={section}
                            locale={locale}
                        />
                    );
                }

                const toneClass =
                    section.tone === "muted" ? "bg-[#eff5f0]" : "bg-white";

                if (section.type === "richText") {
                    return (
                        <section
                            key={`text-${index}`}
                            className={`${toneClass} py-8 md:py-12 `}
                        >
                            <div className="mx-auto max-w-2xl px-5 ">
                                <StoryHtml html={section.contentHtml[locale]} />
                            </div>
                        </section>
                    );
                }

                return (
                    <section
                        key={`image-text-${index}`}
                        className={`${toneClass} px-5 py-8 md:px-8 md:py-12 `}
                    >
                        <div className="max-w-4xl mx-auto grid items-center gap-8 md:grid-cols-2 md:gap-12">
                            <div
                                className={`overflow-hidden ${section.reverse ? "md:order-2" : ""}`}
                            >
                                <Image
                                    src={section.image}
                                    alt={
                                        locale === "ja"
                                            ? "CWUフライトジャケットの資料写真"
                                            : "CWU flight jacket reference image"
                                    }
                                    width={1080}
                                    height={1350}
                                    className="h-auto w-full object-cover"
                                />
                            </div>
                            <div
                                className={section.reverse ? "md:order-1" : ""}
                            >
                                <StoryHtml html={section.contentHtml[locale]} />
                            </div>
                        </div>
                    </section>
                );
            })}
        </div>
    );
}
