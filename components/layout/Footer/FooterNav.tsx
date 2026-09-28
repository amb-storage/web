"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useFooterNavAnimation } from "./useFooterNavAnimation";

const navLinks = [
  { key: "home", href: "/" },
  { key: "shopAll", href: "/shop-now" },
  { key: "miliTalks", href: "/blog" },
  { key: "aboutUs", href: "/about-us" },
  { key: "privacyPolicy", href: "/privacy-policy" },
] as const;

export default function FooterNav() {
  const t = useTranslations("homepage.footer");
  const { handleMouseEnter, handleMouseLeave } = useFooterNavAnimation();

  return (
    <nav className="flex flex-wrap gap-x-6 gap-y-2">
      {navLinks.map((link) => (
        <Link
          key={link.key}
          href={link.href}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="relative py-1 text-sm font-medium text-white/90 transition-colors hover:text-white"
        >
          {t(`nav.${link.key}`)}
          <span className="footer-nav-indicator absolute -bottom-0.5 left-0 h-[1.5px] w-full origin-left scale-x-0 bg-white" />
        </Link>
      ))}
    </nav>
  );
}
