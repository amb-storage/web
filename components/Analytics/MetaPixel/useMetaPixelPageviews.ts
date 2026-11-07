"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "@/i18n/navigation";
import { trackMetaEvent } from "@/lib/metaPixel";

// PageView khi chuyển trang phía client; lần tải đầu do script nền tự gửi nên bỏ qua
export function useMetaPixelPageviews() {
    const pathname = usePathname();
    const first = useRef(true);

    useEffect(() => {
        if (first.current) {
            first.current = false;
            return;
        }
        trackMetaEvent("PageView");
    }, [pathname]);
}
