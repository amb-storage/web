"use client";

import Image, { StaticImageData } from "next/image";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { useImageLoaded } from "@/components/LoadingImage/useImageLoaded";
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
    const { loaded, ref: loadedRef, onLoad } = useImageLoaded();

    return (
        <Link
            href={href}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={cn(
                "group relative block w-full max-w-[509px] overflow-hidden",
                !loaded && "animate-pulse bg-gray-200",
                aspectClassName,
            )}
        >
            <Image
                ref={(node) => {
                    imgRef.current = node;
                    loadedRef(node);
                }}
                onLoad={onLoad}
                src={image}
                alt={title}
                fill
                className={cn(
                    "object-cover object-center transition-[opacity,transform] duration-500 group-hover:scale-105",
                    loaded ? "opacity-100" : "opacity-0",
                )}
            />
        </Link>
    );
}
