"use client";

import { useSyncExternalStore, type RefObject } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { CheckCircle2, CreditCard, History, UserRound, X } from "lucide-react";
import logo from "@/assets/logo.png";
import { cn } from "@/lib/utils";
import { useAccountDialog } from "./useAccountDialog";
import { useCustomerAuth, type AccountDialogStep } from "./useCustomerAuth";

interface AccountDialogProps {
    open: boolean;
    onClose: () => void;
    triggerRef: RefObject<HTMLButtonElement | null>;
}

const subscribeToClient = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

// Mã lỗi backend → key message; mã lạ thì hiện lỗi chung
function errorKey(step: AccountDialogStep, code: string) {
    if (code === "OTP_FORMAT") return "account.otp.invalidFormat";
    if (code.includes("RATE_LIMIT") || code.includes("COOLDOWN")) return "account.errors.rateLimited";
    if (step === "OTP" && (code.includes("OTP") || code.includes("CHALLENGE")))
        return "account.otp.invalid";
    return "account.errors.generic";
}

export function AccountDialog({
    open,
    onClose,
    triggerRef,
}: AccountDialogProps) {
    const t = useTranslations("homepage.header");
    const isClient = useSyncExternalStore(
        subscribeToClient,
        getClientSnapshot,
        getServerSnapshot,
    );
    const {
        step,
        setStep,
        email,
        setEmail,
        otp,
        setOtp,
        customerEmail,
        errorCode,
        pending,
        loadSession,
        reset,
        requestOtp,
        verifyOtp,
        logout,
    } = useCustomerAuth();
    const { overlayRef, dialogRef, stepRef, inputRef, handleClose, handleOverlayClick } =
        useAccountDialog({ open, step, errorCode, onClose, onOpen: loadSession, reset, triggerRef });

    if (!isClient || typeof document === "undefined") return null;

    return createPortal(
        // Trạng thái ẩn ban đầu bằng class (invisible + opacity-0), GSAP trong useAccountDialog lo mở / đóng
        <div
            ref={overlayRef}
            aria-hidden={!open}
            className="invisible fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-black/50 p-4 opacity-0"
            onClick={handleOverlayClick}
            role="presentation"
        >
            <section
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="account-dialog-title"
                tabIndex={-1}
                className="relative flex max-h-[calc(100svh-2rem)] w-full max-w-[38rem] flex-col overflow-y-auto overscroll-contain bg-white text-black opacity-0 shadow-2xl"
            >
                <header className="account-dialog-reveal flex justify-center px-6 pt-8 md:px-10 md:pt-10">
                    <div className="relative h-12 w-60 md:h-[51px] md:w-[238px]">
                        <Image
                            src={logo}
                            alt={t("logoAlt")}
                            fill
                            className="object-contain"
                        />
                    </div>
                </header>

                <div ref={stepRef} className="account-dialog-reveal flex-1">
                    {step === "INTRO" ? (
                        <div className="space-y-6 px-6 pt-8 md:px-10">
                            <div className="flex flex-col items-start gap-4">
                                <UserRound className="h-12 w-12 rounded-full bg-gray-100 p-2.5 text-(--brand-green)" />
                                <h2
                                    id="account-dialog-title"
                                    className="text-xl font-bold leading-tight text-gray-900 md:text-2xl"
                                >
                                    {t("account.title")}
                                </h2>
                            </div>

                            <div className="divide-y divide-gray-200 border-y border-gray-200">
                                <div className="flex items-start gap-4 py-4 text-sm text-gray-800 md:text-base">
                                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-(--brand-green)" />
                                    <span>{t("account.benefits.status")}</span>
                                </div>
                                <div className="flex items-start gap-4 py-4 text-sm text-gray-800 md:text-base">
                                    <History className="mt-0.5 h-5 w-5 shrink-0 text-(--brand-green)" />
                                    <span>{t("account.benefits.history")}</span>
                                </div>
                                <div className="flex items-start gap-4 py-4 text-sm text-gray-800 md:text-base">
                                    <CreditCard className="mt-0.5 h-5 w-5 shrink-0 text-(--brand-green)" />
                                    <span>{t("account.benefits.payment")}</span>
                                </div>
                            </div>
                        </div>
                    ) : step === "SIGNED_IN" ? (
                        <div className="px-6 pt-8 md:px-10">
                            <h2
                                id="account-dialog-title"
                                className="text-xl font-bold leading-tight text-gray-900 md:text-2xl"
                            >
                                {t("account.signedIn.title")}
                            </h2>
                            <p className="mt-4 break-all text-sm leading-relaxed text-gray-600 md:text-base">
                                {t("account.signedIn.description", {
                                    email: customerEmail ?? "",
                                })}
                            </p>
                        </div>
                    ) : (
                        <form
                            id="account-auth-form"
                            onSubmit={step === "EMAIL" ? requestOtp : verifyOtp}
                            className="px-6 pt-8 md:px-10"
                        >
                            <h2
                                id="account-dialog-title"
                                className="text-xl font-bold leading-tight text-gray-900 md:text-2xl"
                            >
                                {t(step === "EMAIL" ? "account.email.title" : "account.otp.title")}
                            </h2>
                            <p className="mt-4 text-sm leading-relaxed text-gray-600 md:text-base">
                                {step === "EMAIL"
                                    ? t("account.email.description")
                                    : t("account.otp.description", { email })}
                            </p>

                            <div className="mt-8">
                                <label htmlFor="account-auth-input" className="sr-only">
                                    {t(step === "EMAIL" ? "account.email.label" : "account.otp.label")}
                                </label>
                                <input
                                    ref={inputRef}
                                    key={step}
                                    id="account-auth-input"
                                    type={step === "EMAIL" ? "email" : "text"}
                                    inputMode={step === "EMAIL" ? "email" : "numeric"}
                                    autoComplete={step === "EMAIL" ? "email" : "one-time-code"}
                                    required
                                    autoFocus
                                    placeholder={t(
                                        step === "EMAIL"
                                            ? "account.email.placeholder"
                                            : "account.otp.placeholder",
                                    )}
                                    value={step === "EMAIL" ? email : otp}
                                    onChange={(event) =>
                                        step === "EMAIL"
                                            ? setEmail(event.target.value)
                                            : setOtp(event.target.value)
                                    }
                                    aria-invalid={Boolean(errorCode)}
                                    aria-describedby={errorCode ? "account-auth-error" : undefined}
                                    className={cn(
                                        "h-14 w-full border bg-white px-4 text-base outline-none transition-colors focus:ring-1",
                                        step === "OTP" && "font-mono text-lg tracking-[0.3em]",
                                        errorCode
                                            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                            : "border-gray-300 focus:border-(--brand-green) focus:ring-(--brand-green)",
                                    )}
                                />
                                {errorCode && (
                                    <p id="account-auth-error" className="mt-2 text-sm text-red-600">
                                        {t(errorKey(step, errorCode))}
                                    </p>
                                )}
                                {step === "OTP" && (
                                    <button
                                        type="button"
                                        onClick={() => requestOtp()}
                                        disabled={pending}
                                        className="mt-4 text-sm text-(--brand-green) underline underline-offset-4 disabled:opacity-50"
                                    >
                                        {t("account.otp.resend")}
                                    </button>
                                )}
                            </div>
                        </form>
                    )}
                </div>

                <footer
                    className="account-dialog-reveal flex items-center gap-2 px-6 pb-6 pt-8 md:px-10 md:pb-10"
                >
                    <button
                        type="button"
                        onClick={handleClose}
                        data-account-initial-focus
                        className="flex h-12 w-12 shrink-0 items-center justify-center border border-gray-100 bg-white text-(--brand-green) shadow-sm transition-[background-color,border-color,box-shadow] duration-200 hover:border-gray-200 hover:bg-gray-100 hover:shadow-md active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-green) focus-visible:ring-offset-2"
                        aria-label={t("account.close")}
                    >
                        <X className="h-6 w-6" />
                    </button>
                    {step === "INTRO" ? (
                        <button
                            type="button"
                            onClick={() => setStep("EMAIL")}
                            className="h-12 flex-1 bg-(--brand-green) px-4 text-sm font-medium text-white transition-[background-color,box-shadow] duration-200 hover:bg-(--brand-green-dark) hover:shadow-md active:translate-y-0 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-green) focus-visible:ring-offset-2 md:text-base"
                        >
                            {t("account.cta")}
                        </button>
                    ) : step === "SIGNED_IN" ? (
                        <button
                            type="button"
                            onClick={logout}
                            disabled={pending}
                            className="h-12 flex-1 border border-gray-300 px-5 text-sm text-gray-700 transition-[background-color,border-color,box-shadow] duration-200 hover:border-gray-400 hover:bg-gray-50 hover:shadow-sm disabled:opacity-50"
                        >
                            {t("account.signedIn.logout")}
                        </button>
                    ) : (
                        <div className="flex flex-1 flex-wrap justify-end gap-2">
                            <button
                                type="button"
                                onClick={reset}
                                className="h-12 border border-gray-300 px-5 text-sm text-gray-700 transition-[background-color,border-color,box-shadow] duration-200 hover:border-gray-400 hover:bg-gray-50 hover:shadow-sm active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-green) focus-visible:ring-offset-2"
                            >
                                {t("account.email.cancel")}
                            </button>
                            <button
                                type="submit"
                                form="account-auth-form"
                                disabled={pending}
                                className="h-12 bg-(--brand-green) px-6 text-sm font-medium text-white transition-[background-color,box-shadow] duration-200 hover:bg-(--brand-green-dark) hover:shadow-md active:translate-y-0 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-green) focus-visible:ring-offset-2 disabled:opacity-60"
                            >
                                {t(step === "EMAIL" ? "account.email.next" : "account.otp.verify")}
                            </button>
                        </div>
                    )}
                </footer>
            </section>
        </div>,
        document.body,
    );
}
