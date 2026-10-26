"use client";

import type { ReactNode } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { CONTACT_CATEGORIES } from "@/lib/api/types";
import { cn } from "@/lib/utils";
import { MESSAGE_MAX, useContactForm, type ContactField } from "./useContactForm";

interface ContactFormProps {
    // Email dự phòng hiện khi gửi lỗi (lấy từ Store settings, có thể null)
    fallbackEmail: string | null;
}

const inputClass =
    "w-full border border-gray-300 bg-white px-4 py-3 text-base text-black transition-colors placeholder:text-gray-400 focus:border-(--brand-green) focus:outline-none aria-invalid:border-red-600";

export default function ContactForm({ fallbackEmail }: ContactFormProps) {
    const t = useTranslations("contentPages.contact.form");
    const { values, errors, state, handleChange, handleSubmit, reset } = useContactForm();

    if (state === "sent") {
        return (
            <div role="status" className="flex flex-col items-center gap-4 border border-gray-200 px-6 py-12 text-center">
                <CheckCircle2 className="h-12 w-12 text-(--brand-green)" aria-hidden="true" />
                <h2 className="text-xl font-bold text-black md:text-2xl">{t("sent.title")}</h2>
                <p className="max-w-lg text-sm leading-7 text-gray-700 md:text-base">{t("sent.body")}</p>
                <button
                    type="button"
                    onClick={reset}
                    className="mt-2 text-sm text-(--brand-green) underline underline-offset-4"
                >
                    {t("sent.again")}
                </button>
            </div>
        );
    }

    const field = (name: ContactField, label: string, control: ReactNode, required = true, hint?: string) => (
        <div className="grid gap-2">
            <label htmlFor={`contact-${name}`} className="text-sm font-semibold text-black">
                {label}
                {required ? (
                    <span className="ml-2 bg-(--brand-green) px-1.5 py-0.5 text-[10px] font-semibold text-white">
                        {t("required")}
                    </span>
                ) : null}
            </label>
            {control}
            {errors[name] ? (
                <p id={`contact-${name}-error`} className="text-xs text-red-600">
                    {t(`errors.${errors[name]}`)}
                </p>
            ) : hint ? (
                <p className="text-xs text-gray-500">{hint}</p>
            ) : null}
        </div>
    );
    const aria = (name: ContactField) => ({
        id: `contact-${name}`,
        name,
        "aria-invalid": errors[name] ? true : undefined,
        "aria-describedby": errors[name] ? `contact-${name}-error` : undefined,
    });

    return (
        <form noValidate onSubmit={handleSubmit} className="grid gap-6">
            <div className="grid gap-6 md:grid-cols-2">
                {field(
                    "name",
                    t("name"),
                    <input {...aria("name")} autoComplete="name" value={values.name} onChange={handleChange} className={inputClass} />,
                )}
                {field(
                    "email",
                    t("email"),
                    <input {...aria("email")} type="email" autoComplete="email" value={values.email} onChange={handleChange} className={inputClass} />,
                )}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {field(
                    "category",
                    t("category"),
                    <select {...aria("category")} value={values.category} onChange={handleChange} className={cn(inputClass, !values.category && "text-gray-400")}>
                        <option value="" disabled>
                            {t("categoryPlaceholder")}
                        </option>
                        {CONTACT_CATEGORIES.map((category) => (
                            <option key={category} value={category} className="text-black">
                                {t(`categories.${category}`)}
                            </option>
                        ))}
                    </select>,
                )}
                {values.category === "ORDER"
                    ? field(
                          "orderNumber",
                          t("orderNumber"),
                          <input {...aria("orderNumber")} value={values.orderNumber} onChange={handleChange} placeholder="AMB-20260101-0001" className={inputClass} />,
                          false,
                          t("orderNumberHint"),
                      )
                    : null}
            </div>

            {field(
                "subject",
                t("subject"),
                <input {...aria("subject")} value={values.subject} onChange={handleChange} className={inputClass} />,
            )}
            {field(
                "message",
                t("message"),
                <textarea {...aria("message")} rows={8} value={values.message} onChange={handleChange} className={cn(inputClass, "resize-y leading-7")} />,
                true,
                t("messageCount", { count: values.message.length, max: MESSAGE_MAX }),
            )}

            {/* Honeypot: ẩn với người dùng và trình đọc màn hình, bot hay tự điền */}
            <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                <label>
                    Website
                    <input name="website" tabIndex={-1} autoComplete="off" value={values.website} onChange={handleChange} />
                </label>
            </div>

            <div className="grid gap-2">
                <label htmlFor="contact-agreed" className="flex items-start gap-3 text-sm leading-6 text-gray-700">
                    <input
                        {...aria("agreed")}
                        type="checkbox"
                        checked={values.agreed}
                        onChange={handleChange}
                        className="mt-1 h-4 w-4 shrink-0 accent-(--brand-green)"
                    />
                    <span>
                        {t.rich("agree", {
                            privacy: (chunks) => (
                                <Link href="/policy#store-guide-privacy" className="text-(--brand-green) underline underline-offset-4">
                                    {chunks}
                                </Link>
                            ),
                        })}
                    </span>
                </label>
                {errors.agreed ? (
                    <p id="contact-agreed-error" className="text-xs text-red-600">
                        {t("errors.agree")}
                    </p>
                ) : null}
            </div>

            {state === "failed" || state === "rateLimited" ? (
                <div role="alert" className="border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700">
                    {state === "rateLimited" ? t("rateLimited") : t("failed")}
                    {fallbackEmail ? (
                        <>
                            {" "}
                            {t("failedFallback")}{" "}
                            <a href={`mailto:${fallbackEmail}`} className="font-semibold underline underline-offset-4">
                                {fallbackEmail}
                            </a>
                        </>
                    ) : null}
                </div>
            ) : null}

            <button
                type="submit"
                disabled={state === "submitting"}
                className="inline-flex items-center justify-center gap-2 justify-self-center bg-(--brand-green) px-12 py-4 text-sm font-semibold tracking-wide text-white transition-colors hover:bg-[#14382c] disabled:cursor-wait disabled:opacity-70 md:min-w-72"
            >
                {state === "submitting" ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
                {state === "submitting" ? t("sending") : t("submit")}
            </button>
        </form>
    );
}
