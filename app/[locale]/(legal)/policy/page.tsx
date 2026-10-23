import { getLocale } from "next-intl/server";
import PolicyContent from "@/components/ContentPages/PolicyContent";
import { storefrontRepository } from "@/lib/storefront/api-storefront";
import type { Locale } from "@/lib/storefront";

export default async function PolicyPage() {
  const policies = await storefrontRepository.getPolicies((await getLocale()) as Locale);

  return <PolicyContent policies={policies} />;
}
