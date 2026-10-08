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
import FooterNav from "./FooterNav";
import { storeSettings } from "@/data/mock";

const paymentIcons = [
    { Icon: FaApplePay, color: "text-black md:text-white" },
    { Icon: FaGooglePay, color: "text-black md:text-white" },
    { Icon: FaCcVisa, color: "text-[#1434cb] md:text-white" },
    { Icon: FaCcMastercard, color: "text-[#eb001b] md:text-white" },
    { Icon: FaCcAmex, color: "text-[#2e77bc] md:text-white" },
    { Icon: FaCcDiscover, color: "text-[#f26f21] md:text-white" },
    { Icon: FaCcJcb, color: "text-[#e0002a] md:text-white" },
];

const socialLinks = [
    {
        key: "email",
        href: `mailto:${storeSettings.contactEmail}`,
        icon: FaEnvelope,
        mobileClass: "bg-black",
    },
    {
        key: "instagram",
        href: storeSettings.socialLinks[0].href,
        icon: FaInstagram,
        mobileClass: "bg-[#e4405f]",
    },
    {
        key: "tiktok",
        href: storeSettings.socialLinks[1].href,
        icon: FaTiktok,
        mobileClass: "bg-black",
    },
] as const;

export default function Footer() {
    const t = useTranslations("homepage.footer");
    const year = new Date().getFullYear();

    return (
        <footer className="w-full bg-(--brand-green) text-white">
            <div className="mx-auto px-5 py-8 md:px-20 md:py-12">
                <div className="grid gap-8 md:grid-cols-[1fr_1fr] md:gap-20">
                    <div className="flex flex-col items-start gap-5">
                        <Link
                            href="/"
                            aria-label="Amb:STORAGE"
                            className="inline-block bg-white p-1 md:bg-transparent md:p-0"
                        >
                            <Image
                                src={logo}
                                alt="Amb:STORAGE"
                                width={362}
                                height={72}
                                className="h-auto w-[158px] md:w-[362px] md:brightness-0 md:invert"
                            />
                        </Link>

                        <FooterNav />
                    </div>

                    <div className="flex flex-1 flex-col gap-4">
                        <p className="text-xl leading-relaxed tracking-[0.13em]">
                            {t("tagline")}
                        </p>
                        <NewsletterForm />
                    </div>
                </div>

                <div className="my-10 h-px w-full bg-white/30" />

                <div className="grid gap-8 md:grid-cols-2 md:items-center">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-white/90 md:justify-center md:gap-4">
                        {paymentIcons.map(({ Icon, color }, i) => (
                            <span
                                key={i}
                                className="flex h-[22px] w-9 items-center justify-center rounded-sm bg-white md:h-6 md:w-9 md:rounded-none md:bg-transparent"
                            >
                                <Icon
                                    className={`h-4 w-7 ${color} md:h-6 md:w-9`}
                                    aria-hidden="true"
                                />
                            </span>
                        ))}
                    </div>

                    <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-center md:gap-4">
                        <div className="flex items-center justify-start gap-3 md:justify-center">
                            {socialLinks.map(({ key, href, icon: Icon, mobileClass }) => (
                                <a
                                    key={key}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={t(`social.${key}`)}
                                    className={`flex h-6 w-6 items-center justify-center rounded-full text-white transition-colors hover:text-white/60 md:h-8 md:w-8 md:rounded-none md:bg-transparent ${mobileClass}`}
                                >
                                    <Icon className="h-5 w-5" />
                                </a>
                            ))}
                        </div>
                        <span className="text-sm tracking-[0.16em] text-white/80">
                            {t("copyright", { year })}
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
