import { getLocale } from "next-intl/server";
import AboutContent from "@/components/ContentPages/AboutContent";

export default async function AboutPage() {
  const locale = await getLocale();

  return <AboutContent locale={locale} />;
}
