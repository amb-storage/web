"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import gsap from "gsap";
import { useCart } from "@/components/Cart/useCart";
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
    useEffect(() => {
        if (status !== "success" || !hydrated || !orderId || !email || cartCleared) return;
        void clear().then(() => savePendingCheckout({ orderId, email, cartCleared: true }));
    }, [cartCleared, clear, email, hydrated, orderId, status]);

    // Huỷ thanh toán: giữ nguyên giỏ để khách thanh toán lại, chỉ bỏ đơn đang chờ
    useEffect(() => {
        if (status === "cancel") removePendingCheckout();
    }, [status]);

    return { contentRef, checkout };
}
