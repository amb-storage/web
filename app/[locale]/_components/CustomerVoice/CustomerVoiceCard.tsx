"use client";

import { StaticImageData } from "next/image";
import { Quote } from "lucide-react";
import { cn } from "@/lib/utils";
import ProductThumb from "./ProductThumb";
import { useCustomerVoiceCardAnimation } from "./useCustomerVoiceCardAnimation";

interface CustomerVoiceCardProps {
  name: string;
  quote: string;
  products: { image: string | StaticImageData; href: string }[];
  viewProductLabel: string;
  index?: number;
}

export default function CustomerVoiceCard({
  name,
  quote,
  products,
  viewProductLabel,
  index = 0,
}: CustomerVoiceCardProps) {
  const { cardRef } = useCustomerVoiceCardAnimation(index);
  const hasMultipleProducts = products.length > 1;

  return (
    <div
      ref={cardRef}
      className="flex translate-y-8 flex-col overflow-hidden rounded-2xl bg-white opacity-0 shadow-md transition-shadow duration-300 hover:shadow-xl"
    >
      <div className={cn("flex", hasMultipleProducts && "gap-0.5")}>
        {products.map((product, i) => (
          <ProductThumb
            key={i}
            image={product.image}
            href={product.href}
            alt={`${name} - ${i + 1}`}
            viewProductLabel={viewProductLabel}
            className={hasMultipleProducts ? "aspect-square" : "aspect-[4/5]"}
          />
        ))}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-6">
        <Quote className="h-5 w-5 fill-[#1B3B2B]/10 text-[#1B3B2B]/40" />
        <p className="flex-1 text-sm leading-relaxed text-gray-600">{quote}</p>
        <p className="text-sm font-semibold text-[#1B3B2B]">{name}</p>
      </div>
    </div>
  );
}
