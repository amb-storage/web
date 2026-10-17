"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// 3 cột Special Thanks / Brand Shop / Collector: tiêu đề trượt lên + gạch chân chạy ra, rồi từng dòng trượt vào so le
export function useBlogReferencesAnimation() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".blog-ref-group").forEach((group, index) => {
        const title = group.querySelector(".blog-ref-title");
        const underline = group.querySelector(".blog-ref-underline");
        const items = group.querySelectorAll(".blog-ref-item");

        const tl = gsap.timeline({
          delay: index * 0.15,
          scrollTrigger: {
            trigger: group,
            start: "top 85%",
            once: true,
          },
        });

        if (title) {
          tl.to(title, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" });
        }
        if (underline) {
          tl.to(underline, { scaleX: 1, duration: 0.5, ease: "power3.out" }, "-=0.25");
        }
        if (items.length > 0) {
          tl.to(
            items,
            { opacity: 1, x: 0, duration: 0.35, stagger: 0.05, ease: "power2.out" },
            "-=0.3"
          );
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return { sectionRef };
}
