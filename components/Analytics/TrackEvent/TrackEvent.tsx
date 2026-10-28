"use client";

import { useEffect } from "react";
import { trackEvent, type AnalyticsEvent } from "@/lib/analytics";

interface TrackEventProps {
    name: AnalyticsEvent;
    title?: string;
}

// Gửi 1 sự kiện khi component hiện ra (vd. view_product ở trang chi tiết sản phẩm)
export default function TrackEvent({ name, title }: TrackEventProps) {
    useEffect(() => {
        trackEvent(name, title);
    }, [name, title]);
    return null;
}
