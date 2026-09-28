"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { SPLASH_COMPLETE_EVENT, hasSplashPlayed } from "@/lib/splash";

export function useCategoryCardAnimation(index = 0) {
  const bgImageRef = useRef<HTMLImageElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Reveal ảnh (zoom-out về đúng size) + tiêu đề/CTA (fade lên), so le theo index - chạy ngay
  // khi splash screen xong (hoặc ngay lập tức nếu splash đã chạy trong phiên này rồi).
  useEffect(() => {
    const playEntrance = () => {
      if (!bgImageRef.current || !contentRef.current) return;

      gsap
        .timeline({ delay: index * 0.15 })
        .to(bgImageRef.current, {
          scale: 1,
          duration: 1,
          ease: "power3.out",
        })
        .to(
          contentRef.current,
          { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
          "-=0.6"
        );
    };

    if (hasSplashPlayed()) {
      playEntrance();
      return;
    }

    window.addEventListener(SPLASH_COMPLETE_EVENT, playEntrance, {
      once: true,
    });
    return () =>
      window.removeEventListener(SPLASH_COMPLETE_EVENT, playEntrance);
  }, [index]);

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

  return {
    bgImageRef,
    overlayRef,
    contentRef,
    handleMouseEnter,
    handleMouseLeave,
  };
}
