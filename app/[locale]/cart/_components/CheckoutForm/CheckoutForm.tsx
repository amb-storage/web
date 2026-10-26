"use client";

import { useTranslations } from "next-intl";
import { formatMoney } from "@/lib/storefront";
import { useCart } from "@/components/Cart/useCart";
import { cartErrorKey } from "@/components/Cart/cartApi";
import { cn } from "@/lib/utils";
import { useCheckoutForm, type CheckoutFormValues } from "./useCheckoutForm";

interface CheckoutFormProps {
    // Còn sản phẩm không mua được trong giỏ → khoá nút thanh toán
    hasUnavailable?: boolean;
}

type FieldConfig = {
    name: keyof CheckoutFormValues;
    type?: "email" | "tel" | "text";
    autoComplete: string;
    required?: boolean;
    className?: string;
};

const inputClass =
    "h-11 border border-gray-300 px-3 outline-none focus:border-(--brand-green)";

export default function CheckoutForm({ hasUnavailable = false }: CheckoutFormProps) {
    const t = useTranslations("cart");
    const { subtotal, pending, errorCode } = useCart();
    const { values, setField, requiresPrefecture, handleSubmit } = useCheckoutForm();

    const contactFields: FieldConfig[] = [
        { name: "email", type: "email", autoComplete: "email", required: true },
        { name: "recipientName", autoComplete: "name", required: true },
        { name: "phoneNumber", type: "tel", autoComplete: "tel", required: true },
    ];
    const addressFields: FieldConfig[] = [
        { name: "country", autoComplete: "country-name", required: true },
        { name: "postalCode", autoComplete: "postal-code", required: true },
        { name: "prefecture", autoComplete: "address-level1", required: requiresPrefecture },
        { name: "city", autoComplete: "address-level2", required: true },
        { name: "addressLine1", autoComplete: "address-line1", required: true, className: "md:col-span-2" },
        { name: "addressLine2", autoComplete: "address-line2", className: "md:col-span-2" },
    ];

    const renderField = ({ name, type = "text", autoComplete, required, className }: FieldConfig) => (
        <label key={name} className={cn("flex flex-col gap-2 text-sm", className)}>
            <span className="font-medium">
                {t(`shipping.fields.${name}.label`)}
                {!required && (
                    <span className="ml-1 font-normal text-gray-500">{t("shipping.optional")}</span>
                )}
            </span>
            <input
                type={type}
                name={name}
                required={required}
                autoComplete={autoComplete}
                value={values[name]}
                onChange={(event) => setField(name, event.target.value)}
                placeholder={t(`shipping.fields.${name}.placeholder`)}
                className={inputClass}
            />
        </label>
    );

    return (
        <form onSubmit={handleSubmit} className="mt-8 grid gap-10 md:grid-cols-[1fr_20rem]">
            <div className="flex flex-col gap-8">
                <fieldset className="flex flex-col gap-4">
                    <legend className="mb-4 text-lg font-bold text-(--brand-green)">
                        {t("shipping.contactTitle")}
                    </legend>
                    {contactFields.map(renderField)}
                </fieldset>
                <fieldset className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <legend className="mb-4 text-lg font-bold text-(--brand-green)">
                        {t("shipping.addressTitle")}
                    </legend>
                    {addressFields.map(renderField)}
                </fieldset>
            </div>

            <div className="flex flex-col gap-4 md:sticky md:top-24 md:self-start">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{t("total")}</span>
                    <span className="text-lg font-semibold">{formatMoney(subtotal)}</span>
                </div>
                {hasUnavailable && (
                    <p className="text-sm text-red-600">{t("removeUnavailable")}</p>
                )}
                {errorCode && (
                    <p role="alert" className="text-sm text-red-600">
                        {t(cartErrorKey(errorCode))}
                    </p>
                )}
                <button
                    type="submit"
                    disabled={pending || hasUnavailable}
                    className="flex h-12 items-center justify-center bg-(--brand-green) px-4 text-sm font-medium text-white transition-colors hover:bg-(--brand-green-dark) disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {t("checkout", { amount: formatMoney(subtotal) })}
                </button>
            </div>
        </form>
    );
}
