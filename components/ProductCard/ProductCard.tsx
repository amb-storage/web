"use client";

import Image, { StaticImageData } from "next/image";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { useProductCardAnimation } from "./useProductCardAnimation";

interface ProductCardProps {
  title: string;
  price: string;
  image: string | StaticImageData;
  href: string;
  /** "available" (mặc định, không hiện badge) | "low" (sắp hết hàng, badge xanh) | "soldOut" (hết hàng, badge đỏ). */
  stock?: "available" | "low" | "soldOut";
  stockLabel?: string;
  viewDetailsLabel: string;
  addToCartLabel: string;
  onAddToCart?: () => void;
}

export default function ProductCard({
  title,
  price,
  image,
  href,
  stock = "available",
  stockLabel,
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
          {/* Badge tồn kho: đỏ "在庫切れ" (Hết hàng) / xanh "在庫わずか" (Sắp hết hàng) */}
          {stock !== "available" && stockLabel && (
            <span
              className={cn(
                "absolute top-2 left-2 z-20 rounded px-2.5 py-1 text-xs font-semibold text-white",
                stock === "soldOut" ? "bg-red-600" : "bg-emerald-700"
              )}
            >
              {stockLabel}
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
