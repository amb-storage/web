"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Card nảy lên (pop-in) khi cuộn tới, so le theo index
export function useCustomerVoiceCardAnimation(index: number) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(cardRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        delay: index * 0.12,
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

  return { cardRef };
}
