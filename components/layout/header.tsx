"use client";

import { useTranslations } from "next-intl";
import logo from "@/assets/logo.png";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import gsap from "gsap";
import { ShoppingCart, User, Search, ChevronDown } from "lucide-react";

const navigationConfig = [
  { key: "home", href: '/' },
  { key: "shopnow", href: '/shop-now' },
  { key: "blog", href: '/blog' }
];

export default function Header() {
  const t = useTranslations();

  // Hiệu ứng GSAP Hover ĐỈnh Cao
  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    const indicator = e.currentTarget.querySelector(".menu-indicator");
    const dropdown = e.currentTarget.querySelector(".dropdown-menu");
    const items = e.currentTarget.querySelectorAll(".dropdown-item");
    const chevron = e.currentTarget.querySelector(".chevron-icon");

    // 1. Chạy gạch chân underline
    if (indicator) {
      gsap.to(indicator, { scaleX: 1, duration: 0.4, ease: "power3.out" });
    }

    // 2. Xoay icon mũi tên xuống
    if (chevron) {
      gsap.to(chevron, { rotate: 180, duration: 0.3, ease: "power2.out" });
    }

    // 3. Dropdown hiện lên với hiệu ứng mượt (Scale từ nhỏ + Fade in)
    if (dropdown) {
      gsap.killTweensOf(dropdown); // Xóa các animation cũ đang chạy dở để tránh giật
      gsap.set(dropdown, { display: "block" });
      
      const tl = gsap.timeline();
      tl.fromTo(
        dropdown,
        { opacity: 0, y: 15, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: "power3.out" }
      );

      // Hiệu ứng Stagger: Các mục con trượt ra lần lượt từng cái cực kỳ sang trọng
      if (items.length > 0) {
        tl.fromTo(
          items,
          { opacity: 0, x: -10 },
          { opacity: 1, x: 0, duration: 0.25, stagger: 0.05, ease: "power2.out" },
          "-=0.2" // Chạy lướt sóng cùng lúc với dropdown mở ra
        );
      }
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const indicator = e.currentTarget.querySelector(".menu-indicator");
    const dropdown = e.currentTarget.querySelector(".dropdown-menu");
    const chevron = e.currentTarget.querySelector(".chevron-icon");

    if (indicator) {
      gsap.to(indicator, { scaleX: 0, duration: 0.3, ease: "power3.in" });
    }

    if (chevron) {
      gsap.to(chevron, { rotate: 0, duration: 0.3, ease: "power2.out" });
    }

    if (dropdown) {
      gsap.killTweensOf(dropdown);
      gsap.to(dropdown, {
        opacity: 0,
        y: 10,
        scale: 0.95,
        duration: 0.2,
        ease: "power2.in",
        onComplete: () => {
          gsap.set(dropdown, { display: "none" });
        }
      });
    }
  };

  return (
    <header className="bg-white/90 backdrop-blur-md shadow-sm hover:shadow-md transition-shadow duration-300 h-20 flex items-center justify-between px-8 fixed top-0 w-full z-50">
      {/* Logo và Menu chính */}
      <div className="flex items-center gap-12">
        <div className="text-xl font-bold text-gray-800 cursor-pointer">
          <Image src={logo} alt={t("homepage.header.logoAlt")} width={100} height={100} priority />
        </div>
        
        <nav className="flex items-center space-x-8">
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

      {/* Menu bên phải: Search, User, Cart */}
      <div className="flex items-center gap-3 text-gray-700">
        <button className="p-2.5 hover:bg-gray-100 rounded-full transition-colors duration-200" aria-label={t("homepage.header.search")}>
          <Search className="w-5 h-5 cursor-pointer hover:text-black transition-colors" />
        </button>
        <button className="p-2.5 hover:bg-gray-100 rounded-full transition-colors duration-200" aria-label={t("homepage.header.account")}>
          <User className="w-5 h-5 cursor-pointer hover:text-black transition-colors" />
        </button>
        <button className="p-2.5 hover:bg-gray-100 rounded-full transition-colors duration-200 relative" aria-label={t("homepage.header.cart")}>
          <ShoppingCart className="w-5 h-5 cursor-pointer hover:text-black transition-colors" />
          <span className="absolute top-1 right-1 bg-black text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-semibold">
            0
          </span>
        </button>
      </div>
    </header>
  );
}