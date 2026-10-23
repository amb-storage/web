import type { NavigationItem } from "./types";

export interface HeaderNavigationItem {
    id: string;
    label: string;
    href?: string;
    // Cách xếp các mục con trong dropdown desktop (mặc định: ngang)
    dropdownLayout?: "horizontal" | "vertical";
    children: readonly HeaderNavigationItem[];
}

// Dropdown nhiều mục (vd. Shop Now) xếp dọc, ít mục (vd. Home → About Us) xếp ngang
const VERTICAL_DROPDOWN_MIN_ITEMS = 3;

// Chuyển menu từ `GET /navigation/header` sang cấu trúc header đang dùng; backend không có id nên ghép từ vị trí + href
export function toHeaderNavigation(
    items: readonly NavigationItem[],
    parentId = "nav",
): HeaderNavigationItem[] {
    return items.map((item, index) => {
        const id = `${parentId}-${index}-${item.href}`;
        return {
            id,
            label: item.label,
            href: item.href,
            dropdownLayout:
                item.children.length >= VERTICAL_DROPDOWN_MIN_ITEMS ? "vertical" : "horizontal",
            children: toHeaderNavigation(item.children, id),
        };
    });
}

// Dự phòng khi không gọi được API navigation, để header vẫn có menu
export const fallbackHeaderNavigation = [
    {
        id: "home",
        label: "Home",
        href: "/",
        children: [
            {
                id: "about",
                label: "About Us",
                href: "/about",
                children: [],
            },
        ],
    },
    {
        id: "shop-now",
        label: "Shop Now",
        href: "/shop",
        dropdownLayout: "vertical",
        children: [],
    },
    {
        id: "mili-talks",
        label: "Mili Talks",
        href: "/blog",
        children: [],
    },
] as const satisfies readonly HeaderNavigationItem[];
