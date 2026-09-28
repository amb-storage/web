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
  const contentRef = useRef<HTMLDivElement>(null);
  const barFillRef = useRef<HTMLDivElement>(null);

  // useLayoutEffect: nếu splash đã chạy trong phiên này rồi thì ẩn ngay trước khi browser
  // kịp paint, tránh bị "chớp" lại splash mỗi lần chuyển trang/đổi locale.
  useIsomorphicLayoutEffect(() => {
    if (hasSplashPlayed()) {
      finishSplash();
      setIsVisible(false);
      return;
    }

    if (!panelRef.current || !contentRef.current || !barFillRef.current) {
      finishSplash();
      setIsVisible(false);
      return;
    }

    document.body.style.overflow = "hidden";

    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = "";
        finishSplash();
        setIsVisible(false);
      },
    });

    tl.to(contentRef.current, {
      opacity: 1,
      scale: 1,
      duration: 0.6,
      ease: "power3.out",
    })
      .to(
        barFillRef.current,
        { scaleX: 1, duration: 0.7, ease: "power2.inOut" },
        "-=0.2"
      )
      .to(contentRef.current, {
        opacity: 0,
        y: -12,
        duration: 0.3,
        ease: "power2.in",
        delay: 0.3,
      })
      .to(
        panelRef.current,
        { yPercent: -100, duration: 0.7, ease: "power4.inOut" },
        "-=0.1"
      );

    return () => {
      document.body.style.overflow = "";
      tl.kill();
    };
  }, []);

  return { isVisible, panelRef, contentRef, barFillRef };
}
