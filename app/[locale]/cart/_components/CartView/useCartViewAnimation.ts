"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

const prefersReducedMotion = () =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Animation trang giỏ hàng: các dòng sản phẩm + form thanh toán hiện dần khi giỏ tải xong,
// xoá sản phẩm thì dòng đó thu gọn lại rồi mới gọi API
export function useCartViewAnimation(
    hydrated: boolean,
    itemCount: number,
    remove: (productId: string) => Promise<void>,
) {
    const contentRef = useRef<HTMLDivElement>(null);
    const revealedRef = useRef(false);

    // useLayoutEffect + fromTo: đặt trạng thái ẩn trước khi trình duyệt vẽ nên không bị nháy
    useLayoutEffect(() => {
        const content = contentRef.current;
        if (!hydrated || itemCount === 0 || !content || revealedRef.current) return;
        revealedRef.current = true;
        if (prefersReducedMotion()) return;
        const items = content.querySelectorAll(".cart-reveal");
        gsap.fromTo(
            items,
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5, ease: "power3.out", stagger: 0.06, clearProps: "transform" },
        );
    }, [hydrated, itemCount]);

    const handleRemove = async (productId: string) => {
        const line = contentRef.current?.querySelector<HTMLElement>(
            `[data-cart-line="${CSS.escape(productId)}"]`,
        );
        if (!line || prefersReducedMotion()) {
            await remove(productId);
            return;
        }
        gsap.killTweensOf(line);
        await gsap.to(line, {
            x: 24,
            opacity: 0,
            height: 0,
            paddingTop: 0,
            paddingBottom: 0,
            duration: 0.35,
            ease: "power2.in",
        });
        await remove(productId);
        // Xoá lỗi (dòng vẫn còn trong giỏ) → mở lại dòng như cũ
        if (line.isConnected) {
            gsap.set(line, { clearProps: "all" });
            gsap.from(line, { x: 24, opacity: 0, duration: 0.3, ease: "power2.out" });
        }
    };

    return { contentRef, handleRemove };
}
