"use client";

import {
    useCallback,
    useEffect,
    useRef,
    useState,
    type FormEvent,
} from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link, useRouter } from "@/i18n/navigation";
import {
    ChevronDown,
    Menu,
    Search,
    ShoppingCart,
    UserRound,
    X,
} from "lucide-react";
import logo from "@/assets/logo.png";
import { AccountDialog } from "@/components/Account/AccountDialog";
import { useCart } from "@/components/Cart/useCart";
import { CartPreview } from "@/components/Cart/CartPreview";
import {
    getHeaderScrollState,
    headerNavigation,
    type HeaderNavigationItem,
} from "@/lib/storefront";
import { useMobileMenu, useMobileSubmenu } from "./useHeaderAnimation";

function localizeNavigation(
    items: readonly HeaderNavigationItem[],
    translate: (key: string) => string,
): HeaderNavigationItem[] {
    return items.map((item) => ({
        ...item,
        label: translate(`navigationLabels.${item.id}`),
        children: localizeNavigation(item.children, translate),
    }));
}

export default function Header() {
    const t = useTranslations("homepage.header");
    const navigation = localizeNavigation(headerNavigation, (key) => t(key));
    const router = useRouter();
    const { count, hydrated } = useCart();
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchMounted, setSearchMounted] = useState(false);
    const [accountOpen, setAccountOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [scrollState, setScrollState] = useState<"expanded" | "compact">(
        "expanded",
    );
    const {
        isOpen: isMobileMenuOpen,
        overlayRef,
        panelRef,
        close: closeMobileMenu,
        toggle: toggleMobileMenu,
    } = useMobileMenu();
    const {
        openKey,
        setContentRef,
        setChevronRef,
        toggleSubmenu,
        resetSubmenus,
    } = useMobileSubmenu();
    const accountButtonRef = useRef<HTMLButtonElement>(null);
    const isCompact = scrollState === "compact";

    useEffect(() => {
        const handleScroll = () => {
            const nextState = getHeaderScrollState(window.scrollY);
            setScrollState((current) =>
                current === nextState ? current : nextState,
            );
        };

        handleScroll();
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        if (!searchMounted || searchOpen) return;

        const timeout = window.setTimeout(() => {
            setSearchMounted(false);
        }, 500);

        return () => window.clearTimeout(timeout);
    }, [searchMounted, searchOpen]);

    const handleCloseMobileMenu = () => {
        resetSubmenus();
        closeMobileMenu();
    };

    const handleToggleMobileMenu = () => {
        toggleMobileMenu();
    };

    const submitSearch = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const search = query.trim();
        router.push(
            search ? `/shop?search=${encodeURIComponent(search)}` : "/shop",
        );
        setSearchOpen(false);
        setQuery("");
        handleCloseMobileMenu();
    };

    const closeAccount = useCallback(
        () => setAccountOpen(false),
        [setAccountOpen],
    );

    const openSearch = () => {
        setOpenDropdown(null);
        handleCloseMobileMenu();
        setAccountOpen(false);
        setSearchMounted(true);
        window.requestAnimationFrame(() => setSearchOpen(true));
    };

    const closeSearch = () => {
        setSearchOpen(false);
        setQuery("");
    };

    const openAccount = () => {
        setOpenDropdown(null);
        handleCloseMobileMenu();
        setSearchOpen(false);
        setQuery("");
        setAccountOpen(true);
    };

    return (
        <header
            className={`fixed top-0 z-50 w-full border-b border-gray-100 bg-white/95 shadow-sm md:backdrop-blur-md transition-[height] duration-200 ease-out ${isCompact ? "h-12 md:h-15" : "h-15 md:h-28"}`}
        >
            <div className="relative mx-auto grid h-full w-full min-w-0 max-w-[1440px] grid-cols-[2.25rem_minmax(0,1fr)_auto] items-center px-2 md:flex md:justify-between md:px-10">
                <button
                    type="button"
                    onClick={handleToggleMobileMenu}
                    className={`relative col-start-1 row-start-1 flex h-9 w-9 items-center justify-center rounded-full p-0 transition-colors hover:bg-gray-100 md:absolute md:left-2 md:top-1/2 md:-translate-y-1/2 md:hidden ${searchOpen ? "pointer-events-none opacity-0" : "opacity-100"}`}
                    aria-expanded={isMobileMenuOpen}
                    aria-label={t(isMobileMenuOpen ? "closeMenu" : "openMenu")}
                >
                    <Menu className="h-5 w-5" />
                </button>

                <nav
                    className={`hidden items-center gap-4 transition-opacity duration-500 ease-out md:flex lg:gap-8 ${searchOpen ? "pointer-events-none opacity-0" : "opacity-100"}`}
                    aria-label={t("navigation")}
                >
                    {navigation.map((item) => {
                        const hasDropdown = item.children.length > 0;
                        const isOpen = openDropdown === item.id;

                        return (
                            <div
                                key={item.id}
                                className="relative flex items-center gap-1 py-2"
                                onMouseEnter={() =>
                                    hasDropdown && setOpenDropdown(item.id)
                                }
                                onMouseLeave={() =>
                                    hasDropdown && setOpenDropdown(null)
                                }
                                onFocus={() =>
                                    hasDropdown && setOpenDropdown(item.id)
                                }
                            >
                                <Link
                                    href={item.href ?? "/"}
                                    className="group relative text-sm font-semibold text-gray-800 transition-colors hover:text-(--brand-green)"
                                >
                                    {item.label}
                                    <span className="absolute -bottom-1 left-0 h-0.5 w-full origin-left scale-x-0 bg-(--brand-green) transition-transform duration-300 group-hover:scale-x-100" />
                                </Link>
                                {hasDropdown && (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setOpenDropdown(
                                                isOpen ? null : item.id,
                                            )
                                        }
                                        aria-expanded={isOpen}
                                        aria-label={t("toggleSubmenu", {
                                            label: item.label,
                                        })}
                                        className="rounded p-1 text-gray-500 transition-colors hover:text-(--brand-green)"
                                    >
                                        <ChevronDown
                                            className={`h-3.5 w-3.5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                                        />
                                    </button>
                                )}
                                {hasDropdown && (
                                    <div
                                        className={`absolute left-0 top-full min-w-60 w-max border border-gray-100 bg-white py-2 shadow-xl transition-[opacity,transform] duration-150 ${isOpen ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0"}`}
                                    >
                                        {item.children.map((subItem) => (
                                            <div
                                                className=" px-4 py-1"
                                                key={subItem.id}
                                            >
                                                <Link
                                                    href={
                                                        subItem.href ??
                                                        item.href ??
                                                        "/"
                                                    }
                                                    onClick={() =>
                                                        setOpenDropdown(null)
                                                    }
                                                    className="group relative inline-block font-semibold text-sm text-gray-600 transition-colors "
                                                >
                                                    {subItem.label}
                                                    <span className="absolute -bottom-1 left-0 h-0.5 w-full origin-left scale-x-0 bg-(--brand-green) transition-transform duration-300 group-hover:scale-x-100" />
                                                </Link>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </nav>

                <Link
                    href="/"
                    className={`relative col-start-2 row-start-1 h-12 w-39 justify-self-center transition-[height,width,opacity] duration-500 ease-out md:absolute md:left-1/2 md:-translate-x-1/2 ${isCompact ? "md:hidden" : "md:h-16 md:w-80"} ${searchOpen ? "pointer-events-none opacity-0" : "opacity-100"}`}
                    aria-label={t("logoAlt")}
                >
                    <Image
                        src={logo}
                        alt={t("logoAlt")}
                        fill
                        priority
                        className="object-contain"
                    />
                </Link>

                <div
                    className={`col-start-3 row-start-1 ml-0 flex items-center gap-1 justify-self-end text-gray-800 transition-opacity duration-500 ease-out md:ml-auto md:gap-2 ${searchOpen ? "pointer-events-none opacity-0" : "opacity-100"}`}
                >
                    <button
                        type="button"
                        onClick={openSearch}
                        className="flex h-9 w-9 items-center justify-center rounded-full p-0 transition-colors hover:bg-gray-100"
                        aria-label={t("search")}
                        aria-expanded={searchOpen}
                    >
                        <Search className="h-5 w-5" />
                    </button>
                    <button
                        type="button"
                        ref={accountButtonRef}
                        onClick={openAccount}
                        className="flex h-9 w-9 items-center justify-center rounded-full p-0 transition-colors hover:bg-gray-100"
                        aria-label={t("account.open")}
                        aria-expanded={accountOpen}
                    >
                        <UserRound className="h-5 w-5" />
                    </button>
                    <div className="group relative flex h-9 w-9 items-center justify-center">
                        <Link
                            href="/cart"
                            className="relative flex h-9 w-9 items-center justify-center rounded-full p-0 transition-colors hover:bg-gray-100"
                            aria-label={t("cart")}
                        >
                            <ShoppingCart className="h-5 w-5" />
                            {hydrated && count > 0 && (
                                <span
                                    className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[10px] font-semibold text-white"
                                    aria-live="polite"
                                >
                                    {count}
                                </span>
                            )}
                        </Link>
                        <CartPreview />
                    </div>
                </div>

                <AccountDialog
                    open={accountOpen}
                    onClose={closeAccount}
                    triggerRef={accountButtonRef}
                />

                <div
                    ref={overlayRef}
                    onClick={handleCloseMobileMenu}
                    className={`fixed inset-0 z-[55] bg-black/40 transition-opacity duration-300 md:hidden ${isMobileMenuOpen ? "pointer-events-auto visible opacity-100" : "pointer-events-none invisible opacity-0"}`}
                />
                <div
                    ref={panelRef}
                    className={`fixed inset-0 z-[60] overflow-y-auto bg-white transition-[opacity,transform,visibility] duration-300 ease-out md:hidden ${isMobileMenuOpen ? "pointer-events-auto visible translate-x-0 opacity-100" : "pointer-events-none invisible translate-x-full opacity-0"}`}
                >
                    <div className="flex h-14 items-center justify-end border-b border-gray-100 px-5">
                        <button
                            type="button"
                            onClick={handleCloseMobileMenu}
                            className="p-2 text-black"
                            aria-label={t("closeMenu")}
                        >
                            <X className="h-6 w-6" />
                        </button>
                    </div>
                    <nav className="flex flex-col" aria-label={t("navigation")}>
                        {navigation.map((item) => {
                            const hasSubmenu = item.children.length > 0;
                            const label = item.label;

                            return (
                                <div
                                    key={item.id}
                                    className="mobile-nav-item border-b border-gray-100 last:border-b-0"
                                >
                                    <div className="flex min-h-[65px] items-center justify-between px-6">
                                        <Link
                                            href={item.href ?? "/"}
                                            onClick={handleCloseMobileMenu}
                                            className="flex-1 text-base font-semibold text-black"
                                        >
                                            {label}
                                        </Link>
                                        {hasSubmenu && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    toggleSubmenu(item.id)
                                                }
                                                aria-expanded={
                                                    openKey === item.id
                                                }
                                                aria-label={t("toggleSubmenu", {
                                                    label,
                                                })}
                                                className="-m-2 p-2 text-gray-500"
                                            >
                                                <ChevronDown
                                                    ref={setChevronRef(item.id)}
                                                    className="h-4 w-4"
                                                />
                                            </button>
                                        )}
                                    </div>
                                    {hasSubmenu && (
                                        <div
                                            ref={setContentRef(item.id)}
                                            style={{ height: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="flex flex-col gap-1 pb-3 pl-2">
                                                {item.children.map(
                                                    (subItem) => (
                                                        <Link
                                                            key={subItem.id}
                                                            href={
                                                                subItem.href ??
                                                                item.href ??
                                                                "/"
                                                            }
                                                            onClick={
                                                                handleCloseMobileMenu
                                                            }
                                                            className="flex min-h-[66px] items-center pl-16 text-[15px] font-medium uppercase text-black hover:text-(--brand-green)"
                                                        >
                                                            {subItem.label}
                                                        </Link>
                                                    ),
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </nav>
                    <button
                        type="button"
                        onClick={() => {
                            handleCloseMobileMenu();
                            setAccountOpen(true);
                        }}
                        className="mobile-nav-item flex min-h-[70px] w-full items-center gap-3 border-b border-gray-100 px-6 text-left text-[15px] font-medium text-(--brand-green)"
                    >
                        <UserRound className="h-5 w-5" />
                        <span>{t("account.mobileLabel")}</span>
                    </button>
                </div>
            </div>

            {searchMounted && (
                <div
                    className={`absolute inset-0 z-20 flex items-center bg-white transition-opacity duration-500 ease-out ${searchOpen ? "opacity-100" : "pointer-events-none opacity-0"}`}
                >
                    <form
                        onSubmit={submitSearch}
                        className={`absolute max-md:right-1/2 right-36 flex h-10 origin-right items-center overflow-hidden border border-gray-400 bg-white px-4 opacity-0 transition-[right,width,transform,opacity] duration-500 ease-out md:h-12 md:px-5 ${searchOpen ? "w-[200px] translate-x-1/2 scale-x-100 opacity-100 md:right-1/2 md:w-[560px]" : "pointer-events-none w-10 translate-x-0 scale-x-0 md:right-24"}`}
                    >
                        <label htmlFor="header-search" className="sr-only">
                            {t("search")}
                        </label>
                        <Search className="h-6 w-6 shrink-0 text-gray-700" />
                        <input
                            id="header-search"
                            autoFocus
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                            placeholder={t("searchPlaceholder")}
                            className="min-w-0 flex-1 px-4 text-base outline-none md:text-lg"
                        />
                        <button
                            type="button"
                            onClick={() => setQuery("")}
                            className="p-1 text-gray-500 transition-colors hover:text-gray-900"
                            aria-label={t("clearSearch")}
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </form>
                    <button
                        type="button"
                        onClick={closeSearch}
                        className="absolute right-4 p-2 text-gray-800 transition-colors hover:text-(--brand-green) md:right-10"
                        aria-label={t("closeSearch")}
                    >
                        <X className="h-7 w-7" />
                    </button>
                </div>
            )}
        </header>
    );
}
