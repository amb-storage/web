"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { createPortal } from "react-dom";
import { useEffect, useId, useState, useSyncExternalStore } from "react";
import { Link } from "@/i18n/navigation";
import { formatMoney } from "@/lib/storefront";
import type { Product } from "@/lib/storefront";
import { X } from "lucide-react";

const subscribeToClient = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

interface AddToCartDialogProps {
    open: boolean;
    product: Product;
    addToCartLabel: string;
    viewDetailsLabel: string;
    onAddToCart: (quantity: number) => void;
    onClose: () => void;
}

export function AddToCartDialog({
    open,
    product,
    addToCartLabel,
    viewDetailsLabel,
    onAddToCart,
    onClose,
}: AddToCartDialogProps) {
    const locale = useLocale() as "ja" | "en";
    const t = useTranslations("homepage.productCard");
    const titleId = useId();
    const [quantity, setQuantity] = useState(1);
    const totalPrice = {
        ...product.price,
        amount: product.price.amount * quantity,
    };
    const isClient = useSyncExternalStore(
        subscribeToClient,
        getClientSnapshot,
        getServerSnapshot,
    );

    useEffect(() => {
        if (!open) return;

        const previousOverflow = document.body.style.overflow;
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") onClose();
        };

        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [onClose, open]);

    if (!isClient || typeof document === "undefined") return null;

    return createPortal(
        <div
            aria-hidden={!open}
            className={`fixed inset-0 z-[80] flex items-center justify-center overflow-y-auto overscroll-none bg-black/40 p-4 transition-[opacity,visibility] duration-300 ${open ? "visible opacity-100" : "pointer-events-none invisible opacity-0"}`}
            onClick={(event) => {
                if (event.target === event.currentTarget) onClose();
            }}
            role="presentation"
        >
            <section
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                className={`relative flex h-[calc(100dvh-2rem)] max-h-[56rem] w-full max-w-[600px] min-h-0 flex-col overflow-hidden bg-white text-black shadow-2xl transition-[opacity,transform] duration-300 ease-out md:h-[90vh] ${open ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
            >
                <div
                    data-lenis-prevent
                    className="min-h-0 flex-1 touch-pan-y overflow-y-auto overscroll-contain pb-24"
                >
                    <div className="relative aspect-4/3 bg-[#ebedef]">
                        <Image
                            src={product.images[0]}
                            alt={product.name[locale]}
                            fill
                            sizes="(min-width: 768px) 1280px, 100vw"
                            className="object-cover"
                        />
                    </div>

                    <div className="space-y-6 p-6 pb-8">
                        <h2
                            id={titleId}
                            className="text-2xl font-bold leading-tight md:text-3xl"
                        >
                            {product.name[locale]} {product.size}
                        </h2>
                        <p className="text-xl tracking-[0.13em]">
                            {formatMoney(product.price)}
                        </p>

                        <Link
                            href={`/shop/${product.slug}`}
                            onClick={onClose}
                            className="inline-flex min-h-8 items-center justify-center border-2 border-(--brand-green) px-5 text-sm font-semibold text-(--brand-green) transition-colors hover:bg-(--brand-green) hover:text-white"
                        >
                            {viewDetailsLabel}
                        </Link>

                        <div className="space-y-5 text-sm leading-relaxed text-gray-700">
                            <section>
                                <h3 className="font-semibold text-black">
                                    {t("productDetails")}:
                                </h3>
                                <p className="mt-2 whitespace-pre-line">
                                    {product.description[locale]}
                                </p>
                            </section>

                            <section>
                                <h3 className="font-semibold text-black">
                                    {t("size")}: {product.size}
                                </h3>
                                {product.measurements?.[locale] && (
                                    <p className="mt-2 whitespace-pre-line">
                                        {product.measurements[locale]}
                                    </p>
                                )}
                            </section>

                            <section>
                                <h3 className="font-semibold text-black">
                                    {t("condition")}:
                                </h3>
                                {product.condition?.[locale] && (
                                    <p className="mt-2">
                                        {product.condition[locale]}
                                    </p>
                                )}
                                <p className="mt-2 whitespace-pre-line text-xs">
                                    {t("conditionNote")}
                                </p>
                            </section>

                            <section>
                                <p className="font-semibold text-black">
                                    {t("shippingFree")}
                                </p>
                                <p>{t("shippingTime")}</p>
                            </section>

                            <section>
                                <h3 className="font-semibold text-black">
                                    {t("detailsBlog")}:
                                </h3>
                                <Link
                                    href="/blog"
                                    onClick={onClose}
                                    className="mt-2 block text-sm text-(--brand-green) underline underline-offset-2 hover:text-(--brand-green-dark)"
                                >
                                    {t("detailsBlogText")}
                                </Link>
                            </section>

                            <div className="flex items-center gap-3 pt-1" aria-label={t("quantity")}>
                                <button
                                    type="button"
                                    onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                                    disabled={quantity === 1}
                                    aria-label={t("decreaseQuantity")}
                                    className="flex h-8 w-8 items-center justify-center bg-gray-100 text-lg text-gray-700 transition-colors hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    −
                                </button>
                                <span className="min-w-4 text-center text-sm text-black" aria-live="polite">
                                    {quantity}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => setQuantity((value) => value + 1)}
                                    aria-label={t("increaseQuantity")}
                                    className="flex h-8 w-8 items-center justify-center bg-gray-100 text-lg text-gray-700 transition-colors hover:bg-gray-200"
                                >
                                    +
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <footer
                    className={`absolute bottom-0 left-0 right-0 bg-transparent flex shrink-0 items-center gap-2 p-6 transition-[opacity,transform] duration-500 ease-out ${open ? "translate-y-0 opacity-100 delay-300" : "translate-y-3 opacity-0"}`}
                >
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label={t("close")}
                        className="flex h-12 w-12 shrink-0 items-center justify-center border border-gray-100 bg-white text-(--brand-green) shadow-sm transition-[background-color,border-color,box-shadow] duration-200 hover:border-gray-200 hover:bg-gray-100 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-green) focus-visible:ring-offset-2"
                    >
                        <X className="h-6 w-6" />
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            onAddToCart(quantity);
                            onClose();
                        }}
                        className="flex h-12 flex-1 items-center justify-between bg-(--brand-green) px-5 text-sm font-medium text-white transition-[background-color,box-shadow] duration-200 hover:bg-(--brand-green-dark) hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-green) focus-visible:ring-offset-2 md:px-6"
                    >
                        <span>{addToCartLabel}</span>
                        <span>{formatMoney(totalPrice)}</span>
                    </button>
                </footer>
            </section>
        </div>,
        document.body,
    );
}
