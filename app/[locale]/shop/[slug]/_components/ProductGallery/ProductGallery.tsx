"use client";

import { useTranslations } from "next-intl";
import Image, { StaticImageData } from "next/image";
import { ArrowLeft, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useProductGallery } from "./useProductGallery";

interface ProductGalleryProps {
  images: (string | StaticImageData)[];
  title: string;
  previousLabel: string;
  nextLabel: string;
}

export default function ProductGallery({
  images,
  title,
  previousLabel,
  nextLabel,
}: ProductGalleryProps) {
  const t = useTranslations("productDetail");
  const {
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
  } = useProductGallery(images.length);
  const total = images.length;

  return (
    <div className="relative w-full">
      {/* Slider ảnh chính: mỗi slide là 1 ô vuông nền gradient xám, ảnh blend multiply */}
      <div
        ref={trackRef}
        onScroll={handleTrackScroll}
        className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {images.map((image, index) => (
          <div
            key={index}
            className="grid aspect-square w-full shrink-0 snap-center place-items-center bg-linear-135 from-[#e2e0e0] to-[#f8f8f7]"
          >
            <div className="relative aspect-square w-[96.768%] mix-blend-multiply">
              <Image
                src={image}
                alt={`${title} ${index + 1}`}
                fill
                priority={index === 0}
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-contain"
              />
            </div>
          </div>
        ))}
      </div>

      {total > 1 && (
        <>
          <button
            type="button"
            onClick={() => goToDelta(-1)}
            disabled={activeIndex === 0}
            aria-label={previousLabel}
            className="absolute left-0 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center text-black/70 transition-opacity hover:text-black disabled:opacity-0 md:flex"
          >
            <ChevronLeft className="h-6 w-6" strokeWidth={1} />
          </button>
          <button
            type="button"
            onClick={() => goToDelta(1)}
            disabled={activeIndex === total - 1}
            aria-label={nextLabel}
            className="absolute right-0 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center text-black/70 transition-opacity hover:text-black disabled:opacity-0 md:flex"
          >
            <ChevronRight className="h-6 w-6" strokeWidth={1} />
          </button>
        </>
      )}

      {/* Nút đếm ảnh, bấm để mở lưới tất cả ảnh */}
      <button
        ref={triggerRef}
        type="button"
        onClick={openGrid}
        aria-label={t("viewAllImages")}
        className="absolute bottom-4 right-4 z-10 flex h-6 min-w-[63px] items-center justify-center gap-1 rounded-full bg-black/55 px-3 text-[11px] font-medium leading-4 text-white/55 md:bottom-8 md:right-8"
      >
        {/* Icon lưới 4 ô sát nhau, lấy theo trang tham khảo */}
        <svg aria-hidden viewBox="0 0 16 16" className="h-4 w-4 fill-white">
          <path d="M2 7.33V2h5.33v5.33H2Zm0 6.67V8.67h5.33V14H2Zm6.67-6.67V2H14v5.33H8.67Zm0 6.67V8.67H14V14H8.67Z" />
        </svg>
        <span className="text-white">{activeIndex + 1}</span>/
        <span className="text-white">{total}</span>
      </button>

      {/* Nền tối phía sau panel */}
      <div
        ref={backdropRef}
        onClick={closePanel}
        aria-hidden
        className="fixed inset-0 z-250 hidden touch-none bg-black/80 opacity-0"
      />

      {/* Panel nửa trái màn hình (full màn hình trên mobile) */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={t("viewAllImages")}
        className="fixed left-0 top-0 z-300 hidden h-full w-full bg-white md:w-1/2"
      >
        <div
          ref={panelScrollRef}
          data-lenis-prevent
          className="no-scrollbar h-full overflow-y-auto overscroll-contain"
          style={{ scrollbarWidth: "none" }}
        >
          {typeof panelView === "number" ? (
            <>
              <div className="flex items-center justify-between p-6 md:p-12">
                <button
                  type="button"
                  onClick={backToGrid}
                  aria-label={t("backToAllImages")}
                  className="-m-2 p-2"
                >
                  <ArrowLeft className="h-5 w-5" strokeWidth={1.25} />
                </button>
                <p className="text-[11px] font-medium leading-[1.45] text-black/55">
                  <span className="text-black">{panelView + 1}</span>/
                  <span className="text-black">{total}</span>
                </p>
                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={closePanel}
                  aria-label={t("closeAllImages")}
                  className="-m-2 p-2"
                >
                  <X className="h-5 w-5" strokeWidth={1.25} />
                </button>
              </div>
              <div className="relative aspect-square w-full">
                <Image
                  src={images[panelView]}
                  alt={`${title} ${panelView + 1}`}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-contain"
                />
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between p-6 md:p-12">
                <p className="text-sm font-light leading-6">
                  {t("viewAllImages")}
                </p>
                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={closePanel}
                  aria-label={t("closeAllImages")}
                  className="-m-2 p-2"
                >
                  <X className="h-5 w-5" strokeWidth={1.25} />
                </button>
              </div>
              <div className="grid grid-cols-4 gap-px">
                {images.map((image, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => openImage(index)}
                    aria-label={`${title} ${index + 1}`}
                    className="relative aspect-square w-full bg-linear-135 from-[#e2e0e0] to-[#f8f8f7]"
                  >
                    <Image
                      src={image}
                      alt=""
                      fill
                      sizes="(min-width: 768px) 12.5vw, 25vw"
                      className="object-contain mix-blend-multiply"
                    />
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
