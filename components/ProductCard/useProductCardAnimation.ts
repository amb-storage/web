"use client";

import { useRef } from "react";
import type { MouseEvent } from "react";
import gsap from "gsap";

interface UseProductCardAnimationOptions {
  onAddToCart?: () => void;
}

// Animation Hover cực "quao" với GSAP (Không dùng shadow thô, dùng scale & dịch chuyển tinh tế)
export function useProductCardAnimation({
  onAddToCart,
}: UseProductCardAnimationOptions = {}) {
  const imgRef = useRef<HTMLImageElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    gsap.killTweensOf(
      [imgRef.current, actionsRef.current, infoRef.current].filter(
        Boolean
      ) as Element[]
    );

    // Ảnh phóng to & bay bổng lên trên
    if (imgRef.current) {
      gsap.to(imgRef.current, {
        scale: 1.08,
        y: -10,
        duration: 0.5,
        ease: "power3.out",
      });
    }

    // Cặp nút Xem chi tiết / Thêm vào giỏ trượt từ dưới lên, nảy nhẹ
    if (actionsRef.current) {
      gsap.to(actionsRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: "back.out(1.5)",
      });
    }

    // Phần text nhấc nhẹ theo
    if (infoRef.current) {
      gsap.to(infoRef.current, {
        y: -2,
        duration: 0.3,
        ease: "power2.out",
      });
    }
  };

  const handleMouseLeave = () => {
    gsap.killTweensOf(
      [imgRef.current, actionsRef.current, infoRef.current].filter(
        Boolean
      ) as Element[]
    );

    if (imgRef.current) {
      gsap.to(imgRef.current, {
        scale: 1,
        y: 0,
        duration: 0.5,
        ease: "power3.out",
      });
    }

    if (actionsRef.current) {
      gsap.to(actionsRef.current, {
        opacity: 0,
        y: 15,
        duration: 0.3,
        ease: "power2.in",
      });
    }

    if (infoRef.current) {
      gsap.to(infoRef.current, {
        y: 0,
        duration: 0.3,
        ease: "power2.out",
      });
    }
  };

  // Bấm "Thêm vào giỏ" chỉ thêm vào giỏ, không điều hướng theo Link cha
  const handleAddToCartClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart?.();
  };

  return {
    imgRef,
    actionsRef,
    infoRef,
    handleMouseEnter,
    handleMouseLeave,
    handleAddToCartClick,
  };
}
