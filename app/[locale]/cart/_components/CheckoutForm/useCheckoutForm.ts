"use client";

import { useState, type FormEvent } from "react";
import { useLocale, useTranslations } from "next-intl";
import { getPathname } from "@/i18n/navigation";
import { useCart } from "@/components/Cart/useCart";

export interface CheckoutFormValues {
    email: string;
    recipientName: string;
    phoneNumber: string;
    country: string;
    postalCode: string;
    prefecture: string;
    city: string;
    addressLine1: string;
    addressLine2: string;
}

// Cùng quy tắc backend (ShippingAddressDto): giao trong Nhật thì bắt buộc prefecture
export function isJapaneseCountry(country: string) {
    return ["JP", "JPN", "JAPAN", "日本"].includes(country.trim().toUpperCase());
}

export function useCheckoutForm() {
    const locale = useLocale();
    const t = useTranslations("cart.shipping");
    const { checkout } = useCart();
    const [values, setValues] = useState<CheckoutFormValues>(() => ({
        email: "",
        recipientName: "",
        phoneNumber: "",
        country: t("defaultCountry"),
        postalCode: "",
        prefecture: "",
        city: "",
        addressLine1: "",
        addressLine2: "",
    }));
    const requiresPrefecture = isJapaneseCountry(values.country);

    const setField = (field: keyof CheckoutFormValues, value: string) =>
        setValues((current) => ({ ...current, [field]: value }));

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // Stripe quay về trang kết quả theo đúng ngôn ngữ (getPathname thêm prefix /en khi cần)
        const toUrl = (href: "/checkout/success" | "/checkout/cancel") =>
            new URL(getPathname({ href, locale }), window.location.origin).toString();
        // Field tuỳ chọn để trống thì không gửi (backend chỉ lưu khi có giá trị)
        const prefecture = values.prefecture.trim();
        const addressLine2 = values.addressLine2.trim();
        void checkout({
            email: values.email.trim(),
            successUrl: toUrl("/checkout/success"),
            cancelUrl: toUrl("/checkout/cancel"),
            recipientName: values.recipientName.trim(),
            phoneNumber: values.phoneNumber.trim(),
            shippingAddress: {
                country: values.country.trim(),
                postalCode: values.postalCode.trim(),
                ...(prefecture ? { prefecture } : {}),
                city: values.city.trim(),
                addressLine1: values.addressLine1.trim(),
                ...(addressLine2 ? { addressLine2 } : {}),
            },
        });
    };

    return { values, setField, requiresPrefecture, handleSubmit };
}
