"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";

export interface RefineFilters {
  category: string;
  period: string;
  size: string;
  priceMin: string;
  priceMax: string;
}

export type RefineGroup = "category" | "period" | "price" | "size";

export const emptyRefineFilters: RefineFilters = {
  category: "all",
  period: "all",
  size: "all",
  priceMin: "",
  priceMax: "",
};

export function hasRefineFilters(filters: RefineFilters) {
  return (
    filters.category !== "all" ||
    filters.period !== "all" ||
    filters.size !== "all" ||
    filters.priceMin !== "" ||
    filters.priceMax !== ""
  );
}

export function useRefineDrawer(
  open: boolean,
  applied: RefineFilters,
  onClose: () => void,
  onApply: (filters: RefineFilters) => void,
) {
  const panelRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const groupPanelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  // Drawer được mount lại mỗi lần mở (key ở ShopCatalog), nên bản nháp luôn bắt đầu từ bộ lọc đang áp dụng
  const [draft, setDraft] = useState<RefineFilters>(applied);
  const [activeGroup, setActiveGroup] = useState<RefineGroup | null>(null);

  // Drawer trượt vào từ phải + nền tối fade
  useEffect(() => {
    const panel = panelRef.current;
    const backdrop = backdropRef.current;
    if (!panel || !backdrop) return;

    gsap.killTweensOf([panel, backdrop]);

    if (open) {
      gsap.set([panel, backdrop], { display: "block" });
      gsap
        .timeline()
        .fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: "power2.out" })
        .fromTo(panel, { xPercent: 100 }, { xPercent: 0, duration: 0.5, ease: "power3.out" }, 0);
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
      .to(panel, { xPercent: 100, duration: 0.3, ease: "power3.in" })
      .to(backdrop, { opacity: 0, duration: 0.25, ease: "power2.in" }, 0);
  }, [open]);

  // Panel con (Category / Period / ...) trượt đè lên danh sách nhóm
  useEffect(() => {
    if (!activeGroup || !groupPanelRef.current) return;
    gsap.fromTo(
      groupPanelRef.current,
      { xPercent: 100 },
      { xPercent: 0, duration: 0.4, ease: "power3.out" },
    );
  }, [activeGroup]);

  // Esc: đang ở panel con thì quay lại, không thì đóng drawer
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (activeGroup) setActiveGroup(null);
      else onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeGroup, onClose, open]);

  const setDraftValue = useCallback((key: keyof RefineFilters, value: string) => {
    setDraft((current) => ({ ...current, [key]: value }));
  }, []);

  // Chọn 1 giá trị trong danh sách rồi quay lại màn nhóm, giống trang tham khảo
  const selectOption = (key: "category" | "period" | "size", value: string) => {
    setDraftValue(key, value);
    setActiveGroup(null);
  };

  const clearDraft = () => setDraft(emptyRefineFilters);

  const submit = () => {
    onApply(draft);
    onClose();
  };

  return {
    panelRef,
    backdropRef,
    groupPanelRef,
    closeButtonRef,
    draft,
    activeGroup,
    openGroup: setActiveGroup,
    closeGroup: () => setActiveGroup(null),
    setDraftValue,
    selectOption,
    clearDraft,
    submit,
  };
}
