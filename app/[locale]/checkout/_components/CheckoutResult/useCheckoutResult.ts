"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import gsap from "gsap";
import { useCart } from "@/components/Cart/useCart";
import { trackMetaEvent } from "@/lib/metaPixel";
import {
    parsePendingCheckout,
    readPendingCheckoutRaw,
    removePendingCheckout,
    savePendingCheckout,
} from "@/components/Cart/checkoutStorage";

export type CheckoutResultStatus = "success" | "cancel";

const subscribe = () => () => {};
const getServerSnapshot = () => null;

export function useCheckoutResult(status: CheckoutResultStatus) {
    const { clear, hydrated } = useCart();
    const contentRef = useRef<HTMLDivElement>(null);
    // Đọc sessionStorage sau khi hydrate (server luôn là null) để không lệch markup
    const raw = useSyncExternalStore(subscribe, readPendingCheckoutRaw, getServerSnapshot);
    const checkout = parsePendingCheckout(raw);

    // Nội dung hiện dần từ dưới lên giống trang 404
    useEffect(() => {
        const content = contentRef.current;
        if (!content) return;
        const items = content.querySelectorAll(".checkout-result-reveal");
        gsap.killTweensOf(items);
        gsap.to(items, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power3.out",
            stagger: 0.06,
        });
    }, []);

    // Thanh toán xong: xoá giỏ hiện tại đúng 1 lần cho đơn vừa tạo.
    // Không có đơn trong storage (vào thẳng URL) thì không đụng tới giỏ.
    const orderId = checkout?.orderId;
    const email = checkout?.email;
    const cartCleared = checkout?.cartCleared;
    const value = checkout?.value;
    // Chuỗi JSON để làm dependency ổn định (mảng parse lại mỗi lần render)
    const contentIdsKey = JSON.stringify(checkout?.contentIds ?? []);
    useEffect(() => {
        if (status !== "success" || !hydrated || !orderId || !email || cartCleared) return;
        const contentIds = JSON.parse(contentIdsKey) as string[];
        // Purchase gửi đúng 1 lần cho mỗi đơn (cùng lúc xoá giỏ); eventID = mã đơn để Meta bỏ trùng
        trackMetaEvent(
            "Purchase",
            { content_ids: contentIds, content_type: "product", value: value ?? 0, currency: "JPY" },
            orderId,
        );
        void clear().then(() =>
            savePendingCheckout({ orderId, email, value, contentIds, cartCleared: true }),
        );
    }, [cartCleared, clear, contentIdsKey, email, hydrated, orderId, status, value]);

    // Huỷ thanh toán: giữ nguyên giỏ để khách thanh toán lại, chỉ bỏ đơn đang chờ
    useEffect(() => {
        if (status === "cancel") removePendingCheckout();
    }, [status]);

    return { contentRef, checkout };
}
