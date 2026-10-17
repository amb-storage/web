"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import FuzzyText from "@/components/FuzzyText/FuzzyText";
import { useNotFoundAnimation } from "./useNotFoundAnimation";

export default function NotFoundContent() {
    const t = useTranslations("notFound");
    const { contentRef, handleButtonEnter, handleButtonLeave } =
        useNotFoundAnimation();

    return (
        <section className="flex min-h-[70svh] w-full items-center justify-center bg-white px-4 py-16">
            <div
                ref={contentRef}
                className="flex max-w-xl flex-col items-center text-center"
            >
                <div className="text-[#1B3B2B]">
                    <FuzzyText
                        fontSize="clamp(5rem, 18vw, 11rem)"
                        fontWeight={700}
                        baseIntensity={0.15}
                        hoverIntensity={0.45}
                        transitionDuration={8}
                        glitchMode
                        glitchInterval={3000}
                        intro
                    >
                        404
                    </FuzzyText>
                </div>
                <p className="not-found-reveal mt-4 translate-y-6 text-xs font-semibold tracking-[0.3em] text-gray-500 opacity-0">
                    {t("eyebrow")}
                </p>
                <h1 className="not-found-reveal mt-3 translate-y-6 text-2xl font-bold tracking-tight text-[#1B3B2B] opacity-0 md:text-3xl">
                    {t("title")}
                </h1>
                <p className="not-found-reveal mt-4 translate-y-6 text-sm leading-7 text-gray-700 opacity-0 md:text-base">
                    {t("description")}
                </p>
                <div className="not-found-reveal mt-8 flex translate-y-6 flex-col gap-3 opacity-0 sm:flex-row">
                    <Link
                        href="/"
                        onMouseEnter={handleButtonEnter}
                        onMouseLeave={handleButtonLeave}
                        className="bg-[#1B3B2B] px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#12271d]"
                    >
                        {t("backHome")}
                    </Link>
                    <Link
                        href="/shop"
                        onMouseEnter={handleButtonEnter}
                        onMouseLeave={handleButtonLeave}
                        className="border border-[#1B3B2B] px-8 py-3 text-sm font-semibold text-[#1B3B2B] transition-colors hover:bg-gray-50"
                    >
                        {t("shopNow")}
                    </Link>
                </div>
            </div>
        </section>
    );
}
