import type { MetadataRoute } from "next";
import { SITE_URL, absoluteUrl } from "@/lib/seo/site";

// Không chặn /api: ảnh sản phẩm phục vụ qua /api/v1/media nên bot cần đọc được
export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: ["/cart", "/checkout", "/account", "/en/cart", "/en/checkout", "/en/account"],
        },
        sitemap: absoluteUrl("/sitemap.xml"),
        host: SITE_URL,
    };
}
