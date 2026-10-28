"use client";

import { useTranslations } from "next-intl";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProductSort } from "@/lib/storefront";
import { useSortDropdown } from "./useSortDropdown";

interface SortDropdownProps {
  value: ProductSort;
  onChange: (value: ProductSort) => void;
}

const sortOptions = [
  { value: "newest", key: "newest" },
  { value: "price-low", key: "priceLow" },
  { value: "price-high", key: "priceHigh" },
  { value: "popular", key: "popular" },
] as const;

export default function SortDropdown({ value, onChange }: SortDropdownProps) {
  const t = useTranslations("shop.sort");
  const { containerRef, isOpen, toggle, close } = useSortDropdown();
  const current = sortOptions.find((option) => option.value === value) ?? sortOptions[0];

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={toggle}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={t("label")}
        className="flex h-10 min-w-24.5 items-center justify-between gap-3 rounded-full border border-[#222] pl-4 pr-3 text-[11.2px] font-light leading-5.5 text-black/80 transition-colors duration-500 hover:bg-black hover:text-white"
      >
        {t(current.key)}
        <ChevronDown
          className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")}
          strokeWidth={1}
        />
      </button>

      {isOpen && (
        <ul
          role="listbox"
          aria-label={t("label")}
          className="absolute right-0 top-full z-100 mt-2 w-50 rounded-lg bg-white py-2 shadow-[0_4px_8px_#0000001f]"
        >
          {sortOptions.map((option) => {
            const isCurrent = option.value === value;
            return (
              <li key={option.value} role="option" aria-selected={isCurrent}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    close();
                  }}
                  className={cn(
                    "flex h-10 w-full items-center justify-between px-4 text-sm font-light leading-6",
                    isCurrent ? "text-black" : "text-black/55 hover:text-black",
                  )}
                >
                  {t(option.key)}
                  {isCurrent && <Check className="h-4 w-4" strokeWidth={1.25} />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
