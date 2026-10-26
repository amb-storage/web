import { useTranslations } from "next-intl";
import type { PolicyContent as PolicyContentData } from "@/lib/storefront";

interface PolicyContentProps {
    // Toàn bộ chính sách từ `GET /content/policies` (+ chi tiết từng slug), gộp thành 1 trang
    policies: PolicyContentData[];
}

export default function PolicyContent({ policies }: PolicyContentProps) {
    const t = useTranslations("contentPages.policy");
    // anchorKey có thể trùng giữa các chính sách → ghép slug để id trên trang là duy nhất
    const sections = policies.flatMap((policy) =>
        policy.sections.map((section, index) => ({
            ...section,
            anchor: `${policy.slug}-${section.anchorKey}`,
            // Section đầu tiên của mỗi chính sách nhận thêm anchor = slug (link từ trang sản phẩm)
            policyAnchor: index === 0 ? policy.slug : undefined,
        })),
    );

    return (
        <div className="mx-auto w-full max-w-5xl px-4 pb-20 md:px-10 md:pb-28 mt-5">
            <section
                className="bg-[#eef5f0] px-5 py-8 md:px-10"
                aria-labelledby="policy-menu-title"
            >
                <h2
                    id="policy-menu-title"
                    className="text-2xl font-bold text-(--brand-green) md:text-3xl"
                >
                    {t("menu")}
                </h2>
                <ol className="mt-5 space-y-2 text-sm leading-7 text-gray-700 md:text-base">
                    {sections.map((section, index) => (
                        <li key={section.anchor} className="flex items-baseline gap-1">
                            <span className="w-8 shrink-0 tabular-nums">{index + 1}.</span>
                            <a
                                className="underline-offset-4 transition-colors hover:text-(--brand-green) hover:underline"
                                href={`#${section.anchor}`}
                            >
                                {section.title}
                            </a>
                        </li>
                    ))}
                </ol>
            </section>

            <div className="mt-10 divide-y divide-gray-200 border-t border-gray-200">
                {sections.map((section) => (
                    <section
                        key={section.anchor}
                        id={section.anchor}
                        className="scroll-mt-24 py-5 md:py-8"
                    >
                        {section.policyAnchor && (
                            <span id={section.policyAnchor} className="block scroll-mt-24" />
                        )}
                        <h2 className="text-2xl font-bold text-(--brand-green) md:text-3xl">
                            {section.title}
                        </h2>
                        <div className="mt-5 space-y-4 text-sm leading-8 text-gray-700 md:text-base">
                            {section.paragraphs.map((paragraph) => (
                                <p key={paragraph}>{paragraph}</p>
                            ))}
                            {section.bullets.length > 0 && (
                                <ul className="list-disc space-y-2 pl-5">
                                    {section.bullets.map((bullet) => (
                                        <li key={bullet}>{bullet}</li>
                                    ))}
                                </ul>
                            )}
                            {section.details.map((detail) => (
                                <div key={detail.id} className="space-y-2">
                                    {detail.title && (
                                        <h3 className="font-semibold text-black">{detail.title}</h3>
                                    )}
                                    {detail.paragraphs.map((paragraph) => (
                                        <p key={paragraph}>{paragraph}</p>
                                    ))}
                                    {detail.bullets.length > 0 && (
                                        <ul className="list-disc space-y-2 pl-5">
                                            {detail.bullets.map((bullet) => (
                                                <li key={bullet}>{bullet}</li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            ))}
                            {section.notes.map((note) => <p key={note}>{note}</p>)}
                        </div>
                    </section>
                ))}
            </div>
        </div>
    );
}
