import { getTranslations } from "next-intl/server";
import AboutUsTabs from "@/components/ContentPages/AboutUsTabs";

export default async function AboutUsHeader() {
  const tAbout = await getTranslations("contentPages.about");
  const tFooter = await getTranslations("homepage.footer");
  return (
    <>
      <header className="flex min-h-[200px] items-center justify-center bg-[#eef5f0] px-4 py-12 md:min-h-[200px]">
        <h1
          className="text-center text-5xl font-black uppercase tracking-[0.02em] text-(--brand-green) sm:text-6xl md:text-7xl"
          style={{ fontFamily: 'Impact, Haettenschweiler, "Arial Narrow Bold", sans-serif' }}
        >
          {tAbout("title")}
        </h1>
      </header>

      <AboutUsTabs
        labels={{
          aboutUs: tFooter("nav.commercialTransactions"),
          privacyPolicy: tFooter("nav.privacyPolicy"),
        }}
      />
    </>
  );
}
