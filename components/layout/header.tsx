"use client";

import { useTranslations } from "next-intl";
import logo from "@/assets/logo.png";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { ShoppingCart, User, Search, ChevronDown, Menu, X } from "lucide-react";
import {
  useDesktopDropdown,
  useMobileMenu,
  useMobileSubmenu,
} from "./useHeaderAnimation";

const navigationConfig = [
  { key: "home", href: '/' },
  { key: "shopnow", href: '/shop-now' },
  { key: "blog", href: '/blog' }
];

export default function Header() {
  const t = useTranslations();
  const { handleMouseEnter, handleMouseLeave } = useDesktopDropdown();
  const { isOpen: isMobileMenuOpen, overlayRef, panelRef, close: closeMobileMenu, toggle: toggleMobileMenu } =
    useMobileMenu();
  const { openKey, setContentRef, setChevronRef, toggleSubmenu, resetSubmenus } = useMobileSubmenu();

  const handleCloseMobileMenu = () => {
    resetSubmenus();
    closeMobileMenu();
  };

  return (
    <header className="bg-white/90 backdrop-blur-md shadow-sm hover:shadow-md transition-shadow duration-300 h-20 flex items-center justify-between px-4 md:px-8 fixed top-0 w-full z-50">
      {/* Logo và Menu chính */}
      <div className="flex items-center gap-12">
        <Link href="/" className="relative h-10 w-24 md:h-12 md:w-28 shrink-0 cursor-pointer">
          <Image
            src={logo}
            alt={t("homepage.header.logoAlt")}
            fill
            className="object-contain"
            priority
          />
        </Link>

        <nav className="hidden md:flex items-center space-x-8">
          {navigationConfig.map((nav) => {
            const subKeys =
              nav.key === "home" ? ["about-us"] :
              nav.key === "shopnow" ? ["vintage", "modern"] :
              nav.key === "blog" ? ["interior-design", "furniture-care"] : [];

            return (
              <div
                key={nav.key}
                className="relative py-4 cursor-pointer group"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <div className="flex items-center gap-1.5">
                  <Link
                    href={nav.href}
                    className="text-gray-700 hover:text-black font-medium transition-colors duration-200"
                  >
                    {t(`homepage.header.${nav.key}.label`)}
                  </Link>
                  {subKeys.length > 0 && (
                    <ChevronDown className="chevron-icon w-4 h-4 text-gray-500 transition-transform duration-300" />
                  )}
                </div>

                {/* Thanh gạch chân chạy mượt bằng GSAP */}
                <div className="menu-indicator absolute bottom-2 left-0 w-full h-[2px] bg-black scale-x-0 origin-left" />

                {/* Submenu Dropdown */}
                {subKeys.length > 0 && (
                  <div className="dropdown-menu absolute top-full left-0 hidden bg-white shadow-xl rounded-xl py-3 min-w-[200px] border border-gray-100/80 overflow-hidden backdrop-blur-lg">
                    {subKeys.map((subKey) => (
                      <Link
                        key={subKey}
                        href={`${nav.href === "/" ? "" : nav.href}/${subKey}`}
                        className="dropdown-item block px-5 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-black hover:pl-6 transition-all duration-200"
                      >
                        {t(`homepage.header.${nav.key}.items.${subKey}`)}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      {/* Menu bên phải: Search, User, Cart, Hamburger (mobile) */}
      <div className="flex items-center gap-1.5 md:gap-3 text-gray-700">
        <button className="hidden md:inline-flex p-2.5 hover:bg-gray-100 rounded-full transition-colors duration-200" aria-label={t("homepage.header.search")}>
          <Search className="w-5 h-5 cursor-pointer hover:text-black transition-colors" />
        </button>
        <button className="hidden md:inline-flex p-2.5 hover:bg-gray-100 rounded-full transition-colors duration-200" aria-label={t("homepage.header.account")}>
          <User className="w-5 h-5 cursor-pointer hover:text-black transition-colors" />
        </button>
        <button className="p-2.5 hover:bg-gray-100 rounded-full transition-colors duration-200 relative" aria-label={t("homepage.header.cart")}>
          <ShoppingCart className="w-5 h-5 cursor-pointer hover:text-black transition-colors" />
          <span className="absolute top-1 right-1 bg-black text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-semibold">
            0
          </span>
        </button>

        <button
          type="button"
          onClick={toggleMobileMenu}
          aria-expanded={isMobileMenuOpen}
          aria-label={t(isMobileMenuOpen ? "homepage.header.closeMenu" : "homepage.header.openMenu")}
          className="md:hidden p-2.5 hover:bg-gray-100 rounded-full transition-colors duration-200"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Overlay nền tối phía sau menu mobile */}
      <div
        ref={overlayRef}
        onClick={handleCloseMobileMenu}
        className="hidden md:hidden fixed inset-x-0 top-20 bottom-0 z-40 bg-black/40"
      />

      {/* Panel menu mobile: trượt xuống dưới header, submenu dạng accordion */}
      <div
        ref={panelRef}
        className="hidden md:hidden fixed top-20 left-0 right-0 z-40 max-h-[calc(100svh-5rem)] overflow-y-auto border-t border-gray-100 bg-white shadow-xl"
      >
        <nav className="flex flex-col px-4">
          {navigationConfig.map((nav) => {
            const subKeys =
              nav.key === "home" ? ["about-us"] :
              nav.key === "shopnow" ? ["vintage", "modern"] :
              nav.key === "blog" ? ["interior-design", "furniture-care"] : [];
            const label = t(`homepage.header.${nav.key}.label`);

            return (
              <div key={nav.key} className="mobile-nav-item border-b border-gray-100 last:border-b-0">
                <div className="flex items-center justify-between">
                  <Link
                    href={nav.href}
                    onClick={handleCloseMobileMenu}
                    className="flex-1 py-4 text-gray-800 font-medium"
                  >
                    {label}
                  </Link>
                  {subKeys.length > 0 && (
                    <button
                      type="button"
                      onClick={() => toggleSubmenu(nav.key)}
                      aria-expanded={openKey === nav.key}
                      aria-label={t("homepage.header.toggleSubmenu", { label })}
                      className="-m-2 p-2 text-gray-500"
                    >
                      <ChevronDown ref={setChevronRef(nav.key)} className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {subKeys.length > 0 && (
                  <div ref={setContentRef(nav.key)} style={{ height: 0 }} className="overflow-hidden">
                    <div className="flex flex-col gap-1 pb-3 pl-2">
                      {subKeys.map((subKey) => (
                        <Link
                          key={subKey}
                          href={`${nav.href === "/" ? "" : nav.href}/${subKey}`}
                          onClick={handleCloseMobileMenu}
                          className="py-2 text-sm text-gray-600 hover:text-black"
                        >
                          {t(`homepage.header.${nav.key}.items.${subKey}`)}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="mobile-nav-item flex items-center gap-2 px-4 py-4">
          <button className="p-2.5 hover:bg-gray-100 rounded-full transition-colors duration-200" aria-label={t("homepage.header.search")}>
            <Search className="w-5 h-5" />
          </button>
          <button className="p-2.5 hover:bg-gray-100 rounded-full transition-colors duration-200" aria-label={t("homepage.header.account")}>
            <User className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
