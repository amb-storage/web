"use client";

import { StaticImageData } from "next/image";
import { Quote } from "lucide-react";
import ProductThumb from "./ProductThumb";
import { useCustomerVoiceCardAnimation } from "./useCustomerVoiceCardAnimation";

interface CustomerVoiceCardProps {
  name: string;
  quote: string;
  image: string | StaticImageData;
  href: string;
  viewProductLabel: string;
  index?: number;
}

export default function CustomerVoiceCard({
  name,
  quote,
  image,
  href,
  viewProductLabel,
  index = 0,
}: CustomerVoiceCardProps) {
  const { cardRef } = useCustomerVoiceCardAnimation(index);

  return (
    <div
      ref={cardRef}
      className="flex translate-y-8 flex-col overflow-hidden rounded-2xl bg-white opacity-0 shadow-md transition-shadow duration-300 hover:shadow-xl"
    >
      <ProductThumb
        image={image}
        href={href}
        alt={name}
        viewProductLabel={viewProductLabel}
        className="aspect-[4/5]"
      />

      <div className="flex flex-1 flex-col gap-3 p-6">
        <Quote className="h-5 w-5 fill-[#1B3B2B]/10 text-[#1B3B2B]/40" />
        <p className="line-clamp-5 flex-1 text-sm leading-relaxed text-gray-600">
          {quote}
        </p>
        <p className="text-sm font-semibold text-[#1B3B2B]">{name}</p>
      </div>
    </div>
  );
}
