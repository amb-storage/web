"use client";

import { useRef } from "react";
import gsap from "gsap";

export function useFeaturedPostImageAnimation() {
  const imgRef = useRef<HTMLImageElement>(null);

  const handleMouseEnter = () => {
    if (imgRef.current) {
      gsap.to(imgRef.current, {
        scale: 1.05,
        duration: 0.6,
        ease: "power2.out",
      });
    }
  };

  const handleMouseLeave = () => {
    if (imgRef.current) {
      gsap.to(imgRef.current, {
        scale: 1,
        duration: 0.6,
        ease: "power2.out",
      });
    }
  };

  return { imgRef, handleMouseEnter, handleMouseLeave };
}
