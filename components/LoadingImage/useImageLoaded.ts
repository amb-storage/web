"use client";

import { useCallback, useState } from "react";

// Theo dõi trạng thái tải ảnh để hiện skeleton cho đến khi ảnh sẵn sàng
export function useImageLoaded() {
    const [loaded, setLoaded] = useState(false);
    // Ảnh đã có trong cache có thể complete trước khi gắn onLoad
    const ref = useCallback((node: HTMLImageElement | null) => {
        if (node?.complete && node.naturalWidth > 0) setLoaded(true);
    }, []);
    const onLoad = useCallback(() => setLoaded(true), []);
    return { loaded, ref, onLoad };
}
