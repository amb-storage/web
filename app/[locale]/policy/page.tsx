import { getLocale } from "next-intl/server";
import AboutUsHeader from "@/components/ContentPages/AboutUsHeader";
import PolicyContent from "@/components/ContentPages/PolicyContent";

export default async function PolicyPage() {
  const locale = await getLocale();

  return (
    <article className="w-full">
      <AboutUsHeader activeTab="policy" />
      <PolicyContent locale={locale} />
    </article>
  );
}
