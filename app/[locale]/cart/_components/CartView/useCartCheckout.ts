"use client";

import { useState, type FormEvent } from "react";
import { useLocale } from "next-intl";
import { getPathname } from "@/i18n/navigation";
import { useCart } from "@/components/Cart/useCart";

export function useCartCheckout() {
    const locale = useLocale();
    const { checkout } = useCart();
    const [email, setEmail] = useState("");

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // Stripe quay về trang kết quả theo đúng ngôn ngữ (getPathname thêm prefix /en khi cần)
        const toUrl = (href: "/checkout/success" | "/checkout/cancel") =>
            new URL(getPathname({ href, locale }), window.location.origin);
        const successUrl = toUrl("/checkout/success");
        const cancelUrl = toUrl("/checkout/cancel");
        void checkout({
            email: email.trim(),
            successUrl: successUrl.toString(),
            cancelUrl: cancelUrl.toString(),
        });
    };

    return { email, setEmail, handleSubmit };
}
