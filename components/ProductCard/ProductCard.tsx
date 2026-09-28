"use client";

import Image, { StaticImageData } from "next/image";
import { Link } from "@/i18n/navigation";
import { useProductCardAnimation } from "./useProductCardAnimation";

interface ProductCardProps {
  title: string;
  price: string;
  image: string | StaticImageData;
  href: string;
  isSoldOut?: boolean;
  soldOutLabel?: string;
  viewDetailsLabel: string;
  addToCartLabel: string;
  onAddToCart?: () => void;
}

export default function ProductCard({
  title,
  price,
  image,
  href,
  isSoldOut = false,
  soldOutLabel,
  viewDetailsLabel,
  addToCartLabel,
  onAddToCart,
}: ProductCardProps) {
  const { imgRef, actionsRef, infoRef, handleMouseEnter, handleMouseLeave, handleAddToCartClick } =
    useProductCardAnimation({ onAddToCart });

  return (
    <div
      className="product-card min-w-65 md:min-w-70 shrink-0 cursor-pointer group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link href={href} className="block">
        {/* Khung ảnh sản phẩm: Trong suốt hoàn toàn, không shadow, nằm trọn trên nền trắng */}
        <div className="relative h-90 flex items-center justify-center p-4">
          {/* Badge "在庫切れ" (Hết hàng) */}
          {isSoldOut && soldOutLabel && (
            <span className="absolute top-2 left-2 z-20 bg-red-600 text-white text-xs font-semibold px-2.5 py-1 rounded">
              {soldOutLabel}
            </span>
          )}

          {/* Ảnh sản phẩm tách nền */}
          <div className="w-full h-full relative">
            <Image
              ref={imgRef}
              src={image}
              alt={title}
              fill
              className="product-card-img object-contain transition-transform"
            />
          </div>

          {/* Cặp nút Xem chi tiết / Thêm vào giỏ, chạy hiệu ứng GSAP trượt lên khi hover */}
          <div
            ref={actionsRef}
            className="product-card-actions absolute bottom-4 left-1/2 z-20 flex w-[90%] -translate-x-1/2 translate-y-6 gap-2 opacity-0"
          >
            <span className="flex-1 rounded-md bg-[#1B3B2B] py-2.5 text-center text-xs font-medium tracking-wide text-white shadow-xl transition-colors hover:bg-[#12271d]">
              {viewDetailsLabel}
            </span>
            <button
              type="button"
              onClick={handleAddToCartClick}
              className="flex-1 rounded-md border border-gray-200 bg-white/95 py-2.5 text-center text-xs font-medium tracking-wide text-[#1B3B2B] shadow-xl transition-colors hover:bg-white"
            >
              {addToCartLabel}
            </button>
          </div>
        </div>

        {/* Thông tin sản phẩm (Tiêu đề & Giá) */}
        <div ref={infoRef} className="product-card-info mt-3 px-1">
          <h3 className="text-sm font-normal text-gray-700 line-clamp-2 min-h-[40px] group-hover:text-black transition-colors">
            {title}
          </h3>
          <p className="mt-1.5 font-bold text-gray-900 text-base">{price}</p>
        </div>
      </Link>
    </div>
  );
}
