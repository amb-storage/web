"use client";

import { useTranslations } from "next-intl";
import { CheckCircle2, XCircle } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { toOrderNumber } from "@/components/Cart/checkoutStorage";
import { cn } from "@/lib/utils";
import { useCheckoutResult, type CheckoutResultStatus } from "./useCheckoutResult";

interface CheckoutResultProps {
    status: CheckoutResultStatus;
}

const revealClass = "checkout-result-reveal translate-y-6 opacity-0";

export default function CheckoutResult({ status }: CheckoutResultProps) {
    const t = useTranslations(`checkout.${status}`);
    const { contentRef, checkout } = useCheckoutResult(status);
    const isSuccess = status === "success";
    const Icon = isSuccess ? CheckCircle2 : XCircle;

    return (
        <section className="flex min-h-[70svh] w-full items-center justify-center bg-white px-4 py-16">
            <div ref={contentRef} className="flex w-full max-w-xl flex-col items-center text-center">
                <Icon
                    aria-hidden
                    className={cn(
                        revealClass,
                        "h-16 w-16",
                        isSuccess ? "text-(--brand-green)" : "text-red-600",
                    )}
                    strokeWidth={1.5}
                />
                <h1 className={cn(revealClass, "mt-6 text-2xl font-bold text-(--brand-green) md:text-3xl")}>
                    {t("title")}
                </h1>
                <p className={cn(revealClass, "mt-4 text-sm leading-7 text-gray-700 md:text-base")}>
                    {t("description")}
                </p>

                {isSuccess && checkout && (
                    <dl
                        className={cn(
                            revealClass,
                            "mt-8 w-full divide-y divide-gray-200 border-y border-gray-200 text-left text-sm",
                        )}
                    >
                        <div className="flex items-center justify-between gap-4 py-4">
                            <dt className="text-gray-600">{t("orderNumber")}</dt>
                            <dd className="font-mono text-base font-semibold tracking-wider text-black">
                                {toOrderNumber(checkout.orderId)}
                            </dd>
                        </div>
                        <div className="flex items-center justify-between gap-4 py-4">
                            <dt className="text-gray-600">{t("email")}</dt>
                            <dd className="break-all text-black">{checkout.email}</dd>
                        </div>
                    </dl>
                )}

                {isSuccess && (
                    <p className={cn(revealClass, "mt-4 text-xs leading-6 text-gray-500")}>
                        {t("note")}
                    </p>
                )}

                <div className={cn(revealClass, "mt-8 flex flex-col gap-3 sm:flex-row")}>
                    <Link
                        href={isSuccess ? "/shop" : "/cart"}
                        className="bg-(--brand-green) px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-(--brand-green-dark)"
                    >
                        {t("primaryAction")}
                    </Link>
                    <Link
                        href={isSuccess ? "/" : "/shop"}
                        className="border border-(--brand-green) px-8 py-3 text-sm font-semibold text-(--brand-green) transition-colors hover:bg-gray-50"
                    >
                        {t("secondaryAction")}
                    </Link>
                </div>
            </div>
        </section>
    );
}
