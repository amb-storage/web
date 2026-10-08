"use client";

import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { useAccordionAnimation } from "./useAccordionAnimation";

interface AccordionProps {
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
}

export default function Accordion({
  title,
  defaultOpen = false,
  children,
}: AccordionProps) {
  const { isOpen, contentRef, chevronRef, toggle } =
    useAccordionAnimation(defaultOpen);

  return (
    <div className="border-b border-gray-200">
      <button
        type="button"
        onClick={toggle}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between py-4 text-left text-sm font-semibold text-(--brand-green)"
      >
        {title}
        <ChevronDown
          ref={chevronRef}
        className="h-4 w-4 shrink-0 text-(--brand-green)"
        />
      </button>

      <div
        ref={contentRef}
        style={{ height: defaultOpen ? "auto" : 0 }}
        className="overflow-hidden"
      >
        <div className="pb-5 text-sm leading-relaxed text-gray-600">
          {children}
        </div>
      </div>
    </div>
  );
}
