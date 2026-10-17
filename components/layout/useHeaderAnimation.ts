"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const DESKTOP_BREAKPOINT = 768; // Tailwind `md` — khớp với breakpoint ẩn/hiện hamburger

// Dropdown desktop dạng thanh ngang full màn hình: panel "kéo dài" từ đáy header xuống, các mục con trượt lên so le
export function useDesktopDropdown(openKey: string | null) {
  const panelRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const setPanelRef = (key: string) => (el: HTMLDivElement | null) => {
    if (el) panelRefs.current.set(key, el);
    else panelRefs.current.delete(key);
  };

  useEffect(() => {
    panelRefs.current.forEach((panel, key) => {
      const items = panel.querySelectorAll(".dropdown-item");
      const isOpening = key === openKey;
      const isVisible = panel.style.visibility === "visible";

      if (isOpening && !isVisible) {
        gsap.killTweensOf([panel, ...items]);
        gsap.set(panel, { visibility: "visible", opacity: 1 });

        const tl = gsap.timeline();
        // Panel mở rộng từ trên xuống (clip-path) để cảm giác menu dài ra
        tl.fromTo(
          panel,
          { clipPath: "inset(0% 0% 100% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 0.45, ease: "power3.out" }
        );
        if (items.length > 0) {
          tl.fromTo(
            items,
            { opacity: 0, y: 12 },
            { opacity: 1, y: 0, duration: 0.3, stagger: 0.05, ease: "power2.out" },
            "-=0.3"
          );
        }
      } else if (!isOpening && isVisible) {
        gsap.killTweensOf([panel, ...items]);
        gsap.to(panel, {
          clipPath: "inset(0% 0% 100% 0%)",
          duration: 0.25,
          ease: "power2.in",
          onComplete: () => {
            gsap.set(panel, { visibility: "hidden" });
          },
        });
      }
    });
  }, [openKey]);

  return { setPanelRef };
}

// Menu mobile: overlay + panel trượt xuống dưới header, các mục con so le (stagger) khi mở.
export function useMobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const open = () => {
    setIsOpen(true);
    document.body.style.overflow = "hidden";
  };

  const close = () => {
    document.body.style.overflow = "";
    setIsOpen(false);
  };

  const toggle = () => (isOpen ? close() : open());

  // Tự đóng menu mobile nếu resize lên desktop trong lúc đang mở.
  useEffect(() => {
    if (!isOpen) return;

    const handleResize = () => {
      if (window.innerWidth >= DESKTOP_BREAKPOINT) close();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen]);

  // Không để scroll nền bị khóa lại nếu component unmount trong lúc menu đang mở
  useEffect(() => {
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return { isOpen, overlayRef, panelRef, open, close, toggle };
}

// Accordion con trong menu mobile (mở/đóng danh sách sub-item của từng mục nav)
export function useMobileSubmenu() {
  const [openKey, setOpenKey] = useState<string | null>(null);
  const contentRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const chevronRefs = useRef<Map<string, SVGSVGElement>>(new Map());

  const setContentRef = (key: string) => (el: HTMLDivElement | null) => {
    if (el) contentRefs.current.set(key, el);
    else contentRefs.current.delete(key);
  };

  const setChevronRef = (key: string) => (el: SVGSVGElement | null) => {
    if (el) chevronRefs.current.set(key, el);
    else chevronRefs.current.delete(key);
  };

  const toggleSubmenu = (key: string) => {
    const nextOpenKey = openKey === key ? null : key;

    // Đóng mục đang mở (nếu có) trước khi mở mục mới
    if (openKey && openKey !== key) {
      const prevContent = contentRefs.current.get(openKey);
      const prevChevron = chevronRefs.current.get(openKey);
      if (prevContent) {
        gsap.killTweensOf(prevContent);
        gsap.to(prevContent, { height: 0, duration: 0.3, ease: "power2.inOut" });
      }
      if (prevChevron) {
        gsap.to(prevChevron, { rotate: 0, duration: 0.25, ease: "power2.out" });
      }
    }

    const content = contentRefs.current.get(key);
    const chevron = chevronRefs.current.get(key);
    const isOpening = openKey !== key;

    if (content) {
      gsap.killTweensOf(content);
      if (isOpening) {
        gsap.set(content, { height: "auto" });
        const fullHeight = content.offsetHeight;
        gsap.fromTo(
          content,
          { height: 0 },
          { height: fullHeight, duration: 0.3, ease: "power2.inOut" }
        );
      } else {
        gsap.to(content, { height: 0, duration: 0.3, ease: "power2.inOut" });
      }
    }

    if (chevron) {
      gsap.to(chevron, { rotate: isOpening ? 180 : 0, duration: 0.25, ease: "power2.out" });
    }

    setOpenKey(nextOpenKey);
  };

  const resetSubmenus = () => {
    contentRefs.current.forEach((el) => gsap.set(el, { height: 0 }));
    chevronRefs.current.forEach((el) => gsap.set(el, { rotate: 0 }));
    setOpenKey(null);
  };

  return { openKey, setContentRef, setChevronRef, toggleSubmenu, resetSubmenus };
}
