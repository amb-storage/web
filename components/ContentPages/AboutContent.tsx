import { useTranslations } from "next-intl";
import RichText from "@/components/RichText/RichText";
import { Link } from "@/i18n/navigation";
import type { AboutContent as AboutContentData } from "@/lib/storefront";
import type { ApiRichTextDocument } from "@/lib/api/types";

type AboutSection = {
  id: string;
  title: string;
  body?: ApiRichTextDocument;
  details?: { id: string; label: string; value: string }[];
  values?: { id: string; title: string; body: string }[];
};

const richTextClassName =
  "mt-5 space-y-5 text-sm leading-8 text-gray-700 md:text-base [&_a]:text-(--brand-green) [&_a]:underline [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_strong]:text-black";

interface AboutContentProps {
  // `GET /content/about`
  about: AboutContentData;
}

export default function AboutContent({ about }: AboutContentProps) {
  const t = useTranslations("contentPages.about");
  // Thứ tự section cố định theo layout trang; tiêu đề nào CMS không có thì lấy từ messages
  const sections: AboutSection[] = [
    { id: "company", title: t("sections.company"), details: about.companyOverview },
    {
      id: "philosophy",
      title: about.brandPhilosophy.heading ?? t("sections.philosophy"),
      body: about.brandPhilosophy.body,
    },
    { id: "mission", title: t("sections.mission"), body: about.mission },
    { id: "vision", title: t("sections.vision"), body: about.vision },
    {
      id: "values",
      title: t("sections.values"),
      values: [...about.coreValues]
        .sort((a, b) => a.position - b.position)
        .map((value, index) => ({ ...value, title: `${index + 1}. ${value.title}` })),
    },
    { id: "promise", title: t("sections.promise"), body: about.promise },
    { id: "knowledge", title: t("sections.knowledge"), body: about.knowledgeCommunity },
    {
      id: "contact",
      title: about.contact.heading ?? t("sections.contact"),
      body: about.contact.body,
    },
  ];

  return (
    <div className="mx-auto w-full max-w-5xl px-4 pb-20 md:px-10 md:pb-28">
      <div className="divide-y divide-gray-200 border-t border-gray-200">
        {sections.map((section) => (
          <section key={section.id} className="scroll-mt-24 py-10 md:py-14">
            <h2 className="text-2xl font-bold text-(--brand-green) md:text-3xl">{section.title}</h2>
            {section.details && section.details.length > 0 && (
              // Bảng 会社概要: desktop chia 2 cột nhãn | nội dung cho thẳng hàng, mobile xếp dọc
              <dl className="mt-6 divide-y divide-gray-100 border-y border-gray-100 text-sm leading-7 text-gray-700 md:text-base md:leading-8">
                {section.details.map((detail) => (
                  <div key={detail.id} className="py-4 md:grid md:grid-cols-[12rem_1fr] md:gap-x-8">
                    <dt className="font-semibold text-black">{detail.label}</dt>
                    <dd className="mt-1 whitespace-pre-line md:mt-0">{detail.value}</dd>
                  </div>
                ))}
              </dl>
            )}
            {section.body && <RichText document={section.body} className={richTextClassName} />}
            {section.id === "contact" && (
              // Mục お問い合わせ dẫn sang form liên hệ
              <Link
                href="/contact"
                className="mt-6 inline-block bg-(--brand-green) px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#14382c]"
              >
                {t("contactForm")}
              </Link>
            )}
            {section.values && (
              <div className="mt-6 space-y-5 text-sm leading-8 text-gray-700 md:text-base">
                {section.values.map((value) => (
                  <div key={value.id}>
                    <h3 className="font-semibold text-black">{value.title}</h3>
                    {/* Thụt vào thẳng với chữ sau số thứ tự "1. " */}
                    <p className="pl-[1.25em]">{value.body}</p>
                  </div>
                ))}
              </div>
            )}
          </section>
        ))}
      </div>
      <a href="#top" className="mt-8 block text-center text-sm text-(--brand-green) underline underline-offset-4">
        {t("backToTop")}
      </a>
    </div>
  );
}
