import { notFound } from "next/navigation";
import { getLocale } from "next-intl/server";
import AboutContent from "@/components/ContentPages/AboutContent";
import { storefrontRepository } from "@/lib/storefront/api-storefront";
import type { Locale } from "@/lib/storefront";

export default async function AboutPage() {
  const about = await storefrontRepository.getAbout((await getLocale()) as Locale);
  if (!about) notFound();

  return <AboutContent about={about} />;
}
