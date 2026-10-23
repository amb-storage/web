"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { formatMoney } from "@/lib/storefront";
import { useCart } from "@/components/Cart/useCart";
import { cartErrorKey } from "@/components/Cart/cartApi";
import { useCartCheckout } from "./useCartCheckout";

interface CartViewProps {
    checkoutStatus?: "success" | "cancel" | null;
}

export default function CartView({ checkoutStatus = null }: CartViewProps) {
    const t = useTranslations("cart");
    const { items, subtotal, remove, hydrated, pending, errorCode } = useCart();
    const { email, setEmail, handleSubmit } = useCartCheckout();
    const hasUnavailable = items.some((item) => item.status !== "ELIGIBLE");

    return (
        <div className="mx-auto w-full max-w-5xl px-4 py-12 md:px-8">
            <h1 className="text-3xl font-bold text-(--brand-green)">
                {t("title")}
            </h1>

            {checkoutStatus && (
                <p
                    role="status"
                    className="mt-6 border border-gray-200 bg-[#eef5f0] px-4 py-3 text-sm text-gray-700"
                >
                    {t(`checkoutStatus.${checkoutStatus}`)}
                </p>
            )}

            {!hydrated ? (
                <p className="mt-10 text-gray-500">{t("loading")}</p>
            ) : items.length === 0 ? (
                <div className="mt-10 border-t border-gray-200 pt-8">
                    <p className="text-gray-600">{t("empty")}</p>
                    <Link
                        href="/shop"
                        className="mt-4 inline-block font-semibold text-(--brand-green) underline underline-offset-4"
                    >
                        {t("continueShopping")}
                    </Link>
                </div>
            ) : (
                <>
                    <div className="mt-8 divide-y divide-gray-200 border-y border-gray-200">
                        {items.map((item) => (
                            <div key={item.productId} className="flex gap-4 py-5">
                                <Link
                                    href={item.slug ? `/shop/${item.slug}` : "/shop"}
                                    className="relative h-28 w-24 shrink-0 bg-gray-50"
                                >
                                    {item.image && (
                                        <Image
                                            src={item.image}
                                            alt={item.name ?? ""}
                                            fill
                                            sizes="96px"
                                            className="object-contain"
                                        />
                                    )}
                                </Link>
                                <div className="flex min-w-0 flex-1 flex-col justify-between">
                                    <div>
                                        <Link
                                            href={item.slug ? `/shop/${item.slug}` : "/shop"}
                                            className="font-medium text-gray-900 hover:text-(--brand-green)"
                                        >
                                            {item.name ?? t("unavailableItem")}
                                        </Link>
                                        <p className="mt-1 text-sm text-gray-500">
                                            {[item.size, item.quantity].filter(Boolean).join(" · ")}
                                        </p>
                                        {item.status !== "ELIGIBLE" && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {t("unavailable")}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex items-center justify-between gap-4">
                                        <p className="font-semibold">
                                            {item.lineTotal ? formatMoney(item.lineTotal) : "—"}
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() => remove(item.productId)}
                                            disabled={pending}
                                            className="text-sm text-gray-500 underline underline-offset-4 hover:text-black disabled:opacity-40"
                                        >
                                            {t("remove")}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="mt-8 ml-auto flex w-full max-w-sm flex-col gap-4"
                    >
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">{t("total")}</span>
                            <span className="text-lg font-semibold">
                                {formatMoney(subtotal)}
                            </span>
                        </div>
                        <label className="flex flex-col gap-2 text-sm">
                            <span className="font-medium">{t("email")}</span>
                            <input
                                type="email"
                                required
                                autoComplete="email"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                placeholder={t("emailPlaceholder")}
                                className="h-11 border border-gray-300 px-3 outline-none focus:border-(--brand-green)"
                            />
                        </label>
                        {hasUnavailable && (
                            <p className="text-sm text-red-600">{t("removeUnavailable")}</p>
                        )}
                        {errorCode && (
                            <p role="alert" className="text-sm text-red-600">
                                {t(cartErrorKey(errorCode))}
                            </p>
                        )}
                        <button
                            type="submit"
                            disabled={pending || hasUnavailable}
                            className="flex h-12 items-center justify-center bg-(--brand-green) px-4 text-sm font-medium text-white transition-colors hover:bg-(--brand-green-dark) disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {t("checkout", { amount: formatMoney(subtotal) })}
                        </button>
                    </form>
                </>
            )}
        </div>
    );
}
