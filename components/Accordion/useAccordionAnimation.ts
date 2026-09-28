"use client";

import { useRef, useState } from "react";
import gsap from "gsap";

export function useAccordionAnimation(defaultOpen = false) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const contentRef = useRef<HTMLDivElement>(null);
  const chevronRef = useRef<SVGSVGElement>(null);

  const toggle = () => {
    const content = contentRef.current;
    if (!content) return;

    gsap.killTweensOf(content);

    if (isOpen) {
      gsap.to(content, {
        height: 0,
        duration: 0.35,
        ease: "power2.inOut",
      });
    } else {
      // Đo chiều cao thật của nội dung rồi tween từ 0 tới đó (GSAP không animate được "auto")
      gsap.set(content, { height: "auto" });
      const fullHeight = content.offsetHeight;
      gsap.fromTo(
        content,
        { height: 0 },
        { height: fullHeight, duration: 0.35, ease: "power2.inOut" }
      );
    }

    if (chevronRef.current) {
      gsap.to(chevronRef.current, {
        rotate: isOpen ? 0 : 180,
        duration: 0.3,
        ease: "power2.out",
      });
    }

    setIsOpen(!isOpen);
  };

  return { isOpen, contentRef, chevronRef, toggle };
}
