import { getLocale } from "next-intl/server";
import AboutUsHeader from "@/components/ContentPages/AboutUsHeader";
import AboutContent from "@/components/ContentPages/AboutContent";

export default async function AboutPage() {
  const locale = await getLocale();

  return (
    <article id="top" className="w-full">
      <AboutUsHeader activeTab="about" />
      <AboutContent locale={locale} />
    </article>
  );
}
