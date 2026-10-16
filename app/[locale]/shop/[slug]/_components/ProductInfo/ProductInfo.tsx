"use client";

import type { ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { useCart } from "@/components/Cart/useCart";
import { formatMoney } from "@/lib/storefront";
import type { Product } from "@/lib/storefront";

interface ProductInfoProps {
  product: Product;
}

// Tiêu đề mục: chữ + đường kẻ ngang kéo dài hết chiều rộng
function InfoSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <div className="mb-4 flex w-full items-center gap-4">
        <h2 className="whitespace-nowrap text-sm leading-[21px] tracking-[0.56px]">
          {title}
        </h2>
        <span aria-hidden className="h-px w-full bg-black" />
      </div>
      {children}
    </section>
  );
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const locale = useLocale() as "ja" | "en";
  const t = useTranslations("productDetail");
  const tCard = useTranslations("homepage.productCard");
  const { has, add } = useCart();
  const isSoldOut = product.availability === "SOLD_OUT";
  const isInCart = has(product.id);
  const bodyTextClass = "whitespace-pre-line text-[11.2px] font-light leading-[17px]";

  return (
    <div className="flex w-full flex-col items-center px-6 py-6 md:w-1/2 md:px-[6.35vw] md:py-12">
      <h1 className="w-full text-sm font-light leading-6">{product.name[locale]}</h1>
      <p className="mt-1.5 w-full text-[11.2px] leading-[1.51] text-black/55">
        {product.size}
      </p>
      <p className="mt-1.5 w-full text-[11.2px] font-medium leading-4.25 tracking-[0.224px]">
        {formatMoney(product.price)}
        <span className="ml-1 text-black/55">{tCard("taxIn")}</span>
      </p>

      <button
        type="button"
        disabled={isSoldOut || isInCart}
        onClick={() => add(product.id)}
        className={cn(
          "mx-auto mt-6 grid h-7 w-44 place-content-center rounded-full text-[11.2px] leading-5.5 tracking-[0.224px] transition-colors md:my-10 md:h-8 md:w-full md:max-w-137",
          isSoldOut
            ? "pointer-events-none bg-black/4 text-black/15"
            : "bg-(--brand-green) text-white hover:bg-(--brand-green-dark) disabled:cursor-default disabled:opacity-60 disabled:hover:bg-(--brand-green)"
        )}
      >
        {isSoldOut ? tCard("soldOut") : isInCart ? tCard("inCart") : tCard("addToCart")}
      </button>

      <div className="mt-8 flex w-full flex-col gap-8 md:mt-0">
        <InfoSection title={t("productDetails")}>
          <p className={bodyTextClass}>{product.description[locale]}</p>
        </InfoSection>

        <InfoSection title={t("sizes")}>
          <p className={bodyTextClass}>
            {t("taggedSize")} / {product.size}
            {product.measurements && `\n${product.measurements[locale]}`}
          </p>
          <p className={bodyTextClass}>{t("measurementsNote")}</p>
        </InfoSection>

        <InfoSection title={t("condition")}>
          {product.condition && (
            <p className="mb-4 text-base font-medium leading-6">
              {product.condition[locale]}
            </p>
          )}
          <p className={bodyTextClass}>{tCard("conditionNote")}</p>
        </InfoSection>
      </div>
    </div>
  );
}
