import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import logo from "@/assets/logo.png";
import {
  FaApplePay,
  FaGooglePay,
  FaCcVisa,
  FaCcMastercard,
  FaCcAmex,
  FaCcDiscover,
  FaCcJcb,
  FaEnvelope,
  FaInstagram,
  FaTiktok,
} from "react-icons/fa";
import NewsletterForm from "./NewsletterForm";

const navLinks = [
  { key: "home", href: "/" },
  { key: "shopAll", href: "/shop-now" },
  { key: "miliTalks", href: "/blog" },
  { key: "aboutUs", href: "/about-us" },
  { key: "privacyPolicy", href: "/privacy-policy" },
] as const;

const paymentIcons = [
  FaGooglePay,
  FaApplePay,
  FaCcVisa,
  FaCcMastercard,
  FaCcAmex,
  FaCcDiscover,
  FaCcJcb,
];

const socialLinks = [
  { key: "email", href: "mailto:theambitionent@gmail.com", icon: FaEnvelope },
  { key: "instagram", href: "https://instagram.com", icon: FaInstagram },
  { key: "tiktok", href: "https://tiktok.com", icon: FaTiktok },
] as const;

export default function Footer() {
  const t = useTranslations("homepage.footer");
  const year = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#1B3B2B] text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="flex flex-col gap-6">
            <div className="w-fit rounded-lg bg-white px-4 py-3">
              <Image
                src={logo}
                alt="Amb:STORAGE"
                width={180}
                height={36}
                className="h-9 w-auto"
              />
            </div>

            <nav className="flex flex-wrap gap-x-6 gap-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.key}
                  href={link.href}
                  className="text-sm font-medium text-white/90 transition-colors hover:text-white"
                >
                  {t(`nav.${link.key}`)}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex flex-col gap-4 md:items-end md:text-right">
            <p className="text-lg font-medium">{t("tagline")}</p>
            <NewsletterForm />
          </div>
        </div>

        <div className="my-8 h-px w-full bg-white/15" />

        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            {paymentIcons.map((Icon, i) => (
              <span
                key={i}
                className="flex h-8 w-11 items-center justify-center rounded bg-white"
              >
                <Icon className="h-5 w-5 text-gray-700" />
              </span>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {socialLinks.map(({ key, href, icon: Icon }) => (
                <a
                  key={key}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t(`social.${key}`)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white hover:text-[#1B3B2B]"
                >
                  <Icon className="h-3.5 w-3.5" />
                </a>
              ))}
            </div>
            <span className="text-sm text-white/70">
              {t("copyright", { year })}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
