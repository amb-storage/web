"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

// Nội dung trang 404 hiện lần lượt từ dưới lên sau khi chữ "404" nhiễu xong phần intro
export function useNotFoundAnimation() {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(".not-found-reveal", {
        opacity: 1,
        y: 0,
        duration: 0.6,
        delay: 0.4,
        stagger: 0.1,
        ease: "power3.out",
      });
    }, contentRef);

    return () => ctx.revert();
  }, []);

  // Nút nhấc lên nhẹ khi hover
  const handleButtonEnter = (e: React.MouseEvent<HTMLElement>) => {
    gsap.to(e.currentTarget, { y: -3, duration: 0.3, ease: "power2.out" });
  };

  const handleButtonLeave = (e: React.MouseEvent<HTMLElement>) => {
    gsap.to(e.currentTarget, { y: 0, duration: 0.2, ease: "power2.in" });
  };

  return { contentRef, handleButtonEnter, handleButtonLeave };
}
