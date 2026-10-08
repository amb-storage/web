"use client";

import Image, { StaticImageData } from "next/image";
import { Link } from "@/i18n/navigation";
import { useCategoryCardAnimation } from "./useCategoryCardAnimation";

interface CategoryCardProps {
    title: string;
    image: string | StaticImageData;
    href: string;
    ctaText: string;
    /** Thứ tự trong danh sách, dùng để so le hiệu ứng reveal khi vào trang. */
    index?: number;
}

export default function CategoryCard({
    title,
    image,
    href,
    ctaText,
    index = 0,
}: CategoryCardProps) {
    const {
        bgImageRef,
        overlayRef,
        contentRef,
        handleMouseEnter,
        handleMouseLeave,
    } = useCategoryCardAnimation(index);

    return (
        <Link href={href} className="block w-full min-w-0 max-w-full">
            <div
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className="group relative flex h-[calc(100svh-6rem)] w-full min-w-0 max-w-full cursor-pointer items-center justify-center overflow-hidden shadow-md md:h-[calc(100svh-7rem)]"
            >
                {/* Ảnh nền */}
                <div className="absolute inset-0 w-full h-full overflow-hidden">
                    <Image
                        ref={bgImageRef}
                        src={image}
                        alt={title}
                        fill
                        className="scale-[1.15] object-cover object-center transition-transform"
                        priority
                    />
                </div>

                {/* Lớp phủ mờ (Overlay) */}
                <div
                    ref={overlayRef}
                    className="absolute inset-0 bg-black/30 transition-colors duration-300"
                />

                {/* Nội dung (Tiêu đề & Nút bấm) */}
                <div
                    ref={contentRef}
                    className="relative z-10 flex translate-y-6 flex-col items-center justify-center px-6 text-center opacity-0"
                >
                    <h2 className="text-white text-3xl md:text-4xl font-extrabold tracking-wider uppercase mb-5 drop-shadow-md">
                        {title}
                    </h2>

                    <span className="inline-block bg-(--brand-green) text-white text-sm font-semibold px-6 py-2.5 rounded shadow-lg transition-colors duration-200 hover:brightness-90">
                        {ctaText}
                    </span>
                </div>
            </div>
        </Link>
    );
}
