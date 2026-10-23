"use client";

import { useCallback, useState, type FormEvent } from "react";
import { useLocale } from "next-intl";
import { ApiClientError, apiRequest } from "@/lib/api/client";
import type {
    ApiCustomerAuth,
    ApiCustomerOtpAccepted,
    ApiLocale,
} from "@/lib/api/types";
import { mergeGuestCart } from "@/components/Cart/cartApi";
import { useCart } from "@/components/Cart/useCart";

export type AccountDialogStep = "INTRO" | "EMAIL" | "OTP" | "SIGNED_IN";

const OTP_PATTERN = /^\d{8}$/;

// Luồng đăng nhập Customer bằng Email OTP: `/api/v1/customer/auth/*`
export function useCustomerAuth() {
    const locale = useLocale() as ApiLocale;
    const { refresh: refreshCart, setCart } = useCart();
    const [step, setStep] = useState<AccountDialogStep>("INTRO");
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [challengeId, setChallengeId] = useState<string | null>(null);
    const [customerEmail, setCustomerEmail] = useState<string | null>(null);
    const [errorCode, setErrorCode] = useState<string | null>(null);
    const [pending, setPending] = useState(false);

    // Token CSRF cho request-otp / verify-otp (cookie amb_customer_csrf)
    const fetchCsrf = useCallback(
        () => apiRequest<{ status: "ok" }>("/customer/auth/csrf", { locale }),
        [locale],
    );

    const run = useCallback(async (action: () => Promise<void>) => {
        setPending(true);
        setErrorCode(null);
        try {
            await action();
        } catch (error) {
            setErrorCode(error instanceof ApiClientError ? error.code : "UNKNOWN");
        } finally {
            setPending(false);
        }
    }, []);

    // Mở dialog: đã có session thì vào thẳng màn đã đăng nhập
    const loadSession = useCallback(async () => {
        try {
            const auth = await apiRequest<ApiCustomerAuth>("/customer/auth/session", { locale });
            setCustomerEmail(auth.customer.email);
            setStep("SIGNED_IN");
        } catch {
            setCustomerEmail(null);
        }
    }, [locale]);

    const reset = useCallback(() => {
        setStep((current) => (current === "SIGNED_IN" ? current : "INTRO"));
        setEmail("");
        setOtp("");
        setChallengeId(null);
        setErrorCode(null);
    }, []);

    const requestOtp = (event?: FormEvent<HTMLFormElement>) => {
        event?.preventDefault();
        void run(async () => {
            await fetchCsrf();
            const accepted = await apiRequest<ApiCustomerOtpAccepted>(
                "/customer/auth/request-otp",
                { locale, method: "POST", body: { email: email.trim() } },
                fetchCsrf,
            );
            setChallengeId(accepted.challengeId);
            setOtp("");
            setStep("OTP");
        });
    };

    const verifyOtp = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!challengeId) return;
        if (!OTP_PATTERN.test(otp)) {
            setErrorCode("OTP_FORMAT");
            return;
        }
        void run(async () => {
            const auth = await apiRequest<ApiCustomerAuth>(
                "/customer/auth/verify-otp",
                { locale, method: "POST", body: { challengeId, email: email.trim(), otp } },
                fetchCsrf,
            );
            setCustomerEmail(auth.customer.email);
            setStep("SIGNED_IN");
            // Gộp giỏ hàng khách vãng lai vào giỏ của Customer nếu backend cho phép
            const eligibility = await apiRequest<{ enabled: boolean; eligible: boolean }>(
                "/cart/merge-eligibility",
                { locale },
            ).catch(() => null);
            if (eligibility?.enabled && eligibility.eligible) {
                setCart(await mergeGuestCart(locale));
            } else {
                await refreshCart();
            }
        });
    };

    const logout = () => {
        void run(async () => {
            await apiRequest<{ status: "ok" }>(
                "/customer/auth/logout",
                { locale, method: "POST" },
                fetchCsrf,
            );
            setCustomerEmail(null);
            setStep("INTRO");
            await refreshCart();
        });
    };

    return {
        step,
        setStep,
        email,
        setEmail,
        otp,
        setOtp: (value: string) => setOtp(value.replace(/\D/g, "").slice(0, 8)),
        customerEmail,
        errorCode,
        pending,
        loadSession,
        reset,
        requestOtp,
        verifyOtp,
        logout,
    };
}
