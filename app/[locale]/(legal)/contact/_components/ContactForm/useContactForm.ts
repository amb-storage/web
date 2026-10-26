"use client";

import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useLocale } from "next-intl";
import { ApiClientError } from "@/lib/api/client";
import type { ApiContactCategory, ApiLocale } from "@/lib/api/types";
import { sendContact } from "./contactApi";

export const MESSAGE_MAX = 5000;

export interface ContactValues {
    name: string;
    email: string;
    category: ApiContactCategory | "";
    orderNumber: string;
    subject: string;
    message: string;
    agreed: boolean;
    website: string;
}

export type ContactField = Exclude<keyof ContactValues, "website">;
export type ContactErrorKey = "required" | "email" | "tooLong" | "agree";
export type SubmitState = "idle" | "submitting" | "sent" | "failed" | "rateLimited";

const EMPTY: ContactValues = {
    name: "",
    email: "",
    category: "",
    orderNumber: "",
    subject: "",
    message: "",
    agreed: false,
    website: "",
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values: ContactValues) {
    const errors: Partial<Record<ContactField, ContactErrorKey>> = {};
    if (!values.name.trim()) errors.name = "required";
    else if (values.name.trim().length > 100) errors.name = "tooLong";
    if (!values.email.trim()) errors.email = "required";
    else if (!EMAIL.test(values.email.trim())) errors.email = "email";
    if (!values.category) errors.category = "required";
    if (!values.subject.trim()) errors.subject = "required";
    else if (values.subject.trim().length > 200) errors.subject = "tooLong";
    if (!values.message.trim()) errors.message = "required";
    else if (values.message.length > MESSAGE_MAX) errors.message = "tooLong";
    if (!values.agreed) errors.agreed = "agree";
    return errors;
}

export function useContactForm() {
    const locale = useLocale() as ApiLocale;
    const [values, setValues] = useState<ContactValues>(EMPTY);
    const [errors, setErrors] = useState<Partial<Record<ContactField, ContactErrorKey>>>({});
    const [state, setState] = useState<SubmitState>("idle");

    const handleChange = (
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    ) => {
        const { name, value } = event.target;
        const next =
            event.target instanceof HTMLInputElement && event.target.type === "checkbox"
                ? event.target.checked
                : value;
        setValues((current) => ({ ...current, [name]: next }));
        // Sửa ô nào thì xoá lỗi ô đó, không bắt khách bấm gửi lại mới thấy hết lỗi
        setErrors((current) => ({ ...current, [name]: undefined }));
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const nextErrors = validate(values);
        setErrors(nextErrors);
        const firstInvalid = Object.keys(nextErrors)[0];
        if (firstInvalid) {
            document.getElementById(`contact-${firstInvalid}`)?.focus();
            return;
        }
        setState("submitting");
        try {
            await sendContact({
                name: values.name.trim(),
                email: values.email.trim(),
                category: values.category as ApiContactCategory,
                subject: values.subject.trim(),
                message: values.message.trim(),
                orderNumber:
                    values.category === "ORDER" && values.orderNumber.trim()
                        ? values.orderNumber.trim()
                        : null,
                locale,
                website: values.website,
            });
            setState("sent");
            setValues(EMPTY);
        } catch (error) {
            setState(error instanceof ApiClientError && error.status === 429 ? "rateLimited" : "failed");
        }
    };

    return {
        values,
        errors,
        state,
        handleChange,
        handleSubmit,
        reset: () => setState("idle"),
    };
}
