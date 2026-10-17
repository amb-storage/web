export interface HeaderNavigationItem {
    id: string;
    label: string;
    href?: string;
    // Cách xếp các mục con trong dropdown desktop (mặc định: ngang)
    dropdownLayout?: "horizontal" | "vertical";
    children: readonly HeaderNavigationItem[];
}

export const headerNavigation = [
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
        children: [
            {
                id: "vintage-military",
                label: "Vintage MILITARY",
                href: "/shop/vintage-military",
                children: [],
            },
            {
                id: "vintage-denim",
                label: "Vintage DENIM",
                href: "/shop/vintage-denim",
                children: [],
            },
            {
                id: "other-vtg-items",
                label: "Other VTG Items",
                href: "/shop/other-vtg-items",
                children: [],
            },
            {
                id: "jackets",
                label: "Jackets",
                href: "/shop/jackets",
                children: [],
            },
            {
                id: "shirts",
                label: "Shirts",
                href: "/shop/shirts",
                children: [],
            },
            {
                id: "t-shirts",
                label: "T-Shirts",
                href: "/shop",
                children: [],
            },
            {
                id: "pants",
                label: "Pants",
                href: "/shop/pants",
                children: [],
            },
        ],
    },
    {
        id: "mili-talks",
        label: "Mili Talks",
        href: "/blog",
        children: [],
    },
] as const satisfies readonly HeaderNavigationItem[];
