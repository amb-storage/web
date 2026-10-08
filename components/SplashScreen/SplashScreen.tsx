"use client";

import Image from "next/image";
import logo from "@/assets/logo.png";
import { useSplashScreenAnimation } from "./useSplashScreenAnimation";

export default function SplashScreen() {
  const { isVisible, panelRef, contentRef, barFillRef } =
    useSplashScreenAnimation();

  if (!isVisible) return null;

  return (
    <div
      ref={panelRef}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-white"
    >
      <div
        ref={contentRef}
        className="flex scale-90 flex-col items-center opacity-0"
      >
        <Image
          src={logo}
          alt="Amb:STORAGE"
          priority
          className="h-auto w-48 md:w-64"
        />
        <div className="mt-6 h-[3px] w-40 overflow-hidden rounded-full bg-gray-200">
          <div
            ref={barFillRef}
            className="h-full w-full origin-left scale-x-0 bg-(--brand-green)"
          />
        </div>
      </div>
    </div>
  );
}
