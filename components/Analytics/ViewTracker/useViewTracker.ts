"use client";

import { useEffect } from "react";
import { usePathname } from "@/i18n/navigation";

// Trang chi tiết sản phẩm: /shop/<slug> (pathname của next-intl đã bỏ prefix /en)
const PRODUCT_PATH = /^\/shop\/([^/]+)\/?$/;

// POST /api/v1/views mỗi lần chuyển trang (kể cả client-side); backend tự bỏ trùng trong 12 giờ.
// Chỉ gọi từ trình duyệt (useEffect) để IP là của khách, không phải của server web; không chặn render.
export function useViewTracker() {
    const pathname = usePathname();

    useEffect(() => {
        const productSlug = PRODUCT_PATH.exec(pathname)?.[1];
        fetch("/api/v1/views", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(productSlug ? { productSlug: decodeURIComponent(productSlug) } : {}),
            keepalive: true,
        }).catch(() => {});
    }, [pathname]);
}
