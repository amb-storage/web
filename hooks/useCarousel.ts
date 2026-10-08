"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

/**
 * Điều khiển carousel cuộn ngang cho danh sách `ProductCard` (SpecialVintage, NewArrivals,
 * MostPopular): nút trái/phải, tự disable khi tới đầu/cuối, và reset "cứng" (không animate)
 * hiệu ứng hover của mọi card khi carousel cuộn hoặc khi chuột rời cả dải quá nhanh - hai
 * trường hợp này mouseleave của từng card không kịp bắn nên ảnh/nút hành động có thể bị kẹt
 * lại ở trạng thái đang hover.
 */
export function useCarousel(
  itemCount: number,
  { scrollByItem = false }: { scrollByItem?: boolean } = {},
) {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = () => {
    const slider = sliderRef.current;
    if (!slider) return;

    setCanScrollLeft(slider.scrollLeft > 0);
    setCanScrollRight(
      slider.scrollLeft + slider.clientWidth < slider.scrollWidth - 1
    );
  };

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    updateScrollState();
    slider.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);

    return () => {
      slider.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [itemCount]);

  const scroll = (direction: "left" | "right") => {
    const slider = sliderRef.current;
    if (!slider) return;

    const firstItem = slider.firstElementChild as HTMLElement | null;
    const gap = Number.parseFloat(window.getComputedStyle(slider).columnGap) || 0;
    const itemScrollAmount = firstItem
      ? firstItem.getBoundingClientRect().width + gap
      : 350;
    const scrollAmount = (scrollByItem ? itemScrollAmount : 350) *
      (direction === "left" ? -1 : 1);
    slider.scrollBy({
      left: scrollAmount,
      behavior: "smooth",
    });
  };

  const resetAllHovers = () => {
    const slider = sliderRef.current;
    if (!slider) return;

    const imgs = slider.querySelectorAll(".product-card-img");
    const actions = slider.querySelectorAll(".product-card-actions");
    const infos = slider.querySelectorAll(".product-card-info");

    gsap.killTweensOf(imgs);
    gsap.killTweensOf(actions);
    gsap.killTweensOf(infos);
    // Let the ProductCard CSS hover state control these properties again.
    // Writing opacity/transform inline here prevents group-hover from working
    // on the next hover.
    gsap.set(imgs, { clearProps: "transform" });
    gsap.set(actions, { clearProps: "opacity,transform" });
    gsap.set(infos, { clearProps: "transform" });
  };

  return {
    sliderRef,
    canScrollLeft,
    canScrollRight,
    scroll,
    resetAllHovers,
  };
}
