import { cn } from "@/lib/utils";
import Accordion from "@/components/Accordion/Accordion";
import DescriptionBlocks from "./DescriptionBlocks";
import type { DescriptionBlock } from "../../fake";

interface ProductInfoProps {
  title: string;
  price: string;
  stock: "available" | "low" | "soldOut";
  stockLabel?: string;
  addToCartLabel: string;
  descriptionTitle: string;
  descriptionBlocks: DescriptionBlock[];
  shippingReturnsTitle: string;
  shippingReturnsBlocks: DescriptionBlock[];
}

export default function ProductInfo({
  title,
  price,
  stock,
  stockLabel,
  addToCartLabel,
  descriptionTitle,
  descriptionBlocks,
  shippingReturnsTitle,
  shippingReturnsBlocks,
}: ProductInfoProps) {
  const isSoldOut = stock === "soldOut";

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
          {title}
        </h1>
        <p className="mt-2 text-lg italic text-gray-700">{price}</p>

        {stock !== "available" && stockLabel && (
          <span
            className={cn(
              "mt-3 inline-block rounded px-3 py-1 text-xs font-semibold text-white",
              isSoldOut ? "bg-red-600" : "bg-emerald-700"
            )}
          >
            {stockLabel}
          </span>
        )}
      </div>

      <button
        type="button"
        disabled={isSoldOut}
        className={cn(
          "flex w-full items-center justify-center gap-2 rounded-md py-4 text-sm font-semibold transition-colors",
          isSoldOut
            ? "cursor-not-allowed bg-gray-200 text-gray-500"
            : "bg-[#1B3B2B] text-white hover:bg-[#12271d]"
        )}
      >
        {isSoldOut ? stockLabel : addToCartLabel}
        <span>{price}</span>
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
