"use client";

import { useTransition } from "react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

type Locale = (typeof routing.locales)[number];

// Đổi ngôn ngữ nhưng giữ nguyên trang + query hiện tại; router của next-intl tự ghi cookie NEXT_LOCALE
// nên lần sau vào lại site sẽ nhớ lựa chọn này (ưu tiên hơn detect theo IP trong proxy.ts)
export function useLanguageSwitcher() {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const switchTo = (nextLocale: Locale) => {
    if (nextLocale === locale) return;

    startTransition(() => {
      router.replace(`${pathname}${window.location.search}`, {
        locale: nextLocale,
        scroll: false,
      });
    });
  };

  return { locale, locales: routing.locales, isPending, switchTo };
}
