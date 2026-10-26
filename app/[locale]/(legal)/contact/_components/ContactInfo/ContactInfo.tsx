import { Mail, Phone } from "lucide-react";
import { FaInstagram } from "react-icons/fa";
import { getTranslations } from "next-intl/server";

interface ContactInfoProps {
    email: string | null;
}

// Số điện thoại / Instagram lấy theo trang お問い合わせ hiện tại của amb-storage.com
const PHONES = ["06-7164-6821", "080-5959-2198"];
const INSTAGRAM = { handle: "@amb.storage", href: "https://www.instagram.com/amb.storage/" };

export default async function ContactInfo({ email }: ContactInfoProps) {
    const t = await getTranslations("contentPages.contact.info");
    const rowClass = "flex items-start gap-3 py-4 text-sm text-gray-700 md:text-base";

    return (
        <aside className="h-fit bg-[#eef5f0] px-6 py-8 md:px-8">
            <h2 className="text-lg font-bold text-(--brand-green) md:text-xl">{t("title")}</h2>
            <dl className="mt-4 divide-y divide-gray-200">
                <div className={rowClass}>
                    <Phone className="mt-1 h-4 w-4 shrink-0 text-(--brand-green)" aria-hidden="true" />
                    <div>
                        <dt className="font-semibold text-black">{t("phone")}</dt>
                        <dd className="mt-1 grid gap-1">
                            {PHONES.map((phone) => (
                                <a key={phone} href={`tel:${phone.replaceAll("-", "")}`} className="hover:text-black hover:underline">
                                    {phone}
                                </a>
                            ))}
                        </dd>
                    </div>
                </div>
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
                <div className={rowClass}>
                    <FaInstagram className="mt-1 h-4 w-4 shrink-0 text-(--brand-green)" aria-hidden="true" />
                    <div>
                        <dt className="font-semibold text-black">{t("instagram")}</dt>
                        <dd className="mt-1">
                            <a href={INSTAGRAM.href} target="_blank" rel="noopener noreferrer" className="hover:text-black hover:underline">
                                {INSTAGRAM.handle}
                            </a>
                        </dd>
                    </div>
                </div>
            </dl>
            <p className="mt-4 text-xs leading-6 text-gray-500">{t("note")}</p>
        </aside>
    );
}
