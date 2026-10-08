"use client";

import { cn } from "@/lib/utils";
import { useLocale } from "next-intl";
import Accordion from "@/components/Accordion/Accordion";
import { useCart } from "@/components/Cart/useCart";
import { formatMoney } from "@/lib/storefront";
import { getProductBadges } from "@/lib/storefront";
import type { Product } from "@/lib/storefront";
import ProductBadge from "@/components/ProductBadge/ProductBadge";
import DescriptionBlocks from "./DescriptionBlocks";
import type { DescriptionBlock } from "@/lib/storefront";

interface ProductInfoProps {
  product: Product;
  addToCartLabel: string;
  inCartLabel: string;
  soldLabel: string;
  taxInLabel: string;
  descriptionTitle: string;
  descriptionBlocks: DescriptionBlock[];
  shippingReturnsTitle: string;
  shippingReturnsBlocks: DescriptionBlock[];
}

export default function ProductInfo({
  product,
  addToCartLabel,
  inCartLabel,
  soldLabel,
  taxInLabel,
  descriptionTitle,
  descriptionBlocks,
  shippingReturnsTitle,
  shippingReturnsBlocks,
}: ProductInfoProps) {
  const locale = useLocale() as "ja" | "en";
  const { has, add } = useCart();
  const isSoldOut = product.availability === "SOLD_OUT";
  const isInCart = has(product.id);
  const title = product.name[locale];
  const badges = getProductBadges(product, locale);

  return (
    <div className="flex flex-col gap-5">
      <div>
        {badges.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {badges.map((badge) => <ProductBadge key={badge.id} badge={badge} />)}
          </div>
        )}
        <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
          {title}
        </h1>
        <p className="mt-2 text-sm text-gray-500">{product.size}</p>
        <p className="mt-2 text-lg italic text-gray-700">
          {isSoldOut ? soldLabel : `${formatMoney(product.price)} ${taxInLabel}`}
        </p>
      </div>

      <button
        type="button"
        disabled={isSoldOut || isInCart}
        onClick={() => add(product.id)}
        className={cn(
          "flex w-full items-center justify-center gap-2 rounded-md py-4 text-sm font-semibold transition-colors",
          isSoldOut
            ? "cursor-not-allowed bg-gray-200 text-gray-500"
            : "bg-(--brand-green) text-white hover:brightness-90"
        )}
      >
        {isSoldOut ? "Sold Out" : isInCart ? inCartLabel : addToCartLabel}
        {!isSoldOut && <span>{formatMoney(product.price)}</span>}
      </button>

      <div>
        <Accordion title={descriptionTitle} defaultOpen>
          <DescriptionBlocks blocks={descriptionBlocks} />
        </Accordion>
        <Accordion title={shippingReturnsTitle}>
          <DescriptionBlocks blocks={shippingReturnsBlocks} />
        </Accordion>
      </div>
    </div>
  );
}
