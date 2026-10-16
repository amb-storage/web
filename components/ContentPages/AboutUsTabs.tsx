"use client";

import { useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";

type LegalTab = "about" | "policy";

type AboutUsTabsProps = {
    labels: {
        aboutUs: string;
        privacyPolicy: string;
    };
};

const tabClass =
    "flex min-h-14 flex-1 items-center justify-center px-2 text-center text-sm transition-colors duration-500 md:text-lg";

export default function AboutUsTabs({ labels }: AboutUsTabsProps) {
    const pathname = usePathname();
    const routeTab: LegalTab = pathname.endsWith("/policy") ? "policy" : "about";
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
            {/* Gạch chân rộng đúng nửa vùng tab, trượt bằng translateX(100%) sang tab bên phải */}
            <span
                aria-hidden="true"
                className={`absolute bottom-0 left-4 h-0.5 w-[calc(50%-1rem)] bg-black transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] motion-reduce:transition-none md:left-10 md:w-[calc(50%-2.5rem)] ${activeTab === "policy" ? "translate-x-full" : "translate-x-0"}`}
            />
            <Link
                href="/about"
                scroll={false}
                onClick={() => select("about")}
                aria-current={activeTab === "about" ? "page" : undefined}
                className={`${tabClass} ${activeTab === "about" ? "text-black" : "text-gray-400 hover:text-gray-700"}`}
            >
                <span className={activeTab === "about" ? "font-bold" : undefined}>
                    {labels.aboutUs}
                </span>
            </Link>
            <Link
                href="/policy"
                scroll={false}
                onClick={() => select("policy")}
                aria-current={activeTab === "policy" ? "page" : undefined}
                className={`${tabClass} ${activeTab === "policy" ? "text-black" : "text-gray-400 hover:text-gray-700"}`}
            >
                <span className={activeTab === "policy" ? "font-bold" : undefined}>
                    {labels.privacyPolicy}
                </span>
            </Link>
        </nav>
    );
}
