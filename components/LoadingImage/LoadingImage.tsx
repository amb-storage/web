"use client";

import Image, { type ImageProps } from "next/image";
import { cn } from "@/lib/utils";
import { useImageLoaded } from "./useImageLoaded";

interface LoadingImageProps extends ImageProps {
    wrapperClassName?: string;
}

// Ảnh có hiệu ứng skeleton nhấp nháy khi đang tải, rồi hiện dần khi tải xong
export default function LoadingImage({ className, wrapperClassName, onLoad, alt, ...props }: LoadingImageProps) {
    const { loaded, ref, onLoad: markLoaded } = useImageLoaded();
    return (
        <div className={cn("relative overflow-hidden", !loaded && "animate-pulse bg-gray-200", wrapperClassName)}>
            <Image
                {...props}
                ref={ref}
                alt={alt}
                onLoad={(event) => {
                    markLoaded();
                    onLoad?.(event);
                }}
                className={cn("transition-opacity duration-500", loaded ? "opacity-100" : "opacity-0", className)}
            />
        </div>
    );
}
