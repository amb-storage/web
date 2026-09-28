import HeroSection from "./_components/Hero/Hero";
import HotSection from "./_components/HotSection/HotSection";
import MostPopularSection from "./_components/MostPopular/MostPopular";
import NewArrivalsSection from "./_components/NewArrivals/NewArrivals";
import CustomerVoiceSection from "./_components/CustomerVoice/CustomerVoice";
import BlogSection from "./_components/Blog/Blog";
import {
  specialVintageProducts,
  mostPopularProducts,
  newArrivalProducts,
  customerVoices,
} from "./_components/fake";

export default async function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <HeroSection />
      <HotSection products={specialVintageProducts} />
      <MostPopularSection products={mostPopularProducts} />
      <NewArrivalsSection products={newArrivalProducts} />
      <BlogSection />
      <CustomerVoiceSection testimonials={customerVoices} />

    </div>
  );
}
