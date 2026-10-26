"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { ShoppingBag, Trash2 } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { formatMoney } from "@/lib/storefront";
import { useCart } from "@/components/Cart/useCart";
import CheckoutForm from "../CheckoutForm/CheckoutForm";
import { useCartViewAnimation } from "./useCartViewAnimation";

const quantityButtonClass =
    "flex h-8 w-8 items-center justify-center bg-gray-100 text-lg text-gray-700 transition-colors hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-40";

export default function CartView() {
    const t = useTranslations("cart");
    const { items, count, updateQuantity, remove, hydrated, pending } = useCart();
    const { contentRef, handleRemove } = useCartViewAnimation(hydrated, items.length, remove);
    const hasUnavailable = items.some((item) => item.status !== "ELIGIBLE");

    return (
        <div ref={contentRef} className="mx-auto w-full max-w-5xl px-4 py-12 md:px-8">
            <h1 className="text-2xl font-bold tracking-tight text-(--brand-green) md:text-3xl">
                {hydrated && count > 0 ? t("titleWithCount", { count }) : t("title")}
            </h1>

            {!hydrated ? (
                // Khung xương trong lúc tải giỏ, giữ đúng bố cục dòng sản phẩm để không bị giật
                <div
                    role="status"
                    aria-label={t("loading")}
                    className="mt-8 divide-y divide-gray-200 border-y border-gray-200"
                >
                    {[0, 1].map((index) => (
                        <div key={index} className="flex animate-pulse gap-4 py-5">
                            <div className="h-28 w-24 shrink-0 bg-gray-100" />
                            <div className="flex flex-1 flex-col gap-3 pt-1">
                                <div className="h-4 w-2/3 bg-gray-100" />
                                <div className="h-3 w-1/4 bg-gray-100" />
                                <div className="mt-auto h-4 w-20 bg-gray-100" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : items.length === 0 ? (
                <div className="mt-8 flex flex-col items-center border-y border-gray-200 py-16 text-center">
                    <ShoppingBag aria-hidden className="h-12 w-12 text-gray-300" strokeWidth={1.5} />
                    <p className="mt-4 text-gray-600">{t("empty")}</p>
                    <Link
                        href="/shop"
                        className="mt-6 bg-(--brand-green) px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-(--brand-green-dark)"
                    >
                        {t("continueShopping")}
                    </Link>
                </div>
            ) : (
                <>
                    <div className="mt-8 border-t border-gray-200">
                        {items.map((item) => (
                            <div
                                key={item.productId}
                                data-cart-line={item.productId}
                                className="cart-reveal flex gap-4 overflow-hidden border-b border-gray-200 py-5"
                            >
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
                                <div className="flex min-w-0 flex-1 flex-col justify-between gap-3">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="min-w-0">
                                            <Link
                                                href={item.slug ? `/shop/${item.slug}` : "/shop"}
                                                className="font-medium text-gray-900 transition-colors hover:text-(--brand-green)"
                                            >
                                                {item.name ?? t("unavailableItem")}
                                            </Link>
                                            {item.size && (
                                                <p className="mt-1 text-sm text-gray-500">{item.size}</p>
                                            )}
                                            {item.status !== "ELIGIBLE" && (
                                                <p className="mt-1 text-sm text-red-600">
                                                    {t("unavailable")}
                                                </p>
                                            )}
                                        </div>
                                        <p className="shrink-0 font-semibold">
                                            {item.lineTotal ? formatMoney(item.lineTotal) : "—"}
                                        </p>
                                    </div>
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-3">
                                            <button
                                                type="button"
                                                onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                                disabled={pending || item.quantity <= 1}
                                                aria-label={t("decreaseQuantity")}
                                                className={quantityButtonClass}
                                            >
                                                −
                                            </button>
                                            <span className="min-w-4 text-center text-sm tabular-nums">
                                                {item.quantity}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                                disabled={pending || item.status !== "ELIGIBLE"}
                                                aria-label={t("increaseQuantity")}
                                                className={quantityButtonClass}
                                            >
                                                +
                                            </button>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => void handleRemove(item.productId)}
                                            disabled={pending}
                                            aria-label={`${t("remove")} ${item.name ?? ""}`}
                                            className="flex items-center gap-1.5 rounded p-1 text-sm text-gray-500 transition-colors hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-green) disabled:opacity-40"
                                        >
                                            <Trash2 aria-hidden className="h-4 w-4" />
                                            <span className="hidden sm:inline">{t("remove")}</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="cart-reveal">
                        <CheckoutForm hasUnavailable={hasUnavailable} />
                    </div>
                </>
            )}
        </div>
    );
}
