"use client";

import Image, { StaticImageData } from "next/image";
import logo from "@/assets/logo.png";
import { permanentMarker } from "./font";
import { useFeaturedPostImageAnimation } from "./useFeaturedPostImageAnimation";

interface FeaturedPostImageProps {
  image: string | StaticImageData;
  title: string;
  subtitle: string;
}

export default function FeaturedPostImage({
  image,
  title,
  subtitle,
}: FeaturedPostImageProps) {
  const { imgRef, handleMouseEnter, handleMouseLeave } =
    useFeaturedPostImageAnimation();

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative aspect-[4/5] w-full overflow-hidden md:aspect-[3/4]"
    >
      <Image
        ref={imgRef}
        src={image}
        alt={title}
        fill
        className="object-cover object-center grayscale-[35%] transition-transform"
      />

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-8 text-center">
        <p
          className={`${permanentMarker.className} text-2xl text-[#1B3B2B] drop-shadow-[0_2px_6px_rgba(255,255,255,0.85)] md:text-3xl`}
        >
          {title}
        </p>
        <p
          className={`${permanentMarker.className} text-lg leading-snug text-[#1B3B2B] drop-shadow-[0_2px_6px_rgba(255,255,255,0.85)] md:text-xl`}
        >
          {subtitle}
        </p>
      </div>

      <div className="absolute bottom-4 left-4 flex items-center rounded-lg bg-white px-3 py-2 shadow-md">
        <Image src={logo} alt="Amb:STORAGE" className="h-7 w-auto" />
      </div>
    </div>
  );
}
