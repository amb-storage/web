import { getTranslations } from "next-intl/server";
import AboutUsTabs from "@/components/ContentPages/AboutUsTabs";

export default async function AboutUsHeader() {
  const tAbout = await getTranslations("contentPages.about");
  const tFooter = await getTranslations("homepage.footer");
  return (
    <>
      <header className="flex min-h-[200px] items-center justify-center bg-[#eef5f0] px-4 py-12 md:min-h-[200px]">
        <h1
          className="text-center font-stencil text-5xl font-bold uppercase leading-none tracking-[0.03em] text-(--brand-green) sm:text-6xl md:text-7xl"
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
