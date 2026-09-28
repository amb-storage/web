"use client";

import { useRef } from "react";
import gsap from "gsap";

// Ảnh sản phẩm zoom nhẹ + icon "xem sản phẩm" hiện ra khi hover
export function useProductThumbAnimation() {
  const imgRef = useRef<HTMLImageElement>(null);
  const iconRef = useRef<HTMLSpanElement>(null);

  const handleMouseEnter = () => {
    gsap.killTweensOf(
      [imgRef.current, iconRef.current].filter(Boolean) as Element[]
    );

    if (imgRef.current) {
      gsap.to(imgRef.current, {
        scale: 1.08,
        duration: 0.5,
        ease: "power2.out",
      });
    }
    if (iconRef.current) {
      gsap.to(iconRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.35,
        ease: "back.out(1.8)",
      });
    }
  };

  const handleMouseLeave = () => {
    gsap.killTweensOf(
      [imgRef.current, iconRef.current].filter(Boolean) as Element[]
    );

    if (imgRef.current) {
      gsap.to(imgRef.current, {
        scale: 1,
        duration: 0.5,
        ease: "power2.out",
      });
    }
    if (iconRef.current) {
      gsap.to(iconRef.current, {
        opacity: 0,
        scale: 0,
        duration: 0.25,
        ease: "power2.in",
      });
    }
  };

  return { imgRef, iconRef, handleMouseEnter, handleMouseLeave };
}
