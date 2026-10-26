import { useTranslations } from "next-intl";
import RichText from "@/components/RichText/RichText";
import type { ApiPolicySection, ApiRichTextDocument } from "@/lib/api/types";
import type { PolicyContent as PolicyContentData } from "@/lib/storefront";

interface PolicyContentProps {
    // Toàn bộ chính sách từ `GET /content/policies` (+ chi tiết từng slug), gộp thành 1 trang
    policies: PolicyContentData[];
}

// Mỗi mục trong menu + nội dung: section của policy dạng cũ, hoặc nguyên một policy rich text
type PolicyEntry =
    | { kind: "section"; anchor: string; title: string; policyAnchor?: string; section: ApiPolicySection }
    | { kind: "richText"; anchor: string; title: string; body: ApiRichTextDocument };

const richTextClassName =
    "mt-5 space-y-4 text-sm leading-8 text-gray-700 md:text-base [&_a]:text-(--brand-green) [&_a]:underline [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-black [&_h3]:mt-6 [&_h3]:font-semibold [&_h3]:text-black [&_h4]:font-semibold [&_h4]:text-black [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-5 [&_strong]:text-black";

function toEntries(policies: PolicyContentData[]): PolicyEntry[] {
    return policies.flatMap((policy): PolicyEntry[] => {
        // Policy soạn bằng editor rich text: 1 mục, anchor = slug (link `/policy#<slug>` từ trang sản phẩm)
        if (policy.kind === "richText") {
            return [{ kind: "richText", anchor: policy.slug, title: policy.title, body: policy.body }];
        }
        // anchorKey có thể trùng giữa các chính sách → ghép slug để id trên trang là duy nhất
        return policy.sections.map((section, index) => ({
            kind: "section",
            anchor: `${policy.slug}-${section.anchorKey}`,
            title: section.title,
            // Section đầu tiên của mỗi chính sách nhận thêm anchor = slug
            policyAnchor: index === 0 ? policy.slug : undefined,
            section,
        }));
    });
}

function PolicySectionBody({ section }: { section: ApiPolicySection }) {
    return (
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
                    {detail.title && <h3 className="font-semibold text-black">{detail.title}</h3>}
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
            {section.notes.map((note) => (
                <p key={note}>{note}</p>
            ))}
        </div>
    );
}

export default function PolicyContent({ policies }: PolicyContentProps) {
    const t = useTranslations("contentPages.policy");
    const entries = toEntries(policies);

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
                    {entries.map((entry, index) => (
                        <li key={entry.anchor} className="flex items-baseline gap-1">
                            <span className="w-8 shrink-0 tabular-nums">{index + 1}.</span>
                            <a
                                className="underline-offset-4 transition-colors hover:text-(--brand-green) hover:underline"
                                href={`#${entry.anchor}`}
                            >
                                {entry.title}
                            </a>
                        </li>
                    ))}
                </ol>
            </section>

            <div className="mt-10 divide-y divide-gray-200 border-t border-gray-200">
                {entries.map((entry) => (
                    <section
                        key={entry.anchor}
                        id={entry.anchor}
                        className="scroll-mt-24 py-5 md:py-8"
                    >
                        {entry.kind === "section" && entry.policyAnchor && (
                            <span id={entry.policyAnchor} className="block scroll-mt-24" />
                        )}
                        <h2 className="text-2xl font-bold text-(--brand-green) md:text-3xl">
                            {entry.title}
                        </h2>
                        {entry.kind === "richText" ? (
                            <RichText document={entry.body} className={richTextClassName} />
                        ) : (
                            <PolicySectionBody section={entry.section} />
                        )}
                    </section>
                ))}
            </div>
        </div>
    );
}
