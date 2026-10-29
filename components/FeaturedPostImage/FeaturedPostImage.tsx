"use client";

import Image, { StaticImageData } from "next/image";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { useFeaturedPostImageAnimation } from "./useFeaturedPostImageAnimation";

interface FeaturedPostImageProps {
    image: string | StaticImageData;
    title: string;
    href: string;
    // Tỉ lệ khung ảnh (mặc định theo ảnh bìa bài 509×636)
    aspectClassName?: string;
}

export default function FeaturedPostImage({
    image,
    title,
    href,
    aspectClassName = "aspect-509/636 max-h-[636px]",
}: FeaturedPostImageProps) {
    const { imgRef, handleMouseEnter, handleMouseLeave } =
        useFeaturedPostImageAnimation();

    return (
        <Link
            href={href}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={cn("group relative block w-full max-w-[509px] overflow-hidden", aspectClassName)}
        >
            <Image
                ref={imgRef}
                src={image}
                alt={title}
                fill
                className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
            />
        </Link>
    );
}
