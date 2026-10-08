"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import Image, { StaticImageData } from "next/image";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import { cn } from "@/lib/utils";
import { useCarousel } from "@/hooks/useCarousel";
import { useProductGalleryAnimation } from "./useProductGalleryAnimation";

interface ProductGalleryProps {
  images: (string | StaticImageData)[];
  title: string;
  previousLabel: string;
  nextLabel: string;
}

function toSrc(image: string | StaticImageData) {
  return typeof image === "string" ? image : image.src;
}

export default function ProductGallery({
  images,
  title,
  previousLabel,
  nextLabel,
}: ProductGalleryProps) {
  const t = useTranslations("productDetail");
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isAllImagesOpen, setIsAllImagesOpen] = useState(false);
  const allImagesDialogRef = useRef<HTMLDialogElement>(null);
  const { mainImageRef, playImageChange } = useProductGalleryAnimation();
  // Dùng lại hook carousel chung cho dải thumbnail (chỉ cần sliderRef/scroll/canScroll, không cần
  // resetAllHovers ở đây vì thumbnail không có hover-actions kiểu ProductCard)
  const { sliderRef, canScrollLeft, canScrollRight, scroll } = useCarousel(
    images.length
  );

  useEffect(() => {
    const dialog = allImagesDialogRef.current;
    if (!dialog) return;
    if (isAllImagesOpen && !dialog.open) dialog.showModal();
    if (!isAllImagesOpen && dialog.open) dialog.close();
  }, [isAllImagesOpen]);

  const goTo = (index: number) => {
    setActiveIndex(index);
    playImageChange();
  };

  const goToDelta = (delta: number) => {
    goTo((activeIndex + delta + images.length) % images.length);
  };

  return (
    <div className="flex min-w-0 max-w-full flex-col gap-4">
      {/* Ảnh chính */}
      <div className="relative aspect-square w-full overflow-hidden bg-zinc-50">
        <button
          type="button"
          onClick={() => setIsLightboxOpen(true)}
          className="group absolute inset-0 cursor-zoom-in"
          aria-label={title}
        >
          <div ref={mainImageRef} className="absolute inset-0">
            <Image
              src={images[activeIndex]}
              alt={`${title} ${activeIndex + 1}`}
              fill
              priority
              className="object-contain"
            />
          </div>

          {/* Icon phóng to, gợi ý bấm để xem full màn hình */}
          <span className="absolute left-3 top-3 z-10 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-(--brand-green) shadow-md">
            {t("imageCount", { current: activeIndex + 1, total: images.length })}
          </span>
          <span className="absolute bottom-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-(--brand-green) opacity-0 shadow-md transition-opacity group-hover:opacity-100">
            <Maximize2 className="h-4 w-4" />
          </span>
        </button>

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => goToDelta(-1)}
              aria-label={previousLabel}
              className="absolute left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-(--brand-green) shadow-md transition-colors hover:bg-white"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => goToDelta(1)}
              aria-label={nextLabel}
              className="absolute right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-(--brand-green) shadow-md transition-colors hover:bg-white"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {/* Dải thumbnail */}
      {images.length > 1 && (
        <div className="flex min-w-0 max-w-full items-center gap-2">
          <button
            type="button"
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            aria-label={previousLabel}
            className="hidden shrink-0 items-center justify-center rounded-full border border-gray-200 p-1.5 text-(--brand-green) transition-colors hover:bg-gray-100 disabled:pointer-events-none disabled:opacity-30 md:flex"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <div
            ref={sliderRef}
            className="no-scrollbar flex min-w-0 max-w-full flex-1 gap-2 overflow-x-auto scroll-smooth"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {images.map((image, index) => (
              <button
                key={index}
                type="button"
                onClick={() => goTo(index)}
                aria-label={`${title} ${index + 1}`}
                className={cn(
                  "relative h-18 w-18 shrink-0 overflow-hidden rounded border-2 transition-colors",
                  index === activeIndex
                    ? "border-(--brand-green)"
                    : "border-transparent"
                )}
              >
                <Image src={image} alt="" fill className="object-cover" />
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            aria-label={nextLabel}
            className="hidden shrink-0 items-center justify-center rounded-full border border-gray-200 p-1.5 text-(--brand-green) transition-colors hover:bg-gray-100 disabled:pointer-events-none disabled:opacity-30 md:flex"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      <button type="button" onClick={() => setIsAllImagesOpen(true)} className="self-start text-sm font-semibold text-(--brand-green) underline underline-offset-4">
        {t("viewAllImages")}
      </button>

      <Lightbox
        open={isLightboxOpen}
        close={() => setIsLightboxOpen(false)}
        index={activeIndex}
        on={{ view: ({ index }) => setActiveIndex(index) }}
        slides={images.map((image) => ({ src: toSrc(image), alt: title }))}
        plugins={[Zoom, Thumbnails]}
        zoom={{ scrollToZoom: true }}
      />

      <dialog
        ref={allImagesDialogRef}
        onCancel={(event) => { event.preventDefault(); setIsAllImagesOpen(false); }}
        onClick={(event) => { if (event.target === event.currentTarget) setIsAllImagesOpen(false); }}
        className="max-h-[92svh] w-[min(1100px,calc(100vw-2rem))] max-w-none overflow-y-auto bg-white p-4 shadow-2xl backdrop:bg-black/60 md:p-8"
      >
        <div className="mb-5 flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-gray-900">{t("viewAllImages")}</h2>
          <button type="button" autoFocus onClick={() => setIsAllImagesOpen(false)} className="rounded-full border border-gray-200 px-3 py-1.5 text-sm text-gray-700 hover:border-black hover:text-black">
            {t("closeAllImages")}
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
          {images.map((image, index) => (
            <button key={index} type="button" onClick={() => { goTo(index); setIsAllImagesOpen(false); }} className="relative aspect-square overflow-hidden bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-(--brand-green)">
              <Image src={image} alt={`${title} ${index + 1}`} fill className="object-contain" />
              <span className="absolute bottom-2 left-2 rounded bg-white/90 px-2 py-1 text-xs text-gray-700">{index + 1}</span>
            </button>
          ))}
        </div>
      </dialog>
    </div>
  );
}
