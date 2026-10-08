"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useFooterNavAnimation } from "./useFooterNavAnimation";

const navLinks = [
    { key: "home", href: "/" },
    { key: "shopAll", href: "/shop" },
    { key: "miliTalks", href: "/blog" },
    { key: "aboutUs", href: "/about" },
    { key: "privacyPolicy", href: "/policy" },
] as const;

export default function FooterNav() {
    const t = useTranslations("homepage.footer");
    const { handleMouseEnter, handleMouseLeave } = useFooterNavAnimation();

    return (
        <nav className="grid w-full min-w-0 grid-cols-3 items-start gap-x-4 gap-y-1 md:flex md:flex-wrap md:gap-8">
            {navLinks.map((link) => (
                <Link
                    key={link.key}
                    href={link.href}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    className="relative min-w-0 whitespace-nowrap py-1 text-sm font-semibold text-white/90 transition-colors hover:text-white"
                >
                    {t(`nav.${link.key}`)}
                    {/* <span className="footer-nav-indicator absolute -bottom-0.5 left-0 h-[1.5px] w-full origin-left scale-x-0 bg-white" /> */}
                </Link>
            ))}
        </nav>
    );
}
