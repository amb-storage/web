"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { ArrowRight, ArrowUpRight, Quote } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { CustomerVoice } from "@/lib/storefront";
import { cn } from "@/lib/utils";
import { useCustomerVoiceCardAnimation } from "./useCustomerVoiceCardAnimation";

interface CustomerVoiceCardProps {
    voice: CustomerVoice;
    index?: number;
    // Trang chủ cắt bớt câu dài cho các thẻ cao bằng nhau; trang danh sách hiện đầy đủ
    clampQuote?: boolean;
}

export default function CustomerVoiceCard({
    voice,
    index = 0,
    clampQuote = false,
}: CustomerVoiceCardProps) {
    const t = useTranslations("homepage.customerVoice");
    const { cardRef, imgRef, iconRef, handleMouseEnter, handleMouseLeave } =
        useCustomerVoiceCardAnimation(index);

    return (
        <article
            ref={cardRef}
            className="flex h-full translate-y-8 flex-col overflow-hidden bg-white opacity-0 shadow-sm ring-1 ring-black/5"
        >
            <Link
                href={voice.href}
                aria-label={`${t("viewProduct")}: ${voice.productName}`}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className="relative block aspect-4/3 overflow-hidden bg-[#ebedef]"
            >
                <Image
                    ref={imgRef}
                    src={voice.image}
                    alt={voice.productName}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                    className="object-cover"
                />
                <span
                    ref={iconRef}
                    aria-hidden
                    className="absolute bottom-3 right-3 z-10 flex h-9 w-9 scale-0 items-center justify-center rounded-full bg-white/95 text-(--brand-green) opacity-0 shadow-lg"
                >
                    <ArrowUpRight className="h-4 w-4" />
                </span>
            </Link>

            <div className="flex flex-1 flex-col px-6 pb-6 pt-5">
                <Quote aria-hidden className="h-7 w-7 fill-current text-(--brand-green) opacity-20" />
                <blockquote
                    className={cn(
                        "mt-3 flex-1 whitespace-pre-line text-sm leading-7 tracking-[0.06em] text-gray-800",
                        clampQuote && "line-clamp-5",
                    )}
                >
                    {voice.quote}
                </blockquote>

                <footer className="mt-6 border-t border-gray-100 pt-4">
                    <p className="text-sm font-bold tracking-[0.08em] text-black">
                        {voice.name || t("anonymous")}
                    </p>
                    <Link
                        href={voice.href}
                        className="mt-1 inline-flex max-w-full items-center gap-1 text-xs text-gray-500 transition-colors hover:text-(--brand-green)"
                    >
                        <span className="truncate">{voice.productName}</span>
                        <ArrowRight aria-hidden className="h-3.5 w-3.5 shrink-0" />
                    </Link>
                </footer>
            </div>
        </article>
    );
}
