import HeroSection from "./_components/Hero/Hero";
import HotSection from "./_components/HotSection";
import { specialVintageProducts } from "./_components/fake";

export default async function Home({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;


  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <HeroSection />
      <HotSection products={specialVintageProducts} />
    </div>
  );
}
