"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export function useLegalContentTransition() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Nội dung tab mới trồi nhẹ lên + fade in, khớp nhịp với gạch chân tab đang trượt
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const tween = gsap.fromTo(
      container,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power3.out", delay: 0.1, clearProps: "transform" },
    );
    return () => {
      tween.kill();
    };
  }, []);

  return { containerRef };
}
