import { Mail, Phone } from "lucide-react";
import { FaInstagram, FaLink, FaTiktok } from "react-icons/fa";
import { getTranslations } from "next-intl/server";

interface ContactInfoProps {
    email: string | null;
    phone: string | null;
    socialLinks: Array<{ label: string; href: string }>;
}

function socialIcon(link: { label: string; href: string }) {
    const value = `${link.label} ${link.href}`.toLowerCase();
    if (value.includes("instagram")) return FaInstagram;
    if (value.includes("tiktok")) return FaTiktok;
    return FaLink;
}

// Hiện tên tài khoản từ URL (…/amb.storage → @amb.storage); URL không có path thì hiện nguyên link
function socialHandle(href: string) {
    const segment = href.replace(/[?#].*$/, "").replace(/\/+$/, "").split("/").pop() ?? "";
    if (/^https?:$|\./.test(segment) && !href.replace(/^https?:\/\//, "").includes("/")) return href;
    return segment.startsWith("@") ? segment : `@${segment}`;
}

export default async function ContactInfo({ email, phone, socialLinks }: ContactInfoProps) {
    const t = await getTranslations("contentPages.contact.info");
    const rowClass = "flex items-start gap-3 py-4 text-sm text-gray-700 md:text-base";

    return (
        <aside className="h-fit bg-[#eef5f0] px-6 py-8 md:px-8">
            <h2 className="text-lg font-bold text-(--brand-green) md:text-xl">{t("title")}</h2>
            <dl className="mt-4 divide-y divide-gray-200">
                {phone ? (
                    <div className={rowClass}>
                        <Phone className="mt-1 h-4 w-4 shrink-0 text-(--brand-green)" aria-hidden="true" />
                        <div>
                            <dt className="font-semibold text-black">{t("phone")}</dt>
                            <dd className="mt-1">
                                <a href={`tel:${phone.replace(/[^+0-9]/g, "")}`} className="hover:text-black hover:underline">
                                    {phone}
                                </a>
                            </dd>
                        </div>
                    </div>
                ) : null}
                {email ? (
                    <div className={rowClass}>
                        <Mail className="mt-1 h-4 w-4 shrink-0 text-(--brand-green)" aria-hidden="true" />
                        <div className="min-w-0">
                            <dt className="font-semibold text-black">{t("email")}</dt>
                            <dd className="mt-1 break-all">
                                <a href={`mailto:${email}`} className="hover:text-black hover:underline">
                                    {email}
                                </a>
                            </dd>
                        </div>
                    </div>
                ) : null}
                {socialLinks.map((link) => {
                    const Icon = socialIcon(link);
                    return (
                        <div key={link.href} className={rowClass}>
                            <Icon className="mt-1 h-4 w-4 shrink-0 text-(--brand-green)" aria-hidden="true" />
                            <div className="min-w-0">
                                <dt className="font-semibold text-black">{link.label}</dt>
                                <dd className="mt-1 break-all">
                                    <a
                                        href={link.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hover:text-black hover:underline"
                                    >
                                        {socialHandle(link.href)}
                                    </a>
                                </dd>
                            </div>
                        </div>
                    );
                })}
            </dl>
            <p className="mt-4 text-xs leading-6 text-gray-500">{t("note")}</p>
        </aside>
    );
}
