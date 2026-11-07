"use client";

// Meta Pixel (quảng cáo Facebook/Instagram). Pixel ID không phải bí mật: luôn hiện trong mã nguồn trang.
export const META_PIXEL_ID = "1187127809903453";

// Chỉ bật ở bản production để `pnpm dev` không đẩy lượt xem / sự kiện giả lên tài khoản quảng cáo
export const META_PIXEL_ENABLED = process.env.NODE_ENV === "production";

// Sự kiện chuẩn của Meta dùng cho chuyển đổi quảng cáo
export type MetaStandardEvent =
    | "PageView"
    | "ViewContent"
    | "AddToCart"
    | "InitiateCheckout"
    | "Purchase";

export interface MetaEventParams {
    content_ids?: string[];
    content_name?: string;
    content_type?: "product";
    value?: number;
    currency?: "JPY";
    num_items?: number;
}

declare global {
    interface Window {
        fbq?: (...args: unknown[]) => void;
    }
}

// fbq tự xếp hàng lệnh gọi trước khi fbevents.js tải xong (stub trong script nền), nên gọi lúc nào cũng được.
// eventID giúp Meta bỏ trùng (vd. Purchase theo mã đơn).
export function trackMetaEvent(name: MetaStandardEvent, params?: MetaEventParams, eventId?: string) {
    if (!META_PIXEL_ENABLED || typeof window === "undefined" || typeof window.fbq !== "function") return;
    if (eventId) window.fbq("track", name, params ?? {}, { eventID: eventId });
    else if (params) window.fbq("track", name, params);
    else window.fbq("track", name);
}
