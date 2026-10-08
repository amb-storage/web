"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Link } from "@/i18n/navigation";

type AboutUsTabsProps = {
    initialActiveTab: "about" | "policy";
    labels: {
        aboutUs: string;
        privacyPolicy: string;
    };
};

export default function AboutUsTabs({
    initialActiveTab,
    labels,
}: AboutUsTabsProps) {
    const pathname = usePathname();
    const routeTab = pathname.endsWith("/policy")
        ? "policy"
        : initialActiveTab;
    const [activeTab, setActiveTab] = useState(routeTab);

    return (
        <nav
            aria-label="About Us legal pages"
            className="relative z-10 mx-auto -mt-12 flex max-w-5xl bg-white px-4 pt-5 md:px-10 shadow"
        >
            <span
                key={activeTab}
                aria-hidden="true"
                className={`absolute bottom-0 origin-left animate-[about-us-tab-line_500ms_ease-out] motion-reduce:animate-none h-0.5 w-[calc(50%-1rem)] bg-black md:w-[calc(50%-2.5rem)] ${activeTab === "policy" ? "left-1/2" : "left-4 md:left-10"}`}
            />
            <Link
                href="/about"
                onClick={() => setActiveTab("about")}
                aria-current={activeTab === "about" ? "page" : undefined}
                className={`flex min-h-14 flex-1 items-center justify-center px-2 text-center text-sm transition-colors duration-300 md:text-lg ${activeTab === "about" ? "font-bold text-black" : "text-gray-400 hover:text-gray-700"}`}
            >
                {labels.aboutUs}
            </Link>
            <Link
                href="/policy"
                onClick={() => setActiveTab("policy")}
                aria-current={
                    activeTab === "policy" ? "page" : undefined
                }
                className={`flex min-h-14 flex-1 items-center justify-center px-2 text-center text-sm transition-colors duration-300 md:text-lg ${activeTab === "policy" ? "font-bold text-black" : "text-gray-400 hover:text-gray-700"}`}
            >
                {labels.privacyPolicy}
            </Link>
        </nav>
    );
}
