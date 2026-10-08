"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { products } from "@/data/mock";
import { formatMoney } from "@/lib/storefront";
import { useCart } from "@/components/Cart/useCart";

export default function CartPage() {
    const locale = useLocale() as "ja" | "en";
    const t = useTranslations("cart");
    const { items: cartItems, remove, hydrated } = useCart();
    const items = cartItems
        .map(({ productId, quantity }) => {
            const product = products.find((item) => item.id === productId);
            return product ? { product, quantity } : null;
        })
        .filter((item): item is { product: (typeof products)[number]; quantity: number } =>
            Boolean(item),
        );

    return (
        <div className="mx-auto w-full max-w-5xl px-4 py-12 md:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-(--brand-green)">
                {t("title")}
            </h1>

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
                <div className="mt-8 divide-y divide-gray-200 border-y border-gray-200">
                    {items.map(({ product, quantity }) => (
                        <div key={product.id} className="flex gap-4 py-5">
                            <Link
                                href={`/shop/${product.slug}`}
                                className="relative h-28 w-24 shrink-0 bg-gray-50"
                            >
                                <Image
                                    src={product.images[0]}
                                    alt={product.name[locale]}
                                    fill
                                    className="object-contain"
                                />
                            </Link>
                            <div className="flex min-w-0 flex-1 flex-col justify-between">
                                <div>
                                    <Link
                                        href={`/shop/${product.slug}`}
                                        className="font-medium text-gray-900 hover:text-(--brand-green)"
                                    >
                                        {product.name[locale]}
                                    </Link>
                                    <p className="mt-1 text-sm text-gray-500">
                                        {product.size} · {quantity}
                                    </p>
                                </div>
                                <div className="flex items-center justify-between gap-4">
                                    <p className="font-semibold">
                                        {formatMoney(product.price)}
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => remove(product.id)}
                                        className="text-sm text-gray-500 underline underline-offset-4 hover:text-black"
                                    >
                                        {t("remove")}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
