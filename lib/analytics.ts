"use client";

// GoatCounter (không cookie). Admin đọc lại số liệu qua GET /admin/analytics
export const GOATCOUNTER_ENDPOINT = "https://amb-storage.goatcounter.com/count";
export const GOATCOUNTER_SCRIPT = "https://gc.zgo.at/count.js";

// Tên sự kiện phải khớp EVENT_NAMES của backend (view_product, add_to_cart, begin_checkout)
export type AnalyticsEvent = "view_product" | "add_to_cart" | "begin_checkout";

interface CountVars {
    path: string;
    title?: string;
    event?: boolean;
}

declare global {
    interface Window {
        goatcounter?: { count?: (vars: CountVars) => void } & Record<string, unknown>;
    }
}

// Hit gửi trước khi count.js tải xong được giữ lại rồi gửi khi script sẵn sàng
const queue: CountVars[] = [];

function send(vars: CountVars) {
    const count = window.goatcounter?.count;
    if (typeof count === "function") count(vars);
    else if (queue.length < 20) queue.push(vars);
}

export function flushAnalyticsQueue() {
    const count = window.goatcounter?.count;
    if (typeof count !== "function") return;
    while (queue.length) count(queue.shift()!);
}

// count.js chỉ tự đếm lần tải trang đầu; chuyển trang phía client phải tự đếm
export function trackPageview(path: string) {
    send({ path });
}

export function trackEvent(name: AnalyticsEvent, title?: string) {
    send({ path: name, title, event: true });
}
