"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "@/i18n/navigation";
import { trackPageview } from "@/lib/analytics";

// Đếm lượt xem khi chuyển trang phía client; lần tải đầu do count.js tự đếm nên bỏ qua
export function useGoatCounterPageviews() {
    const pathname = usePathname();
    const first = useRef(true);

    useEffect(() => {
        if (first.current) {
            first.current = false;
            return;
        }
        // Đường dẫn đầy đủ (có /en khi cần), giống lượt đếm của count.js
        trackPageview(window.location.pathname);
    }, [pathname]);
}
