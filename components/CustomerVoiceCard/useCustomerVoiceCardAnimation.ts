"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Thẻ trượt lên khi cuộn tới (so le theo index); hover ảnh: zoom nhẹ + icon "xem sản phẩm" bật ra
export function useCustomerVoiceCardAnimation(index: number) {
  const cardRef = useRef<HTMLElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const iconRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!cardRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(cardRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        // Trang danh sách có nhiều thẻ: so le theo vị trí trong hàng 3 cột
        delay: (index % 3) * 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 88%",
          once: true,
        },
      });
    }, cardRef);

    return () => ctx.revert();
  }, [index]);

  const handleMouseEnter = () => {
    const targets = [imgRef.current, iconRef.current].filter(Boolean) as Element[];
    gsap.killTweensOf(targets);
    if (imgRef.current) {
      gsap.to(imgRef.current, { scale: 1.08, duration: 0.5, ease: "power2.out" });
    }
    if (iconRef.current) {
      gsap.to(iconRef.current, { opacity: 1, scale: 1, duration: 0.35, ease: "back.out(1.5)" });
    }
  };

  const handleMouseLeave = () => {
    const targets = [imgRef.current, iconRef.current].filter(Boolean) as Element[];
    gsap.killTweensOf(targets);
    if (imgRef.current) {
      gsap.to(imgRef.current, { scale: 1, duration: 0.3, ease: "power2.in" });
    }
    if (iconRef.current) {
      gsap.to(iconRef.current, { opacity: 0, scale: 0, duration: 0.25, ease: "power2.in" });
    }
  };

  return { cardRef, imgRef, iconRef, handleMouseEnter, handleMouseLeave };
}
