"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Trash2 } from "lucide-react";
import { products } from "@/data/mock";
import { formatMoney } from "@/lib/storefront";
import { useCart } from "./useCart";

export function CartPreview() {
    const locale = useLocale() as "ja" | "en";
    const t = useTranslations("cart");
    const { items: cartItems, count, add, remove, updateQuantity, hydrated } = useCart();
    const items = cartItems
        .map(({ productId, quantity }) => {
            const product = products.find((item) => item.id === productId);
            return product ? { product, quantity } : null;
        })
        .filter((item): item is { product: (typeof products)[number]; quantity: number } =>
            Boolean(item),
        );
    const total = items.reduce(
        (sum, { product, quantity }) => sum + product.price.amount * quantity,
        0,
    );

    return (
        <div className="invisible pointer-events-none absolute right-0 top-full z-[70] hidden w-[min(24rem,calc(100vw-2rem))] pt-3 opacity-0 transition-[opacity,transform,visibility] duration-200 ease-out group-hover:visible group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:pointer-events-auto group-focus-within:translate-y-0 group-focus-within:opacity-100 md:block">
            <div className="translate-y-2 bg-white px-6 pb-6 pt-5 text-black shadow-2xl ring-1 ring-black/5 transition-transform duration-200 group-hover:translate-y-0 group-focus-within:translate-y-0">
                {!hydrated ? (
                    <p className="py-10 text-center text-sm text-gray-500">
                        {t("loading")}
                    </p>
                ) : items.length === 0 ? (
                    <div className="min-h-46">
                        <h2 className="font-semibold text-xl">{t("title")}</h2>
                        <p className="mt-16 text-base font-semibold">
                            {t("empty")}
                        </p>
                    </div>
                ) : (
                    <div>
                        <h2 className="text-2xl font-bold">
                            {t("titleWithCount", { count })}
                        </h2>

                        <div className="mt-6 max-h-64 space-y-4 overflow-y-auto pr-1">
                            {items.map(({ product, quantity }) => (
                                <div
                                    key={product.id}
                                    className="border-b border-gray-300 pb-4 last:border-b-0 last:pb-0"
                                >
                                    <div className="flex items-start gap-3">
                                        <Link
                                            href={`/shop/${product.slug}`}
                                            className="relative h-12 w-12 shrink-0 bg-gray-50"
                                        >
                                            <Image
                                                src={product.images[0]}
                                                alt={product.name[locale]}
                                                fill
                                                className="object-contain"
                                            />
                                        </Link>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-start justify-between gap-3">
                                                <Link
                                                    href={`/shop/${product.slug}`}
                                                    className="min-w-0 truncate text-sm font-semibold leading-tight hover:text-(--brand-green)"
                                                >
                                                    {product.name[locale]}
                                                </Link>
                                                <span className="shrink-0 text-sm font-medium">
                                                    {formatMoney({
                                                        ...product.price,
                                                        amount: product.price.amount * quantity,
                                                    })}
                                                </span>
                                            </div>
                                            <p className="mt-3 text-sm">{t("regular")}</p>
                                        </div>
                                    </div>

                                    <div className="mt-3 flex items-center justify-between pl-[60px]">
                                        <div className="flex items-center gap-3">
                                            <button
                                                type="button"
                                                onClick={() => updateQuantity(product.id, quantity - 1)}
                                                disabled={quantity === 1}
                                                aria-label={t("decreaseQuantity")}
                                                className="flex h-8 w-8 items-center justify-center bg-gray-100 text-lg text-gray-700 transition-colors hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-40"
                                            >
                                                −
                                            </button>
                                            <span className="min-w-4 text-center text-sm">
                                                {quantity}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => add(product.id)}
                                                aria-label={t("increaseQuantity")}
                                                className="flex h-8 w-8 items-center justify-center bg-gray-100 text-lg text-gray-700 transition-colors hover:bg-gray-200"
                                            >
                                                +
                                            </button>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => remove(product.id)}
                                            className="rounded p-1 text-(--brand-green) transition-colors hover:bg-gray-100 hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-green)"
                                            aria-label={`${t("remove")} ${product.name[locale]}`}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-5 border-t border-gray-200 pt-4">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">
                                    {t("total")}
                                </span>
                                <span className="font-semibold">
                                    {formatMoney({
                                        amount: total,
                                        currency: "JPY",
                                    })}
                                </span>
                            </div>
                            <Link
                                href="/cart"
                                className="mt-4 flex h-12 items-center justify-center bg-(--brand-green) px-4 text-sm font-medium text-white transition-[background-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:bg-(--brand-green-dark) hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-green) focus-visible:ring-offset-2"
                            >
                                {t("checkout", {
                                    amount: formatMoney({
                                        amount: total,
                                        currency: "JPY",
                                    }),
                                })}
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
