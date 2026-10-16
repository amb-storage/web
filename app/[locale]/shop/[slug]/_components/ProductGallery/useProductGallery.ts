"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";

// null = panel đóng, "grid" = lưới tất cả ảnh, number = đang xem 1 ảnh trong panel
type PanelView = null | "grid" | number;

export function useProductGallery(imageCount: number) {
  const trackRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const panelScrollRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [panelView, setPanelView] = useState<PanelView>(null);

  // Đồng bộ số ảnh hiện tại theo vị trí scroll của slider (vuốt trên mobile cũng cập nhật)
  const handleTrackScroll = () => {
    const track = trackRef.current;
    if (!track || track.clientWidth === 0) return;
    const index = Math.round(track.scrollLeft / track.clientWidth);
    setActiveIndex(Math.min(Math.max(index, 0), imageCount - 1));
  };

  const goTo = useCallback((index: number) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollTo({ left: index * track.clientWidth, behavior: "smooth" });
  }, []);

  const goToDelta = (delta: number) => goTo(activeIndex + delta);

  const openGrid = () => setPanelView("grid");
  const openImage = (index: number) => {
    setPanelView(index);
    panelScrollRef.current?.scrollTo({ top: 0 });
  };
  const backToGrid = () => setPanelView("grid");
  const closePanel = useCallback(() => setPanelView(null), []);

  const isPanelOpen = panelView !== null;

  // Panel trượt vào từ trái + nền tối fade, giống trang tham khảo
  useEffect(() => {
    const panel = panelRef.current;
    const backdrop = backdropRef.current;
    if (!panel || !backdrop) return;

    gsap.killTweensOf([panel, backdrop]);

    if (isPanelOpen) {
      gsap.set([panel, backdrop], { display: "block" });
      gsap
        .timeline()
        .fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: "power2.out" })
        .fromTo(panel, { xPercent: -100 }, { xPercent: 0, duration: 0.5, ease: "power3.out" }, 0);
      closeButtonRef.current?.focus();
      return;
    }

    if (panel.style.display !== "block") return;
    gsap
      .timeline({
        onComplete: () => {
          gsap.set([panel, backdrop], { display: "none" });
        },
      })
      .to(panel, { xPercent: -100, duration: 0.3, ease: "power3.in" })
      .to(backdrop, { opacity: 0, duration: 0.25, ease: "power2.in" }, 0);
    triggerRef.current?.focus();
  }, [isPanelOpen]);

  // Esc để đóng panel
  useEffect(() => {
    if (!isPanelOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closePanel();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closePanel, isPanelOpen]);

  return {
    trackRef,
    panelRef,
    backdropRef,
    panelScrollRef,
    triggerRef,
    closeButtonRef,
    activeIndex,
    panelView,
    handleTrackScroll,
    goToDelta,
    openGrid,
    openImage,
    backToGrid,
    closePanel,
  };
}
