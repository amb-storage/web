

import { Geist, Geist_Mono } from "next/font/google";
import { getLocale } from "next-intl/server";
import "./globals.css";
import { NextIntlClientProvider } from "next-intl";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/Footer/Footer";
import SplashScreen from "@/components/SplashScreen/SplashScreen";

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
           <SplashScreen />
           <Header />
        {children}
          <Footer />
          </NextIntlClientProvider>
        </body>
    </html>
  );
}
