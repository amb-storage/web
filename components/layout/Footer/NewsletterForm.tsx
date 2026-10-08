"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { useTranslations } from "next-intl";

export default function NewsletterForm() {
    const t = useTranslations("homepage.footer.newsletter");
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!email) return;
        setSubmitted(true);
    };

    return (
        <div className="w-full">
            <form
                onSubmit={handleSubmit}
                className="flex w-full overflow-hidden border border-white/30 transition-colors focus-within:border-white/70"
            >
                <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t("placeholder")}
                    className="min-w-0 flex-1 bg-transparent px-4 py-3 text-base font-semibold text-white placeholder:text-white/50 focus:outline-none"
                />
                <button
                    type="submit"
                    disabled={submitted}
                    className="shrink-0 bg-white px-5 py-3 text-sm font-semibold text-(--brand-green) transition-colors hover:bg-white/90 disabled:cursor-default disabled:bg-white/70"
                >
                    {submitted ? t("submitted") : t("cta")}
                </button>
            </form>

            <p className="mt-3 text-xs leading-relaxed text-white/50">
                {t.rich("disclaimer", {
                    privacy: (chunks) => (
                        <a
                            href="https://policies.google.com/privacy"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline hover:text-white"
                        >
                            {chunks}
                        </a>
                    ),
                    terms: (chunks) => (
                        <a
                            href="https://policies.google.com/terms"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline hover:text-white"
                        >
                            {chunks}
                        </a>
                    ),
                })}
            </p>
        </div>
    );
}
