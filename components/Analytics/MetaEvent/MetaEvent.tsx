"use client";

import { useEffect } from "react";
import { trackMetaEvent, type MetaEventParams, type MetaStandardEvent } from "@/lib/metaPixel";

interface MetaEventProps {
    name: MetaStandardEvent;
    params?: MetaEventParams;
}

// Gửi 1 sự kiện Meta khi component hiện ra (vd. ViewContent ở trang chi tiết sản phẩm)
export default function MetaEvent({ name, params }: MetaEventProps) {
    const key = JSON.stringify(params ?? {});
    useEffect(() => {
        trackMetaEvent(name, JSON.parse(key) as MetaEventParams);
    }, [name, key]);
    return null;
}
