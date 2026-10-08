"use client";

import Image from "next/image";
import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { formatMoney, getProductBadges } from "@/lib/storefront";
import type { Product } from "@/lib/storefront";
import { useCart } from "@/components/Cart/useCart";
import { AddToCartDialog } from "@/components/Cart/AddToCartDialog";
import { cn } from "@/lib/utils";
import ProductBadge from "@/components/ProductBadge/ProductBadge";

interface ProductCardProps {
    product: Product;
    viewDetailsLabel: string;
    addToCartLabel: string;
    inCartLabel: string;
    soldLabel: string;
    taxInLabel: string;
    className?: string;
}

export default function ProductCard({
    product,
    viewDetailsLabel,
    addToCartLabel,
    soldLabel,
    taxInLabel,
    className,
}: ProductCardProps) {
    const locale = useLocale() as "ja" | "en";
    const { add } = useCart();
    const [addToCartOpen, setAddToCartOpen] = useState(false);
    const name = product.name[locale];
    const displayName = `${name} ${product.size}`;
    const isSold = product.availability === "SOLD_OUT";
    const badges = getProductBadges(product, locale).filter(
        (badge) => badge.variant !== "sold",
    );

    return (
        <article
            className={cn(
                "product-card group w-[230px] p-2 min-w-[230px] shrink-0 cursor-pointer bg-white",
                className,
            )}
        >
            <div className="relative aspect-square w-full overflow-hidden bg-[#ebedef]">
                {badges.length > 0 && (
                    <div className="absolute bottom-4 left-4 z-20 flex max-w-[calc(100%-2rem)] flex-wrap gap-2">
                        {badges.map((badge) => (
                            <ProductBadge key={badge.id} badge={badge} />
                        ))}
                    </div>
                )}

                <Link
                    href={`/shop/${product.slug}`}
                    className="absolute inset-0 block"
                    aria-label={displayName}
                >
                    <Image
                        src={product.images[0]}
                        alt={displayName}
                        fill
                        sizes="(min-width: 768px) 230px, 80vw"
                        className="product-card-img [transform:scale(1)] object-cover transition-transform duration-500 ease-out group-hover:[transform:scale(1.08)]"
                    />
                </Link>

                {isSold && (
                    <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-[#ebedef]/75">
                        <span className="text-sm font-semibold uppercase tracking-[0.18em] text-(--brand-green)"></span>
                    </div>
                )}

                <div className="product-card-actions pointer-events-none absolute bottom-5 left-1/2 z-20 flex w-[calc(100%-2rem)] -translate-x-1/2 translate-y-3 scale-[0.98] opacity-0 will-change-[opacity,transform] transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:scale-100 group-hover:opacity-100">
                    <button
                        type="button"
                        onClick={(event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            setAddToCartOpen(true);
                        }}
                        disabled={isSold}
                        className="flex h-10 w-full items-center justify-center bg-(--brand-green) px-3 text-xs font-medium tracking-wide text-white shadow-lg transition-[background-color,box-shadow,transform] duration-300 ease-out hover:-translate-y-0.5 hover:bg-(--brand-green-dark) hover:shadow-xl active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {isSold ? soldLabel : addToCartLabel}
                    </button>
                </div>
            </div>

            <AddToCartDialog
                open={addToCartOpen}
                product={product}
                addToCartLabel={addToCartLabel}
                viewDetailsLabel={viewDetailsLabel}
                onAddToCart={(quantity) => add(product.id, quantity)}
                onClose={() => setAddToCartOpen(false)}
            />

            <div className="product-card-info mt-4 px-0.5">
                <Link
                    href={`/shop/${product.slug}`}
                    className="flex flex-col items-start justify-between gap-0"
                >
                    <h3 className="line-clamp-2 text-sm font-semibold leading-[1.3] tracking-[0.13em] text-(--brand-green) transition-colors group-hover:text-(--brand-green-dark)">
                        {name} {product.size}
                    </h3>
                    <p className="mt-1 text-sm italic font-semibold leading-[1.3] tracking-[0.08em] text-black">
                        {isSold
                            ? soldLabel
                            : `${formatMoney(product.price)} ${taxInLabel}`}
                    </p>
                </Link>
            </div>
        </article>
    );
}
