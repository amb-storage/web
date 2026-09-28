"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const DESKTOP_BREAKPOINT = 768; // Tailwind `md` — khớp với breakpoint ẩn/hiện hamburger

// Hiệu ứng GSAP Hover ĐỈnh Cao (dropdown desktop khi hover vào từng mục menu)
export function useDesktopDropdown() {
  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    const indicator = e.currentTarget.querySelector(".menu-indicator");
    const dropdown = e.currentTarget.querySelector(".dropdown-menu");
    const items = e.currentTarget.querySelectorAll(".dropdown-item");
    const chevron = e.currentTarget.querySelector(".chevron-icon");

    // 1. Chạy gạch chân underline
    if (indicator) {
      gsap.to(indicator, { scaleX: 1, duration: 0.4, ease: "power3.out" });
    }

    // 2. Xoay icon mũi tên xuống
    if (chevron) {
      gsap.to(chevron, { rotate: 180, duration: 0.3, ease: "power2.out" });
    }

    // 3. Dropdown hiện lên với hiệu ứng mượt (Scale từ nhỏ + Fade in)
    if (dropdown) {
      gsap.killTweensOf(dropdown); // Xóa các animation cũ đang chạy dở để tránh giật
      gsap.set(dropdown, { display: "block" });

      const tl = gsap.timeline();
      tl.fromTo(
        dropdown,
        { opacity: 0, y: 15, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: "power3.out" }
      );

      // Hiệu ứng Stagger: Các mục con trượt ra lần lượt từng cái cực kỳ sang trọng
      if (items.length > 0) {
        tl.fromTo(
          items,
          { opacity: 0, x: -10 },
          { opacity: 1, x: 0, duration: 0.25, stagger: 0.05, ease: "power2.out" },
          "-=0.2" // Chạy lướt sóng cùng lúc với dropdown mở ra
        );
      }
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const indicator = e.currentTarget.querySelector(".menu-indicator");
    const dropdown = e.currentTarget.querySelector(".dropdown-menu");
    const chevron = e.currentTarget.querySelector(".chevron-icon");

    if (indicator) {
      gsap.to(indicator, { scaleX: 0, duration: 0.3, ease: "power3.in" });
    }

    if (chevron) {
      gsap.to(chevron, { rotate: 0, duration: 0.3, ease: "power2.out" });
    }

    if (dropdown) {
      gsap.killTweensOf(dropdown);
      gsap.to(dropdown, {
        opacity: 0,
        y: 10,
        scale: 0.95,
        duration: 0.2,
        ease: "power2.in",
        onComplete: () => {
          gsap.set(dropdown, { display: "none" });
        },
      });
    }
  };

  return { handleMouseEnter, handleMouseLeave };
}

// Menu mobile: overlay + panel trượt xuống dưới header, các mục con so le (stagger) khi mở.
export function useMobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const open = () => {
    const overlay = overlayRef.current;
    const panel = panelRef.current;
    if (!panel) return;

    setIsOpen(true);
    // Khóa scroll nền khi menu mobile đang mở
    document.body.style.overflow = "hidden";

    const items = panel.querySelectorAll(".mobile-nav-item");

    gsap.killTweensOf([overlay, panel, items].filter(Boolean) as gsap.TweenTarget[]);

    if (overlay) {
      gsap.set(overlay, { display: "block" });
      gsap.fromTo(overlay, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: "power2.out" });
    }

    gsap.set(panel, { display: "block" });
    const tl = gsap.timeline();
    tl.fromTo(
      panel,
      { opacity: 0, y: -16 },
      { opacity: 1, y: 0, duration: 0.35, ease: "power3.out" }
    );

    if (items.length > 0) {
      tl.fromTo(
        items,
        { opacity: 0, x: -12 },
        { opacity: 1, x: 0, duration: 0.3, stagger: 0.06, ease: "power2.out" },
        "-=0.2"
      );
    }
  };

  const close = () => {
    const overlay = overlayRef.current;
    const panel = panelRef.current;

    document.body.style.overflow = "";

    if (!panel) {
      setIsOpen(false);
      return;
    }

    gsap.killTweensOf([overlay, panel].filter(Boolean) as gsap.TweenTarget[]);

    if (overlay) {
      gsap.to(overlay, {
        opacity: 0,
        duration: 0.2,
        ease: "power2.in",
        onComplete: () => gsap.set(overlay, { display: "none" }),
      });
    }

    gsap.to(panel, {
      opacity: 0,
      y: -16,
      duration: 0.25,
      ease: "power2.in",
      onComplete: () => {
        gsap.set(panel, { display: "none" });
        setIsOpen(false);
      },
    });
  };

  const toggle = () => (isOpen ? close() : open());

  // Tự đóng menu mobile nếu resize lên desktop trong lúc đang mở, tránh panel bị kẹt display:block
  // (gsap set inline style nên đè cả class `md:hidden`).
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
