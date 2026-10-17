"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import LanguageFlag from "./LanguageFlag";
import { useLanguageSwitcher } from "./useLanguageSwitcher";

interface LanguageSwitcherProps {
    onSwitch?: () => void;
    className?: string;
    flagClassName?: string;
}

export default function LanguageSwitcher({
    onSwitch,
    className,
    flagClassName = "h-4 w-6",
}: LanguageSwitcherProps) {
    const t = useTranslations("homepage.header.language");
    const { locale, locales, isPending, switchTo } = useLanguageSwitcher();

    return (
        <div
            role="group"
            aria-label={t("switch", { current: t(locale) })}
            className={cn(
                "flex items-center gap-2",
                isPending && "opacity-60",
                className,
            )}
        >
            {locales.map((code) => {
                const isActive = locale === code;

                return (
                    <button
                        key={code}
                        type="button"
                        lang={code}
                        onClick={() => {
                            switchTo(code);
                            onSwitch?.();
                        }}
                        aria-pressed={isActive}
                        aria-label={t(code)}
                        title={t(code)}
                        disabled={isPending}
                        className={cn(
                            "rounded-sm p-0.5 ring-1 transition-[opacity,filter,box-shadow] duration-200",
                            isActive
                                ? "ring-gray-300"
                                : "opacity-50 ring-transparent grayscale hover:opacity-100 hover:grayscale-0",
                        )}
                    >
                        <LanguageFlag
                            code={code}
                            className={cn(
                                "block rounded-[2px] shadow-[0_0_0_1px_rgba(0,0,0,0.08)]",
                                flagClassName,
                            )}
                        />
                    </button>
                );
            })}
        </div>
    );
}
