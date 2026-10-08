"use client";

import Image, { StaticImageData } from "next/image";
import { Link } from "@/i18n/navigation";
import { useFeaturedPostImageAnimation } from "./useFeaturedPostImageAnimation";

interface FeaturedPostImageProps {
    image: string | StaticImageData;
    title: string;
    href: string;
}

export default function FeaturedPostImage({
    image,
    title,
    href,
}: FeaturedPostImageProps) {
    const { imgRef, handleMouseEnter, handleMouseLeave } =
        useFeaturedPostImageAnimation();

    return (
        <Link
            href={href}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="group relative block aspect-509/636 w-full max-w-[509px] max-h-[636px] overflow-hidden"
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
