import { Geist_Mono } from "next/font/google";
import { getLocale } from "next-intl/server";
import "./globals.css";
import { NextIntlClientProvider } from "next-intl";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/Footer/Footer";
import SplashScreen from "@/components/SplashScreen/SplashScreen";
import SmoothScroll from "@/components/SmoothScroll/SmoothScroll";
import { CartProvider } from "@/components/Cart/CartProvider";
import { leagueSpartan, poppins, stencilGothic } from "@/lib/fonts";
import { storefrontRepository } from "@/lib/storefront/api-storefront";
import {
    fallbackHeaderNavigation,
    toHeaderNavigation,
    type HeaderNavigationItem,
    type Locale,
} from "@/lib/storefront";

// Header / footer không được làm sập cả site khi API lỗi → log và dùng dữ liệu dự phòng
function withFallback<T>(promise: Promise<T>, fallback: T, label: string) {
    return promise.catch((error: unknown) => {
        console.error(`[layout] ${label} failed`, error);
        return fallback;
    });
}

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export default async function RootLayout({
    children,
}: LayoutProps<"/[locale]">) {
    // Lấy locale hiện tại (từ i18n/request.ts) để set lang cho <html>
    const locale = (await getLocale()) as Locale;
    const [headerNavigation, footerNavigation, settings] = await Promise.all([
        // Khách muốn menu header luôn hiện tiếng Anh ở cả ja và en
        withFallback<readonly HeaderNavigationItem[]>(
            storefrontRepository.getHeaderNavigation("en").then(toHeaderNavigation),
            fallbackHeaderNavigation,
            "header navigation",
        ),
        withFallback(storefrontRepository.getFooterNavigation(locale), [], "footer navigation"),
        withFallback(storefrontRepository.getStoreSettings(locale), null, "settings"),
    ]);

    return (
        <html
            lang={locale}
            // Extension trình duyệt (vd. Trancy) chèn attribute vào <html> gây hydration mismatch
            suppressHydrationWarning
            className={`${poppins.variable} ${leagueSpartan.variable} ${stencilGothic.variable} ${geistMono.variable} h-full antialiased`}
        >
            <body className="min-h-screen flex flex-col">
                <NextIntlClientProvider locale={locale}>
                    <CartProvider>
                        <SmoothScroll>
                            <SplashScreen />
                            <Header navigation={headerNavigation} />
                            <main className=" flex-1 mt-15 w-full min-w-0 max-w-full overflow-x-clip md:mt-28">
                                {children}
                            </main>
                            <Footer settings={settings} navigation={footerNavigation} />
                        </SmoothScroll>
                    </CartProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
