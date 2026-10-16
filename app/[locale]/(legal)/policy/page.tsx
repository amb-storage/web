import { getLocale } from "next-intl/server";
import PolicyContent from "@/components/ContentPages/PolicyContent";

export default async function PolicyPage() {
  const locale = await getLocale();

  return <PolicyContent locale={locale} />;
}
