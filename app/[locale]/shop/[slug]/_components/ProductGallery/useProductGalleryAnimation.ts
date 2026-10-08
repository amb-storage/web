"use client";

import { useRef } from "react";
import gsap from "gsap";

export function useProductGalleryAnimation() {
  const mainImageRef = useRef<HTMLDivElement>(null);

  // Chớp nhẹ (fade) mỗi khi đổi ảnh chính, cho cảm giác chuyển ảnh mượt hơn
  const playImageChange = () => {
    if (!mainImageRef.current) return;
    gsap.fromTo(
      mainImageRef.current,
      { opacity: 0.3 },
      { opacity: 1, duration: 0.3, ease: "power2.out" }
    );
  };

  return { mainImageRef, playImageChange };
}
