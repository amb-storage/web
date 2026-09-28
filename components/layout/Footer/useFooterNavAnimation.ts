"use client";

import gsap from "gsap";

// Gạch chân chạy ra khi hover, giống hiệu ứng menu-indicator ở header
export function useFooterNavAnimation() {
  const handleMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const indicator = e.currentTarget.querySelector(".footer-nav-indicator");
    if (indicator) {
      gsap.to(indicator, { scaleX: 1, duration: 0.4, ease: "power3.out" });
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const indicator = e.currentTarget.querySelector(".footer-nav-indicator");
    if (indicator) {
      gsap.to(indicator, { scaleX: 0, duration: 0.3, ease: "power3.in" });
    }
  };

  return { handleMouseEnter, handleMouseLeave };
}
