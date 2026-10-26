"use client";

import { useCallback, useEffect, useRef, type MouseEvent, type RefObject } from "react";
import gsap from "gsap";
import type { AccountDialogStep } from "./useCustomerAuth";

interface UseAccountDialogOptions {
    open: boolean;
    step: AccountDialogStep;
    errorCode: string | null;
    onClose: () => void;
    // Gọi mỗi lần mở dialog (kiểm tra session Customer hiện tại)
    onOpen: () => void;
    reset: () => void;
    triggerRef: RefObject<HTMLButtonElement | null>;
}

const focusableSelector =
    'button:not([disabled]), input:not([disabled]), select:not([disabled]), [href], [tabindex]:not([tabindex="-1"])';

const prefersReducedMotion = () =>
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Mở / đóng dialog, giữ focus trong dialog, khoá scroll và các animation GSAP của dialog đăng nhập
export function useAccountDialog({
    open,
    step,
    errorCode,
    onClose,
    onOpen,
    reset,
    triggerRef,
}: UseAccountDialogOptions) {
    const overlayRef = useRef<HTMLDivElement>(null);
    const dialogRef = useRef<HTMLElement>(null);
    const stepRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const wasOpenRef = useRef(false);
    const prevStepRef = useRef(step);

    const handleClose = useCallback(() => {
        reset();
        onClose();
    }, [onClose, reset]);

    // Bấm ra vùng tối bên ngoài thì đóng
    const handleOverlayClick = (event: MouseEvent<HTMLDivElement>) => {
        if (event.target === event.currentTarget) handleClose();
    };

    useEffect(() => {
        if (open) onOpen();
    }, [onOpen, open]);

    // Mở: nền tối hiện dần, khung dialog nổi lên rồi từng phần trượt vào lần lượt.
    // Đóng: khung lùi xuống + mờ đi, xong mới ẩn nền (autoAlpha → visibility hidden)
    useEffect(() => {
        const overlay = overlayRef.current;
        const dialog = dialogRef.current;
        if (!overlay || !dialog) return;
        // Lần render đầu (đang đóng) đã ẩn sẵn bằng class, không cần tween
        if (!open && !wasOpenRef.current) return;

        const items = dialog.querySelectorAll(".account-dialog-reveal");
        gsap.killTweensOf([overlay, dialog, ...items]);
        const tl = gsap.timeline();

        if (open) {
            tl.to(overlay, { autoAlpha: 1, duration: 0.3, ease: "power2.out" })
                .fromTo(
                    dialog,
                    { y: 32, scale: 0.97, opacity: 0 },
                    { y: 0, scale: 1, opacity: 1, duration: 0.5, ease: "power3.out" },
                    "<0.05",
                )
                .fromTo(
                    items,
                    { y: 12, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.4, ease: "power2.out", stagger: 0.05 },
                    "<0.15",
                );
        } else {
            tl.to(dialog, { y: 16, opacity: 0, duration: 0.25, ease: "power2.in" }).to(
                overlay,
                { autoAlpha: 0, duration: 0.2, ease: "power2.in" },
                "<0.05",
            );
        }
        if (prefersReducedMotion()) tl.progress(1);

        return () => {
            tl.kill();
        };
    }, [open]);

    // Đổi bước (Intro → Email → OTP…): nội dung mới trượt nhẹ từ phải vào thay vì nhảy
    useEffect(() => {
        const content = stepRef.current;
        const changed = prevStepRef.current !== step;
        prevStepRef.current = step;
        if (!open || !changed || !content || prefersReducedMotion()) return;
        gsap.killTweensOf(content);
        gsap.fromTo(
            content,
            { x: 16, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.35, ease: "power2.out" },
        );
    }, [open, step]);

    // Có lỗi (sai email / OTP) thì ô nhập rung nhẹ
    useEffect(() => {
        const input = inputRef.current;
        if (!errorCode || !input || prefersReducedMotion()) return;
        gsap.killTweensOf(input);
        gsap.to(input, {
            keyframes: { x: [0, -8, 8, -6, 6, -3, 0] },
            duration: 0.4,
            ease: "power2.out",
            clearProps: "transform",
        });
    }, [errorCode]);

    // Mở: focus nút đóng; đóng: trả focus về nút mở dialog
    useEffect(() => {
        if (open) {
            wasOpenRef.current = true;
            window.requestAnimationFrame(() => {
                dialogRef.current
                    ?.querySelector<HTMLElement>("[data-account-initial-focus]")
                    ?.focus();
            });
            return;
        }

        if (wasOpenRef.current) triggerRef.current?.focus();
    }, [open, triggerRef]);

    // Khoá scroll trang + Esc để đóng + giữ Tab vòng trong dialog
    useEffect(() => {
        if (!open) return;

        const previousOverflow = document.body.style.overflow;
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                event.preventDefault();
                handleClose();
                return;
            }

            if (event.key !== "Tab") return;

            const focusable = Array.from(
                dialogRef.current?.querySelectorAll<HTMLElement>(focusableSelector) ?? [],
            );
            if (focusable.length === 0) return;

            const first = focusable[0];
            const last = focusable[focusable.length - 1];

            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        };

        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [handleClose, open]);

    return { overlayRef, dialogRef, stepRef, inputRef, handleClose, handleOverlayClick };
}
