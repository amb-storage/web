"use client";

import { useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";

type LegalTab = "about" | "policy" | "contact";

// Thứ tự tab = thứ tự trên thanh; gạch chân trượt theo vị trí này
const TABS: Array<{ tab: LegalTab; href: string }> = [
    { tab: "about", href: "/about" },
    { tab: "policy", href: "/policy" },
    { tab: "contact", href: "/contact" },
];
const UNDERLINE_OFFSET = ["translate-x-0", "translate-x-full", "translate-x-[200%]"];

type AboutUsTabsProps = {
    labels: {
        aboutUs: string;
        privacyPolicy: string;
        contact: string;
    };
};

const tabClass =
    "flex min-h-14 flex-1 items-center justify-center px-2 text-center text-sm transition-colors duration-500 md:text-lg";

export default function AboutUsTabs({ labels }: AboutUsTabsProps) {
    const pathname = usePathname();
    const routeTab: LegalTab =
        TABS.find((item) => item.tab !== "about" && pathname.endsWith(item.href))?.tab ?? "about";
    // Tab vừa bấm được đổi ngay (không đợi route xong) để gạch chân trượt liền tay;
    // khi pathname đổi (kể cả bấm Back) thì quay về lấy theo route
    const [clicked, setClicked] = useState<{ tab: LegalTab; from: string } | null>(null);
    const activeTab = clicked?.from === pathname ? clicked.tab : routeTab;

    const select = (tab: LegalTab) => setClicked({ tab, from: pathname });

    return (
        <nav
            aria-label="About Us legal pages"
            className="relative z-10 mx-auto -mt-12 flex max-w-5xl bg-white px-4 pt-5 shadow md:px-10"
        >
            {/* Gạch chân rộng đúng 1/3 vùng tab, trượt bằng translateX theo vị trí tab đang chọn */}
            <span
                aria-hidden="true"
                className={`absolute bottom-0 left-4 h-0.5 w-[calc((100%-2rem)/3)] bg-black transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] motion-reduce:transition-none md:left-10 md:w-[calc((100%-5rem)/3)] ${UNDERLINE_OFFSET[TABS.findIndex((item) => item.tab === activeTab)]}`}
            />
            {TABS.map(({ tab, href }) => (
                <Link
                    key={tab}
                    href={href}
                    scroll={false}
                    onClick={() => select(tab)}
                    aria-current={activeTab === tab ? "page" : undefined}
                    className={`${tabClass} ${activeTab === tab ? "text-black" : "text-gray-400 hover:text-gray-700"}`}
                >
                    <span className={activeTab === tab ? "font-bold" : undefined}>
                        {tab === "about" ? labels.aboutUs : tab === "policy" ? labels.privacyPolicy : labels.contact}
                    </span>
                </Link>
            ))}
        </nav>
    );
}
