"use client";

import {
    useCallback,
    useEffect,
    useRef,
    useState,
    useSyncExternalStore,
    type FormEvent,
    type RefObject,
} from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";
import Image from "next/image";
import {
    CheckCircle2,
    ChevronDown,
    History,
    Square,
    UserRound,
    X,
} from "lucide-react";
import logo from "@/assets/logo.png";

type AccountDialogStep = "INTRO" | "PHONE";

interface PhoneLoginForm {
    countryCode: string;
    phoneNumber: string;
}

interface AccountDialogProps {
    open: boolean;
    onClose: () => void;
    triggerRef: RefObject<HTMLButtonElement | null>;
}

const initialPhoneLoginForm: PhoneLoginForm = {
    countryCode: "+81",
    phoneNumber: "",
};

const focusableSelector =
    'button:not([disabled]), input:not([disabled]), select:not([disabled]), [href], [tabindex]:not([tabindex="-1"])';
const subscribeToClient = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export function AccountDialog({
    open,
    onClose,
    triggerRef,
}: AccountDialogProps) {
    const t = useTranslations("homepage.header");
    const dialogRef = useRef<HTMLElement>(null);
    const wasOpenRef = useRef(false);
    const isClient = useSyncExternalStore(
        subscribeToClient,
        getClientSnapshot,
        getServerSnapshot,
    );
    const [step, setStep] = useState<AccountDialogStep>("INTRO");
    const [phoneLoginForm, setPhoneLoginForm] = useState<PhoneLoginForm>(
        initialPhoneLoginForm,
    );
    const [phoneError, setPhoneError] = useState("");
    const resetDialog = useCallback(() => {
        setStep("INTRO");
        setPhoneLoginForm(initialPhoneLoginForm);
        setPhoneError("");
    }, []);
    const handleClose = useCallback(() => {
        resetDialog();
        onClose();
    }, [onClose, resetDialog]);

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
                dialogRef.current?.querySelectorAll<HTMLElement>(
                    focusableSelector,
                ) ?? [],
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

    const handleNext = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const digits = phoneLoginForm.phoneNumber.replace(/\D/g, "");

        if (digits.length < 6 || digits.length > 15) {
            setPhoneError(t("account.phone.invalid"));
            return;
        }

        setPhoneError("");
    };

    const handleCancel = resetDialog;

    if (!isClient || typeof document === "undefined") return null;

    return createPortal(
        <div
            aria-hidden={!open}
            className={`fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-black/50 p-4 transition-[opacity,visibility] duration-300 ease-out ${open ? "visible opacity-100" : "pointer-events-none invisible opacity-0"}`}
            onClick={(event) => {
                if (event.target === event.currentTarget) handleClose();
            }}
            role="presentation"
        >
            <section
                ref={dialogRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="account-dialog-title"
                tabIndex={-1}
                className={`relative flex max-h-141 min-h-0 h-full w-full max-w-[38rem] flex-col overflow-y-auto overscroll-contain bg-white text-black shadow-2xl transition-[opacity,transform] duration-500 ease-out ${open ? "translate-y-0 scale-100 opacity-100" : "translate-y-[100vh] scale-[0.98] opacity-0"}`}
            >
                <header className="flex justify-center px-6 pt-8 md:px-10 md:pt-10">
                    <div className="relative h-12 w-60 md:h-[51px] md:w-[238px]">
                        <Image
                            src={logo}
                            alt={t("logoAlt")}
                            fill
                            className="object-contain"
                        />
                    </div>
                </header>

                <div className="flex-1">
                    {step === "INTRO" ? (
                        <div className="p-6 space-y-6">
                            <div className="flex flex-col items-start gap-4">
                                <UserRound className="h-12 w-12 rounded-lg bg-gray-100 p-2 text-black" />
                                <h2
                                    id="account-dialog-title"
                                    className="text-xl font-bold leading-tight text-gray-900 md:text-2xl"
                                >
                                    {t("account.title")}
                                </h2>
                            </div>

                            <div className="divide-y divide-gray-400">
                                <div className="flex items-start gap-4 py-4 text-sm text-gray-800 md:text-base">
                                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
                                    <span>{t("account.benefits.status")}</span>
                                </div>
                                <div className="flex items-start gap-4 py-4 text-sm text-gray-800 md:text-base">
                                    <History className="mt-0.5 h-5 w-5 shrink-0" />
                                    <span>{t("account.benefits.history")}</span>
                                </div>
                                <div className="flex items-start gap-4 py-4 text-sm text-gray-800 md:text-base">
                                    <Square className="mt-0.5 h-5 w-5 shrink-0" />
                                    <span>{t("account.benefits.payment")}</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <form
                            id="account-phone-form"
                            onSubmit={handleNext}
                            className="px-6 pb-2 pt-8 md:px-10 md:pt-10"
                        >
                            <h2
                                id="account-dialog-title"
                                className="text-xl font-bold leading-tight text-gray-900 md:text-2xl"
                            >
                                {t("account.phone.title")}
                            </h2>
                            <p className="mt-4 text-sm leading-relaxed text-gray-600 md:text-base">
                                {t("account.phone.description")}
                            </p>

                            <div className="mt-8">
                                <div className="flex flex-col gap-3 sm:flex-row">
                                    <div className="relative sm:w-48">
                                        <label
                                            htmlFor="account-country-code"
                                            className="sr-only"
                                        >
                                            {t("account.phone.countryCode")}
                                        </label>
                                        <select
                                            id="account-country-code"
                                            value={phoneLoginForm.countryCode}
                                            onChange={(event) =>
                                                setPhoneLoginForm(
                                                    (current) => ({
                                                        ...current,
                                                        countryCode:
                                                            event.target.value,
                                                    }),
                                                )
                                            }
                                            className="h-14 w-full appearance-none border border-gray-300 bg-white px-4 pr-10 text-base outline-none focus:border-(--brand-green) focus:ring-1 focus:ring-(--brand-green)"
                                        >
                                            <option value="+81">
                                                Japan +81
                                            </option>
                                            <option value="+1">
                                                United States +1
                                            </option>
                                            <option value="+44">
                                                United Kingdom +44
                                            </option>
                                        </select>
                                        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
                                    </div>
                                    <div className="flex-1">
                                        <label
                                            htmlFor="account-phone-number"
                                            className="sr-only"
                                        >
                                            {t("account.phone.number")}
                                        </label>
                                        <input
                                            id="account-phone-number"
                                            type="tel"
                                            inputMode="tel"
                                            autoComplete="tel-national"
                                            autoFocus
                                            value={phoneLoginForm.phoneNumber}
                                            onChange={(event) => {
                                                setPhoneLoginForm(
                                                    (current) => ({
                                                        ...current,
                                                        phoneNumber:
                                                            event.target.value,
                                                    }),
                                                );
                                                if (phoneError)
                                                    setPhoneError("");
                                            }}
                                            aria-invalid={Boolean(phoneError)}
                                            aria-describedby={
                                                phoneError
                                                    ? "account-phone-error"
                                                    : undefined
                                            }
                                            className={`h-14 w-full border bg-white px-4 text-base outline-none focus:ring-1 ${phoneError ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-(--brand-green) focus:ring-(--brand-green)"}`}
                                        />
                                    </div>
                                </div>
                                {phoneError && (
                                    <p
                                        id="account-phone-error"
                                        className="mt-2 text-sm text-red-600"
                                    >
                                        {phoneError}
                                    </p>
                                )}
                            </div>
                        </form>
                    )}
                </div>

                <footer
                    className={`flex items-center gap-2 px-6 pb-6 pt-6 transition-[opacity,transform] duration-500 ease-out ${open ? "translate-y-0 opacity-100 delay-500" : "translate-y-3 opacity-0"}`}
                >
                    <button
                        type="button"
                        onClick={handleClose}
                        data-account-initial-focus
                        className="flex h-12 w-12 shrink-0 items-center justify-center border border-gray-100 bg-white text-(--brand-green) shadow-sm transition-[background-color,border-color,box-shadow] duration-200  hover:border-gray-200 hover:bg-gray-100 hover:shadow-md active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-green) focus-visible:ring-offset-2"
                        aria-label={t("account.close")}
                    >
                        <X className="h-6 w-6" />
                    </button>
                    {step === "INTRO" ? (
                        <button
                            type="button"
                            onClick={() => setStep("PHONE")}
                            className="h-12 flex-1 bg-(--brand-green) px-4 text-sm font-medium text-white transition-[background-color,box-shadow] duration-200 hover:bg-(--brand-green-dark) hover:shadow-md active:translate-y-0 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-green) focus-visible:ring-offset-2 md:text-base"
                        >
                            {t("account.cta")}
                        </button>
                    ) : (
                        <div className="flex flex-1 flex-wrap  gap-2 sm:flex-row justify-end">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="h-12 border border-gray-300 px-5 text-sm text-gray-700 transition-[background-color,border-color,box-shadow] duration-200 hover:border-gray-400 hover:bg-gray-50 hover:shadow-sm active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-green) focus-visible:ring-offset-2"
                            >
                                {t("account.phone.cancel")}
                            </button>
                            <button
                                type="submit"
                                form="account-phone-form"
                                className="h-12 bg-(--brand-green) px-6 text-sm font-medium text-white transition-[background-color,box-shadow] duration-200 hover:bg-(--brand-green-dark) hover:shadow-md active:translate-y-0 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--brand-green) focus-visible:ring-offset-2"
                            >
                                {t("account.phone.next")}
                            </button>
                        </div>
                    )}
                </footer>
            </section>
        </div>,
        document.body,
    );
}
