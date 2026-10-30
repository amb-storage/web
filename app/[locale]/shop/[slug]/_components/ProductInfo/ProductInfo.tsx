"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { useCart } from "@/components/Cart/useCart";
import { formatMoney, isPurchasable } from "@/lib/storefront";
import type { ProductDetail } from "@/lib/storefront";

interface ProductInfoProps {
  product: ProductDetail;
}

// Tiêu đề mục: chữ + đường kẻ ngang kéo dài hết chiều rộng
function InfoSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <div className="mb-4 flex w-full items-center gap-4">
        <h2 className="whitespace-nowrap font-sans text-sm font-medium leading-[21px] tracking-[0.56px]">
          {title}
        </h2>
        <span aria-hidden className="h-px w-full bg-black" />
      </div>
      {children}
    </section>
  );
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const t = useTranslations("productDetail");
  const tCard = useTranslations("homepage.productCard");
  const { has, add, pending } = useCart();
  const isSoldOut = !isPurchasable(product);
  const isInCart = has(product.id);
  const bodyTextClass = "whitespace-pre-line text-[11.2px] font-light leading-[17px]";

  return (
    <div className="flex w-full flex-col items-center px-6 py-6 md:w-1/2 md:px-[6.35vw] md:py-12">
      <h1 className="w-full font-sans text-sm font-light leading-6 tracking-normal">{product.name}</h1>
      {product.size && (
        <p className="mt-1.5 w-full text-[11.2px] leading-[1.51] text-black/55">
          {product.size}
        </p>
      )}
      <p className="mt-1.5 w-full text-[11.2px] font-medium leading-4.25 tracking-[0.224px]">
        {formatMoney(product.price)}
        <span className="ml-1 text-black/55">{tCard("taxIn")}</span>
      </p>

      <button
        type="button"
        disabled={isSoldOut || isInCart || pending}
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
        {product.description && (
          <InfoSection title={t("productDetails")}>
            <p className={bodyTextClass}>{product.description}</p>
          </InfoSection>
        )}

        <InfoSection title={t("sizes")}>
          {product.size && (
            <p className={bodyTextClass}>
              {t("taggedSize")} / {product.size}
            </p>
          )}
          {/* Số đo / thông số thêm do admin nhập ở mục Details của sản phẩm */}
          {product.details.length > 0 && (
            <dl className={cn(bodyTextClass, "mt-1")}>
              {product.details.map((detail) =>
                // Khối số đo admin dán nguyên văn (key `measurements`): hiện như lúc dán, giữ xuống dòng, không nhãn
                detail.key === "measurements" ? (
                  <dd key={detail.key} className="my-1 whitespace-pre-line">
                    {detail.value}
                  </dd>
                ) : (
                  <div key={detail.key} className="flex gap-1">
                    <dt>{detail.label}:</dt>
                    <dd className="whitespace-pre-line">{detail.value}</dd>
                  </div>
                ),
              )}
            </dl>
          )}
          <p className={bodyTextClass}>{t("measurementsNote")}</p>
        </InfoSection>

        <InfoSection title={t("condition")}>
          {product.condition && (
            <p className="mb-4 text-base font-medium leading-6">
              {product.condition}
            </p>
          )}
          <p className={bodyTextClass}>{tCard("conditionNote")}</p>
        </InfoSection>

        {/* Bài Mili Talk admin gắn cho sản phẩm (`miliTalk` của GET /products/:slug); không gắn thì ẩn */}
        {product.miliTalk && (
          <InfoSection title={tCard("detailsBlog")}>
            <Link
              href={`/blog/${product.miliTalk.slug}`}
              className="group flex items-center gap-3 text-(--brand-green) hover:text-(--brand-green-dark)"
            >
              <span className="relative h-14 w-11 shrink-0 overflow-hidden bg-[#ebedef]">
                <Image
                  src={product.miliTalk.coverImage}
                  alt={product.miliTalk.coverAlt ?? product.miliTalk.title}
                  fill
                  sizes="44px"
                  className="object-cover"
                />
              </span>
              <span className="min-w-0">
                <span className="block text-[11.2px] font-medium leading-[17px] underline underline-offset-2">
                  {tCard("detailsBlogText")}
                </span>
                <span className="mt-0.5 block truncate text-[11.2px] leading-[17px] text-black/55">
                  {product.miliTalk.title}
                </span>
              </span>
            </Link>
          </InfoSection>
        )}

        {product.policyLinks.length > 0 && (
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-[11.2px]">
            {product.policyLinks.map((link) => (
              <li key={link.slug}>
                <Link href={`/policy#${link.slug}`} className="underline underline-offset-2 hover:text-(--brand-green)">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
