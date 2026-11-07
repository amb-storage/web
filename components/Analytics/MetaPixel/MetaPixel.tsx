"use client";

import Script from "next/script";
import { META_PIXEL_ENABLED, META_PIXEL_ID } from "@/lib/metaPixel";
import { useMetaPixelPageviews } from "./useMetaPixelPageviews";

// Đoạn script nền chính chủ của Meta (tạo fbq + tải fbevents.js), init Pixel và gửi PageView đầu tiên
const BASE_CODE = `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${META_PIXEL_ID}');
fbq('track', 'PageView');`;

export default function MetaPixel() {
    useMetaPixelPageviews();
    if (!META_PIXEL_ENABLED) return null;
    return (
        <>
            <Script id="meta-pixel" strategy="afterInteractive">
                {BASE_CODE}
            </Script>
            <noscript>
                {/* eslint-disable-next-line @next/next/no-img-element -- pixel 1x1 của Meta cho trình duyệt tắt JS */}
                <img
                    height="1"
                    width="1"
                    style={{ display: "none" }}
                    alt=""
                    src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
                />
            </noscript>
        </>
    );
}
