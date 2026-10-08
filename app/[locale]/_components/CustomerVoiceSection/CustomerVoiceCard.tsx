"use client";

import { StaticImageData } from "next/image";
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
            className="flex translate-y-8 flex-col bg-transparent text-center opacity-0"
        >
            <p className="mb-4 text-base font-bold tracking-[0.08em] text-black">
                {name}
            </p>

            <ProductThumb
                image={image}
                href={href}
                alt={name}
                viewProductLabel={viewProductLabel}
                className="aspect-square w-full"
            />

            <div className="px-0.5">
                <p className="mt-4 text-sm leading-[1.25] tracking-[0.1em] text-black">
                    {quote}
                </p>
            </div>
        </div>
    );
}
