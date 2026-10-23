import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import RichText from "@/components/RichText/RichText";
import type { StorySection } from "@/lib/storefront/types";
import type { ApiCta, ApiMediaSummary } from "@/lib/api/types";
import { cn } from "@/lib/utils";

const richTextClassName =
    "text-[13px] tracking-[0.1em] [&_a]:text-(--brand-green) [&_a]:underline [&_h2]:mb-4 [&_h2]:mt-0 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:leading-tight [&_h2]:text-(--brand-green) [&_h3]:mb-3 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-(--brand-green) [&_li]:mb-2 [&_p]:mb-6 [&_p]:leading-[1.45] [&_p]:text-gray-900 [&_strong]:font-semibold [&_strong]:text-gray-900 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_blockquote]:border-l-2 [&_blockquote]:border-(--brand-green) [&_blockquote]:pl-4";

const widthClass = {
    NARROW: "max-w-xl",
    STANDARD: "max-w-2xl",
    WIDE: "max-w-4xl",
} as const;

const spacingClass = {
    SMALL: "py-4",
    MEDIUM: "py-8",
    LARGE: "py-12",
} as const;

function SectionImage({ media, alt }: { media: ApiMediaSummary; alt?: string | null }) {
    return (
        <Image
            src={media.url}
            alt={alt ?? media.alt ?? ""}
            width={media.width ?? 1080}
            height={media.height ?? 1350}
            className="h-auto w-full object-cover"
        />
    );
}

function CtaLink({ cta }: { cta: ApiCta }) {
    const className = cn(
        "inline-flex min-h-10 items-center justify-center px-5 text-sm font-semibold transition-colors",
        cta.variant === "PRIMARY" &&
            "bg-(--brand-green) text-white hover:bg-(--brand-green-dark)",
        cta.variant === "SECONDARY" &&
            "border-2 border-(--brand-green) text-(--brand-green) hover:bg-(--brand-green) hover:text-white",
        cta.variant === "TEXT" && "px-0 text-(--brand-green) underline underline-offset-4",
    );
    return cta.target === "NEW_TAB" ? (
        <a href={cta.href} target="_blank" rel="noopener noreferrer" className={className}>
            {cta.label}
        </a>
    ) : (
        <Link href={cta.href} className={className}>
            {cta.label}
        </Link>
    );
}

function ContactSection({
    section,
}: {
    section: Extract<StorySection, { type: "CONTACT" }>;
}) {
    const t = useTranslations("blog.contact");

    return (
        <section className="bg-white px-5 py-10 md:px-8 md:py-12">
            <div className="mx-auto grid max-w-4xl gap-10 md:grid-cols-[0.95fr_1.05fr] md:gap-12">
                <div>
                    <h2 className="max-w-sm text-2xl font-bold leading-[1.2] text-(--brand-green)">
                        {section.heading}
                    </h2>
                    <RichText
                        document={section.body}
                        className="mt-5 max-w-sm text-[13px] leading-[1.55] tracking-[0.06em] text-gray-900 [&_p]:mb-5"
                    />
                </div>
                <div className="grid gap-3">
                    <label className="sr-only" htmlFor="blog-contact-name">
                        {t("name")}
                    </label>
                    <input
                        id="blog-contact-name"
                        placeholder={`${t("name")} *`}
                        className="h-10 border border-[#a8a8a8] bg-white px-3 text-sm outline-none placeholder:text-gray-500 focus:border-(--brand-green)"
                    />
                    <label className="sr-only" htmlFor="blog-contact-email">
                        {t("email")}
                    </label>
                    <input
                        id="blog-contact-email"
                        type="email"
                        placeholder={`${t("email")} *`}
                        className="h-10 border border-[#a8a8a8] bg-white px-3 text-sm outline-none placeholder:text-gray-500 focus:border-(--brand-green)"
                    />
                    <label className="sr-only" htmlFor="blog-contact-title">
                        {t("title")}
                    </label>
                    <input
                        id="blog-contact-title"
                        placeholder={t("title")}
                        className="h-10 border border-[#a8a8a8] bg-white px-3 text-sm outline-none placeholder:text-gray-500 focus:border-(--brand-green)"
                    />
                    <label className="sr-only" htmlFor="blog-contact-message">
                        {t("message")}
                    </label>
                    <textarea
                        id="blog-contact-message"
                        rows={4}
                        placeholder={t("messagePlaceholder")}
                        className="resize-none border border-[#a8a8a8] bg-white px-3 py-3 text-sm outline-none placeholder:text-gray-500 focus:border-(--brand-green)"
                    />
                    <p className="mt-2 text-[10px] leading-4 tracking-[0.04em] text-gray-500">
                        {t("recaptcha")}
                    </p>
                    <button
                        type="button"
                        className="w-fit bg-[#a9c8b0] px-5 py-2 text-sm text-white"
                    >
                        {t("send")}
                    </button>
                </div>
            </div>
        </section>
    );
}

// Render các section CMS của Story (`GET /stories/:slug`); loại section chỉ dành cho page khác thì bỏ qua
export function BlogPostContent({ sections }: { sections: StorySection[] }) {
    return (
        <div className="overflow-hidden">
            {sections.map((section) => {
                switch (section.type) {
                    case "CONTACT":
                        return <ContactSection key={section.id} section={section} />;
                    case "RICH_TEXT":
                        return (
                            <section key={section.id} className="bg-white py-8 md:py-12">
                                <div className={cn("mx-auto px-5", widthClass[section.width])}>
                                    <RichText document={section.body} className={richTextClassName} />
                                </div>
                            </section>
                        );
                    case "IMAGE":
                        return (
                            <section key={section.id} className="bg-[#eff5f0] px-5 py-8 md:py-12">
                                <div className={cn("mx-auto", widthClass[section.width])}>
                                    <SectionImage media={section.media} alt={section.alt} />
                                </div>
                            </section>
                        );
                    case "IMAGE_WITH_TEXT":
                        return (
                            <section
                                key={section.id}
                                className="bg-[#eff5f0] px-5 py-8 md:px-8 md:py-12"
                            >
                                <div className="mx-auto grid max-w-4xl items-center gap-8 md:grid-cols-2 md:gap-12">
                                    <div
                                        className={cn(
                                            "overflow-hidden",
                                            section.imagePosition === "RIGHT" && "md:order-2",
                                        )}
                                    >
                                        <SectionImage media={section.media} />
                                    </div>
                                    <div
                                        className={cn(
                                            "flex flex-col gap-4",
                                            section.imagePosition === "RIGHT" && "md:order-1",
                                            section.alignment === "CENTER" && "items-center text-center",
                                            section.alignment === "RIGHT" && "items-end text-right",
                                        )}
                                    >
                                        {section.content.map((item, index) =>
                                            item.type === "RICH_TEXT" ? (
                                                <RichText
                                                    key={index}
                                                    document={item.body}
                                                    className={richTextClassName}
                                                />
                                            ) : (
                                                <CtaLink key={index} cta={item.cta} />
                                            ),
                                        )}
                                    </div>
                                </div>
                            </section>
                        );
                    case "GALLERY":
                        return (
                            <section key={section.id} className="bg-white px-5 py-8 md:py-12">
                                <div className="mx-auto grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2">
                                    {section.media.map((media) => (
                                        <SectionImage key={media.id} media={media} />
                                    ))}
                                </div>
                            </section>
                        );
                    case "QUOTE":
                        return (
                            <section key={section.id} className="bg-white px-5 py-8 md:py-12">
                                <figure className="mx-auto max-w-2xl border-l-2 border-(--brand-green) pl-5">
                                    <blockquote className="text-lg leading-relaxed text-gray-900">
                                        {section.text}
                                    </blockquote>
                                    {section.attribution && (
                                        <figcaption className="mt-3 text-sm text-gray-500">
                                            {section.attribution}
                                        </figcaption>
                                    )}
                                </figure>
                            </section>
                        );
                    case "DIVIDER":
                        return (
                            <div key={section.id} className={cn("bg-white px-5", spacingClass[section.spacing])}>
                                <hr className="mx-auto max-w-2xl border-gray-200" />
                            </div>
                        );
                    case "SPACER":
                        return <div key={section.id} className={cn("bg-white", spacingClass[section.spacing])} />;
                    default:
                        return null;
                }
            })}
        </div>
    );
}
