

import { Geist, Geist_Mono } from "next/font/google";
import { getLocale } from "next-intl/server";
import "./globals.css";
import { NextIntlClientProvider } from "next-intl";
import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer/Footer";
import SplashScreen from "@/components/SplashScreen/SplashScreen";
import SmoothScroll from "@/components/SmoothScroll/SmoothScroll";
import { CartProvider } from "@/components/Cart/CartProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default async function RootLayout({ children }: LayoutProps<"/[locale]">) {
  // Lấy locale hiện tại (từ i18n/request.ts) để set lang cho <html>
  const locale = await getLocale();

  return (
    <html
      lang={locale}
      // Extension trình duyệt (vd. Trancy) chèn attribute vào <html> gây hydration mismatch
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
     
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider locale={locale}>
          <CartProvider>
            <SmoothScroll>
            <SplashScreen />
            <Header/>
          <main className="mt-15 w-full min-w-0 max-w-full overflow-x-clip md:mt-28">
              {children}
          </main>
            <Footer />
            </SmoothScroll>
          </CartProvider>
        </NextIntlClientProvider>
        </body>
    </html>
  );
}
