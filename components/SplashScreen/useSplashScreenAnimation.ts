"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import {
  SPLASH_COMPLETE_EVENT,
  hasSplashPlayed,
  markSplashPlayed,
} from "@/lib/splash";

// useLayoutEffect cảnh báo trên server - chỉ dùng bản layout thật khi đã ở browser
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

function finishSplash() {
  markSplashPlayed();
  window.dispatchEvent(new Event(SPLASH_COMPLETE_EVENT));
}

export function useSplashScreenAnimation() {
  const [isVisible, setIsVisible] = useState(true);
  const panelRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  // useLayoutEffect: nếu splash đã chạy trong phiên này rồi thì ẩn ngay trước khi browser
  // kịp paint, tránh bị "chớp" lại splash mỗi lần chuyển trang/đổi locale.
  useIsomorphicLayoutEffect(() => {
    if (hasSplashPlayed() || !panelRef.current || !leftRef.current || !rightRef.current) {
      finishSplash();
      setIsVisible(false);
      return;
    }

    document.body.style.overflow = "hidden";
    const left = leftRef.current;
    const right = rightRef.current;

    // Selector chỉ tìm trong splash; 2 bản nội dung (2 nửa) chạy cùng 1 timeline nên luôn khớp nhau
    const ctx = gsap.context(() => {
      gsap
        .timeline({
          onComplete: () => {
            document.body.style.overflow = "";
            finishSplash();
            setIsVisible(false);
          },
        })
        // 1. Logo hiện lên, giữ một nhịp
        .to(".splash-logo", { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "power3.out" })
        // 2. Tách đôi màn hình ngay giữa logo, hai nửa trượt sang hai bên
        .to(left, { xPercent: -100, duration: 0.9, ease: "power4.inOut" }, "+=0.5")
        .to(right, { xPercent: 100, duration: 0.9, ease: "power4.inOut" }, "<");
    }, panelRef);

    return () => {
      document.body.style.overflow = "";
      ctx.revert();
    };
  }, []);

  return { isVisible, panelRef, leftRef, rightRef };
}
