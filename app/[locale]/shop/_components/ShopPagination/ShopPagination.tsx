import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { toShopSearch, type ProductListQuery } from "@/lib/storefront";
import { cn } from "@/lib/utils";

interface ShopPaginationProps {
    query: ProductListQuery;
    page: number;
    totalPages: number;
}

// Hiện trang đầu, cuối và 2 trang quanh trang hiện tại; chỗ bị lược thì là "…"
function visiblePages(page: number, totalPages: number) {
    const pages = new Set([1, totalPages, page - 1, page, page + 1]);
    return [...pages].filter((item) => item >= 1 && item <= totalPages).sort((a, b) => a - b);
}

export default function ShopPagination({ query, page, totalPages }: ShopPaginationProps) {
    const t = useTranslations("shop.pagination");
    if (totalPages <= 1) return null;

    const hrefFor = (target: number) => `/shop${toShopSearch({ ...query, page: target })}`;
    const pages = visiblePages(page, totalPages);
    const arrowClass =
        "grid h-10 w-10 place-content-center rounded-full border border-[#222] transition-colors duration-500 hover:bg-black hover:text-white";

    return (
        <nav aria-label={t("label")} className="mt-12 flex items-center justify-center gap-2">
            {page > 1 && (
                <Link href={hrefFor(page - 1)} aria-label={t("previous")} className={arrowClass}>
                    <ChevronLeft className="h-4 w-4" />
                </Link>
            )}
            {pages.map((item, index) => (
                <span key={item} className="flex items-center gap-2">
                    {index > 0 && item - pages[index - 1] > 1 && (
                        <span aria-hidden className="px-1 text-sm text-black/40">
                            …
                        </span>
                    )}
                    <Link
                        href={hrefFor(item)}
                        aria-label={t("page", { page: item })}
                        aria-current={item === page ? "page" : undefined}
                        className={cn(
                            "grid h-10 min-w-10 place-content-center rounded-full px-3 text-sm font-medium transition-colors",
                            item === page ? "bg-black text-white" : "hover:bg-black/6",
                        )}
                    >
                        {item}
                    </Link>
                </span>
            ))}
            {page < totalPages && (
                <Link href={hrefFor(page + 1)} aria-label={t("next")} className={arrowClass}>
                    <ChevronRight className="h-4 w-4" />
                </Link>
            )}
        </nav>
    );
}
