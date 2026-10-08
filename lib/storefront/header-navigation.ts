export interface HeaderNavigationItem {
    id: string;
    label: string;
    href?: string;
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
        children: [
            {
                id: "ma-1",
                label: "MA-1 Bomber Flight Jacket",
                href: "/blog/ma-1-bomber-flight-jacket-revisiting-the-story",
                children: [],
            },
            {
                id: "l-2",
                label: "L-2 Series Jacket",
                href: "/blog/l-2-series-facts-you-probably-didnt-know",
                children: [],
            },
            {
                id: "cwu",
                label: "CWU Flight Jacket",
                href: "/blog/cwu-the-new-generation-of-flight-jackets",
                children: [],
            },
            {
                id: "levis-507xx",
                label: "Original LEVI'S 507XX",
                href: "/blog/original-levis-507xx",
                children: [],
            },
            {
                id: "usmc-hbt",
                label: "USMC HBT’s Series P1",
                href: "/blog/usmc-hbts-series-the-original-and-the-imitation",
                children: [],
            },
            {
                id: "usn-n-1",
                label: "USN N-1 Deck Jacket",
                href: "/blog/usn-n-1-deck-jacket-the-details-of-a-hidden-masterpiece",
                children: [],
            },
        ],
    },
] as const satisfies readonly HeaderNavigationItem[];
