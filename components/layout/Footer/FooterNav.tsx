"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { NavigationItem } from "@/lib/storefront";
import { useFooterNavAnimation } from "./useFooterNavAnimation";

interface FooterNavProps {
    items: NavigationItem[];
}

// Trang chính sách / liên hệ là route riêng của web, luôn giữ link dù menu CMS không có
const POLICY_HREF = "/policy";
const CONTACT_HREF = "/contact";

export default function FooterNav({ items }: FooterNavProps) {
    const t = useTranslations("homepage.footer");
    const { handleMouseEnter, handleMouseLeave } = useFooterNavAnimation();
    const fixedLinks = [
        { label: t("nav.privacyPolicy"), href: POLICY_HREF, external: false, children: [] },
        { label: t("nav.contact"), href: CONTACT_HREF, external: false, children: [] },
    ];
    const links = [...items, ...fixedLinks.filter((fixed) => !items.some((item) => item.href === fixed.href))];
    const className =
        "relative min-w-0 whitespace-nowrap py-1 text-sm font-semibold text-white/90 transition-colors hover:text-white";

    return (
        <nav className="grid w-full min-w-0 grid-cols-3 items-start gap-x-4 gap-y-1 md:flex md:flex-wrap md:gap-8">
            {links.map((link) =>
                link.external ? (
                    <a
                        key={link.href}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        className={className}
                    >
                        {link.label}
                    </a>
                ) : (
                    <Link
                        key={link.href}
                        href={link.href}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        className={className}
                    >
                        {link.label}
                        {/* <span className="footer-nav-indicator absolute -bottom-0.5 left-0 h-[1.5px] w-full origin-left scale-x-0 bg-white" /> */}
                    </Link>
                ),
            )}
        </nav>
    );
}
