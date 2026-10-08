"use client";

import Image, { StaticImageData } from "next/image";
import { Link } from "@/i18n/navigation";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useProductThumbAnimation } from "./useProductThumbAnimation";

interface ProductThumbProps {
    image: string | StaticImageData;
    href: string;
    alt: string;
    viewProductLabel: string;
    className?: string;
}

export default function ProductThumb({
    image,
    href,
    alt,
    viewProductLabel,
    className,
}: ProductThumbProps) {
    const { imgRef, iconRef, handleMouseEnter, handleMouseLeave } =
        useProductThumbAnimation();

    return (
        <Link
            href={href}
            aria-label={viewProductLabel}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={cn("relative block flex-1 overflow-hidden", className)}
        >
            <Image
                ref={imgRef}
                src={image}
                alt={alt}
                fill
                className="object-cover transition-transform"
            />
            <span
                ref={iconRef}
                className="absolute bottom-3 right-3 z-10 flex h-9 w-9 scale-0 items-center justify-center rounded-full bg-white/95 text-(--brand-green) opacity-0 shadow-lg"
            >
                <ArrowUpRight className="h-4 w-4" />
            </span>
        </Link>
    );
}
