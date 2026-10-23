"use client";

import { useState, type FormEvent } from "react";
import { useCart } from "@/components/Cart/useCart";

export function useCartCheckout() {
    const { checkout } = useCart();
    const [email, setEmail] = useState("");

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // Giữ nguyên prefix locale (/en) để quay về đúng ngôn ngữ sau khi thanh toán
        const returnUrl = new URL(window.location.pathname, window.location.origin);
        const successUrl = new URL(returnUrl);
        successUrl.searchParams.set("checkout", "success");
        const cancelUrl = new URL(returnUrl);
        cancelUrl.searchParams.set("checkout", "cancel");
        void checkout({
            email: email.trim(),
            successUrl: successUrl.toString(),
            cancelUrl: cancelUrl.toString(),
        });
    };

    return { email, setEmail, handleSubmit };
}
