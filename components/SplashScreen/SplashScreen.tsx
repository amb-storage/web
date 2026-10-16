"use client";

import Image from "next/image";
import logo from "@/assets/logo.png";
import { useSplashScreenAnimation } from "./useSplashScreenAnimation";

// Nội dung splash, render 2 lần (mỗi nửa màn hình 1 bản) để khi tách đôi trông như cả khối bị mở ra
function SplashContent() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <Image
        src={logo}
        alt=""
        priority
        // Trạng thái ban đầu để inline transform (không dùng class translate/scale của Tailwind v4,
        // vì chúng là property riêng nên GSAP tween transform sẽ không ghi đè được)
        style={{ transform: "translateY(12px) scale(0.95)" }}
        className="splash-logo h-auto w-56 opacity-0 md:w-80"
      />
    </div>
  );
}

export default function SplashScreen() {
  const { isVisible, panelRef, leftRef, rightRef } = useSplashScreenAnimation();

  if (!isVisible) return null;

  return (
    <div ref={panelRef} className="fixed inset-0 z-100" role="status" aria-label="Amb:STORAGE">
      <div ref={leftRef} className="absolute inset-y-0 left-0 w-1/2 overflow-hidden bg-white">
        <div className="absolute inset-y-0 left-0 w-[200%]">
          <SplashContent />
        </div>
      </div>
      <div ref={rightRef} aria-hidden className="absolute inset-y-0 right-0 w-1/2 overflow-hidden bg-white">
        <div className="absolute inset-y-0 right-0 w-[200%]">
          <SplashContent />
        </div>
      </div>
    </div>
  );
}
