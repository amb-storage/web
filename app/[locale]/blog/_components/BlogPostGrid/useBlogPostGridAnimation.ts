"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Card bài viết hiện dần khi cuộn tới: trượt lên + ảnh "mở màn" từ dưới lên, so le theo từng hàng
export function useBlogPostGridAnimation() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gridRef.current) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.batch(".blog-post-card", {
        start: "top 88%",
        once: true,
        onEnter: (cards) => {
          const images = cards.map((card) =>
            card.querySelector(".blog-post-card-img")
          );

          gsap.to(cards, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.12,
            ease: "power3.out",
          });
          gsap.fromTo(
            images,
            { clipPath: "inset(100% 0% 0% 0%)", scale: 1.15 },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              scale: 1,
              duration: 0.9,
              stagger: 0.12,
              ease: "power3.out",
            }
          );
        },
      });
    }, gridRef);

    return () => ctx.revert();
  }, []);

  return { gridRef };
}
