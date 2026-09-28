"use client";

import React, { useRef } from "react";
import Image, { StaticImageData } from "next/image";
import { Link } from "@/i18n/navigation";
import gsap from "gsap";

interface CategoryCardProps {
  title: string;
  image: string | StaticImageData;
  href: string;
  ctaText: string;
}

export default function CategoryCard({
  title,
  image,
  href,
  ctaText,
}: CategoryCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const bgImageRef = useRef<HTMLImageElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    // Phóng to ảnh nền mượt mà
    if (bgImageRef.current) {
      gsap.to(bgImageRef.current, {
        scale: 1.08,
        duration: 0.6,
        ease: "power2.out",
      });
    }
    // Làm tối nhẹ lớp overlay để chữ nổi bật hơn
    if (overlayRef.current) {
      gsap.to(overlayRef.current, {
        backgroundColor: "rgba(0, 0, 0, 0.45)",
        duration: 0.4,
      });
    }
    // Hiệu ứng nhấc nhẹ nội dung lên trên
    if (contentRef.current) {
      gsap.to(contentRef.current, {
        y: -6,
        duration: 0.4,
        ease: "power2.out",
      });
    }
  };

  const handleMouseLeave = () => {
    if (bgImageRef.current) {
      gsap.to(bgImageRef.current, {
        scale: 1,
        duration: 0.6,
        ease: "power2.out",
      });
    }
    if (overlayRef.current) {
      gsap.to(overlayRef.current, {
        backgroundColor: "rgba(0, 0, 0, 0.3)",
        duration: 0.4,
      });
    }
    if (contentRef.current) {
      gsap.to(contentRef.current, {
        y: 0,
        duration: 0.4,
        ease: "power2.out",
      });
    }
  };

  return (
    <Link href={href} className="block w-full">
      <div
        ref={cardRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="relative group overflow-hidden  h-[95svh] w-full flex items-center justify-center cursor-pointer shadow-md"
      >
        {/* Ảnh nền */}
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <Image
            ref={bgImageRef}
            src={image}
            alt={title}
            fill
            className="object-cover object-center transition-transform"
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
          className="relative z-10 text-center flex flex-col items-center justify-center px-6"
        >
          <h2 className="text-white text-3xl md:text-4xl font-extrabold tracking-wider uppercase mb-5 drop-shadow-md">
            {title}
          </h2>
          
          <span className="inline-block bg-[#1B4D3E] hover:bg-[#14382c] text-white text-sm font-semibold px-6 py-2.5 rounded shadow-lg transition-colors duration-200">
            {ctaText}
          </span>
        </div>
      </div>
    </Link>
  );
}