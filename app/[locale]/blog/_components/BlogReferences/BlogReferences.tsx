"use client";

import { useBlogReferencesAnimation } from "./useBlogReferencesAnimation";

interface BlogReferenceGroup {
    title: string;
    items: string[];
}

interface BlogReferencesProps {
    groups: BlogReferenceGroup[];
}

export default function BlogReferences({ groups }: BlogReferencesProps) {
    const { sectionRef } = useBlogReferencesAnimation();

    return (
        <div
            ref={sectionRef}
            className="mt-8 grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-16"
        >
            {groups.map((group) => (
                <div key={group.title} className="blog-ref-group">
                    <h2 className="blog-ref-title inline-block translate-y-4 text-xl font-bold text-(--brand-green) opacity-0">
                        {group.title}
                        <span className="blog-ref-underline mt-1 block h-0.5 w-full origin-left scale-x-0 bg-(--brand-green)" />
                    </h2>
                    <ul className="mt-2 list-none space-y-0.5 pl-5 text-sm font-semibold leading-6 tracking-[0.05em] text-black">
                        {group.items.map((item) => (
                            <li
                                key={item}
                                className="blog-ref-item -translate-x-3 opacity-0 before:mr-2 before:content-['\2022']"
                            >
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
}
